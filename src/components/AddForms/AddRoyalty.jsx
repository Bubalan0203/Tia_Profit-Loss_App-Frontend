import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';  // Import XLSX for reading Excel files
import styled from 'styled-components';
import { URL } from '../../assests/mocData/config';
import { useSnackbar } from 'notistack';

const FinancialUploader = () => {
  const { enqueueSnackbar } = useSnackbar(); // Snackbar hook
  const [file, setFile] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [tableData, setTableData] = useState([]);
  const [duplicateRecords, setDuplicateRecords] = useState([]);
  const [replacementInProgress, setReplacementInProgress] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const ab = e.target.result;
        const workbook = XLSX.read(ab, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const filteredData = data.map((row) => ({
          FranchiseID: row.FranchiseID,
          RoyaltyAmount: row.RoyaltyAmount,
          AmountPaid: row.AmountPaid,
          AmountPending: row.AmountPending,
        }));

        setTableData(filteredData);
        enqueueSnackbar('File uploaded and parsed successfully!', { variant: 'success' });
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !month || !year) {
      enqueueSnackbar('Please fill all fields and select a file.', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('month', month);
    formData.append('year', year);

    try {
      const response = await axios.post(`${URL}/vip1/upload-financial-data`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      setDuplicateRecords([]);
    } catch (error) {
      if (error.response?.status === 409) {
        const duplicateRecords = error.response.data.duplicateRecords;
        setDuplicateRecords(duplicateRecords);
        enqueueSnackbar('Duplicate records found!', { variant: 'error' });
      } else {
        enqueueSnackbar(error.response?.data?.error || 'Error occurred while uploading.', {
          variant: 'error',
        });
      }
    }
  };

  const handleReplaceDuplicates = async () => {
    if (replacementInProgress) return;

    setReplacementInProgress(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('month', month);
    formData.append('year', year);

    try {
      const response = await axios.post(`${URL}/vip1/upload-financial-data?overwrite=true`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      setDuplicateRecords([]);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error || 'Error occurred while replacing.', {
        variant: 'error',
      });
    } finally {
      setReplacementInProgress(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setMonth('');
    setYear('');
    setTableData([]);
    setDuplicateRecords([]);
    
  };

  return (
    <Container>
      <Heading>Upload Financial Data</Heading>

      <Form onSubmit={handleSubmit}>
        <Dropdown>
          <Label>Select Month:</Label>
          <Select value={month} onChange={(e) => setMonth(e.target.value)} required>
            <Option value="" disabled>Select Month</Option>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
              .map((m) => <Option key={m} value={m}>{m}</Option>)}
          </Select>
        </Dropdown>

        <Dropdown>
          <Label>Select Year:</Label>
          <Select value={year} onChange={(e) => setYear(e.target.value)} required>
            <Option value="" disabled>Select Year</Option>
            {Array.from({ length: 10 }, (_, index) => 2024 + index).map((yearOption) => (
              <Option key={yearOption} value={yearOption}>{yearOption}</Option>
            ))}
          </Select>
        </Dropdown>

        <Dropdown>
          <Label>Upload File:</Label>
          <InputFile type="file" accept=".xlsx, .xls" onChange={handleFileChange} required />
        </Dropdown>

        <ButtonContainer>
          <Button type="submit">Upload</Button>
          <Button type="button" onClick={resetForm}>Cancel</Button> {/* Reset Button */}
        </ButtonContainer>
      </Form>

      {tableData.length > 0 && (
        <TableContainer>
          <h3>Financial Data Preview</h3>
          <Table>
            <thead>
              <tr>
                <th>Franchise ID</th>
                <th>Royalty Amount</th>
                <th>Amount Paid</th>
                <th>Amount Pending</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.FranchiseID}</td>
                  <td>{row.RoyaltyAmount}</td>
                  <td>{row.AmountPaid}</td>
                  <td>{row.AmountPending}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {duplicateRecords.length > 0 && (
        <DuplicateContainer>
          <h3>Duplicate Records Found</h3>
          <p>Records already exist for the following Franchise IDs:</p>
          <ul>
            {duplicateRecords.map((rec, index) => (
              <li key={index}>Franchise ID: {rec.FranchiseID}</li>
            ))}
          </ul>
          <ReplaceButton
            onClick={handleReplaceDuplicates}
            disabled={replacementInProgress}
          >
            {replacementInProgress ? 'Replacing...' : 'Replace Existing Records'}
          </ReplaceButton>
        </DuplicateContainer>
      )}
    </Container>
  );
};

export default FinancialUploader;
// Styled Components
const Container = styled.div`
  max-width: 810px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #000;
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  margin-top: 5%;
`;

const Heading = styled.h1`
  font-size: 1.8em;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-size: 1.1em;
  color: #fff;
`;

const Dropdown = styled.div``;

const Select = styled.select`
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  background-color: #fff;
`;

const Option = styled.option``;

const Input = styled.input`
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const InputFile = styled.input`
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; 
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 9px;
  font-size: 1em;
  background-color: #f00d88;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #999;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  color: #d9534f;
  font-size: 1.1em;
  text-align: center;
`;

const TableContainer = styled.div`
  margin-top: 30px;
  padding: 15px;
  background-color: #000;;
  border-radius: 5px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
  th {
    background-color: #000;;
  }
`;

const DuplicateContainer = styled.div`
  margin-top: 30px;
  padding: 15px;
  background-color: #f9e0e0;
  border-radius: 5px;
`;

const ReplaceButton = styled.button`
  padding: 12px;
  font-size: 1.1em;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


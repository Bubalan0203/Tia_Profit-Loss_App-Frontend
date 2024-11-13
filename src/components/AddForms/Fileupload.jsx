import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';

const ExcelUploader = () => {
  const [fileData, setFileData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [fileName, setFileName] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Validate Excel columns
  const validateExcelData = (data) => {
    const requiredColumns = ["Collection", "Total Payment", "Payment Paid", "Payment Pending"];
    const missingColumns = requiredColumns.filter(col => !data[0].hasOwnProperty(col));
    return missingColumns.length === 0;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      console.error('No file selected.');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!validateExcelData(jsonData)) {
          setMessage('The Excel file is missing required columns.');
          return;
        }

        setFileData(jsonData);
        calculateTotals(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setMessage('Error reading Excel file. Please ensure it is properly formatted.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const calculateTotals = (data) => {
    const totalCollection = data.reduce((acc, row) => acc + (row["Collection"] || 0), 0);
    const totalPayment = data.reduce((acc, row) => acc + (row["Total Payment"] || 0), 0);
    const paymentPaid = data.reduce((acc, row) => acc + (row["Payment Paid"] || 0), 0);
    const paymentPending = data.reduce((acc, row) => acc + (row["Payment Pending"] || 0), 0);

    setTotals({
      totalCollection,
      totalPayment,
      paymentPaid,
      paymentPending,
    });
  };

  const handleSubmit = async () => {
    if (!month || !year || !fileName) {
      setMessage('Please complete all fields.');
      console.error('Form submission failed: Incomplete fields.');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const formData = new FormData();
      const fileInput = document.getElementById('file-upload');
      const file = fileInput.files[0];

      if (!file) {
        setMessage('No file selected.');
        setLoading(false);
        return;
      }

      formData.append('file', file);
      formData.append('month', month);
      formData.append('year', year);

      const response = await axios.post(`${URL}/uploadvip/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(response.data.message);
      if (response.data.data) setTotals(response.data.data.totals);
    } catch (error) {
      console.error('Error during file upload:', error);
      setMessage('Error uploading file: ' + (error.response?.data?.message || 'Something went wrong!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Upload an Excel File</Title>

      <SelectContainer>
        <Select onChange={(e) => setMonth(e.target.value)} value={month}>
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </Select>

        <Select onChange={(e) => setYear(e.target.value)} value={year}>
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </Select>
      </SelectContainer>

      <UploadArea>
        <FileInput
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          id="file-upload"
        />
        <FileLabel htmlFor="file-upload">
          {fileName ? `Selected File: ${fileName}` : 'Click to select an Excel file'}
        </FileLabel>
      </UploadArea>

      {fileData.length > 0 && (
        <PreviewTable>
          <thead>
            <tr>
              <th>Collection</th>
              <th>Total Payment</th>
              <th>Payment Paid</th>
              <th>Payment Pending</th>
            </tr>
          </thead>
          <tbody>
            {fileData.slice(0, 5).map((row, index) => (
              <tr key={index}>
                <td>{row["Collection"]}</td>
                <td>{row["Total Payment"]}</td>
                <td>{row["Payment Paid"]}</td>
                <td>{row["Payment Pending"]}</td>
              </tr>
            ))}
          </tbody>
        </PreviewTable>
      )}

      {totals && (
        <TotalsContainer>
          <h3>Calculated Totals:</h3>
          <p>Total Collection: {totals.totalCollection}</p>
          <p>Total Payment: {totals.totalPayment}</p>
          <p>Payment Paid: {totals.paymentPaid}</p>
          <p>Payment Pending: {totals.paymentPending}</p>
        </TotalsContainer>
      )}

      <div>
        {loading ? (
          <button disabled>Uploading...</button>
        ) : (
          <button onClick={handleSubmit}>Upload Data</button>
        )}
      </div>

      {message && <div>{message}</div>}
    </Container>
  );
};

export default ExcelUploader;

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: #333;
`;

const UploadArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const FileInput = styled.input`
  display: none;
`;
const PreviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 18px;
  text-align: left;

  th, td {
    padding: 12px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f4f4f4;
  }
`;
const FileLabel = styled.label`
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Result = styled.div`
  text-align: center;
  margin: 1rem 0;
  font-size: 1.25rem;
  color: #333;
`;

const TotalsContainer = styled.div`
  margin-top: 1rem;
  font-size: 1.2rem;
  text-align: left;
  color: #333;
`;



// ExcelUploader.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';
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

const ExcelUploader = () => {
  const [fileData, setFileData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [fileName, setFileName] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      setFileData(jsonData);
      calculateTotals(jsonData);
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

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSubmit = async () => {
    if (!month || !year || !fileName) {
      setMessage('Please complete all fields.');
      return;
    }
  
    setLoading(true);
    setMessage('');
  
    try {
      const formData = new FormData();
      formData.append('file', fileData);
      formData.append('month', month);
      formData.append('year', year);
  
      const response = await axios.post(`${URL}/uploadvip/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setMessage(response.data.message);
  
      if (response.data.data) {
        // Display totals if data is successfully saved
        setTotals(response.data.data.totals);
      }
    } catch (error) {
      setMessage('Error uploading file: ' + error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container>
      <Title>Upload an Excel File</Title>

      <SelectContainer>
        <Select onChange={handleMonthChange} value={month}>
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

        <Select onChange={handleYearChange} value={year}>
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

      {month && year && (
        <Result>
          <h3>Selected Month: {month}</h3>
          <h3>Selected Year: {year}</h3>
        </Result>
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

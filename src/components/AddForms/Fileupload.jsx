import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';
import * as XLSX from 'xlsx';  // Import XLSX for reading Excel files

const FinancialUploader = () => {
  const [file, setFile] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [tableData, setTableData] = useState([]); // Store data for the table

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Read the Excel file
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const ab = e.target.result;
        const workbook = XLSX.read(ab, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Filter out the required columns
        const filteredData = data.map((row) => ({
          FranchiseID: row.FranchiseID,
          RoyaltyAmount: row.RoyaltyAmount,
          AmountPaid: row.AmountPaid,
          AmountPending: row.AmountPending,
        }));
        
        setTableData(filteredData); // Set the data for the table
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !month || !year) {
      alert('Please fill all fields and select a file.');
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
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.error || 'Error occurred while uploading.');
    }
  };

  return (
    <div>
      <h2>Upload Financial Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Month:</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} required>
            <option value="" disabled>Select Month</option>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
              .map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2000"
            max="2099"
            required
          />
        </div>
        <div>
          <label>File:</label>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload</button>
      </form>

      {/* Display table only if there is data */}
      {tableData.length > 0 && (
        <div>
          <h3>Financial Data Preview</h3>
          <table>
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
          </table>
        </div>
      )}
    </div>
  );
};

export default FinancialUploader;

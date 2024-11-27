import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { URL } from "../../assests/mocData/config";
import { enqueueSnackbar } from "notistack";
import styled from "styled-components";

const UploadVIPFranchise = () => {
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [fileData, setFileData] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [totals, setTotals] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", 
    "June", "July", "August", "September", 
    "October", "November", "December"
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      enqueueSnackbar("No file selected. Please upload a valid Excel file.", { variant: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        enqueueSnackbar("The uploaded file is empty. Please upload a valid file.", { variant: "error" });
        return;
      }

      const filteredData = jsonData.map(row => ({
        collection: parseFloat(row["Collection"] || 0),
        revenue: parseFloat(row["Revenue"] || 0),
        totalPayment: parseFloat(row["Total Payment"] || 0),
        paymentPaid: parseFloat(row["Payment Paid"] || 0),
        paymentPending: parseFloat(row["Payment Pending"] || 0),
      }));

      const calculatedTotals = calculateTotals(filteredData);
      setTotals(calculatedTotals);
    };
    reader.readAsArrayBuffer(file);
  };

  const calculateTotals = (data) => {
    return data.reduce(
      (acc, row) => {
        acc.collection += row.collection;
        acc.revenue += row.revenue;
        acc.totalPayment += row.totalPayment;
        acc.paymentPaid += row.paymentPaid;
        acc.paymentPending += row.paymentPending;
        return acc;
      },
      { collection: 0, revenue: 0, totalPayment: 0, paymentPaid: 0, paymentPending: 0 }
    );
  };

  const checkIfRecordExists = async () => {
    if (!month || !year || !totals) {
      enqueueSnackbar("Please select a file, month, and year before submitting.", { variant: "warning" });
      return;
    }

    try {
      const response = await axios.get(`${URL}/vipfranchiseupload/checkRecord`, {
        params: { month, year },
      });

      if (response.data.exists) {
        setShowConfirm(true); // Show confirmation dialog
      } else {
        handleSubmit();
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "An error occurred while checking the record.", { variant: "error" });
    }
  };

  const handleSubmit = async (replace = false) => {
    try {
      const response = await axios.post(`${URL}/vipfranchiseupload/upload`, {
        month,
        year,
        totals,
        replace,
      });

      enqueueSnackbar(response.data.message, { variant: "success" });
      resetForm();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "An error occurred while submitting the data.", { variant: "error" });
    }
  };

  const handleReplaceRecord = () => {
    handleSubmit(true); // Replace the record
    setShowConfirm(false);
  };

  const resetForm = () => {
    setFileInputKey(Date.now()); // Reset the file input key to clear the file
    setFileData(null);
    setMonth("");
    setYear("");
    setTotals(null);
    setShowConfirm(false);
  };

  return (
    <Container>
      <Heading>Upload VIP Franchise Data</Heading>

      <Form>
        <FileInput>
          <Label>Upload Excel File:</Label>
          <InputFile
            key={fileInputKey} // Use unique key to reset file input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </FileInput>

        <Dropdown>
          <Label>Select Month:</Label>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            <Option value="">Select Month</Option>
            {months.map((month) => (
              <Option key={month} value={month}>
                {month}
              </Option>
            ))}
          </Select>
        </Dropdown>

        <Dropdown>
          <Label>Select Year:</Label>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            <Option value="">Select Year</Option>
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Dropdown>

        {totals && (
          <Totals>
            <h2>Calculated Totals:</h2>
            <p>Collection: {totals.collection.toFixed(2)}</p>
            <p>Revenue: {totals.revenue.toFixed(2)}</p>
            <p>Total Payment: {totals.totalPayment.toFixed(2)}</p>
            <p>Payment Paid: {totals.paymentPaid.toFixed(2)}</p>
            <p>Payment Pending: {totals.paymentPending.toFixed(2)}</p>
          </Totals>
        )}

        <ButtonContainer>
          <Button onClick={checkIfRecordExists}>Submit</Button>
          <ButtonCancelC onClick={resetForm}>Cancel</ButtonCancelC>
        </ButtonContainer>

        {showConfirm && (
          <Confirmation>
            <p>Record already exists. Do you want to replace it?</p>
            <ButtonConfirm onClick={handleReplaceRecord}>Yes</ButtonConfirm>
            <ButtonCancel onClick={() => setShowConfirm(false)}>No</ButtonCancel>
          </Confirmation>
        )}
      </Form>
    </Container>
  );
};

export default UploadVIPFranchise;

// Styled Components
const Container = styled.div`
  max-width: 810px;
  margin: 0 auto;
  padding: 20px;
  border:1px solid #000
  border-radius: 8px;
  color:#fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  margin-top:5%;
`;

const Heading = styled.h1`
  font-size: 1.8em;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-size: 1.1em;
  color: #fff;
`;

const FileInput = styled.div``;

const InputFile = styled.input`
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
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

const Totals = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #000;
  border-radius: 5px;

  p {
    margin: 5px 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


const Button = styled.button`
  padding:10px;
  font-size:0.9em;
  background-color: #f00d88;
  color: white;
  border: none;
   margin: 10px;
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
const ButtonCancelC = styled.button`
  padding:10px;
  font-size:0.9em;
  background-color: #f00d88;
  color: white;
  border: none;
   margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color:Red;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;


const Confirmation = styled.div`
  padding: 20px;
  background-color: #000;
  border: 1px solid #ffecb3;
  border-radius: 5px;
  text-align: center;
`;

const ButtonConfirm = styled.button`
  background-color: #ff5722;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin: 10px;
  color: white;

  &:hover {
    background-color: #e64a19;
  }
`;

const ButtonCancel = styled.button`
  background-color: #ccc;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin: 10px;
  color: white;

  &:hover {
    background-color: #999;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  color: #d9534f;
  font-size: 1.1em;
  text-align: center;
`;


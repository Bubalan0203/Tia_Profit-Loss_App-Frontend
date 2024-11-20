import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { URL } from '../../assests/mocData/config';
import { Button } from '@mui/material';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  margin: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: white;
`;

const TableHeader = styled.th`
  background-color: #111;
  color: #f0f0f0;
  padding: 15px;
  text-align: left;
  font-weight: bold;
  border-top-left-radius: ${(props) => (props.first ? '10px' : '0')};
  border-top-right-radius: ${(props) => (props.last ? '10px' : '0')};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #444;
  }
  &:nth-child(odd) {
    background-color: #333;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  border-top: 1px solid #555;
`;

const HeaderText = styled.h2`
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background-color: #555;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
`;

const ViewHo = () => {
  const [hoData, setHoData] = useState([]);
  const [viewSalary, setViewSalary] = useState(false);
  const [selectedHo, setSelectedHo] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API
    axios.get(`${URL}/hostaff`) // Update with your actual endpoint
      .then((response) => setHoData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleViewSalary = (ho) => {
    setSelectedHo(ho);
    setViewSalary(true);
  };

  const handleBack = () => {
    setViewSalary(false);
    setSelectedHo(null);
  };

  const handleDelete = async (hoId) => {
    if (window.confirm('Are you sure you want to delete this HO staff record?')) {
      try {
        await axios.delete(`${URL}/hostaff/${hoId}`);
        setHoData((prevData) => prevData.filter((ho) => ho.hoId !== hoId));
        alert('HO staff record deleted successfully');
      } catch (error) {
        console.error('Error deleting HO staff record:', error);
        alert('Failed to delete HO staff record');
      }
    }
  };
  

  return (
    <TableContainer>
      {!viewSalary ? (
        <>
          <HeaderText>View HO Details</HeaderText>
          <StyledTable>
            <thead>
              <tr>
                <TableHeader first>S no</TableHeader>
                <TableHeader>HO Name</TableHeader>
                <TableHeader>HO ID</TableHeader>
                <TableHeader>View Salary</TableHeader>
                <TableHeader last>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {hoData.map((ho, index) => (
                <TableRow key={ho.hoId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{ho.hoName}</TableCell>
                  <TableCell>{ho.hoId}</TableCell>
                  <TableCell>
                    <button onClick={() => handleViewSalary(ho)}
                       disabled={!ho.salary || ho.salary.length === 0}>View Salary</button>
                  </TableCell>
                  <TableCell align="center">
  <Button
    variant="contained"
    color="error"
    style={{ textTransform: 'none' }}
    onClick={() => handleDelete(ho.hoId)}
  >
    Delete
  </Button>
</TableCell>

                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </>
      ) : (
        <>
          <BackButton onClick={handleBack}>Back</BackButton>
          <HeaderText>Salary Details for {selectedHo.hoName}</HeaderText>
          <StyledTable>
            <thead>
              <tr>
                <TableHeader first>S no</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Salary</TableHeader>
                <TableHeader>Days</TableHeader>
                <TableHeader last>Total</TableHeader>
              </tr>
            </thead>
            <tbody>
              {selectedHo.salary.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{record.salary}</TableCell>
                  <TableCell>{record.days}</TableCell>
                  <TableCell>{record.total}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </>
      )}
    </TableContainer>
  );
};

export default ViewHo;

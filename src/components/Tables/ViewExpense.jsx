import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  margin: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate; /* Allows border-radius on header cells */
  border-spacing: 0;
  color: white;
`;

const TableHeader = styled.th`
  background-color: #111; /* Darker header color */
  color: #f0f0f0;
  padding: 15px;
  text-align: left;
  font-weight: bold;
  border-top-left-radius: ${(props) => (props.first ? '10px' : '0')};
  border-top-right-radius: ${(props) => (props.last ? '10px' : '0')};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #444; /* Alternating row color */
  }
  &:nth-child(odd) {
    background-color: #333;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  border-top: 1px solid #555; /* Border between rows */
`;

const HeaderText = styled.h2`
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ViewExpense = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    axios.get(`${URL}/fsales`)
      .then(response => {
        setSalesData(response.data); // Assuming response.data is an array of sales records
      })
      .catch(error => {
        console.error("There was an error fetching the sales data!", error);
      });
  }, []);

  return (
    <TableContainer>
      <HeaderText>View Sales</HeaderText>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader first>S no</TableHeader>
            <TableHeader>Product Name</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Count</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader last>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale, index) => (
            <TableRow key={sale._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{sale.productName}</TableCell>
              <TableCell>{sale.description}</TableCell>
              <TableCell>{sale.price}</TableCell>
              <TableCell>{sale.count}</TableCell>
              <TableCell>{sale.total}</TableCell>
              <TableCell>Edit | Delete</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default ViewExpense;

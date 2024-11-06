import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';
const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  top:5%;
  margin: auto;
 /* Dark background */
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

const ViewFranchise = () => {
  const [franchiseData, setFranchiseData] = useState([]);

  useEffect(() => {
    const fetchFranchiseData = async () => {
      try {
        const response = await axios.get(`${URL}/franchise`); // Update with your backend API URL
        setFranchiseData(response.data);
      } catch (error) {
        console.error("Error fetching franchise data:", error);
      }
    };

    fetchFranchiseData();
  }, []);

  return (
    <TableContainer>
      <HeaderText>View Franchise</HeaderText>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader first>S no</TableHeader>
            <TableHeader>Franchise Name</TableHeader>
            <TableHeader>Franchise ID</TableHeader>
            <TableHeader>Branch Name</TableHeader>
            <TableHeader last>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {franchiseData.map((franchise, index) => (
            <TableRow key={franchise.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{franchise.franchiseName}</TableCell>
              <TableCell>{franchise.franchiseId}</TableCell>
              <TableCell>{franchise.branchName}</TableCell>
              <TableCell>Edit | Delete</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default ViewFranchise;

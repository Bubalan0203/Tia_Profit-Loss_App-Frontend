import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  top: 5%;
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

const ViewVip = () => {
  const [vipData, setVipData] = useState([]);

  useEffect(() => {
    const fetchVipData = async () => {
      try {
        const response = await axios.get(`${URL}/vip`);
        setVipData(response.data);
      } catch (error) {
        console.error("Error fetching VIP data:", error);
      }
    };

    fetchVipData();
  }, []);

  // Function to format the date to 'dd/mm/yyyy'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Calculate the day count from the first business date to today
  const getDayCountFromFirstBusiness = (firstBusinessDate) => {
    const startDate = new Date(firstBusinessDate);
    const currentDate = new Date();
    const timeDifference = currentDate - startDate;
    const dayCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return `${dayCount} days`;
  };

  // Determine VIP status based on months since first business date
  const getVipStatus = (firstBusinessDate) => {
    const startDate = new Date(firstBusinessDate);
    const currentDate = new Date();
    const monthsDifference = 
      (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
      (currentDate.getMonth() - startDate.getMonth());

    if (monthsDifference >= 60) return "NLI";
    if (monthsDifference >= 36) return "SLI";
    if (monthsDifference >= 12) return "DLI";
    return "Beginner VIP";
  };

  return (
    <TableContainer>
      <HeaderText>View Vip</HeaderText>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader first>S no</TableHeader>
            <TableHeader>Vip Name</TableHeader>
            <TableHeader>Vip ID</TableHeader>
            <TableHeader>First Business Date</TableHeader>
            <TableHeader>Vip System Date</TableHeader>
            <TableHeader>Vip Status</TableHeader>
            <TableHeader last>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {vipData.map((vip, index) => (
            <TableRow key={vip.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{vip.vipName}</TableCell>
              <TableCell>{vip.vipId}</TableCell>
              <TableCell>{formatDate(vip.firstBusiness)}</TableCell>
              <TableCell>{getDayCountFromFirstBusiness(vip.firstBusiness)}</TableCell>
              <TableCell>{getVipStatus(vip.firstBusiness)}</TableCell>
              <TableCell>Edit | Delete</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default ViewVip;

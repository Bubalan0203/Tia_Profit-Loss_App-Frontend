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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: 75%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #311c31;
  color: white;
`;
const ViewExpense = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState('All');
  const [year, setYear] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Filter based on search text, month, and year
    const filtered = salesData.filter((sale) => {
      const saleDate = new Date(sale.createdAt); // Convert createdAt to a Date object
      const saleMonth = saleDate.getMonth() + 1; // Months are 0-based
      const saleYear = saleDate.getFullYear();
  
      // Match month and year if they are not 'All'
      const matchesMonth = month === 'All' || saleMonth === new Date(`${month} 1`).getMonth() + 1;
      const matchesYear = year === 'All' || saleYear === parseInt(year);
  
      // Match search text (ensure productName and description are strings)
      const matchesSearch =
        (sale.productName?.toLowerCase().includes(searchText.toLowerCase()) || '') ||
        (sale.description?.toLowerCase().includes(searchText.toLowerCase()) || '');
  
      return matchesMonth && matchesYear && matchesSearch;
    });
  
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [searchText, month, year, salesData]);
  

  useEffect(() => {
    axios
      .get(`${URL}/fsales`)
      .then((response) => {
        setSalesData(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the sales data!', error);
      });
  }, []);

  return (
    <TableContainer>
      <HeaderText>View Expense</HeaderText>
      <FilterContainer>
        <FilterSelect value={month} onChange={(e) => setMonth(e.target.value)}>
          {[
            'All',
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect value={year} onChange={(e) => setYear(e.target.value)}>
          {['All', 2024, 2023, 2022, 2021, 2020].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </FilterSelect>
      </FilterContainer>
      <br></br>
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
          {filteredData.map((sale, index) => (
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

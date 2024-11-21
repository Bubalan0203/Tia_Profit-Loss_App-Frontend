import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';
import * as XLSX from 'xlsx';

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

const SearchInput = styled.input`
  width: 20%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  
`;

const DownloadButton = styled.button`
  padding: 10px 15px;
  background-color: #0a74da;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position:absolute;
  right:10%;
`;

const NoRecordsFound = styled.tr`
  td {
    text-align: center;
    color: white;
    font-size: 18px;
    padding: 20px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  margin: 0 5px;
  padding: 10px;
  background-color: ${(props) => (props.active ? '#0a74da' : '#444')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
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
const ViewFranchise = () => {
  const [salesData, setSalesData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState('All'); // Default month filter to 'All'
  const [year, setYear] = useState('All'); 

  const recordsPerPage = 25;

  useEffect(() => {
    // Fetch data from the backend
    axios.get(`${URL}/sales`)
      .then(response => {
        setSalesData(response.data); // Assuming response.data is an array of sales records
      })
      .catch(error => {
        console.error("There was an error fetching the sales data!", error);
      });
  }, []);

  useEffect(() => {
    // Filter based on search text, month, and year
    const filtered = salesData.filter((sale) => {
      const saleDate = new Date(sale.createdAt); // Convert createdAt to a Date object
      const saleMonth = saleDate.getMonth() + 1; // Months are 0-based
      const saleYear = saleDate.getFullYear();
  
      // Match month and year if they are not 'All'
      const matchesMonth = month === 'All' || saleMonth === new Date(`${month} 1`).getMonth() + 1;
      const matchesYear = year === 'All' || saleYear === parseInt(year);
  
      // Match search text
      const matchesSearch =
        sale.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        sale.description.toLowerCase().includes(searchText.toLowerCase());
  
      return matchesMonth && matchesYear && matchesSearch;
    });
  
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [searchText, month, year, salesData]);
  
  // Get paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Handle Excel download
  const handleDownload = () => {
    // Map data to include custom headers
    const exportData = salesData.map((sale, index) => ({
      "S No": index + 1,
      "Product Name": sale.productName,
      Description: sale.description,
      Price: sale.price,
      Count: sale.count,
      Total: sale.total,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesData');
    XLSX.writeFile(workbook, 'salesData.xlsx');
  };
  
  // Pagination handlers
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);


  return (
    <TableContainer>
      <HeaderText>View Sales</HeaderText>
    
      
      <div>
        <SearchInput
          type="text"
          placeholder="Search "
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <DownloadButton onClick={handleDownload}>Download Excel</DownloadButton>
      </div>

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
        {paginatedData.length > 0 ? (
           paginatedData.map((sale, index) => (
            <TableRow key={sale._id}>
              <TableCell>
                  {(currentPage - 1) * recordsPerPage + index + 1}
                </TableCell>
              <TableCell>{sale.productName}</TableCell>
              <TableCell>{sale.description}</TableCell>
              <TableCell>{sale.price}</TableCell>
              <TableCell>{sale.count}</TableCell>
              <TableCell>{sale.total}</TableCell>
              <TableCell>Edit | Delete</TableCell>
            </TableRow>
          ))) : (
            <NoRecordsFound>
              <td colSpan="5">No Records Found</td>
            </NoRecordsFound>
          )}
        </tbody>
      </StyledTable>
      {filteredData.length > recordsPerPage && (
        <PaginationContainer>
          <PaginationButton
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationButton
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              active={currentPage === index + 1}
            >
              {index + 1}
            </PaginationButton>
          ))}
          <PaginationButton
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}
    </TableContainer>
  );
};

export default ViewFranchise;

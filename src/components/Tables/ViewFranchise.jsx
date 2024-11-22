import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { URL } from '../../assests/mocData/config';
import { Button } from '@mui/material';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  margin: auto;
  top: 5%;
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

const ViewFranchise = () => {
  const [franchiseData, setFranchiseData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 25;

  useEffect(() => {
    const fetchFranchiseData = async () => {
      try {
        const response = await axios.get(`${URL}/franchise`); // Update with your backend API URL
        setFranchiseData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching franchise data:", error);
      }
    };

    fetchFranchiseData();
  }, []);

  // Filter data based on the search query
  useEffect(() => {
    const filtered = franchiseData.filter((franchise) =>
      franchise.franchiseName.toLowerCase().includes(searchText.toLowerCase()) ||
      franchise.franchiseId.toLowerCase().includes(searchText.toLowerCase()) ||
      franchise.branchName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page on search
  }, [searchText, franchiseData]);

  // Get paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Handle Excel download
  const handleDownload = () => {
    // Map data to include custom headers
    const exportData = franchiseData.map((franchise, index) => ({
      "S No": index + 1,
      "Franchise Name": franchise.franchiseName,
      "Franchise ID": franchise.franchiseId,
      "Branch Name": franchise.branchName,
      
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FranchiseData');
    XLSX.writeFile(workbook, 'FranchiseData.xlsx');
  };
  
  // Pagination handlers
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);


  const handleDelete = async (franchiseId) => {
    if (window.confirm('Are you sure you want to delete this franchise?')) {
      try {
        await axios.delete(`${URL}/franchise/${franchiseId}`); // API call to delete franchise
        setFranchiseData((prev) => prev.filter((item) => item.franchiseId !== franchiseId));
        setFilteredData((prev) => prev.filter((item) => item.franchiseId !== franchiseId));
      } catch (error) {
        console.error('Error deleting franchise:', error);
      }
    }
  };
  

  return (
    <TableContainer>
      <HeaderText>View Franchise</HeaderText>

      <div>
        <SearchInput
          type="text"
          placeholder="Search "
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <DownloadButton onClick={handleDownload}>Download Excel</DownloadButton>
      </div>

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
          {paginatedData.length > 0 ? (
            paginatedData.map((franchise, index) => (
              <TableRow key={franchise.id}>
                <TableCell>
                  {(currentPage - 1) * recordsPerPage + index + 1}
                </TableCell>
                <TableCell>{franchise.franchiseName}</TableCell>
                <TableCell>{franchise.franchiseId}</TableCell>
                <TableCell>{franchise.branchName}</TableCell>
                <TableCell>
  <Button 
   variant="contained"
   color="error"
   style={{ textTransform: 'none' }}
   onClick={() => handleDelete(franchise.franchiseId)}>
    Delete</Button>
  
</TableCell>

              </TableRow>
            ))
          ) : (
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

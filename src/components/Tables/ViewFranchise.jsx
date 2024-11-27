import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { URL } from '../../assests/mocData/config';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  margin: auto;
  top: 5%;
`;

const StyledTable = styled.div`
  width: 100%;
  color: white;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    thead {
      position: sticky;
      top: 0;
      background-color: #111;
      z-index: 2;
    }
    th, td {
      padding: 15px;
      text-align: left;
      border-top: 1px solid #555;
    }
  }

  .table-body {
    max-height: 400px; /* Set the desired height for the scrollable table body */
    overflow-y: auto;
    display: block;
    width: 100%;
  }

  table thead tr {
    display: table;
    width: 100%;
  }

  table tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed; /* Ensures columns are aligned */
  }
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
  position: absolute;
  right: 10%;
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const recordsPerPage = 25;

  useEffect(() => {
    const fetchFranchiseData = async () => {
      try {
        const response = await axios.get(`${URL}/franchise`);
        setFranchiseData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching franchise data:', error);
      }
    };

    fetchFranchiseData();
  }, []);

  useEffect(() => {
    const filtered = franchiseData.filter(
      (franchise) =>
        franchise.franchiseName.toLowerCase().includes(searchText.toLowerCase()) ||
        franchise.franchiseId.toLowerCase().includes(searchText.toLowerCase()) ||
        franchise.branchName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchText, franchiseData]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleDownload = () => {
    const exportData = franchiseData.map((franchise, index) => ({
      'S No': index + 1,
      'Franchise Name': franchise.franchiseName,
      'Franchise ID': franchise.franchiseId,
      'Branch Name': franchise.branchName,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FranchiseData');
    XLSX.writeFile(workbook, 'FranchiseData.xlsx');
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${URL}/franchise/${selectedFranchiseId}`);
      setFranchiseData((prev) => prev.filter((item) => item.franchiseId !== selectedFranchiseId));
      setFilteredData((prev) => prev.filter((item) => item.franchiseId !== selectedFranchiseId));
      enqueueSnackbar('Franchise deleted successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete franchise.', { variant: 'error' });
      console.error('Error deleting franchise:', error);
    } finally {
      setOpenModal(false);
      setSelectedFranchiseId(null);
    }
  };

  const handleOpenModal = (franchiseId) => {
    setSelectedFranchiseId(franchiseId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFranchiseId(null);
  };

  return (
    <TableContainer>
      <HeaderText>View Franchise</HeaderText>

      <div>
        <SearchInput
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <DownloadButton onClick={handleDownload}>Download Excel</DownloadButton>
      </div>

      <StyledTable>
        <table>
        <thead>
          <tr>
            <TableHeader first>S No</TableHeader>
            <TableHeader>Franchise Name</TableHeader>
            <TableHeader>Franchise Email</TableHeader>
            <TableHeader>Branch Name</TableHeader>
            <TableHeader last>Actions</TableHeader>
          </tr>
        </thead>
        <div className="table-body">
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((franchise, index) => (
              <TableRow key={franchise.franchiseId}>
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
                    onClick={() => handleOpenModal(franchise.franchiseId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <NoRecordsFound>
              <td colSpan="5">No Records Found</td>
            </NoRecordsFound>
          )}
        </tbody>
        </div>
        </table>
      </StyledTable>

      {filteredData.length > recordsPerPage && (
        <PaginationContainer>
          <PaginationButton
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>
          {[...Array(Math.ceil(filteredData.length / recordsPerPage))].map((_, index) => (
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
            disabled={currentPage === Math.ceil(filteredData.length / recordsPerPage)}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}

      {/* Modal for Delete Confirmation */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this franchise? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ViewFranchise;

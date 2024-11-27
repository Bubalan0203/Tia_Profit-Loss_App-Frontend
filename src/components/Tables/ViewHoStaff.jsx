import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import { URL } from '../../assests/mocData/config';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  margin: auto;
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
  position:absolute;
  right:10%;
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

const ViewHo = () => {
  const [hoData, setHoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewSalary, setViewSalary] = useState(false);
  const [selectedHo, setSelectedHo] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHoId, setSelectedHoId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const recordsPerPage = 25;


 useEffect(() => {
    axios.get(`${URL}/hostaff`)
      .then((response) => {
        setHoData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => enqueueSnackbar('Error fetching data.', { variant: 'error' }));
  }, []);

  useEffect(() => {
    const filtered = hoData.filter(
      (ho) =>
        ho.hoName.toLowerCase().includes(searchText.toLowerCase()) ||
        ho.hoId.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchText, hoData]);


  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handleDownload = () => {
    const exportData = filteredData.map((ho, index) => ({
      "S No": index + 1,
      "HO Name": ho.hoName,
      "HO ID": ho.hoId,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HO Data');
    XLSX.writeFile(workbook, 'HOData.xlsx');
  };

  const handleDelete = async () => {
    if (!selectedHoId) return;

    try {
      await axios.delete(`${URL}/hostaff/${selectedHoId}`);
      setHoData((prev) => prev.filter((item) => item.hoId !== selectedHoId));
      enqueueSnackbar('HO record deleted successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete HO record.', { variant: 'error' });
    } finally {
      handleCloseModal();
    }
  };

  const handleOpenModal = (hoId) => {
    setSelectedHoId(hoId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedHoId(null);
  };


  const handleViewSalary = (ho) => {
    setSelectedHo(ho);
    setViewSalary(true);
  };

  const handleBack = () => {
    setViewSalary(false);
    setSelectedHo(null);
  };

 

  return (
    <TableContainer>
      {!viewSalary ? (
        <>
          <HeaderText>View HO Details</HeaderText>
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
                <TableHeader first>S no</TableHeader>
                <TableHeader>HO Name</TableHeader>
                <TableHeader>HO ID</TableHeader>
                <TableHeader>View Salary</TableHeader>
                <TableHeader last>Actions</TableHeader>
              </tr>
            </thead>
            <div className="table-body">
            <tbody>
              {paginatedData.map((ho, index) => (
                <TableRow key={ho.hoId}>
                  <TableCell>
                    {(currentPage - 1) * recordsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{ho.hoName}</TableCell>
                  <TableCell>{ho.hoId}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewSalary(ho)}
                      disabled={!ho.salary || ho.salary.length === 0}
                    >
                      View Salary
                    </button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      style={{ textTransform: 'none' }}
                      onClick={() => handleOpenModal(ho.hoId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
              {[...Array(totalPages)].map((_, index) => (
                <PaginationButton
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
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
                  <TableCell>
                    {new Date(record.date).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell>{record.salary}</TableCell>
                  <TableCell>{record.days}</TableCell>
                  <TableCell>{record.total}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </>
      )}


<Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this HO record? This action cannot be undone.
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

export default ViewHo;

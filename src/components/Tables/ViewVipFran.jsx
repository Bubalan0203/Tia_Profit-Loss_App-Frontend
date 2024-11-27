import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { URL } from '../../assests/mocData/config';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  margin: auto;
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


const ViewVip = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState('All');
  const [year, setYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 25; // Change as needed

  const { enqueueSnackbar } = useSnackbar(); // Snackbar instance
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [selectedMonthYear, setSelectedMonthYear] = useState(null); // Record to delete

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/vipfranchiseupload/checkRecord?month=${month}&year=${year}`);
        const result = await response.json();

        if (result.records && Array.isArray(result.records)) {
          setData(result.records);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
      }
    };

    fetchData();
  }, [month, year]);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const isMonthMatch = month === 'All' || item.monthYear.startsWith(month);
      const isYearMatch = year === 'All' || item.monthYear.includes(year);
      return isMonthMatch && isYearMatch;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [month, year, data]);

  const openModal = (monthYear) => {
    setSelectedMonthYear(monthYear);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMonthYear(null);
  };

  const confirmDelete = async () => {
    try {
      const [month, year] = selectedMonthYear.split(' ');
      const response = await fetch(`${URL}/vipfranchiseupload/deleteRecord?month=${month}&year=${year}`, {
        method: 'DELETE',
      });
  
      const result = await response.json();
      if (response.ok) {
        enqueueSnackbar(result.message, { variant: 'success' });
        setMonth('All');
        setYear('All'); // Refresh the current view if needed
  
        // Directly remove the deleted record from the state
        setData((prevData) => prevData.filter(item => item.monthYear !== selectedMonthYear));
        setFilteredData((prevData) => prevData.filter(item => item.monthYear !== selectedMonthYear));
      } else {
        enqueueSnackbar(result.message || 'Error deleting record', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting record', { variant: 'error' });
    } finally {
      closeModal();
    }
  };
  
  
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <TableContainer>
      <HeaderText>View Vip Franchise</HeaderText>
      <FilterContainer>
        <FilterSelect value={month} onChange={(e) => setMonth(e.target.value)}>
          {['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
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

      <StyledTable>
        <table>
        <thead>
          <tr>
            <TableHeader first>S no</TableHeader>
            <TableHeader>Month & Year</TableHeader>
            <TableHeader>Collection</TableHeader>
            <TableHeader>Revenue</TableHeader>
            <TableHeader>Total payment</TableHeader>
            <TableHeader>Payment Paid</TableHeader>
            <TableHeader>Payment Pending</TableHeader>
            <TableHeader last>Actions</TableHeader>
          </tr>
        </thead>
        <div className="table-body">
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{item.monthYear}</TableCell>
                <TableCell>{item.totals.collection}</TableCell>
                <TableCell>{item.totals.revenue}</TableCell>
                <TableCell>{item.totals.totalPayment}</TableCell>
                <TableCell>{item.totals.paymentPaid}</TableCell>
                <TableCell>{item.totals.paymentPending}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ textTransform: 'none' }}
                    onClick={() => openModal(item.monthYear)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="8" style={{ textAlign: 'center', color: 'white' }}>
                No records found for the selected month and year.
              </TableCell>
            </TableRow>
          )}
        </tbody>
        </div>
        </table>
      </StyledTable>

      <PaginationContainer>
        <PaginationButton disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
          Previous
        </PaginationButton>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationButton key={i + 1} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </PaginationButton>
        ))}
        <PaginationButton disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </PaginationButton>
      </PaginationContainer>

      {/* Modal for Delete Confirmation */}
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the record for <strong>{selectedMonthYear}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ViewVip;
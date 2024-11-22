import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { URL } from '../../assests/mocData/config';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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

const StyledTable = styled.table`
  width: 100%;
  margin-top: 1%;
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

const ViewCompany = () => {
  const { enqueueSnackbar } = useSnackbar(); // Hook for snackbar notifications
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState('All');
  const [year, setYear] = useState('All');
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false); // Modal visibility state
  const [selectedRecord, setSelectedRecord] = useState(null); // Store the record to delete

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/companydata/checkRecord?month=${month}&year=${year}`);
        const result = await response.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error('Unexpected response format:', result);
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
      }
    };

    fetchData();
  }, [month, year]);

  // Filter data based on month and year
  useEffect(() => {
    const filtered = data.filter((item) => {
      const isMonthMatch = month === 'All' || item.monthYear.startsWith(month);
      const isYearMatch = year === 'All' || item.monthYear.includes(year);
      return isMonthMatch && isYearMatch;
    });
    setFilteredData(filtered);
  }, [month, year, data]);

  // Open confirmation modal
  const handleOpenModal = (monthYear) => {
    setSelectedRecord(monthYear);
    setOpenModal(true);
  };

  // Close confirmation modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRecord(null);
  };

  // Handle deletion
  const handleDelete = async () => {
    try {
      const [month, year] = selectedRecord.split(' '); // Split monthYear into separate values
      const response = await fetch(`${URL}/companydata/deleteRecord?month=${month}&year=${year}`, {
        method: 'DELETE',
      });
  
      const result = await response.json();
      if (response.ok) {
        enqueueSnackbar(result.message, { variant: 'success' });
        
        // Update state: Remove the deleted record from data and filteredData
        setData((prevData) => prevData.filter(item => item.monthYear !== selectedRecord));
        setFilteredData((prevFilteredData) => prevFilteredData.filter(item => item.monthYear !== selectedRecord));
      } else {
        enqueueSnackbar(result.message || 'Error deleting record', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting record', { variant: 'error' });
      console.error(error);
    }
  
    handleCloseModal(); // Close modal after deletion
  };
  

  return (
    <TableContainer>
      <HeaderText>View Company Revenue</HeaderText>
      <FilterContainer>
        <FilterSelect value={month} onChange={(e) => setMonth(e.target.value)}>
          {[
            'All', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
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

      <StyledTable>
        <thead>
          <tr>
            <TableHeader first>S no</TableHeader>
            <TableHeader>Collection</TableHeader>
            <TableHeader>Total payment</TableHeader>
            <TableHeader>Payment Paid</TableHeader>
            <TableHeader>Payment Pending</TableHeader>
            <TableHeader last>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.totals.courseFee}</TableCell>
                <TableCell>{item.totals.companyRevenue}</TableCell>
                <TableCell>{item.totals.paymentPaid}</TableCell>
                <TableCell>{item.totals.paymentPending}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ textTransform: 'none' }}
                    onClick={() => handleOpenModal(item.monthYear)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" style={{ textAlign: 'center', color: 'white' }}>
                No records found for the selected month and year.
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </StyledTable>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the record for {selectedRecord}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ViewCompany;

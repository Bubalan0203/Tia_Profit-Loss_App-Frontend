import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
import { URL } from '../../assests/mocData/config';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  margin: auto;
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
// (Other styled-components remain unchanged)

const ViewVip = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState('All');
  const [year, setYear] = useState('All');
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar(); // Initialize enqueueSnackbar
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null); // State to track the record being deleted

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/vipfranchiseupload/checkRecord?month=${month}&year=${year}`);
        const result = await response.json();
        if (result.records && Array.isArray(result.records)) {
          setData(result.records);
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

  useEffect(() => {
    const filtered = data.filter((item) => {
      const isMonthMatch = month === 'All' || item.monthYear.startsWith(month);
      const isYearMatch = year === 'All' || item.monthYear.includes(year);
      return isMonthMatch && isYearMatch;
    });
    setFilteredData(filtered);
  }, [month, year, data]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
  
    try {
      const [month, year] = deleteTarget.split(' ');
      const response = await fetch(`${URL}/vipfranchiseupload/deleteRecord?month=${month}&year=${year}`, {
        method: 'DELETE',
      });
  
      const result = await response.json();
      if (response.ok) {
        enqueueSnackbar(result.message, { variant: 'success' });
  
        // Update the state to reflect the deletion
        setData((prevData) => prevData.filter(item => item.monthYear !== deleteTarget));
        setFilteredData((prevData) => prevData.filter(item => item.monthYear !== deleteTarget));
  
        setMonth('All'); // Reset filters to refetch data
        setYear('All');
      } else {
        enqueueSnackbar(result.message || 'Error deleting record', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting record', { variant: 'error' });
      console.error(error);
    } finally {
      setDeleteModalOpen(false); // Close modal
      setDeleteTarget(null); // Reset target
    }
  };
  

  return (
    <TableContainer>
      <HeaderText>View Vip Franchise</HeaderText>
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
                <TableCell>{item.totals.collection}</TableCell>
                <TableCell>{item.totals.totalPayment}</TableCell>
                <TableCell>{item.totals.paymentPaid}</TableCell>
                <TableCell>{item.totals.paymentPending}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ textTransform: 'none' }}
                    onClick={() => {
                      setDeleteTarget(item.monthYear); // Set the record to delete
                      setDeleteModalOpen(true); // Open confirmation modal
                    }}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ViewVip;

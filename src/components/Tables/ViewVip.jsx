import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { URL } from '../../assests/mocData/config';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';



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
    
    border-collapse: collapse;
    table-layout: fixed;
     max-height: 400px;
    overflow-y: auto;
    display: block;

    th:nth-child(1), td:nth-child(1) {
      width: 10%; /* Adjust width for the first column */
    }

    th:nth-child(2), td:nth-child(2) {
      width: 30%; /* Adjust width for the second column */
    }

    th:nth-child(3), td:nth-child(3) {
      width: 20%; /* Adjust width for the third column */
    }

    th:nth-child(4), td:nth-child(4) {
      width: 30%; /* Adjust width for the fourth column */
    }

    th:nth-child(5), td:nth-child(5) {
      width: 10%; /* Adjust width for the last column */
    }
  }

  
`;

const TableHeader = styled.th`
  background-color: #111;
  color: #f0f0f0;
  padding:15px;
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
padding:15px;
  text-align: center; /* Ensures table cell content is centered */
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
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState('All');
  const [year, setYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);

  const recordsPerPage = 25; // Number of records per page

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/vipdata/checkRecord?month=${month}&year=${year}`);
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
    setCurrentPage(1); // Reset to the first page on filter change
  }, [month, year, data]);

  // Paginate filtered data
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async () => {
    try {
      const [month, year] = selectedMonthYear.split(' ');
      const response = await fetch(`${URL}/vipdata/deleteByMonthYear?month=${month}&year=${year}`, {
        method: 'DELETE',
      });
  
      const result = await response.json();
      if (response.ok) {
        enqueueSnackbar(result.message, { variant: 'success' });
        setMonth('All');
        setYear('All'); // Reset the filters if needed
  
        // Directly remove the deleted record from the state
        setData((prevData) => prevData.filter(item => item.monthYear !== selectedMonthYear));
        setFilteredData((prevData) => prevData.filter(item => item.monthYear !== selectedMonthYear));
        
        // Refresh the page
       
      } else {
        enqueueSnackbar(result.message, { variant: 'success' });
        window.location.reload();
      }
    } catch (error) {
      enqueueSnackbar('Error deleting record', { variant: 'error' });
    } finally {
      closeModal();
    }
  };
  
  const handleOpenDialog = (monthYear) => {
    setSelectedMonthYear(monthYear);
    setOpenDialog(true);
  };

  const closeModal = () => {
    setOpenDialog(false);
    setSelectedMonthYear(null);
  };


  return (
    <TableContainer>
      <HeaderText>View Vip</HeaderText>
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
        <table>
        <thead>
          <tr>
            <TableHeader first>S No</TableHeader>
            <TableHeader>Month & Year</TableHeader>
            <TableHeader>Collection</TableHeader>
            <TableHeader>Revenue</TableHeader>
            <TableHeader>Additional revenue</TableHeader>
            <TableHeader>Total payment</TableHeader>
            <TableHeader>Payment Paid</TableHeader>
            <TableHeader>Payment Pending</TableHeader>
            <TableHeader last>Actions</TableHeader>
          </tr>
        </thead>
       
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{(currentPage - 1) * recordsPerPage + index + 1}</TableCell>
                <TableCell>{item.monthYear}</TableCell>
                <TableCell>{item.totals.collection}</TableCell>
                <TableCell>{item.totals.revenue}</TableCell>
                <TableCell>{item.totals.additionalRevenue}</TableCell>
                <TableCell>{item.totals.totalPayment}</TableCell>
                <TableCell>{item.totals.paymentPaid}</TableCell>
                <TableCell>{item.totals.paymentPending}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ textTransform: 'none' }}
                    onClick={() => handleOpenDialog(item.monthYear)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="9" style={{ textAlign: 'center', color: 'white' }}>
                No records found for the selected month and year.
              </TableCell>
            </TableRow>
          )}
        </tbody>
     
        </table>
      </StyledTable>

      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </PaginationButton>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationButton
              key={index + 1}
              active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationButton>
          ))}
          <PaginationButton disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </PaginationButton>
        </PaginationContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete data for {selectedMonthYear}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
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

export default ViewVip;
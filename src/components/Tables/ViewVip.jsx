import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { URL } from '../../assests/mocData/config';
import { Button } from '@mui/material';

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

  const handleDelete = async (month, year) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete data for ${month} ${year}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${URL}/vipdata/deleteByMonthYear?month=${month}&year=${year}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert(`Data for ${month} ${year} deleted successfully.`);
        setFilteredData((prevData) => prevData.filter((item) => item.monthYear !== `${month} ${year}`));
      } else {
        const result = await response.json();
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data. Please try again.');
    }
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
                    onClick={() => handleDelete(item.monthYear.split(' ')[0], item.monthYear.split(' ')[1])}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" style={{ textAlign: 'center', color: 'white' }}>
                No records found for the selected month and year.
              </TableCell>
            </TableRow>
          )}
        </tbody>
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
    </TableContainer>
  );
};

export default ViewVip;

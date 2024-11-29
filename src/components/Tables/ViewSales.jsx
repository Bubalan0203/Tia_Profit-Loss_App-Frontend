import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';
import * as XLSX from 'xlsx';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
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
  margin-bottom:2%;

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

const ViewSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState('All');
  const [year, setYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const recordsPerPage = 25;

  const fetchSalesData = () => {
    const params = new URLSearchParams();
    if (month !== 'All') params.append('month', month);
    if (year !== 'All') params.append('year', year);

    axios
      .get(`${URL}/sales?${params.toString()}`)
      .then((response) => {
        setSalesData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
      });
  };

  useEffect(() => {
    fetchSalesData();
  }, [month, year]);

  useEffect(() => {
    const filtered = salesData.filter((sale) =>
      sale.productName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchText, salesData]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handleDownload = () => {
    const exportData = salesData.map((sale, index) => ({
      'S No': index + 1,
      'Product Name': sale.productName,
      Description: sale.description,
      Price: sale.price,
      Count: sale.count,
      Total: sale.total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesData');
    XLSX.writeFile(workbook, 'salesData.xlsx');
    enqueueSnackbar('Excel file downloaded successfully!', { variant: 'success' });
  };

  const openConfirmationModal = (id) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleDelete = () => {
    setOpenModal(false);
    if (selectedId) {
      axios
        .delete(`${URL}/sales/${selectedId}`)
        .then(() => {
          setSalesData((prev) => prev.filter((sale) => sale._id !== selectedId));
          enqueueSnackbar('Record deleted successfully!', { variant: 'success' });
        })
        .catch((error) => {
          console.error('Error deleting record:', error);
          enqueueSnackbar('Failed to delete the record.', { variant: 'error' });
        });
    }
  };

  return (
    <TableContainer>
      <HeaderText>View Expense</HeaderText>
      <div>
        <SearchInput
          type="text"
          placeholder="Search"
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

      <StyledTable>
        <table>
          <thead>
            <tr>
              <TableHeader first>S No</TableHeader>
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
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      style={{ textTransform: 'none' }}
                      onClick={() => openConfirmationModal(sale._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'white' }}>
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
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


export default ViewSales;

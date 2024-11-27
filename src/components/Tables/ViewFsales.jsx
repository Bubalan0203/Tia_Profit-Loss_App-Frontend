import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';
import {  TextField, Button, Modal, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { format } from 'date-fns';

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

const FilterSelect = styled(FormControl)`
  min-width: 300px;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #311c31;
  & .MuiInputBase-root {
    color: white;
  }
  & .MuiSvgIcon-root {
    color: white;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterControlsContainer = styled.div`
  display: flex;
  gap: 10px;
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

const SearchInput = styled.input`
  width: 20%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  
`;
const ViewFsales = () => {
  const [salesData, setSalesData] = useState([]);
  const [expandedFranchise, setExpandedFranchise] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [expandedProductIndex, setExpandedProductIndex] = useState(null);
  const [currentFranchiseIndex, setCurrentFranchiseIndex] = useState(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(null);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [expandedRoyaltyFranchise, setExpandedRoyaltyFranchise] = useState(null);
  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i); // Generates [2020, 2021, ..., 2030]
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const recordsPerPage =25;

  useEffect(() => {
    const filtered = salesData.filter((sale) => {
      const matchesSearch =
        (sale.franchiseName?.toLowerCase().includes(searchText.toLowerCase()) || '') ||
        (sale.franchiseId?.toLowerCase().includes(searchText.toLowerCase()) || '');
  
      const matchesMonth = monthFilter ? sale.month === monthFilter : true;
      const matchesYear = yearFilter ? sale.year === yearFilter : true;
  
      return matchesMonth && matchesYear && matchesSearch;
    });
  
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [searchText, monthFilter, yearFilter, salesData]);
  
  
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);


  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = () => {
    axios.get(`${URL}/franchise`)
      .then(response => {
        setSalesData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the sales data!", error);
      });
  };

  const handleViewStatsClick = (index) => {
    setExpandedFranchise(index);
  };

  const handleBackClick = () => {
    setExpandedFranchise(null);
    setExpandedProductIndex(null);
  };

  const handleBackToProductsClick = () => {
    setExpandedProductIndex(null);
  };

  const handlePayClick = (franchiseIndex, productIndex) => {
    setCurrentFranchiseIndex(franchiseIndex);
    setCurrentProductIndex(productIndex);
    setPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setPaymentModalOpen(false);
  };
  
  const handleMonthChange = (event) => setMonthFilter(event.target.value);
  const handleYearChange = (event) => setYearFilter(event.target.value);

  const filteredProducts = salesData[expandedFranchise]?.products?.filter(product => {
    if (!monthFilter && !yearFilter) return true;
    const date = new Date(product.addedDate);
    const productMonth = date.getMonth() + 1; // getMonth returns 0-based month
    const productYear = date.getFullYear();
    return (!monthFilter || productMonth === parseInt(monthFilter)) && (!yearFilter || productYear === parseInt(yearFilter));
  });

  const handlePaymentSubmit = () => {
    if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) === 0) {
      enqueueSnackbar('Please enter a valid payment amount (non-zero).', { variant: 'error' });
      return;
    }

    const payment = parseFloat(paymentAmount);
    const product = salesData[currentFranchiseIndex].products[currentProductIndex];
    
    // Check if payment is positive and does not exceed pending amount
    if (payment > 0 && payment > product.paymentPending) {
      enqueueSnackbar('Payment cannot exceed the pending amount.', { variant: 'warning' });
      return;
    }
    
    // Check if payment is negative and does not exceed paid amount
    if (payment < 0 && Math.abs(payment) > product.paymentPaid) {
      enqueueSnackbar('Negative payment cannot exceed the amount already paid.', { variant: 'warning' });
      return;
    }

    const newPaymentPaid = (product.paymentPaid || 0) + payment;
    const newPaymentPending = product.total - newPaymentPaid;

    axios.put(`${URL}/franchise/${salesData[currentFranchiseIndex].franchiseId}/products/${product._id}/pay`, {
      amount: payment
    })
    
    .then(response => {
      const updatedSalesData = [...salesData];
      updatedSalesData[currentFranchiseIndex].products[currentProductIndex].paymentPaid = newPaymentPaid;
      updatedSalesData[currentFranchiseIndex].products[currentProductIndex].paymentPending = newPaymentPending;
      updatedSalesData[currentFranchiseIndex].products[currentProductIndex].payments.push(response.data.payment);

      setSalesData(updatedSalesData);
      setPaymentModalOpen(false);
      setPaymentAmount('');
      enqueueSnackbar('Payment successfully submitted!', { variant: 'success' });
    })
    .catch(error => {
      enqueueSnackbar('Error processing the payment.', { variant: 'error' });
      console.error("There was an error processing the payment!", error);
    });
  };

  const calculateTotalSales = (products) => {
    return products.reduce((total, product) => total + parseFloat(product.total), 0);
  };

  return (
    <TableContainer>
       {expandedRoyaltyFranchise !== null ? (
          <>
            <HeaderText>Royalty Details for {salesData[expandedRoyaltyFranchise]?.franchiseName}</HeaderText>
            <button onClick={() => setExpandedRoyaltyFranchise(null)}>Back</button>
            <StyledTable>
            <table>
              <thead>
                <tr>
                  <TableHeader first>S no</TableHeader>
                  <TableHeader>Month</TableHeader>
                  <TableHeader>Year</TableHeader>
                  <TableHeader>Royalty Amount</TableHeader>
                  <TableHeader>Amount Paid</TableHeader>
                  <TableHeader>Amount Pending</TableHeader>
                </tr>
              </thead>
              <div className="table-body">
              <tbody>
                {salesData[expandedRoyaltyFranchise]?.financialRecords?.length > 0 ? (
                  salesData[expandedRoyaltyFranchise]?.financialRecords?.map((record, recordIndex) => (
                    <TableRow key={`${salesData[expandedRoyaltyFranchise]._id}-${recordIndex}`}>
                      <TableCell>{recordIndex + 1}</TableCell>
                      <TableCell>{record.month}</TableCell>
                      <TableCell>{record.year}</TableCell>
                      <TableCell>₹{record.royaltyAmount}</TableCell>
                      <TableCell>₹{record.amountPaid}</TableCell>
                      <TableCell>₹{record.amountPending}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                      No Records Found
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
              </div>
              </table>
            </StyledTable>
          </>
        ): expandedFranchise === null ? (
        <>
          <HeaderText>Franchise Summary</HeaderText>
          <div>
        <SearchInput
          type="text"
          placeholder="Search "
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
          <StyledTable>
            <table>
            <thead>
              <tr>
                <TableHeader first>S no</TableHeader>
                <TableHeader>Franchise Name</TableHeader>
                <TableHeader>Total Sales</TableHeader>
                <TableHeader>Total Payment Paid</TableHeader>
                <TableHeader>Total Payment Pending</TableHeader>
                <TableHeader>View Sales</TableHeader>
                <TableHeader last>View Royalty</TableHeader>
              </tr>
            </thead>
            <div className="table-body">
            <tbody>
            {paginatedData.length > 0 ? (
         paginatedData.map((franchise, index) => {
     const totalSales = calculateTotalSales(franchise.products) + 
                        (franchise.financialRecords?.reduce((sum, record) => sum + record.royaltyAmount, 0) || 0);

     const totalPaymentPaid = franchise.products.reduce((total, product) => total + (product.paymentPaid || 0), 0) +
                               (franchise.financialRecords?.reduce((sum, record) => sum + record.amountPaid, 0) || 0);

     const totalPaymentPending = totalSales - totalPaymentPaid;

     return (
       <TableRow key={franchise._id}>
         <TableCell>{index + 1}</TableCell>
         <TableCell>{franchise.franchiseName}</TableCell>
         <TableCell>{`₹${totalSales}`}</TableCell>
         <TableCell>{`₹${totalPaymentPaid}`}</TableCell>
         <TableCell>{`₹${totalPaymentPending}`}</TableCell>
         <TableCell>
           <button 
             onClick={() => handleViewStatsClick(index)}
             disabled={totalSales === 0}
           >
             View Sales
           </button>
         </TableCell>
         <TableCell>
           <button onClick={() => setExpandedRoyaltyFranchise(index)}>
             View Royalty
           </button>
         </TableCell>
       </TableRow>
     );
   })
) : (
   <TableRow>
     <TableCell colSpan={7} style={{ textAlign: 'center' }}>
       No Franchise Data Found
     </TableCell>
   </TableRow>
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
        </>
      ) : (
         <>
          <HeaderText>Sales for {salesData[expandedFranchise]?.franchiseName}</HeaderText>
          {expandedProductIndex === null ? (
            <>
             <FilterContainer>
              <BackButtonContainer>
                <button onClick={() => setExpandedFranchise(null)}>Back</button>
              </BackButtonContainer>
              
              <FilterControlsContainer>
                <FilterSelect>
                  <InputLabel>Month</InputLabel>
                  <Select value={monthFilter} onChange={handleMonthChange}
                  sx={{
                      width: '130px',
                    }}>
                    <MenuItem value="">All</MenuItem>
                    {[...Array(12)].map((_, i) => (
                      <MenuItem key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</MenuItem>
                    ))}
                  </Select>
                </FilterSelect>

                <FilterSelect>
                  <InputLabel>Year</InputLabel>
                  <Select value={yearFilter} onChange={handleYearChange}
                   sx={{
                    width: '100px',
                  }}>
                    <MenuItem value="">All</MenuItem>
                    {yearOptions.map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FilterSelect>
              </FilterControlsContainer>
            </FilterContainer>


              <StyledTable>
                <table>
                <thead>
                  <tr>
                    <TableHeader first>S no</TableHeader>
                    <TableHeader>Product</TableHeader>
                    <TableHeader>Price</TableHeader>
                    <TableHeader>Count</TableHeader>
                    <TableHeader>Total</TableHeader>
                    <TableHeader>Payment Paid</TableHeader>
                    <TableHeader>Payment Pending</TableHeader>
                    <TableHeader>Action</TableHeader>
                    <TableHeader last>View Stats</TableHeader>
                  </tr>
                </thead>
                <div className="table-body">
                <tbody>
                  {filteredProducts.map((product, productIndex) => (
                    <TableRow key={`${salesData[expandedFranchise]?._id}-${productIndex}`}>
                      <TableCell>{productIndex + 1}</TableCell>
                      <TableCell>{product.product}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.count}</TableCell>
                      <TableCell>₹{parseFloat(product.total)}</TableCell>
                      <TableCell>₹{product.paymentPaid || 0}</TableCell>
                      <TableCell>₹{product.paymentPending || 0}</TableCell>
                      <TableCell>
                        <button onClick={() => handlePayClick(expandedFranchise, productIndex)}>Pay</button> 
                      </TableCell>
                      <TableCell>
                        <button onClick={() => setExpandedProductIndex(productIndex)} disabled={product.paymentPaid === 0}>View Stats</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
                </div>
                </table>
              </StyledTable>
            </>
        ) : (
          <>
            <button onClick={handleBackToProductsClick}>Back </button>
    
            <StyledTable>
              <table>
                <thead>
                  <tr>
                    <TableHeader first>S no</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Time</TableHeader> {/* Added Time header */}
                    <TableHeader last>Payment</TableHeader>
                  </tr>
                </thead>
                <div className="table-body">
                <tbody>
                  {salesData[expandedFranchise]?.products[expandedProductIndex]?.payments?.map((payment, paymentIndex) => {
                    const formattedDate = format(new Date(payment.date), 'dd/MM/yyyy');
                    const formattedTime = format(new Date(payment.date), 'HH:mm:ss'); // Format the time
                    return (
                      <TableRow key={`${salesData[expandedFranchise]?._id}-${expandedProductIndex}-${paymentIndex}`}>
                        <TableCell>{paymentIndex + 1}</TableCell>
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell>{formattedTime}</TableCell> {/* Display formatted time */}
                        <TableCell>₹{payment.amount}</TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
                </div>
                </table>
              </StyledTable>
          </>
        )}
      </>
    )}
      <Modal
        open={paymentModalOpen}
        onClose={handlePaymentModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <h2 id="modal-title">Enter Payment Amount</h2>
          
          <TextField
            label="Payment Amount"
            type="number"
            fullWidth
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            margin="normal"
            error={(paymentAmount !== '' && parseFloat(paymentAmount) === 0) || isNaN(parseFloat(paymentAmount))}
            helperText={(paymentAmount !== '' && parseFloat(paymentAmount) === 0) ? "Amount cannot be zero." : ""}
          />

          <Button
            onClick={handlePaymentSubmit}
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={!paymentAmount || parseFloat(paymentAmount) === 0 || isNaN(parseFloat(paymentAmount))}
          >
            Submit Payment
          </Button>
        </Box>
      </Modal>
    </TableContainer>
  );
};


export default ViewFsales;

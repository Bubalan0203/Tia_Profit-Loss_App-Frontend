import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { URL } from '../../assests/mocData/config';
import { TableBody, TextField, Button, Modal, Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

const TableContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  margin: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: white;
  margin-bottom: 20px;
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


const ViewFsales = () => {
  const [salesData, setSalesData] = useState([]);
  const [expandedFranchise, setExpandedFranchise] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [expandedProductIndex, setExpandedProductIndex] = useState(null);
  const [currentFranchiseIndex, setCurrentFranchiseIndex] = useState(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(null);

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
    {expandedFranchise === null ? (
      <>
        <HeaderText>Franchise Summary</HeaderText>
        <StyledTable>
          <thead>
            <tr>
              <TableHeader first>S no</TableHeader>
              <TableHeader>Franchise Name</TableHeader>
              <TableHeader>Total Sales</TableHeader>
              <TableHeader>Total Payment Paid</TableHeader>
              <TableHeader>Total Payment Pending</TableHeader>
              <TableHeader last>View Sales</TableHeader>
            </tr>
          </thead>
          <tbody>
            {salesData.map((franchise, index) => {
              const totalSales = calculateTotalSales(franchise.products);
              const totalPaymentPaid = franchise.products.reduce((total, product) => total + (product.paymentPaid || 0), 0);
              const totalPaymentPending = franchise.products.reduce((total, product) => total + (product.paymentPending || 0), 0);
              return (
                <TableRow key={franchise._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{franchise.franchiseName}</TableCell>
                  <TableCell>{totalSales > 0 ? `₹${totalSales}` : 'No Sales'}</TableCell>
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
                </TableRow>
              );
            })}
          </tbody>
        </StyledTable>
      </>
    ) : (
      <>
        <HeaderText>Sales for {salesData[expandedFranchise]?.franchiseName}</HeaderText>
        {expandedProductIndex === null ? (
          <>
            <button onClick={handleBackClick}>Back</button>
            <StyledTable>
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
              <tbody>
                {salesData[expandedFranchise]?.products?.map((product, productIndex) => (
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
                      <button onClick={() => setExpandedProductIndex(productIndex)}
                         disabled={product.paymentPaid===0}>View Stats</button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StyledTable>
          </>
        ) : (
          <>
            <button onClick={handleBackToProductsClick}>Back to Products</button>
            <StyledTable>
              <thead>
                <tr>
                  <TableHeader first>S no</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader last>Payment</TableHeader>
                </tr>
              </thead>
              <tbody>
                {salesData[expandedFranchise]?.products[expandedProductIndex]?.payments?.map((payment, paymentIndex) => (
                  <TableRow key={`${salesData[expandedFranchise]?._id}-${expandedProductIndex}-${paymentIndex}`}>
                    <TableCell>{paymentIndex + 1}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                  </TableRow>
                ))}
              </tbody>
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

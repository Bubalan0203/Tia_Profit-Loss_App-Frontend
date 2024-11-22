import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import styled from 'styled-components';
import NavBar from './Navbar';
import axios from 'axios';
import { URL } from '../assests/mocData/config';
import { useSnackbar } from 'notistack';

const Container = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#2b2a2f',
  color: '#fff',
});

const Content = styled(Box)({
  flex: 1,
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const FormContainer = styled(Box)({
  width: '400px',
  backgroundColor: '#222',
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiInputBase-root': {
    backgroundColor: '#000',
    color: '#fff',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#333',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#f00d88',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#f00d88',
  },
  '& .MuiInputLabel-root': {
    color: '#f00d88',
  },
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '24px',
  marginTop: '16px',
});

const SubmitButton = styled(Button)({
  backgroundColor: 'transparent',
  color: '#00a152',
  border: '1px solid #00a152',
  borderRadius: '20px',
  padding: '6px 24px',
  '&:hover': {
    backgroundColor: '#00a152',
    color: '#fff',
  },
});

const CancelButton = styled(Button)({
  backgroundColor: 'transparent',
  color: '#fff',
  border: '1px solid #b71c1c',
  borderRadius: '20px',
  padding: '6px 24px',
  '&:hover': {
    backgroundColor: '#b71c1c',
  },
});

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

const Product = () => {
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch products on component mount
  useEffect(() => {
    axios.get(`${URL}/product`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        enqueueSnackbar('Error fetching products', { variant: 'error' });
      });
  }, []);

  // Handle form submission to add a product
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new product
    axios.post(`${URL}/product`, { productName })
      .then(response => {
        setProducts([...products, response.data]); // Add new product to the state
        setProductName(''); // Reset the form
        enqueueSnackbar('Product added successfully', { variant: 'success' });
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          // Conflict status for already existing product
          enqueueSnackbar('Product already exists', { variant: 'error' });
        } else {
          enqueueSnackbar('Error adding product', { variant: 'error' });
        }
      });
  };

  // Open delete confirmation modal
  const openDeleteConfirmation = (product) => {
    setProductToDelete(product);
    setOpenDeleteModal(true);
  };

  // Handle delete product action
  const handleDelete = () => {
    if (productToDelete) {
      axios.delete(`${URL}/product/name/${encodeURIComponent(productToDelete.productName)}`)
        .then(() => {
          setProducts(products.filter((product) => product.productName !== productToDelete.productName));
          enqueueSnackbar('Product deleted successfully', { variant: 'success' });
        })
        .catch((error) => {
          enqueueSnackbar('Error deleting product', { variant: 'error' });
        });
    }
    setOpenDeleteModal(false); // Close the modal
  };

  return (
    <Container>
      <NavBar />
      <Content>
        <Typography variant="h5" sx={{ color: '#fff', alignSelf: 'flex-start', marginBottom: '16px' }}>
          Product Details
        </Typography>
        <FormContainer>
          <StyledTextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <ButtonContainer>
            <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
            <CancelButton onClick={() => setProductName('')}>Cancel</CancelButton>
          </ButtonContainer>
        </FormContainer>

        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <TableHeader first>S No</TableHeader>
                <TableHeader>Product Name</TableHeader>
                <TableHeader last>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => openDeleteConfirmation(product)}
                      variant="contained"
                      color="error"
                      style={{ textTransform: 'none' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      </Content>

      {/* Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Product;

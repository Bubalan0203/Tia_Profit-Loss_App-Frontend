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
  top: 5%;
  margin-top:0;
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
    justify-items:center;

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


const SearchInput = styled.input`
  width:auto;
  padding: 10px;
  margin-top:2%;
  margin-left:65%;
  border-radius: 5px;
  border: 1px solid #ccc;
  
`;
const NoRecordsFound = styled.tr`
  td {
    text-align: center;
    color: white;
    font-size: 18px;
    padding: 20px;
  }
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


const Product = () => {
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const recordsPerPage = 25;

  // Fetch products on component mount
  useEffect(() => {
    axios.get(`${URL}/product`)
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => {
        enqueueSnackbar('Error fetching products', { variant: 'error' });
      });
  }, []);

  // Handle filter logic
  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [searchTerm, products]);

  // Handle form submission to add a product
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${URL}/product`, { productName })
      .then(response => {
        setProducts([...products, response.data]);
        setProductName('');
        enqueueSnackbar('Product added successfully', { variant: 'success' });
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          enqueueSnackbar('Product already exists', { variant: 'error' });
        } else {
          enqueueSnackbar('Error adding product', { variant: 'error' });
        }
      });
  };

  const handleDelete = () => {
    axios
      .delete(`${URL}/product/name/${encodeURIComponent(productToDelete)}`)
      .then(() => {
        setProducts(products.filter((product) => product.productName !== productToDelete));
        setOpenDeleteModal(false);
        enqueueSnackbar('Product deleted successfully', { variant: 'success' });
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        enqueueSnackbar('Error deleting product', { variant: 'error' });
      });
  };

  // Open the delete modal with the product name
  const handleOpenDeleteModal = (productName) => {
    setProductToDelete(productName);
    setOpenDeleteModal(true);
  };

  // Close the delete modal
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setProductToDelete(null);
  };

  // Paginate filtered products
  const paginatedData = filtered.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filtered.length / recordsPerPage);

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
        <SearchInput
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        <TableContainer>
        
          <StyledTable>
            <table>
            <thead>
              <tr>
                <TableHeader first>S No</TableHeader>
                <TableHeader>Product Name</TableHeader>
                <TableHeader last>Actions</TableHeader>
              </tr>
            </thead>
          
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleOpenDeleteModal(product.productName)}
                        variant="contained"
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoRecordsFound>
                  <td colSpan="3">No records found</td>
                </NoRecordsFound>
              )}
            </tbody>
          
            </table>
          </StyledTable>

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
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this product?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Content>
    </Container>
  );
};

export default Product;

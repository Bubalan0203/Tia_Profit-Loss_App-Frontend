import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem,Select, InputLabel, FormControl, } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { URL } from '../../assests/mocData/config';

const PageContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
});

const FormContainer = styled(Box)({
  padding: '20px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '500px',
  margin: 'auto',
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

const StyledDropdown = styled(StyledTextField)({
  '& .MuiSelect-icon': {
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
  color: '#fff',
  border: '1px solid #00a152',
  borderRadius: '20px',
  padding: '6px 24px',
  '&:hover': {
    backgroundColor: '#00a152',
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

const TotalBox = styled(Box)({
  marginTop: '16px',
  padding: '12px',
  backgroundColor: '#333',
  borderRadius: '8px',
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
});

const AddFsalesForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productName, setProductName] = useState('');
  const [franchiseName, setFranchiseName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [count, setCount] = useState(1);
  const [franchiseList, setFranchiseList] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL}/product`);
        if (response.status === 200) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        enqueueSnackbar("Failed to load products.", { variant: 'error' });
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const response = await axios.get(`${URL}/franchise`);
        setFranchiseList(response.data);
      } catch (error) {
        console.error("Error fetching franchises:", error);
      }
    };
    fetchFranchises();
  }, []);

  const total = price ? (parseFloat(price) * count).toFixed(2) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation for the required fields
    if (!price || !count || !productName) {
      enqueueSnackbar("Please fill in all required fields.", { variant: 'warning' });
      return;
    }
  
    const selectedFranchise = franchiseList.find(f => f.franchiseName === franchiseName);
    if (!selectedFranchise) {
      enqueueSnackbar("Selected franchise not found.", { variant: 'warning' });
      return;
    }
  
    const total = parseFloat(price) * count;
  
    try {
      const response = await axios.post(`${URL}/franchise/${selectedFranchise.franchiseId}/sales`, {
        products: [{
          product:productName,
          price: parseFloat(price),
          count: parseInt(count),
          total: total.toFixed(2),
        }],
      });
  
      if (response.status === 200) {
        setFranchiseName('');
        setDescription('');
        setPrice('');
        setCount(1);
        enqueueSnackbar("Sales record added successfully!", { variant: 'success' });
      }
    } catch (error) {
      console.error("Error adding sales record:", error);
      enqueueSnackbar("Error adding sales record. Please try again.", { variant: 'error' });
    }
  };

  const handleCancel = () => {
    setFranchiseName('');
    setDescription('');
    setPrice('');
    setCount(1);
  };

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ color: '#fff', alignSelf: 'flex-start', marginBottom: '16px' }}>
        Franchise Sales Details
      </Typography>
      <FormContainer>
        <StyledDropdown
          select
          label="Franchise Name"
          variant="outlined"
          fullWidth
          value={franchiseName}
          onChange={(e) => setFranchiseName(e.target.value)}
        >
          {franchiseList.map((franchise) => (
            <MenuItem key={franchise.franchiseId} value={franchise.franchiseName}>
              {franchise.franchiseName}
            </MenuItem>
          ))}
        </StyledDropdown>
        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: '#f00d88' }}>Product Name</InputLabel>
          <Select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Product Name' }}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f00d88' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f00d88' },
              '& .MuiSelect-icon': {
                fontSize: '23px', // Adjust the size of the dropdown icon
                color: '#f00d88', // Color for the dropdown arrow
              }
            }}
          >
            <MenuItem value="" disabled></MenuItem>  {/* Placeholder */}
            {products.map((product) => (
              <MenuItem key={product._id} value={product.productName}>
                {product.productName} {/* Display the product name */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <StyledTextField 
          label="Price" 
          variant="outlined" 
          fullWidth 
          type="number" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
        />
        <StyledTextField 
          label="No of Count" 
          variant="outlined" 
          fullWidth 
          type="number" 
          value={count} 
          onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))} 
        />
        <TotalBox>
          Total: ₹{total}
        </TotalBox>
        <ButtonContainer>
          <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
          <CancelButton onClick={handleCancel}>
            Cancel
          </CancelButton>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default AddFsalesForm;

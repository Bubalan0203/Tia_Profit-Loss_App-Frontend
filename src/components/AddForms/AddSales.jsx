import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
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

const AddSalesForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [count, setCount] = useState(1);

  // Calculate total
  const total = price ? (parseFloat(price) * count).toFixed(2) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productName || !description || !price || !count) {
      enqueueSnackbar("Please fill in all required fields.", { variant: 'warning' });
      return;
    }

    try {
      const response = await axios.post(`${URL}/sales`, {
        productName,
        description,
        price,
        count,
        total,
      });

      if (response.status === 201) {
        enqueueSnackbar("Sales record added successfully!", { variant: 'success' });
        
        setProductName('');
        setDescription('');
        setPrice('');
        setCount(1);
      }
    } catch (error) {
      console.error("Error adding sales record:", error);
      enqueueSnackbar("Failed to add sales record.", { variant: 'error' });
    }
  };

  const handleCancel = () => {
    setProductName('');
    setDescription('');
    setPrice('');
    setCount(1);
  };

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ color: '#fff', alignSelf: 'flex-start', marginBottom: '16px' }}>
        Other Sales Details
      </Typography>
      <FormContainer>
        <StyledTextField 
          label="Product Name" 
          variant="outlined" 
          fullWidth 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
        />
        <StyledTextField 
          label="Description" 
          variant="outlined" 
          fullWidth 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
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

export default AddSalesForm;

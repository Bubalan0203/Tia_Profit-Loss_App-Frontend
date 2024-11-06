import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
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

const AddVipForm = () => {
  const [vipName, setVipName] = useState('');
  const [vipId, setVipId] = useState('');

  const [firstBusiness, setFirstBusiness] = useState(''); // Corrected field name

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post(`${URL}/vip`, {
        vipName,
        vipId,
        firstBusiness, // Use consistent field name here
      });
      console.log('VIP added successfully:', response.data);
  
      // Reset form fields after successful submission
      setVipName('');
      setVipId('');
      setFirstBusiness('');
    } catch (error) {
      console.error('Error adding VIP:', error.response?.data || error.message);
    }
  };
  
  
  

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ color: '#fff', alignSelf: 'flex-start', marginBottom: '16px' }}>
        VIP Details
      </Typography>
      <FormContainer component="form" onSubmit={handleSubmit}>
        <StyledTextField 
          label="VIP Name" 
          variant="outlined" 
          fullWidth 
          value={vipName}
          onChange={(e) => setVipName(e.target.value)}
        />
        <StyledTextField 
          label="VIP ID" 
          variant="outlined" 
          fullWidth 
          value={vipId}
          onChange={(e) => setVipId(e.target.value)}
        />
        <StyledTextField 
          label="VIP First Buisness Date" 
          variant="outlined" 
          type="date"
          fullWidth 
          value={firstBusiness}
          onChange={(e) => setFirstBusiness(e.target.value)}
          InputLabelProps={{ shrink: true }} // Ensures label stays above when date is filled
        />
        <ButtonContainer>
          <SubmitButton type="submit">Submit</SubmitButton>
          <CancelButton type="button" onClick={() => {
            setVipName('');
            setVipId('');
            setFirstBusiness('');
          }}>Cancel</CancelButton>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default AddVipForm;

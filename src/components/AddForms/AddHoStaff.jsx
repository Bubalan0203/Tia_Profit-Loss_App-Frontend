import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios'; // For making API calls
import { useSnackbar } from 'notistack'; // Snackbar for notifications
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

const AddHOSForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    hoName: '',
    hoId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${URL}/hostaff`, formData);
      enqueueSnackbar('HO Staff created successfully', { variant: 'success' });
      setFormData({ hoName: '', hoId: '' });
    } catch (error) {
      enqueueSnackbar(
      'Failed to create HO Staff',
        { variant: 'error' }
      );
    }
  };

  const handleCancel = () => {
    setFormData({ hoName: '', hoId: '' });
  };

  return (
    <PageContainer>
      <Typography 
        variant="h5" 
        sx={{ color: '#fff', alignSelf: 'flex-start', marginBottom: '16px', width: '100%', maxWidth: '500px' }}
      >
        HO Staff Details
      </Typography>
      <FormContainer component="form" onSubmit={handleSubmit}>
        <StyledTextField
          label="HO Name"
          variant="outlined"
          fullWidth
          name="hoName"
          value={formData.hoName}
          onChange={handleChange}
        />
        <StyledTextField
          label="HO ID"
          variant="outlined"
          fullWidth
          name="hoId"
          value={formData.hoId}
          onChange={handleChange}
        />
        <ButtonContainer>
          <SubmitButton type="submit">Submit</SubmitButton>
          <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default AddHOSForm;

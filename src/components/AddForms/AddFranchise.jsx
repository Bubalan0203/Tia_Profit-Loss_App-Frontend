import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useSnackbar } from 'notistack';
import axios from 'axios';
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

const AddFranchiseForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    franchiseName: '',
    franchiseId: '',
    branchName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URL}/franchise`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      enqueueSnackbar('Franchise successfully added!', { variant: 'success' });
      setFormData({ franchiseName: '', franchiseId: '', branchName: '' });
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      enqueueSnackbar('Failed to add franchise.', { variant: 'error' });
    }
  };

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ color: '#fff', alignSelf: 'flex-start', marginBottom: '16px', width: '100%', maxWidth: '500px' }}>
        Franchise Details
      </Typography>
      <FormContainer component="form" onSubmit={handleSubmit}>
        <StyledTextField
          label="Franchise Name"
          variant="outlined"
          fullWidth
          name="franchiseName"
          value={formData.franchiseName}
          onChange={handleChange}
        />
        <StyledTextField
          label="Franchise Email"
          variant="outlined"
          fullWidth
          name="franchiseId"
          value={formData.franchiseId}
          onChange={handleChange}
        />
        <StyledTextField
          label="Branch Name"
          variant="outlined"
          fullWidth
          name="branchName"
          value={formData.branchName}
          onChange={handleChange}
        />
        <ButtonContainer>
          <SubmitButton type="submit">Submit</SubmitButton>
          <CancelButton type="button" onClick={() => setFormData({ franchiseName: '', franchiseId: '', branchName: '' })}>
            Cancel
          </CancelButton>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default AddFranchiseForm;

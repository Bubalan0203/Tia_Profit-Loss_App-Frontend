import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

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
  return (
    <PageContainer>
      <Typography 
        variant="h5" 
        sx={{ color: '#fff', alignSelf: 'flex-start', marginBottom: '16px', width: '100%', maxWidth: '500px' }}
      >
        HO Staff Details
      </Typography>
      <FormContainer>
        <StyledTextField label="HO Name" variant="outlined" fullWidth />
        <StyledTextField label="HO ID" variant="outlined" fullWidth />
        <ButtonContainer>
          <SubmitButton>Submit</SubmitButton>
          <CancelButton>Cancel</CancelButton>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default AddHOSForm;

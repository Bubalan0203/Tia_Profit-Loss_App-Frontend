import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
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

const TotalBox = styled(Box)({
  marginTop: '16px',
  padding: '12px',
  backgroundColor: '#333',
  borderRadius: '8px',
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
});


const AddHoForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [hostaffList, setHostaffList] = useState([]);
  const [formData, setFormData] = useState({
    hoName: '',
    salary: '',
    daysInMonth: '',
    days: '',
    total: 0,
  });

  const fetchHostaffList = async () => {
    try {
      const response = await axios.get(`${URL}/hostaff`);
      setHostaffList(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch Hostaff list.', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchHostaffList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      if (['salary', 'daysInMonth', 'days'].includes(name)) {
        const salary = name === 'salary' ? value : prevData.salary;
        const daysInMonth = name === 'daysInMonth' ? value : prevData.daysInMonth;
        const days = name === 'days' ? value : prevData.days;

        if (salary && daysInMonth && days) {
          updatedData.total = (salary / daysInMonth) * days;
        } else {
          updatedData.total = 0;
        }
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { hoName, salary, daysInMonth, days } = formData;

    // Validate required fields
    if (!hoName || !salary || !daysInMonth || !days) {
      enqueueSnackbar('All fields are required.', { variant: 'warning' });
      return;
    }

    const selectedHostaff = hostaffList.find((hostaff) => hostaff.hoName === hoName);
    if (!selectedHostaff) {
      enqueueSnackbar('Selected Hostaff is not valid.', { variant: 'error' });
      return;
    }

    const dataToSubmit = {
      hoName,
      salary,
      daysInMonth,
      days,
      total: formData.total,
    };

    try {
      const response = await axios.post(`${URL}/hostaff/addsalary/${selectedHostaff.hoId}`, dataToSubmit);
      enqueueSnackbar('Salary added successfully!', { variant: 'success' });
      handleCancel(); // Reset form after successful submission
    } catch (error) {
      enqueueSnackbar('Failed to submit form.', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    setFormData({
      hoName: '',
      salary: '',
      daysInMonth: '',
      days: '',
      total: 0,
    });
  };

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ color: '#fff', alignSelf: 'flex-start', marginBottom: '16px' }}>
        Add Salary
      </Typography>
      <FormContainer component="form" onSubmit={handleSubmit}>
        {/* Ho Name Dropdown */}
        <StyledTextField
          select
          label="Ho Name"
          variant="outlined"
          fullWidth
          name="hoName"
          value={formData.hoName}
          onChange={handleChange}
        >
          {hostaffList.map((hostaff) => (
            <MenuItem key={hostaff.hoId} value={hostaff.hoName}>
              {hostaff.hoName}
            </MenuItem>
          ))}
        </StyledTextField>

        {/* Salary Input */}
        <StyledTextField
          label="Salary"
          variant="outlined"
          fullWidth
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />

        {/* No of Days in a Month */}
        <StyledTextField
          label="No of Days in a Month"
          variant="outlined"
          fullWidth
          type="number"
          name="daysInMonth"
          value={formData.daysInMonth}
          onChange={handleChange}
        />

        {/* No of Days Input */}
        <StyledTextField
          label="No of Days"
          variant="outlined"
          fullWidth
          type="number"
          name="days"
          value={formData.days}
          onChange={handleChange}
        />

        {/* Display Total */}
        <TotalBox>
          Total: ₹{formData.total.toFixed(2)}
        </TotalBox>

        {/* Buttons */}
        <ButtonContainer>
          <SubmitButton type="submit">Submit</SubmitButton>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};


export default AddHoForm;

import React from 'react';
import { TextField, styled } from '@mui/material';

const ExcelStyledTextField = styled(TextField)({
  width: '100%',
  margin: '1px', 
  '& .MuiInputBase-root': {
    color: 'black', 
    borderRadius: '0',
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
      border: '1px solid black',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '1px 1px',
    color: 'black', 
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
      border: '1px solid black',
    },
    '&:focus': {
      borderColor: '#6B7FFF',
      boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '1px solid black',
      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "#000000",
        border: '1px solid black',
      },
    },
    '&:hover fieldset': {
      borderColor: '#6B7FFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6B7FFF',
    },
  },
});

interface Props {
  value: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({ value, disabled, onChange }) => {
  return (
    <ExcelStyledTextField
      variant="outlined"
      size="small"
      defaultValue={value}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

export default Input;
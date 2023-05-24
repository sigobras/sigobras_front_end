import React from 'react';
import { TextField, styled } from '@mui/material';

const ExcelStyledTextField = styled(TextField)({
  width: '100%',
  '& .MuiInputBase-root': {
    color: 'black',
    borderRadius: '0',
    fontSize: '11px',
    '&:focus': {
      borderColor: '#6B7FFF',
      boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
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
  multiline: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
}

const Input: React.FC<Props> = ({ value, disabled,multiline ,onChange, type }) => {
  return (
    <ExcelStyledTextField
      variant="outlined"
      size="small"
      defaultValue={value}
      multiline = {multiline}
      disabled={disabled}
      onChange={onChange}
      type={type}
    />
  );
};

export default Input;
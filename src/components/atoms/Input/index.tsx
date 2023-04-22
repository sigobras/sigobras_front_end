import React from 'react';
import { TextField, styled } from '@mui/material';

const ExcelStyledTextField = styled(TextField)({
  width: '100%',
  '& .MuiInputBase-root': {
    padding: '0',
  },
  '& .MuiOutlinedInput-input': {
    padding: '2px 4px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '0',
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
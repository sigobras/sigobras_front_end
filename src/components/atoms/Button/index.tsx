import React from 'react';
import { Button as MUIButton } from '@mui/material';

interface Props {
  onClick: () => void;
  children?: React.ReactNode; 
  className?: string; 
}

const Button: React.FC<Props> = ({ onClick, children, className, ...props }) => {
  return (
    <MUIButton {...props} className={className} onClick={onClick}>
      {children || '+'}
    </MUIButton>
  );
};

export default Button;
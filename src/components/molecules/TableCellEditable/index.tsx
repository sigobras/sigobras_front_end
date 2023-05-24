import React from 'react';
import { TableCell, styled } from '@mui/material';
import Input from '../../atoms/Input';

const ExcelStyledTableCell = styled(TableCell)({
  padding: '0',
  border: '1px solid black',
});

interface Props {
  value: string | number | null;
  disabled: boolean;
  multiline: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
}

const TableCellEditable: React.FC<Props> = ({ value, disabled, multiline,onChange, type }) => {
  return (
    <ExcelStyledTableCell>
      <Input
        value={value !== null ? value.toString() : ''}
        disabled={disabled}
        multiline = {multiline}
        onChange={onChange}
        type={type}
      />
    </ExcelStyledTableCell>
  );
};

export default TableCellEditable;

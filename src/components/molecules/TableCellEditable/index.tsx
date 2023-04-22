import React from 'react';
import { TableCell, styled } from '@mui/material';
import Input from '../../atoms/Input';

const ExcelStyledTableCell = styled(TableCell)({
  padding: '0',
});

interface Props {
  value: string | number | null;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableCellEditable: React.FC<Props> = ({ value, disabled, onChange }) => {
  return (
    <ExcelStyledTableCell>
      <Input
        value={value !== null ? value.toString() : ''}
        disabled={disabled}
        onChange={onChange}
      />
    </ExcelStyledTableCell>
  );
};

export default TableCellEditable;

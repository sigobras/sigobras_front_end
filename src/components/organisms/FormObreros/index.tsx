import React, { useState } from 'react'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import IconButton from "@mui/material/IconButton";
import ModalObreros from './ModalObreros';

const FormObreros = ({ id_ficha }: any) => {
  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton
        data-testid="icon-button"
        sx={{
          width: 21,
          height: 21,
          borderRadius: 0,
          border: "1px solid",
          borderColor: "primary.main",
          margin: 1
        }}
        onClick={handleOpen}
      >
        <PersonAddIcon sx={{ color: "primary.main" }} />
      </IconButton>
      {
        open &&
        <ModalObreros
          open={open}
          handleClose={handleClose}
          id_ficha={id_ficha}
        />
      }

    </>
  )
}

export default FormObreros
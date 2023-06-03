import React from "react";
import { Dialog, DialogTitle, DialogContent, useTheme } from "@mui/material";
import { useWorkPositions } from "../../hooks/usePersonal";
import TablePersonalComponent from "./TablePersonalComponent";

export default function DialogPersonalComponent({
  ModalPersonal,
  toggleModalPersonal,
  id_ficha,
  codigo_obra,
}) {
  const theme = useTheme();
  if (!ModalPersonal) {
    return null; // No renderizar nada si el diálogo no está activo
  }

  return (
    <Dialog
      open={ModalPersonal}
      onClose={toggleModalPersonal}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle>{codigo_obra} - PERSONAL TECNICO DE OBRA</DialogTitle>
      <DialogContent>
        <TablePersonalComponent id_ficha={id_ficha} />
      </DialogContent>
    </Dialog>
  );
}

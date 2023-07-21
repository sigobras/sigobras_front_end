import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import ModalHistorialFormulario from './ModalHistorialFormulario';

const PersonButtonModal = ({ nombres, apellido_paterno, apellido_materno, direccion, celular, id_asignacion, id_personal, id_ficha, cargos }: any) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <TableCell >

            <Button
                onClick={handleOpen}
                disableElevation
                disableRipple
                sx={{ backgroundColor: 'transparent', textTransform: 'none', textAlign: 'left' }}
            >
                {`${nombres} ${apellido_paterno} ${apellido_materno}`}
            </Button>

            {
                open === true &&
                <ModalHistorialFormulario
                    nombres={nombres}
                    apellido_paterno={apellido_paterno}
                    apellido_materno={apellido_materno}
                    direccion={direccion}
                    celular={celular}
                    id_asignacion={id_asignacion}
                    id_personal={id_personal}
                    id_ficha={id_ficha}
                    cargos={cargos}
                    open={open}
                    handleClose={handleClose}
                />
            }

        </TableCell>
    );
};

export default PersonButtonModal;

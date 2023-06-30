import React, { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { useForm } from "react-hook-form";
import { formulario } from '../../../interfaces/CargoNoTecnico';
import FormularioPersonalNoTecnico from './FormularioPersonalNoTecnico';

const ModalFormularioPersonal = ({ onSubmit, loading, dialogTitle, data, buttonModal, cargos }: any) => {

    const form = useForm<formulario>({
        defaultValues: data ? {
            id_cargo: data.id_cargo,
            nombres: data.nombres,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
            dni: data.dni,
            fecha_nacimiento: data.fecha_nacimiento,
            direccion: data.direccion,
            celular: data.celular,
            email: data.email,
        } : {
            id_cargo: null,
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            dni: null,
            fecha_nacimiento: null,
            direccion: "",
            celular: null,
            email: "",
        }
    })

    const { control, register, handleSubmit, formState, reset } = form
    const { errors } = formState

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const handleFormSubmit = (dataFormulario: formulario) => {
        if (!!data === true) {
            const dataTotal = { dataFormulario, id: data.id_personal, id_asignacion: data.id_asignacion}

            onSubmit(dataTotal);
        } else {
            onSubmit(dataFormulario);
        }
        handleClose();
    };

    if (loading) return <div>Loading...</div>;
    return (
        <>
            {buttonModal(handleOpen)}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="child-dialog-title"
                aria-describedby="child-dialog-description"
                maxWidth="md"
                PaperProps={{
                    sx: {
                        backgroundImage: "none",
                    },
                }}
            >
                <DialogTitle id="child-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent dividers>
                    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} >
                        <FormularioPersonalNoTecnico
                            control={control}
                            register={register}
                            errors={errors}
                            cargos={cargos}
                        />
                        <DialogActions>
                            <Stack spacing={2} direction="row">
                                <Button type="submit" variant="outlined" size="small" >Grabar</Button>
                                <Button variant="outlined" size="small" color="error" onClick={handleClose}>Cerrar</Button>
                            </Stack>
                        </DialogActions>
                    </Box>
                </DialogContent>

            </Dialog>
        </>

    );
}

export default ModalFormularioPersonal
import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, DialogActions, Button } from "@mui/material";
import { useGrabarPersonalNoTecnico, usePersonal, usePersonalNoTecnico } from '../../../hooks/usePersonalNoTecnico';
import PersonalList from './PersonalList';
import ModalFormularioPersonal from './ModalFormularioPersonal';
import { formulario } from '../../../interfaces/CargoNoTecnico';

const ModalObreros = ({ open, handleClose, id_ficha }: any) => {
    const { personal, deleteAsignacion, setPersonal } = usePersonal(id_ficha);
    const cargos = usePersonalNoTecnico()
    const { loading, submit } = useGrabarPersonalNoTecnico();
    const onSubmit = async (data: formulario) => {
        const response = await submit(data, id_ficha);
        // Formatear la fecha si es una cadena
        let fechaFormateada = response.fecha_nacimiento;
        if (typeof fechaFormateada === 'string') {
            const fecha = new Date(fechaFormateada);
            fechaFormateada = fecha.toISOString().slice(0, 10);
        }

        const newPersonal = [...personal];
        response.fecha_nacimiento = fechaFormateada;
        response.id_cargo = response.id_cargos_obreros
        response.id_personal = response.id_personal_no_tecnico 

        newPersonal.unshift(response);
        setPersonal(newPersonal);
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundImage: "none",
                },
            }}
            data-testid="modal"
        >
            <DialogTitle>Perosnal no Tecnico</DialogTitle>  
            <DialogContent>
                <Box >
                    <ModalFormularioPersonal onSubmit={onSubmit} loading={loading} buttonText={'Nuevo Personal'} dialogTitle={'Nuevo Personal'}

                        buttonModal={(onClick: any) => (<Button onClick={onClick} variant="outlined" size="small">Nuevo Personal</Button>)} cargos={cargos}
                    />
                    <PersonalList listaPersonal={personal} deleteAsignacion={deleteAsignacion} setPersonal={setPersonal} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalObreros;

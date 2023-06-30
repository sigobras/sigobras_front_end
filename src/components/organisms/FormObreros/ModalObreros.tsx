import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, DialogActions, Button } from "@mui/material";
import { useGrabarPersonalNoTecnico, usePersonal, usePersonalNoTecnico } from '../../../hooks/usePersonalNoTecnico';
import PersonalList from './PersonalList';
import ModalFormularioPersonal from './ModalFormularioPersonal';
import { formulario } from '../../../interfaces/CargoNoTecnico';
import { Person } from '../../../interfaces/CargoNoTecnico';
import { List, ListItem, ListItemText } from '@mui/material';
const ModalObreros = ({ open, handleClose, id_ficha }: any) => {
    const { personal, deleteAsignacion, setPersonal, fetchPersonal } = usePersonal(id_ficha);
    const totalPersonas = personal.length;
    const cargos = usePersonalNoTecnico()
    const { loading, submit } = useGrabarPersonalNoTecnico();
    const onSubmit = async (data: formulario) => {
        await submit(data, id_ficha);
        const newPersonal = await fetchPersonal()
        setPersonal(newPersonal);
    };

    const [personalXCargo, setPersonalXCargo] = useState([])
    function contarPersonasPorCargo(personal: Person[]) {
        const conteoPorCargo: any = {};

        personal.forEach(function (persona) {
            const cargo = persona.cargo;

            if (conteoPorCargo[cargo]) {
                conteoPorCargo[cargo]++;
            } else {
                conteoPorCargo[cargo] = 1;
            }
        });

        return conteoPorCargo;
    }
    useEffect(() => {
        setPersonalXCargo(contarPersonasPorCargo(personal))
    }, [personal]);

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
            <DialogTitle>Personal no Técnico</DialogTitle>
            <DialogContent>
                <Box >

                    <List sx={{ display: 'flex', flexDirection: 'row' }}>
                        {Object.entries(personalXCargo).map(([cargo, cantidad]) => (
                            <ListItem key={cargo} sx={{ marginRight: 1 }}>
                                <ListItemText primary={cargo} secondary={`Cantidad: ${cantidad}`} />
                            </ListItem>

                        ))}
                        <ListItem sx={{ marginRight: 1 }}>
                            <ListItemText primary={'Total'} secondary={`Cantidad: ${totalPersonas}`} />
                        </ListItem>
                    </List>

                    <ModalFormularioPersonal onSubmit={onSubmit} loading={loading} buttonText={'Nuevo Personal'} dialogTitle={'Nuevo Personal'}

                        buttonModal={(onClick: any) => (<Button onClick={onClick} variant="outlined" size="small">Nuevo Personal</Button>)} cargos={cargos}
                    />
                    <PersonalList listaPersonal={personal} deleteAsignacion={deleteAsignacion} setPersonal={setPersonal} fetchPersonal={fetchPersonal} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalObreros;

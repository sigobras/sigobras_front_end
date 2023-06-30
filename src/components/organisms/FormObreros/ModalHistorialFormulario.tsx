import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useHistorialPersonalNoTecnico } from '../../../hooks/usePersonalNoTecnico';
import HistorialFormulario from './HistorialFormulario';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    overflowX: 'auto',
};

const ModalHistorialFormulario = ({ nombres, apellido_paterno, apellido_materno, direccion, celular, id_asignacion, id_personal, id_ficha, cargos, open, handleClose }: any) => {

    const { submit, historial, setHistorial, useHistorial, borrarHistorialPersonalNoTecnico } = useHistorialPersonalNoTecnico(id_personal, id_ficha);
    useHistorial();
    async function agregarHistorial() {
        const fechaActual = new Date();
        const mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11, por eso se suma 1
        const dia = fechaActual.getDate();
        const anio = fechaActual.getFullYear();

        // Formatear el mes y el día con ceros a la izquierda si son menores a 10
        const mesFormateado = mes < 10 ? `0${mes}` : mes;
        const diaFormateado = dia < 10 ? `0${dia}` : dia;

        const fechaFormateada = `${anio}-${mesFormateado}-${diaFormateado}`;
        const nuevaData = await submit(
            {
                dias_trabajados: 0,
                mes_ano: fechaFormateada,
                id_asignacion
            }
        )

        const newHistorial = [...historial]
        newHistorial.unshift(
            {
                dias_trabajados: 0,
                mes_ano: fechaFormateada,
                id_asignacion,
                id_cargo: nuevaData.id_cargo
            }
        )

        setHistorial(newHistorial)
    }
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} >
                    <Grid container spacing={3}>
                        <Grid xs={12} sm={3} md={3}>
                            <Box component="img"
                                src="https://cdn-icons-png.flaticon.com/256/4440/4440919.png"
                                alt="ReactJS Wallpaper"
                                sx={{ width: '70%', height: '90%', objectFit: 'cover' }}
                            />
                        </Grid>
                        <Grid xs={12} sm={3} md={3}>
                            <Typography gutterBottom variant="h6" component="div">
                                Nombre Completo
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`${nombres} ${apellido_paterno} ${apellido_materno}`}
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={3} md={3}>
                            <Typography gutterBottom variant="h6" component="div">
                                Celular
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`${celular}`}
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={3} md={3}>
                            <Typography gutterBottom variant="h6" component="div">
                                Direccion
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`${direccion}`}
                            </Typography>
                        </Grid>
                        <Grid xs={12} sm={12} md={12}>
                            <Button type="submit" variant="outlined" size="small"
                                onClick={agregarHistorial}
                            >Agregar Historial</Button>
                        </Grid>

                        {
                            historial.map((item) =>
                                <HistorialFormulario
                                    item={item}
                                    cargos={cargos}
                                    key={item.id_historial}
                                    borrarHistorialPersonalNoTecnico={borrarHistorialPersonalNoTecnico}
                                />
                            )
                        }
                    </Grid>
                </Box>
            </Modal>
        </>
    );
};

export default ModalHistorialFormulario;

import React, { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useUpdateHistorial } from '../../../hooks/usePersonalNoTecnico';

const HistorialFormulario = ({ item, borrarHistorialPersonalNoTecnico, nombreCargo }: any) => {
    const [valueForm, setValueForm] = useState({
        mes_ano: item.mes_ano.slice(0, 7),
        dias_trabajados: item.dias_trabajados,
    })

    const handleFieldChange = (field: any, value: any) => {
        setValueForm((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }

    const handleOnBlur = (field: any, value: any) => {
        const { updateHistorial } = useUpdateHistorial(item.id_historial, field, value)
        updateHistorial()
    }

    return (
        <>
            <Grid xs={12} sm={4} md={4}>
                <TextField
                    fullWidth
                    type="text"
                    id="demo-simple-select"
                    label="Cargo"
                    variant="outlined"
                    disabled
                    value={nombreCargo(item.id_cargo)}
                />
            </Grid>

            <Grid xs={12} sm={4} md={4}>
                <TextField
                    fullWidth
                    value={valueForm.mes_ano}
                    onChange={event => {
                        handleOnBlur('mes_ano', event.target.value)
                        handleFieldChange('mes_ano', event.target.value)
                    }}
                    type="month"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>

            <Grid xs={12} sm={3} md={3}>
                <TextField
                    fullWidth
                    type="number"
                    id="outlined-basic"
                    label="Dias Trabajados"
                    variant="outlined"
                    value={valueForm.dias_trabajados}
                    onChange={event => handleFieldChange('dias_trabajados', event.target.value)}
                    onBlur={event => handleOnBlur('dias_trabajados', event.target.value)}
                />
            </Grid>
            <Grid xs={12} sm={1} md={1}>
                <IconButton
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        borderColor: "primary.main",
                        margin: 0
                    }}
                    onClick={() => borrarHistorialPersonalNoTecnico(item.id_historial)}
                >
                    <DeleteOutlineIcon sx={{ color: "red" }} />
                </IconButton>
            </Grid>
        </>
    );
};

export default HistorialFormulario;

import React from 'react'
import {
    Box,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    TextField,
    Grid,
    FormHelperText,
} from '@mui/material';

import { Controller } from "react-hook-form";
import { CargoNoTecnico } from '../../../interfaces/CargoNoTecnico';

const FormularioPersonalNoTecnico = ({
    control,
    register,
    errors,
    cargos,
}: any) => {

    return (
        <>
            <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12}>
                    <Box marginBottom={2} padding={2}>
                        <FormControl fullWidth error={!!errors.id_cargo}>
                            <InputLabel id="demo-simple-select-label">Cargo</InputLabel>
                            <Controller
                                name="id_cargo"
                                control={control}
                                rules={{ required: 'Cargo es requerido' }}
                                render={({ field }) => (
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Cargo"
                                        {...field}
                                    >
                                        {cargos.map((cargo: CargoNoTecnico) => (
                                            <MenuItem key={cargo.id} value={cargo.id}>
                                                {cargo.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />

                            {errors.id_cargo && <FormHelperText>{errors.id_cargo?.message}</FormHelperText>}
                        </FormControl>
                    </Box>

                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Box marginBottom={2} paddingX={2}>
                        <TextField
                            fullWidth
                            type="text"
                            id="outlined-basic"
                            label="Nombres"
                            variant="outlined"
                            {...register("nombres", {
                                required: "Nombre es requerido"
                            })}
                            error={!!errors.nombres}
                            helperText={errors.nombres?.message}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Box marginBottom={2} paddingX={2}>
                        <TextField
                            fullWidth
                            type="text"
                            id="outlined-basic"
                            label="Apellido Paterno"
                            variant="outlined"
                            {...register("apellido_paterno", {
                                required: "Apellido es requerido"
                            })}
                            error={!!errors.apellido_paterno}
                            helperText={errors.apellido_paterno?.message}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Box marginBottom={2} paddingX={2}>
                        <TextField
                            fullWidth
                            type="text"
                            id="outlined-basic"
                            label="Apellido Materno"
                            variant="outlined"
                            {...register("apellido_materno", {
                                required: "Apellido es requerido"
                            })}
                            error={!!errors.apellido_materno}
                            helperText={errors.apellido_materno?.message}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Box marginBottom={2} paddingX={2}>
                        <TextField
                            fullWidth
                            type="number"
                            id="outlined-basic"
                            label="DNI"
                            variant="outlined"
                            {...register("dni", {
                                required: "DNI es requerido",
                                maxLength: { value: 8, message: "DNI no debe tener más de 8 dígitos" },
                                minLength: { value: 8, message: "DNI debe tener 8 dígitos" }
                            })}
                            error={!!errors.dni}
                            helperText={errors.dni && errors.dni.message}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Box marginBottom={2} paddingX={2}>
                        <TextField
                            fullWidth
                            id="date"
                            label="Fecha de Nacimiento"
                            type="date"
                            {...register("fecha_nacimiento", {
                                required: "Fecha de Nacimiento es requerido"
                            })}
                            error={!!errors.fecha_nacimiento}
                            helperText={errors.fecha_nacimiento?.message}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Box marginBottom={2} paddingX={2}>
                        <TextField
                            fullWidth
                            type="text"
                            id="outlined-basic"
                            label="Dirección"
                            variant="outlined"
                            {...register("direccion", {
                                required: "Direccion es requerido"
                            })}
                            error={!!errors.direccion}
                            helperText={errors.direccion?.message}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Box marginBottom={2} paddingX={2}>
                        <TextField
                            fullWidth
                            type="number"
                            id="outlined-basic"
                            label="Celular"
                            variant="outlined"
                            {...register("celular", {
                                required: "Celular es requerido",
                                maxLength: { value: 9, message: "Celular no debe tener más de 9 dígitos" },
                                minLength: { value: 9, message: "Celular debe tener 9 dígitos" }
                            })}
                            error={!!errors.celular}
                            helperText={errors.celular && errors.celular.message}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Box marginBottom={2} paddingX={2}>
                        <TextField
                            fullWidth
                            type="email"
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            {...register("email", {
                                pattern: {
                                    value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                    message: "Por favor, introduce un email válido"
                                }
                            })}
                            error={!!errors.email}
                            helperText={errors.email && errors.email.message}
                        />
                    </Box>
                </Grid>
            </Grid>


        </>
    );
}

export default FormularioPersonalNoTecnico
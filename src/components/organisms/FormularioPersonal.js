import React, { useState } from "react";
import { Grid, TextField, Button, FormGroup, Box } from "@mui/material";
import { useCargosLimitados } from "../../hooks/usePersonal";

function FormularioPersonal() {
  const [dataFormulario, setDataFormulario] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    dni: "",
    direccion: "",
    email: "",
    celular: "",
    cpt: "",
    fecha_inicio: "",
  });
  const cargosLimitados = useCargosLimitados(3);

  const onChangeInputFormulario = (field, value) => {
    setDataFormulario((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const saveUsuario = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para guardar el usuario
    console.log("Usuario guardado:", dataFormulario);
  };

  return (
    <Box maxWidth="600px" mx="auto">
      <form onSubmit={saveUsuario}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="CARGO *"
              value={dataFormulario.idCargoSeleccionado}
              onChange={(e) =>
                onChangeInputFormulario("idCargoSeleccionado", e.target.value)
              }
              fullWidth
              required
            >
              <option disabled hidden value="">
                SELECCIONE
              </option>
              {cargosLimitados.map((item, i) => (
                <option key={i} value={item.id_Cargo}>
                  {item.nombre}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Nombre *"
              value={dataFormulario.nombre}
              onChange={(e) =>
                onChangeInputFormulario("nombre", e.target.value)
              }
              fullWidth
              error={!dataFormulario.nombre}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Apellido Paterno *"
              value={dataFormulario.apellido_paterno}
              onChange={(e) =>
                onChangeInputFormulario("apellido_paterno", e.target.value)
              }
              fullWidth
              error={!dataFormulario.apellido_paterno}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Apellido Materno *"
              value={dataFormulario.apellido_materno}
              onChange={(e) =>
                onChangeInputFormulario("apellido_materno", e.target.value)
              }
              fullWidth
              error={!dataFormulario.apellido_materno}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="DNI *"
              value={dataFormulario.dni}
              onChange={(e) => onChangeInputFormulario("dni", e.target.value)}
              fullWidth
              error={dataFormulario.dni.length !== 8}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Dirección *"
              value={dataFormulario.direccion}
              onChange={(e) =>
                onChangeInputFormulario("direccion", e.target.value)
              }
              fullWidth
              error={!dataFormulario.direccion}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              value={dataFormulario.email}
              onChange={(e) =>
                onChangeInputFormulario("email", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="N° Celular *"
              value={dataFormulario.celular}
              onChange={(e) =>
                onChangeInputFormulario("celular", e.target.value)
              }
              fullWidth
              error={dataFormulario.celular.length !== 9}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Código de colegiatura"
              value={dataFormulario.cpt}
              onChange={(e) =>
                onChangeInputFormulario("cpt", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha de inicio"
              type="date"
              value={dataFormulario.fecha_inicio}
              onChange={(e) =>
                onChangeInputFormulario("fecha_inicio", e.target.value)
              }
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Guardar Usuario
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default FormularioPersonal;

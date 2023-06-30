import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PersonButtonModal from './PersonButtonModal';
import IconButton from "@mui/material/IconButton";
import ModalFormularioPersonal from './ModalFormularioPersonal';
import { editPersonal, usePersonalNoTecnico } from '../../../hooks/usePersonalNoTecnico';
import { formatearFechaDiaMesAnio } from '../../../js/components/Utils/Funciones';

const PersonalList = ({ listaPersonal, deleteAsignacion, setPersonal, fetchPersonal }: any) => {
  const cargos = usePersonalNoTecnico()

  const onSubmit = async (data: any) => {

    await editPersonal(data.id, data.dataFormulario, data.id_asignacion, data.dataFormulario.id_cargo);

    const newListaPersonal = await fetchPersonal()
    setPersonal(newListaPersonal)

  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Personal No Técnico</TableCell>
            <TableCell align="left">DNI</TableCell>
            <TableCell align="left">Cargo</TableCell>
            <TableCell align="left">Fecha de Nacimiento</TableCell>
            <TableCell align="left">Dirección</TableCell>
            <TableCell align="left">Celular</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Opciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listaPersonal.map((personal: any, index: number) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <PersonButtonModal
                nombres={personal.nombres}
                apellido_paterno={personal.apellido_paterno}
                apellido_materno={personal.apellido_materno}
                direccion={personal.direccion}
                celular={personal.celular}
                id_asignacion={personal.id_asignacion}
                id_personal={personal.id_personal}
                id_ficha={personal.id_ficha}
                cargos={cargos}
              />
              <TableCell align="left">{personal.dni}</TableCell>
              <TableCell align="left">{personal.cargo}</TableCell>
              <TableCell align="left">{formatearFechaDiaMesAnio(personal.fecha_nacimiento)}</TableCell>
              <TableCell align="left">{personal.direccion}</TableCell>
              <TableCell align="left">{personal.celular}</TableCell>
              <TableCell align="left">{personal.email}</TableCell>
              <TableCell align="left">
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ModalFormularioPersonal onSubmit={onSubmit} dialogTitle={'Edicion de Personal'} data={personal} key={JSON.stringify(personal)}
                    buttonModal={(onClick: any) => (<IconButton
                      sx={{
                        width: 25,
                        height: 25,
                        borderRadius: 2,
                        borderColor: "primary.main",
                        margin: 0
                      }}
                      onClick={onClick}
                    >
                      <EditNoteIcon sx={{ color: "green" }} />
                    </IconButton>)}
                    cargos={cargos}
                  />
                  <IconButton
                    sx={{
                      width: 25,
                      height: 25,
                      borderRadius: 2,
                      borderColor: "primary.main",
                      margin: 0
                    }}
                    onClick={() => deleteAsignacion(personal.id_asignacion)}
                  >
                    <DeleteOutlineIcon sx={{ color: "red" }} />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PersonalList;

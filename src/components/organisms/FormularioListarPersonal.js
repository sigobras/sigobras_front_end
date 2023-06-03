import React, { useState } from "react";
import {
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { FaMediumM, FaUpload } from "react-icons/fa";
import { DescargarArchivo } from "../../js/components/Utils/Funciones";
import { UrlServer } from "../../utils/ServerUrlConfig";
import {
  useUsuariosPersonal,
  useUsuariosPersonalInactivos,
} from "../../hooks/usePersonal";

const PersonalTable = ({ data, updateHabilitado, uploadFile }) => {
  const handleUpdateHabilitado = (id_asignacion, habilitado) => {
    updateHabilitado(id_asignacion, habilitado);
  };

  const handleUploadFile = (id_acceso) => {
    uploadFile(id_acceso);
  };

  const handleDownloadFile = (memorandum) => {
    DescargarArchivo(`${UrlServer}${memorandum}`);
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>PERSONAL</TableCell>
          <TableCell>CARGO</TableCell>
          <TableCell>CELULAR</TableCell>
          <TableCell>DNI</TableCell>
          <TableCell>EMAIL</TableCell>
          <TableCell>OPCIONES</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell style={{ fontSize: "12px" }}>
              {item.nombre +
                " " +
                item.apellido_paterno +
                " " +
                item.apellido_materno}
            </TableCell>
            <TableCell style={{ fontSize: "12px" }}>
              {item.cargo_nombre}
            </TableCell>
            <TableCell style={{ fontSize: "12px" }}>{item.celular}</TableCell>
            <TableCell style={{ fontSize: "12px" }}>{item.dni}</TableCell>
            <TableCell style={{ fontSize: "12px" }}>{item.email}</TableCell>
            <TableCell>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  size="small"
                  variant="outlined"
                  color={item.habilitado ? "error" : "success"}
                  onClick={() =>
                    handleUpdateHabilitado(item.id_asignacion, item.habilitado)
                  }
                >
                  {item.habilitado ? "Deshabilitar" : "Habilitar"}
                </Button>
                <Button size="small" variant="outlined" color="primary">
                  Editar
                </Button>

                {item.memorandum && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDownloadFile(item.memorandum)}
                  >
                    <FaMediumM size={15} color="#2676bb" />
                  </Button>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleUploadFile(item.id_acceso)}
                >
                  <FaUpload size={10} color="#ffffff" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const FormularioListarPersonal = ({ id_ficha, cargos_tipo_id }) => {
  const [modalPersonalInactivo, setModalPersonalInactivo] = useState(false);
  const UsuariosPersonal = useUsuariosPersonal(id_ficha, cargos_tipo_id);
  const UsuariosPersonalInactivos = useUsuariosPersonalInactivos(
    id_ficha,
    cargos_tipo_id
  );

  const toggleModalPersonalInactivo = () => {
    setModalPersonalInactivo(!modalPersonalInactivo);
  };

  const uploadFile = (id_acceso) => {
    // Lógica para subir un archivo
  };

  const updateHabilitado = (id_asignacion, habilitado) => {
    // Lógica para habilitar o deshabilitar el personal
  };

  return (
    <div>
      <PersonalTable
        data={UsuariosPersonal}
        updateHabilitado={updateHabilitado}
        uploadFile={uploadFile}
      />
      {UsuariosPersonalInactivos.length > 0 && (
        <Button
          size="small"
          color="primary"
          onClick={toggleModalPersonalInactivo}
          sx={{ marginBottom: "1rem" }}
          variant="outlined"
        >
          PERSONAL INACTIVO
        </Button>
      )}
      <Collapse
        in={modalPersonalInactivo}
        sx={{ maxHeight: "250px", overflowY: "auto" }}
      >
        <PersonalTable
          data={UsuariosPersonalInactivos}
          updateHabilitado={updateHabilitado}
          uploadFile={uploadFile}
        />
      </Collapse>
    </div>
  );
};

export default FormularioListarPersonal;

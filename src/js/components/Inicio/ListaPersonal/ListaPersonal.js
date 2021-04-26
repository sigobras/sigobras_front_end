import React, { useState, useEffect } from "react";
import axios from "axios";
import { Collapse, TabPane, Button } from "reactstrap";
import { FaMediumM, FaUpload } from "react-icons/fa";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { DescargarArchivo } from "../../Utils/Funciones";
import FormularioPersonal from "./FormularioPersonal";

export default ({ id_ficha, UsuarioData, cargos_tipo_id, Permisos }) => {
  useEffect(() => {
    fetchUsuariosPersonal();
    fetchUsuariosPersonalInactivos();
    return () => {};
  }, []);
  const [UsuariosPersonal, setUsuariosPersonal] = useState([]);
  async function fetchUsuariosPersonal() {
    var res = await axios.get(`${UrlServer}/v1/usuarios`, {
      params: {
        id_ficha: id_ficha,
        habilitado: true,
        cargos_tipo_id: cargos_tipo_id,
        sort_by: "cargos_tipo_id,nivel",
      },
    });
    setUsuariosPersonal(res.data);
  }
  //personal inactivo
  const [UsuariosPersonalInactivos, setUsuariosPersonalInactivos] = useState(
    []
  );
  async function fetchUsuariosPersonalInactivos() {
    var request = await axios.get(`${UrlServer}/v1/usuarios`, {
      params: {
        id_ficha: id_ficha,
        habilitado: false,
        cargos_tipo_id: cargos_tipo_id,
      },
    });
    setUsuariosPersonalInactivos(request.data);
  }
  const [ModalPersonalInactivo, setModalPersonalInactivo] = useState(false);
  function toggleModalPersonalInactivo() {
    setModalPersonalInactivo(!ModalPersonalInactivo);
  }
  function recargar() {
    fetchUsuariosPersonal();
    fetchUsuariosPersonalInactivos();
  }
  return (
    <div>
      <TabPane
        style={{
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <table className="table table-sm small">
          <thead>
            <tr>
              <th></th>
              <th>PERSONAL</th>
              <th>CARGO</th>
              <th>CELULAR</th>
              <th>DNI</th>
              <th>EMAIL</th>
              <th colSpan="2">OPCIONES</th>
            </tr>
          </thead>
          <tbody>
            {UsuariosPersonal.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  {item.nombre +
                    " " +
                    item.apellido_paterno +
                    " " +
                    item.apellido_materno}
                </td>
                <td>{item.cargo_nombre}</td>
                <td>{item.celular}</td>
                <td>{item.dni}</td>
                <td>{item.email}</td>
                <td>
                  {Permisos["actualizar_habilitarpersonal"] == 1 && (
                    <HabilitarButton item={item} recargar={recargar} />
                  )}
                </td>
                <td>
                  {Permisos["actualizar_datospersonal"] == 1 && (
                    <FormularioPersonal
                      id_ficha={id_ficha}
                      dataPersonal={item}
                      recargar={recargar}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TabPane>
      <TabPane>
        {UsuariosPersonalInactivos.length > 0 && (
          <Button
            color="primary"
            onClick={() => toggleModalPersonalInactivo()}
            style={{ marginBottom: "1rem" }}
          >
            PERSONAL INACTIVO
          </Button>
        )}

        <Collapse
          isOpen={ModalPersonalInactivo}
          style={{
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          <table className="table table-sm small">
            <thead>
              <tr>
                <th></th>
                <th>PERSONAL</th>
                <th></th>
                <th></th>
                <th>CARGO</th>
                <th>CELULAR</th>
                <th>DNI</th>
                <th>EMAIL</th>
                <th>OPCIONES</th>
              </tr>
            </thead>
            <tbody>
              {UsuariosPersonalInactivos.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    {item.nombre +
                      " " +
                      item.apellido_paterno +
                      " " +
                      item.apellido_materno}
                  </td>
                  <td>
                    {Permisos["actualizar_memorandumpersonal"] == 1 && (
                      <div
                        onClick={() => uploadFile(item.id_acceso)}
                        style={{
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        <FaUpload size={10} color={"#ffffff"} />
                      </div>
                    )}
                  </td>
                  <td>
                    {item.memorandum !== null && (
                      <div
                        className="text-primary"
                        title="descargar memorandum"
                        onClick={() =>
                          DescargarArchivo(`${UrlServer}${item.memorandum}`)
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <FaMediumM size={15} color={"#2676bb"} />
                      </div>
                    )}
                  </td>
                  <td>{item.cargo_nombre}</td>
                  <td>{item.celular}</td>
                  <td>{item.dni}</td>
                  <td>{item.email}</td>
                  <td>
                    {Permisos["actualizar_habilitarpersonal"] == 1 && (
                      <HabilitarButton item={item} recargar={recargar} />
                    )}
                  </td>
                  <td>
                    {Permisos["actualizar_datospersonal"] == 1 && (
                      <FormularioPersonal
                        id_ficha={id_ficha}
                        dataPersonal={item}
                        recargar={recargar}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Collapse>
      </TabPane>
    </div>
  );
};
function HabilitarButton({ item, recargar }) {
  //update habilitado
  async function updateHabilitado(id, habilitado) {
    if (confirm("Esta seguro de cambiar el estado del usuario")) {
      var res = await axios.put(`${UrlServer}/v1/usuarios/${id}/habilitado`, {
        habilitado: !habilitado,
      });
      recargar();
    }
  }
  return (
    <div>
      {item.habilitado ? (
        <Button
          outline
          color="danger"
          onClick={() => updateHabilitado(item.id_asignacion, item.habilitado)}
        >
          deshabilitar
        </Button>
      ) : (
        <Button
          outline
          color="primary"
          onClick={() => updateHabilitado(item.id_asignacion, item.habilitado)}
        >
          habilitar
        </Button>
      )}
    </div>
  );
}

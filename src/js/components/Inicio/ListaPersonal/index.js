import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Input,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  ListGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import { FaUserFriends, FaMediumM, FaUpload, FaSave } from "react-icons/fa";

import Usuario from "../../../../images/usuario.png";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import FormularioPersonal from "./FormularioPersonal";
import UsuarioDetalles from "./UsuarioDetalles";

export default ({ id_ficha, codigo_obra }) => {
  const hiddenFileInput = useRef(null);
  //modal personal
  const [ModalPersonal, setModalPersonal] = useState(false);
  function toggleModalPersonal() {
    setModalPersonal(!ModalPersonal);
    if (!ModalPersonal) {
      fetchCargosPersonal();
      fetchUsuarioData();
      setIdCargoSeleccionado(0);
    }
  }
  //getcargos
  const [CargosPersonal, setCargosPersonal] = useState([]);
  async function fetchCargosPersonal() {
    var res = await axios.get(`${UrlServer}/v1/cargos/obra`, {
      params: {
        id_ficha: id_ficha,
        cargos_tipo_id: 3,
      },
    });
    setCargosPersonal(res.data);
  }
  //get usuarios
  const [UsuariosPersonal, setUsuariosPersonal] = useState([]);
  const [IdCargoSeleccionado, setIdCargoSeleccionado] = useState(-1);
  async function fetchUsuariosPersonal() {
    var res = await axios.get(`${UrlServer}/v1/usuarios`, {
      params: {
        id_ficha: id_ficha,
        id_cargo: IdCargoSeleccionado,
        habilitado: true,
        cargos_tipo_id: 3,
      },
    });
    setUsuariosPersonal(res.data);
  }
  //input file
  const [idDesignacion, setidDesignacion] = useState(0);
  async function uploadFile(id) {
    await setidDesignacion(id);
    hiddenFileInput.current.click();
  }
  async function onChangeInputFile(e) {
    if (confirm("desea subir el memorandum seleccionado?")) {
      const formData = new FormData();
      formData.append("memorandum", e.target.files[0]);
      e.target.value = null;
      formData.append("obra_codigo", codigo_obra);
      formData.append("id", idDesignacion);
      formData.append("id_ficha", id_ficha);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const res = await axios.put(
        `${UrlServer}/v1/designaciones/${idDesignacion}/memorandum`,
        formData,
        config
      );
      console.log(res.data);
      cargarHistorialPersonal();
    } else {
      e.target.value = null;
    }
  }
  function DescargarArchivo(data) {
    if (confirm("Desea descargar el memorandum?")) {
      const url = data;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data, "target", "_blank");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
    }
  }

  //personal inactivo
  const [UsuariosPersonalInactivos, setUsuariosPersonalInactivos] = useState(
    []
  );
  async function fetchUsuariosPersonalInactivos() {
    var request = await axios.get(`${UrlServer}/v1/usuarios`, {
      params: {
        id_ficha: id_ficha,
        id_cargo: IdCargoSeleccionado,
        habilitado: false,
        cargos_tipo_id: 3,
      },
    });
    setUsuariosPersonalInactivos(request.data);
  }
  const [ModalPersonalInactivo, setModalPersonalInactivo] = useState(false);
  function toggleModalPersonalInactivo() {
    setModalPersonalInactivo(!ModalPersonalInactivo);
  }

  //recargar
  function recargar() {
    fetchCargosPersonal();
    fetchUsuariosPersonal();
    fetchUsuariosPersonalInactivos();
  }
  //UsuarioData
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const request = await axios.get(
      `${UrlServer}/v1/usuarios/obra/${sessionStorage.getItem(
        "idobra"
      )}/acceso/${sessionStorage.getItem("idacceso")}`
    );
    console.log("fetchUsuarioData", request.data);
    setUsuarioData(request.data);
  }

  //nueva interfaz
  const [HistorialPersonal, setHistorialPersonal] = useState([]);
  async function cargarHistorialPersonal() {
    const res = await axios.get(`${UrlServer}/v1/designaciones`, {
      params: {
        id_ficha,
        id_cargo: IdCargoSeleccionado,
      },
    });
    setHistorialPersonal(res.data);
  }
  const handleInputChange = (index, name, value) => {
    var clone = [...HistorialPersonal];
    clone[index][name] = value;
    setHistorialPersonal(clone);
  };
  async function guardarDesignaciones(index) {
    var clone = [...HistorialPersonal];
    console.log(clone, index);
    const res = await axios.put(
      `${UrlServer}/v1/designaciones/${clone[index].id}`,
      {
        fecha_inicio: clone[index].fecha_inicio,
        fecha_final: clone[index].fecha_final,
      }
    );
    alert("Registro exitoso");
    cargarHistorialPersonal();
  }
  async function guardarDesignacionesNull(index, name) {
    try {
      var clone = [...HistorialPersonal];
      clone[index][name] = "";
      setHistorialPersonal(clone);
      const res = await axios.put(
        `${UrlServer}/v1/designaciones/${clone[index].id}`,
        {
          fecha_inicio: clone[index].fecha_inicio,
          fecha_final: clone[index].fecha_final,
          tipoUndefined: true,
        }
      );
      setHistorialPersonal(clone);
      cargarHistorialPersonal();
    } catch (error) {
      alert("Ocurrio un error");
    }
  }
  useEffect(() => {
    if (IdCargoSeleccionado != -1) {
      recargar();
      cargarHistorialPersonal();
    }
  }, [IdCargoSeleccionado]);
  return (
    <div>
      <button
        className="btn btn-outline-info btn-sm mr-1"
        title="Personal"
        onClick={() => toggleModalPersonal()}
      >
        <FaUserFriends />
      </button>
      <Modal isOpen={ModalPersonal} toggle={toggleModalPersonal} size="lg">
        <ModalHeader>{codigo_obra} - PERSONAL TECNICO DE OBRA</ModalHeader>
        <ModalBody>
          <div className="card">
            <Nav tabs>
              {CargosPersonal && [
                CargosPersonal.map((item, i) => (
                  <NavItem key={i}>
                    <NavLink
                      active={IdCargoSeleccionado === item.id_cargo}
                      onClick={() => {
                        setIdCargoSeleccionado(item.id_cargo);
                      }}
                    >
                      {item.cargo_nombre.toUpperCase()}
                    </NavLink>
                  </NavItem>
                )),
                <NavItem key="listapersonal">
                  <NavLink
                    active={IdCargoSeleccionado == 0}
                    onClick={() => {
                      setIdCargoSeleccionado(0);
                    }}
                    style={{
                      background: "orange",
                    }}
                  >
                    LISTA PERSONAL
                  </NavLink>
                </NavItem>,
              ]}
            </Nav>

            {IdCargoSeleccionado == 0 ? (
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
                          <td>{item.nombre_usuario}</td>
                          <td>{item.cargo_nombre}</td>
                          <td>{item.celular}</td>
                          <td>{item.dni}</td>
                          <td>{item.email}</td>
                          <td>
                            {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                              UsuarioData.cargo_nombre ==
                                "EDITOR DE PERSONAL" ||
                              UsuarioData.cargo_nombre ==
                                "ADMINISTRADOR GENERAL") && (
                              <HabilitarButton
                                item={item}
                                recargar={recargar}
                              />
                            )}
                          </td>
                          <td>
                            {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                              UsuarioData.cargo_nombre ==
                                "EDITOR DE PERSONAL" ||
                              UsuarioData.cargo_nombre ==
                                "ADMINISTRADOR GENERAL") && (
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
                    {IdCargoSeleccionado != 0 ? (
                      UsuariosPersonalInactivos.map((usuarios, IdUsuario) => (
                        <div
                          className="row no-gutters position-relative"
                          key={IdUsuario}
                        >
                          <div className="col-md-3 mb-md-0 p-md-4">
                            <div
                              style={{
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                            >
                              <img
                                src={Usuario}
                                className="w-75"
                                alt="users sigobras"
                              />
                            </div>
                            <div>
                              {usuarios.memorandum !== null && (
                                <div
                                  className="text-primary"
                                  title="descargar memorandum"
                                  onClick={() =>
                                    DescargarArchivo(
                                      `${UrlServer}${usuarios.memorandum}`
                                    )
                                  }
                                  style={{
                                    position: "absolute",
                                    top: "12px",
                                    right: "29px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <FaMediumM size={15} color={"#dc3545"} />
                                </div>
                              )}
                            </div>
                            <div
                              onClick={() => uploadFile(usuarios.id_acceso)}
                              style={{
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                            >
                              <FaUpload size={15} color={"#dc3545"} />
                            </div>
                          </div>
                          <div className="col-md-9 position-static p-4 pl-md-0">
                            <ListGroup>
                              <b>{usuarios.nombre_usuario}</b>
                              <b>CELULAR N° </b> <span>{usuarios.celular}</span>
                              <b>DNI </b> <span>{usuarios.dni}</span>
                              <b>EMAIL </b> <span>{usuarios.email}</span>
                              <b>DIRECCION </b>{" "}
                              <span>{usuarios.direccion}</span>
                              <b>N° COLEGIATURA </b> <span>{usuarios.cpt}</span>
                            </ListGroup>
                          </div>
                        </div>
                      ))
                    ) : (
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
                              <td>{item.nombre_usuario}</td>
                              <td>
                                <div
                                  onClick={() => uploadFile(item.id_acceso)}
                                  style={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <FaUpload size={10} color={"#ffffff"} />
                                </div>
                              </td>
                              <td>
                                {item.memorandum !== null && (
                                  <div
                                    className="text-primary"
                                    title="descargar memorandum"
                                    onClick={() =>
                                      DescargarArchivo(
                                        `${UrlServer}${item.memorandum}`
                                      )
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
                                {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                                  UsuarioData.cargo_nombre ==
                                    "EDITOR DE PERSONAL" ||
                                  UsuarioData.cargo_nombre ==
                                    "ADMINISTRADOR GENERAL") && (
                                  <HabilitarButton
                                    item={item}
                                    recargar={recargar}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </Collapse>
                </TabPane>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <td>
                      {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                        UsuarioData.cargo_nombre == "EDITOR DE PERSONAL" ||
                        UsuarioData.cargo_nombre ==
                          "ADMINISTRADOR GENERAL") && (
                        <FormularioPersonal
                          id_ficha={id_ficha}
                          recargar={recargar}
                          id_cargo={IdCargoSeleccionado}
                        />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan="3">nombre</th>
                    <th>fecha de ingreso</th>
                    <th>fecha de salida</th>
                    <th>estado</th>
                    <th>opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {HistorialPersonal.map((item, i) => (
                    <tr key={item.id}>
                      <td>
                        <UsuarioDetalles data={item} />
                      </td>
                      <td>
                        {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                          UsuarioData.cargo_nombre == "EDITOR DE PERSONAL" ||
                          UsuarioData.cargo_nombre ==
                            "ADMINISTRADOR GENERAL") && (
                          <div
                            onClick={() => uploadFile(item.id)}
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
                      <td>
                        <Input
                          type="date"
                          value={item.fecha_inicio}
                          onChange={(e) =>
                            handleInputChange(i, "fecha_inicio", e.target.value)
                          }
                          disabled={
                            !(
                              UsuarioData.cargo_nombre == "RESIDENTE" ||
                              UsuarioData.cargo_nombre ==
                                "EDITOR DE PERSONAL" ||
                              UsuarioData.cargo_nombre ==
                                "ADMINISTRADOR GENERAL"
                            )
                          }
                        />
                      </td>
                      <td style={{ display: "flex" }}>
                        <Input
                          type="date"
                          value={item.fecha_final}
                          onChange={(e) =>
                            handleInputChange(i, "fecha_final", e.target.value)
                          }
                          disabled={
                            !(
                              UsuarioData.cargo_nombre == "RESIDENTE" ||
                              UsuarioData.cargo_nombre ==
                                "EDITOR DE PERSONAL" ||
                              UsuarioData.cargo_nombre ==
                                "ADMINISTRADOR GENERAL"
                            )
                          }
                        />
                        {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                          UsuarioData.cargo_nombre == "EDITOR DE PERSONAL" ||
                          UsuarioData.cargo_nombre ==
                            "ADMINISTRADOR GENERAL") && (
                          <Button
                            outline
                            color="danger"
                            onClick={() => {
                              guardarDesignacionesNull(i, "fecha_final");
                            }}
                          >
                            X
                          </Button>
                        )}
                      </td>

                      <td>
                        {item.habilitado ? (
                          <div
                            style={{
                              fontWeight: "700",
                              color: "green",
                            }}
                          >
                            Habilitado
                          </div>
                        ) : (
                          <div
                            style={{
                              fontWeight: "700",
                              color: "red",
                            }}
                          >
                            Deshabilitado
                          </div>
                        )}
                      </td>
                      <td>
                        {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                          UsuarioData.cargo_nombre == "EDITOR DE PERSONAL" ||
                          UsuarioData.cargo_nombre ==
                            "ADMINISTRADOR GENERAL") && (
                          <Button
                            outline
                            color="primary"
                            onClick={() => guardarDesignaciones(i)}
                          >
                            <FaSave />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ModalBody>
      </Modal>
      <input
        type="file"
        ref={hiddenFileInput}
        style={{
          display: "none",
        }}
        onChange={(e) => onChangeInputFile(e)}
      />
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
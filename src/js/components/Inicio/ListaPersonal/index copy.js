import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
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
import classnames from "classnames";
import { FaUserFriends, FaMediumM, FaUpload } from "react-icons/fa";

import Usuario from "../../../../images/usuario.png";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import FormularioPersonal from "./FormularioPersonal";

export default ({ id_ficha, codigo_obra }) => {
  const hiddenFileInput = useRef(null);
  //modal personal
  const [ModalPersonal, setModalPersonal] = useState(false);
  function toggleModalPersonal() {
    setModalPersonal(!ModalPersonal);
    if (!ModalPersonal) {
      fetchCargosPersonal();
      fetchUsuarioData();
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
  const [IdCargoSeleccionado, setIdCargoSeleccionado] = useState(0);
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
  const [idAccesoInputFile, setidAccesoInputFile] = useState(0);
  async function uploadFile(id_acceso) {
    await setidAccesoInputFile(id_acceso);
    hiddenFileInput.current.click();
  }
  async function onChangeInputFile(e) {
    if (confirm("desea subir el memorandum seleccionado?")) {
      const formData = new FormData();
      formData.append("memorandum", e.target.files[0]);
      e.target.value = null;
      formData.append("obra_codigo", codigo_obra);
      formData.append("id_acceso", idAccesoInputFile);
      formData.append("id_ficha", id_ficha);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      var res = await axios.post(
        `${UrlServer}/putUsuarioMemo`,
        formData,
        config
      );
      console.log(res.data);
      recargar();
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
    fetchUsuariosPersonal();
    fetchUsuariosPersonalInactivos();
  }
  //UsuarioData
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const request = await axios.get(
      `${UrlServer}/v1/usuarios/acceso/${sessionStorage.getItem("idacceso")}`
    );
    setUsuarioData(request.data);
  }

  useEffect(() => {
    recargar();
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
      <Modal isOpen={ModalPersonal} toggle={toggleModalPersonal}>
        <ModalHeader>{codigo_obra} - PERSONAL TECNICO DE OBRA</ModalHeader>
        <ModalBody>
          <div className="card">
            <Nav tabs>
              {CargosPersonal && [
                CargosPersonal.map((item, i) => (
                  <NavItem key={i}>
                    <NavLink
                      className={classnames({
                        active: IdCargoSeleccionado === item.id_cargo,
                      })}
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
                  >
                    LISTA PERSONAL
                  </NavLink>
                </NavItem>,
              ]}
              {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                UsuarioData.cargo_nombre == "EDITOR DE PERSONAL") && (
                <FormularioPersonal id_ficha={id_ficha} recargar={recargar} />
              )}
            </Nav>

            {IdCargoSeleccionado == 0 ? (
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
                      <th colSpan="3">PERSONAL</th>
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
                              "EDITOR DE PERSONAL") && (
                            <HabilitarButton item={item} recargar={recargar} />
                          )}
                        </td>
                        <td>
                          {(UsuarioData.cargo_nombre == "RESIDENTE" ||
                            UsuarioData.cargo_nombre ==
                              "EDITOR DE PERSONAL") && (
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
            ) : (
              <TabPane
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                {UsuariosPersonal.map((usuarios, IdUsuario) => (
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
                            <FaMediumM size={15} color={"#2676bb"} />
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
                        <b>DIRECCION </b> <span>{usuarios.direccion}</span>
                        <b>N° COLEGIATURA </b> <span>{usuarios.cpt}</span>
                      </ListGroup>
                    </div>
                  </div>
                ))}
              </TabPane>
            )}

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
                          <b>DIRECCION </b> <span>{usuarios.direccion}</span>
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
                                "EDITOR DE PERSONAL") && (
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
    var res = await axios.put(`${UrlServer}/v1/usuarios/${id}/habilitado`, {
      habilitado: !habilitado,
    });
    recargar();
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

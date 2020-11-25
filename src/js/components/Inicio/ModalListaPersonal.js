import React, { Component, useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Collapse, Nav, NavItem, TabContent, NavLink, TabPane, ListGroup, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input, Button, FormFeedback, FormText } from 'reactstrap';
import classnames from 'classnames';
import { FaUserFriends, FaMediumM, FaUpload } from "react-icons/fa";
import Usuario from '../../../images/usuario.png'
import { UrlServer } from '../Utils/ServerUrlConfig'
import { DebounceInput } from 'react-debounce-input';
import { Extension } from "../Utils/Funciones"

export default ({ id_ficha, codigo_obra }) => {
  const hiddenFileInput = useRef(null);
  useEffect(() => {

  }, []);
  //modal personal
  const [ModalPersonal, setModalPersonal] = useState(false);
  function toggleModalPersonal() {
    setModalPersonal(!ModalPersonal);
    if (!ModalPersonal) {
      fetchCargosPersonal()
      fetchUsuariosPersonal(0)
      getCargos()
    }
  }
  //getcargos
  const [CargosPersonal, setCargosPersonal] = useState([]);
  async function fetchCargosPersonal() {
    var request = await axios.post(`${UrlServer}/getCargosById2`,
      {
        "id_ficha": id_ficha
      }
    )
    setCargosPersonal(request.data)
  }
  //get usuarios
  const [UsuariosPersonal, setUsuariosPersonal] = useState([]);
  const [IdCargoSeleccionado, setIdCargoSeleccionado] = useState(7);
  async function fetchUsuariosPersonal(id_cargo) {
    var request = await axios.post(`${UrlServer}/getUsuariosByCargo`,
      {
        "id_ficha": id_ficha,
        "id_cargo": id_cargo,
        "estado": true
      }
    )

    setUsuariosPersonal(request.data)
    setIdCargoSeleccionado(id_cargo)
    if (id_cargo == 0) {
      setUsuariosPersonalInactivos([])
      setTabUsuariosPersonalTotal(true)
    } else {
      setTabUsuariosPersonalTotal(false)
      fetchUsuariosPersonalInactivos(id_cargo)
    }
  }
  //input file
  const [idAccesoInputFile, setidAccesoInputFile] = useState(0);
  async function uploadFile(id_acceso) {
    await setidAccesoInputFile(id_acceso)
    hiddenFileInput.current.click();
  };
  async function onChangeInputFile(e) {
    if (confirm("desea subir el memorandum seleccionado?")) {
      const formData = new FormData();
      formData.append('memorandum', e.target.files[0]);
      e.target.value = null;
      formData.append('obra_codigo', codigo_obra);
      formData.append('id_acceso', idAccesoInputFile);
      formData.append('id_ficha', id_ficha);
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      var response = await axios.post(`${UrlServer}/putUsuarioMemo`,
        formData,
        config
      )
      fetchUsuariosPersonal(IdCargoSeleccionado)
    } else {
      e.target.value = null;
    }

  }
  function DescargarArchivo(data) {
    if (confirm("Desea descargar el memorandum?")) {
      var tipoArchivo = Extension(data)
      const url = data
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', data, "target", "_blank");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
    }
  }
  //formulario
  const [ModalFormulario, setModalFormulario] = useState(false);
  function toggleModalFormulario() {
    setModalFormulario(!ModalFormulario);
  }
  const [DataFormulario, setDataFormulario] = useState(
    {
      "nombre": "",
      "apellido_paterno": "",
      "apellido_materno": "",
      "dni": "",
      "direccion": "",
      "email": "",
      "celular": "",
      "cpt": "",
      "id_cargo": "SELECCIONE",
      "id_ficha": id_ficha
    }
  );

  const [CargosLimitados, setCargosLimitados] = useState([]);
  async function getCargos() {
    var request = await axios.get(`${UrlServer}/listaCargosLimitado`)
    setCargosLimitados(request.data)
  }
  function onChangeInputFormulario(name, value) {
    var dataFormularioClone = { ...DataFormulario }
    dataFormularioClone[name] = value
    setDataFormulario(dataFormularioClone)
  }

  function validacionFormulario(data) {
    var errores = ""
    if (data.nombre == "") errores += "nombre,"
    if (data.apellido_paterno == "") errores += "apellido_paterno,"
    if (data.apellido_materno == "") errores += "apellido_materno,"
    if (data.dni.length != 8) errores += "dni,"
    if (data.direccion == "") errores += "direccion,"
    if (data.celular.length != 9) errores += "celular,"
    if (data.id_cargo == "SELECCIONE") errores += "cargo,"
    errores = errores.slice(0, -1)
    return errores
  }
  const [Verificador, setVerificador] = useState(false);
  async function saveUsuario() {
    setVerificador(true)
    var errores = validacionFormulario(DataFormulario)
    if (errores != "") {
      alert("Falta llenar los siguientes campos " + errores)
    } else {
      if (confirm("Esta seguro que desea registrar un nuevo usuario?")) {
        var request = await axios.post(`${UrlServer}/postUsuarioObra`,
          DataFormulario
        )
        alert(
          request.data.message
        )
        toggleModalFormulario()
        fetchUsuariosPersonal(IdCargoSeleccionado)
        fetchCargosPersonal()
      }
    }

  }
  //personal inactivo
  const [UsuariosPersonalInactivos, setUsuariosPersonalInactivos] = useState([]);
  async function fetchUsuariosPersonalInactivos(id_cargo) {
    var request = await axios.post(`${UrlServer}/getUsuariosByCargo`,
      {
        "id_ficha": id_ficha,
        "id_cargo": id_cargo,
        "estado": false
      }
    )
    setUsuariosPersonalInactivos(request.data)
  }
  const [ModalPersonalInactivo, setModalPersonalInactivo] = useState(false);
  function toggleModalPersonalInactivo() {
    setModalPersonalInactivo(!ModalPersonalInactivo)

  }
  //PERSONAL DE OBRA
  const [TabUsuariosPersonalTotal, setTabUsuariosPersonalTotal] = useState(false);
  return (
    [
      <button
        className="btn btn-outline-info btn-sm mr-1"
        title="Personal"
        onClick={() => toggleModalPersonal()}
      ><FaUserFriends />
      </button>,
      <Modal isOpen={ModalPersonal} toggle={toggleModalPersonal}


      >
        <ModalHeader >PERSONAL TECNICO DE OBRA</ModalHeader>
        <ModalBody

        >
          <div className="card" >
            <Nav tabs>
              {CargosPersonal &&
                [
                  (CargosPersonal.map((item, i) =>
                    <NavItem key={i}>
                      <NavLink
                        className={classnames({ active: IdCargoSeleccionado === item.id_cargo })}
                        onClick={() => { fetchUsuariosPersonal(item.id_cargo) }}
                      >
                        {item.cargo_nombre.toUpperCase()}
                      </NavLink>
                    </NavItem>
                  )),
                  <NavItem >
                    <NavLink
                      className={classnames({ active: IdCargoSeleccionado == 0 })}
                      onClick={() => { fetchUsuariosPersonal(0) }}
                    >
                      LISTA PERSONAL
                  </NavLink>
                  </NavItem>
                ]

              }


              <Button outline color="primary"
                onClick={() => toggleModalFormulario()}
              >Agregar Personal</Button>
            </Nav>

            {
              TabUsuariosPersonalTotal ?
                <TabPane
                  style={{
                    maxHeight: '500px',
                    overflowY: "auto"
                  }}
                >
                  <table className="table table-sm small">
                    <thead>
                      <tr>
                        <th>

                        </th>
                        <th>
                          PERSONAL
                      </th>
                        <th>

                        </th>
                        <th>

                        </th>
                        <th>
                          CARGO
                      </th>
                        <th>
                          CELULAR
                      </th>
                        <th>
                          DNI
                      </th>
                        <th>
                          EMAIL
                      </th>

                      </tr>
                    </thead>
                    <tbody>
                      {
                        UsuariosPersonal.map((item, i) =>
                          <tr key={i}>
                            <td>
                              {
                                i + 1
                              }
                            </td>
                            <td>
                              {
                                item.nombre_usuario
                              }
                            </td>
                            <td>
                              <div
                                onClick={() => uploadFile(item.id_acceso)}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer"
                                }}
                              >
                                <FaUpload
                                  size={10}
                                  color={"#ffffff"}
                                />
                              </div>
                            </td>
                            <td>
                              {
                                item.memorandum !== null &&
                                <div
                                  className="text-primary"
                                  title="descargar memorandum"
                                  onClick={() => DescargarArchivo(`${UrlServer}${item.memorandum}`)}
                                  style={{
                                    // position: "absolute",
                                    // top: "12px",
                                    // right: "29px",
                                    cursor: "pointer"
                                  }}
                                >
                                  <FaMediumM
                                    size={15}
                                    color={"#2676bb"}
                                  />
                                </div>
                              }
                            </td>
                            <td>
                              {
                                item.cargo_nombre
                              }
                            </td>
                            <td>
                              {
                                item.celular
                              }
                            </td>
                            <td>
                              {
                                item.dni
                              }
                            </td>
                            <td>
                              {
                                item.email
                              }
                            </td>

                          </tr>
                        )
                      }


                    </tbody>
                  </table>

                </TabPane>

                :
                <TabPane
                  style={{
                    maxHeight: '250px',
                    overflowY: "auto"
                  }}
                >
                  {UsuariosPersonal.map((usuarios, IdUsuario) =>
                    <div className="row no-gutters position-relative" key={IdUsuario}>
                      <div className="col-md-3 mb-md-0 p-md-4">
                        <div
                          style={{
                            textAlign: "center",
                            cursor: "pointer"
                          }}
                        >
                          <img src={Usuario} className="w-75" alt="users sigobras" />
                        </div>
                        <div>
                          {
                            usuarios.memorandum !== null &&
                            <div
                              className="text-primary"
                              title="descargar memorandum"
                              onClick={() => DescargarArchivo(`${UrlServer}${usuarios.memorandum}`)}
                              style={{
                                position: "absolute",
                                top: "12px",
                                right: "29px",
                                cursor: "pointer"
                              }}
                            >
                              <FaMediumM
                                size={15}
                                color={"#2676bb"}
                              />
                            </div>
                          }
                        </div>
                        <div
                          onClick={() => uploadFile(usuarios.id_acceso)}
                          style={{
                            textAlign: "center",
                            cursor: "pointer"
                          }}
                        >
                          <FaUpload
                            size={15}
                            color={"#dc3545"}
                          />
                        </div>
                      </div>
                      <div className="col-md-9 position-static p-4 pl-md-0">
                        <ListGroup>
                          <b>{usuarios.nombre_usuario}</b>
                          <b>CELULAR N° </b> <span>{usuarios.celular}</span>
                          <b>DNI </b> <span>{usuarios.dni}</span>
                          <b>EMAIL </b> <span>{usuarios.email}</span>
                          <b>DIRECCION </b> <span>{usuarios.direccion}
                          </span>
                          <b>N° COLEGIATURA </b> <span>{usuarios.cpt}
                          </span>
                        </ListGroup>
                      </div>
                    </div>
                  )
                  }
                </TabPane>
            }

            <TabPane

            >
              {
                (IdCargoSeleccionado != 0 && UsuariosPersonalInactivos.length > 0) &&
                <Button
                  color="primary"
                  onClick={() => toggleModalPersonalInactivo()}
                  style={{ marginBottom: '1rem' }}>PERSONAL INACTIVO</Button>
              }

              <Collapse isOpen={ModalPersonalInactivo}
                style={{
                  maxHeight: '250px',
                  overflowY: "auto"
                }}
              >
                {
                  UsuariosPersonalInactivos.map((usuarios, IdUsuario) =>
                    <div className="row no-gutters position-relative" key={IdUsuario}>
                      <div className="col-md-3 mb-md-0 p-md-4">
                        <div
                          style={{
                            textAlign: "center",
                            cursor: "pointer"
                          }}
                        >
                          <img src={Usuario} className="w-75" alt="users sigobras" />
                        </div>
                        <div>
                          {
                            usuarios.memorandum !== null &&
                            <div
                              className="text-primary"
                              title="descargar memorandum"
                              onClick={() => DescargarArchivo(`${UrlServer}${usuarios.memorandum}`)}
                              style={{
                                position: "absolute",
                                top: "12px",
                                right: "29px",
                                cursor: "pointer"
                              }}
                            >
                              <FaMediumM
                                size={15}
                                color={"#dc3545"}
                              />
                            </div>
                          }
                        </div>
                        <div
                          onClick={() => uploadFile(usuarios.id_acceso)}
                          style={{
                            textAlign: "center",
                            cursor: "pointer"
                          }}
                        >
                          <FaUpload
                            size={15}
                            color={"#dc3545"}
                          />
                        </div>
                      </div>
                      <div className="col-md-9 position-static p-4 pl-md-0">
                        <ListGroup>
                          <b>{usuarios.nombre_usuario}</b>
                          <b>CELULAR N° </b> <span>{usuarios.celular}</span>
                          <b>DNI </b> <span>{usuarios.dni}</span>
                          <b>EMAIL </b> <span>{usuarios.email}</span>
                          <b>DIRECCION </b> <span>{usuarios.direccion}
                          </span>
                          <b>N° COLEGIATURA </b> <span>{usuarios.cpt}
                          </span>
                        </ListGroup>
                      </div>
                    </div>
                  )
                }
              </Collapse>

            </TabPane>
          </div>
        </ModalBody>
      </Modal>,
      ,
      <input
        type="file"
        ref={hiddenFileInput}
        style={{
          display: "none"
        }}
        onChange={e => onChangeInputFile(e)}
      />
      ,
      <Modal
        isOpen={ModalFormulario}
        toggle={() => toggleModalFormulario()}
      >
        <ModalHeader>Ingrese los datos</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <Label >CARGO *</Label>
                <Input
                  type="select"
                  value={DataFormulario.id_cargo}
                  onChange={e => onChangeInputFormulario("id_cargo", e.target.value)}
                  className="form-control"
                  invalid={Verificador && DataFormulario.id_cargo == "SELECCIONE"}
                >
                  <option disabled hidden>SELECCIONE</option>
                  {CargosLimitados.map((item, i) =>
                    <option key={i} value={item.id_Cargo}>{item.nombre}</option>
                  )}
                </Input>

                <FormFeedback>Seleccione un cargo</FormFeedback>
              </FormGroup>

            </Col>
          </Row>
          <Row style={{ width: "600px" }} >
            <Col md={6}>
              <FormGroup>
                <Label for="Nombre">Nombre *</Label>
                <Input
                  type="text"
                  value={DataFormulario.nombre}
                  onChange={e => onChangeInputFormulario("nombre", e.target.value)}
                  className="form-control"
                  invalid={Verificador && !DataFormulario.nombre}
                />
                <FormFeedback>El nombre es requerido</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="Apellido Paterno">Apellido Paterno *</Label>
                <Input
                  type="text"
                  value={DataFormulario.apellido_paterno}
                  onChange={e => onChangeInputFormulario("apellido_paterno", e.target.value)}
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_paterno}
                />
                <FormFeedback>El apellido paterno es requerido</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ width: "600px" }}>
            <Col md={6}>
              <FormGroup>
                <Label for="Apellido Materno">Apellido Materno*</Label>
                <Input
                  type="text"
                  value={DataFormulario.apellido_materno}
                  onChange={e => onChangeInputFormulario("apellido_materno", e.target.value)}
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_materno}
                />
                <FormFeedback>El apellido materno es requerido</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="DNI">DNI*</Label>
                <Input
                  type="number"
                  value={DataFormulario.dni}
                  onChange={e => onChangeInputFormulario("dni", e.target.value)}
                  className="form-control"
                  min="8"
                  max="8"
                  invalid={Verificador && DataFormulario.dni.length != 8}
                />
                <FormFeedback>El dni debe tener 8 digitos</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ width: "600px" }}>
            <Col md={6}>
              <FormGroup>
                <Label for="Direccion">Dirección*</Label>
                <Input
                  type="text"
                  value={DataFormulario.direccion}
                  onChange={e => onChangeInputFormulario("direccion", e.target.value)}
                  className="form-control"
                  invalid={Verificador && !DataFormulario.direccion}
                />
                <FormFeedback>La direccion es requerida</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="Email">Email</Label>
                <Input
                  type="text"
                  value={DataFormulario.email}
                  onChange={e => onChangeInputFormulario("email", e.target.value)}
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_paterno}
                />
                <FormFeedback>El apellido paterno es requerido</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ width: "600px" }}>
            <Col md={6}>
              <FormGroup>
                <Label for="N° Celular">N° Celular*</Label>
                <Input
                  type="number"
                  value={DataFormulario.celular}
                  onChange={e => onChangeInputFormulario("celular", e.target.value)}
                  className="form-control"
                  invalid={Verificador && DataFormulario.celular.length != 9}
                />
                <FormFeedback>El celular debe tener 9 digitos</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="Código de colegiatura">Código de colegiatura</Label>
                <Input
                  type="text"
                  value={DataFormulario.cpt}
                  onChange={e => onChangeInputFormulario("cpt", e.target.value)}
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_paterno}
                />
                <FormFeedback>El apellido paterno es requerido</FormFeedback>
              </FormGroup>
            </Col>
          </Row>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => saveUsuario()} >Guardar Usuario</Button>{' '}
          <Button color="secondary" onClick={() => toggleModalFormulario()} >Cancel</Button>
        </ModalFooter>
      </Modal>

    ]

  );
}
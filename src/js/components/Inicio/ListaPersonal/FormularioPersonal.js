import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

import { UrlServer } from "../../Utils/ServerUrlConfig";
export default ({ id_ficha, dataPersonal, recargar, id_cargo }) => {
  //formulario
  const [ModalFormulario, setModalFormulario] = useState(false);
  function toggleModalFormulario() {
    setModalFormulario(!ModalFormulario);
    if (!ModalFormulario) {
      getCargos();
      setDataFormulario(
        dataPersonal || {
          nombre: "",
          apellido_paterno: "",
          apellido_materno: "",
          dni: "",
          direccion: "",
          email: "",
          celular: "",
          cpt: "",
          fecha_inicio: "",
        }
      );
      setModoDatosPorDNI(false);
      setVerificador(false);
    }
  }
  const [DataFormulario, setDataFormulario] = useState({});
  const [IdCargoSeleccionado, setIdCargoSeleccionado] = useState("");

  const [CargosLimitados, setCargosLimitados] = useState([]);
  async function getCargos() {
    var res = await axios.get(`${UrlServer}/v1/cargos/`, {
      params: {
        cargos_tipo_id: 3,
      },
    });
    setCargosLimitados(res.data);
  }
  function onChangeInputFormulario(name, value) {
    var dataFormularioClone = { ...DataFormulario };
    dataFormularioClone[name] = value;
    setDataFormulario(dataFormularioClone);
  }

  function validacionFormulario(data) {
    var errores = "";
    if (data.nombre == "") errores += "nombre,";
    if (data.apellido_paterno == "") errores += "apellido_paterno,";
    if (data.apellido_materno == "") errores += "apellido_materno,";
    if (data.dni.length != 8) errores += "dni,";
    if (data.direccion == "") errores += "direccion,";
    if (data.celular.length != 9) errores += "celular,";
    errores = errores.slice(0, -1);
    return errores;
  }
  const [Verificador, setVerificador] = useState(false);
  async function saveUsuario(event) {
    event.preventDefault();
    setVerificador(true);
    var errores = validacionFormulario(DataFormulario);
    if (errores != "") {
      alert("Falta llenar los siguientes campos " + errores);
    } else {
      if (ModoDatosPorDNI) {
        try {
          var res = await axios.post(`${UrlServer}/v1/accesos/asignarObra`, {
            Fichas_id_ficha: sessionStorage.getItem("idobra"),
            Accesos_id_acceso: DataFormulario.id_acceso,
            cargos_id_Cargo: IdCargoSeleccionado,
            fecha_inicio: DataFormulario.fecha_inicio,
          });
          alert(res.data.message);
          toggleModalFormulario();
          recargar();
        } catch (error) {
          alert("Ocurrio un error");
        }
      } else {
        if (confirm("Esta seguro que desea registrar un nuevo usuario?")) {
          console.log("saveUsuario", DataFormulario);
          // return;
          try {
            if (dataPersonal) {
              var res = await axios.put(
                `${UrlServer}/v1/usuarios/${DataFormulario.id_acceso}`,
                DataFormulario
              );
            } else {
              var res = await axios.post(
                `${UrlServer}/v1/usuarios/obra/${id_ficha}/cargo/${IdCargoSeleccionado}`,
                DataFormulario
              );
            }

            alert(res.data.message);
            toggleModalFormulario();
            recargar();
          } catch (error) {
            if (error.response.data.message == "ER_DUP_ENTRY") {
              alert("El dni ya esta registrado");
            } else {
              alert("Ocurrio un error");
            }
          }
        }
      }
    }
  }
  async function buscarUsuarioPorDNI() {
    try {
      var res = await axios.get(
        `${UrlServer}/v1/usuarios/dni/${DataFormulario.dni}`
      );
      setDataFormulario({ ...DataFormulario, ...res.data });
      setModoDatosPorDNI(true);
    } catch (error) {
      alert("no se encontro el usuario");
    }
  }
  const [ModoDatosPorDNI, setModoDatosPorDNI] = useState(false);
  return (
    <div>
      {dataPersonal ? (
        <Button outline color="primary" onClick={() => toggleModalFormulario()}>
          editar
        </Button>
      ) : (
        <Button outline color="primary" onClick={() => toggleModalFormulario()}>
          Agregar Personal
        </Button>
      )}

      <Modal isOpen={ModalFormulario} toggle={() => toggleModalFormulario()}>
        <ModalHeader>Ingrese los datos</ModalHeader>
        <form onSubmit={saveUsuario}>
          <ModalBody>
            {!dataPersonal && (
              <Row>
                <Col>
                  <FormGroup>
                    <Label>CARGO *</Label>
                    <Input
                      type="select"
                      value={IdCargoSeleccionado}
                      onChange={(e) => setIdCargoSeleccionado(e.target.value)}
                      className="form-control"
                      required
                    >
                      <option disabled hidden value="">
                        SELECCIONE
                      </option>
                      {CargosLimitados.map((item, i) => (
                        <option key={i} value={item.id_Cargo}>
                          {item.nombre}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            )}
            <Row style={{ width: "600px" }}>
              <Col md={6}>
                <FormGroup>
                  <Label for="Nombre">Nombre *</Label>
                  <Input
                    type="text"
                    value={DataFormulario.nombre}
                    onChange={(e) =>
                      onChangeInputFormulario("nombre", e.target.value)
                    }
                    className="form-control"
                    invalid={Verificador && !DataFormulario.nombre}
                    required
                    disabled={ModoDatosPorDNI}
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
                    onChange={(e) =>
                      onChangeInputFormulario(
                        "apellido_paterno",
                        e.target.value
                      )
                    }
                    className="form-control"
                    invalid={Verificador && !DataFormulario.apellido_paterno}
                    required
                    disabled={ModoDatosPorDNI}
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
                    onChange={(e) =>
                      onChangeInputFormulario(
                        "apellido_materno",
                        e.target.value
                      )
                    }
                    className="form-control"
                    invalid={Verificador && !DataFormulario.apellido_materno}
                    required
                    disabled={ModoDatosPorDNI}
                  />
                  <FormFeedback>El apellido materno es requerido</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="DNI">DNI*</Label>
                  <div class="input-group mb-3">
                    <Input
                      type="text"
                      value={DataFormulario.dni}
                      onChange={(e) =>
                        onChangeInputFormulario("dni", e.target.value)
                      }
                      className="form-control"
                      min="11111111"
                      max="99999999"
                      invalid={Verificador && DataFormulario.dni.length != 8}
                      required
                      disabled={ModoDatosPorDNI}
                    />
                    <div class="input-group-append">
                      <Button
                        type="button"
                        onClick={() => buscarUsuarioPorDNI()}
                      >
                        <FaSearch />
                      </Button>
                    </div>
                  </div>

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
                    onChange={(e) =>
                      onChangeInputFormulario("direccion", e.target.value)
                    }
                    className="form-control"
                    invalid={Verificador && !DataFormulario.direccion}
                    required
                    disabled={ModoDatosPorDNI}
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
                    onChange={(e) =>
                      onChangeInputFormulario("email", e.target.value)
                    }
                    className="form-control"
                    invalid={Verificador && !DataFormulario.apellido_paterno}
                    disabled={ModoDatosPorDNI}
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
                    onChange={(e) =>
                      onChangeInputFormulario("celular", e.target.value)
                    }
                    className="form-control"
                    invalid={Verificador && DataFormulario.celular.length != 9}
                    min="111111111"
                    max="999999999"
                    required
                    disabled={ModoDatosPorDNI}
                  />
                  <FormFeedback>El celular debe tener 9 digitos</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="Código de colegiatura">
                    Código de colegiatura
                  </Label>
                  <Input
                    type="text"
                    value={DataFormulario.cpt}
                    onChange={(e) =>
                      onChangeInputFormulario("cpt", e.target.value)
                    }
                    className="form-control"
                    invalid={Verificador && !DataFormulario.apellido_paterno}
                    disabled={ModoDatosPorDNI}
                  />
                  <FormFeedback>El apellido paterno es requerido</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            {!dataPersonal && (
              <Row style={{ width: "600px" }}>
                <Col md={6}>
                  <FormGroup>
                    <Label for="fecha_inicio">Fecha de inicio</Label>
                    <Input
                      type="date"
                      value={DataFormulario.fecha_inicio}
                      onChange={(e) =>
                        onChangeInputFormulario("fecha_inicio", e.target.value)
                      }
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">
              Guardar Usuario
            </Button>{" "}
            <Button color="secondary" onClick={() => toggleModalFormulario()}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

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

import { UrlServer } from "../../Utils/ServerUrlConfig";
export default ({ id_ficha, dataPersonal, recargar }) => {
  //formulario
  const [ModalFormulario, setModalFormulario] = useState(false);
  function toggleModalFormulario() {
    setModalFormulario(!ModalFormulario);
    if (!ModalFormulario) {
      getCargos();
    }
  }
  const [DataFormulario, setDataFormulario] = useState(
    dataPersonal || {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      dni: "",
      direccion: "",
      email: "",
      celular: "",
      cpt: "",
      id_cargo: "SELECCIONE",
      id_ficha: id_ficha,
    }
  );

  const [CargosLimitados, setCargosLimitados] = useState([]);
  async function getCargos() {
    var res = await axios.get(`${UrlServer}/v1/cargos/`);
    console.log("cargos", res.data);
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
    if (data.id_cargo == "SELECCIONE") errores += "cargo,";
    errores = errores.slice(0, -1);
    return errores;
  }
  const [Verificador, setVerificador] = useState(false);
  async function saveUsuario() {
    setVerificador(true);
    var errores = validacionFormulario(DataFormulario);
    if (errores != "") {
      alert("Falta llenar los siguientes campos " + errores);
    } else {
      if (confirm("Esta seguro que desea registrar un nuevo usuario?")) {
        console.log("saveUsuario", DataFormulario);
        // return;
        if (dataPersonal) {
          var request = await axios.put(
            `${UrlServer}/v1/usuarios/${DataFormulario.id_usuario}`,
            DataFormulario
          );
        } else {
          var request = await axios.post(
            `${UrlServer}/postUsuarioObra`,
            DataFormulario
          );
        }

        alert(request.data.message);
        toggleModalFormulario();
        recargar();
      }
    }
  }
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
        <ModalBody>
          {!dataPersonal && (
            <Row>
              <Col>
                <FormGroup>
                  <Label>CARGO *</Label>
                  <Input
                    type="select"
                    value={DataFormulario.id_cargo}
                    onChange={(e) =>
                      onChangeInputFormulario("id_cargo", e.target.value)
                    }
                    className="form-control"
                    invalid={
                      Verificador && DataFormulario.id_cargo == "SELECCIONE"
                    }
                  >
                    <option disabled hidden>
                      SELECCIONE
                    </option>
                    {CargosLimitados.map((item, i) => (
                      <option key={i} value={item.id_Cargo}>
                        {item.nombre}
                      </option>
                    ))}
                  </Input>

                  <FormFeedback>Seleccione un cargo</FormFeedback>
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
                    onChangeInputFormulario("apellido_paterno", e.target.value)
                  }
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
                  onChange={(e) =>
                    onChangeInputFormulario("apellido_materno", e.target.value)
                  }
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
                  onChange={(e) =>
                    onChangeInputFormulario("dni", e.target.value)
                  }
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
                  onChange={(e) =>
                    onChangeInputFormulario("direccion", e.target.value)
                  }
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
                  onChange={(e) =>
                    onChangeInputFormulario("email", e.target.value)
                  }
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
                  onChange={(e) =>
                    onChangeInputFormulario("celular", e.target.value)
                  }
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
                  onChange={(e) =>
                    onChangeInputFormulario("cpt", e.target.value)
                  }
                  className="form-control"
                  invalid={Verificador && !DataFormulario.apellido_paterno}
                />
                <FormFeedback>El apellido paterno es requerido</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => saveUsuario()}>
            Guardar Usuario
          </Button>{" "}
          <Button color="secondary" onClick={() => toggleModalFormulario()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

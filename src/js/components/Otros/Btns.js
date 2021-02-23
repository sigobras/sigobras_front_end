import React, { useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap";
import { toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
export default ({ EstadoObra }) => {
  const [DataEstadosObra, setDataEstadosObra] = useState([]);
  const [modal, setmodal] = useState(false);
  const [modalClave, setmodalClave] = useState(false);
  const [FormUsuario, setFormUsuario] = useState("");
  const [FormPassword, setFormPassword] = useState("");

  const [EstadoObraSeleccionado, setEstadoObraSeleccionado] = useState("");

  async function fetchEstadosObra() {
    const res = await axios.get(`${UrlServer}/listaestados`);
    setDataEstadosObra(res.data);
  }
  function ModalEstadoObra() {
    if (!modal) {
      fetchEstadosObra();
    }
    setmodal(!modal);
  }
  function ModalPassword() {
    setmodalClave(!modalClave);
  }

  async function SubmitEsadoObra(e) {
    e.preventDefault();
    if (FormPassword.length > 0) {
      if (confirm("¿cambiar situación de la obra?")) {
        const res = await axios.post(UrlServer + "/login2", {
          usuario: FormUsuario,
          password: FormPassword,
        });
        console.log("login", res);
        if ((res.data.id_acceso = sessionStorage.getItem("idacceso"))) {
          const res2 = await axios.post(`${UrlServer}/ActualizarEstado`, {
            Fichas_id_ficha: sessionStorage.getItem("idobra"),
            Estados_id_estado: EstadoObraSeleccionado,
          });
          if (res2.status == 200) {
            toast.success("✔ situación actual de la obra actualizada ");
            console.log("response", res2.data);
            sessionStorage.setItem("estadoObra", res2.data.nombre);
            setTimeout(() => {
              window.location.href = "/inicio";
            }, 50);
            setmodalClave(false);
            setmodal(false);
          } else {
            toast.error("❌ errores en cambiar la situacion actual de la obra");
          }
        }
      }
    }
  }
  return (
    <div>
      <button
        className={
          EstadoObra === "Ejecucion"
            ? "btn btn-outline-success   "
            : EstadoObra === "Paralizado"
            ? "btn btn-outline-warning   "
            : EstadoObra === "Corte"
            ? "btn btn-outline-danger   "
            : EstadoObra === "Actualizacion"
            ? "btn btn-outline-primary   "
            : "btn btn-outline-info   "
        }
        title={`situación de la obra ${EstadoObra}`}
        onClick={() => ModalEstadoObra()}
      >
        <span className="textSigobras">situación actual:</span>
        {EstadoObra}
      </button>
      <Modal
        isOpen={modal}
        fade={false}
        toggle={() => ModalEstadoObra()}
        backdrop="static"
      >
        <ModalHeader toggle={() => ModalEstadoObra()}>
          Cambiar situación de la obra
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="6">
              <span className="h4 text-center">
                situación actual:
                <br />
                {EstadoObra}
              </span>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label>Cambiar a:</Label>
                <Input
                  type="select"
                  className="form-control-sm"
                  onChange={(e) => setEstadoObraSeleccionado(e.target.value)}
                >
                  <option>Seleccione </option>
                  {DataEstadosObra.map((item, i) => (
                    <option value={item.id_Estado} key={i}>
                      {item.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => ModalPassword()}>
            Cambiar estado{" "}
          </Button>{" "}
          <Button color="danger" onClick={() => ModalEstadoObra()}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalClave} fade={false} toggle={ModalPassword} size="lg">
        <ModalHeader toggle={ModalPassword}>Ingrese su contraseña</ModalHeader>
        <ModalBody>
          <Form inline onSubmit={SubmitEsadoObra} autoComplete="off">
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="exampleEmail" className="mr-sm-2">
                Usuario
              </Label>
              <Input
                autoComplete={false}
                type="text"
                value={FormUsuario}
                onChange={(e) => setFormUsuario(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="examplePassword" className="mr-sm-2">
                Password
              </Label>
              <Input
                autoComplete={false}
                type="password"
                placeholder="don't tell!"
                value={FormPassword}
                onChange={(e) => setFormPassword(e.target.value)}
              />
            </FormGroup>
            <Button color="success" type="submit">
              Confirmar{" "}
            </Button>{" "}
            <Button color="danger" onClick={() => ModalPassword()}>
              Cancelar
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Nav,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import { FaUpload, FaMediumM, FaPlusCircle } from "react-icons/fa";
import axios from "axios";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
export default ({ recargar }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const [InputValue, setInputValue] = useState("");
  async function guardarData(e) {
    e.preventDefault();
    try {
      var res = await axios.get(`${UrlServer}/v1/analitico/id`, {
        params: {
          id_ficha: sessionStorage.getItem("idobra"),
        },
      });
      if (res.data.length) {
        var clone = {
          anyo: InputValue,
          monto: 0,
          presupuesto_analitico_id: res.data[0].id,
        };
        await axios.put(`${UrlServer}/v1/analitico/avanceAnual`, [clone]);
        recargar();
        alert("Registro exitoso");
      } else {
        throw "NECESITA_ESPECIFICA";
      }
    } catch (error) {
      if (error == "NECESITA_ESPECIFICA") {
        alert("Se necesita ingresar una especifica primero");
      } else {
        alert("Ocurrio un error");
      }
    }
  }
  return (
    <span>
      <FaPlusCircle
        color="#28d645"
        size="15"
        onClick={toggle}
        style={{ cursor: "pointer" }}
        title="Agregar Nuevo Año Ejecutado"
      />
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          INGRESE EL NUEVO AÑO EJECUTADO
        </ModalHeader>
        <form onSubmit={guardarData}>
          <ModalBody>
            <Row>
              <Col md={7}>
                <FormGroup>
                  <Label>NUEVO AÑO</Label>
                  <Input
                    type="number"
                    min="1000"
                    max="9999"
                    value={InputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Añadir
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </span>
  );
};

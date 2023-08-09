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
  ListGroup,
} from "reactstrap";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import Usuario from "../../../../../public/images/usuario.png";
export default ({ data }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  return (
    <div>
      <div onClick={() => toggle()} style={{ cursor: "pointer" }}>
        {data.nombre +
          " " +
          data.apellido_paterno +
          " " +
          data.apellido_materno}
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>{data.cargo_nombre}</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="6">
              <img src={Usuario} className="w-75" alt="users sigobras" />
            </Col>
            <Col md="6">
              <ListGroup>
                <b>{data.nombre.toUpperCase()}</b>
                <b>CELULAR N° </b> <span>{data.celular || "----"}</span>
                <b>DNI </b> <span>{data.dni || "----"}</span>
                <b>EMAIL </b> <span>{data.email || "----"}</span>
                <b>DIRECCION </b> <span>{data.direccion || "----"}</span>
                <b>N° COLEGIATURA </b> <span>{data.cpt || "----"}</span>
              </ListGroup>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

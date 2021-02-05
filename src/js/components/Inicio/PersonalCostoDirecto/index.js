import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Input,
  ModalFooter,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import classnames from "classnames";
import { FaUserFriends, FaMediumM, FaUpload } from "react-icons/fa";
import { RiEyeOffFill, RiShieldCheckFill } from "react-icons/ri";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { mesesShort } from "../../Utils/Funciones";
import BotonNuevo from "../../../libs/BotonNuevo";

import "./PersonalCostoDirecto.css";
export default () => {
  //modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      fetchAnyos();
    }
    setModal(!modal);
  };
  //anyo
  const [Anyos, setAnyos] = useState([]);
  async function fetchAnyos() {
    setAnyos([
      {
        anyo: 2018,
      },
      {
        anyo: 2019,
      },
      {
        anyo: 2020,
      },
    ]);
  }
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0);
  //meses
  const [Meses, setMeses] = useState([]);
  async function fetchMeses() {
    setMeses([
      {
        mes: 1,
        habilitado: 1,
      },
      {
        mes: 2,
        habilitado: 0,
      },
      {
        mes: 3,
        habilitado: 1,
      },
    ]);
  }
  const [MeseSeleccionado, setMeseSeleccionado] = useState(1);
  //personal
  const [ListaPersonal, setListaPersonal] = useState([]);
  async function fetchListaPersonal() {
    setListaPersonal([
      { id: 1, nombre: "peon" },
      { id: 2, nombre: "capataz" },
      { id: 3, nombre: "operario" },
      { id: 4, nombre: "oficial" },
    ]);
  }
  const [Personal, setPersonal] = useState([]);
  async function fetchPersonal() {
    var temp = [
      { id: 1, cantidad: 0 },
      { id: 2, cantidad: 2 },
      { id: 3, cantidad: 3 },
      { id: 4, cantidad: 4 },
    ];
    var temp2 = temp.splice(Math.floor(Math.random() * temp.length));
    setPersonal(temp2);
  }
  function agregarPersonal() {
    var temp = [...Personal];
    temp.push({ id: 1, cantidad: 0 });
    setPersonal(temp);
  }
  useEffect(() => {
    fetchMeses();
    console.log("AnyoSeleccionado", AnyoSeleccionado);
  }, [AnyoSeleccionado]);
  useEffect(() => {
    fetchListaPersonal();
    fetchPersonal();
  }, [MeseSeleccionado]);
  return (
    <div>
      <Button outline color="info" onClick={toggle}>
        <FaUserFriends />
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <div>
            <Nav tabs className="float-left">
              <NavItem className="input-dark">
                <Input
                  type="select"
                  onChange={(e) => setAnyoSeleccionado(e.target.value)}
                >
                  {Anyos.map((item, i) => (
                    <option>{item.anyo}</option>
                  ))}
                </Input>
              </NavItem>
              {Meses.map((item, i) => (
                <NavItem className="d-flex">
                  <NavLink
                    active={item.mes == MeseSeleccionado}
                    onClick={() => setMeseSeleccionado(item.mes)}
                  >
                    {mesesShort[item.mes]}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <span onClick={() => agregarPersonal()} className="float-right">
              <BotonNuevo />
            </span>
          </div>
          <Form>
            <table className="table text-center">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>CARGO</th>
                  <th>CANTIDAD DE PERSONAL</th>
                </tr>
              </thead>
              <tbody>
                {Personal.map((item, i) => (
                  <tr className="input-dark">
                    <td className="td-dark ">{i + 1}</td>
                    <td>
                      <Input type="select" value={item.id} onChange={() => " "}>
                        {ListaPersonal.map((item2, i) => (
                          <option value={item2.id}>{item2.nombre}</option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      <Input
                        type="text"
                        value={item.cantidad}
                        onChange={() => " "}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Row className="input-dark">
            <FormGroup row>
              <Label for="TotalSoles" sm={2}>
                Total Soles
              </Label>
              <Col sm={5}>
                <Input type="number" id="TotalSoles" />
              </Col>
              <Col sm={5}>
                {MeseSeleccionado.habilitado ? (
                  <RiShieldCheckFill size="25" color="#70c570" />
                ) : (
                  <RiEyeOffFill size="25" />
                )}
                <Button color="primary" onClick={toggle}>
                  Guardar
                </Button>{" "}
                <Button color="secondary" onClick={toggle}>
                  Cancel
                </Button>
              </Col>
            </FormGroup>
          </Row>
        </ModalFooter>
      </Modal>
    </div>
  );
};

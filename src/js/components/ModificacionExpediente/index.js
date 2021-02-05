import React, { useState, useEffect } from "react";
import {
  RiEyeOffFill,
  RiShieldCheckFill,
  RiDownload2Line,
  RiFileAddLine,
  RiEditBoxLine,
} from "react-icons/ri";
import {
  Button,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  CardHeader,
  FormGroup,
  Label,
} from "reactstrap";

export default () => {
  return (
    <div>
      <Button outline color="danger">
        <RiFileAddLine />
      </Button>
      <table className="table">
        <thead>
          <tr>
            <th>Resolucion</th>
            <th>Monto</th>
            <th>FechaAprobacion</th>
            <th>Estado Aprobacion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              RGGR N° 160-2017-GGR-GR PUNO (20.04.2017)
              <RiDownload2Line />
            </td>
            <td>123,000,00</td>
            <td>10-10-2020</td>
            <td>
              <RiShieldCheckFill />
            </td>
          </tr>
          <tr>
            <td>
              RGGR N° 160-2017-GGR-GR PUNO (20.04.2018)
              <RiDownload2Line />
            </td>
            <td>123,000,00</td>
            <td>10-10-2020</td>
            <td>
              <RiShieldCheckFill />
            </td>
          </tr>
        </tbody>
      </table>
      <MayoresMetrados />
      <PartidasNuevas />
    </div>
  );
};
function MayoresMetrados() {
  // tab
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  //modal
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  return (
    <div>
      <CardHeader>MAYORES METRADOS</CardHeader>
      <Row className="d-flex">
        <Col md="4">
          <Input type="select">
            <option value=""> RGGR N° 160-2017-GGR-GR PUNO (20.04.2017)</option>
            <option value=""> RGGR N° 160-2017-GGR-GR PUNO (20.04.2018)</option>
          </Input>
        </Col>
        <Col md="4" className="d-flex">
          <Input type="text"></Input>
          <Button color="danger" onClick={toggleModal}>
            <RiFileAddLine />
          </Button>
        </Col>
      </Row>

      <Nav tabs>
        <NavItem>
          <NavLink
            active={activeTab === "1"}
            onClick={() => {
              toggle("1");
            }}
          >
            COMP 1
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "2"}
            onClick={() => {
              toggle("2");
            }}
          >
            Comp 2
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <table className="table">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>descripcion</th>
                <th>metrado</th>
                <th>P/U</th>
                <th>p/P</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01.01.01</td>
                <td>OFICINAS</td>
                <td>123.00 m2</td>
                <td>199.58</td>
                <td>24,548.34</td>
              </tr>
            </tbody>
          </table>
        </TabPane>
      </TabContent>
    </div>
  );
}
function PartidasNuevas() {
  // tab
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      <CardHeader>PARTIDAS NUEVAS</CardHeader>
      <Row className="d-flex">
        <Col md="4">
          <Input type="select">
            <option value=""> RGGR N° 160-2017-GGR-GR PUNO (20.04.2017)</option>
            <option value=""> RGGR N° 160-2017-GGR-GR PUNO (20.04.2018)</option>
          </Input>
        </Col>
      </Row>

      <Nav tabs>
        <NavItem>
          <NavLink
            active={activeTab === "1"}
            onClick={() => {
              toggle("1");
            }}
          >
            COMP 1
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "2"}
            onClick={() => {
              toggle("2");
            }}
          >
            Comp 2
          </NavLink>
        </NavItem>
        <AgregarComponenteNuevo />
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <table className="table">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>descripcion</th>
                <th>metrado</th>
                <th>P/U</th>
                <th>p/P</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01.01.01</td>
                <td>OFICINAS</td>
                <td>123.00 m2</td>
                <td>199.58</td>
                <td>24,548.34</td>
                <td>
                  <PartidaNuevaAgregar tipo="titulo" />
                  <PartidaNuevaAgregar tipo="partida" />
                </td>
                <td>
                  <PartidaNuevaEdicion />
                </td>
              </tr>
            </tbody>
          </table>
          <PartidaNuevaAgregar tipo="titulo" />
        </TabPane>
      </TabContent>
    </div>
  );
}
function PartidaNuevaAgregar({ tipo }) {
  //modal
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);
  function DataAcu() {
    return (
      <div>
        <CardHeader>Partida RELLENO COMPACTADO DE ESTRUCTURAS</CardHeader>
        <table className="table">
          <thead>
            <tr>
              <th>Rendimiento</th>
              <th>m3/DIA </th>
              <td>15.0000</td>
              <th>EQ.</th>
              <td>15.0000</td>
              <th>Costo unitario directo por : m3</th>
              <td>35.93</td>
            </tr>
            <tr>
              <th colSpan="2">Descripción Recurso</th>
              <th>Unidad</th>
              <th>Cuadrilla</th>
              <th>Cantidad</th>
              <th>Precio S/.</th>
              <th>Parcial S/.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan="7">Mano de Obra</th>
            </tr>
            <tr>
              <td colSpan="2">OPERARIO</td>
              <td>hh</td>
              <td>0.5000</td>
              <td>0.2667</td>
              <td>22.95</td>
              <td>6.12</td>
            </tr>
            <tr>
              <th colSpan="7">Materiales</th>
            </tr>
            <tr>
              <td colSpan="2">MATERIAL GRANULAR</td>
              <td>hh</td>
              <td>0.5000</td>
              <td>0.2667</td>
              <td>22.95</td>
              <td>6.12</td>
            </tr>
            <tr>
              <th colSpan="7">Equipos</th>
            </tr>
            <tr>
              <td colSpan="2">HERRAMIENTAS MANUALES</td>
              <td>hh</td>
              <td>0.5000</td>
              <td>0.2667</td>
              <td>22.95</td>
              <td>6.12</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div>
      {tipo == "titulo" ? (
        <Button onClick={toggleModal}>Agregar Titulo</Button>
      ) : (
        <Button color="danger" onClick={toggleModal}>
          Agregar Partida
        </Button>
      )}

      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          <Input></Input>
          <div className="d-flex" md="12">
            <Row>
              <Col md="9">
                <Input value="RELLENO COMPACTADO DE ESTRUCTURAS" />
              </Col>
            </Row>
          </div>
        </ModalHeader>
        {tipo == "partida" && (
          <ModalBody>
            <Container>
              <Row>
                <Col>
                  <DataAcu />
                </Col>
                <Col>
                  <DataAcu />
                </Col>
              </Row>
              <Row>
                <Col>
                  <DataAcu />
                </Col>
                <Col>
                  <DataAcu />
                </Col>
              </Row>
            </Container>
          </ModalBody>
        )}
        <ModalFooter>
          <Button color="primary" onClick={toggleModal}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
function PartidaNuevaEdicion() {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <div>
      <Button outline color="info" onClick={toggle}>
        <RiEditBoxLine />
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edicion De Partida</ModalHeader>
        <ModalBody>
          <table className="table">
            <thead>
              <tr>
                <th>
                  Partida
                  <RiShieldCheckFill color="green" size="25" />
                </th>
                <td>01.01.01</td>
                <td colSpan="5">RELLENO COMPACTADO DE ESTRUCTURAS</td>
              </tr>
              <tr>
                <th>Rendimiento</th>
                <th>m3/DIA </th>
                <td>15.0000</td>
                <th>EQ.</th>
                <td>15.0000</td>
                <th>Costo unitario directo por : m3</th>
                <td>35.93</td>
              </tr>
              <tr>
                <th colSpan="2">Descripción Recurso</th>
                <th>Unidad</th>
                <th>Cuadrilla</th>
                <th>Cantidad</th>
                <th>Precio S/.</th>
                <th>Parcial S/.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colSpan="7">Mano de Obra</th>
              </tr>
              <tr>
                <td colSpan="2">OPERARIO</td>
                <td>hh</td>
                <td>0.5000</td>
                <td>0.2667</td>
                <td>22.95</td>
                <td>6.12</td>
              </tr>
              <tr>
                <th colSpan="7">Materiales</th>
              </tr>
              <tr>
                <td colSpan="2">MATERIAL GRANULAR</td>
                <td>hh</td>
                <td>0.5000</td>
                <td>0.2667</td>
                <td>22.95</td>
                <td>6.12</td>
              </tr>
              <tr>
                <th colSpan="7">Equipos</th>
              </tr>
              <tr>
                <td colSpan="2">HERRAMIENTAS MANUALES</td>
                <td>hh</td>
                <td>0.5000</td>
                <td>0.2667</td>
                <td>22.95</td>
                <td>6.12</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
function AgregarComponenteNuevo() {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <div>
      <Button color="danger" onClick={toggle}>
        Agregar Componente
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="numero">N°</Label>
            <Input type="text" id="numero" />
          </FormGroup>
          <FormGroup>
            <Label for="nombre">NOMBRE</Label>
            <Input type="text" id="nombre" />
          </FormGroup>
          <FormGroup>
            <Label for="presupeusto">PRESUPUESTO</Label>
            <Input type="text" id="presupeusto" />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

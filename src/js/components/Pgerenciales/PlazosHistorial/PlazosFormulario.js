import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import { MdLibraryAdd } from "react-icons/md";
import {
  Button,
  Input,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Modal,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import { BsPlusCircleFill } from "react-icons/bs";

import { UrlServer } from "../../Utils/ServerUrlConfig";

import "../PlazosHistorial/Plazos.css";
import "./PlazosFormulario.css";
export default forwardRef(({ id_padre, recarga }, ref) => {
  useEffect(() => {
    fetchPlazosTipoPadre();
    fetchPlazosTipoHijo();
    return () => {};
  }, []);

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    if (!modal) {
      setFormularioDatos({
        tipo: "SELECCIONAR",
        nivel: id_padre ? 2 : 1,
        descripcion: "",
        fecha_inicio: "",
        fecha_final: "",
        n_dias: 0,
        documento_resolucion_estado: "",
        // "imagen": "",
        observacion: "",
        id_padre: id_padre,
        fichas_id_ficha: sessionStorage.getItem("idobra"),
        plazo_aprobado: false,
        fecha_aprobada: null,
      });
    }
    setModal(!modal);
  };

  const [FormularioDatos, setFormularioDatos] = useState({
    tipo: "SELECCIONAR",
    nivel: id_padre ? 2 : 1,
    descripcion: "",
    fecha_inicio: "",
    fecha_final: "",
    n_dias: 0,
    documento_resolucion_estado: "",
    // "imagen": "",
    observacion: "",
    id_padre: id_padre,
    fichas_id_ficha: sessionStorage.getItem("idobra"),
    plazo_aprobado: false,
    fecha_aprobada: null,
  });
  const handleInputChange = (event) => {
    // console.log(event.target.name, typeof event.target.value);

    if (event.target.name == "plazo_aprobado") {
      console.log("IF");
      setFormularioDatos({
        ...FormularioDatos,
        [event.target.name]: event.target.value == "false" ? true : false,
      });
    } else {
      setFormularioDatos({
        ...FormularioDatos,
        [event.target.name]: event.target.value,
      });
    }
  };

  async function enviarDatos(event) {
    event.preventDefault();
    // console.log(FormularioDatos);
    var clone = { ...FormularioDatos };
    clone.n_dias = calcular_dias(clone.fecha_inicio, clone.fecha_final);

    const res = await axios.post(`${UrlServer}/plazos`, clone);
    // console.log(res.data);
    alert(res.data.message);
    toggleModal();
    recarga(id_padre);
  }

  const [PlazosTipoPadre, setPlazosTipoPadre] = useState([]);
  async function fetchPlazosTipoPadre() {
    const res = await axios.post(`${UrlServer}/getPlazosTipo`, {
      nivel: 1,
    });
    setPlazosTipoPadre(res.data);
  }

  const [PlazosTipoHijo, setPlazosTipoHijo] = useState([]);
  async function fetchPlazosTipoHijo() {
    const res = await axios.post(`${UrlServer}/getPlazosTipo`, {
      nivel: 2,
    });
    setPlazosTipoHijo(res.data);
  }

  function calcular_dias(fecha_inicio, fecha_final) {
    // console.log(fecha_inicio, fecha_final);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(fecha_inicio);
    const secondDate = new Date(fecha_final);
    var days = Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
    return days || 0;
  }
  return (
    <div
      style={{
        float: "right",
      }}
    >
      {
        id_padre ? (
          <Button color="info" outline onClick={toggleModal}>
            <MdLibraryAdd />
          </Button>
        ) : (
          <button
            style={{
              borderRadius: "20px",
              height: "30px",
              width: "110px",
              // position: "relative",
              border: "1px solid #242526",
            }}
            onClick={toggleModal}
          >
            <div
              style={{
                fontWeight: " 700",
                color: " #242526",
                position: "absolute",
                top: "4px",
                right: "40px",
                fontSize: "15px",
              }}
            >
              NUEVO
            </div>
            <div>
              <BsPlusCircleFill
                color="#0080ff"
                size={20}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "9px",
                }}
              />
            </div>
          </button>
        )
        // <Button
        //     color="danger"
        //     outline
        //     onClick={toggleModal}
        // >AGREGAR ESTADO</Button>
      }
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>NUEVO ESTADO</ModalHeader>
        <form onSubmit={enviarDatos}>
          <ModalBody>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>TIPO DE PLAZO</Label>
                  <Input
                    type="select"
                    name="tipo"
                    className="input-dark"
                    onChange={handleInputChange}
                    required
                    // value={FichaData.fecha_inicial}
                  >
                    <option>SELECCIONAR</option>
                    {id_padre
                      ? PlazosTipoHijo.map((item) => (
                          <option value={item.idplazos_tipo}>
                            {item.nombre}
                          </option>
                        ))
                      : PlazosTipoPadre.map((item) => (
                          <option value={item.idplazos_tipo}>
                            {item.nombre}
                          </option>
                        ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="exampleCity">DESCRIPCION</Label>
                  <Input
                    type="text"
                    name="descripcion"
                    className="input-dark"
                    maxlength="300"
                    autocomplete="off"
                    required
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>FECHA INICIAL</Label>
                  <Input
                    type="date"
                    name="fecha_inicio"
                    className="input-dark"
                    onChange={handleInputChange}
                    required
                  ></Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="exampleCity">FECHA FINAL</Label>
                  <Input
                    type="date"
                    name="fecha_final"
                    className="input-dark"
                    required
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>DIAS</Label>
                  <Input
                    type="text"
                    name="n_dias"
                    className="input-dark"
                    onChange={handleInputChange}
                    value={calcular_dias(
                      FormularioDatos.fecha_inicio,
                      FormularioDatos.fecha_final
                    )}
                    readonly
                  ></Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="exampleCity">RESOLUCION</Label>
                  <Input
                    type="text"
                    name="documento_resolucion_estado"
                    className="input-dark"
                    maxlength="45"
                    autocomplete="off"
                    // required
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label>OBSERVACION</Label>
                  <Input
                    type="text"
                    name="observacion"
                    className="input-dark"
                    maxlength="300"
                    autocomplete="off"
                    // required
                    onChange={handleInputChange}
                    value={FormularioDatos.observacion}
                  ></Input>
                </FormGroup>
              </Col>
            </Row>
            {!id_padre && (
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>FECHA DE APROBACION</Label>
                    <Input
                      type="date"
                      name="fecha_aprobada"
                      className="input-dark"
                      onChange={handleInputChange}
                      value={FormularioDatos.fecha_aprobada}
                    ></Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>PLAZO APROBADO</Label>
                    <input
                      type="checkbox"
                      className="form-control input-dark"
                      checked={FormularioDatos.plazo_aprobado}
                      name="plazo_aprobado"
                      value={FormularioDatos.plazo_aprobado}
                      onClick={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary" outline>
              Guardar
            </Button>{" "}
            <Button color="secondary" outline onClick={toggleModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
});

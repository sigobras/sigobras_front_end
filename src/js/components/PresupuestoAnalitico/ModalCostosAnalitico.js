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
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { FaUpload, FaDownload, FaPlusCircle } from "react-icons/fa";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, DescargarArchivo } from "../Utils/Funciones";
export default ({ recargar }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      cargarCostosNombres();
      setIndexCostoSeleccionado({});
    }
    setModal(!modal);
  };
  //formulario para agregar
  const [CostosNombres, setCostosNombres] = useState([]);
  async function cargarCostosNombres() {
    var res = await axios.get(`${UrlServer}/v1/analiticoCostos`);
    var temp = [];
    if (Array.isArray(res.data)) {
      res.data.forEach((item) => {
        temp.push({ value: item.id_costo, label: item.nombre });
      });
    }
    setCostosNombres(temp);
  }
  const [IndexCostoSeleccionado, setIndexCostoSeleccionado] = useState({});
  //guardadr
  async function guardarData(event) {
    event.preventDefault();
    try {
      var res = await axios.post(`${UrlServer}/v1/analiticoCostos/obra`, {
        fichas_id_ficha: sessionStorage.getItem("idobra"),
        presupuestoanalitico_costos_id: IndexCostoSeleccionado.value,
      });
      recargar();
    } catch (error) {
      if (error.response.data.message == "ER_DUP_ENTRY") {
        alert("Costo ya asignado");
      } else {
        alert("Ocurrio un error");
      }
    }
  }
  const handleCreate = async (inputValue) => {
    setisLoading(true);
    try {
      if (
        confirm(
          `Esta seguro de crear un nuevo costo con el valor "${inputValue}"`
        )
      ) {
        var res = await axios.post(`${UrlServer}/v1/analiticoCostos`, {
          nombre: inputValue.toUpperCase(),
        });
        var clone = [...CostosNombres];
        var nuevaOpcion = { value: res.data.id, label: inputValue };
        clone.push(nuevaOpcion);
        setCostosNombres(clone);
        setIndexCostoSeleccionado(nuevaOpcion);
      }
    } catch (error) {
      alert("Ocurrio un error");
    }
    setisLoading(false);
  };
  const [isLoading, setisLoading] = useState(false);
  //styles option
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      // borderBottom: "1px dotted pink",
      color: "white",
      backgroundColor: "#242526",
    }),
  };
  return (
    <span>
      <FaPlusCircle
        color="orange"
        size="15"
        onClick={toggle}
        style={{ cursor: "pointer" }}
        title="Agregar Nuevo Costo"
      />
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Seleccione el Costo</ModalHeader>
        <form onSubmit={guardarData}>
          <ModalBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Costo</Label>
                  <CreatableSelect
                    styles={customStyles}
                    value={IndexCostoSeleccionado}
                    onChange={setIndexCostoSeleccionado}
                    options={CostosNombres}
                    onCreateOption={handleCreate}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    placeholder={"Ingrese el costo a buscar"}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle} type="submit">
              Guardar
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

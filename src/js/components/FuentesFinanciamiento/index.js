import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Nav,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  dropdownOpen,
} from "reactstrap";
import axios from "axios";
import { FaUpload, FaFileAlt, FaPlusCircle, FaTrash } from "react-icons/fa";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, DescargarArchivo, mesesShort } from "../Utils/Funciones";
import Especificas from "./Especificas";

import "./FuentesFinanciamiento.css";
export default () => {
  useEffect(() => {
    cargarFuentesFinanciamientoLista();
    cargarFuentesFinanciamiento();
    return () => {};
  }, []);
  //seleccionar anyo
  const [AnyosList, setAnyosList] = useState(() => {
    var temp = [];
    for (let index = 2010; index <= 2021; index++) {
      temp.push(index);
    }
    return temp;
  });
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(2021);
  const [dropdownOpen, setdropdownOpen] = useState(false);

  const [FuentesFinanciamiento, setFuentesFinanciamiento] = useState([]);
  async function cargarFuentesFinanciamiento() {
    var res = await axios.get(`${UrlServer}/v1/fuentesFinancieamiento`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo: AnyoSeleccionado,
      },
    });
    setFuentesFinanciamiento(res.data);
  }
  const [FuentesFinanciamientoLista, setFuentesFinanciamientoLista] = useState(
    []
  );
  async function cargarFuentesFinanciamientoLista() {
    var res = await axios.get(`${UrlServer}/v1/fuentesFinancieamiento/list`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo: AnyoSeleccionado,
      },
    });

    setFuentesFinanciamientoLista(res.data);
  }
  async function agregarFuenteFinanciamiento() {
    var maxId = 0;
    FuentesFinanciamiento.forEach((item) => {
      if (item.fuentesfinanciamiento_id > maxId) {
        maxId = item.fuentesfinanciamiento_id;
      }
    });

    var res = await axios.get(
      `${UrlServer}/v1/fuentesFinancieamiento/predecir`,
      {
        params: {
          id: maxId,
        },
      }
    );
    var nextId = res.data ? res.data.id : maxId;
    var res2 = await axios.put(`${UrlServer}/v1/fuentesFinancieamiento`, {
      fichas_id_ficha: sessionStorage.getItem("idobra"),
      anyo: AnyoSeleccionado,
      fuentesfinanciamiento_id: nextId,
    });
    cargarFuentesFinanciamiento();
  }
  //input edicion
  async function handleInputChange(index, e) {
    var res = await axios.put(`${UrlServer}/v1/fuentesFinancieamiento`, {
      id: FuentesFinanciamiento[index].id,
      fuentesfinanciamiento_id: e.target.value,
      fichas_id_ficha: FuentesFinanciamiento[index].fichas_id_ficha,
    });

    cargarFuentesFinanciamiento();
  }
  async function eliminarData(id) {
    if (confirm("Desea borrar este dato permanentemente")) {
      try {
        await axios.delete(`${UrlServer}/v1/fuentesFinancieamiento/${id}`);
        cargarFuentesFinanciamiento();
      } catch (error) {
        console.log("Error", error);
      }
    }
  }
  useEffect(() => {
    cargarFuentesFinanciamiento();
    return () => {};
  }, [AnyoSeleccionado]);
  return (
    <div style={{ overflowX: "auto", paddingBottom: "200px" }}>
      <span className="d-flex">
        <Nav tabs style={{ paddingTop: "0px", margin: "0px", height: "29px" }}>
          <Dropdown
            nav
            isOpen={dropdownOpen}
            toggle={() => setdropdownOpen(!dropdownOpen)}
          >
            <DropdownToggle nav caret>
              {AnyoSeleccionado == 0 ? "--" : AnyoSeleccionado}
            </DropdownToggle>

            <DropdownMenu>
              {AnyosList.map((item, i) => (
                <DropdownItem onClick={() => setAnyoSeleccionado(item)} key={i}>
                  {item}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Nav>
        <Button onClick={() => agregarFuenteFinanciamiento()} color="primary">
          AgregarFuente
        </Button>
      </span>

      {FuentesFinanciamiento.map((item, i) => (
        <div key={item.id}>
          <span className="d-flex">
            <span>
              <Input
                type="select"
                value={item.fuentesfinanciamiento_id}
                onChange={(e) => handleInputChange(i, e)}
              >
                <option value="">Seleccione</option>
                {FuentesFinanciamientoLista.map((item2, i2) => (
                  <option key={item2.id} value={item2.id}>
                    {item2.nombre}
                  </option>
                ))}
              </Input>
            </span>
            <span>
              <FaTrash
                onClick={() => eliminarData(item.id)}
                style={{ cursor: "pointer" }}
              />
              {/* <Button
                type="button"
                style={{
                  borderRadius: "13px",
                  margin: "5px",
                  backgroundColor: "#171819",
                }}
              >
                Agregar Especifica
              </Button>
              <Button
                type="button"
                style={{
                  borderRadius: "13px",
                  margin: "5px",
                  backgroundColor: "#171819",
                }}
              >
                Agregar PIM
              </Button> */}
            </span>
          </span>
          <Especificas Id_fuente={item.id} Anyo={AnyoSeleccionado} />
        </div>
      ))}
    </div>
  );
};

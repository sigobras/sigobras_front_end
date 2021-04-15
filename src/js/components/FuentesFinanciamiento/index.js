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
import {
  FaUpload,
  FaFileAlt,
  FaPlusCircle,
  FaRegTrashAlt,
} from "react-icons/fa";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, DescargarArchivo, mesesShort } from "../Utils/Funciones";
import Especificas from "./Especificas";

import "./FuentesFinanciamiento.css";
export default () => {
  useEffect(() => {
    cargarFuentesFinanciamientoLista();
    cargarFuentesFinanciamiento();
    cargarPermiso(`
    fuentefinanciamiento_agregar_fuente,
    fuentefinanciamiento_editar_fuente,
    fuentefinanciamiento_eliminar_fuente,
    fuentefinanciamiento_agregar_especifica,
    fuentefinanciamiento_editar_especifica,
    fuentefinanciamiento_eliminar_especifica,
    fuentefinanciamiento_agregar_titulo,
    fuentefinanciamiento_editar_titulo,
    fuentefinanciamiento_eliminar_titulo,
    fuentefinanciamiento_agregar_pim,
    fuentefinanciamiento_editar_pim,
    fuentefinanciamiento_eliminar_pim,
    fuentefinanciamiento_editar_piamonto,
    fuentefinanciamiento_editar_pimmonto,
    fuentefinanciamiento_editar_avancemensual,
    fuentefinanciamiento_editar_programadomensual,
    fuentefinanciamiento_editar_modoedicion,
    fuentefinanciamiento_agregar_tipocomprobante,
    fuentefinanciamiento_actualizar_tipocomprobante,
    fuentefinanciamiento_eliminar_tipocomprobante,
    fuentefinanciamiento_agregar_comprobante,
    fuentefinanciamiento_actualizar_comprobante,
    fuentefinanciamiento_eliminar_comprobante,
    fuentefinanciamiento_actualizar_comprobanteArchivo,
    fuentefinanciamiento_eliminar_comprobanteArchivo
    `);
  }, []);
  const [Permisos, setPermisos] = useState(false);
  async function cargarPermiso(nombres_clave) {
    const res = await axios.get(`${UrlServer}/v1/interfazPermisos/activo`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_ficha: sessionStorage.getItem("idobra"),
        nombres_clave,
      },
    });
    var tempList = [];
    var tempArray = res.data;
    for (const key in tempArray) {
      tempList[key] = res.data[key];
    }
    setPermisos(tempList);
  }
  //seleccionar anyo
  const [AnyosList, setAnyosList] = useState(() => {
    var temp = [];
    for (let index = 2021; index >= 2010; index--) {
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
  const [ModoEdicion, setModoEdicion] = useState(false);
  const [RefEspecificas, setRefEspecificas] = useState([]);
  const [CantidadEspecificas, setCantidadEspecificas] = useState([]);
  const [CantidadPim, setCantidadPim] = useState([]);
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
        {Permisos["fuentefinanciamiento_editar_modoedicion"] == 1 && (
          <Button
            color={ModoEdicion ? "primary" : "danger"}
            onClick={() => setModoEdicion(!ModoEdicion)}
            style={{ marginLeft: "4px", height: "25px", fontSize: "10px" }}
          >
            Modo edición
          </Button>
        )}
        {ModoEdicion && Permisos["fuentefinanciamiento_agregar_fuente"] == 1 && (
          <Button
            onClick={() => agregarFuenteFinanciamiento()}
            color="info"
            style={{ marginLeft: "4px", height: "25px", fontSize: "10px" }}
          >
            Agregar Fuente
          </Button>
        )}
      </span>

      {FuentesFinanciamiento.map((item, i) => (
        <div key={item.id}>
          <span className="d-flex">
            <span>
              {ModoEdicion &&
              Permisos["fuentefinanciamiento_editar_fuente"] == 1 ? (
                <Input
                  type="select"
                  value={item.fuentesfinanciamiento_id}
                  onChange={(e) => handleInputChange(i, e)}
                  style={{
                    background: "#242526",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Seleccione</option>
                  {FuentesFinanciamientoLista.map((item2, i2) => (
                    <option key={item2.id} value={item2.id}>
                      {item2.nombre}
                    </option>
                  ))}
                </Input>
              ) : (
                <span style={{ fontWeight: "700" }}>{item.nombre}</span>
              )}
            </span>
            <span>
              {ModoEdicion &&
                Permisos["fuentefinanciamiento_eliminar_fuente"] == 1 && (
                  <FaRegTrashAlt
                    onClick={() => eliminarData(item.id)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              {ModoEdicion &&
                Permisos["fuentefinanciamiento_agregar_especifica"] == 1 &&
                CantidadEspecificas[item.id] == 0 && (
                  <Button
                    type="button"
                    style={{
                      borderRadius: "13px",
                      margin: "5px",
                      backgroundColor: "#171819",
                    }}
                    onClick={() => {
                      RefEspecificas[item.id].agregarEspecifica();
                    }}
                  >
                    Agregar Especifica
                  </Button>
                )}
              {ModoEdicion &&
                Permisos["fuentefinanciamiento_agregar_pim"] == 1 &&
                CantidadPim[item.id] == 0 && (
                  <Button
                    type="button"
                    style={{
                      borderRadius: "13px",
                      margin: "5px",
                      backgroundColor: "#171819",
                    }}
                    onClick={() => {
                      RefEspecificas[item.id].agregarVariacionPim();
                    }}
                  >
                    Agregar PIM
                  </Button>
                )}
            </span>
          </span>
          <Especificas
            Id_fuente={item.id}
            Anyo={AnyoSeleccionado}
            Permisos={Permisos}
            ModoEdicion={ModoEdicion}
            ref={(ref) => {
              var clone = RefEspecificas;
              clone[item.id] = ref;
              setRefEspecificas(clone);
            }}
            CantidadEspecificas={CantidadEspecificas}
            setCantidadEspecificas={setCantidadEspecificas}
            CantidadPim={CantidadPim}
            setCantidadPim={setCantidadPim}
          />
        </div>
      ))}
    </div>
  );
};

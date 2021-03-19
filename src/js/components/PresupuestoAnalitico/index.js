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
} from "reactstrap";
import axios from "axios";
import {
  FaUpload,
  FaFileAlt,
  FaPlusCircle,
  FaRegTrashAlt,
} from "react-icons/fa";
import { MdCancel, MdSave } from "react-icons/md";
import AsyncSelect from "react-select/async";

import ModalCostosAnalitico from "./ModalCostosAnalitico";
import ModalNuevoPresupuesto from "./ModalNuevoPresupuesto";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, DescargarArchivo, mesesShort } from "../Utils/Funciones";
import ModalNuevoAnyo from "./ModalNuevoAnyo";
import CustomInput from "../../libs/CustomInput";

import "./PresupuestoAnalitico.css";

export default () => {
  useEffect(() => {
    cargarCostosAnalitico();
    cargarEspecificas();
    cargarAnyosEjecutados();
    cargarPresupuestosAprobados();
    cargarPermiso(`
    analitico_modoedicion,
    analitico_agregar_presupuesto,
    analitico_editar_presupuesto,
    analitico_eliminar_presupuesto,
    analitico_agregar_costo,
    analitico_editar_costo,
    analitico_eliminar_costo,
    analitico_agregar_anyoejecutado,
    analitco_eliminar_anyoejecutado,
    analitico_agregar_especifica,
    analitico_editar_especifica,
    analitico_eliminar_especifica,
    analitico_agregar_avanceanual,
    analitico_agregar_presupuestomonto
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
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(2021);
  //presupuestos
  const [PresupuestosAprobados, setPresupuestosAprobados] = useState([]);
  async function cargarPresupuestosAprobados() {
    var res = await axios.get(`${UrlServer}/v1/presupuestosAprobados`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setPresupuestosAprobados(res.data);
  }
  async function guardarPresupuesto(
    monto,
    presupuesto_analitico_id,
    presupuestos_aprobados_id
  ) {
    var res = await axios.put(`${UrlServer}/v1/analitico/presupuesto`, {
      presupuesto_analitico_id,
      presupuestos_aprobados_id,
      monto: monto || 0,
    });
    cargarEspecificas();
  }
  async function eliminarPresupuesto(id) {
    if (confirm("Desea eliminar este presupuesto?")) {
      var res = await axios.delete(
        `${UrlServer}/v1/presupuestosAprobados/${id}`
      );
      cargarPresupuestosAprobados();
      cargarEspecificas();
    }
  }
  //costos
  const [CostosAnalitico, setCostosAnalitico] = useState([]);
  async function cargarCostosAnalitico() {
    var res = await axios.get(`${UrlServer}/v1/analiticoCostos`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setCostosAnalitico(res.data);
    var tempCostosCollapse = [];
    res.data.forEach((item) => {
      tempCostosCollapse.push(true);
    });
    setCostosCollapse(tempCostosCollapse);
  }
  async function eliminarCosto(id) {
    if (confirm("Esta seguro de eliminar el titulo?")) {
      var res = await axios.delete(`${UrlServer}/v1/analiticoCostos/${id}`);
      cargarCostosAnalitico();
    }
  }
  function RenderCostosData(item) {
    var tempRender = [];
    var acumulado = 0;
    var ultimoPresupuesto = 0;
    if (Especificas.length > 0) {
      var properties = Object.keys(Especificas[0]).filter(
        (element) =>
          element.startsWith("presupuesto_") ||
          element.startsWith("avanceAnual_") ||
          element.startsWith("avanceMensual")
      );
      for (let i = 0; i < properties.length; i++) {
        const key = properties[i];
        var accu = 0;
        for (let j = 0; j < Especificas.length; j++) {
          const especifica = Especificas[j];
          if (especifica.id_costo == item.id) {
            accu += especifica[key];
          }
        }
        if (key.startsWith("presupuesto_")) {
          tempRender.push(
            <th style={{ textAlign: "right" }}>{Redondea(accu)}</th>
          );
          ultimoPresupuesto = accu;
        }
        if (key.startsWith("avanceAnual_")) {
          tempRender.push(
            <th style={{ textAlign: "right" }}>{Redondea(accu)}</th>
          );
          tempRender.push(
            <th style={{ textAlign: "right" }} className="porcentaje">
              {Redondea((accu / ultimoPresupuesto) * 100)} %
            </th>
          );
          acumulado += accu;
        }
        if (key.startsWith("avanceMensual")) {
          tempRender.push(
            <th style={{ textAlign: "right" }}>{Redondea(accu)}</th>
          );
          tempRender.push(
            <th style={{ textAlign: "right" }} className="porcentaje">
              {Redondea((accu / ultimoPresupuesto) * 100)} %
            </th>
          );
          acumulado += accu;
        }
      }
    }
    //acumulado
    tempRender.splice(
      PresupuestosAprobados.length,
      0,
      <th style={{ textAlign: "right" }}>{Redondea(acumulado)}</th>
      // <th style={{ textAlign: "right" }}>"acumulado"</th>
    );
    //porcentaje acumulado
    tempRender.splice(
      PresupuestosAprobados.length + 1,
      0,
      <th style={{ textAlign: "right" }} className="porcentaje">
        {Redondea((acumulado / ultimoPresupuesto) * 100)} %
      </th>
    );
    // saldo
    tempRender.splice(
      PresupuestosAprobados.length + 2,
      0,
      <th
        style={{
          textAlign: "right",
          color: ultimoPresupuesto - acumulado < 0 ? "#cc0000" : "black",
        }}
      >
        {Redondea(ultimoPresupuesto - acumulado)}
      </th>
    );
    //porcentaje saldo
    tempRender.splice(
      PresupuestosAprobados.length + 3,
      0,
      <th style={{ textAlign: "right" }} className="porcentaje">
        {Redondea(((ultimoPresupuesto - acumulado) / ultimoPresupuesto) * 100)}{" "}
        %
      </th>
    );

    return tempRender;
  }
  //Especificas
  const [Especificas, setEspecificas] = useState([]);
  async function cargarEspecificas() {
    var res = await axios.get(`${UrlServer}/v1/analitico/`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo: AnyoSeleccionado,
      },
    });
    console.log("especificas", res.data);
    setEspecificas(res.data);
  }
  async function agregarEspecifica(presupuestoanalitico_costosasignados_id) {
    var maxId = 1475;
    Especificas.forEach((item) => {
      if (
        presupuestoanalitico_costosasignados_id == item.id_costo &&
        item.id_clasificador > maxId
      ) {
        maxId = item.id_clasificador;
      }
    });
    await axios.put(`${UrlServer}/v1/analitico/`, {
      clasificadores_presupuestarios_id: maxId + 1,
      presupuestoanalitico_costosasignados_id,
    });
    cargarEspecificas();
  }
  async function guardarAvanceAnual(monto, presupuesto_analitico_id, anyo) {
    await axios.put(`${UrlServer}/v1/analitico/avanceAnual`, {
      presupuesto_analitico_id,
      anyo,
      monto: monto || 0,
    });
    cargarEspecificas();
  }
  async function actualizarEspecifica(
    clasificadores_presupuestarios_id,
    id,
    presupuestoanalitico_costosasignados_id
  ) {
    await axios.put(`${UrlServer}/v1/analitico/`, {
      id,
      clasificadores_presupuestarios_id,
      presupuestoanalitico_costosasignados_id,
    });
    cargarEspecificas();
    setEstadoEdicion("");
  }
  async function eliminarEspecifica(id) {
    if (confirm("Esta seguro de eliminar esta especifica?")) {
      await axios.delete(`${UrlServer}/v1/analitico/${id}`);
      cargarEspecificas();
    }
  }
  function RenderEspecificaData(item) {
    var tempRender = [];
    var properties = Object.keys(item).filter(
      (element) =>
        element.startsWith("presupuesto_") ||
        element.startsWith("avanceAnual_") ||
        element.startsWith("avanceMensual_")
    );
    var acumulado = 0;
    var ultimoPresupuesto = 0;
    for (let i = 0; i < properties.length; i++) {
      const key = properties[i];
      if (key.startsWith("presupuesto_")) {
        tempRender.push(
          ModoEdicion ? (
            <td style={{ padding: "0px" }}>
              {Permisos["analitico_agregar_presupuestomonto"] && (
                <CustomInput
                  value={Redondea(item[key], 2, false, "")}
                  onBlur={(value) => {
                    guardarPresupuesto(value, item.id, key.split("_")[1]);
                  }}
                />
              )}
            </td>
          ) : (
            <td style={{ textAlign: "right" }}>
              {Redondea(item[key], 2, false, "")}
            </td>
          )
        );
        ultimoPresupuesto = item[key];
      }
      if (key.startsWith("avanceAnual_")) {
        tempRender.push(
          ModoEdicion ? (
            <td style={{ padding: "0px" }}>
              {Permisos["analitico_agregar_avanceanual"] == 1 && (
                <CustomInput
                  key={key}
                  value={Redondea(item[key], 2, false, "")}
                  onBlur={(value) =>
                    guardarAvanceAnual(value, item.id, key.split("_")[1])
                  }
                />
              )}
            </td>
          ) : (
            <td style={{ textAlign: "right" }}>
              {Redondea(item[key], 2, false, "")}
            </td>
          )
        );
        tempRender.push(
          <th style={{ textAlign: "right" }} className="porcentaje">
            {item[key]
              ? Redondea((item[key] / ultimoPresupuesto) * 100) + "%"
              : ""}
          </th>
        );
        //calculando acumulado
        if (item[key]) acumulado += item[key];
      }
      if (key.startsWith("avanceMensual")) {
        tempRender.push(
          <td style={{ textAlign: "right" }}>{Redondea(item[key])}</td>
        );
        tempRender.push(
          <th style={{ textAlign: "right" }} className="porcentaje">
            {item[key]
              ? Redondea((item[key] / ultimoPresupuesto) * 100) + "%"
              : ""}
          </th>
        );
        //calculando acumulado
        if (item[key]) acumulado += item[key];
      }
    }
    //acumulado
    tempRender.splice(
      PresupuestosAprobados.length,
      0,
      <td style={{ textAlign: "right" }}>{Redondea(acumulado)}</td>
    );
    //porcentaje acumulado
    tempRender.splice(
      PresupuestosAprobados.length + 1,
      0,
      <th style={{ textAlign: "right" }} className="porcentaje">
        {Redondea((acumulado / ultimoPresupuesto) * 100)} %
      </th>
    );
    // saldo
    tempRender.splice(
      PresupuestosAprobados.length + 2,
      0,
      <td
        style={{
          textAlign: "right",
          color: ultimoPresupuesto - acumulado < 0 ? "red" : "black",
        }}
      >
        {Redondea(ultimoPresupuesto - acumulado)}
      </td>
    );
    //porcentaje saldo
    tempRender.splice(
      PresupuestosAprobados.length + 3,
      0,
      <th style={{ textAlign: "right" }} className="porcentaje">
        {Redondea(((ultimoPresupuesto - acumulado) / ultimoPresupuesto) * 100)}{" "}
        %
      </th>
    );
    return tempRender;
  }
  //anyos ejecutados
  const [AnyosEjecutados, setAnyosEjecutados] = useState([]);
  async function cargarAnyosEjecutados() {
    var res = await axios.get(`${UrlServer}/v1/analitico/anyosEjecutados`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo: AnyoSeleccionado,
      },
    });
    setAnyosEjecutados(res.data);
  }
  async function eliminarAnyoEjecutado(anyo) {
    if (confirm("Esta seguro de eliminar este dato?")) {
      var res = await axios.delete(
        `${UrlServer}/v1/analitico/anyosEjecutados/${anyo}`
      );
      cargarAnyosEjecutados();
      cargarEspecificas();
    }
  }
  //opciones
  const [ShowIcons, setShowIcons] = useState("");
  const [RefEspecificas, setRefEspecificas] = useState([]);
  const [CostosCollapse, setCostosCollapse] = useState([]);
  const [EstadoEdicion, setEstadoEdicion] = useState("");
  function cambiarCostosCollapseTodos(estado) {
    var clone = [...CostosCollapse];
    clone.forEach((item, i) => {
      clone[i] = estado;
    });
    setCostosCollapse(clone);
  }
  const [ModoEdicion, setModoEdicion] = useState(false);
  //render
  function RenderMesesTitulo() {
    var tempRender = [];
    // AvanceAnual;
    for (let index = 1; index <= 12; index++) {
      tempRender.push(
        <th colSpan="2">
          {mesesShort[index - 1]} - {AnyoSeleccionado}
        </th>
      );
    }
    return tempRender;
  }
  function RenderTotales() {
    var tempRender = [];
    var acumulado = 0;
    var ultimoPresupuesto = 0;
    if (Especificas.length > 0) {
      var properties = Object.keys(Especificas[0]).filter(
        (element) =>
          element.startsWith("presupuesto_") ||
          element.startsWith("avanceAnual_") ||
          element.startsWith("avanceMensual")
      );
      for (let i = 0; i < properties.length; i++) {
        const key = properties[i];
        var accu = 0;
        for (let j = 0; j < Especificas.length; j++) {
          const especifica = Especificas[j];
          accu += especifica[key];
        }
        if (key.startsWith("presupuesto_")) {
          tempRender.push(
            <th style={{ textAlign: "right" }}>{Redondea(accu)}</th>
          );
          ultimoPresupuesto = accu;
        }
        if (key.startsWith("avanceAnual_")) {
          tempRender.push(
            <th style={{ textAlign: "right" }}>{Redondea(accu)}</th>
          );
          tempRender.push(
            <th style={{ textAlign: "right" }} className="porcentaje">
              {Redondea((accu / ultimoPresupuesto) * 100)} %
            </th>
          );
          acumulado += accu;
        }
        if (key.startsWith("avanceMensual")) {
          tempRender.push(
            <th style={{ textAlign: "right" }}>{Redondea(accu)}</th>
          );
          tempRender.push(
            <th style={{ textAlign: "right" }} className="porcentaje">
              {Redondea((accu / ultimoPresupuesto) * 100)} %
            </th>
          );
          acumulado += accu;
        }
      }
    }
    //acumulado
    tempRender.splice(
      PresupuestosAprobados.length,
      0,
      <th style={{ textAlign: "right" }}>{Redondea(acumulado)}</th>
    );
    //porcentaje acumulado
    tempRender.splice(
      PresupuestosAprobados.length + 1,
      0,
      <th style={{ textAlign: "right" }} className="porcentaje">
        {Redondea((acumulado / ultimoPresupuesto) * 100)} %
      </th>
    );
    // saldo
    tempRender.splice(
      PresupuestosAprobados.length + 2,
      0,
      <th style={{ textAlign: "right" }}>
        {Redondea(ultimoPresupuesto - acumulado)}
      </th>
    );
    //porcentaje saldo
    tempRender.splice(
      PresupuestosAprobados.length + 3,
      0,
      // <th>saldo porcentaje</th>
      <th style={{ textAlign: "right" }} className="porcentaje">
        {Redondea(((ultimoPresupuesto - acumulado) / ultimoPresupuesto) * 100)}{" "}
        %
      </th>
    );

    return tempRender;
  }

  return (
    <div style={{ overflowX: "auto", minHeight: "580px" }}>
      {Permisos["analitico_modoedicion"] == 1 && (
        <Button
          color={ModoEdicion ? "primary" : "danger"}
          onClick={() => setModoEdicion(!ModoEdicion)}
        >
          Modo edicion
        </Button>
      )}
      {CostosAnalitico.length > 0 && (
        <Button onClick={() => cambiarCostosCollapseTodos(true)}>
          Expandir todo
        </Button>
      )}
      {CostosAnalitico.length > 0 && (
        <Button onClick={() => cambiarCostosCollapseTodos(false)}>
          Contraer todo
        </Button>
      )}
      {ModoEdicion &&
        Permisos["analitico_agregar_costo"] == 1 &&
        CostosAnalitico.length == 0 && (
          <span>
            {"Paso 1. Nuevo costo =>"}
            <ModalCostosAnalitico recargar={cargarCostosAnalitico} />
          </span>
        )}
      {ModoEdicion &&
        Permisos["analitico_agregar_presupuesto"] == 1 &&
        CostosAnalitico.length >= 0 &&
        PresupuestosAprobados.length == 0 && (
          <span>
            {"Paso 2. Nuevo presupuesto =>"}
            <ModalNuevoPresupuesto recargar={cargarPresupuestosAprobados} />
          </span>
        )}
      {ModoEdicion &&
        Permisos["analitico_agregar_anyoejecutado"] == 1 &&
        AnyosEjecutados.length == 0 && (
          <span>
            {"Paso 3. Nuevo Año Ejecutado(opcional) =>"}
            <ModalNuevoAnyo
              recargar={() => {
                cargarAnyosEjecutados();
                cargarEspecificas();
              }}
            />
          </span>
        )}
      {CostosAnalitico.length > 0 && (
        <table className="whiteThem-table" style={{ width: "max-content" }}>
          <thead style={{ fontSize: "10px" }}>
            <tr>
              {CostosAnalitico.length > 0 && (
                <th style={{ fontSize: "9px" }}>ITEM</th>
              )}
              <th
                style={{
                  width: "400px",
                }}
              >
                {CostosAnalitico.length > 0 && <span>DESCRIPCION</span>}{" "}
                {CostosAnalitico.length > 0 &&
                  ModoEdicion &&
                  Permisos["analitico_agregar_costo"] == 1 && (
                    <span style={{ position: "absolute", right: "0px" }}>
                      <ModalCostosAnalitico recargar={cargarCostosAnalitico} />
                    </span>
                  )}
              </th>
              {PresupuestosAprobados.map((item, i) => (
                <th key={i}>
                  <div
                    onClick={() => {
                      if (ShowIcons != "presupuesto_" + i) {
                        setShowIcons("presupuesto_" + i);
                      } else {
                        setShowIcons("");
                      }
                    }}
                    className="d-flex"
                    style={{ cursor: "pointer" }}
                  >
                    <span>{item.nombre}</span>
                    {PresupuestosAprobados.length - 1 == i && (
                      <span>
                        {ModoEdicion &&
                          Permisos["analitico_agregar_presupuesto"] == 1 && (
                            <ModalNuevoPresupuesto
                              recargar={() => {
                                cargarPresupuestosAprobados();
                                cargarEspecificas();
                              }}
                            />
                          )}
                      </span>
                    )}
                  </div>
                  {ShowIcons == "presupuesto_" + i && (
                    <div>
                      {item.resolucion && (
                        <div
                          style={{
                            fontSize: "9px",
                          }}
                        >
                          {item.resolucion}
                        </div>
                      )}

                      <div>
                        <span>
                          <FaFileAlt
                            onClick={() =>
                              DescargarArchivo(`${UrlServer}${item.archivo}`)
                            }
                            style={{ cursor: "pointer" }}
                          />{" "}
                          {ModoEdicion &&
                            Permisos["analitico_editar_presupuesto"] == 1 && (
                              <ModalNuevoPresupuesto
                                data={item}
                                recargar={cargarPresupuestosAprobados}
                              />
                            )}
                          {ModoEdicion &&
                            Permisos["analitico_eliminar_presupuesto"] == 1 && (
                              <FaRegTrashAlt
                                onClick={() => eliminarPresupuesto(item.id)}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                        </span>
                      </div>
                    </div>
                  )}
                </th>
              ))}
              {CostosAnalitico.length > 0 && (
                <th
                  colSpan="2"
                  style={{
                    background: "orange",
                    color: "black",
                  }}
                >
                  ACUMULADO
                </th>
              )}
              {CostosAnalitico.length > 0 && (
                <th
                  colSpan="2"
                  style={{
                    background: "orange",
                    color: "black",
                  }}
                >
                  SALDO
                </th>
              )}
              {AnyosEjecutados.map((item, i) => (
                <th colSpan="2">
                  <div className="d-flex">
                    <span
                      onClick={() => {
                        if (ShowIcons != "anyoEjectuado_" + i) {
                          setShowIcons("anyoEjectuado_" + i);
                        } else {
                          setShowIcons("");
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      TOTAL EJECUTADO {item.anyo}
                    </span>
                    {ModoEdicion &&
                      Permisos["analitico_agregar_anyoejecutado"] == 1 &&
                      AnyosEjecutados.length - 1 == i && (
                        <span>
                          <ModalNuevoAnyo
                            recargar={() => {
                              cargarEspecificas();
                              cargarAnyosEjecutados();
                            }}
                          />
                        </span>
                      )}
                  </div>

                  {ShowIcons == "anyoEjectuado_" + i && (
                    <div>
                      {ModoEdicion &&
                        Permisos["analitco_eliminar_anyoejecutado"] == 1 && (
                          <FaRegTrashAlt
                            onClick={() => eliminarAnyoEjecutado(item.anyo)}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                    </div>
                  )}
                </th>
              ))}
              {CostosAnalitico.length > 0 && RenderMesesTitulo()}
            </tr>
          </thead>
          <tbody>
            {CostosAnalitico.map((item, i) => (
              <>
                <tr key={i + "-1"}>
                  <th
                    style={{ fontSize: "9px" }}
                    className="whiteThem-table-sticky"
                  >
                    {i + 1}
                  </th>
                  <th
                    className="whiteThem-table-sticky2"
                    style={{ position: "relative" }}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        var clone = [...CostosCollapse];
                        clone[i] = !clone[i];
                        setCostosCollapse(clone);
                      }}
                    >
                      {item.nombre}
                    </span>
                    <span style={{ position: "absolute", right: "0px" }}>
                      {ModoEdicion &&
                        Permisos["analitico_agregar_especifica"] == 1 && (
                          <FaPlusCircle
                            color="#242526"
                            size="15"
                            onClick={() => {
                              agregarEspecifica(item.id);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      {ModoEdicion &&
                        Permisos["analitico_eliminar_costo"] == 1 && (
                          <FaRegTrashAlt
                            color="#000000"
                            size="15"
                            onClick={() => eliminarCosto(item.id)}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                    </span>
                  </th>
                  {RenderCostosData(item)}
                </tr>
                {Especificas.filter((item2) => item2.id_costo == item.id).map(
                  (item2, j) => (
                    <tr
                      style={{
                        display: CostosCollapse[i] ? "" : "none",
                      }}
                    >
                      <td
                        style={{
                          cursor: "pointer",
                        }}
                        colSpan={
                          EstadoEdicion != "especifica_" + item2.id ? 1 : 2
                        }
                        className="whiteThem-table-sticky"
                        onClick={() => {
                          if (
                            ModoEdicion &&
                            Permisos["analitico_editar_especifica"] == 1 &&
                            EstadoEdicion != "especifica_" + item2.id
                          ) {
                            setEstadoEdicion("especifica_" + item2.id);
                          }
                        }}
                      >
                        {EstadoEdicion != "especifica_" + item2.id ? (
                          <span>{item2.clasificador}</span>
                        ) : (
                          <span style={{ display: "flex" }}>
                            <CustomAsyncSelect
                              value={item2}
                              guardar={(valor) =>
                                actualizarEspecifica(valor, item2.id, item.id)
                              }
                            />
                            <MdCancel
                              onClick={() => setEstadoEdicion("")}
                              style={{ cursor: "pointer" }}
                              size={"20"}
                            />
                          </span>
                        )}
                      </td>
                      {EstadoEdicion != "especifica_" + item2.id && (
                        <td
                          className="whiteThem-table-sticky2"
                          style={{
                            position: "relative",
                          }}
                        >
                          {item2.descripcion}
                          {ModoEdicion &&
                            Permisos["analitico_eliminar_especifica"] == 1 && (
                              <span
                                style={{
                                  cursor: "pointer",
                                  position: "absolute",
                                  right: "0px",
                                }}
                              >
                                <FaRegTrashAlt
                                  onClick={() => eliminarEspecifica(item2.id)}
                                  size="15"
                                />
                              </span>
                            )}
                        </td>
                      )}
                      {RenderEspecificaData(item2)}
                    </tr>
                  )
                )}
              </>
            ))}
            {PresupuestosAprobados.length > 0 && (
              <tr>
                <th></th>
                <th style={{ textAlign: "right" }}>PRESUPUESTO TOTAL</th>
                {RenderTotales()}
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
function CustomSelect({
  value,
  Opciones = [],
  itemValue,
  itemLabel,
  guardar,
  cancel,
}) {
  const [Value, setValue] = useState(value);
  const [FlagCambios, setFlagCambios] = useState(false);
  function handleInputChange(e) {
    setFlagCambios(true);
    setValue(formatMoney(e.target.value));
  }
  return (
    <>
      <Input
        type="select"
        value={Value}
        onChange={handleInputChange}
        onBlur={() => guardar(Value)}
      >
        {Opciones.map((item, i) => (
          <option value={item[itemValue]}>{item[itemLabel]}</option>
        ))}
      </Input>
    </>
  );
}
function CustomAsyncSelect({ value, guardar }) {
  const [FlagCambios, setFlagCambios] = useState(false);
  const [Value, setValue] = useState(value);
  function handleInputChange(input) {
    setFlagCambios(true);
    var inputData = input.label.split("-");
    setValue({
      id_clasificador: input.value,
      clasificador: inputData[0],
      descripcion: inputData[1],
    });
  }
  async function clasificadorOptions(inputValue) {
    var res = await axios.get(`${UrlServer}/v1/clasificadorPresupuestario/`, {
      params: {
        textoBuscado: inputValue,
        limit: 10,
        id_inicio: 1475,
        id_final: 1688,
      },
    });
    var temp = [];
    if (Array.isArray(res.data)) {
      res.data.forEach((item) => {
        temp.push({
          value: item.id,
          label: item.clasificador + " - " + item.descripcion,
        });
      });
    }
    return temp;
  }
  return (
    <>
      <span style={{ width: "500px" }}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={clasificadorOptions}
          // styles={customStyles}
          value={{
            value: Value.id_clasificador,
            label: Value.clasificador + " - " + Value.descripcion,
          }}
          onChange={handleInputChange}
        />
      </span>

      <MdSave
        style={{ cursor: "pointer" }}
        color={FlagCambios ? "orange" : ""}
        onClick={() => guardar(Value.id_clasificador)}
        size={"20"}
      />
    </>
  );
}

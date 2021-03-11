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
import { FaUpload, FaFileAlt, FaPlusCircle } from "react-icons/fa";

import ModalCostosAnalitico from "./ModalCostosAnalitico";
import ModalNuevoPresupuesto from "./ModalNuevoPresupuesto";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, DescargarArchivo, mesesShort } from "../Utils/Funciones";
import PresupuestoEspecifica from "./PresupuestoEspecifica";
import "./PresupuestoAnalitico.css";
import ModalNuevoAnyo from "./ModalNuevoAnyo";

export default () => {
  useEffect(() => {
    cargarPresupuestosAprobados();
  }, []);
  //Presupuesto
  const [PresupuestosAprobados, setPresupuestosAprobados] = useState([]);
  async function cargarPresupuestosAprobados() {
    var res = await axios.get(`${UrlServer}/v1/presupuestosAprobados`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setPresupuestosAprobados(res.data);
  }

  //CostosAnalitico
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

  function recargar() {
    cargarPresupuestosAprobados();
  }
  //show icon
  const [ShowIcons, setShowIcons] = useState(-1);

  //refs
  const [RefEspecificas, setRefEspecificas] = useState([]);
  //collapse costos
  const [CostosCollapse, setCostosCollapse] = useState([]);
  //expandir costos
  function cambiarCostosCollapseTodos(estado) {
    var clone = [...CostosCollapse];
    clone.forEach((item, i) => {
      clone[i] = estado;
    });
    setCostosCollapse(clone);
  }
  //anyoseleccionado
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(2021);
  //anyos ejecutados
  const [AnyosEjecutados, setAnyosEjecutados] = useState([]);
  //function de renderizado
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
  function RenderPresupuestosData(item) {
    var tempRender = [];
    var properties = Object.keys(item).filter(
      (element) =>
        element.startsWith("presupuesto_") ||
        element.startsWith("avanceAnual_") ||
        element.startsWith("avanceMensual")
    );
    //filter properties
    var acumulado = 0;
    var ultimoPresupuesto = 0;
    var acumuladoAnual = 0;
    var acumuladoMensual = 0;
    for (let i = 0; i < properties.length; i++) {
      const key = properties[i];
      tempRender.push(
        <th style={{ textAlign: "right" }}>{Redondea(item[key])}</th>
      );
      if (key.startsWith("presupuesto_")) {
        ultimoPresupuesto = item[key];
      }
      if (key.startsWith("avanceAnual_") || key.startsWith("avanceMensual_")) {
        tempRender.push(
          <th style={{ textAlign: "right" }}>
            {Redondea((item[key] / ultimoPresupuesto) * 100)} %
          </th>
        );
        if (item[key]) acumulado += item[key];

        if (key.startsWith("avanceAnual_")) {
          if (item[key]) acumuladoAnual += item[key];
        }
        if (key.startsWith("avanceMensual_")) {
          if (item[key]) acumuladoMensual += item[key];
        }
      }
    }
    //acumulados
    tempRender.push(
      <th style={{ textAlign: "right" }}>{Redondea(acumulado)}</th>
    );
    tempRender.push(
      <th style={{ textAlign: "right" }}>
        {Redondea((acumulado / ultimoPresupuesto) * 100)} %
      </th>
    );
    // saldo
    tempRender.push(
      <th style={{ textAlign: "right" }}>
        {Redondea(ultimoPresupuesto - acumulado)}
      </th>
    );
    tempRender.push(
      <th style={{ textAlign: "right" }}>
        {Redondea(((ultimoPresupuesto - acumulado) / ultimoPresupuesto) * 100)}{" "}
        %
      </th>
    );
    //zona de presupuesto pim
    tempRender.push(
      <th style={{ textAlign: "right" }}>{Redondea(acumuladoAnual)}</th>
    );
    // saldo anyo pasado
    tempRender.push(
      <th style={{ textAlign: "right" }}>
        {Redondea(ultimoPresupuesto - acumuladoAnual)}
      </th>
    );
    //pim
    tempRender.push(
      <th style={{ textAlign: "right" }}>{Redondea(item["pim"])}</th>
    );
    //devengado anyo actual
    tempRender.push(
      <th style={{ textAlign: "right" }}>{Redondea(acumuladoMensual)}</th>
    );
    //saldo devengado
    tempRender.push(
      <th style={{ textAlign: "right" }}>
        {Redondea(item["pim"] - acumuladoMensual)}
      </th>
    );
    //saldo por asignar
    tempRender.push(
      <th style={{ textAlign: "right" }}>
        {Redondea(ultimoPresupuesto - acumuladoAnual - item["pim"])}
      </th>
    );
    return tempRender;
  }

  function RenderPresupuestoTotales() {
    var tempRender = [];
    if (CostosAnalitico.length) {
      var item = CostosAnalitico[0];
      var properties = Object.keys(item).filter(
        (element) =>
          element.startsWith("presupuesto_") ||
          element.startsWith("avanceAnual_") ||
          element.startsWith("avanceMensual")
      );
      var acumulado = 0;
      var ultimoPresupuesto = 0;
      var acumuladoAnual = 0;
      var acumuladoMensual = 0;
      for (let i = 0; i < properties.length; i++) {
        const key = properties[i];
        var total = 0;
        for (let index2 = 0; index2 < CostosAnalitico.length; index2++) {
          const item = CostosAnalitico[index2];
          if (item[key]) {
            total += item[key];
            if (
              key.startsWith("avanceAnual_") ||
              key.startsWith("avanceMensual")
            ) {
              acumulado += item[key];
              if (key.startsWith("avanceAnual_")) {
                if (item[key]) acumuladoAnual += item[key];
              }
              if (key.startsWith("avanceMensual_")) {
                if (item[key]) acumuladoMensual += item[key];
              }
            }
            if (key.startsWith("presupuesto_")) {
              ultimoPresupuesto = total;
            }
          }
        }
        tempRender.push(
          <th style={{ textAlign: "right" }}>{Redondea(total)}</th>
        );
        if (key.startsWith("avanceAnual_") || key.startsWith("avanceMensual")) {
          tempRender.push(
            <th style={{ textAlign: "right" }}>
              {Redondea((total / ultimoPresupuesto) * 100)}
            </th>
          );
        }
      }
      //acumulados
      tempRender.push(
        <th style={{ textAlign: "right" }}>{Redondea(acumulado)}</th>
      );
      tempRender.push(
        <th style={{ textAlign: "right" }}>
          {Redondea((acumulado / ultimoPresupuesto) * 100)}
        </th>
      );
      // saldo
      tempRender.push(
        <th style={{ textAlign: "right" }}>
          {Redondea(ultimoPresupuesto - acumulado)}
        </th>
      );
      tempRender.push(
        <th style={{ textAlign: "right" }}>
          {Redondea(
            ((ultimoPresupuesto - acumulado) / ultimoPresupuesto) * 100
          )}
        </th>
      );
      //zona de presupuesto pim
      var pim = 0;
      for (let index2 = 0; index2 < CostosAnalitico.length; index2++) {
        const item = CostosAnalitico[index2];
        if (item["pim"]) {
          pim += item["pim"];
        }
      }
      //acumulado anual
      tempRender.push(
        <th style={{ textAlign: "right" }}>{Redondea(acumuladoAnual)}</th>
      );
      // saldo anyo pasado
      tempRender.push(
        <th style={{ textAlign: "right" }}>
          {Redondea(ultimoPresupuesto - acumuladoAnual)}
          {/* {ultimoPresupuesto + " - " + acumuladoAnual} */}
        </th>
      );
      //pim
      tempRender.push(<th style={{ textAlign: "right" }}>{Redondea(pim)}</th>);
      //devengado anyo actual
      tempRender.push(
        <th style={{ textAlign: "right" }}>{Redondea(acumuladoMensual)}</th>
      );
      //saldo devengado
      tempRender.push(
        <th style={{ textAlign: "right" }}>
          {Redondea(pim - acumuladoMensual)}
        </th>
      );
      //saldo por asignar
      tempRender.push(
        <th style={{ textAlign: "right" }}>
          {Redondea(ultimoPresupuesto - acumuladoAnual - pim)}
        </th>
      );
    }

    return tempRender;
  }
  useEffect(() => {
    if (PresupuestosAprobados.length) {
      cargarCostosAnalitico();
    }
  }, [PresupuestosAprobados]);
  return (
    <div style={{ overflowX: "auto", minHeight: "580px" }}>
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
      {PresupuestosAprobados.length == 0 && (
        <span>
          {"Paso 1. Nuevo presupuesto =>"}
          <ModalNuevoPresupuesto recargar={recargar} />
        </span>
      )}{" "}
      {CostosAnalitico.length == 0 && (
        <span>
          {"Paso 2. Nuevo costo =>"}
          <ModalCostosAnalitico recargar={recargar} />
        </span>
      )}{" "}
      {AnyosEjecutados.length == 0 && (
        <span>
          {"Paso 3. Nuevo Año Ejecutado(opcional) =>"}
          <ModalNuevoAnyo recargar={recargar} />
        </span>
      )}
      <table className="whiteThem-table" style={{ width: "max-content" }}>
        <thead style={{ fontSize: "10px" }}>
          <tr>
            {CostosAnalitico.length > 0 && (
              <th style={{ fontSize: "9px" }} className="whiteThem-table-item">
                ITEM
              </th>
            )}
            <th
              className="whiteThem-table-descripcion"
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "none",
              }}
            >
              {CostosAnalitico.length > 0 && <span>DESCRIPCION</span>}{" "}
              {PresupuestosAprobados.length > 0 && (
                <span>
                  {CostosAnalitico.length == 0 && "Agregar nuevo costo =>"}
                  <ModalCostosAnalitico recargar={recargar} />
                </span>
              )}
            </th>
            {PresupuestosAprobados.map((item, i) => (
              <th key={i}>
                <div
                  onClick={() => {
                    if (ShowIcons != i) {
                      setShowIcons(i);
                    } else {
                      setShowIcons(-1);
                    }
                  }}
                  className="d-flex"
                >
                  <span>{item.nombre}</span>
                  {PresupuestosAprobados.length - 1 == i && (
                    <span>
                      {PresupuestosAprobados.length == 0 &&
                        " Agregar nuevo presupuesto =>"}
                      <ModalNuevoPresupuesto recargar={recargar} />
                    </span>
                  )}
                </div>
                {ShowIcons == i && (
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
                        <ModalNuevoPresupuesto
                          data={item}
                          recargar={recargar}
                        />
                      </span>
                    </div>
                  </div>
                )}
              </th>
            ))}
            {AnyosEjecutados.map((item, i) => (
              <th colSpan="2">
                <span>TOTAL EJECUTADO {item.substr(item.length - 4)}</span>
                {AnyosEjecutados.length - 1 == i && (
                  <span>
                    <ModalNuevoAnyo recargar={recargar} />
                  </span>
                )}
              </th>
            ))}
            {CostosAnalitico.length > 0 && RenderMesesTitulo()}
            {CostosAnalitico.length > 0 && <th colSpan="2">Acumulado</th>}
            {CostosAnalitico.length > 0 && <th colSpan="2">Saldo</th>}
            <th>Acumulado al {AnyoSeleccionado - 1}</th>
            <th>Saldo al {AnyoSeleccionado - 1}</th>
            <th>PIM {AnyoSeleccionado}</th>
            <th>DEVENGADO {AnyoSeleccionado}</th>
            <th>SALDO DEVENGADO PIM {AnyoSeleccionado}</th>
            <th>SALDO POR ASIGNAR {AnyoSeleccionado}</th>
          </tr>
        </thead>
        <tbody>
          {CostosAnalitico.map((item, i) => [
            <tr key={i + "-1"}>
              <th style={{ fontSize: "9px" }}>{i + 1}</th>
              <th
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  border: "none",
                }}
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
                <span>
                  <FaPlusCircle
                    color="#000000"
                    size="15"
                    onClick={() => {
                      RefEspecificas[item.id].nuevo();
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </span>
              </th>
              {RenderPresupuestosData(item)}
            </tr>,
            <PresupuestoEspecifica
              key={i + "-2"}
              id_costo={item.id}
              PresupuestosAprobados={PresupuestosAprobados}
              index_costo={i}
              CostosAnalitico={CostosAnalitico}
              setCostosAnalitico={setCostosAnalitico}
              ref={(ref) => {
                var clone = RefEspecificas;
                clone[item.id] = ref;
                setRefEspecificas(clone);
              }}
              display={CostosCollapse[i] ? "" : "none"}
              AnyoSeleccionado={AnyoSeleccionado}
              setAnyosEjecutados={setAnyosEjecutados}
            />,
          ])}
          {PresupuestosAprobados.length > 0 && (
            <tr>
              <th></th>
              <th style={{ textAlign: "right" }}>PRESUPUESTO TOTAL</th>
              {RenderPresupuestoTotales()}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

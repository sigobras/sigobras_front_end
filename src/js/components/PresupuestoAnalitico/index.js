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
import { FaUpload, FaDownload, FaPlusCircle } from "react-icons/fa";

import ModalCostosAnalitico from "./ModalCostosAnalitico";
import ModalNuevoPresupuesto from "./ModalNuevoPresupuesto";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, DescargarArchivo } from "../Utils/Funciones";
import PresupuestoEspecifica from "./PresupuestoEspecifica";
import "./PresupuestoAnalitico.css";

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
    cargarCostosAnalitico();
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
  useEffect(() => {
    if (PresupuestosAprobados.length) {
      cargarCostosAnalitico();
    }
  }, [PresupuestosAprobados]);
  return (
    <div>
      <Button onClick={() => cambiarCostosCollapseTodos(true)}>
        Expandir todo
      </Button>
      <Button onClick={() => cambiarCostosCollapseTodos(false)}>
        Contraer todo
      </Button>
      <table className="whiteThem-table">
        <thead style={{ fontSize: "10px" }}>
          <tr>
            {CostosAnalitico.length > 0 && <th>ITEM</th>}
            <th
              style={{
                display: "flex",
                justifyContent: "space-between",
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
              <th key={i} style={{ position: "relative" }}>
                <div
                  onClick={() => {
                    if (ShowIcons != i) {
                      setShowIcons(i);
                    } else {
                      setShowIcons(-1);
                    }
                  }}
                >
                  {item.nombre}
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
                        <FaDownload
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
            <th>
              <div>
                {PresupuestosAprobados.length == 0 &&
                  " Agregar nuevo presupuesto =>"}
                <ModalNuevoPresupuesto recargar={recargar} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {CostosAnalitico.map((item, i) => [
            <tr key={i + "-1"}>
              <th>{item.id}</th>
              <th
                style={{
                  display: "flex",
                  justifyContent: "space-between",
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
              {(() => {
                var tempRender = [];
                for (
                  let index = 0;
                  index < PresupuestosAprobados.length;
                  index++
                ) {
                  var element = PresupuestosAprobados[index];
                  tempRender.push(
                    <th style={{ textAlign: "right" }}>
                      {Redondea(item["presupuesto_" + element.id])}
                    </th>
                  );
                }
                return tempRender;
              })()}
            </tr>,
            <PresupuestoEspecifica
              key={i + "-2"}
              id_costo={item.id}
              PresupuestosAprobados={PresupuestosAprobados}
              index={i}
              CostosAnalitico={CostosAnalitico}
              setCostosAnalitico={setCostosAnalitico}
              ref={(ref) => {
                var clone = RefEspecificas;
                clone[item.id] = ref;
                setRefEspecificas(clone);
              }}
              display={CostosCollapse[i] ? "" : "none"}
            />,
          ])}
          {PresupuestosAprobados.length > 0 && (
            <tr>
              <th colSpan="2">PRESUPUESTO TOTAL</th>
              {(() => {
                var tempRender = [];
                for (
                  let index = 0;
                  index < PresupuestosAprobados.length;
                  index++
                ) {
                  var element = PresupuestosAprobados[index];
                  var total = 0;
                  for (
                    let index2 = 0;
                    index2 < CostosAnalitico.length;
                    index2++
                  ) {
                    const element2 = CostosAnalitico[index2];
                    if (element2["presupuesto_" + element.id]) {
                      total += element2["presupuesto_" + element.id];
                    }
                  }
                  tempRender.push(
                    <th style={{ textAlign: "right" }}>{Redondea(total)}</th>
                  );
                }
                return tempRender;
              })()}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

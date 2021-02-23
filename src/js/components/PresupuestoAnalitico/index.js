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
} from "reactstrap";
import axios from "axios";
import { FaUpload, FaDownload } from "react-icons/fa";

import ModalCostosAnalitico from "./ModalCostosAnalitico";
import ModalNuevoPresupuesto from "./ModalNuevoPresupuesto";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, DescargarArchivo } from "../Utils/Funciones";
import PresupuestoEspecifica from "./PresupuestoEspecifica";
import "./PresupuestoAnalitico.css";

export default () => {
  useEffect(() => {
    cargarEspecicasDatos();
    cargarPresupuestosAprobados();
    cargarCostosAnalitico();
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
    console.log("cargarPresupuestosAprobados", res.data);
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
  }
  function agregarCostoAnalitico() {
    var clone = [...CostosAnalitico];
    clone.push(CostosNombres[IndexCostoSeleccionado]);
    setCostosAnalitico(clone);
  }
  //especificas
  const [EspecificasDatos, setEspecificasDatos] = useState([]);
  async function cargarEspecicasDatos() {
    var res = await axios.get(`${UrlServer}/v1/clasificadorPresupuestario`);
    var temp = [];
    if (Array.isArray(res.data)) {
      res.data.forEach((item) => {
        temp.push({
          value: item.id,
          label: item.clasificador + " - " + item.descripcion,
        });
      });
    }
    setEspecificasDatos(temp);
  }
  function recargar() {
    cargarPresupuestosAprobados();
    cargarCostosAnalitico();
  }
  //show icon
  const [ShowUploadIcon, setShowUploadIcon] = useState(-1);
  //uploadArchivo archivo

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>ITEM</th>
            <th>
              <span>DESCRIPCION</span>{" "}
              <ModalCostosAnalitico recargar={recargar} />
            </th>
            {PresupuestosAprobados.map((item, i) => (
              <th
                key={i}
                onMouseOver={() => setShowUploadIcon(i)}
                onMouseLeave={() => setShowUploadIcon(-1)}
                style={{ position: "relative" }}
              >
                <div>{item.nombre}</div>
                <div>
                  {item.archivo && (
                    <div
                      onClick={() =>
                        DescargarArchivo(`${UrlServer}${item.archivo}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <FaDownload />
                    </div>
                  )}
                </div>
                {ShowUploadIcon == i && (
                  <div
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                    }}
                    onClick={() => uploadArchivo()}
                  >
                    <ModalNuevoPresupuesto data={item} recargar={recargar} />
                  </div>
                )}
              </th>
            ))}
            <th>
              <ModalNuevoPresupuesto recargar={recargar} />
            </th>
          </tr>
        </thead>
        <tbody>
          {CostosAnalitico.map((item, i) => [
            <tr key={i + "-1"}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              {(() => {
                var tempRender = [];
                for (
                  let index = 0;
                  index < PresupuestosAprobados.length;
                  index++
                ) {
                  var element = PresupuestosAprobados[index];
                  tempRender.push(
                    <td>{item["presupuesto_aprobado_" + element.id]}</td>
                  );
                }
                return tempRender;
              })()}
            </tr>,
            <PresupuestoEspecifica
              key={i + "-2"}
              id_costo={item.id}
              EspecificasDatos={EspecificasDatos}
              PresupuestosAprobados={PresupuestosAprobados}
            />,
          ])}
        </tbody>
      </table>
    </div>
  );
};

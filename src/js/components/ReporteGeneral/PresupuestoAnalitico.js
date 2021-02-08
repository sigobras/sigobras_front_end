import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiEyeFill } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
import DatosEspecificos from "./DatosEspecificos";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data }) => {
  useEffect(() => {
    cargarData();
  }, []);
  const [Data, setData] = useState([]);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/analitico/resumen`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: 2020,
      },
    });

    for (let i = 0; i < res.data.length; i++) {
      var devengado_actual = 0;
      const item = res.data[i];
      for (let mes = 1; mes < 12; mes++) {
        devengado_actual += item["financiero_monto_mes" + mes];
      }
      item.devengado_actual = devengado_actual;
    }
    setData(res.data);
  }
  return (
    <div style={{ width: "2000px" }}>
      <table className="text-center">
        <tbody>
          <tr>
            <th className="reporteGeneral-bodySticky-analitico ">
              Descripción
            </th>
            <th>Aprobado (Final)</th>
            <th>Ejecutado al 2019</th>
            <th>Saldo al 2019</th>
            <th>pim al 2020</th>
            <th>devengado</th>
            <th>saldodevengado</th>
            <th>saldoasignar</th>
            {(() => {
              var tempRender = [];
              for (let mes = 1; mes <= 12; mes++) {
                tempRender.push(
                  <th key={mes}>
                    <div>Prog. x la Obra</div>
                    <div>{mesesShort[mes - 1]}</div>
                  </th>
                );
                tempRender.push(
                  <th key={mes + "-2"}>
                    <div>Ejecutado</div>
                    <div>{mesesShort[mes - 1]}</div>
                  </th>
                );
              }
              return tempRender;
            })()}
          </tr>
          {Data.map((item, i) => (
            <tr key={i}>
              <th className="reporteGeneral-bodySticky-analitico ">
                {item.nombre}
              </th>
              <td>{Redondea(item.presupuesto_aprobado_anterior)}</td>
              <td>{Redondea(item.financiero_ejecutado_anterior)}</td>
              <td>
                {Redondea(
                  item.presupuesto_aprobado_anterior -
                    item.financiero_ejecutado_anterior
                )}
              </td>
              <td>{Redondea(item.pim_actual)}</td>
              <td>{Redondea(item.devengado_actual)}</td>
              <td>{Redondea(item.pim_actual - item.devengado_actual)}</td>
              <td>
                {" "}
                {Redondea(
                  item.presupuesto_aprobado_anterior -
                    item.financiero_ejecutado_anterior -
                    item.pim_actual
                )}
              </td>
              {(() => {
                var tempRender = [];
                for (let mes = 1; mes <= 12; mes++) {
                  tempRender.push(
                    <td key={mes}>
                      {Redondea(item["financiero_programado_monto_mes" + mes])}
                    </td>
                  );
                  tempRender.push(
                    <td key={mes + "-2"}>
                      {Redondea(item["financiero_monto_mes" + mes])}
                    </td>
                  );
                }
                return tempRender;
              })()}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

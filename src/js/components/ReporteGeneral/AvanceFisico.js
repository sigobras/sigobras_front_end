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
export default ({ data, AnyoSeleccionado }) => {
  useEffect(() => {
    cargarAcumuladoPrevio();
    cargarData();
    cargarAcumuladoActual();
  }, []);
  //acumlado previo
  const [AcumuladoPrevio, setAcumuladoPrevio] = useState({});
  async function cargarAcumuladoPrevio() {
    var res = await axios.get(`${UrlServer}/v1/avance/acumuladoAnual`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado - 1,
      },
    });
    setAcumuladoPrevio(res.data);
  }
  //acumlado actual
  const [AcumuladoActual, setAcumuladoActual] = useState({});
  async function cargarAcumuladoActual() {
    var res = await axios.get(`${UrlServer}/v1/avance/acumuladoAnual`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado,
      },
    });
    setAcumuladoActual(res.data);
  }
  //data
  const [Data, setData] = useState([]);
  const [DataTotal, setDataTotal] = useState(0);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/avance/resumenAnual`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado,
      },
    });
    setData(res.data);
    var total = res.data.reduce((acc, item) => acc + item.fisico_monto, 0);
    setDataTotal(total);
  }
  function buscarMes(mes) {
    return Data.find((item) => item.mes == mes);
  }
  return (
    <div style={{ width: "300px" }}>
      <table
        style={{ width: "100%" }}
        className="text-center reporteGeneral-titulos reporteGeneral-table"
      >
        <tbody>
          <tr>
            <th colSpan="2" style={{ width: "70px" }}>
              A Dic. {AnyoSeleccionado - 1}
            </th>
            <td style={{ width: "70px" }}>
              {Redondea(
                (AcumuladoPrevio.fisico_monto / data.presupuesto_costodirecto) *
                  100
              )}
              %
            </td>
            <td colSpan="3">S/.{Redondea(AcumuladoPrevio.fisico_monto)}</td>
          </tr>
          {(() => {
            var dataTemp = [];
            var background = "";
            function esFechaActual(mes) {
              var currentMonth = new Date().getMonth();
              var currentYear = new Date().getFullYear();
              if (currentYear == AnyoSeleccionado && currentMonth == mes) {
                return "#17a2b8";
              } else {
                return "";
              }
            }
            for (let i = 1; i <= 6; i++) {
              var mes1 = buscarMes(i) || {
                fisico_monto: 0,
                fisico_programado_monto: 0,
              };
              var mes2 = buscarMes(i + 6) || {
                fisico_monto: 0,
                fisico_programado_monto: 0,
              };
              dataTemp.push(
                <tr key={i}>
                  <th style={{ width: "70px" }}>{mesesShort[i - 1]}</th>
                  <td
                    style={{ width: "70px", background: esFechaActual(i - 1) }}
                  >
                    {/* <div>{Redondea(mes1.fisico_monto)}</div> */}
                    <div>
                      {Redondea(
                        (mes1.fisico_monto / data.presupuesto_costodirecto) *
                          100,
                        [2, 4]
                      )}
                      %
                    </div>
                  </td>
                  <td
                    style={{ width: "70px", background: esFechaActual(i - 1) }}
                  >
                    {/* <div>S/.{Redondea(mes1.fisico_programado_monto)}</div> */}
                    <div>
                      Prog.
                      {Redondea(
                        (mes1.fisico_programado_monto /
                          data.presupuesto_costodirecto) *
                          100,
                        [2, 4]
                      )}
                      %
                    </div>
                  </td>
                  <th style={{ width: "70px" }}>{mesesShort[i + 5]}</th>
                  <td
                    style={{ width: "70px", background: esFechaActual(i - 1) }}
                  >
                    {/* <div>S/.{Redondea(mes2.fisico_monto)}</div> */}
                    <div>
                      {Redondea(
                        (mes2.fisico_monto / data.presupuesto_costodirecto) *
                          100,
                        [2, 4]
                      )}
                      %
                    </div>
                  </td>
                  <td
                    style={{ width: "70px", background: esFechaActual(i - 1) }}
                  >
                    {/* <div>{Redondea(mes2.fisico_programado_monto, [2, 4])}%</div> */}
                    <div>
                      Prog.
                      {Redondea(
                        (mes2.fisico_programado_monto /
                          data.presupuesto_costodirecto) *
                          100,
                        [2, 4]
                      )}
                      %
                    </div>
                  </td>
                </tr>
              );
            }
            return dataTemp;
          })()}
          <tr>
            <th colSpan="2" style={{ width: "70px" }}>
              A. Actual
            </th>
            <td style={{ width: "70px" }}>
              {Redondea(
                (AcumuladoActual.fisico_monto / data.presupuesto_costodirecto) *
                  100
              )}
              %
            </td>
            <td colSpan="3">S/.{Redondea(AcumuladoActual.fisico_monto)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

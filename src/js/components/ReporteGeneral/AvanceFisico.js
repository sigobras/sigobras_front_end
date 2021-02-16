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
    var temp = Data.find((item) => item.mes == mes);
    return temp ? temp.fisico_monto : 0;
  }
  return (
    <div style={{ width: "300px" }}>
      <table
        style={{ width: "100%" }}
        className="text-center reporteGeneral-titulos reporteGeneral-table"
      >
        <tbody>
          <tr>
            <th>A Dic. {AnyoSeleccionado - 1}</th>
            <td>
              {Redondea(
                (AcumuladoPrevio.fisico_monto / data.presupuesto_costodirecto) *
                  100
              )}
              %
            </td>
            <td colSpan="2">S/.{Redondea(AcumuladoPrevio.fisico_monto)}</td>
          </tr>
          {(() => {
            var dataTemp = [];
            for (let i = 1; i <= 6; i++) {
              dataTemp.push(
                <tr key={i}>
                  <th>{mesesShort[i - 1]}</th>
                  <td>
                    {Redondea(
                      (buscarMes(i) / data.presupuesto_costodirecto) * 100
                    )}
                    %
                  </td>
                  <th>{mesesShort[i + 5]}</th>
                  <td>
                    {Redondea(
                      (buscarMes(i + 6) / data.presupuesto_costodirecto) * 100
                    )}
                    %
                  </td>
                </tr>
              );
            }
            return dataTemp;
          })()}
          <tr>
            <th>A. Actual</th>
            <td>
              {Redondea(
                (AcumuladoActual.fisico_monto / data.presupuesto_costodirecto) *
                  100
              )}
              %
            </td>
            <td colSpan="2">S/.{Redondea(AcumuladoActual.fisico_monto)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

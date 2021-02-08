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
    var res = await axios.get(`${UrlServer}/v1/obrasPlazos`, {
      params: {
        id_ficha: data.id_ficha,
      },
    });
    setData(res.data);
  }
  return (
    <div style={{ width: "500px" }}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <td>tipo</td>
            <td>fecha inicial</td>
            <td>fecha final</td>
            <td>dias</td>
            <td>resolucion</td>
          </tr>
        </thead>
        <tbody>
          {Data.map((item, i) => (
            <tr key={i}>
              <th>{item.tipo_nombre}</th>

              <th>{item.fecha_inicial}</th>
              <th>{item.fecha_final}</th>
              <td>{item.n_dias}</td>
              <td>{item.documento_resolucion_estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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
    cargarPersonal();
  }, []);
  //Personal
  const [Personal, setPersonal] = useState([]);
  async function cargarPersonal() {
    var res = await axios.get(`${UrlServer}/v1/usuarios/id_cargos`, {
      params: {
        id_ficha: data.id_ficha,
        id_cargos: "30,31,6,7,9,10",
      },
    });
    setPersonal(res.data);
  }
  function buscarPersonal(id) {
    var temp = Personal.find((item) => item.id_cargo == id);
    var renderTemp = [
      <td>{temp ? temp.nombre_completo : ""}</td>,
      <td>{temp ? temp.celular : ""}</td>,
    ];
    return renderTemp;
  }
  return (
    <div style={{ width: "250px" }}>
      <table style={{ width: "100%" }} className="reporteGeneral-table">
        <tbody className="reporteGeneral-titulos">
          <tr>
            <th>Esp. Téc.</th>
            {buscarPersonal(30)}
          </tr>
          <tr>
            <th>Esp. Adm.</th>
            {buscarPersonal(31)}
          </tr>
          <tr>
            <th>Supervisor</th>
            {buscarPersonal(6)}
          </tr>
          <tr>
            <th>Residente</th>
            {buscarPersonal(7)}
          </tr>
          <tr>
            <th>Asis. Téc.</th>
            {buscarPersonal(9)}
          </tr>
          <tr>
            <th>Asis. Adm.</th>
            {buscarPersonal(10)}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

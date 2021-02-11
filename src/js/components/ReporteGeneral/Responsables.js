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
    return temp ? temp.nombre_completo : "";
  }
  return (
    <div style={{ width: "250px" }}>
      <table style={{ width: "100%" }}>
        <tbody className="reporteGeneral-titulos">
          <tr>
            <th>Esp. Téc.</th>
            <td>{buscarPersonal(30)}</td>
          </tr>
          <tr>
            <th>Esp. Adm.</th>
            <td>{buscarPersonal(31)}</td>
          </tr>
          <tr>
            <th>Supervisor</th>
            <td>{buscarPersonal(6)}</td>
          </tr>
          <tr>
            <th>Residente</th>
            <td>{buscarPersonal(7)}</td>
          </tr>
          <tr>
            <th>Asis. Tec.</th>
            <td>{buscarPersonal(9)}</td>
          </tr>
          <tr>
            <th>Asis. Adm.</th>
            <td>{buscarPersonal(10)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

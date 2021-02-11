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
export default ({ numero, data, AnyoSeleccionado, setMensajeGuardando }) => {
  useEffect(() => {
    cargarMeta();
  }, []);
  //meta
  const [Meta, setMeta] = useState(data.meta);
  async function cargarMeta() {
    var res = await axios.get(`${UrlServer}/v1/datosAnuales`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado,
      },
    });
    setMeta(res.data.meta);
  }
  //temp
  const [ModoEdicion, setModoEdicion] = useState("");
  async function guardarData() {
    setMensajeGuardando(true);
    var res = await axios.put(`${UrlServer}/v1/datosAnuales/${data.id_ficha}`, {
      anyo: AnyoSeleccionado,
      meta: Meta,
    });
    setMensajeGuardando(false);
    cargarMeta();
  }
  return (
    <div style={{ width: "300px" }}>
      <div>
        <span style={{ fontWeight: "700" }}>N° {numero} </span>
        <span>{data.nombre_obra}</span>
        <span style={{ fontWeight: "700" }}>{data.codigo} </span>
      </div>
      <table
        className="reporteGeneral-table"
        style={{
          width: "100%",
        }}
      >
        <tbody className="reporteGeneral-titulos">
          <tr>
            <th>Meta {AnyoSeleccionado}</th>
            <td
              onClick={() => setModoEdicion("Meta")}
              className="reporteGeneral-table-input"
            >
              {ModoEdicion == "Meta" ? (
                <Input
                  type="text"
                  value={Meta}
                  onChange={(e) => setMeta(e.target.value)}
                  onBlur={() => {
                    setModoEdicion("");
                    guardarData();
                  }}
                ></Input>
              ) : (
                Meta
              )}
            </td>
          </tr>
          <tr>
            <th>Presupuesto</th>
            <td>{Redondea(data.presupuesto)}</td>
          </tr>
          <tr>
            <th>Estado Obra</th>
            <td>{data.estado_obra}</td>
          </tr>
          <tr>
            <th>Codigo UI</th>
            <td>{data.codigo_ui}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

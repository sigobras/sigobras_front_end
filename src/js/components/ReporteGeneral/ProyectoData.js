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
export default ({ numero, data, AnyoSeleccionado }) => {
  useEffect(() => {
    cargarMeta();
  }, []);

  const [ObraData, setObraData] = useState(data);
  const [ObraDataModificada, setObraDataModificada] = useState({});
  const handleInputChange = (name, value) => {
    setObraData({
      ...ObraData,
      [name]: value,
    });
    setObraDataModificada({
      ...ObraDataModificada,
      [name]: value,
    });
  };
  //autosave input
  let timer,
    timeoutVal = 2000;
  //meta
  const [Meta, setMeta] = useState(0);
  async function cargarMeta() {
    var res = await axios.get(`${UrlServer}/v1/datosAnuales`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado,
      },
    });
    console.log("data");
    setMeta(res.data.meta);
  }
  //temp
  const [ModoEdicion, setModoEdicion] = useState("");
  async function guardarData() {
    var res = await axios.put(`${UrlServer}/v1/datosAnuales/${data.id_ficha}`, {
      anyo: AnyoSeleccionado,
      meta: Meta,
    });
    toast.success("Guardado automatico exitoso", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    cargarMeta();
  }
  return (
    <div style={{ width: "300px" }}>
      <div>
        <span style={{ fontWeight: "900" }}>N° {numero}</span>
        {data.nombre_obra}
      </div>
      <table
        className="reporteGeneral-table"
        style={{
          width: "100%",
        }}
      >
        <tbody>
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
                  onKeyUp={() => {
                    window.clearTimeout(timer);
                    timer = window.setTimeout(() => {
                      guardarData();
                    }, timeoutVal);
                  }}
                  onKeyPress={() => {
                    window.clearTimeout(timer);
                  }}
                  onBlur={() => setModoEdicion("")}
                ></Input>
              ) : (
                Meta
              )}
            </td>
          </tr>
          <tr>
            <th>Presupuesto</th>
            <td>{Redondea(ObraData.presupuesto)}</td>
          </tr>
          <tr>
            <th>Estado Obra</th>
            <td>{ObraData.estado_obra}</td>
          </tr>
          <tr>
            <th>Codigo UI</th>
            <td>{ObraData.codigo_ui}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

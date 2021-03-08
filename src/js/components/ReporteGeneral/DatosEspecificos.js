import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiDeleteBin6Line } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
import DatosEspecificos from "./DatosEspecificos";
import BotonNuevo from "../../libs/BotonNuevo";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data, setMensajeGuardando }) => {
  useEffect(() => {
    cargarPermiso(`actualizar_datosespecificos`);
  }, []);
  const [Permisos, setPermisos] = useState(false);
  async function cargarPermiso(nombres_clave) {
    const res = await axios.get(`${UrlServer}/v1/interfazPermisos/activo`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_ficha: sessionStorage.getItem("idobra"),
        nombres_clave,
      },
    });
    var tempList = [];
    var tempArray = res.data;
    for (const key in tempArray) {
      tempList[key] = res.data[key];
    }
    setPermisos(tempList);
  }
  //edicion
  const [ModoEdicion, setModoEdicion] = useState("");
  const [DataFormulario, setDataFormulario] = useState(data);
  const [DataFormularioResumen, setDataFormularioResumen] = useState({});
  const handleInputChange = (name, value) => {
    setDataFormulario({
      ...DataFormulario,
      [name]: value,
    });
    setDataFormularioResumen({
      ...DataFormularioResumen,
      [name]: value,
    });
  };
  //save data
  async function guardarData() {
    setMensajeGuardando(true);
    if (Object.keys(DataFormularioResumen).length > 0) {
      var res = await axios.put(
        `${UrlServer}/v1/obras/${data.id_ficha}`,
        DataFormularioResumen
      );
    }

    setMensajeGuardando(false);
  }

  return (
    <div style={{ width: "300px" }}>
      <table style={{ width: "100%" }} className="reporteGeneral-table">
        <tbody className="reporteGeneral-titulos">
          <tr>
            <th>Codigo SNIP</th>
            <td
              onClick={() => setModoEdicion("codigo_snip")}
              className="reporteGeneral-table-input"
            >
              {Permisos["actualizar_datosespecificos"] &&
              ModoEdicion == "codigo_snip" ? (
                <Input
                  type="text"
                  value={DataFormulario.codigo_snip}
                  onChange={(e) =>
                    handleInputChange("codigo_snip", e.target.value)
                  }
                  onBlur={() => {
                    setModoEdicion("");
                    guardarData();
                  }}
                ></Input>
              ) : (
                DataFormulario.codigo_snip
              )}
            </td>
          </tr>
          <tr>
            <th>Función :</th>
            <td
              onClick={() => setModoEdicion("funcion")}
              className="reporteGeneral-table-input"
            >
              {Permisos["actualizar_datosespecificos"] &&
              ModoEdicion == "funcion" ? (
                <Input
                  type="text"
                  value={DataFormulario.funcion}
                  onChange={(e) => handleInputChange("funcion", e.target.value)}
                  onBlur={() => {
                    setModoEdicion("");
                    guardarData();
                  }}
                ></Input>
              ) : (
                DataFormulario.funcion
              )}
            </td>
          </tr>
          <tr>
            <th>Division Funcional:</th>
            <td
              onClick={() => setModoEdicion("division_funcional")}
              className="reporteGeneral-table-input"
            >
              {Permisos["actualizar_datosespecificos"] &&
              ModoEdicion == "division_funcional" ? (
                <Input
                  type="text"
                  value={DataFormulario.division_funcional}
                  onChange={(e) =>
                    handleInputChange("division_funcional", e.target.value)
                  }
                  onBlur={() => {
                    setModoEdicion("");
                    guardarData();
                  }}
                ></Input>
              ) : (
                DataFormulario.division_funcional
              )}
            </td>
          </tr>
          <tr>
            <th>Sub-Programa :</th>
            <td
              onClick={() => setModoEdicion("subprograma")}
              className="reporteGeneral-table-input"
            >
              {Permisos["actualizar_datosespecificos"] &&
              ModoEdicion == "subprograma" ? (
                <Input
                  type="text"
                  value={DataFormulario.subprograma}
                  onChange={(e) =>
                    handleInputChange("subprograma", e.target.value)
                  }
                  onBlur={() => {
                    setModoEdicion("");
                    guardarData();
                  }}
                ></Input>
              ) : (
                DataFormulario.subprograma
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

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
export default ({ data, recargar }) => {
  useEffect(() => {
    cargarProblemas();
  }, []);
  const [Problemas, setProblemas] = useState([]);
  async function cargarProblemas() {
    try {
      var res = await axios.get(`${UrlServer}/v1/problemasObra`, {
        params: {
          id_ficha: data.id_ficha,
        },
      });
      console.log("res", res.data);
      setProblemas(res.data);
    } catch (error) {
      console.log("Ocurrio un error", error);
    }
  }
  function agregarData() {
    var clone = [...Problemas];
    clone.push({
      id: null,
      fecha: "",
      titulo: "",
      descripcion: "",
      fichas_id_ficha: data.id_ficha,
    });
    setProblemas(clone);
  }
  async function eliminarData(id) {
    try {
      if (id != null) {
        await axios.delete(`${UrlServer}/v1/problemasObra/${id}`);
      }
      cargarProblemas();
    } catch (error) {
      alert("Ocurrio un error");
    }
  }
  return (
    <div style={{ width: "750px" }}>
      {/* <Button onClick={() => cargarProblemas()}>RECARGAR</Button> */}
      <table style={{ width: "100%" }}>
        <tbody className="reporteGeneral-titulos">
          <tr>
            <th>Nro</th>
            <th>fecha</th>
            <th>titulo</th>
            <th style={{ width: "470px" }}>descripcion</th>
          </tr>
          {Problemas.map((item, i) => (
            <tr style={{ height: "80px" }}>
              <td>{i + 1}</td>
              <td>
                <ProblemaInput
                  key={JSON.stringify(item)}
                  item={item}
                  name="fecha"
                  type="date"
                  actualizar={cargarProblemas}
                />
              </td>
              <td>
                <ProblemaInput
                  key={JSON.stringify(item)}
                  item={item}
                  name="titulo"
                  actualizar={cargarProblemas}
                  maxLength="45"
                />
              </td>
              <td
                style={{
                  position: "relative",
                }}
              >
                <ProblemaInput
                  key={JSON.stringify(item)}
                  item={item}
                  name="descripcion"
                  type="textarea"
                  actualizar={cargarProblemas}
                  maxLength="280"
                />
                <RiDeleteBin6Line
                  onClick={() => eliminarData(item.id)}
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    color: "red",
                    cursor: "pointer",
                  }}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <Button color="primary" onClick={() => agregarData()}>
                +
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
function ProblemaInput({ item, name, type, actualizar, maxLength }) {
  const [InputValue, setInputValue] = useState(() => {
    var temp = {};
    temp[name] = item[name];
    temp["id"] = item["id"];
    temp["fichas_id_ficha"] = item["fichas_id_ficha"];
    return temp;
  });
  const [FlagCambios, setFlagCambios] = useState(false);
  function handleInput(value) {
    setFlagCambios(true);
    console.log("cambio", InputValue, value);
    setInputValue({
      ...InputValue,
      [name]: value,
    });
  }
  async function guardarData() {
    try {
      if (FlagCambios) {
        console.log("enviando", InputValue);
        var res = await axios.put(`${UrlServer}/v1/problemasObra`, [
          InputValue,
        ]);
        if (InputValue.id == null) {
          actualizar();
        }
        setFlagCambios(false);
      }
    } catch (error) {
      alert("Ocurrio un error");
      console.log(error);
    }
  }
  return (
    <Input
      value={InputValue[name] || ""}
      onChange={(e) => handleInput(e.target.value)}
      onBlur={() => guardarData()}
      type={type ? type : "text"}
      style={{
        background: FlagCambios ? "#48dc23" : "#42ff0038",
        height: "75px",
      }}
      maxLength={maxLength}
    />
  );
}

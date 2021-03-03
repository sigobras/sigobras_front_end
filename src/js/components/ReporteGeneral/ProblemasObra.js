import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiDeleteBin6Line } from "react-icons/ri";
import { FaUpload, FaFileAlt, FaPlusCircle } from "react-icons/fa";
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
      setProblemas(res.data);
    } catch (error) {}
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
      if (confirm("Esta seguro de eliminar este problema?")) {
        if (id != null) {
          await axios.delete(`${UrlServer}/v1/problemasObra/${id}`);
        }
        cargarProblemas();
      }
    } catch (error) {
      alert("Ocurrio un error");
    }
  }
  return (
    <div style={{ width: "510px" }}>
      {/* <Button onClick={() => cargarProblemas()}>RECARGAR</Button> */}
      <table style={{ width: "100%" }}>
        <tbody className="reporteGeneral-titulos">
          <tr>
            <th
              style={{
                width: "510px",
                display: "flex",
                justifyContent: "space-between",
                border: "none",
              }}
            >
              <span></span>
              <span>descripcion</span>
              <span>
                <FaPlusCircle
                  color="#000000"
                  size="15"
                  onClick={() => {
                    agregarData();
                  }}
                  style={{ cursor: "pointer" }}
                />
              </span>
            </th>
          </tr>
          {Problemas.map((item, i) => (
            <tr style={{ height: "80px" }} key={i}>
              <td
                style={{
                  position: "relative",
                }}
              >
                <div
                  className="d-flex"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ paddingLeft: "13px", fontWeight: 700 }}>
                    {i + 1}
                  </span>
                  <span>
                    <ProblemaInput
                      key={JSON.stringify(item)}
                      item={item}
                      name="titulo"
                      actualizar={cargarProblemas}
                      maxLength="45"
                      placeholder="Cuál es el tipo de problema?"
                      style={{
                        width: "340px",
                        fontWeight: 700,
                      }}
                    />
                  </span>
                  <span>
                    <ProblemaInput
                      key={JSON.stringify(item)}
                      item={item}
                      name="fecha"
                      type="date"
                      actualizar={cargarProblemas}
                    />
                  </span>
                </div>
                <div>
                  <ProblemaInput
                    key={JSON.stringify(item)}
                    item={item}
                    name="descripcion"
                    type="textarea"
                    actualizar={cargarProblemas}
                    maxLength="280"
                    style={{
                      height: "75px",
                    }}
                    placeholder="Ingrese el problema y/o dificultad que tenga en obra"
                  />
                </div>

                <RiDeleteBin6Line
                  onClick={() => eliminarData(item.id)}
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    right: "10px",
                    color: "black",
                    cursor: "pointer",
                  }}
                  size="15"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
function ProblemaInput({
  item,
  name,
  type,
  actualizar,
  maxLength,
  style,
  placeholder,
}) {
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
    setInputValue({
      ...InputValue,
      [name]: value,
    });
  }
  async function guardarData() {
    try {
      if (FlagCambios) {
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
    }
  }
  return (
    <Input
      value={InputValue[name] || ""}
      onChange={(e) => handleInput(e.target.value)}
      onBlur={() => guardarData()}
      type={type ? type : "text"}
      style={{ ...style, background: FlagCambios ? "#17a2b840" : "#42ff0038" }}
      maxLength={maxLength}
      placeholder={placeholder}
    />
  );
}

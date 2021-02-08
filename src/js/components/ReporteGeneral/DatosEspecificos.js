import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiDeleteBin6Line } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
import DatosEspecificos from "./DatosEspecificos";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data, AnyoSeleccionado }) => {
  let timer,
    timeoutVal = 2000;

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
    var res = await axios.put(
      `${UrlServer}/v1/obras/${data.id_ficha}`,
      DataFormularioResumen
    );
    toast.success("Guardado automatico exitoso", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    //  cargarData();
  }

  return (
    <div style={{ width: "300px" }}>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th>Codigo SNIP</th>
            <td
              onClick={() => setModoEdicion("codigo_snip")}
              className="reporteGeneral-table-input"
            >
              {ModoEdicion == "codigo_snip" ? (
                <Input
                  type="text"
                  value={DataFormulario.codigo_snip}
                  onChange={(e) =>
                    handleInputChange("codigo_snip", e.target.value)
                  }
                  onKeyUp={() => {
                    window.clearTimeout(timer);
                    timer = window.setTimeout(() => {
                      guardarData();
                    }, timeoutVal);
                  }}
                  onKeyPress={() => {
                    window.clearTimeout(timer);
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
              {ModoEdicion == "funcion" ? (
                <Input
                  type="text"
                  value={DataFormulario.funcion}
                  onChange={(e) => handleInputChange("funcion", e.target.value)}
                  onKeyUp={() => {
                    window.clearTimeout(timer);
                    timer = window.setTimeout(() => {
                      guardarData();
                    }, timeoutVal);
                  }}
                  onKeyPress={() => {
                    window.clearTimeout(timer);
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
              {ModoEdicion == "division_funcional" ? (
                <Input
                  type="text"
                  value={DataFormulario.division_funcional}
                  onChange={(e) =>
                    handleInputChange("division_funcional", e.target.value)
                  }
                  onKeyUp={() => {
                    window.clearTimeout(timer);
                    timer = window.setTimeout(() => {
                      guardarData();
                    }, timeoutVal);
                  }}
                  onKeyPress={() => {
                    window.clearTimeout(timer);
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
              {ModoEdicion == "subprograma" ? (
                <Input
                  type="text"
                  value={DataFormulario.subprograma}
                  onChange={(e) =>
                    handleInputChange("subprograma", e.target.value)
                  }
                  onKeyUp={() => {
                    window.clearTimeout(timer);
                    timer = window.setTimeout(() => {
                      guardarData();
                    }, timeoutVal);
                  }}
                  onKeyPress={() => {
                    window.clearTimeout(timer);
                  }}
                ></Input>
              ) : (
                DataFormulario.subprograma
              )}
            </td>
          </tr>
          <tr>
            <th colSpan="2">Fuentes de Financiamiento</th>
          </tr>
          <tr>
            <td colSpan="2">
              <FuentesFinancieamiento
                id_ficha={data.id_ficha}
                anyo={AnyoSeleccionado}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
function FuentesFinancieamiento({ id_ficha, anyo }) {
  useEffect(() => {
    cargarData();
  }, []);
  //fuentes financiamiento
  const [Data, setData] = useState([]);
  const [DataFormulario, setDataFormulario] = useState([]);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/fuentesFinancieamiento/`, {
      params: {
        id_ficha,
        anyo,
      },
    });
    setData(res.data);
  }
  //agregar
  function agregarData() {
    var clone = [...Data];
    clone.push({
      id: null,
      anyo: anyo,
      nombre: "",
      id_ficha,
    });
    setData(clone);
  }
  //handle input change
  const handleInputChange = (index, value) => {
    var clone = [...Data];
    clone[index].nombre = value;
    setData(clone);
    // if (value != "") {
    //   var clone2 = [...DataFormulario];
    //   clone2[index].nombre = value;
    //   setDataFormulario(clone2);
    // }
  };
  //autosave timer
  let timer,
    timeoutVal = 2000;
  //autosave function
  async function guardarData() {
    var res = await axios.put(`${UrlServer}/v1/fuentesFinancieamiento`, Data);
    toast.success("Guardado automatico exitoso", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  //delete
  async function eliminarData(id) {
    var res = await axios.delete(
      `${UrlServer}/v1/fuentesFinancieamiento/${id}`
    );
    cargarData();
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
      }}
    >
      {Data.map((item, i) => (
        <div
          style={{
            position: "relative",
          }}
        >
          <Input
            type="textarea"
            value={item.nombre}
            onChange={(e) => handleInputChange(i, e.target.value)}
            onKeyUp={() => {
              window.clearTimeout(timer);
              timer = window.setTimeout(() => {
                guardarData();
              }, timeoutVal);
            }}
            onKeyPress={() => {
              window.clearTimeout(timer);
            }}
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
        </div>
      ))}
      <Input
        type="textarea"
        onClick={() => agregarData()}
        placeholder="Agregar nueva fuente de financiamiento"
        readOnly="true"
      />
    </div>
  );
}

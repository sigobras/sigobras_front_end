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
export default ({ data, AnyoSeleccionado, setMensajeGuardando }) => {
  useEffect(() => {
    cargarData();
    cargarAvanceFinancieroAcumulado();
  }, []);
  const [Loading, setLoading] = useState(false);
  //Data
  const [DataFormulario, setDataFormulario] = useState({});
  async function cargarData() {
    setLoading(true);
    var res = await axios.get(`${UrlServer}/v1/datosAnuales`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado - 1,
      },
    });
    var res2 = await axios.get(`${UrlServer}/v1/datosAnuales`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado,
      },
    });
    setDataFormulario({
      presupuesto_aprobado: res.data.presupuesto_aprobado,
      pia: res2.data.pia,
      pim: res2.data.pim,
    });
    setLoading(false);
  }
  //avance financiero
  const [AvanceFinancieroAcumulado, setAvanceFinancieroAcumulado] = useState(
    {}
  );
  async function cargarAvanceFinancieroAcumulado() {
    var res = await axios.get(`${UrlServer}/v1/avance/acumuladoAnual`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado - 1,
      },
    });
    setAvanceFinancieroAcumulado(res.data);
  }
  const [ModoEdicion, setModoEdicion] = useState("");
  //guardado automatico

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

  let timer,
    timeoutVal = 2000;
  async function guardarData() {
    setMensajeGuardando(true);
    if (DataFormularioResumen.presupuesto_aprobado) {
      var res = await axios.put(
        `${UrlServer}/v1/datosAnuales/${data.id_ficha}`,
        {
          anyo: AnyoSeleccionado - 1,
          presupuesto_aprobado: DataFormularioResumen.presupuesto_aprobado,
        }
      );
    }
    if (DataFormularioResumen.pia || DataFormularioResumen.pim) {
      var res = await axios.put(
        `${UrlServer}/v1/datosAnuales/${data.id_ficha}`,
        {
          anyo: AnyoSeleccionado,
          pia: DataFormularioResumen.pia,
          pim: DataFormularioResumen.pim,
        }
      );
    }
    setMensajeGuardando(false);
    cargarData();
  }

  return (
    <div style={{ width: "500px" }}>
      {Loading ? (
        <Spinner type="grow" color="dark" />
      ) : (
        <table style={{ width: "100%" }} className="reporteGeneral-table">
          <tbody>
            <tr className="reporteGeneral-titulos">
              <th colSpan="2">
                Presupuesto Ejecutado al {AnyoSeleccionado - 1}
              </th>
              <th colSpan="2">Prespt. Programado para el {AnyoSeleccionado}</th>
            </tr>
            <tr>
              <td>Presp. Aprob.</td>
              <td
                onClick={() => setModoEdicion("presupuesto_aprobado")}
                className="reporteGeneral-table-input"
              >
                {ModoEdicion == "presupuesto_aprobado" ? (
                  <Input
                    type="text"
                    value={DataFormulario.presupuesto_aprobado}
                    onChange={(e) =>
                      handleInputChange("presupuesto_aprobado", e.target.value)
                    }
                    onBlur={() => {
                      setModoEdicion("");
                      guardarData();
                    }}
                  ></Input>
                ) : (
                  Redondea(DataFormulario.presupuesto_aprobado)
                )}
              </td>
              <td>PIA</td>
              <td
                onClick={() => setModoEdicion("pia")}
                className="reporteGeneral-table-input"
              >
                {ModoEdicion == "pia" ? (
                  <Input
                    type="text"
                    value={DataFormulario.pia}
                    onChange={(e) => handleInputChange("pia", e.target.value)}
                    onBlur={() => {
                      setModoEdicion("");
                      guardarData();
                    }}
                  ></Input>
                ) : (
                  Redondea(DataFormulario.pia)
                )}
              </td>
            </tr>
            <tr>
              <td rowSpan="2">Ejec. a Dic. {AnyoSeleccionado - 1}</td>
              <td>{Redondea(AvanceFinancieroAcumulado.financiero_monto)}</td>
              <td>PIM</td>
              <td
                onClick={() => setModoEdicion("pim")}
                className="reporteGeneral-table-input"
              >
                {ModoEdicion == "pim" ? (
                  <Input
                    type="text"
                    value={DataFormulario.pim}
                    onChange={(e) => handleInputChange("pim", e.target.value)}
                    onBlur={() => {
                      setModoEdicion("");
                      guardarData();
                    }}
                  ></Input>
                ) : (
                  Redondea(DataFormulario.pim)
                )}
              </td>
            </tr>
            <tr>
              <td>
                {Redondea(
                  (AvanceFinancieroAcumulado.financiero_monto /
                    DataFormulario.presupuesto_aprobado) *
                    100
                )}
                %
              </td>
              <td>T. Asig.</td>
              <td>
                {Redondea(
                  AvanceFinancieroAcumulado.financiero_monto +
                    DataFormulario.pim
                )}
              </td>
            </tr>
            <tr>
              <td rowSpan="2">Saldo</td>
              <td>
                {Redondea(
                  DataFormulario.presupuesto_aprobado -
                    AvanceFinancieroAcumulado.financiero_monto
                )}
              </td>
              <td rowSpan="2">Por Asignar</td>
              <td>
                {Redondea(
                  DataFormulario.presupuesto_aprobado -
                    (AvanceFinancieroAcumulado.financiero_monto +
                      DataFormulario.pim)
                )}
              </td>
            </tr>
            <tr>
              <td>
                {Redondea(
                  ((DataFormulario.presupuesto_aprobado -
                    AvanceFinancieroAcumulado.financiero_monto) /
                    DataFormulario.presupuesto_aprobado) *
                    100
                )}
                %
              </td>
              <td>
                {Redondea(
                  ((DataFormulario.presupuesto_aprobado -
                    (AvanceFinancieroAcumulado.financiero_monto +
                      DataFormulario.pim)) /
                    DataFormulario.presupuesto_aprobado) *
                    100
                )}
                %
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

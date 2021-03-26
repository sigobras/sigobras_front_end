import React, { useState, useEffect } from "react";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea } from "../Utils/Funciones";
import BotonNuevo from "../../libs/BotonNuevo";
import CustomInput from "../../libs/CustomInput";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data, AnyoSeleccionado, setMensajeGuardando }) => {
  useEffect(() => {
    cargarData();
    cargarAvanceFinancieroAcumulado();
    cargarFuentesFinanciamientoList();
    cargarPermiso(
      "agregar_fuentesfinanciamiento,actualizar_pim,actualizar_pia,actualizar_presupuestoaprobado"
    );
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

  async function guardarPia(pia) {
    await axios.put(`${UrlServer}/v1/datosAnuales/${data.id_ficha}`, {
      anyo: AnyoSeleccionado,
      pia,
    });
  }
  async function guardarPim(pim) {
    await axios.put(`${UrlServer}/v1/datosAnuales/${data.id_ficha}`, {
      anyo: AnyoSeleccionado,
      pim,
    });
  }
  async function guardarPresupuestoAprobado(presupuesto_aprobado) {
    await axios.put(`${UrlServer}/v1/datosAnuales/${data.id_ficha}`, {
      anyo: AnyoSeleccionado - 1,
      presupuesto_aprobado,
    });
  }
  const [FuentesFinanciamientoList, setFuentesFinanciamientoList] = useState(
    []
  );
  async function cargarFuentesFinanciamientoList() {
    var res = await axios.get(`${UrlServer}/v1/fuentesFinancieamiento/list`);
    setFuentesFinanciamientoList(res.data);
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
              <td>
                <CustomInput
                  value={Redondea(DataFormulario.presupuesto_aprobado)}
                  onBlur={(value) => {
                    guardarPresupuestoAprobado(value);
                  }}
                />
              </td>
              <td>PIA</td>
              <td>
                <CustomInput
                  value={Redondea(DataFormulario.pia)}
                  onBlur={(value) => {
                    guardarPia(value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td rowSpan="2">Ejec. a Dic. {AnyoSeleccionado - 1}</td>
              <td>{Redondea(AvanceFinancieroAcumulado.financiero_monto)}</td>
              <td>PIM</td>
              <td>
                <CustomInput
                  value={Redondea(DataFormulario.pim)}
                  onBlur={(value) => {
                    guardarPim(value);
                  }}
                />
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
            <tr>
              <th colSpan="4">Fuentes de Financiamiento</th>
            </tr>
            <tr>
              <td colSpan="4">
                <FuentesFinancieamiento
                  id_ficha={data.id_ficha}
                  anyo={AnyoSeleccionado}
                  setMensajeGuardando={setMensajeGuardando}
                  FuentesFinanciamientoList={FuentesFinanciamientoList}
                  Permisos={Permisos}
                />
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
function FuentesFinancieamiento({ id_ficha, anyo }) {
  useEffect(() => {
    cargarData();
  }, []);
  //fuentes financiamiento
  const [Data, setData] = useState([]);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/fuentesFinancieamiento/`, {
      params: {
        id_ficha,
        anyo,
      },
    });
    setData(res.data);
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
      }}
    >
      {Data.map((item, i) => (
        <div key={i}>
          <span>{item.nombre}</span> <span>S/.{Redondea(item.monto)}</span>
        </div>
      ))}
    </div>
  );
}

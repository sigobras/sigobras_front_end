import React, { useState, useEffect } from "react";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea } from "../Utils/Funciones";
import BotonNuevo from "../../libs/BotonNuevo";

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

  async function guardarData() {
    setMensajeGuardando(true);
    if (DataFormularioResumen.presupuesto_aprobado) {
      await axios.put(`${UrlServer}/v1/datosAnuales/${data.id_ficha}`, {
        anyo: AnyoSeleccionado - 1,
        presupuesto_aprobado: DataFormularioResumen.presupuesto_aprobado,
      });
    }
    if (DataFormularioResumen.pia || DataFormularioResumen.pim) {
      await axios.put(`${UrlServer}/v1/datosAnuales/${data.id_ficha}`, {
        anyo: AnyoSeleccionado,
        pia: DataFormularioResumen.pia,
        pim: DataFormularioResumen.pim,
      });
    }
    setMensajeGuardando(false);
    cargarData();
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
              <td
                onClick={() => setModoEdicion("presupuesto_aprobado")}
                className="reporteGeneral-table-input"
              >
                {Permisos["actualizar_presupuestoaprobado"] &&
                ModoEdicion == "presupuesto_aprobado" ? (
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
                {Permisos["actualizar_pia"] && ModoEdicion == "pia" ? (
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
                {Permisos["actualizar_pim"] && ModoEdicion == "pim" ? (
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
function FuentesFinancieamiento({
  id_ficha,
  anyo,
  setMensajeGuardando,
  FuentesFinanciamientoList,
  Permisos,
}) {
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
  //agregar
  function agregarData() {
    var clone = [...Data];
    clone.push({
      id: null,
      anyo: anyo,
      nombre: "",
      fichas_id_ficha: id_ficha,
      fuentesfinanciamiento_id: "",
    });
    setData(clone);
  }
  //input edicion
  const [ModoEdicion, setModoEdicion] = useState(-1);
  const [FlagCambios, setFlagCambios] = useState([]);
  function handleInputChange(index, e) {
    var clone2 = [...FlagCambios];
    clone2[index] = true;
    setFlagCambios(clone2);
    var clone = [...Data];
    clone[index][e.target.name] = e.target.value;
    if (e.target.name == "fuentesfinanciamiento_id") {
      var temp = FuentesFinanciamientoList.find(
        (item, i) => item.id == e.target.value
      );
      clone[index]["nombre"] = temp.nombre;
    }
    setData(clone);
  }
  async function guardarData() {
    try {
      var dataProcesada = [];
      Data.forEach((item) => {
        dataProcesada.push({
          id: item.id,
          anyo: item.anyo,
          monto: item.monto,
          fichas_id_ficha: item.fichas_id_ficha,
          fuentesfinanciamiento_id: item.fuentesfinanciamiento_id,
        });
      });
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento`,
        dataProcesada
      );
    } catch (error) {
      alert("Ocurrio un error");
    }
    setFlagCambios([]);
    cargarData();
  }
  async function eliminarData(id) {
    if (confirm("Desea borrar este dato permanentemente")) {
      try {
        await axios.delete(`${UrlServer}/v1/fuentesFinancieamiento/${id}`);
        cargarData();
      } catch (error) {
        console.log("Error", error);
      }
    }
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
          key={i}
          style={{
            position: "relative",
            background: FlagCambios[i] ? "#17a2b840" : "#42ff0038",
            display: "flex",
          }}
        >
          {ModoEdicion == i ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                <Input
                  type="select"
                  value={item.fuentesfinanciamiento_id}
                  onChange={(e) => handleInputChange(i, e)}
                  name="fuentesfinanciamiento_id"
                  onBlur={() => {
                    setModoEdicion(-1);
                  }}
                  disabled={!Permisos["agregar_fuentesfinanciamiento"]}
                >
                  <option value="">SELECCIONE</option>
                  {FuentesFinanciamientoList.map((item, i) => (
                    <option value={item.id}>{item.nombre}</option>
                  ))}
                </Input>
              </span>
              <span>
                <Input
                  value={item.monto}
                  onChange={(e) => handleInputChange(i, e)}
                  name="monto"
                  onBlur={() => {
                    setModoEdicion(-1);
                  }}
                  disabled={!Permisos["agregar_fuentesfinanciamiento"]}
                />
              </span>
            </div>
          ) : (
            <div
              onClick={() => setModoEdicion(i)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{item.nombre}</span>
              {"   "}
              <span>S/.{Redondea(item.monto)}</span>
            </div>
          )}
          <span>
            <RiDeleteBin6Line
              onClick={() => eliminarData(item.id)}
              style={{
                color: "red",
                cursor: "pointer",
              }}
            />
          </span>
        </div>
      ))}
      {FlagCambios.length > 0 && (
        <Button onClick={() => guardarData()}>Guardar</Button>
      )}
      {Permisos["agregar_fuentesfinanciamiento"] ? (
        <BotonNuevo size="80" onClick={() => agregarData()} />
      ) : (
        ""
      )}
    </div>
  );
}

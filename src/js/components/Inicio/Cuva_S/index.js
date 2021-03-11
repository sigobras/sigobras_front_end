import React, { useState, useEffect, useRef } from "react";
import { Modal, Alert, Collapse } from "reactstrap";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import { FaChartLine } from "react-icons/fa";
import {
  MdSystemUpdateAlt,
  MdDeleteForever,
  MdModeEdit,
  MdSave,
  MdClose,
} from "react-icons/md";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { Redondea, mesesShort, RedondeaDecimales } from "../../Utils/Funciones";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import FormularioPrincipal from "./FormularioPrincipal";
import CurvaS_Chart from "./CurvaS_Chart";
import CurvaS_Cabezera from "./CurvaS_Cabecera";

import "./curva_s.css";

export default ({ Obra }) => {
  //functions
  function siEsMesActual(anyo, mes) {
    var anyoActual = new Date().getFullYear();
    var mesActual = new Date().getMonth() + 1;
    // console.log("actual", anyoActual, mesActual);
    // console.log("llegado", anyo, mes);
    // console.log("calculo", anyo == anyoActual && mes == mesActual);
    if (anyo == anyoActual && mes == mesActual) return true;
    return false;
  }
  function esMenorIgualMesActual(anyo, mes) {
    var dateProgramado = new Date(anyo, mes - 1, 1);
    if (dateProgramado == "Invalid Date") return true;
    // console.log("date creado", dateProgramado);
    // console.log("resultado", dateProgramado <= new Date());
    if (dateProgramado <= new Date()) {
      return true;
    }
    return false;
  }

  // refs
  const cabeceraRef = useRef(null);
  //modal
  const [ModalPrincipal, setModalPrincipal] = useState(false);
  function toggleModalPrincipal() {
    if (!ModalPrincipal) {
      fetchCurvaSAnyos();
      fetchUsuarioData();
      if (CurvaSAnyoSeleccionado != 0) fetchCurvaSdata();
      cargarPermiso(
        `actualizar_programadoejecutado,actualizar_programadofinanciero,actualizar_financiero,actualizar_curvas_pimymes,eliminar_periodocurvas`
      );
    }
    setModalPrincipal(!ModalPrincipal);
  }
  //toggle soles
  const [ToggleSoles, setToggleSoles] = useState(false);
  function onChangeToggleSoles() {
    setToggleSoles(!ToggleSoles);
  }
  //curva s data
  const [CurvaSAnyos, setCurvaSAnyos] = useState([]);
  const [CurvaSAnyoSeleccionado, setCurvaSAnyoSeleccionado] = useState(0);
  const fetchCurvaSAnyos = async () => {
    const res = await axios.post(`${UrlServer}/getDataCurvaSAnyos`, {
      id_ficha: Obra.id_ficha,
    });
    setCurvaSAnyos(res.data);
    if (CurvaSAnyoSeleccionado == 0)
      setCurvaSAnyoSeleccionado(res.data[0].anyo);
  };
  const [CurvaSdata, setCurvaSdata] = useState([]);
  const fetchCurvaSdata = async () => {
    const res = await axios.post(`${UrlServer}/getDataCurvaSAcumuladosByAnyo`, {
      id_ficha: Obra.id_ficha,
      anyo: CurvaSAnyoSeleccionado,
    });
    const res2 = await axios.post(`${UrlServer}/getDataCurvaS`, {
      id_ficha: Obra.id_ficha,
      anyo: CurvaSAnyoSeleccionado,
    });
    var dataTotal = res.data.concat(res2.data);
    if (!ToggleSoles) {
      console.log("Obra", Obra);
      for (let i = 0; i < dataTotal.length; i++) {
        const element = dataTotal[i];
        element.fisico_monto =
          (element.fisico_monto / Obra.presupuesto_costodirecto) * 100;
        element.fisico_programado_monto =
          (element.fisico_programado_monto / Obra.presupuesto_costodirecto) *
          100;
        element.financiero_monto =
          (element.financiero_monto / Obra.g_total_presu) * 100;
        element.financiero_programado_monto =
          (element.financiero_programado_monto / Obra.g_total_presu) * 100;
      }
    }
    setCurvaSdata(dataTotal);
  };

  //UsuarioData
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const res = await axios.post(`${UrlServer}/getDatosUsuario`, {
      id_acceso: sessionStorage.getItem("idacceso"),
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setUsuarioData(res.data);
  }
  const [Permisos, setPermisos] = useState(false);
  async function cargarPermiso(nombres_clave) {
    const res = await axios.get(`${UrlServer}/v1/interfazPermisos/activo`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_ficha: Obra.id_ficha,
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
  //recargar
  function recargarData() {
    fetchCurvaSdata();
    cabeceraRef.current.recargar();
    fetchCurvaSAnyos();
  }
  //eliminar mes
  async function deletePeriodoCurvaS(id) {
    if (confirm("Esta seguro que desea eliminar esete periodo?")) {
      const request = await axios.post(`${UrlServer}/deletePeriodoCurvaS`, {
        id: id,
      });
      alert("se elimino registro con exito");
      recargarData();
    }
  }

  useEffect(() => {
    if (CurvaSAnyoSeleccionado != 0) {
      fetchCurvaSdata();
    }
  }, [CurvaSAnyoSeleccionado, ToggleSoles]);
  return (
    <div>
      <button
        className="btn btn-outline-info btn-sm mr-1"
        title="CURVA S"
        onClick={toggleModalPrincipal}
      >
        <FaChartLine />
      </button>
      <Modal isOpen={ModalPrincipal} toggle={toggleModalPrincipal} size={"lg"}>
        <div style={{ width: "800px" }}>
          <div className="d-flex">
            <CurvaS_Cabezera
              key={CurvaSAnyoSeleccionado}
              CurvaSdata={CurvaSdata}
              item={Obra}
              anyo={CurvaSAnyoSeleccionado}
              ref={cabeceraRef}
            />
            &nbsp;&nbsp;
            <div>
              {ModalPrincipal && Permisos["actualizar_curvas_pimymes"] ? (
                <FormularioPrincipal
                  id_ficha={Obra.id_ficha}
                  recargarData={recargarData}
                />
              ) : (
                ""
              )}

              <div style={{ margin: "1px" }}>
                <select
                  onChange={(e) => setCurvaSAnyoSeleccionado(e.target.value)}
                  value={CurvaSAnyoSeleccionado}
                >
                  <option value="">Seleccione</option>
                  {CurvaSAnyos.map((item, i) => (
                    <option key={i}>{item.anyo}</option>
                  ))}
                </select>
              </div>
              {ToggleSoles ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ height: "26px" }}
                  onClick={() => onChangeToggleSoles()}
                >
                  S/.
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ height: "26px" }}
                  onClick={() => onChangeToggleSoles()}
                >
                  %
                </button>
              )}
            </div>
          </div>
          <CurvaS_Chart
            key={JSON.stringify(CurvaSdata)}
            CurvaSdata={CurvaSdata}
            codigo={Obra.codigo}
            ToggleSoles={ToggleSoles}
          />
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table className="table">
              <tbody>
                <tr>
                  <th
                    style={{ width: "200px", backgroundColor: "#171819" }}
                    className="curvaS_tablaCabezera"
                  >
                    MES
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <th
                      key={i}
                      style={
                        item.tipo == "TOTAL"
                          ? { backgroundColor: "#3a3b3c" }
                          : siEsMesActual(item.anyo, item.mes)
                          ? { backgroundColor: "#004080" }
                          : { backgroundColor: "#171819" }
                      }
                    >
                      {item.tipo == "TOTAL"
                        ? "TOTAL - " + item.anyo
                        : mesesShort[item.mes - 1] + "-" + item.anyo}
                      {item.tipo != "TOTAL" &&
                        Permisos["eliminar_periodocurvas"] == 1 && (
                          <div onClick={() => deletePeriodoCurvaS(item.id)}>
                            <MdDeleteForever
                              title={"eliminiar periodo"}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        )}
                    </th>
                  ))}
                  <th style={{ backgroundColor: "#3a3b3c" }}>
                    TOTAL - {CurvaSAnyoSeleccionado}
                  </th>
                </tr>
                <tr className="curvaS_fisicoRow ">
                  <th
                    style={{
                      width: "200px",
                      display: "block",
                    }}
                    className="curvaS_tablaCabezera"
                  >
                    PROGRAMADO EJECUTADO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {item.tipo == "TOTAL" ? (
                        Redondea(
                          item.fisico_programado_monto,
                          ToggleSoles ? 2 : 4
                        ) + (!ToggleSoles ? "%" : "")
                      ) : (
                        <Programado
                          item={item}
                          recargar={recargarData}
                          ToggleSoles={ToggleSoles}
                          Obra={Obra}
                          Permisos={Permisos}
                        />
                      )}
                    </td>
                  ))}
                  <th>
                    {Redondea(
                      CurvaSdata.reduce((acc, item) => {
                        if (item.tipo != "TOTAL") {
                          acc += item.fisico_programado_monto;
                        }
                        return acc;
                      }, 0)
                    ) + (!ToggleSoles ? "%" : "")}
                  </th>
                </tr>

                <tr className="curvaS_fisicoRow">
                  <th
                    style={{ width: "200px", display: "block" }}
                    className="curvaS_tablaCabezera"
                  >
                    PROGRAMADO EJECUTADO ACTUALIZADO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {(esMenorIgualMesActual(item.anyo, item.mes)
                        ? Redondea(item.fisico_monto, ToggleSoles ? 2 : 4)
                        : Redondea(
                            item.fisico_programado_monto,
                            ToggleSoles ? 2 : 4
                          )) + (!ToggleSoles ? "%" : "")}
                    </td>
                  ))}
                  <th>
                    {Redondea(
                      CurvaSdata.reduce((acc, item) => {
                        if (item.tipo != "TOTAL") {
                          acc += esMenorIgualMesActual(item.anyo, item.mes)
                            ? item.fisico_monto
                            : item.fisico_programado_monto;
                        }
                        return acc;
                      }, 0),
                      4
                    ) + (!ToggleSoles ? "%" : "")}
                  </th>
                </tr>
                <tr className="curvaS_fisicoRow">
                  <th
                    style={{ width: "200px", display: "block" }}
                    className="curvaS_tablaCabezera"
                  >
                    EJECUTADO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {Redondea(item.fisico_monto, ToggleSoles ? 2 : 4) +
                        (!ToggleSoles ? "%" : "")}
                    </td>
                  ))}
                  <th>
                    {Redondea(
                      CurvaSdata.reduce((acc, item) => {
                        if (item.tipo != "TOTAL") {
                          acc += item.fisico_monto;
                        }
                        return acc;
                      }, 0),
                      4
                    ) + (!ToggleSoles ? "%" : "")}
                  </th>
                </tr>
                <tr className="curvaS_FinancieroRow">
                  <th
                    style={{
                      width: "200px",
                      display: "block",
                    }}
                    className="curvaS_tablaCabezera"
                  >
                    PROGRAMADO FINANCIERO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {item.tipo == "TOTAL" ? (
                        Redondea(
                          item.financiero_programado_monto,
                          ToggleSoles ? 2 : 4
                        ) + (!ToggleSoles ? "%" : "")
                      ) : (
                        <FinancieroProgramado
                          item={item}
                          UsuarioData={UsuarioData}
                          recargar={recargarData}
                          ToggleSoles={ToggleSoles}
                          Obra={Obra}
                          Permisos={Permisos}
                        />
                      )}
                    </td>
                  ))}
                  <th>
                    {Redondea(
                      CurvaSdata.reduce((acc, item) => {
                        if (item.tipo != "TOTAL") {
                          acc += item.financiero_programado_monto;
                        }
                        return acc;
                      }, 0),
                      4
                    ) + (!ToggleSoles ? "%" : "")}
                  </th>
                </tr>
                <tr className="curvaS_FinancieroRow">
                  <th
                    style={{ width: "200px", display: "block" }}
                    className="curvaS_tablaCabezera"
                  >
                    PROGRAMADO FINANCIERO ACTUALIZADO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {(esMenorIgualMesActual(item.anyo, item.mes)
                        ? Redondea(item.financiero_monto, ToggleSoles ? 2 : 4)
                        : Redondea(
                            item.financiero_programado_monto,
                            ToggleSoles ? 2 : 4
                          )) + (!ToggleSoles ? "%" : "")}
                    </td>
                  ))}
                  <th>
                    {Redondea(
                      CurvaSdata.reduce((acc, item) => {
                        if (item.tipo != "TOTAL") {
                          acc += esMenorIgualMesActual(item.anyo, item.mes)
                            ? item.financiero_monto
                            : item.financiero_programado_monto;
                        }
                        return acc;
                      }, 0),
                      4
                    ) + (!ToggleSoles ? "%" : "")}
                  </th>
                </tr>
                <tr className="curvaS_FinancieroRow">
                  <th
                    style={{ width: "200px", display: "block" }}
                    className="curvaS_tablaCabezera"
                  >
                    FINANCIERO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {item.tipo == "TOTAL" ? (
                        Redondea(item.financiero_monto, ToggleSoles ? 2 : 4) +
                        (!ToggleSoles ? "%" : "")
                      ) : (
                        <Financiero
                          item={item}
                          UsuarioData={UsuarioData}
                          recargar={recargarData}
                          ToggleSoles={ToggleSoles}
                          Obra={Obra}
                          Permisos={Permisos}
                        />
                      )}
                    </td>
                  ))}
                  <th>
                    {Redondea(
                      CurvaSdata.reduce((acc, item) => {
                        if (item.tipo != "TOTAL") {
                          acc += item.financiero_monto;
                        }
                        return acc;
                      }, 0),
                      4
                    ) + (!ToggleSoles ? "%" : "")}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};
function Programado({ item, recargar, ToggleSoles, Obra, Permisos }) {
  const [Editable, setEditable] = useState(false);
  const ToggleEditable = () => setEditable(!Editable);
  const [Input, setInput] = useState("");
  async function update() {
    var temp = Input;
    if (!ToggleSoles) {
      console.log("temp", temp);
      temp = (temp * Obra.presupuesto_costodirecto) / 100;
      console.log("temp", temp);
    }
    const res = await axios.post(`${UrlServer}/putProgramadoCurvaSbyId`, {
      id: item.id,
      fisico_programado_monto: temp,
    });
    ToggleEditable();
    recargar();
  }
  return Editable ? (
    <div className="d-flex">
      <DebounceInput
        value={RedondeaDecimales(
          item.fisico_programado_monto,
          ToggleSoles ? 2 : 4
        )}
        debounceTimeout={300}
        onChange={(e) => setInput(e.target.value)}
        type="number"
      />
      <div onClick={() => update()}>
        <MdSave style={{ cursor: "pointer" }} />
      </div>
      <div onClick={() => ToggleEditable()}>
        <MdClose style={{ cursor: "pointer" }} />
      </div>
    </div>
  ) : (
    <div className="d-flex">
      {Redondea(item.fisico_programado_monto, ToggleSoles ? 2 : 4) +
        (!ToggleSoles ? "%" : "")}
      {Permisos["actualizar_programadoejecutado"] && (
        <div onClick={() => ToggleEditable()}>
          <MdModeEdit title={"Editar"} style={{ cursor: "pointer" }} />
        </div>
      )}
    </div>
  );
}
function Financiero({
  item,
  UsuarioData,
  recargar,
  ToggleSoles,
  Obra,
  Permisos,
}) {
  const [Editable, setEditable] = useState(false);
  const ToggleEditable = () => setEditable(!Editable);
  const [Input, setInput] = useState("");
  async function update() {
    var tempFinanciero = Input;
    if (!ToggleSoles) {
      tempFinanciero = (tempFinanciero * Obra.g_total_presu) / 100;
    }
    const res = await axios.post(`${UrlServer}/putFinancieroCurvaS`, {
      id: item.id,
      financiero_monto: tempFinanciero,
      ultimo_editor_idacceso: sessionStorage.getItem("idacceso"),
    });
    ToggleEditable();
    recargar();
  }
  return Editable ? (
    <div className="d-flex">
      <DebounceInput
        value={RedondeaDecimales(item.financiero_monto, ToggleSoles ? 2 : 4)}
        debounceTimeout={300}
        onChange={(e) => setInput(e.target.value)}
        type="number"
      />
      <div onClick={() => update()}>
        <MdSave style={{ cursor: "pointer" }} />
      </div>
      <div onClick={() => ToggleEditable()}>
        <MdClose style={{ cursor: "pointer" }} />
      </div>
    </div>
  ) : (
    <div className="d-flex">
      {Redondea(item.financiero_monto, ToggleSoles ? 2 : 4) +
        (!ToggleSoles ? "%" : "")}
      {Permisos["actualizar_financiero"] && (
        <div onClick={() => ToggleEditable()}>
          <MdModeEdit title={"Editar"} style={{ cursor: "pointer" }} />
        </div>
      )}
    </div>
  );
}
function FinancieroProgramado({
  item,
  UsuarioData,
  recargar,
  ToggleSoles,
  Obra,
  Permisos,
}) {
  const [Editable, setEditable] = useState(false);
  const ToggleEditable = () => setEditable(!Editable);
  const [Input, setInput] = useState("");
  async function update() {
    var tempFinanciero = Input;
    if (!ToggleSoles) {
      tempFinanciero = (tempFinanciero * Obra.g_total_presu) / 100;
    }
    const res = await axios.post(`${UrlServer}/putFinancieroProgramadoCurvaS`, {
      id: item.id,
      financiero_programado_monto: tempFinanciero,
      ultimo_editor_idacceso: sessionStorage.getItem("idacceso"),
    });
    ToggleEditable();
    recargar();
  }
  return Editable ? (
    <div className="d-flex">
      <DebounceInput
        value={RedondeaDecimales(
          item.financiero_programado_monto,
          ToggleSoles ? 2 : 4
        )}
        debounceTimeout={300}
        onChange={(e) => setInput(e.target.value)}
        type="number"
      />
      <div onClick={() => update()}>
        <MdSave style={{ cursor: "pointer" }} />
      </div>
      <div onClick={() => ToggleEditable()}>
        <MdClose style={{ cursor: "pointer" }} />
      </div>
    </div>
  ) : (
    <div className="d-flex">
      {Redondea(item.financiero_programado_monto, ToggleSoles ? 2 : 4) +
        (!ToggleSoles ? "%" : "")}
      {Permisos["actualizar_programadofinanciero"] && (
        <div onClick={() => ToggleEditable()}>
          <MdModeEdit title={"Editar"} style={{ cursor: "pointer" }} />
        </div>
      )}
    </div>
  );
}

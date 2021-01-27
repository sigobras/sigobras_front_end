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

export default ({ item }) => {
  // refs
  const cabeceraRef = useRef(null);
  //modal
  const [ModalPrincipal, setModalPrincipal] = useState(false);
  function toggleModalPrincipal() {
    if (!ModalPrincipal) {
      fetchCurvaSAnyos();
      fetchUsuarioData();
      if (CurvaSAnyoSeleccionado != 0) fetchCurvaSdata();
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
      id_ficha: item.id_ficha,
    });
    setCurvaSAnyos(res.data);
    setCurvaSAnyoSeleccionado(res.data[0].anyo);
  };
  const [CurvaSdata, setCurvaSdata] = useState([]);
  const fetchCurvaSdata = async () => {
    const res = await axios.post(`${UrlServer}/getDataCurvaSAcumuladosByAnyo`, {
      id_ficha: item.id_ficha,
      anyo: CurvaSAnyoSeleccionado,
    });
    const res2 = await axios.post(`${UrlServer}/getDataCurvaS`, {
      id_ficha: item.id_ficha,
      anyo: CurvaSAnyoSeleccionado,
    });
    var dataTotal = res.data.concat(res2.data);
    if (!ToggleSoles) {
      console.log("item", item);
      for (let i = 0; i < dataTotal.length; i++) {
        const element = dataTotal[i];
        element.fisico_monto =
          (element.fisico_monto / item.presupuesto_costodirecto) * 100;
        element.fisico_programado_monto =
          (element.fisico_programado_monto / item.presupuesto_costodirecto) *
          100;
        element.financiero_monto =
          (element.financiero_monto / item.g_total_presu) * 100;
        element.financiero_programado_monto =
          (element.financiero_programado_monto / item.g_total_presu) * 100;
      }
    }
    console.log("dataTotal", dataTotal);
    setCurvaSdata(dataTotal);
  };

  //UsuarioData
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const request = await axios.post(`${UrlServer}/getDatosUsuario`, {
      id_acceso: sessionStorage.getItem("idacceso"),
    });
    setUsuarioData(request.data);
  }
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
              item={item}
              anyo={CurvaSAnyoSeleccionado}
              ref={cabeceraRef}
            />
            &nbsp;&nbsp;
            <div>
              <FormularioPrincipal
                id_ficha={item.id_ficha}
                recargarData={recargarData}
              />
              <div style={{ margin: "1px" }}>
                <select
                  onChange={(e) => setCurvaSAnyoSeleccionado(e.target.value)}
                >
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
            codigo={item.codigo}
            ToggleSoles={ToggleSoles}
          />
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table className="table table-striped table-dark">
              <thead>
                <tr>
                  <th style={{ width: "200px" }}>MES</th>
                  {CurvaSdata.map((item, i) => (
                    <th
                      key={i}
                      style={
                        item.tipo == "TOTAL" ? { backgroundColor: "red" } : {}
                      }
                    >
                      {item.tipo == "TOTAL"
                        ? "TOTAL - " + item.anyo
                        : mesesShort[item.mes - 1] + "-" + item.anyo}
                      {item.fisico_monto == 0 &&
                        item.tipo != "TOTAL" &&
                        (UsuarioData.cargo_nombre == "RESIDENTE" ||
                          UsuarioData.cargo_nombre == "EDITOR FINANCIERO") && (
                          <div onClick={() => deletePeriodoCurvaS(item.id)}>
                            <MdDeleteForever
                              title={"eliminiar periodo"}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        )}
                    </th>
                  ))}
                  <th style={{ backgroundColor: "red" }}>
                    TOTAL - {CurvaSAnyoSeleccionado}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="curvaS_fisicoRow">
                  <th
                    style={{
                      width: "200px",
                      display: "block",
                    }}
                  >
                    PROGRAMADO EJECUTADO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      <Programado
                        item={item}
                        UsuarioData={UsuarioData}
                        recargar={recargarData}
                        ToggleSoles={ToggleSoles}
                      />
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
                    )}
                  </th>
                </tr>

                <tr className="curvaS_fisicoRow">
                  <th style={{ width: "200px", display: "block" }}>
                    PROGRAMADO EJECUTADO REAL
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {item.fisico_monto
                        ? Redondea(item.fisico_monto, ToggleSoles ? 2 : 4)
                        : Redondea(
                            item.fisico_programado_monto,
                            ToggleSoles ? 2 : 4
                          )}
                    </td>
                  ))}
                  <th>
                    {Redondea(
                      CurvaSdata.reduce((acc, item) => {
                        if (item.tipo != "TOTAL") {
                          acc += item.fisico_monto
                            ? item.fisico_monto
                            : item.fisico_programado_monto;
                        }
                        return acc;
                      }, 0),
                      4
                    )}
                  </th>
                </tr>
                <tr className="curvaS_fisicoRow">
                  <th style={{ width: "200px", display: "block" }}>
                    EJECUTADO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {Redondea(item.fisico_monto, ToggleSoles ? 2 : 4)}
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
                    )}
                  </th>
                </tr>
                <tr className="curvaS_FinancieroRow">
                  <th
                    style={{
                      width: "200px",
                      display: "block",
                    }}
                  >
                    PROGRAMADO FINANCIERO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {item.tipo == "TOTAL" ? (
                        Redondea(
                          item.fisico_programado_monto,
                          ToggleSoles ? 2 : 4
                        )
                      ) : (
                        <FinancieroProgramado
                          item={item}
                          UsuarioData={UsuarioData}
                          recargar={recargarData}
                          ToggleSoles={ToggleSoles}
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
                    )}
                  </th>
                </tr>
                <tr className="curvaS_FinancieroRow">
                  <th style={{ width: "200px", display: "block" }}>
                    PROGRAMADO FINANCIERO REAL
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {item.financiero_monto
                        ? Redondea(item.financiero_monto, ToggleSoles ? 2 : 4)
                        : Redondea(
                            item.financiero_programado_monto,
                            ToggleSoles ? 2 : 4
                          )}
                    </td>
                  ))}
                  <th>
                    {Redondea(
                      CurvaSdata.reduce((acc, item) => {
                        if (item.tipo != "TOTAL") {
                          acc += item.financiero_monto
                            ? item.financiero_monto
                            : item.financiero_programado_monto;
                        }
                        return acc;
                      }, 0),
                      4
                    )}
                  </th>
                </tr>
                <tr className="curvaS_FinancieroRow">
                  <th style={{ width: "200px", display: "block" }}>
                    FINANCIERO
                  </th>
                  {CurvaSdata.map((item, i) => (
                    <td key={i}>
                      {item.tipo == "TOTAL" ? (
                        Redondea(
                          item.fisico_programado_monto,
                          ToggleSoles ? 2 : 4
                        )
                      ) : (
                        <Financiero
                          item={item}
                          UsuarioData={UsuarioData}
                          recargar={recargarData}
                          ToggleSoles={ToggleSoles}
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
                    )}
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
function Programado({ item, UsuarioData, recargar, ToggleSoles }) {
  const [Editable, setEditable] = useState(false);
  const ToggleEditable = () => setEditable(!Editable);
  const [Input, setInput] = useState("");
  async function update() {
    const res = await axios.post(`${UrlServer}/putProgramadoCurvaSbyId`, {
      id: item.id,
      fisico_programado_monto: Input,
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
      {Redondea(item.fisico_programado_monto, ToggleSoles ? 2 : 4)}
      {item.fisico_monto == 0 &&
        (UsuarioData.cargo_nombre == "RESIDENTE" ||
          UsuarioData.cargo_nombre == "EDITOR FINANCIERO") && (
          <div onClick={() => ToggleEditable()}>
            <MdModeEdit title={"Editar"} style={{ cursor: "pointer" }} />
          </div>
        )}
    </div>
  );
}
function Financiero({ item, UsuarioData, recargar, ToggleSoles }) {
  const [Editable, setEditable] = useState(false);
  const ToggleEditable = () => setEditable(!Editable);
  const [Input, setInput] = useState("");
  async function update() {
    const res = await axios.post(`${UrlServer}/putFinancieroCurvaS`, {
      id: item.id,
      financiero_monto: Input,
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
      {Redondea(item.financiero_monto, ToggleSoles ? 2 : 4)}
      {(UsuarioData.cargo_nombre == "RESIDENTE" ||
        UsuarioData.cargo_nombre == "EDITOR FINANCIERO") && (
        <div onClick={() => ToggleEditable()}>
          <MdModeEdit title={"Editar"} style={{ cursor: "pointer" }} />
        </div>
      )}
    </div>
  );
}
function FinancieroProgramado({ item, UsuarioData, recargar, ToggleSoles }) {
  const [Editable, setEditable] = useState(false);
  const ToggleEditable = () => setEditable(!Editable);
  const [Input, setInput] = useState("");
  async function update() {
    const res = await axios.post(`${UrlServer}/putFinancieroProgramadoCurvaS`, {
      id: item.id,
      financiero_programado_monto: Input,
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
      {Redondea(item.financiero_programado_monto, ToggleSoles ? 2 : 4)}
      {(UsuarioData.cargo_nombre == "RESIDENTE" ||
        UsuarioData.cargo_nombre == "EDITOR FINANCIERO") && (
        <div onClick={() => ToggleEditable()}>
          <MdModeEdit title={"Editar"} style={{ cursor: "pointer" }} />
        </div>
      )}
    </div>
  );
}

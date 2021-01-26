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

import { Redondea, mesesShort } from "../../Utils/Funciones";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import FormularioPrincipal from "./FormularioPrincipal";
import CurvaS_Chart from "./CurvaS_Chart";
import CurvaS_Cabezera from "./CurvaS_Cabecera";

export default ({ item }) => {
  // refs
  const cabeceraRef = useRef(null);
  //modal
  const [ModalPrincipal, setModalPrincipal] = useState(false);
  function toggleModalPrincipal() {
    if (!ModalPrincipal) {
      fetchCurvaSAnyos();
      fetchUsuarioData();
      fetchCurvaSdata();
    }
    setModalPrincipal(!ModalPrincipal);
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
    console.log("res", res);
    const res2 = await axios.post(`${UrlServer}/getDataCurvaS`, {
      id_ficha: item.id_ficha,
      anyo: CurvaSAnyoSeleccionado,
    });
    console.log("res2", res2);
    setCurvaSdata(res.data.concat(res2.data));
    console.log("CurvaSdata", res.data.concat(res2.data));
  };

  //toggle soles
  const [ToggleSoles, setToggleSoles] = useState(false);
  function onChangeToggleSoles() {
    setToggleSoles(!ToggleSoles);
  }

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
  }, [CurvaSAnyoSeleccionado]);
  return (
    <div>
      <button
        className="btn btn-outline-info btn-sm mr-1"
        title="CURVA S"
        onClick={toggleModalPrincipal}
      >
        <FaChartLine />
      </button>
      <Modal isOpen={ModalPrincipal} toggle={toggleModalPrincipal}>
        <div className="d-flex">
          <CurvaS_Cabezera
            key={CurvaSAnyoSeleccionado}
            CurvaSdata={CurvaSdata}
            item={item}
            anyo={CurvaSAnyoSeleccionado}
            ref={cabeceraRef}
          />
          <div>
            <FormularioPrincipal
              id_ficha={item.id_ficha}
              recargarData={recargarData}
            />
            <div>
              <select
                onChange={(e) => setCurvaSAnyoSeleccionado(e.target.value)}
              >
                {CurvaSAnyos.map((item, i) => (
                  <option key={i}>{item.anyo}</option>
                ))}
              </select>
            </div>
            {/* {!ToggleSoles ? (
              <button
                type="button"
                className="btn btn-primary"
                style={{ height: "32px" }}
                onClick={() => onChangeToggleSoles()}
              >
                S/.
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                style={{ height: "32px" }}
                onClick={() => onChangeToggleSoles()}
              >
                %
              </button>
            )} */}
          </div>
        </div>
        <CurvaS_Chart
          key={JSON.stringify(CurvaSdata)}
          CurvaSdata={CurvaSdata}
          codigo={item.codigo}
        />
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th>MES</th>
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
              <tr>
                <th>PROGRAMADO EJECUTADO</th>
                {CurvaSdata.map((item, i) => (
                  <td key={i}>
                    <Programado
                      item={item}
                      UsuarioData={UsuarioData}
                      recargar={recargarData}
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

              <tr>
                <th>PROGRAMADO EJECUTADO REAL</th>
                {CurvaSdata.map((item, i) => (
                  <td key={i}>
                    {item.fisico_monto
                      ? Redondea(item.fisico_monto)
                      : Redondea(item.fisico_programado_monto)}
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
                    }, 0)
                  )}
                </th>
              </tr>
              <tr>
                <th>EJECUTADO</th>
                {CurvaSdata.map((item, i) => (
                  <td key={i}>{Redondea(item.fisico_monto)}</td>
                ))}
                <th>
                  {Redondea(
                    CurvaSdata.reduce((acc, item) => {
                      if (item.tipo != "TOTAL") {
                        acc += item.fisico_monto;
                      }
                      return acc;
                    }, 0)
                  )}
                </th>
              </tr>
              <tr>
                <th>PROGRAMADO FINANCIERO</th>
                {CurvaSdata.map((item, i) => (
                  <td key={i}>
                    {item.tipo == "TOTAL" ? (
                      item.fisico_programado_monto
                    ) : (
                      <FinancieroProgramado
                        item={item}
                        UsuarioData={UsuarioData}
                        recargar={recargarData}
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
                    }, 0)
                  )}
                </th>
              </tr>
              <tr>
                <th>PROGRAMADO FINANCIERO REAL</th>
                {CurvaSdata.map((item, i) => (
                  <td key={i}>
                    {item.financiero_monto
                      ? Redondea(item.financiero_monto)
                      : Redondea(item.financiero_programado_monto)}
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
                    }, 0)
                  )}
                </th>
              </tr>
              <tr>
                <th>FINANCIERO</th>
                {CurvaSdata.map((item, i) => (
                  <td key={i}>
                    {item.tipo == "TOTAL" ? (
                      item.fisico_programado_monto
                    ) : (
                      <Financiero
                        item={item}
                        UsuarioData={UsuarioData}
                        recargar={recargarData}
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
                    }, 0)
                  )}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};
function Programado({ item, UsuarioData, recargar }) {
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
        value={item.fisico_programado_monto}
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
      {Redondea(item.fisico_programado_monto)}
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
function Financiero({ item, UsuarioData, recargar }) {
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
        value={item.financiero_monto}
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
      {Redondea(item.financiero_monto)}
      {(UsuarioData.cargo_nombre == "RESIDENTE" ||
        UsuarioData.cargo_nombre == "EDITOR FINANCIERO") && (
        <div onClick={() => ToggleEditable()}>
          <MdModeEdit title={"Editar"} style={{ cursor: "pointer" }} />
        </div>
      )}
    </div>
  );
}
function FinancieroProgramado({ item, UsuarioData, recargar }) {
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
        value={item.financiero_programado_monto}
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
      {Redondea(item.financiero_programado_monto)}
      {(UsuarioData.cargo_nombre == "RESIDENTE" ||
        UsuarioData.cargo_nombre == "EDITOR FINANCIERO") && (
        <div onClick={() => ToggleEditable()}>
          <MdModeEdit title={"Editar"} style={{ cursor: "pointer" }} />
        </div>
      )}
    </div>
  );
}

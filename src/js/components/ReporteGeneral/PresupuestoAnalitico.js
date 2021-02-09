import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiEyeFill, RiDeleteBin6Line } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
import DatosEspecificos from "./DatosEspecificos";
import BotonNuevo from "../../libs/BotonNuevo";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data, AnyoSeleccionado }) => {
  useEffect(() => {
    cargarData();
  }, []);
  const [Data, setData] = useState([]);
  const [DataResumen, setDataResumen] = useState([]);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/analitico/resumen`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado,
      },
    });

    for (let i = 0; i < res.data.length; i++) {
      var devengado_actual = 0;
      const item = res.data[i];
      for (let mes = 1; mes < 12; mes++) {
        devengado_actual += item["financiero_monto_mes" + mes];
      }
      item.devengado_actual = devengado_actual;
    }
    setData(res.data);
  }
  //calcular devengado
  function calcularDevengadoActual() {
    var clone = [...Data];
    for (let i = 0; i < clone.length; i++) {
      var devengado_actual = 0;
      const item = clone[i];
      for (let mes = 1; mes < 12; mes++) {
        devengado_actual += Number(item["financiero_monto_mes" + mes]);
      }
      item.devengado_actual = devengado_actual;
    }
    setData(clone);
  }

  //edicion
  const [ModoEdcion, setModoEdcion] = useState("");
  function agregarData() {
    var clone = [...Data];
    clone.push({ id: null, nombre: "", fichas_id_ficha: data.id_ficha });
    setData(clone);
  }
  //handleInputChange
  const [DatoAnual, setDatoAnual] = useState([]);
  const [DatoMensual, setDatoMensual] = useState([]);
  async function handleInputChange(index, name, value) {
    var clone = [...Data];
    clone[index][name] = value;
    setData(clone);
    if (
      name == "presupuesto_aprobado_anterior" ||
      name == "financiero_ejecutado_anterior" ||
      name == "pim_actual"
    ) {
      console.log("data ", Data[index]);
      var clone = [...DatoAnual];
      clone.push({
        presupuesto_analitico_resumen_id: Data[index].id,
        anyo: name == "pim_actual" ? AnyoSeleccionado : AnyoSeleccionado - 1,
        presupuesto_aprobado:
          name == "presupuesto_aprobado_anterior" ? value : undefined,
        financiero_ejecutado:
          name == "financiero_ejecutado_anterior" ? value : undefined,
        pim: name == "pim_actual" ? value : undefined,
      });
      setDatoAnual(clone);
    }
    if (
      name.startsWith("financiero_programado_monto_mes") ||
      name.startsWith("financiero_monto_mes")
    ) {
      var mes = "";
      if (name.startsWith("financiero_programado_monto_mes"))
        mes = name.replace("financiero_programado_monto_mes", "");
      if (name.startsWith("financiero_monto_mes"))
        mes = name.replace("financiero_monto_mes", "");
      var clone = [...DatoMensual];
      clone.push({
        presupuesto_analitico_resumen_id: Data[index].id,
        anyo: AnyoSeleccionado,
        mes: mes,
        financiero_monto: name.startsWith("financiero_monto_mes")
          ? value
          : undefined,
        financiero_programado_monto: name.startsWith(
          "financiero_programado_monto_mes"
        )
          ? value
          : undefined,
      });
      setDatoMensual(clone);
      calcularDevengadoActual();
    }
  }
  //automatic save
  let timer,
    timeoutVal = 2000;
  async function guardarData() {
    var dataProcesada = [];
    for (let i = 0; i < Data.length; i++) {
      const element = Data[i];
      dataProcesada.push({
        id: element.id,
        nombre: element.nombre,
        fichas_id_ficha: element.fichas_id_ficha,
      });
    }
    var res = await axios.put(
      `${UrlServer}/v1/analitico/resumen`,
      dataProcesada
    );
    cargarData();
  }
  async function guardarDataAnual() {
    console.log("DatoAnual", DatoAnual);
    var res = await axios.put(
      `${UrlServer}/v1/analitico/resumen/anual`,
      DatoAnual
    );
    console.log("guardarDataAnual", res.data);
  }
  async function guardarDataMensual() {
    console.log("DatoMensual", DatoMensual);
    var res = await axios.put(
      `${UrlServer}/v1/analitico/resumen/mensual`,
      DatoMensual
    );
  }
  //delete
  async function eliminarData(id) {
    var res = await axios.delete(`${UrlServer}/v1/analitico/resumen/${id}`);
    console.log("res", res.data);
    cargarData();
  }

  return (
    <div style={{ width: "2000px" }}>
      <table className="text-center">
        <tbody>
          <tr>
            <th className="reporteGeneral-bodySticky-analitico ">
              Descripción
            </th>
            <th>Aprobado al {AnyoSeleccionado - 1}</th>
            <th>Ejecutado al {AnyoSeleccionado - 1}</th>
            <th>Saldo al {AnyoSeleccionado - 1}</th>
            <th>Pim al {AnyoSeleccionado}</th>
            <th>Devengado</th>
            <th>Saldo Devengado</th>
            <th>Saldo por Asignar</th>
            {(() => {
              var tempRender = [];
              for (let mes = 1; mes <= 12; mes++) {
                tempRender.push(
                  <th key={mes}>
                    <div>Prog.</div>
                    <div>{mesesShort[mes - 1]}</div>
                  </th>
                );
                tempRender.push(
                  <th key={mes + "-2"}>
                    <div>Ejecutado</div>
                    <div>{mesesShort[mes - 1]}</div>
                  </th>
                );
              }
              return tempRender;
            })()}
          </tr>
          {Data.map((item, i) => (
            <tr key={i}>
              <th
                className="reporteGeneral-bodySticky-analitico "
                onClick={() => setModoEdcion("nombre" + i)}
              >
                {ModoEdcion == "nombre" + i ? (
                  <div>
                    <Input
                      value={item.nombre}
                      onChange={(e) =>
                        handleInputChange(i, "nombre", e.target.value)
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
                ) : (
                  item.nombre
                )}
              </th>
              <td
                onClick={() =>
                  setModoEdcion("presupuesto_aprobado_anterior" + i)
                }
                className="reporteGeneral-table-input "
              >
                {ModoEdcion == "presupuesto_aprobado_anterior" + i ? (
                  <div>
                    <Input
                      value={item.presupuesto_aprobado_anterior}
                      onChange={(e) =>
                        handleInputChange(
                          i,
                          "presupuesto_aprobado_anterior",
                          e.target.value
                        )
                      }
                      onKeyUp={() => {
                        window.clearTimeout(timer);
                        timer = window.setTimeout(() => {
                          guardarDataAnual();
                        }, timeoutVal);
                      }}
                      onKeyPress={() => {
                        window.clearTimeout(timer);
                      }}
                    />
                  </div>
                ) : (
                  Redondea(item.presupuesto_aprobado_anterior)
                )}
              </td>
              <td
                onClick={() =>
                  setModoEdcion("financiero_ejecutado_anterior" + i)
                }
                className="reporteGeneral-table-input "
              >
                {ModoEdcion == "financiero_ejecutado_anterior" + i ? (
                  <div>
                    <Input
                      value={item.financiero_ejecutado_anterior}
                      onChange={(e) =>
                        handleInputChange(
                          i,
                          "financiero_ejecutado_anterior",
                          e.target.value
                        )
                      }
                      onKeyUp={() => {
                        window.clearTimeout(timer);
                        timer = window.setTimeout(() => {
                          guardarDataAnual();
                        }, timeoutVal);
                      }}
                      onKeyPress={() => {
                        window.clearTimeout(timer);
                      }}
                    />
                  </div>
                ) : (
                  Redondea(item.financiero_ejecutado_anterior)
                )}
              </td>
              <td>
                {Redondea(
                  item.presupuesto_aprobado_anterior -
                    item.financiero_ejecutado_anterior
                )}
              </td>
              <td
                onClick={() => setModoEdcion("pim_actual" + i)}
                className="reporteGeneral-table-input "
              >
                {ModoEdcion == "pim_actual" + i ? (
                  <div>
                    <Input
                      value={item.pim_actual}
                      onChange={(e) =>
                        handleInputChange(i, "pim_actual", e.target.value)
                      }
                      onKeyUp={() => {
                        window.clearTimeout(timer);
                        timer = window.setTimeout(() => {
                          guardarDataAnual();
                        }, timeoutVal);
                      }}
                      onKeyPress={() => {
                        window.clearTimeout(timer);
                      }}
                    />
                  </div>
                ) : (
                  Redondea(item.pim_actual)
                )}
              </td>
              <td>{Redondea(item.devengado_actual)}</td>
              <td>{Redondea(item.pim_actual - item.devengado_actual)}</td>
              <td>
                {Redondea(
                  item.presupuesto_aprobado_anterior -
                    item.financiero_ejecutado_anterior -
                    item.pim_actual
                )}
              </td>
              {(() => {
                var tempRender = [];
                for (let mes = 1; mes <= 12; mes++) {
                  tempRender.push(
                    <td
                      key={mes}
                      onClick={() =>
                        setModoEdcion("financiero_programado_monto_mes" + mes)
                      }
                      className="reporteGeneral-table-input "
                    >
                      {ModoEdcion == "financiero_programado_monto_mes" + mes ? (
                        <div>
                          <Input
                            value={
                              item["financiero_programado_monto_mes" + mes]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                i,
                                "financiero_programado_monto_mes" + mes,
                                e.target.value
                              )
                            }
                            onKeyUp={() => {
                              window.clearTimeout(timer);
                              timer = window.setTimeout(() => {
                                guardarDataMensual();
                              }, timeoutVal);
                            }}
                            onKeyPress={() => {
                              window.clearTimeout(timer);
                            }}
                          />
                        </div>
                      ) : (
                        Redondea(item["financiero_programado_monto_mes" + mes])
                      )}
                    </td>
                  );
                  tempRender.push(
                    // <td key={mes + "-2"}>
                    //   {Redondea(item["financiero_monto_mes" + mes])}
                    // </td>
                    <td
                      key={mes + "-2"}
                      onClick={() =>
                        setModoEdcion("financiero_monto_mes" + mes)
                      }
                      className="reporteGeneral-table-input "
                    >
                      {ModoEdcion == "financiero_monto_mes" + mes ? (
                        <div>
                          <Input
                            value={item["financiero_monto_mes" + mes]}
                            onChange={(e) =>
                              handleInputChange(
                                i,
                                "financiero_monto_mes" + mes,
                                e.target.value
                              )
                            }
                            onKeyUp={() => {
                              window.clearTimeout(timer);
                              timer = window.setTimeout(() => {
                                guardarDataMensual();
                              }, timeoutVal);
                            }}
                            onKeyPress={() => {
                              window.clearTimeout(timer);
                            }}
                          />
                        </div>
                      ) : (
                        Redondea(item["financiero_monto_mes" + mes])
                      )}
                    </td>
                  );
                }
                return tempRender;
              })()}
            </tr>
          ))}
          <BotonNuevo size="80" onClick={() => agregarData()} />
        </tbody>
      </table>
    </div>
  );
};

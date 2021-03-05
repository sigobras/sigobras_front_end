import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, Spinner, Collapse, Row, Col } from "reactstrap";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";
import { DebounceInput } from "react-debounce-input";
import { MdSave, MdClose, MdModeEdit, MdDeleteForever } from "react-icons/md";

import PartidasChat from "../../../libs/PartidasChat";
import CheckDate from "./CheckDate";
export default ({ Semana, UsuarioData }) => {
  useEffect(() => {
    fetchSemanaFechas();
  }, []);
  function FechaLarga(fecha) {
    var fechaTemp = fecha.split("-");
    var ShortDate = new Date(fechaTemp[0], fechaTemp[1] - 1, [fechaTemp[2]]);
    var options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return ShortDate.toLocaleDateString("es-ES", options);
  }
  const [SemanaFechas, setSemanaFechas] = useState([]);
  async function fetchSemanaFechas() {
    setLoading(true);
    var request = await axios.post(`${UrlServer}/getHistorialSemanalFechas`, {
      id_ficha: sessionStorage.getItem("idobra"),
      fecha_inicial: Semana.fecha_inicial,
      fecha_final: Semana.fecha_final,
    });
    setSemanaFechas(request.data);
    setLoading(false);
  }
  const [SemanaFechaSeleccionada, setSemanaFechaSeleccionada] = useState(-1);
  const [
    SpinnerSemanaFechaSeleccionada,
    setSpinnerSemanaFechaSeleccionada,
  ] = useState(false);

  const [SemanasComponentes, setSemanasComponentes] = useState([]);
  async function fetchSemanasComponentes() {
    setSpinnerSemanaFechaSeleccionada(true);
    var request = await axios.post(
      `${UrlServer}/getHistorialSemanalComponentes`,
      {
        id_ficha: sessionStorage.getItem("idobra"),
        fecha: SemanaFechaSeleccionada,
      }
    );
    var semanasComponentes = [...request.data];
    for (let i = 0; i < semanasComponentes.length; i++) {
      const item = semanasComponentes[i];
      semanasComponentes[i].diasData = await getHistorialSemanalDias(
        item.id_componente,
        SemanaFechaSeleccionada
      );
    }
    setSemanasComponentes(semanasComponentes);
    setSpinnerSemanaFechaSeleccionada(false);
  }
  async function getHistorialSemanalDias(id_componente, fecha) {
    var request = await axios.post(`${UrlServer}/getHistorialSemanalDias`, {
      id_componente: id_componente,
      fecha: fecha,
    });
    return request.data;
  }
  //edicion de avance actividades
  const [InputAvanceActividadIndex, setInputAvanceActividadIndex] = useState(
    -1
  );
  const [InputAvanceActividadData, setInputAvanceActividadData] = useState(
    null
  );
  async function updateAvanceActividad(id_AvanceActividades) {
    if (
      confirm(
        "La siguiente operacion es irreversible, esta seguro de proceder?"
      )
    ) {
      await axios.post(`${UrlServer}/putAvanceActividades`, {
        id_ficha: sessionStorage.getItem("idobra"),
        id_acceso: sessionStorage.getItem("idacceso"),
        id_AvanceActividades: id_AvanceActividades,
        valor: InputAvanceActividadData,
      });
      fetchSemanasComponentes();
    }
    setInputAvanceActividadIndex(-1);
    setInputAvanceActividadData(null);
  }
  const [FechaActiva, setFechaActiva] = useState(0);
  async function fetchFechaRevisado() {
    const request = await axios.post(`${UrlServer}/getEstadoRevisadoFecha`, {
      fecha: SemanaFechaSeleccionada,
      id_ficha: sessionStorage.getItem("idobra"),
    });
    if (request.data.revisado == 0) {
      setFechaActiva(1);
    } else {
      setFechaActiva(0);
    }
  }
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    fetchSemanasComponentes();
    fetchFechaRevisado();
  }, [SemanaFechaSeleccionada]);
  return (
    <>
      {Loading ? (
        <Spinner size="sm" color="primary" type="grow" />
      ) : (
        <Row>
          <Col sm="12">
            {SemanaFechas.map((item, i) => (
              <fieldset key={i} className="mt-2">
                <div className="d-flex">
                  <legend
                    className="prioridad"
                    onClick={() => {
                      if (SemanaFechaSeleccionada == item.fecha) {
                        setSemanaFechaSeleccionada({});
                      } else {
                        setSemanaFechaSeleccionada(item.fecha);
                      }
                    }}
                  >
                    <b>FECHA: </b>
                    {FechaLarga(item.fecha)} - <b> S/.</b>{" "}
                    {Redondea(item.fecha_total_soles)} -{" "}
                    <b> {Redondea(item.fecha_total_porcentaje)} %</b>
                    <Spinner
                      size="sm"
                      color="primary"
                      type="grow"
                      style={
                        SemanaFechaSeleccionada == item.fecha &&
                        SpinnerSemanaFechaSeleccionada
                          ? {}
                          : { display: "none" }
                      }
                    />
                  </legend>
                  <div>
                    <CheckDate fecha={item.fecha} UsuarioData={UsuarioData} />
                  </div>
                </div>

                <Collapse isOpen={SemanaFechaSeleccionada == item.fecha}>
                  <div className="table-responsive">
                    {SemanasComponentes.map((item2, i2) => [
                      <div
                        className="float-left"
                        style={{
                          color: "#171819",
                          fontSize: "12px",
                          backgroundColor: "#ffc107",
                          width: "100%",
                          padding: "3px",
                        }}
                      >
                        <b>{item2.numero + " " + item2.nombre}</b>
                        <div
                          className="float-right"
                          style={{
                            color: "#171819",
                            fontSize: "12px",
                          }}
                        >
                          S/. {Redondea(item2.componente_total_soles)} {" 〰 "}
                          {Redondea(item2.componente_total_porcentaje)} %
                        </div>
                      </div>,
                      <table className="table table-sm small table-hover">
                        <thead>
                          <tr>
                            <th></th>
                            <th>ITEM</th>
                            <th>PARTIDA</th>
                            <th>ACTIVIDAD </th>
                            <th> DESCRIPCIÓN</th>
                            <th> RENDIMIENTO</th>
                            <th>A. FISICO</th>
                            <th>C. U.</th>
                            <th>C. P.</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {item2.diasData &&
                            item2.diasData.map((item3, i3) => (
                              <tr key={i3}>
                                <td>
                                  <PartidasChat
                                    id_partida={item3.id_partida}
                                    titulo={item3.descripcion_partida}
                                  />
                                </td>
                                <td>{item3.item}</td>
                                <td>{item3.descripcion_partida}</td>

                                <td>{item3.nombre_actividad}</td>
                                <td>{item3.descripcion_actividad}</td>
                                <td>{Redondea(item3.rendimiento)}</td>
                                <td>
                                  {InputAvanceActividadIndex !=
                                  i2 + "-" + i3 ? (
                                    <div className="d-flex">
                                      {Redondea(item3.valor, 4)}{" "}
                                      {item3.unidad_medida}
                                      {FechaActiva &&
                                        (UsuarioData.cargo_nombre ==
                                          "RESIDENTE" ||
                                          UsuarioData.cargo_nombre ==
                                            "ADMINISTRADOR GENERAL") && (
                                          <div
                                            onClick={() =>
                                              setInputAvanceActividadIndex(
                                                i2 + "-" + i3
                                              )
                                            }
                                          >
                                            <MdModeEdit
                                              style={{
                                                cursor: "pointer",
                                              }}
                                            />
                                          </div>
                                        )}
                                    </div>
                                  ) : (
                                    <div className="d-flex">
                                      <DebounceInput
                                        value={item3.valor}
                                        debounceTimeout={300}
                                        onChange={(e) =>
                                          setInputAvanceActividadData(
                                            e.target.value
                                          )
                                        }
                                        type="number"
                                      />
                                      <div
                                        onClick={() =>
                                          updateAvanceActividad(
                                            item3.id_AvanceActividades
                                          )
                                        }
                                      >
                                        <MdSave
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        />
                                      </div>
                                      <div
                                        onClick={() =>
                                          setInputAvanceActividadIndex(-1)
                                        }
                                      >
                                        <MdClose
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td>{Redondea(item3.costo_unitario)}</td>
                                <td>{Redondea(item3.parcial)}</td>
                                <td>
                                  {FechaActiva &&
                                  (UsuarioData.cargo_nombre == "RESIDENTE" ||
                                    UsuarioData.cargo_nombre ==
                                      "ADMINISTRADOR GENERAL") ? (
                                    <div
                                      onClick={() =>
                                        updateAvanceActividad(
                                          item3.id_AvanceActividades
                                        )
                                      }
                                    >
                                      <MdDeleteForever
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>,
                    ])}
                  </div>
                </Collapse>
              </fieldset>
            ))}
          </Col>
        </Row>
      )}
    </>
  );
};

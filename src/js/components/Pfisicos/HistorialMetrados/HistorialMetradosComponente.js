import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";

export default ({ ComponenteSeleccionado, Anyo, Mes }) => {
  useEffect(() => {
    fetchFechas();
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
  const [Fechas, setFechas] = useState([]);
  async function fetchFechas() {
    var request = await axios.post(`${UrlServer}/getHistorialFechas2`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: Anyo,
      mes: Mes,
      id_componente: ComponenteSeleccionado.id_componente,
    });
    setFechas(request.data);
  }
  const [FechasSeleccionada, setFechasSeleccionada] = useState({});
  const [FechasAvance, setFechasAvance] = useState([]);
  async function fetchFechasAvance(source) {
    setLoading(true);
    var request = await axios.post(
      `${UrlServer}/getHistorialDias2`,
      {
        id_componente: ComponenteSeleccionado.id_componente,
        fecha: FechasSeleccionada,
      },
      { cancelToken: source.token }
    );
    setLoading(false);
    setFechasAvance(request.data);
  }
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    let source = axios.CancelToken.source();
    if (Object.keys(FechasSeleccionada).length != 0) {
      setFechasAvance([]);
      fetchFechasAvance(source);
    }
    return () => {
      source.cancel();
    };
  }, [FechasSeleccionada]);

  return (
    <Card>
      <CardHeader>
        {ComponenteSeleccionado.nombre_componente}
        <div className="float-right">
          S/. {Redondea(ComponenteSeleccionado.componente_total_soles)} {" 〰 "}
          {Redondea(ComponenteSeleccionado.componente_total_porcentaje)} %
        </div>
      </CardHeader>
      <CardBody className="p-2">
        <Row>
          <Col sm="12">
            {Fechas.map((item, i) => (
              <fieldset key={i} className="mt-2">
                <legend
                  className="prioridad"
                  onClick={() => {
                    if (FechasSeleccionada == item.fecha) {
                      setFechasSeleccionada({});
                    } else {
                      setFechasSeleccionada(item.fecha);
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
                      FechasSeleccionada == item.fecha && Loading
                        ? {}
                        : { display: "none" }
                    }
                  />
                </legend>
                <Collapse isOpen={FechasSeleccionada == item.fecha}>
                  <div className="table-responsive">
                    <table className="table table-sm small table-hover">
                      <thead>
                        <tr>
                          <th>ITEM</th>
                          <th>PARTIDA</th>
                          <th>ACTIVIDAD </th>
                          <th> DESCRIPCIÓN</th>

                          <th>A. FISICO</th>
                          <th>C. U.</th>
                          <th>C. P.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FechasAvance.map((item, j) => (
                          <tr key={j}>
                            <td>{item.item}</td>
                            <td>{item.descripcion_partida}</td>

                            <td>{item.nombre_actividad}</td>
                            <td>{item.descripcion_actividad}</td>

                            <td>
                              {Redondea(item.valor, 4)} {item.unidad_medida}
                            </td>
                            <td>{Redondea(item.costo_unitario)}</td>
                            <td>{Redondea(item.parcial)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        {FechasAvance.map(
                          (item, j) =>
                            item.observacion && (
                              <tr key={j}>
                                <td colSpan={8}> {item.observacion}</td>
                              </tr>
                            )
                        )}
                      </tfoot>
                    </table>
                  </div>
                </Collapse>
              </fieldset>
            ))}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

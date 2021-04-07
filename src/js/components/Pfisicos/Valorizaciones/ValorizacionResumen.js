import React, { useState, useEffect } from "react";
import axios from "axios";
import BigNumber from "bignumber.js";
import { BsFillTrashFill } from "react-icons/bs";
import { FaEdit, FaSave } from "react-icons/fa";
import { AiOutlineFileAdd } from "react-icons/ai";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";
import "./valorizaciones.css";

export default ({ PeriodoSeleccionado }) => {
  useEffect(() => {
    fetchResumenComponentes();
    get_data_costos_indirectos();
  }, []);
  //ResumenComponentes
  const [ResumenComponentes, setResumenComponentes] = useState([]);
  const [ResumenComponentesTotales, setResumenComponentesTotales] = useState(
    {}
  );
  async function fetchResumenComponentes() {
    const res = await axios.post(`${UrlServer}/getValGeneralResumenPeriodo2`, {
      id_ficha: sessionStorage.getItem("idobra"),
      fecha_inicial: PeriodoSeleccionado.fecha_inicial,
      fecha_final: PeriodoSeleccionado.fecha_final,
    });
    if (Array.isArray(res.data)) {
      setResumenComponentes(res.data);
      var presupuesto = res.data.reduce(
        (acc, item) => acc + item.presupuesto,
        0
      );
      var valor_anterior = res.data.reduce(
        (acc, item) => acc + item.valor_anterior,
        0
      );
      var valor_actual = res.data.reduce(
        (acc, item) => acc + item.valor_actual,
        0
      );
      setResumenComponentesTotales({
        presupuesto,
        valor_anterior,
        porcentaje_anterior: (valor_anterior / presupuesto) * 100,
        valor_actual,
        porcentaje_actual: (valor_actual / presupuesto) * 100,
        valor_total: valor_anterior + valor_actual,
        porcentaje_total: ((valor_anterior + valor_actual) / presupuesto) * 100,
        valor_saldo: presupuesto - valor_anterior - valor_actual,
        porcentaje_saldo:
          ((presupuesto - valor_anterior - valor_actual) / presupuesto) * 100,
      });
    }
  }
  //costos indirectos
  const [CostosIndirectos, setCostosIndirectos] = useState([]);
  async function get_data_costos_indirectos() {
    var costos_indirectos = await axios.post(
      `${UrlServer}/getCostosIndirectos`,
      {
        fecha_inicial: PeriodoSeleccionado.fecha_inicial,
        fecha_final: PeriodoSeleccionado.fecha_final,
        fichas_id_ficha: sessionStorage.getItem("idobra"),
      }
    );

    setCostosIndirectos(costos_indirectos.data);
  }

  function agregar_costo_indirecto() {
    var costos_indirectos = [...CostosIndirectos];
    costos_indirectos.push({
      costo_indirecto: " Gastos generales",
      monto: " 15151613",
    });
    setCostosIndirectos(costos_indirectos);
    setActivatorInput(costos_indirectos.length - 1);
  }

  function updateinput(index, nombre_campo, valor) {
    var costos_indirectos = [...CostosIndirectos];
    costos_indirectos[index][nombre_campo] = valor;
    setCostosIndirectos(costos_indirectos);
  }

  async function eliminar_costo_indirecto(index) {
    if (confirm("Desea eliminar este registro ? ")) {
      var res = await axios.post(`${UrlServer}/eliminarCostosIndirectos`, {
        id: CostosIndirectos[index].id,
      });
      get_data_costos_indirectos();
    }
  }
  const [ActivatorInput, setActivatorInput] = useState(-1);
  function activarEdicion(index) {
    setActivatorInput(index);
  }

  async function guardar_costo_indirecto(index) {
    var res = await axios.post(`${UrlServer}/agregarCostoIndirecto`, {
      id: CostosIndirectos[index].id,
      nombre: CostosIndirectos[index].nombre,
      monto: CostosIndirectos[index].monto,
      fecha_inicial: PeriodoSeleccionado.fecha_inicial,
      fecha_final: PeriodoSeleccionado.fecha_final,
      fichas_id_ficha: sessionStorage.getItem("idobra"),
    });
    alert("guardado con exito");
    setActivatorInput(-1);
    get_data_costos_indirectos();
  }
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="resplandPartida">
          <tr className="text-center">
            <th className="align-middle" rowSpan="3">
              N°
            </th>
            <th className="align-middle" rowSpan="3">
              NOMBRE DEL COMPONENTE
            </th>
            <th>S/. {Redondea(ResumenComponentesTotales.presupuesto)}</th>

            <th>S/. {Redondea(ResumenComponentesTotales.valor_anterior)}</th>
            <th>{Redondea(ResumenComponentesTotales.porcentaje_anterior)} %</th>

            <th>S/. {Redondea(ResumenComponentesTotales.valor_actual)}</th>
            <th>{Redondea(ResumenComponentesTotales.porcentaje_actual)} %</th>

            <th>S/. {Redondea(ResumenComponentesTotales.valor_total)}</th>
            <th>{Redondea(ResumenComponentesTotales.porcentaje_total)} %</th>

            <th>S/. {Redondea(ResumenComponentesTotales.valor_saldo)}</th>
            <th>{Redondea(ResumenComponentesTotales.porcentaje_saldo)} %</th>
          </tr>
          <tr className="text-center">
            <th>MONTO ACT.</th>
            <th colSpan="2">AVANCE ANTERIOR</th>
            <th colSpan="2">AVANCE ACTUAL</th>
            <th colSpan="2">AVANCE ACUMULADO</th>
            <th colSpan="2">SALDO</th>
          </tr>
          <tr className="text-center">
            <th>PPTO</th>
            <th>MONTO</th>
            <th>%</th>
            <th>MONTO</th>
            <th>%</th>
            <th>MONTO</th>
            <th>%</th>
            <th>MONTO</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {ResumenComponentes.map((item, i) => (
            <tr key={i}>
              <td>{item.numero}</td>
              <td>{item.nombre} </td>
              <td>{Redondea(item.presupuesto)}</td>
              <td>{Redondea(item.valor_anterior)}</td>
              <td>
                {Redondea((item.valor_anterior / item.presupuesto) * 100)}
              </td>
              <td className="bg-mm">{Redondea(item.valor_actual)}</td>
              <td className="bg-mm">
                {Redondea((item.valor_actual / item.presupuesto) * 100)}
              </td>
              <td>{Redondea(item.valor_anterior + item.valor_actual)}</td>
              <td>
                {Redondea(
                  ((item.valor_anterior + item.valor_actual) /
                    item.presupuesto) *
                    100
                )}
              </td>
              <td>
                {Redondea(
                  item.presupuesto - item.valor_anterior - item.valor_actual
                )}
              </td>
              <td>
                {Redondea(
                  ((item.presupuesto -
                    item.valor_anterior -
                    item.valor_actual) /
                    item.presupuesto) *
                    100
                )}
              </td>
            </tr>
          ))}
          <tr className="resplandPartida font-weight-bolder">
            <td colSpan="2">TOTAL COSTO DIRECTO</td>
            <td>S/. {Redondea(ResumenComponentesTotales.presupuesto)}</td>

            <td>S/. {Redondea(ResumenComponentesTotales.valor_anterior)}</td>
            <td>{Redondea(ResumenComponentesTotales.porcentaje_anterior)} %</td>

            <td>S/. {Redondea(ResumenComponentesTotales.valor_actual)}</td>
            <td>{Redondea(ResumenComponentesTotales.porcentaje_actual)} %</td>

            <td>S/. {Redondea(ResumenComponentesTotales.valor_total)}</td>
            <td>{Redondea(ResumenComponentesTotales.porcentaje_total)} %</td>

            <td>S/. {Redondea(ResumenComponentesTotales.valor_saldo)}</td>
            <td>{Redondea(ResumenComponentesTotales.porcentaje_saldo)} %</td>
          </tr>
          {/* Costos inderectos */}
          {CostosIndirectos.map((item, index) => (
            <tr key={index}>
              <td></td>
              <td>
                <input
                  className=" input_expandible "
                  type="text"
                  placeholder={item.nombre}
                  onBlur={(event) =>
                    updateinput(index, "nombre", event.target.value)
                  }
                  disabled={ActivatorInput == index ? "" : "disabled"}
                />
              </td>
              <td>
                <input
                  className="input_expandible "
                  type="text"
                  placeholder={Redondea(item.monto)}
                  onBlur={(event) =>
                    updateinput(index, "monto", event.target.value)
                  }
                  disabled={ActivatorInput == index ? "" : "disabled"}
                />
              </td>
              <td>
                {Redondea(
                  (item.monto *
                    parseFloat(
                      ResumenComponentesTotales.porcentaje_anterior
                    ).toFixed(2)) /
                    100
                )}
              </td>
              <td>{Redondea(ResumenComponentesTotales.porcentaje_anterior)}</td>
              <td>
                {Redondea(
                  (item.monto *
                    parseFloat(
                      ResumenComponentesTotales.porcentaje_actual
                    ).toFixed(2)) /
                    100
                )}
              </td>
              <td>{Redondea(ResumenComponentesTotales.porcentaje_actual)}</td>
              <td>
                {Redondea(
                  (item.monto *
                    parseFloat(
                      ResumenComponentesTotales.porcentaje_total
                    ).toFixed(2)) /
                    100
                )}
              </td>
              <td>{Redondea(ResumenComponentesTotales.porcentaje_total)}</td>
              <td>
                {Redondea(
                  (item.monto *
                    parseFloat(
                      ResumenComponentesTotales.porcentaje_saldo
                    ).toFixed(2)) /
                    100
                )}
              </td>
              <td>{Redondea(ResumenComponentesTotales.porcentaje_saldo)}</td>
              <td>
                <button
                  //className="boxy"
                  className="btn btn-danger"
                  onClick={() => eliminar_costo_indirecto(index)}
                >
                  <BsFillTrashFill size={10} />
                </button>
              </td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => activarEdicion(index)}
                >
                  <FaEdit size={10} />
                </button>
              </td>
              <td>
                <button
                  className="btn btn-primary  "
                  onClick={() => guardar_costo_indirecto(index)}
                >
                  <FaSave size={10} />
                </button>
              </td>
            </tr>
          ))}
          <tr className="resplandPartida font-weight-bolder">
            <td colSpan="2">TOTAL COSTO INDIRECTO</td>

            <td>
              S/.
              {(() => {
                var suma = 0;
                for (let index = 0; index < CostosIndirectos.length; index++) {
                  const element = CostosIndirectos[index];
                  suma = suma + parseFloat(element.monto);
                }
                return Redondea(suma);
              })()}
            </td>

            {/* AVANCE ANTERIOR */}
            <td>
              S/.
              {(() => {
                var suma = 0;
                for (let index = 0; index < CostosIndirectos.length; index++) {
                  const item = CostosIndirectos[index];
                  suma +=
                    (item.monto *
                      parseFloat(
                        ResumenComponentesTotales.porcentaje_anterior
                      ).toFixed(2)) /
                    100;
                }
                return Redondea(suma);
              })()}
            </td>
            {/* AVANCE ANTERIOR PORCENTAJE  */}
            <td>{Redondea(ResumenComponentesTotales.porcentaje_anterior)} %</td>
            {/* AVANCE ACTUAL  */}

            <td>
              S/.
              {(() => {
                var suma = 0;
                for (let index = 0; index < CostosIndirectos.length; index++) {
                  const item = CostosIndirectos[index];
                  suma +=
                    (item.monto *
                      parseFloat(
                        ResumenComponentesTotales.porcentaje_actual
                      ).toFixed(2)) /
                    100;
                }
                return Redondea(suma);
              })()}
            </td>
            {/* AVANCE ACTUAL PORCENTAJE  */}

            <td>{Redondea(ResumenComponentesTotales.porcentaje_actual)} %</td>

            {/* AVANCE ACUMULADO */}
            <td>
              S/.
              {(() => {
                var suma = 0;
                for (let index = 0; index < CostosIndirectos.length; index++) {
                  const item = CostosIndirectos[index];
                  suma +=
                    (item.monto *
                      parseFloat(
                        ResumenComponentesTotales.porcentaje_total
                      ).toFixed(2)) /
                    100;
                }
                return Redondea(suma);
              })()}
            </td>

            {/* AVANCE ACUMULADO PORCENTAJE  */}
            <td>{Redondea(ResumenComponentesTotales.porcentaje_total)} %</td>

            {/* AVANCE SALDO  */}
            <td>
              S/.
              {(() => {
                var suma = 0;
                for (let index = 0; index < CostosIndirectos.length; index++) {
                  const item = CostosIndirectos[index];
                  suma +=
                    (item.monto *
                      parseFloat(
                        ResumenComponentesTotales.porcentaje_saldo
                      ).toFixed(2)) /
                    100;
                }
                return Redondea(suma);
              })()}
            </td>

            {/* AVANCE SALDO PORCENTAJE  */}
            <td>{Redondea(ResumenComponentesTotales.porcentaje_saldo)}%</td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button
                className="btn btn-primary"
                onClick={() => agregar_costo_indirecto()}
              >
                <AiOutlineFileAdd size={20} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

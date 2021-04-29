import React, { useState, useEffect } from "react";
import axios from "axios";
import BigNumber from "bignumber.js";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";
import "./valorizaciones.css";
export default ({ PeriodoSeleccionado, Componenteseleccionado }) => {
  useEffect(() => {
    fetchPartidas();
  }, []);
  //Componentes
  const [Partidas, setPartidas] = useState([]);
  const [PartidasTotales, setPartidasTotales] = useState({});
  async function fetchPartidas() {
    const res = await axios.post(`${UrlServer}/getValGeneralPartidas2`, {
      id_ficha: sessionStorage.getItem("idobra"),
      fecha_inicial: PeriodoSeleccionado.fecha_inicial,
      fecha_final: PeriodoSeleccionado.fecha_final,
      id_componente: Componenteseleccionado.id_componente,
    });
    function addLeadingZeros(num, size) {
      num = num.toString();
      while (num.length < size) num = "0" + num;
      return num;
    }
    // setPartidas(res.data)

    var arr = res.data
      .map((item) => {
        item.item2 = item.item
          .split(".")
          .map((n) => addLeadingZeros(n, 10))
          .join("");
        return item;
      })
      .sort((a, b) => {
        if (a.item2 < b.item2) {
          return -1;
        }
        if (a.item2 > b.item2) {
          return 1;
        }
        return 0;
      });
    setPartidas(arr);

    var valor_anterior = new BigNumber(0);
    var valor_actual = new BigNumber(0);

    res.data.forEach((item) => {
      valor_anterior = valor_anterior.plus(item.valor_anterior || 0);
      valor_actual = valor_actual.plus(item.valor_actual || 0);
    });
    valor_anterior = valor_anterior.toNumber();
    valor_actual = valor_actual.toNumber();
    setPartidasTotales({
      valor_anterior,
      porcentaje_anterior:
        (valor_anterior / Componenteseleccionado.presupuesto) * 100,
      valor_actual,
      porcentaje_actual:
        (valor_actual / Componenteseleccionado.presupuesto) * 100,
      valor_total: BigNumber(valor_anterior || 0)
        .plus(valor_actual || 0)
        .toNumber(),
      porcentaje_total:
        (BigNumber(valor_anterior || 0)
          .plus(valor_actual || 0)
          .toNumber() /
          Componenteseleccionado.presupuesto) *
        100,
      valor_saldo:
        Componenteseleccionado.presupuesto - valor_anterior - valor_actual,
      porcentaje_saldo:
        ((Componenteseleccionado.presupuesto - valor_anterior - valor_actual) /
          Componenteseleccionado.presupuesto) *
        100,
    });
  }
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="text-center resplandPartida">
          <tr>
            <th colSpan="3" rowSpan="2" className="align-middle">
              DESCRIPCION
            </th>
            <th colSpan="2">
              S/. {Redondea(Componenteseleccionado.presupuesto)}
            </th>

            <th colSpan="2">S/. {Redondea(PartidasTotales.valor_anterior)}</th>
            <th>{Redondea(PartidasTotales.porcentaje_anterior)} %</th>

            <th colSpan="2">S/. {Redondea(PartidasTotales.valor_actual)}</th>
            <th>{Redondea(PartidasTotales.porcentaje_actual)} %</th>

            <th colSpan="2">S/. {Redondea(PartidasTotales.valor_total)}</th>
            <th>{Redondea(PartidasTotales.porcentaje_total)} %</th>

            <th colSpan="2">S/. {Redondea(PartidasTotales.valor_saldo)}</th>
            <th>{Redondea(PartidasTotales.porcentaje_saldo)} %</th>
          </tr>
          <tr>
            <th colSpan="2">PRESUPUESTO</th>
            <th colSpan="3">ANTERIOR</th>
            <th colSpan="3">ACTUAL</th>
            <th colSpan="3">ACUMULADO</th>
            <th colSpan="3">SALDO</th>
          </tr>
          <tr>
            <th>ITEM</th>
            <th>DESCRIPCION</th>
            <th>METRADO</th>
            <th>P. U. S/.</th>
            <th>P. P S/.</th>

            <th>MET. </th>
            <th>VAL</th>
            <th>%</th>

            <th>MET.</th>
            <th>VAL</th>
            <th>%</th>

            <th>MET.</th>
            <th>VAL</th>
            <th>%</th>

            <th>MET.</th>
            <th>VAL</th>
            <th>%</th>
          </tr>
        </thead>

        <tbody>
          {Partidas.map((item) => (
            <tr
              key={item.id_partida}
              className={
                item.tipo === "titulo"
                  ? "font-weight-bold text-warning"
                  : "font-weight-light"
              }
            >
              <td>{item.item}</td>
              <td>{item.descripcion}</td>
              <td>
                {item.tipo === "partida"
                  ? Redondea(item.metrado) +
                    " " +
                    item.unidad_medida.replace("/DIA", "")
                  : ""}
              </td>
              <td>{Redondea(item.costo_unitario)}</td>
              <td>
                {Redondea(
                  BigNumber(item.metrado || 0)
                    .times(item.costo_unitario || 0)
                    .toNumber()
                )}
              </td>

              <td>{Redondea(item.metrado_anterior)}</td>
              <td>{Redondea(item.valor_anterior)}</td>
              <td>{Redondea((item.metrado_anterior / item.metrado) * 100)}</td>

              <td className="bg-mm">{Redondea(item.metrado_actual)}</td>
              <td className="bg-mm">{Redondea(item.valor_actual)}</td>
              <td>{Redondea((item.metrado_actual / item.metrado) * 100)}</td>

              <td>
                {Redondea(
                  BigNumber(item.metrado_anterior || 0)
                    .plus(item.metrado_actual || 0)
                    .toNumber()
                )}
              </td>
              <td>
                {Redondea(
                  BigNumber(item.valor_anterior || 0)
                    .plus(item.valor_actual || 0)
                    .toNumber()
                )}
              </td>
              <td>
                {Redondea(
                  (BigNumber(item.metrado_anterior || 0)
                    .plus(item.metrado_actual || 0)
                    .toNumber() /
                    item.metrado) *
                    100
                )}
              </td>

              <td>
                {Redondea(
                  item.metrado - item.metrado_anterior - item.metrado_actual,
                  2,
                  true
                )}
              </td>
              <td>
                {Redondea(
                  item.metrado * item.costo_unitario -
                    item.valor_anterior -
                    item.valor_actual,
                  2,
                  true
                )}
              </td>
              <td>
                {Redondea(
                  ((item.metrado -
                    item.metrado_anterior -
                    item.metrado_actual) /
                    item.metrado) *
                    100,
                  2,
                  true
                )}
              </td>
            </tr>
          ))}

          <tr className="resplandPartida">
            <td colSpan="3">TOTAL</td>
            <td colSpan="2">
              S/. {Redondea(Componenteseleccionado.presupuesto)}
            </td>

            <td colSpan="2">S/. {Redondea(PartidasTotales.valor_anterior)}</td>
            <td>{Redondea(PartidasTotales.porcentaje_anterior)} %</td>

            <td colSpan="2">S/. {Redondea(PartidasTotales.valor_actual)}</td>
            <td>{Redondea(PartidasTotales.porcentaje_actual)} %</td>

            <td colSpan="2">S/. {Redondea(PartidasTotales.valor_total)}</td>
            <td>{Redondea(PartidasTotales.porcentaje_total)} %</td>

            <td colSpan="2">S/. {Redondea(PartidasTotales.valor_saldo)}</td>
            <td>{Redondea(PartidasTotales.porcentaje_saldo)} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

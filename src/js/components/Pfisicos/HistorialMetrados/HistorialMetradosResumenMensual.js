import React, { useState, useEffect } from "react";
import axios from "axios";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea } from "../../Utils/Funciones";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default ({ Anyo, Mes }) => {
  useEffect(() => {
    fetchResumenMensualData();
  }, []);
  //resumen mensual
  const [ResumenMensualData, setResumenMensualData] = useState([]);
  async function fetchResumenMensualData() {
    var request = await axios.post(`${UrlServer}/getHistorialResumenMensual`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: Anyo,
      mes: Mes,
    });
    setResumenMensualData(request.data.componentes);
    fetchResumenMensualDataChart(
      request.data.componentes,
      request.data.diasEjecutados
    );
  }
  const [ResumenMensualDataChart, setResumenMensualDataChart] = useState();
  const [
    ResumenMensualDataChartCategories,
    setResumenMensualDataChartCategories,
  ] = useState();
  async function fetchResumenMensualDataChart(componentes, diasEjecutados) {
    var series = [];
    var categories = [];
    componentes.forEach((item) => {
      var data = [];
      for (
        let i = diasEjecutados[0].dia;
        i <= diasEjecutados[diasEjecutados.length - 1].dia;
        i++
      ) {
        data.push(Number(Number(item["d" + i]).toFixed(2)));
      }
      series.push({
        name: item.numero,
        data: data,
      });
    });
    for (
      let i = diasEjecutados[0].dia;
      i <= diasEjecutados[diasEjecutados.length - 1].dia;
      i++
    ) {
      categories.push(i);
    }
    setResumenMensualDataChart(series);
    setResumenMensualDataChartCategories(categories);
  }
  const OptionsResumenMensualDataChart = {
    colors: [
      "#0080ff",
      "#d35400",
      "#2980b9",
      "#2ecc71",
      "#f1c40f",
      "#2c3e50",
      "#7f8c8d",
      "#cc00ff",
      "#dc3545",
      "#289ba7",
      "#2855a7",
    ],
    chart: {
      type: "area",
      backgroundColor: "#242526",
      style: {
        fontFamily: "Roboto",
        color: "#666666",
      },
    },
    title: {
      text: "RESUMEN ESTADISTICO DE VALORIZACIÓN MENSUAL",
      align: "center",
      style: {
        fontFamily: "Roboto Condensed",
        fontWeight: "bold",
        color: "#666666",
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "#424242",
        color: "#ffffff",
      },
    },
    subtitle: {
      text: "General",
    },
    xAxis: {
      categories: ResumenMensualDataChartCategories,
      tickmarkPlacement: "on",
      title: {
        enabled: false,
      },
    },
    yAxis: {
      title: {
        text: "SOLES",
      },
      labels: {
        formatter: function () {
          return this.value / 1000;
        },
      },
      gridLineColor: "#424242",
      ridLineWidth: 1,
      minorGridLineColor: "#424242",
      inoGridLineWidth: 0.5,
      tickColor: "#424242",
      minorTickColor: "#424242",
      lineColor: "#424242",
    },
    tooltip: {
      split: true,
      valueSuffix: " Soles",
    },
    plotOptions: {
      area: {
        stacking: "normal",
        lineColor: "#666666",
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: "#666666",
        },
      },
    },
    series: ResumenMensualDataChart,
  };
  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={OptionsResumenMensualDataChart}
      />
      <table className="table table-sm small table-hover">
        <thead>
          <tr>
            <th>N°</th>
            <th>NOMBRE 123</th>
            <th>PRESUPUESTO</th>
            <th>AVANCE</th>
            <th>AVANCE%</th>
          </tr>
        </thead>
        <tbody>
          {ResumenMensualData.map((item, i) => (
            <tr key={i}>
              <td>{item.numero}</td>
              <td>{item.nombre}</td>
              <td>{Redondea(item.presupuesto)}</td>

              <td>{Redondea(item.valor, 4)}</td>
              <td>{Redondea((item.valor / item.presupuesto) * 100)}</td>
            </tr>
          ))}
          <tr className="resplandPartida font-weight-bolder">
            <td></td>
            <td></td>
            <td>
              {(() => {
                var presupuesto_total = 0;
                ResumenMensualData.forEach((item) => {
                  presupuesto_total += item.presupuesto;
                });
                return Redondea(presupuesto_total);
              })()}
            </td>

            <td>
              {(() => {
                var valor_total = 0;
                ResumenMensualData.forEach((item) => {
                  valor_total += item.valor;
                });
                return Redondea(valor_total);
              })()}
            </td>
            <td>
              {(() => {
                var valor_total = 0;
                ResumenMensualData.forEach((item) => {
                  valor_total += item.valor / item.presupuesto;
                });
                return Redondea(valor_total * 100);
              })()}
            </td>
          </tr>
        </tbody>
      </table>
      ,
    </>
  );
};

const axios = require("axios");
const { UrlServer } = require("../../Utils/ServerUrlConfig");
const { Redondea } = require("../../Utils/Funciones");

const DataHeaderInforme = (fecha_inicial, fecha_final) => {
  try {
    return axios.post(`${UrlServer}/getInformeDataGeneral`, {
      id_ficha: sessionStorage.getItem("idobra"),
      fecha_inicial: fecha_inicial,
      fecha_final: fecha_final,
    });
  } catch (error) {
    console.error(error);
  }
};

function encabezadoInforme(fecha_inicial, fecha_final) {
  var TblHeader = [];
  DataHeaderInforme(fecha_inicial, fecha_final)
    .then((res) => {
      //console.log('res',res.data)
      TblHeader.push({
        style: "tableExample",
        // color: '#ff0707',
        layout: "noBorders",

        table: {
          widths: [100, 100, 100, 130, 50, "*"],
          body: [
            [
              {
                text: "OBRA",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.g_meta,
                style: "tableBodyInforme",
                alignment: "left",
                colSpan: 5,
              },
              {},
              {},
              {},
              {},
            ],

            [
              {
                text: "MONTO DE LA OBRA",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": S/. " + Redondea(res.data.presupuesto_general),
                style: "tableBodyInforme",
                alignment: "left",
                //colSpan:3
              },
              {
                text: "COSTO DIRECTO",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": S/. " + res.data.costo_directo,
                style: "tableBodyInforme",
                alignment: "left",
              },
              {
                text: "REGION",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.region,
                style: "tableBodyInforme",
                alignment: "left",
              },
            ],

            [
              {
                text: "MES",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.mes,
                style: "tableBodyInforme",
                alignment: "left",
              },
              {
                text: "RESIDENTE DE OBRA",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.residente,
                style: "tableBodyInforme",
                alignment: "left",
              },
              {
                text: "PROVINCIA",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.provincia,
                style: "tableBodyInforme",
                alignment: "left",
              },
            ],

            [
              {
                text: "PLAZO DE EJECUCION",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.plazo_de_ejecucion,
                style: "tableBodyInforme",
                alignment: "left",
              },
              {
                text: `${res.data.cargo_nombre} DE OBRA`,
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.supervisor,
                style: "tableBodyInforme",
                alignment: "left",
              },
              {
                text: "DISTRITO",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.distrito,
                style: "tableBodyInforme",
                alignment: "left",
              },
            ],

            [
              {
                text: "AVANCE FISICO",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + Redondea(res.data.porcentaje_avance_fisico) + " %",
                style: "tableBodyInforme",
                alignment: "left",
              },
              {
                text: "AVANCE ACUMULADO",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text:
                  ": " + Redondea(res.data.porcentaje_avance_acumulado) + " %",
                style: "tableBodyInforme",
                alignment: "left",
              },
              {
                text: "LUGAR",
                style: "TableHeaderInforme",
                alignment: "left",
              },
              {
                text: ": " + res.data.lugar,
                style: "tableBodyInforme",
                alignment: "left",
              },
            ],
          ],
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
  return TblHeader;
}

module.exports = {
  encabezadoInforme,
};

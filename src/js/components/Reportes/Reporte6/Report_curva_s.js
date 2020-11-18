import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody, Row, Col, Button, ButtonGroup, Spinner } from 'reactstrap';
import { FaBlackTie, FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno, ImgDelta } from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'
const { Redondea, mesesShort, meses } = require('../../Utils/Funciones');

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require("highcharts/modules/exporting")(Highcharts);
// var request = require('request').defaults({ encoding: null });

function Report_curva_s() {

  //   function RequestB64(){
  //     request.get('http://tinypng.org/images/example-shrunk-8cadd4c7.png', function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //         data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
  //         console.log("RequestB64",data);
  //     }
  // });
  //   }
  useEffect(() => {
    // ImagenesDB()
    // RequestB64()
  }, []);

  const [ImagenToShow, setImagenToShow] = useState();

  const canvas = useRef(null);
  const ImagenPDF = useRef(null);
  const ImagenPDF2 = useRef(null);

  function GenerateFechaPdf() {
    var n = new Date();
    //Año
    var y = n.getFullYear();
    //Mes
    var m = n.getMonth() + 1;
    //Día
    var d = n.getDate();

    //Lo ordenas a gusto.
    var date = d + "/" + m + "/" + y;
    return date
  }

  async function ImagenToBase64(img) {
    var clearCanvas = false;
    var ctx = canvas.current.getContext('2d');
    ctx.drawImage(img, 0, 0, 700, 700,       // `this` is now image
      0, 0, 900, 900);

    var dataImg = canvas.current.toDataURL();
    // ctx.crossOrigin = '';
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    return dataImg
  }

  //data curva s porcentaje
  async function solesToPorcentajeCurvaS(test) {
    var tempDataObra = await fetchDataObra()
    let cloneDataCurvaS = test.concat()
    cloneDataCurvaS.forEach((item, i) => {
      item.programado_monto = redondeo(item.programado_monto / tempDataObra.costo_directo * 100, 2)
      item.ejecutado_monto = redondeo(item.ejecutado_monto / tempDataObra.costo_directo * 100, 2)
      item.financiero_monto = redondeo(item.financiero_monto / tempDataObra.g_total_presu * 100, 2)
    });
    return cloneDataCurvaS
  }


  function getMesfromDate(date) {
    date = date.split("-")
    return Number(date[1])
  }
  function getAnyofromDate(date) {
    date = date.split("-")
    return Number(date[0])
  }


  function redondeo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }


  //get costo diresto y presupuesto total
  async function fetchDataObra() {
    const request = await axios.post(`${UrlServer}/getDataObra`, {
      id_ficha: sessionStorage.getItem('idobra')
    })
    return request.data
  }


  // Obteniendo imagenes de la base de datos
  const [Imagen1, setImagen1] = useState("");
  const [Imagen2, setImagen2] = useState("");

  async function ImagenesDB() {
    const request = await axios.post(`${UrlServer}/getImagenesCurvaS`, {
      id_ficha: sessionStorage.getItem('idobra')
    })
    // console.log("request.dataaaa", request.data);
    return request.data
  }

  async function createDataChartPorcentaje(dataCurvaS) {
    var tempDataObra = await fetchDataObra()
    var labels = []
    var programado = []
    var ejecutado = []
    var financiero = []

    var programado_acumulado = 0
    var ejecutado_acumulado = 0
    var financiero_acumulado = 0
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var Delta = 0;
    // console.log("Year",year);
    // console.log("month",month);
    var programado_saldo = 0
    var ejecutado_saldo = 0
    var financiero_saldo = 0
    dataCurvaS.forEach((item, i) => {
      if (item.tipo == "PERIODO") {
        //  console.log("MEs",item.fecha_inicial.substr(5,2));
        if (year == item.fecha_inicial.substr(0, 4)  && item.ejecutado_monto != 0 && item.ejecutado_monto != null){
          Delta = (item.ejecutado_monto / item.programado_monto) * 100
          //&& month == item.fecha_inicial.substr(5, 2)
        }
        var label = mesesShort[getMesfromDate(item.fecha_inicial) - 1] + " - " + getAnyofromDate(item.fecha_inicial)
        labels.push(label)
        programado_acumulado += item.programado_monto
        programado.push(redondeo(programado_acumulado / tempDataObra.costo_directo * 100, 2))

        ejecutado_acumulado += item.ejecutado_monto
        ejecutado.push(redondeo(ejecutado_acumulado / tempDataObra.costo_directo * 100, 2))

        financiero_acumulado += item.financiero_monto
        financiero.push(redondeo(financiero_acumulado / tempDataObra.g_total_presu * 100, 2))

        programado_saldo = tempDataObra.costo_directo  - programado_acumulado
        // console.log("programado_saldo",programado_saldo);
        ejecutado_saldo = tempDataObra.costo_directo  - ejecutado_acumulado
        // console.log("ejecutado_saldo",ejecutado_saldo);
        financiero_saldo = tempDataObra.g_total_presu  - financiero_acumulado
        // console.log("financiero_saldo",financiero_saldo);
      }
    })
    //clean ejecutado
    var ejecutado_monto_break = true
    var financiero_monto_break = true
    var programado_monto_break = true
    for (let i = dataCurvaS.length - 1; i > 0; i--) {
      var item = dataCurvaS[i]
      if (ejecutado_monto_break && (item.ejecutado_monto == 0 || item.ejecutado_monto == null)) {
        ejecutado.pop()
      } else {
        ejecutado_monto_break = false
      }
      if (financiero_monto_break && (item.financiero_monto == 0 || item.financiero_monto == null)) {
        financiero.pop()
      } else {
        financiero_monto_break = false
      }
      if (programado_monto_break && (item.programado_monto == 0 || item.programado_monto == null)) {
        programado.pop()
      } else {
        programado_monto_break = false
      }
    }
    // console.log("Delta",Delta);
    return {
      programado_acumulado,
      ejecutado_acumulado,
      financiero_acumulado,
      Delta,
      programado_saldo,
      ejecutado_saldo,
      financiero_saldo,
      labels: labels,
      datasets: [
        {
          name: 'PROGRAMADO',
          data: programado,
          // backgroundColor: "#0080ff",
          color: "#0080ff",
          // fill: false,
        }
        ,
        {
          name: 'EJECUTADO',
          data: ejecutado,
          // backgroundColor: "#fd7e14",
          color: "#fd7e14",
          // fill: false,
        }
        ,
        {
          name: 'FINANCIERO',
          data: financiero,
          // backgroundColor: "#ffc107",
          color: "#ffc107",
          // fill: false,
        }
      ]
    };
  }

  async function Cabezera(fecha_inicial, fecha_final) {
    var request = await axios.post(`${UrlServer}/getInformeDataGeneral`, {
      "id_ficha": sessionStorage.getItem("idobra"),
      "fecha_inicial": fecha_inicial,
      "fecha_final": fecha_final,
    })
    return {
      style: 'tableExample',
      // color: '#ff0707',
      layout: 'noBorders',
      table: {
        widths: [80, 'auto', 80, 'auto', 40, 'auto'],
        body: [
          [
            {
              text: 'OBRA',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.g_meta,
              style: 'tableBodyInforme',
              alignment: 'left',
              colSpan: 5
            },
            {

            },
            {

            },
            {

            },
            {

            }
          ],

          [
            {
              text: 'MONTO DE LA OBRA',
              style: 'TableHeaderInforme',
              alignment: 'left',
            },
            {
              text: ': S/. ' + Redondea(request.data.presupuesto_general),
              style: 'tableBodyInforme',
              alignment: 'left',
              //colSpan:3
            },
            {
              text: 'COSTO DIRECTO',
              style: 'TableHeaderInforme',
              alignment: 'left',
            },
            {
              text: ': S/. ' + request.data.costo_directo,
              style: 'tableBodyInforme',
              alignment: 'left',
            },
            {
              text: 'REGION',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.region,
              style: 'tableBodyInforme',
              alignment: 'left'
            }
          ],

          [
            {
              text: 'MES',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.mes,
              style: 'tableBodyInforme',
              alignment: 'left'
            },
            {
              text: 'RESIDENTE DE OBRA',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.residente,
              style: 'tableBodyInforme',
              alignment: 'left'
            },
            {
              text: 'PROVINCIA',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.provincia,
              style: 'tableBodyInforme',
              alignment: 'left'
            }
          ],

          [
            {
              text: 'PLAZO DE EJECUCION',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.plazo_de_ejecucion,
              style: 'tableBodyInforme',
              alignment: 'left'
            },
            {
              text: 'SUPERVISOR DE OBRA',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.supervisor,
              style: 'tableBodyInforme',
              alignment: 'left'
            },
            {
              text: 'DISTRITO',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.distrito,
              style: 'tableBodyInforme',
              alignment: 'left'
            }
          ],

          [
            {
              text: 'AVANCE FISICO',
              style: 'TableHeaderInforme',
              alignment: 'left',
              // border: [false, false, true, true],
            },
            {
              text: ': ' + Redondea(request.data.porcentaje_avance_fisico) + ' %',
              style: 'tableBodyInforme',
              alignment: 'left'
            },
            {
              text: 'AVANCE ACUMULADO',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.porcentaje_avance_acumulado + ' %',
              style: 'tableBodyInforme',
              alignment: 'left'
            },
            {
              text: 'LUGAR',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.lugar,
              style: 'tableBodyInforme',
              alignment: 'left'
            }
          ]

        ]
      }
    }

  }


  async function getDataChart() {
    // console.log("getDataChart");

    var request = await axios.post(`${UrlServer}/getDataCurvaS`, {
      "id_ficha": sessionStorage.getItem("idobra"),

    })
    return request.data
    // console.log("request.data", request.data);

  }


  // HOOKS Declara una nueva variable de estado, la cual llamaremos “count”
  const [DataChart, setDataChart] = useState([]);
  const [DataChartCategories, setDataChartCategories] = useState([]);
  const chartRef = useRef(null);

  const options = {
    chart: {
      // type: 'area',
      // "backgroundColor": "#242526",
      "style": {
        "fontFamily": "Roboto",
        "color": "#666666"
      }
    },
    title: {
      text: 'CURVA S',
      "align": "center",
      "style": {
        "fontFamily": "Roboto Condensed",
        "fontWeight": "bold",
        "fontSize": "12px",
        "color": "#666666"
      }
    },

    subtitle: {
      text: sessionStorage.getItem('codigoObra'),
      "style": {
        // "fontFamily": "Roboto Condensed",
        // "fontWeight": "bold",
        "fontSize": "12px",
        // "color": "#666666"
      }
    },
    legend: {
      // layout: 'vertical',
      "align": "center",
      "verticalAlign": "bottom",
    },
    tooltip: {
      split: true,
      valueSuffix: ' %'
    },
    xAxis: {
      categories: DataChartCategories,
      tickmarkPlacement: 'on',
      title: {
        enabled: false
      }
    },
    yAxis: {
      title: {
        text: 'PORCENTAJES'
      },
      labels: {
        formatter: function () {
          return this.value / 1000;
        },

      },
      "gridLineColor": "#424242",
      "ridLineWidth": 1,
      "minorGridLineColor": "#424242",
      "inoGridLineWidth": 0.5,
      "tickColor": "#424242",
      "minorTickColor": "#424242",
      "lineColor": "#424242"
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          // color: 'white',
          style: {
            textOutline: false,
            fontSize: 7
          },

        },
      }
    },
    series: DataChart
  }
  async function generatePdf() {
    // var ImagenBase64 = await ImagenToBase64(ImagenPDF.current)
    // var ImagenBase64_2 = await ImagenToBase64(ImagenPDF2.current)
    // // console.log("ImagenBase64", ImagenBase64);
    // console.log("ImagenBase64_2", ImagenBase64_2);

    //conseguir informacion de la cabezera

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    var fecha_inicial = firstDay.toISOString().substr(0, 10);
    var fecha_final = lastDay.toISOString().substr(0, 10);
    var cabezera2 = await Cabezera(fecha_inicial, fecha_final);
    // console.log("cabezera2", cabezera2);

    // conseguir la data del CHART

    var dataChartTable = await getDataChart()
    // console.log("dataChart", dataChartTable);

    // Se genera la data del CHART

    var temp = await createDataChartPorcentaje(dataChartTable)
    // console.log("temp", temp);
    var dataChart = temp.datasets
    var categories = temp.labels

    setDataChart(dataChart)
    setDataChartCategories(categories)

    //Data procesada a porcentajes
    var dataChartTablePorcentajes = await solesToPorcentajeCurvaS(dataChartTable)
    // console.log("dataChartTablePorcentajes", dataChartTablePorcentajes);

    var ListaTablas = []
    var ListaTemporal = []
    var AnyoActual = dataChartTablePorcentajes[0].fecha_inicial.substr(0, 4)

    for (let i = 0; i < dataChartTablePorcentajes.length; i++) {
      const element = dataChartTablePorcentajes[i];
      // console.log("element.anyo", element.fecha_inicial.substr(0, 4));

      //Aqui se cumple una condicion
      if (AnyoActual != element.fecha_inicial.substr(0, 4)) {
        ListaTablas.push(ListaTemporal)
        ListaTemporal = []
        ListaTemporal.push(element)
        AnyoActual = element.fecha_inicial.substr(0, 4)
      } else {
        ListaTemporal.push(element)
      }
    }
    ListaTablas.push(ListaTemporal)
    // console.log("ListaTablas", ListaTablas);

    var DatosCurvaTotal = []

    for (let i = 0; i < ListaTablas.length; i++) {
      const Lista = ListaTablas[i];
      var widths = [34]
      var mes_data = [{
        text: 'MES',
        style: "TableMontosInforme",
        alignment: "center",
        fontSize: 5,

      }]
      var programado = [{ text: 'PROGRAMADO', color: "#17202A", fontSize: 5 }]
      var ejecutado = [{ text: 'EJECUTADO', color: "#17202A", fontSize: 5 }]
      var financiero = [{ text: 'FINANCIERO', color: "#17202A", fontSize: 5 }]

      for (let j = 0; j < Lista.length; j++) {
        const element = Lista[j];
        // console.log("element",element);
        widths.push(25)

        mes_data.push(
          {
            text: mesesShort[getMesfromDate(element.fecha_inicial) - 1] + "-" + getAnyofromDate(element.fecha_inicial),
            style: "TableMontosInforme",
            alignment: "left",
            fontSize: 5,
            // tocItem: true,
            //  margin: [-20, 0, 0, 0]
          }
        )
        programado.push({ text: element.programado_monto + '%', color: "#17202A ", fontSize: 5, margin: [0, 0, 0, 0] },)
        ejecutado.push({ text: element.ejecutado_monto + '%', color: "#273746  ", fontSize: 5, margin: [0, 0, 0, 0] },)
        financiero.push({ text: element.financiero_monto + '%', color: "#566573 ", fontSize: 5, margin: [0, 0, 0, 0] },)
        // console.log("Lista",Lista);

      }
      // Inpresion de la data
      var today = new Date();
      var year = today.getFullYear();
      // console.log("Lista",Lista[0].fecha_inicial.substr(0, 4));
      if (year == Lista[0].fecha_inicial.substr(0, 4) || year - 1 == Lista[0].fecha_inicial.substr(0, 4) || year + 1 == Lista[0].fecha_inicial.substr(0, 4)) {
        // console.log("Año ingresado",Lista[0].fecha_inicial.substr(0, 4));
        DatosCurvaTotal.push(
          {
            style: 'tableExample',
            margin: [0, 1, 0, 0],
            layout: 'lightHorizontalLines',
            table: {
              widths: widths,
              body: [
                mes_data,
                programado,
                ejecutado,
                financiero,
              ]
            }
          }
        )
      }


    }

    // console.log("DatosCurvaTotal", DatosCurvaTotal);

    //consigues el SVG del CHART generado

    // console.log("chartRef", chartRef);
    var svg = chartRef.current.chart.getSVG();

    //Se consigue el link de las imagenes
    var Imagenes_en_base_64 = await ImagenesDB()
    var imagenesParaPdf = [
      {
        columns: [
          {
            image: Imagenes_en_base_64[0].imgb64,
            fit: [245, 245],
            margin: [0, 0, 0, 0],
            alignment: "center",
          },
          {
            // alignment: 'right',
            image: Imagenes_en_base_64[1].imgb64,
            fit: [245, 245],
            // width: 48,
            // height: 30,
            margin: [10, 0, 0, 0],
            alignment: "center",

          }
        ],

      },
    ]
    var DescripcionImagenesParaPdf = [
      {
        columns: [
          {
            text: Imagenes_en_base_64[0].descripcion,
            margin: [0, 5, 10, 0],
            alignment: 'justify',
            fontSize: 6.5,
          },
          {
            text: Imagenes_en_base_64[1].descripcion,
            margin: [10, 5, 0, 0],
            alignment: 'justify',
            fontSize: 6.5,
          }
        ],

      },
    ]

    //Aqui se genera el PDF

    var dd = {

      header: {

        columns: [
          {
            image: logoGRPuno,
            fit: [280, 280],
            margin: [45, 4, 10, 0]
          },
          {
            alignment: 'right',
            image: logoSigobras,
            width: 48,
            height: 30,
            margin: [20, 4, 10, 0]

          }
        ]
      },

      footer: {
        text: 'fecha de reporte : ' + GenerateFechaPdf(),
        alignment: 'right',
        italics: true,
        margin: [20, 10, 10, 0],
        fontSize: 6.5,
      },
      content: [
        cabezera2,
        {
          margin: [0, -28, 0, -15],
          table: {
            widths: ['*'],
            body: [[" "], [" "]]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 0 : 1;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
          }
        },
        {
          svg: svg,
          // width: 550,
          // height: 350,
          fit: [558, 333],
          alignment: 'center',
        },
        // Ejecutado / Programado *100
        {
          style: 'tableExample',
          // layout: 'noBorders',
          italics: true,
          margin:[0,-10,0,10],
          table: {
            body: [
              [
                {
                  text: "S/."+Redondea(temp.programado_acumulado) + "\nPROGRAMADO ACUMULADO",
                  alignment: 'center',
                  fontSize: 5,
                  // margin: [0, 0, 0, -10],
                },
                {
                  text: "S/."+Redondea(temp.ejecutado_acumulado) +"\nEJECUTADO ACUMULADO",
                  alignment: 'center',
                  fontSize: 5,
                  // margin: [0, 0, 0, -10],
                },
                {
                  text: "S/."+Redondea(temp.financiero_acumulado) +"\nFINANCIERO ACUMULADO",
                  alignment: 'center',
                  fontSize: 5,
                  // margin: [0, 0, 0, -10],
                },
                {
                  image: ImgDelta, width: 15, height: 15,
                  alignment: 'center',
                  // margin: [0, -10, 0, 0],
                  border: [false, false, false, false],
                },
                {
                  text: ' = ' + Redondea(temp.Delta) + "%", alignment: 'justify',
                  rowSpan: 2,
                  border: [false, false, false, false],
                }
              ],
              [
                {
                  text: "S/."+Redondea(temp.programado_saldo) + "\nPROGRAMADO SALDO",
                  fontSize: 5,
                  alignment: 'center',
                  // margin: [0, -10, 0, 0],
                },
                {
                  text: "S/."+Redondea(temp.ejecutado_saldo) + "\nEJECUTADO SALDO",
                  fontSize: 5,
                  alignment: 'center',
                },
                {
                  text: "S/."+Redondea(temp.financiero_saldo) + "\nFINANCIERO SALDO",
                  fontSize: 5,
                  alignment: 'center',
                },
                {
                  text: meses[new Date().getMonth()],
                  alignment: 'center',
                  // margin: [0, -8, 0, -1], 
                  fontSize: 9,
                  border: [false, false, false, false],

                },
                {
                  text: ''
                },
              ]
            ]
          }
        },
        {
          margin: [0, -30, 0, -18],
          table: {
            widths: ['*'],
            body: [[" "], [" "]]

          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 0 : 1;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
          }
        },
      ].concat(DatosCurvaTotal, {
        margin: [0, -17, 0, -16],
        table: {
          widths: ['*'],
          body: [[" "], [" "]]

        },
        layout: {
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 0 : 1;
          },
          vLineWidth: function (i, node) {
            return 0;
          },
        }
      }, imagenesParaPdf, DescripcionImagenesParaPdf),


      styles: {
        header: {
          fontSize: 7,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        subheader: {
          fontSize: 10,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 8.5,
          color: '#000000',
          fillColor: '#8baedb',
        },
        tableFecha: {
          bold: true,
          fontSize: 9,
          color: '#000000',
          fillColor: '#edf1f4',
        },
        tableBody: {
          // bold: true,
          fontSize: 6,
          color: '#000000',
          // fillColor: '#f6f6ff',
        },
        TableHeaderInforme: {
          bold: true,
          fontSize: 7,
          color: '#000000',
          margin: [0, 0, 0, 0],
          // fillColor: '#ffcf96',
        },
        TableMontosInforme: {
          bold: true,
          fontSize: 9,
          color: '#FFFFFF',
          fillColor: '#3a68af',
        },
        tableBodyInforme: {
          fontSize: 7,
          color: '#000000',
        },
        tableFechaContent: {
          bold: true,
          fontSize: 10,
          color: '#000000',
          fillColor: '#8baedb',
        },


      },

      pageSize: 'A4',
      // pageOrientation: 'portrait'
      // pageOrientation: 'landscape',

    };

    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    var pdfDocGenerator = pdfmake.createPdf(dd);
    pdfDocGenerator.open()


  }

  return (
    <div >
      <li className="lii">
        <a href="#"
          onClick={() => generatePdf()}
        ><FaFilePdf className="text-danger" /> Curva S ✔</a>
      </li>
      <div
        style={{ display: 'none' }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>

      {/* <canvas ref={canvas} width={200} height={200} style={{ display: 'none' }} > </canvas>

      <img
        style={{ display: 'none' }} 
        ref={ImagenPDF}
        // { useCORS:true}
        src={`${UrlServer}${Imagen1}`} />

      <img
        style={{ display: 'none' }} 
        ref={ImagenPDF2}
        src={`${UrlServer}${Imagen2}`} crossOrigin="anonymous"/> */}
    </div>
  );
}

export default Report_curva_s;
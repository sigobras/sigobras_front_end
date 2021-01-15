import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { FaFilePdf } from "react-icons/fa";

import { logoSigobras, logoGRPuno, ImgDelta } from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'
const { Redondea, mesesShort, meses } = require('../../Utils/Funciones');

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require("highcharts/modules/exporting")(Highcharts);
// var request = require('request').defaults({ encoding: null });

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from "react-toastify";

function Report_curva_s() {



  function FechaLarga(fecha) {
    var fechaTemp = fecha.split('-')
    var ShortDate = new Date(fechaTemp[0], fechaTemp[1] - 1, [fechaTemp[2]]);
    var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: "long" };
    return ShortDate.toLocaleDateString("es-ES", options)
  }

  const [Loading, setLoading] = useState(false);
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  const classes = useStyles();

  useEffect(() => {

  }, []);

  const [] = useState();

  const canvas = useRef(null);

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
  async function ImagenToBase64(url) {
    var urlFinal = UrlServer + url;
    let image = await axios.get(urlFinal,
      {
        responseType: 'arraybuffer',
      });

    // raw[0] = Buffer.from(image.data, 'binary').toString('base64');
    var raw = Buffer.from(image.data).toString('base64');
    var imgb64 = "data:" + image.headers["content-type"] + ";base64," + raw;
    return imgb64;
    // console.log(imagenBase64);
  }

  //data curva s porcentaje
  async function solesToPorcentajeCurvaS(test) {
    var tempDataObra = await fetchDataObra()
    let cloneDataCurvaS = test.concat()
    cloneDataCurvaS.forEach((item) => {
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
    setLoading(true);
    // console.log("request", request);

    return request.data
  }

  // Obtenemos la data del ultimo deia de metrado
  async function fetchUltimoDiaMetrado() {
    const request = await axios.post(`${UrlServer}/getUltimoDiaMetrado`, {
      id_ficha: sessionStorage.getItem('idobra')
    })
    // console.log("requestULtimo dia metrado", request.data);
    return request.data

  }
  // async function test() {
  //   const request = await axios.post(`${UrlServer}/getFisicoComponente`, {
  //     "id_componente": 1259
  //   })
  //   console.log("Data", request.data);
  //   return request.data
  // }

  // obenemos la data de los compomnetes
  async function fetchComponentes() {
    const request = await axios.post(`${UrlServer}/getComponentes`, {
      id_ficha: sessionStorage.getItem('idobra')
    })
    // console.log("request get compomentes", request.data);
    var CompomentesRecibidos = request.data

    // Obtenemos la data de los compomnetes fisicos
    for (let i = 0; i < CompomentesRecibidos.length; i++) {
      const element = CompomentesRecibidos[i];

      const request2 = await axios.post(`${UrlServer}/getFisicoComponente`, {
        "id_componente": element.id_componente
      })
      element.avance = request2.data.avance
      // console.log("request Fisico Compomente", element.avance);
    }
    // console.log("Compomentes...", CompomentesRecibidos);
    return CompomentesRecibidos
  }


  // Obteniendo imagenes de la base de datos
  const [] = useState("");
  const [] = useState("");
  const [] = useState(false);

  async function ImagenesDB() {
    try {
      const request = await axios.post(`${UrlServer}/getImagenesCurvaS`, {
        id_ficha: sessionStorage.getItem('idobra'),
        cantidad: 8,
      })
      // console.log("request.dataaaa", request);
      return request.data
    } catch (error) {
      setLoading(false)
      toast.error("❌ No hay imagenes registradas ")
      // alert("No hay imagenes registradas")
    }
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
    var Delta = 0;
    // console.log("Year",year);
    // console.log("month",month);
    var programado_saldo = 0
    var ejecutado_saldo = 0
    var financiero_saldo = 0
    dataCurvaS.forEach((item) => {
      if (item.tipo == "PERIODO") {
        //  console.log("MEs",item.fecha_inicial.substr(5,2));
        if (year == item.fecha_inicial.substr(0, 4) && item.ejecutado_monto != 0 && item.ejecutado_monto != null) {
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

        programado_saldo = tempDataObra.costo_directo - programado_acumulado
        // console.log("programado_saldo",programado_saldo);
        ejecutado_saldo = tempDataObra.costo_directo - ejecutado_acumulado
        // console.log("ejecutado_saldo",ejecutado_saldo);
        financiero_saldo = tempDataObra.g_total_presu - financiero_acumulado
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
    var res = await axios.post(`${UrlServer}/getFinanciero`, {
      "id_ficha": sessionStorage.getItem("idobra"),
    })
    console.log(res.data);
    return {
      style: 'tableExample',
      // color: '#ff0707',
      layout: 'noBorders',
      table: {
        widths: [80, 'auto', 80, 'auto', 50, 'auto'],
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
              text: 'AVANCE FISICO ACTUAL',
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
              text: 'AVANCE FISICO ACUMULADO',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + request.data.porcentaje_avance_acumulado + ' %',
              style: 'tableBodyInforme',
              alignment: 'left'
            },
            {
              text: 'AVANCE FINANCIERO ACUMULADO',
              style: 'TableHeaderInforme',
              alignment: 'left'
            },
            {
              text: ': ' + Redondea(res.data.financiero_avance_porcentaje) + "%",
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
    // console.log("request.dataaaaaaaaaa", request.data);
    return request.data
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

    if (dataChartTablePorcentajes.length != 0) {

      var AnyoActual = dataChartTablePorcentajes[0].fecha_inicial.substr(0, 4)

      for (let i = 0; i < dataChartTablePorcentajes.length; i++) {
        const element = dataChartTablePorcentajes[i];
        console.log("element.anyo", element);
        if (element.tipo == "PERIODO") {
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
      }
      ListaTablas.push(ListaTemporal)
      // console.log("ListaTablas", ListaTablas);
    }

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

    //SE guarda el ultimo dia de metrado
    var UltimoDiaMetrado = await fetchUltimoDiaMetrado()
    // console.log("UltimoDiaMetrado",UltimoDiaMetrado);

    // Guardamos compomentes en  una variable temporal
    var ComponentesPdf = await fetchComponentes()
    // console.log("CompomentesPdf", ComponentesPdf);
    // console.log("CompomentesPdf.numero", ComponentesPdf[0].numero);

    //Se consigue el link de las imagenes
    var Imagenes_en_base_64 = await ImagenesDB()
    for (let i = 0; i < Imagenes_en_base_64.length; i++) {
      const element = Imagenes_en_base_64[i];
      Imagenes_en_base_64[i].ImagenB64 = await ImagenToBase64(element.imagen)
    }
    // console.log("Imagenes_en_base_64", Imagenes_en_base_64);

    // ---------------------------> Tabla Compomentes
    var body = [
      [{text:'N°',fontSize: 7,style: "TableMontosInforme",}, {text:'Componente',fontSize: 7,style: "TableMontosInforme",}, {text:'Presupuesto CD',fontSize: 7,style: "TableMontosInforme",},{text:'Ejecucion Fisica',fontSize: 7,style: "TableMontosInforme",}, {text:'% de avance',fontSize: 7,style: "TableMontosInforme",}]
    ]
    for (let i = 0; i < ComponentesPdf.length; i++) {
      const element = ComponentesPdf[i];
      body.push(
        [
          {text:ComponentesPdf[i].numero, fontSize: 6.5,},
          {text:ComponentesPdf[i].nombre, fontSize: 6.5,},
          {text:Redondea(ComponentesPdf[i].presupuesto), fontSize: 6.5,},
          {text:Redondea(ComponentesPdf[i].avance), fontSize: 6.5,},
          {text:Redondea((ComponentesPdf[i].avance /ComponentesPdf[i].presupuesto)*100) + " %", fontSize: 6.5,}
        ]
      )
    }

    var TablaCompomentes = [
      {
        style: 'tableExample',
        layout: 'lightHorizontalLines',
        pageBreak: 'after',
        table: {
          body: body
        }
      }
    ]

    //Imagenes
    // var imagenesParaPdf = ""
    // var DescripcionImagenesParaPdf = []
    // var DescripcionPartida = []
    // if (Imagenes_en_base_64.length) {
    //   // console.log("Procesando imagenes");
    //   DescripcionPartida = [
    //     {
    //       columns: [
    //         {
    //           text: Imagenes_en_base_64[0].item + '/ ' + Imagenes_en_base_64[0].partida_descripcion,
    //           // fit: [220, 220],
    //           // width: 250,
    //           // height: 160,
    //           // margin: [1, 0, 0, 0],
    //           alignment: "left",
    //           fontSize: 5.9,
    //         },
    //         Imagenes_en_base_64[1] &&
    //         {
    //           // alignment: 'right',
    //           text: Imagenes_en_base_64[1].item + '/ ' + Imagenes_en_base_64[1].partida_descripcion,
    //           // fit: [220, 220],
    //           // width: 250,
    //           // height: 160,
    //           margin: [8, 0, 0, 0],
    //           // alignment: "left",
    //           fontSize: 5.9,

    //         }
    //       ],
    //     },
    //   ]
    //   imagenesParaPdf = [

    //       columns: [
    //         {
    //           image: Imagenes_en_base_64[0].ImagenB64,
    //           // fit: [220, 220],
    //           width: 250,
    //           height: 150,
    //           margin: [1, 0, 0, 0],
    //           // alignment: "center",
    //         },
    //         Imagenes_en_base_64[1] &&
    //         {
    //           // alignment: 'right',
    //           image: Imagenes_en_base_64[1].ImagenB64,
    //           // fit: [220, 220],
    //           width: 250,
    //           height: 150,
    //           margin: [0, 0, -16, 0],
    //           alignment: "center",

    //         }
    //       ],
    //     },
    //   ]
    //   DescripcionImagenesParaPdf = [
    //     {
    //       style: 'tableExample',
    //       layout: 'noBorders',
    //       table: {
    //         widths: ['*', '*'],
    //         body: [
    //           [
    //             {
    //               text: Imagenes_en_base_64[0].descripcion,
    //               // noWrap: true,
    //               // margin: [0, -7, 0, 0], Con tabla
    //               margin: [0, -5, 0, 0],
    //               alignment: 'justify',
    //               fontSize: 5.9,
    //               colSpan: Imagenes_en_base_64[1] ? 1 : 2
    //             },
    //             Imagenes_en_base_64[1] &&
    //             {
    //               text: Imagenes_en_base_64[1].descripcion,
    //               // noWrap: true,
    //               // margin: [5, -7, 0, 0], Con tabla
    //               margin: [5, -5, 0, 0],
    //               alignment: 'justify',
    //               fontSize: 5.9,
    //             },
    //           ],
    //           [
    //             {
    //               text: Imagenes_en_base_64[0].fecha,
    //               // noWrap: true,
    //               // margin: [0, -5, 0, 0], COn tabla
    //               margin: [0, -5, 0, 0],
    //               alignment: 'justify',
    //               fontSize: 5.9,
    //               colSpan: Imagenes_en_base_64[1] ? 1 : 2
    //             },
    //             Imagenes_en_base_64[1] &&
    //             {
    //               text: Imagenes_en_base_64[1].fecha,
    //               // noWrap: true,
    //               // margin: [5, -5, 0, 0], COn tabla
    //               margin: [5, -5, 0, 0],
    //               alignment: 'justify',
    //               fontSize: 5.9,
    //               pageBreak: 'after',
    //             },
    //           ],
    //         ]
    //       }
    //     },
    //   ]
    // }

    var body = [
      Imagenes_en_base_64.length > 2 &&
      [
        {
          text: "PANEL FOTOGRAFICO DEL AVANCE DE OBRA",
          border: [false, false, false, false],
          colSpan: 3,
          alignment: 'center',
          margin: [0, 0, 0, 0],
        },
        {

        },
        {

        }
      ]
    ]
    for (let i = 2; i < Imagenes_en_base_64.length; i += 2) {
      const element = Imagenes_en_base_64[i];
      const element2 = Imagenes_en_base_64[i + 1];
      body.push(
        [
          {
            image: element.ImagenB64,
            // noWrap: true,
            // margin: [0, -7, 0, 0], Con tabla
            margin: [0, 0, 0, 0],
            alignment: 'justify',
            // fit: [250, 160],
            width: 250,
            height: 180,
          },
          {
            text: "",
            border: [true, false, element2 ? true : false, false],
            // margin: [5,0,-15,0],
          },
          element2 ?
            {
              // image: Imagenes_en_base_64[1].imgb64,
              image: element2.ImagenB64,
              // noWrap: true,
              // margin: [5, -7, 0, 0], Con tabla
              margin: [5, 0, 0, 0],
              alignment: 'justify',
              // fit: [250, 160],
              width: 250,
              height: 180,
            } :
            {
              text: "",
              border: [false, false, false, false],
            },
        ],
      )
      body.push(
        [
          {
            text: element.item + " - " + element.partida_descripcion + " DESC: " + element.descripcion + " " + element.fecha,
            alignment: 'justify',
            fontSize: 6.5,
          },
          {
            text: "",
            border: [true, false, element2 ? true : false, false],
            // margin: [5,0,-15,0],
          },
          element2 ?
            {
              text: element2.item + " - " + element2.partida_descripcion + " DESC: " + element2.descripcion + " " + element2.fecha,
              alignment: 'justify',
              fontSize: 6.5,
            } :
            {
              text: "",
              border: [false, false, false, false],
            },
        ]
      )
      body.push(
        [
          {
            text: " ",
            colSpan: 3,
            border: [false, false, false, false],
            margin: [0, -10, 0, -10],
          },
          {

          },
          {

          },
        ]
      )
    }
    var SegundoEsquemaImagenes = [
      {
        style: 'tableExample',
        // layout: 'noBorders',
        pageMargins: [0, 0, 0, 0],

        table: {
          widths: ['*', 'auto', '*'],
          body: body
        }
      },
    ]
    // console.log("Imagenes_en_base_64", Imagenes_en_base_64);



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
            vLineWidth: function () {
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
          margin: [0, -10, 0, 10],
          table: {
            body: [
              [
                {
                  text: "S/." + Redondea(temp.programado_acumulado) + "\nPROGRAMADO ACUMULADO",
                  alignment: 'center',
                  fontSize: 5,
                  // margin: [0, 0, 0, -10],
                },
                {
                  text: "S/." + Redondea(temp.ejecutado_acumulado) + "\nEJECUTADO ACUMULADO",
                  alignment: 'center',
                  fontSize: 5,
                  // margin: [0, 0, 0, -10],
                },
                {
                  text: "S/." + Redondea(temp.financiero_acumulado) + "\nFINANCIERO ACUMULADO",
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
                },
                {
                  text: "UDM: " + FechaLarga(UltimoDiaMetrado.fecha),
                  rowSpan: 2,
                  border: [false, false, false, false],
                  fontSize: 8,
                  alignment: 'center',
                }
              ],
              [
                {
                  text: "S/." + Redondea(temp.programado_saldo) + "\nPROGRAMADO SALDO",
                  fontSize: 5,
                  alignment: 'center',
                  // margin: [0, -10, 0, 0],
                },
                {
                  text: "S/." + Redondea(temp.ejecutado_saldo) + "\nEJECUTADO SALDO",
                  fontSize: 5,
                  alignment: 'center',
                },
                {
                  text: "S/." + Redondea(temp.financiero_saldo) + "\nFINANCIERO SALDO",
                  fontSize: 5,
                  alignment: 'center',
                },
                {
                  text: meses[new Date().getMonth() - 1],
                  alignment: 'center',
                  // margin: [0, -8, 0, -1],
                  fontSize: 9,
                  border: [false, false, false, false],

                },
                {
                  text: ''
                },
                {
                  text: ""
                },
              ]
            ]
          }
        },
        {
          margin: [0, -28, 0, -18],
          table: {
            widths: ['*'],
            body: [[" "], [" "]]

          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 0 : 1;
            },
            vLineWidth: function () {
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
          vLineWidth: function () {
            return 0;
          },
        }
      }
        // , Imagenes_en_base_64 ? DescripcionPartida : " "
        // , Imagenes_en_base_64 ? imagenesParaPdf : " "
        // , Imagenes_en_base_64 ? DescripcionImagenesParaPdf : " "
        , TablaCompomentes
        , SegundoEsquemaImagenes
      ),


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

    var pdfDocGenerator = await pdfmake.createPdf(dd);
    var win = window.open('', '_blank');
    (pdfDocGenerator).open({}, win);
    // (pdfDocGenerator as any).open({}, win);
    // pdfDocGenerator.open()
    setLoading(false);

  }

  return (
    <div >

      {/* <Container> */}
      <li className="lii">
        <div className="d-flex"
          style={{
            alignItems: "center",
          }}
        >
          <a href="#"
            onClick={() => generatePdf()}
          ><FaFilePdf className="text-danger" /> Curva S ✔</a>
          {Loading && <Backdrop className={classes.backdrop} open>
            <CircularProgress color="inherit" />
          </Backdrop>}
        </div>
      </li>
      {/* </Container> */}



      <div
        style={{ display: 'none' }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>

    </div>
  );
}

export default Report_curva_s;
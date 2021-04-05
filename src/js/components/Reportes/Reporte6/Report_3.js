import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";

import * as pdfmake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ButtonGroup,
  Button,
  Row,
  Col,
} from "reactstrap";

import { encabezadoInforme } from "../Complementos/HeaderInformes";
import { logoSigobras, logoGRPuno } from "../Complementos/ImgB64";

import { UrlServer } from "../../Utils/ServerUrlConfig";

import { Redondea } from "../../Utils/Funciones";

// import Button from '@material-ui/core/Button';

export default () => {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      fetchAnyos();
    }
    setModal(!modal);
  };
  //Anyos
  const [Anyos, setAnyos] = useState([]);
  async function fetchAnyos() {
    const res = await axios.post(`${UrlServer}/getValGeneralAnyos2`, {
      id_ficha: sessionStorage.getItem("idobra"),
    });
    // console.log("anyos", res.data);
    setAnyos(res.data);
    setAnyoSeleccionado(res.data[res.data.length - 1].anyo);
  }
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0);
  //periodos
  const [Periodos, setPeriodos] = useState([]);
  async function fetchPeriodos() {
    const res = await axios.post(`${UrlServer}/getValGeneralPeriodos`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: AnyoSeleccionado,
    });
    // console.log("Periodos", res.data);
    setPeriodos(res.data);
  }
  const [PeriodoSeleccionado, setPeriodoSeleccionado] = useState(0);

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
    console.log("ResumenComponentes", res.data);
    setResumenComponentes(res.data);
    var presupuesto = res.data.reduce((acc, item) => acc + item.presupuesto, 0);
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
  //costos indirectos
  const [CostosIndirectos, setCostosIndirectos] = useState([]);
  const [CostosIndirectosTotales, setCostosIndirectosTotales] = useState({});
  async function fetchCostosIndirectos() {
    var res = await axios.post(`${UrlServer}/getCostosIndirectos`, {
      fichas_id_ficha: sessionStorage.getItem("idobra"),
      fecha_inicial: PeriodoSeleccionado.fecha_inicial,
      fecha_final: PeriodoSeleccionado.fecha_final,
    });
    console.log("CostosIndirectos", res.data);
    setCostosIndirectos(res.data);
    var presupuesto = 0;
    var valor_anterior = 0;
    var valor_actual = 0;
    var valor_total = 0;
    var valor_saldo = 0;
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      presupuesto += parseFloat(element.monto);
      valor_anterior +=
        (element.monto *
          parseFloat(ResumenComponentesTotales.porcentaje_anterior).toFixed(
            2
          )) /
        100;
      valor_actual +=
        (element.monto *
          parseFloat(ResumenComponentesTotales.porcentaje_actual).toFixed(2)) /
        100;
      valor_total +=
        (element.monto *
          parseFloat(ResumenComponentesTotales.porcentaje_total).toFixed(2)) /
        100;
      valor_saldo +=
        (element.monto *
          parseFloat(ResumenComponentesTotales.porcentaje_saldo).toFixed(2)) /
        100;
    }
    setCostosIndirectosTotales({
      presupuesto,
      valor_anterior,
      valor_actual,
      valor_total,
      valor_saldo,
    });
  }
  // const [Encabezado, setEncabezado] = useState({})
  async function fetchEncabezado() {
    var res = await axios.post(`${UrlServer}/getInformeDataGeneral`, {
      id_ficha: sessionStorage.getItem("idobra"),
      fecha_inicial: PeriodoSeleccionado.fecha_inicial,
      fecha_final: PeriodoSeleccionado.fecha_final,
    });
    var TblHeader = [
      {
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
                text: ": S/. " + Redondea(res.data.costo_directo),
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
      },
    ];
    console.log("TblHeader", TblHeader);
    // setEncabezado(TblHeader)
    return TblHeader;
  }
  useEffect(() => {
    if (AnyoSeleccionado != 0) {
      fetchPeriodos();
    }
  }, [AnyoSeleccionado]);
  useEffect(() => {
    if (PeriodoSeleccionado != 0) {
      fetchResumenComponentes();
      fetchCostosIndirectos();
    }
  }, [PeriodoSeleccionado]);
  useEffect(() => {
    fetchCostosIndirectos();
  }, [ResumenComponentesTotales]);
  async function ResEstructarData() {
    // var { DataEncabezado } = this.state
    // var DataHist = this.state.DataApiResumenVal
    // var costosIndirectos = this.state.costos_indirectos
    var Encabezado = await fetchEncabezado();
    var DataRestructurado = {
      style: "tableExample",
      layout: {
        hLineWidth: function (i, node) {
          return i === 0 || i === node.table.body.length ? 0.1 : 0.1;
        },
        vLineWidth: function (i, node) {
          return i === 0 || i === node.table.widths.length ? 0.5 : 0.5;
        },
        hLineColor: function (i, node) {
          return i === 0 || i === node.table.body.length
            ? "#030027"
            : "#001638";
        },
        vLineColor: function (i, node) {
          return i === 0 || i === node.table.widths.length
            ? "#030027"
            : "#001638";
        },
      },
      table: {
        widths: [20, 200, 65, 65, 35, 65, 35, 65, 35, 65, 35],
        body: [
          [
            {
              text: "ITEM",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
              margin: [2, 8, 0, 0],
            },
            {
              text: "COMPONENTE",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
              margin: [2, 8, 0, 0],
            },
            {
              text: "MONTO PPTDO",
              style: "tableHeader",
              alignment: "center",
              rowSpan: 2,
            },
            {
              text: `${PeriodoSeleccionado.mes} ${AnyoSeleccionado}`,
              style: "Tablafecha",
              alignment: "center",
              colSpan: 6,
            },
            {},
            {},
            {},
            {},
            {},
            {
              text: "SALDO",
              style: "tableHeader",
              alignment: "center",
              colSpan: 2,
              rowSpan: 2,
            },
            {},
          ],
          [
            {},
            {},
            {},
            {
              text: "ANTERIOR",
              style: "tableHeader",
              alignment: "center",
              colSpan: 2,
            },
            {},
            {
              text: "ACTUAL",
              style: "Tablafecha",
              alignment: "center",
              colSpan: 2,
            },
            {},
            {
              text: "ACUMULADO",
              style: "tableHeader",
              alignment: "center",
              colSpan: 2,
            },
            {},
            {},
            {},
          ],
          [
            {},
            {},
            {
              text: "Presup. S/.",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "Valorizado S/.",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "%",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "Valorizado S/.",
              style: "TableValInforme",
              alignment: "center",
            },
            {
              text: "%",
              style: "TableValInforme",
              alignment: "center",
            },
            {
              text: "Valorizado S/.",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "%",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "Valorizado S/.",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "%",
              style: "tableHeader",
              alignment: "center",
            },
          ],
        ],
      },
    };
    ResumenComponentes.forEach((item) => {
      DataRestructurado.table.body.push([
        {
          text: (item.numero = item.numero.replace(/^0+/, "")),
          style: "tableBody",
          alignment: "center",
        },
        {
          text: item.nombre,
          style: "tableBody",
          alignment: "left",
        },
        {
          text: Redondea(item.presupuesto),
          style: "tableBody",
          alignment: "right",
        },
        {
          text: Redondea(item.valor_anterior),
          style: "tableBody",
          alignment: "right",
        },
        {
          text: Redondea((item.valor_anterior / item.presupuesto) * 100) + " %",
          style: "tableBody",
          alignment: "right",
        },
        {
          text: Redondea(item.valor_actual),
          style: "TableValInforme",
          alignment: "right",
        },
        {
          text:
            `${Redondea((item.valor_actual / item.presupuesto) * 100)}` + " %",
          style: "TableValInforme",
          alignment: "right",
        },
        {
          text: Redondea(item.valor_anterior + item.valor_actual),
          style: "tableBody",
          alignment: "right",
        },
        {
          text:
            Redondea(
              ((item.valor_anterior + item.valor_actual) / item.presupuesto) *
                100
            ) + " %",
          style: "tableBody",
          alignment: "right",
        },
        {
          text: Redondea(
            item.presupuesto - item.valor_anterior - item.valor_actual
          ),
          style: "tableBody",
          alignment: "right",
        },
        {
          text:
            Redondea(
              ((item.presupuesto - item.valor_anterior - item.valor_actual) /
                item.presupuesto) *
                100
            ) + " %",
          style: "tableBody",
          alignment: "right",
          margin: [0, 0, 4, 0],
        },
      ]);
    });
    // sumatoria a costo directo
    DataRestructurado.table.body.push([
      {
        text: " Total Costo Directo",
        style: "TableTotalesInforme",
        alignment: "center",
        colSpan: 2,
        margin: [0, 2, 0, 0],
      },
      {},
      {
        text: "S/. " + `${Redondea(ResumenComponentesTotales.presupuesto)}`,
        style: "TableTotalesInforme",
        alignment: "right",
      },
      {
        text: "S/. " + `${Redondea(ResumenComponentesTotales.valor_anterior)}`,
        style: "TableTotalesInforme",
        alignment: "right",
        //colSpan: 2,
      },
      {
        text:
          `${Redondea(ResumenComponentesTotales.porcentaje_anterior)}` + " %",
        style: "TableTotalesInforme",
        alignment: "right",
      },
      {
        text: "S/. " + `${Redondea(ResumenComponentesTotales.valor_actual)}`,
        style: "TableTotalesInforme",
        alignment: "right",
        //colSpan: 2,
      },
      {
        text: `${Redondea(ResumenComponentesTotales.porcentaje_actual)}` + " %",
        style: "TableTotalesInforme",
        alignment: "right",
      },
      {
        text: "S/. " + `${Redondea(ResumenComponentesTotales.valor_total)}`,
        style: "TableTotalesInforme",
        alignment: "right",
        //colSpan: 2,
      },
      {
        text: `${Redondea(ResumenComponentesTotales.porcentaje_total)}` + " %",
        style: "TableTotalesInforme",
        alignment: "right",
      },
      {
        text: "S/. " + `${Redondea(ResumenComponentesTotales.valor_saldo)}`,
        style: "TableTotalesInforme",
        alignment: "right",
        //colSpan: 2,
      },
      {
        text: `${Redondea(ResumenComponentesTotales.porcentaje_saldo)}` + " %",
        style: "TableTotalesInforme",
        alignment: "right",
      },
    ]);
    //insertando una linea vacia
    DataRestructurado.table.body.push([
      {
        text: " ",
        style: "TableHeaderInforme",
        alignment: "center",
        colSpan: 11,
        margin: [0, 2, 0, 0],
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ]);

    // costos indirectos
    CostosIndirectos.forEach((item, j) => {
      DataRestructurado.table.body.push([
        {
          text: 1 + j,
          style: "tableFecha",
          alignment: "center",
          //colSpan:2,
          margin: [12, 0, 0, 0],
        },
        {
          text: item.nombre,
          style: "tableFecha",
          alignment: "left",
        },
        {
          text: Redondea(item.monto),
          style: "tableFecha",
          alignment: "right",
        },
        {
          text: Redondea(
            (item.monto *
              parseFloat(ResumenComponentesTotales.porcentaje_anterior).toFixed(
                2
              )) /
              100
          ),
          style: "tableFecha",
          alignment: "right",
        },
        {
          text: Redondea(ResumenComponentesTotales.porcentaje_anterior) + " %",
          style: "tableFecha",
          alignment: "right",
        },
        {
          text: Redondea(
            (item.monto *
              parseFloat(ResumenComponentesTotales.porcentaje_actual).toFixed(
                2
              )) /
              100
          ),
          style: "tableFecha",
          alignment: "right",
        },
        {
          text: Redondea(ResumenComponentesTotales.porcentaje_actual) + " %",
          style: "tableFecha",
          alignment: "right",
        },
        {
          text: Redondea(
            (item.monto *
              parseFloat(ResumenComponentesTotales.porcentaje_total).toFixed(
                2
              )) /
              100
          ),
          style: "tableFecha",
          alignment: "right",
        },
        {
          text: Redondea(ResumenComponentesTotales.porcentaje_total) + " %",
          style: "tableFecha",
          alignment: "right",
        },
        {
          text: Redondea(
            (item.monto *
              parseFloat(ResumenComponentesTotales.porcentaje_saldo).toFixed(
                2
              )) /
              100
          ),
          style: "tableFecha",
          alignment: "right",
        },
        {
          text: Redondea(ResumenComponentesTotales.porcentaje_saldo) + " %",
          style: "tableFecha",
          alignment: "right",
          margin: [0, 0, 4, 0],
        },
      ]);
    });
    // Totales costos indirectos
    DataRestructurado.table.body.push([
      {
        text: " Total Costo Indirecto",
        style: "TableTotalesInforme",
        alignment: "center",
        colSpan: 2,
        margin: [0, 2, 0, 0],
      },
      {},
      {
        text: "S/. " + Redondea(CostosIndirectosTotales.presupuesto),
        style: "TableTotalesInforme",
        alignment: "right",
      },
      {
        text: "S/. " + Redondea(CostosIndirectosTotales.valor_anterior),
        style: "TableTotalesInforme",
        alignment: "right",
        //colSpan: 2,
      },
      {
        text: Redondea(ResumenComponentesTotales.porcentaje_anterior) + " %",
        style: "TableTotalesInforme",
        alignment: "right",
      },
      {
        text: "S/. " + Redondea(CostosIndirectosTotales.valor_actual),
        style: "TableTotalesInforme",
        alignment: "right",
        //colSpan: 2,
      },
      {
        text: Redondea(ResumenComponentesTotales.porcentaje_actual) + " %",
        style: "TableTotalesInforme",
        alignment: "right",
      },
      {
        text: "S/. " + Redondea(CostosIndirectosTotales.valor_total),
        style: "TableTotalesInforme",
        alignment: "right",
        //colSpan: 2,
      },
      {
        text: Redondea(ResumenComponentesTotales.porcentaje_total) + " %",
        style: "TableTotalesInforme",
        alignment: "right",
      },
      {
        text: "S/. " + Redondea(CostosIndirectosTotales.valor_saldo),
        style: "TableTotalesInforme",
        alignment: "right",
        //colSpan: 2,
      },
      {
        text: Redondea(ResumenComponentesTotales.porcentaje_saldo) + " %",
        style: "TableTotalesInforme",
        alignment: "right",
      },
    ]);

    DataRestructurado.table.body.push([
      {
        text: " ",
        style: "TableHeaderInforme",
        alignment: "center",
        colSpan: 11,
        margin: [0, 2, 0, 0],
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ]);

    DataRestructurado.table.body.push([
      {
        text: "PRESUPUESTO TOTAL ",
        style: "TableTotalesInforme",
        alignment: "center",
        colSpan: 2,
        margin: [0, 2, 0, 0],
      },
      {},
      {
        text:
          "S/. " +
          Redondea(
            ResumenComponentesTotales.presupuesto +
              CostosIndirectosTotales.presupuesto
          ),
        style: "TableTotalesInforme",
        alignment: "center",
      },
      {
        text:
          "S/. " +
          Redondea(
            ResumenComponentesTotales.valor_anterior +
              CostosIndirectosTotales.valor_anterior
          ),
        style: "TableTotalesInforme",
        alignment: "center",
      },
      {
        text: Redondea(ResumenComponentesTotales.porcentaje_anterior) + " %",
        style: "TableTotalesInforme",
        alignment: "center",
      },
      {
        text:
          "S/. " +
          Redondea(
            ResumenComponentesTotales.valor_actual +
              CostosIndirectosTotales.valor_actual
          ),
        style: "TableTotalesInforme",
        alignment: "center",
      },
      {
        text: Redondea(ResumenComponentesTotales.porcentaje_actual) + " %",
        style: "TableTotalesInforme",
        alignment: "center",
      },
      {
        text:
          "S/. " +
          Redondea(
            ResumenComponentesTotales.valor_total +
              CostosIndirectosTotales.valor_total
          ),
        style: "TableTotalesInforme",
        alignment: "center",
      },
      {
        text: Redondea(ResumenComponentesTotales.porcentaje_total) + " %",
        style: "TableTotalesInforme",
        alignment: "center",
      },
      {
        text:
          "S/. " +
          Redondea(
            ResumenComponentesTotales.valor_saldo +
              CostosIndirectosTotales.valor_saldo
          ),
        style: "TableTotalesInforme",
        alignment: "center",
      },
      {
        text: Redondea(ResumenComponentesTotales.porcentaje_saldo) + " %",
        style: "TableTotalesInforme",
        alignment: "center",
      },
    ]);
    var DataEncabezado = await encabezadoInforme(
      PeriodoSeleccionado.fecha_inicial,
      PeriodoSeleccionado.fecha_final
    );
    console.log("DataEncabezado", DataEncabezado);
    delete DataRestructurado.pageBreak;
    // GENERA EL FORMATO PDF
    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    var docDefinition = {
      header: {
        columns: [
          {
            image: logoGRPuno,
            fit: [260, 260],
            margin: [45, 12, 10, 0],
          },
          {
            alignment: "right",
            image: logoSigobras,
            width: 40,
            height: 25,
            margin: [20, 10, 10, 0],
          },
        ],
      },

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: currentPage.toString() + " de " + pageCount,
              margin: [45, 10, 10, 0],
              fontSize: 9,
            },
            {
              qr: "http://sigobras.com",
              fit: 40,
              alignment: "right",
              margin: [20, 10, 10, 0],
            },
          ],
        };
      },

      content: [
        {
          layout: "noBorders",
          margin: 7,
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text:
                    "RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE",
                  style: "tableFechaContent",
                  alignment: "center",
                  margin: [10, 0, 5, 0],
                },
              ],
            ],
          },
        },
        Encabezado,
        DataRestructurado,
      ],

      styles: {
        header: {
          fontSize: 7,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        subheader: {
          fontSize: 10,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 7,
          color: "#000000",
          fillColor: "#8baedb",
        },
        tableFecha: {
          bold: true,
          fontSize: 7,
          color: "#000000",
          fillColor: "#dadada",
        },
        tableBody: {
          // bold: true,
          fontSize: 6,
          color: "#000000",
          // fillColor: '#f6f6ff',
        },
        TableHeaderInforme: {
          bold: true,
          fontSize: 9,
          color: "#000000",
          // fillColor: '#ffcf96',
        },
        tableBodyInforme: {
          fontSize: 9,
          color: "#000000",
        },
        tableFechaContent: {
          bold: true,
          fontSize: 9,
          color: "#000000",
          fillColor: "#8baedb",
        },
        TableValInforme: {
          bold: true,
          fontSize: 6,
          color: "#000000",
          fillColor: "#A4C4EA",
        },
        TableTotalesInforme: {
          bold: true,
          fontSize: 7.5,
          color: "#000000",
          fillColor: "#c5d5ea",
        },
        Tablafecha: {
          bold: true,
          fontSize: 8,
          color: "#000000",
          fillColor: "#c5d5ea",
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageSize: "A4",
      pageOrientation: "landscape",
    };
    var pdfDocGenerator = pdfmake.createPdf(docDefinition);
    pdfDocGenerator.open();
  }
  return (
    <div>
      <li className="lii">
        <a href="#" onClick={toggle}>
          <FaFilePdf className="text-danger" />
          3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE ✔
        </a>
      </li>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA PRESUPUESTO BASE
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="2">
              <fieldset>
                <legend>Seleccione</legend>

                <select
                  className="form-control form-control-sm"
                  onChange={(e) => setAnyoSeleccionado(e.target.value)}
                  value={AnyoSeleccionado}
                >
                  <option value="">Años</option>
                  {Anyos.map((item, i) => (
                    <option key={i} value={item.anyo}>
                      {item.anyo}
                    </option>
                  ))}
                </select>
              </fieldset>
            </Col>

            <Col sm="9">
              <fieldset>
                <legend>Seleccione Mes</legend>
                <ButtonGroup size="sm">
                  {Periodos.map((item, i) => (
                    <Button
                      color="primary"
                      outline={PeriodoSeleccionado.codigo != item.codigo}
                      key={i}
                      onClick={() => setPeriodoSeleccionado(item)}
                    >
                      {item.codigo}
                    </Button>
                  ))}
                </ButtonGroup>
              </fieldset>
            </Col>
            {/* {Loading ? <Spinner color="primary" /> : */}
            <Col sm="1">
              {PeriodoSeleccionado != 0 && (
                <button
                  className="btn btn-outline-success"
                  onClick={ResEstructarData}
                >
                  PDF
                </button>
              )}
            </Col>
            {/* } */}
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

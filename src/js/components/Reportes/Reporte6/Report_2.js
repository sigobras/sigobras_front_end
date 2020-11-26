import React, { Component } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, Row, Col, Spinner } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno } from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'

import { Redondea1, Redondea, Money_to_float } from '../../Utils/Funciones';

class Report_2 extends Component {
  constructor() {
    super()
    this.state = {
      DataEncabezado: [],
      DataValGeneralAPI: [],
      DataAniosApi: [],
      DataMesesApi: [],

      modal: false,

      urlPdf: '',
      anioSeleccionado: '',
      mesActual: '',

      Loading: false,

    }

    this.ModalReportes = this.ModalReportes.bind(this)
    this.PruebaDatos = this.PruebaDatos.bind(this)

    this.seleccionaAnios = this.seleccionaAnios.bind(this)
    this.seleccionaMeses = this.seleccionaMeses.bind(this)

  }

  ModalReportes() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    // llama al api de años
    axios.post(`${UrlServer}/getValGeneralAnyos`, {
      "id_ficha": sessionStorage.getItem("idobra")
    })
      .then((res) => {
        // console.log('res ANIOS', res.data)
        this.setState({
          DataAniosApi: res.data,
          
        })
      })
      .catch((err) => {
        console.log('ERROR ANG al obtener datos ❌' + err);
      });
  }

  seleccionaAnios(e) {
    // LLAMA AL API DE MESES

    this.setState({
      anioSeleccionado: e.target.value
    })

    axios.post(`${UrlServer}/getValGeneralPeriodos`, {
      "id_ficha": sessionStorage.getItem("idobra"),
      "anyo": e.target.value
    })
      .then((res) => {
        // console.log('res Meses', res.data)
        this.setState({
          DataMesesApi: res.data,

        })
      })
      .catch((err) => {
        console.log('ERROR ANG al obtener datos ❌' + err);
      });
  }

  async seleccionaMeses(id_historial, fecha_inicial, fecha_final, mes_act) {
    // LLAMA AL API DE MESES
    this.setState({
      mesActual: mes_act,
      Loading:true,
    })
    //console.log('Fecha',Mes);

    var res = await axios.post(`${UrlServer}/getValGeneralComponentes`, {
      "id_ficha": sessionStorage.getItem("idobra"),
      //"historialestados_id_historialestado":id_historial,
      "fecha_inicial": fecha_inicial,
      "fecha_final": fecha_final,
    })
    
    // console.log("Componentes1", res.data);

    var Componentes = res.data
    for (let index = 0; index < Componentes.length; index++) {
      const element = Componentes[index];
      var res2 = await axios.post(`${UrlServer}/getValGeneralPartidas`, {
        "id_componente": element.id_componente,
        "fecha_inicial": fecha_inicial,
        "fecha_final": fecha_final,
        "formato": false,
      })
      
      if (res2.data == "VACIO") {
        element.partidas = []
        element.porcentaje_actual = "0"
        element.porcentaje_anterior = "0"
        element.porcentaje_saldo = "0"
        element.porcentaje_total = "0"
        element.precio_parcial = "0"
        //element.presupuesto = "0"
        element.valor_actual = "0"
        element.valor_anterior = "0"
        element.valor_saldo = element.presupuesto
        element.valor_total = "0"
        // Componentes.splice(index, 1);
        // index--;
      } else {
        element = Object.assign(element, res2.data)
      }
      // console.log("Seguimiento  ",element.presupuesto,element.valor_actual,element.valor_anterior);
      // console.log("Seguimiento Total ",element.presupuesto-element.valor_actual-element.valor_anterior);
      element.valor_saldo = element.presupuesto-element.valor_actual-element.valor_anterior
    }
    // console.log("Componenetes modificcados", Componentes);
    
    var CD_porcentaje_anterior = 0;
    var CD_porcentaje_actual = 0;
    var CD_porcentaje_total = 0;
    var CD_porcentaje_saldo = 0;

    var CD_presupuesto = 0;

    var CD_valor_anterior = 0;
    var CD_valor_actual = 0;
    var CD_valor_total = 0;
    var CD_valor_saldo = 0;

    for (let index = 0; index < Componentes.length; index++) {
      const element = Componentes[index];
      
      CD_presupuesto += element.presupuesto 
      CD_valor_anterior += Money_to_float(element.valor_anterior)
      CD_valor_actual += Money_to_float(element.valor_actual)
      CD_valor_total += Money_to_float(element.valor_total)
      CD_valor_saldo += Money_to_float(element.valor_saldo)
    }
    CD_porcentaje_anterior = CD_valor_anterior / CD_presupuesto * 100
    CD_porcentaje_actual = CD_valor_actual / CD_presupuesto * 100
    CD_porcentaje_total = CD_valor_total / CD_presupuesto * 100
    CD_porcentaje_saldo = CD_valor_saldo / CD_presupuesto * 100

    CD_porcentaje_anterior = CD_porcentaje_anterior.toFixed(2)
    CD_porcentaje_actual = CD_porcentaje_actual.toFixed(2)
    CD_porcentaje_total = CD_porcentaje_total.toFixed(2)
    CD_porcentaje_saldo = CD_porcentaje_saldo.toFixed(2)

    
    this.setState({
      DataValGeneralAPI: Componentes,
      DataEncabezado: encabezadoInforme(fecha_inicial, fecha_final),
      CD_presupuesto : Redondea(CD_presupuesto),
      CD_valor_anterior : Redondea(CD_valor_anterior),
      CD_porcentaje_anterior : Redondea(CD_porcentaje_anterior ),
      CD_valor_actual : Redondea(CD_valor_actual),
      CD_porcentaje_actual : Redondea(CD_porcentaje_actual ),
      CD_valor_total :  Redondea(CD_valor_total),
      CD_porcentaje_total : Redondea(CD_porcentaje_total ),
      CD_valor_saldo : Redondea(CD_valor_saldo),
      CD_porcentaje_saldo : Redondea(CD_porcentaje_saldo ),
    })

    // ------------------------------------------------------------>COSTOS INDIRECTOS
      axios.post(`${UrlServer}/getCostosIndirectos`, {
        "fichas_id_ficha": sessionStorage.getItem("idobra"),
        //"historialestados_id_historialestado":id_historial,
        "fecha_inicial": fecha_inicial,
        "fecha_final": fecha_final,
    })    
        .then((res3) => {
            // console.log('res costos indirectos', res3.data)
            var costos_indirectos = res3.data
            var CI_total_presupuesto = 0;
            var CI_total_avance_anterior = 0;
            var CI_total_avance_actual = 0;
            var CI_total_avance_total = 0;
            var CI_total_avance_saldo = 0;
           
            for (let index = 0; index < costos_indirectos.length; index++) {
                const item = costos_indirectos[index];
                item.avance_anterior = Redondea(item.monto * CD_porcentaje_anterior / 100)
                item.porcentaje_anterior = CD_porcentaje_anterior
                item.avance_actual = Redondea(item.monto * CD_porcentaje_actual / 100)
                item.porcentaje_actual = CD_porcentaje_actual
                item.avance_total = Redondea(item.monto * CD_porcentaje_total / 100)
                item.porcentaje_total = CD_porcentaje_total
                item.avance_saldo = Redondea(item.monto * CD_porcentaje_saldo/ 100)
                item.porcentaje_saldo = CD_porcentaje_saldo

                CI_total_presupuesto += item.monto
                CI_total_avance_anterior += item.monto * CD_porcentaje_anterior / 100
                CI_total_avance_actual += item.monto * CD_porcentaje_actual / 100
                CI_total_avance_total += item.monto * CD_porcentaje_total / 100
                CI_total_avance_saldo += item.monto * CD_porcentaje_saldo / 100

            }
            
            var CT_presupuesto = CI_total_presupuesto + CD_presupuesto
            //console.log("Presupuesto total" , CI_total_presupuesto,Money_to_float(this.state.DataValGeneralAPI.presupuesto));
            CT_presupuesto = Redondea(CT_presupuesto)

            var CT_avance_anterior = CI_total_avance_anterior + CD_valor_anterior
            //console.log("Presupuesto total" , CI_total_presupuesto,Money_to_float(this.state.DataValGeneralAPI.presupuesto));
            CT_avance_anterior = Redondea(CT_avance_anterior)

            var CT_avance_actual = CI_total_avance_actual + CD_valor_actual
            //console.log("Presupuesto total" , CI_total_presupuesto,Money_to_float(this.state.DataValGeneralAPI.presupuesto));
            CT_avance_actual = Redondea(CT_avance_actual)

            var CT_avance_total = CI_total_avance_total + CD_valor_total
            //console.log("Presupuesto total" , CI_total_presupuesto,Money_to_float(this.state.DataValGeneralAPI.presupuesto));
            CT_avance_total = Redondea(CT_avance_total)

            var CT_avance_saldo = CI_total_avance_saldo + CD_valor_saldo
            //console.log("Presupuesto total" , CI_total_presupuesto,Money_to_float(this.state.DataValGeneralAPI.presupuesto));
            CT_avance_saldo = Redondea(CT_avance_saldo)

            CI_total_presupuesto = Redondea(CI_total_presupuesto )
            CI_total_avance_anterior = Redondea(CI_total_avance_anterior )
            CI_total_avance_actual = Redondea(CI_total_avance_actual )
            CI_total_avance_total = Redondea(CI_total_avance_total )
            CI_total_avance_saldo = Redondea(CI_total_avance_saldo )
           

            // console.log('costos_indirectos', costos_indirectos);
            this.setState({
                DataValGeneralAPI: Componentes,
                DataEncabezado: encabezadoInforme(fecha_inicial, fecha_final),
                costos_indirectos,
                CI_total_presupuesto,
                CI_total_avance_anterior,
                CI_total_avance_actual,
                CI_total_avance_total,
                CI_total_avance_saldo,               
                CT_presupuesto,
                CT_avance_anterior,
                CT_avance_actual,
                CT_avance_total,
                CT_avance_saldo,
                Loading:false,
            })
        })
        .catch((err) => {
            console.log('ERROR ANG al obtener datos ❌' + err);
        });

  }



  PruebaDatos() {

    var { DataEncabezado } = this.state

    var DataHist = this.state.DataValGeneralAPI
    // console.log('DH', DataHist)


    var ValPresupuesto = []

    for (let i = 0; i < DataHist.length; i++) {

      ValPresupuesto.push(
  
        {
          style: 'tableExample',
          // color: '#ff0707',
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? '#030027' : '#001638';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? '#030027' : '#001638';
            },
            //hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            //vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            //paddingLeft: function(i, node) { return 4; },
            //paddingRight: function(i, node) { return 4; },
            //paddingTop: function(i, node) { return 2; },
            //paddingBottom: function(i, node) { return 2; },
            //fillColor: function (rowIndex, node, columnIndex) { return null; }
          },
  
  
          table: {
            headerRows: 5,
            widths: [30, 180, 13, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
            body: [
              [
                {
                  text: 'C-' + DataHist[i].numero,
                  style: "TableMontosInforme",
                  alignment: "left",
                },
                {
                  text: DataHist[i].nombre,
                  style: "TableMontosInforme",
                  alignment: "center",
  
                  colSpan: 14
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
                  text: ' S/. ' + Redondea(DataHist[i].presupuesto),
                  style: "TableMontosInforme",
                  alignment: "center",
                  colSpan: 3,
                },
                {
                  
                },
                {
  
                }
              ],
  
              [
                {
                  text: 'PARTIDA: ',
                  style: "tableHeader",
                  alignment: "center",
                  rowSpan: 4,
                  margin: [2, 15, 0, 0],
  
                },
                {
                  rowSpan: 4,
                  text: 'DESCRIPCION',
                  style: "tableHeader",
                  alignment: "center",
                  margin: [2, 15, 0, 0],
                },
                {
                  text: 'UND ',
                  style: "tableHeader",
                  alignment: "center",
                  rowSpan: 4,
                  margin: [2, 15, 0, 0],
                },
                {
                  text: 'PRESUPUESTO DEL EXPEDIENTE APROBADO',
                  style: "tableHeader",
                  alignment: "center",
                  rowSpan: 3,
                  colSpan: 3,
                  margin: [2, 15, 0, 0],
                },
                {
  
                },
                {
  
                },
                {
                  text: 'S/. ' + Redondea(DataHist[i].valor_anterior),
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 2,
                },
                {
  
                },
                {
                  text: Redondea(DataHist[i].porcentaje_anterior) + ' %',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'S/. ' + Redondea(DataHist[i].valor_actual),
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 2,
                },
                {
  
                },
                {
                  text: Redondea(DataHist[i].porcentaje_actual) + ' %',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'S/. ' + Redondea(DataHist[i].valor_total),
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 2,
                },
                {
  
                },
                {
                  text: Redondea(DataHist[i].porcentaje_total) + ' %',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: ' S/. ' + Redondea(DataHist[i].valor_saldo),
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 2,
                },
                {
  
                },
                {
                  text: Redondea(DataHist[i].porcentaje_saldo) + ' %',
                  style: "tableHeader",
                  alignment: "center",
                }
              ],
  
  
  
              [
                {
  
                },
                {
  
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                  text: `${this.state.mesActual} ${this.state.anioSeleccionado}`,
                  style: "fechaval",
                  alignment: "center",
                  colSpan: 9,
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
  
                },
                {
                  text: 'SALDO',
                  style: "tableHeader",
                  alignment: "center",
                  margin: [2, 7, 0, 0],
                  colSpan: 3,
                  rowSpan: 2,
                },
                {
  
                },
                {
  
                }
              ],
  
              [
                {
  
                },
                {
  
  
                },
                {
  
                },
                {
                  text: 'PRESUPUESTO DEL EXPEDIENTE APROBADO',
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 3,
                },
                {
  
                },
                {
  
                },
                {
                  text: 'ANTERIOR',
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 3,
                  //border: [true, false, false, false],
                },
                {
  
                },
                {
  
                },
                {
                  text: 'ACTUAL',
                  style: "TableValInforme",
                  alignment: "center",
                  colSpan: 3,
                },
                {
  
                },
                {
  
                },
                {
                  text: 'ACUMULADO',
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 3,
                },
                {
  
                },
                {
  
                },
                {
                  text: 'SALDO',
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 3,
                },
                {
  
                },
                {
  
                }
              ],
  
              [
                {
  
                },
                {
  
  
                },
                {
  
                },
                {
                  text: 'METRADO',
                  style: "tableHeader",
                  alignment: "center",
                  //border: undefined,                            
                },
                {
                  text: 'P. UNIT. S/.',
                  style: "tableHeader",
                  alignment: "center",
  
                },
                {
                  text: 'PARCIAL. S/.',
                  style: "tableHeader",
                  alignment: "center",
  
                },
                {
                  text: 'METRADO',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'VALORIZADO S/.',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: '%',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'METRADO',
                  style: "TableValInforme",
                  alignment: "center",
                },
                {
                  text: 'VALORIZADO S/.',
                  style: "TableValInforme",
                  alignment: "center",
                },
                {
                  text: '%',
                  style: "TableValInforme",
                  alignment: "center",
                },
                {
                  text: 'METRADO',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'VALORIZADO S/.',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: '%',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'METRADO',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'VALORIZADO S/.',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: '%',
                  style: "tableHeader",
                  alignment: "center",
                }
              ],
            ]
          },
          pageBreak: 'after',
        }
      )
  
      for (let j = 0; j < DataHist[i].partidas.length; j++) {
  
        //console.log(i, 'ddatos', DataHist[i].partidas[j], 'index j', j);
  
  
        ValPresupuesto[i].table.body.push(
          [
  
            {
              text: DataHist[i].partidas[j].item,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].descripcion,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].unidad_medida,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].metrado,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].costo_unitario,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
  
            },
            {
              text: DataHist[i].partidas[j].precio_parcial,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
              //border: [true, false, false, false],
  
            },
            {
              text: DataHist[i].partidas[j].metrado_anterior,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
  
            },
            {
              text: DataHist[i].partidas[j].valor_anterior,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].porcentaje_anterior + ' %',
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].metrado_actual,
              style: "tablaValorizacionActual",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].valor_actual,
              style: "tablaValorizacionActual",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].porcentaje_actual + ' %',
              style: "tablaValorizacionActual",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].metrado_total,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].valor_total,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].porcentaje_total + ' %',
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].metrado_saldo,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].valor_saldo,
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
            {
              text: DataHist[i].partidas[j].porcentaje_saldo + ' %',
              style: "tablaValorizacion",
              border: [false, false, false, true],
  
            },
  
  
          ]
  
        )
  
  
      }
      ValPresupuesto[i].table.body.push(
        [
  
          {
            text: "TOTAL",
            style: "tableHeader",
            alignment: "center",
            border: [false, false, false, true],
            colSpan: 3,
  
          },
          {
  
          },
          {
  
  
          },
          {
            text: 'S/. ' + Redondea(DataHist[i].presupuesto),
            style: "tableHeader",
            alignment: "center",
            colSpan: 3,
  
          },
          {
  
  
  
          },
          {
  
  
          },
          {
            text: 'S/. ' + Redondea(DataHist[i].valor_anterior),
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {
  
          },
          {
            text: Redondea(DataHist[i].porcentaje_anterior) + ' %',
            style: "tableHeader",
            alignment: "center",
          },
          {
            text: 'S/. ' + Redondea(DataHist[i].valor_actual),
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {
  
          },
          {
            text: Redondea(DataHist[i].porcentaje_actual) + ' %',
            style: "tableHeader",
            alignment: "center",
          },
          {
            text: 'S/. ' + Redondea(DataHist[i].valor_total),
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {
  
          },
          {
            text: Redondea(DataHist[i].porcentaje_total) + ' %',
            style: "tableHeader",
            alignment: "center",
          },
          {
            text: ' S/. ' + Redondea(DataHist[i].valor_saldo),
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {
  
          },
          {
            text: Redondea(DataHist[i].porcentaje_saldo) + ' %',
            style: "tableHeader",
            alignment: "center",
            border: [false, false, false, true],
          },
  
  
        ]
  
      )
  
  
  
  
    };
     
    //-------------------------COSTOS DIRECTOS TOTAL
    ValPresupuesto.push(
      {
        style: 'tableExample',
        // color: '#ff0707',
        layout: 'lightHorizontalLines',

        table: {
          widths: [20, '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [

              {
                text: "TOTAL COSTO DIRECTO",
                style: "TotalCD",
                alignment: "center",
                border: [true, true, false, true],
                colSpan: 2,

              },

              {
                
              },
              {
                text: "S/." + this.state.CD_presupuesto,
                style: "TotalCD",
                alignment: "center",
              },
              {
                text: "S/." + this.state.CD_valor_anterior,
                style: "TotalCD",
                alignment: "center",
              },
              {
                text: this.state.CD_porcentaje_anterior + " %",
                style: "TotalCD",
                alignment: "center",
              },
              {
                text: "S/." + this.state.CD_valor_actual,
                style: "TotalCD",
                alignment: "center",
              },
              {
                text: this.state.CD_porcentaje_actual + " %",
                style: "TotalCD",
                alignment: "center",
              },
              {
                text: "S/." + this.state.CD_valor_total,
                style: "TotalCD",
                alignment: "center",
              },
              {
                text: this.state.CD_porcentaje_total + " %",
                style: "TotalCD",
                alignment: "center",
              },
              {
                text: "S/." + this.state.CD_valor_saldo,
                style: "TotalCD",
                alignment: "center",
              },
              {
                text: this.state.CD_porcentaje_saldo + " %",
                style: "TotalCD",
                alignment: "center",
              },


            ]


          ]
        }
      }
    )
    //-------------------------- COSTOS INDIRECTOS 
    var costosIndirectos = this.state.costos_indirectos
    ValPresupuesto.push(
      {
        style: 'tableExample',
        // color: '#ff0707',
        layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 0.5 : 0.5;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.5;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
            },
            //hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            //vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            //paddingLeft: function(i, node) { return 4; },
            //paddingRight: function(i, node) { return 4; },
            //paddingTop: function(i, node) { return 2; },
            //paddingBottom: function(i, node) { return 2; },
            //fillColor: function (rowIndex, node, columnIndex) { return null; }
          },

        table: {
          widths: [20, '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              {

                text: 'ITEM',
                style: "tableHeader",
                alignment: "center",
                rowSpan: 3,
                margin: [2, 8, 0, 0]

              },
              {
                text: 'DESCRIPCIÓN',
                style: "tableHeader",
                alignment: "center",
                rowSpan: 3,
                margin: [2, 8, 0, 0]
              },
              {
                text: 'MONTO PPTDO',
                style: "tableHeader",
                alignment: "center",
                rowSpan: 2
              },
              {
                text: `${this.state.mesActual} ${this.state.anioSeleccionado}`,
                style: "fechaval",
                alignment: "center",
                colSpan: 6
              },
              {

              },
              {

              },
              {

              },
              {

              },
              {

              },
              {
                text: 'SALDO',
                style: "tableHeader",
                alignment: "center",
                colSpan: 2,
                rowSpan: 2
              },
              {

              }

            ],
            [
              {

              },
              {

              },
              {

              },
              {
                text: 'ANTERIOR',
                style: "tableHeader",
                alignment: "center",
                colSpan: 2
              },
              {

              },
              {
                text: 'ACTUAL',
                style: "TableValInforme",
                alignment: "center",
                colSpan: 2
              },
              {

              },
              {
                text: 'ACUMULADO',
                style: "tableHeader",
                alignment: "center",
                colSpan: 2
              },
              {

              },
              {

              },
              {

              },

            ],
            [
              {

              },
              {

              },
              {
                text: 'Presup. S/.',
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: 'Valorizado S/.',
                style: "tableHeader",
                alignment: "center",
              },
              {
                //text: `${DataHist.porcentaje_anterior} `,
                text: "%",
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: 'Valorizado S/.',
                style: "TableValInforme",
                alignment: "center",
              },
              {
                text: '%',
                style: "TableValInforme",
                alignment: "center",
              },
              {
                text: 'Valorizado S/.',
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: '%',
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: 'Valorizado S/.',
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: '%',
                style: "tableHeader",
                alignment: "center",
              },

            ],


          ]
        }
      }
    )
    //TABLITA DEL COSTO DIRECTO 
    // console.log("ValPresupuesto",ValPresupuesto);
    costosIndirectos.forEach((CDirecto, j) => {
      
      ValPresupuesto[ValPresupuesto.length - 1].table.body.push( 
        [
          {
              text: 1 + j,
              style: "tableFecha",
              alignment: "center",
              //colSpan:2,
              margin: [12, 0, 0, 0]
          },
          {
              text: CDirecto.nombre,
              style: "tableFecha",
              alignment: "left",
          },
          {
              text: Redondea(CDirecto.monto),
              style: "tableFecha",
              alignment: "right",
          },
          {
              text: CDirecto.avance_anterior,
              style: "tableFecha",
              alignment: "right",
          },
          {
              text: Redondea(CDirecto.porcentaje_anterior) + " %",
              style: "tableFecha",
              alignment: "right",
          },
          {
              text: CDirecto.avance_actual,
              style: "tableFecha",
              alignment: "right",
          },
          {
              text: Redondea(CDirecto.porcentaje_actual) + " %",
              style: "tableFecha",
              alignment: "right",
          },
          {
              text: CDirecto.avance_total,
              style: "tableFecha",
              alignment: "right",
          },
          {
              text: Redondea(CDirecto.porcentaje_total) + " %",
              style: "tableFecha",
              alignment: "right",
          },
          {
              text: CDirecto.avance_saldo,
              style: "tableFecha",
              alignment: "right",
          },
          {
              text: Redondea(CDirecto.porcentaje_saldo) + " %",
              style: "tableFecha",
              alignment: "right",
              margin: [0, 0, 4, 0]
          },
      ]
      )
    })
    // Totales costos indirectos 
    ValPresupuesto[ValPresupuesto.length - 1].table.body.push(
      //console.log("SUma avance anterio", this.state.CI_total_avance_anterior),
      [
          {
              text: ' TOTAL Costo Indirecto',
              style: "TableTotalesInforme",
              alignment: "center",
              colSpan: 2,
              margin: [0, 2, 0, 0]
          },
          {
          
          },
          {
              text: "S/. " + this.state.CI_total_presupuesto,
              style: "TableTotalesInforme",
              alignment: "right",
          },
          {
              text: "S/. " + this.state.CI_total_avance_anterior,
              style: "TableTotalesInforme",
              alignment: "right",
              //colSpan: 2,
          },
          {
              text: this.state.CD_porcentaje_anterior + " %",
              style: "TableTotalesInforme",
              alignment: "right",
          },
          {
              text:"S/. " + this.state.CI_total_avance_actual,
              style: "TableTotalesInforme",
              alignment: "right",
              //colSpan: 2,
          },
          {
              text: this.state.CD_porcentaje_actual + " %",
              style: "TableTotalesInforme",
              alignment: "right",
          },
          {
              text:"S/. " + this.state.CI_total_avance_total,
              style: "TableTotalesInforme",
              alignment: "right",
              //colSpan: 2,
          },
          {
              text: this.state.CD_porcentaje_total + " %",
              style: "TableTotalesInforme",
              alignment: "right",
          },
          {
              text: "S/. " + this.state.CI_total_avance_saldo,
              style: "TableTotalesInforme",
              alignment: "right",
              //colSpan: 2,
          },
          {
              text: this.state.CD_porcentaje_saldo + " %",
              style: "TableTotalesInforme",
              alignment: "right",
          },
      ]
  )

  ValPresupuesto[ValPresupuesto.length - 1].table.body.push(
      //console.log("SUma avance anterio", this.state.CI_total_avance_anterior),
      [
          {
              text: ' ',
              style: "TableHeaderInforme",
              alignment: "center",
              colSpan: 11,
              margin: [0, 2, 0, 0]
          },
          {
          
          },
          {
              
          },
          {
              
          },
          {
             
          },
          {
              
          },
          {
              
          },
          {
              
          },
          {
              
          },
          {
              
          },
          {
              
          },
      ]
  )
  ValPresupuesto[ValPresupuesto.length - 1].table.body.push(
    //console.log("SUma avance anterio", this.state.CI_total_avance_anterior),
    [
        {
            text: 'PRESUPUESTO TOTAL ',
            style: "TableTotalesInforme",
            alignment: "center",
            colSpan: 2,
            margin: [0, 2, 0, 0]
        },
        {
        
        },
        {
            text: this.state.CT_presupuesto,
            style: "TableTotalesInforme",
            alignment: "center", 
        },
        {
            text: this.state.CT_avance_anterior,
            style: "TableTotalesInforme",
            alignment: "center",  
        },
        {
            text: this.state.CD_porcentaje_anterior + " %",
            style: "TableTotalesInforme",
            alignment: "center",
        },
        {
            text: this.state.CT_avance_actual,
            style: "TableTotalesInforme",
            alignment: "center",
        },
        {
            text: this.state.CD_porcentaje_actual + " %",
            style: "TableTotalesInforme",
            alignment: "center",
        },
        {
            text: this.state.CT_avance_total,
            style: "TableTotalesInforme",
            alignment: "center",
        },
        {
            text: this.state.CD_porcentaje_total + " %",
            style: "TableTotalesInforme",
            alignment: "center",
        },
        {
            text: this.state.CT_avance_saldo,
            style: "TableTotalesInforme",
            alignment: "center",
        },
        {
            text: this.state.CD_porcentaje_saldo + " %",
            style: "TableTotalesInforme",
            alignment: "center",
        },
    ]
)
    
    //console.log('data push' ,DataRestructurado);
    // console.log('data push' ,ValPresupuesto);

  
    var ultimoElemento = ValPresupuesto.length - 1
    delete ValPresupuesto[ultimoElemento].pageBreak


    //var { DataEncabezado } = this.state


    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    var docDefinition = {
      header: {

        columns: [
          {
            image: logoGRPuno,
            fit: [260, 260],
            margin: [45, 10, 10, 0]
          },
          {
            alignment: 'right',
            image: logoSigobras,
            width: 40,
            height: 25,
            margin: [5, 12, 10, 0]

          }
        ]
      },

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: currentPage.toString() + ' de ' + pageCount,
              margin: [45, 10, 10, 0],
              fontSize: 8,
            },
            // {
            //   qr: 'http://sigobras.com',
            //   fit: 40,
            //   alignment: 'right',
            //   margin: [20, 0, 10, 0]
            // }
          ]

        }
      },

      content: [
        {
          layout: 'noBorders',
          margin: 0,
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE' + ' ' + `${this.state.mesActual} ${this.state.anioSeleccionado}`,
                  style: "tableFechaContent",
                  alignment: "center",
                  margin: [0, 0, 5, 0],
                }
              ]

            ]
          },
          // text: 'VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE',
          // margin: 7,
          // alignment: 'center'
        },

        DataEncabezado,
        ValPresupuesto
      ],

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
          fontSize: 5.5,
          color: '#000000',
          fillColor: '#8baedb',
        },
        tablaValorizacion: {
          fontSize: 5,
          bold: false,
          color: '#000000',
        },
        tableFecha: {
          bold: true,
          fontSize: 7,
          color: '#000000',
          fillColor: '#c5d5ea',
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
        TableValInforme: {
          bold: true,
          fontSize: 5,
          color: '#000000',
          fillColor: '#c5d5ea',
        },
        tablaValorizacionActual: {
          fontSize: 5,
          bold: false,
          color: '#000000',
          fillColor: '#c5d5ea',
        },
        tableFechaContent: {
          bold: true,
          fontSize: 10,
          color: '#000000',
          fillColor: '#8baedb',
        },
        TableTotalesInforme: {
          bold: true,
          fontSize: 8,
          color: '#000000',
          fillColor: '#c5d5ea',
      },
      TotalCD: {
        bold: true,
        fontSize: 8,
        color: '#000000',
        fillColor: '#8baedb',
    },
    fechaval: {
      bold: true,
      fontSize: 8,
      color: '#000000',
      fillColor: '#c5d5ea',
  },


      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      //pageMargins: [30, 38, 0, 0],

    };
    // pdfmake.createPdf(docDefinition)

    var pdfDocGenerator = pdfmake.createPdf(docDefinition);
    pdfDocGenerator.open()

    // pdfDocGenerator.getDataUrl((dataUrl) => {
    //   this.setState({
    //     urlPdf:dataUrl
    //    })

    // });

  }


  render() {
    const { DataValGeneralAPI, DataAniosApi, DataMesesApi, urlPdf, Loading } = this.state

    return (
      <div>
        <li className="lii">
          <a href="#" onClick={this.ModalReportes} ><FaFilePdf className="text-danger" /> 2.- VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE ✔</a>
        </li>
        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
          <ModalHeader toggle={this.ModalReportes}>2.- VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="2">
                <fieldset>
                  <legend>Seleccione</legend>

                  <select className="form-control form-control-sm" onChange={e => this.seleccionaAnios(e)}  >
                    <option value="">Años</option>
                    {
                      DataAniosApi.map((anios, iA) =>
                        <option key={iA} value={anios.anyo}>{anios.anyo}</option>
                      )
                    }
                  </select>
                </fieldset>

              </Col>

              <Col sm="9">
                {DataMesesApi.length <= 0 ? "" :
                  <fieldset>
                    <legend>Seleccione Mes</legend>
                    <ButtonGroup size="sm">
                      {
                        DataMesesApi.map((Meses, iM) =>
                          <Button color="primary" key={iM} onClick={() => this.seleccionaMeses(Meses.historialestados_id_historialestado, Meses.fecha_inicial, Meses.fecha_final, Meses.mes,)}>{Meses.codigo}</Button>
                        )
                      }

                    </ButtonGroup>
                  </fieldset>
                }
              </Col>
              {Loading ? <Spinner color="primary" />:
              <Col sm="1">
                {
                  DataValGeneralAPI.length <= 0 ? "" :
                    <button className="btn btn-outline-success" onClick={this.PruebaDatos}>PDF</button>
                }
              </Col>}
            </Row>

            {/* { 
                urlPdf.length <= 0 ?<Spinner color="primary" />:
              <iframe src={this.state.urlPdf } style={{height: 'calc(100vh - 50px)'}} width="100%"></iframe>
              } */}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Report_2;
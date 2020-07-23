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
        console.log('res ANIOS', res.data)
        this.setState({
          DataAniosApi: res.data
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
        console.log('res Meses', res.data)
        this.setState({
          DataMesesApi: res.data
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
    })
    //console.log('Fecha',Mes);

    var res = await axios.post(`${UrlServer}/getValGeneralComponentes`, {
      "id_ficha": sessionStorage.getItem("idobra"),
      //"historialestados_id_historialestado":id_historial,
      "fecha_inicial": fecha_inicial,
      "fecha_final": fecha_final,
    })
    // .then((res)=>{
    //     console.log('res valorizacionPrincipal', res.data)
    //     this.setState({
    //       DataValGeneralAPI: res.data,
    //       DataEncabezado:encabezadoInforme(fecha_inicial,fecha_final)

    //     })
    // })
    // .catch((err)=>{
    //     console.log('ERROR ANG al obtener datos ❌'+ err);
    // });
    console.log("Componentes1", res.data);

    var Componentes = res.data
    for (let index = 0; index < Componentes.length; index++) {
      const element = Componentes[index];
      var res2 = await axios.post(`${UrlServer}/getValGeneralPartidas`, {
        "id_componente": element.id_componente,
        "fecha_inicial": fecha_inicial,
        "fecha_final": fecha_final,
      })
      if (res2.data == "VACIO") {
        Componentes.splice(index, 1);
        index--;
      } else {
        element = Object.assign(element, res2.data)
      }

    }
    console.log("Componenetes_procesados", Componentes);
    this.setState({
      DataValGeneralAPI: Componentes,
      DataEncabezado: encabezadoInforme(fecha_inicial, fecha_final)
    })

  }



  PruebaDatos() {

    var { DataEncabezado } = this.state

    var DataHist = this.state.DataValGeneralAPI
    console.log('DH', DataHist)


    var ValPresupuesto = []

    for (let i = 0; i < DataHist.length; i++) {

      ValPresupuesto.push(

        {
          style: 'tableExample',
          // color: '#ff0707',
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
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
                  alignment: "center",
                },
                {
                  text: DataHist[i].nombre,
                  style: "TableMontosInforme",
                  alignment: "center",

                  colSpan: 15
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

                },
                {
                  text: ' S/. ' + Redondea(DataHist[i].presupuesto),
                  style: "TableMontosInforme",
                  alignment: "center",
                  colSpan: 2,

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
                  text: 'PRESUPUESTO PROGRAMADO',
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
                  text: 'S/. ' + DataHist[i].valor_anterior,
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 2,
                },
                {

                },
                {
                  text: DataHist[i].porcentaje_anterior + ' %',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'S/. ' + DataHist[i].valor_actual,
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 2,
                },
                {

                },
                {
                  text: DataHist[i].porcentaje_actual + ' %',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: 'S/. ' + DataHist[i].valor_total,
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 2,
                },
                {

                },
                {
                  text: DataHist[i].porcentaje_total + ' %',
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: ' S/. ' + DataHist[i].valor_saldo,
                  style: "tableHeader",
                  alignment: "center",
                  colSpan: 2,
                },
                {

                },
                {
                  text: DataHist[i].porcentaje_saldo + ' %',
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
                  style: "TableValInforme",
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
                  text: 'PRESUPUESTO PROGRAMADO',
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

        console.log(i, 'ddatos', DataHist[i].partidas[j], 'index j', j);


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
              text: DataHist[i].partidas[j].valor_total,
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
            colSpan: 6,

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
            text: 'S/. ' + DataHist[i].valor_anterior,
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {

          },
          {
            text: DataHist[i].porcentaje_anterior + ' %',
            style: "tableHeader",
            alignment: "center",
          },
          {
            text: 'S/. ' + DataHist[i].valor_actual,
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {

          },
          {
            text: DataHist[i].porcentaje_actual + ' %',
            style: "tableHeader",
            alignment: "center",
          },
          {
            text: 'S/. ' + DataHist[i].valor_total,
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {

          },
          {
            text: DataHist[i].porcentaje_total + ' %',
            style: "tableHeader",
            alignment: "center",
          },
          {
            text: ' S/. ' + DataHist[i].valor_saldo,
            style: "tableHeader",
            alignment: "center",
            colSpan: 2,
          },
          {

          },
          {
            text: DataHist[i].porcentaje_saldo + ' %',
            style: "tableHeader",
            alignment: "center",
            border: [false, false, false, true],
          },


        ]

      )

    }


    // console.log('data push' ,ValPresupuesto);


    var ultimoElemento = ValPresupuesto.length - 1
    delete ValPresupuesto[ultimoElemento].pageBreak


    var { DataEncabezado } = this.state


    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    var docDefinition = {
      header: {

        columns: [
          {
            image: logoGRPuno,
            fit: [280, 280],
            margin: [45, 12, 10, 0]
          },
          {
            alignment: 'right',
            image: logoSigobras,
            width: 48,
            height: 30,
            margin: [20, 10, 10, 0]

          }
        ]
      },

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: currentPage.toString() + ' de ' + pageCount,
              margin: [45, 10, 10, 0],
              fontSize: 9,
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
          margin: 7,
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE',
                  style: "tableFechaContent",
                  alignment: "center",
                  margin: [10, 0, 5, 0],
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
          fontSize: 4.5,
          bold: false,
          color: '#000000',
        },
        tableFecha: {
          bold: true,
          fontSize: 7,
          color: '#000000',
          fillColor: '#dadada',
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
          fontSize: 6,
          color: '#000000',
          fillColor: '#A4C4EA',
        },
        tablaValorizacionActual: {
          fontSize: 4.5,
          bold: false,
          color: '#000000',
          fillColor: '#A4C4EA',
        },
        tableFechaContent: {
          bold: true,
          fontSize: 10,
          color: '#000000',
          fillColor: '#8baedb',
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
    const { DataValGeneralAPI, DataAniosApi, DataMesesApi, urlPdf } = this.state

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

              <Col sm="1">
                {
                  DataValGeneralAPI.length <= 0 ? "" :
                    <button className="btn btn-outline-success" onClick={this.PruebaDatos}>PDF</button>
                }
              </Col>
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
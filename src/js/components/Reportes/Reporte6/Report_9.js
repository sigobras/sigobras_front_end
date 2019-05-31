import React, { Component } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting'

import Chart from "./Chart";

import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, Row, Col, Spinner } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'



class Report_9 extends Component {
  constructor(){
    super()
    this.state = {
      DataValGantAPI:[],
      DataAniosApi:[],
      DataMesesApi:[],
      modal: false,
      DataEncabezado:[],
      urlPdf: '',
      DataChart: {

        title: {
          text: 'Logarithmic axis demo'
        },

        xAxis: {
          tickInterval: 1,
          type: 'logarithmic'
        },

        yAxis: {
          type: 'logarithmic',
          minorTickInterval: 0.1
        },

        tooltip: {
          headerFormat: '<b>{series.name}</b><br />',
          pointFormat: 'x = {point.x}, y = {point.y}'
        },

        series: [{
          data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
          pointStart: 1
        }]
      }
      
    }

    this.ModalReportes = this.ModalReportes.bind(this)
    this.PruebaDatos = this.PruebaDatos.bind(this)
    
    this.seleccionaAnios = this.seleccionaAnios.bind(this)
    this.seleccionaMeses = this.seleccionaMeses.bind(this)
    this.myRefChart = React.createRef()
  }
  componentDidMount() {
    console.log("svg ", this.myRefChart)

    if (this.refs.chart) {
      let chart = this.refs.chart.refs.chart;
      let html = document.createElement('html');
      html.innerHTML = chart.innerHTML;
      let svg = html.getElementsByTagName('svg')[0].outerHTML; // This is your SVG
      console.log("svg ", svg)

    }

  }


  ModalReportes() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    // llama al api de años
    axios.post(`${UrlServer}/getAnyoReportes`,{
      "id_ficha":sessionStorage.getItem("idobra")
    })
    .then((res)=>{
        // console.log('res ANIOS', res.data)
        this.setState({
          DataAniosApi: res.data
        })
    })
    .catch((err)=>{
        console.log('ERROR ANG al obtener datos ❌'+ err);
    });
  }

  seleccionaAnios(e){   
    // LLAMA AL API DE MESES
  
    axios.post(`${UrlServer}/getPeriodsByAnyo`,{
      "id_ficha":sessionStorage.getItem("idobra"),
      "anyo":e.target.value
    })
    .then((res)=>{
      //  console.log('res Meses', res.data)
        this.setState({
          DataMesesApi: res.data
        })
    })
    .catch((err)=>{
        console.log('ERROR ANG al obtener datos ❌'+ err);
    });
  }

  seleccionaMeses(id_historial,fecha_inicial,fecha_final,mes_act){
    
    this.setState({
      mesActual:mes_act,
    })
    // LLAMA AL API DE MESES
    axios.post(`${UrlServer}/getcronogramaInicio`,{
      "id_ficha":sessionStorage.getItem("idobra"),
      "historialestados_id_historialestado":id_historial,
      "fecha_inicial":fecha_inicial,
      "fecha_final":fecha_final,
    })
    .then((res)=>{
        //console.log('res getcronogramaInicio', res.data)
        this.setState({
          DataValGantAPI: res.data,
          DataEncabezado:encabezadoInforme(fecha_inicial,fecha_final)

        })
    })
    .catch((err)=>{
        console.log('ERROR ANG al obtener datos ❌'+ err);
    });  


  }


  PruebaDatos(){

    var {  DataEncabezado } = this.state

    var DataHist = this.state.DataValGantAPI 
    console.log('DH', DataHist)
    var ValGant = []
    

    // for (let i = 0; i < DataHist.grafico_programado; i++){

      // ValGant1.push (
      //   {
      //       style: 'tableExample',
      //       // color: '#ff0707',
      //       layout: 'lightHorizontalLines',

      //       table: {
      //         widths: ["*"],
      //           body: [
      //                 [
      //                   {
      //                     text: 'CHART',
      //                     style: "tableHeader1",
      //                     alignment: "center",
      //                   }
                        
      //               ],
      //           ]

      //       },
      //   },
      // )
    // }

    //for (let j = 0; j < DataHist.length; j++) {
      
      
      ValGant.push(
        
        {
            
            style: 'tableExample',
            // color: '#ff0707',
            layout: 'lightHorizontalLines',

            table: {
              widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],              
                  
                body: [
                        [
                          {
                            text: 'CHART',
                            style: "TableMontosInforme",
                            alignment: "center",
                            colSpan: 10,
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
                              
                          }                        
                      ],
                        [
                            {
                              text: 'MONTOS VALORIZADOS PROGRAMADOS',
                              style: "TableMontosInforme",
                              alignment: "center",
                              colSpan: 4,
                            },
                            {
                                
                            },
                            {
                                
                            },
                            {
                                
                            },
                            
                            {
                              text: 'MONTOS VALORIZADOS EJECUTADOS',
                              style: "TableMontosInforme",
                              alignment: "center",
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
                                
                            }                        
                        ],
                        [
                          {
                            text: 'PERIODO',
                            style: "tableHeader",
                            alignment: "center",
                            //colSpan: 2,
                          },
                          
                          {
                            text: 'PROGRAMADO',
                            style: "tableHeader",
                            alignment: "center",
                            colSpan: 3,   
                          },
                          {
                              
                          },
                          {
                          
                          },
                          {
                            text: 'FISICO EJECUTADO',
                            style: "tableHeader",
                            alignment: "center",
                            colSpan: 3,  
                          },
                          {
                              
                          },
                          {
                              
                          },
                          {
                            text: 'FINANCIERO EJECUTADO',
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
                          text: 'MES DEL INFORME',
                          style: "tableHeader",
                          alignment: "center",  
                        },
                        {
                          text: 'MONTO S/.',
                          style: "tableHeader",
                          alignment: "center",   
                        },
                        {
                          text: '% EJECUCION PROGRAMADA',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: '% ACUMULADO',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'MONTO S/.',
                          style: "tableHeader",
                          alignment: "center",                           
                        },
                        {
                          text: '% EJECUCION PROGRAMADA',
                          style: "tableHeader",
                          alignment: "center",   
                        },
                        {
                          text: '% ACUMULADO',
                          style: "tableHeader",
                          alignment: "center",   
                        },
                        {
                          text: 'MONTO S/.',
                          style: "tableHeader",
                          alignment: "center",                          
                        },
                        {
                          text: '% EJECUCION PROGRAMADA',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: '% ACUMULADO',
                          style: "tableHeader",
                          alignment: "center",
                        }                        
                    ],
                  ]
                }
            }
        )  
                    DataHist.data.forEach((dato, index)=>{
                      ValGant[0].table.body.push(  
                    [                      
                      {
                        text: dato.periodo,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",  
                      },
                      {
                        text: dato.programado_monto,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",   
                      },
                      {
                        text: dato.programado_porcentaje,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",
                      },
                      {
                        text: dato.fisico_monto,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",
                      },
                      {
                        text: dato.fisico_porcentaje,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",                           
                      },
                      {
                        text: dato.financiero_monto,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",   
                      },
                      {
                        text: dato.financiero_porcentaje,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",   
                      },
                      {
                        text: dato.programado_acumulado,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",                          
                      },
                      {
                        text: dato.fisico_acumulado,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",
                      },
                      {
                        text: dato.financiero_acumulado,
                        style: dato.codigo === 'C'? "tableBodyCorte": "tableBody",
                        alignment: "center",
                      }                        
                  ],
                )
              
              })
    //} 
    
    // console.log('data push' ,ValGant);
    

      var ultimoElemento = ValGant.length -1
      delete ValGant[ultimoElemento].pageBreak
    // // console.log(ArFormat)
  

    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    var docDefinition = {
      header:{
        
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
      
      footer: function(currentPage, pageCount) { 
        return {
          columns: [
            {
              text: currentPage.toString() + ' de ' + pageCount,
              margin: [45, 10, 10, 0],
              fontSize: 9,
            },
            {
              qr: 'http://sigobras.com',
              fit: 40,
              alignment: 'right',
              margin: [20, 10, 10, 0]
            }
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
                        text: 'AVANCE COMPARATIVO DIAGRAMA DE GANTT',
                        style: "tableFechaContent",
                        alignment: "center",
                        margin:[10,0,5,0],
                      }
                    ]
                    
                  ]
                }
          // text: 'AVANCE COMPARATIVO DIAGRAMA DE GANTT',
          // margin: 7,
          // alignment: 'center'
        },

        DataEncabezado,
        
        ValGant
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
          fontSize: 7,
          color: '#000000',
          fillColor: '#8baedb',
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
        tableBodyCorte: {
          bold: true,
          fontSize: 8,
          color: '#000000',
          fillColor: '#ff4040',
        },
        TableHeaderInforme: {
          bold: true,
          fontSize: 9,
          color: '#000000',
          // fillColor: '#ffcf96',
        },
        tableBodyInforme:{
          fontSize: 9,
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
        TableMontosInforme: {
          bold: true,
          fontSize: 9,
          color: '#FFFFFF',
          fillColor: '#3a68af',
        },
        

      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',

    };
    // pdfmake.createPdf(docDefinition)
    var pdfDocGenerator = pdfmake.createPdf(docDefinition);
    pdfDocGenerator.open()

    // pdfDocGenerator.getDataUrl((dataUrl) => {
    //    this.setState({
    //     urlPdf:dataUrl
    //    })
        
        
    // });
    
  }


  render() {
    const { DataValGantAPI, DataAniosApi, DataMesesApi, DataChart, urlPdf } = this.state
    const chartOptions = {
      title: {
        text: ""
      },
      series: [
        {
          data: [[1, "Highcharts"], [1, "React"], [3, "Highsoft"]],
          keys: ["y", "name"],
          type: "pie"
        }
      ]
    };

    return (
      <div>
        <li className="lii">
          <a href="#" onClick={this.ModalReportes} ><FaFilePdf className="text-danger"/> 9.- AVANCE COMPARATIVO DIAGRAMA DE GANT  </a>
        </li>
        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
          <ModalHeader toggle={this.ModalReportes}>9.- AVANCE COMPARATIVO DIAGRAMA DE GANT</ModalHeader>
          <ModalBody>
              
              <Row>
                  <Col sm="2">
                  <fieldset>
                      <legend>Seleccione</legend>
                      
                      <select className="form-control form-control-sm" onChange={ e=>this.seleccionaAnios(e) } >
                          <option value="">Años</option> 
                          {
                            DataAniosApi.map((anios, iA)=>
                              <option key={ iA } value={ anios.anyo }>{anios.anyo }</option>
                            )
                          }                       
                      </select>  
                  </fieldset>

                  </Col>
                  <Col sm="9">
                  { DataMesesApi.length <= 0? "":
                    <fieldset>
                        <legend>Seleccione el Mes</legend>
                        <ButtonGroup size="sm">
                          {
                            DataMesesApi.map((Meses, iM)=>
                              <Button color="primary" key={ iM } onClick={() =>this.seleccionaMeses(Meses.historialestados_id_historialestado, Meses.fecha_inicial, Meses.fecha_fina)}>{ Meses.codigo }</Button>
                            )
                          }

                        </ButtonGroup>
                        
                    
                    </fieldset>
                  }
          
                  </Col>
                  <Col sm="1">
                  {
                    DataValGantAPI.length <= 0 ?"":
                    <button className="btn btn-outline-success" onClick={ this.PruebaDatos }> PDF </button>
                  }

                </Col>
              </Row>
              {/* <div className="text-center text-danger"> EN DESARROLLO 50 % </div> */}
              
              {/* {
              urlPdf.length <= 0 ?<Spinner color="primary" />:
              <iframe src={this.state.urlPdf } style={{height: 'calc(100vh - 50px)'}} width="100%"></iframe>
              } */}
               {/* <HighchartsReact
              highcharts={Highcharts}
              options={DataChart}
              ref={this.myRefChart}
            /> */}
            {/* <ReactHighcharts config={config} ref="chart"></ReactHighcharts> */}



            {
              exporting(Highcharts)
              // App is crashed trigger by exporting function

              
            }
            {/* <Chart options={chartOptions} highcharts={Highcharts} ref={this.myRefChart}/> */}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Report_9;
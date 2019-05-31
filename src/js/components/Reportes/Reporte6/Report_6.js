import React, { Component } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, Row, Col, Spinner } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'



class Report_6 extends Component {
  constructor(){
    super()
    this.state = {
      DataConGenValAPI:[],      
      DataAniosApi:[],
      DataMesesApi:[],
      ValPresupuesto:[],
      modal: false,
      DataEncabezado:[],
      urlPdf: '',

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
    axios.post(`${UrlServer}/getAnyoReportes`,{
      "id_ficha":sessionStorage.getItem("idobra")
    })
    .then((res)=>{
         //console.log('res ANIOS', res.data)
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
  
  seleccionaMeses(id_historial, fecha_inicial,fecha_final){
    // LLAMA AL API DE MESES
    axios.post(`${UrlServer}/valorizacionMayoresMetrados`,{
      "id_ficha":sessionStorage.getItem("idobra"),
      "historialestados_id_historialestado":id_historial,      
      "fecha_inicial":fecha_inicial,
      "fecha_final":fecha_final,
    })
    .then((res)=>{
        console.log('res valorizacionMayoresMetrados', res.data)
        this.setState({
          DataConGenValAPI: res.data,
          DataEncabezado:encabezadoInforme(fecha_inicial,fecha_final)

        })
    })
    .catch((err)=>{
        console.log('ERROR ANG al obtener datos ❌'+ err);
    });


    


  }

  

  PruebaDatos(){

    var {  DataEncabezado } = this.state

    var DataHist = this.state.DataConGenValAPI
    //console.log('DH', DataHist)


    // DataHist = DataHist.filter((item)=>{
    //   return item.numero_periodo.toLowerCase().search(
    //     mes.toLowerCase()) !== -1;
    // });  


    var ValPresupuesto = []

    for (let i = 0; i < DataHist.length; i++) {

      ValPresupuesto.push (
        
        {
            style: 'tableExample',
            // color: '#ff0707',
            layout: 'lightHorizontalLines',

            table: {
              widths: [20, 80,10,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25],
                body: [
                      [
                        {
                          text: 'C - '+ DataHist[i].numero,
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: DataHist[i].nombre,
                          style: "tableHeader",
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
                          text: 'S/. ' + DataHist[i].presupuesto,
                          style: "tableHeader",
                          alignment: "center",
                          colSpan: 2,
                        },
                        {
                        
                        }
                    ],


                    [
                        {
                            text: 'PARTIDA ',
                            style: "tableHeader",
                            alignment: "center",
                            rowSpan: 3,
                        },
                        {
                          rowSpan: 3,
                          text: 'DESCRIPCION',
                          style: "tableHeader",
                          alignment: "center",
                        
                        },
                        {
                          text: 'UND ',
                          style: "tableHeader",
                          alignment: "center",
                          rowSpan: 3,
                        },
                        {
                          text: 'PRESUPUESTO PROGRAMADO',
                          style: "tableHeader",
                          alignment: "center",
                          rowSpan: 2,
                          colSpan: 3,
                        },
                        {
                        
                        },
                        {
                        
                        },                            
                        {
                          text: 'NOVIEMBRE DEL 2018',
                          style: "tableHeader",
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
                        },
                        {
                        
                        },
                        {
                        
                        },
                        {
                          text: 'ACTUAL',
                          style: "tableHeader",
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
                        },
                        {
                          text: 'P. UNIT. S/.',
                          style: "tableHeader",
                          alignment: "center",
                        
                        },
                        {
                          text: 'PRESUP. S/.',
                          style: "tableHeader",
                          alignment: "center",
                        
                        },                            
                        {
                          text: 'METRADO',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'P. UNIT. S/.',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'PRESUP. S/.',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'METRADO',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'P. UNIT. S/.',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'PRESUP. S/.',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'METRADO',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'P. UNIT. S/.',
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: 'PRESUP. S/.',
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

         //console.log('ddatos', DataHist[i].partidas[j]);
        

        ValPresupuesto[i].table.body.push( 
          [
            {
              text:DataHist[i].partidas[j].item,
              style:"tablaValorizacion",
            },
            {
              text: DataHist[i].partidas[j].descripcion,
              style:"tablaValorizacion",
            
            },
            {
              text: DataHist[i].partidas[j].unidad_medida,
              style:"tablaValorizacion",
            },
            {
              text: DataHist[i].partidas[j].metrado,
              style:"tablaValorizacion",                           
            },
            {
              text:  DataHist[i].partidas[j].costo_unitario,
              style:"tablaValorizacion",
            
            },
            {
              text:  DataHist[i].partidas[j].valor_total,
              style:"tablaValorizacion",
            
            },                            
            {
              text:  DataHist[i].partidas[j].metrado_anterior,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].valor_anterior,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].porcentaje_anterior,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].valor_anterior,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].metrado_actual,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].valor_actual,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].metrado_total,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].valor_total,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].porcentaje_total,
              style:"tablaValorizacion",
            },                            
            {
              text:  DataHist[i].partidas[j].metrado_saldo,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].valor_saldo,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[i].partidas[j].porcentaje_saldo,
              style:"tablaValorizacion",
            }
          ]
        )
      }

    }

      
    
    // console.log('data push' ,ValPresupuesto);
    

    var ultimoElemento = ValPresupuesto.length -1
    delete ValPresupuesto[ultimoElemento].pageBreak


    var { DataEncabezado } = this.state


    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    var docDefinition = {
      header:{
        
        columns: [
          {
            image: logoGRPuno,
            fit: [280, 280],
            margin: [45, 12, 10, 0]
          },
          // {
          //   alignment: 'right',
          //   image: logoSigobras,
          //   width: 48,
          //   height: 30,
          //   margin: [20, 10, 10, 0]
            
          // }
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
              margin: [20, 0, 10, 0]
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
                        text: 'CONSOLIDADO GENERAL DE LAS VALORIZACIONES ( Presupuesto Base + Part. Adicionale )',
                        style: "tableFechaContent",
                        alignment: "center",
                        margin:[10,0,5,0],
                      }
                    ]
                    
                  ]
                }
          // text: 'VALORIZACIÓN POR MAYORES METRADOS',
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
          fillColor: '#ffcf96',
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
          fontSize: 9,
          color: '#000000',
          // fillColor: '#ffcf96',
        },
        tableBodyInforme:{
          fontSize: 9,
          color: '#000000',
        }
        

      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',

    };

    var pdfDocGenerator = pdfmake.createPdf(docDefinition);
    pdfDocGenerator.open()
    // pdfmake.createPdf(docDefinition)
    // var pdfDocGenerator = pdfmake.createPdf(docDefinition);

    // pdfDocGenerator.getDataUrl((dataUrl) => {
    //   this.setState({
    //     urlPdf:dataUrl
    //    })
    //     // const targetElement = document.getElementById('iframeContainer');
    //     // const iframe = document.createElement('iframe');
    //     // iframe.src = dataUrl;
    //     // iframe.style.width = "100%";
    //     // iframe.style.height = "100%";
    //     // iframe.frameBorder = 0;

    //     // targetElement.appendChild(iframe);
    // });
    
  }


  render() {
    const { DataConGenValAPI,DataAniosApi, DataMesesApi,urlPdf } = this.state
    
    return (
      <div>
        <li className="lii">
          <a href="#" onClick={this.ModalReportes} ><FaFilePdf className="text-danger"/> 6.- CONSOLIDADO GENERAL DE LAS VALORIZACIONES ( Presupuesto Base + Part. Adicionale ) ✔  </a>
        </li>
        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
          <ModalHeader toggle={this.ModalReportes}> 6.- CONSOLIDADO GENERAL DE LAS VALORIZACIONES ( Presupuesto Base + Part. Adicionale ) </ModalHeader>
          <ModalBody>
              <Row>
              <Col sm="2">
                <fieldset>
                    <legend>Seleccione</legend>
                    
                    <select className="form-control form-control-sm"  onChange={ e=>this.seleccionaAnios(e) }  >
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
                  <legend>Seleccione Mes</legend>
                  <ButtonGroup size="sm">
                  {
                    DataMesesApi.map((Meses, iM)=>
                      <Button color="primary" key={ iM } onClick={() =>this.seleccionaMeses(Meses.historialestados_id_historialestado, Meses.fecha_inicial, Meses.fecha_final)}>{ Meses.codigo }</Button>
                    )
                  }

                  </ButtonGroup>
                </fieldset>
              }
                </Col>
              
                <Col sm="1">
                {
                  DataConGenValAPI.length <= 0 ?"":
                  <button className="btn btn-outline-success" onClick={ this.PruebaDatos }>PDF</button>
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

export default Report_6;       
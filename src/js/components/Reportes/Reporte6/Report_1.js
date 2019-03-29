import React, { Component } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody,Row,Col,Button,ButtonGroup } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'

class Report_1 extends Component {
  constructor(){
    super()
    this.state = {
      DataHistorialApi:[],
      DataAniosApi:[],
      DataMesesApi:[],
      //DataHistorial:[],
      modal: false,
      DataEncabezado:[],
      urlPdf: '',
    }

    this.ModalReportes = this.ModalReportes.bind(this)
    this.makePdf = this.makePdf.bind(this)
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

  seleccionaMeses(id_historial,fecha_inicial,fecha_final){
    // LLAMA AL API DE MESES
    axios.post(`${UrlServer}/CuadroMetradosEjecutados`,{
      "id_ficha":sessionStorage.getItem("idobra"),
      "historialestados_id_historialestado":id_historial,
      "fecha_inicial":fecha_inicial,
      "fecha_final":fecha_final,
    })
    .then((res)=>{
        //console.log('res CuadroMetradosEjecutados', res.data)
        this.setState({
          DataHistorialApi: res.data,
          DataEncabezado:encabezadoInforme(fecha_inicial,fecha_final)

        })
    })
    .catch((err)=>{
        console.log('ERROR ANG al obtener datos ❌'+ err);
    });


    


  }



  makePdf(){

    
    var {  DataEncabezado } = this.state



    //ARMAMOS DATA PARA GENERAR EL PDF DE METRADOS EJECUTADOS

    var DataHist = this.state.DataHistorialApi
    console.log('DH', DataHist)

    var ArFormat = []

    for (let i = 0; i < DataHist.length; i++) {
      ArFormat.push(
        {
          style: 'tableExample',
          // color: '#ff0707',
          layout: 'lightHorizontalLines',

          table: {
            widths: ['*', 230, '*', '*', '*', '*', '*', '*'],
            body: [
            [
              {
                text: 'COMPONENTE N°: ' + DataHist[i].numero,
                style: "tableHeader",
                alignment: "center"
              },
              {
                text: DataHist[i].nombre_componente,
                style: "tableHeader",
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
          
              },
              {
                text: 'S/.'  + DataHist[i].componente_total_soles,
                style: "tableHeader",
                alignment: "center"
              }
            ],
              // ---------------------
            // contenido
        
            [
              {
                text: 'ITEM',
                style: 'tableHeader',
                alignment: 'center'
              },
              {
                text: 'PARTIDA',
                style: 'tableHeader',
                alignment: 'center'
              },
              {
                text: 'ACTIVIDAD',
                style: 'tableHeader',
                alignment: 'center'
              },
              {
                text: 'DESCRIPCION',
                style: 'tableHeader',
                alignment: 'center'
              },
              {
                text: 'OBSERVACION',
                style: 'tableHeader',
                alignment: 'center'
              },
              {
                text: 'M. EJECUTADO',
                style: 'tableHeader',
                alignment: 'center'
              },
              {
                text: 'S/. C / U',
                style: 'tableHeader',
                alignment: 'center'
              },
              {
                text: 'S/. TOTAL',
                style: 'tableHeader',
                alignment: 'center'
              }
            ]
          ]
          },
          pageBreak: 'after',
        }
      )
      // console.log('ArFormat', ArFormat[0].table.body)

        for (let j = 0; j < DataHist[i].fechas.length; j++) {
          // console.log(i, 'dhssss', DataHist[i].fechas[j].fecha, 'index j' , j)
          ArFormat[i].table.body.push(
            // .........................
            [
              {
                text: "FECHA : "+ DataHist[i].fechas[j].fecha,
                style: "tableFecha",
                // alignment: "center",
                colSpan: 7,
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
                text: "Por fecha S/. " + DataHist[i].fechas[j].fecha_total_soles,
                style: "tableFecha",
              }
            ]
          )
      // console.log('ArFormat2', ArFormat[i].table.body)
          
          for (let k = 0; k <  DataHist[i].fechas[j].historial.length; k++) {
            ArFormat[i].table.body.push(
              [
                {
                  text: DataHist[i].fechas[j].historial[k].item,
                  style: 'tableBody',
                  // alignment: 'center'
                },
                {
                  text: DataHist[i].fechas[j].historial[k].descripcion_partida,
                  style: 'tableBody',
                  // alignment: 'center'
                },
                {
                  text: DataHist[i].fechas[j].historial[k].nombre_actividad,
                  style: 'tableBody',
                },
                {
                  text: DataHist[i].fechas[j].historial[k].descripcion_actividad,
                  style: 'tableBody',
                  alignment: 'center'
                },
                {
                  text: DataHist[i].fechas[j].historial[k].observacion,
                  style: 'tableBody',
                  alignment: 'center'
                },
                {
                  text: DataHist[i].fechas[j].historial[k].valor,
                  style: 'tableBody',
                  alignment: 'center'
                },
                {
                  text: DataHist[i].fechas[j].historial[k].costo_unitario,
                  style: 'tableBody',
                  alignment: 'center'
                },
                {
                  text: DataHist[i].fechas[j].historial[k].parcial,
                  style: 'tableBody',
                  alignment: 'center'
                }
              ]
            )
          }
        }
    }

    var ultimoElemento = ArFormat.length -1
    delete ArFormat[ultimoElemento].pageBreak


    // GENERA EL FORMATO PDF
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
            width: 40,
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
          text: 'CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales)',
          margin: 7,
          alignment: 'center'
        },

        DataEncabezado,
        
        ArFormat
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
          fillColor: '#ffcf96',
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
    // pdfmake.createPdf(docDefinition)
    var pdfDocGenerator = pdfmake.createPdf(docDefinition);

    pdfDocGenerator.getDataUrl((dataUrl) => {
       this.setState({
        urlPdf:dataUrl
       })
        
        
    });
  
  }

  render() {
    const { DataHistorialApi, DataAniosApi, DataMesesApi } = this.state
      return (
        <div> 

          <li className="lii">
              <a href="#"  onClick={this.ModalReportes} ><FaFilePdf className="text-danger"/> 1- CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales) ✔</a>
          </li>

          <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
            <ModalHeader toggle={this.ModalReportes}>1.- CUADRO DE METRADOS EJECUTADOS </ModalHeader>
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
                              <Button color="primary" key={ iM } onClick={() =>this.seleccionaMeses(Meses.historialestados_id_historialestado, Meses.fecha_inicial, Meses.fecha_final)}>{ Meses.codigo }</Button>
                            )
                          }

                        </ButtonGroup>
                        
                    
                    </fieldset>
                  }
          
                  </Col>
                  <Col sm="1">
                  {
                    DataHistorialApi.length <= 0 ?"":
                    <button className="btn btn-outline-success" onClick={ this.makePdf }> PDF </button>
                  }

                </Col>
              </Row>
              
              <iframe src={this.state.urlPdf } style={{height: 'calc(100vh - 50px)'}} width="100%"></iframe>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Report_1;
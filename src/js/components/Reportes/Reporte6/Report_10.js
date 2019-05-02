import React, { Component } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, Row, Col } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'



class Report_10 extends Component {
  constructor(){
    super()
    this.state = {
      DataValGantAPI:[],
      DataAniosApi:[],
      DataMesesApi:[],
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

  seleccionaMeses(id_historial, fecha){
    // LLAMA AL API DE MESES
    axios.post(`${UrlServer}/CuadroMetradosEjecutados`,{
      "id_ficha":sessionStorage.getItem("idobra"),
      "historialestados_id_historialestado":id_historial,
      "fecha":fecha
    })
    .then((res)=>{
        //console.log('res CuadroMetradosEjecutados', res.data)
        this.setState({
          DataValGantAPI: res.data,
          DataEncabezado:encabezadoInforme()

        })
    })
    .catch((err)=>{
        console.log('ERROR ANG al obtener datos ❌'+ err);
    });


    


  }


  PruebaDatos(){

    var {  DataEncabezado } = this.state

    var DataHist = this.state.DataValGantAPI
    


    // DataHist = DataHist.filter((item)=>{
    //   return item.numero_periodo.toLowerCase().search(
    //     mes.toLowerCase()) !== -1;
    // });  


    var ValGant = []

   

      ValGant.push (
        {
            style: 'tableExample',
            // color: '#ff0707',
            layout: 'lightHorizontalLines',

            table: {
              widths: ["*"],
                body: [
                      [
                        {
                          text: 'CHART',
                          style: "tableHeader1",
                          alignment: "center",
                        }
                        
                    ],
                ]

            },
        },
        {
            
            style: 'tableExample',
            // color: '#ff0707',
            layout: 'lightHorizontalLines',

            table: {
              widths: [20,20,20,20,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
                text: 'CHART',
                style: "tableHeader",
                alignment: "center",
    
                body: [
                        [
                            {
                                text: 'TIEMPO',
                                style: "tableHeader",
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
                            text: 'PROGRAMADO',
                            style: "tableHeader",
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
                            text: 'FISICO EJECUTADO',
                            style: "tableHeader",
                            alignment: "center",
                            colSpan: 5,
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
                            text: 'FINANCIERO EJECUTADO',
                            style: "tableHeader",
                            alignment: "center",
                            colSpan: 5,
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
                          text: 'MES',
                          style: "tableHeader",
                          alignment: "center",
                        
                        },
                        {
                        text: 'FECHA DE INICIO',
                        style: "tableHeader",
                        alignment: "center",  
                        },
                        {
                        text: 'DIAS PARCIAL',
                        style: "tableHeader",
                        alignment: "center",   
                        },
                        {
                        text: 'DIAS ACUMULADOS',
                        style: "tableHeader",
                        alignment: "center",    
                        },
                        {
                        text: 'COSTO MENSUAL PROGRAMADO',
                        style: "tableHeader",
                        alignment: "center",
                        
                        },
                        {
                        text: 'COSTO ACUMALADO MENSUAL PROGRAMADO',
                        style: "tableHeader",
                        alignment: "center",   
                        },
                        {
                        text: 'AVANCE MENSUAL PROGRAMADO EN %',
                        style: "tableHeader",
                        alignment: "center",
                        },
                        {
                        text: 'AVANCE MENSUAL ACUMULADO PROGRAMDO EN %',
                        style: "tableHeader",
                        alignment: "center",
                        },
                        {
                        text: 'AVANCE MENSUAL EJECUTADO',
                        style: "tableHeader",
                        alignment: "center",
                        
                        },
                        {
                        text: 'AVANCE MENSUAL ACUMULADO EJECUTADO',
                        style: "tableHeader",
                        alignment: "center",    
                        },
                        {
                        text: 'AVANCE MENSUAL EJECUTADO EN %',
                        style: "tableHeader",
                        alignment: "center",
                        },
                        {
                        text: 'AVANCE MENSUAL ACUMULADO EJECUTADO EN %',
                        style: "tableHeader",
                        alignment: "center",
                        },
                        {
                        text: 'DESVIACION DE EJECUCION FISICA',
                        style: "tableHeader",
                        alignment: "center",
                        },
                        {
                        text: 'AVANCE MENSUAL FINANCIERO',
                        style: "tableHeader",
                        alignment: "center",
                        
                        },
                        {
                        text: 'AVANCE MENSUAL ACUMULADO FINANCIERO',
                        style: "tableHeader",
                        alignment: "center",    
                        },
                        {
                        text: 'AVANCE MENSUAL FINANCIERO EN %',
                        style: "tableHeader",
                        alignment: "center",   
                        },
                        {
                        text: 'AVANCE MENSUAL ACUMULADO FINANCIERO EN %',
                        style: "tableHeader",
                        alignment: "center",
                        },
                        {
                        text: 'DESVIACION DE EJECUCION FINANCIERA',
                        style: "tableHeader",
                        alignment: "center",
                        margin: [0, 0, 2, 0]
                        }                        
                    ],
                    [
                        {
                          text: 'Enero',
                          style: "tableFecha",
                          alignment: "center",
                        
                        },
                        {
                        text: 'qw12221',
                        style: "tableFecha",
                        alignment: "center",  
                        },
                        {
                        text: 'qwert',
                        style: "tableFecha",
                        alignment: "center",   
                        },
                        {
                        text: 'tynwv',
                        style: "tableFecha",
                        alignment: "center",    
                        },
                        {
                        text: 'hnhu',
                        style: "tableFecha",
                        alignment: "center",
                        
                        },
                        {
                        text: 'mgughnh',
                        style: "tableFecha",
                        alignment: "center",   
                        },
                        {
                        text: 'yjmtymj',
                        style: "tableFecha",
                        alignment: "center",
                        },
                        {
                        text: 'fhrjty',
                        style: "tableFecha",
                        alignment: "center",
                        },
                        {
                        text: 'hrthbrh',
                        style: "tableFecha",
                        alignment: "center",
                        
                        },
                        {
                        text: 'hbtrhbhb',
                        style: "tableFecha",
                        alignment: "center",    
                        },
                        {
                        text: 'thbrbh',
                        style: "tableFecha",
                        alignment: "center",
                        },
                        {
                        text: 'hebthhbr',
                        style: "tableFecha",
                        alignment: "center",
                        },
                        {
                        text: 'wrgtrtyj',
                        style: "tableFecha",
                        alignment: "center",
                        },
                        {
                        text: 'thbrbh',
                        style: "tableFecha",
                        alignment: "center",
                        
                        },
                        {
                        text: 'ethrartbh',
                        style: "tableFecha",
                        alignment: "center",    
                        },
                        {
                        text: 'sfdfgs',
                        style: "tableFecha",
                        alignment: "center",   
                        },
                        {
                        text: 'Affefe%',
                        style: "tableFecha",
                        alignment: "center",
                        },
                        {
                        text: 'asfdggdfg',
                        style: "tableFecha",
                        alignment: "center",
                        margin: [0, 0, 2, 0]
                        }                        
                    ],
                ]

            }
        }
      ) 
    
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
          text: 'HISTOGRAMA DEL AVANCE DE OBRAS (Curva S)',
          margin: 7,
          alignment: 'center'
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
    const { DataValGantAPI, DataAniosApi, DataMesesApi } = this.state
    return (
      <div>
        <li className="lii">
          <a href="#" onClick={this.ModalReportes} ><FaFilePdf className="text-danger"/> 10.- HISTOGRAMA DEL AVANCE DE OBRAS (Curva S) ✔ FALTA API KAI</a>
        </li>
        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
          <ModalHeader toggle={this.ModalReportes}> 10.- HISTOGRAMA DEL AVANCE DE OBRAS (Curva S)</ModalHeader>
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
                              <Button color="primary" key={ iM } onClick={() =>this.seleccionaMeses(Meses.historialestados_id_historialestado, Meses.fecha)}>{ Meses.codigo }</Button>
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
              
              <iframe src={this.state.urlPdf } style={{height: 'calc(100vh - 50px)'}} width="100%"></iframe>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Report_10;
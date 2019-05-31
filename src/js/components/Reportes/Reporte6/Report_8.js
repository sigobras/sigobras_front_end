import React, { Component } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody,Row,Col,Button,ButtonGroup, Spinner } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'

class Report_8 extends Component {
  constructor(){
    super()
    this.state = {
      DataAvanMensApi:[],
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
    axios.post(`${UrlServer}/avanceMensualComparativoPresupuesto`,{
      "id_ficha":sessionStorage.getItem("idobra"),
      "historialestados_id_historialestado":id_historial,
      "fecha_inicial":fecha_inicial,
      "fecha_final":fecha_final,
    })
    .then((res)=>{
        //console.log('res avanceMensualComparativoPresupuesto', res.data)
        this.setState({
          DataAvanMensApi: res.data,
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

    var DataHist = this.state.DataAvanMensApi
    

    var ArFormat = []

    for (let i = 0; i < DataHist.length; i++) {
        //for (let j = 0; j < DataHist[i].partidas.length; j++) {
            //console.log('DH', DataHist[i].partidas[j].item)
            ArFormat.push(
                {
                  style: 'tableExample',
                  // color: '#ff0707',
                  layout: 'lightHorizontalLines',
        
                  table: {
                    headerRows: 3,
                    widths: ['auto', '*', 25, 27, 27, 27, 27, 27,27, 27, 27, 27, 27, 27, 27],
                    body: [
                            [
                                {  
                                text: 'CONSTRUCION DE INFRAESTRUCTURA' ,
                                style: "TableMontosInforme",
                                alignment: "center",
                                colSpan: 15,
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
                            ],
                            [
                                {   
                                    rowSpan: 2,
                                    text: 'ITEM' ,
                                    style: "tableHeader",
                                    alignment: "center"
                                },
                                {
                                    rowSpan: 2,
                                    text: 'ESPECIFICACIONES',
                                    style: "tableHeader",
                                    alignment: "center",
                                    
                                },
                                {
                                    rowSpan: 2,
                                    text: 'UND',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    rowSpan: 2,
                                    text: 'METRADO PROGR.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    rowSpan: 2,
                                    text: 'COSTO UNID.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    rowSpan: 2,
                                    text: 'M. E. ANTERIOR',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    rowSpan: 2,
                                    text: 'VAL. ANT. S/.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    rowSpan: 2,
                                    text: 'M. E. ACTUAL',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    rowSpan: 2,
                                    text: 'VAL. ACT. S/.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    rowSpan: 2,
                                    text: 'M. E. ACUNULADO ',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    rowSpan: 2,
                                    text: 'VAL. ACUM. S/.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'DIFERENCIA',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan: 2,
                                },
                                {
                                    
                                },
                                {
                                    text: 'PORCENTAJE',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan: 2,
                                    
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
                                    text: '+',
                                    style: "tableHeader",
                                    alignment: "center",
                                    
                                },
                                {
                                    text: '-',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: '+',
                                    style: "tableHeader",
                                    alignment: "center",
                                    
                                },
                                {
                                    text: '-',
                                    style: "tableHeader",
                                    alignment: "center",
                                    margin: [0, 0, 10, 0]
                                },
                            ],
                            
                            // ---------------------
                    // contenido
                            
                    
                  ]
                  },
                  pageBreak: 'after',
                }
              )
        //console.log('ArFormat', ArFormat[0].table.body)
        //console.log('DataHist', DataHist )
        for (let j = 0; j < DataHist[i].partidas.length; j++) {
            //console.log('DH', DataHist[i].partidas[j].item)
                ArFormat[i].table.body.push(
                    [
                        {
                        text: DataHist[i].partidas[j].item,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].descripcion,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].unidad_medida,
                        style: 'tableBody',
                        },
                        {
                        text: DataHist[i].partidas[j].metrado,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].costo_unitario,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].Metrado_Ejecutado_Anterior,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].Valorizado_Anterior,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].Metrado_Ejecutado_Actual,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {   
                        text: DataHist[i].partidas[j].Valorizado_actual,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].Metrado_Ejecutado_Acumulado,
                        style: 'tableBody',
                        // alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].Valorizado_Acumulado,
                        style: 'tableBody',
                        // alignment: 'center'
                        },                        
                        {
                        text: DataHist[i].partidas[j].Diferencia_Mas,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].Diferencia_Menos,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].Porcentaje_Mas,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        {
                        text: DataHist[i].partidas[j].Porcentaje_Menos,
                        style: 'tableBody',
                        //alignment: 'center'
                        },
                        
                    ]
                )
        //}
      
      // console.log('ArFormat', ArFormat[0].table.body)
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
            // {
            //   qr: 'http://sigobras.com',
            //   fit: 40,
            //   alignment: 'right',
            //   margin: [20, 10, 10, 0]
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
                        text: 'AVANCES MENSUALES COMPARATIVOS DE ACUERDO AL PRESUPUESTO DE LA OBRA Y RESUMEN DE LAS VALORIZACIONES',
                        style: "tableFechaContent",
                        alignment: "center",
                        margin:[10,0,5,0],
                      }
                    ]
                    
                  ]
                }
          // text: 'AVANCES MENSUALES COMPARATIVOS DE ACUERDO AL PRESUPUESTO DE LA OBRA Y RESUMEN DE LAS VALORIZACIONES',
          // margin: 7,
          // alignment: 'center'
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
        

      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      //pageMargins: [40, 40, 0, 0],


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
    const { DataAvanMensApi, DataAniosApi, DataMesesApi,urlPdf } = this.state
      return (
        <div> 

          <li className="lii">
              <a href="#"  onClick={this.ModalReportes} ><FaFilePdf className="text-danger"/> 8.- AVANCES MENSUALES COMPARATIVOS DE ACUERDO AL PRESUPUESTO DE LA OBRA Y RESUMEN DE LAS VALORIZACIONES ✔ </a>
          </li>

          <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
            <ModalHeader toggle={this.ModalReportes}>8.- AVANCES MENSUALES COMPARATIVOS DE ACUERDO AL PRESUPUESTO DE LA OBRA Y RESUMEN DE LAS VALORIZACIONES </ModalHeader>
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
                    DataAvanMensApi.length <= 0 ?"":
                    <button className="btn btn-outline-success" onClick={ this.makePdf }> PDF </button>
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

export default Report_8;
import React, { Component } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody,Row,Col,Button,ButtonGroup } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'

class Report_7 extends Component {
  constructor(){
    super()
    this.state = {
      DataResAvanFisApi:[],      
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
    axios.post(`${UrlServer}/resumenAvanceFisicoPartidasObraMes`,{
      "id_ficha":sessionStorage.getItem("idobra"),
      "historialestados_id_historialestado":id_historial,
      "fecha_inicial":fecha_inicial,
      "fecha_final":fecha_final,
    })
    .then((res)=>{
        //console.log('res resumenAvanceFisicoPartidasObraMes', res.data)
        this.setState({
          DataResAvanFisApi: res.data,
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

    var DataHist = this.state.DataResAvanFisApi
    console.log('DataHist',DataHist)

    // ARMAMOS LAS COLUMNAS

    var ColunasHeader = []

    var widthsTabla = []
    for (let a = 0; a < DataHist.cabecereras.length; a++) {
      ColunasHeader.push(
        {
            text:DataHist.cabecereras[a],
            style: 'tableHeader',
            alignment: 'center'
        }
      )

      widthsTabla.push(
        "*"
      )
    }
    
    console.log('imprimos ColunasHeader', ColunasHeader)



  var ArFormat = []
  for (let i = 0; i < DataHist.componentes.length; i++) {
    ArFormat.push(
      {
        style: 'tableExample',
        layout: 'lightHorizontalLines',

        table: {

          widths: widthsTabla,   
          body: [
            ColunasHeader,
          ]
        },
        pageBreak: 'after',
      }
    )

    // añadimos mas datos al header
    for (let j = 0; j < DataHist.componentes[i].partidas.length; j++) {

      
      var arrTemp = []

      for (let k = 0; k <  DataHist.componentes[i].partidas[j].length; k++) {

        // console.log('DataHist>>',  DataHist.componentes[i].partidas[j])
        

        arrTemp.push(
          {
            text:  DataHist.componentes[i].partidas[j][k]||"",
            style: 'tableBody',
            // alignment: 'center'
          }
        )
        
      }

      ArFormat[i].table.body.push(
        arrTemp
      )
      // console.log('temoporal array ', arrTemp)
    }
  }
  console.log('arformat>', ArFormat)
    
    var ultimoElemento = ArFormat.length -1
    delete ArFormat[ultimoElemento].pageBreak

    // console.log('arformat>', ArFormat)

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
          text: 'AVANCES MENSUALES COMPARATIVOS DE ACUERDO AL PRESUPUESTO DE LA OBRA Y RES',
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
          // margin: [0, 5, 0, 10]
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

    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.setState({
        urlPdf:dataUrl
      })
    });
  
  }

  render() {
    const { DataResAvanFisApi, DataAniosApi, DataMesesApi } = this.state
      return (
        <div> 

          <li className="lii">
              <a href="#"  onClick={this.ModalReportes} ><FaFilePdf className="text-danger"/> 7.- RESUMEN DE AVANCE FISICO DE LAS PARTIDAS DE OBRA POR MES Y % (METRADOS) </a>
          </li>

          <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
            <ModalHeader toggle={this.ModalReportes}> 7.- RESUMEN DE AVANCE FISICO DE LAS PARTIDAS DE OBRA POR MES Y % (METRADOS) </ModalHeader>
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
                              <Button key={ iM } onClick={() =>this.seleccionaMeses(Meses.historialestados_id_historialestado, Meses.fecha_inicial, Meses.fecha_final)}>{ Meses.codigo }</Button>
                            )
                          }

                        </ButtonGroup>
                        
                    
                    </fieldset>
                  }
          
                  </Col>
                  <Col sm="1">
                  {
                    DataResAvanFisApi.length <= 0 ?"":
                    <button className="btn btn-outline-success" onClick={ this.makePdf }> PDF </button>
                  }

                </Col>
              </Row>
              <div className="text-center text-danger"> EN DESARROLLO </div>
              <iframe src={this.state.urlPdf } style={{height: 'calc(100vh - 50px)'}} width="100%"></iframe>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Report_7;
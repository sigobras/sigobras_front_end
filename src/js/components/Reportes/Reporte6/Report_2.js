import React, { Component } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, Row, Col } from 'reactstrap';
import { FaFilePdf } from "react-icons/fa";

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'



class Report_2 extends Component {
  constructor(){
    super()
    this.state = {
      DataValGeneralAPI:[],
      ValPresupuesto:[],
      modal: false,
      DataEncabezado:[],
      UrlPdf:''
    }

    this.ModalReportes = this.ModalReportes.bind(this)
    this.PruebaDatos = this.PruebaDatos.bind(this)
    this.Valprincipal = this.Valprincipal.bind(this)

  }

  componentWillMount(){
    axios.post(`${UrlServer}/valorizacionPrincipal`,{
      "id_ficha":sessionStorage.getItem("idobra")
    })
    .then((res)=>{
        console.log('Val principal', res.data)
        this.setState({
            DataValGeneralAPI: res.data
        })
    })
    .catch((err)=>{
        console.log('ERROR ANG al obtener datos ❌'+ err);
    });
  }

  ModalReportes() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  PruebaDatos(mes){
    var DataHist = this.state.DataValGeneralAPI
    


    DataHist = DataHist.filter((item)=>{
      return item.numero_periodo.toLowerCase().search(
        mes.toLowerCase()) !== -1;
    });  


    var ValPresupuesto = []

    for (let i = 0; i < DataHist[0].componentes.length; i++) {

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
                          text: 'COMP. N° : '+ DataHist[0].componentes[i].componente_numero,
                          style: "tableHeader",
                          alignment: "center",
                        },
                        {
                          text: DataHist[0].componentes[i].nombre,
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
                          text: 'Presupuesto : S/. ' + DataHist[0].componentes[i].presupuesto,
                          style: "tableHeader",
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
                            rowSpan: 3,
                        },
                        {
                          rowSpan: 3,
                          text: 'DESCRIPCION',
                          style: "tableHeader",
                          alignment: "center",
                        
                        },
                        {
                          text: 'UND: ',
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
                          text: 'PARTIDA: ',
                          style: "tableHeader",
                          alignment: "center"
                        },
                        {
                          text: 'DESCRIPCION',
                          style: "tableHeader",
                          alignment: "center",
                        
                        },
                        {
                          text: 'UND: ',
                          style: "tableHeader",
                          alignment: "center"
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
                          text: 'PARTIDA: ',
                          style: "tableHeader",
                          alignment: "center"
                        },
                        {
                          text: 'DESCRIPCION',
                          style: "tableHeader",
                          alignment: "center",
                        
                        },
                        {
                          text: 'UND: ',
                          style: "tableHeader",
                          alignment: "center"
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

      for (let j = 0; j < DataHist[0].componentes[i].partidas.length; j++) {

        // console.log('ddatos', DataHist[0].componentes[i].partidas[j]);
        

        ValPresupuesto[i].table.body.push( 
          [
            {
              text:DataHist[0].componentes[i].partidas[j].item,
              style:"tablaValorizacion",
            },
            {
              text: DataHist[0].componentes[i].partidas[j].descripcion,
              style:"tablaValorizacion",
            
            },
            {
              text: DataHist[0].componentes[i].partidas[j].unidad_medida,
              style:"tablaValorizacion",
            },
            {
              text: DataHist[0].componentes[i].partidas[j].metrado,
              style:"tablaValorizacion",                           
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].costo_unitario,
              style:"tablaValorizacion",
            
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].valor_total,
              style:"tablaValorizacion",
            
            },                            
            {
              text:  DataHist[0].componentes[i].partidas[j].metrado_anterior,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].valor_anterior,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].porcentaje_anterior,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].valor_anterior,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].metrado_actual,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].valor_actual,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].metrado_total,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].valor_total,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].porcentaje_total,
              style:"tablaValorizacion",
            },                            
            {
              text:  DataHist[0].componentes[i].partidas[j].metrado_saldo,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].valor_saldo,
              style:"tablaValorizacion",
            },
            {
              text:  DataHist[0].componentes[i].partidas[j].porcentaje_saldo,
              style:"tablaValorizacion",
            }
          ]
        )
      }

    }

      
    
    // console.log('data push' ,ValPresupuesto);
    

    var ultimoElemento = ValPresupuesto.length -1
    delete ValPresupuesto[ultimoElemento].pageBreak
    // // console.log(ArFormat)
    this.setState({
        ValPresupuesto,
        DataEncabezado:encabezadoInforme()
    })
    
  }

  Valprincipal(){
    var { ValPresupuesto, DataEncabezado } = this.state
    // this.PruebaDatos()

    // this.setState(prevState => ({
    //   modal: !prevState.modal
    // }));
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
              margin: [20, 0, 10, 0]
            }
          ]
          
        }
      },
       
      content: [
        { 
          text: 'VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE',
          margin: 7,
          alignment: 'center'
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
    // pdfmake.createPdf(docDefinition)
    var pdfDocGenerator = pdfmake.createPdf(docDefinition);

    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.setState({
        UrlPdf:dataUrl
      })
    });
  
  }

  render() {
    const { DataValGeneralAPI, ValPresupuesto } = this.state
    return (
      <div>
        <li className="lii">
          <a href="#" onClick={this.ModalReportes} ><FaFilePdf className="text-danger"/>2.- VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE ✔</a>
        </li>
        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
          <ModalHeader toggle={this.ModalReportes}> VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE</ModalHeader>
          <ModalBody>
              <Row>
                <Col sm="10">
                  <ButtonGroup size="sm">
                    {
                      DataValGeneralAPI.map((General, i)=>
                        <Button key={ i } onClick={() =>this.PruebaDatos(General.numero_periodo)}>{ General.numero_periodo }</Button>
                      )
                    }

                  </ButtonGroup>
                </Col>
                <Col sm="2">
                {
                  ValPresupuesto.length <= 0 ?"Seleccione un periodo":
                  <button className="btn btn-outline-success" onClick={ this.Valprincipal }> Generar Reporte</button>
                }
                </Col>
              </Row>
              
            {/* <div id="iframeContainer" style={{height: 'calc(100vh - 50px)'}}></div> */}

            <iframe src={ this.state.UrlPdf} style={{height: 'calc(100vh - 50px)', width:"100%"}}>
              <p>Your browser does not support iframes.</p>
            </iframe>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Report_2;
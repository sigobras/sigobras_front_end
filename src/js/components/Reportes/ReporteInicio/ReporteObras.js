import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";

import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'

import { UrlServer } from '../../Utils/ServerUrlConfig'

    

class ReporteObras extends Component {
    constructor(){
        super();
        this.state={
            DataEncabezado:[],
            DataApiResumenVal:[],
            DataEstructurado:[],
            modal:false
        }
        this.ModalReportes = this.ModalReportes.bind(this)
        this.ResEstructarData = this.ResEstructarData.bind(this)
        this.resumenVal = this.resumenVal.bind(this)
      }
      
    componentWillMount(){
        axios.post(`${UrlServer}/resumenValorizacionPrincipal`,{
            "id_ficha":sessionStorage.getItem("idobra")
        })
        .then((res)=>{
            // console.info('data val >',res.data)
            this.setState({
                DataApiResumenVal:res.data
            })
        })
        .catch((err)=>{
            console.error('algo salio mal ', err);
        })

        
    }
    

    ModalReportes() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }


    ResEstructarData(){

        var { DataApiResumenVal } = this.state

        var DataRestructurado = []
        DataRestructurado.push(
            {
                style: 'tableExample',
                // color: '#ff0707',
                layout: 'lightHorizontalLines',
    
                table: {
                    widths: [20, 170, '*', '*', '*', '*', '*', '*', '*', '*', '*'],
                    body: [
                            [
                                {
                                    text: 'ITEM',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan: 3,
                                    margin: [ 2, 8, 0, 0]

                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan: 3
                                },
                                {
                                    text: 'MONTO PPTDO',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan: 2
                                },
                                {
                                    text: 'DICIEMBRE DEL 2018',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:6
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
                                    colSpan:2,
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
                                    colSpan:2
                                },
                                {

                                },
                                {
                                    text: 'ACTUAL',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2
                                },
                                {
                                    
                                },
                                {
                                    text: 'ACUMULADO',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2
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




                            [
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "center",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "left",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                              },
                              {
                                  text:' datos',
                                  style: "tableBody",
                                  alignment: "right",
                                  margin: [ 0, 0, 4, 0]
          
                              },
                          ]
                            
                    ]
                }
            }
        )



        // console.log('dat>', DataRestructurado[0].table)

        this.setState({
            DataEstructurado:DataRestructurado,
            DataEncabezado:encabezadoInforme()
        })
        
    }
    

    resumenVal(){
        const { DataEncabezado, DataEstructurado } = this.state

        this.setState(prevState => ({
            modal: !prevState.modal
        }));

        // llamamos la funcion
        this.ResEstructarData()


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
                text: 'RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE',
                margin: 7,
                alignment: 'center'
            },
            
            {
              canvas: [
                {
                  type: 'path',
                  d: 'M 0,20 L 100,160 Q 130,200 150,120 C 190,-40 200,200 300,150 L 400,90',
                  dash: {length: 5},
                  // lineWidth: 10,
                  lineColor: 'blue',
                },
               ]
            },


            DataEncabezado,
            DataEstructurado
            
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
            tableBodyInforme: {
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
            const targetElement = document.getElementById('iframeCtrlEjecucionDirecta');
            const iframe = document.createElement('iframe');
            iframe.src = dataUrl;
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.frameBorder = 0;

            targetElement.appendChild(iframe);
        });
    }
    
    render() {
        return (
            <div>

                <li className="lii">
                    <a href="#"  onClick={this.resumenVal} ><FaFilePdf className="text-danger"/> CONTROL DE EJECUCION DE OBRAS POR ADMINSTRACION DIRECTA</a>
                </li>

                <Modal isOpen={this.state.modal} fade={false} toggle={this.resumenVal} size="xl">
                    <ModalHeader toggle={this.ModalReportes}>CONTROL DE EJECUCION DE OBRAS POR ADMINSTRACION DIRECTA</ModalHeader>
                    <ModalBody>
                        <div id="iframeCtrlEjecucionDirecta" style={{height: 'calc(100vh - 50px)'}}></div>
                    </ModalBody>
                </Modal>
            </div> 
        );
    }
}

export default ReporteObras;
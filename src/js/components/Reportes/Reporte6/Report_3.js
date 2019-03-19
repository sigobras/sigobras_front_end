import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";

import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'

import { UrlServer } from '../../Utils/ServerUrlConfig'

    

class Report_3 extends Component {
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
            console.info('data val >',res.data)
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

        var DataRestructurado = []
        DataRestructurado.push(
            {
                style: 'tableExample',
                // color: '#ff0707',
                layout: 'lightHorizontalLines',
    
                table: {
                    widths: ['*', '*'],
                    body: [
                            [
                                {
                                    text: 'COMPONENTE N°: ',
                                    style: "tableHeader",
                                    alignment: "center"
                                },
                                {
                                    text: 'text',
                                    style: "tableHeader",
                                    alignment: "center",
                                }
                            ]
                    ]
                }
            }
        )
        console.log('dat>', DataRestructurado)

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

            DataEncabezado,

            {
                style: 'tableExample',
                // color: '#ff0707',
                layout: 'lightHorizontalLines',
    
                table: {
                    // widths: ['*', '*'],
                    body: [
                            [
                                {
                                    text: 'ITEM',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan: 3
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
                                    colSpan:5
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    // text: 'SALDO',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    text: 'SALDO',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2

                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                               
                            ],

                            [
                                {
                                    // text: 'ITEM',
                                    // style: "tableHeader",
                                    // alignment: "center"
                                },
                                {
                                    // text: 'Presup. S/.',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    // text: 'Presup. S/.',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    text: 'ANTERIOR',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    text: 'ACTUAL',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2
                                },
                                {
                                    
                                    // text: 'ACTUAL',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    text: 'ACUMULADO',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    text: 'SALDO',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                               
                            ],
                            [
                                {
                                    // text: 'ITEM',
                                    // style: "tableHeader",
                                    // alignment: "center"
                                },
                                {
                                    // text: 'COMPONENTE',
                                    // style: "tableHeader",
                                    // alignment: "center",
                                },
                                {
                                    text: 'Presup. S/.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'COMPONENTE',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                               
                            ],

                            [
                                {
                                    text: '6565',
                                    style: "tableBody",
                                    alignment: "center"
                                },
                                {
                                    text: '565',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '56',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '5S9A898S9',
                                    style: "tableBody",
                                    alignment: "center",
                                }
                            ]
                    ]
                }
            },

            {
                style: '',
                color: '#444',
                table: {
                    widths: [200, 'auto', 'auto'],
                    // headerRows: 2,
                    // keepWithHeaderRows: 1,
                    body: [
                       
                       
                        [
                            {
                                rowSpan: 3,
                                text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor'
                            }, 
                            
                            {
                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center"
                            },
                            {
                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center"
                            },
                        ],
                        [
                            {
                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center"
                            }, {
                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center"
                            }, {
                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center"
                            },
                        ],
                        [
                            {
                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center"
                            }, {
                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center"
                            }, {
                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center"
                            },
                        ],
                        
                        
                    ]
                }
              }
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
            const targetElement = document.getElementById('iframeValResumen');
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
                    <a href="#" onClick={this.resumenVal} ><FaFilePdf className="text-danger"/> 3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE ✔</a>
                </li>

                <Modal isOpen={this.state.modal} fade={false} toggle={this.resumenVal} size="xl">
                    <ModalHeader toggle={this.ModalReportes}>3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRAPRESUPUESTO BASE</ModalHeader>
                    <ModalBody>
                        <div id="iframeValResumen" style={{height: 'calc(100vh - 50px)'}}></div>
                    </ModalBody>
                </Modal>
            </div> 
        );
    }
}

export default Report_3;
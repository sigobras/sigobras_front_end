import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";

import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno} from '../Complementos/ImgB64'
import imagen from '../../Pgerenciales/GaleriaImagenes/imagenesTemporal/sigobras2.jpg'

import { UrlServer } from '../../Utils/ServerUrlConfig'

    

class CtrlEjecDirecta extends Component {
    constructor(){
        super();
        this.state={
            DataEncabezado:[],
            DataApiResumenVal:[],
            DataEstructurado:[],
            modal:false,
            imagenBS64:''
        }
        this.ModalReportes = this.ModalReportes.bind(this)
        this.ResEstructarData = this.ResEstructarData.bind(this)
        this.resumenVal = this.resumenVal.bind(this)

        this.convertirbase = this.convertirbase.bind(this)

      }
      
    componentWillMount(){
        axios.post(`${UrlServer}/getInformeDataGeneral`,{
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
    

    convertirbase(url,callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
          reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    ModalReportes() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }


    ResEstructarData(){

        var { DataApiResumenVal, imagenBS64 } = this.state
        this.convertirbase(imagen, (dataUrl)=> 
            // console.log('resultado :', dataUrl)
            this.setState({
                imagenBS64:dataUrl
            })
        )



        var TblHeader = []

        TblHeader.push(
            {
                style: 'tableExample',
                layout: 'noBorders',
                table: {
                    widths: [ '*','*','*','*','*','*'],
                    body: [
                        [
                            {
                                text: 'PROYECTO EN EJECUCION',
                                style: "TableHeaderInforme",
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
                                   
    
                            }
                        ],
                        
                        
                        [
                            {
                                    text: 'ENTIDAD FINANCIERA',
                                    style: "TableHeaderInforme",
                                    alignment: "left",
                                    margin: [ 2, 0, 0, 0]
    
                            },
                            {
                                    text: ': GOBIERNO REGIONAL DE PUNO',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: 'PRESUPUESTO BASE',
                                    style: "TableHeaderInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: ': ',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: 'PLAZO DE EJECUCION INICIAL',
                                    style: "TableHeaderInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: ': ',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            }
                        ],
                        
                        
                        [
                            {
                                    text: 'MODALIDAD DE EJECUCION',
                                    style: "TableHeaderInforme",
                                    alignment: "left",
                                    margin: [ 2, 8, 0, 0]
    
                            },
                            {
                                    text: ': ',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: 'AMPLIACION PRESUPUESTO N° 1',
                                    style: "TableHeaderInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: ': ',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: 'AMPLIACION DE PLAZO N° 01',
                                    style: "TableHeaderInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: ': ',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            }
                        ],
                        
                        [
                            {
                                    text: 'FUENTE DE INFORMACION',
                                    style: "TableHeaderInforme",
                                    alignment: "left",
                                    margin: [ 2, 0, 0, 0]
    
                            },
                            {
                                    text: ':',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: '',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: '',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: '',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            },
                            {
                                    text: '',
                                    style: "tableBodyInforme",
                                    alignment: "left",
    
                            }
                        ],
                    ]
                }
            },
        )




        var DataRestructurado = []
        DataRestructurado.push(
            {
                style: 'tableExample',
                // color: '#ff0707',
                layout: 'lightHorizontalLines',
            
                table: {
                    widths: ["*","*","*","*","*","*","*","*","*","*","*","*","*","*","*"],
                    body: [
                            [
                                {
                                    text: 'CONSOLIDADO DEL INFORME MENSUAL DE OBRA',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:15,
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
                                    
                                }
                                
                            ],
                            
                            
                            [
                                {
                                    text: 'ITEM',
                                    style: "tableHeader",
                                    alignment: "center",
                                    margin: [ 2, 8, 0, 0],
                                    rowSpan:3
                                },
                                {
                                    text: 'NOMBRE DE LA OBRA',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan:3
                                },
                                {
                                    text: 'PPTO E.T. (S/.) +ADICIONALES',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan:3
                                },
                                {
                                    text: 'TIEMPO DE EJECUCIÓN',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:4
                                },
                                {
                                    
                                },
                                {
                                    
                                },
                                {
                                    
                                },
                                {
                                    text: 'VALORACIÓN ACUMULADA',
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
                                    text: 'MES REPORTADO',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan:3
                                },
                                {
                                    text: 'SITUACION  ACTUAL',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan:3
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
                                    text: 'PLAZO DE EJECUCIÓN (DÍAS CALENDARIOS)',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan:2
                                },
                                {
                                    text: 'FECHA INICIO E.T. INICIAL',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan:2
                                },
                                {
                                    text: 'FECHA CULMINACIÓN',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan:2
                                },
                                {
                                    text: 'AMPLÍACION DE PLAZO (FECHA DE TÉRMINO)',
                                    style: "tableHeader",
                                    alignment: "center",
                                    rowSpan:2
                                },
                                {
                                    text: 'FINANCIERO',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2
                                },
                                {
                                    
                                },
                                {
                                    text: 'FÍSICO PRES. BASE',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2
                                },
                                {
                                    
                                },
                                {
                                    text: 'AMPLIACIÓN PRESUPUESTAL VAL. FÍSICA',
                                    style: "tableHeader",
                                    alignment: "center",
                                    colSpan:2
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
                                    text: 'MONTO EN S/.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'ACU M. %',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'MONTO EN S/.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'ACU M. %',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'MONTO EN S/.',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    text: 'ACU M. %',
                                    style: "tableHeader",
                                    alignment: "center",
                                },
                                {
                                    
                                },
                                {
                                    
                                }
                                
                            ],
                            
                            
                            
                            [
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                },
                                {
                                    text: '-',
                                    style: "tableBody",
                                    alignment: "center",
                                }
                                
                            ],
                        ]
                }
            }
        )

        // console.log('dat>', DataRestructurado[0].table)

        this.setState({
            DataEncabezado:TblHeader,
            DataEstructurado:DataRestructurado,
        })
        
    }
    

    resumenVal(){
        const { DataEncabezado, DataEstructurado, imagenBS64 } = this.state

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
                    text: 'CONTROL DE EJECUCION DE OBRAS POR ADMINSTRACION DIRECTA',
                    margin: 7,
                    alignment: 'center'
                },

                DataEncabezado,
                DataEstructurado,
                {
                    canvas: [
                    

                    ]
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
                    fontSize: 6,
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
                    fontSize: 8,
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

                    {/* <button onClick={ 
                        () => this.convertirbase(imagen, (dataUrl)=> 
                            // console.log('resultado :', dataUrl)
                            this.setState({
                                imagenBS64:dataUrl
                            })
                        )}>

                        convertir
                    </button> */}
                </li>

                <Modal isOpen={this.state.modal} fade={false} toggle={this.resumenVal} size="xl">
                    <ModalHeader toggle={this.ModalReportes} >CONTROL DE EJECUCION DE OBRAS POR ADMINSTRACION DIRECTA</ModalHeader>
                    <ModalBody>
                        <div id="iframeCtrlEjecucionDirecta" style={{height: 'calc(100vh - 50px)'}}></div>
                    </ModalBody>
                </Modal>
            </div> 
        );
    }
}

export default CtrlEjecDirecta;
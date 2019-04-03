import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";

import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, Row, Col } from 'reactstrap';

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
            modal:false,
            DataAniosApi:[],
            DataMesesApi:[],
            urlPdf: '',
        }
        this.ModalReportes = this.ModalReportes.bind(this)
        this.ResEstructarData = this.ResEstructarData.bind(this)
        //this.resumenVal = this.resumenVal.bind(this)
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
            // console.log('res Meses', res.data)
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
        axios.post(`${UrlServer}/resumenValorizacionPrincipal`,{
            "id_ficha":sessionStorage.getItem("idobra"),
            "historialestados_id_historialestado":id_historial,
            "fecha_inicial":fecha_inicial,
            "fecha_final":fecha_final,
        })
        .then((res)=>{
            //console.log('res resumenValorizacionPrincipal', res.data)
            this.setState({
                DataApiResumenVal: res.data,
                DataEncabezado:encabezadoInforme(fecha_inicial,fecha_final)

            })
        })
        .catch((err)=>{
            console.log('ERROR ANG al obtener datos ❌'+ err);
        });
    }


    ResEstructarData(){

        var {  DataEncabezado } = this.state


        var DataHist = this.state.DataApiResumenVal
        console.log('DH', DataHist.componentes)


        var DataRestructurado = []

        //for (let i = 0; i < DataHist.componentes.length; i++){
            
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
    
    
                                
                        ]
                    }
                }
            )
        //}
        
        
        
        DataHist.componentes.forEach((dato, index)=>{
            DataRestructurado[0].table.body.push(
                [
                    {
                        text: dato.numero,
                        style: "tableBody",
                        alignment: "center",
                    },
                    {
                        text: dato.nombre,
                        style: "tableBody",
                        alignment: "left",
                    },
                    {
                        text: dato.presupuesto,
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.anterior,
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.porcentaje_anterior+" %",
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.actual,
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.porcentaje_actual+" %",
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.acumulado,
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.porcentaje_acumuado+" %",
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.saldo,
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.porcentaje_saldo+" %",
                        style: "tableBody",
                        alignment: "right",
                        margin: [ 0, 0, 4, 0]

                    },
                ]
            )
        })


         // inclimos un objeto con colspan de toda la fila
        DataRestructurado[0].table.body.push(
            [
                {
                    text: ' ',
                    style: "TableHeaderInforme",
                    alignment: "center",
                    colSpan:11,
                    margin: [ 0, 3, 0, 0]
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
            ]
        )

         //costo costosDirecto---------------------------
        DataHist.costosDirecto.forEach((CDirecto, j)=>{
            DataRestructurado[0].table.body.push(
                [
                    {
                        text: CDirecto.nombre,
                        style: "tableFecha",
                        alignment: "left",
                        colSpan:2,
                        margin: [15, 0, 0, 0]
                    },
                    {
                        // text: CDirecto.nombre,
                        // style: "tableFecha",
                        // alignment: "left",
                    },
                    {
                        text: CDirecto.presupuesto,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.anterior,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_anterior+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.actual,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_actual+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.acumulado,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_acumuado+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.saldo,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_saldo+" %",
                        style: "tableFecha",
                        alignment: "right",
                        margin: [ 0, 0, 4, 0]
                    },
                ]
            )
        })

        // inclimos un objeto con colspan de toda la fila
        DataRestructurado[0].table.body.push(
            [
                {
                    text: ' ',
                    style: "TableHeaderInforme",
                    alignment: "center",
                    colSpan:11,
                    margin: [ 0, 3, 0, 0]
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
            ]
        )

        // costos indirectos
        DataHist.costosindirectos.forEach((CDirecto, j)=>{
            DataRestructurado[0].table.body.push(
                [
                    {
                        text: CDirecto.nombre,
                        style: "tableFecha",
                        alignment: "left",
                        colSpan:2,
                        margin: [15, 0, 0, 0]
                    },
                    {
                        // text: CDirecto.nombre,
                        // style: "tableFecha",
                        // alignment: "left",
                    },
                    {
                        text: CDirecto.presupuesto,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.anterior,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_anterior+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.actual,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_actual+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.acumulado,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_acumuado+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.saldo,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_saldo+" %",
                        style: "tableFecha",
                        alignment: "right",
                        margin: [ 0, 0, 4, 0]
                    },
                ]
            )
        })

        //inclimos un objeto con colspan de toda la fila
        DataRestructurado[0].table.body.push(
            [
                {
                    text: ' ',
                    style: "TableHeaderInforme",
                    alignment: "center",
                    colSpan:11,
                    margin: [ 0, 3, 0, 0]
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
            ]
        )

        // COSTO costo Indirecto Total
        DataHist.costoIndirectoTotal.forEach((CDirecto, j)=>{
            DataRestructurado[0].table.body.push(
                [
                    {
                        text: CDirecto.nombre,
                        style: "tableFecha",
                        alignment: "left",
                        colSpan:2,
                        margin: [15, 0, 0, 0]
                    },
                    {
                        // text: CDirecto.nombre,
                        // style: "tableFecha",
                        // alignment: "left",
                    },
                    {
                        text: CDirecto.presupuesto,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.anterior,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_anterior+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.actual,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_actual+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.acumulado,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_acumuado+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.saldo,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_saldo+" %",
                        style: "tableFecha",
                        alignment: "right",
                        margin: [ 0, 0, 4, 0]
                    },
                ]
            )
        })

        // inclimos un objeto con colspan de toda la fila
        DataRestructurado[0].table.body.push(
            [
                {
                    text: ' ',
                    style: "TableHeaderInforme",
                    alignment: "center",
                    colSpan:11,
                    margin: [ 0, 3, 0, 0]
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
            ]
        )

        // COSTO ejecutadoTotalExpediente
        DataHist.ejecutadoTotalExpediente.forEach((CDirecto, j)=>{
            DataRestructurado[0].table.body.push(
                [
                    {
                        text: CDirecto.nombre,
                        style: "tableFecha",
                        alignment: "left",
                        colSpan:2,
                        margin: [15, 0, 0, 0]
                    },
                    {
                        // text: CDirecto.nombre,
                        // style: "tableFecha",
                        // alignment: "left",
                    },
                    {
                        text: CDirecto.presupuesto,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.anterior,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_anterior+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.actual,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_actual+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.acumulado,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_acumuado+" %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.saldo,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_saldo+" %",
                        style: "tableFecha",
                        alignment: "right",
                        margin: [ 0, 0, 4, 0]
                    },
                ]
            )
        })

        // // console.log('dat>', DataRestructurado[0].table)

        var ultimoElemento = DataRestructurado.length -1
        delete DataRestructurado[ultimoElemento].pageBreak


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
            text: 'RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE',
            margin: 7,
            alignment: 'center'
            },

            DataEncabezado,
            
            DataRestructurado
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
        const { DataApiResumenVal, DataAniosApi, DataMesesApi }= this.state
        return (
            <div>
                <li className="lii">
                    <a href="#" onClick={this.ModalReportes} ><FaFilePdf className="text-danger"/> 3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE ✔</a>
                </li>

                <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
                    <ModalHeader toggle={this.ModalReportes}>3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA PRESUPUESTO BASE</ModalHeader>
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
                            DataApiResumenVal.length <= 0 ?"":
                            <button className="btn btn-outline-success" onClick={ this.ResEstructarData }>PDF</button>
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

export default Report_3;
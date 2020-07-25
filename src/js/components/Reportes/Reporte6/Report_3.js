import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";

import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, Row, Col, Spinner } from 'reactstrap';

import { encabezadoInforme } from '../Complementos/HeaderInformes'
import { logoSigobras, logoGRPuno } from '../Complementos/ImgB64'

import { UrlServer } from '../../Utils/ServerUrlConfig'

import { Redondea1, Redondea, Money_to_float } from '../../Utils/Funciones';

class Report_3 extends Component {
    constructor() {
        super();
        this.state = {
            DataEncabezado: [],
            DataApiResumenVal: [],
            DataAniosApi: [],
            DataMesesApi: [],

            modal: false,

            urlPdf: '',
            anioSeleccionado: '',
            mesActual: '',
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
        axios.post(`${UrlServer}/getValGeneralAnyos`, {
            "id_ficha": sessionStorage.getItem("idobra")
        })
            .then((res) => {
                console.log('res ANIOS', res.data)
                this.setState({
                    DataAniosApi: res.data
                })
            })
            .catch((err) => {
                console.log('ERROR ANG al obtener datos ❌' + err);
            });
    }

    seleccionaAnios(e) {
        // LLAMA AL API DE MESES

        this.setState({
            anioSeleccionado: e.target.value
        })

        axios.post(`${UrlServer}/getValGeneralPeriodos`, {
            "id_ficha": sessionStorage.getItem("idobra"),
            "anyo": e.target.value
        })
            .then((res) => {
                 console.log('res Meses', res.data)
                this.setState({
                    DataMesesApi: res.data
                })
            })
            .catch((err) => {
                console.log('ERROR ANG al obtener datos ❌' + err);
            });
    }

    async seleccionaMeses(id_historial, fecha_inicial, fecha_final, mes_act) {
        // LLAMA AL API DE MESES

        this.setState({
            mesActual: mes_act,
        })

        await axios.post(`${UrlServer}/getValGeneralResumenPeriodo`, {
            "id_ficha": sessionStorage.getItem("idobra"),
            //"historialestados_id_historialestado":id_historial,
            "fecha_inicial": fecha_inicial,
            "fecha_final": fecha_final,
        })
            .then((res) => {
                console.log('res resumenValorizacionPrincipal', res.data)
                this.setState({
                    DataApiResumenVal: res.data,
                    DataEncabezado: encabezadoInforme(fecha_inicial, fecha_final)

                })
            })
            .catch((err) => {
                console.log('ERROR ANG al obtener datos ❌' + err);
            });
        axios.post(`${UrlServer}/getCostosIndirectos`, {
            "fichas_id_ficha": sessionStorage.getItem("idobra"),
            //"historialestados_id_historialestado":id_historial,
            "fecha_inicial": fecha_inicial,
            "fecha_final": fecha_final,
        })
            .then((res) => {
                console.log('res costos indirectos', res.data)
                var costos_indirectos = res.data
                var suma_presupuesto = 0;
                var suma_avance_anterior = 0;
                var suma_avance_actual = 0;
                var suma_avance_total = 0;
                var suma_avance_saldo = 0;
                var porcentaje_anterior_total = this.state.DataApiResumenVal.porcentaje_anterior;
                var porcentaje_actual_total = this.state.DataApiResumenVal.porcentaje_actual;
                var porcentaje_total_total = this.state.DataApiResumenVal.porcentaje_total;
                var porcentaje_saldo_total = this.state.DataApiResumenVal.porcentaje_saldo;
                
                for (let index = 0; index < costos_indirectos.length; index++) {
                    const item = costos_indirectos[index];
                    item.avance_anterior = Redondea(item.monto * this.state.DataApiResumenVal.porcentaje_anterior / 100)
                    item.porcentaje_anterior = this.state.DataApiResumenVal.porcentaje_anterior
                    item.avance_actual = Redondea(item.monto * this.state.DataApiResumenVal.porcentaje_actual / 100)
                    item.porcentaje_actual = this.state.DataApiResumenVal.porcentaje_actual
                    item.avance_total = Redondea(item.monto * this.state.DataApiResumenVal.porcentaje_total / 100)
                    item.porcentaje_total = this.state.DataApiResumenVal.porcentaje_total
                    item.avance_saldo = Redondea(item.monto * this.state.DataApiResumenVal.porcentaje_saldo / 100)
                    item.porcentaje_saldo = this.state.DataApiResumenVal.porcentaje_saldo
                    suma_presupuesto += item.monto
                    suma_avance_anterior += item.monto * this.state.DataApiResumenVal.porcentaje_anterior / 100
                    suma_avance_actual += item.monto * this.state.DataApiResumenVal.porcentaje_actual / 100
                    suma_avance_total += item.monto * this.state.DataApiResumenVal.porcentaje_total / 100
                    suma_avance_saldo += item.monto * this.state.DataApiResumenVal.porcentaje_saldo / 100
                    
                }
                var presupuesto_total = suma_presupuesto + Money_to_float(this.state.DataApiResumenVal.presupuesto)
                console.log("Presupuesto total" , suma_presupuesto,Money_to_float(this.state.DataApiResumenVal.presupuesto));
                presupuesto_total = Redondea(presupuesto_total)

                var presupuesto_total_avance_anterior = suma_avance_anterior + Money_to_float(this.state.DataApiResumenVal.valor_anterior)
                //console.log("Presupuesto total" , suma_presupuesto,Money_to_float(this.state.DataApiResumenVal.presupuesto));
                presupuesto_total_avance_anterior = Redondea(presupuesto_total_avance_anterior)

                var presupuesto_total_avance_actual = suma_avance_actual + Money_to_float(this.state.DataApiResumenVal.valor_actual)
                //console.log("Presupuesto total" , suma_presupuesto,Money_to_float(this.state.DataApiResumenVal.presupuesto));
                presupuesto_total_avance_actual = Redondea(presupuesto_total_avance_actual)

                var presupuesto_total_avance_total = suma_avance_total + Money_to_float(this.state.DataApiResumenVal.valor_total)
                //console.log("Presupuesto total" , suma_presupuesto,Money_to_float(this.state.DataApiResumenVal.presupuesto));
                presupuesto_total_avance_total = Redondea(presupuesto_total_avance_total)

                var presupuesto_total_avance_saldo = suma_avance_saldo + Money_to_float(this.state.DataApiResumenVal.valor_saldo)
                //console.log("Presupuesto total" , suma_presupuesto,Money_to_float(this.state.DataApiResumenVal.presupuesto));
                presupuesto_total_avance_saldo = Redondea(presupuesto_total_avance_saldo)

                suma_presupuesto = Redondea(suma_presupuesto )
                suma_avance_anterior = Redondea(suma_avance_anterior )
                suma_avance_actual = Redondea(suma_avance_actual )
                suma_avance_total = Redondea(suma_avance_total )
                suma_avance_saldo = Redondea(suma_avance_saldo )
                porcentaje_anterior_total = Redondea(porcentaje_anterior_total )
                porcentaje_actual_total = Redondea(porcentaje_actual_total )
                porcentaje_total_total = Redondea(porcentaje_total_total )
                porcentaje_saldo_total = Redondea(porcentaje_saldo_total )

                console.log('costos_indirectos', costos_indirectos);
                this.setState({
                    costos_indirectos,
                    suma_presupuesto,
                    suma_avance_anterior,
                    suma_avance_actual,
                    suma_avance_total,
                    suma_avance_saldo,
                    porcentaje_anterior_total,
                    porcentaje_actual_total,
                    porcentaje_total_total,
                    porcentaje_saldo_total,
                    presupuesto_total,
                    presupuesto_total_avance_anterior,
                    presupuesto_total_avance_actual,
                    presupuesto_total_avance_total,
                    presupuesto_total_avance_saldo
                })
            })
            .catch((err) => {
                console.log('ERROR ANG al obtener datos ❌' + err);
            });
    }


    ResEstructarData() {

        var { DataEncabezado } = this.state


        var DataHist = this.state.DataApiResumenVal
        var costosIndirectos = this.state.costos_indirectos
        console.log('Esta es DataHIst', DataHist.componentes)
        console.log('DH', DataHist.componentes)
        console.log('costosIndirectos', costosIndirectos)


        var DataRestructurado = []

        //for (let i = 0; i < DataHist.componentes.length; i++){

        DataRestructurado.push(
            {
                style: 'tableExample',
                // color: '#ff0707',
                layout: 'lightHorizontalLines',

                table: {
                    widths: [20, 185, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        [
                            {

                                text: 'ITEM',
                                style: "tableHeader",
                                alignment: "center",
                                rowSpan: 3,
                                margin: [2, 8, 0, 0]

                            },
                            {
                                text: 'COMPONENTE',
                                style: "tableHeader",
                                alignment: "center",
                                rowSpan: 3,
                                margin: [2, 8, 0, 0]
                            },
                            {
                                text: 'MONTO PPTDO',
                                style: "tableHeader",
                                alignment: "center",
                                rowSpan: 2
                            },
                            {
                                text: `${this.state.mesActual} ${this.state.anioSeleccionado}`,
                                style: "TableValInforme",
                                alignment: "center",
                                colSpan: 6
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
                                colSpan: 2,
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
                                colSpan: 2
                            },
                            {

                            },
                            {
                                text: 'ACTUAL',
                                style: "TableValInforme",
                                alignment: "center",
                                colSpan: 2
                            },
                            {

                            },
                            {
                                text: 'ACUMULADO',
                                style: "tableHeader",
                                alignment: "center",
                                colSpan: 2
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
                                //text: `${DataHist.porcentaje_anterior} `,
                                text: "%",
                                style: "tableHeader",
                                alignment: "center",
                            },
                            {
                                text: 'Valorizado S/.',
                                style: "TableValInforme",
                                alignment: "center",
                            },
                            {
                                text: '%',
                                style: "TableValInforme",
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



        DataHist.componentes.forEach((dato, index) => {
            DataRestructurado[0].table.body.push(
                [
                    {
                        text: dato.numero = dato.numero.replace(/^0+/, ''),
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
                        text: dato.valor_anterior,
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.porcentaje_anterior + " %",
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.valor_actual,
                        style: "TableValInforme",
                        alignment: "right",
                    },
                    {
                        text: dato.porcentaje_actual + " %",
                        style: "TableValInforme",
                        alignment: "right",
                    },
                    {
                        text: dato.valor_total,
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.porcentaje_total + " %",
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.valor_saldo,
                        style: "tableBody",
                        alignment: "right",
                    },
                    {
                        text: dato.porcentaje_saldo + " %",
                        style: "tableBody",
                        alignment: "right",
                        margin: [0, 0, 4, 0]

                    },
                ]
            )
        })

        // inclimos un objeto con colspan de toda la fila
        DataRestructurado[0].table.body.push(
            [
                {
                    text: ' Total Costo Directo',
                    style: "TableTotalesInforme",
                    alignment: "center",
                    colSpan: 2,
                    margin: [0, 2, 0, 0]
                },
                {

                },
                {
                    text: "S/. " + `${DataHist.presupuesto}`,
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
                {
                    text: "S/. " + `${DataHist.valor_anterior}`,
                    style: "TableTotalesInforme",
                    alignment: "right",
                    //colSpan: 2,
                },
                {
                    text: `${DataHist.porcentaje_anterior}` + " %",
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
                {
                    text: "S/. " + `${DataHist.valor_actual}`,
                    style: "TableTotalesInforme",
                    alignment: "right",
                    //colSpan: 2,
                },
                {
                    text: `${Redondea(DataHist.porcentaje_actual)}` + " %",
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
                {
                    text: "S/. " + `${DataHist.valor_total}`,
                    style: "TableTotalesInforme",
                    alignment: "right",
                    //colSpan: 2,
                },
                {
                    text: `${DataHist.porcentaje_total}` + " %",
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
                {
                    text: "S/. " + `${DataHist.valor_saldo}`,
                    style: "TableTotalesInforme",
                    alignment: "right",
                    //colSpan: 2,
                },
                {
                    text: `${DataHist.porcentaje_saldo}` + " %",
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
            ]
        )
        // inclimos un objeto con colspan de toda la fila
        DataRestructurado[0].table.body.push(
            [
                {
                    text: ' ',
                    style: "TableHeaderInforme",
                    alignment: "center",
                    colSpan: 11,
                    margin: [0, 2, 0, 0]
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

        //  //costo costosDirecto---------------------------
        // DataHist.costosDirecto.forEach((CDirecto, j)=>{
        //     DataRestructurado[0].table.body.push(
        //         [
        //             {
        //                 text: CDirecto.numero,
        //                 style: "tableFecha",
        //                 alignment: "left",
        //                 //colSpan:2,
        //                 margin: [15, 0, 0, 0]
        //             },
        //             {
        //                 text: CDirecto.nombre,
        //                 style: "tableFecha",
        //                 alignment: "left",
        //             },
        //             {
        //                 text: CDirecto.presupuesto,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.anterior,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_anterior+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.actual,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_actual+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.acumulado,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_acumulado+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.saldo,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_saldo+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //                 margin: [ 0, 0, 4, 0]
        //             },
        //         ]
        //     )
        // })

        // // inclimos un objeto con colspan de toda la fila
        // DataRestructurado[0].table.body.push(
        //     [
        //         {
        //             text: ' ',
        //             style: "TableHeaderInforme",
        //             alignment: "center",
        //             colSpan:11,
        //             margin: [ 0, 3, 0, 0]
        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //     ]
        // )

        // costos indirectos
        costosIndirectos.forEach((CDirecto, j) => {
            DataRestructurado[0].table.body.push(
                [
                    {
                        text: 1 + j,
                        style: "tableFecha",
                        alignment: "center",
                        //colSpan:2,
                        margin: [12, 0, 0, 0]
                    },
                    {
                        text: CDirecto.nombre,
                        style: "tableFecha",
                        alignment: "left",
                    },
                    {
                        text: Redondea(CDirecto.monto),
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.avance_anterior,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_anterior + " %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.avance_actual,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: Redondea(CDirecto.porcentaje_actual) + " %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.avance_total,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_total + " %",
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.avance_saldo,
                        style: "tableFecha",
                        alignment: "right",
                    },
                    {
                        text: CDirecto.porcentaje_saldo + " %",
                        style: "tableFecha",
                        alignment: "right",
                        margin: [0, 0, 4, 0]
                    },
                ]
            )
        })
        // Totales costos indirectos 
        DataRestructurado[0].table.body.push(
            //console.log("SUma avance anterio", this.state.suma_avance_anterior),
            [
                {
                    text: ' Total Costo Indirecto',
                    style: "TableTotalesInforme",
                    alignment: "center",
                    colSpan: 2,
                    margin: [0, 2, 0, 0]
                },
                {
                
                },
                {
                    text: "S/. " + this.state.suma_presupuesto,
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
                {
                    text: "S/. " + this.state.suma_avance_anterior,
                    style: "TableTotalesInforme",
                    alignment: "right",
                    //colSpan: 2,
                },
                {
                    text: this.state.porcentaje_anterior_total + " %",
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
                {
                    text:"S/. " + this.state.suma_avance_actual,
                    style: "TableTotalesInforme",
                    alignment: "right",
                    //colSpan: 2,
                },
                {
                    text: this.state.porcentaje_actual_total + " %",
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
                {
                    text:"S/. " + this.state.suma_avance_total,
                    style: "TableTotalesInforme",
                    alignment: "right",
                    //colSpan: 2,
                },
                {
                    text: this.state.porcentaje_total_total + " %",
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
                {
                    text: "S/. " + this.state.suma_avance_saldo,
                    style: "TableTotalesInforme",
                    alignment: "right",
                    //colSpan: 2,
                },
                {
                    text: this.state.porcentaje_saldo_total + " %",
                    style: "TableTotalesInforme",
                    alignment: "right",
                },
            ]
        )

        DataRestructurado[0].table.body.push(
            //console.log("SUma avance anterio", this.state.suma_avance_anterior),
            [
                {
                    text: ' ',
                    style: "TableHeaderInforme",
                    alignment: "center",
                    colSpan: 11,
                    margin: [0, 2, 0, 0]
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

        DataRestructurado[0].table.body.push(
            //console.log("SUma avance anterio", this.state.suma_avance_anterior),
            [
                {
                    text: 'PRESUPUESTO TOTAL ',
                    style: "TableTotalesInforme",
                    alignment: "center",
                    colSpan: 2,
                    margin: [0, 2, 0, 0]
                },
                {
                
                },
                {
                    text: this.state.presupuesto_total,
                    style: "TableTotalesInforme",
                    alignment: "center", 
                },
                {
                    text: this.state.presupuesto_total_avance_anterior,
                    style: "TableTotalesInforme",
                    alignment: "center",  
                },
                {
                    text: `${DataHist.porcentaje_anterior}` + " %",
                    style: "TableTotalesInforme",
                    alignment: "center",
                },
                {
                    text: this.state.presupuesto_total_avance_actual,
                    style: "TableTotalesInforme",
                    alignment: "center",
                },
                {
                    text: `${Redondea(DataHist.porcentaje_actual)}` + " %",
                    style: "TableTotalesInforme",
                    alignment: "center",
                },
                {
                    text: this.state.presupuesto_total_avance_total,
                    style: "TableTotalesInforme",
                    alignment: "center",
                },
                {
                    text: `${DataHist.porcentaje_total}` + " %",
                    style: "TableTotalesInforme",
                    alignment: "center",
                },
                {
                    text: this.state.presupuesto_total_avance_saldo,
                    style: "TableTotalesInforme",
                    alignment: "center",
                },
                {
                    text: `${DataHist.porcentaje_saldo}` + " %",
                    style: "TableTotalesInforme",
                    alignment: "center",
                },
            ]
        )

        // //inclimos un objeto con colspan de toda la fila
        // DataRestructurado[0].table.body.push(
        //     [
        //         {
        //             text: ' ',
        //             style: "TableHeaderInforme",
        //             alignment: "center",
        //             colSpan:11,
        //             margin: [ 0, 3, 0, 0]
        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //     ]
        // )

        // // COSTO costo Indirecto Total
        // DataHist.costoIndirectoTotal.forEach((CDirecto, j)=>{
        //     DataRestructurado[0].table.body.push(
        //         [
        //             {
        //                 text: CDirecto.numero,
        //                 style: "tableFecha",
        //                 alignment: "left",
        //                 //colSpan:2,
        //                 margin: [15, 0, 0, 0]
        //             },
        //             {
        //                 text: CDirecto.nombre,
        //                 style: "tableFecha",
        //                 alignment: "left",
        //             },
        //             {
        //                 text: CDirecto.presupuesto,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.anterior,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_anterior+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.actual,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_actual+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.acumulado,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_acumulado+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.saldo,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_saldo+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //                 margin: [ 0, 0, 4, 0]
        //             },
        //         ]
        //     )
        // })

        // // inclimos un objeto con colspan de toda la fila
        // DataRestructurado[0].table.body.push(
        //     [
        //         {
        //             text: ' ',
        //             style: "TableHeaderInforme",
        //             alignment: "center",
        //             colSpan:11,
        //             margin: [ 0, 3, 0, 0]
        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //         {

        //         },
        //     ]
        // )

        // // COSTO ejecutadoTotalExpediente
        // DataHist.ejecutadoTotalExpediente.forEach((CDirecto, j)=>{
        //     DataRestructurado[0].table.body.push(
        //         [
        //             {
        //                 text: CDirecto.numero,
        //                 style: "tableFecha",
        //                 alignment: "left",
        //                 //colSpan:2,
        //                 margin: [15, 0, 0, 0]
        //             },
        //             {
        //                 text: CDirecto.nombre,
        //                 style: "tableFecha",
        //                 alignment: "left",
        //             },
        //             {
        //                 text: CDirecto.presupuesto,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.anterior,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_anterior+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.actual,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_actual+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.acumulado,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_acumulado+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.saldo,
        //                 style: "tableFecha",
        //                 alignment: "right",
        //             },
        //             {
        //                 text: CDirecto.porcentaje_saldo+" %",
        //                 style: "tableFecha",
        //                 alignment: "right",
        //                 margin: [ 0, 0, 4, 0]
        //             },
        //         ]
        //     )
        // })

        // // console.log('dat>', DataRestructurado[0].table)

        var ultimoElemento = DataRestructurado.length - 1
        delete DataRestructurado[ultimoElemento].pageBreak


        // GENERA EL FORMATO PDF
        pdfmake.vfs = pdfFonts.pdfMake.vfs;

        var docDefinition = {
            header: {

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

            footer: function (currentPage, pageCount) {
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
                    layout: 'noBorders',
                    margin: 7,
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE',
                                    style: "tableFechaContent",
                                    alignment: "center",
                                    margin: [10, 0, 5, 0],
                                }
                            ]

                        ]
                    }
                    // text: 'RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE',
                    // margin: 7,
                    // alignment: 'center'
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
                    fillColor: '#8baedb',
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
                },
                tableFechaContent: {
                    bold: true,
                    fontSize: 9,
                    color: '#000000',
                    fillColor: '#8baedb',
                },
                TableValInforme: {
                    bold: true,
                    fontSize: 6,
                    color: '#000000',
                    fillColor: '#A4C4EA',
                },
                TableTotalesInforme: {
                    bold: true,
                    fontSize: 7.5,
                    color: '#000000',
                    fillColor: '#839cbb',
                },


            },
            defaultStyle: {
                // alignment: 'justify'
            },
            pageSize: 'A4',
            pageOrientation: 'landscape',

        };
        // pdfmake.createPdf(docDefinition)
        var pdfDocGenerator = pdfmake.createPdf(docDefinition);
        pdfDocGenerator.open()

        // pdfDocGenerator.getDataUrl((dataUrl) => {
        // this.setState({
        //     urlPdf:dataUrl
        // })


        // });

    }




    render() {
        const { DataApiResumenVal, DataAniosApi, DataMesesApi, urlPdf } = this.state
        return (
            <div>
                <li className="lii">
                    <a href="#" onClick={this.ModalReportes} ><FaFilePdf className="text-danger" /> 3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE ✔</a>
                </li>

                <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalReportes} size="xl">
                    <ModalHeader toggle={this.ModalReportes}>3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA PRESUPUESTO BASE</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col sm="2">
                                <fieldset>
                                    <legend>Seleccione</legend>

                                    <select className="form-control form-control-sm" onChange={e => this.seleccionaAnios(e)}  >
                                        <option value="">Años</option>
                                        {
                                            DataAniosApi.map((anios, iA) =>
                                                <option key={iA} value={anios.anyo}>{anios.anyo}</option>
                                            )
                                        }
                                    </select>
                                </fieldset>

                            </Col>

                            <Col sm="9">
                                {DataMesesApi.length <= 0 ? "" :
                                    <fieldset>
                                        <legend>Seleccione Mes</legend>
                                        <ButtonGroup size="sm">
                                            {
                                                DataMesesApi.map((Meses, iM) =>
                                                    <Button color="primary" key={iM} onClick={() => this.seleccionaMeses(Meses.historialestados_id_historialestado, Meses.fecha_inicial, Meses.fecha_final, Meses.mes,)}>{Meses.codigo}</Button>
                                                )
                                            }

                                        </ButtonGroup>
                                    </fieldset>
                                }
                            </Col>

                            <Col sm="1">
                                {
                                    DataApiResumenVal.length <= 0 ? "" :
                                        <button className="btn btn-outline-success" onClick={this.ResEstructarData}>PDF</button>
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

export default Report_3;
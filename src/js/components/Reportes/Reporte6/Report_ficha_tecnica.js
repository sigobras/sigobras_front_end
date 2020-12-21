import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { FaFilePdf } from "react-icons/fa";

import { logoSigobras, logoGRPuno, ImgDelta } from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'
const { Redondea, mesesShort, meses, fechaFormatoClasico } = require('../../Utils/Funciones');

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require("highcharts/modules/exporting")(Highcharts);
// var request = require('request').defaults({ encoding: null });

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from "react-toastify";
import { func } from 'prop-types';

export default () => {
    const [Loading, setLoading] = useState(false);
    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));
    const classes = useStyles();

    // Obtenemos los datos generales del API
    async function fetchFichaTecnicaDatosGenerales() {
        const request = await axios.post(`${UrlServer}/getDatosGenerales2`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        setLoading(true)
        return request.data
    }

    async function fetchFichaTecnicaPlazos() {
        const res = await axios.get(`${UrlServer}/plazosPadres`,
            {
                params:
                {
                    id_ficha: sessionStorage.getItem('idobra')
                }
            }
        )
        return res.data
    }

    // const [DatosCostosIndirectos, setDatosCostosIndirectos] = useState([])
    async function fetchDatosCostosIndirectos() {
        const res = await axios.get(`${UrlServer}/costosIndirectos`,
            {
                params: {
                    "id_ficha": sessionStorage.getItem("idobra")
                }
            }
        )
        return res.data
    }
    async function fetchFichasMeta() {
        const res = await axios.get(`${UrlServer}/fichasMeta`,
            {
                params: {
                    "id_ficha": sessionStorage.getItem("idobra")
                }
            }
        )
        return res.data
    }

    async function fetchAmpliacionPresupuestal() {
        const res = await axios.get(`${UrlServer}/ampliacionPresupuestal`,
            {
                params: {
                    "id_ficha": sessionStorage.getItem("idobra")
                }
            }
        )
        console.log("Primer axios", res.data);
        for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i];
            const costoIndirectoAdicional = await axios.get(`${UrlServer}/costosIndirectosAdicionales`,
                {
                    params: {
                        "fichas_ampliacionpresupuesto_id": item.id
                    }
                }
            )
            const costoDirectoAdicional = await axios.get(`${UrlServer}/costosDirectosAdicionales`,
                {
                    params: {
                        "fichas_ampliacionpresupuesto_id": item.id
                    }
                }
            )
            item.costoIndirectoAdicional = costoIndirectoAdicional.data
            item.costoDirectoAdicional = costoDirectoAdicional.data
        }
        return res.data
    }

    async function fetchCostoDirecto() {
        const res = await axios.post(`${UrlServer}/getPresupuestoCostoDirecto`,
            {
                "id_ficha": sessionStorage.getItem("idobra")
            }
        )
        return res.data
    }

    async function fetchEjecucionPresupuestal() {
        const res = await axios.get(`${UrlServer}/ejecucionPresupuestal`,
            {
                params: {
                    "id_ficha": sessionStorage.getItem("idobra"),
                    "anyo":2019
                }
            }
        )
        return res.data
    }

    async function fetchPim() {
        const res = await axios.post(`${UrlServer}/getCurvaSPin`,
            {
                "id_ficha": sessionStorage.getItem("idobra"),
                "anyo": 2020
            }
        )
        return res.data
    }

    function fechaLarga(fecha) {
        console.log("Primera fecha",fecha);
        var fechaTemp = fecha.split('-')
        console.log("fechaTemp",fechaTemp);
        var date = new Date(fechaTemp[0], fechaTemp[1] - 1, fechaTemp[2]);
        var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: "long" };
        return date.toLocaleDateString("es-ES", options)
    }

    function addDaysToEndDate(fecha, dias) {
        var fechaTemp = fecha.split('-')
        var date = new Date(fechaTemp[0], fechaTemp[1] - 1, fechaTemp[2]);

        // console.log("date", date);

        date.setDate(date.getDate() + Number(dias - 1));
        // console.log("dias", dias);

        // console.log("Date 2", date, typeof Number(dias));
        var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: "long" };
        return date.toLocaleDateString("es-ES", options)
    }

    function GenerateFechaPdf() {
        var n = new Date();
        //Año
        var y = n.getFullYear();
        //Mes
        var m = n.getMonth() + 1;
        //Día
        var d = n.getDate();

        //Lo ordenas a gusto.
        var date = d + "/" + m + "/" + y;
        return date
    }

    async function generatePdf() {
        // Guardamos en una variable temopral datos de API de datos generales
        var FichaTecnicaDatosGenerales = await fetchFichaTecnicaDatosGenerales()
        // console.log("FichaTecnicaDatosGenerales", FichaTecnicaDatosGenerales);

        // Guardamos en una variable temporal los datos del Api de plazos
        var FichaTecnicaPlazos = await fetchFichaTecnicaPlazos()
        // console.log("FichaTecnicaPlazos", FichaTecnicaPlazos);

        var DatosCostosIndirectos = await fetchDatosCostosIndirectos()
        // console.log("DatosCostosIndirectos", DatosCostosIndirectos);

        var AmpliacionPresupuestal = await fetchAmpliacionPresupuestal()
        // console.log("fetchAmpliacionPresupuestal",AmpliacionPresupuestal);

        var CostoDirecto = await fetchCostoDirecto()
        // console.log("fetchCostoDirecto", CostoDirecto);

        var EjecucionPresupuestal = await fetchEjecucionPresupuestal()
        // console.log("fetchEjecucionPresupuestal",EjecucionPresupuestal);

        var Pim = await fetchPim()
        // console.log("fetchPim",Pim);

        var DatosFichasMeta = await fetchFichasMeta()
        var DatosGenerales = [
            { text: '1.-DATOS GENERALES', style: 'header', alignment: 'left', bold: true,fontSize: 10,fillColor: '#eeeeee'},
            {
                style: 'tableExample',
                table: {
                    widths: ['*', '*', '*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'Componente', border: [false, false, false, false] },
                            { text: FichaTecnicaDatosGenerales.g_meta, colSpan: 5 },
                            { text: '' },
                            { text: '' },
                            { text: '' },
                            { text: '' }
                        ],
                        [
                            { text: '', border: [false, false, false, false], colSpan: 6 },
                            { text: '' },
                            { text: '' },
                            { text: '' },
                            { text: '' },
                            { text: '' }
                        ],
                        [
                            { text: '', border: [false, false, false, false], },
                            { text: 'Codigo unificado ', bold: true, border: [false, false, false, false] },
                            { text: FichaTecnicaDatosGenerales.codigo_unificado == null ? "----" : FichaTecnicaDatosGenerales.codigo_unificado },
                            { text: '<-------------->', border: [false, false, false, false], alignment: 'center' },
                            { text: 'Codigo SNIP', border: [false, false, false, false], },
                            { text: FichaTecnicaDatosGenerales.g_snip }
                        ],
                    ]
                }
            },
            // {
            //     style: 'tableExample',
            //     table: {
            //         body: [
            //             [{text:'',border: [false, false, false, false]}],                    
            //         ]
            //     }
            // },
            // {
            //     style: 'tableExample',
            //     table: {
            //         body: [
            //             [{text:'',border: [false, false, false, false],},{text:'COdigo unificado ',border: [false, false, false, false],},{text:'Any NUMBER',border: [true, true, true, true],},{text:'<-------------->',border: [false, false, false, false],},{text:'Codigo SNIP',border: [false, false, false, false],},{text:'Any NUMBER',border: [true, true, true, true],}],
            //         ]
            //     }
            // },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
            { text: 'UBICACION GEOGRAFICA DE LA ZONA', style: 'header', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    widths: [100, 'auto', 100, 'auto', 100, 'auto', 152],
                    body: [
                        [
                            { text: 'DEPARTAMENTO', color: "red", alignment: 'center' },
                            { text: ' ', border: [false, false, false, false], },
                            { text: 'PROVINCIA', border: [true, true, true, true], color: "red", alignment: 'center' },
                            { text: '', border: [false, false, false, false], },
                            { text: 'DISTRITO', color: "red", alignment: 'center' },
                            { text: '', border: [false, false, false, false], },
                            { text: 'CENTRO POBLADO / DIRRECCION', color: "red", alignment: 'center' }
                        ],
                        [
                            { text: 'Puno', alignment: 'center' },
                            { text: ' ', border: [false, false, false, false], },
                            { text: FichaTecnicaDatosGenerales.g_local_reg, border: [true, true, true, true], alignment: 'center' },
                            { text: '', border: [false, false, false, false], },
                            { text: FichaTecnicaDatosGenerales.g_local_dist, alignment: 'center' },
                            { text: '', border: [false, false, false, false], },
                            { text: FichaTecnicaDatosGenerales.centropoblado_direccion, alignment: 'center' }
                        ],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
        ]
        // PLAZO DE EJECUCION APROBADO SEGUN ITEM Y .......

        var LengthRowDatosTipo3 = FichaTecnicaPlazos.filter(item => item.tipo == 3 && item.plazo_aprobado == 1);
        console.log("LengthRowDatosTipo3", LengthRowDatosTipo3.length);

        var DatosTipo3 = [
            [
                { text: 'Ampliacion Plazo de ejecucion aprobado inicialmente', rowSpan: LengthRowDatosTipo3.length + 1, colSpan: 2, alignment: 'center' },
                { text: '', },
                { text: 'AMP. plazo', color: "red" },
                { text: 'Resolucion de aprobacion', color: "red" },
                { text: 'Fecha de aprobacion', color: "red" }
            ],

        ]
        for (let i = 0; i < FichaTecnicaPlazos.length; i++) {
            const element = FichaTecnicaPlazos[i];

            if (element.tipo == 3 && element.plazo_aprobado == 1) {
                DatosTipo3.push(
                    [
                        { text: '', },
                        { text: '', },
                        { text: element.n_dias + " d/c" },
                        { text: element.documento_resolucion_estado },
                        { text: element.fecha_aprobada?fechaLarga(element.fecha_aprobada): "Sin Fecha de Aprobación" }
                    ],
                )
            }

        }
        // console.log("DatosTipo3 length", DatosTipo3.length);
        // var LengthRowDatosTipo3 = DatosTipo3.length
        // console.log("---<>", LengthRowDatosTipo3);

        var ItemSuma = []
        let totalDiasPlazo = 0;
        // for (let i of FichaTecnicaPlazos.length) totalDiasPlazo += i.n_dias;
        for (let i = 0; i < FichaTecnicaPlazos.length; i++) {
            const element = FichaTecnicaPlazos[i];
            if (element.tipo == 3 && element.plazo_aprobado == 1) {
                totalDiasPlazo += element.n_dias
            }
        }
        ItemSuma.push(
            [
                { text: '', border: [false, true, true, false], },
                { text: 'Total de dias aprobados', bold: true, alignment: "center" },
                { text: totalDiasPlazo + " d/c", bold: true },
                { text: 'Termino de obra Reprogramado', bold: true },
                { text: addDaysToEndDate(FichaTecnicaDatosGenerales.fecha_inicial, totalDiasPlazo + Number(FichaTecnicaDatosGenerales.tiempo_ejec)), bold: true }
            ],
        )

        // AMPLIACION DE PRESUPUESTO SEGUN ITEM Y .....

        var AmpliacionItem = [

        ]
        var plazosPorAprobarDias = 0
        for (let i = 0; i < FichaTecnicaPlazos.length; i++) {
            const element = FichaTecnicaPlazos[i];
            if (element.tipo == 3 && (element.plazo_aprobado == 0 || element.plazo_aprobado == null)) {
                AmpliacionItem.push(
                    [
                        { text: 'Periodo\n solicitado' },
                        { text: element.n_dias + " d/c" },
                        { text: 'Situaicon del tramite' },
                        { text: element.descripcion, colSpan: 2 },
                        { text: '' }
                    ],
                )
                plazosPorAprobarDias += element.n_dias
            }
        }
        var FechaAmpliacion = [
            [
                { text: '', border: [false, true, false, false], },
                { text: '', border: [false, true, false, false], },
                { text: '', border: [false, true, true, false], },
                { text: 'Fecha reprogramada de termino de obra', bold: true, alignment: 'center' },
                { text: addDaysToEndDate(FichaTecnicaDatosGenerales.fecha_inicial, totalDiasPlazo + Number(FichaTecnicaDatosGenerales.tiempo_ejec) + plazosPorAprobarDias), bold: true }
            ],

        ]


        var PeriodoEjecucion = [
            { text: '2.-PERIODO DE EJECUCION', style: 'header', alignment: 'left', bold: true,fontSize: 10,fillColor: '#eeeeee' },
            {
                style: 'tableExample',
                table: {
                    widths: [100, 60, 'auto', '*', '*'],
                    body: [
                        [
                            { text: 'Plazo de Ejecución Aprobado Inicialmente', rowSpan: 2, alignment: 'center' },
                            { text: 'Segun exp. tec.', color: "red" },
                            { text: '', border: [true, false, true, false], rowSpan: 2 },
                            { text: 'Fecha de inicio de obra', color: "red" },
                            { text: 'Fecha termino programada', color: "red" }
                        ],
                        [
                            { text: '' },
                            { text: FichaTecnicaDatosGenerales.tiempo_ejec + " d/c" },
                            { text: '' },
                            { text: fechaLarga(FichaTecnicaDatosGenerales.fecha_inicial) },
                            { text: addDaysToEndDate(FichaTecnicaDatosGenerales.fecha_inicial, FichaTecnicaDatosGenerales.tiempo_ejec) }
                        ],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
            { text: 'Ampliacion Plazo de ejecucion aprobado inicialmente', style: 'header', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    widths: [10, 82, 50, '*', '*'],
                    body:
                        DatosTipo3.concat(ItemSuma)
                }
            },

            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
            { text: 'AMPLIACION DEL PLAZO PARA APROBAR', style: 'header', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    widths: ['auto', 'auto', 'auto', 'auto', '*'],
                    body:
                        AmpliacionItem.concat(FechaAmpliacion),
                }
            },

            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
        ]
        var costosWidths = ['*','auto',"auto"]
            AmpliacionPresupuestal.forEach((item, i) => {
                costosWidths.push(
                   "auto"
                )
            });
            costosWidths.push(
               "auto"
            )
        var costoTotal =[] 
        var PresupuestoObra = [
            { text: '3.-PRESUPUESTO DE OBRA', style: 'header', alignment: 'left', bold: true,fontSize: 10,fillColor: '#eeeeee' },
            {
                style: 'tableExample',
                table: {
                    widths:costosWidths,
                    body: [
                        (() => {
                            var columnas = [
                                { text: 'DESCRIPCION', colSpan: 2, alignment: "center", color: "red" },
                                { text: '' },
                                { text: 'EXP. TEC. APROB.', alignment: "center", color: "red" },
                                // { text: 'ADIC. APROB.', alignment: "center", color: "red" },
                                // { text: 'PARCIAL', alignment: "center", color: "red" }
                            ]
                            AmpliacionPresupuestal.forEach((item, i) => {
                                columnas.push(
                                    { text: 'ADIC. APROB.' + (i + 1), alignment: "center", color: "red" }
                                )
                            });
                            columnas.push(
                                { text: 'PARCIAL', alignment: "center", color: "red" }
                            )
                            return columnas
                        })()
                    ].concat(
                        (()=>{
                            var CostosDirectos = [
                                { text: "TOTAL COSTO DIRECTO S/.", colSpan: 2,alignment: "center", bold: true },
                                { text: '' },
                            ]
                            var totalCostoDirecto = CostoDirecto.monto
                            AmpliacionPresupuestal.forEach((item, j) => {
                                totalCostoDirecto -= item.costoDirectoAdicional.monto || 0
                            });
                            CostosDirectos.push(
                                { text: Redondea(totalCostoDirecto) },
                            )
                            costoTotal.push(
                                totalCostoDirecto
                            )
                            AmpliacionPresupuestal.forEach((item, j) => {
                                CostosDirectos.push(
                                { text: Redondea(item.costoDirectoAdicional.monto) }
                                )
                            costoTotal.push(
                                item.costoDirectoAdicional.monto
                            )
                            });
                            CostosDirectos.push(
                                { text: Redondea(CostoDirecto.monto) }
                            )
                            costoTotal.push(CostoDirecto.monto)
                            return[CostosDirectos]
                        })()
                    )
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths:costosWidths,
                    body:
                        [
                            (() => {
                                var columnas = [
                                    { text: 'DESCRIPCION', colSpan: 2, alignment: "center", color: "red" },
                                    { text: '' },
                                    { text: 'EXP. TEC. APROB.', alignment: "center", color: "red" },
                                    // { text: 'ADIC. APROB.', alignment: "center", color: "red" },
                                    // { text: 'PARCIAL', alignment: "center", color: "red" }
                                ]
                                AmpliacionPresupuestal.forEach((item, i) => {
                                    columnas.push(
                                        { text: 'ADIC. APROB.' + (i + 1), alignment: "center", color: "red" }
                                    )
                                });
                                columnas.push(
                                    { text: 'PARCIAL', alignment: "center", color: "red" }
                                )
                                return columnas
                            })()
                        ].concat(
                            (() => {
                                
                                var CostosIndirectos = []
                                for (let i = 0; i < DatosCostosIndirectos.length; i++) {
                                    const element = DatosCostosIndirectos[i];
                                    var parcial = element.monto_expediente
                                    var fila =
                                        [
                                            { text: element.nombre, border: [true, true, false, true], },
                                            { text: '', border: [false, true, true, true], alignment: "right" },
                                            { text: Redondea(element.monto_expediente) },
                                        ]
                                    AmpliacionPresupuestal.forEach((item, j) => {
                                        fila.push(
                                            { text: item.costoIndirectoAdicional[i] ? Redondea(item.costoIndirectoAdicional[i].monto) : "" }
                                        )
                                        parcial += item.costoIndirectoAdicional[i] ? item.costoIndirectoAdicional[i].monto : 0
                                    });

                                    fila.push(
                                        { text: Redondea(parcial) }
                                    )
                                    CostosIndirectos.push(
                                        fila
                                    )
                                }
                                var totalCostosExpTec = DatosCostosIndirectos.reduce(
                                    (accumulator, item) => accumulator + item.monto_expediente, 0
                                )
                                var totalParcial = totalCostosExpTec
                                var filaTotales = [
                                    { text: 'TOTAL COSTO INDIRECTO S/.', colSpan: 2, alignment: "center", bold: true },
                                    { text: '' },
                                    {
                                        text: Redondea(totalCostosExpTec), alignment: "center", bold: true
                                    },
                                ]
                                costoTotal[0]+= totalCostosExpTec
                                AmpliacionPresupuestal.forEach((item, j) => {
                                    var tempTotal = item.costoIndirectoAdicional.reduce(
                                        (accumulator, item) => accumulator + item.monto, 0
                                    )
                                    filaTotales.push(
                                        {
                                            text: Redondea(tempTotal), alignment: "center", bold: true
                                        }
                                    )
                                    totalParcial += tempTotal
                                    costoTotal[j+1]+= tempTotal
                                });

                                filaTotales.push(
                                    { text: Redondea(totalParcial) }
                                )
                                costoTotal[costoTotal.length-1] += totalParcial
                                CostosIndirectos.push(
                                    filaTotales
                                )
                                return CostosIndirectos
                            })()
                        )
                    // .concat(totalPresupuestoAprobado)
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === node.table.body.length - 1) ? 2.5 : 1;
                    },
                    hLineColor: function (i, node) {
                        return (i === node.table.body.length - 1) ? 'black' : 'black';
                    },
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths:costosWidths,
                    body: [
                        (() => {
                            var columnas = [
                                { text: 'DESCRIPCION', colSpan: 2, alignment: "center", color: "red" },
                                { text: '' },
                                { text: 'EXP. TEC. APROB.', alignment: "center", color: "red" },
                                // { text: 'ADIC. APROB.', alignment: "center", color: "red" },
                                // { text: 'PARCIAL', alignment: "center", color: "red" }
                            ]
                            AmpliacionPresupuestal.forEach((item, i) => {
                                columnas.push(
                                    { text: 'ADIC. APROB.' + (i + 1), alignment: "center", color: "red" }
                                )
                            });
                            columnas.push(
                                { text: 'PARCIAL', alignment: "center", color: "red" }
                            )
                            return columnas
                        })()
                    ].concat(
                        (()=>{
                            var CostosDirectos = [
                                { text: "TOTAL PRESUPUESTO APROBAOO S/.", colSpan: 2,alignment: "center", bold: true },
                                { text: '' },
                            ]
                            costoTotal.forEach(item => {
                                CostosDirectos.push(
                                    { text: Redondea(item) },
                                )
                            });
                            return[CostosDirectos]
                        })()
                    )
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
            {
                style: 'tableExample',
                bold:true,
                table: {
                    widths: ['*', 'auto', 'auto', 'auto'],                    
                    body:
                        [
                            [
                                { text: FichaTecnicaDatosGenerales.resolucion_descripcion },
                                { text: FichaTecnicaDatosGenerales.resolucion_documento },
                                { text: 'FECHA', border: [true, true, false, true] },
                                { text: fechaFormatoClasico(FichaTecnicaDatosGenerales.resolucion_fecha), border: [false, true, true, true]  }
                            ],
                        ].concat(
                            (() => {
                                var resoluciones = []
                                for (let i = 0; i < AmpliacionPresupuestal.length; i++) {
                                    const item = AmpliacionPresupuestal[i];
                                    resoluciones.push(
                                        [
                                            { text: item.descripcion },
                                            { text: item.documento_resolucion },
                                            { text: 'FECHA', border: [true, true, false, true] },
                                            { text: fechaFormatoClasico(item.fecha), border: [false, true, true, true] }
                                        ]
                                    )
                                }
                                return resoluciones
                            })()
                        )
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: '', border: [false, false, false, false] }],
                    ]
                }
            },
            { text: 'CONTROL DEL GASTO DEL PROYECTO', style: 'header', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            { text: 'presupuesto inicial expediente tecnico',color:"red",alignment: 'center' },
                            { text: 'adicionales aprobado',color:"red",alignment: 'center' },
                            { text: 'total presupuesto aprobado',color:"red",alignment: 'center' },
                            { text: '', border: [true, false, true, false], rowSpan: 2 },
                            { text: 'ejecucion presupuesto al 2019',color:"red",alignment: 'center' },
                            { text: 'saldo presupuesto al 2019',color:"red",alignment: 'center' },
                            { text: '', border: [true, false, true, false], rowSpan: 3 },
                            { text: 'PIM\n 2020',color:"red",alignment: 'center', },
                            { text: 'saldo por asignar',color:"red",alignment: 'center' }
                        ],
                        [
                            { text: Redondea(costoTotal[0]),alignment: 'center' },
                            { text: (()=>
                                 Redondea(costoTotal.reduce(
                                    (accumulator, item,i) => {
                                        if (i == 0 || i == costoTotal.length-1) {
                                            return accumulator
                                        }else{
                                           return accumulator + item
                                        }
                                        
                                    }, 0
                                )
                                )                                    
                            )(),alignment: 'center' },
                            { text: Redondea(costoTotal[costoTotal.length-1]),alignment: 'center' },
                            { text: '' },
                            { text: Redondea(EjecucionPresupuestal.monto),alignment: 'center' },
                            { text: Redondea(costoTotal[costoTotal.length-1]-(EjecucionPresupuestal.monto || 0)),alignment: 'center' },
                            { text: '' },
                            { text: Redondea(Pim.monto),alignment: 'center' },
                            { text: Redondea(costoTotal[costoTotal.length-1]-(EjecucionPresupuestal.monto || 0) - (Pim.monto || 0)),alignment: 'center' }
                        ],
                        [
                            { text: '', border: [false, true, true, false] },
                            { text: (()=>{
                                var costoTotalAdicional = costoTotal.reduce(
                                    (accumulator, item,i) => {
                                        if (i == 0 || i == costoTotal.length-1) {
                                            return accumulator
                                        }else{
                                           return accumulator + item
                                        }
                                        
                                    }, 0
                                )
                                return Redondea(costoTotalAdicional/costoTotal[0]*100) + " %"
                            }                               
                           )(),alignment: 'center' },
                            { text: '', border: [true, true, false, false] },
                            { text: '', border: [false, false, true, false] },
                            { text: Redondea(EjecucionPresupuestal.monto/costoTotal[costoTotal.length-1] *100) + " %",alignment: 'center'},
                            { text: Redondea((costoTotal[costoTotal.length-1]-EjecucionPresupuestal.monto)/costoTotal[costoTotal.length-1] *100)+ " %",alignment: 'center' },
                            { text: '' },
                            { text: Redondea((Pim.monto)/costoTotal[costoTotal.length-1] *100) + " %",alignment: 'center'},
                            { text: Redondea((costoTotal[costoTotal.length-1]-EjecucionPresupuestal.monto - Pim.monto)/costoTotal[costoTotal.length-1] *100) + " %",alignment: 'center'}
                        ],
                    ]
                }
            },
        ]
        var dd = {
            header: {
                // style: 'tableExample',
                margin: [0, 2, 0, 0],
                table: {
                    body: [
                        [
                            {
                                image: logoGRPuno,
                                fit: [280, 280],
                                margin: [45, 0, 50, 0],
                                border: [false, false, true, false]
                            },
                            {
                                text: 'META ' + DatosFichasMeta.numero,
                                alignment: 'center',
                                margin: [45, 4, 50, 0],
                            },
                        ]
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return 5;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'black';
                    },
                },
            },
            // footer: {
            //     text: 'fecha de reporte : ',
            //     alignment: 'right',
            //     italics: true,
            //     margin: [20, 10, 10, 0],
            //     fontSize: 6.5,
            // },
            content: [
                { text: 'FICHA TECNICA DE CONTROL DE OBRA', style: 'header', alignment: 'center', margin: [0, 5, 0, 0], bold: true },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['*', '*', '*', '*'],
                        body: [
                            [
                                { text: '', border: [false, false, false, false], },
                                { text: 'Correspondiente al ', border: [true, true, false, true], },
                                { text: GenerateFechaPdf(), border: [false, true, true, true], alignment: 'center', bold: true },
                                { text: '', border: [false, false, false, false], },
                            ],
                            [
                                { text: FichaTecnicaDatosGenerales.g_meta, colSpan: 4 }
                            ]
                        ]
                    }
                },
                {
                    style: 'tableExample',
                    table: {
                        body: [
                            [{ text: '', border: [false, false, false, false] }],
                        ]
                    }
                },
            ].concat(DatosGenerales, PeriodoEjecucion, PresupuestoObra),
            pageSize: 'A4',
            // pageOrientation: 'portrait'
            // pageOrientation: 'landscape',
            defaultStyle: {
                alignment: 'justify',
                fontSize: 8.5,
                // bold: true,
            },
        }
        pdfmake.vfs = pdfFonts.pdfMake.vfs;

        var pdfDocGenerator = pdfmake.createPdf(dd);
        pdfDocGenerator.open()
        setLoading(false)
    }
    return (
        <div >
            {/* <Container> */}
            <li className="lii">
                <div className="d-flex"
                    style={{
                        alignItems: "center",
                    }}
                >
                    <a href="#"
                        onClick={() => generatePdf()}
                    >
                        <FaFilePdf className="text-danger" /> Ficha Tecnica ✔</a>
                    {Loading &&
                        <Backdrop className={classes.backdrop} open> <CircularProgress color="inherit" />
                        </Backdrop>}
                </div>
            </li>
            {/* </Container> */}
        </div>
    );
}
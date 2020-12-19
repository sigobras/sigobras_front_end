import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { FaFilePdf } from "react-icons/fa";

import { logoSigobras, logoGRPuno, ImgDelta } from '../Complementos/ImgB64'
import { UrlServer } from '../../Utils/ServerUrlConfig'
const { Redondea, mesesShort, meses } = require('../../Utils/Funciones');

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
        console.log("request getDatosGenerales2", request.data);
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
        console.log("request plazos -->", res.data);
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
        console.log("poropopo", res.data);
        // setDatosCostosIndirectos(res.data)
        return res.data
    }

    function fechaLarga(fecha) {
        var fechaTemp = fecha.split('-')
        var date = new Date(fechaTemp[0], fechaTemp[1] - 1, fechaTemp[2]);
        var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: "long" };
        return date.toLocaleDateString("es-ES", options)
    }

    function addDaysToEndDate(fecha, dias) {
        var fechaTemp = fecha.split('-')
        var date = new Date(fechaTemp[0], fechaTemp[1] - 1, fechaTemp[2]);

        console.log("date", date);

        date.setDate(date.getDate() + Number(dias));
        console.log("dias", dias);

        console.log("Date 2", date, typeof Number(dias));
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
        console.log("DatosCostosIndirectos", DatosCostosIndirectos);

        var DatosGenerales = [
            { text: '1.-DATOS GENERALES', style: 'header', alignment: 'left',bold: true  },
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
                            { text: 'Codigo unificado ',bold: true,  border: [false, false, false, false]},
                            { text: FichaTecnicaDatosGenerales.codigo_unificado == null ? "----" : FichaTecnicaDatosGenerales.codigo_unificado },
                            { text: '<-------------->', border: [false, false, false, false], },
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
                    widths: ['*', 'auto', '*', 'auto', '*', 'auto', '*'],
                    body: [
                        [
                            { text: 'DEPARTAMENTO', },
                            { text: ' ', border: [false, false, false, false], },
                            { text: 'PROVINCIA', border: [true, true, true, true], },
                            { text: '', border: [false, false, false, false], },
                            { text: 'DISTRITO' },
                            { text: '', border: [false, false, false, false], },
                            { text: 'CENTRO POBLADO / DIRRECCION' }
                        ],
                        [
                            { text: 'Puno', },
                            { text: ' ', border: [false, false, false, false], },
                            { text: FichaTecnicaDatosGenerales.g_local_prov, border: [true, true, true, true], },
                            { text: '', border: [false, false, false, false], },
                            { text: FichaTecnicaDatosGenerales.g_local_dist },
                            { text: '', border: [false, false, false, false], },
                            { text: FichaTecnicaDatosGenerales.centropoblado_direccion }
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
                { text: 'Ampliacion Plazo de ejecucion aprobado inicialmente', rowSpan: LengthRowDatosTipo3.length + 1, colSpan: 2 },
                { text: '', },
                { text: 'AMP. plazo' },
                { text: 'Resolucion de aprobacion' },
                { text: 'Fecha de aprobacion' }
            ],

        ]
        for (let i = 0; i < FichaTecnicaPlazos.length; i++) {
            const element = FichaTecnicaPlazos[i];

            if (element.tipo == 3 && element.plazo_aprobado == 1) {
                DatosTipo3.push(
                    [
                        { text: '', },
                        { text: '', },
                        { text: element.n_dias },
                        { text: element.documento_resolucion_estado },
                        { text: fechaLarga(element.fecha_aprobada) }
                    ],
                )
            }

        }
        // console.log("DatosTipo3 length", DatosTipo3.length);
        // var LengthRowDatosTipo3 = DatosTipo3.length
        // console.log("---<>", LengthRowDatosTipo3);

        var ItemSuma = []
        let total = 0;
        // for (let i of FichaTecnicaPlazos.length) total += i.n_dias;
        for (let i = 0; i < FichaTecnicaPlazos.length; i++) {
            const element = FichaTecnicaPlazos[i];
            if (element.tipo == 3 && element.plazo_aprobado == 1) {
                total += element.n_dias
            }
        }
        ItemSuma.push(
            [
                { text: '', border: [false, true, true, false], },
                { text: 'Total de dias aprobados' },
                { text: total },
                { text: 'Termino de obra Reprogramado' },
                { text: 'Any DAT' }
            ],
        )

        // AMPLIACION DE PRESUPUESTO SEGUN ITEM Y .....

        var AmpliacionItem = [
            // [
            //     { text: 'Periodo solicitado' },
            //     { text: 'Situaicon del tramite', rowSpan: 2 },
            //     { text: '',},
            //     { text: '' },
            // ],
        ]
        for (let i = 0; i < FichaTecnicaPlazos.length; i++) {
            const element = FichaTecnicaPlazos[i];
            if (element.tipo == 3 && element.plazo_aprobado == 0) {
                AmpliacionItem.push(
                    [
                        { text: 'Periodo\n solicitado' },
                        { text: element.n_dias },
                        { text: 'Situaicon del tramite' },
                        { text: element.descripcion, colSpan: 2 },
                        { text: '' }
                    ],
                )
            }
        }
        var FechaAmpliacion = [
            [
                { text: '', border: [false, true, false, false], },
                { text: '', border: [false, true, false, false], },
                { text: '', border: [false, true, true, false], },
                { text: 'Fecha reprogramada de termino de obra' },
                { text: 'Any DATE' }
            ],

        ]


        var PeriodoEjecucion = [
            { text: '2.-PERIODO DE EJECUCION', style: 'header', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto', 'auto', '*', '*'],
                    body: [
                        [
                            { text: 'Plazo de ejecucion aprobado inicialmente', rowSpan: 2, },
                            { text: 'Segun exp. tec.' },
                            { text: '', border: [true, false, true, false], rowSpan: 2 },
                            { text: 'Fecha de inicio de obra' },
                            { text: 'Fecha termino programada' }
                        ],
                        [
                            { text: '' },
                            { text: FichaTecnicaDatosGenerales.tiempo_ejec },
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
                    widths: ['auto', '*', 'auto', '*', '*'],
                    body:
                        DatosTipo3.concat(ItemSuma)
                }
            },
            //////////////////////////////
            // { text: 'Ampliacion Plazo de ejecucion aprobado inicialmente', style: 'header', alignment: 'left' },
            // {
            //     style: 'tableExample',
            //     table: {
            //         // widths: ['*', '*', '*', '*','*'],
            //         body:
            //             [
            //                 [
            //                     { text: 'Ampliacion Plazo de ejecucion aprobado inicialmente', rowSpan: 3, colSpan: 2 },
            //                     { text: '', },
            //                     { text: 'AMP. plazo' },
            //                     { text: 'Resolucion de aprobacion' },
            //                     { text: 'Fecha de aprobacion' }
            //                 ],
            //                 [
            //                     { text: '', },
            //                     { text: '', },
            //                     { text: 'AMP. plazo' },
            //                     { text: 'Resolucion de aprobacion' },
            //                     { text: 'Fecha de aprobacion' }
            //                 ],
            //                 [
            //                     { text: '', },
            //                     { text: '', },
            //                     { text: 'AMP. plazo' },
            //                     { text: 'Resolucion de aprobacion' },
            //                     { text: 'Fecha de aprobacion' }
            //                 ],
            //                 [
            //                     { text: '', },
            //                     { text: 'Total de dias aprobados' },
            //                     { text: total },
            //                     { text: 'Termino de obra Reprogramado' },
            //                     { text: 'Any DATE' }
            //                 ],

            //             ]
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
            { text: 'AMPLIACION DEL PLAZO PARA APROBAR', style: 'header', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    widths: ['auto', 'auto', 'auto', 'auto', '*'],
                    body:
                        AmpliacionItem.concat(FechaAmpliacion),
                    // [{ text: 'Periodo solicitado' }, { text: 'FichaTecnicaPlazos.descripcion', colSpan: 1, rowSpan: 1 }, { text: '' }, { text: 'Situaicon del tramite', rowSpan: 1 }],
                    // [{ text: 'Any dates' }, { text: 'a' }, { text: 'b' }, { text: '' }],
                    // [{ text: '', border: [false, true, false, false], }, { text: '', border: [false, true, true, false], }, { text: 'Fecha reprogramada de termino de obra' }, { text: 'Any DATE' }],

                }
            },
            // { text: 'AMPLIACION DEL PLAZO PARA APROBAR', style: 'header', alignment: 'left' },
            // {
            //     style: 'tableExample',
            //     table: {
            //         // widths: ['*', '*', '*', '*'],
            //         body: [
            //             [
            //                 { text: 'Periodo solicitado' },
            //                 { text: 'Situaicon del tramite', rowSpan: 2 },
            //                 { text: 'FichaTecnicaPlazos.descripcion', colSpan: 2, rowSpan: 2 },
            //                 { text: '' },
            //             ],
            //             [
            //                 { text: 'Any dates' },
            //                 { text: '' },
            //                 { text: '' },
            //                 { text: '' }
            //             ],
            //             [
            //                 { text: 'Fecha' },
            //                 { text: 'Situaicon del tramite' },
            //                 { text: 'FichaTecnicaPlazos.descripcion', colSpan: 2 },
            //                 { text: '' },
            //             ],

            //             [
            //                 { text: '', border: [false, true, false, false], },
            //                 { text: '', border: [false, true, true, false], },
            //                 { text: 'Fecha reprogramada de termino de obra' },
            //                 { text: 'Any DATE' }
            //             ],
            //         ]
            //         // AmpliacionItem.concat(FechaAmpliacion),

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
        ]

        var CostosIndirectos = [
            [
                { text: 'DESCRIPCION', colSpan: 2 },
                { text: '' },
                { text: 'EXP. TEC. APROB.' },
                { text: 'ADIC. APROB.' },
                { text: 'PARCIAL' }
            ],
        ]

        for (let i = 0; i < DatosCostosIndirectos.length; i++) {
            const element = DatosCostosIndirectos[i];
            CostosIndirectos.push(
                [
                    { text: element.nombre, border: [true, true, false, true], },
                    { text: 'Any Dates', border: [false, true, true, true], },
                    { text: Redondea(element.monto_expediente) },
                    { text: Redondea(element.monto_adicional) },
                    { text: Redondea(element.monto_expediente + element.monto_adicional) }
                ],
            )

        }

        var totalPresupuestoAprobado = []
        totalPresupuestoAprobado.push(
            [
                { text: 'TOTAL PRESUPUESTO APROBADO S/.', colSpan: 2 },
                { text: '' },
                {
                    text: Redondea(DatosCostosIndirectos.reduce(
                        (accumulator, item) => accumulator + item.monto_expediente , 0
                    ))
                },
                {
                    text: Redondea(DatosCostosIndirectos.reduce(
                        (accumulator, item) => accumulator  + item.monto_adicional, 0
                    ))
                },
                {
                    text: Redondea(DatosCostosIndirectos.reduce(
                        (accumulator, item) => accumulator + item.monto_expediente + item.monto_adicional, 0
                    ))
                }
            ],
        )

        var PresupuestoObra = [
            { text: '3.-PRESUPUESTO DE OBRA', style: 'header', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    widths: ['auto', '*', '*', '*', '*'],
                    body:
                        CostosIndirectos.concat(totalPresupuestoAprobado)
                   
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
                    body: [
                        [
                            { text: 'RESOLUCION DE APROBACION DEL EXPEDIENTE TECNICO' },
                            { text: 'RGGR N° 123456765432- GGR-GR PUNO' },
                            { text: 'FECHA', border: [true, true, false, true] },
                            { text: 'ANY DATE' }
                        ],
                        [
                            { text: 'ULTIMA RESOLUCION DE APROBACION (EXP TECNICO MODIFICADO)' },
                            { text: 'RGGR N° 123456765432- GGR-GR PUNO' },
                            { text: 'FECHA', border: [true, true, false, true] },
                            { text: 'ANY DATE' }
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
            { text: 'CONTROL DEL GASTO DEL PROYECTO', style: 'header', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            { text: 'presupuesto inicial expediente tecnico' },
                            { text: 'adicionales aprobado' },
                            { text: 'total presupuesto aprobado' },
                            { text: '', border: [true, false, true, false], rowSpan: 2 },
                            { text: 'ejecucion presupuesto al 2019' },
                            { text: 'saldo presupuesto al 2019' },
                            { text: '', border: [true, false, true, false], rowSpan: 3 },
                            { text: 'PIM 2020' },
                            { text: 'saldo por asignar' }
                        ],
                        [
                            { text: 'ANY DATES' },
                            { text: 'ANY DATES' },
                            { text: 'ANY DATES' },
                            { text: '' },
                            { text: 'ANY DATES' },
                            { text: 'ANY DATES' },
                            { text: '' },
                            { text: 'ANY DATES' },
                            { text: 'ANY DATES' }
                        ],
                        [
                            { text: '', border: [false, true, true, false] },
                            { text: 'ANY PORCENTAJE' },
                            { text: '', border: [true, true, false, false] },
                            { text: '', border: [false, false, true, false] },
                            { text: 'ANY PORCENTAJE' },
                            { text: 'ANY PORCENTAJE' },
                            { text: '' },
                            { text: 'ANY PORCENTAJE' },
                            { text: 'ANY PORCENTAJE' }
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
                                text: 'METAS2 +  ANY NUmber',
                                alignment: 'center',
                                margin: [45, 4, 50, 0],
                            },
                        ]
                    ]
                },
                layout: {
                    hLineWidth:function (i, node) {
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
                // columns: [
                //     {
                //         image: logoGRPuno,
                //         fit: [280, 280],
                //         margin: [45, 4, 10, 0]
                //     },
                //     {
                //         alignment: 'right',
                //         image: logoSigobras,
                //         width: 48,
                //         height: 30,
                //         margin: [20, 4, 10, 0]

                //     }
                // ]
            },
            footer: {
                text: 'fecha de reporte : ',
                alignment: 'right',
                italics: true,
                margin: [20, 10, 10, 0],
                fontSize: 6.5,
            },
            content: [
                { text: 'FICHA TECNICA DE CONTROL DE OBRA', style: 'header', alignment: 'center', margin: [0, 5, 0, 0] },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['*', '*', '*', '*'],
                        body: [
                            [
                                { text: '', border: [false, false, false, false], },
                                { text: 'Correspondiente al ', border: [true, true, false, true], color: 'red',bold: true },
                                { text: GenerateFechaPdf(), border: [false, true, true, true], },
                                { text: '', border: [false, false, false, false], },
                            ],
                            [
                                { text: FichaTecnicaDatosGenerales.g_meta, colSpan: 4 }
                            ]
                        ]
                    },layout: {
                        hLineWidth:function (i, node) {
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
                        // hLineStyle: function (i, node) {
                        //     if (i === 0 || i === node.table.body.length) {
                        //         return null;
                        //     }
                        //     return {dash: {length: 10, space: 4}};
                        // },
                        // vLineStyle: function (i, node) {
                        //     if (i === 0 || i === node.table.widths.length) {
                        //         return null;
                        //     }
                        //     return {dash: {length: 4}};
                        // },
                        // paddingLeft: function(i, node) { return 4; },
                        // paddingRight: function(i, node) { return 4; },
                        // paddingTop: function(i, node) { return 2; },
                        // paddingBottom: function(i, node) { return 2; },
                        // fillColor: function (i, node) { return null; }
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
                fontSize: 9,
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
                        <FaFilePdf className="text-danger" /> Expediente Tecnico ✔</a>
                    {Loading &&
                        <Backdrop className={classes.backdrop} open> <CircularProgress color="inherit" />
                        </Backdrop>}
                </div>
            </li>
            {/* </Container> */}
        </div>
    );
}
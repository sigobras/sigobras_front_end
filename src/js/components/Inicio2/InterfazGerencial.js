import React, { Component } from "react";
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea1 } from '../Utils/Funciones';
import axios from "axios";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class InterfazGerencial extends Component {
    constructor() {
        super();
        this.state = {
            getProvincias: [],
            getSectores: [],
            getModalidadesEjecutoras: [],
            getEstados: [],
            id_unidadEjecutora: 0,
            idsectores: 0,
            idmodalidad_ejecutora: 0,
            id_Estado: 0,
            getInterfazGerencialData: [],
            getInterfazGerencialDataProcesada: [],
            avance_fisico_chart: [],
            avance_fisico_programado_chart: [],
            anyos_chart: [],
            anyo_chart_seleccionado: 0
        };
        this.getDataSelect = this.getDataSelect.bind(this);
        this.updateInput = this.updateInput.bind(this);
        this.getInterfazGerencialData = this.getInterfazGerencialData.bind(this);
    }
    componentWillMount() {
        this.getDataSelect("getProvincias")
        this.getDataSelect("getSectores")
        this.getDataSelect("getModalidadesEjecutoras")
        this.getDataSelect("getEstados")
        this.chart_data_anyos()
    }
    getDataSelect(selectData, id_unidadEjecutora = 0) {
        axios.post(`${UrlServer}/${selectData}`,
            {
                "id_acceso": sessionStorage.getItem("idacceso"),
                "id_unidadEjecutora": id_unidadEjecutora
            }
        )
            .then((res) => {
                this.setState({
                    [selectData]: res.data,
                })
            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })
    }
    async updateInput(name, value) {
        await this.setState({
            [name]: value,
        })
        if (name == "id_unidadEjecutora") {

            this.getDataSelect("getSectores", value)
            this.getDataSelect("getModalidadesEjecutoras", value)
            this.getDataSelect("getEstados", value)
            this.chart_data_anyos()
        } else if (name == "anyo_chart_seleccionado") {
            this.chart_data()
        }


    }
    getInterfazGerencialData() {
        console.log("cargando data");

        axios.post(`${UrlServer}/getInterfazGerencialData`,
            {
                "id_acceso": sessionStorage.getItem("idacceso"),
                "id_unidadEjecutora": this.state.id_unidadEjecutora,
                "idsectores": this.state.idsectores,
                "idmodalidad_ejecutora": this.state.idmodalidad_ejecutora,
                "id_Estado": this.state.id_Estado,
            }
        )
            .then((res) => {
                var dataTemp = res.data
                var unidad_ejecutora_nombre = ""
                var unidad_ejecutora_lista = []
                var unidad_ejecutora = {}
                var sector = {}
                var sector_nombre = ""
                for (let i = 0; i < dataTemp.length; i++) {
                    const element = dataTemp[i];

                    if (element.unidad_ejecutora_nombre != unidad_ejecutora_nombre) {
                        if (i != 0) {
                            unidad_ejecutora.sectores.push(sector)
                            unidad_ejecutora_lista.push(unidad_ejecutora)
                        }
                        unidad_ejecutora = {}
                        unidad_ejecutora.nombre = element.unidad_ejecutora_nombre
                        unidad_ejecutora.sectores = []
                        sector = {
                            nombre: element.sector_nombre,
                            obras: [
                                {
                                    codigo: element.codigo,
                                    modalidad_ejecutora_nombre: element.modalidad_ejecutora_nombre,
                                    estado_nombre: element.estado_nombre,
                                    fecha_inicial: element.fecha_inicial,
                                    avanceFisico_porcentaje: element.avanceFisico_porcentaje,
                                    avanceFinanciero_porcentaje: element.avanceFinanciero_porcentaje
                                }
                            ]
                        }
                        unidad_ejecutora_nombre = element.unidad_ejecutora_nombre
                        sector_nombre = element.sector_nombre
                    } else {

                        if (element.sector_nombre != sector_nombre) {

                            unidad_ejecutora.sectores.push(sector)
                            sector = {
                                nombre: element.sector_nombre,
                                obras: [
                                    {
                                        codigo: element.codigo,
                                        modalidad_ejecutora_nombre: element.modalidad_ejecutora_nombre,
                                        estado_nombre: element.estado_nombre,
                                        fecha_inicial: element.fecha_inicial,
                                        avanceFisico_porcentaje: element.avanceFisico_porcentaje,
                                        avanceFinanciero_porcentaje: element.avanceFinanciero_porcentaje
                                    }
                                ]
                            }
                            sector_nombre = element.sector_nombre
                        } else {
                            sector.obras.push(
                                {
                                    codigo: element.codigo,
                                    modalidad_ejecutora_nombre: element.modalidad_ejecutora_nombre,
                                    estado_nombre: element.estado_nombre,
                                    fecha_inicial: element.fecha_inicial,
                                    avanceFisico_porcentaje: element.avanceFisico_porcentaje,
                                    avanceFinanciero_porcentaje: element.avanceFinanciero_porcentaje
                                }
                            )

                        }

                    }


                }
                unidad_ejecutora.sectores.push(sector)
                unidad_ejecutora_lista.push(unidad_ejecutora)
                this.setState({
                    getInterfazGerencialData: res.data,
                    getInterfazGerencialDataProcesada: unidad_ejecutora_lista
                })
            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })
        this.chart_data()
    }
    async chart_data_anyos() {
        var avance_fisico_anyos = []
        var avance_fisico_programado_anyos = []
        var res = await axios.post(`${UrlServer}/IG_AvanceFisico_anyos`,
            {
                "id_acceso": sessionStorage.getItem("idacceso"),
                "id_unidadEjecutora": this.state.id_unidadEjecutora,
                "idsectores": this.state.idsectores,
                "idmodalidad_ejecutora": this.state.idmodalidad_ejecutora,
                "id_Estado": this.state.id_Estado,

            }
        );
        avance_fisico_anyos = res.data
        res = await axios.post(`${UrlServer}/IG_AvanceFisicoProgramado_anyos`,
            {
                "id_acceso": sessionStorage.getItem("idacceso"),
                "id_unidadEjecutora": this.state.id_unidadEjecutora,
                "idsectores": this.state.idsectores,
                "idmodalidad_ejecutora": this.state.idmodalidad_ejecutora,
                "id_Estado": this.state.id_Estado,

            }
        );
        avance_fisico_programado_anyos = res.data
        function arrayUnique(array) {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    console.log(a[i]);
                    if (a[i].anyo === a[j].anyo)
                        a.splice(j--, 1);
                }
            }
            return a;
        }
        var anyos_chart = arrayUnique(avance_fisico_anyos.concat(avance_fisico_programado_anyos))
        console.log(avance_fisico_anyos, avance_fisico_programado_anyos, anyos_chart);
        this.setState({
            anyos_chart
        })

    }
    async chart_data() {
        console.log("chart data");
        var avance_fisico = []
        var avance_fisico_programado = []
        var res = await axios.post(`${UrlServer}/IG_AvanceFisico`,
            {
                "id_acceso": sessionStorage.getItem("idacceso"),
                "id_unidadEjecutora": this.state.id_unidadEjecutora,
                "idsectores": this.state.idsectores,
                "idmodalidad_ejecutora": this.state.idmodalidad_ejecutora,
                "id_Estado": this.state.id_Estado,
                "anyo": this.state.anyo_chart_seleccionado
            }
        );
        avance_fisico = res.data
        res = await axios.post(`${UrlServer}/IG_AvanceFisicoProgramado`,
            {
                "id_acceso": sessionStorage.getItem("idacceso"),
                "id_unidadEjecutora": this.state.id_unidadEjecutora,
                "idsectores": this.state.idsectores,
                "idmodalidad_ejecutora": this.state.idmodalidad_ejecutora,
                "id_Estado": this.state.id_Estado,
                "anyo": this.state.anyo_chart_seleccionado
            }
        );
        avance_fisico_programado = res.data
        console.log(avance_fisico, avance_fisico_programado);
        var avance_fisico_chart = []
        var avance_fisico_programado_chart = []
        for (let i = 1; i <= 12; i++) {
            var index = avance_fisico.findIndex(x => x.mes == i)
            if (index != -1) {
                avance_fisico_chart.push(avance_fisico[index].avance)
            } else {
                avance_fisico_chart.push(
                    0
                )
            }
            var index = avance_fisico_programado.findIndex(x => x.mes == i)
            if (index != -1) {
                avance_fisico_programado_chart.push(avance_fisico_programado[index].avance)
            } else {
                avance_fisico_programado_chart.push(
                    0
                )
            }
        }
        console.log(avance_fisico_chart, avance_fisico_programado_chart);
        this.setState({
            avance_fisico_chart,
            avance_fisico_programado_chart
        })
    }
    render() {
        const options = {
            chart: {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#242526'],
                        [1, '#242526']
                    ]
                },

                type: 'column'
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },

            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                },
                text: 'PROGRAMADO' + ' ' + 2020
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                },
                // text: 'Obra:' + '' + sessionStorage.getItem('codigoObra')  //codigo nombre de la obra
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true,
                title: {
                    text: 'Proyecciones'
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Soles (S/.)'
                },
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                },
                headerFormat: '<span style="font-size:20px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} soles</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true

            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: [

                {
                    name: 'Avance Fisico',
                    data: this.state.avance_fisico_chart
                }, {
                    name: 'Avance Fisico Programado',
                    data: this.state.avance_fisico_programado_chart

                }
            ]

        };
        return (
            <div>
                <select onChange={event => this.updateInput('id_unidadEjecutora', event.target.value)}>
                    <option value="0">
                        Todas las provincias
                    </option>
                    {this.state.getProvincias.map((item, index) =>
                        <option value={item.id_unidadEjecutora}>{item.nombre}</option>
                    )}
                </select>
                <select onChange={event => this.updateInput('idsectores', event.target.value)}>
                    <option value="0">
                        Todas las sectores
                    </option>
                    {this.state.getSectores.map((item, index) =>
                        <option value={item.idsectores}>{item.nombre}</option>
                    )}
                </select>
                <select onChange={event => this.updateInput('idmodalidad_ejecutora', event.target.value)}>
                    <option value="0">
                        Todas las modalidades
                    </option>
                    {this.state.getModalidadesEjecutoras.map((item, index) =>
                        <option value={item.idmodalidad_ejecutora}>{item.nombre}</option>
                    )}
                </select>
                <select onChange={event => this.updateInput('id_Estado', event.target.value)}>
                    <option value="0">
                        Todas los estados
                    </option>
                    {this.state.getEstados.map((item, index) =>
                        <option value={item.id_Estado}>{item.nombre}</option>
                    )}
                </select>
                <button onClick={() => this.getInterfazGerencialData()}>
                    Buscar
                </button>
                <br />
                <select onChange={event => this.updateInput('anyo_chart_seleccionado', event.target.value)}>
                    <option value="0">
                        seleccione el anyo
                    </option>
                    {this.state.anyos_chart.map((item, index) =>
                        <option value={item.anyo}>{item.anyo}</option>
                    )}
                </select>
                <HighchartsReact

                    highcharts={Highcharts}
                    options={options}
                />
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>codigo</th>
                            <th>avance</th>
                            <th>modalidad_ejecutora_nombre</th>
                            <th>estado_nombre</th>
                            <th>fecha_inicial</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.getInterfazGerencialDataProcesada.map((provincia, index) =>
                            [
                                <tr>
                                    <th>
                                        <h4 colSpan="2">{provincia.nombre}</h4>
                                    </th>
                                </tr>,
                                provincia.sectores.map((sector, index2) =>
                                    [
                                        <tr>
                                            <th>
                                                <h5 colSpan="2">{sector.nombre}</h5>
                                            </th>
                                        </tr>,

                                        sector.obras.map((obra, index3) =>
                                            <tr>
                                                <td>{obra.codigo}</td>
                                                <td style={{ width: '20%' }}>

                                                    <div style={{
                                                        width: '100%',
                                                        height: '30px',
                                                        textAlign: 'center'
                                                    }}
                                                    >

                                                        <div style={{
                                                            height: '8px',
                                                            backgroundColor: '#4a4b4c',
                                                            borderRadius: '5px',
                                                            position: 'relative',

                                                        }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: `${Redondea1(obra.avanceFisico_porcentaje)}%`,
                                                                    height: '100%',
                                                                    backgroundColor: Redondea1(obra.avanceFisico_porcentaje) > 85 ? 'rgb(0, 128, 255)'
                                                                        : Redondea1(obra.avanceFisico_porcentaje) > 30 ? '#ffbf00'
                                                                            : '#ff2e00',
                                                                    borderRadius: '5px',
                                                                    transition: 'all .9s ease-in',
                                                                    position: 'absolute',


                                                                }}
                                                            /><span style={{ position: 'inherit', fontSize: '0.8rem', top: '6px' }}>Físico ({Redondea1(obra.avanceFisico_porcentaje)} %)</span>
                                                        </div>




                                                    </div>
                                                    {/* porcentaje_financiero */}
                                                    <div style={{
                                                        width: '100%',
                                                        height: '20px',
                                                        textAlign: 'center'
                                                    }}
                                                    >

                                                        <div style={{
                                                            height: '8px',
                                                            backgroundColor: '#4a4b4c',
                                                            borderRadius: '5px',
                                                            position: 'relative'
                                                        }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: `${Redondea1(obra.avanceFinanciero_porcentaje)}%`,
                                                                    height: '100%',
                                                                    backgroundColor: Redondea1(obra.avanceFinanciero_porcentaje) > 85 ? 'rgb(0, 128, 255)'
                                                                        : Redondea1(obra.avanceFinanciero_porcentaje) > 30 ? '#fac934'
                                                                            : '#ff552f',
                                                                    borderRadius: '5px',
                                                                    transition: 'all .9s ease-in',
                                                                    position: 'absolute',

                                                                }}
                                                            /><span style={{ position: 'inherit', fontSize: '0.7rem', top: '6px', color: '#8caeda' }}>Financiero ({Redondea1(obra.avanceFinanciero_porcentaje)} %)</span>
                                                        </div>

                                                    </div>

                                                </td>
                                                <td>{obra.modalidad_ejecutora_nombre}</td>
                                                <td>{obra.estado_nombre}</td>
                                                <td>{obra.fecha_inicial}</td>
                                            </tr>
                                        )

                                    ]
                                )
                            ]
                        )}
                    </tbody>
                </table>


            </div>
        );
    }
    // "text-center pb-2"

}

export default InterfazGerencial;
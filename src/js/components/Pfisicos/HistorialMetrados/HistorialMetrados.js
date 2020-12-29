import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Nav, NavItem, NavLink, Card, CardHeader, CardBody, Spinner, Collapse, Row, Col, Button } from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../Utils/ServerUrlConfig'
import { Redondea, mesesShort } from "../../Utils/Funciones"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HistorialObservaciones from './HistorialObservaciones';
import { MdComment } from 'react-icons/md';
import { DebounceInput } from 'react-debounce-input';
import { MdSave, MdClose, MdModeEdit, MdSettings, MdDeleteForever } from "react-icons/md";

import PartidasChat from '../../libs/PartidasChat'
import CheckDate from './CheckDate';



export default () => {
    function FechaLarga(fecha) {
        var fechaTemp = fecha.split("-")
        var ShortDate = new Date(fechaTemp[0], fechaTemp[1] - 1, [fechaTemp[2]]);
        var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: "long" };
        return ShortDate.toLocaleDateString("es-ES", options)
    }

    useEffect(() => {
        fetchAnyos()
        fetchUsuarioData()
    }, []);
    //get data de anyos
    const [Anyos, setAnyos] = useState([]);
    async function fetchAnyos() {
        var request = await axios.post(`${UrlServer}/getHistorialAnyos2`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        setAnyos(request.data)
        var ultimoAnyo = request.data[request.data.length - 1].anyo
        onChangeAnyoSeleccionado(ultimoAnyo)
    }
    //anyo seleccionado
    const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0);
    function onChangeAnyoSeleccionado(anyo) {
        setAnyoSeleccionado(anyo)
        fetchMeses(anyo)
        setMesSeleccionado(0)
        fetchResumenAnualData(anyo)
        setResumenAnualDataChart([])
        setResumenAnualDataChartCategories([])
    }
    //get data de meses
    const [Meses, setMeses] = useState([]);
    async function fetchMeses(anyo) {
        var request = await axios.post(`${UrlServer}/getHistorialMeses2`, {
            id_ficha: sessionStorage.getItem('idobra'),
            anyo: anyo
        })
        setMeses(request.data)
    }
    //mes seleccionado
    const [MesSeleccionado, setMesSeleccionado] = useState(-1);
    function onChangeMesSeleccionado(mes) {
        if (mes != 0) {
            if (toggleHistorialSemanal) {
                setSemanas([])
                fetchSemanas(mes)
            } else {
                fetchComponentes(mes)
                fetchResumenMensualData(mes)
            }
        } else {
            fetchResumenAnualData()
        }
        setMesSeleccionado(mes)
        //reset active comp
        setComponenteSeleccionado({ numero: 0 })
        //reset fechas
        setFechas([])
        //reset semana
        setSemanaSeleccionada(-1)
        setSemanaFechas([])
    }
    //get data de componentes
    const [Componentes, setComponentes] = useState([]);
    async function fetchComponentes(mes) {
        var request = await axios.post(`${UrlServer}/getHistorialComponentes2`,
            {
                id_ficha: sessionStorage.getItem('idobra'),
                anyo: AnyoSeleccionado,
                mes: mes
            }
        )
        setComponentes(request.data)
    }
    //resumen anual
    const [ResumenAnualData, setResumenAnualData] = useState({ data: [] });
    async function fetchResumenAnualData(anyo) {
        var request = await axios.post(`${UrlServer}/getHistorialAnyosResumen2`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "anyo": anyo
            }
        )
        setResumenAnualData(request.data)
        fetchResumenAnualDataChart(request.data)
    }
    const [ResumenAnualDataChart, setResumenAnualDataChart] = useState();
    const [ResumenAnualDataChartCategories, setResumenAnualDataChartCategories] = useState();
    async function fetchResumenAnualDataChart(data) {
        var mes_inicial = data.mes_inicial
        var mes_final = data.mes_final
        var series = []
        var categories = []
        data.data.forEach((item, i) => {
            var data = []
            for (let i = mes_inicial; i <= mes_final; i++) {
                data.push(Number(Number(item["m" + i]).toFixed(2)))
            }
            series.push(
                {
                    "name": item.numero,
                    "data": data
                },
            )
        });
        for (let i = mes_inicial; i <= mes_final; i++) {
            categories.push(mesesShort[i - 1])
        }
        setResumenAnualDataChart(series)
        setResumenAnualDataChartCategories(categories)
    }
    const OptionsResumenAnualDataChart = {
        "colors": [
            "#0080ff",
            "#d35400",
            "#2980b9",
            "#2ecc71",
            "#f1c40f",
            "#2c3e50",
            "#7f8c8d",
            "#cc00ff",
            "#dc3545",
            "#289ba7",
            "#2855a7"
        ],
        chart: {
            type: 'area',
            "backgroundColor": "#242526",
            "style": {
                "fontFamily": "Roboto",
                "color": "#666666"
            }
        },
        title: {
            text: 'RESUMEN ESTADISTICO DE VALORIZACIÓN MENSUAL',
            "align": "center",
            "style": {
                "fontFamily": "Roboto Condensed",
                "fontWeight": "bold",
                "color": "#666666"
            }
        },
        "legend": {
            "align": "center",
            "verticalAlign": "bottom",
            "itemStyle": {
                "color":
                    "#424242",
                "color": "#ffffff"
            }
        },
        subtitle: {
            text: 'General'
        },
        xAxis: {
            categories: ResumenAnualDataChartCategories,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'SOLES'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000;
                }
            },
            "gridLineColor": "#424242",
            "ridLineWidth": 1,
            "minorGridLineColor": "#424242",
            "inoGridLineWidth": 0.5,
            "tickColor": "#424242",
            "minorTickColor": "#424242",
            "lineColor": "#424242"
        },
        tooltip: {
            split: true,
            valueSuffix: ' Soles'
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: ResumenAnualDataChart
    }
    //resumen mensual
    const [ResumenMensualData, setResumenMensualData] = useState([]);
    async function fetchResumenMensualData(mes) {
        var request = await axios.post(`${UrlServer}/getHistorialResumenMensual`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "anyo": AnyoSeleccionado,
                "mes": mes
            }
        )
        setResumenMensualData(request.data.componentes)
        fetchResumenMensualDataChart(request.data.componentes, request.data.diasEjecutados)
    }
    const [ResumenMensualDataChart, setResumenMensualDataChart] = useState();
    const [ResumenMensualDataChartCategories, setResumenMensualDataChartCategories] = useState();
    async function fetchResumenMensualDataChart(componentes, diasEjecutados) {
        var series = []
        var categories = []
        componentes.forEach((item, i) => {
            var data = []
            for (let i = diasEjecutados[0].dia; i <= diasEjecutados[diasEjecutados.length - 1].dia; i++) {
                data.push(Number(Number(item["d" + i]).toFixed(2)))
            };
            series.push(
                {
                    "name": item.numero,
                    "data": data
                },
            )
        });
        for (let i = diasEjecutados[0].dia; i <= diasEjecutados[diasEjecutados.length - 1].dia; i++) {
            categories.push(i)
        }
        setResumenMensualDataChart(series)
        setResumenMensualDataChartCategories(categories)
    }
    const OptionsResumenMensualDataChart = {
        "colors": [
            "#0080ff",
            "#d35400",
            "#2980b9",
            "#2ecc71",
            "#f1c40f",
            "#2c3e50",
            "#7f8c8d",
            "#cc00ff",
            "#dc3545",
            "#289ba7",
            "#2855a7"
        ],
        chart: {
            type: 'area',
            "backgroundColor": "#242526",
            "style": {
                "fontFamily": "Roboto",
                "color": "#666666"
            }
        },
        title: {
            text: 'RESUMEN ESTADISTICO DE VALORIZACIÓN MENSUAL',
            "align": "center",
            "style": {
                "fontFamily": "Roboto Condensed",
                "fontWeight": "bold",
                "color": "#666666"
            }
        },
        "legend": {
            "align": "center",
            "verticalAlign": "bottom",
            "itemStyle": {
                "color":
                    "#424242",
                "color": "#ffffff"
            }
        },
        subtitle: {
            text: 'General'
        },
        xAxis: {
            categories: ResumenMensualDataChartCategories,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'SOLES'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000;
                }
            },
            "gridLineColor": "#424242",
            "ridLineWidth": 1,
            "minorGridLineColor": "#424242",
            "inoGridLineWidth": 0.5,
            "tickColor": "#424242",
            "minorTickColor": "#424242",
            "lineColor": "#424242"
        },
        tooltip: {
            split: true,
            valueSuffix: ' Soles'
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: ResumenMensualDataChart
    }
    //mes seleccionado
    const [ComponenteSeleccionado, setComponenteSeleccionado] = useState({});
    function onChangeComponenteSeleccionado(componente) {
        if (componente.numero != 0) {
            fetchFechas(componente.id_componente)
        } else {
            fetchResumenMensualData(MesSeleccionado)
        }
        setComponenteSeleccionado(componente)
        //reset fechas
        setFechasSeleccionada({})
    }
    //get data de fechas
    const [Fechas, setFechas] = useState([]);
    async function fetchFechas(id_componente) {
        var request = await axios.post(`${UrlServer}/getHistorialFechas2`, {
            id_ficha: sessionStorage.getItem('idobra'),
            anyo: AnyoSeleccionado,
            mes: MesSeleccionado,
            id_componente: id_componente
        })
        setFechas(request.data)
    }
    const [FechasSeleccionada, setFechasSeleccionada] = useState({});
    function onChangeFechasSeleccionada(fecha) {
        setFechasAvance([])
        fetchFechasAvance(fecha)
        if (fecha == FechasSeleccionada) {
            setFechasSeleccionada("")
        } else {
            setFechasSeleccionada(fecha)
        }
    }
    //get data de fechas
    const [FechasAvance, setFechasAvance] = useState([]);
    async function fetchFechasAvance(fecha) {
        var request = await axios.post(`${UrlServer}/getHistorialDias2`, {
            id_componente: ComponenteSeleccionado.id_componente,
            fecha: fecha
        })
        setFechasAvance(request.data)
    }
    ////////////////////////////////////////////////////////////////////
    // historial semanal
    const [toggleHistorialSemanal, settoggleHistorialSemanal] = useState(false);
    function onChangeToggleHistorialSemanal() {
        if (!toggleHistorialSemanal) {
            fetchSemanas(MesSeleccionado)
        }
        settoggleHistorialSemanal(!toggleHistorialSemanal)
    }
    const [Semanas, setSemanas] = useState([]);
    async function fetchSemanas(mes) {
        var request = await axios.post(`${UrlServer}/getHistorialSemanas`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "anyo": AnyoSeleccionado,
                "mes": mes
            }
        )
        setSemanas(request.data)
    }
    const [SemanaSeleccionada, setSemanaSeleccionada] = useState(-1);
    function onChangeSemana(semana) {
        setSemanaFechas([])
        setFechasActivas([])
        setSemanaFechaSeleccionada(-1)

        if (semana != 0) {
            fetchSemanaFechas(semana.fecha_inicial, semana.fecha_final)
        } else {
            // fetchResumenMensualData(MesSeleccionado)
        }
        setSemanaSeleccionada(semana.semana)

    }
    const [SemanaFechas, setSemanaFechas] = useState([]);
    async function fetchSemanaFechas(fecha_inicial, fecha_final) {
        console.log("getHistorialSemanalFechas");
        var request = await axios.post(`${UrlServer}/getHistorialSemanalFechas`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "fecha_inicial": fecha_inicial,
                "fecha_final": fecha_final
            }
        )
        console.log("setSemanaFechas", request.data);
        setSemanaFechas(request.data)
    }
    const [SemanaFechaSeleccionada, setSemanaFechaSeleccionada] = useState(-1);
    const [SpinnerSemanaFechaSeleccionada, setSpinnerSemanaFechaSeleccionada] = useState(false);
    function onChangeSemanaFecha(fecha) {
        if (fecha == SemanaFechaSeleccionada) {
            setSemanaFechaSeleccionada(-1)
        } else {
            setSpinnerSemanaFechaSeleccionada(true)
            setSemanaFechaSeleccionada(fecha)
            setSemanasComponentes([])
            fetchSemanasComponentes(fecha)
            fetchFechaRevisado(fecha)
        }

    }
    const [SemanasComponentes, setSemanasComponentes] = useState([]);
    async function fetchSemanasComponentes(fecha) {
        var request = await axios.post(`${UrlServer}/getHistorialSemanalComponentes`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "fecha": fecha
            },
        )
        var semanasComponentes = [...request.data]
        for (let i = 0; i < semanasComponentes.length; i++) {
            const item = semanasComponentes[i];
            semanasComponentes[i].diasData = await getHistorialSemanalDias(item.id_componente, fecha)
        }

        setSemanasComponentes(semanasComponentes)
        setSpinnerSemanaFechaSeleccionada(false)
    }
    async function getHistorialSemanalDias(id_componente, fecha) {
        var request = await axios.post(`${UrlServer}/getHistorialSemanalDias`,
            {
                "id_componente": id_componente,
                "fecha": fecha
            }
        )
        return request.data
    }
    //edicion de avance actividades
    const [InputAvanceActividadIndex, setInputAvanceActividadIndex] = useState(-1);
    const [InputAvanceActividadData, setInputAvanceActividadData] = useState(null);
    async function updateAvanceActividad(id_AvanceActividades) {
        if (confirm("La siguiente operacion es irreversible, esta seguro de proceder?")) {
            console.log("getHistorialSemanalFechas");
            var request = await axios.post(`${UrlServer}/putAvanceActividades`,
                {
                    "id_acceso": sessionStorage.getItem('idacceso'),
                    "id_AvanceActividades": id_AvanceActividades,
                    "valor": InputAvanceActividadData
                }
            )
            console.log("updateAvanceActividad", request.data);
            fetchSemanasComponentes(SemanaFechaSeleccionada)
        }
        setInputAvanceActividadIndex(-1)
        setInputAvanceActividadData(null)
    }
    //function inside hook
    const [FechasActivas, setFechasActivas] = useState([]);
    function callback(fecha) {
        // console.log("FechasActivas", FechasActivas);
        // var clone = [...FechasActivas]
        // // do something with value in parent component, like save to state
        // console.log("clone", clone);
        // clone.push(fecha)
        // setFechasActivas(clone)
    }
    const [FechaActiva, setFechaActiva] = useState(0);
    async function fetchFechaRevisado(fecha) {
        const request = await axios.post(`${UrlServer}/getEstadoRevisadoFecha`,
            {
                "fecha": fecha,
                "id_ficha": sessionStorage.getItem('idobra')
            }
        )
        console.log("re temp ", request.data);
        if (request.data.revisado == 0) {
            console.log("activo");
            setFechaActiva(1)
        } else {
            setFechaActiva(0)
        }

    }
    //usuaio data
    const [UsuarioData, setUsuarioData] = useState({});
    async function fetchUsuarioData() {
        const request = await axios.post(`${UrlServer}/getDatosUsuario`, {
            id_acceso: sessionStorage.getItem('idacceso')
        })
        console.log("cargando usuario data", request.data);
        await setUsuarioData(request.data)
    }
    return (
        <div>
            <Nav tabs>
                <NavItem>
                    <select
                        value={AnyoSeleccionado}
                        className="form-control form-control-sm"
                        onChange={e => onChangeAnyoSeleccionado(e.target.value)}
                    >
                        {
                            Anyos.map((item, i) =>
                                <option key={i} value={item.anyo} >{item.anyo}</option>
                            )
                        }
                    </select>
                </NavItem>
                {
                    Meses.map((item, i) =>
                        <NavItem key={i}>
                            <NavLink
                                className={classnames({ active: item.mes == MesSeleccionado })}
                                onClick={() => { onChangeMesSeleccionado(item.mes) }}
                            >
                                {mesesShort[item.mes - 1]}
                            </NavLink>
                        </NavItem>
                    )
                }
                <NavItem>
                    <NavLink
                        className={classnames({ active: 0 == MesSeleccionado })}
                        onClick={() => { onChangeMesSeleccionado(0) }}
                    >
                        RESUMEN ANUAL
                    </NavLink>
                </NavItem>
                {
                    MesSeleccionado > 0 &&
                    <Button
                        onClick={() => { onChangeToggleHistorialSemanal() }}
                        //  outline 
                        color={
                            toggleHistorialSemanal ?
                                "warning"
                                : "danger"
                        }>
                        {
                            toggleHistorialSemanal ?
                                "componentes"
                                : "semanal"
                        }
                    </Button>
                }


            </Nav>
            {
                MesSeleccionado > 0
                &&
                (
                    !toggleHistorialSemanal ?
                        <Nav tabs>

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: 0 == ComponenteSeleccionado.numero })}
                                    onClick={() => onChangeComponenteSeleccionado({ numero: 0 })}
                                >
                                    RESUMEN
                                </NavLink>
                            </NavItem>
                            {
                                Componentes.map((item, i) =>
                                    <NavItem key={i}>
                                        <NavLink
                                            className={classnames({ active: item.numero == ComponenteSeleccionado.numero })}
                                            onClick={() => onChangeComponenteSeleccionado(item)}
                                        >
                                            C-{item.numero}
                                        </NavLink>
                                    </NavItem>
                                )
                            }

                        </Nav>
                        :
                        <Nav tabs>
                            {Semanas.map((item, i) =>
                                <NavItem key={i}>
                                    <NavLink
                                        onClick={() => onChangeSemana(item)}
                                        className={classnames({ active: item.semana == SemanaSeleccionada })}
                                    >
                                        S-{item.semana}
                                    </NavLink>
                                </NavItem>
                            )}
                        </Nav>
                )

            }
            <CardBody className="p-2">
                {
                    MesSeleccionado > 0
                        ?
                        (
                            !toggleHistorialSemanal ?
                                (ComponenteSeleccionado.numero != 0
                                    ?
                                    <Card>
                                        <CardHeader>
                                            {ComponenteSeleccionado.nombre_componente}
                                            <div className="float-right">
                                                S/. {Redondea(ComponenteSeleccionado.componente_total_soles)} {" 〰 "}{Redondea(ComponenteSeleccionado.componente_total_porcentaje)} %
                                            </div>
                                        </CardHeader>
                                        <CardBody className="p-2">
                                            <Row>
                                                <Col sm="12">
                                                    {
                                                        Fechas.map((item, i) =>
                                                            <fieldset key={i} className="mt-2">
                                                                <legend
                                                                    className="prioridad"
                                                                    onClick={() => onChangeFechasSeleccionada(item.fecha)}
                                                                >
                                                                    <b>FECHA: </b>{FechaLarga(item.fecha)}  - <b> S/.</b> {Redondea(item.fecha_total_soles)}  - <b> {Redondea(item.fecha_total_porcentaje)} %</b>

                                                                </legend>
                                                                <Collapse isOpen={FechasSeleccionada == item.fecha}>
                                                                    <div className="table-responsive">
                                                                        <table className="table table-sm small table-hover">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>ITEM</th>
                                                                                    <th>PARTIDA</th>
                                                                                    <th>ACTIVIDAD </th>
                                                                                    <th> DESCRIPCIÓN</th>

                                                                                    <th>A. FISICO</th>
                                                                                    <th>C. U.</th>
                                                                                    <th>C. P.</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {FechasAvance.map((item, i) =>
                                                                                    <tr key={i}>
                                                                                        <td>{item.item}</td>
                                                                                        <td>{item.descripcion_partida}</td>

                                                                                        <td>{item.nombre_actividad}</td>
                                                                                        <td>{item.descripcion_actividad}</td>

                                                                                        <td>{Redondea(item.valor)} {item.unidad_medida}</td>
                                                                                        <td>{Redondea(item.costo_unitario)}</td>
                                                                                        <td>{Redondea(item.parcial)}</td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                            <tfoot>
                                                                                {FechasAvance.map((item, i) =>
                                                                                    item.observacion &&
                                                                                    <tr key={i}>
                                                                                        <td colSpan={8}> {item.observacion}</td>
                                                                                    </tr>
                                                                                )}
                                                                            </tfoot>

                                                                        </table>
                                                                    </div>
                                                                </Collapse>
                                                            </fieldset>
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                        </CardBody>

                                    </Card>
                                    :
                                    [
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={OptionsResumenMensualDataChart}
                                        />,
                                        <table className="table table-sm small table-hover">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        N°
                                            </th>
                                                    <th>
                                                        NOMBRE
                                            </th>
                                                    <th>
                                                        PRESUPUESTO
                                            </th>
                                                    <th>
                                                        AVANCE
                                            </th>
                                                    <th>
                                                        AVANCE%
                                            </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ResumenMensualData.map((item, i) =>
                                                        <tr key={i}>
                                                            <td>
                                                                {item.numero}
                                                            </td>
                                                            <td>
                                                                {item.nombre}
                                                            </td>
                                                            <td>
                                                                {Redondea(item.presupuesto)}

                                                            </td>

                                                            <td>
                                                                {Redondea(item.valor)}

                                                            </td>
                                                            <td>
                                                                {Redondea(item.valor / item.presupuesto * 100)}
                                                            </td>

                                                        </tr>
                                                    )
                                                }
                                                <tr className="resplandPartida font-weight-bolder">
                                                    <td>

                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                        {
                                                            (() => {
                                                                var presupuesto_total = 0
                                                                ResumenMensualData.forEach((item, i) => {
                                                                    presupuesto_total += item.presupuesto
                                                                });
                                                                return Redondea(presupuesto_total)
                                                            })()
                                                        }

                                                    </td>

                                                    <td>
                                                        {
                                                            (() => {
                                                                var valor_total = 0
                                                                ResumenMensualData.forEach((item, i) => {
                                                                    valor_total += item.valor
                                                                });
                                                                return Redondea(valor_total)
                                                            })()
                                                        }

                                                    </td>
                                                    <td>
                                                        {
                                                            (() => {
                                                                var valor_total = 0
                                                                ResumenMensualData.forEach((item, i) => {
                                                                    valor_total += item.valor / item.presupuesto
                                                                });
                                                                return Redondea(valor_total * 100)
                                                            })()
                                                        }
                                                        {/* {Redondea(item.valor / item.presupuesto * 100)} */}
                                                    </td>

                                                </tr>
                                            </tbody>

                                        </table>
                                    ]
                                )
                                :
                                // historial semanal data de semanas
                                [
                                    <CardBody className="p-2">
                                        <Card>

                                            <CardBody className="p-2">
                                                <Row>

                                                    <Col sm="12">
                                                        {
                                                            SemanaFechas.map((item, i) =>
                                                                <fieldset key={i} className="mt-2">
                                                                    <div className="d-flex">
                                                                        <legend
                                                                            className="prioridad"
                                                                            onClick={() => onChangeSemanaFecha(item.fecha)}
                                                                        >
                                                                            <b>FECHA: </b>{FechaLarga(item.fecha)}  - <b> S/.</b> {Redondea(item.fecha_total_soles)}  - <b> {Redondea(item.fecha_total_porcentaje)} %</b>
                                                                            <Spinner
                                                                                size="sm"
                                                                                color="primary"
                                                                                type="grow"
                                                                                style={(SemanaFechaSeleccionada == item.fecha && SpinnerSemanaFechaSeleccionada) ? {
                                                                                }
                                                                                    :
                                                                                    { display: "none" }}
                                                                            />
                                                                        </legend>
                                                                        <div>
                                                                            <CheckDate fecha={item.fecha} parentCallback={callback} UsuarioData={UsuarioData} />
                                                                        </div>
                                                                    </div>



                                                                    <Collapse isOpen={SemanaFechaSeleccionada == item.fecha}>
                                                                        <div className="table-responsive">
                                                                            {
                                                                                SemanasComponentes.map((item2, i2) =>
                                                                                    [
                                                                                        <div className="float-left"
                                                                                            style={{
                                                                                                color: "#171819",
                                                                                                fontSize: "12px",
                                                                                                backgroundColor: "#ffc107",
                                                                                                width: "100%",
                                                                                                padding: "3px",
                                                                                            }}>
                                                                                            <b>{item2.numero + " " + item2.nombre}</b>
                                                                                            <div className="float-right" style={{ color: "#171819", fontSize: "12px", }}>
                                                                                                S/. {Redondea(item2.componente_total_soles)} {" 〰 "}{Redondea(item2.componente_total_porcentaje)} %
                                                                                            </div>
                                                                                        </div>,
                                                                                        <table className="table table-sm small table-hover">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th></th>
                                                                                                    <th>ITEM</th>
                                                                                                    <th>PARTIDA</th>
                                                                                                    <th>ACTIVIDAD </th>
                                                                                                    <th> DESCRIPCIÓN</th>
                                                                                                    <th> RENDIMIENTO</th>
                                                                                                    <th>A. FISICO</th>
                                                                                                    <th>C. U.</th>
                                                                                                    <th>C. P.</th>
                                                                                                    <th></th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {item2.diasData &&
                                                                                                    item2.diasData.map(
                                                                                                        (item3, i3) =>
                                                                                                            <tr key={i3}>
                                                                                                                <td>
                                                                                                                    <PartidasChat id_partida={item3.id_partida} titulo={item3.descripcion_partida} />
                                                                                                                </td>
                                                                                                                <td>{item3.item}</td>
                                                                                                                <td>{item3.descripcion_partida}</td>

                                                                                                                <td>{item3.nombre_actividad}</td>
                                                                                                                <td>{item3.descripcion_actividad}</td>
                                                                                                                <td>{Redondea(item3.rendimiento)}</td>
                                                                                                                <td>
                                                                                                                    {
                                                                                                                        InputAvanceActividadIndex != i3 ?
                                                                                                                            <div
                                                                                                                                className="d-flex"
                                                                                                                            >
                                                                                                                                {Redondea(item3.valor)} {item3.unidad_medida}
                                                                                                                                {FechaActiva && UsuarioData.cargo_nombre == "RESIDENTE" &&
                                                                                                                                    <div
                                                                                                                                        onClick={() => setInputAvanceActividadIndex(i3)}
                                                                                                                                    >
                                                                                                                                        <MdModeEdit style={{ cursor: "pointer" }} />
                                                                                                                                    </div>
                                                                                                                                }
                                                                                                                            </div>
                                                                                                                            :
                                                                                                                            <div
                                                                                                                                className="d-flex"
                                                                                                                            >
                                                                                                                                <DebounceInput
                                                                                                                                    value={item3.valor}
                                                                                                                                    debounceTimeout={300}
                                                                                                                                    onChange={e => setInputAvanceActividadData(e.target.value)}
                                                                                                                                    type="number"
                                                                                                                                />
                                                                                                                                <div
                                                                                                                                    onClick={() => updateAvanceActividad(item3.id_AvanceActividades)}
                                                                                                                                >
                                                                                                                                    <MdSave style={{ cursor: "pointer" }} />
                                                                                                                                </div>
                                                                                                                                <div
                                                                                                                                    onClick={() => setInputAvanceActividadIndex(-1)}
                                                                                                                                >
                                                                                                                                    <MdClose style={{ cursor: "pointer" }} />
                                                                                                                                </div>
                                                                                                                            </div>


                                                                                                                    }
                                                                                                                </td>
                                                                                                                <td>{Redondea(item3.costo_unitario)}</td>
                                                                                                                <td>{Redondea(item3.parcial)}</td>
                                                                                                                <td>
                                                                                                                    {(FechaActiva && UsuarioData.cargo_nombre == "RESIDENTE") ?
                                                                                                                        <div
                                                                                                                            onClick={() => updateAvanceActividad(item3.id_AvanceActividades)}
                                                                                                                        >
                                                                                                                            <MdDeleteForever style={{ cursor: "pointer" }} />
                                                                                                                        </div>
                                                                                                                        : ""
                                                                                                                    }
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                    )
                                                                                                }

                                                                                            </tbody>

                                                                                        </table>

                                                                                    ]

                                                                                )
                                                                            }

                                                                        </div>
                                                                    </Collapse>
                                                                </fieldset>
                                                            )
                                                        }
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>

                                    </CardBody>]

                        )
                        :
                        [
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={OptionsResumenAnualDataChart}
                            />,
                            <table className="table table-sm small table-hover">
                                <thead>
                                    <tr>
                                        <th>
                                            N°
                                        </th>
                                        <th>
                                            NOMBRE
                                        </th>
                                        <th>
                                            PRESUPUESTO
                                        </th>
                                        {
                                            (
                                                () => {
                                                    var rows = [];
                                                    for (var i = ResumenAnualData.mes_inicial; i <= ResumenAnualData.mes_final; i++) {

                                                        rows.push(
                                                            <th >
                                                                {mesesShort[i - 1]}
                                                            </th>
                                                        );
                                                    }
                                                    return rows;
                                                }
                                            )()
                                        }
                                        <th>
                                            AVANCE
                                        </th>
                                        <th>
                                            SALDO
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ResumenAnualData.data.map((item, i) =>
                                            <tr key={i}>
                                                <td>
                                                    {item.numero}
                                                </td>
                                                <td>
                                                    {item.nombre}
                                                </td>
                                                <td>
                                                    {Redondea(item.presupuesto)}

                                                </td>
                                                {
                                                    (
                                                        () => {
                                                            var rows = [];
                                                            for (var i = ResumenAnualData.mes_inicial; i <= ResumenAnualData.mes_final; i++) {

                                                                rows.push(
                                                                    <td >
                                                                        {Redondea(item["m" + i])} ({Redondea(item["m" + i] / item.presupuesto * 100)} %)
                                                                    </td>
                                                                );
                                                            }
                                                            return rows;
                                                        }
                                                    )()
                                                }


                                                <td>
                                                    {Redondea(item.valor)}

                                                </td>
                                                <td>
                                                    {/* se calcula saldo */}
                                                    {
                                                        (
                                                            () => {
                                                                var saldo = item.presupuesto
                                                                for (var i = ResumenAnualData.mes_inicial; i <= ResumenAnualData.mes_final; i++) {
                                                                    saldo -= item["m" + i]
                                                                }
                                                                return Redondea(saldo);
                                                            }
                                                        )()
                                                    }

                                                </td>

                                            </tr>

                                        )
                                    }
                                    <tr className="resplandPartida font-weight-bolder">
                                        <td>

                                        </td>
                                        <td>

                                        </td>
                                        <td>
                                            {
                                                (() => {
                                                    var presupuesto_total = 0
                                                    ResumenAnualData.data.forEach((item, i) => {
                                                        presupuesto_total += item.presupuesto
                                                    });
                                                    return Redondea(presupuesto_total)
                                                })()
                                            }

                                        </td>
                                        {
                                            (
                                                () => {
                                                    var presupuesto_total = 0
                                                    ResumenAnualData.data.forEach((item, i) => {
                                                        presupuesto_total += item.presupuesto
                                                    });
                                                    var rows = [];
                                                    for (var i = ResumenAnualData.mes_inicial; i <= ResumenAnualData.mes_final; i++) {
                                                        var avance_total = 0
                                                        ResumenAnualData.data.forEach((item, j) => {
                                                            avance_total += item["m" + i]
                                                        });
                                                        rows.push(
                                                            <td >
                                                                {Redondea(avance_total)} ({Redondea(avance_total / presupuesto_total * 100)} %)
                                                            </td>
                                                        );
                                                    }
                                                    return rows;
                                                }
                                            )()
                                        }
                                        <td>
                                            {
                                                (() => {
                                                    var presupuesto_total = 0
                                                    ResumenAnualData.data.forEach((item, i) => {
                                                        presupuesto_total += item.valor
                                                    });
                                                    return Redondea(presupuesto_total)
                                                })()
                                            }

                                        </td>
                                        <td>
                                            {/* se calcula saldo */}
                                            {
                                                (
                                                    () => {
                                                        var saldo_total = 0;
                                                        ResumenAnualData.data.forEach((item, i) => {
                                                            var presupuesto = item.presupuesto
                                                            for (var i = ResumenAnualData.mes_inicial; i <= ResumenAnualData.mes_final; i++) {
                                                                presupuesto -= item["m" + i]
                                                            }
                                                            saldo_total += presupuesto
                                                        });

                                                        return Redondea(saldo_total);
                                                    }
                                                )()
                                            }

                                        </td>




                                    </tr>


                                </tbody>

                            </table>
                        ]
                }

            </CardBody>
            <HistorialObservaciones />

        </div>
    );
}
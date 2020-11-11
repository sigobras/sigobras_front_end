import React, { Component, useState } from 'react';
import axios from 'axios';
import { Nav, NavItem, NavLink, Card, CardHeader, CardBody, Spinner, Collapse, Row, Col, Button } from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import { ConvertFormatStringNumber, Redondea } from "../../../Utils/Funciones"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HistorialObservaciones from './HistorialObservaciones';
import { MdComment } from 'react-icons/md';

import PartidasChat from './PartidasChat'
function monthFromDate(fecha) {
    var d = fecha.split("-")
    return d[1]
}

class HistorialMetrados extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataAniosApi: [],
            DataMesesApi: [],
            DataResumenApi: [],
            DataComponentesApi: [],
            DataFechasApi: [],
            DataPartidas: [],
            DataChartDiasComponente: [],

            activeTabMes: '',
            activeTabComp: "resumen",
            // inputs
            anyoSeleccionado: "",
            mesSeleccionado: -1,
            fecha: "",
            idComponete: null,
            nombreComponente: "",
            componenteTotalSoles: "",
            componenteTotalPorcentaje: "",

            collapseDate: null,

            totalResumenComponenteLeyenda: {},
            //historial semanal
            toggleHistorial_semanal: false,
            semanasData: [],
            semanasFechas: [],
            semanasFechasCollapse: -1,
            semanasComponentes: [],
            semanaFechaSeleccionada: -1,
            activeTabSemanas: -1
        };
    }
    async componentDidMount() {

        var request = await axios.post(`${UrlServer}/getHistorialAnyos`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        var tamanioAnios = request.data.length - 1
        var tamanioMeses = request.data[tamanioAnios].meses.length - 1
        this.setState({
            DataAniosApi: request.data,
            DataMesesApi: request.data[tamanioAnios].meses,
            DataResumenApi: request.data[tamanioAnios].meses[tamanioMeses].resumen,
            activeTabMes: "resAnual",
            anyoSeleccionado: request.data[tamanioAnios].anyo,
            fecha: request.data[tamanioAnios].meses[tamanioMeses].fecha,
            mesSeleccionado: monthFromDate(request.data[tamanioAnios].meses[tamanioMeses].fecha),
        })

        this.ObtieneTotalesLeyenda(request.data[tamanioAnios].meses[tamanioMeses].resumen)
        console.log("fecha test", request.data[tamanioAnios].meses[tamanioMeses].fecha);
        this.getHistorialSemanas(monthFromDate(request.data[tamanioAnios].meses[tamanioMeses].fecha))
    }

    SeleccionaAnio = (e) => {
        // console.log("año ", e.target.value)
        this.setState({
            anyoSeleccionado: e.target.value
        })
        this.reqAnual(e.target.value)
        this.MesesRequest(e.target.value)
    }

    TabMeses = (tab, fecha) => {
        if (!this.state.toggleHistorial_semanal) {
            console.log("tab meses diario");
            // console.log("api de algo " , tab, "anyoSeleccionado ", this.state.anyoSeleccionado )
            if (this.state.activeTabMes !== tab) {
                this.setState({
                    activeTabMes: tab,
                    fecha: fecha,
                    mesSeleccionado: monthFromDate(fecha),
                    collapseDate: null,
                    // activeTabComp:"0"

                });
                if (tab === "resAnual") {
                    this.setState({ DataComponentesApi: [], activeTabComp: "resumen" })
                    this.reqAnual(this.state.anyoSeleccionado)
                    return
                }
                //   carga resumen de componentes
                this.ResumenRequest(fecha)

                //   cargamos datos de componentes
                this.ComponentesRequest(fecha)
                this.FechaAvancePartidas(fecha, this.state.idComponete)
                this.chartValDiaRequest(this.state.idComponete, fecha)
            }
        } else {
            //historial semanal
            console.log("tab meses semanal");
            this.getHistorialSemanas(monthFromDate(fecha))
            this.setState({
                activeTabMes: tab,
                // fecha: fecha,
                // mesSeleccionado: monthFromDate(fecha),
                // collapseDate: null,
                // activeTabComp:"0"

            });
        }
    }

    TabComponentes = (tab, idComp, nombreComp, solesTotal, TotalPorcentaje) => {
        // console.log("idComp",idComp)

        if (this.state.activeTabComp !== tab) {
            this.setState({
                activeTabComp: tab,
                idComponete: idComp,
                nombreComponente: nombreComp,
                componenteTotalSoles: solesTotal,
                componenteTotalPorcentaje: TotalPorcentaje,
                collapseDate: null
            });

            if (tab === "resumen") {

                this.ResumenRequest(this.state.fecha)
                return
            }

            // FECHA  DE ( PARTIDAS EJECUTADAS )
            this.FechaAvancePartidas(this.state.fecha, idComp)


            // HISTORIAL DE DIAS PARTIDAS CHART----------------------------
            this.chartValDiaRequest(idComp, this.state.fecha)

        }
    }

    collapseFechas = (e, fecha) => {
        let event = Number(e);
        if (event !== this.state.collapseDate) {
            this.setState({ collapseDate: event });

            // HISTORIAL DE DIAS PARTIDAS-------------------------------
            axios.post(`${UrlServer}/getHistorialDias`, {
                id_componente: this.state.idComponete,
                fecha: fecha
            })
                .then((res) => {
                    // console.log("response data PARTIDAS ", res.data)
                    this.setState({
                        DataPartidas: res.data,
                        // nombreComponente:nombreComp
                    })

                })
                .catch((err) => {
                    console.log("errores al conectar el api", err)
                })
            return
        }
        this.setState({ collapseDate: null })
    }
    //------------------------------ peticiones tipo http con axios ---------------------------------------------------

    MesesRequest = (anio) => {

        // console.log("anio que llega ", anio)
        //   llamamos el api de meses5
        axios.post(`${UrlServer}/getHistorialMeses`, {
            id_ficha: sessionStorage.getItem('idobra'),
            anyo: anio
        })
            .then((res) => {
                // console.log("response data meses ", res.data)

                var ultimoMes = res.data.length - 1

                this.setState({
                    DataMesesApi: res.data,
                    activeTabMes: "resAnual",
                    activeTabComp: "resumen",
                    fecha: res.data[ultimoMes].fecha
                })

                // console.log("ultima fecha", res.data[ultimoMes])
                // this.ResumenRequest(res.data[ultimoMes].fecha)
                // this.ComponentesRequest(res.data[ultimoMes].fecha)

            })
            .catch((err) => {
                console.log("errores al conectar el api", err)
            })
    }

    ResumenRequest = (ultimafecha) => {
        console.log("fecha", ultimafecha)
        this.setState({ totalResumenComponenteLeyenda: {}, DataResumenApi: [] })
        axios.post(`${UrlServer}/getHistorialResumen`, {
            id_ficha: sessionStorage.getItem('idobra'),
            fecha: ultimafecha
        })
            .then((res) => {
                // console.log("response data resumen ", res.data)
                this.setState({
                    DataResumenApi: res.data
                })
                this.ObtieneTotalesLeyenda(res.data)

            })
            .catch((err) => {
                console.log("errores al conectar el api", err)
            })
    }

    reqAnual = (anio) => {

        axios.post(`${UrlServer}/getHistorialAnyosResumen`, {
            id_ficha: sessionStorage.getItem('idobra'),
            anyo: anio
        })
            .then((res) => {
                // console.log("response data resumen anual ", res.data)
                this.setState({
                    DataResumenApi: res.data
                })

            })
            .catch((err) => {
                console.log("errores al conectar el api", err)
            })
    }

    ComponentesRequest = (fecha) => {
        // console.log("fecha de datos ", fecha)
        axios.post(`${UrlServer}/getHistorialComponentes`, {
            id_ficha: sessionStorage.getItem('idobra'),
            fecha: fecha
        })
            .then((res) => {
                // console.log("response data Componentes ", res.data)
                this.setState({
                    DataComponentesApi: res.data
                })

            })
            .catch((err) => {
                console.log("errores al conectar el api", err)
            })
    }

    chartValDiaRequest = (idComp, Fecha) => {

        axios.post(`${UrlServer}/getHistorialComponenteChart`, {
            id_componente: idComp,
            fecha: Fecha
        })
            .then((res) => {
                // console.log("response data DIAS CHART ", res.data)
                if (res.data !== "vacio") {
                    this.setState({
                        DataChartDiasComponente: res.data,
                    })
                    return
                } else {
                    this.setState({
                        DataChartDiasComponente: []
                    })
                }


            })
            .catch((err) => {
                console.log("errores al conectar el api", err)
            })

    }

    FechaAvancePartidas = (fecha, idComp) => {
        console.log("partidas fecha>>>>", fecha, "id componente ", idComp);

        axios.post(`${UrlServer}/getHistorialFechas`, {
            id_componente: idComp,
            fecha: fecha
        })
            .then((res) => {
                // console.log("response data FechaAvancePartidas ", res.data)
                if (res.data !== "vacio") {
                    this.setState({
                        DataFechasApi: res.data,
                    })
                    return
                }
                this.setState({
                    DataFechasApi: [],
                })


            })
            .catch((err) => {
                console.log("errores al conectar el api", err)
            })

    }

    ObtieneTotalesLeyenda = (data) => {
        // console.log(data)
        var total = data.leyenda.reduce((anterior, actual) => {
            anterior.presupuesto = anterior.presupuesto + ConvertFormatStringNumber(actual.presupuesto)
            anterior.presupuesto = +Redondea(anterior.presupuesto)

            anterior.avance = anterior.avance + ConvertFormatStringNumber(actual.valor)
            anterior.avance = +Redondea(anterior.avance)

            anterior.porcentaje_avance = anterior.porcentaje_avance + ConvertFormatStringNumber(actual.porcentaje)
            anterior.porcentaje_avance = +Redondea(anterior.porcentaje_avance)
            return anterior

        }, { presupuesto: 0, avance: 0, porcentaje_avance: 0 })
        // anterior.presupuesto =  anterior.presupuesto.toLocaleString("es-PE")
        total.presupuesto = total.presupuesto.toLocaleString("es-PE")
        total.avance = total.avance.toLocaleString("es-PE")
        total.porcentaje_avance = total.porcentaje_avance.toLocaleString("es-PE")

        this.setState({ totalResumenComponenteLeyenda: total })
    }
    //historial semanal
    toggleHistorialSemanal = () => {
        console.log("toggling", this.state.toggleHistorial_semanal);
        this.setState(prevState => ({
            toggleHistorial_semanal: !prevState.toggleHistorial_semanal
        }));
    }
    getHistorialSemanas = async (mes) => {
        console.log("mes", mes);
        console.log("getHistorialSemanas");
        var request = await axios.post(`${UrlServer}/getHistorialSemanas`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "anyo": this.state.anyoSeleccionado,
                "mes": mes
            }
        )
        console.log("getHistorialSemanas", request.data);
        this.setState(
            {
                semanasData: request.data
            }
        )
    }
    getHistorialSemanalFechas = async (fecha_inicial, fecha_final) => {
        console.log("getHistorialSemanalFechas");
        var request = await axios.post(`${UrlServer}/getHistorialSemanalFechas`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "fecha_inicial": fecha_inicial,
                "fecha_final": fecha_final
            }
        )
        console.log("getHistorialSemanalFechas", request.data);
        this.setState(
            {
                semanasFechas: request.data
            }
        )
    }
    getHistorialSemanalComponentes = async (fecha) => {
        console.log("getHistorialSemanalComponentes");
        var request = await axios.post(`${UrlServer}/getHistorialSemanalComponentes`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "fecha": fecha
            }
        )
        console.log("getHistorialSemanalComponentes", request.data);
        //consulta por cada componente
        var semanasComponentes = [...request.data]
        for (let i = 0; i < semanasComponentes.length; i++) {
            const item = semanasComponentes[i];
            semanasComponentes[i].diasData = await this.getHistorialSemanalDias(item.id_componente)
        }
        console.log("semanasComponentes", semanasComponentes);
        this.setState(
            {
                semanasComponentes
            }
        )

    }
    getHistorialSemanalDias = async (id_componente) => {
        var request = await axios.post(`${UrlServer}/getHistorialSemanalDias`,
            {
                "id_componente": id_componente,
                "fecha": this.state.semanaFechaSeleccionada
            }
        )
        console.log("getHistorialSemanalDias", request.data);
        return request.data
    }
    tabSemanas = (i) => {
        console.log(i);
        var semanasData = this.state.semanasData[i]
        console.log("semanasData", semanasData);
        this.getHistorialSemanalFechas(semanasData.fecha_inicial, semanasData.fecha_final)
        this.setState({
            semanasFechasCollapse: -1,
            activeTabSemanas: i
        })
    }
    semanasFechasCollapse = (i) => {
        if (i != this.state.semanasFechasCollapse) {
            var semanasFechas = this.state.semanasFechas[i]
            this.getHistorialSemanalComponentes(semanasFechas.fecha)
            this.setState({
                semanasFechasCollapse: i,
                semanaFechaSeleccionada: semanasFechas.fecha
            })
        } else {
            this.setState({
                semanasFechasCollapse: -1,
            })
        }

    }
    render() {
        const { DataAniosApi, DataMesesApi, DataResumenApi, DataComponentesApi, anyoSeleccionado, nombreComponente, DataFechasApi, collapseDate,
            DataPartidas, DataChartDiasComponente, componenteTotalSoles, componenteTotalPorcentaje, totalResumenComponenteLeyenda } = this.state
        const options = {
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
                categories: DataResumenApi.categories,
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
            series: DataResumenApi.series
        }

        const Partidas = {
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
                    "color": "#2ecc71"
                }
            },
            title: {
                text: 'VALORIZACIÓN DIARIA POR COMPONENTE',

            },
            subtitle: {
                text: 'Componente'
            },
            "legend": {
                "align": "center",
                "verticalAlign": "bottom",
                "itemStyle": {
                    "color":
                        "#2ecc71",
                    "color": "#ffffff"
                }
            },
            xAxis: {
                categories: DataChartDiasComponente.categories,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Soles'
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
            series: DataChartDiasComponente.series
        }

        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <select className="form-control form-control-sm" onChange={this.SeleccionaAnio} value={anyoSeleccionado}>
                            {
                                DataAniosApi.map((anio, indexA) =>
                                    <option key={indexA} value={anio.anyo} >{anio.anyo}</option>
                                )
                            }
                        </select>
                    </NavItem>
                    {
                        DataMesesApi.map((mes, indexM) =>
                            <NavItem key={indexM}>
                                <NavLink className={classnames({ active: this.state.activeTabMes === indexM.toString() })} onClick={() => { this.TabMeses(indexM.toString(), mes.fecha); }}>
                                    {mes.mes}
                                </NavLink>
                            </NavItem>
                        )
                    }
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTabMes === "resAnual" })} onClick={() => { this.TabMeses("resAnual", "mes.fecha"); }}>
                            {/* {mes.mes} */} RESUMEN ANUAL
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        {/* comentario  de button temporal */}
                        {/* <Button
                            onClick={this.toggleHistorialSemanal}
                            //  outline 
                            color="primary">
                            {
                                !this.state.toggleHistorial_semanal ?
                                    "semanal" : "componentes"
                            }
                        </Button> */}
                    </NavItem>
                </Nav>

                {
                    !this.state.toggleHistorial_semanal ?
                        [
                            <Nav tabs>

                                <NavItem>
                                    <NavLink className={classnames({ active: this.state.activeTabComp === 'resumen' })} onClick={() => { this.TabComponentes('resumen', "", "") }}>
                                        RESUMEN
                                    </NavLink>
                                </NavItem>
                                {
                                    DataComponentesApi.map((comp, indecC) =>
                                        <NavItem key={indecC}>
                                            <NavLink className={classnames({ active: this.state.activeTabComp === indecC.toString() })} onClick={() => { this.TabComponentes(indecC.toString(), comp.id_componente, comp.nombre_componente, comp.componente_total_soles, comp.componente_total_porcentaje); }}>
                                                C-{comp.numero}
                                            </NavLink>
                                        </NavItem>
                                    )
                                }

                            </Nav>
                            ,
                            <CardBody className="p-2">
                                {
                                    this.state.activeTabComp === "resumen"
                                        ?
                                        <div className="table-responsive card">
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                // constructorType={'stockChart'}
                                                options={options}
                                            />
                                            <br />
                                            <table className="table table-sm small">
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>NOMBRE</th>
                                                        <th>PRESUPUESTO</th>
                                                        <th>AVANCE</th>
                                                        <th>% AVANCE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        DataResumenApi.leyenda !== undefined ?
                                                            DataResumenApi.leyenda.map((comp, iComp) =>
                                                                <tr key={iComp}>
                                                                    <td>{comp.numero}</td>
                                                                    <td>{comp.componente_nombre}</td>
                                                                    <td>{comp.presupuesto}</td>
                                                                    <td>{comp.valor} </td>
                                                                    <td className="text-right">{comp.porcentaje}%</td>
                                                                </tr>
                                                            ) : <tr><td colSpan="5"><div className="text-center" > <Spinner color="primary" type="grow" /></div></td></tr>
                                                    }
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th colSpan="2">TOTAL</th>
                                                        <th>{totalResumenComponenteLeyenda.presupuesto}</th>
                                                        <th>{totalResumenComponenteLeyenda.avance}</th>
                                                        <th className="text-right">{totalResumenComponenteLeyenda.porcentaje_avance}%</th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        :
                                        <Card>
                                            <CardHeader>
                                                {nombreComponente}
                                                <div className="float-right">
                                                    S/. {componenteTotalSoles} {" 〰 "}{componenteTotalPorcentaje} %
                                    </div>
                                            </CardHeader>
                                            <CardBody className="p-2">
                                                {
                                                    DataChartDiasComponente.length <= 0 ? <div className="text-center h4">Seleccione un componete</div> :
                                                        <Row>
                                                            <Col sm="5">

                                                                <HighchartsReact
                                                                    highcharts={Highcharts}
                                                                    // constructorType={'stockChart'}
                                                                    options={Partidas}
                                                                />
                                                            </Col>
                                                            <Col sm="7">
                                                                {
                                                                    DataFechasApi.map((fecha, indexF) =>
                                                                        <fieldset key={indexF} className="mt-2">
                                                                            <legend className="prioridad" onClick={() => this.collapseFechas(indexF, fecha.fecha)} >  <b>FECHA: </b>{fecha.fecha_larga}  - <b> S/.</b> {fecha.fecha_total_soles}  - <b> {fecha.fecha_total_porcentaje} %</b></legend>
                                                                            <Collapse isOpen={collapseDate === indexF}>
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
                                                                                            {DataPartidas.map((hist, indexHist) =>
                                                                                                <tr key={indexHist}>
                                                                                                    <td>{hist.item}</td>
                                                                                                    <td>{hist.descripcion_partida}</td>

                                                                                                    <td>{hist.nombre_actividad}</td>
                                                                                                    <td>{hist.descripcion_actividad}</td>

                                                                                                    <td>{hist.valor} {hist.unidad_medida}</td>
                                                                                                    <td>{hist.costo_unitario}</td>
                                                                                                    <td>{hist.parcial}</td>
                                                                                                </tr>
                                                                                            )}
                                                                                        </tbody>
                                                                                        <tfoot>
                                                                                            <tr>
                                                                                                <td colSpan="8">
                                                                                                    {DataPartidas.map((hist, indexHist) =>
                                                                                                        <tr key={indexHist}>
                                                                                                            <td> {hist.observacion}</td>
                                                                                                        </tr>
                                                                                                    )}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tfoot>

                                                                                    </table>
                                                                                    <HistorialObservaciones />
                                                                                </div>
                                                                            </Collapse>
                                                                        </fieldset>
                                                                    )
                                                                }
                                                            </Col>
                                                        </Row>
                                                }
                                            </CardBody>
                                        </Card>
                                }

                            </CardBody>,
                            <HistorialObservaciones />
                        ]
                        :
                        //historial semanal
                        [
                            <Nav tabs>
                                {this.state.semanasData.map((item, i) =>
                                    <NavItem key={i}>
                                        <NavLink
                                            onClick={() => this.tabSemanas(i)}
                                            className={classnames({ active: this.state.activeTabSemanas == i })}
                                        >
                                            S-{item.semana}
                                        </NavLink>
                                    </NavItem>
                                )}
                            </Nav>,
                            <CardBody className="p-2">
                                <Card>
                                    {/* <CardHeader>
                                        {nombreComponente}
                                        <div className="float-right">
                                            S/. {componenteTotalSoles} {" 〰 "}{componenteTotalPorcentaje} %
                                                </div>
                                    </CardHeader> */}
                                    <CardBody className="p-2">
                                        <Row>
                                            {/* <Col sm="5">
                                                <HighchartsReact
                                                    highcharts={Highcharts}
                                                    options={Partidas}
                                                />
                                            </Col> */}
                                            <Col sm="12">
                                                {
                                                    this.state.semanasFechas.map((item, i) =>
                                                        <fieldset key={i} className="mt-2">
                                                            <legend className="prioridad" onClick={() => this.semanasFechasCollapse(i)} >
                                                                <b>FECHA: </b>{item.fecha}  - <b> S/.</b> {Redondea(item.fecha_total_soles)}  - <b> {Redondea(item.fecha_total_porcentaje)} %</b>
                                                            </legend>
                                                            <Collapse isOpen={this.state.semanasFechasCollapse == i}>
                                                                <div className="table-responsive">
                                                                    {
                                                                        this.state.semanasComponentes.map((item2, i2) =>
                                                                            [
                                                                                <div className="float-left" style={{ color: "#97ffb1", fontSize: "12px" }}><b>{item2.numero + " " + item2.nombre}</b></div>,
                                                                                <div className="float-right" style={{ color: "#97ffb1" }}>
                                                                                    S/. {Redondea(item2.componente_total_soles)} {" 〰 "}{Redondea(item2.componente_total_porcentaje)} %
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
                                                                                                        <td>{item3.rendimiento}</td>

                                                                                                        <td>{item3.valor} {item3.unidad_medida}</td>
                                                                                                        <td>{item3.costo_unitario}</td>
                                                                                                        <td>{item3.parcial}</td>
                                                                                                    </tr>
                                                                                            )
                                                                                        }

                                                                                    </tbody>
                                                                                    {/* <tfoot>
                                                                                        <tr>
                                                                                            <td colSpan="8">
                                                                                                {DataPartidas.map((hist, indexHist) =>
                                                                                                    <tr key={indexHist}>
                                                                                                        <td> {hist.observacion}</td>
                                                                                                    </tr>
                                                                                                )}
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tfoot> */}

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


                }
            </div>
        )
    }
}

export default HistorialMetrados;
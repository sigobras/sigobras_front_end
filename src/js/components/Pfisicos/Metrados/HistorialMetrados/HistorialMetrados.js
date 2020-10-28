import React, { Component } from 'react';
import axios from 'axios';
import { Nav, NavItem, NavLink, Card, CardHeader, CardBody, Spinner, Collapse, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import { ConvertFormatStringNumber, Redondea } from "../../../Utils/Funciones"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HistorialObservaciones from './HistorialObservaciones';

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
            inputAnio: "",
            fecha: "",
            idComponete: null,
            nombreComponente: "",
            componenteTotalSoles: "",
            componenteTotalPorcentaje: "",

            collapseDate: null,

            totalResumenComponenteLeyenda: {}
        };
    }

    componentDidMount() {
        axios.post(`${UrlServer}/getHistorialAnyos`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
            .then((res) => {
                // console.log("response data ANIO GENERAL ", res.data)
                var tamanioAnios = res.data.length - 1

                var tamanioMeses = res.data[tamanioAnios].meses.length - 1
                // console.log("calculando", res.data[tamanioAnios].meses)

                // console.log("tamanioAnios", tamanioAnios)
                // console.log("DataResumenApi",  res.data[tamanioAnios].meses[tamanioMeses].resumen)

                this.setState({
                    DataAniosApi: res.data,
                    DataMesesApi: res.data[tamanioAnios].meses,
                    DataResumenApi: res.data[tamanioAnios].meses[tamanioMeses].resumen,
                    // DataComponentesApi: res.data[tamanioAnios].meses[tamanioMeses].componentes,
                    // activeTabMes: tamanioMeses.toString(),
                    activeTabMes: "resAnual",
                    inputAnio: res.data[tamanioAnios].anyo,
                    fecha: res.data[tamanioAnios].meses[tamanioMeses].fecha
                })

                this.ObtieneTotalesLeyenda(res.data[tamanioAnios].meses[tamanioMeses].resumen)

            })
            .catch((err) => {
                console.log("errores al conectar el api", err)
            })
    }

    SeleccionaAnio = (e) => {
        // console.log("año ", e.target.value)
        this.setState({
            inputAnio: e.target.value
        })
        this.reqAnual(e.target.value)
        this.MesesRequest(e.target.value)
    }

    TabMeses = (tab, fecha) => {
        // console.log("api de algo " , tab, "inputAnio ", this.state.inputAnio )
        if (this.state.activeTabMes !== tab) {
            this.setState({
                activeTabMes: tab,
                fecha: fecha,
                collapseDate: null,
                // activeTabComp:"0"

            });
            if (tab === "resAnual") {
                this.setState({ DataComponentesApi: [], activeTabComp: "resumen" })
                this.reqAnual(this.state.inputAnio)
                return
            }
            //   carga resumen de componentes
            this.ResumenRequest(fecha)

            //   cargamos datos de componentes
            this.ComponentesRequest(fecha)
            this.FechaAvancePartidas(fecha, this.state.idComponete)
            this.chartValDiaRequest(this.state.idComponete, fecha)
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
        // console.log("partidas fecha>>>>", fecha, "id componente ", idComp);

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

    render() {
        const { DataAniosApi, DataMesesApi, DataResumenApi, DataComponentesApi, inputAnio, nombreComponente, DataFechasApi, collapseDate,
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

                        <select className="form-control form-control-sm" onChange={this.SeleccionaAnio} value={inputAnio}>
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
                </Nav>


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
                                                                        {/* <HistorialObservaciones /> */}
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

                </CardBody>
                {/* <HistorialObservaciones /> */}
            </div>
        )
    }
}

export default HistorialMetrados;
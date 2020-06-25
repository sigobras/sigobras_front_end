import React, { Component } from "react";
import { Table } from 'reactstrap';
import axios from 'axios';
// import { Nav, NavItem, TabContent, NavLink, TabPane, ListGroup, Modal, ModalHeader, ModalBody, } from 'reactstrap';
// import Modal from 'react-modal'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { UrlServer } from '../../Utils/ServerUrlConfig';
import { Redondea, diasdelasemana, Redondea1 } from '../../Utils/Funciones';
import "../Recursos/RecursosPersonal.css";



class RecursosPersonal extends Component {
    constructor() {
        super();
        this.state = {

            anyos: [],
            meses: [],
            anyoseleccionado: 0,
            messeleccionado: 0,
            semanaseleccionada: 0,
            semanas: [],
            gastosMO: [],
            fechasavance: [],
            cargosPersonal: [],
            cantidadPersonal: [],
            CantidadPersonalReal: [],
            cargos: [],
            CostoRealMO: [],
            partidasgastoreales: [],
            gastoexptec_mo: 0,
            gastoestimadoexptec_mo: [],
            gasto_dia_gore: [],
            fechas_avance_mes: [],
            gastoestimadogore_mo_semana:[],
            gastoestimadoexptec_mo_semana:[]
            

        };
        //se bindean las funciones las variables no

        this.getanyos = this.getanyos.bind(this);
        this.getmeses = this.getmeses.bind(this);
        this.getsemanas = this.getsemanas.bind(this);
        this.getGastoMO = this.getGastoMO.bind(this);
        this.addcargo = this.addcargo.bind(this);
        this.updateinput = this.updateinput.bind(this);
        this.guardardata_mo = this.guardardata_mo.bind(this);
        this.updateinputCostoReal = this.updateinputCostoReal.bind(this);
        this.get_chart_data_mo = this.get_chart_data_mo.bind(this);


        



    }

    componentWillMount() {

        this.setState({

            cajaidficha: sessionStorage.getItem('idobra')

        })

        this.getanyos(sessionStorage.getItem('idobra'))
        this.getcargos_obreros()
    }

    getanyos(id_ficha) {
        // console.log("cargando años");

        axios.post(`${UrlServer}/SelectRecPersonalAnyos`, //RUTA DEL API
            {
                "id_ficha": id_ficha,

            }
        )
            .then((respuesta) => {
                // console.log("anyos", respuesta.data);

                this.setState({
                    anyos: respuesta.data
                })
            })
            .catch((error) => {
                // console.log("ERROR!!!!!", error);

            })
    }

    getmeses(anyo) {
        // console.log("cargando años");

        axios.post(`${UrlServer}/SelectRecPersonalMeses`, //RUTA DEL API
            {
                "id_ficha": this.state.cajaidficha,
                "anyo": anyo
            }
        )
            .then((respuesta) => {
                // console.log("meses", respuesta.data);

                this.setState({

                    anyoseleccionado: anyo,
                    meses: respuesta.data

                })
            })
            .catch((error) => {
                // console.log("ERROR!!!!!", error);

            })
    }

    getsemanas(mes) {
        console.log("cargando semanas");

        axios.post(`${UrlServer}/SelectRecPersonalSemana`, //RUTA DEL API
            {
                "id_ficha": this.state.cajaidficha,
                "anyo": this.state.anyoseleccionado,
                "mes": mes
            }
        )
            .then(async (respuesta) => {
                console.log("semanas", respuesta.data);

                await this.setState({
                    semanas: respuesta.data,
                    messeleccionado: mes
                })

                console.log("GETSEMANAS");
                
                this.get_chart_data_mo()
                this.get_perdida_ganancia()

            })
            .catch((error) => {
                console.log("ERROR!!!!!", error);

            })

    }
    getGastoMO(semana) {
        // console.log("cargando gastoMO");

        axios.post(`${UrlServer}/GastoManodeObra`, //RUTA DEL API
            {
                "id_ficha": this.state.cajaidficha,
                "anyo": this.state.anyoseleccionado,
                "mes": this.state.messeleccionado,
                "semana": semana
            }
        )
            .then(async (respuesta) => {
                // console.log("gastos MO", respuesta.data);
                var index = 0
                var partidasgastoreales = []
                var gastoexptec_mo = 0

                for (let i = 0; i < respuesta.data.fechasavance.length; i++) {
                    partidasgastoreales.push(0)
                }

                for (let i = 0; i < respuesta.data.PartidasSemanal.length; i++) {
                    const element = respuesta.data.PartidasSemanal[i];
                    var cantidadPersonal = respuesta.data.cantidadPersonal[index]

                    if (element.id_partida == cantidadPersonal.id_partida) {
                        Object.assign(respuesta.data.PartidasSemanal[i], respuesta.data.cantidadPersonal[index])
                        index++

                    }

                    //SACANDO SUMATORIA DE GASTOS REALES
                    for (let j = 0; j < respuesta.data.fechasavance.length; j++) {
                        const fecha = respuesta.data.fechasavance[j];
                        var gastoreal = element.parcial_mo * element["metrado" + j]
                        console.log(element.item, fecha, gastoreal);
                        partidasgastoreales[j] += gastoreal
                        gastoexptec_mo += gastoreal

                    }

                }
                // console.log(partidasgastoreales);



                // console.log("DATA PROCESADA", respuesta.data.PartidasSemanal);

                await this.setState({
                    gastosMO: respuesta.data.PartidasSemanal,
                    fechasavance: respuesta.data.fechasavance,
                    cargosPersonal: respuesta.data.cargosPersonal,
                    cantidadPersonal: respuesta.data.cantidadPersonal,
                    semanaseleccionada: semana,
                    partidasgastoreales: partidasgastoreales,
                    gastoexptec_mo: gastoexptec_mo


                })

                this.get_historial_gasto_mo()
            })
            .catch((error) => {
                // console.log("ERROR!!!!!", error);

            })


    }

    addcargo() {

        var cargotemp = this.state.CantidadPersonalReal
        cargotemp.push(
            {
                "idresumen_gasto_mo": null,
                "cantidad": 1,
                "cargo": 1,
                "costogore": 70,
                "dias": "7"

            }
        )
        this.setState({

            CantidadPersonalReal: cargotemp

        })
    }

    updateinput(target, index) {

        // console.log(index, target.value, target.name);

        var CantidadPersonalReal = this.state.CantidadPersonalReal

        CantidadPersonalReal[index][target.name] = target.value

        // console.log("CANTIDAD PERSONAL", CantidadPersonalReal);

        this.setState({
            CantidadPersonalReal
        })

    }

    guardardata_mo() {

        var CantidadPersonalReal = this.state.CantidadPersonalReal

        // console.log(CantidadPersonalReal);

        // idresumen_gasto_mo, anyo, mes, semana, cantidad_personal, costo_mo_gore, dias_trabajados, cargo, fichas_id_ficha)

        var data_preparada = []
        for (let i = 0; i < CantidadPersonalReal.length; i++) {

            const element = CantidadPersonalReal[i];
            data_preparada.push(
                [
                    element.idresumen_gasto_mo,
                    this.state.anyoseleccionado,
                    this.state.messeleccionado,
                    this.state.semanaseleccionada,
                    element.cantidad,
                    element.costogore,
                    element.dias,
                    element.cargo,
                    sessionStorage.getItem('idobra')
                ]
            )
        }
        // console.log(data_preparada);
        if (confirm("Está seguro de guardar la información?")) {
            axios.post(`${UrlServer}/putresumengastomo`, //RUTA DEL API

                data_preparada

            )
                .then((respuesta) => {
                    // console.log("DATA INSERTADA", respuesta.data);
                    alert("DATA GUARDADA")
                    this.get_historial_gasto_mo()

                })
                .catch((error) => {
                    // console.log("ERROR!!!!!", error);
                    alert("hubo un error al tratar de guardar la información")

                })
        }


    }

    getcargos_obreros() {
        axios.get(`${UrlServer}/cargos_obreros`, //RUTA DEL API


        )
            .then((respuesta) => {
                // console.log("CARGOS OBREROS!!!", respuesta.data);
                this.setState({

                    cargos: respuesta.data

                })

            })
            .catch((error) => {
                // console.log("ERROR!!!!!", error);

            })
    }

    get_historial_gasto_mo() {
        axios.post(`${UrlServer}/historial_gasto_mo`, //RUTA DEL API

            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "anyo": this.state.anyoseleccionado,
                "mes": this.state.messeleccionado,
                "semana": this.state.semanaseleccionada
            }
        )
            .then((respuesta) => {
                // console.log("GET HISTORIAL GASTOS MO", respuesta.data);
                this.setState({

                    CantidadPersonalReal: respuesta.data

                })

            })
            .catch((error) => {
                // console.log("ERROR!!!!!", error);

            })
    }
    async updateinputCostoReal(target, index) {

        // console.log(index, target.value, target.name);

        var CostoRealMO = this.state.CostoRealMO

        CostoRealMO[index] = target.value

        // console.log("CANTIDAD PERSONAL", CostoRealMO);

        await this.setState({
            CostoRealMO
        })
        // console.log(this.state.CostoRealMO);


    }

    sumatoriacostodia() {
        var sumatoria = 0

        for (let i = 0; i < this.state.CantidadPersonalReal.length; i++) {
            const element = this.state.CantidadPersonalReal[i];
            var costodia = element.cantidad * element.costogore * element.dias
            sumatoria += costodia


        }

        return sumatoria
    }

    getnumerodia(fecha) {


        return diasdelasemana[(new Date(fecha)).getDay()] + " " + fecha

    }

    get_chart_data_mo() {
        axios.post(`${UrlServer}/chart_mo_dia`, //RUTA DEL API

            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "anyo": this.state.anyoseleccionado,
                "mes": this.state.messeleccionado
            }
        )
            .then((respuesta) => {
                console.log("CHART MO DATA", respuesta.data);
                var gastoestimadoexptec_mo = [], gasto_dia_gore = []
                var fechas_avance_mes = []
                for (let i = 0; i < respuesta.data.gastoestimadoexptec_mo.length; i++) {
                    const element = respuesta.data.gastoestimadoexptec_mo[i];
                    gastoestimadoexptec_mo.push(Redondea1(element.valor))
                    gasto_dia_gore.push(Redondea1(respuesta.data.gasto_dia_gore[i].gasto_gore))
                    fechas_avance_mes.push(respuesta.data.gasto_dia_gore[i].fecha)

                }
                console.log("gasto exp tec", gastoestimadoexptec_mo);
                console.log("gasto dia gore", gasto_dia_gore);

                this.setState({
                    gastoestimadoexptec_mo,
                    gasto_dia_gore,
                    fechas_avance_mes
                })

            })
            .catch((error) => {
                console.log("ERROR!!!!!", error);

            })

    }

   async get_perdida_ganancia (){

        var gastoestimadoexptec_mo_semana = []
       await axios.post(`${UrlServer}/gastoestimadoexptec_mo_semana`, //RUTA DEL API

            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "anyo": this.state.anyoseleccionado,
                "mes": this.state.messeleccionado
            }
        )
            .then((respuesta) => {
                console.log("perdida_ganancia", respuesta.data);
                gastoestimadoexptec_mo_semana = respuesta.data

            })
            .catch((error) => {
                console.log("ERROR!!!!!", error);

            })


            axios.post(`${UrlServer}/gastoestimadogore_mo_semana`, //RUTA DEL API

            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "anyo": this.state.anyoseleccionado,
                "mes": this.state.messeleccionado
            }
        )
            .then((respuesta) => {
                console.log("gastoestimadogore_mo_semana ", respuesta.data);
                console.log("gastoestimadoexptec_mo_semana", gastoestimadoexptec_mo_semana);
                
                this.setState({
                    gastoestimadogore_mo_semana:respuesta.data,
                    gastoestimadoexptec_mo_semana:gastoestimadoexptec_mo_semana
                })

            })
            .catch((error) => {
                console.log("ERROR!!!!!", error);

            })



    }





    /////////FUNCIONES---------------------------------------/8///////////////////////////
    // onChange={event => this.getComponentes(event.target.value)}
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
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                },
                text: 'GASTO SEMANA DE LA MANO DE OBRA'
            },
            xAxis: {
                categories: this.state.fechas_avance_mes
            },
            yAxis: [{
                min: 0,
                title: {
                    text: 'SOLES'
                }
            }, {
                title: {
                    text: 'SOLES 1',
                   
                },
                opposite: true
            }],
            legend: {
                shadow: false
            },
            tooltip: {
                shared: true
            },

            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0,
                    // dataLabels: {
                    //     enabled: true
                    // },

                }

            },
            series: [{
                name: 'GASTO SEGUN EXP TEC',
                color: 'rgba(165,170,217,1)',
                data: this.state.gastoestimadoexptec_mo,
                pointPadding: 0.3,
                pointPlacement: -0.2
            }, {
                name: 'GASTO SEGUN LO PAGADO',
                color: 'rgba(126,86,134,.9)',
                // color: 'rgba(122,27,27,.8)',
                data: this.state.gasto_dia_gore,
                pointPadding: 0.4,
                pointPlacement: -0.2
            }]

        };
        return (
            <div>
                <nav>
                    <select onChange={event => this.getmeses(event.target.value)}>
                        <option>Seleccione el año</option>
                        {this.state.anyos.map((element, index) =>
                            <option key={index} value={element.anyo}>{element.anyo}</option>
                        )}
                    </select>

                    <select onChange={event => this.getsemanas(event.target.value)}>
                        <option>Seleccione el mes</option>
                        {this.state.meses.map((element, index) =>
                            <option key={index} value={element.mes}>{element.mes}</option>
                        )}
                    </select>

                    <select onChange={event => this.getGastoMO(event.target.value)}>
                        <option>Seleccione la semana</option>
                        {this.state.semanas.map((element, index) =>
                            <option key={index} value={element.semana}>{element.semana}</option>
                        )}
                    </select>
                </nav>
                <HighchartsReact

                    highcharts={Highcharts}
                    options={options}
                />
                <br />
                <table className="tabla2">
                    <thead>
                        <tr>
                            <td>GASTO EN MANO DE OBRA</td>
                            {this.state.gastoestimadoexptec_mo_semana.map((element, index) =>
                                [
                                    <td colspan ="2"> Semana {element.semana}</td>,
                                ]
                            )}
                            {/* <td>TOTAL P/G</td> */}

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>(A) GASTO EN MO SEGÚN ACU DEL EXPEDIENTE</td>
                            
                            
                            {this.state.gastoestimadoexptec_mo_semana.map((element, index) =>
                                
                                [
                                    <td>{Redondea(element.valor)}</td>,
                                    <td rowspan="3">{Redondea((1 - (element.valor / this.state.gastoestimadogore_mo_semana[index].gasto_semana_mo)) * 100)} %</td>
                                ]
                            )}
                            {/* <td rowspan="3">sumatoria</td> */}


                        </tr>
                        <tr>
                            <td>(B) GASTO EN MO ESTIMADO A PAGAR POR EL GORE</td>
                            {this.state.gastoestimadogore_mo_semana.map((element, index) =>
                                [
                                    <td>{Redondea(element.gasto_semana_mo)}</td>
                                ]
                            )}
                        </tr>
                        <tr>
                            <td className="resultadomo">(A - B) PÉRDIDA Y/O GANANCIA </td>
                            
                            {this.state.gastoestimadogore_mo_semana.map((element, index) =>
                                
                                [
                                    <td>{Redondea(this.state.gastoestimadoexptec_mo_semana[index].valor - element.gasto_semana_mo) }</td>
                                ]
                            )}
                        </tr>
                    </tbody>
                </table>
                <br/>
                <table className="tabla1 table-responsive table-hover">
                    <thead>
                        <tr>
                            <td className="detalle1" colspan={this.state.cargosPersonal.length + 7}>SISTEMA DE INFORMACIÓN GERENCIAL DE OBRAS</td>
                            {this.state.fechasavance.map((element, index) =>
                                <td className="resultadomo" colspan="4" rowspan="2">{this.getnumerodia(element.fecha)}</td>
                            )}
                        </tr>
                        <tr>
                            {/* {this.state.fechasavance.map((element, index) =>
                                <td rowspan = "2">
                                    
                                </td>
                            )} */}
                            <td rowspan="3">TIPO</td>
                            <td rowspan="3">ITEM</td>
                            <td className="partida" rowspan="3">DESCRIPCION DE PARTIDAS EJECUTADAS</td>
                            <td rowspan="3">UND</td>
                            <td rowspan="3">REND</td>
                            <td rowspan="3">P/U</td>
                            <td colspan={this.state.cargosPersonal.length + 1}>PERSONAL SEGÚN EXPEDIENTE TÉCNICO</td>
                        </tr>
                        <tr>
                            {this.state.cargosPersonal.map((element, index) =>
                                <td>{element.descripcion}</td>
                            )}
                            <td rowspan="2">CU/MO</td>

                            {this.state.fechasavance.map((element, index) =>
                                ([
                                    <td>METRADO</td>,
                                    <td>VALORIZADO</td>,
                                    <td>%</td>,
                                    <td className="resultadomo">GASTO MO EXP. TEC.</td>
                                ])
                            )}
                        </tr>
                        {/* <tr>

                            {this.state.cargosPersonal.map((element, index) =>
                                <td>
                                    <input
                                        onChange={event => this.updateinputCostoReal(event.target, index)}
                                        name="costoRealMO"
                                    />
                                </td>
                            )}

                        </tr> */}

                    </thead>
                    <tbody>
                        {this.state.gastosMO.map((element, index) =>

                            <tr>
                                <td>{element.tipo}</td>
                                <td>{element.item}</td>
                                <td>{element.descripcion}</td>
                                <td>{element.unidad_medida}</td>
                                <td>{element.rendimiento}</td>
                                <td>{element.costo_unitario}</td>
                                {this.state.cargosPersonal.map((element2, index2) =>
                                    <td>{Redondea(element["cargo_" + index2])}</td>
                                )}
                                <td>{Redondea(element.parcial_mo)}</td>
                                {/* {this.state.fechasavance.map((element2, index2) =>
                                    <td>
                                        <td>{Redondea(element["metrado" + index2])}</td>
                                        <td>{Redondea(element["metrado" + index2] * element.costo_unitario)}  </td>
                                        <td>{Redondea(element["metrado" + index2] / element.rendimiento * 100)} %</td>
                                        <td>gasto real</td>
                                    </td>
                                )} */}
                                {this.state.fechasavance.map((element2, index2) =>
                                    ([
                                        <td>{Redondea(element["metrado" + index2])}</td>,
                                        <td>{Redondea(element["metrado" + index2] * element.costo_unitario)}  </td>,
                                        <td>{Redondea(element["metrado" + index2] / element.rendimiento * 100)}</td>,
                                        <td className="resultadomo">{Redondea(element["metrado" + index2] * element.parcial_mo)}</td>
                                    ])
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>

                <br />
                {/* <aside> */}
                <table className="tabla1">
                    <thead>
                        <tr>
                            <td>N°</td>
                            <td>Cant. Personal CD</td>
                            <td>Categoría</td>
                            <td>Costo GORE</td>
                            <td>Días Pagados</td>
                            <td>Costo/Día</td>
                        </tr>
                    </thead>

                    <tbody>

                        {this.state.CantidadPersonalReal.map((element, index) =>
                            <tr>
                                <td>{index + 1}</td>

                                <td>
                                    <input className="inputproy" name="cantidad" type="text" placeholder={element.cantidad}
                                        onBlur={event => this.updateinput(event.target, index)} /> </td>
                                <td>
                                    <select name="cargo"
                                        onChange={event => this.updateinput(event.target, index)}
                                        value={element.cargo}>
                                        {this.state.cargos.map((element2, index2) =>
                                            <option value={element2.idcargos_obreros}>{element2.nombre}</option>
                                        )}
                                    </select>
                                </td>
                                <td>
                                    <input className="inputproy" name="costogore" type="text" placeholder={element.costogore}
                                        onBlur={event => this.updateinput(event.target, index)} /> </td>
                                <td>
                                    <input className="inputproy" name="dias" type="text" placeholder={element.dias}
                                        onBlur={event => this.updateinput(event.target, index)}
                                    /> </td>
                                <td>S/. {Redondea(element.cantidad * element.costogore * element.dias)}</td>
                            </tr>
                        )}


                    </tbody>
                    <tfoot>
                        <button
                            className="botoncomp"
                            disabled={(this.state.semanaseleccionada != 0) ? "" : "disabled"}
                            onClick={event => this.addcargo()}>+</button>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <button className="botoncomp"
                            disabled={(this.state.semanaseleccionada != 0) ? "" : "disabled"}
                            onClick={event => this.guardardata_mo()}>Guardar</button></tfoot>
                </table>
                {/* </aside> */}
                <br />
                <table className="tabla1 table-hover table-responsive">
                    <thead>
                        <tr>
                            <td colspan={this.state.fechasavance.length + 1}> RESUMEN DE GASTO DE LA SEMANA EN MANO DE OBRA</td>
                        </tr>
                        <tr>
                            <td>DETALLE</td>
                            {this.state.fechasavance.map((element, index) =>
                                <td>{this.getnumerodia(element.fecha)}</td>

                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Estimación del Exp. Téc.</td>
                            {this.state.partidasgastoreales.map((element, index) =>
                                <td>{Redondea(element)}</td>
                            )}
                        </tr>
                        <tr>
                            <td>Monto a Pagar</td>
                            {this.state.fechasavance.map((element, index) =>
                                <td>{Redondea(this.sumatoriacostodia() / this.state.fechasavance.length)}</td>
                            )}
                        </tr>
                    </tbody>
                </table>
                <br />

                <table className="tabla2">
                    <thead>
                        <tr>
                            <td>GASTO EN MANO DE OBRA</td>
                            <td>TOTAL SOLES</td>
                            <td>DÉFICIT</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>(A) GASTO EN MO SEGÚN ACU DEL EXPEDIENTE</td>
                            <td> {Redondea(this.state.gastoexptec_mo)}</td>
                            <td rowspan="3">{Redondea((1 - (this.state.gastoexptec_mo / this.sumatoriacostodia())) * 100)} %</td>
                        </tr>
                        <tr>
                            <td>(B) GASTO EN MO ESTIMADO A PAGAR POR EL GORE</td>
                            <td>{Redondea(this.sumatoriacostodia())}</td>
                        </tr>
                        <tr>
                            <td className="resultadomo">(A - B) PÉRDIDA Y/O GANANCIA </td>
                            <td className="resultadomo">{Redondea(this.state.gastoexptec_mo - this.sumatoriacostodia())}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        );
    }

}
export default RecursosPersonal;

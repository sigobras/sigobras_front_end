import React, { Component } from 'react';
import axios from 'axios';
import { MdMoreVert, MdDone } from "react-icons/md";
import { Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col, UncontrolledPopover, PopoverBody, Spinner, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Table } from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import { Redondea1, Redondea } from '../../../Utils/Funciones';
import "./valorizaciones.css";
import { BsFillTrashFill } from "react-icons/bs";
import { FaEdit, FaSave } from "react-icons/fa";
import { AiOutlineFileAdd } from "react-icons/ai";

class ValorizacionGeneral extends Component {
    constructor(props) {
        super(props);

        this.state = {
            DataAniosApi: [],
            DataMesesApi: [],
            DataResumenApi: [],
            DataComponentesApi: [],
            DataPartidasApi: [],

            // select  dropdown años
            dropdownOpen: false,

            // entradas
            InputAnio: "",

            // tab activos
            activeTabMes: "",
            activeTabComponente: "resumen",

            // seteos de encabezados 

            NombreComponente: "",
            IdComponente: "",
            FechaInicio: "",
            FechaFinal: "",
            SMSValorizacion: true,

            // costos indirectos

            costos_indirectos: [],
            activatorinput: -1,
        };

        this.OpenSelectAnios = this.OpenSelectAnios.bind(this);
        this.SelectAnio = this.SelectAnio.bind(this);
        this.TabMeses = this.TabMeses.bind(this);
        this.TabComponentes = this.TabComponentes.bind(this);

        // requests
        this.reqAnios = this.reqAnios.bind(this);
        this.reqMeses = this.reqMeses.bind(this);
    }

    componentDidMount() {
        // llamamos la primera carga de apis
        this.reqAnios()

    }

    OpenSelectAnios() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    SelectAnio(anio) {
        // console.log("año parametro ", anio, "state ", this.state.InputAnio)

        this.setState({
            InputAnio: anio,
            activeTabComponente: "resumen",
        })

        // llama al api de meses
        if (this.state.InputAnio !== anio) {
            this.reqMeses(anio)
        }
    }

    async TabMeses(tab, FechaInicio, FechaFinal) {
        // console.log( "TAB MESES ", FechaInicio, " -- ",  FechaFinal, "id componente",  this.state.IdComponente)
        if (this.state.activeTabMes !== tab) {
            await this.setState({
                activeTabMes: tab,
                FechaInicio,
                FechaFinal
            })
            this.get_data_costos_indirectos();
            // llamamos a componentes
            this.reqComponentes(FechaInicio, FechaFinal)
            if (this.state.activeTabComponente === "resumen") {
                this.reqResumen(FechaInicio, FechaFinal)
                return
            }
            this.reqPartidas(this.state.IdComponente, FechaInicio, FechaFinal)
        }
    }

    TabComponentes(tab, id_componente, nombreComp) {
        // console.log("id componente ",id_componente , "tipo", tab )
        if (this.state.activeTabComponente !== tab) {
            this.setState({
                activeTabComponente: tab,
                IdComponente: id_componente,
                NombreComponente: nombreComp
            })

            // llama api de partidas
            if (tab === "resumen") {
                this.reqResumen(this.state.FechaInicio, this.state.FechaFinal)
                return
            }
            this.reqPartidas(id_componente, this.state.FechaInicio, this.state.FechaFinal)

        }
    }

    // REQUESTS A APIS DE FUNCIONES--------------------================================------------------

    reqAnios() {
        // let isLoading = true;
        axios.post(`${UrlServer}${this.props.Ruta.Anios}`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
            .then(async (res) => {
                //console.table('data val princiapl', res);
                if (res.data !== "vacio") {
                    var ResData = res.data
                    var UltimoAnio = res.data.length - 1
                    var UltimoMes = res.data[UltimoAnio].periodos.length - 1

                    console.log("DATA", res.data)

                    await this.setState({
                        DataAniosApi: ResData,
                        DataMesesApi: res.data[UltimoAnio].periodos,
                        DataResumenApi: res.data[UltimoAnio].periodos[UltimoMes].resumen,
                        DataComponentesApi: res.data[UltimoAnio].periodos[UltimoMes].componentes,

                        // // seteamos el nombre del componente
                        NombreComponente: 'RESUMEN DE VALORIZACION',

                        // CARGAS POR DEFAULT 
                        InputAnio: ResData[UltimoAnio].anyo,

                        // tab activos
                        activeTabMes: UltimoMes.toString(),
                        activeTabComponente: "resumen",
                        FechaInicio: res.data[UltimoAnio].periodos[UltimoMes].fecha_inicial,
                        FechaFinal: res.data[UltimoAnio].periodos[UltimoMes].fecha_final,
                    })
                    this.get_data_costos_indirectos();
                    return
                }

            })
            .catch(err => {
                console.log('ERROR ANG algo salió mal' + err);
            })
            .finally(() => {
                this.setState({
                    SMSValorizacion: false
                })
                // console.log("isLoading>>" , isLoading)  
            });

        // console.log("isLoading" , isLoading)
    }

    reqMeses(anio) {
        axios.post(`${UrlServer}${this.props.Ruta.Mes}`,
            {
                "id_ficha": sessionStorage.getItem("idobra"),
                "anyo": anio
            }
        )
            .then(async (res) => {
                var UltimoMes = res.data.length - 1

                console.log('res meses> ', res.data)
                var mesinicial = res.data[res.data.length - 1]
                await this.setState({

                    FechaInicio: mesinicial.fecha_inicial,
                    FechaFinal: mesinicial.fecha_final
                })
                this.get_data_costos_indirectos();
                this.setState({
                    DataMesesApi: res.data,
                    activeTabMes: UltimoMes.toString()
                })
                //  console.log("inicio ", res.data[UltimoMes].fecha_inicial , "final ",  res.data[UltimoMes].fecha_final)
                this.reqResumen(res.data[UltimoMes].fecha_inicial, res.data[UltimoMes].fecha_final)

            })
            .catch((err) => {

                console.log('hay erres al solicitar la peticion al api, ', err);
            })
    }

    reqResumen(FechaInicial, FechaFinal) {

        // console.log("fecha en resumen ", FechaInicial, FechaFinal)
        axios.post(`${UrlServer}${this.props.Ruta.ResumenComp}`,
            {
                "id_ficha": sessionStorage.getItem("idobra"),
                "fecha_inicial": FechaInicial,
                "fecha_final": FechaFinal

            }
        )
            .then((res) => {
                // console.log('res  ressumen > ', res.data)
                this.setState({
                    DataResumenApi: res.data
                })
            })
            .catch((err) => {
                console.log('hay erres al solicitar la peticion al api, ', err);
            })
    }

    reqComponentes(FechaInicial, FechaFinal) {
        axios.post(`${UrlServer}${this.props.Ruta.Componentes}`,
            {
                "id_ficha": sessionStorage.getItem("idobra"),
                "fecha_inicial": FechaInicial,
                "fecha_final": FechaFinal
            }
        )
            .then((res) => {
                // console.log('res COMPONENTES> ', res.data)
                this.setState({
                    DataComponentesApi: res.data,
                })

                // reqPartidas
            })
            .catch((err) => {
                console.log('hay erres al solicitar la peticion al api, ', err);
            })
    }

    reqPartidas(IdComponente, FechaInicio, FechaFinal) {
        // console.log("data parametros partidas ", IdComponente, "f inicio ", FechaInicio,  "f final", FechaFinal)
        axios.post(`${UrlServer}${this.props.Ruta.Partidas}`,
            {
                "id_componente": IdComponente,
                "fecha_inicial": FechaInicio,
                "fecha_final": FechaFinal
            }
        )
            .then((res) => {
                // console.log('res PARTIDAS > ', res.data)
                this.setState({
                    DataPartidasApi: res.data,
                })
            })
            .catch((err) => {
                console.log('hay erres al solicitar la peticion al api, ', err);
            })
    }

    async get_data_costos_indirectos() {
        var costos_indirectos = await axios.post(`${UrlServer}/getCostosIndirectos`,
            {
                "fecha_inicial": this.state.FechaInicio,
                "fecha_final": this.state.FechaFinal,
                "fichas_id_ficha": sessionStorage.getItem("idobra"),

            }
        );
        console.log('====================================');
        console.log("costos_indirectos ", costos_indirectos);
        console.log('====================================');

        this.setState({
            costos_indirectos: costos_indirectos.data

        })
    }

    agregar_costo_indirecto() {
        var costos_indirectos = this.state.costos_indirectos
        costos_indirectos.push(
            {
                "costo_indirecto": " Gastos generales",
                "monto": " 15151613",

            }
        )
        this.setState(
            {
                costos_indirectos
            }
        )
    }

    updateinput(index, nombre_campo, valor) {
        var costos_indirectos = this.state.costos_indirectos
        costos_indirectos[index][nombre_campo] = valor

        console.log("costos_indirectos", costos_indirectos);

        this.setState(
            {
                costos_indirectos
            }
        )
    }

    async eliminar_costo_indirecto(index) {
        if (confirm("Desea eliminar este registro ? " + index)) {
            var res = await axios.post(`${UrlServer}/eliminarCostosIndirectos`,
                {
                    "id": this.state.costos_indirectos[index].id

                }
            );
            console.log('====================================');
            console.log("res1 ", res);
            console.log('====================================');

            var costos_indirectos = this.state.costos_indirectos

            costos_indirectos.splice(index, 1);

            this.setState(
                {
                    costos_indirectos
                }
            );
            console.log("costos_indirectos eliminados", costos_indirectos);
        }

    }

    activarEdicion(index) {
        this.setState(
            {

                activatorinput: index
            }
        )

    }

    async guardar_costo_indirecto(index) {

        var res = await axios.post(`${UrlServer}/agregarCostoIndirecto`,
            {
                "id": this.state.costos_indirectos[index].id,
                "nombre": this.state.costos_indirectos[index].nombre,
                "monto": this.state.costos_indirectos[index].monto,
                "fecha_inicial": this.state.FechaInicio,
                "fecha_final": this.state.FechaFinal,
                "fichas_id_ficha": sessionStorage.getItem("idobra"),

            }
        );
        console.log('====================================');
        console.log("res ", res);
        console.log('====================================');
    }



    render() {
        const { DataAniosApi, DataMesesApi, DataResumenApi, DataComponentesApi, DataPartidasApi, activeTabMes, activeTabComponente, NombreComponente, InputAnio, SMSValorizacion } = this.state
        return (

            SMSValorizacion === true
                ?
                <div className="text-center" > <Spinner color="primary" type="grow" /></div>
                :
                DataAniosApi.length > 0
                    ?
                    <div>

                        <Nav tabs>
                            {/* AÑOS */}
                            <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.OpenSelectAnios}>
                                <DropdownToggle nav caret>
                                    {InputAnio}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {
                                        DataAniosApi.map((anio, IndexAnio) =>
                                            <DropdownItem key={IndexAnio} onClick={() => this.SelectAnio(anio.anyo)}>{anio.anyo}</DropdownItem>
                                        )
                                    }

                                </DropdownMenu>
                            </Dropdown>
                            {/* MESES */}
                            {
                                DataMesesApi.map((mes, IndexMes) =>
                                    <NavItem key={IndexMes}>
                                        <NavLink className={classnames({ active: activeTabMes === IndexMes.toString() })} onClick={() => this.TabMeses(IndexMes.toString(), mes.fecha_inicial, mes.fecha_final)} >
                                            {mes.codigo}
                                        </NavLink>
                                    </NavItem>
                                )
                            }

                        </Nav>

                        {/* RESUMEN Y COMPONENTES ===================================================== */}

                        {/* COMPONENTES */}
                        <Nav tabs>
                            <NavItem >
                                <NavLink className={classnames({ active: activeTabComponente === "resumen" })} onClick={() => { this.TabComponentes("resumen", "", "RESUMEN DE VALORIZACIÓN") }} >
                                    RESUMEN
                            </NavLink>
                            </NavItem>
                            {DataComponentesApi.map((Comp, IComp) =>
                                <NavItem key={IComp}>
                                    <NavLink className={classnames({ active: activeTabComponente === IComp.toString() })} onClick={() => { this.TabComponentes(IComp.toString(), Comp.id_componente, Comp.nombre) }} >
                                        C-{Comp.numero}
                                    </NavLink>
                                </NavItem>
                            )}

                        </Nav>

                        <Card className="m-1">
                            <CardHeader>{NombreComponente}</CardHeader>
                            <CardBody>
                                {
                                    activeTabComponente === "resumen"
                                        ?
                                        <div className="table-responsive">
                                            <Table className="table table-bordered small table-sm mb-0" hover>
                                                <thead className="resplandPartida">
                                                    <tr className="text-center">
                                                        <th className="align-middle" rowSpan="3">N°</th>
                                                        <th className="align-middle" rowSpan="3">NOMBRE DEL COMPONENTE</th>
                                                        <th>S/. {DataResumenApi.presupuesto}</th>

                                                        <th>S/. {DataResumenApi.valor_anterior}</th>
                                                        <th>{Redondea(DataResumenApi.porcentaje_anterior)} %</th>

                                                        <th>S/. {DataResumenApi.valor_actual}</th>
                                                        <th>{Redondea(DataResumenApi.porcentaje_actual)} %</th>

                                                        <th>S/. {DataResumenApi.valor_total}</th>
                                                        <th>{Redondea(DataResumenApi.porcentaje_total)} %</th>

                                                        <th>S/. {DataResumenApi.valor_saldo}</th>
                                                        <th>{Redondea(DataResumenApi.porcentaje_saldo)} %</th>
                                                    </tr>
                                                    <tr className="text-center">
                                                        <th>MONTO ACT.</th>
                                                        <th colSpan="2">AVANCE ANTERIOR</th>
                                                        <th colSpan="2" >AVANCE ACTUAL</th>
                                                        <th colSpan="2">AVANCE ACUMULADO</th>
                                                        <th colSpan="2">SALDO</th>
                                                    </tr>
                                                    <tr className="text-center">
                                                        <th>PPTO</th>
                                                        <th>MONTO</th>
                                                        <th>%</th>
                                                        <th >MONTO</th>
                                                        <th >%</th>
                                                        <th>MONTO</th>
                                                        <th>%</th>
                                                        <th>MONTO</th>
                                                        <th>%</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {DataResumenApi.length <= 0 ? <tr><td colSpan="11"></td></tr> :
                                                        DataResumenApi.componentes.map((ResumenC, iC) =>
                                                            <tr key={iC} >
                                                                <td>{ResumenC.numero}</td>
                                                                <td>{ResumenC.nombre} </td>
                                                                <td>{ResumenC.presupuesto}</td>

                                                                <td>{ResumenC.valor_anterior}</td>
                                                                <td>{ResumenC.porcentaje_anterior}</td>
                                                                <td className="bg-mm">{ResumenC.valor_actual}</td>
                                                                <td className="bg-mm">{ResumenC.porcentaje_actual}</td>
                                                                <td >{ResumenC.valor_total}</td>
                                                                <td>{ResumenC.porcentaje_total}</td>
                                                                <td>{ResumenC.valor_saldo}</td>
                                                                <td>{ResumenC.porcentaje_saldo}</td>
                                                            </tr>
                                                        )
                                                    }

                                                    {/* <tr className="resplandPartida font-weight-bolder">
                                                        <td colSpan="2">TOTAL COSTO DIRECTO</td>
                                                        <td>S/. {this.state.ppto}xxxxx</td>

                                                        <td>S/. {this.state.avance_anterior}</td>
                                                        <td>{this.state.porcentaje_anterior} %</td>

                                                        <td>S/. {this.state.avance_actual}</td>
                                                        <td>{this.state.porcentaje_actual} %</td>

                                                        <td>S/. {this.state.avance_acumulado}</td>
                                                        <td>{this.state.porcentaje_acumulado} %</td>

                                                        <td>S/. {this.state.saldo}</td>
                                                        <td>{this.state.porcentaje_saldo} %</td>

                                                    </tr> */}

                                                    <tr className="resplandPartida font-weight-bolder">
                                                        <td colSpan="2">TOTAL COSTO DIRECTO</td>
                                                        <td>S/. {DataResumenApi.presupuesto}</td>

                                                        <td>S/. {DataResumenApi.valor_anterior}</td>
                                                        <td>{Redondea(DataResumenApi.porcentaje_anterior)} %</td>

                                                        <td>S/. {DataResumenApi.valor_actual}</td>
                                                        <td>{Redondea(DataResumenApi.porcentaje_actual)} %</td>

                                                        <td>S/. {DataResumenApi.valor_total}</td>
                                                        <td>{Redondea(DataResumenApi.porcentaje_total)} %</td>

                                                        <td>S/. {DataResumenApi.valor_saldo}</td>
                                                        <td>{Redondea(DataResumenApi.porcentaje_saldo)} %</td>

                                                    </tr>
                                                    {/* Costos inderectos */}
                                                    {this.state.costos_indirectos.map((item, index) =>
                                                        <tr key={index}>
                                                            <td>

                                                            </td>
                                                            <td>
                                                                <input
                                                                    className=" input_expandible "
                                                                    type="text" placeholder={item.nombre}
                                                                    onBlur={event => this.updateinput(index, "nombre", event.target.value)}
                                                                    disabled={(this.state.activatorinput == index) ? "" : "disabled"}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    className="input_expandible "
                                                                    type="text" placeholder={Redondea(item.monto)}
                                                                    onBlur={event => this.updateinput(index, "monto", event.target.value)}
                                                                    disabled={(this.state.activatorinput == index) ? "" : "disabled"}
                                                                />
                                                            </td>
                                                            <td>
                                                                {
                                                                    Redondea(item.monto * parseFloat(DataResumenApi.porcentaje_anterior).toFixed(2) / 100)
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    Redondea(DataResumenApi.porcentaje_anterior)
                                                                } 
                                                            </td>
                                                            <td>
                                                                {
                                                                    Redondea(item.monto * parseFloat(DataResumenApi.porcentaje_actual).toFixed(2) / 100)
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    Redondea(DataResumenApi.porcentaje_actual)
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    Redondea(item.monto * parseFloat(DataResumenApi.porcentaje_total).toFixed(2) / 100)
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    Redondea(DataResumenApi.porcentaje_total)
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    Redondea(item.monto * parseFloat(DataResumenApi.porcentaje_saldo).toFixed(2) / 100)
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    Redondea(DataResumenApi.porcentaje_saldo)
                                                                }
                                                            </td>
                                                            <td>
                                                                <button
                                                                    //className="boxy"
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.eliminar_costo_indirecto(index)}>
                                                                    <BsFillTrashFill size={10} />
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-success"
                                                                    onClick={event => this.activarEdicion(index)}>
                                                                    <FaEdit size={10} />
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-primary  " onClick={event => this.guardar_costo_indirecto(index)}>
                                                                    <FaSave size={10} />
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    )}
                                                    <tr className="resplandPartida font-weight-bolder">

                                                        <td colSpan="2">
                                                            TOTAL COSTO INDIRECTO
                                                        </td>

                                                        {/* PRESUPUESTO DE COSTO INDIRECTO */}
                                                        <td>
                                                        S/. 
                                                            {
                                                                (() => {
                                                                    var suma = 0
                                                                    for (let index = 0; index < this.state.costos_indirectos.length; index++) {
                                                                        const element = this.state.costos_indirectos[index];
                                                                        suma = suma + parseFloat(element.monto)
                                                                    }
                                                                    return Redondea(suma)
                                                                })()
                                                            }
                                                        </td>

                                                        {/* AVANCE ANTERIOR */}
                                                        <td>
                                                        S/. 
                                                            {
                                                                (() => {
                                                                    var suma = 0
                                                                    for (let index = 0; index < this.state.costos_indirectos.length; index++) {
                                                                        const element = this.state.costos_indirectos[index];
                                                                        suma = suma + parseFloat(element.monto * DataResumenApi.porcentaje_anterior / 100)

                                                                    }
                                                                    return Redondea(suma)
                                                                })()
                                                            }
                                                        </td>
                                                        {/* AVANCE ANTERIOR PORCENTAJE  */}
                                                        <td>
                                                            {
                                                                DataResumenApi.porcentaje_anterior
                                                            } %

                                                            {/* {
                                                                (() => {
                                                                    var presupuesto = 0
                                                                    var avance_anterior = 0
                                                                    for (let index = 0; index < this.state.costos_indirectos.length; index++) {
                                                                        const element = this.state.costos_indirectos[index];
                                                                        presupuesto = presupuesto + parseFloat(element.monto)
                                                                        avance_anterior = avance_anterior + parseFloat(element.monto * DataResumenApi.porcentaje_anterior / 100)
                                                                    }                                                                    
                                                                    return Redondea(avance_anterior/presupuesto*100)
                                                                })()
                                                            } */}
                                                        </td>
                                                            {/* AVANCE ACTUAL  */}

                                                        <td>
                                                        S/. 
                                                            {
                                                                (() => {
                                                                    var suma = 0
                                                                    for (let index = 0; index < this.state.costos_indirectos.length; index++) {
                                                                        const element = this.state.costos_indirectos[index];
                                                                        suma = suma + parseFloat(element.monto * DataResumenApi.porcentaje_actual / 100)
                                                                    }
                                                                    return Redondea(suma)
                                                                })()
                                                            }
                                                        </td>
                                                            {/* AVANCE ACTUAL PORCENTAJE  */}

                                                        <td>
                                                            {
                                                                DataResumenApi.porcentaje_actual
                                                            } %
                                                        </td>

                                                        {/* AVANCE ACUMULADO */}
                                                        <td>
                                                        S/. 
                                                            {
                                                                (() => {
                                                                    var suma = 0
                                                                    for (let index = 0; index < this.state.costos_indirectos.length; index++) {
                                                                        const element = this.state.costos_indirectos[index];
                                                                        suma = suma + parseFloat(element.monto * DataResumenApi.porcentaje_total / 100)
                                                                    }
                                                                    return Redondea(suma)
                                                                })()
                                                            }
                                                        </td>

                                                        {/* AVANCE ACUMULADO PORCENTAJE  */}
                                                        <td>
                                                            {
                                                                DataResumenApi.porcentaje_total
                                                            } %
                                                        </td>

                                                            {/* AVANCE SALDO  */}
                                                        <td>
                                                        S/. 
                                                            {
                                                                (() => {
                                                                    var suma = 0
                                                                    for (let index = 0; index < this.state.costos_indirectos.length; index++) {
                                                                        const element = this.state.costos_indirectos[index];
                                                                        suma = suma + parseFloat(element.monto * DataResumenApi.porcentaje_saldo / 100)
                                                                    }
                                                                    return Redondea(suma)
                                                                })()
                                                            }
                                                        </td>

                                                        {/* AVANCE SALDO PORCENTAJE  */}
                                                        <td>
                                                            {
                                                                DataResumenApi.porcentaje_saldo
                                                            }
                                                            %
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>

                                                        </td>
                                                        <td>
                                                            <button className="btn btn-primary" onClick={event => this.agregar_costo_indirecto()}>
                                                                <AiOutlineFileAdd size={20} />

                                                            </button>
                                                        </td>


                                                    </tr>



                                                </tbody>
                                            </Table>
                                        </div>
                                        :
                                        <div className="table-responsive">
                                            <Table className="table table-bordered table-sm small mb-0" hover>
                                                <thead className="text-center resplandPartida">
                                                    <tr>
                                                        <th colSpan="3" rowSpan="2" className="align-middle">DESCRIPCION</th>
                                                        <th colSpan="2">S/. {DataPartidasApi.precio_parcial}</th>

                                                        <th colSpan="2">S/. {DataPartidasApi.valor_anterior}</th>
                                                        <th>{DataPartidasApi.porcentaje_anterior} %</th>

                                                        <th colSpan="2" >S/. {DataPartidasApi.valor_actual}</th>
                                                        <th>{DataPartidasApi.porcentaje_actual} %</th>

                                                        <th colSpan="2">S/. {DataPartidasApi.valor_total}</th>
                                                        <th>{DataPartidasApi.porcentaje_total} %</th>

                                                        <th colSpan="2">S/. {DataPartidasApi.valor_saldo}</th>
                                                        <th>{DataPartidasApi.porcentaje_saldo} %</th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="2">PRESUPUESTO</th>
                                                        <th colSpan="3">ANTERIOR</th>
                                                        <th colSpan="3">ACTUAL</th>
                                                        <th colSpan="3">ACUMULADO</th>
                                                        <th colSpan="3">SALDO</th>
                                                    </tr>
                                                    <tr>
                                                        <th>ITEM</th>
                                                        <th>DESCRIPCION</th>
                                                        <th>METRADO</th>
                                                        <th>P. U. S/.</th>
                                                        <th>P. P S/.</th>

                                                        <th>MET. </th>
                                                        <th>VAL</th>
                                                        <th>%</th>

                                                        <th>MET.</th>
                                                        <th>VAL</th>
                                                        <th>%</th>

                                                        <th>MET.</th>
                                                        <th>VAL</th>
                                                        <th>%</th>

                                                        <th>MET.</th>
                                                        <th>VAL</th>
                                                        <th>%</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        DataPartidasApi.partidas === undefined ? <tr><td colSpan="17">cargando</td></tr> :

                                                            DataPartidasApi.partidas.map((partidas, Ipart) =>
                                                                <tr key={Ipart} className={partidas.tipo === "titulo" ? "font-weight-bold text-warning" : "font-weight-light"}>
                                                                    <td>{partidas.item}</td>
                                                                    <td>{partidas.descripcion}</td>
                                                                    <td>{partidas.metrado}</td>
                                                                    <td>{partidas.costo_unitario}</td>
                                                                    <td>{partidas.precio_parcial}</td>

                                                                    <td>{partidas.metrado_anterior}</td>
                                                                    <td>{partidas.valor_anterior}</td>
                                                                    <td>{partidas.porcentaje_anterior}</td>

                                                                    <td className="bg-mm">{partidas.metrado_actual}</td>
                                                                    <td className="bg-mm">{partidas.valor_actual}</td>
                                                                    <td className="bg-mm">{partidas.porcentaje_actual}</td>

                                                                    <td>{partidas.metrado_total}</td>
                                                                    <td>{partidas.valor_total}</td>
                                                                    <td>{partidas.porcentaje_total}</td>

                                                                    <td>
                                                                        {partidas.metrado_saldo === 0 ? <div className="text-success text-center"><MdDone size={20} /></div> :
                                                                            partidas.metrado_saldo
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {partidas.valor_saldo === 0 ? "" :
                                                                            partidas.valor_saldo
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {partidas.porcentaje_saldo === 0 ? "" :
                                                                            partidas.porcentaje_saldo
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                    }

                                                    <tr className="resplandPartida">
                                                        <td colSpan="3">TOTAL</td>
                                                        <td colSpan="2">S/. {DataPartidasApi.precio_parcial}</td>

                                                        <td colSpan="2">S/. {DataPartidasApi.valor_anterior}</td>
                                                        <td>{DataPartidasApi.porcentaje_anterior} %</td>

                                                        <td colSpan="2" >S/. {Redondea1(DataPartidasApi.valor_actual)}</td>
                                                        <td>{DataPartidasApi.porcentaje_actual} %</td>

                                                        <td colSpan="2">S/. {DataPartidasApi.valor_total}</td>
                                                        <td>{DataPartidasApi.porcentaje_total} %</td>

                                                        <td colSpan="2">S/. {DataPartidasApi.valor_saldo}</td>

                                                    </tr>
                                                </tbody>

                                            </Table>
                                        </div>
                                }

                            </CardBody>
                        </Card>


                    </div>

                    :
                    <div className="text-center text-warning" > No hay datos </div>

        );
    }
}

export default ValorizacionGeneral;
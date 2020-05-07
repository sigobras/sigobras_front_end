import React, { Component } from 'react';
import axios from 'axios';
import { MdMoreVert, MdDone } from "react-icons/md";
import { Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col, UncontrolledPopover, PopoverBody, Spinner, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Table } from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig'

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
            SMSValorizacion: true
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

    TabMeses(tab, FechaInicio, FechaFinal) {
        // console.log( "TAB MESES ", FechaInicio, " -- ",  FechaFinal, "id componente",  this.state.IdComponente)
        if (this.state.activeTabMes !== tab) {
            this.setState({
                activeTabMes: tab,
                FechaInicio,
                FechaFinal
            })

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
            .then((res) => {
                //console.table('data val princiapl', res);
                if (res.data !== "vacio") {
                    var ResData = res.data
                    var UltimoAnio = res.data.length - 1
                    var UltimoMes = res.data[UltimoAnio].periodos.length - 1

                    // console.log("Ultimo mes  ",  UltimoMes )

                    this.setState({
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
            .then((res) => {
                var UltimoMes = res.data.length - 1

                // console.log('res meses> ', res.data)
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

    render() {
        const { DataAniosApi, DataMesesApi, DataResumenApi, DataComponentesApi, DataPartidasApi, activeTabMes, activeTabComponente, NombreComponente, InputAnio, SMSValorizacion } = this.state
        return (

            SMSValorizacion === true
                ?
                    <div className="text-center" > <Spinner color="primary" type="grow" /></div>
                :
                    DataAniosApi.length >0 
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
                                                        <th>{DataResumenApi.porcentaje_anterior} %</th>

                                                        <th>S/. {DataResumenApi.valor_actual}</th>
                                                        <th>{DataResumenApi.porcentaje_actual} %</th>

                                                        <th>S/. {DataResumenApi.valor_total}</th>
                                                        <th>{DataResumenApi.porcentaje_total} %</th>

                                                        <th>S/. {DataResumenApi.valor_saldo}</th>
                                                        <th>{DataResumenApi.porcentaje_saldo} %</th>
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

                                                    <tr className="resplandPartida font-weight-bolder">
                                                        <td colSpan="2">TOTAL COSTO DIRECTO</td>
                                                        <td>S/. {this.state.ppto}</td>

                                                        <td>S/. {this.state.avance_anterior}</td>
                                                        <td>{this.state.porcentaje_anterior} %</td>

                                                        <td>S/. {this.state.avance_actual}</td>
                                                        <td>{this.state.porcentaje_actual} %</td>

                                                        <td>S/. {this.state.avance_acumulado}</td>
                                                        <td>{this.state.porcentaje_acumulado} %</td>

                                                        <td>S/. {this.state.saldo}</td>
                                                        <td>{this.state.porcentaje_saldo} %</td>

                                                    </tr>

                                                    {/* <tr className="resplandPartida font-weight-bolder">
                                                    <td colSpan="2">TOTAL COSTO INDIRECTO</td>
                                                    <td>S/. {this.state.ppto}</td>

                                                    <td>S/. {this.state.avance_anterior}</td>
                                                    <td>{this.state.porcentaje_anterior} %</td>

                                                    <td>S/. {this.state.avance_actual}</td>
                                                    <td>{this.state.porcentaje_actual} %</td>

                                                    <td>S/. {this.state.avance_acumulado}</td>
                                                    <td>{this.state.porcentaje_acumulado} %</td>

                                                    <td>S/. {this.state.saldo}</td>
                                                    <td>{this.state.porcentaje_saldo} %</td>

                                                </tr> */}
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

                                                        <td colSpan="2" >S/. {DataPartidasApi.valor_actual}</td>
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
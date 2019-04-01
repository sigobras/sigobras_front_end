import React, { Component } from 'react';
import axios from 'axios';
import { MdMoreVert, MdDone } from "react-icons/md";
import { Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col, UncontrolledPopover, PopoverBody, Spinner} from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig'

class ValorizacionGeneral extends Component {
    constructor(){
        super();
        
        this.state = {
            DataAniosApi:[],
            DataMesesApi:[],
            DataComponentesApi:[],
            DataResumenApi:[],
            DataPartidasApi:[],

            activeTabAnio: '0',
            activeTabMes: '0',
            activeTabComponente: 'resumen',
            // capturamos nombre del componentes 
            IdComponente:'',
            NombreComponente:'',
            // para poder obtener las partidas 
            fecha_inicial:'',
            fecha_final:''
        }; 

        this.TabsAnios = this.TabsAnios.bind(this);
        this.TabsMeses = this.TabsMeses.bind(this);
        this.TabsComponentes = this.TabsComponentes.bind(this);
    } 

    componentWillMount(){

        axios.post(UrlServer+'/getValGeneralAnyos',{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then((res)=>{
            if(res.data === "vacio"){
                console.log("no hay datos en la base datos")
            }else{
                console.log('data AÑOS', res.data)
                console.log('data PERIODOS', res.data[0].periodos)
                console.log('data COMPONENTES', res.data[0].periodos[0].componentes)
                console.log('data RESUMEN', res.data[0].periodos[0].resumen)
            
                this.setState({
                    DataAniosApi: res.data,
                    DataMesesApi:res.data[0].periodos,
                    DataComponentesApi:res.data[0].periodos[0].componentes,
                    DataResumenApi:res.data[0].periodos[0].resumen,

                    // seteamos el nombre del componente
                    NombreComponente:'RESUMEN DE VALORIZACION'
                })
            }
            
        
        })
        .catch(err=>{
            console.log('ERROR ANG'+ err);
            
        });
    }

    TabsAnios(tab) {
        if (this.state.activeTabAnio !== tab) {
            this.setState({
                activeTabAnio: tab
            });
        }
    }

    TabsMeses(tab, fechaInicial, fechaFinal ) {
        console.log('cero', tab,'Id componente', this.state.IdComponente ,'inicio', fechaInicial, 'fin', fechaFinal);
        
        if (this.state.activeTabMes !== tab) {
            this.setState({
                activeTabMes: tab,
                fecha_inicial:fechaInicial,
                fecha_final:fechaFinal,
                NombreComponente:'RESUMEN DE VALORIZACION'
            });
        }



        if(this.state.IdComponente !== ""){
            // llamamos al api de partidas en valarizaciones------------------------------------------------------------------------------------------------------------------------------
            axios.post(`${UrlServer}/getValGeneralPartidas`,
                {
                    "id_componente":this.state.IdComponente,
                    "fecha_inicial": fechaInicial,
                    "fecha_final": fechaFinal
                }
            )
            .then((res)=>{
                console.log('res partidas val desde tab meses>', res.data)
                this.setState({
                    DataPartidasApi:res.data
                })
            })
            .catch((err)=>{
                console.log('hay erres al solicitar la peticion al api, ',err);
            })    

                
        }else{
             // llamamos a resumen--------------------------------------------------------------------------------------------------------------------------------
             axios.post(`${UrlServer}/getValGeneralResumenPeriodo`,
                {
                    "id_ficha":sessionStorage.getItem("idobra"),
                    "fecha_inicial": fechaInicial,
                    "fecha_final": fechaFinal	
                }
            )
            .then((res)=>{
                console.log('rsumen', res.data)
                this.setState({
                    DataResumenApi:res.data
                })
            })
            .catch((err)=>{
                console.log('hay erres al solicitar la peticion al api, ',err);
            })   
        }
        
    }
    
    TabsComponentes(tab, id_componente, nombreComp) {
        if (this.state.activeTabComponente !== tab) {
            this.setState({
                activeTabComponente: tab,
                IdComponente:id_componente,
                NombreComponente:nombreComp,
            });

            if(tab !=="resumen"){
                // llamamos al api de partidas en valarizaciones
                axios.post(`${UrlServer}/getValGeneralPartidas`,
                    {
                        "id_componente":id_componente,
                        "fecha_inicial": this.state.fecha_inicial,
                        "fecha_final": this.state.fecha_final
                    }
                )
                .then((res)=>{
                    console.log('res partidas val', res)
                    this.setState({
                        DataPartidasApi:res.data
                    })
                })
                .catch((err)=>{
                    console.log('hay erres al solicitar la peticion al api, ',err);
                })    
            }
           
        }
    }

    render() {
        const { DataAniosApi, DataMesesApi, DataComponentesApi, DataResumenApi, DataPartidasApi, activeTabAnio, activeTabMes, activeTabComponente, NombreComponente} = this.state
        return (
                <Card>
                    {/* {DataAniosApi.length <= 0 ? <label className="text-center" >  <Spinner color="primary" size="sm" /></label>: */}
                    {/* AÑOS */}
                    <Nav tabs>
                        { DataAniosApi.map((anio, IA)=>
                            <NavItem key= { IA }>
                                <NavLink className={classnames({ active: activeTabAnio === IA.toString() })} onClick={() => { this.TabsAnios(IA.toString()); }} >
                                    {anio.anyo}
                                </NavLink>
                            </NavItem>
                        )}

                    </Nav>     

                    {/* MESES */}
                    <Nav tabs>
                            
                        { DataMesesApi.map((mes, IMes)=>
                            <NavItem key= { IMes }>
                                <NavLink className={classnames({ active: activeTabMes === IMes.toString() })} onClick={() => { this.TabsMeses(IMes.toString(), mes.fecha_inicial, mes.fecha_final) }} >
                                    {mes.codigo}
                                </NavLink>
                            </NavItem>
                        )}

                    </Nav>  

                    {/* COMPONENTES */}
                    <Nav tabs>
                        <NavItem >
                            <NavLink className={classnames({ active: activeTabComponente === "resumen" })} onClick={() => { this.TabsComponentes("resumen","","RESUMEN DE VALORIZACION") }} >
                                RESUMEN
                            </NavLink>
                        </NavItem>
                        { DataComponentesApi.map((Comp, IComp)=>
                            <NavItem key= { IComp }>
                                <NavLink className={classnames({ active: activeTabComponente === IComp.toString() })} onClick={() => { this.TabsComponentes(IComp.toString(),Comp.id_componente, Comp.nombre) }} >
                                C - {Comp.numero}
                                </NavLink>
                            </NavItem>
                        )}

                    </Nav>
                    
                    <Card className="m-1">
                        <CardHeader>{ NombreComponente}</CardHeader>
                        <CardBody>
                        {
                            activeTabComponente === "resumen"?
                            <div className="table-responsive">
                                <table className="table table-bordered small table-sm">
                                    <thead>
                                        <tr className="text-center">
                                            <th className="align-middle" rowSpan="3">N°</th>
                                            <th className="align-middle" rowSpan="3">NOMBRE DEL COMPONENTE</th>
                                            <th>S/.resumen.monto_actual</th>
                                            <th colSpan="2">S/.resumen.avance_anterior</th>
                                            <th colSpan="2">S/.resumen.avance_actual</th>
                                            <th colSpan="2">S/.resumen.avance_acumulado</th>
                                            <th colSpan="2">S/.resumen.saldo</th>
                                        </tr>
                                        <tr className="text-center">
                                            <td>MONTO ACT.</td>
                                            <td colSpan="2">AVANCE ANTERIOR</td>
                                            <td colSpan="2">AVANCE ACTUAL</td>
                                            <td colSpan="2">AVANCE ACUMULADO</td>
                                            <td colSpan="2">SALDO</td>
                                        </tr>
                                        <tr className="text-center">
                                            <td>PPTO</td>
                                            <td>MONTO</td>
                                            <td>%</td>
                                            <td>MONTO</td>
                                            <td>%</td>
                                            <td>MONTO</td>
                                            <td>%</td>
                                            <td>MONTO</td>
                                            <td>%</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            DataResumenApi.map((ResumenC, iC)=>
                                                <tr key={ iC }>
                                                    <td>{ ResumenC.numero }</td>
                                                    <td>{ ResumenC.nombre } </td>
                                                    <td>{ ResumenC.presupuesto }</td>

                                                    <td>{ ResumenC.valor_anterior }</td>
                                                    <td>{ ResumenC.porcentaje_anterior }</td>
                                                    <td>{ ResumenC.valor_actual }</td>
                                                    <td>{ ResumenC.porcentaje_actual }</td>
                                                    <td>{ ResumenC.valor_total }</td>
                                                    <td>{ ResumenC.porcentaje_total }</td>
                                                    <td>{ ResumenC.valor_saldo}</td>
                                                    <td>{ ResumenC.porcentaje_saldo }</td>
                                                </tr>
                                            )
                                        }
                                       
                                        <tr>
                                            <td colSpan="2">TOTAL</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm small">
                                    <thead className="text-center">
                                        <tr>
                                            <th colSpan="3" rowSpan="2">DESCRIPCION</th>
                                            <th colSpan="2" rowSpan="2">PRESUPUESTO</th>
                                            <th colSpan="3">S/. valor_total_anterior</th>
                                            <th colSpan="3">S/. valor_total_actual</th>
                                            <th colSpan="3">S/. valor_suma_acumulado</th>
                                            <th colSpan="3">S/. valor_total_saldo</th>
                                        </tr>
                                        <tr>
                                            <td colSpan="3">ANTERIOR</td>
                                            <td colSpan="3">ACTUAL</td>
                                            <td colSpan="3">ACUMULADO</td>
                                            <td colSpan="3">SALDO</td>
                                        </tr>
                                        <tr>
                                            <td>ITEM</td>
                                            <td>DESCRIPCION</td>
                                            <td>METRADO</td>
                                            <td>P. U. S/.</td>
                                            <td>P. P S/.</td>
                                            <td>MET. </td>
                                            <td>VAL</td>
                                            <td>%</td>
                                            <td>MET.</td>
                                            <td>VAL</td>
                                            <td>%</td>
                                            <td>MET.</td>
                                            <td>VAL</td>
                                            <td>%</td>
                                            <td>MET.</td>
                                            <td>VAL</td>
                                            <td>%</td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            DataPartidasApi.map((partidas, Ipart)=>
                                                <tr key={ Ipart }>
                                                    <td>{ partidas.item }</td>
                                                    <td>{ partidas.descripcion }</td>
                                                    <td>{ partidas.metrado }</td>
                                                    <td>{ partidas.costo_unitario }</td>
                                                    <td>{ partidas.precio_parcial }</td>

                                                    <td>{ partidas.metrado_anterior }</td>
                                                    <td>{ partidas.valor_anterior }</td>
                                                    <td>{ partidas.porcentaje_anterior }</td>

                                                    <td>{ partidas.metrado_actual }</td>
                                                    <td>{ partidas.valor_actual }</td>
                                                    <td>{ partidas.porcentaje_actual }</td>

                                                    <td>{ partidas.metrado_total }</td>
                                                    <td>{ partidas.valor_total }</td>
                                                    <td>{ partidas.porcentaje_total }</td>

                                                    <td>{ partidas.metrado_saldo }</td>
                                                    <td>{ partidas.valor_saldo }</td>
                                                    <td>{ partidas.porcentaje_saldo }</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                                                            
                        </CardBody>
                    </Card>
                </Card>
        );
    }
}

export default ValorizacionGeneral;
import React, { Component } from 'react';
import axios from 'axios';
import { MdMoreVert, MdDone } from "react-icons/md";
import { Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col, UncontrolledPopover, PopoverBody, Spinner} from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig'

class ValPartidasNuevas extends Component {
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
            fecha_final:'',

            // montos en soles de componentes 
            soles_anterior: "",
            soles_actual: "",
            soles_acumulado:"" ,
            soles_saldo: "",

            // montos de resumen de componentes
            ppto:"",
            monto_actual:"",
            avance_anterior	:"",
            avance_actual:"",	
            avance_acumulado:"",	
            saldo:""
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
                // console.log('data PRIMERA CARGA', res.data)
                // console.log('data AÑOS', res.data)
                // console.log('data PERIODOS', res.data[0].periodos)
                // console.log('data PERIODOS >>>>>>>>>>', res.data[0].periodos[0].resumen)
                // console.log('data COMPONENTES', res.data[0].periodos[0].componentes)
                // console.log('data RESUMEN', res.data[0].periodos[0].resumen)
            
                this.setState({
                    DataAniosApi: res.data,
                    DataMesesApi:res.data[0].periodos,
                    DataComponentesApi:res.data[0].periodos[0].componentes,
                    DataResumenApi:res.data[0].periodos[0].resumen,

                    // seteamos el nombre del componente
                    NombreComponente:'RESUMEN DE VALORIZACION',

                    // capturamos montos de dinero en resumen
                    ppto:res.data[0].periodos[0].resumen.presupuesto,
                    monto_actual:res.data[0].periodos[0].resumen.valor_actual,
                    avance_anterior	:res.data[0].periodos[0].resumen.valor_anterior,
                    avance_actual:res.data[0].periodos[0].resumen.valor_actual,	
                    avance_acumulado:res.data[0].periodos[0].resumen.valor_total,	
                    saldo:res.data[0].periodos[0].resumen.valor_saldo,
                    // seteamos las fechas par ala carga por defecto
                    fecha_inicial:res.data[0].periodos[0].fecha_inicial,
                    fecha_final:res.data[0].periodos[0].fecha_final,

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
        // console.log('cero', tab,'Id componente', this.state.IdComponente ,'inicio', fechaInicial, 'fin', fechaFinal);        
        if (this.state.activeTabMes !== tab) {
            this.setState({
                activeTabMes: tab,
                fecha_inicial:fechaInicial,
                fecha_final:fechaFinal,
                NombreComponente:'RESUMEN DE VALORIZACION',
                // montos de resumen de componentes
                // ppto:"",
                // monto_actual:"",
                // avance_anterior	:"",
                // avance_actual:"",	
                // avance_acumulado:"",	
                // saldo:""
            });
        



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
                // console.log('res partidas val desde tab meses>', res.data)
                this.setState({
                    DataPartidasApi:res.data.partidas
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
                    "fecha_final": fechaFinal,
                }
            )
            .then((res)=>{
                // console.log('resumen', res.data)
                this.setState({
                    DataResumenApi:res.data,
                    // montos de resumen de componentes
                    ppto:res.data.presupuesto,
                    monto_actual:res.data.valor_actual,
                    avance_anterior	:res.data.valor_anterior,
                    avance_actual:res.data.valor_actual,	
                    avance_acumulado:res.data.valor_total,	
                    saldo:res.data.valor_saldo
                })
            })
            .catch((err)=>{
                console.log('hay erres al solicitar la peticion al api, ',err);
            })   
        }
    }
        
    }
    
    TabsComponentes(tab, id_componente, nombreComp) {
        if (this.state.activeTabComponente !== tab) {
            this.setState({
                activeTabComponente: tab,
                IdComponente:id_componente,
                NombreComponente:nombreComp,

                // montos en soles de componentes 
                soles_anterior: "",
                soles_actual: "",
                soles_acumulado:"" ,
                soles_saldo: "",
                
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
                    console.log('res partidas val', res.data)
                    this.setState({
                        DataPartidasApi:res.data.partidas,

                        // montos en soles de componentes 
                        soles_anterior: res.data.valor_anterior,
                        soles_actual: res.data.valor_actual,
                        soles_acumulado:res.data.valor_total ,
                        soles_saldo: res.data.valor_saldo,
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
            <div>
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
                    <Card className="m-1">
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
                        
                        
                        <CardHeader>{ NombreComponente}</CardHeader>
                        <CardBody>
                            {
                                activeTabComponente === "resumen"?
                                <div className="table-responsive">
                                    <table className="table table-bordered small table-sm">
                                        <thead className="resplandPartida">
                                            <tr className="text-center">
                                                <th className="align-middle" rowSpan="3">N°</th>
                                                <th className="align-middle" rowSpan="3">NOMBRE DEL COMPONENTE</th>
                                                <th>S/. { this.state.ppto }</th>
                                                <th colSpan="2">S/. {this.state.avance_anterior }</th>
                                                <th colSpan="2" >S/. {this.state.avance_actual }</th>
                                                <th colSpan="2">S/. {this.state.avance_acumulado }</th>
                                                <th colSpan="2">S/. {this.state.saldo }</th>
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
                                            { DataResumenApi.length <=0 ?<tr><td colSpan="11"></td></tr>:
                                                DataResumenApi.componentes.map((ResumenC, iC)=>
                                                    <tr key={ iC } >
                                                        <td>{ ResumenC.numero }</td>
                                                        <td>{ ResumenC.nombre } </td>
                                                        <td>{ ResumenC.presupuesto }</td>

                                                        <td>{ ResumenC.valor_anterior }</td>
                                                        <td>{ ResumenC.porcentaje_anterior }</td>
                                                        <td className="bg-mm">{ ResumenC.valor_actual }</td>
                                                        <td className="bg-mm">{ ResumenC.porcentaje_actual }</td>
                                                        <td >{ ResumenC.valor_total }</td>
                                                        <td>{ ResumenC.porcentaje_total }</td>
                                                        <td>{ ResumenC.valor_saldo}</td>
                                                        <td>{ ResumenC.porcentaje_saldo }</td>
                                                    </tr>
                                                )
                                            }
                                        
                                            <tr className="resplandPartida font-weight-bolder">
                                                <td colSpan="2">TOTAL</td>
                                                <td>S/. { this.state.ppto }</td>
                                                <td colSpan="2">S/. {this.state.avance_anterior }</td>
                                                <td colSpan="2" >S/. {this.state.avance_actual }</td>
                                                <td colSpan="2">S/. {this.state.avance_acumulado }</td>
                                                <td colSpan="2">S/. {this.state.saldo }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                :
                                <div className="table-responsive">
                                    <table className="table table-bordered table-sm small">
                                        <thead className="text-center resplandPartida">
                                            <tr>
                                                <th colSpan="3" rowSpan="2" className="align-middle">DESCRIPCION</th>
                                                <th colSpan="2" rowSpan="2" className="align-middle">PRESUPUESTO</th>
                                                <th colSpan="3">S/. {this.state.soles_anterior }</th>
                                                <th colSpan="3" >S/. {this.state.soles_actual }</th>
                                                <th colSpan="3">S/. {this.state.soles_acumulado }</th>
                                                <th colSpan="3">S/. {this.state.soles_saldo }</th>
                                            </tr>
                                            <tr>
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
                                                DataPartidasApi.map((partidas, Ipart)=>
                                                    <tr key={ Ipart } className={partidas.tipo === "titulo"?"font-weight-bold text-warning":"font-weight-light"}>
                                                        <td>{ partidas.item }</td>
                                                        <td>{ partidas.descripcion }</td>
                                                        <td>{ partidas.metrado }</td>
                                                        <td>{ partidas.costo_unitario }</td>
                                                        <td>{ partidas.precio_parcial }</td>

                                                        <td>{ partidas.metrado_anterior }</td>
                                                        <td>{ partidas.valor_anterior }</td>
                                                        <td>{ partidas.porcentaje_anterior }</td>

                                                        <td className="bg-mm">{ partidas.metrado_actual }</td>
                                                        <td className="bg-mm">{ partidas.valor_actual }</td>
                                                        <td className="bg-mm">{ partidas.porcentaje_actual }</td>

                                                        <td>{ partidas.metrado_total }</td>
                                                        <td>{ partidas.valor_total }</td>
                                                        <td>{ partidas.porcentaje_total }</td>

                                                        <td>
                                                        { partidas.metrado_saldo=== 0?<div className="text-success text-center"><MdDone size={ 20 }/></div> : 
                                                            partidas.metrado_saldo 
                                                        }
                                                        </td>
                                                        <td>
                                                            { partidas.valor_saldo===0 ? "":
                                                                partidas.valor_saldo
                                                            }
                                                        </td>
                                                        <td>
                                                            { partidas.porcentaje_saldo=== 0? "":
                                                                partidas.porcentaje_saldo   
                                                            }
                                                         </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                                                                
                            </CardBody>
                    </Card>
            </div>
        );
    }
}

export default ValPartidasNuevas;

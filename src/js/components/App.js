// libraris
import React, { Component } from 'react';
import { FaBars, FaChevronRight, FaChevronUp, FaHouseDamage, FaFile, FaPeopleCarry, FaLinode, FaSuperscript, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit, MdDehaze, MdBusiness } from "react-icons/md";

import {Spinner, Collapse, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { BrowserRouter as Router, Route, NavLink  } from "react-router-dom";
import Fullscreen from "react-full-screen";
import Circle from 'react-circle';
import { ToastContainer } from "react-toastify";

import axios from 'axios';
// app assets
import LogoSigobras from '../../images/logoSigobras.png';
import {UrlServer} from './Utils/ServerUrlConfig'

// app components
import UserNav from './Otros/UserNav';
import NotificacionNav from './Otros/NotificacionNav';
import MensajeNav from "./Otros/MensajesNav";
import Btns from './Otros/Btns'

// procesos fiscos
import Inicio from './Inicio/Inicio'
import MDdiario from "./Pfisicos/Metrados/Diarios/Diario"
import MDHistorial from './Pfisicos/Metrados/Diarios/Historial'

import Corte from './Pfisicos/Metrados/Diarios/Corte'
import ActualizacionObra from './Pfisicos/Metrados/Diarios/ActualizacionObra'
import ParalizacionObra  from './Pfisicos/Metrados/Diarios/ParalizacionObra'

import General from '../components/Pfisicos/Valorizaciones/General'

// proceso gerenciales 
import RecordObras from '../components/Pgerenciales/RecordObras/RecordObras'


// reportes 
import ReportesGenerales from './Reportes/ReportesGenerales'
import ReportValorizacionGeneral from './Reportes/Valorizaciones/ReportValorizacionGeneral'

class AppAng extends Component {
    constructor(){
        super();
        this.state = {
            navbarExpland: true,
            navbarExplandRight: false,
            isFull: false,
            collapse: 900,
            DataObra:[],
            DataMenus: []
        }

        this.ButtonToogle = this.ButtonToogle.bind(this);
        this.YearActual = this.YearActual.bind(this);
        this.collapseRight = this.collapseRight.bind(this)
        this.irFullScreen = this.irFullScreen.bind(this)
        this.CollapseMenu = this.CollapseMenu.bind(this)
        this.reenviaPeticion = this.reenviaPeticion.bind(this)
        
    }

    componentWillMount(){
        localStorage.setItem('thema', 'noche');
                axios.post(`${UrlServer}/getDatosGenerales`,{
                    id_ficha: sessionStorage.getItem('idobra')
                })
                .then((res)=>{
                    console.log('data', res.data)
                    this.setState({
                        DataObra:res.data
                    })
                })
                .catch(error=>
                    console.log(error)
                )
           


        // if (this.state.DataMenus.length === 0) {
        //     setTimeout(()=>{
                axios.post(`${UrlServer}/getMenu`,{
                    id_ficha: sessionStorage.getItem('idobra'),
                    id_acceso: sessionStorage.getItem('idacceso')
                })
                .then((res)=>{
                    // console.log('data >>>',res.data)
                    if(res.data === 'null'){
                        this.setState({
                            DataMenus:[]
                        })
                    }else{
                        this.setState({
                            DataMenus:res.data
                        })
                    }
                    
                })
                .catch(error=>
                    console.log(error)
                )
            // },500)
            
        // }
    }

    ButtonToogle(){
        this.setState({
            navbarExpland: !this.state.navbarExpland
        });
        localStorage.setItem('opcionBtnToogle', this.state.navbarExpland);

        // console.log('>>',JSON.parse( localStorage.getItem('opcionBtnToogle')));
        // console.log('>><<',this.state.navbarExpland);
    }

    YearActual(){
        var fecha = new Date();
        
        var ano = fecha.getFullYear();
        var month = fecha.getMonth()+1;
        var dt = fecha.getDate();
        return dt+ '-'+ month +'-'+ ano
    }

    collapseRight(){
        this.setState({
            navbarExplandRight: !this.state.navbarExplandRight
        });
    }

    irFullScreen(){
        this.setState({ 
            isFull: !this.state.isFull 
        });        
    }

    CollapseMenu(e) {
        let event = Number(e.target.dataset.event);
        this.setState({ collapse: this.state.collapse === event ? 900 : event });
    }

    reenviaPeticion(){
        // para reenviar peticiones a menu
        setTimeout(()=>{
        console.log('reenviaPeticion')

            axios.post(`${UrlServer}/getMenu`,{
                id_ficha: sessionStorage.getItem('idobra'),
                id_acceso: sessionStorage.getItem('idacceso')
            })
            .then((res)=>{
                // console.log('data >>>',res.data)
                if(res.data === 'null'){
                    this.setState({
                        DataMenus:[]
                    })
                }else{
                    this.setState({
                        DataMenus:res.data
                    })
                }
                
            })
            .catch(error=>
                console.log(error)
            )
            // reenvia peticion a para los circulos
            axios.post(`${UrlServer}/getDatosGenerales`,{
                id_ficha: sessionStorage.getItem('idobra')
            })
            .then((res)=>{
                console.log('data', res.data)
                this.setState({
                    DataObra:res.data
                })
            })
            .catch(error=>
                console.log(error)
            )
        },1000)
        
    }


    render() {
        var { navbarExplandRight, isFull, DataObra, DataMenus, collapse } = this.state
        return (
           
            // <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({isFull})}> 
                <Router>
                    <div>
                        {/* {sessionStorage.getItem('idobra') === null? window.location.reload(): ''} */}
                        <div>
                            <nav className="navbar fixed-top FondoBarra flex-md-nowrap p-1 border-button">
                                <span className="col-md-2 mr-0 m-0 p-0 text-light h5">
                                    <img src={LogoSigobras} className="rounded p-0 m-0" alt="logo sigobras" width="30" /> SIGOBRAS
                                    <button className="btn btn-link btn-sm m-0 p-0 float-right text-white" onClick={ this.ButtonToogle }>
                                        <MdDehaze size={20}/>
                                    </button>
                                </span>
                                <div className="clearfix d-none d-sm-block p-0 m-0">
                                    <div className="float-right"><UserNav/></div>
                                    <div className="float-right"><MensajeNav /></div>
                                    <div className="float-right"><NotificacionNav /></div>
                                    <div className="float-right"><a className="nav-link" onClick={this.irFullScreen}>{isFull === false ?<MdFullscreen size={20}/> : <MdFullscreenExit size={20}/> }</a></div>
                                    <div className="float-right"> {sessionStorage.getItem('estadoObra') === null?'':<Btns />} </div>
                                </div>
                            </nav>

                            <div className="container-fluid ">
                                <ToastContainer
                                    position="bottom-right"
                                    autoClose={1000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnVisibilityChange
                                    draggable
                                    pauseOnHover
                                />
                                <div className="row">
                                    <nav className={JSON.parse(localStorage.getItem('opcionBtnToogle')) ? 'col-md-2 navbarExplandLeft d-md-block bg-dark text-light sidebar': "navbarCollapseLeft bg-dark text-light sidebar"}>
                                        <div className="sidebar-sticky">
                                            <ul className="nav flex-column ull">
                                                
                                                <li className="lii">
                                                    <NavLink to="/inicio" activeclassname="nav-link active"  onClick={ this.CollapseMenu } data-event={ 100 }> <FaHouseDamage /><span> INICIO</span> </NavLink>
                                                </li>
                                                
                                                { DataMenus.length === 0  ? <label className="text-center text-white"> {this.reenviaPeticion()} <Spinner color="primary" size="sm" /></label>: DataMenus.map((menus, index)=>    
                                                    <li className="lii" key={ index }>
                                                        <a href="#" className="nav-link" onClick={ this.CollapseMenu } data-event={ index } activeclassname="nav-link active" ><FaSuperscript /> {menus.nombreMenu} <div className="float-right"> {collapse === index? <FaChevronUp />:<FaChevronRight /> }</div></a>
                                                        <Collapse isOpen={collapse === index}>
                                                            <ul className="nav flex-column ull">
                                                                {menus.submenus.map((subMenu, IndexSub)=>
                                                                    <li className="lii pl-3" key={ IndexSub }>
                                                                        <NavLink to={subMenu.ruta} activeclassname="nav-link active">{ subMenu.nombreMenu }</NavLink>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </Collapse>
                                                    </li> 
                                                )}

                                                <li className="lii">
                                                    <NavLink to="/ReportesGenerales" activeclassname="nav-link active"  onClick={ this.CollapseMenu } data-event={ 101 }> <FaFile /><span> REPORTES </span> </NavLink>
                                                </li>
                                                
                                            </ul>
                                            <div className="abajoCirculos pl-2 pr-2">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <Circle
                                                            animate={true} 
                                                            animationDuration="1s"
                                                            responsive={true} 
                                                            progress={DataObra.porcentaje_acumulado}
                                                            progressColor="orange"
                                                            bgColor="whitesmoke"
                                                            textColor="orange"
                                                        />   
                                                        <label className="text-center">Acumulado S/.{ DataObra.avance_acumulado }</label>
                                                    </div>
                                                    <div className="col-6">
                                                        <Circle
                                                            animate={true} 
                                                            animationDuration="1s"
                                                            responsive={true} 
                                                            progress={ DataObra.porcentaje_actual }
                                                            progressColor="cornflowerblue"
                                                            bgColor="whitesmoke"
                                                            textColor="hotpink"
                                                        />
                                                        <label className="text-center">Actual S/. {DataObra.avance_actual}</label>                                                               
                                                    </div>
                                                    
                                                </div>
                                                <br />
                                                <br />
                                                
                                                <div className="text-center">
                                                    Ayer S/. {DataObra.avance_ayer}
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </nav>
        

                                    <main role="main" className="col ml-sm-auto col-lg px-0" style={{backgroundColor: '#2e3742'}}>
                                        
                                        <div className="d-flex mb-0 border-button pt-5 p-1 text-light bg-dark m-0">
                                            <label>
                                                <b>
                                                    {/* BIENVENIDO HOY ES : {this.YearActual()} */}
                                                    { DataObra.g_meta === undefined?<label className="text-center text-white"><Spinner color="primary" size="sm" /></label>: DataObra.g_meta.toUpperCase()}
                                                </b>
                                            </label>
                                        </div>
            
                                        <div className="px-1 scroll_contenido mt-2">
                                            <Route exact path="/Inicio" component={Inicio} />

                                        {/* {DataMenus.map((menus, indesMenu)=>
                                            menus.submenus.map((submenus, indexSubmenus)=>
                                            <div key={ indexSubmenus }>
                                                <Route key={submenus.ruta} path={submenus.ruta} component={ MDdiario } />
                                            </div>
                                            )
                                        )} */}

                                            <Route path="/MDdiario" component={ MDdiario } />
                                            <Route path="/MDHistorial" component={ MDHistorial } />

                                            <Route path="/CorteObra" component={ Corte } />
                                            <Route path="/ActualizacionObra" component={ ActualizacionObra } />
                                            <Route path="/ParalizacionObra" component={ ParalizacionObra } />
                                            <Route path="/General" component={ General } />

                                            <Route path="/RecordObras" component={RecordObras} />
                                            <Route path="/ReportesGenerales" component={ ReportesGenerales } />

                                        </div>

                                    </main>

                                        <nav className={navbarExplandRight === true ? 'navbarExplandRight border-left FondoBarra' :  "navbarCollapseRight  border-left FondoBarra"} >
                                            <div className="sidebar-sticky">
                                                <div className="p-1">
                                                    <button className="btn btn-outline-warning" id="diasTrans"> Dias  </button>

                                                    <UncontrolledPopover trigger="legacy" placement="bottom" target="diasTrans">
                                                        <PopoverHeader>Tiempo de ejecución</PopoverHeader>
                                                        <PopoverBody>
                                                            <fieldset>
                                                                <legend>Dias transcurridos</legend>
                                                                { DataObra.dias_ejecutados } Dias
                                                            </fieldset>
                                                            <div className="divider"></div>
                                                            <br />
                                                            <fieldset>
                                                                <legend>Te quedan</legend>
                                                                {DataObra.dias_saldo > 0 ? 
                                                                    <div><b> { DataObra.dias_saldo } </b> Dias </div>
                                                                : 
                                                                    <div><b>oh no Te pasaste  </b><br />{ DataObra.dias_saldo } Dias </div> 
                                                                }
                                                            </fieldset>
                                                        </PopoverBody>
                                                    </UncontrolledPopover>

                                                    
                                                </div>
                                                
                                                <div>
                                                    <ReportValorizacionGeneral />
                                                </div>

                                            </div>
                                        </nav>

                                        <div className="posAbajo">
                                            <button className="btn btn-outline-dark btn-xs m-0 text-white" onClick={ this.collapseRight }> {navbarExplandRight === true ? <FaAngleRight />: <FaAngleLeft /> }</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Router>
            // </Fullscreen>
        );
    }
}
export default AppAng;

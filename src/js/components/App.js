// libraris
import React, { Component } from 'react';
import { FaChevronRight, FaChevronUp, FaHouseDamage, FaFile, FaSuperscript, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit, MdDehaze } from "react-icons/md";

import { Spinner, Collapse, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import Fullscreen from "react-full-screen";
import Circle from 'react-circle';
import { ToastContainer } from "react-toastify";

import axios from 'axios';
// app assets
import LogoSigobras from '../../images/logoSigobras.png';
import { UrlServer } from './Utils/ServerUrlConfig'

// app components
import UserNav from './Otros/UserNav';
import NotificacionNav from './Otros/NotificacionNav';
import MensajeNav from "./Otros/MensajesNav";
import Btns from './Otros/Btns'

// procesos fiscos
import Inicio from './Inicio/Inicio'
import MDdiario from "./Pfisicos/Metrados/Diarios/Diario"
import MDHistorial from './Pfisicos/Metrados/Diarios/Historial'

// import Corte from './Pfisicos/Metrados/Diarios/Corte'
// import Actualizacion from './Pfisicos/Metrados/Diarios/Actualizacion'
// import Compatibilidad from './Pfisicos/Metrados/Diarios/Compatibilidad'
import RecursosObra from './Pfisicos/Metrados/Diarios/RecursosObra'
import HistorialImagenesObra from './Pfisicos/HistorialImagenes/HistorialImagenesObra'
import Paralizacion from './Pfisicos/Metrados/Diarios/Paralizacion'

import General from '../components/Pfisicos/Valorizaciones/General'

// proceso gerenciales 
import RecordObras from '../components/Pgerenciales/RecordObras/RecordObras'

// reportes 
import ReportesGenerales from './Reportes/ReportesGenerales'

// GESTION DE TAREAS
import GestionTareas from "./GestionTareas/GestionTareas"


// PROCESOS DOCUMENTOS 
import Index from "./Pdocumentarios/Index"

class AppAng extends Component {
    constructor() {
        super();
        this.state = {
            navbarExpland: true,
            navbarExplandRight: false,
            collapse: null,
            DataObra: [],
            DataMenus: []
        }

        this.ButtonToogle = this.ButtonToogle.bind(this);
        this.collapseRight = this.collapseRight.bind(this)
        this.CollapseMenu = this.CollapseMenu.bind(this)

    }

    componentWillMount() {
        localStorage.setItem('thema', 'noche');

        axios.post(`${UrlServer}/getDatosGenerales`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
            .then((res) => {
                this.setState({
                    DataObra: res.data
                })
            })
            .catch(error =>
                console.log(error)
            )

        // CARGA DATOS DE MENU
        axios.post(`${UrlServer}/getMenu`, {
            id_ficha: sessionStorage.getItem('idobra'),
            id_acceso: sessionStorage.getItem('idacceso')
        })
            .then((res) => {

                // console.log('data >>>',res)

                if (res.data === "") {
                    this.setState({
                        DataMenus: []
                    })
                } else {
                    this.setState({
                        DataMenus: res.data
                    })
                }

            })
            .catch(error =>
                console.log(error)
            )

    }

    ButtonToogle() {
        this.setState({
            navbarExpland: !this.state.navbarExpland
        });
        localStorage.setItem('opcionBtnToogle', this.state.navbarExpland);

        // console.log('>>',JSON.parse( localStorage.getItem('opcionBtnToogle')));
        // console.log('>><<',this.state.navbarExpland);
    }


    collapseRight() {
        this.setState({
            navbarExplandRight: !this.state.navbarExplandRight
        });
    }

    CollapseMenu(e) {
        let event = Number(e);
        this.setState({ collapse: this.state.collapse !== event ? event : null });
    }

    render() {
        var { navbarExplandRight, DataObra, DataMenus, collapse } = this.state

        return (

            <Router>
                <div>
                    <nav className="navbar fixed-top FondoBarra flex-md-nowrap p-1 border-button">
                        <div>
                            <img src={LogoSigobras} className="rounded p-0 m-0" alt="logo sigobras" width="45" height="28" />
                            <span className="textSigobras h5 ml-2"> SIGOBRAS</span>
                        </div>
                        <div>
                            <span className="text-white ButtonToogleMenu" onClick={this.ButtonToogle}>
                                <MdDehaze size={20} />
                            </span>
                        </div>
                        <div className="ml-auto">
                            <div className="float-right"><UserNav /></div>

                            <div className="float-right"><MensajeNav /></div>
                            <div className="float-right"><NotificacionNav /></div>
                            <div className="float-right"> {sessionStorage.getItem('estadoObra') === null ? '' : <Btns />} </div>

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
                            <nav className={JSON.parse(localStorage.getItem('opcionBtnToogle')) ? 'navbarExplandLeft sidebar' : "navbarCollapseLeft sidebar"}>
                                <div className="sidebar-sticky">
                                    <ul className="nav flex-column ull">

                                        <li className="lii">
                                            <NavLink to="/inicio" activeclassname="nav-link"> <span> INICIO</span> </NavLink>
                                        </li>
                                        {/* {
                                                console.log("DataMenus", DataMenus.length)
                                            } */}
                                        {
                                            DataMenus.length === undefined ? <div className="text-center text-white"> <Spinner color="primary" type="grow" /></div> :

                                                DataMenus.map((menus, index) =>
                                                    <li className="lii ml-2" key={index}>
                                                        <span className="nav-link" onClick={() => this.CollapseMenu(index)} activeclassname="active" >  {menus.nombreMenu} <div className="float-right"> {collapse === index ? <FaChevronUp /> : <FaChevronRight />}</div></span>
                                                        <Collapse isOpen={collapse === index}>
                                                            <ul className="nav flex-column ull ">
                                                                {menus.submenus.map((subMenu, IndexSub) =>
                                                                    <li className="lii pl-3" key={IndexSub}>
                                                                        <NavLink to={subMenu.ruta} activeclassname="nav-link">{subMenu.nombreMenu}</NavLink>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </Collapse>
                                                    </li>
                                                )
                                        }

                                        <li className="lii">
                                            <NavLink to="/ReportesGenerales" activeclassname="nav-link" > <span> REPORTES </span> </NavLink>
                                        </li>

                                        <li className="lii">
                                            <NavLink to="/GestionTareas" activeclassname="nav-link" > <span> GESTIÓN DE TAREAS </span> </NavLink>
                                        </li>

                                        {/* <li className="lii ml-2">
                                                <span className="nav-link" onClick={()=>this.CollapseMenu(100)} activeclassname="active" >  PROCESOS DOCUMENTARIOS <div className="float-right"> {collapse === 100 ? <FaChevronUp /> : <FaChevronRight />}</div></span>
                                                <Collapse isOpen={collapse === 100}>
                                                    <ul className="nav flex-column ull ">
                                                        <li className="lii pl-3">
                                                            <NavLink to="/DOCUEMENTOS" activeclassname="nav-link"> DOCUMENTOS </NavLink>
                                                        </li>
                                                    </ul>
                                                </Collapse>
                                            </li> */}

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
                                                <label className="text-center">Acumulado S/.{DataObra.avance_acumulado}</label>
                                            </div>
                                            <div className="col-6">
                                                <Circle
                                                    animate={true}
                                                    animationDuration="1s"
                                                    responsive={true}
                                                    progress={DataObra.porcentaje_actual}
                                                    progressColor="##f5f5f5"
                                                    bgColor="whitesmoke"
                                                    textColor="##f5f5f5"
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


                            <main role="main" className="col ml-sm-auto col-lg px-0">

                                <div className="d-flex mb-0 border-button pt-5 p-1 m-0">
                                    <div>
                                        <b>
                                            {DataObra.g_meta === undefined ?
                                                <label className="text-center "><Spinner color="primary" type="grow" /></label> :
                                                DataObra.g_meta.toUpperCase()}
                                        </b>
                                    </div>
                                </div>

                                <div className="px-1 scroll_contenido mt-2">


                                    <Switch>
                                        <Route exact path="/Inicio" component={Inicio} />

                                        <Route path="/MDdiario" component={MDdiario} />
                                        <Route path="/MDHistorial" component={MDHistorial} />

                                        {/* <Route path="/CorteObra" component={Corte} />
                                            <Route path="/ActualizacionObra" component={Actualizacion} /> */}
                                        {/* <Route path="/CompatibilidadObra" component={Compatibilidad} /> */}
                                        <Route path="/ParalizacionObra" component={Paralizacion} />
                                        <Route path="/RecursosObra" component={RecursosObra} />
                                        <Route path="/HistorialImagenesObra" component={HistorialImagenesObra} />

                                        <Route path="/General" component={General} />

                                        <Route path="/RecordObras" component={RecordObras} />
                                        <Route path="/ReportesGenerales" component={ReportesGenerales} />

                                        {/* Gestion de Tareas */}
                                        <Route path="/GestionTareas" component={GestionTareas} />

                                        {/* PROCESOS DOCUMENTARIOS */}
                                        <Route path="/DOCUEMENTOS" component={Index} />

                                    </Switch>
                                </div>

                            </main>

                            <nav className={navbarExplandRight === true ? 'navbarExplandRight border-left FondoBarra' : "navbarCollapseRight  border-left FondoBarra"} >
                                <div className="sidebar-sticky">
                                    <div className="p-1">
                                        <button className="btn btn-outline-warning" id="diasTrans"> Dias  </button>

                                        <UncontrolledPopover trigger="legacy" placement="bottom" target="diasTrans">
                                            <PopoverHeader>Tiempo de ejecución</PopoverHeader>
                                            <PopoverBody>
                                                <fieldset>
                                                    <legend>Dias transcurridos</legend>
                                                    {DataObra.dias_ejecutados} Dias
                                                        </fieldset>
                                                <div className="divider"></div>
                                                <br />
                                                <fieldset>
                                                    <legend>Te quedan</legend>
                                                    {DataObra.dias_saldo > 0 ?
                                                        <div><b> {DataObra.dias_saldo} </b> Dias </div>
                                                        :
                                                        <div><b>oh no Te pasaste  </b><br />{DataObra.dias_saldo} Dias </div>
                                                    }
                                                </fieldset>
                                            </PopoverBody>
                                        </UncontrolledPopover>


                                    </div>

                                </div>
                            </nav>

                            <div className="posAbajo">
                                <button className="btn btn-outline-dark btn-xs m-0 text-white" onClick={this.collapseRight}> {navbarExplandRight === true ? <FaAngleRight /> : <FaAngleLeft />}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}
export default AppAng;

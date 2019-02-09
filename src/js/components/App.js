// libraris
import React, { Component } from 'react';
import { FaAlignJustify, FaPlus, FaChartLine, FaHouseDamage, FaInfinity, FaPeopleCarry, FaLinode, FaSuperscript, FaAngleRight } from 'react-icons/fa';
import { UncontrolledCollapse } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// app assets
import LogoSigobras from '../../images/logoSigobras.png';

// app components
import UserNav from './Otros/UserNav';
import NotificacionNav from './Otros/NotificacionNav';
import MensajeNav from "./Otros/MensajesNav";
import Login from './Login/Login';
import Inicio from '../components/Inicio/Inicio'
import MDdiario from "../components/Pfisicos/Metrados/Diarios/Diario";
import MDHistorial from '../components/Pfisicos/Metrados/Diarios/Historial'
// import ValEjecutadas from '../components/Pfisicos/Valorizaciones/ValEjecutadas'
// import ValGeneral from '../components/Pfisicos/Valorizaciones/ValGeneral'
// Proceso financieros
// import PresAnalitico from '../components/Pfinancieros/Analitico/PresAnalitico'
// import ListRegistrosAnalitico from '../components/Pfinancieros/Analitico/ListRegistrosAnalitico'
  
// proceso gerenciales 
import RecordObras from '../components/Pgerenciales/RecordObras/RecordObras'
class AppAng extends Component {
    constructor(){
        super();
        this.state = {
            navbarExpland: true
        }

        this.ButtonToogle = this.ButtonToogle.bind(this);
        this.YearActual = this.YearActual.bind(this);
        
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

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0 shadow">
                        <span className="navbar-brand col-sm-3 col-md-2 mr-0">
                            <img src={LogoSigobras} className="rounded p-0 m-0" alt="logo sigobras" width="30" /> SIGOBRAS
                            <button className="btn btn-link btn-sm m-0 p-0 float-right text-white" onClick={ this.ButtonToogle }>
                            <FaAlignJustify />
                            </button>
                        </span>
                        <div className="clearfix d-none d-sm-block p-0 m-0">
                            <div className="float-right"><UserNav/></div>
                            <div className="float-right"><MensajeNav /></div>
                            <div className="float-right"><NotificacionNav /></div>
                        </div>
                    </nav>

                    <div className="container-fluid">
                        <div className="row">
                            <nav className={JSON.parse(localStorage.getItem('opcionBtnToogle')) ? 'col-md-2 navbarExpland d-none d-md-block bg-light sidebar': "navbarCollapse bg-light sidebar"}>
                                <div className="sidebar-sticky">
                                    <ul className="nav flex-column ull">
                                        <li className="lii border-top">
                                            <Link to="/inicio" className="nav-link"> <FaHouseDamage /><span> INICIO</span> </Link>
                                        </li>

                                        <li className="lii">
                                            <a className="nav-link"  href="#ADMINS" id="ADMINS"><FaSuperscript /><span> METRADOS <div className="float-right"><FaPlus /></div> </span> </a>
                                            <UncontrolledCollapse toggler="#ADMINS">
                                                <ul className="nav flex-column ull">
                                                    <li className="lii">
                                                        <Link to="MDdiario" className="nav-link"><FaPeopleCarry /> Diarios</Link>
                                                    </li>
                                                </ul>
                                            </UncontrolledCollapse>
                                        </li>      
                                    </ul>
                                </div>
                            </nav>

                            <main role="main" className="col ml-sm-auto col-lg px-2">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                    <h6 className="">
                                        BIENVENIDO HOY ES : {this.YearActual()}
                                    </h6>
                                    <div className="btn-toolbar mb-2 mb-md-0">
                                        <div className="btn-group mr-2">
                                            <button type="button" className="btn btn-sm btn-outline-secondary">Exportar</button>
                                            <button type="button" className="btn btn-sm btn-outline-secondary">PDF</button>
                                        </div>
                                        <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                                            <span data-feather="calendar"></span>
                                            OPCIONES
                                        </button>
                                    </div>
                                </div>

                                <div className="px-1 table-responsive">
                                    <Route exact path="/" component={Login} />
                                    <Route path="/Ingreso" component={Login} />
                                    <Route path ="/inicio" component={Inicio} />

                                    {/* procesos fisicos */}
                                    <Route path="/MDdiario" component={MDdiario} />
                                    <Route path="/MDHistorial" component={MDHistorial} />
                                    {/* <Route path="/ValEjecutadas" component={ValEjecutadas} /> */}
                                    {/* <Route path="/ValGeneral" component={ValGeneral} /> */}

                                    {/* proceso financieros */}
                                    {/* <Route path="/PresAnalitico" component={PresAnalitico} />
                                    <Route path="/ListRegistrosAnalitico" component={ListRegistrosAnalitico} /> */}
                                    {/* procesos gerenciales */}
                                    <Route path="/RecordObras" component={RecordObras} />

                                </div>

                            </main>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}
export default AppAng;

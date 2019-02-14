// libraris
import React, { Component } from 'react';
import { FaAlignJustify, FaPlus, FaChartLine, FaHouseDamage, FaInfinity, FaPeopleCarry, FaLinode, FaSuperscript, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
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
import Ejecutadas from '../components/Pfisicos/Valorizaciones/Ejecutadas'
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
            navbarExpland: true,
            navbarExplandRight: true
        }

        this.ButtonToogle = this.ButtonToogle.bind(this);
        this.YearActual = this.YearActual.bind(this);
        this.collapseRight = this.collapseRight.bind(this)
        
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
    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0">
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
                            <nav className={JSON.parse(localStorage.getItem('opcionBtnToogle')) ? 'col-md-2 navbarExplandLeft d-md-block bg-light sidebar': "navbarCollapseLeft bg-light sidebar"}>
                                <div className="sidebar-sticky">
                                    <ul className="nav flex-column ull">
                                        <li className="lii border-top">
                                            <Link to="/inicio" className="nav-link"> <FaHouseDamage /><span> INICIO</span> </Link>
                                        </li>
                                        
                                        <li className="lii">
                                            <a className="nav-link"  href="#PF" id="PF"><FaSuperscript /> PROCESOS FISICOS <div className="float-right"><FaPlus /></div></a>
                                            <UncontrolledCollapse toggler="#PF">
                                                <a className="nav-link"  href="#METRADOS" id="METRADOS"><FaSuperscript /> METRADOS <div className="float-right"><FaPlus /></div></a>
                                                <UncontrolledCollapse toggler="#METRADOS">
                                                    <ul className="nav flex-column ull">
                                                        <li className="lii">
                                                            <Link to="MDdiario" className="nav-link"><FaPeopleCarry /> Diarios</Link>
                                                        </li>
                                                        <li className="lii">
                                                            <Link to="MDHistorial" className="nav-link"><FaPeopleCarry /> Historial</Link>
                                                        </li>
                                                    </ul>
                                                </UncontrolledCollapse>

                                                <a className="nav-link"  href="#VALORI" id="VALORI"><FaSuperscript /> VALORIZACIONES <div className="float-right"><FaPlus /></div></a>
                                                <UncontrolledCollapse toggler="#VALORI">
                                                    <ul className="nav flex-column ull">
                                                        <li className="lii">
                                                            <Link to="Ejecutadas" className="nav-link"><FaPeopleCarry /> Ejecutadas</Link>
                                                        </li>
                                                        <li className="lii">
                                                            <Link to="MDHistorial" className="nav-link"><FaPeopleCarry /> General</Link>
                                                        </li>
                                                    </ul>
                                                </UncontrolledCollapse>

                                            </UncontrolledCollapse>

                                            
                                        </li>      
                                    </ul>
                                </div>
                            </nav>

                            <main role="main" className="col ml-sm-auto col-lg px-0">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center  pb-2 mb-1 border-bottom p-2 bg-light">
                                    <h6 className="">
                                        BIENVENIDO HOY ES : {this.YearActual()}
                                    </h6>
                                </div>

                                <div className="px-1 scroll_contenido">
                                    <Route exact path="/" component={Login} />
                                    <Route path="/Ingreso" component={Login} />
                                    <Route path ="/inicio" component={Inicio} />

                                    {/* procesos fisicos */}
                                    <Route path="/MDdiario" component={MDdiario} />
                                    <Route path="/MDHistorial" component={MDHistorial} />
                                    <Route path="/Ejecutadas" component={Ejecutadas} />
                                    {/* <Route path="/ValGeneral" component={ValGeneral} /> */}

                                    {/* proceso financieros */}
                                    {/* <Route path="/PresAnalitico" component={PresAnalitico} />
                                    <Route path="/ListRegistrosAnalitico" component={ListRegistrosAnalitico} /> */}
                                    {/* procesos gerenciales */}
                                    <Route path="/RecordObras" component={RecordObras} />

                                </div>

                            </main>
                            <nav className={this.state.navbarExplandRight === true ? 'navbarExplandRight bg-light border-left' :  " navbarCollapseRight  bg-light border-left"} >
                                {/* " navbarCollapseRight  bg-light border-left" */}
                                <div className="sidebar-sticky">
                                    <div className="p-1">
                                        interfaz de algo
                                    </div>
                                    
                                </div>
                            </nav>
                            <div className="posAbajo">
                                <button className="btn btn-outline-darck btn-xs m-0" onClick={ this.collapseRight }> {this.state.navbarExplandRight === true ? <FaAngleRight />: <FaAngleLeft /> }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}
export default AppAng;

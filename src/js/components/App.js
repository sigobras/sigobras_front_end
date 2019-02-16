// libraris
import React, { Component } from 'react';
import { FaBars, FaPlus, FaChartLine, FaHouseDamage, FaInfinity, FaPeopleCarry, FaLinode, FaSuperscript, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit, MdDehaze } from "react-icons/md";

import { UncontrolledCollapse } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Fullscreen from "react-full-screen";

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
import General from '../components/Pfisicos/Valorizaciones/General'
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
            navbarExplandRight: true,
            isFull: false,
        }

        this.ButtonToogle = this.ButtonToogle.bind(this);
        this.YearActual = this.YearActual.bind(this);
        this.collapseRight = this.collapseRight.bind(this)
        this.irFullScreen = this.irFullScreen.bind(this)
        
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
    render() {
        const{ navbarExplandRight, isFull } = this.state
        return (
           
            <Fullscreen
                    enabled={this.state.isFull}
                    onChange={isFull => this.setState({isFull})}
                    > <Router>
                <div>
                    <nav className="navbar fixed-top FondoBarra flex-md-nowrap p-2 border-button">
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
                        </div>
                    </nav>

                    <div className="container-fluid ">
                        <div className="row">
                            <nav className={JSON.parse(localStorage.getItem('opcionBtnToogle')) ? 'col-md-2 navbarExplandLeft d-md-block bg-dark text-light sidebar': "navbarCollapseLeft bg-dark text-light sidebar"}>
                                <div className="sidebar-sticky">
                                    <ul className="nav flex-column ull">
                                        <li className="lii">
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
                                                            <Link to="General" className="nav-link"><FaPeopleCarry /> General</Link>
                                                        </li>
                                                    </ul>
                                                </UncontrolledCollapse>

                                            </UncontrolledCollapse>

                                            
                                        </li>      
                                    </ul>
                                </div>
                            </nav>

                            <main role="main" className="col ml-sm-auto col-lg px-0" style={{backgroundColor: '#2e3742'}}>
                                <div className="d-flex  mb-1 border-button pt-3 p-2 text-light bg-dark m-0">
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
                                    <Route path="/General" component={General} />
                                    {/* <Route path="/ValGeneral" component={ValGeneral} /> */}

                                    {/* proceso financieros */}
                                    {/* <Route path="/PresAnalitico" component={PresAnalitico} />
                                    <Route path="/ListRegistrosAnalitico" component={ListRegistrosAnalitico} /> */}
                                    {/* procesos gerenciales */}
                                    <Route path="/RecordObras" component={RecordObras} />

                                </div>

                            </main>
                            <nav className={navbarExplandRight === true ? 'navbarExplandRight border-left FondoBarra' :  " navbarCollapseRight  border-left FondoBarra"} >
                                {/* " navbarCollapseRight  bg-light border-left" */}
                                <div className="sidebar-sticky">
                                    <div className="p-1">
                                       <button className="btn btn-outline-warning"><FaChartLine /> </button>
                                       
                                    </div>
                                    
                                </div>
                            </nav>
                            <div className="posAbajo">
                                <button className="btn btn-outline-dark btn-xs m-0 text-white" onClick={ this.collapseRight }> {navbarExplandRight === true ? <FaAngleRight />: <FaAngleLeft /> }</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </Router></Fullscreen>
        );
    }
}
export default AppAng;

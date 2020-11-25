// libraris
import React, { Component, useState, useEffect } from 'react';
import { FaChevronRight, FaChevronUp, FaHouseDamage, FaFile, FaSuperscript, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit, MdDehaze } from "react-icons/md";

import { Spinner, Collapse, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
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

import RecursosObra from './Pfisicos/Metrados/Diarios/RecursosObra'
import HistorialImagenesObra from './Pfisicos/HistorialImagenes/HistorialImagenesObra'
import Paralizacion from './Pfisicos/Metrados/Diarios/Paralizacion'

import General from '../components/Pfisicos/Valorizaciones/General'

// proceso gerenciales 
import InterfazGerencial from './Inicio2/InterfazGerencial'
import Comunicados from '../components/Pgerenciales/Comunicados/comunicados'
import RecursosMo from '../components/Pgerenciales/Recursos/RecursosPersonal'
import plazosHistorial from '../components/Pgerenciales/PlazosHistorial/Plazos'
//planificacion
import Planner from '../components/Pgerenciales/Planner/planner'
// reportes 
import ReportesGenerales from './Reportes/ReportesGenerales'

// GESTION DE TAREAS
import GestionTareas from "./GestionTareas/GestionTareas"


// PROCESOS DOCUMENTOS 
import Index from "./Pdocumentarios/Index"
import { Redondea } from './Utils/Funciones';
export default () => {

    useEffect(() => {
        if (sessionStorage.getItem("idobra") != null) {
            fetchDatosGenerales(sessionStorage.getItem("idobra"))
            fetchMenu(sessionStorage.getItem("idobra"))
            fetchPresupuestoCostoDirecto(sessionStorage.getItem("idobra"))
            fetchDataDelta(sessionStorage.getItem("idobra"))
            fetchEstadoObra(sessionStorage.getItem("idobra"))
        }
    }, []);
    const [DataObra, setDataObra] = useState([]);
    async function fetchDatosGenerales(id_ficha) {
        console.log("datos generales");
        var res = await axios.post(`${UrlServer}/getDatosGenerales2`, {
            id_ficha
        })
        setDataObra(res.data)
    }
    const [CostoDirecto, setCostoDirecto] = useState([]);
    async function fetchPresupuestoCostoDirecto(id_ficha) {
        var res = await axios.post(`${UrlServer}/getPresupuestoCostoDirecto`, {
            id_ficha
        })
        setCostoDirecto(res.data.monto)
    }
    const [DataMenus, setDataMenus] = useState([]);
    async function fetchMenu(id_ficha) {
        var res = await axios.post(`${UrlServer}/getMenu`, {
            id_ficha,
            id_acceso: sessionStorage.getItem('idacceso')
        })
        console.log("fetchMenu", res.data);
        setDataMenus(res.data)
    }
    const [DataDelta, setDataDelta] = useState({ ejecutado_monto: 1, programado_monto: 1 });
    async function fetchDataDelta(id_ficha) {
        var res = await axios.post(`${UrlServer}/getUltimoEjecutadoCurvaS`, {
            id_ficha
        })
        setDataDelta(res.data)
    }
    const [navbarExpland, setnavbarExpland] = useState(false);
    function ButtonToogle() {
        setnavbarExpland(!navbarExpland)
        localStorage.setItem('opcionBtnToogle', navbarExpland);
    }
    const [collapse, setcollapse] = useState([]);
    function CollapseMenu(e) {
        let event = Number(e);
        setcollapse(collapse !== event ? event : null)
    }
    const [EstadoObra, setEstadoObra] = useState("")
    async function fetchEstadoObra(id_ficha) {
        var request = await axios.post(`${UrlServer}/getEstadoObra`, {
            id_ficha: id_ficha
        })
        setEstadoObra(request.data.nombre)
        sessionStorage.setItem("estadoObra", request.data.nombre);
    }
    async function recargar(ficha) {
        await sessionStorage.setItem("idobra", ficha.id_ficha);
        await sessionStorage.setItem("codigoObra", ficha.codigo);
        fetchDatosGenerales(sessionStorage.getItem("idobra"))
        fetchMenu(sessionStorage.getItem("idobra"))
        fetchPresupuestoCostoDirecto(sessionStorage.getItem("idobra"))
        fetchDataDelta(sessionStorage.getItem("idobra"))
        fetchEstadoObra(sessionStorage.getItem("idobra"))
    }

    return (
        <Router>
            <div>
                <nav className="navbar fixed-top FondoBarra flex-md-nowrap p-1 border-button">
                    <div>
                        <img src={LogoSigobras} className="rounded p-0 m-0" alt="logo sigobras" width="45" height="28" />
                        <span className="textSigobras h5 ml-2"> SIGOBRAS </span>
                        <i className="small"> V. 1.0</i>
                    </div>
                    <div>
                        <span className="text-white ButtonToogleMenu" onClick={ButtonToogle}>
                            <MdDehaze size={20} />
                        </span>
                    </div>
                    <div className="ml-auto">
                        <div className="float-right"><UserNav /></div>
                        <div className="float-right"><MensajeNav /></div>
                        <div className="float-right"><NotificacionNav /></div>
                        <div className="float-right"> {sessionStorage.getItem('estadoObra') != null && <Btns EstadoObra={EstadoObra} />} </div>
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
                        <nav
                            className={JSON.parse(localStorage.getItem('opcionBtnToogle')) ? 'navbarExplandLeft sidebar' : "navbarCollapseLeft sidebar"}
                        >
                            <div className="sidebar-sticky">
                                <ul className="nav flex-column ull">

                                    <li className="lii">
                                        <NavLink to="/inicio" activeclassname="nav-link"> <span> INICIO</span> </NavLink>
                                    </li>

                                    {
                                        DataMenus.map((menus, index) =>
                                            <li className="lii" key={index}>
                                                <a
                                                    href="#"
                                                    className="nav-link"
                                                    onClick={() => CollapseMenu(index)}
                                                >
                                                    {menus.nombreMenu}
                                                    <div className="float-right">
                                                        {collapse === index ? <FaChevronUp /> : <FaChevronRight />}
                                                    </div>
                                                </a>
                                                <Collapse isOpen={collapse === index}>
                                                    <ul className="nav flex-column ull ">
                                                        {menus.submenus.map((subMenu, IndexSub) =>
                                                            <li className="lii pl-3"
                                                                key={IndexSub}
                                                            >
                                                                <NavLink
                                                                    to={subMenu.ruta}
                                                                    activeclassname="nav-link"
                                                                >
                                                                    {subMenu.nombreMenu}
                                                                </NavLink>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </Collapse>
                                            </li>
                                        )
                                    }
                                    {DataMenus.length > 0 &&
                                        <li className="lii">
                                            <NavLink to="/ReportesGenerales" activeclassname="nav-link" > <span> REPORTES </span> </NavLink>
                                        </li>
                                    }
                                </ul>
                                <div className="detallesObra pl-2 pr-2"
                                    style={{
                                        paddingBottom: "15px"
                                    }}
                                >
                                    <div className="codigoObra">{DataObra.codigo}</div>
                                    <div className="ContentpresupuestoObra">
                                        <div className="PresuObra mr-2"> TOTAL S/. {Redondea(DataObra.g_total_presu)}</div>
                                        <div className="PresuObra"> CD . S/. {Redondea(CostoDirecto)}</div>
                                    </div>

                                </div>
                                <div className="abajoCirculos pl-2 pr-2"
                                    style={{
                                        paddingTop: "5px",
                                    }}
                                >
                                    <div className="row">
                                        <div className="col-12"
                                            style={{
                                                height: "83px"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    height: "83px"
                                                }}
                                            >
                                                <Circle
                                                    animate={true}
                                                    animationDuration="1s"
                                                    responsive={true}
                                                    progress={Redondea(DataDelta.ejecutado_monto / DataDelta.programado_monto * 100)}
                                                    progressColor="orange"
                                                    bgColor="whitesmoke"
                                                    textColor="orange"
                                                />
                                                <label className="text-center">DELTA</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="detallesObra pl-2 pr-2">
                                    <div className="ContentpresupuestoObra"
                                        style={{
                                            paddingTop: "5px",
                                            color: " #101010",
                                            fontWeight: "600",
                                        }}
                                    >
                                        <div
                                            className="PresuObra mr-2"
                                            style={{
                                                background: "orange",
                                            }}
                                        >PROGRAMADO {Redondea(DataDelta.programado_monto)}</div>
                                        <div
                                            className="PresuObra"
                                            style={{
                                                background: "orange",
                                            }}
                                        > EJECUTADO {Redondea(DataDelta.ejecutado_monto)}</div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                        <main role="main" className="col ml-sm-auto col-lg px-0">
                            <div className="d-flex mb-0 border-button pt-5 p-1 m-0">
                                <div>
                                    <b>
                                        {DataObra.g_meta &&
                                            DataObra.g_meta.toUpperCase()}
                                    </b>
                                </div>
                            </div>
                            <div className="scroll_contenido">
                                <Switch>
                                    <Redirect exact from="/" to="Inicio" />
                                    <Route path="/Inicio" component={() => <Inicio recargar={recargar} />} />
                                    <Route path="/MDdiario" component={MDdiario} />
                                    <Route path="/MDHistorial" component={MDHistorial} />
                                    <Redirect exact from="/ParalizacionObra" to="MDdiario" />
                                    <Route path="/ParalizacionObra" component={Paralizacion} />
                                    <Route path="/RecursosObra" component={RecursosObra} />
                                    <Route path="/HistorialImagenesObra" component={HistorialImagenesObra} />
                                    <Route path="/General" component={General} />
                                    {/* PROCESOS GERENCIALES            */}
                                    <Route path="/InterfazGerencial" component={InterfazGerencial} />
                                    <Route path="/ReportesGenerales" component={ReportesGenerales} />
                                    <Route path="/planner" component={Planner} />
                                    <Route path="/comunicados" component={Comunicados} />
                                    <Route path="/recursosmanodeobra" component={RecursosMo} />
                                    <Route path="/plazosHistorial" component={plazosHistorial} />
                                    {/* Gestion de Tareas */}
                                    <Route path="/GestionTareas" component={GestionTareas} />
                                    {/* PROCESOS DOCUMENTARIOS */}
                                    <Route path="/DOCUEMENTOS" component={Index} />
                                </Switch>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </Router>
    );
}


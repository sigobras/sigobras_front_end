// libraris
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { MdDehaze } from "react-icons/md";

import { Collapse } from 'reactstrap';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
import Circle from 'react-circle';
import { ToastContainer } from "react-toastify";

import axios from 'axios';
import { Redondea, meses, Redondea1 } from './Utils/Funciones';
import FinancieroBarraPorcentaje from './Inicio/FinancieroBarraPorcentaje';
import FisicoBarraPorcentaje from './Inicio/FisicoBarraPorcentaje';
// app assets
import LogoSigobras from '../../images/logoSigobras.png';
import { UrlServer } from './Utils/ServerUrlConfig'

// app components
import UserNav from './Otros/UserNav';
import NotificacionNav from './Otros/NotificacionNav';
import MensajeNav from "./Otros/MensajesNav";
import Btns from './Otros/Btns'

// procesos fiscos
const Inicio = lazy(() => import('./Inicio/Inicio'));
const MDdiario = lazy(() => import('./Pfisicos/Diarios/Diario'));
const MDHistorial = lazy(() => import('./Pfisicos/HistorialMetrados/Historial'))
const RecursosObra = lazy(() => import('./Pfisicos/Recursos/RecursosObra'))
const HistorialImagenesObra = lazy(() => import('./Pfisicos/HistorialImagenes/HistorialImagenesObra'))
const General = lazy(() => import('../components/Pfisicos/Valorizaciones/General'))
// const Valorizaciones2 = lazy(() => import( './Pfisicos/Valorizaciones/Valorizaciones2'))
// proceso gerenciales 
const InterfazGerencial = lazy(() => import('./Inicio2/InterfazGerencial'))
const Comunicados = lazy(() => import('../components/Pgerenciales/Comunicados/comunicados'))
const RecursosMo = lazy(() => import('../components/Pgerenciales/Recursos/RecursosPersonal'))
const plazosHistorial = lazy(() => import('../components/Pgerenciales/PlazosHistorial/Plazos'))
//planificacion
const Planner = lazy(() => import('../components/Pgerenciales/Planner/planner'))
// reportes 
const ReportesGenerales = lazy(() => import('./Reportes/ReportesGenerales'))

// GESTION DE TAREAS
const GestionTareas = lazy(() => import("./GestionTareas/GestionTareas"))
//PROYECTOS
const Proyectos = lazy(() => import("./Proyectos/index"))
// PROCESOS DOCUMENTOS 
const Index = lazy(() => import("./Pdocumentarios/Index"))
const GestionDocumentaria = lazy(() => import("./GestionDocumentaria/index"))
//COSTOS INDIRECTOS
const CostosIndirectos = lazy(() => import("./CostosIndirectos/index"))
const SeguimientoObras = lazy(() => import("./SeguimientoObras/index"))


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
        var res = await axios.post(`${UrlServer}/getMenu2`, {
            id_ficha,
            id_acceso: sessionStorage.getItem('idacceso')
        })
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
    const [collapse, setcollapse] = useState(-1);
    function CollapseMenu(index) {
        setcollapse(index != collapse ? index : -1)
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
        setDataObra(ficha)
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
                        <div className="float-right"><NotificacionNav key={DataObra.id_ficha} /></div>
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
                                        [
                                            <li className="lii" key="1">
                                                <NavLink to="/ReportesGenerales" activeclassname="nav-link" > <span> REPORTES </span> </NavLink>
                                            </li>,
                                            <li className="lii" key="2">
                                                <NavLink to="/GestionDocumentaria" activeclassname="nav-link" > <span> GESTION DOCUMENTARIA </span> </NavLink>
                                            </li>,
                                            <li className="lii" key="3">
                                                <NavLink to="/CostosIndirectos" activeclassname="nav-link" > <span> COSTOS INDIRECTOS </span> </NavLink>
                                            </li>
                                        ]
                                    }
                                </ul>

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
                                                    progress={Redondea1(DataDelta.ejecutado_monto / DataDelta.programado_monto * 100)||0}
                                                    progressColor="orange"
                                                    bgColor="whitesmoke"
                                                    textColor="orange"
                                                />
                                                <label className="text-center">DELTA {meses[DataDelta.mes - 1] && meses[DataDelta.mes - 1].toUpperCase()}</label>
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
                                {
                                    DataObra.id_ficha &&
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            marginLeft: "8px",
                                            marginRight: "8px",
                                        }}
                                    >
                                        <  FisicoBarraPorcentaje key={DataObra.id_ficha} id_ficha={DataObra.id_ficha} />
                                    </div>
                                }

                                <div
                                    style={{
                                        marginTop: "10px",
                                        marginLeft: "8px",
                                        marginRight: "8px",
                                    }}
                                >
                                    <FinancieroBarraPorcentaje key={DataObra.id_ficha} id_ficha={DataObra.id_ficha} />
                                </div>
                                <div className="detallesObra pl-2 pr-2"
                                    style={{
                                        paddingBottom: "15px"
                                    }}
                                >
                                    <div className="ContentpresupuestoObra">
                                        <div className="PresuObra mr-2"> TOTAL S/. {Redondea(DataObra.g_total_presu)}</div>
                                        <div className="PresuObra"> CD . S/. {Redondea(CostoDirecto)}</div>
                                    </div>

                                </div>
                            </div>
                        </nav>
                        <main role="main" className="col ml-sm-auto col-lg px-0">
                            <div className="d-flex mb-0 border-button pt-5 p-1 m-0">
                                <div>
                                    <b>
                                        {DataObra.g_meta &&
                                            DataObra.codigo + " - " + DataObra.g_meta.toUpperCase()}
                                    </b>
                                </div>
                            </div>
                            <div className="scroll_contenido">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Switch>
                                        <Redirect exact from="/" to="Inicio" />
                                        <Route path="/Inicio"
                                            render={(props) => (
                                                <Inicio {...props} recargar={recargar} />
                                            )}
                                        />
                                        <Route path="/MDdiario" component={MDdiario} />
                                        <Route path="/MDHistorial" component={MDHistorial} />
                                        <Redirect exact from="/ParalizacionObra" to="MDdiario" />
                                        <Route path="/RecursosObra" component={RecursosObra} />
                                        <Route path="/HistorialImagenesObra" component={HistorialImagenesObra} />
                                        <Route path="/General" component={General} />
                                        {/* <Route path="/Valorizaciones2" component={Valorizaciones2} /> */}
                                        <Route path="/Proyectos" component={Proyectos} />
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
                                        <Route path="/GestionDocumentaria" component={GestionDocumentaria} />
                                        <Route path="/CostosIndirectos" component={CostosIndirectos} />
                                        <Route path="/SeguimientoObras" component={SeguimientoObras} />

                                    </Switch>
                                </Suspense>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </Router>
    );
}


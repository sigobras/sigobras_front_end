import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea, mesesShort, fechaFormatoClasico } from '../Utils/Funciones';
import { Button, Input, Tooltip } from 'reactstrap';
export default () => {
    useEffect(() => {
        fetchProyectos()
    }, [])
    const [Proyectos, setProyectos] = useState([])
    async function fetchProyectos() {
        const res = await axios.get(`${UrlServer}/proyectos`)
        setProyectos(res.data)
    }
    return (
        <div
            style={{
                // overflowX: "auto",
                // overflowY: "auto",
                // height: "600px"
            }}
        >
            <table className="table">
                <thead>
                    <tr
                        style={{
                            textAlign: "center"
                        }}
                    >
                        <th>Nro</th>
                        <th
                            style={{
                                width: "20%"
                            }}
                        >PROYECTO</th>
                        <th>Informacion General del PIP y Responsables de Elab. Exp. Tec. </th>
                        <th>Datos del Plan de Trabajo </th>
                        <th>Plazo de Ejecucion </th>
                        <th>Avance Fisico </th>
                        <th
                            colSpan="4"
                        >Ejecucion Presupuestal</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Proyectos.map((item, i) =>
                            <tr kye={i}>
                                <td>
                                    {i + 1}
                                </td>
                                <td>
                                    <div style={{ display: "flex" }}>
                                        <Button
                                            type="button"
                                            style={{
                                                borderRadius: "13px",
                                                margin: "5px",
                                                backgroundColor: "#171819",
                                            }}
                                        >
                                            CUI {item.cui}
                                        </Button>
                                        <Button
                                            type="button"
                                            style={{
                                                borderRadius: "13px",
                                                margin: "5px",
                                                backgroundColor: "#171819",
                                            }}
                                        >
                                            META <ProyectosMeta proyectos_id={item.id} />
                                        </Button>
                                    </div>
                                    {item.nombre}
                                </td>
                                <td>
                                    <div>
                                        <div style={{
                                            color: "#17a2b8"
                                        }}>Costo actualizado PIP </div>
                                        <div>{Redondea(item.costo_actualizado)}</div>
                                    </div>
                                    <div>
                                        <div style={{
                                            color: "#17a2b8"
                                        }}>Costo elab. Exp. Tec. PIP</div>
                                        <div>{Redondea(item.costo_elaboracion)}</div>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <div style={{
                                            color: "#17a2b8"
                                        }}>UF &nbsp;</div>
                                        <div>{item.uf}</div>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <div style={{
                                            color: "#17a2b8"
                                        }}>UEI:  &nbsp;</div>
                                        <div>{item.uei}</div>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <div style={{
                                            color: "#17a2b8"
                                        }}>Viab:  &nbsp;</div>
                                        <div>{item.viabilizacion}</div>
                                    </div>
                                    <div>
                                        <ProyectoUsuario proyectos_id={item.id} />
                                    </div>
                                </td>
                                <td>
                                    <PlanTrabajo proyectos_id={item.id} />
                                </td>
                                <td>
                                    <Plazos proyectos_id={item.id} />
                                </td>
                                <td>
                                    <AvanceFisico proyectos_id={item.id} />
                                </td>
                                <EjecucionPresupuestal proyectos_id={item.id} />
                            </tr>
                        )
                    }

                </tbody>
            </table>

        </div>
    );
}
function ProyectosMeta({ proyectos_id }) {
    useEffect(() => {
        fetchProyectoMeta()
    }, [])
    const [ProyectoMeta, setProyectoMeta] = useState([])
    async function fetchProyectoMeta() {
        const res = await axios.get(`${UrlServer}/proyectoMeta`,
            {
                params: {
                    proyectos_id,
                    anyo: new Date().getFullYear()
                }
            }
        )
        setProyectoMeta(res.data)
    }
    return (
        ProyectoMeta.numero || ""
    )
}
function ProyectoUsuario({ proyectos_id }) {
    useEffect(() => {
        fetchProyectoUsuario()
    }, [])
    const [ProyectoUsuario, setProyectoUsuario] = useState([])
    async function fetchProyectoUsuario() {
        const res = await axios.get(`${UrlServer}/proyectoUsuario`,
            {
                params: {
                    proyectos_id
                }
            }
        )
        setProyectoUsuario(res.data)
    }
    return (
        <div>
            <table>
                {
                    ProyectoUsuario.map((item, i) =>
                        <tr
                            key={i}
                            style={{ display: "flex" }}>
                            <td style={{
                                color: "#17a2b8"
                            }}>{item.cargo_nombre}&nbsp;</td>
                            <td>
                                {item.nombre ?
                                    item.profesion_nombrecorto + " " + item.nombre + " " + item.apellido_paterno + " " + item.apellido_materno
                                    :
                                    "POR ASIGNAR"
                                }
                            </td>
                        </tr>

                    )
                }

            </table>



        </div>
    )
}
function PlanTrabajo({ proyectos_id }) {
    useEffect(() => {
        fetchProyectoPlanTrabajo()
    }, [])
    const [ProyectoPlanTrabajo, setProyectoPlanTrabajo] = useState({})
    async function fetchProyectoPlanTrabajo() {
        const res = await axios.get(`${UrlServer}/proyectoPlanTrabajo`,
            {
                params: {
                    proyectos_id,
                }
            }
        )
        setProyectoPlanTrabajo(res.data)
        fetchProyectoPlanTrabajoRecursos(res.data.id)
    }
    // recursos
    const [ProyectoPlanTrabajoRecursos, setProyectoPlanTrabajoRecursos] = useState([])
    async function fetchProyectoPlanTrabajoRecursos(proyectos_plantrabajo_id) {
        const res = await axios.get(`${UrlServer}/proyectoPlanTrabajoRecursos`,
            {
                params: {
                    proyectos_plantrabajo_id,
                }
            }
        )
        setProyectoPlanTrabajoRecursos(res.data)
    }
    return (
        <div>
            <div>
                <table style={{ width: "100%" }}>
                    <tr>
                        <th style={{
                            color: "#17a2b8"
                        }}>Ppto. S/.&nbsp;</th>
                        <th>{Redondea(ProyectoPlanTrabajoRecursos.reduce((acc, item) => acc + Number(item.presupuesto), 0))} </th>
                    </tr>
                    {ProyectoPlanTrabajoRecursos.map((item, i) =>

                        <tr key={i}>
                            <td style={{
                                color: "#17a2b8"
                            }}>{item.nombre}&nbsp;</td>
                            <td>{Redondea(item.presupuesto)}</td>
                        </tr>
                    )}
                </table>

            </div>
            <div style={{ display: "flex" }}>
                <div style={{
                    color: "#17a2b8"
                }}>Plazo Ejec.&nbsp;</div>
                {ProyectoPlanTrabajo.plazo_ejecucion} d.c.
            </div>
            <div style={{ display: "flex" }}>
                <div style={{
                    color: "#17a2b8"
                }}>Elab. Exp. Adm. Directa
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <div style={{
                    color: "#17a2b8"
                }}>Doc. Aprobacion.&nbsp;</div>
                {ProyectoPlanTrabajo.documento_aprobacion}
            </div>
        </div>
    )
}
function Plazos({ proyectos_id }) {
    useEffect(() => {
        fetchProyectoPlazos()
    }, [])
    const [ProyectoPlazos, setProyectoPlazos] = useState([])
    async function fetchProyectoPlazos() {
        const res = await axios.get(`${UrlServer}/proyectoPlazos`,
            {
                params: {
                    proyectos_id,
                }
            }
        )
        setProyectoPlazos(res.data)
    }

    return (

        [
            <tr
                style={{
                    color: "#17a2b8"
                }}
            >
                <th>Inicio</th>
                <th>Termino</th>
            </tr>,
            ProyectoPlazos.map((item, i) =>
                [
                    <tr key={i} >
                        <td
                            style={{
                                color: "#17a2b8"
                            }}
                        >{item.tipo_nombre}</td>
                        <td></td>
                    </tr>,
                    <tr
                        style={{
                            whiteSpace: "nowrap"
                        }}
                    >
                        <td>{fechaFormatoClasico(item.fecha_inicial)}</td>
                        <td>{fechaFormatoClasico(item.fecha_final)}</td>
                    </tr>

                ]
            )
        ]
    )
}
function AvanceFisico({ proyectos_id }) {
    useEffect(() => {
        fetchProyectoAvanceFisico()
    }, [])
    const [ProyectoAvanceFisico, setProyectoAvanceFisico] = useState([])
    async function fetchProyectoAvanceFisico() {
        const res = await axios.get(`${UrlServer}/proyectoAvanceFisico`,
            {
                params: {
                    proyectos_id,
                    anyo: new Date().getFullYear()
                }
            }
        )
        setProyectoAvanceFisico(res.data)
    }

    return (

        [
            <tr
                style={{
                    color: "#17a2b8"
                }}
            >
                <th>Mes</th>
                <th>Entregable</th>
                <th>{ProyectoAvanceFisico.reduce((acc, item) => acc + item.porcentaje, 0)} %</th>
            </tr>,
            ProyectoAvanceFisico.map((item, i) =>
                <tr key={i} >
                    <td
                        style={{
                            whiteSpace: "nowrap"
                        }}
                    >{mesesShort[item.mes - 1] + "-" + item.anyo}</td>
                    <td></td>
                    <td
                        style={{
                            whiteSpace: "nowrap"
                        }}
                    >{item.porcentaje} %</td>
                </tr>
            )
        ]
    )
}
function EjecucionPresupuestal({ proyectos_id }) {
    useEffect(() => {
        fetchEjecucionPresupuestalAnterior()
        fetchEjecucionPresupuestalActual()
    }, [])
    const [EjecucionPresupuestalAnterior, setEjecucionPresupuestalAnterior] = useState({})
    async function fetchEjecucionPresupuestalAnterior() {
        const res = await axios.get(`${UrlServer}/proyectoEjecucionPresupuestal`,
            {
                params: {
                    proyectos_id,
                    anyo: new Date().getFullYear() - 1
                }
            }
        )
        setEjecucionPresupuestalAnterior(res.data)
    }
    const [EjecucionPresupuestalActual, setEjecucionPresupuestalActual] = useState({})
    async function fetchEjecucionPresupuestalActual() {
        const res = await axios.get(`${UrlServer}/proyectoEjecucionPresupuestal`,
            {
                params: {
                    proyectos_id,
                    anyo: new Date().getFullYear()
                }
            }
        )
        setEjecucionPresupuestalActual(res.data)
    }
    return (
        <td >
            <tr
                style={{
                    textAlign: "center"
                }}
            >
                <th colSpan="2">AÑO {new Date().getFullYear() - 1}</th>
                <th colSpan="2">AÑO {new Date().getFullYear()}</th>
            </tr>
            <tr>

                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >Ppto. Plan</th>
                <th>
                    {Redondea(EjecucionPresupuestalAnterior.presupuesto)}
                </th>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >Ppto. Plan</th>
                <th>
                    {Redondea(EjecucionPresupuestalActual.presupuesto)}
                </th>
            </tr>
            <tr>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >PIA</th>
                <td>
                </td>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >PIA</th>
                <td>
                </td>
            </tr>
            <tr>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >PIM</th>
                <td>
                    {Redondea(EjecucionPresupuestalAnterior.pim)}
                </td>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >PIM</th>
                <td>
                    {Redondea(EjecucionPresupuestalActual.pim)}
                </td>
            </tr>
            <tr>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >Ejec. a Dic.19</th>
                <td>
                    {Redondea(EjecucionPresupuestalAnterior.ejecutado)}
                </td>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >
                    Devengado
                </th>
                <td>
                    {Redondea(EjecucionPresupuestalActual.devengado)}
                </td>
            </tr>
            <tr>
                <th></th>
                <th></th>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >Saldo por dev.</th>
                <th>
                    {Redondea(EjecucionPresupuestalActual.pim - EjecucionPresupuestalActual.devengado)}
                </th>
            </tr>
            <tr>
                <th></th>
                <th></th>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >Total Asignado</th>
                <th>
                    {Redondea(EjecucionPresupuestalAnterior.ejecutado + EjecucionPresupuestalActual.pim)}
                </th>
            </tr>
            <tr>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >Saldo por asignar</th>
                <th>
                    {Redondea(EjecucionPresupuestalAnterior.presupuesto - EjecucionPresupuestalAnterior.ejecutado)}
                </th>
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >Saldo por Asignar</th>
                <th>
                    {Redondea(
                        EjecucionPresupuestalAnterior.presupuesto -
                        EjecucionPresupuestalAnterior.ejecutado -
                        EjecucionPresupuestalActual.pim +
                        EjecucionPresupuestalActual.presupuesto
                    )}
                </th>
            </tr>
        </td>

    )
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea, mesesShort } from '../Utils/Funciones';
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
        <div>
            interfaz de proyectos
            <table className="table table-sm table-hover">
                <thead>
                    <tr>
                        <th>Nro</th>
                        <th>CUI</th>
                        <th>META</th>
                        <th
                            style={{
                                width: "20%"
                            }}
                        >PROYECTO</th>
                        <th>Informacion General del PIP y Responsables de Elab. Exp. Tec. </th>
                        <th>Datos del Plan de Trabajo </th>
                        <th>Plazo de Ejecucion </th>
                        <th></th>
                        <th>Avance Fisico </th>
                        <th>Ejecucion Presupuestal</th>
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
                                    {item.cui}
                                </td>
                                <td>
                                    <ProyectosMeta proyectos_id={item.id} />
                                </td>
                                <td>
                                    {item.nombre}
                                </td>
                                <td>
                                    <div style={{ display: "flex" }}>
                                        <div style={{
                                            color: "#17a2b8"
                                        }}>Costo actualizado PIP &nbsp;</div>
                                        <div>{item.costo_actualizado}</div>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <div style={{
                                            color: "#17a2b8"
                                        }}>Costo elab. Exp. Tec. PIP &nbsp;</div>
                                        <div>{item.costo_elaboracion}</div>
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
        <div>
            {ProyectoMeta.numero}
        </div>
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

        ProyectoPlazos.map((item, i) =>
            <tr key={i} >
                <th
                    style={{
                        color: "#17a2b8"
                    }}
                >{item.tipo_nombre}</th>
                <td>{item.fecha_inicial}</td>
                <td>{item.fecha_final}</td>
            </tr>
        )
    )
}
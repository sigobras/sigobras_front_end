import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle, useRef } from 'react';
import axios from 'axios';
import { BiMessageAltEdit } from "react-icons/fa";
import { MdEdit, MdSave, MdDeleteForever } from "react-icons/md";
import { Card, Button, ButtonGroup, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, Input, Container, ModalBody, ModalHeader, ModalFooter, Modal, Table, CustomInput } from 'reactstrap';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import "../PlazosHistorial/Plazos.css";
import { object } from 'prop-types';
import PlazosFormulario from './PlazosFormulario'
import PlazosFormularioEdicion from './PlazosFormularioEdicion'


export default () => {
    const [RefPlazosHijos, setRefPlazosHijos] = useState([])

    function activeChildFunctions(id_padre) {
        console.log("Activando---->");
        RefPlazosHijos[id_padre].recarga()
    }

    useEffect(() => {
        fetchPLazosPadres()
        return () => {
        }
    }, [])

    const [PlazosPadres, setPlazosPadres] = useState([])
    async function fetchPLazosPadres() {
        const res = await axios.get(`${UrlServer}/plazosPadres`,
            {
                params:
                {
                    id_ficha: sessionStorage.getItem('idobra')
                }
            }
        )
        setPlazosPadres(res.data)
        console.log("alguna cosa", res.data)
    }

    async function deletePlazosPadre(id) {
        console.log("idididid", id);
        if (confirm("Esta seguro que desea eliminar este estado?")) {
            const res = await axios.delete(`${UrlServer}/plazosPadresAndHijos`,
                {
                    data:
                    {
                        "id": id
                    }
                }
            )
            console.log(res.data);
            alert("se elimino registro con exito")
            fetchPLazosPadres()
        }
    }

    return (

        <div>
            <PlazosFormulario
                id_padre={null}
                recarga={fetchPLazosPadres}
            />

            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>TIPO/ESTADO</th>
                        <th>DESCRIPCIÓN</th>
                        <th>RESOLUCIÓN</th>
                        <th>FECHA INICIAL</th>
                        <th>FECHA FINAL</th>
                        <th>DIAS</th>
                        <th>PLAZO APROBADO</th>
                        <th>FECHA APROBADA</th>

                    </tr>
                </thead>

                <tbody>
                    {
                        PlazosPadres.map((item, i) =>
                            [<tr>
                                <th scope="row">{i + 1}</th>
                                {/* <th scope="row">{item.id}</th> */}
                                <td>{item.tipo_nombre}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.documento_resolucion_estado}</td>
                                <td>{item.fecha_inicio}</td>
                                <td>{item.fecha_final}</td>
                                <td>{item.n_dias}</td>
                                <td>{item.plazo_aprobado == 1 ? "Aprobado" : "Sin aprobar"}</td>
                                <td>{item.fecha_aprobada }</td>
                                <td style={{display:'flex'}}>
                                    <PlazosFormulario
                                        id_padre={item.id}
                                        recarga={activeChildFunctions}
                                    />
                                    <PlazosFormularioEdicion
                                        data={item}
                                        recarga={fetchPLazosPadres}

                                    />
                                    <MdDeleteForever
                                        color="#ff2933"
                                        size="20"
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onClick={() => deletePlazosPadre(item.id)}
                                    />
                                </td>
                                
                            </tr>,

                            <PLazosHijos
                                id_padre={item.id}
                                count={i + 1}
                                ref={(ref) => {
                                    var clone = RefPlazosHijos
                                    clone[item.id] = ref
                                    setRefPlazosHijos(clone)
                                }}

                            />
                            ]
                        )
                    }
                </tbody>
            </Table>

        </div>


    )
}
const PLazosHijos = forwardRef(({ id_padre, count }, ref) => {

    useImperativeHandle(ref, () => ({
        recarga() {
            fetchCargarPlazosHijos()
        }
    }));

    useEffect(() => {
        fetchCargarPlazosHijos()
        return () => {

        }
    }, [])
    const [CargarPlazosHijos, setCargarPlazosHijos] = useState([])
    async function fetchCargarPlazosHijos() {
        const res = await axios.get(`${UrlServer}/plazosHijos`,
            {
                params:
                {
                    id_ficha: sessionStorage.getItem('idobra'),
                    id_padre: id_padre
                }
            }
        )
        setCargarPlazosHijos(res.data)
        console.log("Mesaje solito");
        console.log("que adbuifbuieuribuineoid", res.data);
    }
    async function deletePlazosHijos(id) {
        console.log("idididid", id);
        if (confirm("Esta seguro que desea eliminar este Subestado?")) {
            const res = await axios.delete(`${UrlServer}/plazosPadresAndHijos`,
                {
                    data:
                    {
                        "id": id
                    }
                }
            )
            console.log(res.data);
            alert("se elimino registro con exito")
            fetchCargarPlazosHijos()
        }
    }
    return (
        CargarPlazosHijos.map((item, i) =>
            <tr >
                <th scope="row" style={{ paddingLeft: "20px" }}>{count + "." + (i + 1)}</th>
                <td>{item.tipo_nombre}</td>
                <td>{item.descripcion}</td>
                <td>{item.documento_resolucion_estado}</td>
                <td>{item.fecha_inicio}</td>
                <td>{item.fecha_final}</td>
                <td>{item.n_dias}</td>
                <td>{item.plazo_aprobado == 1 ? "Aprobado" : "Sin aprobar"}</td>
                <td>{item.fecha_aprobada }</td>
                <td style={{display:'flex'}}>
                    <PlazosFormularioEdicion
                        data={item}
                        recarga={fetchCargarPlazosHijos}
                    />
                    <MdDeleteForever
                        color="#ff2933"
                        size="20"
                        style={{
                            cursor: "pointer",
                            
                        }}
                        onClick={() => deletePlazosHijos(item.id)}
                    />
                </td>
            </tr>
        )
    )
})
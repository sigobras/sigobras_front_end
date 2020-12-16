import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle, useRef } from 'react';
import axios from 'axios';
import { BiMessageAltEdit } from "react-icons/fa";
import { Card, Button, ButtonGroup, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, Input, Container, ModalBody, ModalHeader, ModalFooter, Modal, Table, CustomInput } from 'reactstrap';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import { v4 as uuidv4 } from 'uuid';
import "../PlazosHistorial/Plazos.css";
import { object } from 'prop-types';
import PlazosFormulario from './PlazosFormulario'
import PlazosFormularioEdicion from './PlazosFormularioEdicion'


export default () => {
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
    }


    return (

        <div>
            <PlazosFormulario 
                id_padre = {null}
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
                        <th></th>
                        <th></th>
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
                                <td>
                                    <PlazosFormulario 
                                        id_padre = {item.id}
                                    />
                                </td>
                                <td>
                                    <PlazosFormularioEdicion
                                        data = {item}
                                    />
                                </td>
                            </tr>,

                            <PLazosHijos
                                id_padre={item.id}
                                count={i + 1}
                            />
                            ]
                        )
                    }
                </tbody>
            </Table>

        </div>


    )
}

function PLazosHijos({ id_padre, count }) {
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
        console.log(res.data);
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
                <td>
                    <PlazosFormularioEdicion
                        data = {item}
                    />
                </td>
            </tr>
        )
    )
}
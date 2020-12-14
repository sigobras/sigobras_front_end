import React, { Component, useEffect, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink } from 'reactstrap';
import { FaBell } from "react-icons/fa";
import LoadingXD from "../../../images/loaderXS.gif"
import axios from "axios"
import { UrlServer } from '../Utils/ServerUrlConfig'
import { socket } from "../Utils/socket";
export default () => {
    useEffect(() => {
        fetchNotificacionesCantidad()
        fetchNotificaciones()
        socketIni()
    }, [])
    function socketIni() {
        socket.on("gestion_documentaria_" + sessionStorage.getItem('idobra'), (data) => {
            console.log("llegada de gestion_documentaria");
            fetchNotificacionesCantidad()
            fetchNotificaciones()
        })
    }
    const [Notificaciones, setNotificaciones] = useState([
        {
            emisor: "-----",
            descripcion: "-----",
        }
    ])
    async function fetchNotificaciones() {
        var res = await axios.get(`${UrlServer}/FichasNotificaciones`,
            {
                params: {
                    "id_acceso": sessionStorage.getItem('idacceso'),
                    "id_ficha": sessionStorage.getItem('idobra'),
                }
            }
        )
        if (Array.isArray(res.data)) {
            setNotificaciones(res.data)
        }
    }
    const [NotificacionesCantidad, setNotificacionesCantidad] = useState(0)
    async function fetchNotificacionesCantidad() {
        var res = await axios.get(`${UrlServer}/FichasNotificaciones`,
            {
                params: {
                    "id_acceso": sessionStorage.getItem('idacceso'),
                    "id_ficha": sessionStorage.getItem('idobra'),
                }
            }
        )
        if (Array.isArray(res.data)) {
            setNotificacionesCantidad(res.data.length)
        }
    }
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => {
        if (!dropdownOpen) {
            fetchNotificaciones()
            putFichasNotificaciones()
            fetchNotificacionesCantidad()
        }
        setDropdownOpen(!dropdownOpen);
    }
    async function putFichasNotificaciones() {
        var res = await axios.put(`${UrlServer}/FichasNotificaciones`,
            {
                "id_acceso": sessionStorage.getItem('idacceso'),
                "id_ficha": sessionStorage.getItem('idobra')
            }
        )
        if (Array.isArray(res.data)) {
            setNotificaciones(res.data)
        }
    }
    return (
        <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle>
                <FaBell />
                {NotificacionesCantidad}
            </DropdownToggle>
            <DropdownMenu>

                {Notificaciones.map((item, i) =>
                (
                    item.fichas_notificaciones_tipo_id == 1 &&
                    [
                        <DropdownItem>
                            <NavLink href={`/${item.url}`}>
                                <div
                                    style={{
                                        color: "black",
                                        fontWeight: 700,
                                    }}
                                >
                                    {item.emisor}
                                </div>
                                <div
                                    style={{
                                        color: "black",
                                    }}
                                >
                                    {item.descripcion}
                                </div>
                            </NavLink>
                        </DropdownItem>
                    ]
                )

                )}

            </DropdownMenu>
        </Dropdown>

    )
}

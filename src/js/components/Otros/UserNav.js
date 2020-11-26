import React, { useState, useEffect } from 'react';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { FaPowerOff } from "react-icons/fa";
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
export default () => {
    useEffect(() => {
        fetchUsuario()
    }, []);
    const [Usuario, setUsuario] = useState(
        {
            "cargo_nombre": "======",
            "usuario_nombre": "======"
        }
    );
    async function fetchUsuario() {
        console.log("datos usuario");
        var request = await axios.post(`${UrlServer}/getDatosUsuario`, {
            id_acceso: sessionStorage.getItem("idacceso")
        })
        console.log(request.data);
        setUsuario(request.data)
    }
    function cierraSesion() {
        if (confirm('¿Esta seguro de salir del sistema?')) {
            sessionStorage.clear();
            window.location.href = "/"
        }
    }
    return (
        <div>
            <span id="userLogin" className="mr-1 nav-link text-white" >
                <label className="text-capitalize font-weight-bold" >
                    {Usuario.cargo_nombre}
                </label>:   {Usuario.usuario_nombre}
            </span>
            <UncontrolledPopover
                trigger="legacy"
                placement="bottom"
                target="userLogin"
            >
                <PopoverBody>
                    <span
                        className="nav-link"
                        onClick={() => cierraSesion()}
                    >
                        <FaPowerOff
                            color="red"
                            className="p-0"
                        />
                        Salir
                        </span>
                </PopoverBody>
            </UncontrolledPopover>
        </div>
    );
}


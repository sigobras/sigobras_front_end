import React, { useState, useEffect } from 'react';
import { Modal, Card, InputGroup, Nav, NavItem, NavLink, CardHeader, CardBody, CardFooter, Button, Input, UncontrolledPopover, ModalHeader, ModalBody } from 'reactstrap';
import ModalNuevoDocumento from './ModalNuevoDocumento';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
import { FaCloudDownloadAlt, FaCheckCircle, FaRegWindowClose } from "react-icons/fa";
import ModalRespuesta from './ModalRespuesta';


export default () => {
    useEffect(() => {
        toggleNavSeleccionado("RECIBIDOS")
    }, [])
    const [NavSeleccionado, setNavSeleccionado] = useState("");
    function toggleNavSeleccionado(nav) {
        if (nav == "RECIBIDOS") {
            fetchDocumentosRecibidos()
            // fetchDocumentosRecibidosRespuestas()
        }
        if (nav == "ENVIADOS") {
            fetchDocumentosEnviados()
        }
        setNavSeleccionado(nav)
    }
    const [DocumentosRecibidos, setDocumentosRecibidos] = useState([]);
    async function fetchDocumentosRecibidos() {
        var res = await axios.get(`${UrlServer}/gestiondocumentaria_recibidos`,
            {
                params: {
                    "id_acceso": sessionStorage.getItem('idacceso'),
                    "id_ficha": sessionStorage.getItem('idobra'),
                }

            }

        )
        if (Array.isArray(res.data)) {
            setDocumentosRecibidos(res.data)
        }
    }

    const [DocumentosEnviados, setDocumentosEnviados] = useState([]);
    async function fetchDocumentosEnviados() {
        var res = await axios.get(`${UrlServer}/gestiondocumentaria_enviados`,
            {
                params: {
                    "id_acceso": sessionStorage.getItem('idacceso'),
                }
            }
        )
        setDocumentosEnviados(res.data)
    }
    function onChangeDocumentosEnviados(documento) {
        if (documento.id == DocumentoEnviadoSeleccionado.id) {
            setDocumentoEnviadoSeleccionado({})
        } else {
            setDocumentoEnviadoSeleccionado(documento)
            fetchDocumentosEnviadosUsuarios(documento.id)
        }

    }
    const [DocumentoEnviadoSeleccionado, setDocumentoEnviadoSeleccionado] = useState(0);

    const [DocumentosEnviadosUsuarios, setDocumentosEnviadosUsuarios] = useState([]);
    async function fetchDocumentosEnviadosUsuarios(id) {
        var res = await axios.get(`${UrlServer}/gestiondocumentaria_enviados_usuarios`,
            {
                params: {
                    id
                }
            }
        )
        setDocumentosEnviadosUsuarios(res.data)

    }
    function DescargarArchivoEnviado(data) {
        const url = data
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data, "target", "_blank");
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
    }
    function DescargarArchivoRecibido(data, gestiondocumentaria_mensajes_id) {
        if (confirm("Desea descargar el archivo?")) {
            if (actualizarVisto(gestiondocumentaria_mensajes_id)) {
                const url = data
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', data, "target", "_blank");
                link.setAttribute("target", "_blank");
                document.body.appendChild(link);
                link.click();
            }
        }
    }
    async function actualizarVisto(gestiondocumentaria_mensajes_id) {
        try {
            var res = await axios.put(`${UrlServer}/gestiondocumentaria_receptores`,
                {
                    "id_ficha": sessionStorage.getItem('idobra'),
                    "id_acceso": sessionStorage.getItem('idacceso'),
                    "gestiondocumentaria_mensajes_id": gestiondocumentaria_mensajes_id
                }
            )

        } catch (error) {
            alert("ocurrio un problema")
        }
    }
    const [modal, setModal] = useState(false);
    const [ModalIdEmisor, setModalIdEmisor] = useState(0);
    const [ModalIdMensaje, setModalIdMensaje] = useState(0);
    const [ModalIdUsuario, setModalIdUsuario] = useState(0);
    const toggleModal = (id_mensaje, id_emisor, usuario_nombre) => {
        setModalIdEmisor(id_emisor)
        setModalIdMensaje(id_mensaje)
        setModalIdUsuario(usuario_nombre)
        setModal(!modal)
    };
    function fechaFormatoClasico(fecha) {
        var fechaTemp = ""
        if (fecha) {
            fechaTemp = fecha.split("-")
        } else {
            return fecha
        }
        if (fechaTemp.length == 3) {
            return fechaTemp[2] + "-" + fechaTemp[1] + "-" + fechaTemp[0]
        } else {
            return fecha
        }
    }
    return (
        <div>
            <ModalNuevoDocumento />
            <Nav tabs>
                <NavItem>
                    <NavLink
                        active={NavSeleccionado == "RECIBIDOS"}
                        onClick={() => toggleNavSeleccionado("RECIBIDOS")}
                    >
                        RECIBIDOS
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={NavSeleccionado == "ENVIADOS"}
                        onClick={() => toggleNavSeleccionado("ENVIADOS")}
                    >
                        ENVIADOS
                    </NavLink>
                </NavItem>
            </Nav>
            {
                NavSeleccionado == "RECIBIDOS" &&
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>
                                EMISOR CARGO
                            </th>
                            <th>
                                EMISOR
                            </th>
                            <th>
                                ASUNTO
                            </th>
                            <th>
                                DESCRIPCION
                            </th>
                            <th
                                style={{ width: "10%" }}
                            >
                                FECHA
                            </th>
                            <th>
                                DESCARGA
                            </th>
                            <th>
                                RESPONDER
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            DocumentosRecibidos.map((item, i) =>
                                <tr
                                    key={i}
                                >
                                    {/* <td>
                                        {item.id}
                                    </td> */}
                                    <td>
                                        {item.emisor_cargo}
                                    </td>
                                    <td>
                                        {item.emisor_nombre}
                                    </td>
                                    <td>
                                        {item.asunto}
                                    </td>
                                    <td>
                                        {item.descripcion}
                                    </td>
                                    <td>
                                        {fechaFormatoClasico(item.fecha)}
                                    </td>
                                    <td>
                                        <FaCloudDownloadAlt
                                            size={15}
                                            color={"#2676bb"}
                                            onClick={() => DescargarArchivoRecibido(`${UrlServer}${item.documento_link}`, item.id)}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <ModalRespuesta
                                            receptor_id={item.emisor_id}
                                            mensaje_id={item.id}
                                            archivoAdjunto_id={item.archivoAdjunto_id}
                                            archivoAdjunto_tipo={item.archivoAdjunto_tipo}
                                        />
                                    </td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            }
            {
                NavSeleccionado == "ENVIADOS" &&
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>
                                ASUNTO
                            </th>
                            <th>
                                DESCRIPCION
                            </th>
                            <th>
                                FECHA
                            </th>
                            <th>
                                DESCARGA
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            DocumentosEnviados.map((item, i) =>
                                [
                                    <tr key={i}>
                                        <td
                                            onClick={() => { onChangeDocumentosEnviados(item) }}
                                        >
                                            {item.asunto}
                                        </td>
                                        <td>
                                            {item.descripcion}
                                        </td>
                                        <td>
                                            {fechaFormatoClasico(item.fecha)}
                                        </td>
                                        <td>
                                            <FaCloudDownloadAlt
                                                size={15}
                                                color={"#2676bb"}
                                                onClick={() => DescargarArchivoEnviado(`${UrlServer}${item.documento_link}`)}
                                                style={{
                                                    cursor: "pointer"
                                                }}
                                            />
                                        </td>

                                    </tr>,
                                    ,
                                    (
                                        DocumentoEnviadoSeleccionado.id == item.id &&
                                        <tr className="resplandPartidabottom">
                                            <td colSpan="8">
                                                <div >
                                                    <table className="table table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    OBRA
                                                                 </th>
                                                                <th>
                                                                    CARGO
                                                                </th>
                                                                <th>
                                                                    USUARIO
                                                                </th>
                                                                <th>
                                                                    ESTADO VISTO
                                                                </th>
                                                                <th>
                                                                    CANTIDAD RESPUESTAS
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                DocumentosEnviadosUsuarios.map((item2, i2) =>
                                                                    [
                                                                        <tr key={i2}>
                                                                            <td

                                                                            >
                                                                                {item2.codigo}
                                                                            </td>
                                                                            <td>
                                                                                {item2.cargo_nombre}
                                                                            </td>
                                                                            <td>
                                                                                {item2.usuario_nombre}
                                                                            </td>
                                                                            <td>
                                                                                {item2.mensaje_visto ?
                                                                                    <FaCheckCircle
                                                                                        color={"green"}
                                                                                    />
                                                                                    :
                                                                                    <FaRegWindowClose
                                                                                        color={"red"}
                                                                                    />
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                onClick={() => toggleModal(item.id, item2.id, item2.usuario_nombre)}
                                                                                style={{ cursor: "pointer" }}
                                                                            >
                                                                                <RespuestasUsuariosEnviadosCantidad
                                                                                    emisor_id={item2.id}
                                                                                    mensaje_id={item.id}
                                                                                />
                                                                            </td>
                                                                        </tr>

                                                                    ]

                                                                )
                                                            }

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )

                                ]
                            )
                        }

                    </tbody>
                </table>
            }
            <Modal isOpen={modal} toggle={toggleModal} >
                <ModalHeader>
                    {ModalIdUsuario}
                </ModalHeader>
                <ModalBody>
                    <RespuestasUsuariosEnviados
                        emisor_id={ModalIdEmisor}
                        mensaje_id={ModalIdMensaje}
                        DescargarArchivoEnviado={DescargarArchivoEnviado}
                        fechaFormatoClasico={fechaFormatoClasico}
                    />
                </ModalBody>
            </Modal>
        </div >
    );
}
function RespuestasUsuariosEnviados({ emisor_id, mensaje_id, DescargarArchivoEnviado, fechaFormatoClasico }) {
    useEffect(() => {
        fetchDocumentosRecibidosRespuestas()
    }, [])
    const [DocumentosRecibidosRespuestas, setDocumentosRecibidosRespuestas] = useState([]);
    async function fetchDocumentosRecibidosRespuestas() {
        var res = await axios.get(`${UrlServer}/gestiondocumentaria_recibidos_respuestas`,
            {
                params: {
                    "id_acceso": sessionStorage.getItem('idacceso'),
                    mensaje_id,
                    emisor_id
                }
            }
        )
        if (Array.isArray(res.data)) {
            setDocumentosRecibidosRespuestas(res.data)
            console.log(res.data);

        }
    }

    return (
        <div >
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>
                            ASUNTO
                            </th>
                        <th>
                            DESCRIPCION
                            </th>
                        <th>
                            FECHA
                            </th>
                        <th>
                            DESCARGA
                            </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        DocumentosRecibidosRespuestas.map((item, i) =>
                            <tr key={i}>
                                <td>
                                    {item.asunto}
                                </td>
                                <td>
                                    {item.descripcion}
                                </td>
                                <td>
                                    {fechaFormatoClasico(item.fecha)}
                                </td>
                                <td>
                                    {item.documento_link &&
                                        <FaCloudDownloadAlt
                                            size={15}
                                            color={"#2676bb"}
                                            onClick={() => DescargarArchivoEnviado(`${UrlServer}${item.documento_link}`)}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        />
                                    }

                                </td>
                            </tr>

                        )
                    }

                </tbody>
            </table>
        </div>
    )
}
function RespuestasUsuariosEnviadosCantidad({ emisor_id, mensaje_id, DescargarArchivoEnviado }) {
    useEffect(() => {
        fetchDocumentosRecibidosRespuestas()
    }, [])
    const [DocumentosRecibidosRespuestas, setDocumentosRecibidosRespuestas] = useState({});
    async function fetchDocumentosRecibidosRespuestas() {
        var res = await axios.get(`${UrlServer}/gestiondocumentaria_recibidos_respuestas_cantidad`,
            {
                params: {
                    "id_acceso": sessionStorage.getItem('idacceso'),
                    mensaje_id,
                    emisor_id
                }
            }
        )
        setDocumentosRecibidosRespuestas(res.data)
    }

    return (
        <div >
            {DocumentosRecibidosRespuestas.cantidad}
        </div>
    )
}
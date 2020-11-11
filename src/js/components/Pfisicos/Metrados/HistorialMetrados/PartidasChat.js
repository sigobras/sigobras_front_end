import React, { useEffect, useState, useRef } from 'react';
import { ModalBody, Button, Modal } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import axios from 'axios';
import { UrlServer } from '../../../Utils/ServerUrlConfig';
import { socket } from "../../../Utils/socket";
import "./PartidasChat.css";

import { FaPaperPlane, FaPlusCircle, FaCamera } from 'react-icons/fa';
import { MdComment } from 'react-icons/md';
import LogoSigobras from './../../../../../images/logoSigobras.png'

function Comentarios({ id_partida, titulo }) {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        console.log("scroll to bottom");
        // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    const [Comentario, setComentario] = useState([])
    useEffect(() => {
        fetchComentario()
        scrollToBottom()
        socketIni()
    }, []);
    const [Data, setData] = useState([])
    async function fetchComentario() {
        const request = await axios.post(`${UrlServer}/getPartidaComentarios`, {
            "id_partida": id_partida,

        })
        await setData(request.data);
        scrollToBottom()
    }
    async function saveComentario() {
        const request = await axios.post(`${UrlServer}/postPartidaComentarios`, {
            "comentario": Comentario,
            "id_partida": id_partida,
            "id_acceso": sessionStorage.getItem('idacceso')
        })
        await fetchComentario()
        setComentario("")
        await axios.post(`${UrlServer}/postComentariosVistos`, {
            "id_partida": id_partida,
            "id_acceso": sessionStorage.getItem('idacceso')
        })
        //socket 
        socket.emit("partidas_comentarios_post",
            {
                id_partida
            }
        )
        socket.emit("componentes_comentarios_notificacion_post",
            {
                id_ficha: sessionStorage.getItem('idobra')
            }
        )
    }
    function socketIni() {
        socket.on("partidas_comentarios_get-" + id_partida, (data) => {
            console.log("llegada de mensaje");
            fetchComentario()
        })
    }
    //modal
    const [modal, setModal] = useState(false);

    const toggle = () => {
        console.log("toggle modal chat");
        setModal(!modal)
    };
    return (
        [
            <div
                className="align-center position-relative"
                onClick={toggle}
            >
                {true &&
                    <div style={{
                        background: "red",
                        borderRadius: "50%",
                        textAlign: "center",
                        position: "absolute",
                        left: "-6px",
                        top: "1px",
                        padding: "1px 4px",
                        zIndex: "20",
                        fontSize: "9px",
                        fontWeight: "bold",

                    }}>
                        {12}
                    </div>
                }
                <div
                >
                    <MdComment size={17} />
                </div>
            </div>,
            <Modal isOpen={modal}
                toggle={toggle}
            >
                < ModalBody style={{ maxheight: 'calc(90vh-1000px)' }
                }>
                    <div className="container container-chat">

                        <div className="message-header">
                            <div className="message-header-img">
                                <img src={LogoSigobras} width="30px" alt="logo sigobras"
                                    style={{
                                        height: "22px",
                                        top: "1px",
                                        position: "inherit"
                                    }} />
                            </div>
                            <div className="active_state">
                                <h4>{titulo}</h4>
                            </div>
                            <div className="header-icons">
                                <i className="fa fa-phone"></i>
                                <i className="fa fa-video-camera"></i>
                                <i className="fa fa-info-circle"></i>
                            </div>
                        </div>

                        <div className="message-page">
                            <div className="message-index">
                                <div className="messages">
                                    <div className="msg-page">
                                        {
                                            Data.map((item, i) =>
                                                (sessionStorage.getItem('idacceso') == item.id_acceso) ?
                                                    <div className="recived-chat">
                                                        <div className="recived-chat-img">
                                                            <img className="img-chat" src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" />
                                                        </div>
                                                        <div className="recived-msg">

                                                            <div className="recived-msg-inbox">
                                                                <span className="time"><b>{item.cargo_nombre} </b><em>{item.usuario_nombre}</em> </span>
                                                                <p>{item.comentario}</p>
                                                                <span className="time">{item.fecha}</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="outgoing-chat">
                                                        <div className="outgoing-chat-msg">
                                                            <span className="time"><b>{item.cargo_nombre} </b><em>{item.usuario_nombre}</em> </span>
                                                            <p>{item.comentario}</p>
                                                            <span className="time">{item.fecha}</span>
                                                        </div>

                                                        <div className="outgoing-chat-img">
                                                            <img className="img-chat" src="https://www.shareicon.net/data/2016/09/01/822762_user_512x512.png" />
                                                        </div>
                                                    </div>
                                            )
                                        }
                                        <div ref={messagesEndRef} />

                                    </div>
                                </div>
                            </div>


                            <div className="msg-bottom">
                                <div className="bottom-icons-chat">
                                    {/* <i className="fa"> <FaPlusCircle></FaPlusCircle></i> */}
                                    {/* <i className="fa fa-plus-circle"></i> */}
                                </div>
                                <div className="input-group input-group-chat">
                                    <DebounceInput

                                        placeholder="Escribe un comentario"
                                        minLength={1}
                                        debounceTimeout={1000}
                                        onChange={e => setComentario(e.target.value)}
                                        value={Comentario}
                                        className="form-control form-control-chat"
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text input-group-text-chat">
                                            <FaPaperPlane onClick={() => saveComentario()}></FaPaperPlane>
                                        </span>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                </ModalBody >

            </Modal>
        ]

    );
}

export default Comentarios;
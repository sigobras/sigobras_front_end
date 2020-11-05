import React, { useEffect, useState, useRef } from 'react';
import { ModalBody, Button } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import axios from 'axios';
import { UrlServer } from '../../../../Utils/ServerUrlConfig';
import { socket } from "../../../../Utils/socket";
import "../ComponentsDiarios/Comentarios.css";

import { FaPaperPlane, FaPlusCircle, FaCamera } from 'react-icons/fa';
import LogoSigobras from './../../../../../../images/logoSigobras.png'
function Comentarios({ id_partida, id_componente }) {
    // constructor(props) {
    //     super(props)
    //     this.state = { PartidaSeleccionada: metrados.descripcion,}
        
    //   }   
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        console.log("scroll to bottom");
        // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    const [Data, setData] = useState([])
    const [Comentario, setComentario] = useState([])

    const [temp, setTemp] = useState(0);
    const [isConnected, setConnected] = useState(false);
    useEffect(() => {
        fetchComentario()
        scrollToBottom()
        socketIni()
    }, []);
    async function fetchComentario() {

        const request = await axios.post(`${UrlServer}/getPartidaComentarios`, {
            "id_partida": id_partida,

        })
        console.log("id_patrida", id_partida);
        console.log("id_acceso", sessionStorage.getItem('idacceso'));
        await setData(request.data);
        scrollToBottom()
    }
    async function saveComentario() {
        const request = await axios.post(`${UrlServer}/postPartidaComentarios`, {
            "comentario": Comentario,
            "id_partida": id_partida,
            "id_acceso": sessionStorage.getItem('idacceso')
        })
        console.log(request);
        await fetchComentario()
        setComentario("")
        await axios.post(`${UrlServer}/postComentariosVistos`, {
            "id_partida": id_partida,
            "id_acceso": sessionStorage.getItem('idacceso')
        })
        //socket test
        socket.emit("partidas_comentarios_post",
            {
                id_partida
            }
        )
        //test de socket
        socket.emit("partidas_comentarios_notificacion_post",
            {
                id_componente: id_componente
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
    return (
        <ModalBody style = {{ maxheight : 'calc(90vh-1000px)'}}>
            <div class="container">
                
                    <div class="message-header">
                        <div class="message-header-img">
                            <img src={LogoSigobras} width="30px" alt="logo sigobras"
                                style={{
                                    height: "22px",
                                    top: "1px",
                                    position: "inherit"
                                }} />
                        </div>
                        <div class="active_state">
                            {/* {PartidaSeleccionada[i] == ?<h4>{this.state.PartidaSeleccionada}</h4>:""} */}
                            
                            <h6>OFICINAS</h6>
                        </div>
                        <div class="header-icons">
                            <i class="fa fa-phone"></i>
                            <i class="fa fa-video-camera"></i>
                            <i class="fa fa-info-circle"></i>
                        </div>
                    </div>
                
                <div class="message-page">
                    <div class="message-index">
                        <div class="messages">
                            <div class="msg-page">
                                {
                                    Data.map((item, i) =>
                                        (sessionStorage.getItem('idacceso') == item.id_acceso) ?
                                            <div class="recived-chat">
                                                <div class="recived-chat-img">
                                                    <img src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" />
                                                </div>
                                                <div class="recived-msg">

                                                    <div class="recived-msg-inbox">
                                                        <span class="time"><b>{item.cargo_nombre} </b><em>{item.usuario_nombre}</em> </span>
                                                        <p>{item.comentario}</p>
                                                        <span class="time">{item.fecha}</span>

                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div class="outgoing-chat">
                                                <div class="outgoing-chat-msg">
                                                    <span class="time"><b>{item.cargo_nombre} </b><em>{item.usuario_nombre}</em> </span>
                                                    <p>{item.comentario}</p>
                                                    <span class="time">{item.fecha}</span>
                                                </div>

                                                <div class="outgoing-chat-img">
                                                    <img src="https://www.shareicon.net/data/2016/09/01/822762_user_512x512.png" />
                                                </div>
                                            </div>
                                    )
                                }

                            </div>
                        </div>
                    </div>


                    <div class="msg-bottom">
                        <div class="bottom-icons">
                            {/* <i class="fa"> <FaPlusCircle></FaPlusCircle></i> */}
                            {/* <i class="fa fa-plus-circle"></i> */}
                        </div>
                        <div class="input-group">
                            <DebounceInput

                                placeholder="Escribe un comentario"
                                minLength={1}
                                debounceTimeout={1000}
                                onChange={e => setComentario(e.target.value)}
                                value={Comentario}
                                className="form-control"
                            />
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <FaPaperPlane onClick={() => saveComentario()}></FaPaperPlane>
                                </span>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        </ModalBody >
    );
}

export default Comentarios;
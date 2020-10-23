import React, { useEffect, useState, useRef } from 'react';
import { ModalBody, Button } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import axios from 'axios';
import { UrlServer } from '../../../../Utils/ServerUrlConfig';
import socket from 'socket.io-client';

// Use socket to fetch request to data 
// Socket server's url and topic in which data is sent
// const useSocket = ( topic) => {
//     const [temp, setTemp] = useState(0);
//     const [isConnected, setConnected] = useState(false);

//     useEffect(() => {
//         const client = socket.connect(UrlServer);
//         client.on("connect", () => setConnected(true));
//         client.on("disconnect", () => setConnected(false));
//         client.on(topic, (data) => {
//             setTemp(data);
//         })
//     }, [UrlServer, topic, isConnected]);
//     return { temp };
// }

function Comentarios({ id_partida }) {
    const client = socket.connect(UrlServer);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        console.log("scroll to bottom");
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
            "id_partida": id_partida
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
        console.log(request);
        await fetchComentario()
        setComentario("")
        axios.post(`${UrlServer}/postComentariosVistos`, {
            "id_partida": id_partida,
            "id_acceso": sessionStorage.getItem('idacceso')
        })
        //socket test
        client.emit("partidas_comentarios_post",
            {
                id_partida
            }
        )
    }
    function socketIni() {
        client.on("partidas_comentarios_get-" + id_partida, (data) => {
            console.log("llegada de mensaje");
            fetchComentario()
        })
    }


    return (
        <ModalBody style={{ 'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto' }}>
            <div>
                {Data.map((item, i) =>
                    <div className="comentario mb-3" key={i}>
                        <div>
                            <div>
                                <div className="float-left small"><b>{item.cargo_nombre} </b><em>{item.usuario_nombre}</em> </div>
                                <div className="float-right small">{item.fecha}</div>
                            </div>
                            <br />
                            {item.comentario}

                            <div style={{
                                position: "absolute",
                                left: "-67px",
                                top: "2px"
                            }}>
                                {/* <img src={item.cargo_imagen} width="44px" height="44px" className="rounded-circle" /> */}
                                <img src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" width="44px" height="44px" className="rounded-circle" />
                            </div>

                        </div>
                    </div>
                )}

            </div>
            <div className="input-group mt-2">
                <DebounceInput
                    placeholder="Escribe un comentario"
                    minLength={1}
                    debounceTimeout={1000}
                    onChange={e => setComentario(e.target.value)}
                    value={Comentario}
                    className="form-control"
                />
                <div className="input-group-append">
                    <Button
                        color="primary"
                        onClick={() => saveComentario()}
                    >Guardar
                    </Button>
                </div>
            </div>
            <div ref={messagesEndRef} />
        </ModalBody>
    );
}

export default Comentarios;
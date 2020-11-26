import React, { useEffect, useState, useRef } from 'react';
import { ModalBody, Button } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import { socket } from "../../Utils/socket";
function Comentarios({ dificultades_id }) {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    const [Data, setData] = useState([])
    const [Comentario, setComentario] = useState([])

    useEffect(() => {
        fetchComentario()
        socketIni()
    }, []);
    async function fetchComentario() {
        const request = await axios.post(`${UrlServer}/getDificultadesComentarios`, {
            "dificultades_id": dificultades_id
        })
        await setData(request.data);
        scrollToBottom()
    }
    async function saveComentario() {
        const request = await axios.post(`${UrlServer}/postDificultadesComentarios`,
            {
                "comentario": Comentario,
                "dificultades_id": dificultades_id,
                "accesos_id_acceso": sessionStorage.getItem('idacceso')
            }
        )
        console.log(request);
        await fetchComentario()
        setComentario("")
        await axios.post(`${UrlServer}/postDificultadesComentariosVistos`, {
            "id_dificultad": dificultades_id,
            "id_acceso": sessionStorage.getItem('idacceso')
        })
        // socket 
        console.log("dificultades_id",dificultades_id);
        socket.emit("dificultades_comentarios_post",
            {
                id_dificultad:dificultades_id
            }
        )
    }
    function socketIni() {
        console.log("escuchando","dificultades_comentarios_get-" + dificultades_id);
        socket.on("dificultades_comentarios_get-" + dificultades_id, (data) => {
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
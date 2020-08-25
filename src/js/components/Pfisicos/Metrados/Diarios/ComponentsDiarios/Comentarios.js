import React, { Component, useState } from 'react';
import { ModalBody, ModalFooter, Button } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';

function Comentarios() {
    const [DataReqCie10, setDataReqCie10] = useState([])

    const CapturarTxtComentario = async (e) => {
        // e.preventDefault()
        // console.log("ss", e.target.elements.Usuario.value);
        console.log("ss", e.target.value);
        // try {
        //     var ReqBuscar = await Axios.post("/Cie10/Buscar", {
        //         "valor": e.target.elements.Usuario.value
        //     })
        //     console.log("ReqBuscar ", ReqBuscar);
        //     setDataReqCie10(ReqBuscar.data)
        // } catch (error) {
        //     console.error("erroes al buscar el cie  10", error);
        // }
    }
    return (

        <ModalBody>
            <form>
                <div className="form-group mt-2">
                    <label htmlFor="comment"> EN DESARROLLO...(DESCRIPCIÓN / OBSERVACIÓN / CONSULTA)</label>
                    <DebounceInput
                        placeholder="Escribe un comentario"
                        minLength={1}
                        debounceTimeout={1000}
                        onChange={e => CapturarTxtComentario(e)}
                        className="form-control"
                    />
                </div>
            </form>

            <div>
                <div className="comentario mb-3">
                    <div>
                        <div>
                            <div className="float-left small"><b>RESIDENTE: </b><em>NOMBRE DEL RESIDENTE</em> </div>
                            <div className="float-right small">12 agosto 2020</div>
                        </div>
                        <br />
                    Comentario realizado en función a la partida

                    <div style={{
                            position: "absolute",
                            left: "-67px",
                            top: "2px"
                        }}>
                            <img src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" width="44px" height="44px" className="rounded-circle" />
                        </div>

                    </div>
                </div>

                <div className="comentario mb-3">
                    <div>
                        <div>
                            <div className="float-left small"><b>SUPERVISOR: </b><em>NOMBRE DEL SUPERVISOR</em> </div>
                            <div className="float-right small">12 agosto 2020</div>
                        </div>
                        <br />
                        Respuesta a la consulta realizada sobre la partida

                    <div style={{
                            position: "absolute",
                            left: "-67px",
                            top: "2px"
                        }}>
                            <img src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" width="44px" height="44px" className="rounded-circle" />
                        </div>

                    </div>
                </div>

                <div className="comentario mb-3">
                    <div>
                        <div>
                            <div className="float-left small"><b>GERENTE: </b><em>NOMBRE DEL GERENTE</em> </div>
                            <div className="float-right small">12 agosto 2020</div>
                        </div>
                        <br />
                    Observacion hecha a la consulta de los ejecutores, respuesta rápida

                    <div style={{
                            position: "absolute",
                            left: "-67px",
                            top: "2px"
                        }}>
                            <img src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" width="44px" height="44px" className="rounded-circle" />
                        </div>

                    </div>
                </div>
            </div>

        </ModalBody>
    );
}

export default Comentarios;
import React, { useState } from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';
import { MdAddAPhoto } from 'react-icons/md';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import LogoSigobras from './../../../../../images/logoSigobras.png'
import { UrlServer } from '../../../Utils/ServerUrlConfig';
export default ({ id_partida }) => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    //input img
    const [Files, setFiles] = useState();
    const [UrlFile, setUrlFile] = useState("");
    function onChangeImgMetrado(e) {
        console.log("onChangeImgMetrado");
        var inputValueImg = e.target.files[0]
        if (inputValueImg.type === "image/jpeg" || inputValueImg.type === "image/png" || inputValueImg.type === "image/jpg") {
            var url = URL.createObjectURL(inputValueImg)
            setFiles(inputValueImg)
            setUrlFile(url)
        }
    }
    function clearImg() {
        setUrlFile("")
        document.getElementById("myImage").value = "";
    }
    //descripcion
    const [Descripcion, setDescripcion] = useState("");
    //save
    async function savePartidaFoto() {
        console.log("savePartidaFoto");
        console.log("codigoObra", sessionStorage.getItem("codigoObra"));
        const formData = new FormData();
        formData.append('accesos_id_acceso', sessionStorage.getItem('idacceso'));
        formData.append('codigo_obra', sessionStorage.getItem("codigoObra"));
        formData.append("Partidas_id_partida", id_partida);
        formData.append('descripcionObservacion', Descripcion);
        formData.append('foto', Files);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        if (confirm("¿Esta seguro de guardar la imagen al sistema?")) {
            var res = await axios.post(`${UrlServer}/avancePartidaImagen`,
                formData,
                config
            )
            console.log("res", res.data);
            alert("exito")
        }
    }
    return (
        <div>
            <MdAddAPhoto size={20} onClick={toggle} />
            <Modal
                isOpen={modal}
                toggle={toggle}
                size="sm"
            >
                <ModalHeader
                >
                    <img src={LogoSigobras} width="30px" alt="logo sigobras" />
                    SIGOBRAS S.A.C.
              </ModalHeader>
                <ModalBody>

                    {
                        UrlFile &&
                        <div className="imgDelete">
                            <button
                                className="imgBtn"
                                onClick={() => clearImg()}
                            >
                                X
                                    </button>
                            <img
                                src={UrlFile}
                                alt="imagen " className="img-fluid mb-2" />
                        </div>
                    }
                    <div className="texto-rojo mb-0">
                        <b>
                            {
                                "Formatos soportados PNG, JPEG, JPG"
                            }
                        </b>
                    </div>

                    <div className="custom-file">
                        <input
                            type="file"
                            className="custom-file-input"
                            onChange={(e) => onChangeImgMetrado(e)}
                            id="myImage"
                        />
                        <label
                            className="custom-file-label"
                            htmlFor="customFile"
                        >
                            {true
                                &&
                                "SELECCIONE"
                            }
                        </label>
                    </div>

                    <div className="form-group mt-2">
                        <label htmlFor="comment">DESCRIPCIÓN / OBSERVACIÓN:</label>
                        <DebounceInput
                            cols="40"
                            rows="2"
                            minLength={0}
                            debounceTimeout={300}
                            onChange={e => setDescripcion(e.target.value)}
                            className="form-control"
                        />

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        type="submit"
                        onClick={() => savePartidaFoto()}
                    >
                        Guardar
                        </Button>
                    <Button
                        color="danger"
                        onClick={toggle}
                    >
                        Cancelar
                         </Button>
                </ModalFooter>
            </Modal>

        </div>
    )
}
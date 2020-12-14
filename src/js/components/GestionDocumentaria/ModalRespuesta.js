import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Spinner, NavItem, NavLink, CardHeader, CardBody, Button, Input, UncontrolledPopover } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
import { FaCloudUploadAlt, FaCheckCircle, FaRegWindowClose } from "react-icons/fa";
import { Picky } from 'react-picky';
export default ({ receptor_id, mensaje_id, archivoAdjunto_id, archivoAdjunto_tipo }) => {
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setLoaderShow(false)
        setModal(!modal)
    };

    const [FormularioAsunto, setFormularioAsunto] = useState("");
    const [FormularioDescripcion, setFormularioDescripcion] = useState("");
    async function FormularioEnviar() {
        try {
            setLoaderShow(true)
       
            var res = await axios.post(`${UrlServer}/gestiondocumentaria_respuestas`,
                {
                    "asunto": FormularioAsunto,
                    "descripcion": FormularioDescripcion,
                    "emisor_id": sessionStorage.getItem('idobra'),
                    "receptor_id": receptor_id,
                    "mensaje_id": mensaje_id
                }
            )
            console.log("res", res);

            if (res.status == 200) {
                if (FormularioArchivoAdjunto) {
                    const formData = new FormData();
                    formData.append('obra_codigo', sessionStorage.getItem('codigoObra'));
                    formData.append('gestiondocumentaria_respuestas_id', res.data.insertId);
                    formData.append('archivoAdjunto', FormularioArchivoAdjunto);
                    formData.append('tipoDocumento', archivoAdjunto_tipo);
                    formData.append('tipoDocumento_id', archivoAdjunto_id);
                    var response = await axios.post(`${UrlServer}/gestiondocumentaria_mensajes_archivoAdjunto_respuesta`,
                        formData,
                        {
                            headers: {
                                'content-type': 'multipart/form-data'
                            }
                        }
                    )
                    console.log("archivo adjunto ", response);

                }
                setLoaderShow(false)
                alert("Mensaje enviado")
            } else {
                console.log(res.data);
                setLoaderShow(false)
                alert("hubo un problema")
            }
            toggle()
        } catch (error) {
            console.log(error.response);
            setLoaderShow(false)
            alert("hubo un problema")
        }

    }
    const [FormularioArchivoAdjunto, setFormularioArchivoAdjunto] = useState()
    async function onChangeInputFile(e) {
        console.log("onChangeInputFile");
        setFormularioArchivoAdjunto(e.target.files[0])
    }
    const [LoaderShow, setLoaderShow] = useState(false)
    return (
        <div>
            <FaCloudUploadAlt
               onClick={toggle}
                style={{
                    cursor: "pointer",
                }}
                title={"Responder"}
                size={20}
            />
            {/* <Button
                outline
                color="success"
                onClick={toggle}
            >
                Responder
            </Button> */}
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>RESPONDER</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label sm={2}>Asunto</Label>
                        <Col sm={10}>
                            <Input placeholder="asunto"
                                onChange={(e) => setFormularioAsunto(e.target.value)}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>Descripcion</Label>
                        <Col sm={10}>
                            <Input type="textarea"
                                onChange={(e) => setFormularioDescripcion(e.target.value)}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>Archivo</Label>
                        <Col sm={10}>
                            <Input type="file"
                                onChange={(e) => onChangeInputFile(e)}
                            />
                        </Col>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    {LoaderShow &&
                        <Spinner type="grow" color="primary" />
                    }
                    <Button color="primary" onClick={() => FormularioEnviar()}>GUARDAR</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>

        </div>
    )
}
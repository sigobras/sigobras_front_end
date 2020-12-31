import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig'
import { RiImageAddFill } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default ({ id_ficha, codigoObra, recargar }) => {

    const [FormularioImagenes, setFormularioImagenes] = useState({
        "descripcion": "",
        "imagen": "",
        "id_ficha": id_ficha,
        "id_acceso": sessionStorage.getItem("idacceso"),
        "codigoObra": codigoObra
    })
    const handleInputChange = (event) => {
        if (event.target.name == "imagen") {
            setFormularioImagenes({
                ...FormularioImagenes,
                [event.target.name]: event.target.files[0]
            })
        }
        else {
            setFormularioImagenes({
                ...FormularioImagenes,
                [event.target.name]: event.target.value
            })
        }
    }
    async function enviarDatos(event) {
        event.preventDefault()
        console.log("enviarDatos");
        try {
            var clone = { ...FormularioImagenes }
            const formData = new FormData();
            formData.append('id_ficha', sessionStorage.getItem('idobra'));
            formData.append('id_acceso', sessionStorage.getItem('idacceso'));
            formData.append('imagen', clone.imagen);
            formData.append('descripcion', clone.descripcion);
            formData.append('codigoObra', clone.codigoObra);
            console.log("clone", clone);
            console.log("formData", formData);
            var response = await axios.post(`${UrlServer}/obrasImagenes`,
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            )
            console.log("imagen ", response);
            // alert("Datos guardados exitosamente")
            toast.success(' Datos guardados exitosamente!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
            toggle()
            recargar(uuidv4())
        } catch (error) {
            console.log(error);
            alert("hubo un problema")
        }
    }

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    return (
        <div>
            <Button color="success" onClick={toggle}>
                <RiImageAddFill />
            </Button>
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Subir imagenes</ModalHeader>
                <Form
                    onSubmit={enviarDatos}
                >
                    <ModalBody>
                        <FormGroup row>
                            <Label for="exampleDescripcion" sm={2}>DESCRIPCION</Label>
                            <Col sm={10}>
                                <Input
                                    type="text"
                                    name="descripcion"
                                    placeholder="DESCRIPCION"
                                    required
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>IMAGEN</Label>
                            <Col sm={10}>
                                <Input
                                    type="file"
                                    name="imagen"
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"
                        // onClick={toggle}
                        >Guardar</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancelar</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div >
    )
}


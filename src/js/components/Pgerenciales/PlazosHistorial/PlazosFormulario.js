import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle, useRef } from 'react';
import axios from 'axios';
import { BiMessageAltEdit } from "react-icons/fa";
import { MdEdit,MdSave,MdDeleteForever,MdLibraryAdd } from "react-icons/md";
import { Card, Button, ButtonGroup, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, Input, Container, ModalBody, ModalHeader, ModalFooter, Modal, Table, CustomInput, Row, Col, FormGroup, Label, Form } from 'reactstrap';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import "../PlazosHistorial/Plazos.css";
import { object } from 'prop-types';

export default forwardRef(({ id_padre,recarga }, ref) => {


    useEffect(() => {
        fetchPlazosTipoPadre()
        fetchPlazosTipoHijo()
        return () => {
        }
    }, [])

    const [modal, setModal] = useState(false);

    const toggleModal = () => setModal(!modal);

    const [FormularioDatos, setFormularioDatos] = useState(
        {
            "tipo": "SELECCIONAR",
            "nivel": id_padre ? 2 : 1,
            "descripcion": "",
            "fecha_inicio": "",
            "fecha_final": "",
            "n_dias": 0,
            "documento_resolucion_estado": "",
            // "imagen": "",
            "observacion": "",
            "id_padre": id_padre,
            "fichas_id_ficha": sessionStorage.getItem("idobra"),
            "plazo_aprobado": false
        }
    )
    const handleInputChange = (event) => {
        // console.log(event.target.name, typeof event.target.value);

        if (event.target.name == "plazo_aprobado") {
            console.log("IF");
            setFormularioDatos({
                ...FormularioDatos,
                [event.target.name]: event.target.value == "false" ? true : false
            })
        } else {
            setFormularioDatos({
                ...FormularioDatos,
                [event.target.name]: event.target.value
            })
        }
    }

    async function enviarDatos(event) {
        event.preventDefault()
        // console.log(FormularioDatos);
        var clone = { ...FormularioDatos }
        clone.n_dias = calcular_dias(clone.fecha_inicio, clone.fecha_final)

        const res = await axios.post(`${UrlServer}/plazos`,
            clone
        )
        // console.log(res.data);
        alert(res.data.message)
        toggleModal()
        recarga(id_padre)
    }

    const [PlazosTipoPadre, setPlazosTipoPadre] = useState([])
    async function fetchPlazosTipoPadre() {
        const res = await axios.post(`${UrlServer}/getPlazosTipo`,
            {
                "nivel": 1
            }
        )
        setPlazosTipoPadre(res.data)
    }


    const [PlazosTipoHijo, setPlazosTipoHijo] = useState([])
    async function fetchPlazosTipoHijo() {
        const res = await axios.post(`${UrlServer}/getPlazosTipo`,
            {
                "nivel": 2
            }
        )
        setPlazosTipoHijo(res.data)
    }

    function calcular_dias(fecha_inicio, fecha_final) {
        // console.log(fecha_inicio, fecha_final);
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(fecha_inicio);
        const secondDate = new Date(fecha_final);
        var days = Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
        return days || 0

    }
    return (
        <div>
            {
                id_padre ?
                    <MdLibraryAdd 
                    color="#14b728" 
                    onClick={toggleModal}
                    size = "20"
                    style={{
                        cursor:"pointer"
                    }}
                    /> 
                    :
                    <Button color="danger" onClick={toggleModal}>AGREGAR ESTADO</Button> 
                    
            }
            <Modal isOpen={modal} toggle={toggleModal} >
                <ModalHeader toggle={toggleModal}>NUEVO ESTADO</ModalHeader>
                <form onSubmit={enviarDatos}>
                    <ModalBody>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>TIPO DE PLAZO</Label>
                                    <Input
                                        type="select"
                                        name="tipo"
                                        className="col-12"
                                        onChange={handleInputChange}
                                        required
                                    // value={FichaData.fecha_inicial}
                                    >
                                        <option>SELECCIONAR</option>
                                        {
                                            id_padre ?

                                                PlazosTipoHijo.map((item, i) =>
                                                    <option
                                                        value={item.idplazos_tipo}
                                                    >{item.nombre}</option>
                                                )
                                                :

                                                PlazosTipoPadre.map((item, i) =>
                                                    <option
                                                        value={item.idplazos_tipo}
                                                    >{item.nombre}</option>
                                                )
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="exampleCity">DESCRIPCION</Label>
                                    <Input
                                        type="text"
                                        name="descripcion"
                                        id="exampleCity"
                                        maxlength="300"
                                        autocomplete="off"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>FECHA INICIAL</Label>
                                    <Input
                                        type="date"
                                        name="fecha_inicio"
                                        className="col-12"
                                        onChange={handleInputChange}
                                        required
                                    // value={FichaData.fecha_inicial}

                                    >
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="exampleCity">FECHA FINAL</Label>
                                    <Input
                                        type="date"
                                        name="fecha_final"
                                        id="exampleCity"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>DIAS</Label>
                                    <Input
                                        type="text"
                                        name="n_dias"
                                        className="col-12"
                                        onChange={handleInputChange}
                                        value={calcular_dias(FormularioDatos.fecha_inicio, FormularioDatos.fecha_final)}
                                        readonly
                                    >
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="exampleCity">RESOLUCION</Label>
                                    <Input
                                        type="text"
                                        name="documento_resolucion_estado"
                                        id="exampleCity"
                                        maxlength="45"
                                        autocomplete="off"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row form>
                            <Col md={12}>
                                <FormGroup>
                                    <Label>OBSERVACION</Label>
                                    <Input
                                        type="text"
                                        name="observacion"
                                        className="col-12"
                                        maxlength="300"
                                        autocomplete="off"
                                        required
                                        onChange={handleInputChange}
                                        value={FormularioDatos.observacion}

                                    >
                                    </Input>
                                </FormGroup>
                            </Col>
                            

                        </Row>
                        <Row form>
                        <Col md={6}>
                                <FormGroup>
                                    <Label>FECHA APROBADA</Label>
                                    <Input
                                        type="date"
                                        name="fecha_aprobada"
                                        id="exampleCity"
                                        onChange={handleInputChange}
                                        value={FormularioDatos.fecha_aprobada}
                                    >
                                    </Input>
                                </FormGroup>
                            </Col>                            
                            <Col md={6}>
                                <FormGroup>
                                    <Label>PLAZO APROBADO</Label>
                                    <input
                                        type="checkbox"
                                        className="form-control"
                                        checked={FormularioDatos.plazo_aprobado}
                                        name="plazo_aprobado"
                                        value={FormularioDatos.plazo_aprobado}
                                        onClick={handleInputChange}
                                    />
                                </FormGroup>
                            </Col>
                            

                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="submit"
                            color="primary"
                            // onClick={toggleModal}
                            // onClick={
                            //     console.log("refPlazosFormulario",refPlazosFormulario),
                            //     refPlazosFormulario.current.save()
                            // }
                        >Guardar</Button>{' '}
                        <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
                    </ModalFooter>
                </form>

            </Modal>
        </div>
    )
})
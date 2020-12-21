import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { Button, Input, ModalBody, ModalHeader, ModalFooter, Modal, Row, Col, FormGroup, Label } from 'reactstrap';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import "../PlazosHistorial/Plazos.css";
import "./PlazosFormularioEdicion.css"

export default ({ data, recarga }) => {
    useEffect(() => {
        setFormularioDatos(data)
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
            "nivel": 1,
            "descripcion": "",
            "fecha_inicio": "",
            "fecha_final": "",
            "n_dias": 0,
            "documento_resolucion_estado": "",
            // "imagen": "",
            "observacion": "",
            "id_padre": null,
            "fichas_id_ficha": sessionStorage.getItem("idobra"),
            "plazo_aprobado": false,
            "fecha_aprobada": ""
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

        const res = await axios.put(`${UrlServer}/plazos`,
            clone
        )
        console.log("Que llega en plazos", res.data);
        alert(res.data.message)
        toggleModal()
        recarga()

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

    const [AsignarFechaMenor] = useState({})
    function asignarFechaMenor() {
        var clone = { ...FormularioDatos }
        console.log("CLoenene", clone);
        clone.fecha_inicio = AsignarFechaMenor
        console.log(AsignarFechaMenor);
        console.log("Formulario datos fecha inicial?", FormularioDatos.fecha_inicio);

    }
    return (
        <div>

            <Button 
            color="info" 
            outline
            onClick={toggleModal}
            >
                <MdEdit
                    
                />
            </Button>
            <Modal isOpen={modal} toggle={toggleModal} >
                <ModalHeader toggle={toggleModal}>EDICION DE ESTADO</ModalHeader>
                <form onSubmit={enviarDatos}>
                    <ModalBody>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>TIPO DE PLAZO</Label>
                                    <Input
                                        type="select"
                                        name="tipo"
                                        className="input-dark"
                                        onChange={handleInputChange}
                                        required
                                        value={FormularioDatos.tipo}
                                    >
                                        <option>SELECCIONAR</option>
                                        {
                                            FormularioDatos.nivel == 2 ?

                                                PlazosTipoHijo.map((item) =>
                                                    <option
                                                        value={item.idplazos_tipo}
                                                    >{item.nombre}</option>
                                                )
                                                :

                                                PlazosTipoPadre.map((item) =>
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
                                        className="input-dark"
                                        maxlength="300"
                                        autocomplete="off"
                                        required
                                        onChange={handleInputChange}
                                        value={FormularioDatos.descripcion}
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
                                        className="input-dark"
                                        onChange={handleInputChange}
                                        required
                                        value={FormularioDatos.fecha_inicio}
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
                                        className="input-dark"
                                        required
                                        onChange={handleInputChange}
                                        value={FormularioDatos.fecha_final}

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
                                        className="input-dark"
                                        onChange={handleInputChange}
                                        required
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
                                        className="input-dark"
                                        maxlength="45"
                                        autocomplete="off"
                                        required
                                        onChange={handleInputChange}
                                        value={FormularioDatos.documento_resolucion_estado}
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
                                        className="input-dark"
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
                                        className="input-dark"
                                        onChange={handleInputChange}
                                        value={FormularioDatos.fecha_aprobada}
                                        name = "fecha_aprobada"
                                    >
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>PLAZO APROBADO</Label>
                                    <input
                                        type="checkbox"
                                        className="form-control input-dark"
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
                            outline
                            onClick={() => asignarFechaMenor()}
                        >Guardar</Button>{' '}
                        <Button
                            color="secondary"
                            outline
                            onClick={toggleModal}>Cancelar</Button>
                    </ModalFooter>
                </form>

            </Modal>
        </div>
    )
}
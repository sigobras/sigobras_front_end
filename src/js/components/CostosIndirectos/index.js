import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle, useRef } from 'react';
import { InputGroupAddon, InputGroupText, InputGroup, Nav, NavItem, NavLink, Input, Row, Col, Form, Label, FormGroup, Button, ButtonGroup, Container, ModalBody, ModalHeader, ModalFooter, Modal, Table, CustomInput, ButtonToggle, FormText } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea,formatMoney } from '../Utils/Funciones';
import { MdEdit, MdSave, MdDeleteForever } from "react-icons/md";

export default () => {
    useEffect(() => {
        fetchDatosCostosIndirectos()
        return () => {

        }
    }, [])
    const [modal, setModal] = useState(false);

    const toggle = () => {
        if (!modal) {
            setFormularioCostosIndirectos({
                "nombre": "",
                "monto_expediente": 0,
                "monto_adicional": 0,
                "id_ficha": sessionStorage.getItem("idobra")
    
            })
        }
        setModal(!modal)};

    const [DatosCostosIndirectos, setDatosCostosIndirectos] = useState([])
    async function fetchDatosCostosIndirectos() {
        const res = await axios.get(`${UrlServer}/costosIndirectos`,
            {
                params: {
                    "id_ficha": sessionStorage.getItem("idobra")
                }
            }
        )
        // console.log("poropopo", res.data);
        setDatosCostosIndirectos(res.data)
    }

    const [FormularioCostosIndirectos, setFormularioCostosIndirectos] = useState(
        {
            "nombre": "",
            "monto_expediente": 0,
            "monto_adicional": 0,
            "id_ficha": sessionStorage.getItem("idobra")

        }
    )
    const handleInputChange = (event) => {
        if (event.target.name == "nombre") {
            setFormularioCostosIndirectos({
                ...FormularioCostosIndirectos,
                [event.target.name]: event.target.value
            })    
        }else{
            setFormularioCostosIndirectos({
                ...FormularioCostosIndirectos,
                [event.target.name]: formatMoney(event.target.value)
            })
        }
        
    }


    async function enviarDatos(event) {
        event.preventDefault()
        // console.log(FormularioDatos);
        var clone = { ...FormularioCostosIndirectos }
        clone.monto_expediente = clone.monto_expediente.replace(/[^0-9\.-]+/g, "")    
        clone.monto_adicional = clone.monto_adicional.replace(/[^0-9\.-]+/g, "")
        const res = await axios.post(`${UrlServer}/costosIndirectos`,
            clone
        )
        // console.log(res.data);
        alert("Sus datos fueron guardados correctamente")
        toggle()

        fetchDatosCostosIndirectos()
    }

    async function deleteCostoIndirecto(id) {
        // console.log("index", id);
        if (confirm("Esta seguro que desea eliminar este Costo Indirecto?")) {
            const res = await axios.delete(`${UrlServer}/costoIndirecto`,
                {
                    data:
                    {
                        "id": id
                    }
                }
            )
            // console.log(res.data);
            alert("se elimino registro con exito")
            fetchDatosCostosIndirectos()
        }
    }

    function montoExpediente() {
        // console.log("Mis datos", DatosCostosIndirectos);
        var suma = 0
        for (let i = 0; i < DatosCostosIndirectos.length; i++) {
            const element = DatosCostosIndirectos[i];
            // console.log("elemet", element.monto_expediente);
            suma = suma + element.monto_expediente
        }
        // console.log("Suma", suma);
        return suma
    }
    function montoAdicional() {
        // console.log("Mis datos", DatosCostosIndirectos);
        var suma = 0
        for (let i = 0; i < DatosCostosIndirectos.length; i++) {
            const element = DatosCostosIndirectos[i];
            // console.log("elemet", element.monto_adicional);
            suma = suma + element.monto_adicional
        }
        // console.log("Suma", suma);
        return suma
    }





    return (


        <div>
            <Button color="primary" onClick={toggle} outline>Agregar Costo Indirecto</Button>
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Costos Indirectos</ModalHeader>
                <Form
                    onSubmit={enviarDatos}
                >
                    <ModalBody>
                        <FormGroup>
                            <Label for="examplenombre">DESCRIPCIÓN</Label>
                            <Input
                                type="text"
                                name="nombre"
                                id="examplenombre"
                                placeholder="DESCRIPCIÓN"
                                required
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleMontoAprobado">EXPEDIENTE TECNICO APROBADO</Label>
                            <Input
                                type="text"
                                maxLength="13"
                                name="monto_expediente"
                                id="exampleMontoAprobado"
                                placeholder="EXPEDIENTE TECNICO APROBADO"
                                required
                                onChange={handleInputChange}
                                value={FormularioCostosIndirectos.monto_expediente}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleAdicionalAprobado">ADICIONAL APROBADO</Label>
                            <Input
                                // type="text"
                                // step="any"
                                // pattern="\d"
                                maxLength="13"

                                type="text"
                                // min="0.01"
                                // max="9999999999999"
                                // step="any"
                                name="monto_adicional"
                                id="exampleAdicionalAprobado"
                                placeholder="ADICIONAL APROBADO"
                                required
                                onChange={handleInputChange}
                                value={FormularioCostosIndirectos.monto_adicional}
                            />
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            // onClick={toggle}
                            outline
                        >Guardar</Button>{' '}
                        <Button color="secondary" onClick={toggle} outline>Cancelar</Button>
                    </ModalFooter>
                </Form>
            </Modal>
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>DESCRIPCIÓN</th>
                            <th>EXPEDIENTE TECNICO APROBADO</th>
                            <th>ADICIONAL APROBADO</th>
                            <th>PARCIAL</th>
                            <th>OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            DatosCostosIndirectos.map((item, i) =>
                                <tr>
                                    <th scope="row">{i + 1}</th>
                                    <td>{item.nombre}</td>
                                    <td>{Redondea(item.monto_expediente)}</td>
                                    <td>{Redondea(item.monto_adicional)}</td>
                                    <td>{Redondea(item.monto_expediente + item.monto_adicional)}</td>
                                    <tr>
                                        <FormularioEdicion
                                            data={item}
                                            recarga={fetchDatosCostosIndirectos}
                                        />
                                        <td>
                                            <Button
                                                color="info"
                                                onClick={() => deleteCostoIndirecto(item.id)}
                                                outline
                                            >
                                                <MdDeleteForever />
                                            </Button>
                                        </td>

                                    </tr>
                                </tr>
                            )
                        }
                        <tr>
                            <th></th>
                            <th>TOTAL</th>
                            <th>{Redondea(montoExpediente())}</th>
                            <th>{Redondea(montoAdicional())}</th>
                            <th>{
                                (() => Redondea(DatosCostosIndirectos.reduce(
                                    (accumulator, item) => accumulator + item.monto_expediente + item.monto_adicional, 0
                                ))
                                )()
                            }</th>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

function FormularioEdicion({ data, recarga }) {
    useEffect(() => {
        var clone = {...data}
        clone.monto_expediente = Redondea(clone.monto_expediente)
        clone.monto_adicional = Redondea(clone.monto_adicional)
        setFormularioEdicion(clone)
        return () => {

        }
    }, [])
    // console.log("Data que llega", data);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [FormularioEdicion, setFormularioEdicion] = useState({
        "nombre": "",
        "monto_expediente": 0,
        "monto_adicional": 0,
        // "id":FormularioEdicion.id
    })
    // console.log("Ahora si?", FormularioEdicion);

    const handleInputChange = (event) => {
        // console.log(event.target.name, typeof event.target.value);
        if (event.target.name == "nombre") {
            setFormularioEdicion({
                ...FormularioEdicion,
                [event.target.name]: event.target.value
            })    
        }else{
            setFormularioEdicion({
                ...FormularioEdicion,
                [event.target.name]: formatMoney(event.target.value)
            })
        }


    }

    async function enviarDatos(event) {
        event.preventDefault()
        // console.log(FormularioDatos);
        var clone = { ...FormularioEdicion }
        console.log("cloneedicion",clone);
        clone.monto_expediente = clone.monto_expediente.replace(/[^0-9\.-]+/g, "")    
        clone.monto_adicional = clone.monto_adicional.replace(/[^0-9\.-]+/g, "")
        console.log("clone enviar",clone);
        const res = await axios.put(`${UrlServer}/costoIndirecto`,
            clone
        )
        // console.log("Que llega en plazos", res.data);
        alert(res.data.message)
        toggle()
        recarga()
    }

    return (

        <td>
            <Button
                color="info"
                onClick={toggle}
                outline
            >
                <MdEdit />
            </Button>
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Costos Indirectos</ModalHeader>
                <Form
                    onSubmit={enviarDatos}
                >
                    <ModalBody>
                        <FormGroup>
                            <Label for="examplenombre">DESCRIPCIÓN</Label>
                            <Input
                                type="text"
                                name="nombre"
                                id="examplenombre"
                                placeholder="DESCRIPCIÓN"
                                required
                                value={FormularioEdicion.nombre}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleMontoAprobado">EXPEDIENTE TECNICO APROBADO</Label>
                            <Input
                                type="text"
                                maxLength="13"
                                // min="0.01"
                                // max="9999999999999"
                                // step="any"
                                name="monto_expediente"
                                id="exampleMontoAprobado"
                                placeholder="EXPEDIENTE TECNICO APROBADO"
                                required
                                value={FormularioEdicion.monto_expediente}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleAdicionalAprobado">ADICIONAL APROBADO</Label>
                            <Input
                                type="text"
                                maxLength="13"
                                // min="0.01"
                                // max="9999999999999"
                                // step="any"
                                name="monto_adicional"
                                id="exampleAdicionalAprobado"
                                placeholder="ADICIONAL APROBADO"
                                required
                                value={FormularioEdicion.monto_adicional}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            // onClick={toggle}
                            outline
                        >Guardar</Button>{' '}
                        <Button color="secondary" onClick={toggle} outline>Cancelar</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </td>

    )
}
import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Spinner, NavItem, NavLink, CardHeader, CardBody, Button, Input, UncontrolledPopover } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
import { Picky } from 'react-picky';
import { BsPlusCircleFill } from "react-icons/bs";
import { socket } from "../Utils/socket";

export default ({ recargar }) => {
    const [modal, setModal] = useState(false);
    const toggle = () => {
        if (!modal) {
            fetchObras()
            fetchCargos()
            fetchTipoArchivoS()
        }
        setModal(!modal)
    };
    //obras
    const [Obras, setObras] = useState([]);
    async function fetchObras() {
        var res = await axios.post(`${UrlServer}/listaObrasByIdAcceso`, {
            id_acceso: sessionStorage.getItem("idacceso"),
            id_tipoObra: 0
        })
        setObras(res.data)
    }
    const [ObrasSeleccionadas, setObrasSeleccionadas] = useState([]);
    const [ObrasSeleccionadasProcesado, setObrasSeleccionadasProcesado] = useState([]);
    // cargos
    const [Cargos, setCargos] = useState([]);
    async function fetchCargos() {
        var res = await axios.get(`${UrlServer}/listaCargos`)
        setCargos(res.data)
    }
    const [CargoSeleccionado, setCargoSeleccionado] = useState("SELECCIONE");

    //formulario
    const [FormularioAsunto, setFormularioAsunto] = useState("");
    const [FormularioDescripcion, setFormularioDescripcion] = useState("");
    async function FormularioEnviar() {
        try {
            if (TipoArchivoSSeleccionado != "SELECCIONE" && 
            CargoSeleccionado != "SELECCIONE" &&
             ObrasSeleccionadas.length > 0 &&
             FormularioAsunto.trim() != "" &&
             FormularioDescripcion.trim() != ""
             ) {
                setLoaderShow(true)
                var obrasSeleccionadasProcesadas = []
                ObrasSeleccionadas.forEach(item => {
                    obrasSeleccionadasProcesadas.push([item.id_ficha, CargoSeleccionado])
                });
                console.log({
                    "mensaje": {
                        "emisor_id": sessionStorage.getItem('idacceso'),
                        "asunto": FormularioAsunto,
                        "descripcion": FormularioDescripcion
                    },
                    "receptores": obrasSeleccionadasProcesadas
                });
                var res = await axios.post(`${UrlServer}/gestiondocumentaria_mensajes`,
                    {
                        "mensaje": {
                            "emisor_id": sessionStorage.getItem('idacceso'),
                            "asunto": FormularioAsunto,
                            "descripcion": FormularioDescripcion
                        },
                        "receptores": obrasSeleccionadasProcesadas
                    }

                )
                if (res.status == 200) {
                    if (FormularioArchivoAdjunto) {
                        //adjuntamos archivo
                        const formData = new FormData();
                        formData.append('obra_codigo', sessionStorage.getItem('codigoObra'));
                        formData.append('id_acceso', sessionStorage.getItem('idacceso'));
                        formData.append('gestiondocumentaria_mensajes_id', res.data.insertId);
                        formData.append('archivoAdjunto', FormularioArchivoAdjunto);
                        formData.append('tipoDocumento', TipoArchivoS.find(element => element.id == TipoArchivoSSeleccionado).tipo);
                        formData.append('tipoDocumento_id', TipoArchivoSSeleccionado);
                        var response = await axios.post(`${UrlServer}/gestiondocumentaria_mensajes_archivoAdjunto`,
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
                    recargar()
                    alert("registro exitoso")

                } else {
                    console.log(res.data);
                    setLoaderShow(false)
                    alert("hubo un problema")
                }
                toggle()
                setTipoArchivoSSeleccionado("SELECCIONE")
                //socket
                socket.emit("gestion_documentaria_principal",
                    {
                        id_ficha: + sessionStorage.getItem('idobra')
                    }
                )

            }
            else {
                alert("falta seleccionar algunos campos")
            }

        } catch (error) {
            console.log(error.response);
            alert("hubo un problema")
        }

    }
    const [FormularioArchivoAdjunto, setFormularioArchivoAdjunto] = useState()
    async function onChangeInputFile(e) {
        console.log("onChangeInputFile");
        setFormularioArchivoAdjunto(e.target.files[0])
    }
    //select tipo de archivos
    const [TipoArchivoS, setTipoArchivoS] = useState([])
    async function fetchTipoArchivoS() {
        console.log("cargando tipo de archivos");
        var res = await axios.get(`${UrlServer}/gestiondocumentaria_archivosadjuntos_tipos`)
        console.log(res.data);
        setTipoArchivoS(res.data)
    }
    const [TipoArchivoSSeleccionado, setTipoArchivoSSeleccionado] = useState("SELECCIONE")
    const [LoaderShow, setLoaderShow] = useState(false)
    return (
        <div>
            <button
                style={{
                    borderRadius: "20px",
                    height: "36px",
                    width: "125px",
                    position: "relative",
                    border: "1px solid #242526"
                }}
                onClick={toggle}
            >
                <div
                    style={{
                        fontWeight: " 700",
                        color: " #242526",
                        position: "absolute",
                        top: "6px",
                        right: "49px",
                        fontSize: "15px"
                    }}
                >
                    NUEVO
                </div>
                <div>
                    <BsPlusCircleFill
                        color="#0080ff"
                        size={20}
                        style={{
                            position: "absolute",
                            top: "7px",
                            right: "9px",
                        }}
                    />
                </div>

            </button>

            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Nuevo Documento</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label sm={2}>Obras</Label>
                        <Col sm={10}>
                            <Picky
                                options={Obras}
                                value={ObrasSeleccionadas}
                                onChange={setObrasSeleccionadas}
                                open={false}
                                valueKey="id_ficha"
                                labelKey="codigo"
                                multiple={true}
                                includeSelectAll={true}
                                includeFilter={true}
                                dropdownHeight={200}
                                placeholder={"No hay datos seleccionados"}
                                allSelectedPlaceholder={"seleccionaste todo"}
                                manySelectedPlaceholder={"tienes %s seleccionados"}
                                className="text-dark"
                                selectAllText="Todos"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>Cargos</Label>
                        <Col sm={10}>
                            <Input
                                type="select"
                                onChange={(e) => {
                                    console.log("target", e.target.value);
                                    setCargoSeleccionado(e.target.value)
                                }}
                                value={CargoSeleccionado}
                            >
                                <option disabled hidden>SELECCIONE</option>
                                {
                                    Cargos.map((item, i) =>
                                        <option value={item.id_Cargo}>{item.nombre}</option>
                                    )
                                }
                            </Input>
                        </Col>
                    </FormGroup>

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
                        <Label sm={2}>Tipo de archivo</Label>
                        <Col sm={10}>
                            <Input
                                type="select"
                                onChange={(e) => {
                                    console.log("target", e.target.value);
                                    setTipoArchivoSSeleccionado(e.target.value)
                                }}
                                value={TipoArchivoSSeleccionado}

                            >
                                <option disabled hidden>SELECCIONE</option>
                                {TipoArchivoS.map((item, i) =>
                                    <option
                                        value={item.id}
                                    >
                                        {item.tipo}
                                    </option>
                                )}
                            </Input>

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
import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Nav, NavItem, NavLink, CardHeader, CardBody, Button, Input, UncontrolledPopover } from 'reactstrap';
import MultiSelect from "@khanacademy/react-multi-select";
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
import { Picky } from 'react-picky';
export default () => {
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
    const [CargosSeleccionados, setCargosSeleccionados] = useState([]);
    const [CargosSeleccionadosProcesado, setCargosSeleccionadosProcesado] = useState([]);
    //usuarios
    const [Usuarios, setUsuarios] = useState([]);
    const [UsuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
    async function fetchUsuarios() {
        var res = await axios.post(`${UrlServer}/getUsuariosByFichas`,
            {
                "id_acceso": sessionStorage.getItem('idacceso'),
                "id_ficha": ObrasSeleccionadasProcesado,
                "id_cargo": CargosSeleccionadosProcesado
            }
        )
        if (Array.isArray(res.data)) {
            setUsuarios(res.data)
        }
    }
    useEffect(() => {
        var clone = []
        ObrasSeleccionadas.forEach(item => {
            clone.push(item.id_ficha)
        });
        setObrasSeleccionadasProcesado(clone)
    }, [ObrasSeleccionadas])
    useEffect(() => {
        fetchUsuarios()
    }, [ObrasSeleccionadasProcesado])

    useEffect(() => {
        var clone = []
        CargosSeleccionados.forEach(item => {
            clone.push(item.id_Cargo)
        });
        setCargosSeleccionadosProcesado(clone)
    }, [CargosSeleccionados])
    useEffect(() => {
        fetchUsuarios()
    }, [CargosSeleccionadosProcesado])
    //formulario
    const [FormularioAsunto, setFormularioAsunto] = useState("");
    const [FormularioDescripcion, setFormularioDescripcion] = useState("");
    async function FormularioEnviar() {
        try {
            if (FormularioArchivoAdjunto &&TipoArchivoSSeleccionado != "SELECCIONE") {
                var usuariosSeleccionadosProcesados = []
                UsuariosSeleccionados.forEach(item => {
                    usuariosSeleccionadosProcesados.push([item.id])
                });
                var res = await axios.post(`${UrlServer}/gestiondocumentaria_mensajes`,
                    {
                        "mensaje": {
                            "emisor_id": sessionStorage.getItem('idacceso'),
                            "asunto": FormularioAsunto,
                            "descripcion": FormularioDescripcion
                        },
                        "receptores": usuariosSeleccionadosProcesados
                    }

                )
                if (res.status == 200) {
                    //adjuntamos archivo
                    const formData = new FormData();
                    formData.append('obra_codigo', sessionStorage.getItem('codigoObra'));
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
                    alert("registro exitoso")
                } else {
                    console.log(res.data);
                    alert("hubo un problema")
                }
                toggle()
                setTipoArchivoSSeleccionado("SELECCIONE")
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
    return (
        <div>

            <Button
                outline
                color="danger"
                onClick={toggle}
            >
                Nuevo Documento
            </Button>
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
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
                            <Picky
                                options={Cargos}
                                value={CargosSeleccionados}
                                onChange={setCargosSeleccionados}
                                open={false}
                                valueKey="id_Cargo"
                                labelKey="nombre"
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
                        <Label sm={2}>Usuarios</Label>
                        <Col sm={10}>
                            <Picky
                                options={Usuarios}
                                value={UsuariosSeleccionados}
                                onChange={setUsuariosSeleccionados}
                                open={false}
                                valueKey="id"
                                labelKey="nombre"
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
                        <Label sm={2}>TIPO ARCHIVO</Label>
                        <Col sm={10}>
                            <select
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

                            </select>
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
                    <Button color="primary" onClick={() => FormularioEnviar()}>GUARDAR</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>

        </div>
    )
}
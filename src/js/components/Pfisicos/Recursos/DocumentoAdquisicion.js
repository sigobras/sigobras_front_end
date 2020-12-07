import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import { FechaActual, Redondea } from '../../Utils/Funciones'
import { Card, CardHeader, CardBody, Col, Row, Modal, InputGroup, InputGroupAddon, InputGroupText, Input, Button,ModalBody ,ModalFooter } from 'reactstrap';
import { blue } from '@material-ui/core/colors';
import { DebounceInput } from 'react-debounce-input';

export default ({ fectchRecursos }) => {

    useEffect(() => {
        fetchDocumentosAdquisicion()
    }, [])

    const [DocumentosAdquisicion, setDocumentosAdquisicion] = useState([])

    async function fetchDocumentosAdquisicion() {
        const res = await axios.get(`${UrlServer}/gettipodocumentoAdquisicion`)
        console.log("-------->", res.data);
        if (Array.isArray(res.data)) {
            setDocumentosAdquisicion(res.data)
        }
    }

    const [OnHoverDocumento, setOnHoverDocumento] = useState('')

    async function updateRecursoDocumentoAdquisicionPrincipal() {
        setDocumentosAdquisicion([])
        const res = await axios.post(`${UrlServer}/updateRecursoDocumentoAdquisicion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": ModalSaveTipo,
                "descripcion": ModalSaveDescripcion,
                "codigo": ModalSaveCodigo,
                "id_tipoDocumentoAdquisicion": ModalSaveIdDocumento
            }
        )
        fetchDocumentosAdquisicion()
        toggle()
        fectchRecursos()
        // fetchRecursosByTipoData()
        // fectchRecursos()
        // setToggleInput(!ToggleInput)
        // fectchDocumentoAdquisicion()
    }

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const [ModalSaveDescripcion, setModalSaveDescripcion] = useState('')
    const [ModalSaveTipo, setModalSaveTipo] = useState('')
    const [ModalSaveCodigo, setModalSaveCodigo] = useState('')
    const [ModalSaveIdDocumento, setModalSaveIdDocumento] = useState('')
    return (
        <div>
            {
                DocumentosAdquisicion.map((item, i) =>
                    <Card key={i} className="mb-2">
                        <CardHeader
                            className="p-1"
                            onDragOver={(e) => {
                                e.preventDefault();
                                setOnHoverDocumento(item.nombre_largo)
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                            }}
                            onDrop={(e) => {
                                setOnHoverDocumento("")
                                console.log("SetOnHover");
                                var descripcion = e.dataTransfer.getData("descripcion")
                                console.log("descripcion", descripcion);
                                var tipo = e.dataTransfer.getData("tipo")
                                // updateRecursoDocumentoAdquisicionPrincipal(tipo, descripcion, item.codigo)
                                setModalSaveDescripcion(descripcion)
                                setModalSaveTipo(tipo)
                                setModalSaveIdDocumento(item.id_tipoDocumentoAdquisicion)
                                toggle()
                            }}
                            style={
                                OnHoverDocumento == (item.nombre_largo) ?
                                    {
                                        backgroundColor: 'blue'
                                    }
                                    :
                                    {
                                        backgroundColor: '#242526'
                                    }
                            }
                        >
                            {`${item.nombre_largo} `}
                            <span className="badge badge-primary">
                                <DocumentosAdquisicionTipoCantidad id_tipoDocumentoAdquisicion={item.id_tipoDocumentoAdquisicion} />
                            </span>
                        </CardHeader>

                        <CardBody>
                            <div className="p-1 d-flex flex-wrap">
                                <RecursosByTipo id_tipoDocumentoAdquisicion={item.id_tipoDocumentoAdquisicion} documentoAdquision_nombre={item.nombre} fectchRecursos={fectchRecursos} />
                            </div>
                        </CardBody>
                    </Card>
                )

            }
            <Modal isOpen={modal} toggle={toggle} >
                <ModalBody>
                    
                    <DebounceInput
                    // value={DocumentoAdquisicion.codigo}
                    debounceTimeout={300}
                    onChange={e => setModalSaveCodigo(e.target.value)}
                    type="text"
                />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>{updateRecursoDocumentoAdquisicionPrincipal()}}>Guardar</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>


            </Modal>

        </div >
    )
}

function DocumentosAdquisicionTipoCantidad({ id_tipoDocumentoAdquisicion }) {
    useEffect(() => {
        fetchDocumentosAdquisicionTipoCantidad()
        return () => {

        }
    }, [])

    const [DocumentosAdquisicionTipoCantidad, setDocumentosAdquisicionTipoCantidad] = useState([])

    async function fetchDocumentosAdquisicionTipoCantidad() {
        const res = await axios.post(`${UrlServer}/getTipoDocumentoAdquisicionTotal`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "id_tipoDocumentoAdquisicion": id_tipoDocumentoAdquisicion
            }
        )
        setDocumentosAdquisicionTipoCantidad(res.data.n_elementos)
        console.log("res.data", res.data);
    }

    return (
        <div>{DocumentosAdquisicionTipoCantidad}</div>
    )
}

function RecursosByTipo({ id_tipoDocumentoAdquisicion, documentoAdquision_nombre, fectchRecursos }) {
    useEffect(() => {
        fetchRecursosByTipoData()
        return () => {

        }
    }, [])

    const [RecursosByTipoData, setRecursosByTipoData] = useState([])

    async function fetchRecursosByTipoData() {
        const res = await axios.post(`${UrlServer}/getRecursosEjecucionRealByTipoDocumentoAdquisicion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "id_tipoDocumentoAdquisicion": id_tipoDocumentoAdquisicion
            }
        )
        setRecursosByTipoData(res.data)
        console.log("res.data", res.data);
    }
    // Secccion Modal
    const [modal, setModal] = useState(false);

    const toggle = (codigo) => {
        if (!modal) {
            fetchModalRecursosDetalle(codigo)
        }
        setModal(!modal)
    };

    const [ModalRecursosDetalle, setModalRecursosDetalle] = useState([])

    async function fetchModalRecursosDetalle(codigo) {
        const res = await axios.post(`${UrlServer}/getRecursosEjecucionRealByTipoAndCodigo`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "id_tipoDocumentoAdquisicion": id_tipoDocumentoAdquisicion,
                codigo: codigo
            }
        )
        setModalRecursosDetalle(res.data)
        console.log("res.data fetchModalRecursosDetalle", res.data);
    }

    const [OnHoverCodigo, setOnHoverCodigo] = useState(false)

    async function updateRecursoDocumentoAdquisicion(tipo, descripcion, codigo) {
        const res = await axios.post(`${UrlServer}/updateRecursoDocumentoAdquisicion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": tipo,
                "descripcion": descripcion,
                "codigo": codigo,
                "id_tipoDocumentoAdquisicion": id_tipoDocumentoAdquisicion
            }
        )
        fetchRecursosByTipoData()
        fectchRecursos()
        // setToggleInput(!ToggleInput)
        fectchDocumentoAdquisicion()
    }

    return (
        <div>
            {
                RecursosByTipoData.map((item, i) =>
                    <div

                        className="divCodigoRecur" key={i}
                        // onDragOver={item.bloqueado !== 1 ? (e) => this.onDragOver(e) : ""}
                        // onDrop={(e) => { this.onDrop(e, "completado", item.codigo, i, i, item.idDocumento) }}
                        onClick={
                            () => toggle(item.codigo)
                        }
                        onDragOver={(e) => {
                            e.preventDefault();
                            setOnHoverCodigo(documentoAdquision_nombre + item.codigo)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                        }}
                        onDrop={(e) => {
                            setOnHoverCodigo("")
                            console.log("SetOnHover");
                            var descripcion = e.dataTransfer.getData("descripcion")
                            console.log("descripcion", descripcion);
                            var tipo = e.dataTransfer.getData("tipo")
                            updateRecursoDocumentoAdquisicion(tipo, descripcion, item.codigo)
                        }}
                        style={
                            OnHoverCodigo == (documentoAdquision_nombre + item.codigo) ?
                                {
                                    backgroundColor: 'blue'
                                }
                                :
                                {
                                    backgroundColor: '#242526'
                                }
                        }
                    >

                        {`${documentoAdquision_nombre} ${item.codigo} `}
                        <span className="badge badge-primary">
                            {item.n_elementos}
                        </span>
                    </div>
                )
            }
            < Modal
                isOpen={modal} toggle={toggle}>
                <div className="table-responsive">

                    <div className="clearfix mb-2">
                        <div className="h5 float-left">nombre documento</div>

                        <button type="submit" className="float-right mr-2 btn btn-outline-success">Guardar</button>
                    </div>


                    <InputGroup size="sm" className="mb-2 px-1">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                ESPECÍFICA
                            </InputGroupText>
                        </InputGroupAddon>

                        <Input placeholder="INGRESE LA ESPECÍFICA ( 1.1.4 2 )" />
                        <InputGroupAddon addonType="prepend">
                            <Button outline color="primary"  >BUSCAR</Button>
                        </InputGroupAddon>

                    </InputGroup>


                    <div className="d-flex">

                        <InputGroup size="sm" className="mb-2 px-1">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    RAZÓN SOCIAL
                </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="INGRESE " />
                        </InputGroup>

                        <InputGroup size="sm" className="mb-2 px-1">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    RUC
                  </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="INGRESE" />
                        </InputGroup>
                    </div>

                    <div className="d-flex">

                        <InputGroup size="sm" className="mb-2 px-1">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    nombre codigo
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input disabled />
                        </InputGroup>


                        <InputGroup size="sm" className="mb-2 px-1">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    FECHA
                  </InputGroupText>
                            </InputGroupAddon>
                            <Input type="date" placeholder="INGRESE" />
                        </InputGroup>


                        <InputGroup size="sm" className="mb-2 px-1">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    SIAF
                  </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="INGRESE" />
                        </InputGroup>


                        <InputGroup size="sm" className="mb-2 px-1">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    N° C / P
                  </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="INGRESE" />
                        </InputGroup>

                    </div>

                    <table className="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>RECURSO</th>
                                <th>UND</th>
                                <th>CANTIDAD</th>
                                <th>PRECIO S/.</th>
                                <th>PARCIAL S/.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {

                                ModalRecursosDetalle.map((item, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td> {item.descripcion} </td>
                                        <td> {item.unidad} </td>
                                        <td>

                                            {item.cantidad}
                                        </td>

                                        <td >
                                            {item.precio}
                                        </td>
                                        <td> {item.parcial}</td>
                                    </tr>
                                )
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="5">TOTAL</td>
                                <td>S/.
                                    {/* {TotalParcial} */}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                </div>

            </Modal>

        </div>


    )
}
import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle } from 'react';
import { InputGroupAddon, InputGroupText, InputGroup, Nav, NavItem, NavLink, Button, Input, Row, Col } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import { FechaActual, Redondea } from '../../Utils/Funciones'
import { MdFirstPage, MdChevronLeft, MdChevronRight, MdLastPage, MdCompareArrows, MdClose, MdSearch, MdExtension, MdVisibility, MdMonetizationOn, MdWatch, MdLibraryBooks, MdSave, MdModeEdit, MdEdit } from 'react-icons/md';
import { FaSuperpowers, FaPlus } from 'react-icons/fa';
import { DebounceInput } from 'react-debounce-input';
import DocumentoAdquisicion from './DocumentoAdquisicion';

export default () => {
    useEffect(() => {
        fectchRecursosTipo()
        fetchTipoDocumentoAdquisicion()
    }, []);
    // ------------------------------------> Materiles

    const [RecursosTipo, setRecursosTipo] = useState([]);
    async function fectchRecursosTipo() {
        const res = await axios.post(`${UrlServer}/getmaterialesResumenTipos`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        setRecursosTipo(res.data)
        onChangeRecursoTiposSeleccionado(res.data[0])
        // console.log("res.dataMateriales", res.data);
    }
    const [RecursoTipoSelecccionado, setRecursoTipoSelecccionado] = useState({});
    function onChangeRecursoTiposSeleccionado(RecursoTipo) {
        setRecursoTipoSelecccionado(RecursoTipo)
        // console.log("onChangeRecursoTiposSeleccionado");
    }

    // --------------------------> Recursos

    const [Recursos, setRecursos] = useState([]);

    async function fectchRecursos() {
        console.log("Activandose");
        const res = await axios.post(`${UrlServer}/getResumenRecursos`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "texto_buscar": TextoBuscado,
                "inicio": (PaginaActual - 1) * CantidadPaginasRecursos,
                "cantidad_datos": Number(CantidadPaginasRecursos),
            }
        )

        setRecursos(res.data)
    }
    async function fectchRecursos2() {
        console.log("Activandose");
        setRecursos([])
        const res = await axios.post(`${UrlServer}/getResumenRecursos`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "texto_buscar": TextoBuscado,
                "inicio": (PaginaActual - 1) * CantidadPaginasRecursos,
                "cantidad_datos": Number(CantidadPaginasRecursos),
            }
        )

        setRecursos(res.data)
    }
    function updateRecurso(index, avance) {
        var clone = [...Recursos]
        clone[index].avance = avance
        setRecursos(clone)
    }

    // --------------->Paginacion
    const [CantidadPaginasRecursos, setCantidadPaginasRecursos] = useState(15);
    async function onChangeCantidadPaginasRecursos(value) {
        setCantidadPaginasRecursos(value)
    }
    const [PaginaActual, setPaginaActual] = useState(1);
    function onChangePaginaActual(pagina) {
        setPaginaActual(pagina)
    }
    const [TextoBuscado, setTextoBuscado] = useState('');
    const [ConteoRecursos, setConteoRecursos] = useState([]);
    async function fectchConteoRecursos() {
        const request = await axios.post(`${UrlServer}/getResumenRecursosConteoDatos`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "texto_buscar": TextoBuscado,
            }
        )
        setConteoRecursos(request.data.total)
    }



    const [TipoDocumentoAdquisicion, setTipoDocumentoAdquisicion] = useState([])
    const [InputRecursoTipoDocumentoAdquisicion, setInputRecursoTipoDocumentoAdquisicion] = useState('SELECCIONE')
    async function fetchTipoDocumentoAdquisicion() {
        const res = await axios.get(`${UrlServer}/gettipodocumentoadquisicion`)
        setTipoDocumentoAdquisicion(res.data)
    }
    const [ModoEditar, setModoEditar] = useState(false)

    function toggleModoEditar() {
        setModoEditar(!ModoEditar)
        // fectchRecursos()
    }
    useEffect(() => {
        setPaginaActual(1)
    }, [RecursoTipoSelecccionado, TextoBuscado]);
    useEffect(() => {
        fectchConteoRecursos()
    }, [RecursoTipoSelecccionado, TextoBuscado]);
    useEffect(() => {
        fectchRecursos()
    }, [ModoEditar, CantidadPaginasRecursos, RecursoTipoSelecccionado, PaginaActual, TextoBuscado,]);

    //Activar funciones de hermanitos
    const [RefParcial, setRefParcial] = useState([]);
    const [RefDiferencia, setRefDiferencia] = useState([]);
    const [RefPorcentaje, setRefPorcentaje] = useState([]);

    function activeChildFunctions(descripcion) {
        console.log("Activando");
        RefParcial[descripcion].recarga()
        RefDiferencia[descripcion].recarga()
        RefPorcentaje[descripcion].recarga()
    }
    const [InterfazDocumentoAdquisicion, setInterfazDocumentoAdquisicion] = useState(false)
    return (
        <div>
            <Nav tabs>
                {
                    RecursosTipo.map((item, i) =>
                        <NavItem key={i}>
                            <NavLink
                                className={RecursoTipoSelecccionado.tipo == item.tipo && 'active'}
                                onClick={() => onChangeRecursoTiposSeleccionado(item)}
                            >
                                {item.tipo}
                                {/* {console.log("MaterialesSelecccionado.tipo",MaterialesSelecccionado.tipo)} */}
                            </NavLink>
                        </NavItem>
                    )
                }
            </Nav>


            <Row>
                <Col xs="12">
                    <div className="float-right">
                        <InputGroup size="sm">
                            <InputGroupAddon addonType="prepend">
                                {
                                    // this.state.tipoEjecucion === true ?
                                    <Fragment>
                                        {/* { */}
                                        {/* AgregaNuevaOC === false ? */}
                                        <Button outline color="info"
                                        // onClick={this.agregaRecursoNuevo.bind(this, "agregar")}
                                        ><FaPlus /> </Button>
                                        {/* : */}
                                        <Button outline color="success"
                                        // onClick={this.GuardaNuevoRecursoApi.bind(this)}
                                        > <MdSave /></Button>
                                        {/* } */}
                                    </Fragment>
                                    // : ""
                                }

                                <Button outline color="primary"
                                    // active={this.state.tipoEjecucion === true} 
                                    // disabled={this.state.CamviarTipoVistaDrag === true} 
                                    onClick={() => {
                                        if (ModoEditar) {
                                            setInterfazDocumentoAdquisicion(false)
                                        }
                                        toggleModoEditar()

                                    }}
                                    title="asignar codigos y editar "

                                >
                                    <MdCompareArrows /> <MdModeEdit />
                                </Button>
                                {
                                    ModoEditar &&
                                    <Button outline color="info"
                                        // active={this.state.CamviarTipoVistaDrag === true} 
                                        onClick={() => setInterfazDocumentoAdquisicion(!InterfazDocumentoAdquisicion)}
                                        title="organizar">
                                        <MdExtension />
                                    </Button>
                                }
                            </InputGroupAddon>
                            <Input type="text" onChange={(event) => setTextoBuscado(event.target.value)} />
                        </InputGroup>
                    </div>
                </Col>

            </Row>
            <Row>
                <Col xs={InterfazDocumentoAdquisicion ? 9 : 12} >
                    <table className="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th colSpan={
                                    InterfazDocumentoAdquisicion ? 3 : 6
                                }
                                    className="bordeDerecho">RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN EXPEDIENTE TÉCNICO</th>
                                <th colSpan="5" > RECURSOS GASTADOS HASTA LA FECHA ( HOY {FechaActual()} )</th>
                            </tr>
                            <tr>
                                <th>N° O/C - O/S</th>
                                <th>RECURSO</th>
                                <th>UND</th>
                                {
                                    !InterfazDocumentoAdquisicion &&
                                    [
                                        <th>CANTIDAD</th>,
                                        <th>PRECIO S/.</th>,
                                        <th className="bordeDerecho" > PARCIAL S/.</th>
                                    ]
                                }
                                <th>CANTIDAD</th>
                                <th>PRECIO S/.</th>
                                <th>PARCIAL S/.</th>
                                <th>DIFERENCIA</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Recursos.map((item, i) =>
                                    <tr
                                        key={item.descripcion + ModoEditar}
                                        draggable
                                        onDragStart={(e) => {
                                            console.log("item.descripcion", item.descripcion);
                                            e.dataTransfer.setData("descripcion", item.descripcion);
                                            e.dataTransfer.setData("tipo", RecursoTipoSelecccionado);

                                        }}
                                    >
                                        <td>
                                            <Comprobante
                                                ModoEditar={ModoEditar}
                                                TipoDocumentoAdquisicion={TipoDocumentoAdquisicion}
                                                recurso={item}
                                                RecursoTipoSelecccionado={RecursoTipoSelecccionado}
                                            />
                                        </td>
                                        <td> {item.descripcion} </td>
                                        <td> {item.unidad} </td>
                                        {
                                            !InterfazDocumentoAdquisicion &&
                                            [
                                                <td> {Redondea(item.recurso_cantidad)}</td>,
                                                <td> {item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio}</td>,
                                                <td className="bordeDerecho"> {Redondea(item.recurso_cantidad * (item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio))}</td>
                                            ]
                                        }


                                        <td>
                                            <CantidadAvanzada
                                                descripcion={item.descripcion}
                                                ModoEditar={ModoEditar}
                                                RecursoTipoSelecccionado={RecursoTipoSelecccionado}
                                                activeChildFunctions={activeChildFunctions}
                                            />
                                        </td>
                                        <td>
                                            <Precio
                                                recurso={item}
                                                ModoEditar={ModoEditar}
                                                RecursoTipoSelecccionado={RecursoTipoSelecccionado}
                                                activeChildFunctions={activeChildFunctions}
                                            />

                                        </td>
                                        <td>
                                            <Parcial
                                                recurso={item}
                                                ModoEditar={ModoEditar}
                                                ref={(ref) => {
                                                    var clone = RefParcial
                                                    clone[item.descripcion] = ref
                                                    setRefParcial(clone)
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Diferencia
                                                recurso={item}
                                                ModoEditar={ModoEditar}
                                                ref={(ref) => {
                                                    var clone = RefDiferencia
                                                    clone[item.descripcion] = ref
                                                    setRefDiferencia(clone)
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <DiferenciaPorcentaje
                                                recurso={item}
                                                ModoEditar={ModoEditar}
                                                ref={(ref) => {
                                                    var clone = RefPorcentaje
                                                    clone[item.descripcion] = ref
                                                    setRefPorcentaje(clone)
                                                }}
                                            />

                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                </Col>
                {
                    InterfazDocumentoAdquisicion &&
                    <Col xs="3">

                        <DocumentoAdquisicion fectchRecursos={fectchRecursos2} />
                    </Col>
                }

            </Row>

            <div className="float-left">
                <select
                    onChange={(e) => onChangeCantidadPaginasRecursos(e.target.value)}
                    value={CantidadPaginasRecursos}
                    className="form-control form-control-sm" >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
            </div>
            <div className="float-right mr-2 ">
                <div className="d-flex text-dark">

                    <InputGroup size="sm">
                        <InputGroupAddon addonType="prepend">

                            <Button className="btn btn-light pt-0"
                                onClick={() => onChangePaginaActual(PaginaActual - 1)}
                                disabled={PaginaActual <= 1}
                            >
                                <MdChevronLeft />
                            </Button>
                            <input type="text" style={{ width: "30px" }}
                                value={PaginaActual}
                                // disabled
                                onChange={(event) => setPaginaActual(event.target.value)}
                            />
                            <InputGroupText>
                                {`de  ${Math.ceil(ConteoRecursos / CantidadPaginasRecursos)}`}
                            </InputGroupText>
                        </InputGroupAddon>

                        <InputGroupAddon addonType="append">
                            <Button className="btn btn-light pt-0"
                                onClick={() => onChangePaginaActual(PaginaActual + 1)}
                                disabled={PaginaActual >= Math.ceil(ConteoRecursos / CantidadPaginasRecursos)}
                            >
                                <MdChevronRight />
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>

                </div>
            </div>


        </div>
    )
}
//Destructuracion 

function Comprobante({ ModoEditar, TipoDocumentoAdquisicion, recurso, RecursoTipoSelecccionado }) {
    useEffect(() => {
        fectchDocumentoAdquisicion()
    }, [])

    const [DocumentoAdquisicion, setDocumentoAdquisicion] = useState({});

    async function fectchDocumentoAdquisicion() {
        const ejecucionReal = await axios.post(`${UrlServer}/getResumenRecursosRealesByDescripcion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "descripcion": recurso.descripcion
            }
        )
        setDocumentoAdquisicion(ejecucionReal.data)
        if (ejecucionReal.data) {
            setInput2(ejecucionReal.data.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion)
        }
    }

    const [ToggleInput, setToggleInput] = useState(false)
    // Edicion 
    const [Input, setInput] = useState();
    const [Input2, setInput2] = useState("SELECCIONE");

    async function saveData() {
        const res = await axios.post(`${UrlServer}/updateRecursoDocumentoAdquisicion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": recurso.descripcion,
                "codigo": Input,
                "id_tipoDocumentoAdquisicion": Input2
            }
        )
        setToggleInput(!ToggleInput)
        fectchDocumentoAdquisicion()
    }

    return (
        ModoEditar &&
            ToggleInput ?
            <div
                className="d-flex"
            >
                <DebounceInput
                    value={DocumentoAdquisicion.codigo}
                    debounceTimeout={300}
                    onChange={e => setInput(e.target.value)}
                    type="text"
                />
                <select
                    onChange={e => setInput2(e.target.value)}
                    value={Input2}
                    className="form-control form-control-sm" >
                    <option disabled hidden>SELECCIONE</option>
                    {
                        TipoDocumentoAdquisicion.map((item, i) =>
                            <option value={item.id_tipoDocumentoAdquisicion}>{item.nombre}</option>
                        )
                    }
                </select>
                <div
                    onClick={() => saveData()}
                >
                    <MdSave style={{ cursor: "pointer" }} />
                </div>
                <div
                    onClick={() => setToggleInput(!ToggleInput)}
                >
                    <MdClose style={{ cursor: "pointer" }} />
                </div>
            </div>
            :

            <div>

                {
                    TipoDocumentoAdquisicion.find(item2 => item2.id_tipoDocumentoAdquisicion === DocumentoAdquisicion.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion) &&
                    TipoDocumentoAdquisicion.find(item2 => item2.id_tipoDocumentoAdquisicion === DocumentoAdquisicion.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion).nombre
                }
                {" - "}
                {DocumentoAdquisicion.codigo}
                {ModoEditar &&

                    <MdModeEdit onClick={() => setToggleInput(!ToggleInput)} />
                }
            </div>
    )
}

function CantidadAvanzada({ descripcion, ModoEditar, RecursoTipoSelecccionado, activeChildFunctions }) {
    useEffect(() => {
        fectchAvance()
    }, [])

    const [Avance, setAvance] = useState(0);

    async function fectchAvance() {
        const ejecucionReal = await axios.post(`${UrlServer}/getResumenRecursosRealesByDescripcion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "descripcion": descripcion
            }
        )

        // console.log("res.dataAvance", res.data);
        var avance = null;
        if (ModoEditar) {

            avance = ejecucionReal.data.cantidad
        }

        if (avance == null) {
            const res3 = await axios.post(`${UrlServer}/getResumenRecursosCantidadByDescripcion`,
                {
                    "id_ficha": sessionStorage.getItem('idobra'),
                    "descripcion": descripcion
                }
            )
            avance = res3.data.avance
        }
        setAvance(avance)
    }
    const [ToggleInput, setToggleInput] = useState(false)
    const [Input, setInput] = useState();
    async function updateRecursoAvance() {
        const res = await axios.post(`${UrlServer}/updateRecursoAvance`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": descripcion,
                "cantidad": Input
            }
        )

        setToggleInput(!ToggleInput)
        fectchAvance()
        activeChildFunctions(descripcion)
    }

    return (
        ToggleInput ?
            <div
                className="d-flex"
            >
                <DebounceInput
                    value={Avance}
                    debounceTimeout={300}
                    onChange={e => setInput(e.target.value)}
                    type="number"
                />
                <div
                    onClick={() => updateRecursoAvance()}
                >
                    <MdSave style={{ cursor: "pointer" }} />
                </div>
                <div
                    onClick={() => setToggleInput(!ToggleInput)}
                >
                    <MdClose style={{ cursor: "pointer" }} />
                </div>
            </div>
            :

            <div>
                {Redondea(Avance)}
                {
                    ModoEditar &&
                    <MdModeEdit onClick={() => setToggleInput(!ToggleInput)} />
                }
            </div>

    )
}

function Precio({ recurso, ModoEditar, RecursoTipoSelecccionado, activeChildFunctions }) {
    useEffect(() => {
        fetchPrecio()
    }, []);

    const [Precio, setPrecio] = useState(0);
    async function fetchPrecio() {
        const ejecucionReal = await axios.post(`${UrlServer}/getResumenRecursosRealesByDescripcion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "descripcion": recurso.descripcion
            }
        )
        var precio = recurso.precio
        if (ModoEditar && ejecucionReal.data.precio != null) {
            precio = ejecucionReal.data.precio
        }
        setPrecio(precio)
    }
    const [ToggleInput, setToggleInput] = useState(false)
    const [Input, setInput] = useState();

    async function updateRecursoPrecio() {
        const res = await axios.post(`${UrlServer}/updateRecursoPrecio`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": recurso.descripcion,
                "precio": Input,
            }
        )
        setToggleInput(!ToggleInput)
        fetchPrecio()
        activeChildFunctions(recurso.descripcion)
    }
    return (

        ToggleInput ?
            <div
                className="d-flex"
            >
                <DebounceInput
                    value={Precio}
                    debounceTimeout={300}
                    onChange={e => setInput(e.target.value)}
                    type="number"
                />
                <div
                    onClick={() => updateRecursoPrecio()}
                >
                    <MdSave style={{ cursor: "pointer" }} />
                </div>
                <div
                    onClick={() => setToggleInput(!ToggleInput)}
                >
                    <MdClose style={{ cursor: "pointer" }} />
                </div>
            </div>
            :

            <div>
                {recurso.unidad == '%MO' || recurso.unidad == '%PU' ? 0 : Precio}
                {
                    ModoEditar &&
                    <MdModeEdit onClick={() => setToggleInput(!ToggleInput)} />
                }
            </div>

    )
}

const Parcial = forwardRef(
    ({ recurso, ModoEditar }, ref) => {

        useEffect(() => {
            fectchAvance()
        }, []);
        const [Precio, setPrecio] = useState(0);
        const [Avance, setAvance] = useState(0);

        async function fectchAvance() {
            const ejecucionReal = await axios.post(`${UrlServer}/getResumenRecursosRealesByDescripcion`,
                {
                    "id_ficha": sessionStorage.getItem('idobra'),
                    "descripcion": recurso.descripcion
                }
            )

            // console.log("res.dataAvance", res.data);
            var avance = null;
            var precio = recurso.precio
            if (ModoEditar) {

                avance = ejecucionReal.data.cantidad
                if (ejecucionReal.data.precio != null) {
                    precio = ejecucionReal.data.precio
                }
            }

            if (avance == null) {
                const res3 = await axios.post(`${UrlServer}/getResumenRecursosCantidadByDescripcion`,
                    {
                        "id_ficha": sessionStorage.getItem('idobra'),
                        "descripcion": recurso.descripcion
                    }
                )
                avance = res3.data.avance
            }
            setAvance(avance)
            setPrecio(precio)
        }
        useImperativeHandle(ref, () => ({
            recarga() {
                fectchAvance()
            }
        }));

        return (
            Redondea(Avance * (recurso.unidad == '%MO' || recurso.unidad == '%PU' ? 0 : Precio))
        )
    }
)

const Diferencia = forwardRef(({ recurso, ModoEditar }, ref) => {

    useEffect(() => {
        fectchAvance()
    }, []);
    const [Precio, setPrecio] = useState(0);
    const [Avance, setAvance] = useState(0);

    async function fectchAvance() {
        const ejecucionReal = await axios.post(`${UrlServer}/getResumenRecursosRealesByDescripcion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "descripcion": recurso.descripcion
            }
        )

        // console.log("res.dataAvance", res.data);
        var avance = null;
        var precio = recurso.precio
        if (ModoEditar) {

            avance = ejecucionReal.data.cantidad
            if (ejecucionReal.data.precio != null) {
                precio = ejecucionReal.data.precio
            }
        }

        if (avance == null) {
            const res3 = await axios.post(`${UrlServer}/getResumenRecursosCantidadByDescripcion`,
                {
                    "id_ficha": sessionStorage.getItem('idobra'),
                    "descripcion": recurso.descripcion
                }
            )
            avance = res3.data.avance
        }
        setAvance(avance)
        setPrecio(precio)
    }
    useImperativeHandle(ref, () => ({
        recarga() {
            fectchAvance()
        }
    }));
    return (
        Redondea(
            (recurso.recurso_cantidad
                *
                (recurso.unidad == '%MO' || recurso.unidad == '%PU' ? 0 : Precio)
            )
            -
            (Avance
                *
                (recurso.unidad == '%MO' || recurso.unidad == '%PU' ? 0 : Precio)
            )
        )
    )
}
)
const DiferenciaPorcentaje = forwardRef(({ recurso, ModoEditar }, ref) => {

    useEffect(() => {
        fectchAvance()
    }, []);
    const [Precio, setPrecio] = useState(0);
    const [Avance, setAvance] = useState(0);

    async function fectchAvance() {
        const ejecucionReal = await axios.post(`${UrlServer}/getResumenRecursosRealesByDescripcion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "descripcion": recurso.descripcion
            }
        )

        // console.log("res.dataAvance", res.data);
        var avance = null;
        var precio = recurso.precio
        if (ModoEditar) {

            avance = ejecucionReal.data.cantidad
            if (ejecucionReal.data.precio != null) {
                precio = ejecucionReal.data.precio
            }
        }

        if (avance == null) {
            const res3 = await axios.post(`${UrlServer}/getResumenRecursosCantidadByDescripcion`,
                {
                    "id_ficha": sessionStorage.getItem('idobra'),
                    "descripcion": recurso.descripcion
                }
            )
            avance = res3.data.avance
        }
        setAvance(avance)
        setPrecio(precio)
    }
    useImperativeHandle(ref, () => ({
        recarga() {
            fectchAvance()
        }
    }));

    return (

        Redondea
            (
                (
                    (
                        recurso.recurso_cantidad
                        *
                        (recurso.unidad == '%MO' || recurso.unidad == '%PU' ? 0 : Precio)
                    )
                    -
                    (
                        Avance
                        *
                        (recurso.unidad == '%MO' || recurso.unidad == '%PU' ? 0 : Precio)
                    )
                )
                /
                (
                    recurso.recurso_cantidad
                    *
                    (
                        recurso.unidad == '%MO' || recurso.unidad == '%PU' ? 0 : Precio
                    )
                )
                * 100
            )

    )
}
)
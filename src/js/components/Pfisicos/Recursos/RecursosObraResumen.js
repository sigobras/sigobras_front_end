import React, { useEffect, useState, Fragment } from 'react';
import { InputGroupAddon, InputGroupText, InputGroup, Nav, NavItem, NavLink, Button, Input } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import { FechaActual, Redondea } from '../../Utils/Funciones'
import { MdFirstPage, MdChevronLeft, MdChevronRight, MdLastPage, MdCompareArrows, MdClose, MdSearch, MdExtension, MdVisibility, MdMonetizationOn, MdWatch, MdLibraryBooks, MdSave, MdModeEdit, MdEdit } from 'react-icons/md';
import { FaSuperpowers, FaPlus } from 'react-icons/fa';
import { DebounceInput } from 'react-debounce-input';

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
        // console.log("res.dataRecursos", res.data);
        for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            var avance = null;
            const ejecucionReal = await axios.post(`${UrlServer}/getResumenRecursosRealesByDescripcion`,
                {
                    "id_ficha": sessionStorage.getItem('idobra'),
                    "descripcion": element.descripcion
                }
            )
            if (ModoEditar) {

                console.log("res 2", ejecucionReal.data);
                avance = ejecucionReal.data.cantidad

                // Zona de precios

                if (ejecucionReal.data.precio != null) {
                    element.precio = ejecucionReal.data.precio
                }
            }

            if (avance == null) {
                const res3 = await axios.post(`${UrlServer}/getResumenRecursosCantidadByDescripcion`,
                    {
                        "id_ficha": sessionStorage.getItem('idobra'),
                        "descripcion": element.descripcion
                    }
                )
                avance = res3.data.avance
                console.log("Res 3", res3.data);
            }
            element.avance = avance

            // Zona de documenteo de adquisicion
            element.codigo = ejecucionReal.data.codigo
            element.id_tipoDocumentoAdquisicion = ejecucionReal.data.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion
            // console.log("Res del for ", ejecucionReal.data.avance);
        }
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

    
    
    // Ediccion de avance
    const [inputRecursoAvanceEstado, setinputRecursoAvanceEstado] = useState(false)

    const [inputRecursoAvanceValor, setinputRecursoAvanceValor] = useState(0)

    async function updateRecursoAvance() {
        console.log("Uodate Recurso Avance",
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": inputRecursoAvanceEstado,
                "cantidad": inputRecursoAvanceValor
            }
        );
        const res = await axios.post(`${UrlServer}/updateRecursoAvance`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": inputRecursoAvanceEstado,
                "cantidad": inputRecursoAvanceValor
            }
        )
        console.log("Guardando .........", inputRecursoAvanceValor);
        setinputRecursoAvanceEstado("")
        fectchRecursos()
    }

    // Edicion de Precio 
    const [InputRecursoPrecioEstado, setInputRecursoPrecioEstado] = useState(false)

    const [InputRecursoPrecioValor, setInputRecursoPrecioValor] = useState(0)

    async function updateRecursoPrecio() {
        console.log("Update Recurso precio",
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": InputRecursoPrecioEstado,
                "precio": InputRecursoPrecioValor,
            });
        const res = await axios.post(`${UrlServer}/updateRecursoPrecio`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": InputRecursoPrecioEstado,
                "precio": InputRecursoPrecioValor,
            }
        )
        console.log("Guardando .........", InputRecursoPrecioValor);
        setInputRecursoPrecioEstado("")
        fectchRecursos()
    }

    //Edicion de N° O/C - O/S
    const [InputRecursoCodigoEstado, setInputRecursoCodigoEstado] = useState(false)

    const [InputRecursoCodigoValor, setInputRecursoCodigoValor] = useState(0)

    async function updateRecursoComprobante() {
        console.log("Update Recursos Comprobante",
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": InputRecursoCodigoEstado,
                "codigo": InputRecursoCodigoValor,
                "id_tipoDocumentoAdquisicion": InputRecursoTipoDocumentoAdquisicion
            }
        );
        const res = await axios.post(`${UrlServer}/updateRecursoDocumentoAdquisicion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "tipo": RecursoTipoSelecccionado.tipo,
                "descripcion": InputRecursoCodigoEstado,
                "codigo": InputRecursoCodigoValor,
                "id_tipoDocumentoAdquisicion": InputRecursoTipoDocumentoAdquisicion
            }
        )
        console.log("Guardando .........", InputRecursoCodigoValor);
        console.log("Guardando .........", InputRecursoTipoDocumentoAdquisicion);
        setInputRecursoCodigoEstado("")
        fectchRecursos()
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
    }, [ModoEditar,CantidadPaginasRecursos, RecursoTipoSelecccionado, PaginaActual, TextoBuscado,]);

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
            {/* <div className="clearfix mb-2">
                <div className="float-right">
                    <InputGroup size="sm">
                        <Input type="text" onChange={(event) => setTextoBuscado(event.target.value)} />
                    </InputGroup>
                </div>

            </div> */}
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
                            onClick={() => toggleModoEditar()}
                            title="asignar codigos y editar "

                        >
                            <MdCompareArrows /> <MdModeEdit />
                        </Button>
                        <Button outline color="info"
                            // active={this.state.CamviarTipoVistaDrag === true} 
                            // onClick={this.cambiarVistaDragDrop} 
                            title="organizar">
                            <MdExtension />
                        </Button>
                    </InputGroupAddon>
                    <Input type="text" onChange={(event) => setTextoBuscado(event.target.value)} />
                </InputGroup>
            </div>
            <table className="table table-sm table-hover">
                <thead>
                    <tr>
                        <th colSpan="5" className="bordeDerecho">RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN EXPEDIENTE TÉCNICO</th>
                        <th colSpan="5" > RECURSOS GASTADOS HASTA LA FECHA ( HOY {FechaActual()} )</th>
                    </tr>
                    <tr>
                        <th>N° O/C - O/S</th>
                        <th>RECURSO</th>
                        <th>UND</th>
                        <th>CANTIDAD</th>
                        <th>PRECIO S/.</th>
                        <th className="bordeDerecho" > PARCIAL S/.</th>

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
                            <tr key={item.descripcion+ModoEditar}>
                                <td>
                                    {
                                        ModoEditar == true &&
                                            InputRecursoCodigoEstado == item.descripcion ?
                                            <div
                                                className="d-flex"
                                            >
                                                <DebounceInput
                                                    // value={item.Programado_monto}
                                                    // debounceTimeout={300}
                                                    onChange={e => setInputRecursoCodigoValor(e.target.value)}
                                                    type="text"
                                                />
                                                <select
                                                    onChange={e => setInputRecursoTipoDocumentoAdquisicion(e.target.value)}
                                                    value={InputRecursoTipoDocumentoAdquisicion}
                                                    className="form-control form-control-sm" >
                                                    <option disabled hidden>SELECCIONE</option>
                                                    {
                                                        TipoDocumentoAdquisicion.map((item, i) =>
                                                            <option value={item.id_tipoDocumentoAdquisicion}>{item.nombre}</option>
                                                        )
                                                    }
                                                </select>
                                                <div
                                                    onClick={() => updateRecursoComprobante()}
                                                >
                                                    <MdSave style={{ cursor: "pointer" }} />
                                                </div>
                                                <div
                                                    onClick={() => setInputRecursoCodigoEstado("")}
                                                >
                                                    <MdClose style={{ cursor: "pointer" }} />
                                                </div>
                                            </div>
                                            :
                                            <div>

                                                {
                                                    TipoDocumentoAdquisicion.find(item2 => item2.id_tipoDocumentoAdquisicion === item.id_tipoDocumentoAdquisicion) &&
                                                    TipoDocumentoAdquisicion.find(item2 => item2.id_tipoDocumentoAdquisicion === item.id_tipoDocumentoAdquisicion).nombre

                                                }
                                                {" - "}
                                                {item.codigo}
                                                {ModoEditar &&

                                                    <MdModeEdit onClick={() => setInputRecursoCodigoEstado(item.descripcion)} />
                                                }
                                            </div>
                                    }

                                </td>
                                <td> {item.descripcion} </td>
                                <td> {item.unidad} </td>
                                <td> {Redondea(item.recurso_cantidad)}</td>
                                <td> {item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio}</td>
                                <td className="bordeDerecho"> {Redondea(item.recurso_cantidad * (item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio))}</td>

                                {/* <td> <CantidadAvanzada descripcion={item.descripcion} updateRecurso={updateRecurso} indexRecurso={i} /> </td> */}
                                <td>
                                    {
                                        inputRecursoAvanceEstado == item.descripcion ?
                                            <div
                                                className="d-flex"
                                            >
                                                <DebounceInput
                                                    // value={item.Programado_monto}
                                                    // debounceTimeout={300}
                                                    onChange={e => setinputRecursoAvanceValor(e.target.value)}
                                                    type="number"
                                                />
                                                <div
                                                    onClick={() => updateRecursoAvance()}
                                                >
                                                    <MdSave style={{ cursor: "pointer" }} />
                                                </div>
                                                <div
                                                    onClick={() => setinputRecursoAvanceEstado("")}
                                                >
                                                    <MdClose style={{ cursor: "pointer" }} />
                                                </div>
                                            </div>
                                            :
                                            <div>
                                                {Redondea(item.avance)}
                                                <MdModeEdit onClick={() => setinputRecursoAvanceEstado(item.descripcion)} />
                                            </div>

                                    }

                                </td>
                                <td>
                                    {
                                        InputRecursoPrecioEstado == item.descripcion ?
                                            <div
                                                className="d-flex"
                                            >
                                                <DebounceInput
                                                    // value={item.Programado_monto}
                                                    // debounceTimeout={300}
                                                    onChange={e => setInputRecursoPrecioValor(e.target.value)}
                                                    type="number"
                                                />
                                                <div
                                                    onClick={() => updateRecursoPrecio()}
                                                >
                                                    <MdSave style={{ cursor: "pointer" }} />
                                                </div>
                                                <div
                                                    onClick={() => setInputRecursoPrecioEstado("")}
                                                >
                                                    <MdClose style={{ cursor: "pointer" }} />
                                                </div>
                                            </div>
                                            :
                                            <div>
                                                {item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio}
                                                <MdModeEdit onClick={() => setInputRecursoPrecioEstado(item.descripcion)} />
                                            </div>
                                    }

                                </td>
                                <td> {Redondea(item.avance * (item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio))}</td>
                                <td> {Redondea(
                                    (item.recurso_cantidad
                                        *
                                        (item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio)
                                    )
                                    -
                                    (item.avance
                                        *
                                        (item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio)
                                    )
                                )}</td>
                                <td> {
                                    Redondea
                                        (
                                            (
                                                (
                                                    item.recurso_cantidad
                                                    *
                                                    (item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio)
                                                )
                                                -
                                                (
                                                    item.avance
                                                    *
                                                    (item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio)
                                                )
                                            )
                                            /
                                            (
                                                item.recurso_cantidad
                                                *
                                                (
                                                    item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio
                                                )
                                            )
                                            * 100
                                        )
                                }</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

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
function CantidadAvanzada({ descripcion, updateRecurso, indexRecurso }) {
    useEffect(() => {
        fectchAvance()
    }, [])

    const [Avance, setAvance] = useState(0);

    async function fectchAvance() {
        const res = await axios.post(`${UrlServer}/getResumenRecursosCantidadByDescripcion`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                "descripcion": descripcion
            }
        )
        setAvance(res.data.avance)
        updateRecurso(indexRecurso, res.data.avance)
        // console.log("res.dataAvance", res.data);
    }
    return (
        <div>
            {Redondea(Avance)}

        </div>
    )
}
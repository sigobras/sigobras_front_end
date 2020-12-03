import React, { useEffect, useState } from 'react';
import { InputGroupAddon, InputGroupText, InputGroup, Nav, NavItem, NavLink, Button, Input } from 'reactstrap';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import { FechaActual, Redondea } from '../../Utils/Funciones'

export default () => {
    useEffect(() => {
        fectchRecursosTipo()
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
        // console.log("res.dataRecursos", res.data);
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
    useEffect(() => {
        setPaginaActual(1)
    }, [RecursoTipoSelecccionado]);
    useEffect(() => {
        fectchConteoRecursos()
    }, [RecursoTipoSelecccionado, TextoBuscado]);
    useEffect(() => {
        fectchRecursos()
    }, [CantidadPaginasRecursos, RecursoTipoSelecccionado, PaginaActual, TextoBuscado]);
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
            <div className="clearfix mb-2">
                <div className="float-right">
                    <InputGroup size="sm">
                        <Input type="text" onChange={(event) => setTextoBuscado(event.target.value)} />
                    </InputGroup>
                </div>

            </div>
            <table className="table table-sm table-hover">
                <thead>
                    <tr>
                        <th colSpan="5" className="bordeDerecho">RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN EXPEDIENTE TÉCNICO</th>
                        <th colSpan="5" > RECURSOS GASTADOS HASTA LA FECHA ( HOY {FechaActual()} )</th>
                    </tr>
                    <tr>
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
                            <tr key={item.id_recurso}>
                                <td> {item.descripcion} </td>
                                <td> {item.unidad} </td>
                                <td> {Redondea(item.recurso_cantidad)}</td>
                                <td> {item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio}</td>
                                <td className="bordeDerecho"> {Redondea(item.recurso_cantidad * (item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio))}</td>

                                <td> <CantidadAvanzada descripcion={item.descripcion} updateRecurso={updateRecurso} indexRecurso={i} /> </td>
                                <td> {item.unidad == '%MO' || item.unidad == '%PU' ? 0 : item.precio}</td>
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
            {ConteoRecursos + "ConteoRecursos"}
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
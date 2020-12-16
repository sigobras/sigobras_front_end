import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import axios from 'axios';
import 'jspdf-autotable';
import "../../../css/inicio.css"
import { UrlServer } from '../Utils/ServerUrlConfig'
import FinancieroBarraPorcentaje from './FinancieroBarraPorcentaje'
import { Button, Tooltip } from 'reactstrap';
import FisicoBarraPorcentaje from './FisicoBarraPorcentaje';
import ModalListaPersonal from './ModalListaPersonal'
import ModalInformacionObras from './InformacionObras/InformacionObra'
import Curva_S from './Curva_S'
import { FaList } from "react-icons/fa";
import { Redondea } from '../Utils/Funciones';
import Obras_labels_edicion from './Obras_labels_edicion';
export default ({ recargar }) => {
    useEffect(() => {
        fetchObras(0)
        fetchComunicados()
        fetchTipoObras()
    }, []);
    //funciones
    function calcular_dias(fecha_inicio, fecha_final) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(fecha_inicio);
        const secondDate = new Date(fecha_final);
        var days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        return days || 0
    }
    //comunicados
    const [Comunicados, setComunicados] = useState([]);
    async function fetchComunicados() {
        var request = await axios.post(`${UrlServer}/comunicadosInicio`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),

            }
        )
        setComunicados(request.data)
    }
    //obras
    const [Obras, setObras] = useState([])
    async function fetchObras(id_tipoObra) {
        var request = await axios.post(`${UrlServer}/listaObrasByIdAcceso`, {
            id_acceso: sessionStorage.getItem("idacceso"),
            id_tipoObra
        })
        setObras(request.data)
        if (!sessionStorage.getItem('idobra')) {
            recargar(request.data[0])
        }
    }
    const [ObraComponentesSeleccionada, setObraComponentesSeleccionada] = useState({})
    async function onChangeObraComponentesSeleccionada(id_ficha) {
        setComponentes([])
        if (ObraComponentesSeleccionada == id_ficha) {
            setObraComponentesSeleccionada(-1)
        } else {
            setObraComponentesSeleccionada(id_ficha)
            fetchComponentes(id_ficha)
        }
    }
    //componentes
    const [Componentes, setComponentes] = useState([])
    async function fetchComponentes(id_ficha) {
        var request = await axios.post(`${UrlServer}/getComponentes`, {
            id_ficha
        })
        setComponentes(request.data)
    }
    //tipo de obras
    const [TipoObras, setTipoObras] = useState([])
    async function fetchTipoObras() {
        var request = await axios.post(`${UrlServer}/getTipoObras`, {
            id_acceso: sessionStorage.getItem("idacceso")
        })
        setTipoObras(request.data)
    }
    const [, setTipoObraSeleccionado] = useState(0)
    function onChangeTipoObra(id_tipo) {
        setTipoObraSeleccionado(id_tipo)
        fetchObras(id_tipo)
    }
    //labels
    const [RefLabels, setRefLabels] = useState([])
    function recargarObraLabels(id_ficha) {
        RefLabels[id_ficha].recarga()
    }

    return (
        <div>
            {Comunicados.map((comunicado, index) =>
                <div key={index} className="aviso">
                    <h6 className="textoaviso">COMUNICADO: </h6>
                    <p> -- {comunicado.texto_mensaje}</p>
                </div>
            )}

            <div className="fondo">
                <div className="float-right">
                    <select className="form-control form-control-sm"
                        onChange={(e) => onChangeTipoObra(e.target.value)}
                    >
                        <option value={0}>Todo</option>
                        {
                            TipoObras.map((item) =>
                                <option value={item.id_tipoObra}>{item.nombre}</option>
                            )
                        }

                    </select>
                </div>
            </div>
            <table className="table table-sm" >
                <thead>
                    <tr>
                        <th>N°</th>
                        <th style={{ width: "400px", minWidth: "150px", textAlign: "center" }} >OBRA</th>
                        <th className="text-center" >AVANCE </th>
                        <th className="text-center" >UDM </th>
                        <th className="text-center">IR A</th>
                        <th className="text-center">ESTADO</th>
                        <th className="text-center" style={{ width: "105px", minWidth: "100px" }} >OPCIONES</th>
                    </tr>
                </thead>
                <tbody >
                    {Obras.map((item, i) =>
                        [
                            <tr key={item.id_ficha}>
                                <td>
                                    {i + 1}
                                </td>
                                <td>
                                    {item.g_meta}
                                </td>
                                <td
                                    style={{
                                        width: "20%"
                                    }}
                                >
                                    <FisicoBarraPorcentaje id_ficha={item.id_ficha} />
                                    <FinancieroBarraPorcentaje id_ficha={item.id_ficha} />
                                </td>
                                <td >
                                    {calcular_dias(item.ultima_fecha, new Date()) - 1} días sin reportar

                                </td>
                                <td>
                                    <Button
                                        outline={sessionStorage.getItem('idobra') != item.id_ficha}
                                        color={sessionStorage.getItem('idobra') != item.id_ficha ? "secondary" : "primary"}
                                        onClick={() => { recargar(item) }}
                                        className="text-white"
                                    >
                                        {item.codigo}
                                    </Button>
                                </td>
                                <td>
                                    <EstadoObra id_ficha={item.id_ficha} />
                                </td>
                                <td className="d-flex">
                                    <button
                                        className="btn btn-outline-info btn-sm mr-1"
                                        title="Avance Componentes"
                                        onClick={() => onChangeObraComponentesSeleccionada(item.id_ficha)}
                                    >
                                        <FaList />
                                    </button>
                                    <ModalListaPersonal id_ficha={item.id_ficha} codigo_obra={item.codigo} />
                                    <ModalInformacionObras id_ficha={item.id_ficha} />
                                    <Curva_S id_ficha={item.id_ficha} />
                                    <Obras_labels_edicion
                                        id_ficha={item.id_ficha}
                                        recargarObraLabels={recargarObraLabels}
                                        codigo={item.codigo}
                                    />
                                </td>
                            </tr>
                            ,
                            <tr>
                                <td colSpan="8">
                                    <Obras_labels
                                        id_ficha={item.id_ficha}
                                        ref={(ref) => {
                                            var clone = RefLabels
                                            clone[item.id_ficha] = ref
                                            setRefLabels(clone)
                                        }}
                                    />
                                </td>
                            </tr>
                            ,
                            (
                                ObraComponentesSeleccionada == item.id_ficha
                                &&
                                <tr key={"1." + i}>
                                    <td colSpan="8">
                                        <table className="table table-bordered table-sm"
                                            style={{
                                                width: "100%"
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th>N°</th>
                                                    <th>COMPONENTE</th>
                                                    <th>PRESUPUESTO CD</th>
                                                    <th>EJECUCIÓN FÍSICA</th>
                                                    <th>BARRRA PORCENTUAL</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ backgroundColor: '#333333' }}>
                                                {
                                                    Componentes.map((item) =>

                                                        <tr key={Componentes.id_componente} >
                                                            <td>{item.numero}</td>

                                                            <td style={{ fontSize: '0.75rem', color: '#8caeda' }}
                                                            >{item.nombre}</td>

                                                            <td> S/. {Redondea(item.presupuesto)}</td>
                                                            <td>
                                                                <ComponenteAvance id_componente={item.id_componente} />
                                                            </td>
                                                            <td>
                                                                <ComponenteBarraPorcentaje
                                                                    id_componente={item.id_componente}
                                                                    componente={item}
                                                                />
                                                            </td>

                                                        </tr>

                                                    )}
                                            </tbody>
                                        </table>

                                    </td>

                                </tr>
                            )

                        ]
                    )}

                </tbody>

            </table>

        </div>

    );
}
//componente de ulti dia metrado
//componente de estado de obra
function EstadoObra({ id_ficha }) {
    useEffect(() => {
        fetchData()
    }, []);
    const [EstadoObra, setEstadoObra] = useState("")
    async function fetchData() {
        var request = await axios.post(`${UrlServer}/getEstadoObra`, {
            id_ficha: id_ficha
        })
        setEstadoObra(request.data.nombre)
    }
    return (
        <div
            className={EstadoObra === "Ejecucion"
                ?
                "badge badge-success p-1"
                :
                EstadoObra === "Paralizado"
                    ?
                    "badge badge-warning p-1"
                    :
                    EstadoObra === "Corte"
                        ?
                        "badge badge-danger p-1"
                        :
                        EstadoObra === "Actualizacion"
                            ?
                            "badge badge-info p-1" : "badge badge-info p-1"}
        >
            { EstadoObra}
        </div>

    );
}
//avancecomponente
function ComponenteAvance({ id_componente }) {
    useEffect(() => {
        fetchData()
    }, []);
    const [ComponenteAvance, setComponenteAvance] = useState(0)
    async function fetchData() {
        var request = await axios.post(`${UrlServer}/getFisicoComponente`, {
            id_componente
        })
        setComponenteAvance(request.data.avance)
    }
    return (
        <div>
            { Redondea(ComponenteAvance)}
        </div>

    );
}
function ComponenteBarraPorcentaje({ id_componente, componente }) {
    useEffect(() => {
        fetchData()
    }, []);
    const [ComponenteAvancePorcentaje, setComponenteAvancePorcentaje] = useState(0)
    async function fetchData() {
        var request = await axios.post(`${UrlServer}/getFisicoComponente`, {
            id_componente
        })
        setComponenteAvancePorcentaje(request.data.avance / componente.presupuesto * 100)
    }
    return (
        <div style={{
            width: '100%',
            height: '20px',
            textAlign: 'center'
        }}
        >
            <div style={{
                height: '5px',
                backgroundColor: '#c3bbbb',
                borderRadius: '2px',
                position: 'relative'
            }}
            >
                <div
                    style={{
                        width: `${ComponenteAvancePorcentaje <= 100 ? ComponenteAvancePorcentaje : 100}%`,
                        height: '100%',
                        // boxShadow:'0 0 12px #c3bbbb',
                        backgroundColor: ComponenteAvancePorcentaje > 95 ? '#e6ff00'
                            : ComponenteAvancePorcentaje > 50 ? '#ffbf00'
                                : '#ff2e00',
                        borderRadius: '2px',
                        transition: 'all .9s ease-in',
                        position: 'absolute',

                    }}
                />
                <span style={{ position: 'inherit', fontSize: '0.8rem', top: '4px' }}>
                    {Redondea(ComponenteAvancePorcentaje)} %
                </span>
            </div>
        </div>

    );
}
const Obras_labels = forwardRef(({ id_ficha }, ref) => {
    useImperativeHandle(ref, () => ({
        recarga() {
            fetchLabels()
        }
    }));
    useEffect(() => {
        fetchLabels()
    }, [])
    const [Labels, setLabels] = useState([])
    async function fetchLabels() {
        var res = await axios.get(`${UrlServer}/FichasLabelsAsignadas`, {
            params: {
                id_ficha
            }
        })
        if (Array.isArray(res.data))
            setLabels(res.data)

    }
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        h = Math.round(360 * h);
        s = s * 100
        s = Math.round(s);
        l = l * 100;
        l = Math.round(l);
        var respuesta = {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            h, s, l
        }
        return result ? respuesta : null;
    }
    const [tooltipOpen, setTooltipOpen] = useState(0);

    const toggle = (id) => {
        if (id == tooltipOpen) {
            setTooltipOpen(0)
        } else {
            setTooltipOpen(id)
        }

    };
    async function quitarObraLabel(id_label) {
        if (confirm("Esta seguro de quitar esta etiqueta?")) {
            var res = await axios.delete(`${UrlServer}/FichasAsignarLabels`,
                {
                    data: {
                        id_ficha,
                        id_label
                    }
                }
            )
            console.log("eliminado", res.data);
            fetchLabels(id_ficha)
        }
    }
    return (
        <div
            style={{
                display: "flex"
            }}
        >
            {
                Labels.map((item, i) =>
                    [
                        <Button
                            type="button"
                            style={{
                                borderRadius: "13px",
                                "--perceived-lightness": "calc((var(--label-r)*0.2126 + var(--label-g)*0.7152 + var(--label-b)*0.0722)/255)",
                                "--lightness-switch": " max(0,min(calc((var(--perceived-lightness) - var(--lightness-threshold))*-1000),1))",
                                padding: " 0 10px",
                                "line-height": " 22px!important",
                                "--lightness-threshold": " 0.6",
                                "--background-alpha": " 0.18",
                                "--border-alpha": " 0.3",
                                "--lighten-by": " calc((var(--lightness-threshold) - var(--perceived-lightness))*100*var(--lightness-switch))",
                                "background": " rgba(var(--label-r),var(--label-g),var(--label-b),var(--background-alpha))",
                                "color": " hsl(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%))",
                                "border-color": " hsla(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%),var(--border-alpha))",
                                "--label-r": hexToRgb(item.color).r,
                                "--label-g": hexToRgb(item.color).g,
                                "--label-b": hexToRgb(item.color).b,
                                "--label-h": hexToRgb(item.color).h,
                                "--label-s": hexToRgb(item.color).s,
                                "--label-l": hexToRgb(item.color).l,
                                margin: "5px",
                            }}
                            id={"Tooltip-" + item.id + "-" + id_ficha}
                            onClick={() => {
                                quitarObraLabel(item.id)
                            }}
                        >
                            {item.nombre}
                        </Button>,
                        <Tooltip
                            placement={"bottom"}
                            isOpen={tooltipOpen == item.id}
                            target={"Tooltip-" + item.id + "-" + id_ficha}
                            toggle={() => toggle(item.id)}
                        >
                            {item.descripcion}
                        </Tooltip>
                    ]

                )
            }

        </div>
    )
})
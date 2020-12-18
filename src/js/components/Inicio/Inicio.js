import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import axios from 'axios';
import 'jspdf-autotable';
import "../../../css/inicio.css"
import { UrlServer } from '../Utils/ServerUrlConfig'
import FinancieroBarraPorcentaje from './FinancieroBarraPorcentaje'
import { Button, Input, Tooltip } from 'reactstrap';
import FisicoBarraPorcentaje from './FisicoBarraPorcentaje';
import ModalListaPersonal from './ModalListaPersonal'
import ModalInformacionObras from './InformacionObras/InformacionObra'
import Curva_S from './Curva_S'
import { FaList } from "react-icons/fa";
import { Redondea, hexToRgb } from '../Utils/Funciones';
import Obras_labels_edicion from './Obras_labels_edicion';
import CarouselImagenesObra from './CarouselImagenesObra';
export default ({ recargar }) => {
    //funciones
    function fechaFormatoClasico(fecha) {
        var fechaTemp = ""
        if (fecha) {
            fechaTemp = fecha.split("-")
        } else {
            return fecha
        }
        if (fechaTemp.length == 3) {
            return fechaTemp[2] + "-" + fechaTemp[1] + "-" + fechaTemp[0]
        } else {
            return fecha
        }
    }

    useEffect(() => {
        fetchComunicados()
        fetchProvincias()
        fetchTipoObras()
    }, []);
    //comunicados
    const [Comunicados, setComunicados] = useState([]);
    async function fetchComunicados() {
        var res = await axios.post(`${UrlServer}/comunicadosInicio`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),

            }
        )
        setComunicados(res.data)
    }

    function calcular_dias(fecha_inicio, fecha_final) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(fecha_inicio);
        const secondDate = new Date(fecha_final);
        var days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        return days || 0
    }
    //labels
    const [RefLabels, setRefLabels] = useState([])
    function recargarObraLabels(id_ficha) {
        RefLabels[id_ficha].recarga()
    }
    //componentes
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
        var res = await axios.post(`${UrlServer}/getComponentes`, {
            id_ficha
        })
        setComponentes(res.data)
    }


    // FILTROS
    //provincias
    const [Provincias, setProvincias] = useState([])
    async function fetchProvincias() {
        var res = await axios.post(`${UrlServer}/getProvincias`, {
            id_acceso: sessionStorage.getItem("idacceso"),
            "id_unidadEjecutora": "0"
        })
        setProvincias(res.data)
        setProvinciaSeleccionada(res.data[0].id_unidadEjecutora)
    }
    const [ProvinciaSeleccionada, setProvinciaSeleccionada] = useState(-1)

    //sectores
    const [Sectores, setSectores] = useState([])
    const [SectoreSeleccionado, setSectoreSeleccionado] = useState(0)
    async function fetchSectores() {
        var res = await axios.post(`${UrlServer}/getSectores`, {
            id_acceso: sessionStorage.getItem("idacceso"),
            "id_unidadEjecutora": ProvinciaSeleccionada
        })
        setSectores(res.data)
    }
    //tipo de obras
    const [TipoObras, setTipoObras] = useState([])
    const [TipoObraSeleccionada, setTipoObraSeleccionada] = useState(0)
    async function fetchTipoObras() {
        var res = await axios.post(`${UrlServer}/getTipoObras`, {
            id_acceso: sessionStorage.getItem("idacceso")
        })
        setTipoObras(res.data)
    }
    //estados
    const [EstadosObra, setEstadosObra] = useState([])
    const [EstadosObraeleccionada, setEstadosObraeleccionada] = useState(0)
    async function fetchEstadosObra() {
        var res = await axios.post(`${UrlServer}/getEstados`, {
            id_acceso: sessionStorage.getItem("idacceso"),
            "id_unidadEjecutora": ProvinciaSeleccionada
        })
        setEstadosObra(res.data)
    }
    //obras
    const [Obras, setObras] = useState([])
    async function fetchObras() {
        var res = await axios.post(`${UrlServer}/listaObrasByIdAcceso`, {
            id_acceso: sessionStorage.getItem("idacceso"),
            id_unidadEjecutora: ProvinciaSeleccionada,
            idsectores: SectoreSeleccionado,
            Estados_id_Estado: EstadosObraeleccionada,
            id_tipoObra: TipoObraSeleccionada,

        })
        setObras(res.data)
        if (!sessionStorage.getItem('idobra')) {
            recargar(res.data[0])
        }
    }
    useEffect(() => {
        fetchSectores()
        setSectoreSeleccionado(0)
        fetchEstadosObra()
        setEstadosObraeleccionada(0)
    }, [ProvinciaSeleccionada])

    useEffect(() => {
        if (ProvinciaSeleccionada != -1) {
            fetchObras()
        }
    }, [ProvinciaSeleccionada, SectoreSeleccionado, TipoObraSeleccionada, EstadosObraeleccionada])

    return (
        <div>
            {Comunicados.map((comunicado, index) =>
                <div key={index} className="aviso">
                    <h6 className="textoaviso">COMUNICADO: </h6>
                    <p> -- {comunicado.texto_mensaje}</p>
                </div>
            )}
            <div className="fondo">
            </div>
            <div
                style={{
                    display:"flex"
                }}
            >
                <Input
                    type="select"
                    onChange={(e) => {
                        setProvinciaSeleccionada(e.target.value)
                    }}
                    value={ProvinciaSeleccionada}
                    style={{
                        backgroundColor: "#171819",
                        borderColor: "#171819",
                        color: "#ffffff",
                        cursor:"pointer"
                    }}
                >
                    <option value="0">
                        Todas las provincias
                    </option>
                    {Provincias.map((item, i) =>
                        <option key={i} value={item.id_unidadEjecutora}>{item.nombre}</option>
                    )}
                </Input>
                <Input
                    type="select"
                    onChange={(e) => setSectoreSeleccionado(e.target.value)}
                    value={SectoreSeleccionado}
                    style={{
                        backgroundColor: "#171819",
                        borderColor: "#171819",
                        color: "#ffffff",
                        cursor:"pointer"
                    }}
                >
                    <option value="0">
                        Todos los sectores
                        </option>
                    {Sectores.map((item, i) =>
                        <option key={i} value={item.idsectores}>{item.nombre}</option>
                    )}
                </Input>
                <Input
                    type="select"
                    onChange={(e) => setEstadosObraeleccionada(e.target.value)}
                    value={EstadosObraeleccionada}
                    style={{
                        backgroundColor: "#171819",
                        borderColor: "#171819",
                        color: "#ffffff",
                        cursor:"pointer"
                    }}
                >
                    <option value="0">
                        Todos los estados
                        </option>
                    {
                        EstadosObra.map((item, index) =>
                            <option key={index} value={item.id_Estado}>{item.nombre}</option>
                        )
                    }
                </Input>
            </div>
            {
                <table className="table table-sm" >
                    <thead>
                        <tr>
                            <th className="text-center">N°</th>
                            <th  >OBRA</th>
                            <th className="text-center">ESTADO</th>
                            <th
                                style={{ width: "70px", minWidth: "50px", textAlign: "center" }}
                            >UDM </th>
                            <th className="text-center" >AVANCE </th>
                            <th className="text-center" >OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody >
                        {Obras.map((item, i) =>
                            [
                                (
                                    (
                                        (i == 0)
                                        ||
                                        (
                                            i > 0
                                            &&
                                            item.unidad_ejecutora_nombre != Obras[i - 1].unidad_ejecutora_nombre
                                        )
                                    )
                                    &&
                                    <tr>
                                        <td
                                            colSpan="8"
                                            style={{
                                                color: "#cecece",
                                                fontSize: "1.2rem",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {item.unidad_ejecutora_nombre}
                                        </td>
                                    </tr>

                                )
                                ,
                                (
                                    (
                                        (i == 0)
                                        ||
                                        (item.unidad_ejecutora_nombre != Obras[i - 1].unidad_ejecutora_nombre)
                                        ||
                                        (
                                            i > 0
                                            &&
                                            item.sector_nombre != Obras[i - 1].sector_nombre
                                        )
                                    )
                                    &&
                                    <tr>
                                        <td
                                            colSpan="8"
                                            style={{
                                                color: "#ffa500",
                                                fontSize: "1rem",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {item.sector_nombre}
                                        </td>
                                    </tr>
                                )
                                ,
                                <tr key={item.id_ficha}
                                    style={
                                        sessionStorage.getItem('idobra') == item.id_ficha ?
                                            {
                                                backgroundColor: "#171819"
                                            }
                                            :
                                            {}
                                    }

                                >
                                    <td>
                                        {i + 1}
                                    </td>
                                    <td
                                        onClick={() => { recargar(item) }}
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >
                                        <Button
                                            type="button"
                                            style={{
                                                borderRadius: "13px",
                                                // padding: " 0 10px",
                                                margin: "5px",
                                                backgroundColor: "#171819"
                                            }}
                                        // onClick={() => { recargar(item) }}
                                        >
                                            {item.codigo}
                                        </Button>
                                        {item.g_meta}
                                        <div
                                            style={{
                                                color: "#17a2b8"
                                            }}
                                        >
                                            PRESUPUESTO S./{Redondea(item.g_total_presu)}
                                        </div>
                                    </td>
                                    <td>
                                        <EstadoObra id_ficha={item.id_ficha} />
                                    </td>
                                    <td className="text-center">
                                        {calcular_dias(item.ultima_fecha, new Date()) - 1} días <div>{fechaFormatoClasico(item.ultima_fecha)}</div>

                                    </td>
                                    <td
                                        style={{
                                            width: "15%"
                                        }}
                                    >
                                        <FisicoBarraPorcentaje id_ficha={item.id_ficha} />
                                        <FinancieroBarraPorcentaje id_ficha={item.id_ficha} />
                                    </td>
                                    <td>
                                        <div className="d-flex">
                                            <button
                                                className="btn btn-outline-info btn-sm mr-1"
                                                title="Avance Componentes"
                                                onClick={() => onChangeObraComponentesSeleccionada(item.id_ficha)}
                                            >
                                                <FaList />
                                            </button>
                                            <ModalListaPersonal id_ficha={item.id_ficha} codigo_obra={item.codigo} />
                                            <ModalInformacionObras id_ficha={item.id_ficha} />
                                        </div>
                                        <div className="d-flex">

                                            <Curva_S id_ficha={item.id_ficha} />
                                            <Obras_labels_edicion
                                                id_ficha={item.id_ficha}
                                                recargarObraLabels={recargarObraLabels}
                                                codigo={item.codigo}
                                            />
                                            <CarouselImagenesObra
                                                id_ficha={item.id_ficha}
                                                codigo={item.codigo}
                                            />

                                        </div>

                                    </td>
                                </tr>
                                ,
                                <tr
                                    style={
                                        sessionStorage.getItem('idobra') == item.id_ficha ?
                                            {
                                                backgroundColor: "#171819"
                                            }
                                            :
                                            {}
                                    }
                                >
                                    <td
                                        style={{
                                            "border-top": "none"
                                        }}
                                    ></td>
                                    <td colSpan="8"
                                        style={{
                                            "border-top": "none"
                                        }}
                                    >
                                        <Obras_labels
                                            key={item.id_ficha}
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

            }

        </div >

    );
}
//componente de estado de obra
function EstadoObra({ id_ficha }) {
    useEffect(() => {
        fetchData()
    }, []);
    const [EstadoObra, setEstadoObra] = useState({})
    async function fetchData() {
        var res = await axios.post(`${UrlServer}/getEstadoObra`, {
            id_ficha: id_ficha
        })
        setEstadoObra(res.data)
    }

    return (
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
                "--label-r": hexToRgb(EstadoObra.color).r,
                "--label-g": hexToRgb(EstadoObra.color).g,
                "--label-b": hexToRgb(EstadoObra.color).b,
                "--label-h": hexToRgb(EstadoObra.color).h,
                "--label-s": hexToRgb(EstadoObra.color).s,
                "--label-l": hexToRgb(EstadoObra.color).l,
                margin: "5px",
                cursor: "default"
            }}
        >
            {EstadoObra.nombre}
        </Button>


    );
}
//avancecomponente
function ComponenteAvance({ id_componente }) {
    useEffect(() => {
        fetchData()
    }, []);
    const [ComponenteAvance, setComponenteAvance] = useState(0)
    async function fetchData() {
        var res = await axios.post(`${UrlServer}/getFisicoComponente`, {
            id_componente
        })
        setComponenteAvance(res.data.avance)
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
        var res = await axios.post(`${UrlServer}/getFisicoComponente`, {
            id_componente
        })
        setComponenteAvancePorcentaje(res.data.avance / componente.presupuesto * 100)
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

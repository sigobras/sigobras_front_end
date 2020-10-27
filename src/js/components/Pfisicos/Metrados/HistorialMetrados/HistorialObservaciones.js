import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Collapse, Popover, PopoverBody, CustomInput } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import axios from 'axios';
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import { FaFileDownload } from 'react-icons/fa'
import { FechaActual, Extension } from "../../../Utils/Funciones"
function HistorialObservaciones(params) {
    const [Option, setOption] = useState({
        nombre: "test",
        background: "danger",
        popoverOpen: false
    })
    useEffect(() => {
        fetchDificultades()
        fetchConsultas()
        fetchObservaciones()
    }, []);
    //files 
    const [Files, setFiles] = useState([])
    function onChangeInputFile(e, i) {
        var Dataclonado = [...Files]
        Dataclonado[i] = e.target.files[0]
        setFiles(Dataclonado)
    }
    const hiddenFileInput = useRef(null);
    const uploadFile = event => {
        hiddenFileInput.current.click();
    };
    function DescargarArchivo(data) {
        var tipoArchivo = Extension(data)
        const url = data
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data, "target", "_blank");
        link.setAttribute("target", "_blank");
        link.click();
    }
    //dificultades
    const [Dificultades, setDificultades] = useState([])
    async function fetchDificultades() {
        const request = await axios.post(`${UrlServer}/getDificultades`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        setDificultades(request.data);
        return request
    }
    function onchangeDificultades(i, value, name) {
        var Dataclonado = [...Dificultades]
        Dataclonado[i][name] = value
        if (name == "residente_fechaInicio" || name == "residente_duracion" || name == "residente_tipoDuracion" || name == "residente_fechaFinal") {
            var dias = Dataclonado[i].residente_duracion
            if (Dataclonado[i].residente_tipoDuracion == "horas") {
                dias = Dataclonado[i].residente_duracion / 8
            }
            var fecha_inicio = Dataclonado[i].residente_fechaInicio
            fecha_inicio = fecha_inicio.split("-")
            var result = new Date(fecha_inicio[0], fecha_inicio[1] - 1, fecha_inicio[2]);
            result.setDate(result.getDate() + parseInt(dias));
            result = result.toLocaleDateString("fr-CA");
            Dataclonado[i].residente_fechaFinal = result
        }
        if (name == "supervisor_visto") {
            console.log("checked");
            var currentDate = new Date().toLocaleDateString("fr-CA");
            Dataclonado[i].supervisor_fechaVisto = currentDate
        }
        console.log("capturar datos", Dataclonado);
        setDificultades(Dataclonado)
    }
    function addDificultad() {
        var datosAdd =
        {
            id: null,
            residente_descripcion: "descripcion",
            residente_documento: "documento",
            residente_documentoLink: "",
            residente_fechaInicio: "",
            residente_duracion: "0",
            residente_tipoDuracion: "dias",
            residente_fechaFinal: "",
            supervisor_fechaVisto: "",
            supervisor_visto: 0,
            supervisor_comentario: "comentario",
            fichas_id_ficha: sessionStorage.getItem('idobra'),
            habilitado: 1
        }
        var empuje = [...Dificultades, datosAdd]

        setDificultades(empuje)
        var filesTemp = [...Files, ""]
        setFiles(filesTemp)
    }
    async function saveDificultad(i) {
        console.log(Dificultades[i]);
        const formData = new FormData();
        formData.append('id', Dificultades[i].id)
        formData.append('residente_descripcion', Dificultades[i].residente_descripcion)
        formData.append('residente_documento', Dificultades[i].residente_documento)
        formData.append('residente_fechaInicio', Dificultades[i].residente_fechaInicio)
        formData.append('residente_duracion', Dificultades[i].residente_duracion)
        formData.append('residente_tipoDuracion', Dificultades[i].residente_tipoDuracion)
        formData.append('residente_fechaFinal', Dificultades[i].residente_fechaFinal)
        formData.append('supervisor_fechaVisto', Dificultades[i].supervisor_fechaVisto)
        formData.append('supervisor_visto', Dificultades[i].supervisor_visto)
        formData.append('supervisor_comentario', Dificultades[i].supervisor_comentario)
        formData.append('fichas_id_ficha', Dificultades[i].fichas_id_ficha)
        formData.append('residente_archivo', Files[i])
        formData.append('obra_codigo', sessionStorage.getItem("codigoObra"))
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        if (sessionStorage.getItem('cargo') == "RESIDENTE") {
            if (confirm("Los datos ingresados se guardaran, esta seguro?")) {


                const request = await axios.post(`${UrlServer}/postDificultadesResidente`,
                    formData,
                    config
                )
                alert("Datos guardados con exito")
            }
        } else if (sessionStorage.getItem('cargo') == "SUPERVISOR") {
            if (confirm("Esta accion no es reversible , esta seguro?")) {
                const request = await axios.post(`${UrlServer}/postDificultadesSupervisor`,
                    formData,
                    config
                )
                alert("Datos guardados con exito")
            }
        }
        fetchDificultades()
    }
    //Consultas
    const [Consultas, setConsultas] = useState([])
    async function fetchConsultas() {
        const request = await axios.post(`${UrlServer}/getConsultas`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        console.log("consultas", request.data);
        setConsultas(request.data);
        return request
    }
    function onchangeConsultas(i, value, name) {
        var Dataclonado = [...Consultas]
        Dataclonado[i][name] = value
        if (name == "supervisor_respuesta") {
            console.log("checked");
            var currentDate = new Date().toLocaleDateString("fr-CA");
            Dataclonado[i].supervisor_fechaVisto = currentDate
        }
        setConsultas(Dataclonado)
        console.log("onchange ", Dataclonado);
    }
    function addConsulta() {
        var datosAdd =
        {
            "id": null,
            "fecha": "",
            "residente_descripcion": "",
            "supervisor_fechaVisto": "",
            "supervisor_respuesta": "",
            "supervisor_comentario": "",
            "habilitado": 1,
            "fichas_id_ficha": sessionStorage.getItem('idobra')
        }
        var empuje = [...Consultas, datosAdd]
        setConsultas(empuje)
    }
    async function saveConsulta(i) {
        if (sessionStorage.getItem('cargo') == "RESIDENTE") {
            if (confirm("Los datos ingresados se guardaran, esta seguro?")) {
                const request = await axios.post(`${UrlServer}/postConsultaResidente`,
                    Consultas[i]
                )
                alert("Datos guardados con exito")
            }
        } else if (sessionStorage.getItem('cargo') == "SUPERVISOR") {
            if (confirm("Esta accion no es reversible , esta seguro?")) {
                const request = await axios.post(`${UrlServer}/postConsultaSupervisor`,
                    Consultas[i]
                )
                alert("Datos guardados con exito")
            }
        }
        fetchConsultas()
    }
    //observaciones
    const [Observaciones, setObservaciones] = useState([])
    async function fetchObservaciones() {
        const request = await axios.post(`${UrlServer}/getObservaciones`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        console.log("Observaciones", request.data);
        setObservaciones(request.data);
        return request
    }
    function onchangeObservaciones(i, value, name) {
        var Dataclonado = [...Observaciones]
        Dataclonado[i][name] = value
        if (name == "supervisor_respuesta") {
            console.log("checked");
            var currentDate = new Date().toLocaleDateString("fr-CA");
            Dataclonado[i].supervisor_fechaVisto = currentDate
        }
        if (name == "descripcion") {
            console.log("checked");
            var currentDate = new Date().toLocaleDateString("fr-CA");
            Dataclonado[i].fecha = currentDate
        }
        if (name == "respuesta") {
            console.log("checked");
            var currentDate = new Date().toLocaleDateString("fr-CA");
            Dataclonado[i].respuesta_fecha = currentDate
        }
        setObservaciones(Dataclonado)
        console.log("onchange ", Dataclonado);
    }
    function addObservacion() {
        var datosAdd =
        {
            "id": null,
            "autor": sessionStorage.getItem('idacceso'),
            "cargo": sessionStorage.getItem('cargo'),
            "fecha": "",
            "descripcion": "",
            "respuesta": null,
            "respuesta_fecha": null,
            "respuesta_autor": null,
            "fichas_id_ficha": sessionStorage.getItem('idobra'),
            "habilitado": 1
        }
        var empuje = [...Observaciones, datosAdd]
        setObservaciones(empuje)
    }
    async function saveObservacion(i) {
        if (sessionStorage.getItem('cargo') == Observaciones[i].cargo) {
            if (confirm("Los datos ingresados se guardaran, esta seguro?")) {
                const request = await axios.post(`${UrlServer}/postObservacionesResidente`,
                    Observaciones[i]
                )
                alert("Datos guardados con exito")
            }
        } else {
            if (confirm("Esta accion no es reversible , esta seguro?")) {
                const request = await axios.post(`${UrlServer}/postObservacionesSupervisor`,
                    Observaciones[i]
                )
                alert("Datos guardados con exito")
            }
        }
        fetchObservaciones()
    }


    return (
        <div>
            <Input type="select"
                onChange={e => setOption(e.target.value)}
                className="w-25 form-control"
                defaultValue="SELECCIONE"
            >
                <option disabled hidden>SELECCIONE</option>
                <option>DIFICULTADES</option>
                <option>CONSULTAS</option>
                <option>OBSERVACIONES</option>
            </Input>
            <Collapse isOpen={(Option == "DIFICULTADES") ? true : false}>
                {
                    sessionStorage.getItem('cargo') == "RESIDENTE"
                        ?
                        <button onClick={() => addDificultad()}> + </button>
                        : ""
                }
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                            <th className="col-4">descripcion</th>
                            <th className="col-2" colSpan="2">documento</th>
                            <th className="col-2">inicio</th>
                            <th className="col-1">duracion</th>
                            <th className="col-1">tipo duracion</th>
                            <th className="col-2">fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Dificultades.map((item, i) =>
                                [
                                    <tr key={"1." + i} className="d-flex">
                                        {/* residente_descripcion */}
                                        <td className="col-4">
                                            <DebounceInput
                                                value={item.residente_descripcion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_descripcion")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_documento */}
                                        <td className="col-1">
                                            <DebounceInput
                                                value={item.residente_documento}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_documento")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                                            />

                                        </td>
                                        {/* residente_documentoLink */}
                                        <td className="col-1">

                                            <div className="text-primary" title="descargar archivo" onClick={() => DescargarArchivo(`${UrlServer}${item.residente_documentoLink}`)} ><FaFileDownload /></div>
                                            <Button
                                                color="primary"
                                                onClick={uploadFile}>
                                                Upload
                                            </Button>
                                            <input type="file"
                                                onChange={(e) => onChangeInputFile(e, i)}
                                                ref={hiddenFileInput}
                                                style={{ display: 'none' }}
                                            />
                                        </td>
                                        {/* residente_fechaInicio */}
                                        <td className="col-2">
                                            <DebounceInput
                                                type="date"
                                                value={item.residente_fechaInicio}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_fechaInicio")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_duracion */}
                                        <td className="col-1">
                                            <DebounceInput
                                                value={item.residente_duracion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_duracion")}
                                                type="number"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_tipoDuracion */}
                                        <td className="col-1">
                                            <Input type="select"
                                                value={item.residente_tipoDuracion}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_tipoDuracion")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                                            >
                                                <option>dias</option>
                                                <option>horas</option>
                                            </Input>
                                        </td>
                                        {/* residente_fechaFinal */}
                                        <td className="col-2">
                                            <DebounceInput
                                                type="date"
                                                value={item.residente_fechaFinal}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_fechaFinal")}
                                                className="form-control"
                                                readOnly={true}
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>

                                    </tr>
                                    ,
                                    <tr key={"2." + i} className="d-flex" >
                                        <td className="col-2">
                                            <DebounceInput
                                                value={item.supervisor_fechaVisto}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "supervisor_fechaVisto")}
                                                type="date"
                                                className="form-control"
                                                readOnly={true}
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        <td className="col-1">
                                            <Input
                                                type="checkbox"
                                                defaultChecked={item.supervisor_visto}
                                                onClick={e => onchangeDificultades(i, e.target.checked, "supervisor_visto")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        <td className="col-6">
                                            <DebounceInput
                                                value={item.supervisor_comentario}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "supervisor_comentario")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        <td><Button
                                            color="primary"
                                            onClick={() => saveDificultad(i)}
                                            disabled={item.habilitado ? false : true}
                                        >Guardar</Button></td>
                                    </tr>
                                ]

                            )
                        }
                    </tbody>
                </table>

            </Collapse>
            <Collapse isOpen={(Option == "CONSULTAS") ? true : false}>
                {
                    sessionStorage.getItem('cargo') == "RESIDENTE"
                        ?
                        <button onClick={() => addConsulta()}> + </button>
                        : ""
                }
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                            <th className="col-2">fecha consulta</th>
                            <th className="col-4">descripcion</th>
                            <th className="col-2">fecha de visto</th>
                            <th className="col-1">check</th>
                            <th className="col-4">COMENTARIO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Consultas.map((item, i) =>
                                [
                                    <tr key={"2." + i} className="d-flex">
                                        {/* fecha */}
                                        <td className="col-2">
                                            <DebounceInput
                                                value={item.fecha}
                                                debounceTimeout={300}
                                                onChange={e => onchangeConsultas(i, e.target.value, "fecha")}
                                                type="date"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_descripcion */}
                                        <td className="col-4">
                                            <DebounceInput
                                                value={item.residente_descripcion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeConsultas(i, e.target.value, "residente_descripcion")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && item.habilitado ? "" : "disabled"}
                                            />

                                        </td>
                                        {/* supervisor_fechaVisto */}
                                        <td className="col-2">
                                            <DebounceInput
                                                readOnly={true}
                                                value={item.supervisor_fechaVisto}
                                                debounceTimeout={300}
                                                onChange={e => onchangeConsultas(i, e.target.value, "supervisor_fechaVisto")}
                                                type="date"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && item.habilitado ? "" : "disabled"}
                                            />

                                        </td>
                                        {/* supervisor_respuesta */}
                                        <td className="col-1">
                                            <Input type="select"
                                                value={item.supervisor_respuesta}
                                                onChange={e => onchangeConsultas(i, e.target.value, "supervisor_respuesta")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && item.habilitado ? "" : "disabled"}
                                            >
                                                <option>SI</option>
                                                <option>NO</option>
                                            </Input>
                                        </td>
                                        {/* supervisor_comentario */}
                                        <td className="col-2">
                                            <DebounceInput
                                                value={item.supervisor_comentario}
                                                debounceTimeout={300}
                                                onChange={e => onchangeConsultas(i, e.target.value, "supervisor_comentario")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        <td><Button
                                            color="primary"
                                            onClick={() => saveConsulta(i)}
                                            disabled={item.habilitado ? false : true}
                                        >Guardar</Button></td>
                                    </tr>
                                ]
                            )
                        }
                    </tbody>
                </table>

            </Collapse>
            <Collapse isOpen={(Option == "OBSERVACIONES") ? true : false}>
                <button onClick={() => addObservacion()}> + </button>
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                            <th className="col-1">CARGO</th>
                            <th className="col-2" >FECHA</th>
                            <th className="col-3">DESCRIPCION</th>
                            <th className="col-2">FECHA VISTO</th>
                            <th className="col-3">COMENTARIO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Observaciones.map((item, i) =>
                                [
                                    <tr key={"1." + i} className="d-flex">
                                        {/* cargo */}
                                        <td className="col-1">
                                            <DebounceInput
                                                readOnly={true}
                                                value={item.cargo}
                                                debounceTimeout={300}
                                                onChange={e => onchangeObservaciones(i, e.target.value, "cargo")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == item.cargo) && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* fecha */}
                                        <td className="col-2">
                                            <DebounceInput
                                                readOnly={true}
                                                value={item.fecha}
                                                debounceTimeout={300}
                                                onChange={e => onchangeObservaciones(i, e.target.value, "fecha")}
                                                type="date"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == item.cargo) && item.habilitado ? "" : "disabled"}
                                            />

                                        </td>
                                        {/* descripcion */}
                                        <td className="col-3">
                                            <DebounceInput
                                                type="text"
                                                value={item.descripcion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeObservaciones(i, e.target.value, "descripcion")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == item.cargo) && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* respuesta_fecha */}
                                        <td className="col-2">
                                            <DebounceInput
                                                readOnly={true}
                                                value={item.respuesta_fecha}
                                                debounceTimeout={300}
                                                onChange={e => onchangeObservaciones(i, e.target.value, "respuesta_fecha")}
                                                type="date"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') != item.cargo) && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* respuesta */}
                                        <td className="col-3">
                                            <DebounceInput
                                                value={item.respuesta}
                                                debounceTimeout={300}
                                                onChange={e => onchangeObservaciones(i, e.target.value, "respuesta")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') != item.cargo) && item.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        <td><Button
                                            color="primary"
                                            onClick={() => saveObservacion(i)}
                                            disabled={item.habilitado ? false : true}
                                        >Guardar</Button></td>
                                    </tr>
                                ]
                            )
                        }
                    </tbody>
                </table>

            </Collapse>
        </div>
    )
}

export default HistorialObservaciones;
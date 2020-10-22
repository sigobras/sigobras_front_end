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

    const [Data, setData] = useState([])
    const [Files, setFiles] = useState([])
    useEffect(() => {
        fetchDificultad()
    }, []);
    async function fetchDificultad() {
        const request = await axios.post(`${UrlServer}/getDificultades`, {
            id_ficha: sessionStorage.getItem('idobra')
        })
        setData(request.data);
        return request
    }
    function onchangeDificultades(i, value, name) {
        var Dataclonado = [...Data]
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
        setData(Dataclonado)
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
        var empuje = [...Data, datosAdd]

        setData(empuje)
        var filesTemp = [...Files, ""]
        setFiles(filesTemp)
    }
    async function saveDificultad(i) {
        console.log(Data[i]);

        if (sessionStorage.getItem('cargo') == "RESIDENTE") {
            if (confirm("Los datos ingresados se guardaran, esta seguro?")) {
                const formData = new FormData();
                formData.append('id', Data[i].id)
                formData.append('residente_descripcion', Data[i].residente_descripcion)
                formData.append('residente_documento', Data[i].residente_documento)
                formData.append('residente_fechaInicio', Data[i].residente_fechaInicio)
                formData.append('residente_duracion', Data[i].residente_duracion)
                formData.append('residente_tipoDuracion', Data[i].residente_tipoDuracion)
                formData.append('residente_fechaFinal', Data[i].residente_fechaFinal)
                formData.append('supervisor_fechaVisto', Data[i].residente_tipoDuracion)
                formData.append('supervisor_visto', Data[i].supervisor_visto)
                formData.append('supervisor_comentario', Data[i].supervisor_comentario)
                formData.append('fichas_id_ficha', Data[i].fichas_id_ficha)
                formData.append('residente_archivo', Files[i])
                formData.append('obra_codigo', sessionStorage.getItem("codigoObra"))
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }

                const request = await axios.post(`${UrlServer}/postDificultadesResidente`,
                    formData,
                    config
                )
                // const request = await axios.post(`${UrlServer}/postDificultadesResidente`, Data[i])
                // console.log(request);
                alert("Datos guardados con exito")
            }
        } else if (sessionStorage.getItem('cargo') == "SUPERVISOR") {
            if (confirm("Esta accion no es reversible , esta seguro?")) {
                const request = await axios.post(`${UrlServer}/postDificultadesSupervisor`, Data[i])
                console.log(request);
                alert("Datos guardados con exito")
            }
        }
        fetchDificultad()
    }
    function DescargarArchivo(data) {
        var tipoArchivo = Extension(data)
        console.log("ulr ", data, "tipo archivo ", tipoArchivo)
        const url = data
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data, "target", "_blank");
        console.log("es una imagen")
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
    }
    function onChange(e, i) {
        var Dataclonado = [...Files]
        Dataclonado[i] = e.target.files[0]
        setFiles(Dataclonado)
    }
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
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
                <option>PENDIENTES</option>
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
                            Data.map((obs, i) =>
                                [
                                    <tr key={"1." + i} className="d-flex">
                                        {/* residente_descripcion */}
                                        <td className="col-4">
                                            <DebounceInput
                                                value={obs.residente_descripcion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_descripcion")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_documento */}
                                        <td className="col-1">
                                            <DebounceInput
                                                value={obs.residente_documento}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_documento")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />

                                        </td>
                                        {/* residente_documentoLink */}
                                        <td className="col-1">

                                            <div className="text-primary" title="descargar archivo" onClick={() => DescargarArchivo(`${UrlServer}${obs.residente_documentoLink}`)} ><FaFileDownload /></div>
                                            <Button
                                                color="primary"
                                                onClick={handleClick}>
                                                Upload
                                            </Button>
                                            <input type="file"
                                                onChange={(e) => onChange(e, i)}
                                                ref={hiddenFileInput}
                                                style={{ display: 'none' }}
                                            />
                                        </td>
                                        {/* residente_fechaInicio */}
                                        <td className="col-2">
                                            <DebounceInput
                                                type="date"
                                                value={obs.residente_fechaInicio}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_fechaInicio")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_duracion */}
                                        <td className="col-1">
                                            <DebounceInput
                                                value={obs.residente_duracion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_duracion")}
                                                type="number"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_tipoDuracion */}
                                        <td className="col-1">
                                            <Input type="select"
                                                value={obs.residente_tipoDuracion}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_tipoDuracion")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            >
                                                <option>dias</option>
                                                <option>horas</option>
                                            </Input>
                                        </td>
                                        {/* residente_fechaFinal */}
                                        <td className="col-2">
                                            <DebounceInput
                                                type="date"
                                                value={obs.residente_fechaFinal}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_fechaFinal")}
                                                className="form-control"
                                                readOnly={true}
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>

                                    </tr>
                                    ,
                                    <tr key={"2." + i} className="d-flex" >
                                        <td className="col-2">
                                            <DebounceInput
                                                value={obs.supervisor_fechaVisto}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "supervisor_fechaVisto")}
                                                type="date"
                                                className="form-control"
                                                readOnly={true}
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        <td className="col-1">
                                            <Input
                                                type="checkbox"
                                                defaultChecked={obs.supervisor_visto}
                                                onClick={e => onchangeDificultades(i, e.target.checked, "supervisor_visto")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        <td className="col-6">
                                            <DebounceInput
                                                value={obs.supervisor_comentario}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "supervisor_comentario")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "SUPERVISOR") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        <td><Button
                                            color="primary"
                                            onClick={() => saveDificultad(i)}
                                            disabled={obs.habilitado ? false : true}
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
                        <button onClick={() => addDificultad()}> + </button>
                        : ""
                }
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                            <th className="col-4">fecha consulta</th>
                            <th className="col-2">descripcion</th>
                            <th className="col-2">fecha de visto</th>
                            <th className="col-1">check</th>
                            <th className="col-1">COMENTARIO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Data.map((obs, i) =>
                                [
                                    <tr key={"1." + i} className="d-flex">
                                        {/* residente_descripcion */}
                                        <td className="col-4">
                                            <DebounceInput
                                                value={obs.residente_descripcion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_descripcion")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_documento */}
                                        <td className="col-1">
                                            <DebounceInput
                                                value={obs.residente_documento}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_documento")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />

                                        </td>
                                        {/* residente_documentoLink */}
                                        <td className="col-1">
                                            <a href={obs.residente_documentoLink} download>
                                                <FaFileDownload size={20} />
                                            </a>
                                        </td>
                                        {/* residente_fechaInicio */}
                                        <td className="col-2">
                                            <DebounceInput
                                                type="date"
                                                value={obs.residente_fechaInicio}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_fechaInicio")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_duracion */}
                                        <td className="col-1">
                                            <DebounceInput
                                                value={obs.residente_duracion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_duracion")}
                                                type="number"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_tipoDuracion */}
                                        <td className="col-1">
                                            <Input type="select"
                                                value={obs.residente_tipoDuracion}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_tipoDuracion")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            >
                                                <option>dias</option>
                                                <option>horas</option>
                                            </Input>
                                        </td>
                                        {/* residente_fechaFinal */}
                                        <td className="col-2">
                                            <DebounceInput
                                                type="date"
                                                value={obs.residente_fechaFinal}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_fechaFinal")}
                                                className="form-control"
                                                readOnly={true}
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>

                                    </tr>
                                ]
                            )
                        }
                    </tbody>
                </table>

            </Collapse>
            <Collapse isOpen={(Option == "PENDIENTES") ? true : false}>
                <button onClick={() => addDificultad()}> + </button>
                <table className="table">
                    <thead>
                        <tr className="d-flex">
                            <th className="col-4">CARGO</th>
                            <th className="col-2" >FECHA</th>
                            <th className="col-2">DESCRIPCION</th>
                            <th className="col-1">FECHA VISTO</th>
                            <th className="col-1">COMENTARIO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Data.map((obs, i) =>
                                [
                                    <tr key={"1." + i} className="d-flex">
                                        {/* residente_descripcion */}
                                        <td className="col-4">
                                            <DebounceInput
                                                value={obs.residente_descripcion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_descripcion")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_documento */}
                                        <td className="col-1">
                                            <DebounceInput
                                                value={obs.residente_documento}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_documento")}
                                                type="text"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />

                                        </td>
                                        {/* residente_documentoLink */}
                                        <td className="col-1">
                                            <a href={obs.residente_documentoLink} download>
                                                <FaFileDownload size={20} />
                                            </a>
                                        </td>
                                        {/* residente_fechaInicio */}
                                        <td className="col-2">
                                            <DebounceInput
                                                type="date"
                                                value={obs.residente_fechaInicio}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_fechaInicio")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_duracion */}
                                        <td className="col-1">
                                            <DebounceInput
                                                value={obs.residente_duracion}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_duracion")}
                                                type="number"
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>
                                        {/* residente_tipoDuracion */}
                                        <td className="col-1">
                                            <Input type="select"
                                                value={obs.residente_tipoDuracion}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_tipoDuracion")}
                                                className="form-control"
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            >
                                                <option>dias</option>
                                                <option>horas</option>
                                            </Input>
                                        </td>
                                        {/* residente_fechaFinal */}
                                        <td className="col-2">
                                            <DebounceInput
                                                type="date"
                                                value={obs.residente_fechaFinal}
                                                debounceTimeout={300}
                                                onChange={e => onchangeDificultades(i, e.target.value, "residente_fechaFinal")}
                                                className="form-control"
                                                readOnly={true}
                                                disabled={(sessionStorage.getItem('cargo') == "RESIDENTE") && obs.habilitado ? "" : "disabled"}
                                            />
                                        </td>

                                    </tr>
                                ]
                            )
                        }
                    </tbody>
                </table>

            </Collapse>
            <UserForm />
        </div>
    )
}
function UserForm() {
    const form = useRef(null)
    const submit = e => {
        e.preventDefault()
        const data = new FormData(form.current)
        fetch('/api', { method: 'POST', body: data })
            .then(res => res.json())
            .then(json => setUser(json.user))
    }
    return (
        <form ref={form} onSubmit={submit}>
            <input type="text" name="user[name]" />
            test
            <input type="email" name="user[email]" />
            test2
            <input type="submit" name="Sign Up" />
        </form>
    )
}


export default HistorialObservaciones;
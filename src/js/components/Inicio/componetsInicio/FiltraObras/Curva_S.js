import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Input, Alert } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';
import { Redondea, mesesShort } from './../../../Utils/Funciones';
import axios from 'axios';
import { UrlServer } from '../../../Utils/ServerUrlConfig';
import { Line } from 'react-chartjs-2';
import { MdSave, MdClose, MdModeEdit } from "react-icons/md";
import '../FiltraObras/Curva_s.css'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function Curva_S({ id_ficha }) {
    function getMesfromDate(date) {
        date = date.split("-")
        return Number(date[1])
    }
    function getAnyofromDate(date) {
        date = date.split("-")
        return Number(date[0])
    }
    function anyoMesActual() {
        var fecha = new Date()

        var anio = fecha.getFullYear();
        var mes = fecha.getMonth() + 1;
        var dia = fecha.getDate();


        if (dia < 10) {
            dia = "0" + dia
        }
        if (mes < 10) {
            mes = "0" + mes
        }

        return anio + '-' + mes
    }
    function anyoMes(dateText) {
        var anyoMes = dateText.substring(0, 7)
        return anyoMes
    }
    //verificar historial incompleto de hitos

    const [RegistroNoUbicados, setRegistroNoUbicados] = useState({});
    async function fetchRegistrosNoUbicados() {
        const request = await axios.post(`${UrlServer}/getRegistroNoUbicados`, {
            "id_ficha": id_ficha
        })
        console.log(request.data);
        setRegistroNoUbicados(request.data[0])
    }
    // modal
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setPeriodosEjecutados([])
        setMesesModal([])
        setYearsModalData([])
        setModal(!modal)
    };
    //datas por defecto
    useEffect(() => {
        fetchRegistrosNoUbicados()
        fetchAnyosEjecutados()
        fetchDataCurvaS()
        fetchYearsModal()
    }, []);
    //modal data
    const [MesesModal, setMesesModal] = useState([
        {
            "fecha_inicial": "",
            "programado_monto": 0,
            "financiero_monto": 0,
            "ejecutado_monto": 0,
            "observacion": "",
            "estado_codigo": "E",
            "fichas_id_ficha": id_ficha,
        },
    ]);
    function addMesModal() {
        var dataClonado = [...MesesModal]
        dataClonado.push(
            {
                "fecha_inicial": "",
                "programado_monto": 0,
                "financiero_monto": 0,
                "ejecutado_monto": 0,
                "observacion": "",
                "estado_codigo": "E",
                "fichas_id_ficha": id_ficha,
            },
        )
        setMesesModal(dataClonado);
    }
    function onChangeModalData(value, name, i) {
        var Dataclonado = [...MesesModal]
        Dataclonado[i][name] = value
        if (name == "anyoMes") {
            Dataclonado[i].fecha_inicial = value + "-01"
        }
        setMesesModal(Dataclonado)
    }
    async function saveModalData() {
        if (FormularioOpcion == "ejecutado") {
            const request = await axios.post(`${UrlServer}/postDataCurvaS`, PeriodosEjecutados)
            alert("Periodos Ejecutados :" + request.data.message)
        }

        if (FormularioOpcion == "nuevo") {
            //seccion de mesesmodal
            const request2 = await axios.post(`${UrlServer}/postDataCurvaS`, MesesModal)
            alert("Periodos Nuevos :" + request2.data.message)
        }

        if (FormularioOpcion == "total") {
            //seccion de mesesmodal
            const request2 = await axios.post(`${UrlServer}/postDataCurvaS`, YearsModalData)
            alert("Total de años :" + request2.data.message)
        }

        setModal(false)
        fetchDataCurvaS()
        fetchAnyosEjecutados()
        setMesesModal([])
    }
    //data de curva s
    const [DataCurvaS, setDataCurvaS] = useState([]);
    async function fetchDataCurvaS() {
        const request = await axios.post(`${UrlServer}/getDataCurvaS`,
            {
                "id_ficha": id_ficha
            }
        )
        //actualizacion de monto ejecutado
        for (let i = 0; i < request.data.length; i++) {
            const element = request.data[i];
            if (anyoMes(element.fecha_inicial) == anyoMesActual()) {
                var ejecutado_monto = await updateEjecutado(element.fecha_inicial)
                element.ejecutado_monto = ejecutado_monto
                break;
            }
        }

        setDataCurvaS(request.data)
        createDataChart(request.data)
    }
    //cargar anyos data select
    const [AnyosEjecutados, setAnyosEjecutados] = useState([]);
    const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0);
    async function fetchAnyosEjecutados() {
        const request = await axios.post(`${UrlServer}/getAnyosNoRegistradosCurvaS`,
            {
                "id_ficha": id_ficha
            }
        )
        setAnyosEjecutados(request.data)
        fetchPeriodosEjecutados(request.data[request.data.length - 1].anyo)
        setAnyoSeleccionado(request.data[request.data.length - 1].anyo)
    }
    //periodos ejecutados
    const [PeriodosEjecutados, setPeriodosEjecutados] = useState([]);
    async function fetchPeriodosEjecutados(anyo) {
        const request = await axios.post(`${UrlServer}/getPeriodosEjecutados`,
            {
                "id_ficha": id_ficha,
                "anyo": anyo
            }
        )
        //procesamiento
        var tempData = request.data.data
        tempData.forEach(element => {
            element.programado_monto = element.ejecutado_monto
            element.financiero_monto = 0
            element.observacion = ""
            element.fichas_id_ficha = id_ficha
        });
        setPeriodosEjecutados(tempData)
    }
    function onChangePeriodosData(value, name, i) {
        var Dataclonado = [...PeriodosEjecutados]
        Dataclonado[i][name] = value
        setPeriodosEjecutados(Dataclonado)
    }
    function onChangeAnyo(value) {
        fetchPeriodosEjecutados(value)
        setAnyoSeleccionado(value)
    }
    //actualizar monto ejecutado
    async function updateEjecutado(fecha_inicial) {
        const request = await axios.post(`${UrlServer}/putEjecutadoMonto`,
            {
                "fecha_inicial": fecha_inicial,
                "id_ficha": id_ficha
            }
        )
        return request.data.ejecutado_monto
    }
    //chart
    const [DataChart, setDataChart] = useState({});
    function createDataChart(dataCurvaS) {

        var labels = []
        var programado = []
        var ejecutado = []
        var financiero = []

        var programado_acumulado = 0
        var ejecutado_acumulado = 0
        var financiero_acumulado = 0

        dataCurvaS.forEach((item, i) => {
            if (item.tipo == "PERIODO") {
                var label = mesesShort[getMesfromDate(item.fecha_inicial) - 1] + " - " + getAnyofromDate(item.fecha_inicial)
                labels.push(label)
                programado_acumulado += item.programado_monto
                programado.push(programado_acumulado)

                ejecutado_acumulado += item.ejecutado_monto
                ejecutado.push(ejecutado_acumulado)

                financiero_acumulado += item.financiero_monto
                financiero.push(financiero_acumulado)
            }
        })
        //clean ejecutado
        var ejecutado_monto_break = true
        var financiero_monto_break = true
        var programado_monto_break = true
        for (let i = dataCurvaS.length - 1; i > 0; i--) {
            var item = dataCurvaS[i]
            if (ejecutado_monto_break && (item.ejecutado_monto == 0 || item.ejecutado_monto == null)) {
                ejecutado.pop()
            } else {
                ejecutado_monto_break = false
            }
            if (financiero_monto_break && (item.financiero_monto == 0 || item.financiero_monto == null)) {
                financiero.pop()
            } else {
                financiero_monto_break = false
            }
            if (programado_monto_break && (item.programado_monto == 0 || item.programado_monto == null)) {
                programado.pop()
            } else {
                programado_monto_break = false
            }
        }
        setDataChart({

            labels: labels,
            datasets: [
                {
                    name: 'PROGRAMADO',
                    data: programado,
                    // backgroundColor: "#0080ff",
                    color: "#0080ff",
                    // fill: false,
                }
                ,
                {
                    name: 'EJECUTADO',
                    data: ejecutado,
                    // backgroundColor: "#fd7e14",
                    color: "#fd7e14",
                    // fill: false,
                }
                ,
                {
                    name: 'FINANCIERO',
                    data: financiero,
                    // backgroundColor: "#ffc107",
                    color: "#ffc107",
                    // fill: false,
                }
            ]
        });
    }
    //update financiero 
    async function updateFinanciero(id, i) {
        const request = await axios.post(`${UrlServer}/putFinancieroCurvaS`,
            {
                "id": id,
                "financiero_monto": ValueInputFinanciero[i]
            })
        fetchDataCurvaS()
        toggleInputFinanciero(-1)
    }
    const [EstadoInputFinanciero, setEstadoInputFinanciero] = useState(-1);
    function toggleInputFinanciero(index) {
        setEstadoInputFinanciero(index);
    }
    const [ValueInputFinanciero, setValueInputFinanciero] = useState([]);
    function onChangeInputFinanciero(value, i) {
        var dataTemp = [...ValueInputFinanciero]
        dataTemp[i] = value
        setValueInputFinanciero(dataTemp)
    }
    const options = {
        chart: {
            // type: 'area',
            "backgroundColor": "#242526",
            "style": {
                "fontFamily": "Roboto",
                "color": "#666666"
            }
        },
        title: {
            text: 'CURVA S',
            "align": "center",
            "style": {
                "fontFamily": "Roboto Condensed",
                "fontWeight": "bold",
                "color": "#666666"
            }
        },

        // subtitle: {
        //     text: 'Source: thesolarfoundation.com'
        // },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        tooltip: {
            split: true,
            valueSuffix: ' Soles'
        },
        xAxis: {
            categories: DataChart.labels,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'SOLES'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000;
                },

            },
            "gridLineColor": "#424242",
            "ridLineWidth": 1,
            "minorGridLineColor": "#424242",
            "inoGridLineWidth": 0.5,
            "tickColor": "#424242",
            "minorTickColor": "#424242",
            "lineColor": "#424242"
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    color: 'white',
                    style: {
                        textOutline: false
                    }
                },
            }
        },
        series: DataChart.datasets
    }
    //actualizar programado
    const [ValueInputProgramado, setValueInputProgramado] = useState([]);
    function onChangeInputProgramado(value, i) {
        var dataTemp = [...ValueInputProgramado]
        dataTemp[i] = value
        setValueInputProgramado(dataTemp)
    }
    async function updateProgramado(id, i) {
        const request = await axios.post(`${UrlServer}/putProgramadoCurvaSbyId`,
            {
                "id": id,
                "programado_monto": ValueInputProgramado[i]
            })
        fetchDataCurvaS()
        toggleInputProgramado(-1)
    }
    const [EstadoInputProgramado, setEstadoInputProgramado] = useState(-1);
    function toggleInputProgramado(index) {
        setEstadoInputProgramado(index);
    }

    //ingreso de nuevos anyos
    const [YearsModal, setYearsModal] = useState([]);
    function fetchYearsModal() {
        var actualYear = new Date().getFullYear()
        actualYear -= 5
        var years = []
        for (let i = 0; i < 10; i++) {
            years.push(actualYear)
            actualYear++
        }
        setYearsModal(years)
    }
    const [YearsModalData, setYearsModalData] = useState(
        [
            {
                "fecha_inicial": "",
                "programado_monto": 0,
                "financiero_monto": 0,
                "ejecutado_monto": 0,
                "observacion": "",
                "estado_codigo": "E",
                "fichas_id_ficha": id_ficha,
                "anyo": "SELECCIONE",
                "tipo": "TOTAL"
            }
        ]
    );

    function onChangeModalYears(value, name, i) {
        var Dataclonado = [...YearsModalData]
        Dataclonado[i][name] = value
        if (name == "anyo") {
            Dataclonado[i].fecha_inicial = value + "-12-31"

            Dataclonado[i].programado_monto_propuesto = sumatoriaAnyo(value, "programado_monto")
            Dataclonado[i].ejecutado_monto = sumatoriaAnyo(value, "ejecutado_monto")
        }
        setYearsModalData(Dataclonado)
        console.log(Dataclonado);
    }
    function addYearModalYears() {
        var dataClonado = [...YearsModalData]
        dataClonado.push(
            {
                "fecha_inicial": "",
                "programado_monto": 0,
                "financiero_monto": 0,
                "ejecutado_monto": 0,
                "observacion": "",
                "estado_codigo": "E",
                "fichas_id_ficha": id_ficha,
                "anyo": "SELECCIONE",
                "tipo": "TOTAL"
            },
        )
        setYearsModalData(dataClonado);
    }
    //tipo de formulario
    const [FormularioOpcion, setFormularioOpcion] = useState("SELECCIONE");
    //calcular sumatoria de un anyo
    function sumatoriaAnyo(anyo, name) {
        var sumatoria = DataCurvaS.reduce((total, item) => {
            // console.log(getAnyofromDate(item.fecha_inicial), anyo,getAnyofromDate(item.fecha_inicial) == anyo);
            if (getAnyofromDate(item.fecha_inicial) == anyo) {
                total += Number(item[name])
            }
            return total
        }, 0)
        return sumatoria
    }
    return (
        <div>
            <div style={{
                overflowY: "auto",
                // position: "relative",
                // textAlign: "center",
                // color: "white",
                // maxWidth: "600px",
                // maxHeight: "600px",
            }}>
                {DataCurvaS.length > 0 ?
                    [
                        <div
                            key={0}
                            style={{
                                // overflowY: "auto",
                                position: "relative",
                                // textAlign: "center",
                                // color: "white",
                                maxWidth: "600px",
                                maxHeight: "1000px",
                            }}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                // constructorType={'stockChart'}
                                options={options}
                            />
                            {/* <Line data={DataChart} options={opt} /> */}
                        </div>,

                        (
                            sessionStorage.getItem("cargo") == "RESIDENTE" &&
                            <Button
                                key={1}
                                color="danger"
                                onClick={toggle}>+</Button>
                        )
                        ,
                        <table
                            key={2}
                            className="table table-sm small">
                            <thead>
                                <tr>
                                    <th>
                                        MES
                                    </th>
                                    {
                                        DataCurvaS.map((item, i) =>
                                            <th
                                                key={i}
                                                style={
                                                    item.tipo == "TOTAL" ?
                                                        { background: "#9a0000" }
                                                        : {}
                                                }
                                            >
                                                {item.estado_codigo == 'C' ? "CORTE " : ""}
                                                {mesesShort[getMesfromDate(item.fecha_inicial) - 1]} - {getAnyofromDate(item.fecha_inicial)}
                                            </th>
                                        )
                                    }

                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th>
                                        PROGRAMADO
                        </th>
                                    {
                                        DataCurvaS.map((item, i) =>
                                            <td key={i}>
                                                {
                                                    item.ejecutado_monto == 0 && EstadoInputProgramado == i ?

                                                        <div
                                                            className="d-flex"
                                                        >
                                                            <DebounceInput
                                                                value={item.Programado_monto}
                                                                debounceTimeout={300}
                                                                onChange={e => onChangeInputProgramado(e.target.value, i)}
                                                                type="number"
                                                            />
                                                            <div
                                                                onClick={() => updateProgramado(item.id, i)}
                                                            >
                                                                <MdSave className="icon" />
                                                            </div>
                                                            <div
                                                                onClick={() => toggleInputProgramado(-1)}
                                                            >
                                                                <MdClose className="icon" />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div
                                                            className="d-flex"
                                                        >
                                                            {Redondea(item.programado_monto)}
                                                            {item.ejecutado_monto == 0 &&
                                                                <div
                                                                    onClick={() => toggleInputProgramado(i)}
                                                                >
                                                                    <MdModeEdit className="icon" />
                                                                </div>
                                                            }
                                                        </div>
                                                }
                                            </td>
                                        )
                                    }
                                </tr>
                                <tr >
                                    <th>
                                        EJECUTADO
                        </th>
                                    {
                                        DataCurvaS.map((item, i) =>
                                            <td key={i}>{Redondea(item.ejecutado_monto)}</td>
                                        )
                                    }
                                </tr>
                                <tr >
                                    <th>
                                        FINANCIERO
                                    </th>
                                    {
                                        DataCurvaS.map((item, i) =>
                                            <td key={i}>
                                                {
                                                    EstadoInputFinanciero == i ?

                                                        <div
                                                            className="d-flex"
                                                        >
                                                            <DebounceInput
                                                                value={item.financiero_monto}
                                                                debounceTimeout={300}
                                                                onChange={e => onChangeInputFinanciero(e.target.value, i)}
                                                                type="number"
                                                            />
                                                            <div
                                                                onClick={() => updateFinanciero(item.id, i)}
                                                            >
                                                                <MdSave className="icon" />
                                                            </div>
                                                            <div
                                                                onClick={() => toggleInputFinanciero(-1)}
                                                            >
                                                                <MdClose className="icon" />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div
                                                            className="d-flex"
                                                        >
                                                            {Redondea(item.financiero_monto)}
                                                            <div
                                                                onClick={() => toggleInputFinanciero(i)}
                                                            >
                                                                <MdModeEdit className="icon" />
                                                            </div>
                                                        </div>
                                                }
                                            </td>
                                        )
                                    }
                                </tr>
                            </tbody>
                        </table>
                    ]
                    : [<img key={0}
                        style={{ width: "300px" }}
                        src={"https://www.jonmgomes.com/wp-content/uploads/2020/03/Pie_Chart_GIF_5_Seconds.gif?fbclid=IwAR34o4wzp3DOEtf1rKKG72-5bXCkXyuk7utSXYWmnB_k34XqnkPLPphmFio"}
                    />,
                    (
                        sessionStorage.getItem("cargo") == "RESIDENTE" &&
                        <Button
                            key={1}
                            color="danger"
                            onClick={toggle}
                            style={{
                                position: " absolute",
                                bottom: " -7%",
                                left: " 50%",
                                transform: " translate(-50%, -50%)",
                                width: " 50px",
                                height: " 50px",
                            }}
                        >+</Button>
                    ),

                    ]
                }

            </div>
            {/* modal de periodos ejecutados */}
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>
                    {
                        RegistroNoUbicados.registros > 0 ?
                            <Alert color="danger">
                                Se encontraron registros de avance no ubicados correctamente, contactar con el ADMINISTRADOR DEL SISTEMA
                            </Alert>
                            :
                            [

                                (AnyosEjecutados.length > 0 &&
                                    <Alert color="warning">
                                        Completar el registro de todos los años para poder ingresar nuevos financieros
                                    </Alert>
                                ),
                                <Input type="select"
                                    value={FormularioOpcion}
                                    onChange={e => setFormularioOpcion(e.target.value)}
                                    className="form-control"
                                >
                                    <option disabled hidden>SELECCIONE</option>
                                    {AnyosEjecutados.length > 0 ?
                                        <option value="ejecutado">Crear curva S</option>
                                        :
                                        [
                                            <option value="nuevo">Programar mes</option>,
                                            <option value="total">Ingresar Acumulados</option>
                                        ]
                                    }

                                </Input>
                            ]
                    }

                </ModalHeader>
                <ModalBody>
                    <table>
                        <thead>
                            <tr>
                                {
                                    (FormularioOpcion == "ejecutado" || FormularioOpcion == "nuevo" || FormularioOpcion == "total") &&
                                    [
                                        <th className="text-center">PERIODO</th>,
                                        <th className="text-center">PROGRAMADO</th>,
                                        <th className="text-center">EJECUTADO</th>,
                                        <th className="text-center">FINANCIERO</th>,
                                        <th className="text-center">OBSERVACION</th>,
                                    ]
                                }
                                <th>
                                    {FormularioOpcion == "ejecutado" &&
                                        <Input type="select"
                                            value={AnyoSeleccionado}
                                            onChange={e => onChangeAnyo(e.target.value)}
                                            className="form-control"
                                        >
                                            <option disabled hidden>SELECCIONE</option>
                                            {
                                                AnyosEjecutados.map((item, i) =>
                                                    <option key={i}>{item.anyo}</option>
                                                )
                                            }

                                        </Input>
                                    }

                                </th>
                            </tr>
                        </thead>
                        {FormularioOpcion == "ejecutado" &&

                            <tbody>
                                {
                                    PeriodosEjecutados.map((item, i) =>
                                        <tr key={i}>
                                            <td>
                                                {item.estado_codigo == "C" ?
                                                    "CORTE-" : ""
                                                }{mesesShort[item.mes - 1]}
                                            </td>
                                            <td>{Redondea(item.programado_monto)}</td>
                                            <td>{Redondea(item.ejecutado_monto)}</td>
                                            <td><DebounceInput
                                                value={item.financiero_monto}
                                                debounceTimeout={300}
                                                onChange={e => onChangePeriodosData(e.target.value, "financiero_monto", i)}
                                                type="number"
                                                className="form-control"
                                            />
                                            </td>
                                            <td><DebounceInput
                                                value={item.observacion}
                                                debounceTimeout={300}
                                                onChange={e => onChangePeriodosData(e.target.value, "observacion", i)}
                                                type="text"
                                                className="form-control"
                                            /></td>

                                        </tr>

                                    )

                                }



                            </tbody>
                        }
                        {FormularioOpcion == "nuevo" &&
                            <tbody>
                                {
                                    MesesModal.map((item, i) =>
                                        <tr key={i}>
                                            <td>
                                                <DebounceInput
                                                    value={item.anyoMes}
                                                    debounceTimeout={300}
                                                    onChange={e => onChangeModalData(e.target.value, "anyoMes", i)}
                                                    type="month"
                                                    // min={mesActual()}
                                                    className="form-control"
                                                />
                                            </td>

                                            <td><DebounceInput
                                                value={item.programado_monto}
                                                debounceTimeout={300}
                                                onChange={e => onChangeModalData(e.target.value, "programado_monto", i)}
                                                type="number"
                                                className="form-control"
                                            /></td>
                                            <td>{item.ejecutado}</td>
                                            <td><DebounceInput
                                                value={item.financiero_monto}
                                                debounceTimeout={300}
                                                onChange={e => onChangeModalData(e.target.value, "financiero_monto", i)}
                                                type="number"
                                                className="form-control"
                                            /></td>
                                            <td><DebounceInput
                                                value={item.observacion}
                                                debounceTimeout={300}
                                                onChange={e => onChangeModalData(e.target.value, "observacion", i)}
                                                type="text"
                                                className="form-control"
                                            /></td>

                                        </tr>

                                    )
                                }
                                <tr>
                                    <td colSpan={5}></td>
                                    <td>
                                        <Button color="danger" onClick={addMesModal}>+</Button>
                                    </td>
                                </tr>
                            </tbody>
                        }
                        {FormularioOpcion == "total" &&
                            <tbody>
                                {
                                    YearsModalData.map((item, i) =>
                                        <tr key={i}>
                                            <td>
                                                <Input type="select"
                                                    value={item.anyo}
                                                    onChange={e => onChangeModalYears(e.target.value, "anyo", i)}
                                                    className="form-control"
                                                >
                                                    <option disabled hidden>SELECCIONE</option>
                                                    {
                                                        YearsModal.map((item, i) =>
                                                            <option key={i}>{item}</option>
                                                        )
                                                    }

                                                </Input>

                                            </td>
                                            <td><DebounceInput
                                                value={item.programado_monto}
                                                debounceTimeout={300}
                                                onChange={e => onChangeModalYears(e.target.value, "programado_monto", i)}
                                                type="number"
                                                className="form-control"
                                            />
                                                {item.programado_monto_propuesto != 0 &&
                                                    Redondea(item.programado_monto_propuesto)
                                                }

                                            </td>
                                            <td>{Redondea(item.ejecutado_monto)}</td>
                                            <td><DebounceInput
                                                value={item.financiero_monto}
                                                debounceTimeout={300}
                                                onChange={e => onChangeModalYears(e.target.value, "financiero_monto", i)}
                                                type="number"
                                                className="form-control"
                                            /></td>
                                            <td><DebounceInput
                                                value={item.observacion}
                                                debounceTimeout={300}
                                                onChange={e => onChangeModalYears(e.target.value, "observacion", i)}
                                                type="text"
                                                className="form-control"
                                            /></td>
                                        </tr>

                                    )
                                }
                                <tr>
                                    <td colSpan={5}></td>
                                    <td>
                                        <Button color="danger" onClick={addYearModalYears}>+</Button>
                                    </td>
                                </tr>
                            </tbody>
                        }
                    </table>
                </ModalBody>
                <ModalFooter>
                    {RegistroNoUbicados.registros == 0 &&
                        <Button color="primary" onClick={saveModalData}>Guardar</Button>
                    }
                    {' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div >
    );
}
export default Curva_S
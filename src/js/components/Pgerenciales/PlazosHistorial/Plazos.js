import React, { Component } from 'react'
import axios from 'axios'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, Input } from 'reactstrap';
import { UrlServer } from '../../Utils/ServerUrlConfig'
import "../PlazosHistorial/Plazos.css";
class PlazosHistorial extends Component {
    constructor(props) {
        super(props)
        this.state = {
            plazosTipo_1: [],
            plazosTipo_2: [],
            plazosHistorial: []
        }
        this.getPlazos = this.getPlazos.bind(this)
        this.agregarPadre = this.agregarPadre.bind(this)
        this.elminarHistorial = this.elminarHistorial.bind(this)
        this.agregarHijo = this.agregarHijo.bind(this)
        this.getPlazosTipo = this.getPlazosTipo.bind(this)
        this.actualizarPlazo = this.actualizarPlazo.bind(this)
        this.guardarPlazosHistoria = this.guardarPlazosHistoria.bind(this)

    }
    componentWillMount() {
        this.getPlazos()
        this.getPlazosTipo(1)
        this.getPlazosTipo(2)

    }
    getPlazos() {
        axios.post(`${UrlServer}/getPlazos`,
            {
                "id_ficha": sessionStorage.getItem('idobra')
            }
        )
            .then((res) => {
                console.log(res.data)
                this.setState({
                    plazosHistorial: res.data
                })
            }).catch((error) => {
                console.log('Algo salió mal al tratar de listar los estados, error es: ', error);
            })
    }
    getPlazosTipo(nivel) {
        axios.post(`${UrlServer}/getPlazosTipo`,
            {
                "nivel": nivel
            }
        )
            .then((res) => {
                console.log(res.data)
                this.setState({
                    ["plazosTipo_" + nivel]: res.data
                })
            }).catch((error) => {
                console.log('Algo salió mal al tratar de listar los estados, error es: ', error);
            })
    }
    agregarPadre() {
        var plazosHistorial = this.state.plazosHistorial
        plazosHistorial.push(
            {
                "idplazos_historial": null,
                "tipo": 0,
                "nivel": 1,
                "descripcion": "descripcion",
                "fecha_inicio": null,
                "fecha_final": null,
                "n_dias": null,
                "documento_resolucion_estado": "documento_resolucion_estado",
                "imagen": "imagen",
                "observacion": "observacion",
                "idplazos": null,
                "fichas_id_ficha": sessionStorage.getItem('idobra')
            },
        )
        console.log("plazosHistorial", plazosHistorial);
        this.setState({
            plazosHistorial: plazosHistorial
        })
    }
    elminarHistorial(i) {
        if (confirm("Estas seguro que desea eliminar")) {
            var plazosHistorial = this.state.plazosHistorial
            if (plazosHistorial[i].idplazos_historial != null) {
                axios.post(`${UrlServer}/deletePlazos`,
                    {
                        "idplazos_historial": plazosHistorial[i].idplazos_historial
                    }
                )
                    .then((res) => {
                        console.log(res.data)
                        this.getPlazos()
                        console.log("Dato Eliminado");
                    }).catch((error) => {
                        console.log('error al eliminar: ', error);
                    })
            } else {
                plazosHistorial.splice(i, 1);
                this.setState({
                    plazosHistorial: plazosHistorial
                })
            }
        }


    }
    agregarHijo(indexPadre) {
        var plazosHistorial = this.state.plazosHistorial
        plazosHistorial.splice(indexPadre + 1, 0,
            {
                "idplazos_historial": null,
                "tipo": 0,
                "nivel": 2,
                "descripcion": "descripcion",
                "fecha_inicio": "",
                "fecha_final": "",
                "n_dias": "",
                "documento_resolucion_estado": "documento_resolucion_estado",
                "imagen": "imagen",
                "observacion": "observacion",
                "idplazos": null,
                "fichas_id_ficha": sessionStorage.getItem('idobra')
            },
        );
        console.log("plazosHistorial", plazosHistorial);
        this.setState({
            plazosHistorial: plazosHistorial
        })
        console.log("hijo agregado");
    }
    actualizarPlazo(index, nombre, value) {
        console.log(index, nombre, value);

        var plazosHistorial = this.state.plazosHistorial
        plazosHistorial[index][nombre] = value
        console.log("plazosHistorial", plazosHistorial);

        this.setState({
            plazosHistorial: plazosHistorial
        })
    }
    guardarPlazosHistoria() {
        var plazosHistorial = this.state.plazosHistorial
        var plazosHistorial_procesada = []
        var error = false;
        for (let i = 0; i < plazosHistorial.length; i++) {
            const plazo = plazosHistorial[i];
            if (plazo.tipo == 0) {
                alert("falta seleccionar el tipo de algunos plazos")
                error = true;
                break
            }
            var plazo_temp = [
                plazo.idplazos_historial,
                plazo.tipo,
                plazo.nivel,
                plazo.descripcion,
                plazo.fecha_inicio,
                plazo.fecha_final,
                plazo.documento_resolucion_estado,
                plazo.imagen,
                plazo.observacion,
                sessionStorage.getItem('idobra'),
                null
            ]
            plazosHistorial_procesada.push(
                plazo_temp
            )
        }
        if (!error) {
            console.log("plazosHistorial_procesada", plazosHistorial_procesada);
            axios.post(`${UrlServer}/putPlazos`,
                plazosHistorial_procesada
            )
                .then((res) => {
                    console.log(res.data)
                    this.getPlazos()
                }).catch((error) => {
                    console.log('Algo salió mal al tratar de listar los estados, error es: ', error);
                })
        } else {
            console.log("error faltan seleccionar algunos tipos");

        }

    }
    calcular_dias(fecha_inicio, fecha_final) {
        console.log(fecha_inicio, fecha_final);
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(fecha_inicio);
        const secondDate = new Date(fecha_final);
        var days = Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
        return days || 0

    }
    render() {
        var contador = 0
        var subcontador = 0
        return (
            <div>
                <Button color="primary" onClick={this.agregarPadre}>
                    Agregar Estados
                </Button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>

                            </th>
                            <th>
                                N
                            </th>
                            <th>
                                tipo
                            </th>
                            <th>
                                descripcion
                            </th>
                            <th>
                                fecha_inicio
                            </th>
                            <th>
                                fecha_final
                            </th>
                            <th>
                                dias
                            </th>
                            <th>
                                documento_resolucion_estado
                            </th>

                            <th>
                                observacion
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.plazosHistorial.map((plazo, index) =>
                                <tr key={index}>
                                    <td>
                                        {plazo.nivel == 1 ?
                                            <button onClick={() => this.agregarHijo(index)}>
                                                +
                                        </button>
                                            :
                                            ""
                                        }
                                    </td>
                                    <td>

                                        {plazo.nivel == 1 ?
                                            [
                                                ++contador,
                                                (() => {
                                                    subcontador = 0
                                                })(),

                                            ]
                                            :
                                            [
                                                contador + "." + ++subcontador
                                            ]
                                        }
                                    </td>
                                    <td>
                                        <select onChange={event => this.actualizarPlazo(index, "tipo", event.target.value)} required value={plazo.tipo}>
                                            <option>Seleccionar</option>
                                            {plazo.nivel == 1 ?
                                                this.state.plazosTipo_1.map((plazoTipo, index) =>
                                                    <option
                                                        key={index}
                                                        value={plazoTipo.idplazos_tipo}>{plazoTipo.nombre}</option>
                                                )
                                                :
                                                this.state.plazosTipo_2.map((plazoTipo, index) =>
                                                    <option
                                                        key={index}
                                                        value={plazoTipo.idplazos_tipo}>{plazoTipo.nombre}</option>
                                                )
                                            }
                                        </select>
                                    </td>
                                    <td >
                                        <textarea
                                            type="text"
                                            defaultValue={plazo.descripcion}
                                            onBlur={event => this.actualizarPlazo(index, "descripcion", event.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={plazo.fecha_inicio}
                                            onChange={event => this.actualizarPlazo(index, "fecha_inicio", event.target.value)}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="date"
                                            value={plazo.fecha_final}
                                            onChange={event => this.actualizarPlazo(index, "fecha_final", event.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            style={{ width: "40px" }}
                                            type="number"
                                            value={this.calcular_dias(plazo.fecha_inicio, plazo.fecha_final)}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            type="text"
                                            defaultValue={plazo.documento_resolucion_estado}
                                            onBlur={event => this.actualizarPlazo(index, "documento_resolucion_estado", event.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            type="text"
                                            defaultValue={plazo.observacion}
                                            onBlur={event => this.actualizarPlazo(index, "observacion", event.target.value)}
                                        />
                                    </td>

                                    <td>
                                        <Button color="danger" onClick={() => this.elminarHistorial(index)} >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>

                            )
                        }
                        <tr >
                            <td colspan="5">

                            </td>
                            <td >
                                TOTAL
                            </td>
                            <td>
                                {
                                    (() => {
                                        let formula = (acc, cur) => acc + this.calcular_dias(cur.fecha_inicio, cur.fecha_final)
                                        return this.state.plazosHistorial.reduce(formula, 0)
                                    })()
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <Button color="success" type="submit" onClick={this.guardarPlazosHistoria} >
                    Guardar Datos
                </Button>
            </div>
        )
    }
}
export default PlazosHistorial;

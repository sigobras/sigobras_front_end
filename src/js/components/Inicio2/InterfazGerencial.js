import React, { Component } from "react";
import { UrlServer } from '../Utils/ServerUrlConfig';
import axios from "axios";

class InterfazGerencial extends Component {
    constructor() {
        super();
        this.state = {
            getProvincias: [],
            getSectores: [],
            getModalidadesEjecutoras: [],
            getEstados: [],
            id_unidadEjecutora: 0,
            idsectores: 0,
            idmodalidad_ejecutora: 0,
            id_Estado: 0,
            getInterfazGerencialData: [],
            getInterfazGerencialDataProcesada: []
        };
        this.getDataSelect = this.getDataSelect.bind(this);
        this.updateInput = this.updateInput.bind(this);
        this.getInterfazGerencialData = this.getInterfazGerencialData.bind(this);
    }
    componentWillMount() {
        this.getDataSelect("getProvincias")
        this.getDataSelect("getSectores")
        this.getDataSelect("getModalidadesEjecutoras")
        this.getDataSelect("getEstados")
    }
    getDataSelect(selectData) {
        axios.get(`${UrlServer}/${selectData}`)
            .then((res) => {
                this.setState({
                    [selectData]: res.data,
                })
            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })
    }
    async updateInput(name, value) {
        await this.setState({
            [name]: value,
        })
        console.log(this.state);
    }
    getInterfazGerencialData() {
        console.log("cargando data");

        axios.post(`${UrlServer}/getInterfazGerencialData`,
            {
                "id_unidadEjecutora": this.state.id_unidadEjecutora,
                "idsectores": this.state.idsectores,
                "idmodalidad_ejecutora": this.state.idmodalidad_ejecutora,
                "id_Estado": this.state.id_Estado,
            }
        )
            .then((res) => {
                var dataTemp = res.data
                var unidad_ejecutora_nombre = ""
                var unidad_ejecutora_lista = []
                var unidad_ejecutora = {}
                var sector = {}
                var sector_nombre = ""
                for (let i = 0; i < dataTemp.length; i++) {
                    const element = dataTemp[i];
                    console.log("sector", sector);

                    if (element.unidad_ejecutora_nombre != unidad_ejecutora_nombre) {
                        console.log("nueva unidad ejecutora", element.codigo);
                        if (i != 0) {
                            unidad_ejecutora.sectores.push(sector)
                            unidad_ejecutora_lista.push(unidad_ejecutora)
                        }
                        unidad_ejecutora = {}
                        unidad_ejecutora.nombre = element.unidad_ejecutora_nombre
                        unidad_ejecutora.sectores = []
                        sector = {
                            nombre: element.sector_nombre,
                            obras: [
                                {
                                    codigo: element.codigo,
                                    modalidad_ejecutora_nombre: element.modalidad_ejecutora_nombre,
                                    estado_nombre: element.estado_nombre,
                                    fecha_inicial: element.fecha_inicial
                                }
                            ]
                        }
                        unidad_ejecutora_nombre = element.unidad_ejecutora_nombre
                        sector_nombre = element.sector_nombre
                    } else {
                        console.log("misma unidad", element.codigo);

                        if (element.sector_nombre != sector_nombre) {
                            console.log("nuevo sector", element.sector_nombre);

                            unidad_ejecutora.sectores.push(sector)
                            sector = {
                                nombre: element.sector_nombre,
                                obras: [
                                    {
                                        codigo: element.codigo,
                                        modalidad_ejecutora_nombre: element.modalidad_ejecutora_nombre,
                                        estado_nombre: element.estado_nombre,
                                        fecha_inicial: element.fecha_inicial
                                    }
                                ]
                            }
                            sector_nombre = element.sector_nombre
                        } else {
                            console.log("mismo sector", element.sector_nombre);
                            sector.obras.push(
                                {
                                    codigo: element.codigo,
                                    modalidad_ejecutora_nombre: element.modalidad_ejecutora_nombre,
                                    estado_nombre: element.estado_nombre,
                                    fecha_inicial: element.fecha_inicial
                                }
                            )

                        }

                    }


                }
                unidad_ejecutora.sectores.push(sector)
                unidad_ejecutora_lista.push(unidad_ejecutora)
                console.log(unidad_ejecutora_lista);


                this.setState({
                    getInterfazGerencialData: res.data,
                    getInterfazGerencialDataProcesada: unidad_ejecutora_lista
                })
            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })
    }
    render() {
        return (
            <div>
                <select onChange={event => this.updateInput('id_unidadEjecutora', event.target.value)}>
                    <option value="0">
                        Todas las provincias
                    </option>
                    {this.state.getProvincias.map((item, index) =>
                        <option value={item.id_unidadEjecutora}>{item.nombre}</option>
                    )}
                </select>
                <select onChange={event => this.updateInput('idsectores', event.target.value)}>
                    <option value="0">
                        Todas las sectores
                    </option>
                    {this.state.getSectores.map((item, index) =>
                        <option value={item.idsectores}>{item.nombre}</option>
                    )}
                </select>
                <select onChange={event => this.updateInput('idmodalidad_ejecutora', event.target.value)}>
                    <option value="0">
                        Todas las modalidades
                    </option>
                    {this.state.getModalidadesEjecutoras.map((item, index) =>
                        <option value={item.idmodalidad_ejecutora}>{item.nombre}</option>
                    )}
                </select>
                <select onChange={event => this.updateInput('id_Estado', event.target.value)}>
                    <option value="0">
                        Todas los estados
                    </option>
                    {this.state.getEstados.map((item, index) =>
                        <option value={item.id_Estado}>{item.nombre}</option>
                    )}
                </select>
                <button onClick={() => this.getInterfazGerencialData()}>
                    Buscar
                </button>
                {this.state.getInterfazGerencialDataProcesada.map((provincia, index) =>
                    [
                        <h4>{provincia.nombre}</h4>,
                        provincia.sectores.map((sector, index2) =>
                            [
                                <h5>{sector.nombre}</h5>,

                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>codigo</th>
                                            <th>modalidad_ejecutora_nombre</th>
                                            <th>estado_nombre</th>
                                            <th>fecha_inicial</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sector.obras.map((obra, index3) =>
                                            <tr>
                                                <td>{obra.codigo}</td>
                                                <td>{obra.modalidad_ejecutora_nombre}</td>
                                                <td>{obra.estado_nombre}</td>
                                                <td>{obra.fecha_inicial}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>


                            ]
                        )
                    ]
                )}

            </div>
        );
    }
    // "text-center pb-2"

}

export default InterfazGerencial;
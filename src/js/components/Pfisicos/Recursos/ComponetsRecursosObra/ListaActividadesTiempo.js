import React, { Component } from 'react';
import axios from 'axios'
import ReactTable from "react-table";

import { UrlServer } from '../../../Utils/ServerUrlConfig'

class ListaActividadesTiempo extends Component {
    constructor(){
        super()
        this.state = {
            DataActXTiempo:[]
        }
    }

    componentDidMount(){
        axios.post(`${UrlServer}/getActividadesDuracion`,{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then((res)=>{
        //   console.log('Act Duracion>>', res.data);
        
            this.setState({
                DataActXTiempo:res.data
            })
        })
        .catch((error)=>{
        console.error('algo salio mal verifique el ⁉',error);
        
        })
    }

    render() {
        const { DataActXTiempo } = this.state
        return (
            <div>
               <ReactTable
                    data={ DataActXTiempo }
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                        
                    columns={[
                            {
                                Header: "ITEM",
                                accessor: "item",
                            
                                filterMethod: (filter, row) =>
                                    row[filter.id].startsWith(filter.value) &&
                                    row[filter.id].endsWith(filter.value)
                            },
                            {
                                Header: "DESCRIPCION",
                                id: "descripcion",
                                accessor: d => d.descripcion,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["descripcion"] }),
                                filterAll: true
                            },
                           

                            {
                                Header: "ACTIVIDAD",
                                id: "nombre_actividad",
                                accessor: na => na.nombre_actividad,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["nombre_actividad"] }),
                                filterAll: true
                            },
                            {
                                Header: "DURACION / DIA",
                                id: "duracion_dia",
                                accessor: dura => dura.duracion_dia,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["duracion_dia"] }),
                                filterAll: true
                            },
                            {
                                Header: "DURACION",
                                id: "duracion",
                                accessor: dura => dura.duracion,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["duracion"] }),
                                filterAll: true
                            }
                    ]}
                    defaultPageSize={50}
                    style={{ height: 550 }}
                    className="-striped -highlight table-sm small" 
                />
            </div>
        );
    }
}

export default ListaActividadesTiempo;
import React, { Component } from 'react';
import axios from 'axios'
import ReactTable from "react-table";

import { UrlServer } from '../../../../Utils/ServerUrlConfig'

class ListaMateriales extends Component {
    constructor(){
        super()
        this.state = {
            DataActXTiempo:[]
        }
    }

    componentWillMount(){
        axios.post(`${UrlServer}/getMaterialesPorObra`,{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then((res)=>{
          console.log('MATERIALES>>', res.data);
        
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
                                Header: "PART. DESCRIP.",
                                id: "partida_descripcion",
                                accessor: d => d.partida_descripcion,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["partida_descripcion"] }),
                                filterAll: true
                            },
                            {
                                Header: "METRADO",
                                id: "metrado",
                                accessor: m => m.metrado,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["metrado"] }),
                                filterAll: true
                            },
                            {
                                Header: "C. U. S/. ",
                                id: "costo_unitario",
                                accessor: cu => cu.costo_unitario,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["costo_unitario"] }),
                                filterAll: true
                            },
                            {
                                Header: "C. P. S/.",
                                id: "costo_parcial",
                                accessor: cp => cp.costo_parcial,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["costo_parcial"] }),
                                filterAll: true
                            },
                            {
                                Header: "DESCRIP. ACT.",
                                id: "descripcion",
                                accessor: na => na.descripcion,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["descripcion"] }),
                                filterAll: true
                            },
                            {
                                Header: "UND",
                                id: "unidad",
                                accessor: u => u.unidad,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["unidad"] }),
                                filterAll: true
                            },
                            {
                                Header: "CUADRILLA TOTAL",
                                id: "cuadrilla_total",
                                accessor: anc => anc.cuadrilla_total,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["cuadrilla_total"] }),
                                filterAll: true
                            },
                            {
                                Header: "CANT. TOTAL",
                                id: "cantidad_total",
                                accessor: ct => ct.cantidad_total,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["cantidad_total"] }),
                                filterAll: true
                            },
                            {
                                Header: "S. / TOTAL",
                                id: "precio_total",
                                accessor: red => red.precio_total,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["precio_total"] }),
                                filterAll: true
                            },
                            {
                                Header: "S/. PARCIAL TOTAL",
                                id: "parcial_total",
                                accessor: dura => dura.parcial_total,
                                filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["parcial_total"] }),
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

export default ListaMateriales;


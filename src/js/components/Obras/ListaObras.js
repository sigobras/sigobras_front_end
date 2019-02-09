import React, { Component } from 'react';
import axios from 'axios'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'

class ListaObras extends Component {
    constructor(){
        super()
        this.state = {
            listaObras:[]
        }
    }
    componentWillMount(){
        axios.get(`${UrlServer}/listaObras`)
        .then((res)=>{
            // console.log(res.data);
            this.setState({
                listaObras:res.data
            })
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar las obras error es: ', error);
        })
    }
    render() {
        const { listaObras } = this.state
        return (
            <div>
                <Card>
                    <CardHeader>Lista de obras</CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Codigo </th>
                                    <th>Nombre </th>
                                    <th>Presupuesto </th>
                                    <th>% Ejecución </th>
                                    <th>Usuarios </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaObras === undefined ? 'cargando': listaObras.map((obra, index)=>
                                    <tr key={ index }>
                                        <td>{obra.codigo}</td>
                                        <td>{obra.g_sector}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter>----</CardFooter>
                </Card>
                
            </div>
        );
    }
}

export default ListaObras;
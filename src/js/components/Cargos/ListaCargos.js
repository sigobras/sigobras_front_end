import React, { Component } from 'react';
import axios from 'axios'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, UncontrolledTooltip   } from 'reactstrap';
import classNames from 'classnames'
import { UrlServer } from '../Utils/ServerUrlConfig'

class ListaCargos extends Component {
    constructor(){
        super()
        this.state = {
            listaCargos:[],
            
        }
    }
    componentWillMount(){
        axios.get(`${UrlServer}/listaCargos`)
        .then((res)=>{
            // console.log(res.data);
            this.setState({
                listaCargos:res.data
            })
        })
        .catch((error)=>{
            console.log('algo salió mal al tratar de listar las obras error es: ', error);
        })
    }
   
    render() {
        const { listaCargos } = this.state
        return (
            <div>
                <Card>
                    <CardHeader>Lista de obras</CardHeader>
                    <CardBody>
                        <table className="table table-bordered table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>Cargo </th>
                                    <th>descripcion </th>
                                    <th>Fecha creada </th>
                                    <th>opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaCargos === undefined ? 'cargando': listaCargos.map((cargo, index)=>
                                    <tr key={ index }>
                                        <td>{cargo.nombre}</td>
                                        <td>{cargo.descripcion}</td>
                                        <td>{cargo.fecha_inicial}</td>
                                        <td>
                                            <button className="btn btn-outline-secondary btn-xs" id={`e${index}`}>editar </button>
                                            <UncontrolledTooltip placement="bottom" target={`e${index}`}>
                                                editar- {cargo.id_Cargo}
                                            </UncontrolledTooltip> 
                                        </td>
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

export default ListaCargos;
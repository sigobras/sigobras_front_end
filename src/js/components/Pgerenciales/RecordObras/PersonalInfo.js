import React, { Component } from 'react';
import axios from 'axios'
import { Nav, NavItem, TabContent, NavLink, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import classnames from 'classnames';

import Usuario from '../../../../images/usuario.png'

import { UrlServer } from '../../Utils/ServerUrlConfig'

class PersonalInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            DataPersonalObra:[
                {
                    "cargo_nombre": "residente",
                    "data":[
                            {
                                "nombre_usuario": "GERMAN APAZA NINARAQUE",
                                "celular": 925710617,
                                "direccion": "DAGSDKA",
                                "dni": "SDS",
                                "email": "DSD"
                            }
                        ]
                    
                },
                {
                    "cargo_nombre": "otro men",
                    "data":[
                            {
                                "nombre_usuario": "guerra  flores luijhy",
                                "celular": null,
                                "direccion": "",
                                "dni": "",
                                "email": ""
                            }
                        ]
                    
                },
                {
                    "cargo_nombre": "cordinador",
                    "data":[
                            {
                                "nombre_usuario": "guerra  flores luijhy",
                                "celular": null,
                                "direccion": "",
                                "dni": "",
                                "email": ""
                            }
                        ]
                    
                }
                
            ],
            activeTab:'0'
        }
        this.tabs = this.tabs.bind(this)     

    }
    componentWillMount(){
        axios.post(`${UrlServer}/getCargosById`,{
            "id_Ficha":this.props.idobraSeleccionada
        })
        .then((res)=>{
            console.log('res', res)
        })
        .catch((err)=>{
            console.error('algo salio mal al obtener los usuarios', err)
        })
    }

    tabs(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }
    render() {
        const { DataPersonalObra } = this.state
        return (
            <div className="card">
                <Nav tabs>
                    { DataPersonalObra.map((cargos, ICargos)=>
                        <NavItem key={ ICargos }>
                            <NavLink
                            className={classnames({ active: this.state.activeTab === ICargos.toString() })}
                            onClick={() => { this.tabs( ICargos.toString()); }}
                            >
                            { cargos.cargo_nombre.toUpperCase() }
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    { DataPersonalObra.map((cargos, ICargos)=>
                        <TabPane tabId={ ICargos.toString() }  key={ ICargos }>
                            { cargos.data.map((usuarios, IdUsuario )=>
                                <div className="row no-gutters position-relative" key={ IdUsuario }>
                                    <div className="col-md-4 mb-md-0 p-md-4">
                                        <img src={ Usuario } className="w-100" alt="..." />
                                    </div>
                                    <div className="col-md-8 position-static p-4 pl-md-0">
                                        <h5 className="mt-0 text-uppercase">{ usuarios.nombre_usuario }</h5>
                                        <ListGroup>
                                            <b>CELULAR N° </b> <span>{ usuarios.celular }</span>
                                            <b>DNI </b> <span>{ usuarios.dni }</span>
                                            <b>EMAIL </b> <span>{ usuarios.email }</span>
                                            <b>DIRECCION </b> <span>{ usuarios.direccion }</span>
                                        </ListGroup>
                                    </div>
                                </div>
                            )}
                        </TabPane>
                    )}

                   
                </TabContent>
            </div>
        );
    }
}

export default PersonalInfo;
import React, { Component } from 'react';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import ReactTable from "react-table";
import { UrlServer } from '../../../Utils/ServerUrlConfig'

import Cubito from '../../../../../images/loaderXS.gif';

class MDHistorial extends Component {

    constructor(){
        super();
        this.Tabs = this.Tabs.bind(this);
        this.state = {
          idCom:[],
          activeTab: '0'
        }; 
    }
    componentWillMount(){
        document.title ="Historial de Metrados"

        axios.post(UrlServer+'/getHistorial/',{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then(res=>{
            console.log(res)
            var DataError = [];
            if(res.data.code){
                this.setState({
                    idCom: DataError
                })
            }else{
            console.log(res.data);
                this.setState({
                    idCom: res.data
                })
            }
        })
        .catch(err=>{
            console.log('ERROR ANG'+ err.res);
            
        });
    }

    Tabs(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }
    render() {
        const columns = [{
            Header: "PARTIDAS",
                columns: [
                    {
                        Header: 'ITEM',
                        accessor: 'item' 
                    },{
                        Header: 'DESCRIPCIÓN',
                        accessor: 'descripcion_partida',
                        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
                    }
                ]},{
            Header: "ACTIVIDADES",
                columns: [
                    {
                        Header: 'NOMBRE DE ACTIVIDAD',
                        id: 'nombre_actividad', 
                        accessor: d => d.nombre_actividad
                    },{
                        Header: 'DESCRIPCION', 
                        id: 'descripcion_actividad',
                        accessor: d => d.descripcion_actividad
                    },{
                        Header: 'OBSERVACION',
                        id: 'observacion', 
                        accessor: d => d.observacion
                    },{
                        Header: 'FECHA',
                        id: 'fecha', 
                        accessor: d => d.fecha
                    },{
                        Header: 'A. FISICO', 
                        id: 'valor',
                        accessor: d => d.valor
                    },{
                        Header: 'S/. UNITARIO',
                        id: 'costo_unitario', 
                        accessor: d => d.costo_unitario
                    },{
                        Header: 'S/. PARCIAL',
                        id: 'parcial', 
                        accessor: d => d.parcial
                    }
                ]
            }
        ]
    return ( 
        
        <div>   
            {this.state.idCom === 'vacio' ? <div className="text-center centraImagen" >  <img src={ Cubito } className="centraImagen" width="30"  alt="logo sigobras" /> <br/>No hay datos</div>:
            <Card>

                <Nav tabs>
                    {this.state.idCom.map((comp,i)=>

                        <NavItem key={ i }>
                            <NavLink className={classnames({ active: this.state.activeTab === i.toString() })} onClick={() => { this.Tabs( i.toString()); }}>
                                COMP {comp.numero}
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    {this.state.idCom.map((comp,i)=>
                        <TabPane tabId={i.toString()} className="p-1" key={i}>
                            <Card >
                                <CardHeader>{comp.nombre_componente }</CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="12">
                                            <ReactTable
                                                data={comp.historial}
                                                columns={columns}
                                                className="-striped -highlight table table-responsive  small"
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </TabPane>
                    )}
                </TabContent>
            </Card>
        }
    </div>
    );
  }
}

export default MDHistorial;
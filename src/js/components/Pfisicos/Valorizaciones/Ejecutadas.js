import React, { Component } from 'react';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import ReactTable from "react-table";
import { UrlServer } from '../../Utils/ServerUrlConfig'

import Cubito from '../../../../images/loaderXS.gif';

class Ejecutadas extends Component {

    constructor(){
        super();
        this.Tabs = this.Tabs.bind(this);
        this.TabsComponent = this.TabsComponent.bind(this);
        this.state = {
          idCom:[],
          activeTab: '1',
          activeTabComponet: '3',
        }; 
    }
    componentWillMount(){
        document.title ="Valorizaciones ejecutadas"

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

    TabsComponent(tab) {
        if (this.state.activeTabComponet !== tab) {
          this.setState({
            activeTabComponet: tab
          });
        }
    }
    render() {
        const { activeTab, activeTabComponet } = this.state
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
            {this.state.idCom.length < 1 ? <div className="text-center centraImagen" >  <img src={ Cubito } className="centraImagen" width="30"  alt="logo sigobras" /></div>:
            <Card>
                <Nav tabs>
                    {/* PERIODOS */}
                    <NavItem>
                        <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { this.Tabs('1'); }} >
                            P - 1
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { this.Tabs('2'); }}>
                            P - 2
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1" className="p-1">
                        <Card>
                            <Nav tabs>
                                {/* RESUMEN */}
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTabComponet === '3' })} onClick={() => { this.TabsComponent('3'); }} >
                                        C - 1
                                    </NavLink>
                                </NavItem>
                                
                                {/* COMPONENTES */}
                                <NavItem>
                                    <NavLink className={classnames({ active: activeTabComponet === '4' })} onClick={() => { this.TabsComponent('4'); }}>
                                        C - 2
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={activeTabComponet}>
                                <TabPane tabId="3" className="p-1">
                                    <Card>
                                        <CardHeader>nombre del componente</CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col sm="12">
                                                    <h4>Tab 1DSDSDSDS Contents</h4>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                    
                                </TabPane>

                                <TabPane tabId="4">
                                    <Row>
                                        <Col sm="12">
                                            <h4>Tab SA Contents</h4>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </Card>
                    </TabPane>

                    <TabPane tabId="2" className="p-1">
                        <Row>
                            <Col sm="12">
                                <Card>
                                    <CardHeader>Special Title Treatment</CardHeader>
                                    <CardBody>With supporting text below as a natural lead-in to additional content.</CardBody>
                                    
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </Card>
        }
    </div>
    );
  }
}

export default Ejecutadas;
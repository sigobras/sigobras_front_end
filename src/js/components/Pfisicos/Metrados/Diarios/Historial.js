import React, { Component } from 'react';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col, Collapse } from 'reactstrap';
import classnames from 'classnames';
import ReactTable from "react-table";
import { UrlServer } from '../../../Utils/ServerUrlConfig'

import Cubito from '../../../../../images/loaderXS.gif';

class MDHistorial extends Component {

    constructor(){
        super();
        this.Tabs = this.Tabs.bind(this);
        this.state = {
          DataHistorial:[],
          activeTab: '0',
          collapseDate:0
        };
        this.Tabs = this.Tabs.bind(this)
        this.collapseFechas = this.collapseFechas.bind(this)
    }

    componentWillMount(){
        document.title ="Historial de Metrados"

        axios.post(UrlServer+'/getHistorial',{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then((res)=>{
            console.log(res.data)
            var DataError = [];
            if(res.data.code){
                this.setState({
                    DataHistorial: DataError
                })
            }else{
            // console.log('sasa',res.data);
                this.setState({
                    DataHistorial: res.data
                })
            }
        })
        .catch((err)=>{
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
    collapseFechas(e){
        let event = e.target.dataset.event;
        this.setState({ collapseDate: this.state.collapseDate === Number(event) ? 0 : Number(event) });
    }
    render() {
        const { collapseDate } = this.state
        return ( 
            
            <div>   
                {this.state.DataHistorial === '' ? <div className="text-center centraImagen" >  <img src={ Cubito } className="centraImagen" width="30"  alt="logo sigobras" /> <br/>No hay datos</div>:
                <Card>

                    <Nav tabs>
                        {this.state.DataHistorial.map((comp,i)=>

                            <NavItem key={ i }>
                                <NavLink className={classnames({ active: this.state.activeTab === i.toString() })} onClick={() => { this.Tabs( i.toString()); }}>
                                    COMP {comp.numero}
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        {this.state.DataHistorial.map((comp, i)=>
                            <TabPane tabId={i.toString()} className="p-1" key={i}>
                                <Card >
                                    <CardHeader>{comp.nombre_componente }</CardHeader>
                                    <CardBody>
                                        
                                        {comp.fechas.map((fecha, indexfecha)=>
                                            <fieldset key={ indexfecha } className="mt-2">
                                                <legend onClick={this.collapseFechas} data-event={indexfecha} ><b>Fechas: </b>{ fecha.fecha}</legend>
                                                <Collapse isOpen={collapseDate === indexfecha}>   
                                                    <table className="table table-bordered table-sm small">
                                                        <thead>
                                                            <tr>
                                                                <th>ITEM</th>
                                                                <th>DESCRIPCIÓN</th>
                                                                <th>NOMBRE DE ACTIVIDAD </th>
                                                                <th>DESCRIPCION</th>
                                                                <th>OBSERVACION</th>
                                                                <th>A. FISICO</th>
                                                                <th>S/. UNITARIO</th>
                                                                <th>S/. PARCIAL</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {fecha.historial.map((hist, indexHist)=>
                                                                <tr key={ indexHist }>
                                                                    <td>{ hist.item }</td>
                                                                    <td>{ hist.descripcion_partida }</td>
                                                                    <td>{ hist.nombre_actividad }</td>
                                                                    <td>{ hist.descripcion_actividad }</td>
                                                                    <td>{ hist.observacion }</td>
                                                                    <td>{ hist.valor }</td>
                                                                    <td>{ hist.costo_unitario }</td>
                                                                    <td>{ hist.parcial }</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </Collapse> 
                                            </fieldset>
                                        )}
                                            
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
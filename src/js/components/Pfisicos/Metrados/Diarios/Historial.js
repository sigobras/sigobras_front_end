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

        axios.get(UrlServer+'/Historial/'+sessionStorage.getItem("idobra"))
        .then(res=>{
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
        Header: 'ITEM',
        accessor: 'item_temporal' 
      }, {
        Header: 'DESCRIPCIÓN',
        accessor: 'decrip_temporal',
        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      }, {
        id: 'img_avance', 
        Header: 'IMAGEN',
        accessor: d => d.img_avance
      }, {
        Header: 'REFERENCIA', 
        id: 'descrip_metrado',
        accessor: d => d.descrip_metrado
      }, {
        id: 'fecha_metrado', 
        Header: 'FECHA',

        accessor: d => d.fecha_metrado
      }, {
        Header: 'A. FISICO', 
        id: 'avance_metrado',
        accessor: d => d.avance_metrado
      }, {
        Header: 'A. FINANCIERO',
        id: 'A. FINANCIERO', 
        accessor: d => d.costo_avance
      }]
    return ( 
        
        <div>   
            {this.state.idCom.length < 1 ? <div className="text-center centraImagen" >  <img src={ Cubito } className="centraImagen" width="30"  alt="logo sigobras" /></div>:
            <div className="card">

                <Nav tabs>
                    {this.state.idCom.map((comp,i)=>

                        <NavItem key={ i }>
                            <NavLink className={classnames({ active: this.state.activeTab === i.toString() })} onClick={() => { this.Tabs( i.toString()); }}>
                                COMP {comp.num_componentes}
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    {this.state.idCom.map((comp,i)=>
                        <TabPane tabId={i.toString()} className="p-3" key={i}>
                            <Row>
                                <Col sm="12">
                                    <Card >
                                        <CardHeader>{comp.nomb_componentes }</CardHeader>
                                        <CardBody className="p-0">
                                            <ReactTable
                                                data={comp.HistorialMetrados}
                                                columns={columns}
                                                className="-striped -highlight table table-responsive  small"
                                            />
                                        </CardBody>
                                    </Card>

                                </Col>
                            </Row>
                        </TabPane>
                    )}
                </TabContent>

                
            </div>
        }
    </div>
    );
  }
}

export default MDHistorial;
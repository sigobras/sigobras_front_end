import React, { Component } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Tooltip , CardText, Row, Col,  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';
import { Redirect} from "react-router-dom";

import ReactTable from "react-table";
import matchSorter from 'match-sorter'

import LogoSigobras from '../../../../../images/logoSigobras.png'
import Cubito from '../../../../../images/loaderXS.gif';
import { UrlServer } from '../../../Utils/ServerUrlConfig';


class MDdiario extends Component {
  constructor(){
    super();

    this.state = {
      DataMDiario:[],
      activeTab:'0',
      modal: false,
    }
    this.Tabs = this.Tabs.bind(this)
    this.ControlAcceso = this.ControlAcceso.bind(this)
    this.CapturarID = this.CapturarID.bind(this)
    this.modalMetrar = this.modalMetrar.bind(this)
  }
  componentWillMount(){
    document.title ="Metrados Diarios"
    axios.post(`${UrlServer}/listaPartidas`,{
      id_ficha: sessionStorage.getItem('idobra')
    })
    .then((res)=>{
      this.setState(({
        DataMDiario:res.data
      }))
      // console.info('res',res)
    })
    .catch((error)=>{
      console.error('algo salio mal verifique el',error);
      
    })
  }
  Tabs(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  ControlAcceso(){
    if(sessionStorage.getItem("cargo") === 'GERENTE'){
        // this.setState({
        //   none: "d-none"
        // });

        return ('d-none')
    }

  }
  CapturarID(data, NombComp, unidad_med, P_unit, saldo_metrado, idcomp, porcentaje, avance_metrado, metrado_temporal, index, parcial_temporal) {
    e.preventDefault()        
    this.setState({
      value: '',
      descripcion: '',
      IdMetrado: data,
      DescripMetrado: NombComp,
      U_med_temporal: unidad_med,
      Precio_unitario: P_unit,
      Saldo_metrado: saldo_metrado,
      idComp: idcomp,
      porcentaje: porcentaje,
      avance_metrado: avance_metrado,
      metrado_temporal: metrado_temporal,
      index: index,
      parcial_temporal: parcial_temporal
    })
    this.modalMetrar();

    // console.log(idcomp, ' > ' ,index);
    
  }
  modalMetrar() {
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    const { DataMDiario }= this.state
    if(sessionStorage.getItem("idacceso")){ 
      return (
        <div>
          <Card>
            <Nav tabs>
              {DataMDiario.map((comp,indexComp)=>
                <NavItem key={ indexComp }>
                  <NavLink className={classnames({ active: this.state.activeTab === indexComp.toString() })} onClick={() => { this.Tabs(indexComp.toString()); }}>
                    COMP {comp.numero}
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              {DataMDiario.map((comp, indexComp)=>
                <TabPane tabId={indexComp.toString()} key={ indexComp}  className="p-3">
                  <Card>
                    <CardHeader>{comp.nombre }</CardHeader>
                    <CardBody className="p-0">                              
                        <ReactTable
                          data={comp.partidas}
                          filterable
                          defaultFilterMethod={(filter, row) =>
                              String(row[filter.id]) === filter.value}
                          columns={[
                              {
                              Header: "Descripción",
                              columns: [
                                  {
                                  Header: "ITEM",
                                  accessor: "item",
                                  maxWidth: 100,
                                  filterMethod: (filter, row) =>
                                      row[filter.id].startsWith(filter.value) &&
                                      row[filter.id].endsWith(filter.value)
                                  },
                                  {
                                  Header: "DESCRIPCION",
                                  id: "descripcion",
                                  width: 438,
                                  accessor: d => d.descripcion,
                                  filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["descripcion"] }),
                                  filterAll: true
                                  },
                                  {
                                  Header: "METRADOS - SALDOS",
                                  id: "porcentaje",
                                  maxWidth: 200,
                                  accessor: p => p.porcentaje,
                                  
                                  Cell: row => (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                      }}
                                      className={(row.original.tipo === "titulo" ? 'd-none' : this.ControlAcceso())}
                                      >

                                      <div className="clearfix">
                                        <span className="float-left">A met. {row.original.avance_metrado}{row.original.u_med_temporal}</span>
                                        <span className="float-right">S/. {row.original.avance_costo}</span>
                                      </div>

                                      <div style={{
                                        height: '25%',
                                        backgroundColor: '#c3bbbb',
                                        borderRadius: '2px',
                                        position: 'relative'
                                        }}

                                      >
                                          {/* {console.log(row)} */}
                                      <div
                                        style={{
                                          width: `${row.value}%`,
                                          height: '100%',
                                          backgroundColor: row.value > 95 ? '#85cc00'
                                            : row.value > 50 ? '#ffbf00'
                                            :  '#ff2e00',
                                          borderRadius: '2px',
                                          transition: 'all .3s ease-out',
                                          position: 'absolute'
                                        }}
                                      />
                                      </div>
                                      <div className="clearfix">
                                        <span className="float-left">Saldo: {row.original.metrados_saldo}</span>
                                        <span className="float-right">S/. {row.original.metrados_costo_saldo}</span>
                                      </div>
                                    </div>                                          
                                  ),

                                  filterMethod: (filter, row) => {
                                      if (filter.value === "all") {
                                      return true;
                                      }
                                      if (filter.value === "true") {
                                      return row[filter.id] <= 99;
                                      }
                                      if (filter.value === "100") {
                                      return row[filter.id] === 100;
                                      }
                                      return row[filter.id] < 21;
                                  },
                                  Filter: ({ filter, onChange }) =>
                                      <select
                                          onChange={event => onChange(event.target.value)}
                                          style={{ width: "100%" }}
                                          value={filter ? filter.value : "all"}
                                      >
                                          <option value="all">Todo</option>
                                          <option value="false">0%</option>
                                          <option value="100">100%</option>
                                          <option value="true">En Progeso</option>
                                      </select>
                                  },
                                  {
                                  Header: "METRADO",
                                  id: "metrado",
                                  maxWidth: 100,
                                  accessor: d => d.metrado +' '+ d.unidad_medida,
                                  filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["metrado"] }),
                                  filterAll: true
                                  }
                              ]
                              },
                              {
                              Header: "Costos",
                              columns: [
                                  {
                                  Header: "P/U S/.",
                                  id: "costo_unitario",
                                  maxWidth: 100,
                                  accessor: d => d.costo_unitario,
                                  filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["costo_unitario"] }),
                                  filterAll: true
                                  },
                                  {
                                  Header: "P/P S/.",
                                  id: "parcial",
                                  maxWidth: 100,
                                  accessor: d => d.parcial,
                                  filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["parcial"] }),
                                  filterAll: true
                                  },
                                  {
                                  Header: "Metrar",
                                  accessor: "_id",
                                  maxWidth: 30,
                                  Cell: id => (
                                    <div className={(id.original.tipo === "titulo" ? 'd-none' : this.ControlAcceso())}>
                                      <button className="btn btn-sm btn-outline-light text-primary" href="#myModal" onClick={((e) => this.CapturarID (id.original.id_temporal, id.original.decrip_temporal, id.original.u_med_temporal, id.original.precio_temporal, id.original.metrados_saldo, indexComp, id.original.porcentaje, id.original.avance_metrado, id.original.metrado_temporal, id.viewIndex, id.original.parcial_temporal))} >
                                        <FaPlus />
                                      </button>
                                    </div>
                                  )
                                  }
                              ]
                              }
                          ]}  
                          defaultPageSize={10}
                          className="-striped -highlight table table-responsive table-sm small"
                          SubComponent={row => {
                            // console.log('row>>',row.original.actividades)
                            return (
                              <div style={{ padding: "5px" }}>
                                <label>
                                  Actividades de la partida
                                </label>
                                <br />
                                <ReactTable
                                  data={row.original.actividades}
                                  columns={[
                                      {
                                        Header: "nombre_actividad",
                                        accessor: "nombre_actividad"
                                      }, {
                                        Header: "N° VECES",
                                        id: "veces_actividad",
                                        accessor: d => d.veces_actividad
                                      },{
                                        Header: "LARGO",
                                        accessor: "largo_actividad"
                                      }, {
                                        Header: "ANCHO",
                                        accessor: "ancho_actividad"
                                      },{
                                        Header: "ALTO",
                                        accessor: "alto_actividad"
                                      },{
                                        Header: "METRADO",
                                        id: "metrado_actividad",
                                        accessor: m => m.metrado_actividad + ' ' + m.unidad_medida,
                                      },{
                                        Header: "P/U S/.",
                                        accessor: "costo_unitario"
                                      },{
                                        Header: "S/. PARCIAL",
                                        accessor: "parcial_actividad"
                                      },{
                                        Header: "Metrar",
                                        accessor: "id_partida",
                                        Cell: id => (
                                          <div className={(id.original.id_partida === "" ? 'd-none' : this.ControlAcceso())}>
                                            <button className="btn btn-sm btn-outline-light text-primary" href="#myModal" onClick={((e) => this.CapturarID (id.original.id_partida, id.original.decrip_temporal, id.original.u_med_temporal, id.original.precio_temporal, id.original.metrados_saldo, indexComp, id.original.porcentaje, id.original.avance_metrado, id.original.metrado_temporal, id.viewIndex, id.original.parcial_temporal))} >
                                              <FaPlus /> {row.original.id_partida}
                                            </button>
                                          </div>
                                        )
                                      }
                                    ]}
                                    defaultPageSize={row.original.actividades.length}
                                    showPagination={false}
                                />
                              </div>
                            );
                          }}
                        />
                    </CardBody>
                  </Card>
                </TabPane>
              )}
            </TabContent>
          </Card>
          {/* <!-- MODAL PARA METRAR --> */}
                  
          <Modal isOpen={this.state.modal} toggle={this.modalMetrar} size="sm"  fade={false}>
              <ModalHeader toggle={this.modalMetrar}><img src= { LogoSigobras } width="30px" alt="logo sigobras"/> SIGOBRAS S.A.C.</ModalHeader>
              <ModalBody>
                <b> {this.state.DescripMetrado} </b>
                <form >
                    <label htmlFor="comment">INGRESE EL METRADO:</label> {this.state.Porcentaje_Metrado}
                  <div className="input-group mb-3">
                    <input type="number" className="form-control"  placeholder="Ingrese el valor a metrar" onBlur={this.handleChange}  />
                    <div className="input-group-append">
                      <span className="input-group-text">{this.state.U_med_temporal}</span>
                    </div>
                    
                  </div>
                    <div className="form-group">
                      <label htmlFor="comment">DESCRIPCION:</label>
                      <textarea className="form-control" rows="2" onBlur={this.handleChange2}></textarea>
                    </div>
              

                    <div className="custom-file mb-3 p-3">
                      <input type="file" className="custom-file-input disabled" id="customFile" name="filename" disabled/>
                      <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                    </div>

                    
                </form>
                <div className="d-flex p-1 text-center mt-0">  
                  <div className="card alert alert-info  p-1 m-1">Costo / {this.state.U_med_temporal} =  {this.state.Precio_unitario} <br/>
                    soles
                  </div>
                  <div className="card alert alert-danger p-1 m-1">Saldo de met.<br/>
                      {this.state.Saldo_metrado}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                
                <Button color="primary" onClick={this.handleSubmit }>Guardar</Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          {/* ///<!-- MODAL PARA METRAR --> */}  
        </div>
      );
    }else{
        return <Redirect to='' />;
    }
  }
}



export default MDdiario;

import React, { Component } from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';
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

      ValorMetrado:'',
      DescripcionMetrado:'',
      ObservacionMetrado:'',
      IdMetradoActividad:'',
      debounceTimeout: 200,

      // datos para capturar en el modal
      id_actividad:'',
      nombre_actividad:'',
      unidad_medida:'',
      costo_unitario:'',
      actividad_metrados_saldo:'',
      indexComp:'',
      actividad_porcentaje:'',
      actividad_avance_metrado:'',
      metrado_actividad:'',
      viewIndex:'',
      parcial_actividad:'',

      // expanded:1

    }
    this.Tabs = this.Tabs.bind(this)
    this.ControlAcceso = this.ControlAcceso.bind(this)
    this.CapturarID = this.CapturarID.bind(this)
    this.modalMetrar = this.modalMetrar.bind(this)
    this.EnviarMetrado = this.EnviarMetrado.bind(this)
  }
  componentWillMount(){
    document.title ="Metrados Diarios"
    axios.post(`${UrlServer}/listaPartidas`,{
      id_ficha: sessionStorage.getItem('idobra')
    })
    .then((res)=>{
      console.log('res>>', res.data);
      
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
  
  CapturarID(id_actividad, nombre_actividad, unidad_medida, costo_unitario, actividad_metrados_saldo, indexComp, actividad_porcentaje, actividad_avance_metrado, metrado_actividad, viewIndex, parcial_actividad) {

    var { DataMDiario } = this.state

    var DataModificado = DataMDiario

    DataModificado[indexComp].partidas[viewIndex].porcentaje = 100

     this.setState({
      DataMDiario: DataModificado
     })

    console.log('dD>', DataMDiario[0].partidas[4].porcentaje)
    console.log('indexComp>', indexComp,'viewIndex', viewIndex)

    // e.preventDefault()        
    this.setState({
      id_actividad: id_actividad,
      nombre_actividad: nombre_actividad,
      unidad_medida: unidad_medida,
      costo_unitario: costo_unitario,
      actividad_metrados_saldo: actividad_metrados_saldo,
      indexComp: indexComp,
      actividad_porcentaje: actividad_porcentaje,
      actividad_avance_metrado: actividad_avance_metrado,
      metrado_actividad: metrado_actividad,
      viewIndex: viewIndex,
      parcial_actividad: parcial_actividad
    })
    this.modalMetrar();    
  }

  modalMetrar() {
    this.setState({
      modal: !this.state.modal
    });
  }
  
  EnviarMetrado(){

    const { id_actividad, DescripcionMetrado, ObservacionMetrado, ValorMetrado } = this.state
    axios.post(`${UrlServer}/avanceActividad`,{
      "Actividades_id_actividad":id_actividad,
      "valor":ValorMetrado,
      "descripcion":DescripcionMetrado,
      "observacion":ObservacionMetrado,
      "id_ficha":sessionStorage.getItem('idobra')
    })
    .then((res)=>
      console.log('datos', res)
    )
    .catch((error)=>
      console.error('algo salio mal al consultar al servidor ', error)
    )

    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    const { DataMDiario, debounceTimeout } = this.state
    if(sessionStorage.getItem("idacceso")){ 
      return (
        <div className="pb-3">
          <Card>
            <Nav tabs>
            {/* {console.log('DataMDiario', DataMDiario)} */}
              {DataMDiario === undefined? 'cargando': DataMDiario.map((comp,indexComp)=>
                <NavItem key={ indexComp }>
                  <NavLink className={classnames({ active: this.state.activeTab === indexComp.toString() })} onClick={() => { this.Tabs(indexComp.toString()); }}>
                    COMP {comp.numero}
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              {DataMDiario === undefined? 'cargando': DataMDiario.map((comp, indexComp)=>
                <TabPane tabId={indexComp.toString()} key={ indexComp}  className="p-1">
                  <Card>
                    <CardHeader><b>{ comp.nombre }</b></CardHeader>
                    <CardBody >                              
                        <ReactTable
                          data={comp.partidas}
                          filterable
                          defaultFilterMethod={(filter, row) =>
                              String(row[filter.id]) === filter.value}
                              
                          columns={[
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
                                        <span className="float-left text-warning">A met. {row.original.avance_metrado}{row.original.u_med_temporal}</span>
                                        <span className="float-right text-warning">S/. {row.original.avance_costo}</span>
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
                                          transition: 'all .9s ease-in',
                                          position: 'absolute'
                                        }}
                                      />
                                      </div>
                                      <div className="clearfix">
                                        <span className="float-left text-info">Saldo: {row.original.metrados_saldo}</span>
                                        <span className="float-right text-info">S/. {row.original.metrados_costo_saldo}</span>
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
                                  },
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
                                  // {
                                  // Header: "Metrar",
                                  // accessor: "_id",
                                  // maxWidth: 30,
                                  // Cell: id => (
                                  //   <div className={(id.original.tipo === "titulo" ? 'd-none' : this.ControlAcceso())}>
                                  //     <button className="btn btn-sm btn-outline-light text-primary" href="#myModal" onClick={((e) => this.CapturarID (id.original.id_temporal, id.original.decrip_temporal, id.original.u_med_temporal, id.original.precio_temporal, id.original.metrados_saldo, indexComp, id.original.porcentaje, id.original.avance_metrado, id.original.metrado_temporal, id.viewIndex, id.original.parcial_temporal))} >
                                  //       <FaPlus />
                                  //     </button>
                                  //   </div>
                                  // )
                                  // }
                          ]}  
                          defaultPageSize={20}
                          style={{ height: 500 }}
                          className="-striped -highlight table table-responsive table-sm small"
                          headerClassName='bg-primary'
                          collapseOnDataChange={false} 
                          // expanded={this.state.expanded}
                          SubComponent={row => 

                            // console.log('row>>',row.original.actividades)
                            row.original.tipo === "titulo" ? <span className="text-center text-danger"><b>no tiene actividades</b></span>:
                              <div className="p-1">
                                <b className="h6"> Actividades de la partida</b>
                                <ReactTable
                                  data={row.original.actividades}
                                  columns={[
                                      {
                                        Header: "NOMBRE ACTIVIDAD",
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
                                        Header: "SALDO METRADO",
                                        id: "actividad_metrados_saldo",
                                        accessor: m => m.actividad_metrados_saldo,
                                      },{
                                        Header: "P/U S/.",
                                        accessor: "costo_unitario"
                                      },{
                                        Header: "S/. PARCIAL",
                                        accessor: "parcial_actividad"
                                      },{
                                        Header: "METRAR",
                                        accessor: "id_actividad",
                                        Cell: id => (
                                          <div className={(id.original.id_actividad === "" ? 'd-none' : this.ControlAcceso())}>
                                            {/* {console.log('row=>>>',row)} */}
                                            <button className="btn btn-sm btn-outline-light text-primary" onClick={(e)=>this.CapturarID (id.original.id_actividad, id.original.nombre_actividad, id.original.unidad_medida, id.original.costo_unitario, id.original.actividad_metrados_saldo, indexComp, id.original.actividad_porcentaje, id.original.actividad_avance_metrado, id.original.metrado_actividad, row.index, id.original.parcial_actividad)} >
                                              <FaPlus /> 
                                              {/* {id.original.id_actividad} */}
                                            </button>
                                          </div>
                                        )
                                      }
                                    ]}
                                    defaultPageSize={row.original.actividades.length}
                                    showPagination={false}
                                    
                                />
                              </div>
                            
                          }
                        />
                    </CardBody>
                  </Card>
                </TabPane>
              )}
            </TabContent>
          </Card>
          {/* <!-- MODAL PARA METRAR --> */}
                  
          <Modal isOpen={this.state.modal} toggle={this.modalMetrar} size="sm"  fade={false}>
              <ModalHeader toggle={this.modalMetrar} className="bg-dark border-button"><img src= { LogoSigobras } width="30px" alt="logo sigobras" /> SIGOBRAS S.A.C.</ModalHeader>
              <ModalBody className="bg-dark ">
                <b> {this.state.nombre_actividad} </b>
                <form >
                  <label htmlFor="comment">INGRESE EL METRADO:</label> {this.state.Porcentaje_Metrado}

                  <div className="input-group mb-3">
                    <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ValorMetrado: e.target.value})}  type="number" className="form-control"/>  
                    
                    <div className="input-group-append">
                      <span className="input-group-text">{this.state.unidad_medida}</span>
                    </div>
                    
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">DESCRIPCION:</label>
                    <DebounceInput
                      cols="60"
                      rows="2"
                      element="textarea"
                      minLength={0}
                      debounceTimeout={debounceTimeout}
                      onChange={e => this.setState({DescripcionMetrado: e.target.value})}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">OBSERVACIÓN:</label>
                    <DebounceInput
                      cols="60"
                      rows="2"
                      element="textarea"
                      minLength={0}
                      debounceTimeout={debounceTimeout}
                      onChange={e => this.setState({ObservacionMetrado: e.target.value})}
                      className="form-control"
                    />
                  </div>
                  

                  <div className="custom-file mb-3 p-3">
                    <input type="file" className="custom-file-input disabled" id="customFile" name="filename" disabled/>
                    <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                  </div>

                    
                </form>
                <div className="d-flex p-1 text-center mt-0">  
                  <div className="card alert alert-info  p-1 m-1">Costo / {this.state.unidad_medida} =  {this.state.costo_unitario} <br/>
                    soles
                  </div>
                  <div className="card alert alert-danger p-1 m-1">Saldo de met.<br/>
                      {this.state.actividad_metrados_saldo}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="bg-dark border border-dark border-top border-right-0 border-bottom-0 border-button-0">
                
                <Button color="primary" onClick={this.EnviarMetrado }>Guardar</Button>{' '}
                <Button color="danger" onClick={this.modalMetrar}>Cancelar</Button>
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

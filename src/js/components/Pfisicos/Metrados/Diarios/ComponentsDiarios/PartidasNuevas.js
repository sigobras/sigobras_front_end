import React, { Component } from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { MdFlashOn, MdReportProblem } from 'react-icons/md';

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Tooltip , CardText, Row, Col,  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';

import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import { ToastContainer, toast } from "react-toastify";

// import LogoSigobras from '../../../../../../images/logoSigobras.png'
import { UrlServer } from '../../../../Utils/ServerUrlConfig';


class PartidasNuevas extends Component {
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
      descripcion:'',

      // validacion de al momento de metrar
      smsValidaMetrado:''

    }
    this.Tabs = this.Tabs.bind(this)
    this.ControlAcceso = this.ControlAcceso.bind(this)
    this.CapturarID = this.CapturarID.bind(this)
    this.modalMetrar = this.modalMetrar.bind(this)
    this.EnviarMetrado = this.EnviarMetrado.bind(this)
  }
  componentWillMount(){
    axios.post(`${UrlServer}/listaPartidasNuevas`,{
      id_ficha: sessionStorage.getItem('idobra')
    })
    .then((res)=>{
      console.log('res partidas nuevas>>', res.data);
      
      this.setState({
        DataMDiario:res.data
      })
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
  
  CapturarID(id_actividad, nombre_actividad, unidad_medida, costo_unitario, actividad_metrados_saldo, indexComp, actividad_porcentaje, actividad_avance_metrado, metrado_actividad, viewIndex, parcial_actividad, descripcion) {
    this.modalMetrar();
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
      parcial_actividad: parcial_actividad,
      descripcion:descripcion,
      smsValidaMetrado:''
    })
        
  }

  modalMetrar() {
    this.setState({
      modal: !this.state.modal
    });
  }
  
  EnviarMetrado(e){

    e.preventDefault()
    
    var { id_actividad, DescripcionMetrado, ObservacionMetrado, ValorMetrado, DataMDiario, indexComp, viewIndex, actividad_metrados_saldo } = this.state
    var DataModificado = DataMDiario
    actividad_metrados_saldo = Number(actividad_metrados_saldo)

    if(ValorMetrado === '' || ValorMetrado === '0' || ValorMetrado === NaN ){
      this.setState({smsValidaMetrado:'Ingrese un valor de metrado válido'})
    }else if( Number(ValorMetrado) < 0){
      this.setState({smsValidaMetrado:'El valor del metrado es inferior a cero'})
    }else if(Number(ValorMetrado) > actividad_metrados_saldo){
      this.setState({smsValidaMetrado:'El valor del metrado ingresado es mayor al saldo disponible'})
    }else{
      if(confirm('¿Estas seguro de metrar?')){
        this.setState({
          modal: !this.state.modal
        })

        axios.post(`${UrlServer}/avanceActividad`,{
          "Actividades_id_actividad":id_actividad,
          "valor":ValorMetrado,
          "descripcion":DescripcionMetrado,
          "observacion":ObservacionMetrado,
          "id_ficha":sessionStorage.getItem('idobra')
        })
        .then((res)=>{
          console.log(res.data)
          DataModificado[indexComp].partidas[viewIndex] = res.data
    
          this.setState({
            DataMDiario: DataModificado
          })
          toast.success('Exito! Metrado ingresado');
        })
        .catch((errors)=>{
          toast.error('hubo errores al ingresar el metrado');
          // console.error('algo salio mal al consultar al servidor ', error)
        })
      }
    }
  }

  render() {
    var { DataMDiario, debounceTimeout, descripcion, smsValidaMetrado } = this.state
    if(sessionStorage.getItem("idacceso") !== null){ 
      return (
        <div className="pb-3">

          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />


          <Card>
            <Nav tabs>
              {DataMDiario.length === 0 ? 'no hay datos': DataMDiario.map((comp,indexComp)=>
                <NavItem key={ indexComp }>
                  <NavLink className={classnames({ active: this.state.activeTab === indexComp.toString() })} onClick={() => { this.Tabs(indexComp.toString()); }}>
                    COMP {comp.numero}
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              {DataMDiario.length  === 0 ? '': DataMDiario.map((comp, indexComp)=>
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
                                  width: 100,
                                  filterMethod: (filter, row) =>
                                      row[filter.id].startsWith(filter.value) &&
                                      row[filter.id].endsWith(filter.value)
                                  },
                                  {
                                  Header: "DESCRIPCION",
                                  id: "descripcion",
                                  width: 480,
                                  accessor: d => d.descripcion,
                                  filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["descripcion"] }),
                                  filterAll: true
                                  },
                                  {
                                  Header: "METRADO",
                                  id: "metrado",
                                  width: 70,
                                  accessor: d => ( d.metrado === '0.00'? '' : d.unidad_medida === null ? '': d.metrado +' '+ d.unidad_medida.replace("/DIA", "")),
                                  filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["metrado"] }),
                                  filterAll: true
                                  },
                                  {
                                  Header: "P/U S/.",
                                  id: "costo_unitario",
                                  width: 70,
                                  accessor: d => (d.costo_unitario === '0.00'?'': d.costo_unitario),
                                  filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["costo_unitario"] }),
                                  filterAll: true
                                  },
                                  {
                                  Header: "P/P S/.",
                                  id: "parcial",
                                  width: 70,
                                  accessor: d => (d.parcial === '0.00'? '': d.parcial ),
                                  filterMethod: (filter, rows) =>
                                      matchSorter(rows, filter.value, { keys: ["parcial"] }),
                                  filterAll: true
                                  },
                                  {
                                  Header: "METRADOS - SALDOS",
                                  id: "porcentaje",
                                  width: 150,
                                  accessor: p => p.porcentaje,
                                  
                                  Cell: row => (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                      }}
                                      className={(row.original.tipo === "titulo" ? 'd-none' : this.ControlAcceso())}
                                      >

                                      <div className="clearfix">
                                        <span className="float-left text-warning">A met. {row.original.avance_metrado}{row.original.unidad_medida === null ? '': row.original.unidad_medida.replace("/DIA", "")}</span>
                                        <span className="float-right text-warning">S/. {row.original.avance_costo}</span>
                                      </div>

                                      <div style={{
                                        height: '2px',
                                        width: '100%',
                                        background: '#c3bbbb',
                                        borderRadius: '2px',
                                        position: 'relative'
                                        }}

                                      >
                                      <div
                                        style={{
                                          width: `${row.value}%`,
                                          height: '100%',
                                          background: row.value > 95 ? '#a4fb01'
                                            : row.value > 50 ? '#ffbf00'
                                            :  '#ff2e00',
                                          borderRadius: '2px',
                                          transition: 'all 2s linear 0s',
                                          position: 'absolute',
                                          boxShadow: `0 0 6px 1px ${row.value > 95 ? '#a4fb01'
                                            : row.value > 50 ? '#ffbf00'
                                            :  '#ff2e00'}`
                                        }}
                                      />
                                      {/* {row.value} */}
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
                                      if (filter.value === "false") {
                                      return row[filter.id] <= 0;
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
                                  }
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
                                <b > <MdReportProblem size={ 20 } className="text-warning" /> {row.original.descripcion }</b><MdFlashOn size={ 20 } className="text-warning" />
                                <ReactTable
                                  data={row.original.actividades}
                                  columns={[
                                      {
                                        Header: "NOMBRE ACTIVIDAD",
                                        accessor: "nombre_actividad",
                                        
                                      }, {
                                        Header: "N° VECES",
                                        id: "veces_actividad",
                                        width:50,
                                        accessor: d => d.veces_actividad
                                      },{
                                        Header: "LARGO",
                                        accessor: "largo_actividad",
                                        width:50,
                                      }, {
                                        Header: "ANCHO",
                                        accessor: "ancho_actividad",
                                        width:50,
                                      },{
                                        Header: "ALTO",
                                        accessor: "alto_actividad",
                                        width:50,
                                      },{
                                        Header: "METRADO",
                                        id: "metrado_actividad",
                                        className:'text-center',
                                        accessor: m => m.metrado_actividad + ' ' + m.unidad_medida.replace("/DIA", ""),
                                      },{
                                        Header: "SALDO",
                                        id: "actividad_metrados_saldo",
                                        width:70,
                                        className:'text-center',
                                        accessor: m => m.actividad_metrados_saldo,
                                      },{
                                        Header: "P/U S/.",
                                        accessor: "costo_unitario",
                                        className:'text-right',
                                      },{
                                        Header: "PARCIAL S/.",
                                        accessor: "parcial_actividad",
                                        className:'text-right',
                                      },
                                      {
                                      Header: "ACTIVIDADES - SALDOS",
                                      id: "actividad_porcentaje",
                                      width: 130,
                                      accessor: p => p.actividad_porcentaje,
                                      
                                      Cell: rowPor => (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                          }}
                                          // className={(rowPor.original.tipo === "titulo" ? 'd-none' : this.ControlAcceso())}
                                          >
                                          {/* {console.log(rowPor)} */}
                                          <div className="clearfix">
                                            <span className="float-left text-warning">A met. {rowPor.original.actividad_avance_metrado}{rowPor.original.unidad_medida.replace("/DIA", "")}</span>
                                            <span className="float-right text-warning">S/. {rowPor.original.actividad_avance_costo}</span>
                                          </div>

                                          <div style={{
                                            height: '4%',
                                            backgroundColor: '#c3bbbb',
                                            borderRadius: '2px',
                                            position: 'relative'
                                            }}

                                          >
                                          <div
                                            style={{
                                              width: `${rowPor.value}%`,
                                              height: '100%',
                                              backgroundColor: rowPor.value > 95 ? '#A4FB01'
                                                : rowPor.value > 50 ? '#ffbf00'
                                                :  '#ff2e00',
                                              borderRadius: '2px',
                                              transition: 'all .9s ease-in',
                                              position: 'absolute',
                                              boxShadow: `0 0 6px 1px ${rowPor.value > 95 ? '#A4FB01'
                                              : rowPor.value > 50 ? '#ffbf00'
                                              :  '#ff2e00'}`
                                            }}
                                          />
                                          </div>
                                          <div className="clearfix">
                                            <span className="float-left text-info">Saldo: {rowPor.original.actividad_metrados_saldo}</span>
                                            <span className="float-right text-info">S/. {rowPor.original.actividad_metrados_costo_saldo}</span>
                                          </div>
                                        </div>                                          
                                      ),

                                      filterMethod: (filter, rowPor) => {
                                          if (filter.value === "all") {
                                          return true;
                                          }
                                          if (filter.value === "true") {
                                          return rowPor[filter.id] <= 99;
                                          }
                                          if (filter.value === "100") {
                                          return rowPor[filter.id] === 100;
                                          }
                                          return rowPor[filter.id] < 21;
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
                                        Header: "METRAR",
                                        accessor: "id_actividad",
                                        width: 40,
                                        className: "text-center",
                                        Cell: id => (
                                          <div className={(id.original.id_actividad === "" ? 'd-none' : this.ControlAcceso())}>
                                            {/* {console.log('>>', typeof id.original.actividad_metrados_saldo)} */}
                                            {id.original.actividad_metrados_saldo === '0.00' ? <FaCheck className="text-success" size={ 18 } /> : 
                                              <button className="btn btn-sm btn-outline-dark text-primary" onClick={(e)=>this.CapturarID (id.original.id_actividad, id.original.nombre_actividad, id.original.unidad_medida, id.original.costo_unitario, id.original.actividad_metrados_saldo, indexComp, id.original.actividad_porcentaje, id.original.actividad_avance_metrado, id.original.metrado_actividad, row.index, id.original.parcial_actividad, row.original.descripcion)} >
                                                <FaPlus /> 
                                              </button>
                                            }
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
            <form onSubmit={this.EnviarMetrado }>
              <ModalHeader toggle={this.modalMetrar} className="bg-dark border-button">
                {/* <img src= { LogoSigobras } width="30px" alt="logo sigobras" /> SIGOBRAS S.A.C. */}
              </ModalHeader>
              <ModalBody className="bg-dark ">
                <label className="text-center">{ descripcion }</label><br/>
                <b> {this.state.nombre_actividad} </b> <br/>
                
                  <label htmlFor="comment">INGRESE EL METRADO:</label> {this.state.Porcentaje_Metrado}

                  <div className="input-group mb-0">
                    <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ValorMetrado: e.target.value})}  type="number" className="form-control" autoFocus/>  
                    
                    <div className="input-group-append">
                      <span className="input-group-text">{this.state.unidad_medida.replace("/DIA", "")}</span>
                    </div>
                  </div>
                  <div className="texto-rojo mb-3"> <b> { smsValidaMetrado }</b></div> 


                  <div className="d-flex p-1 text-center mt-0">  
                    <div className="card alert bg-info text-white p-1 m-1">Costo / {this.state.unidad_medida.replace("/DIA", "")} =  {this.state.costo_unitario} <br/>
                      soles
                    </div>
                    <div className="card alert bg-secondary p-1 text-white m-1">Saldo de metrado<br/>
                        {this.state.actividad_metrados_saldo}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">DESCRIPCION:</label>
                    <DebounceInput
                      cols="40"
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
                      cols="40"
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

              </ModalBody>
              <ModalFooter className="bg-dark border border-dark border-top border-right-0 border-bottom-0 border-button-0">
                
                <Button color="primary" type="submit">Guardar</Button>{' '}
                <Button color="danger" onClick={this.modalMetrar}>Cancelar</Button>
              </ModalFooter>
              </form>
          </Modal>
          {/* ///<!-- MODAL PARA METRAR --> */}  
        </div>
      );
    }else{
      return window.location.href = '/'
    }
  }
}



export default PartidasNuevas;

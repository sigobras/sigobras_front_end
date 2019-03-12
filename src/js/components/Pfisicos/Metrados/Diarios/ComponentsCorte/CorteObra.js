import React, { Component } from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { MdFlashOn, MdReportProblem } from 'react-icons/md';

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Tooltip , Spinner, Row, Col,  Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import classnames from 'classnames';
import { Redirect } from "react-router-dom";

import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import { toast } from "react-toastify";

import LogoSigobras from '../../../../../../images/logoSigobras.png'
import { UrlServer } from '../../../../Utils/ServerUrlConfig';


class CorteObra extends Component {
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
      debounceTimeout: 500,

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
      smsValidaMetrado:'',
      ValorMetradoRestante:'',
      // STATES MAYORES METRADOS
      // registrar inputs de mayores metrados
      nombre:'',
      veces:'',
      largo:'',
      ancho:'',
      alto:'',
      parcial:'',
      tipo:'',
      partidas_id_partida:'',

      modalMm:false

    }
    this.Tabs = this.Tabs.bind(this)
    this.ControlAcceso = this.ControlAcceso.bind(this)
    this.CapturarID = this.CapturarID.bind(this)
    this.modalMetrar = this.modalMetrar.bind(this)
    this.EnviarMetrado = this.EnviarMetrado.bind(this)
    this.capturaidMM = this.capturaidMM.bind(this)
    this.modalMayorMetrado = this.modalMayorMetrado.bind(this)
    this.EnviarMayorMetrado = this.EnviarMayorMetrado.bind(this)
    
  }
  componentWillMount(){
    document.title ="Corte de metrados"
    axios.post(`${UrlServer}/listaPartidas`,{
      id_ficha: sessionStorage.getItem('idobra')
    })
    .then((res)=>{
      // console.log('res>>', res.data);
      
      this.setState({
        DataMDiario:res.data
      })
    })
    .catch((error)=>{
      // console.error('algo salio mal verifique el',error);
      toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.',{ position: "top-right",autoClose: 5000 });

      
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
      unidad_medida: unidad_medida.replace("/DIA", ""),
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
    console.log('result',this.state.ValorMetrado - this.state.actividad_avance_metrado);
    
    
    // if(ValorMetrado === '' || ValorMetrado === '0' || ValorMetrado === NaN ){
    //   this.setState({smsValidaMetrado:'Ingrese un valor de metrado válido'})
    // }else if( Number(ValorMetrado) < 0){
    //   this.setState({smsValidaMetrado:'El valor del metrado es inferior a cero'})
    // }else if(Number(ValorMetrado) > actividad_metrados_saldo){
    //   this.setState({smsValidaMetrado:'El valor del metrado ingresado es mayor al saldo disponible'})
    // }else{
      if(confirm('¿Estas seguro de metrar?')){
        this.setState({
          modal: !this.state.modal
        })
        axios.post(`${UrlServer}/avanceActividadCorte`,{
          "Actividades_id_actividad":id_actividad,
          "valor":this.state.ValorMetrado - this.state.actividad_avance_metrado,
          "descripcion":DescripcionMetrado,
          "observacion":ObservacionMetrado,
          "id_ficha":sessionStorage.getItem('idobra')
        })
        .then((res)=>{
          // console.log(res.data)
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
    // }
  }

  capturaidMM(partidas_id_partida, indexComp, indexPartida){
    // console.log('id1', indexComp,'id2', indexPartida)
    // console.log('data', this.state.DataMDiario);
    
    this.modalMayorMetrado()
    this.setState({
      partidas_id_partida: partidas_id_partida,
      indexComp:indexComp,
      viewIndex:indexPartida
    })
  }

  modalMayorMetrado() {
    this.setState({
        modalMm: !this.state.modalMm
    });
  }
  EnviarMayorMetrado(e){
    e.preventDefault()

    var { DataMDiario, nombre, veces, largo, ancho, alto, parcial, partidas_id_partida, indexComp, viewIndex } = this.state
    var DataModificado = DataMDiario

    if(confirm('¿Estas seguro de registar el mayor metrado?')){
      this.setState({
        modalMm: !this.state.modalMm
      })

      axios.post(`${UrlServer}/postNuevaActividadMayorMetrado`,{
        "nombre":nombre,
        "veces":veces,
        "largo":largo,
        "ancho":ancho,
        "alto":alto,
        "parcial":parcial,
        "tipo":'subtitulo',
        "partidas_id_partida":partidas_id_partida
      })
      .then((res)=>{
          // console.log(res.data)

          DataModificado[indexComp].partidas[viewIndex] = res.data
          this.setState({
            DataMDiario:DataModificado,
            nombre:'',
            veces:'',
            largo:'',
            ancho:'',
            alto:'',
            parcial:'',
            tipo:'',
            partidas_id_partida:'',
          })

          toast.success('Exito! Metrado mayor metrado registrado al sistema');
      })
      .catch((err)=>{
          toast.error('hubo errores al ingresar el metrado');
          console.error('algo salio mal al consultar al servidor❌❌ ', err)
      })
    }
  }

  render() {
    var { DataMDiario, debounceTimeout, descripcion, smsValidaMetrado } = this.state
    if(sessionStorage.getItem("idacceso")!== null ){ 
      return (
        <div className="pb-3">
              <Card>
                  <Nav tabs>
                    {DataMDiario.length === 0 ?<label className="text-center"> <Spinner color="primary" size="sm" /></label>: DataMDiario.map((comp,indexComp)=>
                      <NavItem key={ indexComp }>
                        <NavLink className={classnames({ active: this.state.activeTab === indexComp.toString() })} onClick={() => { this.Tabs(indexComp.toString()); }}>
                          COMP {comp.numero}
                        </NavLink>
                      </NavItem>
                    )}
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>

                    {DataMDiario.length === 0 ? '': DataMDiario.map((comp, indexComp)=>
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
                                        accessor: d => ( d.metrado === '0.00'? '' : d.unidad_medida === null ? '':   d.metrado +' '+ d.unidad_medida.replace("/DIA", "")),
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
                                              height: '3px',
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
                                            {/* {console.log('sasa>>',row.row.porcentaje)} */}
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
                                defaultPageSize={100}
                                style={{ height: 500 }}
                                className="-striped -highlight table-sm small"
                                headerClassName='bg-primary'
                                collapseOnDataChange={false} 
                                // expanded={this.state.expanded}
                                SubComponent={row => 

                                  row.original.tipo === "titulo" ? <span className="text-center text-danger"><b>no tiene actividades</b></span>:
                                    <div className="p-1">
                                      {/* {console.log(row)} */}
                                      <b> <MdReportProblem size={ 20 } className="text-warning" /> {row.original.descripcion }</b><MdFlashOn size={ 20 } className="text-warning" />
                                      <button className="btn btn-outline-warning btn-xs p-0 mb-1 fsize" title="Ingreso de mayores metrados" onClick={ e=>this.capturaidMM(row.original.id_partida, indexComp, row.index) }> <FaPlus size={10} /> MM</button>
                                      
                                      <table className="table table-bordered">
                                        <thead className="thead-dark">
                                          <tr>
                                            <th>NOMBRE DE ACTIVIDAD</th>
                                            <th>N° VECES</th>
                                            <th>LARGO</th>
                                            <th>ANCHO</th>
                                            <th>ALTO</th>
                                            <th>METRADO</th>
                                            <th>SALDO</th>
                                            <th>P/U </th>
                                            <th>PARCIAL</th>
                                            <th>ACTIVIDADES SALDOS</th>
                                            <th>OPCIONES</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {row.original.actividades.map((actividades, indexA)=>
                                            <tr key={ indexA } className={ actividades.actividad_estado ==="Mayor Metrado" ?'bg-mm':''}>
                                              <td>{ actividades.nombre_actividad }</td>
                                              <td>{ actividades.veces_actividad }</td>
                                              <td>{ actividades.largo_actividad }</td>
                                              <td>{ actividades.ancho_actividad }</td>
                                              <td>{ actividades.alto_actividad }</td>
                                              <td>{ actividades.metrado_actividad } { actividades.unidad_medida.replace("/DIA", "") }</td>
                                              <td>{ actividades.actividad_metrados_saldo }</td>
                                              <td>{ actividades.costo_unitario }</td>
                                              <td>{ actividades.parcial_actividad }</td>
                                              <td>
                                                {actividades.actividad_tipo === "titulo"?"":
                                                  <div style={{
                                                      width: '100%',
                                                      height: '100%',
                                                    }}
                                                    >
                                                      <div className="clearfix">
                                                        <span className="float-left text-warning">A met. {actividades.actividad_avance_metrado}{actividades.unidad_medida.replace("/DIA", "")}</span>
                                                        <span className="float-right text-warning">S/. {actividades.actividad_avance_costo}</span>
                                                      </div>

                                                      <div style={{
                                                        height: '2px',
                                                        backgroundColor: '#c3bbbb',
                                                        borderRadius: '2px',
                                                        position: 'relative'
                                                        }}

                                                      >
                                                      <div
                                                        style={{
                                                          width: `${actividades.actividad_porcentaje}%`,
                                                          height: '100%',
                                                          backgroundColor: actividades.actividad_porcentaje > 95 ? '#A4FB01'
                                                            : actividades.actividad_porcentaje > 50 ? '#ffbf00'
                                                            :  '#ff2e00',
                                                          borderRadius: '2px',
                                                          transition: 'all .9s ease-in',
                                                          position: 'absolute',
                                                          boxShadow: `0 0 6px 1px ${actividades.actividad_porcentaje > 95 ? '#A4FB01'
                                                          : actividades.actividad_porcentaje > 50 ? '#ffbf00'
                                                          :  '#ff2e00'}`
                                                        }}
                                                    />
                                                    </div>
                                                    <div className="clearfix">
                                                      <span className="float-left text-info">Saldo: {actividades.actividad_metrados_saldo}</span>
                                                      <span className="float-right text-info">S/. {actividades.actividad_metrados_costo_saldo}</span>
                                                    </div>
                                                  </div>
                                                }
                                              </td>
                                              <td>
                                                {actividades.actividad_tipo === "titulo"? "":
                                                  
                                                  <div className={(actividades.id_actividad === "" ? 'd-none' : this.ControlAcceso())}>
                                                    {/* { actividades.actividad_metrados_saldo === '0.00' ? <FaCheck className="text-success" size={ 18 } /> :  */}
                                                      <button className="btn btn-sm btn-outline-dark text-primary" onClick={(e)=>this.CapturarID(actividades.id_actividad, actividades.nombre_actividad, actividades.unidad_medida, actividades.costo_unitario, actividades.actividad_metrados_saldo, indexComp, actividades.actividad_porcentaje, actividades.actividad_avance_metrado, actividades.metrado_actividad, row.index, actividades.parcial_actividad, row.original.descripcion, row.original.metrado, row.original.parcial)} >
                                                        <FaPlus /> 
                                                      </button>
                                                    {/* } */}
                                                  </div>
                                                  }
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
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
              <ModalHeader toggle={this.modalMetrar} className="bg-dark border-button"><img src= { LogoSigobras } width="30px" alt="logo sigobras" /> SIGOBRAS S.A.C.</ModalHeader>
              <ModalBody className="bg-dark ">
                <label className="text-center">{ descripcion }</label><br/>
                <b> {this.state.nombre_actividad} </b> <br/>
                
                  <label htmlFor="comment">INGRESE EL METRADO:</label> {this.state.Porcentaje_Metrado}

                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText className="p-1">{ this.state.actividad_avance_metrado }</InputGroupText>
                        <InputGroupText className="p-1">-</InputGroupText>
                    </InputGroupAddon>
                    {/* <Input placeholder="valor" /> */}
                    <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ValorMetrado: e.target.value})}  type="number" className="form-control" autoFocus/>  
                    <InputGroupAddon addonType="append">
                        <InputGroupText className="p-1">=</InputGroupText>
                        <InputGroupText className="p-1">{ this.state.ValorMetrado - this.state.actividad_avance_metrado}</InputGroupText>
                        <InputGroupText className="p-1">{this.state.unidad_medida}</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            
                  {/* <div className="input-group mb-0">
                    <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ValorMetrado: e.target.value})}  type="number" className="form-control" autoFocus/>  
                    
                    <div className="input-group-append">
                      <span className="input-group-text">{this.state.unidad_medida.replace("/DIA", "")}</span>
                    </div>
                  </div> */}
                  <div className="texto-rojo mb-3"> <b> { smsValidaMetrado }</b></div> 


                  <div className="d-flex p-1 text-center mt-0">  
                    <div className="card alert bg-info text-white p-1 m-1">Costo / {this.state.unidad_medida} =  {this.state.costo_unitario} <br/>
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
                  

                  {/* <div className="custom-file mb-3 p-3">
                    <input type="file" className="custom-file-input disabled" id="customFile" name="filename" disabled/>
                    <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                  </div> */}

              </ModalBody>
              <ModalFooter className="bg-dark border border-dark border-top border-right-0 border-bottom-0 border-button-0">
                
                <Button color="primary" type="submit">Guardar</Button>{' '}
                <Button color="danger" onClick={this.modalMetrar}>Cancelar</Button>
              </ModalFooter>
              </form>
          </Modal>
          {/* ///<!-- MODAL PARA METRAR --> */}  



          {/* <!-- MODAL PARA  mayores metrados ( modalMayorMetrado ) --> */}
                  
          <Modal isOpen={this.state.modalMm} toggle={this.modalMayorMetrado} size="sm" fade={false}>
                    <form onSubmit={this.EnviarMayorMetrado }>
                    <ModalHeader toggle={this.modalMayorMetrado} className="border-button">
                        <img src= { LogoSigobras } width="30px" alt="logo sigobras" /> SIGOBRAS S.A.C.
                    </ModalHeader>
                    <ModalBody>
                        
                        <label htmlFor="comment">NOMBRE DE LA ACTIVIDAD:</label>
                        <div className="input-group input-group-sm mb-0">
                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({nombre: e.target.value})}  type="text" className="form-control"/>  
                        </div>
                        {/* <label htmlFor="comment">OPCIONES :</label>
                        <div class="form-check-inline">
                          <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="optradio" />titulo 
                          </label>
                        </div>
                        <div class="form-check-inline">
                          <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="optradio" />actividad 
                          </label>
                        </div>
                        <br/> */}
                        <label htmlFor="comment">N° VECES:</label>
                        <div className="input-group input-group-sm mb-0">
                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({veces: e.target.value})}  type="text" className="form-control"/>  
                        </div>

                        <label htmlFor="comment">LARGO:</label>
                        <div className="input-group input-group-sm mb-0">
                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({largo: e.target.value})}  type="text" className="form-control"/>  
                        </div>

                        <label htmlFor="comment">ANCHO:</label>
                        <div className="input-group input-group-sm mb-0">
                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ancho: e.target.value})}  type="text" className="form-control"/>  
                        </div>

                        <label htmlFor="comment">ALTO:</label>
                        <div className="input-group input-group-sm mb-0">
                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({alto: e.target.value})}  type="text" className="form-control"/>  
                        </div>
                        
                        <label htmlFor="comment">METRADO:</label>
                        {/* ESTE ES EL METRADO = parcial */}
                        <div className="input-group input-group-sm mb-0">
                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({parcial: e.target.value})}  type="text" className="form-control"/>  
                        </div>
                        
                        

                    </ModalBody>
                    <ModalFooter className="border border-dark border-top border-right-0 border-bottom-0 border-button-0">
                      <div className="float-left"><Button color="primary" type="submit">Guardar mayor metrado</Button>{' '}</div>
                      <div className="float-right"><Button color="danger" onClick={this.modalMayorMetrado}>Cancelar</Button></div>
                    </ModalFooter>
                    </form>
                </Modal>
                {/* ///<!-- MODAL PARA modalMM --> */}  
        </div>
      );
    }else{
      return <Redirect to='/'/>;
    }
  }
}

export default CorteObra;

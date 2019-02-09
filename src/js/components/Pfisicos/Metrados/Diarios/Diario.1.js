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
        idCom:[],
        descripcion:'',
        value:'',
        IdMetrado:'',
        DescripMetrado:'',
        U_med_temporal:'',
        Precio_unitario:'',
        Saldo_metrado:'',
        idComp:'',
        porcentaje:'',
        avance_metrado:'',
        metrado_temporal:'',
        index:'',
        parcial_temporal:'',
        modal: false,
        show: true,
        MetradosFiltrados:[],
        activeTab: '0',
        tooltipOpen: false
      };
      
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.CapturarID = this.CapturarID.bind(this);
        this.quitarCommas = this.quitarCommas.bind(this);
        this.ControlAcceso = this.ControlAcceso.bind(this);
        this.toggle = this.toggle.bind(this);
        this.Tabs = this.Tabs.bind(this);
        this.tooltip = this.tooltip.bind(this)
            
    }

    componentWillMount(){
      this.setState({MetradosFiltrados: this.state.idCom})
    }

    componentDidMount(){
      axios.get(UrlServer+'/metrados/'+sessionStorage.getItem("idobra"))
      .then(res=>{
          // console.log(res);
          var DataError = [];
          if(res.data.code){
            this.setState({
              idCom: DataError
            })
          }else{
            this.setState({
                idCom: res.data
            })
          }
      })
      .catch(err=>{
          console.log(err);
      });
    }

    handleChange(event) {
      this.setState({value: event.target.value});
      // console.log(event.target.value);
    }

    handleChange2(event) {
      this.setState({descripcion: event.target.value});
      // console.log(event.target.value);
    }

    CapturarID(data, NombComp, unidad_med, P_unit, saldo_metrado, idcomp, porcentaje, avance_metrado, metrado_temporal, index, parcial_temporal) {        
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
      this.toggle();

      console.log(idcomp, ' > ' ,index);
      
    }

    
    handleSubmit(event) {
      // console.log(this.state.value);
      if((this.state.value)===""){
        alert('Ingrese un metrado');
      }else if((this.quitarCommas(this.state.value)) < 0){
        window.alert('Ingrese un metrado válido');
        event.preventDefault();
        return false;
      }else if((this.quitarCommas(this.state.value)) > (this.quitarCommas(this.state.Saldo_metrado))){
        window.alert('El metrado que esta ingresado ud es : '+this.state.value + ' '+ this.state.U_med_temporal +' ingrese un metrado menor a : '+ this.state.Saldo_metrado+' '+  this.state.U_med_temporal);
        event.preventDefault();
      }else{
        
        if(window.confirm('¿Esta seguro de proceder con el metrado?')){
          axios.post(UrlServer+'/metrados/'+this.state.IdMetrado, {
            valor: this.state.value,
            descripcion: this.state.descripcion
          })
          .then((response)=> {
            // console.log("exito", response.data);

            if(response.data === "INSERTADO"){
              window.alert('EXITO !!! Metrado ingresado al sistema');

            }else{
              window.alert('HUBO PROBLEMAS AL INSERTAR EL METRADO !!!');
            }
            // console.log("exito"+ response.data);
          })
          .catch((error)=>{
            console.log(error);
          });

        
        
          var dataComp =  this.state.idCom;
          var index = this.state.index;      
          var idComp = this.state.idComp;
          var avance_anterior = this.state.avance_metrado;
          var metrado_original = this.state.metrado_temporal;
          var avance_actual = this.state.value;
          var precio_temporal = this.state.Precio_unitario;
          var parcial_temporal = this.state.parcial_temporal; 



          
          avance_anterior = this.quitarCommas(avance_anterior);
          metrado_original = this.quitarCommas(metrado_original);
          avance_actual = this.quitarCommas(avance_actual);
          precio_temporal = this.quitarCommas(precio_temporal);
          parcial_temporal = this.quitarCommas(parcial_temporal);


          var avance_metrado = avance_actual+avance_anterior;
          var nuevoPorcentaje = 100*(avance_metrado)/metrado_original;
          var avance_costo = avance_metrado* precio_temporal;
          var metrados_saldo = metrado_original-avance_metrado;
          var metrados_costo_saldo = parcial_temporal-avance_costo;

          avance_metrado = avance_metrado.toFixed(2);    
          nuevoPorcentaje = nuevoPorcentaje.toFixed(2);    
          avance_costo = avance_costo.toFixed(2);
          metrados_saldo = metrados_saldo.toFixed(2);
          metrados_costo_saldo = metrados_costo_saldo.toFixed(2);

                    
          
          dataComp[idComp].metrados[index].avance_metrado = avance_metrado;
          dataComp[idComp].metrados[index].avance_costo = avance_costo;
          dataComp[idComp].metrados[index].metrados_saldo = metrados_saldo;
          dataComp[idComp].metrados[index].metrados_costo_saldo = metrados_costo_saldo;
          dataComp[idComp].metrados[index].porcentaje = nuevoPorcentaje;
          this.setState({idCom:dataComp});
          this.setState({Saldo_metrado:metrados_saldo});
          this.setState({modal:"modal"});
        

          event.preventDefault();
          this.toggle();
        }
      }         
    }

    quitarCommas(dato) {
      var tempo = dato + " ";
      tempo = tempo.replace(/,/g, "");
      tempo = Number(tempo);        
      return tempo;
    }
    
    toggle() {
      this.setState({
        modal: !this.state.modal
      });
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
    
    tooltip() {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen
      });
      // console.log(this.state.tooltipOpen);
      
    }
  
  render() {
    if(sessionStorage.getItem("idacceso")){ 
      return (
          <div className="">
            {this.state.idCom.length < 1 ? <div className="text-center centraImagen" >  <img src={ Cubito } className="centraImagen" width="30"  alt="logo sigobras" /></div>:
              <div className="card mb-2">
               
                {/* <!-- The Modal --> */}
                
                  <Modal isOpen={this.state.modal} toggle={this.toggle} size="sm"  fade={false}>
                    <ModalHeader toggle={this.toggle}><img src= { LogoSigobras } width="30px" alt="logo sigobras"/> SIGOBRAS S.A.C.</ModalHeader>
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
                {/* ///<!-- The Modal --> */}
                      
              
            
                <Nav tabs>
                  {this.state.idCom.map((comp,indexComp)=>
                    <NavItem key={ indexComp }>
                      <NavLink className={classnames({ active: this.state.activeTab === indexComp.toString() })} onClick={() => { this.Tabs(indexComp.toString()); }}>
                        COMP {comp.num_componentes}
                      </NavLink>
                    </NavItem>
                  )}
                </Nav>
                
                <TabContent activeTab={this.state.activeTab}>
                  {this.state.idCom.map((comp, indexComp)=>

                    <TabPane tabId={indexComp.toString()} key={ indexComp}  className="p-3">
                      <Row>
                        <Col sm="12">
                          <Card>
                            <CardHeader>{comp.nomb_componentes }</CardHeader>
                            <CardBody className="p-0">                              
                                <ReactTable
                                  data={comp.metrados}
                                  filterable
                                  defaultFilterMethod={(filter, row) =>
                                      String(row[filter.id]) === filter.value}
                                  columns={[
                                      {
                                      Header: "Descripción",
                                      columns: [
                                          {
                                          Header: "ITEM",
                                          accessor: "item_temporal",
                                          maxWidth: 100,
                                          filterMethod: (filter, row) =>
                                              row[filter.id].startsWith(filter.value) &&
                                              row[filter.id].endsWith(filter.value)
                                          },
                                          {
                                          Header: "DESCRIPCION",
                                          id: "decrip_temporal",
                                          width: 438,
                                          accessor: d => d.decrip_temporal,
                                          filterMethod: (filter, rows) =>
                                              matchSorter(rows, filter.value, { keys: ["decrip_temporal"] }),
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
                                              className={(row.original.u_med_temporal === "" ? 'd-none' :'')}
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
                                          id: "metrado_temporal",
                                          maxWidth: 100,
                                          accessor: d => d.metrado_temporal +' '+ d.u_med_temporal,
                                          filterMethod: (filter, rows) =>
                                              matchSorter(rows, filter.value, { keys: ["metrado_temporal"] }),
                                          filterAll: true
                                          }
                                      ]
                                      },
                                      {
                                      Header: "Costos",
                                      columns: [
                                          {
                                          Header: "P/U S/.",
                                          id: "precio_temporal",
                                          maxWidth: 100,
                                          accessor: d => d.precio_temporal,
                                          filterMethod: (filter, rows) =>
                                              matchSorter(rows, filter.value, { keys: ["precio_temporal"] }),
                                          filterAll: true
                                          },
                                          {
                                          Header: "P/P S/.",
                                          id: "parcial_temporal",
                                          maxWidth: 100,
                                          accessor: d => d.parcial_temporal,
                                          filterMethod: (filter, rows) =>
                                              matchSorter(rows, filter.value, { keys: ["parcial_temporal"] }),
                                          filterAll: true
                                          },
                                          {
                                          Header: "Metrar",
                                          accessor: "_id",
                                          maxWidth: 50,
                                          Cell: id => (
                                            <div className={(id.original.u_med_temporal === "" ? 'd-none' : this.ControlAcceso())}>
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
    }else{
        return <Redirect to='' />;
    }
  }
}



export default MDdiario;

import React, { Component } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

import { UrlServer } from '../../../../Utils/ServerUrlConfig';
import { Card, CardHeader, CardBody, InputGroup, Collapse, InputGroupButtonDropdown, Input, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class LibrarySigobras extends Component {
  constructor(){
    super()
    this.state = {
      DataMDiario:[],

      dropdownOpen: false,
      splitButtonOpen: false,
      collapse: 2599,
    }

    this.Filtrador = this.Filtrador.bind(this)
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.CollapseItem = this.CollapseItem.bind(this);
    
  }


  componentWillMount(){
    axios.post(`${UrlServer}/getComponentes`,{
        id_ficha: sessionStorage.getItem('idobra')
    })
    .then((res)=>{
        console.log('res>>', res.data);
        
        this.setState({
          DataMDiario:res.data[0].partidas
        })
    })
    .catch((error)=>{
      toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.',{ position: "top-right",autoClose: 5000 });
      
        // console.error('algo salio mal verifique el',error);
        
    })
  }


  CollapseItem(valor){
    let event = valor
    console.log(valor);
    
    
    this.setState({ 
      collapse: this.state.collapse === Number(event) ? 0 : Number(event),
    });
  }

  Filtrador() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("InputMetradosDiarios");
    filter = input.value.toUpperCase();

    table = document.getElementById("TblMetradosDiarios");
    tr = table.getElementsByTagName("tr");

    console.log('tr', tr)


    for (i = 0; i < tr.length; i++) {

      td = tr[i].getElementsByTagName("td")[1];

      console.log('td', td)

      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }


  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleSplit() {
    this.setState({
      splitButtonOpen: !this.state.splitButtonOpen
    });
  }

  render() {
    const { DataMDiario, collapse, indexCollapse } = this.state
    return (
      <div className="table-area">
          <Card>
            <CardHeader>
              NOMBRE DEL COMPONENTE
              <div className="float-right">
                {/* <input type="text" id="InputMetradosDiarios" onKeyUp={ this.Filtrador } placeholder="Buscar Partida"  className="form-control form-control-sm"/> */}
                <InputGroup >
                  <Input placeholder="Buscar partida" bsSize="sm" id="InputMetradosDiarios" onKeyUp={ this.Filtrador }/>
                  <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} >
                    <DropdownToggle caret >
                      % Avance
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem >Todo</DropdownItem>
                      <DropdownItem >0%</DropdownItem>
                      <DropdownItem>100%</DropdownItem>
                      <DropdownItem>Progreso</DropdownItem>
                    </DropdownMenu>
                  </InputGroupButtonDropdown>
                </InputGroup>

              </div>
            </CardHeader> 
            <CardBody>
              <table id="TblMetradosDiarios" className=" table table-sm">
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>DESCRIPCION</th>
                    <th>METRADO</th>
                    <th>P / U S/.</th>
                    <th>P / P S/.</th>
                    <th width="15%">BARRA DE AVANCE</th>
                  </tr>
                </thead>
                {
                  DataMDiario.map((metrados, i) =>
                    <tbody key={ i } >
                
                      <tr className={ collapse === i? "resplandPartida": ""  }>
                        <td className= { collapse === i? "tdData1": "tdData"}  onClick={()=> this.CollapseItem(i)} data-event={i} >{ metrados.item }</td>
                        <td>{ metrados.descripcion }</td>
                        <td>{ metrados.metrado }{ metrados.unidad_medida} </td>
                        <td>{ metrados.costo_unitario }</td>
                        <td>{ metrados.avance_costo }</td>
                        <td className="small border border-left border-right-0 border-bottom-0 border-top-0" >

                          <div style={{
                              width: '100%',
                              height: '100%',
                            }}
                            // className={(metrados.tipo === "titulo" ? 'd-none' : this.ControlAcceso())}
                            className={(metrados.tipo === "titulo" ? 'd-none' :'')}
                            >

                            <div className="clearfix">
                              <span className="float-left text-warning">A met.{metrados.avance_metrado} { metrados.unidad_medida }</span>
                              <span className="float-right text-warning">S/. {metrados.avance_costo}</span>
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
                                width: `${metrados.porcentaje}%`,
                                height: '100%',
                                background: metrados.porcentaje > 95 ? '#a4fb01'
                                  : metrados.porcentaje > 50 ? '#ffbf00'
                                  :  '#ff2e00',
                                borderRadius: '2px',
                                transition: 'all 2s linear 0s',
                                position: 'absolute',
                                boxShadow: `0 0 6px 1px ${metrados.porcentaje > 95 ? '#a4fb01'
                                  : metrados.porcentaje > 50 ? '#ffbf00'
                                  :  '#ff2e00'}`
                              }}
                            />
                            {/* {console.log('sasa>>',row.row.porcentaje)} */}
                            </div>
                            <div className="clearfix">
                              <span className="float-left text-info">Saldo: {metrados.metrados_saldo}</span>
                              <span className="float-right text-info">S/. {metrados.metrados_costo_saldo}</span>
                            </div>
                          </div>       

                        </td>
                      </tr>
                   
                      <tr className={ collapse === i? "resplandPartida": " d-none"  }>
                        <td colSpan="6">
                          <Collapse isOpen={collapse === i}>
                            {/* <div className="p-1">
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
                                    <th>S/. P / U </th>
                                    <th>S/. P / P</th>
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
                                      <td>{ actividades.metrado_actividad } { actividades.unidad_medida }</td>
                                      <td>{ actividades.actividad_metrados_saldo }</td>
                                      <td> { actividades.costo_unitario }</td>
                                      <td> { actividades.parcial_actividad }</td>
                                      <td>
                                        {Number(actividades.parcial_actividad) <= 0 ?'':
                                          actividades.actividad_tipo === "titulo"?"":
                                          <div style={{
                                              width: '100%',
                                              height: '100%',
                                            }}
                                            >
                                              <div className="clearfix">
                                                <span className="float-left text-warning">A met. {actividades.actividad_avance_metrado}{actividades.unidad_medida}</span>
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
                                            { actividades.actividad_metrados_saldo === '0.00' ? <FaCheck className="text-success" size={ 18 } /> : 
                                              <button className="btn btn-sm btn-outline-dark text-primary" onClick={(e)=>this.CapturarID(actividades.id_actividad, actividades.nombre_actividad, actividades.unidad_medida, actividades.costo_unitario, actividades.actividad_metrados_saldo, indexComp, actividades.actividad_porcentaje, actividades.actividad_avance_metrado, actividades.metrado_actividad, row.index, actividades.parcial_actividad, row.original.descripcion, row.original.metrado, row.original.parcial)} >
                                                <FaPlus /> 
                                              </button>
                                            }
                                          </div>
                                          }
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div> */}
                          </Collapse>
                        </td>
                      </tr>
                    </tbody>
                  ) 
                }   
              </table>
            </CardBody>
          </Card>

          

          
      </div>
    );
  }
}

export default LibrarySigobras;
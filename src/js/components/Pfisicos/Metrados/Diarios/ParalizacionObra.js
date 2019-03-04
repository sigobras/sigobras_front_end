import React, { Component } from 'react';
import axios from 'axios';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { MdFlashOn, MdReportProblem } from 'react-icons/md';

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Tooltip , CardText, Row, Col,  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';

import ReactTable from "react-table";
import matchSorter from 'match-sorter'

import { UrlServer } from '../../../Utils/ServerUrlConfig';


class ParalizacionObra extends Component {
  constructor(){
    super();

    this.state = {
      DataMDiario:[],
      activeTab:'0',
    }
    this.Tabs = this.Tabs.bind(this)
    this.ControlAcceso = this.ControlAcceso.bind(this)
  }

  componentWillMount(){
    document.title ="Obra paralizada 🎈"
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

  render() {
    var { DataMDiario } = this.state
    if(sessionStorage.getItem("idacceso") !== null){ 
      return (
        <div className="pb-3">
          <Card>
            <Nav tabs>
              {DataMDiario === undefined ? 'cargando': DataMDiario.map((comp,indexComp)=>
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
                                              backgroundColor: rowPor.value > 95 ? 'rgb(164, 251, 1)'
                                                : rowPor.value > 50 ? '#ffbf00'
                                                :  '#ff2e00',
                                              borderRadius: '2px',
                                              transition: 'all .9s ease-in',
                                              position: 'absolute',
                                              boxShadow: `0 0 6px 1px ${rowPor.value > 95 ? 'rgb(164, 251, 1)'
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
                                        Header: "",
                                        accessor: "id_actividad",
                                        width: 40,
                                        className: "text-center",
                                        Cell: id => (
                                          <div className={(id.original.id_actividad === "" ? 'd-none' : this.ControlAcceso())}>
                                            {id.original.actividad_metrados_saldo === '0.00' 
                                            ? 
                                                <FaCheck className="text-success" size={ 18 } /> 
                                            : 
                                                <FaTimes className="text-danger" size={ 18 }/> 
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
        </div>
      );
    }else{
      return window.location.href = '/'
    }
  }
}



export default ParalizacionObra;

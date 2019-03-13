import React, { Component } from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { MdFlashOn, MdReportProblem } from 'react-icons/md';

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';

import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import { toast } from "react-toastify";

import LogoSigobras from '../../../../../../images/logoSigobras.png'
import { UrlServer } from '../../../../Utils/ServerUrlConfig';

class ParalizacionObra extends Component {

    constructor(){
      super();
  
      this.state = {
        DataMDiario:[],
        activeTab:'0',
        modal: false,
        modalMm: false,


  
      }
      this.Tabs = this.Tabs.bind(this)
      this.ControlAcceso = this.ControlAcceso.bind(this)
     
    }
    componentWillMount(){
        document.title ="Metrados Diarios"
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
          toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.',{ position: "top-right",autoClose: 5000 });
          
            // console.error('algo salio mal verifique el',error);
            
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
        var { DataMDiario, debounceTimeout, descripcion, smsValidaMetrado } = this.state

        return (
            <div>
              
                <Card>
                  <Nav tabs>
                    {DataMDiario.length === 0 ? 'cargando': DataMDiario.map((comp,indexComp)=>
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
                                                    { actividades.actividad_metrados_saldo === '0.00' ? <FaCheck className="text-success" size={ 18 } /> : 
                                                      ''
                                                    }
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
            </div>
        );
    }
}

export default ParalizacionObra;

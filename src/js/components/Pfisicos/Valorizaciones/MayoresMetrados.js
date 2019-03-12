import React, { Component } from 'react';
import axios from 'axios';
import { MdMoreVert, MdDone } from "react-icons/md";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Row, Col, UncontrolledPopover, PopoverBody, Spinner} from 'reactstrap';
import classnames from 'classnames';
import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import { UrlServer } from '../../Utils/ServerUrlConfig'

class MayoresMetrados extends Component {
    constructor(){
        super();
        
        this.state = {
            DataValorizacion:[],
            activeTab: '0',
            activeTabComponet: 'resumen',
        }; 

        this.Tabs = this.Tabs.bind(this);
        this.TabsComponent = this.TabsComponent.bind(this);
        this.fitroData = this.fitroData.bind(this)
    } 

    componentWillMount(){

        axios.post(UrlServer+'/getValGeneralMayorMetrado',{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then(res=>{
            // console.log(res.data)
            var DataError = [];
            if(res.data.code){
                this.setState({
                    DataValorizacion: DataError
                })
            }else{
                this.setState({
                    DataValorizacion: res.data
                })
            }
        })
        .catch(err=>{
            console.log('ERROR AL OBTENER LOS DATOS'+ err.res);
            
        });
    }

    Tabs(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    TabsComponent(tab) {
        if (this.state.activeTabComponet !== tab) {
            this.setState({
                activeTabComponet: tab
            });
        }
    }

    fitroData(e, valor_total_saldo){
        // e.preventDefault()
        // console.log(e.target);
        
        var { DataValorizacion } = this.state

        DataValorizacion = DataValorizacion[0].componentes.filter((Filtrado)=>{
            return(Filtrado.valor_total_saldo === 0)
        })
        console.log(DataValorizacion)

    }
  render() {
    const { activeTab, activeTabComponet, DataValorizacion} = this.state
    return (
      <div>
        <CardBody>
          {DataValorizacion.length <= 0 ? <label className="text-center" >  <Spinner color="primary" size="sm" /></label>:
              <Card>
                  <Nav tabs>
                      {/* PERIODOS */}
                      { DataValorizacion.map((valorizacion, indexVal)=>
                          <NavItem key= { indexVal }>
                              <NavLink className={classnames({ active: activeTab === indexVal.toString() })} onClick={() => { this.Tabs(indexVal.toString()); }} >
                                  {valorizacion.numero_periodo}
                              </NavLink>
                          </NavItem>
                      )}

                  </Nav>


                  <TabContent activeTab={activeTab}>
                      { DataValorizacion.map((valorizacion, indexVal)=>

                          <TabPane tabId={indexVal.toString()} className="p-1" key={ indexVal }>
                              <Card>
                                  <Nav tabs>
                                      {/* RESUMEN */}
                                      <NavItem>
                                          <NavLink className={classnames({ active: activeTabComponet === `resumen` })} onClick={() => { this.TabsComponent(`resumen`) }} >
                                              RESUMEN
                                          </NavLink>
                                      </NavItem>
                                      
                                      {/* COMPONENTES */}
                                      {valorizacion.componentes.map((comp, indexcomp)=>
                                          <NavItem key={ indexcomp }>
                                              <NavLink className={classnames({ active: activeTabComponet === indexcomp.toString() })} onClick={() => { this.TabsComponent(indexcomp.toString()); }}>
                                                  C -{comp.componente_numero}
                                              </NavLink>
                                          </NavItem>
                                      )}
                                  </Nav>

                                  <TabContent activeTab={activeTabComponet}>
                                      <TabPane tabId={ `resumen` } className="p-1">
                                          <Card>
                                              <CardHeader>Resumen de componentes</CardHeader>
                                              <CardBody>
                                                <table className="table table-bordered small table-sm">
                                                    <thead>
                                                        {/* {console.log('><<', DataValorizacion[indexVal].resumen)}s */}
                                                        <tr className="text-center">
                                                            <th className="align-middle" rowSpan="3">ITEM</th>
                                                            <th className="align-middle" rowSpan="3">DESCRIPCION PARTIDA</th>
                                                            <th>{ DataValorizacion[indexVal].resumen.avance_actual }</th>
                                                            <th colSpan="2">{ DataValorizacion[indexVal].resumen.avance_anterior }</th>
                                                            <th colSpan="2">{ DataValorizacion[indexVal].resumen.avance_actual }</th>
                                                            <th colSpan="2">{ DataValorizacion[indexVal].resumen.avance_acumulado } </th>
                                                            <th colSpan="2">{ DataValorizacion[indexVal].resumen.saldo }</th>
                                                        </tr>
                                                        <tr className="text-center">
                                                            <td>MONTO ACT.</td>
                                                            <td colSpan="2">AVANCE ANTERIOR</td>
                                                            <td colSpan="2">AVANCE ACTUAL</td>
                                                            <td colSpan="2">AVANCE ACUMULADO</td>
                                                            <td colSpan="2">SALDO</td>
                                                        </tr>
                                                        <tr className="text-center">
                                                            <td>PPTO</td>
                                                            <td>MONTO</td>
                                                            <td>%</td>
                                                            <td>MONTO</td>
                                                            <td>%</td>
                                                            <td>MONTO</td>
                                                            <td>%</td>
                                                            <td>MONTO</td>
                                                            <td>%</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { valorizacion.componentes.map((resumen, IResumen)=>
                                                            <tr key={ IResumen }>
                                                                <td>{ resumen.componente_numero }</td>
                                                                <td>{ resumen.nombre }</td>
                                                                <td>{ resumen.presupuesto }</td>
                                                                <td>{ resumen.valor_total_anterior }</td>
                                                                <td>{ resumen.valor_total_anterior_porcentaje }</td>

                                                                <td>{ resumen.valor_total_actual}</td>
                                                                <td>{ resumen.valor_total_actual_porcentaje}</td>

                                                                <td>{ resumen.valor_suma_acumulado}</td>
                                                                <td>{ resumen.valor_suma_acumulado_porcentaje}</td>

                                                                <td>{ resumen.valor_total_saldo }</td>
                                                                <td>{ resumen.valor_total_saldo_porcentaje }</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                              </CardBody>
                                          </Card>
                                      </TabPane>

                                      {valorizacion.componentes.map((comp, indexcomp)=>
                                          <TabPane tabId={ indexcomp.toString() } className="p-1" key={ indexcomp }>
                                              <Card>
                                                  <CardHeader>{ comp.nombre} 
                                                      <a href="#" className="float-right nav-link p-0 m-0 text-light" id={`filtro${indexVal.toString()}`}><MdMoreVert size={25}/></a>
                                                      <UncontrolledPopover trigger="legacy" placement="bottom" target={`filtro${indexVal.toString()}`}>
                                                          <PopoverBody>
                                                              <label> <a href="#" onClick={ (e)=>this.fitroData(e, comp.valor_total_saldo)}>0% Deductivo</a></label>
                                                              <div className="divider"></div>
                                                              <label>{`0% < 99% En progreso`}</label>
                                                              <div className="divider"></div>
                                                              <label>100% Culminado</label>
                                                              <div className="divider"></div>
                                                              <label>Mayores Metrados</label>
                                                          </PopoverBody>
                                                      </UncontrolledPopover>
                                                  </CardHeader>
                                                  <CardBody>
                                                      <Row>
                                                          <Col sm="12">
                                                              {/* <h4>resumen de componetes { indexVal } -- { indexcomp }</h4> */}
                                                              <ReactTable
                                                                  data={comp.partidas}
                                                                  filterable
                                                                  defaultFilterMethod={(filter, row) =>
                                                                      String(row[filter.id]) === filter.value}
                                                                      
                                                                  columns={[
                                                                      {
                                                                      Header: "DESCRIPCION",
                                                                      columns: [
                                                                          {
                                                                              Header: "ITEM",
                                                                              id: "item",
                                                                              maxWidth: 60,
                                                                              accessor: d => d.item,
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["item"] }),
                                                                              filterAll: true
                                                                          },{
                                                                              Header: "DESCRIPCION",
                                                                              id: "descripcion",
                                                                              width: 338,
                                                                              accessor: d => d.descripcion,
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["descripcion"] }),
                                                                              filterAll: true
                                                                          }
                                                                      ]}, {
                                                                      Header: "PRESUPUESTO",
                                                                      columns: [
                                                                          {
                                                                              Header: "METRADO",
                                                                              id: "metrado",
                                                                              width: 60,                                                                                                
                                                                              accessor: d => d.metrado,
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["metrado"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "P. U. S/.",
                                                                              id: "costo_unitario",
                                                                              width: 70,                                                                                                
                                                                              accessor: d => d.costo_unitario,
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["costo_unitario"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "P. P. S/.",
                                                                              id: "parcial",
                                                                              width: 70,                                                                                                
                                                                              accessor: d => d.parcial,
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["parcial"] }),
                                                                              filterAll: true
                                                                          }
                                                                      ]}, {
                                                                      Header: "ANTERIOR",
                                                                      columns: [
                                                                          {
                                                                              Header: "MET.",
                                                                              id: "metrado_anterior",
                                                                              className: "text-center",
                                                                              accessor: d =>( d.metrado_anterior=== '0.00'? '':  d.metrado_anterior ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["metrado_anterior"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "VAL.",
                                                                              id: "valor_anterior",
                                                                              className: "text-center",
                                                                              accessor: d => ( d.valor_anterior === '0.00'? '':d.valor_anterior),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["valor_anterior"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "%",
                                                                              id: "porcentaje_anterior",
                                                                              width: 50,
                                                                              className: "text-center",
                                                                              accessor: d => ( d.porcentaje_anterior === '0.00' ? '': d.porcentaje_anterior ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["porcentaje_anterior"] }),
                                                                              filterAll: true
                                                                          }
                                                                      ]}, {
                                                                      Header: "ACTUAL",
                                                                      columns: [
                                                                          {
                                                                              Header: "MET.",
                                                                              id: "metrado_actual",
                                                                              className: "text-center",
                                                                              accessor: d => (d.metrado_actual === '0.00'? '' :d.metrado_actual ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["metrado_actual"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "VAL.",
                                                                              id: "valor_actual",
                                                                              className: "text-center",
                                                                              accessor: d => ( d.valor_actual === '0.00'? '': d.valor_actual  ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["valor_actual"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "%",
                                                                              id: "porcentaje_actual",
                                                                              width: 50,
                                                                              className: "text-center",
                                                                              accessor: d => ( d.porcentaje_actual === '0.00' ? '': d.porcentaje_actual ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["porcentaje_actual"] }),
                                                                              filterAll: true
                                                                          }
                                                                      ]}, {
                                                                      Header: "ACUMULADO",
                                                                      columns: [
                                                                          {
                                                                              Header: "MET.",
                                                                              id: "metrado_total",
                                                                              className: "text-center",
                                                                              accessor: d => ( d.metrado_total === '0.00' ? '': d.metrado_total ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["metrado_total"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "VAL.",
                                                                              id: "valor_total",
                                                                              className: "text-center",
                                                                              accessor: d => ( d.valor_total === '0.00' ? '': d.valor_total ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["valor_total"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "%",
                                                                              id: "porcentaje_total",
                                                                              width: 50,
                                                                              accessor: d => ( d.porcentaje_total === '0.00' ? '': d.porcentaje_total ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["porcentaje_total"] }),
                                                                              filterAll: true
                                                                          }
                                                                      ]}, {
                                                                      Header: "SALDO",
                                                                      columns: [
                                                                          {
                                                                              Header: "MET.",
                                                                              id: "metrado_saldo",
                                                                              className: "text-center",
                                                                              accessor: d =>  ( d.metrado_saldo !== '0.00' ? d.metrado_saldo : d.parcial === "" ? '': <MdDone size={20} className="text-success" /> ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["metrado_saldo"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "VAL.",
                                                                              id: "valor_saldo",
                                                                              className: "text-center",
                                                                              accessor: d => ( d.valor_saldo === '0.00' ? '': d.valor_saldo ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["valor_saldo"] }),
                                                                              filterAll: true
                                                                          },
                                                                          {
                                                                              Header: "%",
                                                                              id: "porcentaje_saldo",
                                                                              width: 50,
                                                                              className: "text-center",
                                                                              accessor: d => ( d.porcentaje_saldo === '0.00' ? '': d.parcial === ""?'': d.porcentaje_saldo ),
                                                                              filterMethod: (filter, rows) =>
                                                                                  matchSorter(rows, filter.value, { keys: ["porcentaje_saldo"] }),
                                                                              filterAll: true
                                                                          }
                                                                      ]}
                                                                  ]}
                                                              
                                                                  style={{ height: 500 }}
                                                                  className="-striped -highlight small"
                                                              />
                                                          </Col>
                                                      </Row>
                                                  </CardBody>
                                              </Card>
                                          </TabPane>
                                      )}
                                  </TabContent>
                              </Card>
                          </TabPane>

                      
                      )}
                  </TabContent>
                  
              </Card>
          }
        </CardBody>    
      </div>
    );
  }
}

export default MayoresMetrados;
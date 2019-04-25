import React, { Component } from 'react';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Spinner, Collapse , Button, CardTitle, CardText, Row, Col} from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class MDHistorial extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            DataAniosApi:[],
            DataMesesApi:[],
            DataResumenApi:[],
            DataComponentesApi:[],
            DataFechasApi:[],
            DataPartidas:[],
            DataChartDiasComponente:[],

            activeTabMes: '',
            activeTabComp:"resumen",
            // inputs
            inputAnio:"",
            fecha:"",
            idComponete:null,
            nombreComponente:"",

            collapseDate:null
        };
        this.TabMeses = this.TabMeses.bind(this);
        this.SeleccionaAnio = this.SeleccionaAnio.bind(this);
        this.TabComponentes = this.TabComponentes.bind(this)
        this.collapseFechas = this.collapseFechas.bind(this)
    }
    
    componentWillMount(){
        axios.post(`${UrlServer}/getHistorialAnyos`,{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then((res)=>{
            console.log("response data ", res.data)
            
            var tamanioMeses = res.data[0].meses.length -1 
            
            // console.log("resumen", res.data[0].meses[tamanioMeses].componentes)

            this.setState({
                DataAniosApi:res.data,
                DataMesesApi:res.data[0].meses,
                DataResumenApi:res.data[0].meses[tamanioMeses].resumen,
                DataComponentesApi:res.data[0].meses[tamanioMeses].componentes,
                activeTabMes: tamanioMeses.toString(),
                inputAnio:res.data[0].anyo,
                fecha:res.data[0].meses[tamanioMeses].fecha
            })
        })
        .catch((err)=>{
            console.log("errores al conectar el api", err)
        })
    }

    SeleccionaAnio(e){
        //   llamamos el api de meses5

        axios.post(`${UrlServer}/getHistorialMeses`,{
            id_ficha: sessionStorage.getItem('idobra'),
            anyo: e.target.value
        })
        .then((res)=>{
            console.log("response data meses ", res.data)
            
        })
        .catch((err)=>{
            console.log("errores al conectar el api", err)
        })

    }

    TabMeses(tab, fecha) {
        if (this.state.activeTabMes !== tab) {
          this.setState({
            activeTabMes: tab,
            fecha:fecha
          });

           
            if(this.state.activeTabComp === "resumen"){
                //   carga resumen de componentes

                axios.post(`${UrlServer}/getHistorialResumen`,{
                    id_ficha: sessionStorage.getItem('idobra'),
                    fecha: fecha
                })
                .then((res)=>{
                    console.log("response data Componentes ", res.data)
                    this.setState({
                        DataResumenApi:res.data,
                        fecha:fecha
                    })
                    
                })
                .catch((err)=>{
                    console.log("errores al conectar el api", err)
                })

                return
            }
            
            //   cargamos datos de componentes
            axios.post(`${UrlServer}/getHistorialComponentes`,{
                id_ficha: sessionStorage.getItem('idobra'),
                fecha: fecha
            })
            .then((res)=>{
                console.log("response data Componentes ", res.data)
                this.setState({
                    DataComponentesApi:res.data
                })
                
            })
            .catch((err)=>{
                console.log("errores al conectar el api", err)
            })
        }

    }

    TabComponentes(tab , idComp, nombreComp){
        console.log("fecha", this.state.fecha)

        if (this.state.activeTabComp !== tab) {
            this.setState({
              activeTabComp: tab
            });

            if(tab === "resumen"){
                axios.post(`${UrlServer}/getHistorialResumen`,{
                    id_ficha: sessionStorage.getItem('idobra'),
                    fecha: this.state.fecha
                })
                .then((res)=>{
                    console.log("response data resumen ", res.data)
                    this.setState({
                        DataResumenApi:res.data
                    })
                    
                })
                .catch((err)=>{
                    console.log("errores al conectar el api", err)
                })

                return
            }


            axios.post(`${UrlServer}/getHistorialFechas`,{
                id_componente: idComp,
                fecha: this.state.fecha
            })
            .then((res)=>{
                console.log("response data Componentes ", res.data)
                this.setState({
                    DataFechasApi:res.data,
                    idComponete:idComp,
                    nombreComponente:nombreComp
                })
                
            })
            .catch((err)=>{
                console.log("errores al conectar el api", err)
            })

            // HISTORIAL DE DIAS PARTIDAS CHART----------------------------
            axios.post(`${UrlServer}/getHistorialComponenteChart`,{
                id_componente: idComp,
                fecha: this.state.fecha
            })
            .then((res)=>{
                console.log("response data DIAS CHART ", res.data)
                this.setState({
                    DataChartDiasComponente:res.data,
                    // nombreComponente:nombreComp
                })
                
            })
            .catch((err)=>{
                console.log("errores al conectar el api", err)
            })
            
        }
    }

    collapseFechas(e, fecha){
        let event = Number(e);
        if (event !== this.state.collapseDate) {
            this.setState({ collapseDate:  event });
            // HISTORIAL DE DIAS PARTIDAS-------------------------------
            axios.post(`${UrlServer}/getHistorialDias`,{
                id_componente: this.state.idComponete,
                fecha: fecha
            })
            .then((res)=>{
                console.log("response data PARTIDAS ", res.data)
                this.setState({
                    DataPartidas:res.data,
                    // nombreComponente:nombreComp
                })
                
            })
            .catch((err)=>{
                console.log("errores al conectar el api", err)
            })


           
        }
        
    }

    render() {
        const {  DataAniosApi, DataMesesApi, DataResumenApi, DataComponentesApi, inputAnio, nombreComponente, DataFechasApi, collapseDate, DataPartidas, DataChartDiasComponente } = this.state

        const options = {
            chart: {
                type: 'area'
            },
            title: {
                text: 'RESUMEN ESTADISTICO DE VALORIZACIÓN DIARIA'
            },
            subtitle: {
                text: 'General'
            },
            xAxis: {
                categories: DataResumenApi.categories ,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Soles'
                },
                labels: {
                    formatter: function () {
                        return this.value / 1000;
                    }
                }
            },
            tooltip: {
                split: true, 
                valueSuffix: ' Soles'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: DataResumenApi.series
        }
        const Partidas = {
            chart: {
                type: 'area'
            },
            title: {
                text: 'VALORIZACIÓN DIARIA POR COMPONENTE'
            },
            subtitle: {
                text: 'Componente'
            },
            xAxis: {
                categories: DataChartDiasComponente.categories ,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Soles'
                },
                labels: {
                    formatter: function () {
                        return this.value / 1000;
                    }
                }
            },
            tooltip: {
                split: true, 
                valueSuffix: ' Soles'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: DataChartDiasComponente.series
        }
    
        return(
            <div>
                <Nav tabs>
                    <NavItem>
                        <select className="form-control form-control-sm" onChange={ this.SeleccionaAnio}>
                            {
                                DataAniosApi.map((anio, indexA)=>
                                    <option key={ indexA } value={ anio.anyo } >{ anio.anyo }</option>
                                )
                            }
                        </select>
                    </NavItem> 
                    
                    {
                        DataMesesApi.map((mes, indexM)=>
                            <NavItem key={ indexM }>
                                <NavLink className={classnames({ active: this.state.activeTabMes === indexM.toString() })} onClick={() => { this.TabMeses(indexM.toString(), mes.fecha ); }}>
                                    { mes.mes } 
                                </NavLink>
                            </NavItem>
                        )
                    }
                    


                </Nav>


                <Nav tabs>
                    
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTabComp === 'resumen' })} onClick={() => { this.TabComponentes('resumen', "","") }}>
                            RESUMEN
                        </NavLink>
                    </NavItem>
                    {
                        DataComponentesApi.map((comp, indecC)=>
                            <NavItem key={ indecC }>
                                <NavLink className={classnames({ active: this.state.activeTabComp === indecC.toString() })} onClick={() => { this.TabComponentes(indecC.toString(), comp.id_componente, comp.nombre_componente  ); }}>
                                    C-{ comp.numero }
                                </NavLink>
                            </NavItem>
                        )
                    }

                </Nav>


                
                    <CardBody className="p-2">
                        {
                            this.state.activeTabComp === "resumen"
                            ?
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    // constructorType={'stockChart'}
                                    options={options}
                                />
                            :   
                                <Card>
                                    <CardHeader> {nombreComponente}</CardHeader>
                                    <CardBody className="p-2">
                                        <Row>
                                            <Col>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                // constructorType={'stockChart'}
                                                options={Partidas}
                                            />
                                            
                                            </Col>
                                            <Col>
                                            {
                                                DataFechasApi.map((fecha, indexF)=>
                                                    <fieldset key={ indexF } className="mt-2">
                                                        <legend className="prioridad" onClick={()=> this.collapseFechas(indexF, fecha.fecha)} >  <b>FECHA: </b>{ fecha.fecha_larga}  - <b> S/.</b> { fecha.fecha_total_soles }  - <b> { fecha.fecha_total_porcentaje} %</b></legend>
                                                        <Collapse isOpen={collapseDate === indexF}>
                                                            <div className="table-responsive"> 
                                                                <table className="table table-sm small">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>ITEM</th>
                                                                            <th>DESCRIPCIÓN</th>
                                                                            <th>ACTIVIDAD </th>
                                                                            <th>DESCRIPCIÓN</th>
                                                                            <th>OBSERVACIÓN</th>
                                                                            <th>A. FISICO</th>
                                                                            <th>C. U.</th>
                                                                            <th>C. P.</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {DataPartidas.map((hist, indexHist)=>
                                                                            <tr key={ indexHist }>
                                                                                <td>{ hist.item }</td>
                                                                                <td>{ hist.descripcion_partida }</td>
                                                                                <td>{ hist.nombre_actividad }</td>
                                                                                <td>{ hist.descripcion_actividad }</td>
                                                                                <td>{ hist.observacion }</td>
                                                                                <td>{ hist.valor } { hist.unidad_medida}</td>
                                                                                <td>{ hist.costo_unitario }</td>
                                                                                <td>{ hist.parcial }</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>  
                                                        </Collapse> 
                                                    </fieldset>
                                                )
                                            }
                                                

                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>   
                        }
                      
                    </CardBody>
               
            </div>
        )
  }
}

export default MDHistorial;
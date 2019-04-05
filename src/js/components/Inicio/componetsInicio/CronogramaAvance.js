import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios'
import { toast } from "react-toastify";
import { Button,  InputGroup, InputGroupAddon, InputGroupText, Input, Row, Col  } from 'reactstrap';

import { UrlServer } from '../../Utils/ServerUrlConfig'
import { ConvertFormatStringNumber, convertirFechaLetra, FechaActual } from '../../Utils/Funciones'


class CronogramaAvance extends Component{
	constructor(props){
    super(props);
    this.state={
      Column:[],
      DataCronoArmadoEnviar:[],
      DataCronoProgramadoApi:[],
      fechaActualApi:"",
      fecha_desde:'',
      fecha_hasta:'',
      ResultResta:"",
      fechaLimiteAnioMes:"",
      avanceAcumulado:"",

    };
    
    this.GeneraFechasSegunOrden = this.GeneraFechasSegunOrden.bind(this);
    this.capturaInputsProgramado = this.capturaInputsProgramado.bind(this);
    this.enviarDatosApi = this.enviarDatosApi.bind(this);
    this.capturaInputsFinanciero = this.capturaInputsFinanciero.bind(this);
    this.eliminarMes = this.eliminarMes.bind(this);
  }
  
  componentWillMount(){
    axios.post(`${UrlServer}/getcronogramaInicio`,
        {
          "id_ficha":this.props.fichaId
        }
      )
      .then((res)=>{
        console.log("res programado", res.data);


        var Inputs = []

        res.data.data.forEach((alfo, i)=>
            Inputs.push(
              [
                this.props.fichaId,
                alfo.fecha,
                ConvertFormatStringNumber(alfo.programado_monto),
                ConvertFormatStringNumber(alfo.financiero_monto),                
              ]
            )
        )

        // console.log("Inputs", Inputs)
        this.setState({
          fechaActualApi:res.data.fechaActual,
          fecha_desde:res.data.fecha_final,
          DataCronoProgramadoApi:res.data.data,
          EnviarDatos:Inputs,
          fechaLimiteAnioMes: res.data.fecha_final.slice(0, 7),
          avanceAcumulado:ConvertFormatStringNumber(res.data.avance_Acumulado)
          
        })
      })
      .catch((err)=>{
        console.error("error al obtener datos del api", err);
        
      })
  }


  
  GeneraFechasSegunOrden(){
    // console.log('desde',this.state.fecha_desde)
    // console.log('hasta',this.state.fecha_hasta)

    var fechaInicio = new Date(this.state.fecha_desde);
    var fechaFin = new Date(this.state.fecha_hasta);
    

    // var Fechas = this.state.DataCronoProgramadoApi
    
    var Fechas =[]

    while(fechaFin.getTime() >= fechaInicio.getTime()){
        fechaInicio.setDate(fechaInicio.getDate() + 1);

        var ultimoDiaMes = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0);
        ultimoDiaMes =  ultimoDiaMes.getDate()
        // console.log(fechaInicio.getFullYear() + '-' + (fechaInicio.getMonth() + 1) + '-' + fechaInicio.getDate());

        var anio = fechaInicio.getFullYear()
        var mes =  (fechaInicio.getMonth() + 1)
        if(mes <=9){
          mes = "0"+mes
        }
        if(ultimoDiaMes <= 9){
          ultimoDiaMes= "0"+ultimoDiaMes
        }

        var formatearFecha =  anio+'-'+mes+'-'+ultimoDiaMes
        // console.log('fecha formateada', formatearFecha)

        var FechaEnviar = fechaInicio.getFullYear()+ '-'+ (fechaInicio.getMonth() + 1) + '-' +  ultimoDiaMes
        var FechaMostrar = convertirFechaLetra(formatearFecha)
        
        // console.log("imprimimos fecha", FechaMostrar)
        Fechas.push({
          periodo: FechaMostrar,
          fecha: FechaEnviar,
          fichas_id_ficha: this.props.fichaId,
          financiero_monto: "",
          fisico_dinero: 0,
          programado_monto: 0
        })
    }
    // console.log('Fechas', Fechas)


    // agrupo los datos por dia
    const DataAgrupado = this.state.DataCronoProgramadoApi

    var EnviarDatosActualizar = this.state.EnviarDatos
    Fechas.forEach(anioMes => {

      if (!DataAgrupado.find(ger => ger.periodo == anioMes.periodo )) {
          const { periodo, fecha, fichas_id_ficha, financiero_monto, fisico_dinero, programado_monto } = anioMes;

          DataAgrupado.push({ periodo, fecha, fichas_id_ficha, financiero_monto, fisico_dinero, programado_monto});
          // push a enviar datos para armar los inputs para armar el envio al api
          EnviarDatosActualizar.push(
            [
              this.props.fichaId,
              fecha,
              0,
              0
            ]
          )
      }
      
      
    });
    
    console.log('DataAgrupado', DataAgrupado)
    console.log('EnviarDatosActualizar', EnviarDatosActualizar)

    this.setState({
      EnviarDatos:EnviarDatosActualizar,
    })
  }

  capturaInputsProgramado(e, i){
    // console.log('value', e.target.value, "index", i)

    var convertString =  e.target.value
    var numero = ConvertFormatStringNumber(convertString);
    var avanceAcumulado = this.state.avanceAcumulado

    console.log("avanceAcumulado>>>", avanceAcumulado)
    this.state.EnviarDatos[i].splice(2, 1, numero);

    var SumaInputs = []
    this.state.EnviarDatos.forEach((data)=>
      SumaInputs.push( data[2] )
    )

    
    var total = SumaInputs.reduce(((a, b)=>{ return a + b; }));
    var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
    console.log("total", costoDirecto)
    
    costoDirecto = costoDirecto - avanceAcumulado

    var saldoTotalCostoDirecto = costoDirecto - total
  

    console.log('ResultResta',this.state.ResultResta)

    this.setState({
      ResultResta:saldoTotalCostoDirecto.toLocaleString("es-PE")
    })

    console.log('resultado',this.state.EnviarDatos)
  }

  capturaInputsFinanciero(e, i){
    // console.log('value', e.target.value, "index", i)

    var convertString =  e.target.value
    var numero = ConvertFormatStringNumber(convertString);
    var avanceAcumulado = this.state.avanceAcumulado

    console.log("avanceAcumulado>>>", avanceAcumulado)
    this.state.EnviarDatos[i].splice(3, 1, numero);

    // var SumaInputs = []
    // this.state.EnviarDatos.forEach((data)=>
    //   SumaInputs.push( data[2] )
    // )

    
    // var total = SumaInputs.reduce(((a, b)=>{ return a + b; }));
    // var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
    // console.log("total", costoDirecto)
    
    // costoDirecto = costoDirecto - avanceAcumulado

    // var saldoTotalCostoDirecto = costoDirecto - total
  

    // console.log('ResultResta',this.state.ResultResta)

    // this.setState({
    //   ResultResta:saldoTotalCostoDirecto.toLocaleString("es-PE")
    // })

    console.log('financiero',this.state.EnviarDatos)
  }


  enviarDatosApi(){
    // console.log(this.state.DataCronoArmadoEnviar)
    if(confirm('¿Estas seguro de envias los datos del cronograma programado al sistema?')){
      axios.post(`${UrlServer}/postcronogramamensual`,
        this.state.EnviarDatos
      )
      .then((res)=>{
        console.log('res', res)
        // console.log('response', res.data.mes.length)
        if( res.status  === 200 ){
          toast.success('El cronograma - programado se ha ingresado.',{ position: "top-right",autoClose: 1000 });
          this.setState(prevState => ({
            modal: !prevState.modal
          }));
        }else{
          toast.error('El cronograma - programado no no ingresado',{ position: "top-right",autoClose: 2000 });
        }

        // alert('enviado al sistema')
      })
      .catch((err)=>{
        // console.log('err', err)
        toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.',{ position: "top-right",autoClose: 5000 });

      })
    }
    
  }


  eliminarMes(){

    var DataEnviarDataCrono = this.state.EnviarDatos
     DataEnviarDataCrono.pop()

    var DataMostrarCrono = this.state.DataCronoProgramadoApi
    DataMostrarCrono.pop()


    console.log( 
      "DataCronoProgramadoApi",DataEnviarDataCrono,
      "EnviarDatos",DataMostrarCrono
    )

    this.setState({
      EnviarDatos:DataEnviarDataCrono,
      DataCronoProgramadoApi:DataMostrarCrono
    })
  }

  render(){
    var TotalCostoDirecto =  ConvertFormatStringNumber(this.props.costoDirecto) - this.state.avanceAcumulado
    var FechaActualS = FechaActual().slice(0, 7)
    const { DataCronoProgramadoApi } = this.state
    var { dataCrono } = this.props
    const options = {
        chart: {
          type: 'line',
          backgroundColor: '#2e3742',
        },

        legend: {
          itemStyle: {
              color: '#E0E0E3'
          },
          itemHoverStyle: {
              color: '#ffffff'
          },
          itemHiddenStyle: {
              color: '#606063'
          }
        },

        title: {
          text: 'CURVA "S"',
          color: '#ffffff'
        },
        subtitle: {
          text: 'GRAFICO DEL PORCENTAJE DE AVANCE PROGRAMADO VS EJECUTADO ACUMULADO'
        },
        xAxis: {
          categories: dataCrono.mes
        },
        yAxis: {
          title: {
            text: 'Porcentaje % '
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: true
          }
        },
        series: [{
          name: 'Avance programado',
          data: dataCrono.porcentaje_programado
        }, {
          name: 'Avance Fisico',
          data: dataCrono.porcentaje_fisico
        },
        {
          name: 'Avance Financiero',
          data: dataCrono.porcentaje_financiero
        }]
    }

    return(
      <div className="card">
          <div className="card-header text-center">
              <h6>Cronograma de avance</h6>        
          </div>
          <div className="card-body">
            <div className="table-responsive">

              <HighchartsReact
                  highcharts={Highcharts}
                  // constructorType={'stockChart'}
                  options={options}
              />

              <Row>
                <Col sm="6">
                  <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">De:</InputGroupAddon>
                    <label className="form-control form-control-sm text-capitalize">{convertirFechaLetra(this.state.fecha_desde)}</label>

                    <InputGroupAddon addonType="prepend">al:</InputGroupAddon>            
                    <Input type="month" min={this.state.fechaLimiteAnioMes} onChange={e=> this.setState({fecha_hasta:e.target.value})} />
                    <Button color="info" onClick={ this.GeneraFechasSegunOrden } >CREAR MESES </Button>
                  </InputGroup>
                </Col>
                <Col sm="1">
                  <label>{ this.state.DataCronoProgramadoApi.length } MESES  </label>
                </Col>
                <Col sm="3">
                  <label>COSTO DIRECTO S/. { TotalCostoDirecto.toLocaleString("es-PE") }</label>
                </Col>
                <Col sm="2">
                  <Button color={ConvertFormatStringNumber(this.state.ResultResta) === 0?"success":"danger"}>
                    {ConvertFormatStringNumber(this.state.ResultResta) === 0?"😊":"😒"}<label>SALDO S/. {this.state.ResultResta }</label>
                  </Button>
                  
                </Col>
              </Row>
          
          

                <table className="table table-sm ">
                  <thead>
                    <tr>
                      <th className="border text-center" colSpan="5">MONTOS VALORIZADOS PROGRAMADOS</th>
                      <th className="border text-center" colSpan="6">MONTOS VALORIZADOS EJECUTADOS</th>
                    </tr>
                  
                  
                    <tr>
                      <th className="border" colSpan="2">Periodo</th>
                      <th className="border" colSpan="3">Programado</th>
                      <th className="border" colSpan="3">Fisico Ejecutado</th>
                      <th className="border" colSpan="3">Financiero Ejecutado</th>
                    </tr>

                    <tr>
                      <th className="border">Nº de informe</th>
                      <th className="border">Mes del informe</th>
                      <th className="border">Monto S/.</th>
                      <th className="border">% Ejecucion programada</th>
                      <th className="border">% Acumulado</th>
                      <th className="border">Monto S/.</th>
                      <th className="border">% Ejecucion programada</th>
                      <th className="border">% Acumulado</th>
                      <th className="border">Monto S/.</th>
                      <th className="border">% Ejecucion programada</th>
                      <th className="border">% Acumulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      DataCronoProgramadoApi === undefined? <tr><td colSpan="11">CARGANDO</td></tr>: 
                      DataCronoProgramadoApi.map((crono, IC)=>
                        <tr key={ IC }>
                          <td className="border">{ IC+1}</td>
                          <td className="border">{ crono.periodo }</td>
                          <td className="border">
                            <InputGroup  size="sm">
                              <Input placeholder={ crono.programado_monto } onBlur={e=>this.capturaInputsProgramado(e, IC)} type="text"/>  
                            </InputGroup>
                          </td>
                          <td className="border">{ crono.programado_acumulado }</td>
                          <td className="border">{ crono.programado_porcentaje }</td>

                          <td className="border">{ crono.fisico_monto }</td>
                          <td className="border">{ crono.fisico_acumulado }</td>
                          <td className="border">{ crono.fisico_porcentaje }</td>
                          <td className="border">
                            {
                              FechaActualS !== crono.fecha.slice(0, 7) 
                              ? 
                              crono.financiero_monto
                              :
                              <InputGroup  size="sm">
                                <Input placeholder={ crono.financiero_monto } onBlur={e=>this.capturaInputsFinanciero(e, IC)} type="text"/>  
                              </InputGroup>
                            }
                          </td>
                          <td className="border">{ crono.programado_acumulado }</td>
                          <td className="border">{ crono.programado_porcentaje }</td>
                        </tr>
                      )
                    
                      
                    }


                    <tr>
                      <td className="border" colSpan="2">Total a la Fecha</td>
                      <td className="border">1235</td>
                      <td className="border">21313</td>
                      <td className="border border-bottom-0"></td>
                      <td className="border">53453453</td>
                      <td className="border">53543</td>
                      <td className="border  border-bottom-0"></td>
                      <td className="border">46456</td>
                      <td className="border">45654654</td>

                      <td className="border  border-bottom-0 border-right-0"></td>
                    </tr>
                  </tbody>
                </table>

                <Button onClick={ this.eliminarMes }>Eliminar Ultimo Mes</Button>
              {/* {ConvertFormatStringNumber(this.state.ResultResta) === 0? */}
              <Button color="success" onClick={this.enviarDatosApi} >Guardar datos</Button>  :"😒"   
              {/* } */}
            </div>

          </div>
      </div>
    )
  }
};    

export default CronogramaAvance;
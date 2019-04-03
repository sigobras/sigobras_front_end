import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Col  } from 'reactstrap';
import { toast } from "react-toastify";
import axios from 'axios'
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import { ConvertFormatStringNumber, convertirFechaLetra } from '../../../Utils/Funciones'

class ModalIngresoCronoProgramado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      Column:[],
      DataCronoArmadoEnviar:[],
      DataCronoProgramadoApi:[],
      fecha_desde:'',
      fecha_hasta:'',
      ResultResta:""
    };
    
    this.ModalIngresoCrono = this.ModalIngresoCrono.bind(this);
    this.GeneraFechasSegunOrden = this.GeneraFechasSegunOrden.bind(this);
    this.capturaInputsProgramado = this.capturaInputsProgramado.bind(this);
    this.enviarDatosApi = this.enviarDatosApi.bind(this);
  }

  ModalIngresoCrono() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    
    if(this.state.modal=== false){
      axios.post(`${UrlServer}/getcronogramadinero`,
        {
          "id_ficha":this.props.ObraId
        }
      )
      .then((res)=>{
        console.log("res programado", res.data);


        var Inputs = []

        res.data.cronogramadinero.forEach((alfo, i)=>
            Inputs.push(
              [
                this.props.ObraId,
                alfo.fecha,
                0
              ]
            )
        )

        console.log("Inputs", Inputs)
        this.setState({
          fecha_desde:res.data.fecha_final,
          DataCronoProgramadoApi:res.data.cronogramadinero,
          EnviarDatos:Inputs,
          
        })
      })
      .catch((err)=>{
        console.error("error al obtener datos del api", err);
        
      })
    }
    
  }


  GeneraFechasSegunOrden(){
    console.log('desde',this.state.fecha_desde)
    // console.log('hasta',this.state.fecha_hasta)

    var fechaInicio = new Date(this.state.fecha_desde);
    var fechaFin = new Date(this.state.fecha_hasta);
    

    var Fechas = this.state.DataCronoProgramadoApi
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

        var formatearFecha =  anio+'-'+mes+'-'+ultimoDiaMes
        // console.log('mes', formatearFecha)

        var FechaEnviar = fechaInicio.getFullYear()+ '-'+ (fechaInicio.getMonth() + 1) + '-' +  ultimoDiaMes
        var FechaMostrar = convertirFechaLetra(formatearFecha)
        
        Fechas.push({
          // FechaEnviar,
          // FechaMostrar,
          // estado:true,




          Anyo_Mes: FechaMostrar,
          fecha: FechaEnviar,
          fichas_id_ficha: this.props.ObraId,
          financiero_dinero: "",
          fisico_dinero: 0,
          programado_dinero: 0









        })
    }

    console.log('fechas', Fechas)

    // agrupo los datos por dia
    const DataAgrupado = []

    Fechas.forEach(anioMes => {
      if (!DataAgrupado.find(ger => ger.Anyo_Mes == anioMes.Anyo_Mes )) {
          const { Anyo_Mes, fecha, fichas_id_ficha, financiero_dinero, fisico_dinero, programado_dinero } = anioMes;
          DataAgrupado.push({ Anyo_Mes, fecha, fichas_id_ficha, financiero_dinero, fisico_dinero, programado_dinero});
      }
    });
    
    // var Inputs = []

    // DataAgrupado.forEach((alfo, i)=>
    //   Inputs.push(
    //     [
    //       this.props.ObraId,
    //       alfo.FechaEnviar,
    //       0
    //     ]
    //   )
    // )

    // console.log('DataAgrupado', DataAgrupado)
    // console.log('Inputs', Inputs)
    this.setState({
      Column:DataAgrupado,
      // EnviarDatos:Inputs
    })
  }

  capturaInputsProgramado(e, i){
    // console.log('value', e.target.value, "index", i)

    var convertString =  e.target.value
    var numero = ConvertFormatStringNumber(convertString);

    this.state.EnviarDatos[i].splice(2, 1, numero);

    // var SumaInputs = []
    // this.state.EnviarDatos.forEach((data)=>
    //   SumaInputs.push( data[2] )
    // )

    // var total = SumaInputs.reduce(((a, b)=>{ return a + b; }));
    // var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
    // var saldoTotalCostoDirecto = costoDirecto - total
  
    // this.setState({
    //   ResultResta:saldoTotalCostoDirecto.toLocaleString("es-PE")
    // })

    console.log('resultado',this.state.EnviarDatos)
  }


  enviarDatosApi(){
    // console.log(this.state.DataCronoArmadoEnviar)
    if(confirm('¿Estas seguro de envias los datos del cronograma programado al sistema?')){
      axios.post(`${UrlServer}/postcronogramamensual`,
        this.state.EnviarDatos
      )
      .then((res)=>{
        console.log('res', res)
        console.log('response', res.data.mes.length)
        if(res.data.mes.length > 0 && res.status === 200 ){
          toast.success('Tu cronograma Programado se ha ingresado.',{ position: "top-right",autoClose: 1000 });
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

  render() {
    const { Column, DataCronoProgramadoApi } = this.state
    return (
      <div>
        <Button color="primary" onClick={this.ModalIngresoCrono}>+ PROGRAMADO</Button>

        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalIngresoCrono} size="xl" backdrop="static">
          <ModalHeader toggle={this.ModalIngresoCrono}>INGRESO DE CRONOGRAMA PROGRAMADO</ModalHeader>
          <ModalBody>

          <Row>
            <Col sm="6">
              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">De:</InputGroupAddon>
                <label className="form-control form-control-sm text-capitalize">{convertirFechaLetra(this.state.fecha_desde)}</label>

                <InputGroupAddon addonType="prepend">al:</InputGroupAddon>            
                <Input type="month" min="2019-12" onChange={e=> this.setState({fecha_hasta:e.target.value})} />
                <Button color="info" onClick={this.GeneraFechasSegunOrden} >CREAR MESES</Button>
              </InputGroup>
            </Col>
            <Col sm="1">
              <label>{ this.state.DataCronoProgramadoApi.length } MESES  </label>
            </Col>
            <Col sm="3">
              <label>COSTO DIRECTO S/. {this.props.costoDirecto }</label>
            </Col>
            <Col sm="2">
              <Button color={ConvertFormatStringNumber(this.state.ResultResta) === 0?"success":"danger"}>
              {ConvertFormatStringNumber(this.state.ResultResta) === 0?"😊":"😒"}<label>SALDO S/. {this.state.ResultResta }</label>
              </Button>
              
            </Col>
          </Row>

            
            
            <div className="table-responsive">
              <table className="table table-sm">
                <thead> 
                  <tr>
                    <th></th>
                    <th>INICIO</th>
                    {DataCronoProgramadoApi.map((col, i)=>
                      <th key={ i }> 
                        <label className="text-capitalize">{col.Anyo_Mes} </label> 
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody> 
                  <tr>
                    <th>PROGRAMADO</th>
                    <td>0</td>
                    {DataCronoProgramadoApi.map((col, i)=>
                      <td key={ i } style={{minWidth: '100px', display: 'inlineBlock'}}>
                        <InputGroup  size="sm">
                          <Input placeholder={ col.programado_dinero } onBlur={e=>this.capturaInputsProgramado(e, i)} type="text"/>  
                        </InputGroup>
                      </td>                  

                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            {/* <button onClick={this.GenerarColTable }>mas</button> */}
          </ModalBody>
          <ModalFooter>
          {ConvertFormatStringNumber(this.state.ResultResta) === 0?
            <Button color="success" onClick={this.enviarDatosApi} >Guardar datos</Button>  :"😒"   
          }
            {' '}  <Button color="secondary" onClick={this.ModalIngresoCrono}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalIngresoCronoProgramado;
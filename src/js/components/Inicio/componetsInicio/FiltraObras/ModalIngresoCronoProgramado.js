import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Col  } from 'reactstrap';
import { toast } from "react-toastify";
import axios from 'axios'
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import { ConvertFormatStringNumber } from '../../../Utils/Funciones'

class ModalIngresoCronoProgramado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      Column:[],
      DataCronoArmadoEnviar:[],
      fecha_desde:'',
      fecha_hasta:'',
      ResultResta:-1
    };
    
    this.ModalIngresoCrono = this.ModalIngresoCrono.bind(this);
    this.GenerarColTable = this.GenerarColTable.bind(this);
    this.GeneraFechasSegunOrden = this.GeneraFechasSegunOrden.bind(this);
    this.capturaInputsProgramado = this.capturaInputsProgramado.bind(this);
    this.enviarDatosApi = this.enviarDatosApi.bind(this);
  }

  ModalIngresoCrono() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  GenerarColTable(){
    var Column = this.state.Column

    Column.push({
      fecha:'mas'
    })
    
    console.log('colum', Column);
    
    this.setState({
      Column
    })
    console.log('state', this.state.Column)
  }

  GeneraFechasSegunOrden(){
    // console.log('desde',this.state.fecha_desde)
    // console.log('hasta',this.state.fecha_hasta)

    var fechaInicio = new Date(this.state.fecha_desde);
    var fechaFin = new Date(this.state.fecha_hasta);
    const config = { year: 'numeric', month: 'short'};

    var Fechas = []

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
        var FechaMostar = new Date(formatearFecha).toLocaleDateString('ES', config)

        // console.log('fecha date', FechaMostar)
        
        Fechas.push({
          FechaEnviar,
          FechaMostar,
          estado:true
        })
    }

    // console.log('fechas', Fechas)

    // agrupo los datos por dia
    const DataAgrupado = []

    Fechas.forEach(anioMes => {
      if (!DataAgrupado.find(ger => ger.FechaMostar == anioMes.FechaMostar )) {
          const { FechaMostar, FechaEnviar, estado } = anioMes;
          DataAgrupado.push({ FechaMostar, FechaEnviar, estado });
      }
    });
    
    var Inputs = []

    DataAgrupado.forEach((alfo, i)=>
      Inputs.push(
        [
          this.props.ObraId,
          alfo.FechaEnviar,
          0
        ]
      )
    )

    // console.log('DataAgrupado', DataAgrupado)
    // console.log('Inputs', Inputs)
    this.setState({
      Column:DataAgrupado,
      EnviarDatos:Inputs
    })

  }

  capturaInputsProgramado(e,i){
    // console.log('value', e.target.value, "index", i)

    var convertString =  e.target.value
    var numero = ConvertFormatStringNumber(convertString);

    this.state.EnviarDatos[i].splice(2, 1, numero);

    var SumaInputs = []
    this.state.EnviarDatos.forEach((data)=>
      SumaInputs.push( data[2] )
    )

    var total = SumaInputs.reduce(((a, b)=>{ return a + b; }));
    var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
    var saldoTotalCostoDirecto = costoDirecto - total
  
    this.setState({
      ResultResta:saldoTotalCostoDirecto.toLocaleString("es-PE")
    })

    // console.log('resultado',this.state.EnviarDatos)
  }


  enviarDatosApi(){
    // console.log(this.state.DataCronoArmadoEnviar)
    if(confirm('¿Estas seguro de envias los datos del cronograma programado al sistema?')){
      axios.post(`${UrlServer}/postcronogramamensual`,
        this.state.EnviarDatos
      )
      .then((res)=>{
        console.log('res', res)
        if(res.data.length > 0 && res.status === 200 ){
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
    const { Column } = this.state
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
                <Input type="month" onChange={e=> this.setState({fecha_desde:e.target.value})}/>

                <InputGroupAddon addonType="prepend">al:</InputGroupAddon>            
                <Input type="month" onChange={e=> this.setState({fecha_hasta:e.target.value})} />
                <Button color="info" onClick={this.GeneraFechasSegunOrden} >CREAR MESES</Button>
              </InputGroup>
            </Col>
            <Col sm="1">
              <label>{ this.state.Column.length } MESES  </label>
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
                    {Column.map((col, i)=>
                      <th key={ i }> 
                        <label className="text-capitalize">{col.FechaMostar} </label> 
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody> 
                  <tr>
                    <th>PROGRAMADO</th>
                    <td>0</td>
                    {Column.map((col, i)=>
                      <td key={ i } style={{minWidth: '100px', display: 'inlineBlock'}}>
                        <InputGroup  size="sm">
                          {/* <DebounceInput debounceTimeout={50} onChange={this.capturaInputsProgramado} type="number" className="form-control form-control-sm"/>   */}
                          <Input onBlur={e=>this.capturaInputsProgramado(e, i)} type="text"/>  
                          {/* <InputGroupAddon addonType="append" title="validar" color="primary">
                            ✔
                          </InputGroupAddon> */}
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
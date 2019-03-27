import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup,InputGroupAddon } from 'reactstrap';

import { DebounceInput } from 'react-debounce-input';
import axios from 'axios'
import { UrlServer } from '../../../Utils/ServerUrlConfig'

class ModalIngresoCronoProgramado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      Column:[],
      DataCronoArmadoEnviar:[],
      fecha_desde:'',
      fecha_hasta:'',
      ValorInput:''
    };
    
    this.ModalIngresoCrono = this.ModalIngresoCrono.bind(this);
    this.GenerarColTable = this.GenerarColTable.bind(this);
    this.GeneraFechasSegunOrden = this.GeneraFechasSegunOrden.bind(this);
    this.capturaInputsProgramado = this.capturaInputsProgramado.bind(this);
    this.ValidarInput = this.ValidarInput.bind(this);
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

        var formatearFecha =  anio+'-'+mes

        var FechaEnviar =fechaInicio.getFullYear()+ '-'+ (fechaInicio.getMonth() + 1) + '-' +  ultimoDiaMes
        var FechaMostar = new Date(formatearFecha).toLocaleDateString('ES', config)

        // console.log('fecha date', FechaMostar)
        
        Fechas.push({
          fechaEnviar:FechaEnviar,
          fechaMostrar:FechaMostar
        })
    }

    // console.log('fechas', Fechas)


    // agrupo los datos por dia
    const DataAgrupado = []

    Fechas.forEach(anioMes => {
      if (!DataAgrupado.find(ger => ger.fechaMostrar == anioMes.fechaMostrar )) {
          const { fechaMostrar, fechaEnviar } = anioMes;
          DataAgrupado.push({ fechaMostrar, fechaEnviar });
      }
    });
    
    // console.log('DataAgrupado', DataAgrupado)
    this.setState({
      Column:DataAgrupado
    })

  }

  capturaInputsProgramado(e){
    // console.log('value', e.target.value)
    this.setState({ValorInput: e.target.value})
  }

  ValidarInput(fechaEnviar){

    var EnviarDatos = this.state.DataCronoArmadoEnviar

         EnviarDatos.push(
          [
            sessionStorage.getItem("idobra"),
            fechaEnviar,
            this.state.ValorInput,
          ]
        )

    console.log('data', EnviarDatos)
  }

  enviarDatosApi(){
    // console.log(this.state.DataCronoArmadoEnviar)
    axios.post(`${UrlServer}/postcronogramamensual`,
      this.state.DataCronoArmadoEnviar
    )
    .then((res)=>{
      console.log('res', res)
      alert('enviado al sistema')
    })
    .catch((err)=>
      console.log('err', err)
    )
  }

  render() {
    const { Column } = this.state
    return (
      <div>
        <Button color="danger" onClick={this.ModalIngresoCrono}>+ PROGRAMADO</Button>

        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalIngresoCrono} size="xl" backdrop="static">
          <ModalHeader toggle={this.ModalIngresoCrono}>INGRESO DE CRONOGRAMA PROGRAMADO</ModalHeader>
          <ModalBody>
            Desde:<input type="month" onChange={e=> this.setState({fecha_desde:e.target.value})}/>
            Hasta:<input type="month" onChange={e=> this.setState({fecha_hasta:e.target.value})} />

            <button onClick={this.GeneraFechasSegunOrden}>GENERAR  PROGRAMADO</button>

            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th>INICIO</th>
                    {Column.map((col, i)=>
                      <th key={ i }> 
                        <label className="text-capitalize">{col.fechaMostrar} </label> 
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody> 
                  <tr>
                    <th>PROGRAMADO</th>
                    <td>0</td>
                    {Column.map((col, i)=>
                      <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                        <InputGroup>
                          <DebounceInput debounceTimeout={500} onChange={e => this.capturaInputsProgramado(e, )} type="number" className="form-control form-control-sm"/>  
                          <InputGroupAddon addonType="append" title="validar" color="primary"><Button onClick={()=>this.ValidarInput(col.fechaEnviar) }>✔</Button></InputGroupAddon>
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
            <Button color="primary" onClick={this.enviarDatosApi}>Guardar datos</Button>{' '}
            <Button color="secondary" onClick={this.ModalIngresoCrono}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalIngresoCronoProgramado;
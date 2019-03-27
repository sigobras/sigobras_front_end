import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup,InputGroupAddon } from 'reactstrap';

import { DebounceInput } from 'react-debounce-input';


class ModalIngresoCronograma extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      Column:[],
      DataCronoArmadoEnviar:[],
      fecha_desde:'',
      fecha_hasta:'',
    };
    
    this.ModalIngresoCrono = this.ModalIngresoCrono.bind(this);
    this.GenerarColTable = this.GenerarColTable.bind(this);
    this.GeneraFechasSegunOrden = this.GeneraFechasSegunOrden.bind(this);
    this.capturaInputsProgramado = this.capturaInputsProgramado.bind(this);
    this.ValidarInput = this.ValidarInput.bind(this);
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


   var Fechas = []

    while(fechaFin.getTime() >= fechaInicio.getTime()){
        fechaInicio.setDate(fechaInicio.getDate() + 1);
        var ultimoDiaMes = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0);
        ultimoDiaMes =  ultimoDiaMes.getDate()
        // console.log(fechaInicio.getFullYear() + '-' + (fechaInicio.getMonth() + 1) + '-' + fechaInicio.getDate());

        var FechaEnviar =ultimoDiaMes+ ' - '+ (fechaInicio.getMonth() + 1) + ' - ' +  fechaInicio.getFullYear()
        var FechaMostar = (fechaInicio.getMonth() + 1) + ' - ' +  fechaInicio.getFullYear()

        
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
          const { fechaMostrar,fechaEnviar } = anioMes;
          DataAgrupado.push({ fechaMostrar, fechaEnviar });
      }
    });
    
    console.log('DataAgrupado', DataAgrupado)
    this.setState({
      Column:DataAgrupado
    })

  }

  capturaInputsProgramado(e, fechaEnviar){
    console.log('value', e.target.value, 'fechaEnviar', fechaEnviar)

  }

  ValidarInput(){

    var EnviarDatos = []

      EnviarDatos.push(
        [
          19,
          e.target.value,
          fechaEnviar
        ]
      )

    this.setState({
      DataCronoArmadoEnviar:EnviarDatos
    })

    console.log('data', EnviarDatos)

    
    console.log('this State', this.state.DataCronoArmadoEnviar)
  }


  render() {
    const { Column } = this.state
    return (
      <div>
        <Button color="danger" onClick={this.ModalIngresoCrono}>INGRESAR CRONOGRAMA</Button>

        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalIngresoCrono} size="xl" backdrop="static">
          <ModalHeader toggle={this.ModalIngresoCrono}>INGRESO DE CRONOGRAMA</ModalHeader>
          <ModalBody>
            desde:<input type="month" onChange={e=> this.setState({fecha_desde:e.target.value})}/>
            hasta:<input type="month" onChange={e=> this.setState({fecha_hasta:e.target.value})} />

            <button onClick={this.GeneraFechasSegunOrden}>GENERAR CRONOGRAMA</button>

            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th>INICIO</th>
                    {Column.map((col, i)=>
                      <th key={ i }> {col.fechaMostrar}  </th>
                    )}
                  </tr>
                </thead>
                <tbody> 
                  <tr>
                    <th>PROGRAMADO</th>
                    <td>0</td>
                    {Column.map((col, i)=>
                      <td key={ i } style={{minWidth: '140px', display: 'inlineBlock'}}>
                      <InputGroup>
                        <DebounceInput debounceTimeout={500} onChange={e => this.capturaInputsProgramado(e, col.fechaEnviar )}  type="number" className="form-control form-control-sm"/>  
                        <InputGroupAddon addonType="append" title="validar" color="primary"><Button onClick={this.ValidarInput }>✔</Button></InputGroupAddon>
                      </InputGroup>
                      </td>                  

                    )}
                  </tr>

                  <tr>
                    <th>FISICO EJECUTADO</th>
                    <td>0</td>
                    {Column.map((col, i)=>
                      <td key={ i }></td>                  
                    )}
                  </tr>

                  <tr>
                    <th>FINANCIERO EJECUTADO</th>
                    <td>0</td>

                    {Column.map((col, i)=>
                      <td key={ i }></td>                  
                    )}
                  </tr>
                </tbody>
              </table>
            </div>

            


            <button onClick={this.GenerarColTable }>mas</button>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.ModalIngresoCrono}>Guardar datos</Button>{' '}
            <Button color="secondary" onClick={this.ModalIngresoCrono}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default ModalIngresoCronograma;
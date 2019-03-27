
import React,{ Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon } from 'reactstrap';
import { DebounceInput } from 'react-debounce-input';

import axios from 'axios'
import { UrlServer } from '../../../Utils/ServerUrlConfig'

class ModalIngresoCronoFinanciero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DataApiFinanciero:[],
      DataEnviarApiFinan:[],
      modal: false,
      InputFinanciero:''
    };
    
    this.ModalIngresoFInanciero = this.ModalIngresoFInanciero.bind(this);
    this.capturaInputsFinanciero = this.capturaInputsFinanciero.bind(this);
    this.estructuraData = this.estructuraData.bind(this);
    this.EnviaDataFinanciero = this.EnviaDataFinanciero.bind(this);
  }

  ModalIngresoFInanciero() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    
    // cuando abrimos el modal se ejecuta el pedido 
    if(this.state.modal === false){
      axios.post(`${UrlServer}/getcronogramadinero`,{
        id_ficha: sessionStorage.getItem('idobra')
      })
      .then((res)=>{
          console.log('res financiero>>', res.data);
          this.setState({
            DataApiFinanciero:res.data
          })
      })
      .catch((error)=>{      
          console.error('algo salio mal verifique el',error);
      })
    }
  }

  capturaInputsFinanciero(e){

    console.log('fag', e.target.value)

    this.setState({
      InputFinanciero:e.target.value
    })
  }

  estructuraData(mes){
    var estrucData = this.state.DataEnviarApiFinan

    estrucData.push({
      "financieroEjecutado":this.state.InputFinanciero,
      "id_ficha":this.props.ObraId,
      "mes":mes
    })

    console.log('dta',estrucData )
  }

  EnviaDataFinanciero(){
    axios.post(`${UrlServer}/postAvanceFinanciero`,
      this.state.DataEnviarApiFinan
    )
    .then((res)=>{
      console.log('res devolucion ingreso financiero>>', res.data);
      
    })
    .catch((error)=>{      
        console.error('algo salio mal verifique el',error);
    })
  }

  render() {
    const { DataApiFinanciero } = this.state
    return (
      <div>
        <Button color="danger" onClick={this.ModalIngresoFInanciero}> + FINANCIERO </Button>

        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalIngresoFInanciero} size="xl" backdrop="static" >
          <ModalHeader toggle={this.ModalIngresoFInanciero}>INGRESO DE CRONOGRAMA - FINANCIERO </ModalHeader>
          <ModalBody>
            <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th></th>
                      {/* <th>INICIO</th> */}
                      {DataApiFinanciero.mes === undefined? <td></td> :DataApiFinanciero.mes.map((col, i)=>
                        <th key={ i }> 
                          <label className="text-capitalize">{col} </label> 
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody> 
                    <tr>
                      <th>PROGRAMADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero.programado_dinero === undefined? <td></td> :DataApiFinanciero.programado_dinero.map((col, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          {col}
                        </td>                  

                      )}
                    </tr>

                    <tr>
                      <th>FISICO EJECUTADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero.fisico_dinero === undefined? <td></td> :DataApiFinanciero.fisico_dinero.map((col, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          {col}
                        </td>                  

                      )}
                    </tr>


                    <tr>
                      <th>FINANCIERO EJECUTADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero.mes === undefined? <td></td> :DataApiFinanciero.mes.map((mes, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          <InputGroup>
                            <DebounceInput debounceTimeout={500} onChange={e => this.capturaInputsFinanciero(e)} type="number" className="form-control form-control-sm"/>  
                            <InputGroupAddon addonType="append" title="validar" color="primary"><Button onClick={()=>this.estructuraData(mes) }>✔</Button></InputGroupAddon>
                          </InputGroup>
                        </td>                  
                      )}
                    </tr>

                  </tbody>
                </table>
              </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.EnviaDataFinanciero}>Ingresar datos</Button>{' '}
            <Button color="secondary" onClick={this.ModalIngresoFInanciero}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalIngresoCronoFinanciero;
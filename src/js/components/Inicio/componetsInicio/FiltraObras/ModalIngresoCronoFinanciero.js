
import React,{ Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Input } from 'reactstrap';
import { ConvertFormatStringNumber } from '../../../Utils/Funciones'
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
    
    // cuando abrimos el modal se ejecuta el pedido al api
    if(this.state.modal === false){
      axios.post(`${UrlServer}/getcronogramadinero`,{
        id_ficha: sessionStorage.getItem('idobra')
      })
      .then((res)=>{
          console.log('res financiero>>', res.data);

          var DataEnviarApiFinan = []
          res.data.forEach(data => {
            DataEnviarApiFinan.push(
              {
                "financieroEjecutado":0,
                "id_ficha":data.fichas_id_ficha,
                "mes":data.Anyo_Mes
              }
            )
          });

          this.setState({
            DataApiFinanciero:res.data,
            DataEnviarApiFinan
          })
          
         

          console.log('dada', DataEnviarApiFinan)
      })
      .catch((error)=>{      
          console.error('algo salio mal verifique el',error);
      })
    }
  }

  capturaInputsFinanciero(e, i){
    var convertString =  e.target.value
    console.log('input', convertString, 'index', i)
    
    var numero = ConvertFormatStringNumber(convertString);

    this.state.DataEnviarApiFinan[i].financieroEjecutado = numero
    
    console.log('DataEnviarApiFinan', this.state.DataEnviarApiFinan)

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
                      {DataApiFinanciero === undefined? <td></td> :DataApiFinanciero.map((col, i)=>
                        <th key={ i }> 
                          <label className="text-capitalize">{col.Anyo_Mes} </label> 
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody> 
                    <tr>
                      <th>PROGRAMADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero === undefined? <td></td> :DataApiFinanciero.map((col, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          {col.programado_dinero}
                        </td>                  

                      )}
                    </tr>

                    <tr>
                      <th>FISICO EJECUTADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero === undefined? <td></td> :DataApiFinanciero.map((col, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          {col.fisico_dinero}
                        </td>                  

                      )}
                    </tr>


                    <tr>
                      <th>FINANCIERO EJECUTADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero === undefined? <td></td> :DataApiFinanciero.map((mes, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          <InputGroup size="sm">
                            <Input onBlur={e => this.capturaInputsFinanciero(e, i)} type="number" />  
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
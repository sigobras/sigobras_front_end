
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
    this.EnviaDataFinanciero = this.EnviaDataFinanciero.bind(this);
  }

  ModalIngresoFInanciero() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    
    // cuando abrimos el modal se ejecuta el pedido al api
    if(this.state.modal === false){
      axios.post(`${UrlServer}/getcronogramadinero`,{
        id_ficha: this.props.ObraId
      })
      .then((res)=>{
          console.log('res financiero>>', res.data);

          var DataEnviarApiFinan = []
          res.data.cronogramadinero.forEach(data => {
            DataEnviarApiFinan.push(
              [
                data.fichas_id_ficha,
                data.fecha,
                ConvertFormatStringNumber(data.financiero_dinero),
              ]
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

    this.state.DataEnviarApiFinan[i].splice(2, 1, numero);

    
    
    console.log('DataEnviarApiFinan', this.state.DataEnviarApiFinan)

  }



  EnviaDataFinanciero(){
    axios.put(`${UrlServer}/postAvanceFinanciero`,
      this.state.DataEnviarApiFinan
    )
    .then((res)=>{
      console.log('res devolucion ingreso financiero>>', res);
      
    })
    .catch((error)=>{      
        console.error('algo salio mal verifique el',error);
    })
  }

  render() {
    const { DataApiFinanciero } = this.state
    return (
      <div>
        <Button color="warning" onClick={this.ModalIngresoFInanciero}> + FINANCIERO </Button>

        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalIngresoFInanciero} size="xl" backdrop="static" >
          <ModalHeader toggle={this.ModalIngresoFInanciero}>INGRESO DE CRONOGRAMA - FINANCIERO </ModalHeader>
          <ModalBody>
            <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th></th>
                      {/* <th>INICIO</th> */}
                      {DataApiFinanciero.cronogramadinero === undefined? <td></td> :DataApiFinanciero.cronogramadinero.map((col, i)=>
                        <th key={ i }> 
                          <label className="text-capitalize">{col.Anyo_Mes} </label> 
                        </th>
                      )}
                      <th>
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody> 
                    <tr>
                      <th>PROGRAMADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero.cronogramadinero === undefined? <td></td> :DataApiFinanciero.cronogramadinero.map((col, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          {col.programado_dinero}
                        </td>                  

                      )}
                      <td>
                        -
                      </td>
                    </tr>

                    <tr>
                      <th>FISICO EJECUTADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero.cronogramadinero === undefined? <td></td> :DataApiFinanciero.cronogramadinero.map((col, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          {col.fisico_dinero}
                        </td>                  

                      )}
                      <td>
                        -
                      </td>
                    </tr>


                    <tr>
                      <th>FINANCIERO EJECUTADO</th>
                      {/* <td>0</td> */}
                      {DataApiFinanciero.cronogramadinero === undefined? <td></td> :DataApiFinanciero.cronogramadinero.map((mes, i)=>
                        <td key={ i } style={{minWidth: '130px', display: 'inlineBlock'}}>
                          <InputGroup size="sm">
                            <Input placeholder={mes.financiero_dinero} onBlur={e => this.capturaInputsFinanciero(e, i)} type="text" />  
                          </InputGroup>
                        </td>                  
                      )}
                      <td>
                        -
                      </td>
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
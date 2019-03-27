
import React,{ Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'
import { UrlServer } from '../../../Utils/ServerUrlConfig'

class ModalIngresoCronoFinanciero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DataApiFinanciero:[],
      modal: false
    };

    this.ModalIngresoFInanciero = this.ModalIngresoFInanciero.bind(this);
  }

  ModalIngresoFInanciero() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    
    // cuando abrimos el modal se ejecuta el pedido 
    axios.post(`${UrlServer}/getcronogramadinero`,{
      id_ficha: sessionStorage.getItem('idobra')
    })
    .then((res)=>{
        console.log('res financiero>>', res.data);

    })
    .catch((error)=>{      
        console.error('algo salio mal verifique el',error);
        
    })
    
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.ModalIngresoFInanciero}> + FINANCIERO </Button>

        <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalIngresoFInanciero} size="xl" backdrop="static" >
          <ModalHeader toggle={this.ModalIngresoFInanciero}>INGRESO DE CRONOGRAMA - FRINANCIERO </ModalHeader>
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.ModalIngresoFInanciero}>Ingresar datos</Button>{' '}
            <Button color="secondary" onClick={this.ModalIngresoFInanciero}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalIngresoCronoFinanciero;
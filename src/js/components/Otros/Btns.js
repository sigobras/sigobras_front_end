import React, { Component } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import { MdModeEdit } from "react-icons/md";
import { UrlServer } from '../Utils/ServerUrlConfig'


import { Row, Col, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Btns extends Component {
    constructor(){
        super()
        this.state={
            DataEstadosObra:[],
            modal: false,
            DataSegunEstado:[],
            IdEstado:''
        }
        this.CambiaEstadoObra = this.CambiaEstadoObra.bind(this)
        this.ModalEstadoObra = this.ModalEstadoObra.bind(this)
        this.SubmitEsadoObra = this.SubmitEsadoObra.bind(this)
    }

    componentWillMount(){
        axios.get(`${UrlServer}/listaestados`)
        .then((res)=>{
            // console.log('data ', res.data)
            this.setState({
                DataEstadosObra: res.data
            })
        })
        .catch((err)=>
            console.error(err)
        )
    }
    
    ModalEstadoObra() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }
    
    CambiaEstadoObra(){
        
        this.ModalEstadoObra()
        var dataEstadosObra = this.state.DataEstadosObra
        var SituacionActualObra = sessionStorage.getItem("estadoObra")

        var DataSegunEstado = []
        
        switch (SituacionActualObra) {
            case "Ejecucion":
                DataSegunEstado.push(dataEstadosObra[3])
                break;
            
            case "Corte":
                DataSegunEstado.push(dataEstadosObra[0],dataEstadosObra[2],dataEstadosObra[3])
                break;

            case "Actualizacion":
                DataSegunEstado.push(dataEstadosObra[0],dataEstadosObra[3])
                break;

            case "Paralizado":
                DataSegunEstado.push(dataEstadosObra[0])
                break;

            case "Compatibilidad":
                DataSegunEstado.push(dataEstadosObra[0], dataEstadosObra[3])
                break;

        }
        
        this.setState({
            DataSegunEstado
        })

    }

    SubmitEsadoObra(){
        if(confirm('¿cambiar situación de la obra')){
            
            axios.post(`${UrlServer}/ActualizarEstado`,{
                "Fichas_id_ficha":sessionStorage.getItem('idobra'),
                "Estados_id_estado":this.state.IdEstado
            })
            .then((res)=>{
                // console.log('res>',res.data.nombre);

                if(res.data){
                    toast.success('✔ situación actual de la obra actualizada ');
                    sessionStorage.setItem('estadoObra',res.data.nombre)                

                    setTimeout(()=>{ 
                        window.location.reload() 
                    }, 20);
                }else{
                    toast.error('❌ errores en cambiar la situacion actual de la obra');
                }
            })
            .catch((err)=>{
                toast.error('❌ errores en cambiar la situacion actual de la obra');
                console.log('hubo errores >>', err)
            })
        }
    }

    
    render() {
        const { DataSegunEstado } = this.state
        return (
            <div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                
                <button className={ sessionStorage.getItem('estadoObra') === "Ejecucion"? "btn btn-outline-success  p-1 mt-1": sessionStorage.getItem('estadoObra') === "Paralizado" ? "btn btn-outline-warning  p-1 mt-1" : sessionStorage.getItem('estadoObra') === "Corte"? "btn btn-outline-danger  p-1 mt-1":  sessionStorage.getItem('estadoObra')=== "Actualizacion"? "btn btn-outline-primary  p-1 mt-1": "btn btn-outline-info  p-1 mt-1"} title={`situación de la obra ${sessionStorage.getItem('estadoObra') }`} onClick={ this.CambiaEstadoObra }  >situación actual: { sessionStorage.getItem('estadoObra') }</button>


                <Modal isOpen={this.state.modal} fade={false} toggle={this.ModalEstadoObra} backdrop={false}>
                    <ModalHeader toggle={this.ModalEstadoObra}>Cambiar situación de la obra</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col sm="6">
                               <span className="h4 text-center">situación actual:<br/> {sessionStorage.getItem("estadoObra")}</span> 
                            </Col>
                            <Col sm="6">
                                <FormGroup>
                                    <Label >Cambiar a:</Label>
                                    <Input type="select" className="form-control-sm" onChange={ e=> this.setState({IdEstado: e.target.value})}>
                                        <option>seleccione </option>
                                        {  DataSegunEstado.map((EstadoObra, IndexObra)=>
                                            <option value={ EstadoObra.id_Estado } key={ IndexObra }>
                                                { EstadoObra.nombre }
                                            </option>                                
                                        )}
                                        
                                    </Input>
                                </FormGroup>
                            </Col>                            
                        </Row>
                            
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.SubmitEsadoObra}>Cambiar estado</Button>{' '}
                        <Button color="danger" onClick={this.ModalEstadoObra}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Btns;
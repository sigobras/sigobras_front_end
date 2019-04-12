import React, { Component } from 'react';
import axios from 'axios'
import { Nav, NavItem, TabContent, NavLink, TabPane, ListGroup, Modal, ModalHeader, ModalBody, } from 'reactstrap';
import classnames from 'classnames';
import { FaUserFriends } from "react-icons/fa";
import Usuario from '../../../../../images/usuario.png'

import { UrlServer } from '../../../Utils/ServerUrlConfig'

class ModalListaPersonal extends Component {
    constructor(props){
        super(props)
        this.state = {
            DataPersonalObra:[],
            activeTab:'0',
            modalLisPers: false
        }
        this.ModalPersonal = this.ModalPersonal.bind(this);
        this.tabs = this.tabs.bind(this)    
        this.toggleModal = this.toggleModal.bind(this)    
    }

    ModalPersonal(){
      this.setState(prevState => ({
        modalLisPers: !prevState.modalLisPers
      }));

      if(this.state.modalLisPers === false){
        axios.post(`${UrlServer}/getCargosById`,{
            "id_ficha":this.props.idobraSeleccionada
        })
        .then((res)=>{
            // console.log('res', res.data)
            this.setState({
                DataPersonalObra:res.data
            })
        })
        .catch((err)=>{
            console.error('algo salio mal al obtener los usuarios', err)
        })
      }
    }

    tabs(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }
    
    toggleModal() {

      this.setState(prevState => ({
        modalLisPers: !prevState.modalLisPers
      }));
      
    }

    render() {
        const { DataPersonalObra } = this.state
        return (
          <button className="btn btn-outline-info btn-sm mr-1" title="Galeria de Imagenes" onClick={this.ModalPersonal} ><FaUserFriends />
            
            <Modal isOpen={this.state.modalLisPers} fade={false} toggle={this.ModalPersonal} >
              <ModalHeader toggle={this.toggleModal}>PERSONAL TECNICO DE OBRA</ModalHeader>
              <ModalBody>
                <div className="card">
                  <Nav tabs>
                    { DataPersonalObra.map((cargos, ICargos)=>
                        <NavItem key={ ICargos }>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === ICargos.toString() })}
                              onClick={() => { this.tabs( ICargos.toString()); }}
                              >
                              { cargos.cargo_nombre.toUpperCase() }
                            </NavLink>
                        </NavItem>
                    )}
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    { DataPersonalObra.map((cargos, ICargos)=>
                      <TabPane tabId={ ICargos.toString() }  key={ ICargos }>
                        { 
                          cargos.data.map((usuarios, IdUsuario )=>
                            <div className="row no-gutters position-relative" key={ IdUsuario }>
                                <div className="col-md-4 mb-md-0 p-md-4">
                                    <img src={ Usuario } className="w-75" alt="users sigobras" />
                                </div>
                                <div className="col-md-8 position-static p-4 pl-md-0">
                                    <h5 className="mt-0 text-uppercase">{ usuarios.nombre_usuario }</h5>
                                    <ListGroup>
                                        <b>CELULAR N° </b> <span>{ usuarios.celular }</span>
                                        <b>DNI </b> <span>{ usuarios.dni }</span>
                                        <b>EMAIL </b> <span>{ usuarios.email }</span>
                                        <b>DIRECCION </b> <span>{ usuarios.direccion }</span>
                                    </ListGroup>
                                </div>
                            </div>
                          )
                        }
                      </TabPane>
                    )}
                  </TabContent>
                </div>
              </ModalBody>
            </Modal>
          </button>
        );
    }
}

export default ModalListaPersonal;
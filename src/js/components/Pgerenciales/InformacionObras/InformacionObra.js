import React, { Component } from 'react';
import axios from 'axios'
import { Nav, NavItem, TabContent, NavLink, TabPane, ListGroup, Modal, ModalHeader, ModalBody, Table, Container, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { FaEarlybirds } from "react-icons/fa";
// import Usuario from '../../../../../images/usuario.png'
import "../InformacionObras/infobras.css";

import { UrlServer } from '../../Utils/ServerUrlConfig'
import { Redondea } from '../../Utils/Funciones'


class ModalInformacionObras extends Component {
  constructor(props) {
    super(props)
    this.state = {
      DataInfoObra: [],
      activeTab: '0',
      infoObras: false
    }
    this.ModalInfoObras = this.ModalInfoObras.bind(this);
    this.tabs = this.tabs.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  ModalInfoObras() {
    console.log("funcion===");

    this.setState(prevState => ({
      infoObras: !prevState.infoObras
    }));

    if (this.state.infoObras === false) {
      axios.post(`${UrlServer}/infobras`, {
        "id_ficha": this.props.idobraSeleccionada
      })
        .then((res) => {
          console.log('res', res.data)
          this.setState({
            DataInfoObra: res.data
          })
        })
        .catch((err) => {
          console.error('algo salio mal al obtener datos de la obra', err)
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
      infoObras: !prevState.infoObras
    }));

  }

  render() {
    const { DataInfoObra } = this.state
    return (
      <button className="btn btn-outline-info btn-sm mr-1" title="Personal" onClick={this.ModalInfoObras} ><FaEarlybirds />
        {/* toggle = es para activar y desactivar el modal */}
        <Modal className="modalinfo"  isOpen={this.state.infoObras} fade={false} toggle={this.ModalInfoObras} >
          <ModalHeader toggle={this.toggleModal}>
          {DataInfoObra.map((obra, index) =>
          <div>{obra.codigo}</div>
          )}
          
          </ModalHeader>
          
          <ModalBody >
            <Container >
              <Nav tabs>
                {/* COLOCAR MAS PESTAÑAS */}
                {DataInfoObra.map((cargos, info) =>
                  <NavItem key={info}>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === info.toString() })}
                      onClick={() => { this.tabs(info.toString()); }}
                    > RESUMEN
                            </NavLink>
                            
                  </NavItem>
                  
                )}
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                {DataInfoObra.map((obra, index) =>
                  <TabPane tabId={index.toString()} key={index}>

                    <table className="modalinfobras table table-bordered">
                          <thead>
                            <tr>
                                <th>FECHA DE INICIO</th>
                                <th>TIPO DE ACTIVIDAD</th>
                                <th>CODIGO SNIP</th>
                                <th>TIEMPO DE EJECUCIÓN</th>
                                <th>OBRA</th>

                            </tr>

                          </thead>
                          <tbody>
                          <tr>
                          
                          <td>{obra.fecha_inicial}</td>
                          <td>{obra.g_tipo_act}</td>
                          <td>{obra.g_snip}</td>
                          <td>{obra.tiempo_ejec}</td>
                          <td>{obra.g_meta}</td>

                          
                          </tr>
                          </tbody>
                          <tfoot>
                          <tr>
                          PRESUPUESTO
                          </tr>
                          <td>{Redondea(obra.g_total_presu)}</td>
                          </tfoot>



                        </table>




                  </TabPane>
                )}
              </TabContent>
                  
            </Container>
          </ModalBody>
        </Modal>
      </button>
    );
  }
}

export default ModalInformacionObras;
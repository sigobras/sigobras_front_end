import React, { Component } from "react";
// import axios from 'axios';
// import { Nav, NavItem, TabContent, NavLink, TabPane, ListGroup, Modal, ModalHeader, ModalBody, } from 'reactstrap';
import Modal from 'react-modal'
// import { UrlServer } from '../../Utils/ServerUrlConfig';
import "../Recursos/RecursosPersonal.css";



class Proyeccion extends Component {
    constructor() {
        super();
        this.state = {
         
        };
        //se bindean las funciones las variables no

    }
    
    componentWillMount() {

        this.setState({
          
        })

    }



    /////////FUNCIONES---------------------------------------/8///////////////////////////

    render() {
        
        return (
            
            // <Nav tabs>
            // <NavItem>
            
            // <NavLink>| hola |</NavLink>
            // <NavLink>| jhon |</NavLink>
            // <NavLink>| cabrera |</NavLink>
            
            
            
            // </NavItem>
            // </Nav>

            <div>
                <Modal isOpen={true}>
                    <h2>modal title</h2>
                                    
                    <p>modal body</p>
                </Modal>
            </div>

        );
    }

}
export default Proyeccion;

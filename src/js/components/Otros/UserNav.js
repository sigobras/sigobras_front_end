import React, { Component } from 'react';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { FaPowerOff } from "react-icons/fa";


class UserNav extends Component {
    constructor(props) {
        super(props);
    
        this.cierraSesion = this.cierraSesion.bind(this)
      }
    

    cierraSesion(){
        if(confirm('estas seguro de salir?')){
          sessionStorage.removeItem('idacceso');
          sessionStorage.removeItem('cargo');
          sessionStorage.removeItem('idobra');
          sessionStorage.removeItem('nombre');
        }else{
            
        }
    }
    render() {
        return (
            <div>
                <a href="#" id="userLogin"  className="FondoBarra mr-1 nav-link text-white" >
                    Bienvenido:  {sessionStorage.getItem('nombre')}
                </a>
                
                <UncontrolledPopover trigger="legacy" placement="bottom" target="userLogin">
                    <PopoverBody>
                        <label>Configuración</label>
                        <div className="divider"></div>
                        <label>Contraseña</label>
                        <div className="divider"></div>
                        <label>Actualizaciones</label>
                        <div className="divider"></div>
                        <a href="/" onClick={this.cierraSesion}> <FaPowerOff color="red" className="p-0" /> Salir</a>
                    </PopoverBody>
                </UncontrolledPopover>
            </div>
        );
    }
}

export default UserNav;

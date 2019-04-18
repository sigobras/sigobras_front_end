import React, { Component } from 'react';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { FaPowerOff } from "react-icons/fa";
import { Redirect } from 'react-router-dom';


class UserNav extends Component {
    constructor() {
        super();
    
        this.cierraSesion = this.cierraSesion.bind(this)
      }
    

    cierraSesion(){
        console.log("ingrese al elemento")

        if(confirm('¿Esta seguro de salir del sistema?')){

          sessionStorage.removeItem('idacceso');
          sessionStorage.removeItem('cargo');
          sessionStorage.removeItem('idobra');
          sessionStorage.removeItem('nombre');
          sessionStorage.removeItem('estadoObra');
          sessionStorage.removeItem('usuario');


        window.location.href ="/"
            // <Redirect to="/MDdiario/true" />


        }
    }
    render() {
        return (
            <div>
                <span id="userLogin"  className="mr-1 nav-link text-white" >
                    Bienvenido:  {sessionStorage.getItem('nombre')}
                </span>
                
                <UncontrolledPopover trigger="legacy" placement="bottom" target="userLogin">
                    <PopoverBody>
                        {/* <label>Configuración</label>
                        <div className="divider"></div>
                        <label>Contraseña</label>
                        <div className="divider"></div>
                        <label>Actualizaciones</label>
                        <div className="divider"></div> */}
                        <span className="nav-link" onClick={()=>this.cierraSesion()}> <FaPowerOff color="red" className="p-0" /> Salir</span>
                    </PopoverBody>
                </UncontrolledPopover>
            </div>
        );
    }
}

export default UserNav;

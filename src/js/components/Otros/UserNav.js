import React, { Component } from 'react';
import { Button, Popover, PopoverBody } from 'reactstrap';
import { FaPowerOff } from "react-icons/fa";


class UserNav extends Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.cierraSesion = this.cierraSesion.bind(this)
        this.state = {
          popoverOpen: false
        };
      }
    
      toggle() {
        this.setState({
          popoverOpen: !this.state.popoverOpen
        });
      }
      cierraSesion(){
          if(confirm('estas seguro de salir?')){
            sessionStorage.removeItem('user');
          }else{
              
          }
        
      }
    render() {
        return (
            <div>
                <Button id="userLogin" onClick={this.toggle}  size="sm" color="primary" className="mr-1">
                    Bienvenido:  {sessionStorage.getItem('nombre')}
                </Button>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="userLogin" toggle={this.toggle}  >
                    <PopoverBody>
                        <label>Configuración</label>
                        <div className="divider"></div>
                        <label>Contraseña</label>
                        <div className="divider"></div>
                        <label>Actualizaciones</label>
                        <div className="divider"></div>
                        <a href="/" onClick={this.cierraSesion}> <FaPowerOff color="red" className="p-0" /> Salir</a>
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default UserNav;

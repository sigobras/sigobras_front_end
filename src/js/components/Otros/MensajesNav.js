import React, { Component } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import LoadingXD from "../../../images/loaderXS.gif"
import { FaEnvelope } from "react-icons/fa";

class MensajeNav extends Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          popoverOpen: false
        };
      }
    
      toggle() {
        this.setState({
          popoverOpen: !this.state.popoverOpen
        });
      }
    
    render() {
        return (
            <div>
                <Button id="Popover1" onClick={this.toggle}  size="sm" color="primary">
                    <FaEnvelope />
                </Button>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}  >
                    <PopoverHeader>
                        <div className="d-flex small">
                            <div className="flex-fill pr-5"><b>Mensajes</b> </div>
                            <div className="flex-fill pr-2">más</div>
                            <div className="flex-fill">Configuración</div>
                        </div>
                    </PopoverHeader>
                    <PopoverBody>
                        <img src={LoadingXD} className="img-fluid rounded mx-auto d-block" width="20px" />                        
                    </PopoverBody>
                </Popover>
            </div>

        );
    }
}

export default MensajeNav;
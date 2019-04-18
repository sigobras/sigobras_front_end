import React, { Component } from 'react';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import LoadingXD from "../../../images/loaderXS.gif"
import { FaEnvelope } from "react-icons/fa";

class MensajeNav extends Component {
    
    render() {
        return (
            <div>
                <a href="#" id="mensajes" className=" nav-link text-white">
                    <FaEnvelope />
                </a>
                <UncontrolledPopover trigger="focus" placement="bottom" target="mensajes">
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
                </UncontrolledPopover>
            </div>

        );
    }
}

export default MensajeNav;
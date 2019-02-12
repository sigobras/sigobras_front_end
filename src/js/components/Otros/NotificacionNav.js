import React, { Component } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FaBell } from "react-icons/fa";
import LoadingXD from "../../../images/loaderXS.gif"  

class NotificacionNav extends Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.clics = this.clics.bind(this)
        this.state = {
          popoverOpen: false,
          clik:false
        };
      }
    
    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    clics(){
        this.setState({
            clik:!this.state.clik
        })
    }
   
    render() {
        return (
            <div>
                <Button id="notification" onClick={this.toggle}  size="sm" color="primary">
                    <FaBell />
                </Button>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="notification" toggle={this.toggle}  >
                    <PopoverHeader>
                        <div className="d-flex small">
                            <div className="flex-fill pr-5"><b>Notificaciones</b> </div>
                            <div className="flex-fill pr-2">más</div>
                            <div className="flex-fill">Configuración</div>
                        </div>
                    </PopoverHeader>
                    <PopoverBody>
                        <div className={ this.state.clik === true ? 'd-none' : '' }>
                            <img src={ LoadingXD } width="20px" onClick={this.clics } className="img-fluid rounded mx-auto d-block" />
                        </div>
                        

                        <div className={ this.state.clik === true ? '' : 'd-none' }>
                            <img src="http://media.biobiochile.cl/wp-content/uploads/2014/03/tumblr_mec3vbcdFV1r8dy8go1_500.gif"  className="img-fluid rounded mx-auto d-block"  onClick={this.clics }/>                        
                        </div>
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default NotificacionNav;
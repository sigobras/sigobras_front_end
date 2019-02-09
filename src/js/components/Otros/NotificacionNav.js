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
                            <img src="https://images.sex.com/images/pinporn/2018/09/29/300/20024143.gif"  className="img-fluid rounded mx-auto d-block"  onClick={this.clics }/>                        
                            {/* <img src="http://38.media.tumblr.com/be782d17c1614ce29f9f65589729ae6f/tumblr_nejcqm0pgY1rwaupfo1_r1_500.gif"  className="img-fluid rounded mx-auto d-block"  onClick={this.clics }/>                        
                            <img src="https://i.pinimg.com/originals/43/7d/69/437d69bfc6dca3a31e46d7c3b08b5ef0.gif"  className="img-fluid rounded mx-auto d-block"  onClick={this.clics }/>                        
                            <img src="https://thumb-p1.xhcdn.com/a/xvI2TYH1Y8mWDLxu6wJjVw/000/116/643/941_1000.gif"  className="img-fluid rounded mx-auto d-block"  onClick={this.clics }/>                        
                            <img src="http://www.elarcadefino.com/wp-content/uploads/2015/06/tumblr_nofmyrztA41qb139no1_500.gif"  className="img-fluid rounded mx-auto d-block"  onClick={this.clics }/>                         */}
                        </div>
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default NotificacionNav;
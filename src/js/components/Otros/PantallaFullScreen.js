import React, { Component } from 'react';
import Fullscreen from "react-full-screen";

class PantallaFullScreen extends Component {
    constructor() {
        super();
        this.state = {
          isFull: false,
        }
        this.irFullScreen = this.irFullScreen.bind(this)
    }
    irFullScreen(){
        this.setState({ 
            isFull: !this.state.isFull 
        });
      }
    render() {
        return (
            <div>
                <button onClick={this.irFullScreen}>
                    full
                </button>
        
                <Fullscreen
                    enabled={this.state.isFull}
                    onChange={isFull => this.setState({isFull})}
                    >
                    ESTO SE MUESTRA EN LA PANTALLA COMPLETA
                </Fullscreen>
            </div>
        );
    }
}

export default PantallaFullScreen;
import React,{ Component } from "react";
import Obras from './componetsInicio/Obras'

class Inicio extends Component{
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-center pb-2">BIENVENIDO  AL SISTEMA DE INFORMACION GERENCIAL DE OBRAS  -  SIGOBRAS SAC</div>
                    <Obras />
                </div>
            </div>
        );
    }
    
}

export default Inicio;
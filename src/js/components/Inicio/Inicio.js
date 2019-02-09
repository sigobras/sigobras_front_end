import React,{ Component } from "react";

class Inicio extends Component{
    constructor() {
        super();
        this.state = {
        };
      }
    render() {
        return (
            <div className="container-fluid  mt-5">
                <div className="card">
                    <div className="card-body">
                        <h4 className="text-center">BIENVENIDO  AL PANEL DE ADMINSTRACIÓN DEL SISTEMA DE INFORMACION GERENCIAL DE OBRAS  -  SIGOBRAS SAC</h4>
                    </div>
                </div>
            </div>         
        );
    }
    
}

export default Inicio;
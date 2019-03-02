import React,{ Component } from "react";
import RecordObras from '../Pgerenciales/RecordObras/RecordObras'
import { Redirect} from "react-router-dom";

class Inicio extends Component{
    constructor() {
        super();
        this.state = {
        };
      }
    render() {
        return (
            <div className="mt-1">
                {/* {sessionStorage.getItem("idobra") === null ? <Redirect to='' /> : */}
                    <div className="card">
                        <div className="card-body">
                            <h4 className="text-center">BIENVENIDO  AL SISTEMA DE INFORMACION GERENCIAL DE OBRAS  -  SIGOBRAS SAC</h4>
                            <RecordObras />
                        </div>
                    </div>
                {/* } */}
            </div>         
        );
    }
    
}

export default Inicio;
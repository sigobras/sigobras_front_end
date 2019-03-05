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
            <div className="">

                {/* {sessionStorage.getItem("idobra") === null ? <Redirect to='' /> : */}
                    <div className="card">
                        <div className="card-body p-1">
                            <div className="text-center pb-2">BIENVENIDO  AL SISTEMA DE INFORMACION GERENCIAL DE OBRAS  -  SIGOBRAS SAC</div>
                            <RecordObras />
                        </div>
                    </div>
                {/* } */}
            </div>         
        );
    }
    
}

export default Inicio;
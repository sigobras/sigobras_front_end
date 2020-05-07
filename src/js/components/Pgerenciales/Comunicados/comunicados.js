import React, { Component } from "react";
import { Table, Button, UncontrolledCollapse } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';


class Comunicados extends Component {
    constructor() {
        super();
        this.state = {
            
        };
              
        // this.guardarproyeccioncomp = this.guardarproyeccioncomp.bind(this);

    }
    componentWillMount() {

        

    }

    /////////FUNCIONES---------------------------------------/8///////////////////////////

    
    render() {
      
        return (
            

            <div>
            <select>
               <option>
                   seleccionar obra
               </option>
            </select>
            <input className="inputcom" type ="date"  />
            <input className="inputcom1" type ="date"  />
            <input className="inputcom2" type ="text-area"  />
            <Button  color="primary">
              GUARDAR
            </Button>



            


            </div>

        );
    }

}
export default Comunicados;

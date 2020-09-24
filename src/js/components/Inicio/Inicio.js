import React, { Component } from "react";
import Obras from './componetsInicio/Obras'
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import "../../../css/inicio.css"

class Inicio extends Component {
    constructor() {
        super();
        this.state = {

            comunicados: [],
            
        };
        this.cargarComunicados = this.cargarComunicados.bind(this);
    }
    componentWillMount() {

        this.cargarComunicados()
    }
    cargarComunicados() {
        axios.post(`${UrlServer}/comunicadosInicio`,
            {
                "id_ficha": sessionStorage.getItem('idobra'),
                
            }

        )
            .then((res) => {
                // console.log("ESTA ES LA DATA lista obras", res.data);
                this.setState({
                    comunicados: res.data,
                    fecha:res.data
                })
            })
            .catch((error) => {
                console.log('algo salió mal al tratar de listar las obras error es: ', error);
            })
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">

                    {this.state.comunicados.map((comunicado, index) =>

                        <div className="aviso"> <h6 className="textoaviso">COMUNICADO: </h6> <p> -- {comunicado.texto_mensaje}</p> </div>
                    )}
                    <Obras/>
                </div>
            </div>
        );
    }
    // "text-center pb-2"

}

export default Inicio;
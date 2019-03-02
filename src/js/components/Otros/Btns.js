import React, { Component } from 'react';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'

import { MdBusiness } from "react-icons/md";

class Btns extends Component {
    constructor(){
        super()
        this.state={
            DataEstadosObra:[],
        }
        this.CambiaEstadoObra = this.CambiaEstadoObra.bind(this)
    }

    componentWillMount(){
        axios.get(`${UrlServer}/listaestados`)
        .then((res)=>{
            // console.log('data ', res.data)
            this.setState({
                DataEstadosObra: res.data
            })
        })
        .catch((err)=>
            console.error(err)
        )
    }

    CambiaEstadoObra(estado){

        if(confirm('¿Cambiar estado de obra? !tenga en cuenta que este proceso habilitará nuevos privilegios !')){
            if(estado === "Corte"){
                estado = "Actualizacion"
            }else if(estado === "Actualizacion"){
                estado = "Ejecucion"
            }
            // console.log('estado', estado)
            var DataFiltrado = this.state.DataEstadosObra;

            DataFiltrado = DataFiltrado.filter((item)=>{
                return item.nombre.toLowerCase().search(
                    estado.toLowerCase()) !== -1;
            });
            
            sessionStorage.setItem('estadoObra', DataFiltrado[0].nombre)

            axios.post(`${UrlServer}/ActualizarEstado`,{
                "Fichas_id_ficha":sessionStorage.getItem('idobra'),
                "Estados_id_estado":DataFiltrado[0].id_Estado
            })
            .then((res)=>{
                console.log('res>', res);
                // window.location.reload()
                alert('perfecto estado actual'+  sessionStorage.getItem('estadoObra'))
            })
            .catch((err)=>{
                console.log('hubo errores >>', err)
            })

            console.log('>>>>', DataFiltrado);
            console.log('s>', DataFiltrado[0].nombre);
        }
    };

    
    render() {
        return (
            <div>
                <button className="btn btn-outline-danger" title="Estado de la obra CORTE" onClick={ e=> this.CambiaEstadoObra(sessionStorage.getItem('estadoObra')) } ><MdBusiness /> C</button>
            </div>
        );
    }
}

export default Btns;
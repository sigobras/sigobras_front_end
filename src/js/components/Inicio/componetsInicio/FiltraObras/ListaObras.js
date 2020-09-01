import React, { Component } from 'react';
import axios from 'axios'; 
// import Circle from 'react-circle';
import { FaList, FaClock } from "react-icons/fa";

import 'jspdf-autotable';

import { UrlServer } from '../../../Utils/ServerUrlConfig'
import { Collapse, Spinner } from 'reactstrap';

import Componentes from './Componentes'
import CronogramaAvance from '../CronogramaAvance';
// import Galeria from '../GaleriaImagenes/Galeria';
// import CtrladminDirecta from '../../Reportes/CtrladminDirecta'

import ModalListaPersonal from './ModalListaPersonal'
import ModalInformacionObras from '../../../Pgerenciales/InformacionObras/InformacionObra'



class ListaObras extends Component{
    constructor(props){
        super(props)
        this.state = {
            collapse: 95,
            collapseCrono: 56,
            DataComponente:[],
            
        }

        this.Setobra = this.Setobra.bind(this);       
        this.CollapseComponentes = this.CollapseComponentes.bind(this)
        this.CollapseCronograma = this.CollapseCronograma.bind(this)
    }


    Setobra(idFicha, estado_nombre, codigoObra){

        sessionStorage.setItem("idobra", idFicha);
        sessionStorage.setItem("estadoObra", estado_nombre);
        sessionStorage.setItem("codigoObra", codigoObra);
        setTimeout(()=>{ window.location.href = '/inicio'},50);            

        // switch(estado_nombre) {
        //     case 'Corte':
        //         setTimeout(()=>{ window.location.href = '/MDdiario'},50);            
        //     break;

        //     case 'Actualizacion':
        //         setTimeout(()=>{ window.location.href = '/MDdiario'},50);            
        //     break;

        //     case 'Paralizado':
        //         setTimeout(()=>{ window.location.href = '/ParalizacionObra'},50);
        //     break;

        //     case 'Compatibilidad':
        //         setTimeout(()=>{ window.location.href = '/CompatibilidadObra'},50);
        //     break;

        //     default: 'Ejecucion'
        //         setTimeout(()=>{ window.location.href = '/MDdiario'},50);
        //     break;
            
        // }
    } 


    CollapseComponentes(valor, id_ficha){
        let event = valor
    
        this.setState({ 
            collapse: this.state.collapse === Number(event) ? 95 : Number(event)
            // DataComponente:[]
        });


        if(this.state.collapse !== valor){

            axios.post(`${ UrlServer}/getComponentesPgerenciales`,{
                id_ficha:id_ficha
            })
            .then((res)=>{
                // console.log('DataObraComp', res.data);
                this.setState({
                    DataComponente: res.data
                })
            })
            .catch((err)=>
                console.error('error', err)
            )
             
        } 
    }

    CollapseCronograma(index, id_ficha){

        var indexCollapse = Number(index)

        this.setState({ 
            collapseCrono: this.state.collapseCrono === indexCollapse ? 56 : indexCollapse,
            // DataComponente:[]
        });
       
    }
    calcular_dias(fecha_inicio, fecha_final) {
        console.log(fecha_inicio, fecha_final);
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(fecha_inicio);
        const secondDate = new Date(fecha_final);
        var days = Math.round(Math.abs((firstDate - secondDate) / oneDay)) ;
        return days || 0

    }

    render(){
        const { collapse, collapseCrono } = this.state

        return(
                       
            this.props.items.length <= 0 ?
            <tbody><tr><td colSpan="6" className="text-center text-warning"><Spinner color="primary" size="sm" /> </td></tr></tbody>:
            this.props.items.map((Obras, IndexObras)=>
                
                <tbody key={ IndexObras }> 
                    <tr >
                        <td>{ IndexObras +1 }</td>
                        <td style={{
                            color: '#cecece',
                            background: '#242526',
                            fontSize:'0.8rem'
                            
                            
                            }}>{ Obras.g_meta }</td>
                        <td style={{width: '20%'}}>

                            <div style={{
                                width: '100%',
                                height: '30px',
                                textAlign: 'center'
                                }}
                            >

                                <div style={{
                                    height: '5px',
                                    backgroundColor: '#4a4b4c',
                                    borderRadius: '5px',
                                    position: 'relative',
                                    
                                    }}
                                >
                                <div
                                    style={{
                                    width: `${Obras.porcentaje_avance}%`,
                                    height: '100%',
                                    boxShadow:'0 0 12px #3578bb',
                                    backgroundColor: Obras.porcentaje_avance > 85 ? '#3578bb'
                                        : Obras.porcentaje_avance > 30 ? '#8caeda'
                                        :  '#cecece',
                                    borderRadius: '5px',
                                    transition: 'all .9s ease-in',
                                    position: 'absolute',
                                    
                                   
                                    }}
                                /><span style={{ position:'inherit', fontSize:'0.8rem', top: '6px' }}>Físico ({Obras.porcentaje_avance} %)</span>
                                </div>
                            

                                

                            </div> 
                            {/* porcentaje_financiero */}
                            <div style={{
                                width: '100%',
                                height: '20px',
                                textAlign: 'center'
                                }}
                            >

                                <div style={{
                                    height: '5px',
                                    backgroundColor: '#4a4b4c',
                                    borderRadius: '5px',
                                    position: 'relative'
                                    }}
                                >
                                <div
                                    style={{
                                    width: `${Obras.porcentaje_financiero}%`,
                                    height: '100%',
                                    boxShadow:'0 0 12px #ff7400',
                                    backgroundColor: Obras.porcentaje_financiero > 85 ? '#ff7400'
                                        : Obras.porcentaje_financiero > 30 ? '#fb8420'
                                        :  '#f3984b',
                                    borderRadius: '5px',
                                    transition: 'all .9s ease-in',
                                    position: 'absolute',
                                   
                                    }}
                                /><span style={{ position:'inherit', fontSize:'0.7rem', top: '6px', color:'#8caeda' }}>Financiero ({Obras.porcentaje_financiero} %)</span>
                                </div>

                            </div> 

                        </td>
                        <td style={{
                            color: '#8caeda',
                            background: '#242526',
                            fontSize:'0.8rem'
                            
                            }}>{ this.calcular_dias(Obras.ultima_fecha_avance,new Date())-1} días sin reportar</td>
                        <td className="text-center"> 
                            <button className={ sessionStorage.getItem("codigoObra") === Obras.codigo?" btn btn-primary btn-sm text-white ":  "btn btn-outline-secondary btn-sm text-white"} onClick={((e) => this.Setobra(  Obras.id_ficha,  Obras.estado_nombre, Obras.codigo  )) }>{ Obras.codigo }</button> 
                        </td>
                        <td className="text-center"> 
                            <span className={ Obras.estado_nombre === "Ejecucion"? "badge badge-success p-1": Obras.estado_nombre === "Paralizado" ? "badge badge-warning p-1" : Obras.estado_nombre === "Corte"? "badge badge-danger p-1":  Obras.estado_nombre=== "Actualizacion"? "badge badge-info p-1": "badge badge-info p-1"}>{ Obras.estado_nombre } </span>
                        </td>
                        <td style={{width: '12%'}}  className="text-center">
                            <button className="btn btn-outline-info btn-sm mr-1" title="Avance Componentes" onClick={()=> this.CollapseComponentes(IndexObras, Obras.id_ficha) } data-event={IndexObras} ><FaList /></button>
                            <button className="btn btn-outline-info btn-sm mr-1" title="Cronograma" onClick={()=> this.CollapseCronograma(IndexObras, Obras.id_ficha) } data-event={IndexObras}><FaClock /></button>
                            <ModalListaPersonal idobraSeleccionada={ Obras.id_ficha }/>
                            <ModalInformacionObras idobraSeleccionada={ Obras.id_ficha }/>

                            </td>
                    </tr>
                
                    
                    <tr>
                    
                        <td colSpan="6">
                            {collapse === IndexObras ?
                                <Collapse isOpen={collapse === IndexObras}>
                                    <Componentes DataComponente = {this.state.DataComponente  }  />
                                </Collapse>
                            :''} 
                                
                            {collapseCrono === IndexObras ?
                                <Collapse isOpen={collapseCrono === IndexObras}>
                                    <CronogramaAvance fichaId={ Obras.id_ficha} costoDirecto={ Obras.costo_directo } />
                                </Collapse>
                            :''} 

                        </td>
                    
                    </tr>
                    
                </tbody>
            )
        )
    }
}
export default ListaObras;

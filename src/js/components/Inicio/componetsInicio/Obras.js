import React, { Component } from 'react';
import axios from 'axios';
// import { FaList, FaClock, FaRegImages, FaChartPie, FaUserFriends, FaPrint, FaEye } from "react-icons/fa";
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse, Spinner, Nav, NavItem, TabContent, NavLink, TabPane  } from 'reactstrap';
// import { IoIosInfinite } from "react-icons/io";
// import html2canvas from 'html2canvas';
// import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { toast } from "react-toastify";

import ListaObras from './FiltraObras/ListaObras'
// import { logoSigobras, logoGRPuno } from '../../Reportes/imgB64'


// import { Progress } from 'react-sweet-progress';
// import "react-sweet-progress/lib/style.css";
import { UrlServer } from '../../Utils/ServerUrlConfig'
// import CronogramaAvance from '../CronogramaAvance';
// import Galeria from '../GaleriaImagenes/Galeria';
// import CtrladminDirecta from '../../Reportes/CtrladminDirecta'

// import PersonalInfo from './PersonalInfo'

class Obras extends Component{
    constructor(props){
        super(props);
        this.state = {
          DataRecorObra:[],
          items:[],
          event:'',
        };
            
        this.filterList = this.filterList.bind(this);
        // this.toggle = this.toggle.bind(this);

    }
  
    
    componentDidMount(){
        axios.post(`${UrlServer}/PGlistaObras`,{
            id_acceso:sessionStorage.getItem("idacceso")
        })
        .then((res)=>{
            console.log(res.data);
            this.setState({
                DataRecorObra: res.data
            })
            if( sessionStorage.getItem("idobra") === null){
                sessionStorage.setItem("idobra", res.data[0].id_ficha);
                sessionStorage.setItem("estadoObra", res.data[0].estado_nombre);
                sessionStorage.setItem("codigoObra", res.data[0].codigo);
            //    console.log('no seteado');  

            }
            
        })
        .catch(err=>{
            console.log('errores de conexion',err);
            toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.',{ position: "top-right",autoClose: 5000 });

        });
    }

    filterList(event){
        // console.log('event',event.target.value)
        this.setState({
            event:event.target.value
        })
        var DataFiltrado = this.state.DataRecorObra;
        
        DataFiltrado = DataFiltrado.filter((item)=>{
            return item.codigo.toLowerCase().search(
            event.target.value.toLowerCase()) !== -1;
        });        

        this.setState({items: DataFiltrado});
        // console.log('>>>>', DataFiltrado);
    };

    render(){
        return(
            <div>
                <div className="card">
                    <div className="card-header">
                        RECORD DE EJECUCION PRESUPUESTAL
                        <div className="float-right">
                            <select className="form-control form-control-sm" onChange={ this.filterList } >
                                <option value="">Todo</option>
                                <option value="E">Edificaciones</option>
                                <option value="C">Carreteras</option>
                            </select>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-sm " >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>OBRA</th>
                                    <th>AVANCE </th>
                                    <th className="text-center">IR</th>
                                    <th>ESTADO</th>
                                    <th>OPCIONES</th>
                                </tr>
                            </thead>
                            {this.state.event.length === 0 ? <ListaObras items={this.state.DataRecorObra}/> :  <ListaObras items={this.state.items}/>}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Obras
import React, { Component } from 'react';
import axios from 'axios';
import { FaList, FaClock, FaRegImages, FaChartPie } from "react-icons/fa";
// import { Progress } from 'react-sweet-progress';
// import "react-sweet-progress/lib/style.css";
import { UrlServer } from '../../Utils/ServerUrlConfig'
import CronogramaAvance from '../CronogramaAvance';
import Galeria from '../GaleriaImagenes/Galeria';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse } from 'reactstrap';

class RecordObras extends Component{

    constructor(){
        super();
        this.state = {
          DataRecorObra:[],
          dataSelect:[],
          modal: false,
          Select:'S'
        };
        
        this.Setobra = this.Setobra.bind(this);
        this.Filtro = this.Filtro.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({
          modal: !this.state.modal
        });
    }
    Filtro(e){
        var TableFiltrada = this.state.DataRecorObra;
        var inputValue = e.target.value;
        TableFiltrada = TableFiltrada.filter((tbF) => {
            return( tbF.codigo.substr(0, 1) === inputValue);
        });
        console.log(TableFiltrada);
        this.setState({dataSelect: TableFiltrada});
        // console.log(this.state);
   
    }
    componentWillMount(){
        this.setState({dataSelect: this.state.DataRecorObra})
    }
    componentDidMount(){
        axios.post(`${UrlServer}/PGlistaObras`,{
            id_acceso:sessionStorage.getItem("idacceso")
        })
        .then(res=>{
            console.log(res.data );
            this.setState({
                DataRecorObra: res.data
            })
            if( sessionStorage.getItem("idobra") === null){
                sessionStorage.setItem("idobra", res.data[0].id_ficha);
                console.log('no seteado');  

            }else{
               console.log('seteando');  

            }
            
        })
        .catch(err=>{
            console.log(err);
        });
    }

    Setobra(idFicha){
        console.log('id' + idFicha);

        // storage.setItem
        sessionStorage.setItem("idobra", idFicha);
        // let menus_id_ficha = JSON.parse(sessionStorage.getItem("menus_id_ficha"));
        let menu_ficha = JSON.parse(sessionStorage.getItem("menusPrivilegios"));
        console.log('menu_ficha, ', menu_ficha);
        // var index = -1;

        // for(var i = 0 ; i < menu_ficha.length;i++){
        //     if(menu_ficha[i].id_ficha === idFicha){
        //         index = i;
        //         break;
        //     }               
            
        // }
        // var actualMenu = menu_ficha[index];

        // var menupos0 = JSON.stringify(actualMenu);

        // console.log(menupos0);

		// sessionStorage.setItem("menus_id_ficha", menupos0);


        setTimeout(()=>{ 	
                        
          window.location.href = '/MDdiario'
        
        },50);
        
      } 
    render(){
        return(
            <div className="card p-1">
                <div className="card">
                    <div className="card-header">
                        RECORD DE EJECUCION PRESUPUESTAL
                        <div className="float-right">
                            <select className="form-control form-control-sm" value={this.state.dataSelect} onChange={(e) => this.Filtro(e) } value={this.state.Select}>
                                <option value={this.state.Select} disabled >Seleccione:</option>
                                
                                <option value="E">Edificaciones</option>
                                <option value="C">Carreteras</option>
                                <option value="P">Prueba</option>
                                
                            </select>

                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-resposive">
                            
                            <table className="table table-bordered table-sm small">
                                   
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>OBRA</th>
                                        <th>AVANCE </th>
                                        <th>IR A</th>
                                        <th>OPCIONES</th>
                                    </tr>
                                </thead>
                                { this.state.dataSelect.map((Obras, IndexObras)=>
                        
                                    <tbody  key={ IndexObras*9 }>
                                        
                                        <tr>

                                            <td>{ IndexObras +1 }</td>
                                            <td>{ Obras.g_meta }</td>
                                            <td style={{width: '15%'}}>
                                                <div className="progress small" style={{height:'12px'}}>
                                                    <div className="progress-bar" style={{width:Obras.porcentaje_avance+'%'}} >{ Obras.porcentaje_avance } %</div>
                                                </div>
                                                
                                            </td>
                                            <td> 
                                                <button className="btn btn-outline-info btn-sm" onClick={((e) => this.Setobra(  Obras.id_ficha )) }><i className="fas fa-ey"></i> { Obras.codigo } </button>
                                            </td>
                                            <td style={{width: '14%'}}>
                                                <button type="button" className="btn btn-outline-info btn-sm mr-1" id={"toggler"+IndexObras} data-target={"#"+IndexObras}><FaList /></button>
                                                <button className="btn btn-outline-info btn-sm mr-1" id="CRONO"><FaClock /></button>
                                                <button className="btn btn-outline-info btn-sm mr-1" onClick={this.toggle}><FaRegImages />{this.props.buttonLabel}</button>
                                                <button className="btn btn-outline-info btn-sm"><FaChartPie /></button>
                                            </td>
                                        </tr> 

										<tr >
											<td colSpan="6">
                                                <UncontrolledCollapse toggler={"#toggler"+IndexObras}>
                                                    <table className="table table-bordered table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>COMPONENTE</th>
                                                                <th>PRESUPUESTO</th>
                                                                <th>EJECUCIÓN </th>
                                                                <th>AVANCE</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Obras.componentes.map((ObrasComp, IndexObrasComp)=>

                                                                <tr key={ IndexObrasComp } >
                                                                    <td>{ ObrasComp.num_componentes }</td>
                                                                    <td>{ ObrasComp.nomb_componentes }</td>
                                                                    <td> S/.{ ObrasComp.presupuesto_componentes }</td>
                                                                    <td> S/.{ ObrasComp.comp_avance }</td>
                                                                    <td>
                                                                        <div className="progress">
                                                                            <div className="progress-bar bg-info" style={{width:ObrasComp.porcentaje_avance_componentes+'%'}} >{ ObrasComp.porcentaje_avance_componentes } %</div>
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                            )}
                                                            <tr>
                                                                <td colSpan="2">TOTAL </td>
                                                                <td> S/.{ Obras.g_total_presu_ficha }</td>
                                                                <td> S/.{ Obras.presu_avance }</td>
                                                                <td>
                                                                    <div className="progress small" style={{height:'12px'}}>
                                                                        <div className="progress-bar" style={{width:Obras.porcentaje_avance+'%'}} >{ Obras.porcentaje_avance } %</div>
                                                                    </div>
                                                                    
                                                                </td>
                                                            </tr>
                                                        </tbody> 
                                                    </table>
                                                </UncontrolledCollapse>
                                                <UncontrolledCollapse toggler="#CRONO">
                                                    <CronogramaAvance />
                                                </UncontrolledCollapse>

											</td>
										</tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}  style={{maxWidth: '90%'}}>
                    <ModalHeader toggle={this.toggle}>GALERIA DE IMAGENES METRADOS</ModalHeader>
                    <ModalBody>
                        <Galeria />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>  
                                
            </div>
        );
    }
}

export default RecordObras;
import React, { Component } from 'react';
import axios from 'axios';
import { FaList, FaClock, FaRegImages, FaChartPie, FaWalking, FaPrint } from "react-icons/fa";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse } from 'reactstrap';
import ReactToPrint from "react-to-print";

// import { Progress } from 'react-sweet-progress';
// import "react-sweet-progress/lib/style.css";
import { UrlServer } from '../../Utils/ServerUrlConfig'
import CronogramaAvance from '../CronogramaAvance';
import Galeria from '../GaleriaImagenes/Galeria';
import CtrladminDirecta from '../Reportes/CtrladminDirecta'

class RecordObras extends Component{
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
    

    componentWillMount(){
        axios.post(`${UrlServer}/PGlistaObras`,{
            id_acceso:sessionStorage.getItem("idacceso")
        })
        .then((res)=>{
            // console.log(res.data);
            this.setState({
                DataRecorObra: res.data
            })
            if( sessionStorage.getItem("idobra") === null){
                sessionStorage.setItem("idobra", res.data[0].id_ficha);
            //    console.log('no seteado');  

            }else{
                // console.log('seteando');  

            }
            
        })
        .catch(err=>{
            console.log(err);
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
                            <select className="form-control form-control-sm" onChange={this.filterList} >
                                <option value="">Todo</option>
                                <option value="E">Edificaciones</option>
                                <option value="C">Carreteras</option>
                                <option value="P">Prueba</option>                                
                            </select>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-resposive">
                            <table className="table table-bordered table-sm ">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>OBRA</th>
                                        <th>AVANCE </th>
                                        <th>IR A</th>
                                        <th>ESTADO</th>
                                        <th>OPCIONES</th>
                                    </tr>
                                </thead>
                                {this.state.event.length === 0 ? <List items={this.state.DataRecorObra}/> :  <List items={this.state.items}/>}
                            </table>

                        </div>
                    </div>
                </div>

                
                                
            </div>
        );
    }
}


class List extends Component{
    constructor(props){
        super(props)
        this.state = {
          modal: false,

        }
        this.Setobra = this.Setobra.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    Setobra(idFicha){
        // console.log('id' + idFicha);

        // storage.setItem
        sessionStorage.setItem("idobra", idFicha);
        // let menus_id_ficha = JSON.parse(sessionStorage.getItem("menus_id_ficha"));
        let menu_ficha = JSON.parse(sessionStorage.getItem("menusPrivilegios"));
        console.log('menu_ficha, ', menu_ficha);

        setTimeout(()=>{ 	
                        
          window.location.href = '/MDdiario'
        
        },50);
        
      } 
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    render(){
        const datos = this.props.items.map((Obras, IndexObras)=>{
                        
        return(
            <tbody  key={ IndexObras }>
            
                <tr>
                    <td>{ IndexObras +1 }</td>
                    <td>{ Obras.g_meta }</td>
                    <td style={{width: '15%'}}>
                        <div className="progress small" style={{height:'12px'}}>
                            <div className="progress-bar" style={{width:Obras.porcentaje_avance+'%'}} >{ Obras.porcentaje_avance } %</div>
                        </div>
                    </td>
                    <td> 
                        <button className="btn btn-outline-info btn-sm" onClick={((e) => this.Setobra(  Obras.id_ficha )) }><FaWalking />  { Obras.codigo } </button>
                    </td>
                    <td  className="text-center"> 
                        <span className="badge badge-primary p-1">{ Obras.estado_nombre } </span>
                    </td>
                    <td style={{width: '18%'}}  className="text-center">
                        <button type="button" className="btn btn-outline-info btn-sm mr-1" id={"toggler"+IndexObras} data-target={"#"+IndexObras}><FaList /></button>
                        <button className="btn btn-outline-info btn-sm mr-1" id={"CRONO"+IndexObras }><FaClock /></button>
                        <button className="btn btn-outline-info btn-sm mr-1" onClick={this.toggle}><FaRegImages />{this.props.buttonLabel}</button>
                        <button className="btn btn-outline-info btn-sm mr-1"><FaChartPie /></button>
                        <button className="btn btn-outline-warning btn-sm" id={"adminDirecta"+IndexObras }><FaPrint /></button>
                    </td>
                </tr> 

                <tr>
                    <td colSpan="6">
                        <UncontrolledCollapse toggler={"#toggler"+IndexObras}>
                            <table className="table table-bordered table-sm bg-dark">
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
                                            <td>{ ObrasComp.nombre }</td>
                                            <td> S/.{ ObrasComp.presupuesto }</td>
                                            <td> S/.{ ObrasComp.comp_avance }</td>
                                            <td>
                                            
                                            <div style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    textAlign: 'center'
                                                }}
                                            >

                                                <div style={{
                                                    height: '4%',
                                                    backgroundColor: '#c3bbbb',
                                                    borderRadius: '2px',
                                                    position: 'relative'
                                                    }}
                                                >
                                                <div
                                                    style={{
                                                    width: `${ObrasComp.porcentaje_avance_componentes}%`,
                                                    height: '100%',
                                                    backgroundColor: ObrasComp.porcentaje_avance_componentes > 95 ? 'rgb(164, 251, 1)'
                                                        : ObrasComp.porcentaje_avance_componentes > 50 ? '#ffbf00'
                                                        :  '#ff2e00',
                                                    borderRadius: '2px',
                                                    transition: 'all .9s ease-in',
                                                    position: 'absolute',
                                                    boxShadow: `0 0 6px 1px ${ObrasComp.porcentaje_avance_componentes > 95 ? 'rgb(164, 251, 1)'
                                                        : ObrasComp.porcentaje_avance_componentes > 50 ? '#ffbf00'
                                                        :  '#ff2e00'}`
                                                    }}
                                                /><span style={{ position:'inherit', fontSize:'0.6rem', fontWeight:900, color: ObrasComp.porcentaje_avance_componentes <1 ?'black': 'white' }}>{ObrasComp.porcentaje_avance_componentes} %</span>
                                                </div>
                                            
                                            </div> 
                                            </td>
                                        </tr>

                                    )}
                                    <tr>
                                        <td colSpan="2">TOTAL </td>
                                        <td> S/. { Obras.g_total_presu }</td>
                                        <td> S/. { Obras.presu_avance }</td>
                                        <td>

                                            <div style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    textAlign: 'center'
                                                }}
                                            >

                                                <div style={{
                                                    height: '4%',
                                                    backgroundColor: '#c3bbbb',
                                                    borderRadius: '2px',
                                                    position: 'relative'
                                                    }}
                                                >
                                                <div
                                                    style={{
                                                    width: `${Obras.porcentaje_avance}%`,
                                                    height: '100%',
                                                    backgroundColor: Obras.porcentaje_avance > 95 ? 'rgb(164, 251, 1)'
                                                        : Obras.porcentaje_avance > 50 ? '#ffbf00'
                                                        :  '#ff2e00',
                                                    borderRadius: '2px',
                                                    transition: 'all .9s ease-in',
                                                    position: 'absolute',
                                                    boxShadow: `0 0 6px 1px ${Obras.porcentaje_avance > 95 ? 'rgb(164, 251, 1)'
                                                        : Obras.porcentaje_avance > 50 ? '#ffbf00'
                                                        :  '#ff2e00'}`
                                                    }}
                                                /><span style={{ position:'inherit', fontSize:'0.6rem', fontWeight:900, color: Obras.porcentaje_avance <1 ?'black': 'white' }}>{Obras.porcentaje_avance} %</span>
                                                </div>
                                            
                                            </div> 
                                            
                                        </td>
                                    </tr>
                                </tbody> 
                            </table>
                        </UncontrolledCollapse>
                        
                        <UncontrolledCollapse toggler={"#CRONO"+IndexObras}>
                            <CronogramaAvance />
                        </UncontrolledCollapse>
                        <UncontrolledCollapse toggler={"#adminDirecta"+IndexObras}>
                            <ReactToPrint
                                trigger={() => <a href="#" className="btn btn-outline-success">Imprimir</a>}
                                content={() => this.componentRef}
                                pageStyle='bg-danger'
                                // bodyClass='bg-light'
                                copyStyles = {false}
                                // onBeforePrint= { this.setState({visiblilidad: true})  }
                            />
                            <div>
                                <CtrladminDirecta ref={el => (this.componentRef = el)} />
                            </div>
                        </UncontrolledCollapse>
                        
                    </td>
                </tr>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}  style={{maxWidth: '90%'}}>
                    <ModalHeader toggle={this.toggle}>GALERIA DE IMAGENES METRADOS</ModalHeader>
                    <ModalBody>
                        <Galeria />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>  
            </tbody>
        )})

        return datos
         
    }
}
export default RecordObras;

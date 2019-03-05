import React, { Component } from 'react';
import axios from 'axios';
import { FaList, FaClock, FaRegImages, FaChartPie, FaWalking, FaPrint, FaEye } from "react-icons/fa";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse, Spinner } from 'reactstrap';
import { IoIosInfinite } from "react-icons/io";
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';


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
    
    componentDidMount(){
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
                sessionStorage.setItem("estadoObra", res.data[0].estado_nombre);
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
        this.printDocument = this.printDocument.bind(this);        
    }

    componentWillMount(){
        axios.post(`${UrlServer}/informeControlEjecucionObras`,{
            "id_ficha":sessionStorage.getItem("idobra")
        })
        .then((res)=>{
            console.info('data>',res.data)
        })
        .catch((err)=>{
            console.error('algo salio mal ', err);
        })
    }

    Setobra(idFicha, estado_nombre){

        sessionStorage.setItem("idobra", idFicha);
        sessionStorage.setItem("estadoObra", estado_nombre);

        switch(estado_nombre) {
            case 'Corte':
                setTimeout(()=>{ window.location.href = '/CorteObra'},50);            
            break;
            case 'Actualizacion':
                setTimeout(()=>{ window.location.href = '/ActualizacionObra'},50);            
            break;
            case 'Paralizado':
                setTimeout(()=>{ window.location.href = '/ParalizacionObra'},50);
            break;

            default: 'Ejecucion'
                setTimeout(()=>{ window.location.href = '/MDdiario'},50);
            break;
            
        }
    } 

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    printDocument() {
        const input = document.getElementById('divToPrint');
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'l',
                // unit: 'mm',
                format: 'a4',
                hotfixes: [] 
            })
            pdf.text("CONTROL DE EJECUCION DE OBRAS POR ADMINSTRACION DIRECTA", 8, 10);
            
            var res1 = pdf.autoTableHtmlToJson(document.getElementById('tbl1'));
            var res2 = pdf.autoTableHtmlToJson(document.getElementById('tbl2'));
            pdf.autoTable(res1.columns, res1.data, {
                theme: 'striped',
                startY: pdf.autoTableEndPosY() + 20,
                styles: {
                    cellPadding: 0.9,
                    overflow: 'linebreak',
                    valign: 'middle',
                    halign: 'center',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                    fontSize: 9
                  },
            });

            pdf.autoTable(res2.columns, res2.data, {
                theme: 'striped',
                startY: pdf.autoTableEndPosY() + 5,
                styles: {
                    cellPadding: 0.8,
                    overflow: 'linebreak',
                    valign: 'middle',
                    halign: 'center',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                    fontSize: 7
                  },

            });
            // pdf.setFontSize(4);
            pdf.text('GOBIERNO REGIONAL PUNO', 5, 5)
            pdf.addImage(imgData, 'JPEG', 0, 90);
            window.open(pdf.output('bloburl'), '_blank');
          })
        ;
    }

    render(){
        const datos = this.props.items.length < 1? <tbody><tr><td colSpan="6" className="text-center text-warning"><Spinner color="primary" size="sm" /> </td></tr></tbody>: this.props.items.map((Obras, IndexObras)=>{
                        
        return(
            <tbody  key={ IndexObras }>
            
                <tr>
                    <td>{ IndexObras +1 }</td>
                    <td>{ Obras.g_meta }</td>
                    <td style={{width: '15%'}}>

                        <div style={{
                            width: '100%',
                            height: '20px',
                            textAlign: 'center'
                            }}
                        >

                            <div style={{
                                height: '8px',
                                backgroundColor: '#c3bbbb',
                                borderRadius: '2px',
                                position: 'relative'
                                }}
                            >
                            <div
                                style={{
                                width: `${Obras.porcentaje_avance}%`,
                                height: '100%',
                                backgroundColor: Obras.porcentaje_avance > 95 ? 'rgb(0, 128, 255)'
                                    : Obras.porcentaje_avance > 50 ? 'rgb(99, 173, 247)'
                                    :  'rgb(2, 235, 255)',
                                borderRadius: '2px',
                                transition: 'all .9s ease-in',
                                position: 'absolute',
                                boxShadow: `0 0 6px 1px ${Obras.porcentaje_avance > 95 ? 'rgb(0, 128, 255)'
                                    : Obras.porcentaje_avance > 50 ? 'rgb(99, 173, 247)'
                                    :  'rgb(2, 235, 255)'}`
                                }}
                            /><span style={{ position:'inherit', fontSize:'0.6rem', top: '4px', color: Obras.porcentaje_avance <1 ?'black': 'white' }}>{Obras.porcentaje_avance} %</span>
                            </div>
                        
                        </div> 

                    </td>
                    <td> 
                        <button className="btn btn-outline-dark btn-sm text-white" onClick={((e) => this.Setobra(  Obras.id_ficha,  Obras.estado_nombre  )) }><IoIosInfinite size={ 15 } />   {/*{ Obras.codigo }*/} </button> 
                    </td>
                    <td  className="text-center"> 
                        <span className={ Obras.estado_nombre === "Ejecucion"? "badge badge-success p-1": Obras.estado_nombre === "Paralizado" ? "badge badge-warning p-1" : Obras.estado_nombre === "Corte"? "badge badge-danger p-1":  Obras.estado_nombre=== "Actualizacion"? "badge badge-primary p-1": "badge badge-info p-1"}>{ Obras.estado_nombre } </span>
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
                                        <th>PRESUPUESTO BASE</th>
                                        <th>EJECUCIÓN FÍSICA</th>
                                        <th>BARRRA PORCENTUAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Obras.componentes.map((ObrasComp, IndexObrasComp)=>

                                        <tr key={ IndexObrasComp } >
                                            <td>{ ObrasComp.numero }</td>
                                            <td>{ ObrasComp.nombre }</td>
                                            <td> S/. { ObrasComp.presupuesto }</td>
                                            <td> S/. { ObrasComp.comp_avance }</td>
                                            <td>
                                            
                                            <div style={{
                                                    width: '100%',
                                                    height: '20px',
                                                    textAlign: 'center'
                                                }}
                                            >

                                                <div style={{
                                                    height: '5px',
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
                                                /><span style={{ position:'inherit', fontSize:'0.6rem', top: '4px', color: ObrasComp.porcentaje_avance_componentes <1 ?'black': 'white' }}>{ObrasComp.porcentaje_avance_componentes} %</span>
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
                                                    height: '20px',
                                                    textAlign: 'center'
                                                }}
                                            >

                                                <div style={{
                                                    height: '8px',
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
                                                /><span style={{ position:'inherit', fontSize:'0.6rem', top: '4px', color: Obras.porcentaje_avance <1 ?'black': 'white' }}>{Obras.porcentaje_avance} %</span>
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
                            <button onClick={this.printDocument} className="btn btn-outline-warning btn-xs">GENERAR REPORTE PDF</button>
                            
                            <table className="table table-bordered table-sm small" id="tbl1" >
                                <tbody> 
                                    <tr className="d-none">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="8" className="bg-info text-center">PROYECTO EN EJECUCION</td>
                                    </tr>
                                
                                    <tr >
                                        <td>ENTIDAD FINANCIERA</td>
                                        <td>: GOBIERNO REGIONAL PUNO</td>
                                        <td rowSpan="4"></td>
                                        <td>PRESUPUESTO BASE</td>
                                        <td>S/. 9892323</td>
                                        <td rowSpan="4"></td>
                                        <td>PLAZO DE EJECUCION INICIAL</td>
                                        <td>180 DIAS CALENDARIO</td>
                                    </tr>
                                    <tr>
                                        <td >MODALIDAD DE EJECUCION</td>
                                        <td>: ADMIN DIRECTA</td>
                                        <td>AMPLIACION PRESUPUESTO N° 1</td>
                                        <td>S/. 232323</td>
                                        <td>AMPLIACION DE PLAZO N° 01</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>FUENTE DE INFORMACION</td>
                                        <td>:SUB GERENCIA DE OBRA</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table table-bordered table-sm small" id="tbl2">
                                <tbody>
                                    <tr className="d-none">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="20" className="bg-info text-center">CONSOLIDADO DEL INFORME MENSUAL DE OBRA</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="3">ITEM</td>
                                        <td rowSpan="3">DESCRIPCIÓN DEL PROYECTO</td>
                                        <td rowSpan="3">PPTO E.T. (S/.) + ADICIONALES</td>
                                        <td colSpan="2">RESPONSABLES DE OBRA</td>
                                        <td colSpan="4">TIEMPO DE EJECUCIÓN</td>
                                        <td colSpan="6">VALORACIÓN ACUMULADA</td>
                                        <td rowSpan="3">MES REPORTADO</td>
                                        <td rowSpan="3">SITUACION ACTUAL</td>
                                        <td rowSpan="3">METAS PROGRAMADAS</td>
                                        <td rowSpan="3">METAS EJECUTADAS</td>
                                        <td rowSpan="3">COMENTARIO</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2">SUPERVISOR DE OBRA</td>
                                        <td rowSpan="2">RESIDENTE DE OBRA</td>
                                        <td rowSpan="2">PLAZO DE EJECUCIÓN (DÍAS CALENDARIOS)</td>
                                        <td rowSpan="2">FECHA INICIO E.T. INICIAL</td>
                                        <td rowSpan="2">FECHA CULMINACIÓN E.T. INICIAL</td>
                                        <td rowSpan="2">AMPLÍACION DE PLAZO (FECHA DE TÉRMINO)</td>
                                        <td colSpan="2">FINANCIERO</td>
                                        <td colSpan="2">FÍSICO PRES. BASE</td>
                                        <td colSpan="2">AMPLIACIÓN PRESUPUESTAL VAL. FÍSICA</td>
                                    </tr>
                                    <tr>
                                        <td>MONTO EN S/.</td>
                                        <td>ACUM. %</td>
                                        <td>MONTO EN S/.</td>
                                        <td>ACUM. %</td>
                                        <td>MONTO EN S/.<br /></td>
                                        <td>ACUM. %</td>
                                    </tr>
                                    <tr>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div id="divToPrint">
                                <CtrladminDirecta />
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

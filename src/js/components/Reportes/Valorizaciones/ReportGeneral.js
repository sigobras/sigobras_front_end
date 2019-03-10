import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { logoSigobras, logoGRPuno } from "../imgB64"
import { UrlServer } from '../../Utils/ServerUrlConfig'
import { Redondea } from '../../Utils/Funciones'
    

class ReportGeneral extends Component {
    constructor(){
        super();
        this.state={
            DataInfoObra:[],
            DataValGeneral:[]
        }
        this.ReporteValGeneral=this.ReporteValGeneral.bind(this)
      }
      
    componentWillMount(){
        axios.post(`${UrlServer}/getInformeDataGeneral`,{
            "id_ficha":sessionStorage.getItem("idobra")
        })
        .then((res)=>{
            // console.info('data >',res.data)
            this.setState({
                DataInfoObra:res.data
            })
        })
        .catch((err)=>{
            console.error('algo salio mal ', err);
        })

        // COMPONENTES 
        axios.post(`${UrlServer}/getValGeneral`,{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then((res)=>{
            console.log('res datos', res.data[0].componentes)
            this.setState({
                DataValGeneral: res.data[0].componentes
            })
        })
        .catch((err)=>{
            console.log('ERROR ANG al obtener datos ❌'+ err);
        });
    }


    ReporteValGeneral() {
        //const input = document.getElementById('img');
        // html2canvas()
          // .then((canvas) => {
            //const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'l',
                // unit: 'mm',
                format: 'a4',
                hotfixes: [] 
            })
            pdf.setFontSize(8);
            pdf.text("VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE N° 01-2019", 100, 19);
            pdf.addImage(logoGRPuno, 'JPEG',10, 4, 100, 10)
            pdf.addImage(logoSigobras, 'JPEG', 270, 4, 15, 11)
            
            var res1 = pdf.autoTableHtmlToJson(document.getElementById('tabval1'));
            var res2 = pdf.autoTableHtmlToJson(document.getElementById('tabval2'));
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
                    fontSize: 7
                  },
            });
    
            pdf.autoTable(res2.columns, res2.data, {
                theme: 'striped',
                startY: pdf.autoTableEndPosY() + 5,
                styles: {
                    cellPadding: 0.8,
                    overflow: 'linebreak',
                    valign: 'middle',
                    // halign: 'center',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                    fontSize: 6
                  },
    
            });
            window.open(pdf.output('bloburl'), '_blank');
            // pdf.output('save', 'filename.pdf')
        ;
    }
        
    
    render() {
        const { DataInfoObra, DataValGeneral } = this.state
        return (
               <div>
                    <li className="lii">
                        <a href="#"  onClick={this.ReporteValGeneral} ><FaFilePdf className="text-danger"/> VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE ✔</a>
                    </li>
                    
                    {/* <div className="d-none"> */}
                    <div>
                        <table id="tabval1" className="table table-bordered">
                            <tbody>
                                <tr className="d-none">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>OBRA</td>
                                    <td colSpan="5">{ DataInfoObra.g_meta } </td>

                                </tr>
                                <tr>
                                    <td>MONTO DE LA OBRA</td>
                                    <td colSpan="3">{ DataInfoObra.presupuesto_general }</td>
                                    <td>REGION</td>
                                    <td>{ DataInfoObra.region }</td>
                                </tr>
                                <tr>
                                    <td>MES</td>
                                    <td>{ DataInfoObra.mes }</td>
                                    <td>RESIDENTE DE OBRA</td>
                                    <td>{ DataInfoObra.length === 0 ? '': DataInfoObra.personal[0].nombre_personal }</td>
                                    <td>PROVINCIA</td>
                                    <td>{ DataInfoObra.provincia }</td>
                                </tr>
                                <tr>
                                    <td>PLAZO DE EJECUCIÓN</td>
                                    <td>{ DataInfoObra.plazo_de_ejecucion }</td>
                                    <td>SUPERVISOR DE OBRA</td>
                                    <td>WOSS LUIS ARPASI LLANQUI</td>
                                    <td>DISTRITO</td>
                                    <td>{ DataInfoObra.distrito } </td>
                                </tr>
                                <tr>
                                    <td>% AVANCE DE FISICO</td>
                                    <td>%</td>
                                    <td>AVANCE ACUMULADO</td>
                                    <td>S/. { Redondea(DataInfoObra.avance_acumulado_valor) }</td>
                                    <td>LUGAR</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                        <table id="tabval2" className="table table-bordered">
                            {DataValGeneral.map((valG, indexVG)=>
                                <tbody key={ indexVG }>
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
                                    </tr>
                                    <tr>
                                        <td><b>{ valG.componente_numero }</b></td>
                                        <td colSpan="10">{ valG.nombre }</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="3">PARTIDA</td>
                                        <td rowSpan="3">DESCRIPCION</td>
                                        <td rowSpan="2">MONTO PPTDO</td>
                                        <td colSpan="6">{ DataInfoObra.mes } DEL 2019</td>
                                        <td colSpan="2" rowSpan="2">SALDO</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">ANTERIOR</td>
                                        <td colSpan="2">ACTUAL</td>
                                        <td colSpan="2">ACUMULADO</td>
                                    </tr>
                                    <tr>
                                        <td>Presup.S/</td>
                                        <td>Valorizados/</td>
                                        <td>%</td>
                                        <td>ValoriadoS/</td>
                                        <td>%</td>
                                        <td>ValorizadoS/</td>
                                        <td>%</td>
                                        <td>ValorizadoS/</td>
                                        <td>%</td>
                                    </tr>
                                    {valG.partidas.map((partida, IndexP)=>
                                        <tr key={ IndexP }>
                                            <td>{ partida.item }</td>
                                            <td>{ partida.descripcion }</td>
                                            <td>{ valG.presupuesto }</td>
                                            <td>{ partida.valor_anterior }</td>
                                            <td>{ partida.porcentaje_anterior }</td>
                                            <td>{ partida.valor_actual }</td>
                                            <td>{ partida.porcentaje_actual }</td>
                                            <td>{ partida.valor_total }</td>
                                            <td>{ partida.porcentaje_total }</td>
                                            <td>{ partida.valor_saldo }</td>
                                            <td>{ partida.porcentaje_saldo }</td>
                                        </tr>
                                    )}
                                        
                                    
                                </tbody>
                            )}
                                
                            <tbody>
                                <tr>
                                    <th  colspan="3" rowspan="3">PARTIDA</th>
                                    <th colspan="11" rowspan="3">DESCRIPCION</th>
                                    <th  rowspan="3">UND</th>
                                    <th colspan="3" rowspan="2">PRESUPUESTO PROGRAMADO</th>
                                    <th colspan="9">JUNIO DEL 2018</th>
                                    <th colspan="3" rowspan="2">SALDO</th>
                                </tr>
                                <tr>
                                    <td colspan="3">ANTERIOR</td>
                                    <td colspan="3">ACTUAL</td>
                                    <td colspan="3">ACUMULADO</td>
                                </tr>
                                <tr>
                                    <td >METRADO</td>
                                    <td >P. UNIT S/.</td>
                                    <td >PRESUP. S/.</td>
                                    <td >METRADO</td>
                                    <td >TALARIZADO</td>
                                    <td >%</td>
                                    <td >METRADO</td>
                                    <td >TALARIZADO</td>
                                    <td >%</td>
                                    <td >METRADO</td>
                                    <td >TALARIZADO</td>
                                    <td >%</td>
                                    <td >METRADO</td>
                                    <td >TALARIZADO</td>
                                    <td >%</td>
                                </tr>
                                <tr>
                                    <td  colspan="3"></td>
                                    <td colspan="11">Construccion de 01 un aula pedagogica</td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                </tr>
                            </tbody>








































                        </table>  
                   
                    </div>
                      
                </div> 
        );
    }
}

export default ReportGeneral;
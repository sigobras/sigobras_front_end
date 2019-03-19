import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { logoSigobras, logoGRPuno } from "../Complementos/ImgB64"
import { UrlServer } from '../../Utils/ServerUrlConfig'
import { Redondea } from '../../Utils/Funciones'
    

class ResumenValorizacionObra extends Component {
    constructor(){
        super();
        this.state={
            DataInfoObra:[],
            DataComponentes:[]
        }
        this.printDocument=this.printDocument.bind(this)
      }
      
    componentWillMount(){
        axios.post(`${UrlServer}/getInformeDataGeneral`,{
            "id_ficha":sessionStorage.getItem("idobra")
        })
        .then((res)=>{
            // console.info('encabezado val >',res.data)
            this.setState({
                DataInfoObra:res.data
            })
        })
        .catch((err)=>{
            console.error('algo salio mal ', err);
        })

        // COMPONENTES 
        axios.post(`${UrlServer}/resumenValorizacionPrincipal`,{
            id_ficha: sessionStorage.getItem('idobra')
        })
        .then((res)=>{
            // console.log('resumen ', res.data)
            this.setState({
                DataComponentes: res.data
            })
        })
        .catch((err)=>{
            console.log('ERROR DE ALGO NO SE QUE PASO ❌'+ err);
        });
    }


    printDocument() {
        //const input = document.getElementById('img');
        // html2canvas()
          // .then((canvas) => {
            //const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'l',
                // unit: 'mm',
                format: 'a4',
                // hotfixes: [] 
            })
            pdf.setFontSize(8);
            pdf.text("RESUMEN DE VALORIZACION DE OBRA N° 02-2019", 100, 19);
            pdf.addImage(logoGRPuno, 'JPEG',10, 4, 100, 10)
            pdf.addImage(logoSigobras, 'JPEG', 270, 4, 15, 11)
            
            var res1 = pdf.autoTableHtmlToJson(document.getElementById('tab1'));
            var res2 = pdf.autoTableHtmlToJson(document.getElementById('tab2'));
            var resFirma = pdf.autoTableHtmlToJson(document.getElementById('tabFirma'));
            
            pdf.autoTable(res1.columns, res1.data, {
                theme: 'striped',
                startY: pdf.autoTableEndPosY() + 22,
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
                    overflow: 'ellipsize',
                    valign: 'middle',
                    // halign: 'center',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                    fontSize: 6
                  },
    
            });

            pdf.autoTable(resFirma.columns, resFirma.data, {
                theme: 'plain',
                startY: pdf.autoTableEndPosY() + 23,
                styles: {
                    cellPadding: 0.8,
                    overflow: 'linebreak',
                    valign: 'middle',
                    halign: 'center',
                    lineColor: [0, 0, 0],
                    lineWidth: 0,
                    fontSize: 8
                  },
    
            });





            window.open(pdf.output('bloburl'), '_blank');
            // pdf.output('save', 'filename.pdf')
        ;
    }
        
    
    render() {
        const { DataInfoObra, DataComponentes } = this.state
        return (
               <div>
                    <li className="lii">
                        <a href="#" onClick={this.printDocument} ><FaFilePdf className="text-danger"/> 3.- RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE ✔</a>
                    </li>
                    <div className="d-none">
                    {/* <div> */}
                        <table id="tab1" className="table table-bordered">
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
                                    <td colSpan="3">S/. { DataInfoObra.presupuesto_general }</td>
                                    <td>REGION</td>
                                    <td>{ DataInfoObra.region }</td>
                                </tr>
                                <tr>
                                    <td>MES</td>
                                    <td>{ DataInfoObra.mes === undefined ?'':DataInfoObra.mes.toUpperCase() }</td>
                                    <td>RESIDENTE DE OBRA</td>
                                    <td>{ DataInfoObra.residente }</td>
                                    <td>PROVINCIA</td>
                                    <td>{ DataInfoObra.provincia }</td>
                                </tr>
                                <tr>
                                    <td>PLAZO DE EJECUCIÓN</td>
                                    <td>{ DataInfoObra.plazo_de_ejecucion }</td>
                                    <td>SUPERVISOR DE OBRA</td>
                                    <td>{ DataInfoObra.supervisor }</td>
                                    <td>DISTRITO</td>
                                    <td>{ DataInfoObra.distrito } </td>
                                </tr>
                                <tr>
                                    <td>AVANCE DE FISICO</td>
                                    <td>{ DataInfoObra.porcentaje_avance_fisico } % </td>
                                    <td>AVANCE ACUMULADO</td>
                                    <td>{ DataInfoObra.porcentaje_avance_acumuladoo } %</td>
                                    <td>LUGAR</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                        <table id="tab2" className="table table-bordered">
                            <thead>
                                <tr className="d-none">
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <th rowSpan="3">ITEM</th>
                                    <th rowSpan="3">COMPONENTE</th>
                                    <th rowSpan="2">MONTO PPTDO</th>
                                    <th colSpan="6">{ DataInfoObra.mes } DEL 2019</th>
                                    <th colSpan="2" rowSpan="2">SALDO</th>
                                </tr>
                                <tr>
                                    <th colSpan="2">ANTERIOR</th>
                                    <th colSpan="2">ACTUAL</th>
                                    <th colSpan="2">ACUMULADO</th>
                                </tr>
                                <tr>
                                    <th>Presup. S/. </th>
                                    <th>Valorizado S/. </th>
                                    <th>%</th>
                                    <th>Valoriado S/. </th>
                                    <th>%</th>
                                    <th>Valorizado S/. </th>
                                    <th>%</th>
                                    <th>Valorizado S/. </th>
                                    <th>%</th>
                                </tr>
                            </thead>


                            <tbody>
                                {DataComponentes.length === 0? <tr><td colSpan="11"></td></tr>
                                    : DataComponentes.componentes.map((comp, iComp)=>
                                    <tr key={ iComp }>
                                        <td>{ comp.numero }</td>
                                        <td>{ comp.nombre }</td>
                                        <td>{ Redondea(comp.presupuesto) }</td>
                                        <td>{ comp.anterior_valorizado }</td>
                                        <td>{ comp.anterior_porcentaj }</td>
                                        <td>{ comp.actual_valorizado }</td>
                                        <td>{ comp.actual_porcentaje }</td>
                                        <td>{ comp.acumulado_valorizado }</td>
                                        <td>{ comp.acumulado_porcentaje }</td>
                                        <td>{ comp.porcentaje_saldo }</td>
                                        <td>{ comp.saldo }</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan="11"></td>
                                </tr>

                                {DataComponentes.length === 0? <tr><td colSpan="11"></td></tr>
                                    : DataComponentes.costosDirecto.map((comp, iComp)=>
                                    <tr key={ iComp }>
                                        <td colSpan="2">{ comp.nombre }</td>
                                        <td>{ Redondea(comp.presupuesto) }</td>
                                        <td>{ comp.anterior_valorizado }</td>
                                        <td>{ comp.anterior_porcentaj }</td>
                                        <td>{ comp.actual_valorizado }</td>
                                        <td>{ comp.actual_porcentaje }</td>
                                        <td>{ comp.acumulado_valorizado }</td>
                                        <td>{ comp.acumulado_porcentaje }</td>
                                        <td>{ comp.porcentaje_saldo }</td>
                                        <td>{ comp.saldo }</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan="11"></td>
                                </tr>

                                {DataComponentes.length === 0? <tr><td colSpan="11"></td></tr>
                                    : DataComponentes.costosindirectos.map((comp, iComp)=>
                                    <tr key={ iComp }>
                                        <td colSpan="2">{ comp.nombre }</td>
                                        <td>{ Redondea(comp.presupuesto) }</td>
                                        <td>{ comp.anterior_valorizado }</td>
                                        <td>{ comp.anterior_porcentaj }</td>
                                        <td>{ comp.actual_valorizado }</td>
                                        <td>{ comp.actual_porcentaje }</td>
                                        <td>{ comp.acumulado_valorizado }</td>
                                        <td>{ comp.acumulado_porcentaje }</td>
                                        <td>{ comp.porcentaje_saldo }</td>
                                        <td>{ comp.saldo }</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan="11"></td>
                                </tr>

                                {DataComponentes.length === 0? <tr><td colSpan="11"></td></tr>
                                    : DataComponentes.costoIndirectoTotal.map((comp, iComp)=>
                                    <tr key={ iComp }>
                                        <td colSpan="2">{ comp.nombre }</td>
                                        <td>{ Redondea(comp.presupuesto) }</td>
                                        <td>{ comp.anterior_valorizado }</td>
                                        <td>{ comp.anterior_porcentaj }</td>
                                        <td>{ comp.actual_valorizado }</td>
                                        <td>{ comp.actual_porcentaje }</td>
                                        <td>{ comp.acumulado_valorizado }</td>
                                        <td>{ comp.acumulado_porcentaje }</td>
                                        <td>{ comp.porcentaje_saldo }</td>
                                        <td>{ comp.saldo }</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan="11"></td>
                                </tr>

                                {DataComponentes.length === 0? <tr><td colSpan="11"></td></tr>
                                    : DataComponentes.ejecutadoTotalExpediente.map((comp, iComp)=>
                                    <tr key={ iComp }>
                                        <td colSpan="2">{ comp.nombre }</td>
                                        <td>{ Redondea(comp.presupuesto) }</td>
                                        <td>{ comp.anterior_valorizado }</td>
                                        <td>{ comp.anterior_porcentaj }</td>
                                        <td>{ comp.actual_valorizado }</td>
                                        <td>{ comp.actual_porcentaje }</td>
                                        <td>{ comp.acumulado_valorizado }</td>
                                        <td>{ comp.acumulado_porcentaje }</td>
                                        <td>{ comp.porcentaje_saldo }</td>
                                        <td>{ comp.saldo }</td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>  

                        <table id="tabFirma" className="table table-bordered">
                            <thead>
                                <tr className="d-none">
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>__________________________________________________</td>
                                    <td>__________________________________________________</td>
                                </tr>
                                <tr>
                                    <td>SUPERVISOR </td>
                                    <td>RESIDENTE DE OBRA</td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                      
                </div> 
        );
    }
}

export default ResumenValorizacionObra;
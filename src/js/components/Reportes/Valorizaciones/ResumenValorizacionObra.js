import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { logoSigobras, logoGRPuno } from "../imgB64"
import { UrlServer } from '../../Utils/ServerUrlConfig'
    

class ResumenValorizacionObra extends Component {
    constructor(){
        super();
        this.state={
            DataInfoObra:[]
        }
        this.printDocument=this.printDocument.bind(this)
      }
      
    componentWillMount(){
        axios.post(`${UrlServer}/getInformeDataGeneral`,{
            "id_ficha":sessionStorage.getItem("idobra")
        })
        .then((res)=>{
            console.info('data >',res.data)
            this.setState({
                DataInfoObra:res.data
            })
        })
        .catch((err)=>{
            console.error('algo salio mal ', err);
        })
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
                hotfixes: [] 
            })
            pdf.setFontSize(8);
            pdf.text("RESUMEN DE VALORIZACION DE OBRA N° 02-2019", 100, 19);
            pdf.addImage(logoGRPuno, 'JPEG',10, 4, 100, 10)
            pdf.addImage(logoSigobras, 'JPEG', 270, 4, 15, 11)
            
            var res1 = pdf.autoTableHtmlToJson(document.getElementById('tab1'));
            var res2 = pdf.autoTableHtmlToJson(document.getElementById('tab2'));
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
        return (
               <div>
                    <li className="lii">
                        <a href="#" onClick={this.printDocument} ><FaFilePdf className="text-danger"/>  RESUMEN DE LA VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE</a>
                    </li>
                    <div className="d-none">
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
                                    <td colSpan="5">"MEJORAMIENTO DE LOS SERVICIOS DE EDUCACIÓN INICIAL DE LA I.E.I. N° 597 DEL CENTRO POBLADO DE PALCA, DISTRITO DE OLLACHEA-CARABAYA-PUNO"</td>

                                </tr>
                                <tr>
                                    <td>MONTO DE LA OBRA</td>
                                    <td colSpan="3">dineri</td>
                                    <td>REGION</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>MES</td>
                                    <td></td>
                                    <td>RESIDENTE DE OBRA</td>
                                    <td></td>
                                    <td>PROVINCIA</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>PLAZO DE EJECUCIÓN</td>
                                    <td></td>
                                    <td>SUPERVISOR DE OBRA</td>
                                    <td></td>
                                    <td>DISTRITO</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>%AVANCE DE FISICO</td>
                                    <td></td>
                                    <td>AVANCE ACUMULADO</td>
                                    <td></td>
                                    <td>LUGAR</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>

                        <table id="tab2" className="table table-bordered">
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
                                </tr>
                                <tr>
                                    <td rowSpan="3">ITEM</td>
                                    <td rowSpan="3">COMPONENTE</td>
                                    <td rowSpan="2">MONTO PPTDO</td>
                                    <td colSpan="6">NOVIEMBRE DEL 2018</td>
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
                                <tr>
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
                                    <td></td>
                                    <td>COSTO DIRECTO</td>
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
                                    <td></td>
                                    <td>COSTO INDIRECTO</td>
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
                                    <td></td>
                                    <td>GASTOS GENERALES</td>
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
                                    <td></td>
                                    <td>GASTOS DE GESTIÓN DE PROYECTOS</td>
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
                                    <td></td>
                                    <td>GASTOS DE SUPERVISION</td>
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
                                    <td></td>
                                    <td>GASTOS DE LIQUIDACIÓN</td>
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
                                    <td></td>
                                    <td>GASTOS DE MONITOREO Y SEGUIMIENTO</td>
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
                                    <td></td>
                                    <td>GASTOS DE ELABORACIÓN DE EXPEDIENTE</td>
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
                                    <td></td>
                                    <td>GASTOS EN EXCESO</td>
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
                            </tbody>
                        </table>  
                   
                    </div>
                      
                </div> 
        );
    }
}

export default ResumenValorizacionObra;
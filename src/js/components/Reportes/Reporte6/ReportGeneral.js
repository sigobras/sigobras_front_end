import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { logoSigobras, logoGRPuno } from "../Complementos/ImgB64"
import { UrlServer } from '../../Utils/ServerUrlConfig'
import { Redondea } from '../../Utils/Funciones'
    

class ReportGeneral extends Component {
    constructor(){
        super();
        this.state={
          DataInfoObra:[],
          DataValGeneral:[]
        }
        this.ValorizacionGeneral = this.ValorizacionGeneral.bind(this)
    }
    
      
    componentWillMount(){
        axios.post(`${UrlServer}/getInformeDataGeneral`,{
            "id_ficha":sessionStorage.getItem("idobra")
        })
        .then((res)=>{
            //  console.info('data >',res.data)
            this.setState({
                DataInfoObra:res.data
            })
        })
        .catch((err)=>{
            console.error('algo salio mal ', err);
        })
    
        // COMPONENTES 
        axios.post(`${UrlServer}/getValGeneral`,{
            "id_ficha":sessionStorage.getItem("idobra")
        })
        .then((res)=>{
            // console.log('res datos', res.data[0].componentes)
            this.setState({
                DataValGeneral: res.data[0].componentes
            })
        })
        .catch((err)=>{
            console.log('ERROR ANG al obtener datos ❌'+ err);
        });
    }
    
    ValorizacionGeneral() {
        //const input = document.getElementById('img');
        //html2canvas(input)
          //.then((canvas) => {
            //const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'l',
                // unit: 'mm',
                format: 'a4',
                hotfixes: [] 
            })

           
            
            var res1 = pdf.autoTableHtmlToJson(document.getElementById('tbl1revalge'));
            var res2 = pdf.autoTableHtmlToJson(document.getElementById('tbl2revalge'));

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
    

            var header = function(data) {
               pdf.setFontSize(18);
               pdf.setTextColor(40);
               pdf.setFontStyle('normal');
                //pdf.addImage(imgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
            //    pdf.text("componente de datos", data.settings.margin.left, 20);
              };

            var options = {
                columnStyles: { email: { columnWidth: 'wrap' } },
                theme: "striped",
                beforePageContent: header,
                margin: {
                    top: 21,
                    botton:20
                },
                
                startY: pdf.autoTableEndPosY() + 5,
                styles: {
                    cellPadding: 0.8,
                    overflow: 'linebreak',
                    valign: 'middle',
                    //halign: 'center',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                    fontSize: 5,
                    textColor: 30,  
                },
            };

            pdf.autoTable(res2.columns, res2.data, options)

            var pageCount = pdf.internal.getNumberOfPages();
            for(let i = 0; i < pageCount; i++) { 
                pdf.setPage(i); 
                pdf.setFontSize(8);
                pdf.text("VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE N° 01-2019", 100, 19);
                pdf.addImage(logoGRPuno, 'JPEG',10, 4, 100, 10)
                pdf.addImage(logoSigobras, 'JPEG', 270, 4, 15, 11)
                pdf.text(10, 205, pdf.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);
            }
            window.open(pdf.output('bloburl'), '_blank');
        
    }
    
    render() {
        const { DataInfoObra, DataValGeneral } = this.state
        return (
            <div> 
                <li className="lii">
                    <a href="#"  onClick={this.ValorizacionGeneral} ><FaFilePdf className="text-danger"/> 2.- VALORIZACIÓN PRINCIPAL DE LA OBRA-PRESUPUESTO BASE  ✔</a>
                </li>
                <div className="d-none">
                    <table id="tbl1revalge" className="table table-bordered table-sm small">
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

                    <table id= "tbl2revalge" className="table table-bordered table-sm small">
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
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <th rowSpan="3">PARTIDA</th>
                                    <th rowSpan="3">DESCRIPCION</th>
                                    <th rowSpan="3">UND</th>
                                    <th colSpan="3" rowSpan="2">PRESUPUESTO PROGRAMADO</th>
                                    <th colSpan="9">JUNIO DEL 2018</th>
                                    <th colSpan="3" rowSpan="2">SALDO</th>
                                </tr>
                                <tr>
                                    <th colSpan="3">ANTERIOR</th>
                                    <th colSpan="3">ACTUAL</th>
                                    <th colSpan="3">ACUMULADO</th>
                                </tr>
                                <tr>
                                    <th>METRADO</th>
                                    <th>P. UNIT S/.</th>
                                    <th>PRESUP. S/.</th>
                                    <th>METRADO</th>
                                    <th>VALORIZADO</th>
                                    <th>%</th>
                                    <th>METRADO</th>
                                    <th>VALORIZADO</th>
                                    <th>%</th>
                                    <th>METRADO</th>
                                    <th>VALORIZADO</th>
                                    <th>%</th>
                                    <th>METRADO</th>
                                    <th>VALORIZADO</th>
                                    <th>%</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                { DataValGeneral.map((valG, indexVG)=>
                                    valG.partidas.map((par,indexpar)=>
                                        <tr key={ indexpar }>
                                            <td>{ par.item }</td>
                                            <td>{ par.descripcion }</td>
                                            <td>{ par.unidad_medida }</td>
                                            <td>{ par.metrado }</td>
                                            <td>{ par.costo_unitario }</td>
                                            <td>{ par.parcial }</td>

                                            <td>{ par.metrado_anterior }</td>
                                            <td>{ par.valor_anterior }</td>
                                            <td>{ par.porcentaje_anterior === "100.00" ? 100 : par.porcentaje_anterior }</td>

                                            <td>{ par.metrado_actual }</td>
                                            <td>{ par.valor_actual }</td>
                                            <td>{ par.porcentaje_actual === "100.00" ? 100 : par.porcentaje_actual }</td>

                                            <td>{ par.metrado_total }</td>
                                            <td>{ par.valor_total }</td>
                                            <td>{ par.porcentaje_total  === "100.00" ? 100 : par.porcentaje_total}</td>

                                            <td>{ par.metrado_saldo }</td>
                                            <td>{ par.valor_saldo }</td>
                                            <td>{ par.porcentaje_saldo === "100.00" ? 100 : par.porcentaje_saldo }</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                    
                    </table>
                </div>
            </div>
        );
    }
}

export default ReportGeneral;
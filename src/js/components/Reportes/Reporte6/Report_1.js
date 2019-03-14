import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { logoSigobras, logoGRPuno } from "../imgB64"
import { UrlServer } from '../../Utils/ServerUrlConfig'
import { Redondea } from '../../Utils/Funciones'

    
class Report_1 extends Component {
  constructor(){
    super();
    this.state={
      DataInfoObra:[],
      DataHistorial:[]
    }
    this.ValidoHistorial=this.ValidoHistorial.bind(this)
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
    axios.post(`${UrlServer}/getHistorial`,{
      "id_ficha":sessionStorage.getItem("idobra")
    })
    .then((res)=>{
        // console.log('res HISTORIAL', res.data)
        this.setState({
            DataHistorial: res.data
        })
    })
    .catch((err)=>{
        console.log('ERROR ANG al obtener datos ❌'+ err);
    });
  }

  ValidoHistorial() {
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

        

        var res1 = pdf.autoTableHtmlToJson(document.getElementById('tblheaderhistorial'));
        var res2 = pdf.autoTableHtmlToJson(document.getElementById('tblHistorial'));
        var resFirma = pdf.autoTableHtmlToJson(document.getElementById('tabFirma'));

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

        pdf.autoTable(resFirma.columns, resFirma.data, {
          theme: 'plain',
          startY: pdf.autoTableEndPosY() + 25,
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

        var pageCount = pdf.internal.getNumberOfPages();

        for(let i = 0; i < pageCount; i++) { 
            pdf.setPage(i); 
            pdf.setFontSize(8);
            pdf.setFontSize(8);
            pdf.text("CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales)", 100, 19);
            pdf.addImage(logoGRPuno, 'JPEG',10, 4, 100, 10)
            pdf.addImage(logoSigobras, 'JPEG', 270, 4, 15, 11)
            pdf.text(10, 205, pdf.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);
        }
        window.open(pdf.output('bloburl'), '_blank');
  }


  render() {
    const { DataInfoObra, DataHistorial } = this.state
      return (
        <div> 

          <li className="lii">
              <a href="#"  onClick={this.ValidoHistorial} ><FaFilePdf className="text-danger"/> 1- CUADRO DE METRADOS EJECUTADOS (Del Ppto.Base Y Partidas adicionales) ✔</a>
          </li>
          <div className="d-none">
            <table id="tblheaderhistorial" className="table table-bordered">
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

            <table id="tblHistorial" className="table table-bordered table-sm small">

              { DataHistorial.map((histComp, IndesHC)=>

                <thead key={ IndesHC }>
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
                      
                  </tr>
                  <tr>
                      <td>COMPONENTE N° { histComp.numero }</td>
                      <td colSpan="7">NOMBRE DEL COMPONENTE : { histComp.nombre_componente }</td>
                      <td>S/. falta api presupuesto</td>
                  </tr>
                  <tr>
                          <td>FECHA</td>
                          <td>ITEM</td>
                          <td>DESCRIPCION</td>
                          <td>NOMBRE DE LA ACTIVIDAD</td>
                          <td> DESCRIP. ACT.</td>
                          <td>OBSERVACION</td>
                          <td>A. FISICO</td>
                          <td>S/.  COST. UNITARIO</td>
                          <td>S/. COSTO. PARCIAL</td>
                      </tr>
                  { histComp.fechas.map((fechas, IndexF)=>
                    
                    fechas.historial.map((Hist, IndexH)=>
                    Hist.descripcion_partida=== ""?<tr key={ IndexH } ><td colSpan="9"></td></tr>:
                      <tr key={ IndexH } >
                          <td>{ fechas.fecha === undefined ?'':fechas.fecha.toUpperCase() } </td>
                          <td>{ Hist.item }</td>
                          <td>{ Hist.descripcion_partida }</td>
                          <td>{ Hist.nombre_actividad }</td>
                          <td>{ Hist.descripcion_actividad }</td>
                          <td>{ Hist.observacion }</td>
                          <td>{ Hist.valor }</td>
                          <td>{ Hist.costo_unitario }</td>
                          <td>{ Hist.parcial }</td>
                      </tr>

                    )
                  )}
                </thead>


              )}
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

export default Report_1;
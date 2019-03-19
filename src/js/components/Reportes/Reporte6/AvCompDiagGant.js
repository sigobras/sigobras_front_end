import React, { Component } from 'react';
import axios from 'axios'
import { FaFilePdf } from "react-icons/fa";
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { logoSigobras, logoGRPuno } from "../Complementos/ImgB64"
import { UrlServer } from '../../Utils/ServerUrlConfig'
    

class AvCompDiagGant extends Component {
  constructor(){
    super();
    this.state={

    }
    this.printDocument=this.printDocument.bind(this)
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
        pdf.text("AVANCE COMPARATIVO DIAGRAMA DE GANT", 100, 18);
        pdf.addImage(logoGRPuno, 'JPEG',10, 4, 100, 10)
        pdf.addImage(logoSigobras, 'JPEG', 270, 4, 15, 11)
        
        var res1 = pdf.autoTableHtmlToJson(document.getElementById('tabgant1'));
        var res2 = pdf.autoTableHtmlToJson(document.getElementById('tabgant2'));
        var res3 = pdf.autoTableHtmlToJson(document.getElementById('tabgant3'));
        var res4 = pdf.autoTableHtmlToJson(document.getElementById('tabgant4'));
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

        pdf.autoTable(res3.columns, res3.data, {
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

        pdf.autoTable(res4.columns, res4.data, {
          theme: 'striped',
          startY: pdf.autoTableEndPosY() + 5,
          styles: {
              cellPadding: 0.8,
              overflow: 'linebreak',
              valign: 'middle',
              halign: 'left',
              lineColor: [0, 0, 0],
              lineWidth: 0.1,
              fontSize: 7
            },

      });
        //pdf.addImage(imgData, 'JPEG', 0, 90);
        window.open(pdf.output('bloburl'), '_blank');
      // })
    ;
  }

  render(){
    return(
      <div>
        <div>
          <li className="lii">
              <a href="#" onClick={this.printDocument} ><FaFilePdf className="text-danger"/> 9.- AVANCE COMPARATIVO DIAGRAMA DE GANT ✔</a>
          </li>
        </div>
        
        <div className="d-none">
          
          <table id="tabgant1" className="table table-bordered">
              <tbody>
                <tr className="d-none">
                  <td></td>
                  <td></td>
                </tr>
                  <tr>
                      <td>OBRA:</td>
                      <td >"MEJORAMIENTO DE LOS SERVICIOS DE EDUCACIÓN INICIAL I.E.I. N° 597 DEL CENTRO POBLADO DE PALCA,</td>
                  </tr>
                  <tr>
                      <td>PERIODO:</td>
                      <td >ENERO 2019</td>
                  </tr>
              </tbody>
          </table>


          <table id="tabgant2" className="table table-bordered">
            <tbody>
              <tr className="d-none">
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>AVANCE ACUMULADO %</td>
                <td rowSpan="3">CHART</td>
              </tr>
              <tr>
                <td>PRESUPUESTO TOTAL S/. 1366992.55</td>
              </tr>
              <tr>
                <td>COSTO DIRECTO S/. 97266666.99</td>
              </tr>
            </tbody>
          </table>


          <table id="tabgant3" className="table table-bordered">
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
                <td>MES</td>
                <td>INICIO</td>
                <td>OCTUBRE</td>
                <td>NOVIEMBRE</td>
                <td>DICIEMBRE</td>
                <td></td>
              </tr>
              <tr>
                <td>FECHA DE INICIO</td>
                <td></td>
                <td>01-Oct</td>
                <td>01-NoV</td>
                <td>01-Dic</td>
                <td></td>
              </tr>
              <tr>
                <td>DIAS PARCIAL</td>
                <td></td>
                <td>10</td>
                <td>30</td>
                <td>31</td>
                <td></td>
              </tr>
              <tr>
                <td>DIAS ACUMULADO</td>
                <td></td>
                <td>31</td>
                <td>40</td>
                <td>71</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <table id="tabgant4" className="table table-bordered">
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
                  <td>COSTO MENSUAL PROGRAMADO</td>
                  <td>727, 395. 92</td>
                  <td>12, 281. 86</td>
                  <td>65, 433. 87</td>
                  <td>167, 384. 89</td>
                  <td>972, 496. 54</td>
                </tr>
                <tr>
                  <td>COSTO ACUMULADO MENSUAL PROGRAMADO</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL PROGRAMADO EN %</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL ACUMULADO PROGRAMADO EN %</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL EJECUTADO</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL ACUMULADO EJECUTADO</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL EJECUTADO EN %</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL ACUMULADO EJECUTADO EN %</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>DESVIACIÓN DE EJECUCION FISICA</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL FINANCIERO</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL ACUMULADO FINANCIERO</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL FINANCIERO EN %</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>AVANCE MENSUAL ACUMULADO FINANCIERO EN %</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>DESVIACION DE EJECUCION FINANCIERA</td>
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
    )
  }
}

export default AvCompDiagGant;
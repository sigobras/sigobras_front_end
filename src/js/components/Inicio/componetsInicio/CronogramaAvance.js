import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { UrlServer } from '../../Utils/ServerUrlConfig'

import ModalIngresoCronoProgramado from './FiltraObras/ModalIngresoCronoProgramado'
import ModalIngresoCronoFinanciero from './FiltraObras/ModalIngresoCronoFinanciero'

class CronogramaAvance extends Component{
	constructor(props){
		super(props);
  }
  
  render(){
    var { dataCrono } = this.props
    const options = {
        chart: {
          type: 'line',
          backgroundColor: '#2e3742',
        },

        legend: {
          itemStyle: {
              color: '#E0E0E3'
          },
          itemHoverStyle: {
              color: '#ffffff'
          },
          itemHiddenStyle: {
              color: '#606063'
          }
        },

        title: {
          text: 'CURVA "S"',
          color: '#ffffff'
        },
        subtitle: {
          text: 'GRAFICO DEL PORCENTAJE DE AVANCE PROGRAMADO VS EJECUTADO ACUMULADO'
        },
        xAxis: {
          categories: dataCrono.mes
        },
        yAxis: {
          title: {
            text: 'Porcentaje % '
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: true
          }
        },
        series: [{
          name: 'Avance programado',
          data: dataCrono.porcentaje_programado
        }, {
          name: 'Avance Fisico',
          data: dataCrono.porcentaje_fisico
        },
        {
          name: 'Avance Financiero',
          data: dataCrono.porcentaje_financiero
        }]
    }

    return(
      <div className="card">
          <div className="card-header text-center">
              <h6>Cronograma de avance</h6>        
          </div>
          <div className="card-body">
            <div className="d-flex">
              <ModalIngresoCronoProgramado ObraId={ this.props.fichaId } costoDirecto={this.props.costoDirecto }/>
              <ModalIngresoCronoFinanciero ObraId={ this.props.fichaId }/>
            </div>

            <HighchartsReact
                highcharts={Highcharts}
                // constructorType={'stockChart'}
                options={options}
            />
            <table className="table table-sm ">
              <thead>
                <tr>
                  <th className="border text-center" colSpan="5">MONTOS VALORIZADOS PROGRAMADOS</th>
                  <th className="border text-center" colSpan="6">MONTOS VALORIZADOS EJECUTADOS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border " colSpan="2">Periodo</td>
                  <td className="border " colSpan="3">Programado</td>
                  <td className="border " colSpan="3">Fisico Ejecutado</td>
                  <td className="border " colSpan="3">Financiero Ejecutado</td>
                </tr>

                <tr>
                  <td className="border ">Nº de informe</td>
                  <td className="border ">Mes del informe</td>
                  <td className="border ">Monto S/.</td>
                  <td className="border ">% Ejecucion programada</td>
                  <td className="border ">% Acumulado</td>
                  <td className="border ">Monto S/.</td>
                  <td className="border ">% Ejecucion programada</td>
                  <td className="border ">% Acumulado</td>
                  <td className="border ">Monto S/.</td>
                  <td className="border ">% Ejecucion programada</td>
                  <td className="border ">% Acumulado</td>
                </tr>

                <tr>
                  <td className="border ">1</td>
                  <td className="border ">4</td>
                  <td className="border "></td>
                  <td className="border "></td>
                  <td className="border ">0</td>
                  <td className="border "></td>
                  <td className="border "></td>
                  <td className="border ">0</td>
                  <td className="border "></td>
                  <td className="border "></td>
                  <td className="border ">0</td>
                </tr>


                <tr>
                  <td className="border" colSpan="2">Total a la Fecha</td>
                  <td className="border ">1235</td>
                  <td className="border ">21313</td>
                  <td className="border  border-bottom-0"></td>
                  <td className="border ">53453453</td>
                  <td className="border ">53543</td>
                  <td className="border  border-bottom-0"></td>
                  <td className="border ">46456</td>
                  <td className="border  ">45654654</td>

                  <td className="border  border-bottom-0 border-right-0"></td>
                </tr>
              </tbody>
            </table>

          </div>
      </div>
    )
  }
};    

export default CronogramaAvance;
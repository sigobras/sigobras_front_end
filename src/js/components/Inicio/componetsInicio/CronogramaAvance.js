import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class CronogramaAvance extends Component{
	constructor(props){
		super(props);
	}
  render(){
    var { dataCrono } = this.props
    const options = {
        chart: {
          type: 'line'
        },
        title: {
          text: 'CURVA "S"'
        },
        // subtitle: {
        //   text: 'ing joven' QUI IRA LA OBRA
        // },
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
            enableMouseTracking: false
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
          <div className="card-header">
              Cronograma de avance                    
          </div>
          <div className="card-body">
            <HighchartsReact
                highcharts={Highcharts}
                // constructorType={'stockChart'}
                options={options}
            />
          </div>
      </div>
    )
  }
};    

export default CronogramaAvance;
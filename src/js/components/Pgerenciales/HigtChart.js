import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios'

import { UrlServer } from '../Utils/ServerUrlConfig'

class HigtChart extends Component {
  constructor(){
    super()
    this.state={
      DataCronograma:[]
    }
  }

  componentDidMount(){
    // CRONOGRAMA DE REPORTE DE CURVA S
      axios.post(`${UrlServer}/getcronograma`,{
        "id_ficha":sessionStorage.getItem("idobra")
    })
    .then((res)=>{
        // console.info('CRONOGRAMA>',res.data)
        this.setState({
            DataCronograma:res.data
        })
    })
    .catch((err)=>{
        console.error('algo salio mal ', err);
  })
  }
    render() {
        var { DataCronograma } = this.state
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
              categories: DataCronograma.mes
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
              data: DataCronograma.porcentaje_programado
            }, {
              name: 'Avance Fisico',
              data: DataCronograma.porcentaje_fisico
            },
            {
              name: 'Avance Financiero',
              data: DataCronograma.porcentaje_financiero
            }]
          }
        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    // constructorType={'stockChart'}
                    options={options}
                />
            </div>
        );
    }
}

export default HigtChart;
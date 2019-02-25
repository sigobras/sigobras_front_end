import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class HigtChart extends Component {
    render() {
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
              categories: ['P 1', 'P 2', 'P 3', 'P 4', 'P 5', 'P 6', 'P 7', 'P 8', 'P 9', 'P 10', 'P 11', 'P 12']
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
              data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
              name: 'Avance Fisico',
              data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            },
                     {
              name: 'Avance Financiero',
              data: [5.9, 9.2, 5.7, 3.5, 15.9, 14.2, 17.0, 16, 1.2, 10.3, 6.6, 10.8]
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
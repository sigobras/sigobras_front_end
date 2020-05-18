export const options = {
            chart: {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#242526'],
                        [1, '#242526']
                    ]
                },

                type: 'column'
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },

            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                },
                text: 'PROGRAMADO' + ' ' + cajaanyo
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                },
                text: 'Obra:' + '' +  sessionStorage.getItem('codigoObra')  //codigo nombre de la obra
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }

                },

                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true,
                title: {
                    text: 'Proyecciones'
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Soles (S/.)'
                },
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                },
                headerFormat: '<span style="font-size:20px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} soles</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true

            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: [

                {
                    name: 'Avance Mensual',
                    data: this.state.chart_data.avance

                }, {
                    name: 'Proyección Aprobada',
                    data: this.state.chart_data.exptec

                }, {
                    name: 'Proyección Variable',
                    data: this.state.chart_data.proyvar

                }

            ]

        };
    
 
module.exports = {
    options
} 
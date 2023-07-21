import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Redondea, mesesShort } from '../../Utils/Funciones';

export default ({ CurvaSdata, codigo, ToggleSoles }) => {
	function redondeo(num) {
		return Math.round((num + Number.EPSILON) * 100) / 100;
	}
	useEffect(() => {
		createDataChart();
	}, []);
	const [DataChart, setDataChart] = useState({});
	async function createDataChart() {
		const labels = [];
		const programado = [];
		const ejecutado = [];
		const financiero = [];
		const financiero_programado = [];

		let programado_acumulado = 0;
		let ejecutado_acumulado = 0;
		let financiero_acumulado = 0;
		let financiero_programado_acumulado = 0;

		CurvaSdata.forEach((item, i) => {
			let label = '';
			if (item.tipo == 'TOTAL') {
				label = 'TOTAL - ' + item.anyo;
			} else {
				label = mesesShort[item.mes - 1] + ' - ' + item.anyo;
			}
			labels.push(label);
			programado_acumulado += item.fisico_programado_monto;
			programado.push(redondeo(programado_acumulado));

			ejecutado_acumulado += item.fisico_monto;
			ejecutado.push(redondeo(ejecutado_acumulado));

			financiero_acumulado += item.financiero_monto;
			financiero.push(redondeo(financiero_acumulado));

			financiero_programado_acumulado += item.financiero_programado_monto;
			financiero_programado.push(redondeo(financiero_programado_acumulado));
		});
		// clean ejecutado
		let fisico_monto_break = true;
		let financiero_monto_break = true;
		let fisico_programado_monto_break = true;
		let financiero_programado_monto_break = true;
		for (let i = CurvaSdata.length - 1; i > 0; i--) {
			const item = CurvaSdata[i];
			if (
				fisico_monto_break &&
				(item.fisico_monto == 0 || item.fisico_monto == null)
			) {
				ejecutado.pop();
			} else {
				fisico_monto_break = false;
			}
			if (
				financiero_monto_break &&
				(item.financiero_monto == 0 || item.financiero_monto == null)
			) {
				financiero.pop();
			} else {
				financiero_monto_break = false;
			}
			if (
				fisico_programado_monto_break &&
				(item.fisico_programado_monto == 0 ||
					item.fisico_programado_monto == null)
			) {
				programado.pop();
			} else {
				fisico_programado_monto_break = false;
			}
			if (
				financiero_programado_monto_break &&
				(item.financiero_programado_monto == 0 ||
					item.financiero_programado_monto == null)
			) {
				financiero_programado.pop();
			} else {
				financiero_programado_monto_break = false;
			}
		}
		const dataChart = {
			labels,
			datasets: [
				{
					name: 'PROGRAMADO',
					data: programado,
					// backgroundColor: "#0080ff",
					color: '#0080ff',
					// fill: false,
				},
				{
					name: 'EJECUTADO',
					data: ejecutado,
					// backgroundColor: "#fd7e14",
					color: '#fd7e14',
					// fill: false,
				},
				{
					name: 'FINANCIERO',
					data: financiero,
					// backgroundColor: "#ffc107",
					color: '#ffc107',
					// fill: false,
				},
				{
					name: 'FINANCIERO PROGRAMADO',
					data: financiero_programado,
					// backgroundColor: "#ffc107",
					color: 'orange',
					// fill: false,
				},
			],
		};
		setDataChart(dataChart);
	}
	const options = {
		chart: {
			backgroundColor: '#242526',
			style: {
				fontFamily: 'Roboto',
				color: '#666666',
			},
		},
		title: {
			text: 'CURVA S',
			align: 'center',
			style: {
				fontFamily: 'Roboto Condensed',
				fontWeight: 'bold',
				color: '#666666',
			},
		},

		subtitle: {
			text: codigo,
		},
		legend: {
			align: 'center',
			verticalAlign: 'bottom',
		},
		tooltip: {
			split: true,
			valueSuffix: ToggleSoles ? ' Soles' : ' %',
		},
		xAxis: {
			categories: DataChart.labels,
			tickmarkPlacement: 'on',
			title: {
				enabled: false,
			},
		},
		yAxis: {
			title: {
				text: 'SOLES',
			},
			labels: {
				formatter: function () {
					return this.value / 1000;
				},
			},
			gridLineColor: '#424242',
			ridLineWidth: 1,
			minorGridLineColor: '#424242',
			inoGridLineWidth: 0.5,
			tickColor: '#424242',
			minorTickColor: '#424242',
			lineColor: '#424242',
		},
		plotOptions: {
			line: {
				dataLabels: {
					enabled: true,
					color: 'white',
					style: {
						textOutline: false,
					},
					formatter: function () {
						return Redondea(this.y) + (!ToggleSoles ? '%' : '');
					},
				},
			},
		},
		series: DataChart.datasets,
	};
	return (
		<div style={{ height: '350px' }}>
			<HighchartsReact
				containerProps={{ style: { height: '100%' } }}
				highcharts={Highcharts}
				options={options}
			/>
		</div>
	);
};

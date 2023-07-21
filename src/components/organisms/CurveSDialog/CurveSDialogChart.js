import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import { redondeo, mesesShort } from '../../../js/components/Utils/Funciones';

const CurveSDialogChart = ({ CurvaSdata, codigo, ToggleSoles }) => {
	const [DataChart, setDataChart] = useState({});

	useEffect(() => {
		createDataChart();
	}, []);

	const createDataChart = () => {
		let programado_acumulado = 0;
		let ejecutado_acumulado = 0;
		let financiero_acumulado = 0;
		let financiero_programado_acumulado = 0;

		const chartData = CurvaSdata.reduce(
			(chartData, item) => {
				const label =
					item.tipo === 'TOTAL'
						? `TOTAL - ${item.anyo}`
						: `${mesesShort[item.mes - 1]} - ${item.anyo}`;

				chartData.labels.push(label);

				programado_acumulado += item.fisico_programado_monto;
				chartData.programado.push(redondeo(programado_acumulado));

				ejecutado_acumulado += item.fisico_monto;
				chartData.ejecutado.push(redondeo(ejecutado_acumulado));

				financiero_acumulado += item.financiero_monto;
				chartData.financiero.push(redondeo(financiero_acumulado));

				financiero_programado_acumulado += item.financiero_programado_monto;
				chartData.financiero_programado.push(
					redondeo(financiero_programado_acumulado),
				);

				return chartData;
			},
			{
				labels: [],
				programado: [],
				ejecutado: [],
				financiero: [],
				financiero_programado: [],
			},
		);

		// Eliminar valores ejecutado, financiero, programado y financiero_programado si son 0 o nulos
		const keys = [
			'ejecutado',
			'financiero',
			'programado',
			'financiero_programado',
		];
		keys.forEach(key => {
			let breakFlag = true;

			for (let i = CurvaSdata.length - 1; i > 0; i--) {
				const item = CurvaSdata[i];

				if (breakFlag && (item[key] === 0 || item[key] === null)) {
					chartData[key].pop();
				} else {
					breakFlag = false;
				}
			}
		});

		setDataChart(chartData);
	};

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
						return redondeo(this.y) + (!ToggleSoles ? '%' : '');
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

CurveSDialogChart.propTypes = {
	CurvaSdata: PropTypes.array.isRequired,
	codigo: PropTypes.string.isRequired,
	ToggleSoles: PropTypes.bool,
};

CurveSDialogChart.defaultProps = {
	ToggleSoles: false,
};

export default CurveSDialogChart;

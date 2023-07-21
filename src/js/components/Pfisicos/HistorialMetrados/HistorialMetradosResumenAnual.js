import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import { Redondea, mesesShort } from '../../Utils/Funciones';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default ({ Anyo }) => {
	useEffect(() => {
		fetchResumenAnualData();
	}, []);
	// resumen anual
	const [ResumenAnualData, setResumenAnualData] = useState({ data: [] });
	async function fetchResumenAnualData() {
		const request = await axios.post(`${UrlServer}/getHistorialAnyosResumen2`, {
			id_ficha: sessionStorage.getItem('idobra'),
			anyo: Anyo,
		});
		setResumenAnualData(request.data);
		fetchResumenAnualDataChart(request.data);
	}
	const [ResumenAnualDataChart, setResumenAnualDataChart] = useState();
	const [ResumenAnualDataChartCategories, setResumenAnualDataChartCategories] =
		useState();
	async function fetchResumenAnualDataChart(data) {
		const mes_inicial = data.mes_inicial;
		const mes_final = data.mes_final;
		const series = [];
		const categories = [];
		data.data.forEach(item => {
			const data = [];
			for (let i = mes_inicial; i <= mes_final; i++) {
				data.push(Number(Number(item['m' + i]).toFixed(2)));
			}
			series.push({
				name: item.numero,
				data,
			});
		});
		for (let i = mes_inicial; i <= mes_final; i++) {
			categories.push(mesesShort[i - 1]);
		}
		setResumenAnualDataChart(series);
		setResumenAnualDataChartCategories(categories);
	}
	const OptionsResumenAnualDataChart = {
		colors: [
			'#0080ff',
			'#d35400',
			'#2980b9',
			'#2ecc71',
			'#f1c40f',
			'#2c3e50',
			'#7f8c8d',
			'#cc00ff',
			'#dc3545',
			'#289ba7',
			'#2855a7',
		],
		chart: {
			type: 'area',
			backgroundColor: '#242526',
			style: {
				fontFamily: 'Roboto',
				color: '#666666',
			},
		},
		title: {
			text: 'RESUMEN ESTADISTICO DE VALORIZACIÓN MENSUAL',
			align: 'center',
			style: {
				fontFamily: 'Roboto Condensed',
				fontWeight: 'bold',
				color: '#666666',
			},
		},
		legend: {
			align: 'center',
			verticalAlign: 'bottom',
			itemStyle: {
				color: '#424242',
				color: '#ffffff',
			},
		},
		subtitle: {
			text: 'General',
		},
		xAxis: {
			categories: ResumenAnualDataChartCategories,
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
		tooltip: {
			split: true,
			valueSuffix: ' Soles',
		},
		plotOptions: {
			area: {
				stacking: 'normal',
				lineColor: '#666666',
				lineWidth: 1,
				marker: {
					lineWidth: 1,
					lineColor: '#666666',
				},
			},
		},
		series: ResumenAnualDataChart,
	};
	return (
		<div style={{ overflowX: 'auto' }}>
			<HighchartsReact
				highcharts={Highcharts}
				options={OptionsResumenAnualDataChart}
			/>
			<table className='table table-sm small table-hover'>
				<thead>
					<tr>
						<th>N°</th>
						<th>NOMBRE</th>
						<th>PRESUPUESTO</th>
						{(() => {
							const rows = [];
							for (
								let i = ResumenAnualData.mes_inicial;
								i <= ResumenAnualData.mes_final;
								i++
							) {
								rows.push(<th>{mesesShort[i - 1]}</th>);
								rows.push(<th>%</th>);
							}
							return rows;
						})()}
						<th>AVANCE</th>
						<th>SALDO</th>
					</tr>
				</thead>
				<tbody>
					{ResumenAnualData.data.map((item, i) => (
						<tr key={i}>
							<td className='historial-metrados-sticky1'>{item.numero}</td>
							<td
								className='historial-metrados-sticky2'
								style={{ whiteSpace: 'nowrap' }}
							>
								{item.nombre}
							</td>
							<td>{Redondea(item.presupuesto)}</td>
							{(() => {
								const rows = [];
								for (
									let i = ResumenAnualData.mes_inicial;
									i <= ResumenAnualData.mes_final;
									i++
								) {
									rows.push(<td>{Redondea(item['m' + i])} </td>);
									rows.push(
										<td style={{ color: '#0080ff' }}>
											{item['m' + i] > 0
												? Redondea((item['m' + i] / item.presupuesto) * 100) +
												  '%'
												: ''}
										</td>,
									);
								}
								return rows;
							})()}

							<td>{Redondea(item.valor, 4)}</td>
							<td>
								{/* se calcula saldo */}
								{(() => {
									let saldo = item.presupuesto;
									for (
										let i = ResumenAnualData.mes_inicial;
										i <= ResumenAnualData.mes_final;
										i++
									) {
										saldo -= item['m' + i];
									}
									return Redondea(saldo);
								})()}
							</td>
						</tr>
					))}
					<tr className='resplandPartida font-weight-bolder'>
						<td colSpan='2'>TOTAL</td>
						<td>
							{(() => {
								let presupuesto_total = 0;
								ResumenAnualData.data.forEach(item => {
									presupuesto_total += item.presupuesto;
								});
								return Redondea(presupuesto_total);
							})()}
						</td>
						{(() => {
							let presupuesto_total = 0;
							ResumenAnualData.data.forEach(item => {
								presupuesto_total += item.presupuesto;
							});
							const rows = [];
							for (
								var i = ResumenAnualData.mes_inicial;
								i <= ResumenAnualData.mes_final;
								i++
							) {
								var avance_total = 0;
								ResumenAnualData.data.forEach(item => {
									avance_total += item['m' + i];
								});
								rows.push(<td>{Redondea(avance_total)} </td>);
								rows.push(
									<td style={{ color: '#0080ff' }}>
										{avance_total > 0
											? Redondea((avance_total / presupuesto_total) * 100) + '%'
											: ''}
									</td>,
								);
							}
							return rows;
						})()}
						<td>
							{(() => {
								let presupuesto_total = 0;
								ResumenAnualData.data.forEach(item => {
									presupuesto_total += item.valor;
								});
								return Redondea(presupuesto_total);
							})()}
						</td>
						<td>
							{/* se calcula saldo */}
							{(() => {
								let saldo_total = 0;
								ResumenAnualData.data.forEach((item, i) => {
									let presupuesto = item.presupuesto;
									for (
										var i = ResumenAnualData.mes_inicial;
										i <= ResumenAnualData.mes_final;
										i++
									) {
										presupuesto -= item['m' + i];
									}
									saldo_total += presupuesto;
								});

								return Redondea(saldo_total);
							})()}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

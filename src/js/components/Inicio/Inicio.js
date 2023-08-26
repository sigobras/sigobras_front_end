import React, {
	forwardRef,
	useEffect,
	useState,
	useImperativeHandle,
} from 'react';
import axios from 'axios';
import { FaList, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button, Input, Tooltip } from 'reactstrap';

import { UrlServer } from '../Utils/ServerUrlConfig';
import FinancieroBarraPorcentaje from './FinancieroBarraPorcentaje';
import FisicoBarraPorcentaje from './FisicoBarraPorcentaje';
import ModalListaPersonal from './ListaPersonal';
import Curva_S from './Cuva_S';
import { Redondea, hexToRgb, fechaFormatoClasico } from '../Utils/Funciones';
import Obras_labels_edicion from './Obras_labels_edicion';
import CarouselNavs from './Carousel/CarouselNavs';
import bannerImage from '../../../../public/images/banner.jpg';

import '../../../css/inicio.css';
import './inicio.css';
export default ({ recargar }) => {
	//funciones
	useEffect(() => {
		fetchProvincias();
		if (!sessionStorage.getItem('provinciaSeleccionada')) {
			setProvinciaSeleccionada(sessionStorage.getItem('provinciaSeleccionada'));
		}
		if (!sessionStorage.getItem('provinciaSeleccionada')) {
			fetchComunicados();
		}
	}, []);
	//comunicados
	const [Comunicados, setComunicados] = useState([]);
	async function fetchComunicados() {
		var res = await axios.get(`${UrlServer}/v1/obrasComunicados`, {
			params: {
				id_ficha: sessionStorage.getItem('idobra'),
			},
		});
		console.log('comunicados ', res);
		setComunicados(res.data);
	}

	function calcular_dias(fecha_inicio, fecha_final) {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const firstDate = new Date(fecha_inicio);
		const secondDate = new Date(fecha_final);
		var days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
		return days || 0;
	}
	//labels
	const [RefLabels, setRefLabels] = useState([]);
	function recargarObraLabels(id_ficha) {
		RefLabels[id_ficha].recarga();
	}
	//componentes
	const [ObraComponentesSeleccionada, setObraComponentesSeleccionada] =
		useState({});
	async function onChangeObraComponentesSeleccionada(id_ficha) {
		setComponentes([]);
		if (ObraComponentesSeleccionada == id_ficha) {
			setObraComponentesSeleccionada(-1);
		} else {
			setObraComponentesSeleccionada(id_ficha);
			fetchComponentes(id_ficha);
			fetchDatosCostosIndirectos(id_ficha);
		}
	}
	//componentes
	const [Componentes, setComponentes] = useState([]);
	async function fetchComponentes(id_ficha) {
		var res = await axios.get(`${UrlServer}/v1/componentes`, {
			params: {
				id_ficha,
			},
		});
		setComponentes(res.data);
	}
	const [DatosCostosIndirectos, setDatosCostosIndirectos] = useState([]);
	const [DatosCostosIndirectosCantidad, setDatosCostosIndirectosCantidad] =
		useState(0);
	async function fetchDatosCostosIndirectos(id_ficha) {
		const res = await axios.get(
			`${UrlServer}/v1/obrasCostosIndirectos/adicionales`,
			{
				params: {
					id_ficha,
				},
			}
		);
		if (Array.isArray(res.data.data)) setDatosCostosIndirectos(res.data.data);
		setDatosCostosIndirectosCantidad(res.data.cantidad);
	}

	// FILTROS
	//provincias
	const [Provincias, setProvincias] = useState([]);
	async function fetchProvincias() {
		var res = await axios.get(`${UrlServer}/v1/unidadEjecutora`, {
			params: {
				id_acceso: sessionStorage.getItem('idacceso'),
			},
		});
		setProvincias(res.data);
		if (!sessionStorage.getItem('provinciaSeleccionada')) {
			sessionStorage.setItem('provinciaSeleccionada', 0);
		} else {
			setProvinciaSeleccionada(sessionStorage.getItem('provinciaSeleccionada'));
		}
	}
	const [ProvinciaSeleccionada, setProvinciaSeleccionada] = useState(0);

	//sectores
	const [Sectores, setSectores] = useState([]);
	const [SectoreSeleccionado, setSectoreSeleccionado] = useState(0);
	async function fetchSectores() {
		var res = await axios.get(`${UrlServer}/v1/sectores`, {
			params: {
				id_acceso: sessionStorage.getItem('idacceso'),
				id_unidadEjecutora: ProvinciaSeleccionada,
			},
		});
		setSectores(res.data);
	}
	//estados
	const [EstadosObra, setEstadosObra] = useState([]);
	const [EstadosObraeleccionada, setEstadosObraeleccionada] = useState(0);
	async function fetchEstadosObra() {
		var res = await axios.get(`${UrlServer}/v1/obrasEstados`, {
			params: {
				id_acceso: sessionStorage.getItem('idacceso'),
			},
		});
		setEstadosObra(res.data);
	}
	//obras
	const [Obras, setObras] = useState([]);
	async function fetchObras() {
		var res = await axios.get(`${UrlServer}/v1/obras`, {
			params: {
				id_acceso: sessionStorage.getItem('idacceso'),
				id_unidadEjecutora: ProvinciaSeleccionada,
				idsectores: SectoreSeleccionado,
				id_Estado: EstadosObraeleccionada,
				sort_by: 'poblacion-desc',
			},
		});
		console.log('obras', res.data);
		setObras(res.data);
		if (!sessionStorage.getItem('idobra')) {
			recargar(res.data[0]);
		}
	}

	const [LabelsHabilitado, setLabelsHabilitado] = useState(false);
	useEffect(() => {
		fetchSectores();
		setSectoreSeleccionado(0);
		fetchEstadosObra();
		setEstadosObraeleccionada(0);
	}, [ProvinciaSeleccionada]);

	useEffect(() => {
		if (ProvinciaSeleccionada != -1) {
			fetchObras();
		}
	}, [ProvinciaSeleccionada, SectoreSeleccionado, EstadosObraeleccionada]);

	return (
		<div>
			{Comunicados.map((comunicado, index) => (
				<div key={index} className='aviso'>
					<h6 className='textoaviso'>COMUNICADO: </h6>
					<p> -- {comunicado.texto_mensaje}</p>
				</div>
			))}
			<div className='banner-container'>
				<img src={bannerImage} />
			</div>

			<div
				style={{
					display: 'flex',
				}}
			>
				<Input
					type='select'
					onChange={e => {
						setProvinciaSeleccionada(e.target.value);
						sessionStorage.setItem('provinciaSeleccionada', e.target.value);
					}}
					value={ProvinciaSeleccionada}
					style={{
						backgroundColor: '#171819',
						borderColor: '#171819',
						color: '#ffffff',
						cursor: 'pointer',
					}}
				>
					<option value='0'>Todas las provincias</option>
					{Provincias.map((item, i) => (
						<option key={i} value={item.id_unidadEjecutora}>
							{item.nombre}
						</option>
					))}
				</Input>
				<Input
					type='select'
					onChange={e => setSectoreSeleccionado(e.target.value)}
					value={SectoreSeleccionado}
					style={{
						backgroundColor: '#171819',
						borderColor: '#171819',
						color: '#ffffff',
						cursor: 'pointer',
					}}
				>
					<option value='0'>Todos los sectores</option>
					{Sectores.map((item, i) => (
						<option key={i} value={item.idsectores}>
							{item.nombre}
						</option>
					))}
				</Input>
				<Input
					type='select'
					onChange={e => setEstadosObraeleccionada(e.target.value)}
					value={EstadosObraeleccionada}
					style={{
						backgroundColor: '#171819',
						borderColor: '#171819',
						color: '#ffffff',
						cursor: 'pointer',
					}}
				>
					<option value='0'>Todos los estados</option>
					{EstadosObra.map((item, index) => (
						<option key={index} value={item.id_Estado}>
							{item.nombre}
						</option>
					))}
				</Input>
				{LabelsHabilitado ? (
					<Button
						onClick={() => setLabelsHabilitado(!LabelsHabilitado)}
						color='success'
					>
						<FaEye />
					</Button>
				) : (
					<Button
						onClick={() => setLabelsHabilitado(!LabelsHabilitado)}
						color='danger'
					>
						<FaEyeSlash />
					</Button>
				)}
			</div>
			<table className='table table-dark'>
				<thead>
					<tr>
						<th className='text-center'>N°</th>
						<th>OBRA</th>
						<th className='text-center'>ESTADO</th>
						<th
							style={{ width: '70px', minWidth: '50px', textAlign: 'center' }}
						>
							UDM
						</th>
						<th className='text-center'>AVANCE </th>
						<th className='text-center'>OPCIONES</th>
					</tr>
				</thead>
				<tbody>
					{Obras.map((item, i) => [
						(i == 0 ||
							(i > 0 &&
								item.unidad_ejecutora_nombre !=
									Obras[i - 1].unidad_ejecutora_nombre)) && (
							<tr key={i}>
								<td
									colSpan='8'
									style={{
										color: '#cecece',
										fontSize: '1.2rem',
										fontWeight: '700',
									}}
								>
									{item.unidad_ejecutora_nombre}
								</td>
							</tr>
						),

						(i == 0 ||
							item.unidad_ejecutora_nombre !=
								Obras[i - 1].unidad_ejecutora_nombre ||
							(i > 0 && item.sector_nombre != Obras[i - 1].sector_nombre)) && (
							<tr key={i + '2'}>
								<td
									colSpan='8'
									style={{
										color: '#ffa500',
										fontSize: '1rem',
										fontWeight: '700',
									}}
								>
									{item.sector_nombre}
								</td>
							</tr>
						),
						<tr
							key={item.id_ficha}
							style={
								sessionStorage.getItem('idobra') == item.id_ficha
									? {
											backgroundColor: '#171819',
									  }
									: {}
							}
						>
							<td>{i + 1}</td>
							<td
								onClick={() => {
									recargar(item);
								}}
								style={{
									cursor: 'pointer',
								}}
							>
								<Button
									type='button'
									style={{
										borderRadius: '13px',
										// padding: " 0 10px",
										margin: '5px',
										backgroundColor: '#171819',
									}}
									// onClick={() => { recargar(item) }}
								>
									{item.codigo}
								</Button>
								{item.g_meta + '/CUI - ' + item.codigo_unificado}
								<div>
									<span
										style={{
											color: '#17a2b8',
										}}
									>
										PRESUPUESTO S./{Redondea(item.g_total_presu)}
									</span>{' '}
									<span
										style={{
											color: 'orange',
										}}
									>
										SALDO FINANCIERO S./
										{Redondea(
											item.g_total_presu - item.avancefinanciero_acumulado
										)}
									</span>{' '}
									<span
										style={{
											color: '#17a2b8',
										}}
									>
										PIM 2021 S./
										{Redondea(item.pim_anyoactual)}
									</span>{' '}
									<span
										style={{
											color: 'orange',
										}}
									>
										META 2021 -{item.meta_anyoactual}
									</span>
								</div>
								<Plazos_info item={item} />
							</td>
							<td>
								<EstadoObra item={item} />
							</td>
							<td className='text-center'>
								{calcular_dias(item.avancefisico_ultimafecha, new Date()) - 1}{' '}
								días{' '}
								<div>{fechaFormatoClasico(item.avancefisico_ultimafecha)}</div>
							</td>
							<td
								style={{
									width: '15%',
								}}
							>
								<FisicoBarraPorcentaje
									tipo='barra'
									id_ficha={item.id_ficha}
									avance={item.avancefisico_acumulado}
									total={item.presupuesto_costodirecto}
								/>
								<FinancieroBarraPorcentaje
									tipo='barra'
									id_ficha={item.id_ficha}
									avance={item.avancefinanciero_acumulado}
									total={item.g_total_presu}
								/>
							</td>
							<td>
								<div className='d-flex'>
									<button
										className='btn btn-outline-info btn-sm mr-1'
										title='Avance Componentes'
										onClick={() =>
											onChangeObraComponentesSeleccionada(item.id_ficha)
										}
									>
										<FaList />
									</button>
									<ModalListaPersonal
										id_ficha={item.id_ficha}
										codigo_obra={item.codigo}
									/>
									{/* <PersonalCostoDirecto /> */}
								</div>
								<div className='d-flex'>
									<Curva_S Obra={item} />
									<Obras_labels_edicion
										id_ficha={item.id_ficha}
										recargarObraLabels={recargarObraLabels}
										codigo={item.codigo}
									/>
									<CarouselNavs id_ficha={item.id_ficha} codigo={item.codigo} />
								</div>
							</td>
						</tr>,
						LabelsHabilitado && (
							<tr
								style={
									sessionStorage.getItem('idobra') == item.id_ficha
										? {
												backgroundColor: '#171819',
										  }
										: {}
								}
								key={i + '3'}
							>
								<td
									style={{
										'border-top': 'none',
									}}
								></td>
								<td
									colSpan='8'
									style={{
										'border-top': 'none',
									}}
								>
									<Obras_labels
										key={item.id_ficha}
										id_ficha={item.id_ficha}
										ref={ref => {
											var clone = RefLabels;
											clone[item.id_ficha] = ref;
											setRefLabels(clone);
										}}
									/>
								</td>
							</tr>
						),
						ObraComponentesSeleccionada == item.id_ficha && (
							<tr key={'1.' + i}>
								<td colSpan='8'>
									<table
										className='table table-bordered table-sm'
										style={{
											width: '100%',
										}}
									>
										<thead>
											<tr>
												<th>N°</th>
												<th>COMPONENTE</th>
												<th>PRESUPUESTO CD</th>
												<th>EJECUCIÓN FÍSICA</th>
												<th>BARRRA PORCENTUAL</th>
											</tr>
										</thead>
										<tbody style={{ backgroundColor: '#333333' }}>
											{Componentes.map(item => (
												<tr key={Componentes.id_componente}>
													<td>{item.numero}</td>

													<td style={{ fontSize: '0.75rem', color: '#8caeda' }}>
														{item.nombre}
													</td>

													<td> S/. {Redondea(item.presupuesto)}</td>
													<td>
														<ComponenteAvance
															id_componente={item.id_componente}
														/>
													</td>
													<td>
														<ComponenteBarraPorcentaje
															id_componente={item.id_componente}
															componente={item}
														/>
													</td>
												</tr>
											))}
											<tr>
												<td>TOTAL COSTO DIRECTO</td>

												<td style={{ fontSize: '0.75rem', color: '#8caeda' }}>
													{item.nombre}
												</td>

												<td>
													{' '}
													S/.{' '}
													{Redondea(
														Componentes.reduce(
															(acc, item2) => acc + item2.presupuesto,
															0
														)
													)}
												</td>
												<td></td>
												<td></td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						),
					])}
				</tbody>
			</table>
		</div>
	);
};
//componente de estado de obra
function EstadoObra({ item }) {
	return (
		<Button
			type='button'
			style={{
				borderRadius: '13px',
				'--perceived-lightness':
					'calc((var(--label-r)*0.2126 + var(--label-g)*0.7152 + var(--label-b)*0.0722)/255)',
				'--lightness-switch':
					' max(0,min(calc((var(--perceived-lightness) - var(--lightness-threshold))*-1000),1))',
				padding: ' 0 10px',
				lineheight: ' 22px!important',
				'--lightness-threshold': ' 0.6',
				'--background-alpha': ' 0.18',
				'--border-alpha': ' 0.3',
				'--lighten-by':
					' calc((var(--lightness-threshold) - var(--perceived-lightness))*100*var(--lightness-switch))',
				background:
					' rgba(var(--label-r),var(--label-g),var(--label-b),var(--background-alpha))',
				color:
					' hsl(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%))',
				bordercolor:
					' hsla(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%),var(--border-alpha))',
				'--label-r': hexToRgb(item.estadoobra_color).r,
				'--label-g': hexToRgb(item.estadoobra_color).g,
				'--label-b': hexToRgb(item.estadoobra_color).b,
				'--label-h': hexToRgb(item.estadoobra_color).h,
				'--label-s': hexToRgb(item.estadoobra_color).s,
				'--label-l': hexToRgb(item.estadoobra_color).l,
				margin: '5px',
				cursor: 'default',
			}}
		>
			{item.estadoobra_nombre}
		</Button>
	);
}
//avancecomponente
function ComponenteAvance({ id_componente }) {
	useEffect(() => {
		fetchData();
	}, []);
	const [ComponenteAvance, setComponenteAvance] = useState(0);
	async function fetchData() {
		var res = await axios.get(`${UrlServer}/v1/avance/componente`, {
			params: {
				id_componente,
			},
		});
		setComponenteAvance(res.data.avance);
	}
	return <div>{Redondea(ComponenteAvance)}</div>;
}
function ComponenteBarraPorcentaje({ id_componente, componente }) {
	useEffect(() => {
		fetchData();
	}, []);
	const [ComponenteAvancePorcentaje, setComponenteAvancePorcentaje] =
		useState(0);
	async function fetchData() {
		var res = await axios.get(`${UrlServer}/v1/avance/componente`, {
			params: {
				id_componente,
			},
		});
		setComponenteAvancePorcentaje(
			(res.data.avance / componente.presupuesto) * 100
		);
	}
	return (
		<div
			style={{
				width: '100%',
				height: '20px',
				textAlign: 'center',
			}}
		>
			<div
				style={{
					height: '5px',
					backgroundColor: '#c3bbbb',
					borderRadius: '2px',
					position: 'relative',
				}}
			>
				<div
					style={{
						width: `${
							ComponenteAvancePorcentaje <= 100
								? ComponenteAvancePorcentaje
								: 100
						}%`,
						height: '100%',
						// boxShadow:'0 0 12px #c3bbbb',
						backgroundColor:
							ComponenteAvancePorcentaje > 95
								? '#e6ff00'
								: ComponenteAvancePorcentaje > 50
								? '#ffbf00'
								: '#ff2e00',
						borderRadius: '2px',
						transition: 'all .9s ease-in',
						position: 'absolute',
					}}
				/>
				<span style={{ position: 'inherit', fontSize: '0.8rem', top: '4px' }}>
					{Redondea(ComponenteAvancePorcentaje)} %
				</span>
			</div>
		</div>
	);
}
const Obras_labels = forwardRef(({ id_ficha }, ref) => {
	useImperativeHandle(ref, () => ({
		recarga() {
			fetchLabels();
		},
	}));
	useEffect(() => {
		fetchLabels();
	}, []);
	const [Labels, setLabels] = useState([]);
	async function fetchLabels() {
		var res = await axios.get(`${UrlServer}/v1/obrasLabels/obras`, {
			params: {
				id_ficha,
			},
		});
		if (Array.isArray(res.data)) setLabels(res.data);
	}
	const [tooltipOpen, setTooltipOpen] = useState(0);
	const toggle = id => {
		if (id == tooltipOpen) {
			setTooltipOpen(0);
		} else {
			setTooltipOpen(id);
		}
	};
	async function quitarObraLabel() {
		if (confirm('Esta seguro de quitar esta etiqueta?')) {
			fetchLabels(id_ficha);
		}
	}
	return (
		<div>
			{Labels.map((item, i) => [
				<Button
					key={i + '1'}
					type='button'
					style={{
						borderRadius: '13px',
						'--perceived-lightness':
							'calc((var(--label-r)*0.2126 + var(--label-g)*0.7152 + var(--label-b)*0.0722)/255)',
						'--lightness-switch':
							' max(0,min(calc((var(--perceived-lightness) - var(--lightness-threshold))*-1000),1))',
						padding: ' 0 10px',
						lineheight: ' 22px!important',
						'--lightness-threshold': ' 0.6',
						'--background-alpha': ' 0.18',
						'--border-alpha': ' 0.3',
						'--lighten-by':
							' calc((var(--lightness-threshold) - var(--perceived-lightness))*100*var(--lightness-switch))',
						background:
							' rgba(var(--label-r),var(--label-g),var(--label-b),var(--background-alpha))',
						color:
							' hsl(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%))',
						bordercolor:
							' hsla(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%),var(--border-alpha))',
						'--label-r': hexToRgb(item.color).r,
						'--label-g': hexToRgb(item.color).g,
						'--label-b': hexToRgb(item.color).b,
						'--label-h': hexToRgb(item.color).h,
						'--label-s': hexToRgb(item.color).s,
						'--label-l': hexToRgb(item.color).l,
						margin: '5px',
					}}
					id={'Tooltip-' + item.id + '-' + id_ficha}
					onClick={() => {
						quitarObraLabel();
					}}
				>
					{item.nombre}
				</Button>,
				<Tooltip
					key={i + '2'}
					placement={'bottom'}
					isOpen={tooltipOpen == item.id}
					target={'Tooltip-' + item.id + '-' + id_ficha}
					toggle={() => toggle(item.id)}
				>
					{item.descripcion}
				</Tooltip>,
			])}
		</div>
	);
});
function Plazos_info({ item }) {
	return (
		<span>
			{item.plazoinicial_fecha && (
				<span
					style={{
						color: '#17a2b8',
					}}
				>
					Inicio de obra
				</span>
			)}{' '}
			<span>{fechaFormatoClasico(item.plazoinicial_fecha)}</span>{' '}
			{!item.plazoaprobado_ultimo_fecha &&
				!item.plazosinaprobar_ultimo_fecha && (
					<>
						<span
							style={{
								color: '#17a2b8',
							}}
						>
							Fecha de culminación
						</span>{' '}
						<span>{fechaFormatoClasico(item.plazoinicial_fechafinal)}</span>
					</>
				)}{' '}
			{item.plazoaprobado_ultimo_fecha && (
				<span
					style={{
						color: '#17a2b8',
					}}
				>
					Ultimo plazo aprobado
				</span>
			)}{' '}
			<span>{fechaFormatoClasico(item.plazoaprobado_ultimo_fecha)}</span>{' '}
			{item.plazosinaprobar_ultimo_fecha && (
				<span
					style={{
						color: '#17a2b8',
					}}
				>
					Ultimo plazo sin aprobar
				</span>
			)}{' '}
			<span>{fechaFormatoClasico(item.plazosinaprobar_ultimo_fecha)}</span>
		</span>
	);
}

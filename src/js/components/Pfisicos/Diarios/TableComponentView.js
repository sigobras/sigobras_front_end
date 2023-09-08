import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FaCircle, FaSuperpowers } from 'react-icons/fa';
import {
	MdArrowDropDownCircle,
	MdCancel,
	MdChevronLeft,
	MdChevronRight,
	MdFlashOn,
	MdAssignmentAdd,
	MdLibraryBooks,
	MdWatch,
	MdVisibility,
	MdMonetizationOn,
} from 'react-icons/md';
import {
	Button,
	CardBody,
	InputGroup,
	UncontrolledPopover,
	InputGroupText,
} from 'reactstrap';
import { Redondea } from '../../Utils/Funciones';
import BarraPorcentajeAvancePartida from './components/BarraPorcentajeAvancePartida';
import ModalPartidaFoto from './components/ModalPartidaFoto';
import PartidasChat from '../../../libs/PartidasChat';
import BarraPorcentajeAvanceActividad from './components/BarraPorcentajeAvanceActividad';
import ModalIngresoMetrado from './components/ModalIngresoMetrado';
import { TiWarning } from 'react-icons/ti';
import ModalMayorMetradoSave from './components/ModalMayorMetradoSave';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import ModalDeleteActividadPartida from './components/ModalDeleteActividadPartida';
import { ToastContainer } from 'react-toastify';

const TableComponentsView = ({
	TipoComponenteSelecccionado,
	Permisos,
	ComponenteSelecccionado,
	Partidas,
	PartidaSelecccionado,
	onChangePartidasSeleccion,
	handleDeletePartida,
	TogglePartidasEstilo,
	Actividades,
	fectchActividades,
	RefActividades,
	setRefActividades,
	handleDeleteActivity,
	saveActividadMayorMetradoOnMM,
	savePartidaMayorMetrado,
	updateActividadMayorMetradoOnMM,
	Categorias,
	CategoriasComponente,
	MenuCategorias,
	MenuCategoriasSeleccionado,
	onChangeMenuCategorias,
	Prioridades,
	MenuPrioridades,
	MenuPrioridadesSeleccionado,
	onChangeMenuPrioridades,
	toggleMenuPrioridades,
	toggleMenuCategorias,
	CantidadPaginasPartidas,
	paginatorRef,
	PaginaActual,
	ConteoPartidas,
	RefPartidas,
	setRefPartidas,
	onChangeCantidadPaginasPartidas,
	onChangePaginaActual,
	recargaComponenteMensajes,
	EstadoObra,
	onSaveMetrado,
}) => {
	return (
		<CardBody>
			<table
				className='table table-dark'
				style={
					!TogglePartidasEstilo
						? {
							opacity: 0,
							pointerEvents: 'none',
						}
						: {
							transition: 'opacity 0.5s',
							opacity: 1,
						}
				}
			>
				<thead className='resplandPartida'>
					<tr>
						<th></th>
						<th style={{ width: '39px' }}>
							<MdArrowDropDownCircle
								size={20}
								id='FiltrarPor'
								color={MenuPrioridadesSeleccionado.color}
							/>
							<UncontrolledPopover
								trigger='click'
								placement='bottom'
								target='FiltrarPor'
							>
								<div
									title='Busqueda por prioridad - color'
									className='prioridad'
									onClick={() => toggleMenuPrioridades()}
									style={{ color: MenuPrioridadesSeleccionado.color }}
								>
									<FaCircle size={17} />
								</div>
								<div
									title='Busqueda por prioridad - ícono'
									className='prioridad'
									onClick={() => toggleMenuCategorias()}
								>
									{MenuCategoriasSeleccionado.nombre}
								</div>
								{
									//selecciona circulo para filtrar por color
									MenuPrioridades && (
										<div
											style={{
												background: '#3a3b3c',
												width: '60px',
												height: '60px',
												borderRadius: '50%',
												top: '0px',
												position: 'absolute',

												left: '-20px',
											}}
										>
											<div className='menuCirculo' style={{ zIndex: '20' }}>
												{Prioridades.map((priori, IPriori) => (
													<div
														className='circleColorFilter'
														style={{ background: priori.color }}
														onClick={() => onChangeMenuPrioridades(priori)}
														key={IPriori}
													/>
												))}
												<div
													className='circleColorFilter'
													onClick={() =>
														onChangeMenuPrioridades({ id_prioridad: 0 })
													}
												>
													<FaCircle size={15} color={'#171619'} />
												</div>
											</div>
										</div>
									)
								}

								{
									// iconos circulares para hacer el filtro segun seleccion de un icono
									MenuCategorias && (
										<div
											style={{
												background: '#3a3b3c',
												width: '60px',
												height: '60px',
												borderRadius: '50%',
												top: '0px',
												position: 'absolute',
												left: '-20px',
											}}
										>
											{CategoriasComponente.map((item, j) => (
												<div
													className='circleIconoFiltrar'
													onClick={() => onChangeMenuCategorias(item)}
													key={j}
												>
													<span className='spanUbi'> {item.nombre} </span>
												</div>
											))}
											<div
												className='circleIconoFiltrar'
												onClick={() =>
													onChangeMenuCategorias({
														id_iconoCategoria: 0,
														nombre: <MdCancel size={17} />,
													})
												}
											>
												<span className='spanUbi'>
													{' '}
													<MdCancel size={17} />{' '}
												</span>
											</div>
										</div>
									)
								}
							</UncontrolledPopover>
						</th>
						<th>ITEM</th>
						<th>DESCRIPCIÓN</th>
						<th>METRADO</th>
						<th>P/U </th>
						<th>P/P </th>
						<th width='20%'>BARRA DE PROGRESO</th>
						<th> % </th>
						<th style={{ width: '32px' }}></th>
					</tr>
				</thead>
				<tbody>
					{Partidas.map(item => [
						<tr
							key={item.id_partida}
							className={
								item.tipo === 'titulo'
									? 'font-weight-bold text-info icoVer'
									: PartidaSelecccionado.item === item.item
										? 'font-weight-light resplandPartida icoVer'
										: 'font-weight-light icoVer'
							}
						>
							<td>
								{Permisos['ver_chatpartidas'] == 1 &&
									item.tipo == 'partida' && (
										<PartidasChat
											id_partida={item.id_partida}
											id_componente={ComponenteSelecccionado.id_componente}
											recargaComponenteMensajes={recargaComponenteMensajes}
											titulo={item.descripcion}
										/>
									)}
							</td>
							<td>
								{Permisos['actualizar_iconopartidas'] == 1 &&
									item.tipo === 'partida' && (
										<div className='prioridad' style={{ color: '#ffffff' }}>
											<span className='h6'>
												<IconosPartidas
													Id_iconoCategoria={
														item.iconosCategorias_id_iconoCategoria
													}
													Id_prioridad={item.prioridades_id_prioridad}
													Id_partida={item.id_partida}
													Categorias={Categorias}
													CategoriasComponente={CategoriasComponente}
													Prioridades={Prioridades}
												/>
											</span>
										</div>
									)}
							</td>
							{item.tipo == 'partida' ? (
								<td
									onClick={() => onChangePartidasSeleccion(item)}
									className={
										item.tipo === 'titulo'
											? ''
											: PartidaSelecccionado.item === item.item
												? 'tdData1'
												: 'tdData'
									}
								>
									{item.item}
								</td>
							) : (
								<td>{item.item}</td>
							)}
							<td>{item.descripcion}</td>
							<td>
								{item.tipo == 'partida' &&
									Redondea(item.metrado) +
									' ' +
									(item.unidad_medida &&
										item.unidad_medida.replace('/DIA', ''))}
							</td>
							<td>{item.tipo == 'partida' && Redondea(item.costo_unitario)}</td>
							<td>
								{item.tipo == 'partida' &&
									Redondea(item.metrado * item.costo_unitario)}
							</td>
							<td className='small border border-left border-right-0 border-bottom-0 border-top-0'>
								{item.tipo == 'partida' && (
									<BarraPorcentajeAvancePartida
										id_partida={item.id_partida}
										ref={ref => {
											var clone = RefPartidas;
											clone[item.id_partida] = ref;
											setRefPartidas(clone);
										}}
									/>
								)}
							</td>
							<td className='text-center'>
								{item.tipo == 'partida' && (
									<div className='aprecerIcon'>
										<span className='prioridad iconoTr'>
											<ModalPartidaFoto id_partida={item.id_partida} />
										</span>
									</div>
								)}
							</td>
						</tr>,
						PartidaSelecccionado.item == item.item && (
							<tr
								className='resplandPartidabottom'
								key={item.id_partida + '-actividades'}
							>
								<td colSpan='8'>
									<div className='p-1'>
										<div className='row'>
											<div className='col-sm-9 text-info pb-1 d-flex '>
												{PartidaSelecccionado.descripcion}{' '}
												<MdFlashOn size={20} className='text-danger' />
												rendimiento: {PartidaSelecccionado.rendimiento}{' '}
												{PartidaSelecccionado.unidad_medida}
												{
													TipoComponenteSelecccionado === 'origen'
														? <ModalMayorMetradoSave
															PartidaSelecccionado={PartidaSelecccionado}
															saveActividadMayorMetradoOnMM={saveActividadMayorMetradoOnMM}
															savePartidaMayorMetrado={savePartidaMayorMetrado}
														/>
														: TipoComponenteSelecccionado === 'mayor metrado'
															? <ModalMayorMetradoSave
																PartidaMayorMetradoSeleccionado={true}
																PartidaSelecccionado={PartidaSelecccionado}
																saveActividadMayorMetradoOnMM={saveActividadMayorMetradoOnMM}
																savePartidaMayorMetrado={savePartidaMayorMetrado}
															/>
															: null
												}
												{TipoComponenteSelecccionado === 'mayor metrado' &&
													<ModalDeleteActividadPartida
														PartidaMayorMetradoSeleccionado={true}
														PartidaSelecccionado={PartidaSelecccionado}
														Actividad={item} isActividad={false}
														handleDeletePartida={handleDeletePartida}
														ComponenteSelecccionado={ComponenteSelecccionado}
													/>}

											</div>
										</div>

										<table
											className='table-bordered table-sm table-hover'
											style={{
												width: '100%',
											}}
										>
											<thead>
												<tr>
													<th>ACTIVIDADES</th>
													<th>N° VECES</th>
													<th>LARGO</th>
													<th>ANCHO</th>
													<th>ALTO</th>
													<th>METRADO</th>
													<th>P / U </th>
													<th>P / P</th>
													<th>AVANCE Y SALDO</th>
													<th>METRAR</th>
												</tr>
											</thead>
											<tbody>
												{Actividades.map(item => (
													<tr
														key={item.id_actividad}
														className={
															item.actividad_estado === 'Mayor Metrado'
																? 'FondMM icoVer'
																: 'icoVer'
														}
													>
														<td>{item.nombre}</td>
														<td>{item.veces}</td>
														<td>{item.largo}</td>
														<td>{item.ancho}</td>
														<td>{item.alto}</td>
														<td>
															{Redondea(item.parcial)}{' '}
															{PartidaSelecccionado.unidad_medida}
														</td>
														<td>
															{Redondea(PartidaSelecccionado.costo_unitario)}
														</td>
														<td>
															{Redondea(
																item.parcial *
																PartidaSelecccionado.costo_unitario
															)}
														</td>
														<td>
															<BarraPorcentajeAvanceActividad
																id_actividad={item.id_actividad}
																ref={ref => {
																	var clone = RefActividades;
																	clone[item.id_actividad] = ref;
																	setRefActividades(clone);
																}}
															/>
														</td>
														<td>
															{Permisos['ingresar_metrado'] == 1 && (
																<ModalIngresoMetrado
																	Partida={PartidaSelecccionado}
																	Actividad={item}
																	recargaActividad={onSaveMetrado}
																	EstadoObra={EstadoObra}
																	TipoComponenteSelecccionado={TipoComponenteSelecccionado}
																	savePartidaMayorMetrado={savePartidaMayorMetrado}

																/>
															)}
															{
																TipoComponenteSelecccionado === 'mayor metrado' &&
																<ModalMayorMetradoSave
																	PartidaMayorMetradoSeleccionado={true}
																	PartidaSelecccionado={PartidaSelecccionado}
																	isUpdate={true}
																	Actividad={item}
																	savePartidaMayorMetrado={savePartidaMayorMetrado}
																	updateActividadMayorMetradoOnMM={updateActividadMayorMetradoOnMM}

																/>
															}
															{
																TipoComponenteSelecccionado === 'mayor metrado' &&
																<ModalDeleteActividadPartida
																	PartidaSelecccionado={PartidaSelecccionado}
																	Actividad={item}
																	isActividad={true}
																	PartidaMayorMetradoSeleccionado={true}
																	fectchActividades={fectchActividades}
																	handleDeleteActivity={handleDeleteActivity}
																/>
															}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</td>
							</tr>
						),
					])}
				</tbody>
				
			</table>
			<ToastContainer
				position="bottom-right"
				autoClose={2500}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
			<div
				className='clearfix'
				style={
					!TogglePartidasEstilo
						? {
							opacity: 0,
							pointerEvents: 'none',
						}
						: {
							transition: 'opacity 0.5s',
							opacity: 1,
						}
				}
			>
				<div style={{ position: 'relative' }}>
					<div className='float-left' ref={paginatorRef}>
						<select
							onChange={e => onChangeCantidadPaginasPartidas(e.target.value)}
							value={CantidadPaginasPartidas}
							className='form-control form-control-sm'
							style={{
								position: 'fixed',
								bottom: '0px',
								width: '55px',
							}}
						>
							<option value={10}>10</option>
							<option value={15}>15</option>
							<option value={20}>20</option>
						</select>
					</div>

					<div className='float-right mr-2 '>
						<div className='d-flex text-dark'>
							<InputGroup
								size='sm'
								style={{
									position: 'fixed',
									bottom: '0px',
									left: '50%',
								}}
							>
								<InputGroup>
									<Button
										className='btn btn-light pt-0'
										onClick={() => {
											onChangePaginaActual(PaginaActual - 1);
										}}
										disabled={PaginaActual <= 1}
									>
										<MdChevronLeft />
									</Button>
									<InputGroupText>
										{`${PaginaActual} de  ${Math.ceil(
											ConteoPartidas / CantidadPaginasPartidas
										)}`}
									</InputGroupText>
									<Button
										className='btn btn-light pt-0'
										onClick={() => {
											onChangePaginaActual(PaginaActual + 1);
										}}
										disabled={
											PaginaActual >=
											Math.ceil(ConteoPartidas / CantidadPaginasPartidas)
										}
									>
										<MdChevronRight />
									</Button>
								</InputGroup>
							</InputGroup>
						</div>
					</div>
				</div>
			</div>
		</CardBody>

	);
};

export default TableComponentsView;
function IconosPartidas({
	Id_partida,
	Id_iconoCategoria,
	Id_prioridad,
	Categorias,
	CategoriasComponente,
	Prioridades,
}) {
	useEffect(() => {
		fetchPrioridad(Id_prioridad);
		fetchIcono(Id_iconoCategoria);
	}, []);
	const [Prioridad, setPrioridad] = useState('#f00');
	function fetchPrioridad(id_prioridad) {
		var Prioridad = Prioridades.find(item => {
			return item.id_prioridad == id_prioridad;
		});
		setPrioridad(Prioridad ? Prioridad.color : '#f00');
	}
	const [Icono, setIcono] = useState(<FaSuperpowers />);
	function fetchIcono(id_iconoCategoria) {
		var icono = Categorias.find(icono => {
			return icono.id_iconoCategoria == id_iconoCategoria;
		});
		var componenteIcono = <FaSuperpowers />;
		if (icono) {
			if (icono.nombre === '<FaSuperpowers/>') {
				componenteIcono = <FaSuperpowers />;
			} else if (icono.nombre === '<MdLibraryBooks/>') {
				componenteIcono = <MdLibraryBooks />;
			} else if (icono.nombre === '<TiWarning/>') {
				componenteIcono = <TiWarning />;
			} else if (icono.nombre === '<MdWatch/>') {
				componenteIcono = <MdWatch />;
			} else if (icono.nombre === '<MdVisibility/>') {
				componenteIcono = <MdVisibility />;
			} else if (icono.nombre === '<MdMonetizationOn/>') {
				componenteIcono = <MdMonetizationOn />;
			}
		}
		setIcono(componenteIcono);
	}
	//toogle categorias
	const [MenuCategorias, setMenuCategorias] = useState(false);
	const toogleCategorias = () => {
		setMenuCategorias(!MenuCategorias);
	};

	const [CategoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
	function onChangeCategoriaSeleccionada(id_iconoCategoria) {
		setCategoriaSeleccionada(id_iconoCategoria);
		toogleCategorias();
		setMenuPrioridades(true);
	}
	//toogle Prioridades
	const [MenuPrioridades, setMenuPrioridades] = useState(false);
	function onChangePrioridadSeleccionada(id_prioridad) {
		setMenuPrioridades(false);
		updateCategoriaPrioridad(id_prioridad, CategoriaSeleccionada);
	}
	async function updateCategoriaPrioridad(id_prioridad, id_iconoCategoria) {
		await axios.post(`${UrlServer}/putCategoriaPrioridad`, {
			id_iconoCategoria: id_iconoCategoria,
			id_prioridad: id_prioridad,
			id_partida: Id_partida,
		});
		updatePartida(Id_partida);
	}
	async function updatePartida(id_partida) {
		const request = await axios.post(`${UrlServer}/getPartidaById`, {
			id_partida: id_partida,
		});
		fetchPrioridad(request.data.prioridades_id_prioridad);
		fetchIcono(request.data.iconosCategorias_id_iconoCategoria);
	}
	return (
		<div>
			<div onClick={toogleCategorias} style={{ color: Prioridad }}>
				{Icono}
			</div>
			<div className={MenuCategorias ? 'menuCirculo' : 'd-none'}>
				{CategoriasComponente.map((item, i) => (
					<div
						className='circleIcono'
						onClick={() =>
							onChangeCategoriaSeleccionada(item.id_iconoCategoria)
						}
						key={i}
					>
						<span className='spanUbi'>{item.nombre} </span>
					</div>
				))}
			</div>
			<div className={MenuPrioridades ? 'menuCirculo' : 'd-none'}>
				{Prioridades.map((item, i) => (
					<div
						className='circleColor'
						style={{ background: item.color }}
						onClick={() => onChangePrioridadSeleccionada(item.id_prioridad)}
						key={i}
					></div>
				))}
			</div>
		</div>
	);
}


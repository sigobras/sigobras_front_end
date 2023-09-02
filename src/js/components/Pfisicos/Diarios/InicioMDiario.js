import React from 'react';
import { useTipoComponente } from './hooks/useTipoComponente';
import CardInfoComponent from './CardInfoComponent';
import { Nav, NavItem, NavLink } from 'reactstrap';
import TableComponentsParts from './TableComponentParts';
import './MetradoDiario.css'

const InicioMDiario = () => {
	const id_expediente = sessionStorage.getItem('id_expediente');
	const {
		Componente,
		ComponentesPorTipo,
		ComponenteSelecccionado,
		onChangeComponentesSeleccion,
		TipoComponenteSelecccionado,
		onChangeTipoComponenteSeleccion,
		ComponenteAvance,
		setTextoBuscado,
		Permisos,
		Partidas,
		PartidaSelecccionado,
		onChangePartidasSeleccion,
		Actividades,
		RefActividades,
		setRefActividades,
		TogglePartidasEstilo,
		Categorias,
		CategoriasComponente,
		onChangeMenuCategorias,
		MenuCategorias,
		MenuCategoriasSeleccionado,
		Prioridades,
		MenuPrioridades,
		MenuPrioridadesSeleccionado,
		onChangeMenuPrioridades,
		toggleMenuPrioridades,
		toggleMenuCategorias,
		paginatorRef,
		PaginaActual,
		ConteoPartidas,
		CantidadPaginasPartidas,
		RefPartidas,
		setRefPartidas,
		onChangeCantidadPaginasPartidas,
		onChangePaginaActual,
		RefComponentes,
		setRefComponentes,
		recargaComponenteMensajes,
		EstadoObra,
		onSaveMetrado,
		ComponentesMensajes,
	} = useTipoComponente(id_expediente);

	return (
		<div>
			<Nav tabs className='bg-dark' style={{ justifyContent: 'flex-end' }}>
				<NavItem style={{ cursor: 'pointer' }}>
					<NavLink
						active={TipoComponenteSelecccionado === 'origen'}
						onClick={() => onChangeTipoComponenteSeleccion('origen')}
						className='tabTP'
						style={
							TipoComponenteSelecccionado === 'origen'
								? {
									color: 'white',
									textTransform: 'uppercase',
									fontWeight: 'bold',
								}
								: { color: 'white', textTransform: 'uppercase' }
						}
					>
						Partidas
					</NavLink>

				</NavItem>
				{ComponentesPorTipo.map(({ tipo, cantidad }) =>
					cantidad ? (
						<NavItem key={tipo} style={{ cursor: 'pointer' }}>
							<NavLink
								active={tipo === TipoComponenteSelecccionado}
								onClick={() => onChangeTipoComponenteSeleccion(tipo)}
								className='tabTP'
								style={
									tipo === TipoComponenteSelecccionado
										? {
											color: 'white',
											textTransform: 'uppercase',
											fontWeight: 'bold',
										}
										: { color: 'white', textTransform: 'uppercase' }
								}
							>
								{
									tipo == 'mayor metrado' ? 'MM' : 'PN'
								}
							</NavLink>

						</NavItem>
					) : null
				)}
			</Nav>
			<Nav tabs className='bg-dark'>
				{Componente.map(item => (
					<NavItem key={item.id_componente} style={{ cursor: 'pointer' }}>
						<NavLink
							active={item.numero === ComponenteSelecccionado.numero}
							onClick={() => onChangeComponentesSeleccion(item)}
							style={
								item.numero === ComponenteSelecccionado.numero
									? {}
									: { color: 'white' }
							}
						>
							COMP {item.numero}
						</NavLink>
						<ComponentesMensajes
							id_componente={item.id_componente}
							ref={(ref) => {
								var clone = RefComponentes;
								clone[item.id_componente] = ref;
								setRefComponentes(clone);
							}}
						/>
					</NavItem>
				))}
			</Nav>
			<CardInfoComponent
				ComponenteSelecccionado={ComponenteSelecccionado}
				ComponenteAvance={ComponenteAvance}
				setTextoBuscado={setTextoBuscado}
			></CardInfoComponent>

			<TableComponentsParts
				TipoComponenteSelecccionado={TipoComponenteSelecccionado}
				Permisos={Permisos}
				Partidas={Partidas}
				Actividades={Actividades}
				RefActividades={RefActividades}
				setRefActividades={setRefActividades}
				ComponenteSelecccionado={ComponenteSelecccionado}
				PartidaSelecccionado={PartidaSelecccionado}
				TogglePartidasEstilo={TogglePartidasEstilo}
				Categorias={Categorias}
				CategoriasComponente={CategoriasComponente}
				MenuCategorias={MenuCategorias}
				MenuCategoriasSeleccionado={MenuCategoriasSeleccionado}
				onChangeMenuCategorias={onChangeMenuCategorias}
				Prioridades={Prioridades}
				MenuPrioridades={MenuPrioridades}
				MenuPrioridadesSeleccionado={MenuPrioridadesSeleccionado}
				onChangeMenuPrioridades={onChangeMenuPrioridades}
				toggleMenuPrioridades={toggleMenuPrioridades}
				toggleMenuCategorias={toggleMenuCategorias}
				paginatorRef={paginatorRef}
				PaginaActual={PaginaActual}
				ConteoPartidas={ConteoPartidas}
				CantidadPaginasPartidas={CantidadPaginasPartidas}
				RefPartidas={RefPartidas}
				setRefPartidas={setRefPartidas}
				onChangeCantidadPaginasPartidas={onChangeCantidadPaginasPartidas}
				onChangePaginaActual={onChangePaginaActual}
				onChangePartidasSeleccion={onChangePartidasSeleccion}
				setRefComponentes={setRefComponentes}
				recargaComponenteMensajes={recargaComponenteMensajes}
				EstadoObra={EstadoObra}
				onSaveMetrado={onSaveMetrado}
			></TableComponentsParts>
		</div>
	);
};

export default InicioMDiario;

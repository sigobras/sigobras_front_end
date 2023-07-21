import React from 'react';
import { Redondea } from '../../../Utils/Funciones';
import {
	Table,
	Tab,
	Tabs,
	TextField,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
	Box,
	TablePagination,
	TableContainer,
} from '@mui/material';
import LinearProgressWithLabel from '../../../../../components/molecules/LinearProgressWithLabel';
import BarraPorcentajeAvance from '../BarraPorcentajeAvance';
import { Container } from './styled';
import TablaActividadesViewController from '../TablaActividades/TablaActividadesController';

const TablaPartidasView = ({
	ComponenteSeleccionado,
	onChangeComponentesSeleccion,
	Componentes,
	ComponenteAvance,
	TextoBuscado,
	setTextoBuscado,
	Partidas,
	PartidaSeleccionada,
	setPartidaSeleccionada,
	ComponenteAvancePorcentaje,
	rowsPerPageOptions,
	count,
	page,
	onPageChange,
	rowsPerPage,
	onRowsPerPageChange,
	onSaveMetrado,
	EstadoObra,
}) => {
	const handleTextChange = e => {
		setTextoBuscado(e.target.value);
	};

	const handlePartidaSelection = item => {
		setPartidaSeleccionada(item);
	};

	return (
		<Container>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={ComponenteSeleccionado}
					onChange={onChangeComponentesSeleccion}
				>
					{Componentes.map(item => (
						<Tab
							key={item.id_componente}
							label={`COMP ${item.numero}`}
							value={item}
						/>
					))}
				</Tabs>
			</Box>
			<Box sx={{ p: 1 }}>
				<div className='componentHeader'>
					<div>{ComponenteSeleccionado.nombre}</div>
					<TextField
						variant='outlined'
						size='small'
						placeholder='descripción o item'
						value={TextoBuscado}
						onChange={handleTextChange}
					/>
				</div>
				<Box sx={{ py: 1 }}>
					<LinearProgressWithLabel
						variant='determinate'
						value={ComponenteAvancePorcentaje}
					/>
				</Box>
				<span>S/. {Redondea(ComponenteAvance)}</span>
			</Box>
			<TableContainer>
				<Table>
					<TableHead className='resplandPartida'>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell>ITEM</TableCell>
							<TableCell>DESCRIPCIÓN</TableCell>
							<TableCell>METRADO</TableCell>
							<TableCell>P/U</TableCell>
							<TableCell>P/P</TableCell>
							<TableCell>BARRA DE PROGRESO</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Partidas.map(item => (
							<React.Fragment key={item.id_partida}>
								<TableRow
									className={item.tipo === 'titulo' ? 'titulo' : 'partida'}
									onClick={() =>
										item.tipo === 'partida'
											? handlePartidaSelection(item)
											: null
									}
								>
									<TableCell />
									<TableCell />
									<TableCell
										className={`item ${
											item.id_partida === PartidaSeleccionada.id_partida
												? 'partida-seleccionada'
												: ''
										}`}
									>
										{item.item}
									</TableCell>
									<TableCell className='descripcion'>
										{item.descripcion}
									</TableCell>
									<TableCell>{Redondea(item.metrado)}</TableCell>
									<TableCell>{Redondea(item.costo_unitario)}</TableCell>
									<TableCell>
										{Redondea(
											item.tipo === 'partida'
												? item.costo_unitario * item.metrado
												: '',
										)}
									</TableCell>
									<TableCell className='barra-porcentaje'>
										{item.tipo === 'partida' && (
											<BarraPorcentajeAvance
												avanceMetrado={item.avance_metrado}
												avanceSoles={item.avance_soles}
												saldoMetrado={item.metrado - item.avance_metrado}
												saldoSoles={item.presupuesto - item.avance_soles}
												avancePorcentaje={
													(item.avance_metrado / item.metrado) * 100
												}
											/>
										)}
									</TableCell>
								</TableRow>

								{item.id_partida === PartidaSeleccionada.id_partida && (
									<TableRow
										className={
											item.id_partida === PartidaSeleccionada.id_partida
												? 'tabla-actividades-seleccionada'
												: ''
										}
									>
										<TableCell colSpan='9'>
											<TablaActividadesViewController
												partida={item}
												onSaveMetrado={onSaveMetrado}
												EstadoObra={EstadoObra}
											/>
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={rowsPerPageOptions}
					count={count}
					page={page}
					onPageChange={(event, page) => onPageChange(page)}
					rowsPerPage={rowsPerPage}
					onRowsPerPageChange={event => {
						onRowsPerPageChange(event.target.value);
					}}
					labelRowsPerPage=''
				/>
			</TableContainer>
		</Container>
	);
};

export default TablaPartidasView;

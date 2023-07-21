// TableComponent.js
import React, { useCallback, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Input,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
} from '@mui/material';
import {
	useDesignations,
	useUserData,
	useWorkPositions,
} from '../../hooks/usePersonal';
import UsuarioDetalles from '../../js/components/Inicio/ListaPersonal/UsuarioDetalles';
import { FaMediumM, FaSave, FaUpload } from 'react-icons/fa';
import FormularioPersonal from './FormularioPersonal';
import FormularioListarPersonal from './FormularioListarPersonal';
import { useSession } from 'next-auth/react';
const defaultCargos = { id_ficha: '', cargos_tipo_id: 3 };
export default function TablePersonalComponent({ id_ficha }) {
	const { data } = useSession();
	const id_acceso = data?.user?.id;
	const [IdCargoSeleccionado, setIdCargoSeleccionado] = useState(0);

	const handleChange = useCallback((event, newValue) => {
		setIdCargoSeleccionado(newValue);
	}, []);

	const UsuarioData = useUserData(id_ficha, id_acceso);

	const cargos = useMemo(() => ({ ...defaultCargos, id_ficha }), [id_ficha]);
	const CargosPersonal = useWorkPositions(cargos);

	const designationArgs = useMemo(
		() => ({
			id_ficha,
			id_cargo: IdCargoSeleccionado,
		}),
		[id_ficha, IdCargoSeleccionado],
	);

	const designations = useDesignations(designationArgs);
	if (!UsuarioData) {
		return <div>Cargando datos de usuario...</div>;
	}

	if (!CargosPersonal) {
		return <div>Cargando cargos personales...</div>;
	}

	return (
		<TableContainer>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={IdCargoSeleccionado}
					onChange={handleChange}
					variant='scrollable'
					scrollButtons='auto'
					aria-label='nav tabs'
				>
					{UsuarioData && UsuarioData.cargos_tipo_id <= 2 && (
						<Tab
							label='Personal Planta'
							onClick={() => setIdCargoSeleccionado(-2)}
							value={-2}
						/>
					)}

					{CargosPersonal.map((item, i) => (
						<Tab
							key={i}
							label={item.cargo_nombre.toUpperCase()}
							onClick={() => setIdCargoSeleccionado(item.id_cargo)}
							value={item.id_cargo}
						/>
					))}
					<Tab
						label='LISTA PERSONAL'
						onClick={() => setIdCargoSeleccionado(0)}
						value={0}
					/>
					<Tab
						label='Agregar Personal'
						onClick={() => setIdCargoSeleccionado(-1)}
						value={-1}
					/>
				</Tabs>
			</Box>
			{(IdCargoSeleccionado == 0 || IdCargoSeleccionado == -2) && (
				<FormularioListarPersonal
					id_ficha={id_ficha}
					cargos_tipo_id={IdCargoSeleccionado == 0 ? 3 : 2}
				/>
			)}
			{IdCargoSeleccionado == -1 && (
				<FormularioPersonal
					id_ficha={id_ficha}
					id_cargo={IdCargoSeleccionado}
				/>
			)}
			{IdCargoSeleccionado > 0 && (
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>nombre</TableCell>
							<TableCell>fecha de ingreso</TableCell>
							<TableCell>fecha de salida</TableCell>
							<TableCell>estado</TableCell>
							<TableCell>opciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{designations.map((item, i) => (
							<TableRow key={item.id}>
								<TableCell>
									<UsuarioDetalles data={item} />
								</TableCell>
								<TableCell>
									<div
										onClick={() => uploadFile(item.id)}
										style={{
											textAlign: 'center',
											cursor: 'pointer',
										}}
									>
										<FaUpload size={10} color='#ffffff' />
									</div>
								</TableCell>
								<TableCell>
									{item.memorandum !== null && (
										<div
											className='text-primary'
											title='descargar memorandum'
											onClick={() =>
												DescargarArchivo(`${UrlServer}${item.memorandum}`)
											}
											style={{
												cursor: 'pointer',
											}}
										>
											<FaMediumM size={15} color='#2676bb' />
										</div>
									)}
								</TableCell>
								<TableCell>
									<Input
										type='date'
										value={item.fecha_inicio}
										onChange={e =>
											handleInputChange(i, 'fecha_inicio', e.target.value)
										}
									/>
								</TableCell>
								<TableCell style={{ display: 'flex' }}>
									<Input
										type='date'
										value={item.fecha_final == null ? '' : item.fecha_final}
										onChange={e =>
											handleInputChange(i, 'fecha_final', e.target.value)
										}
									/>
									<Button
										variant='outlined'
										color='error'
										onClick={() => {
											guardarDesignacionesNull(i, 'fecha_final');
										}}
									>
										X
									</Button>
								</TableCell>
								<TableCell>
									{item.habilitado ? (
										<div
											style={{
												fontWeight: '700',
												color: 'green',
											}}
										>
											Habilitado
										</div>
									) : (
										<div
											style={{
												fontWeight: '700',
												color: 'red',
											}}
										>
											Deshabilitado
										</div>
									)}
								</TableCell>
								<TableCell>
									<Button
										variant='outlined'
										color='primary'
										onClick={() => guardarDesignaciones(i)}
									>
										<FaSave />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</TableContainer>
	);
}

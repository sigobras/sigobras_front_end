import React, { useState } from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	TextField,
	Typography,
	Alert,
} from '@mui/material';
import {
	FechaActual2Meses,
	FechaActual,
	Redondea,
} from '../../../Utils/Funciones';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalIngresoMetrado = ({
	SaldoActividad,
	EstadoObra,
	Partida,
	Actividad,
	onChangeModalData,
	saveModalDATA,
}) => {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<>
			{SaldoActividad > 0 || EstadoObra === 'Corte' ? (
				<FaPlus
					size={15}
					onClick={handleClickOpen}
					color='#007bff'
					style={{
						cursor: 'pointer',
					}}
				/>
			) : (
				<FaCheck size={15} color='#08ff1d' />
			)}
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				PaperProps={{
					sx: {
						backgroundImage: 'none',
					},
				}}
			>
				<ToastContainer />
				<DialogTitle>Ingreso de Metrado</DialogTitle>
				<DialogContent>
					<Typography variant='body1' align='center' mt={0}>
						{Partida.descripcion}
					</Typography>
					<br />
					<Box display='flex' justifyContent='space-between'>
						<div>
							<Typography variant='body1' component='b'>
								{Actividad.nombre}
							</Typography>
						</div>
						<div className='small'>
							Costo Unit. S/. {Redondea(Partida.costo_unitario)}{' '}
							{Partida.unidad_medida.replace('/DIA', '')}
						</div>
					</Box>
					<Box display='flex' justifyContent='space-between'>
						<div>
							{/* INGRESE EL METRADO: {this.state.Porcentaje_Metrado} */}
						</div>
						<div title='redimiento' className='text-right bold text-warning'>
							redimiento {Partida.rendimiento}
						</div>
					</Box>
					<Box display='flex' alignItems='center' mt={0}>
						<TextField
							onChange={e => onChangeModalData('valor', e.target.value)}
							type='number'
							autoFocus
							variant='outlined'
							size='small'
							sx={{ width: '100%' }}
						/>
						<Typography variant='body2' component='span' ml={1}>
							{Partida.unidad_medida.replace('/DIA', '')}
						</Typography>
					</Box>

					<Box
						display='flex'
						justifyContent='center'
						alignItems='center'
						mt={1}
					>
						<Alert variant='outlined' severity='success'>
							Metrado total <br />
							{Partida.metrado} {Partida.unidad_medida.replace('/DIA', '')}
						</Alert>
						<Alert variant='outlined' severity='warning'>
							Costo total / {Partida.unidad_medida.replace('/DIA', '')} <br />=
							S/. {Redondea(Partida.metrado * Partida.costo_unitario)} <br />
						</Alert>
						<Alert variant='outlined' severity='info'>
							Saldo Espécifico <br />
							{Redondea(SaldoActividad)}{' '}
							{Partida.unidad_medida.replace('/DIA', '')}
						</Alert>
					</Box>
					<Box mt={2}>
						<TextField
							type='date'
							inputProps={{
								min: FechaActual2Meses(),
								max: FechaActual(),
							}}
							onChange={e => onChangeModalData('fecha', e.target.value)}
							variant='outlined'
							size='small'
							sx={{ width: '100%' }}
						/>
					</Box>
					<Box mt={2}>
						<TextField
							multiline
							minRows={1}
							maxRows={3}
							debounceTimeout={300}
							onChange={e => onChangeModalData('descripcion', e.target.value)}
							variant='outlined'
							size='small'
							label='DESCRIPCION:'
							sx={{ width: '100%' }}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							saveModalDATA();
						}}
					>
						Guardar
					</Button>
					<Button
						ton
						onClick={() => {
							handleClose();
						}}
					>
						Cancelar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ModalIngresoMetrado;

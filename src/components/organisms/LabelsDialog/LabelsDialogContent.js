import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Typography,
	Popover,
	Paper,
} from '@mui/material';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

import { useForm } from '../../../hooks/useForm';
import { useFichasLabels } from '../../../hooks/useFichasLabels';
import {
	getEstadoAsignado,
	postFichasAsignarLabels,
	postObrasLabels,
} from '../../../services/labelsService';
import { hexToRgb } from '../../../js/components/Utils/Funciones';
import { FaSearch } from 'react-icons/fa';

const FormularioPaletaColores = [
	'#b60205',
	'#d93f0b',
	'#fbca04',
	'#0e8a16',
	'#006b75',
	'#1d76db',
	'#0052cc',
	'#5319e7',
];

const cantidadAsignada = async (id_ficha, id_label) => {
	const cantidad = await getEstadoAsignado(id_ficha, id_label);
	return cantidad;
};

const setRandomColor = setValues => {
	const randomColor =
		FormularioPaletaColores[
			Math.floor(Math.random() * FormularioPaletaColores.length)
		];
	setValues(prevValues => ({ ...prevValues, color: randomColor }));
};

const LabelsDialogContent = ({ id_ficha, dialogOpen, setDialogOpen }) => {
	const [values, setValues] = useState({
		color: '',
		nombre: '',
		descripcion: '',
	});
	const [textoBuscar, setTextoBuscar] = useState('');
	const fichasLabels = useFichasLabels(id_ficha, values.nombre);
	const [isLoading, setIsLoading] = useState(true);

	const handleSubmit = async event => {
		event.preventDefault();
		const response = await postObrasLabels(values);
		if (response === 201) {
			setDialogOpen(false);
		}
	};

	return (
		<Dialog
			open={dialogOpen}
			onClose={() => setDialogOpen(false)}
			maxWidth='lg'
		>
			<DialogTitle>
				<div>
					<Typography variant='h6'>Etiquetas de la obra</Typography>
					<Button variant='outlined' color='success'>
						Nueva etiqueta
					</Button>
				</div>
			</DialogTitle>
			<DialogContent>
				<div>
					<form onSubmit={handleSubmit}>
						<Button
							type='button'
							sx={{
								'--label-r': hexToRgb(values.color).r || 1,
								'--label-g': hexToRgb(values.color).g || 1,
								'--label-b': hexToRgb(values.color).b || 1,
								'--label-h': hexToRgb(values.color).h || 1,
								'--label-s': hexToRgb(values.color).s || 1,
								'--label-l': hexToRgb(values.color).l || 1,
							}}
						>
							{values.nombre || 'Label Preview'}
						</Button>
						<div>
							<TextField
								type='text'
								maxLength={45}
								autoComplete='off'
								required
								placeholder='Nombre de etiqueta'
								onChange={e =>
									setValues(prevValues => ({
										...prevValues,
										nombre: e.target.value,
									}))
								}
								name='nombre'
							/>
						</div>

						<div>
							<TextField
								multiline
								id='label-description-'
								placeholder='Description (optional)'
								aria-describedby='label--description-error'
								maxLength={250}
								onChange={e =>
									setValues(prevValues => ({
										...prevValues,
										descripcion: e.target.value,
									}))
								}
								name='descripcion'
							/>
						</div>

						<div>
							<Typography htmlFor='label-color-'>Color</Typography>
							<div>
								<Button
									type='button'
									aria-label='Get a new color'
									sx={{
										backgroundColor: values.color,
										marginRight: '5px',
									}}
									onClick={() => setRandomColor(setValues)}
								>
									<GiPerspectiveDiceSixFacesRandom size='25' />
								</Button>
								<div>
									<TextField
										maxLength={7}
										id='PopoverLegacy'
										type='text'
										name='color'
										value={values.color}
										onChange={e =>
											setValues(prevValues => ({
												...prevValues,
												color: e.target.value,
											}))
										}
									/>
									<Popover
										trigger='legacy'
										placement='bottom'
										target='PopoverLegacy'
									>
										<Paper>
											<div>
												{FormularioPaletaColores.map(item => (
													<button
														key={item}
														type='button'
														style={{
															backgroundColor: item,
														}}
														onClick={() =>
															setValues(prevValues => ({
																...prevValues,
																color: item,
															}))
														}
													/>
												))}
											</div>
										</Paper>
									</Popover>
								</div>
							</div>
						</div>
						<div>
							<Button variant='outlined' color='success' type='submit'>
								Crear etiqueta
							</Button>
						</div>
					</form>
				</div>
				<div>
					<Button>
						<FaSearch size='20' />
					</Button>
					<TextField
						type='text'
						onChange={e => setTextoBuscar(e.target.value)}
					/>
				</div>
				<table>
					<thead>
						<tr>
							<th>ETIQUETAS</th>
							<th>DESCRIPCION</th>
						</tr>
					</thead>
					<LabelsList fichasLabels={fichasLabels} />
				</table>
			</DialogContent>
		</Dialog>
	);
};

const LabelsList = ({ fichasLabels, handleAsignar }) => {
	return (
		<tbody>
			{fichasLabels.map(item => (
				<LabelsListItem
					key={item.id}
					item={item}
					handleAsignar={handleAsignar}
				/>
			))}
		</tbody>
	);
};

const LabelsListItem = ({ item, handleAsignar }) => {
	return (
		<tr
			onClick={() => handleAsignar(item.id)}
			style={{
				cursor: 'pointer',
			}}
		>
			<td>
				<Button
					sx={{
						'--label-r': hexToRgb(item.color).r,
						'--label-g': hexToRgb(item.color).g,
						'--label-b': hexToRgb(item.color).b,
						'--label-h': hexToRgb(item.color).h,
						'--label-s': hexToRgb(item.color).s,
						'--label-l': hexToRgb(item.color).l,
					}}
				>
					{item.nombre}
				</Button>
			</td>
			<td>{item.descripcion}</td>
		</tr>
	);
};

export default LabelsDialogContent;

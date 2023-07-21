import { Button, Input, MenuItem, Select } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React from 'react';
const FiltrosComponent = ({
	provincias,
	provinciaSeleccionada,
	setProvinciaSeleccionada,
	sectores,
	sectorSeleccionado,
	setSectorSeleccionado,
	estadosObra,
	estadosObraSeleccionada,
	setEstadosObraSeleccionada,
}) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<Select
				value={provinciaSeleccionada}
				onChange={e => {
					setProvinciaSeleccionada(e.target.value);
				}}
				sx={{
					flexGrow: 1, // Fill the available space
					backgroundColor: '#171819',
					borderColor: '#171819',
					color: '#ffffff',
					cursor: 'pointer',
				}}
			>
				<MenuItem value='0'>Todas las provincias</MenuItem>
				{provincias.map((item, i) => (
					<MenuItem key={i} value={item.id_unidadEjecutora}>
						{item.nombre}
					</MenuItem>
				))}
			</Select>
			<Select
				value={sectorSeleccionado}
				onChange={e => setSectorSeleccionado(e.target.value)}
				sx={{
					flexGrow: 1, // Fill the available space
					backgroundColor: '#171819',
					borderColor: '#171819',
					color: '#ffffff',
					cursor: 'pointer',
				}}
			>
				<MenuItem value='0'>Todos los sectores</MenuItem>
				{sectores.map((item, i) => (
					<MenuItem key={i} value={item.idsectores}>
						{item.nombre}
					</MenuItem>
				))}
			</Select>
			<Select
				value={estadosObraSeleccionada}
				onChange={e => setEstadosObraSeleccionada(e.target.value)}
				sx={{
					flexGrow: 1, // Fill the available space
					backgroundColor: '#171819',
					borderColor: '#171819',
					color: '#ffffff',
					cursor: 'pointer',
				}}
			>
				<MenuItem value='0'>Todos los estados</MenuItem>
				{estadosObra.map((item, index) => (
					<MenuItem key={index} value={item.id_Estado}>
						{item.nombre}
					</MenuItem>
				))}
			</Select>
		</div>
	);
};
export default FiltrosComponent;

import { Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/system';
import { fechaFormatoClasico } from '../../js/components/Utils/Funciones';

const Container = styled('div')({
	display: 'flex',
	alignItems: 'center',
	margin: 0,
	padding: 0,
});

const Label = styled(Typography)(({ theme }) => ({
	color: theme.palette.primary.main,
	marginRight: '5px',
	fontSize: '12px',
}));

const Text = styled(Typography)({
	fontSize: '14px',
});

const PlazosInfo = ({
	plazoinicial_fecha,
	plazoinicial_fechafinal,
	plazoaprobado_ultimo_fecha,
	plazosinaprobar_ultimo_fecha,
}) => {
	return (
		<Container>
			{plazoinicial_fecha && (
				<>
					<Label>Inicio de obra</Label>
					<Text>{fechaFormatoClasico(plazoinicial_fecha)}</Text>
				</>
			)}
			{!plazoaprobado_ultimo_fecha && !plazosinaprobar_ultimo_fecha && (
				<>
					<Label>Fecha de culminación</Label>
					<Text>{fechaFormatoClasico(plazoinicial_fechafinal)}</Text>
				</>
			)}
			{plazoaprobado_ultimo_fecha && (
				<>
					<Label>Ultimo plazo aprovado</Label>
					<Text>{fechaFormatoClasico(plazoaprobado_ultimo_fecha)}</Text>
				</>
			)}
			{plazosinaprobar_ultimo_fecha && (
				<>
					<Label>Ultimo plazo por aprovado</Label>
					<Text>{fechaFormatoClasico(plazosinaprobar_ultimo_fecha)}</Text>
				</>
			)}
		</Container>
	);
};

export default PlazosInfo;

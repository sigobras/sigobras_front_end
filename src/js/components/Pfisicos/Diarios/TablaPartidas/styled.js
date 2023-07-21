import { styled } from '@mui/system';

export const Container = styled('div')(({ theme }) => ({
	borderBottom: '1px solid divider',
	'&  td': {
		padding: '7px 10px',
	},
	'&  .componentHeader': {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	'&  .descripcion': {
		width: '800px',
	},
	'& .titulo td': {
		color: theme.palette.primary.main,
		fontWeight: 'bold',
	},
	'& .partida .item:hover': {
		backgroundColor: theme.palette.primary.main,
		cursor: 'pointer',
	},
	'& .barra-porcentaje': {
		width: '300px',
	},
	'& .tabla-actividades-seleccionada': {
		border: '2px solid ' + theme.palette.primary.main,
	},
	'& .partida-seleccionada': {
		backgroundColor: theme.palette.primary.main,
	},
}));

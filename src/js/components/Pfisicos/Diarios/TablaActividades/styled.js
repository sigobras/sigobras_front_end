import { styled } from '@mui/system';

export const Container = styled('div')(({ theme }) => ({
	// border: '1px solid ' + theme.palette.primary.main,
	'&  td': {
		padding: '7px 10px',
	},
}));

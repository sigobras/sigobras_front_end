import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Redondea } from '../../../js/components/Utils/Funciones';

function getColor(value) {
	if (value <= 30) {
		return '#ff2e00'; // Color para valores de 0 a 30
	} else if (value > 85) {
		return '#a4fb01'; // Color para valores mayores a 85
	} else {
		return '#0080ff'; // Color para valores entre 30 y 85#0080ff
	}
}

function LinearProgressWithLabel(props) {
	const { value } = props;
	const color = getColor(value);

	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ width: '100%', mr: 1 }}>
				<LinearProgress
					variant='determinate'
					{...props}
					sx={{
						'& .MuiLinearProgress-bar': {
							backgroundColor: color,
						},
					}}
				/>
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant='body2' color='text.secondary'>
					{`${Redondea(value)}%`}
				</Typography>
			</Box>
		</Box>
	);
}

export default LinearProgressWithLabel;

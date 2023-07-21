import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

import { Redondea, Redondea1 } from '../../js/components/Utils/Funciones';

const ProgressBar = ({ tipo, avance, total, color, tipoProgreso }) => {
	const [RandNumber, setRandNumber] = useState(Math.floor(Math.random() * 10));
	const [avancePorcentaje, setAvancePorcentaje] = useState(
		(avance / total) * 100,
	);
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const toggle = () => setTooltipOpen(!tooltipOpen);

	return (
		<div>
			{tipo === 'circle' && (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<CircularProgress
						variant='determinate'
						value={Redondea1(avancePorcentaje)}
						size={25}
						color={color}
					/>
					<div style={{ color }}>{Redondea1(avancePorcentaje) + '%'}</div>
					<div>{'S/.' + Redondea(avance)}</div>
				</Box>
			)}
			{tipo === 'barra' && (
				<div>
					<LinearProgress
						variant='determinate'
						value={Redondea1(avancePorcentaje)}
						style={{
							height: '4px',
							borderRadius: '2px',
							transition: 'all .9s ease-in',
						}}
						sx={{ '& .MuiLinearProgress-bar': { backgroundColor: color } }}
					/>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: '4px',
							color: '#8caeda',
							fontSize: '12px',
							color: '#ffffff',
							textAlign: 'center',
						}}
					>
						{tipoProgreso} - ({Redondea(avancePorcentaje)}%)
					</div>
				</div>
			)}
		</div>
	);
};

export default ProgressBar;

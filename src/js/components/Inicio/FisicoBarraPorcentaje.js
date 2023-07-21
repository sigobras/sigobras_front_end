import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { Redondea, Redondea1 } from '../Utils/Funciones';

export default ({ tipo, id_ficha, avance, total }) => {
	const [RandNumber, setRandNumber] = useState(Math.floor(Math.random() * 10));
	const [FisicoAvance] = useState({
		fisico_avance_porcentaje: (avance / total) * 100,
	});
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const toggle = () => setTooltipOpen(!tooltipOpen);

	return (
		<div>
			{tipo === 'circle' && (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<CircularProgress
						variant='determinate'
						value={Redondea1(FisicoAvance.fisico_avance_porcentaje)}
						size={25}
						color='info'
					/>
					<div style={{ color: '#17a2b8' }}>
						{Redondea1(FisicoAvance.fisico_avance_porcentaje) + '%'}
					</div>
					<div>{'S/.' + Redondea(avance)}</div>
				</Box>
			)}
			{tipo === 'barra' && (
				<div
					style={{
						width: '100%',
						height: '20px',
						textAlign: 'center',
						paddingBottom: '28px',
					}}
				>
					<div
						style={{
							height: '2px',
							backgroundColor: '#4a4b4c',
							borderRadius: '5px',
							position: 'relative',
						}}
					>
						<div
							style={{
								width: `${
									FisicoAvance.fisico_avance_porcentaje > 100
										? 100
										: FisicoAvance.fisico_avance_porcentaje
								}%`,
								height: '100%',
								backgroundColor: '#17a2b8',
								borderRadius: '5px',
								transition: 'all .9s ease-in',
								position: 'absolute',
							}}
						/>
						<span
							style={{
								position: 'inherit',
								top: '6px',
								color: '#8caeda',
								fontSize: '12px',
								color: '#ffffff',
								textAlign: 'center',
								display: 'flex',
								justifyContent: 'center',
							}}
							id={'FisicoBarraPorcentaje-' + id_ficha + RandNumber}
						>
							Físico
							<div
								style={{
									fontSize: '13px',
								}}
							>
								-({Redondea(FisicoAvance.fisico_avance_porcentaje)}%)
							</div>
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

import React, { useState } from 'react';
import { Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { Redondea, Redondea1 } from '../Utils/Funciones';

export default ({ tipo, id_ficha, avance, total }) => {
	const [RandNumber, setRandNumber] = useState(Math.floor(Math.random() * 10));
	const [FinancieroAvance] = useState({
		financiero_avance_porcentaje: (avance / total) * 100,
	});
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const toggle = () => setTooltipOpen(!tooltipOpen);

	return (
		<div>
			{tipo === 'circle' && (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<CircularProgress
						variant='determinate'
						value={Redondea1(FinancieroAvance.financiero_avance_porcentaje)}
						size={25}
						color='warning'
					/>
					<div style={{ color: '#ffa500' }}>
						{Redondea1(FinancieroAvance.financiero_avance_porcentaje) + '%'}
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
									FinancieroAvance.financiero_avance_porcentaje > 100
										? 100
										: FinancieroAvance.financiero_avance_porcentaje
								}%`,
								height: '100%',
								backgroundColor: '#ffa500',
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
								display: 'flex',
								justifyContent: 'center',
							}}
							id={'FinancieroBarraPorcentaje-' + id_ficha + RandNumber}
						>
							Financiero
							<div
								style={{
									fontSize: '13px',
								}}
							>
								-({Redondea(FinancieroAvance.financiero_avance_porcentaje)}%)
							</div>
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

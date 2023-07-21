import React from 'react';
import { Redondea } from '../../Utils/Funciones';
import LinearProgressWithLabel from '../../../../components/molecules/LinearProgressWithLabel';
import { Typography } from '@mui/material';

const BarraPorcentajeAvance = ({
	avanceMetrado,
	avanceSoles,
	saldoMetrado,
	saldoSoles,
	avancePorcentaje,
}) => {
	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography
					variant='body2'
					color='secondary.main'
					style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
				>
					Avance: {Redondea(avanceMetrado)}
				</Typography>
				<Typography
					variant='body2'
					color='secondary.main'
					style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
				>
					S/. {Redondea(avanceSoles)}
				</Typography>
			</div>
			<LinearProgressWithLabel value={avancePorcentaje} />
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography
					variant='body2'
					color='primary.main'
					style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
				>
					Saldo: {Redondea(saldoMetrado)}
				</Typography>
				<Typography
					variant='body2'
					color='primary.main'
					style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
				>
					S/.{Redondea(saldoSoles)}
				</Typography>
			</div>
		</div>
	);
};

export default BarraPorcentajeAvance;

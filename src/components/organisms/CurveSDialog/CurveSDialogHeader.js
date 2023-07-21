import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box } from '@mui/material';

import { useCurvaSAcumulados, useUsuarioData } from '../../../hooks/useCurveS';
import { Redondea } from '../../../js/components/Utils/Funciones';
import { useSession } from 'next-auth/react';

const CurveSDialogHeader = ({
	id_ficha,
	anyo,
	presupuesto_costodirecto,
	g_total_presu,
}) => {
	const { curvaSAcumulados, curvaSAcumuladosAnyoEspecifico, pimMonto } =
		useCurvaSAcumulados(id_ficha, anyo);

	const programadoAcumulado = curvaSAcumulados?.programado_acumulado || 0;
	const ejecutadoAcumulado = curvaSAcumulados?.ejecutado_acumulado || 0;
	const financieroAcumulado = curvaSAcumulados?.financiero_acumulado || 0;
	const financieroMonto = curvaSAcumuladosAnyoEspecifico?.financiero_monto || 0;

	const programadoSaldo = presupuesto_costodirecto - programadoAcumulado;
	const ejecutadoSaldo = presupuesto_costodirecto - ejecutadoAcumulado;
	const financieroSaldo = g_total_presu - financieroAcumulado;
	const saldoPIM = pimMonto - financieroMonto;
	const alertsData = [
		[
			{
				severity: 'info',
				value: programadoAcumulado,
				label: 'PROGRAMADO ACUMULADO',
			},
			{
				severity: 'info',
				value: programadoSaldo,
				label: 'PROGRAMADO SALDO',
			},
		],
		[
			{
				severity: 'info',
				value: ejecutadoAcumulado,
				label: 'EJECUTADO ACUMULADO',
			},
			{
				severity: 'info',
				value: ejecutadoSaldo,
				label: 'EJECUTADO SALDO',
			},
		],
		[
			{
				severity: 'warning',
				value: financieroAcumulado,
				label: 'FINANCIERO ACUMULADO',
			},
			{
				severity: 'warning',
				value: financieroSaldo,
				label: 'FINANCIERO SALDO',
			},
		],
		[
			{
				severity: 'success',
				value: pimMonto,
				label: `PIM ${anyo}`,
			},
			{
				severity: 'success',
				value: financieroMonto,
				label: `ACUMULADO ${anyo}`,
			},
			{
				severity: 'success',
				value: saldoPIM,
				label: 'SALDO PIM',
			},
		],
	];
	return (
		<Box display='flex'>
			{alertsData.map(fila => (
				<div>
					{fila.map((data, index) => (
						<Box key={index}>
							<Alert
								severity={data.severity}
								sx={{
									marginBottom: '2px',
									padding: '0px 7px',
									textAlign: 'center',
									'& .MuiAlert-icon': {
										display: 'none',
									},
								}}
							>
								<div style={{ fontWeight: 700 }}>S/.{Redondea(data.value)}</div>
								<div style={{ fontSize: '9px' }}>{data.label}</div>
							</Alert>
						</Box>
					))}
				</div>
			))}
		</Box>
	);
};
CurveSDialogHeader.propTypes = {
	id_ficha: PropTypes.number.isRequired,
	anyo: PropTypes.number.isRequired,
	presupuesto_costodirecto: PropTypes.number.isRequired,
	g_total_presu: PropTypes.number.isRequired,
};

CurveSDialogHeader.defaultProps = {
	id_ficha: 0,
	anyo: 0,
	presupuesto_costodirecto: 0,
	g_total_presu: 0,
};
export default CurveSDialogHeader;

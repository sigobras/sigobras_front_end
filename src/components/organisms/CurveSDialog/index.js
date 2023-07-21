import React, { useRef, useState } from 'react';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import {
	Grid,
	Select,
	MenuItem,
	Button,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material';
import CustomDialog from '../CustomDialog';
import { Redondea } from '../../../js/components/Utils/Funciones';
import CurveSDialogHeader from './CurveSDialogHeader';
import { useFetchCurvaSAnyos } from '../../../hooks/useCurveS';
import CurveSDialogChart from './CurveSDialogChart';
const CurvaSAnyos = [
	{ anyo: 2021 },
	{ anyo: 2022 },
	{ anyo: 2023 },
	// Add more years if needed
];
const CurveSDialog = ({
	id_ficha,
	codigo,
	presupuesto_costodirecto,
	g_total_presu,
}) => {
	return (
		<div>
			<CustomDialog
				icon={<QueryStatsIcon />}
				title='Curve S'
				content={
					<CurveSDialogContent
						id_ficha={id_ficha}
						codigo={codigo}
						presupuesto_costodirecto={presupuesto_costodirecto}
						g_total_presu={g_total_presu}
					/>
				}
			/>
		</div>
	);
};

const CurveSDialogContent = ({
	id_ficha,
	codigo,
	presupuesto_costodirecto,
	g_total_presu,
}) => {
	const [ToggleSoles, setToggleSoles] = useState(true);
	const handleChangeToggleSoles = () => {
		setToggleSoles(prevState => !prevState);
	};
	const [CurvaSdata, setCurvaSdata] = useState([]);
	const { CurvaSAnyos, CurvaSAnyoSeleccionado, setCurvaSAnyoSeleccionado } =
		useFetchCurvaSAnyos(id_ficha);
	return (
		<div style={{ width: '800px' }}>
			<Grid container spacing={2} alignItems='center'>
				<Grid item>
					<CurveSDialogHeader
						id_ficha={id_ficha}
						anyo={CurvaSAnyoSeleccionado}
						presupuesto_costodirecto={presupuesto_costodirecto}
						g_total_presu={g_total_presu}
					/>
				</Grid>
				<Grid item>
					<FormularioPrincipal id_ficha={id_ficha} />
					<div style={{ margin: '1px' }}>
						<Select
							value={CurvaSAnyoSeleccionado}
							onChange={e => setCurvaSAnyoSeleccionado(e.target.value)}
						>
							<MenuItem value=''>Seleccione</MenuItem>
							{CurvaSAnyos.map((item, i) => (
								<MenuItem key={i} value={item.anyo}>
									{item.anyo}
								</MenuItem>
							))}
						</Select>
					</div>
					{ToggleSoles ? (
						<Button variant='contained' onClick={handleChangeToggleSoles}>
							S/.
						</Button>
					) : (
						<Button variant='contained' onClick={handleChangeToggleSoles}>
							%
						</Button>
					)}
				</Grid>
			</Grid>
			<CurveSDialogChart
				key={JSON.stringify(CurvaSdata)}
				CurvaSdata={CurvaSdata}
				codigo={codigo}
				ToggleSoles={ToggleSoles}
			/>
			<div
				style={{
					overflowX: 'auto',
				}}
			>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell
								style={{ width: '200px', backgroundColor: '#171819' }}
								className='curvaS_tablaCabezera'
							>
								MES
							</TableCell>
							{CurvaSdata.map((item, i) => (
								<TableCell
									key={i}
									style={
										item.tipo === 'TOTAL'
											? { backgroundColor: '#3a3b3c' }
											: siEsMesActual(item.anyo, item.mes)
											? { backgroundColor: '#004080' }
											: { backgroundColor: '#171819' }
									}
								>
									{item.tipo === 'TOTAL'
										? 'TOTAL - ' + item.anyo
										: mesesShort[item.mes - 1] + '-' + item.anyo}
									{item.tipo !== 'TOTAL' && (
										<div onClick={() => deletePeriodoCurvaS(item.id)}>
											<MdDeleteForever
												title='eliminar periodo'
												style={{ cursor: 'pointer' }}
											/>
										</div>
									)}
								</TableCell>
							))}
							<TableCell style={{ backgroundColor: '#3a3b3c' }}>
								TOTAL - {CurvaSAnyoSeleccionado}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow className='curvaS_fisicoRow'>
							<TableCell
								style={{
									width: '200px',
									display: 'block',
								}}
								className='curvaS_tablaCabezera'
							>
								PROGRAMADO EJECUTADO
							</TableCell>
							{CurvaSdata.map((item, i) => (
								<TableCell key={i}>
									{item.tipo === 'TOTAL' ? (
										Redondea(
											item.fisico_programado_monto,
											ToggleSoles ? 2 : 4,
										) + (!ToggleSoles ? '%' : '')
									) : (
										<Programado
											item={item}
											recargar={recargarData}
											ToggleSoles={ToggleSoles}
											Obra={Obra}
										/>
									)}
								</TableCell>
							))}
							<TableCell>
								{Redondea(
									CurvaSdata.reduce((acc, item) => {
										if (item.tipo !== 'TOTAL') {
											acc += item.fisico_programado_monto;
										}
										return acc;
									}, 0),
								) + (!ToggleSoles ? '%' : '')}
							</TableCell>
						</TableRow>

						<TableRow className='curvaS_fisicoRow'>
							<TableCell
								style={{ width: '200px', display: 'block' }}
								className='curvaS_tablaCabezera'
							>
								PROGRAMADO EJECUTADO ACTUALIZADO
							</TableCell>
							{CurvaSdata.map((item, i) => (
								<TableCell key={i}>
									{(esMenorIgualMesActual(item.anyo, item.mes)
										? Redondea(item.fisico_monto, ToggleSoles ? 2 : 4)
										: Redondea(
												item.fisico_programado_monto,
												ToggleSoles ? 2 : 4,
										  )) + (!ToggleSoles ? '%' : '')}
								</TableCell>
							))}
							<TableCell>
								{Redondea(
									CurvaSdata.reduce((acc, item) => {
										if (item.tipo !== 'TOTAL') {
											acc += esMenorIgualMesActual(item.anyo, item.mes)
												? item.fisico_monto
												: item.fisico_programado_monto;
										}
										return acc;
									}, 0),
									4,
								) + (!ToggleSoles ? '%' : '')}
							</TableCell>
						</TableRow>
						<TableRow className='curvaS_fisicoRow'>
							<TableCell
								style={{ width: '200px', display: 'block' }}
								className='curvaS_tablaCabezera'
							>
								EJECUTADO
							</TableCell>
							{CurvaSdata.map((item, i) => (
								<TableCell key={i}>
									{Redondea(item.fisico_monto, ToggleSoles ? 2 : 4) +
										(!ToggleSoles ? '%' : '')}
								</TableCell>
							))}
							<TableCell>
								{Redondea(
									CurvaSdata.reduce((acc, item) => {
										if (item.tipo !== 'TOTAL') {
											acc += item.fisico_monto;
										}
										return acc;
									}, 0),
									4,
								) + (!ToggleSoles ? '%' : '')}
							</TableCell>
						</TableRow>
						<TableRow className='curvaS_FinancieroRow'>
							<TableCell
								style={{
									width: '200px',
									display: 'block',
								}}
								className='curvaS_tablaCabezera'
							>
								PROGRAMADO FINANCIERO
							</TableCell>
							{CurvaSdata.map((item, i) => (
								<TableCell key={i}>
									{item.tipo === 'TOTAL' ? (
										Redondea(
											item.financiero_programado_monto,
											ToggleSoles ? 2 : 4,
										) + (!ToggleSoles ? '%' : '')
									) : (
										<FinancieroProgramado
											item={item}
											UsuarioData={UsuarioData}
											recargar={recargarData}
											ToggleSoles={ToggleSoles}
											Obra={Obra}
										/>
									)}
								</TableCell>
							))}
							<TableCell>
								{Redondea(
									CurvaSdata.reduce((acc, item) => {
										if (item.tipo !== 'TOTAL') {
											acc += item.financiero_programado_monto;
										}
										return acc;
									}, 0),
									4,
								) + (!ToggleSoles ? '%' : '')}
							</TableCell>
						</TableRow>
						<TableRow className='curvaS_FinancieroRow'>
							<TableCell
								style={{ width: '200px', display: 'block' }}
								className='curvaS_tablaCabezera'
							>
								PROGRAMADO FINANCIERO ACTUALIZADO
							</TableCell>
							{CurvaSdata.map((item, i) => (
								<TableCell key={i}>
									{(esMenorIgualMesActual(item.anyo, item.mes)
										? Redondea(item.financiero_monto, ToggleSoles ? 2 : 4)
										: Redondea(
												item.financiero_programado_monto,
												ToggleSoles ? 2 : 4,
										  )) + (!ToggleSoles ? '%' : '')}
								</TableCell>
							))}
							<TableCell>
								{Redondea(
									CurvaSdata.reduce((acc, item) => {
										if (item.tipo !== 'TOTAL') {
											acc += esMenorIgualMesActual(item.anyo, item.mes)
												? item.financiero_monto
												: item.financiero_programado_monto;
										}
										return acc;
									}, 0),
									4,
								) + (!ToggleSoles ? '%' : '')}
							</TableCell>
						</TableRow>
						<TableRow className='curvaS_FinancieroRow'>
							<TableCell
								style={{ width: '200px', display: 'block' }}
								className='curvaS_tablaCabezera'
							>
								FINANCIERO
							</TableCell>
							{CurvaSdata.map((item, i) => (
								<TableCell key={i}>
									{item.tipo === 'TOTAL' ? (
										Redondea(item.financiero_monto, ToggleSoles ? 2 : 4) +
										(!ToggleSoles ? '%' : '')
									) : (
										<Financiero
											item={item}
											UsuarioData={UsuarioData}
											recargar={recargarData}
											ToggleSoles={ToggleSoles}
											Obra={Obra}
										/>
									)}
								</TableCell>
							))}
							<TableCell>
								{Redondea(
									CurvaSdata.reduce((acc, item) => {
										if (item.tipo !== 'TOTAL') {
											acc += item.financiero_monto;
										}
										return acc;
									}, 0),
									4,
								) + (!ToggleSoles ? '%' : '')}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

const Programado = ({ item, recargar, ToggleSoles, Obra, Permisos }) => {
	// TODO: Implement Programado component logic
	return <div>Programado component</div>;
};

const FinancieroProgramado = ({
	item,
	UsuarioData,
	recargar,
	ToggleSoles,
	Obra,
	Permisos,
}) => {
	// TODO: Implement FinancieroProgramado component logic
	return <div>FinancieroProgramado component</div>;
};

const Financiero = ({
	item,
	UsuarioData,
	recargar,
	ToggleSoles,
	Obra,
	Permisos,
}) => {
	// TODO: Implement Financiero component logic
	return <div>Financiero component</div>;
};
const FormularioPrincipal = ({ id_ficha, recargarData }) => {
	// TODO: Implement FormularioPrincipal component logic
	return <div>FormularioPrincipal component</div>;
};

export default CurveSDialog;

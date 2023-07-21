import React from 'react';
import PropTypes from 'prop-types';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { FaList } from 'react-icons/fa';
import {
	calculateDays,
	fechaFormatoClasico,
	Redondea,
} from '../../js/components/Utils/Funciones';
import CarouselNavs from '../../js/components/Inicio/Carousel/CarouselNavs';
import ProgressBar from '../organisms/ProgressBar';
import OutlinedLabel from '../organisms/OutlinedLabel';
import PlazosInfo from '../organisms/PlazosInfo';
import PersonalComponent from '../organisms/PersonalComponent';
import LabelsDialog from '../organisms/LabelsDialog/index';
import { useTheme } from '@mui/material/styles';
// import CurvaSDialog from "../organisms/CurveSDialog";
import CurvaSDialog from '../../js/components/Inicio/Cuva_S/index';
import { cookies } from 'next/dist/client/components/headers';
import Cookies from 'js-cookie';

const styles = {
	cell: {
		paddingTop: 4,
		paddingBottom: 4,
	},
	rowHeader: {
		color: '#cecece',
		fontSize: '1.2rem',
		fontWeight: '700',
	},
	sectorHeader: {
		color: '#ffa500',
		fontSize: '1rem',
		fontWeight: '700',
	},
	cellOptions: {
		display: 'flex',
	},
};

const ObrasTable = ({ obras, setSelectedWorkHandler }) => {
	if (obras.length > 0 && !Cookies.get('idobra')) {
		Cookies.set('idobra', obras[0].id_ficha);
	}
	const theme = useTheme();

	const handleSelectedWork = item => {
		setSelectedWorkHandler(item);
	};

	const renderRowHeader = name => {
		return (
			<TableRow>
				<TableCell colSpan={8} style={styles.rowHeader}>
					{name}
				</TableCell>
			</TableRow>
		);
	};

	const renderSectorHeader = name => {
		return (
			<TableRow>
				<TableCell colSpan={8} style={styles.sectorHeader}>
					{name}
				</TableCell>
			</TableRow>
		);
	};

	const renderObraRow = (item, index) => {
		const isFirstItem =
			index === 0 ||
			item.unidad_ejecutora_nombre !== obras[index - 1].unidad_ejecutora_nombre;
		const isDifferentSector =
			item.unidad_ejecutora_nombre !==
				obras[index - 1]?.unidad_ejecutora_nombre ||
			item.sector_nombre !== obras[index - 1]?.sector_nombre;

		return (
			<React.Fragment key={item.id_ficha}>
				{isFirstItem && renderRowHeader(item.unidad_ejecutora_nombre)}
				{isDifferentSector && renderSectorHeader(item.sector_nombre)}
				<TableRow>
					<TableCell style={styles.cell}>{index + 1}</TableCell>
					<TableCell style={styles.cell}>
						<OutlinedLabel
							color='white'
							name={item.codigo}
							onClick={() => handleSelectedWork(item)}
						/>

						{item.g_meta + '/CUI - ' + item.codigo_unificado}
						<div>
							<span style={{ color: theme.palette.primary.main }}>
								PRESUPUESTO S./{Redondea(item.g_total_presu)}
							</span>{' '}
							<span style={{ color: theme.palette.secondary.main }}>
								SALDO FINANCIERO S./
								{Redondea(item.g_total_presu - item.avancefinanciero_acumulado)}
							</span>{' '}
							<span style={{ color: theme.palette.primary.main }}>
								PIM 2021 S./{Redondea(item.pim_anyoactual)}
							</span>{' '}
							<span style={{ color: theme.palette.secondary.main }}>
								META 2021 -{item.meta_anyoactual}
							</span>
						</div>
						<PlazosInfo
							plazoinicial_fecha={item.plazoinicial_fecha}
							plazoinicial_fechafinal={item.plazoinicial_fechafinal}
							plazoaprobado_ultimo_fecha={item.plazoaprobado_ultimo_fecha}
							plazosinaprobar_ultimo_fecha={item.plazosinaprobar_ultimo_fecha}
						/>
					</TableCell>
					<TableCell style={styles.cell}>
						<OutlinedLabel
							color={item.estadoobra_color}
							name={item.estadoobra_nombre}
						/>
					</TableCell>
					<TableCell style={styles.cell}>
						{calculateDays(item.avancefisico_ultimafecha, new Date()) - 1} dias
						<div>{fechaFormatoClasico(item.avancefisico_ultimafecha)}</div>
					</TableCell>
					<TableCell style={styles.cell}>
						<ProgressBar
							tipo='barra'
							avance={item.avancefisico_acumulado}
							total={item.presupuesto_costodirecto}
							color={theme.palette.primary.main}
							tipoProgreso='Fisico'
						/>
						<ProgressBar
							tipo='barra'
							avance={item.avancefinanciero_acumulado}
							total={item.g_total_presu}
							color={theme.palette.secondary.main}
							tipoProgreso='Financiero'
						/>
					</TableCell>
					<TableCell>
						<div style={styles.cellOptions}>
							<button
								title='Component Progress'
								onClick={() =>
									onChangeObraComponentesSeleccionada(item.id_ficha)
								}
							>
								<FaList />
							</button>
							<PersonalComponent
								id_ficha={item.id_ficha}
								codigo_obra={item.codigo}
							/>
						</div>
						<div style={styles.cellOptions}>
							<CurvaSDialog id_ficha={item.id_ficha} Obra={item} />
							<LabelsDialog id_ficha={item.id_ficha} codigo={item.codigo} />
							<CarouselNavs id_ficha={item.id_ficha} codigo={item.codigo} />
						</div>
					</TableCell>
				</TableRow>
			</React.Fragment>
		);
	};

	return (
		<TableContainer component={Paper}>
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell align='center'>N°</TableCell>
						<TableCell>OBRA</TableCell>
						<TableCell align='center'>ESTADO</TableCell>
						<TableCell align='center'>UDM</TableCell>
						<TableCell align='center'>AVANCE</TableCell>
						<TableCell align='center'>OPCIONES</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{obras.map(renderObraRow)}</TableBody>
			</Table>
		</TableContainer>
	);
};

ObrasTable.propTypes = {
	obras: PropTypes.array.isRequired,
	setSelectedWorkHandler: PropTypes.func.isRequired,
};

ObrasTable.defaultProps = {
	obras: [],
	setSelectedWorkHandler: () => {},
};

export default ObrasTable;

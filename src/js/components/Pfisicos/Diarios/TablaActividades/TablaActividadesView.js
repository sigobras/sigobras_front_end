import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { Redondea } from '../../../Utils/Funciones';
import BarraPorcentajeAvance from '../BarraPorcentajeAvance';
import ModalIngresoMetradoController from '../ModalIngresoMetrado/ModalIngresoMetradoController';
import { MdFlashOn } from 'react-icons/md';

const TablaActividadesView = ({
	Actividades,
	Partida,
	onSaveMetrado,
	EstadoObra,
}) => {
	return (
		<div>
			<Typography variant='subtitle1' color='primary'>
				{Partida.descripcion} <MdFlashOn size={20} className='text-danger' />
				rendimiento: {Partida.rendimiento} {Partida.unidad_medida}
			</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ACTIVIDADES</TableCell>
						<TableCell>N° VECES</TableCell>
						<TableCell>LARGO</TableCell>
						<TableCell>ANCHO</TableCell>
						<TableCell>ALTO</TableCell>
						<TableCell>METRADO</TableCell>
						<TableCell>P / U </TableCell>
						<TableCell>P / P</TableCell>
						<TableCell>AVANCE Y SALDO</TableCell>
						<TableCell>METRAR</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Actividades.map(item => (
						<TableRow key={item.id_actividad}>
							<TableCell>{item.nombre}</TableCell>
							<TableCell>{item.veces}</TableCell>
							<TableCell>{item.largo}</TableCell>
							<TableCell>{item.ancho}</TableCell>
							<TableCell>{item.alto}</TableCell>
							<TableCell>
								{Redondea(item.parcial)} {Partida.unidad_medida}
							</TableCell>
							<TableCell>{Redondea(Partida.costo_unitario)}</TableCell>
							<TableCell>
								{Redondea(item.parcial * Partida.costo_unitario)}
							</TableCell>
							<TableCell>
								<BarraPorcentajeAvance
									avanceMetrado={item.avance_metrado}
									avanceSoles={item.avance_soles}
									saldoMetrado={item.metrado - item.avance_metrado}
									saldoSoles={item.presupuesto - item.avance_soles}
									avancePorcentaje={(item.avance_metrado / item.metrado) * 100}
								/>
							</TableCell>
							<TableCell>
								<ModalIngresoMetradoController
									Partida={Partida}
									Actividad={item}
									EstadoObra={EstadoObra}
									saldo={item.metrado - item.avance_metrado}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default TablaActividadesView;

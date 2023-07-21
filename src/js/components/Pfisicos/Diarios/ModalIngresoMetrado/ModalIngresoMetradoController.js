import React, { useState } from 'react';
import ModalIngresoMetradoView from './ModalIngresoMetradoView';

const ModalIngresoMetradoController = ({
	Partida,
	Actividad,
	EstadoObra,
	saldo,
}) => {
	const [modalData, setModalData] = useState({
		valor: '',
		fecha: '',
		descripcion: '',
	});

	const handleChange = (field, value) => {
		setModalData(prevData => ({
			...prevData,
			[field]: value,
		}));
	};

	const saveModalDATA = () => {
		console.log('guardando data', modalData);
	};

	return (
		<div>
			<ModalIngresoMetradoView
				SaldoActividad={saldo}
				EstadoObra={EstadoObra}
				Partida={Partida}
				Actividad={Actividad}
				onChangeModalData={handleChange}
				saveModalDATA={saveModalDATA}
			/>
		</div>
	);
};

export default ModalIngresoMetradoController;

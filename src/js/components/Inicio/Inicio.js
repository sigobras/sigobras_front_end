import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
	useEstadosObra,
	useObras,
	useProvincias,
	useSectores,
} from '../../../hooks/useInicioInfo';
import styles from './inicio.module.css';
import FiltrosComponent from '../../../components/organisms/FiltrosObras';
import ObrasTable from '../../../components/templates/ObrasTable';

const ObrasComponent = () => {
	const { data } = useSession();
	const id_acceso = data?.user?.id;
	const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(0);
	const [sectorSeleccionado, setSectorSeleccionado] = useState(0);
	const [estadosObraSeleccionada, setEstadosObraSeleccionada] = useState(0);

	let provincias = [];
	let sectores = [];
	let estadosObra = [];

	provincias = useProvincias(id_acceso);
	sectores = useSectores(id_acceso, provinciaSeleccionada);
	estadosObra = useEstadosObra(id_acceso);

	const obras = useObras(
		provinciaSeleccionada,
		sectorSeleccionado,
		estadosObraSeleccionada,
	);
	const setSelectedWorkHandler = item => {
		console.log({ item });
		localStorage.setItem('id_expediente', item.id_expediente);
		localStorage.setItem('id_ficha', item.id_ficha);
	};
	useEffect(() => {
		if (
			obras.length > 0 &&
			!localStorage.getItem('id_expediente') &&
			!localStorage.getItem('id_ficha')
		) {
			setSelectedWorkHandler(obras[0]);
		}
	}, [obras]);

	return (
		<div>
			<div className={styles['banner-container']}>
				<img src='./images/banner.jpg' alt='Banner' />
			</div>
			<FiltrosComponent
				provincias={provincias}
				provinciaSeleccionada={provinciaSeleccionada}
				setProvinciaSeleccionada={setProvinciaSeleccionada}
				sectores={sectores}
				sectorSeleccionado={sectorSeleccionado}
				setSectorSeleccionado={setSectorSeleccionado}
				estadosObra={estadosObra}
				estadosObraSeleccionada={estadosObraSeleccionada}
				setEstadosObraSeleccionada={setEstadosObraSeleccionada}
			/>
			<ObrasTable
				obras={obras}
				setSelectedWorkHandler={setSelectedWorkHandler}
			/>
		</div>
	);
};

export default ObrasComponent;

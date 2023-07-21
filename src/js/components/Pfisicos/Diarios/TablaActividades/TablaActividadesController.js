import React, { useEffect, useState } from 'react';
import TablaActividadesView from './TablaActividadesView';
import axios from 'axios';
import { UrlServer } from '../../../Utils/ServerUrlConfig';
import { Container } from './styled';

const TablaActividadesViewController = ({
	partida,
	onSaveMetrado,
	EstadoObra,
}) => {
	const [actividades, setActividades] = useState([]);

	useEffect(() => {
		// Función para realizar el fetch y obtener las actividades
		const fetchActividades = async () => {
			const response = await axios.post(`${UrlServer}/getActividades2`, {
				id_partida: partida.id_partida,
			});
			setActividades(response.data);
		};

		fetchActividades();
	}, [partida]);

	return (
		<Container>
			<TablaActividadesView
				Actividades={actividades}
				Partida={partida}
				onSaveMetrado={onSaveMetrado}
				EstadoObra={EstadoObra}
			/>
		</Container>
	);
};

export default TablaActividadesViewController;

import { useState, useEffect } from 'react';
import { getObrasLabels } from '../services/labelsService';

export const useFichasLabels = (id_ficha, textoBuscar) => {
	const [fichasLabels, setFichasLabels] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getObrasLabels(id_ficha, textoBuscar);
			setFichasLabels(data);
		};
		fetchData();
	}, [id_ficha, textoBuscar]);

	return fichasLabels;
};

import { useState, useEffect } from 'react';
import {
	getCurvaSAcumulados,
	getCurvaSAcumuladosByAnyo,
	getDataCurvaSAnyos,
	getPimMonto,
	getUsuarioData,
} from '../services/inicioService';

export function useUsuarioData(id_acceso, id_ficha) {
	const [usuarioData, setUsuarioData] = useState({});

	useEffect(() => {
		fetchUsuarioData();
	}, [id_acceso, id_ficha]);

	async function fetchUsuarioData() {
		const data = await getUsuarioData(id_acceso, id_ficha);
		setUsuarioData(data);
	}

	return usuarioData;
}

export function useCurvaSAcumulados(id_ficha, anyo) {
	const [curvaSAcumulados, setCurvaSAcumulados] = useState({});
	const [curvaSAcumuladosAnyoEspecifico, setCurvaSAcumuladosAnyoEspecifico] =
		useState({});
	const [pimMonto, setPimMonto] = useState(0);

	useEffect(() => {
		if (id_ficha && anyo) {
			fetchCurvaSAcumulados();
			fetchCurvaSAcumuladosAnyoEspecifico();
			fetchPimMonto();
		}
	}, [id_ficha, anyo]);

	async function fetchCurvaSAcumulados() {
		const data = await getCurvaSAcumulados(id_ficha, anyo);
		setCurvaSAcumulados(data[0]);
	}

	async function fetchCurvaSAcumuladosAnyoEspecifico() {
		const data = await getCurvaSAcumuladosByAnyo(id_ficha, anyo);
		setCurvaSAcumuladosAnyoEspecifico(data[0]);
	}

	async function fetchPimMonto() {
		const data = await getPimMonto(id_ficha, anyo);
		setPimMonto(data[0].pim);
	}

	return {
		curvaSAcumulados,
		curvaSAcumuladosAnyoEspecifico,
		pimMonto,
	};
}
export const useFetchCurvaSAnyos = id_ficha => {
	const [CurvaSAnyos, setCurvaSAnyos] = useState([]);
	const [CurvaSAnyoSeleccionado, setCurvaSAnyoSeleccionado] = useState('');

	useEffect(() => {
		if (id_ficha) {
			const fetchCurvaSAnyos = async () => {
				try {
					const data = await getDataCurvaSAnyos(id_ficha);
					setCurvaSAnyos(data);
					setCurvaSAnyoSeleccionado(data[0]?.anyo);
				} catch (error) {}
			};
			fetchCurvaSAnyos();
		}
	}, [id_ficha]);

	return {
		CurvaSAnyos,
		CurvaSAnyoSeleccionado,
		setCurvaSAnyoSeleccionado,
	};
};

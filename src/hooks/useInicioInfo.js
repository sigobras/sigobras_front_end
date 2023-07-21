import { useEffect, useState } from 'react';
import {
	fetchEstadosObra,
	fetchObras,
	fetchProvincias,
	fetchSectores,
} from '../services/inicioService';

export const useProvincias = id_acceso => {
	const [provincias, setProvincias] = useState([]);

	useEffect(() => {
		if (id_acceso) {
			const fetchProvinciasData = async () => {
				try {
					const data = await fetchProvincias(id_acceso);
					setProvincias(data);
				} catch (error) {
					// Manejo de errores
				}
			};

			fetchProvinciasData();
		}
	}, [id_acceso]);

	return provincias;
};

export const useSectores = (id_acceso, provinciaSeleccionada) => {
	const [sectores, setSectores] = useState([]);

	useEffect(() => {
		if (id_acceso) {
			const fetchSectoresData = async () => {
				try {
					const data = await fetchSectores(provinciaSeleccionada, id_acceso);
					setSectores(data);
				} catch (error) {
					// Manejo de errores
				}
			};

			fetchSectoresData();
		}
	}, [id_acceso, provinciaSeleccionada]);

	return sectores;
};

export const useEstadosObra = id_acceso => {
	const [estadosObra, setEstadosObra] = useState([]);

	useEffect(() => {
		if (id_acceso) {
			const fetchEstadosObraData = async () => {
				try {
					const data = await fetchEstadosObra(id_acceso);
					setEstadosObra(data);
				} catch (error) {
					// Manejo de errores
				}
			};

			fetchEstadosObraData();
		}
	}, [id_acceso]);

	return estadosObra;
};

export const useObras = (
	provinciaSeleccionada,
	sectorSeleccionado,
	estadosObraSeleccionada,
	id_acceso,
) => {
	const [obras, setObras] = useState([]);

	useEffect(() => {
		const obtenerObras = async () => {
			const obrasFiltradas = await fetchObras(
				provinciaSeleccionada,
				sectorSeleccionado,
				estadosObraSeleccionada,
				id_acceso,
			);
			setObras(obrasFiltradas);
		};

		obtenerObras();
	}, [
		provinciaSeleccionada,
		sectorSeleccionado,
		estadosObraSeleccionada,
		id_acceso,
	]);

	return obras;
};

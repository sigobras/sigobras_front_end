import { useState, useEffect } from 'react';
import {
	getActiveInterfacePermission,
	getWorkPositions,
	getDesignations,
	getUserData,
	updateDesignation,
	getCargosService,
	fetchUsuariosPersonal,
} from '../services/personalService';

export const usePermissions = nombres_clave => {
	const [permissions, setPermissions] = useState([]);

	useEffect(() => {
		async function fetchPermissions() {
			const data = await getActiveInterfacePermission({
				id_acceso: sessionStorage.getItem('idacceso'),
				id_ficha: sessionStorage.getItem('idobra'),
				nombres_clave,
			});
			setPermissions(data);
		}
		fetchPermissions();
	}, [nombres_clave]);

	return permissions;
};

export const useWorkPositions = params => {
	const [workPositions, setWorkPositions] = useState([]);

	useEffect(() => {
		async function fetchWorkPositions() {
			const data = await getWorkPositions(params);
			setWorkPositions(data);
		}
		fetchWorkPositions();
	}, [params]);

	return workPositions;
};

export const useDesignations = params => {
	const [designations, setDesignations] = useState([]);

	useEffect(() => {
		async function fetchDesignations() {
			const data = await getDesignations(params);
			setDesignations(data);
		}
		fetchDesignations();
	}, [params]);

	return designations;
};

export const useUserData = (id_ficha, id_acceso) => {
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		async function fetchUserData() {
			const data = await getUserData(id_ficha, id_acceso);
			setUserData(data);
		}
		fetchUserData();
	}, [id_ficha, id_acceso]);

	return userData;
};

export const useUpdateDesignation = () => {
	const [status, setStatus] = useState('');

	const update = async (id, data) => {
		try {
			await updateDesignation(id, data);
			setStatus('success');
		} catch (error) {
			setStatus('error');
		}
	};

	return { status, update };
};
export const useCargosLimitados = id => {
	const [cargosLimitados, setCargosLimitados] = useState([]);

	useEffect(() => {
		const cargarCargos = async () => {
			const cargos = await getCargosService(id);
			setCargosLimitados(cargos);
		};

		cargarCargos();
	}, []);

	return cargosLimitados;
};
export function useUsuariosPersonal(id_ficha, cargos_tipo_id) {
	const [usuariosPersonal, setUsuariosPersonal] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const data = await fetchUsuariosPersonal(id_ficha, cargos_tipo_id, true);
			setUsuariosPersonal(data);
		}
		fetchData();
	}, [id_ficha, cargos_tipo_id]);

	return usuariosPersonal;
}

export function useUsuariosPersonalInactivos(id_ficha, cargos_tipo_id) {
	const [usuariosPersonalInactivos, setUsuariosPersonalInactivos] = useState(
		[],
	);

	useEffect(() => {
		async function fetchData() {
			const data = await fetchUsuariosPersonal(
				id_ficha,
				cargos_tipo_id,
				false,
				'cargos_tipo_id,nivel',
			);
			setUsuariosPersonalInactivos(data);
		}
		fetchData();
	}, [id_ficha, cargos_tipo_id]);

	return usuariosPersonalInactivos;
}

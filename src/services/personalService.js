// service.js

import axios from 'axios';
import { UrlServer } from '../utils/ServerUrlConfig';

export async function getActiveInterfacePermission(params) {
	const res = await axios.get(`${UrlServer}/v1/interfazPermisos/activo`, {
		params,
	});
	return res.data;
}

export async function getWorkPositions(params) {
	const res = await axios.get(`${UrlServer}/v1/cargos/obra`, { params });
	return res.data;
}

export async function getDesignations(params) {
	const res = await axios.get(`${UrlServer}/v1/designaciones`, { params });
	return res.data;
}

export async function updateDesignation(id, data) {
	await axios.put(`${UrlServer}/v1/designaciones/${id}`, data);
}

export async function getUserData(idFicha) {
	const request = await axios.get(
		`${UrlServer}/v1/usuarios/obra/${idFicha}/acceso/${sessionStorage.getItem(
			'idacceso',
		)}`,
	);
	return request.data;
}

export async function uploadMemorandum(id, formData, config) {
	const res = await axios.put(
		`${UrlServer}/v1/designaciones/${id}/memorandum`,
		formData,
		config,
	);
	return res.data;
}
// formulario
export const getUserByDNI = async dni => {
	const res = await axios.get(`${UrlServer}/v1/usuarios/dni/${dni}`);
	return res.data;
};

export const createUser = async (idFicha, IdCargoSeleccionado, data) => {
	const res = await axios.post(
		`${UrlServer}/v1/usuarios/obra/${idFicha}/cargo/${IdCargoSeleccionado}`,
		data,
	);
	return res.data;
};

export const updateUser = async (idAcceso, data) => {
	const res = await axios.put(`${UrlServer}/v1/usuarios/${idAcceso}`, data);
	return res.data;
};
export const getCargosService = async cargosTipoId => {
	const res = await axios.get(`${UrlServer}/v1/cargos/`, {
		params: {
			cargos_tipo_id: cargosTipoId,
		},
	});
	return res.data;
};

export const postAccesosAsignarObraService = async (
	idFicha,
	idAcceso,
	idCargo,
	fechaInicio,
) => {
	const res = await axios.post(`${UrlServer}/v1/accesos/asignarObra`, {
		Fichas_id_ficha: idFicha,
		Accesos_id_acceso: idAcceso,
		cargos_id_Cargo: idCargo,
		fecha_inicio: fechaInicio,
	});
	return res.data;
};

export const putUsuariosService = async (idAcceso, data) => {
	const res = await axios.put(`${UrlServer}/v1/usuarios/${idAcceso}`, data);
	return res.data;
};

export const postUsuariosService = async (
	idFicha,
	IdCargoSeleccionado,
	data,
) => {
	const res = await axios.post(
		`${UrlServer}/v1/usuarios/obra/${idFicha}/cargo/${IdCargoSeleccionado}`,
		data,
	);
	return res.data;
};
export async function fetchUsuariosPersonal(
	idFicha,
	idTipoCargo,
	habilitado = true,
	sortBy,
) {
	const res = await axios.get(`${UrlServer}/v1/usuarios`, {
		params: {
			id_ficha: idFicha,
			habilitado,
			cargos_tipo_id: idTipoCargo,
		},
	});
	return res.data;
}

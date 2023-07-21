import axios from 'axios';
import { UrlServer } from '../utils/ServerUrlConfig';

export const fetchProvincias = async idAcceso => {
	const res = await axios.get(`${UrlServer}/v1/unidadEjecutora`, {
		params: {
			id_acceso: idAcceso,
		},
	});
	return res.data;
};

export const fetchSectores = async (provinciaSeleccionada, idAcceso) => {
	const res = await axios.get(`${UrlServer}/v1/sectores`, {
		params: {
			id_acceso: idAcceso,
			id_unidadEjecutora: provinciaSeleccionada,
		},
	});
	return res.data;
};

export const fetchEstadosObra = async idAcceso => {
	const res = await axios.get(`${UrlServer}/v1/obrasEstados`, {
		params: {
			id_acceso: idAcceso,
		},
	});
	return res.data;
};

export const fetchObras = async (
	provinciaSeleccionada,
	sectoreSeleccionado,
	estadosObraeleccionada,
	idAcceso,
) => {
	const res = await axios.get(`${UrlServer}/v1/obras`, {
		params: {
			id_acceso: idAcceso,
			id_unidadEjecutora: provinciaSeleccionada,
			idsectores: sectoreSeleccionado,
			id_Estado: estadosObraeleccionada,
			sort_by: 'poblacion-desc',
		},
	});
	return res.data;
};
// curve S header
export async function getUsuarioData(idAcceso, idFicha) {
	const res = await axios.post(`${UrlServer}/getDatosUsuario`, {
		id_acceso: idAcceso,
		id_ficha: idFicha,
	});
	return res.data;
}

export async function getCurvaSAcumulados(idFicha, anyo) {
	const res = await axios.post(`${UrlServer}/getDataCurvaSAcumulados`, {
		id_ficha: idFicha,
		anyo,
	});
	return res.data;
}

export async function getCurvaSAcumuladosByAnyo(idFicha, anyo) {
	const res = await axios.post(`${UrlServer}/getDataCurvaSAcumuladosByAnyo2`, {
		id_ficha: idFicha,
		anyo,
	});
	return res.data;
}

export async function getPimMonto(idFicha, anyo) {
	const res = await axios.post(`${UrlServer}/getCurvaSPin`, {
		id_ficha: idFicha,
		anyo,
	});
	return res.data;
}

export async function getDataCurvaSAnyos(idFicha) {
	const res = await axios.post(`${UrlServer}/getDataCurvaSAnyos`, {
		id_ficha: idFicha,
	});
	return res.data;
}

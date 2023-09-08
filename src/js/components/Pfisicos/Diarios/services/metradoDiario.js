import axios from 'axios';
import { UrlServer } from '../../../Utils/ServerUrlConfig';

export async function obtenerTiposComponentes(id_expediente) {
	try {
		const res = await axios.get(
			`${UrlServer}/v1/componentes/cantidad?id_expediente=${id_expediente}`
		);
		return res.data;
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function obtenerComponentes(id_expediente, tipo) {
	try {
		const res = await axios.get(
			`${UrlServer}/v1/componentes?id_expediente=${id_expediente}&tipo=${tipo}`
		);
		return res.data;
	} catch (error) {
		console.error(error);
		return [];
	}
}
export async function obtenerComponenteAvance(id_componente) {
	try {
		const res = await axios.get(
			`${UrlServer}/v1/avance/componente?id_componente=${id_componente}`
		);
		return res.data;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function guardarPartidaMayorMetrado(datos) {
	try {
		const res = await axios.post(`${UrlServer}/v1/actividades/newByType`, datos);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error; 
	}
}
export async function guardarActividadMayorMetrado(datos) {
	try {
		const res = await axios.post(`${UrlServer}/v1/actividades`, datos);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error; 
	}
}
export async function actualizarActividadMayorMetrado(id,datos) {
	try {
		const res = await axios.put(`${UrlServer}/v1/actividades/${id}`, datos);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error; 
	}
}
export async function eliminarActividadMayorMetrado(id) {
	try {
	  const res = await axios.delete(`${UrlServer}/v1/actividades/${id}`);
	  return res.data;
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }
export async function eliminarPartidaMayorMetrado(id) {
	try {
		const res = await axios.delete(`${UrlServer}/v1/partidas/${id}`);
		return res.data;
	} catch (error) {
		console.error(error);
		throw error; 
	}
}
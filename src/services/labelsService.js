import axios from 'axios';
import { UrlServer } from '../utils/ServerUrlConfig';

export const getObrasLabels = async (idFicha, textoBuscar) => {
	const res = await axios.get(`${UrlServer}/v1/obrasLabels`, {
		params: {
			id_ficha: idFicha,
			textoBuscar,
		},
	});
	return res.data;
};

export const postObrasLabels = async formularioDatos => {
	const res = await axios.post(`${UrlServer}/v1/obrasLabels`, formularioDatos);
	return res.status;
};

export const postFichasAsignarLabels = async (idFicha, idLabel) => {
	const res = await axios.post(`${UrlServer}/FichasAsignarLabels`, {
		id_ficha: idFicha,
		id_label: idLabel,
	});
	return res.status;
};

export const getEstadoAsignado = async (idFicha, idLabel) => {
	const res = await axios.get(`${UrlServer}/v1/obrasLabels/obras/cantidad`, {
		params: {
			id_ficha: idFicha,
			id_label: idLabel,
		},
	});
	return res.data.cantidad;
};

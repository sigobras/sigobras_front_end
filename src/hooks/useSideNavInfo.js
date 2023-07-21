// hooks/useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { UrlServer } from '../utils/ServerUrlConfig';

export const useSideNavInfo = id_ficha => {
	const [dataMenus, setDataMenus] = useState([]);
	useEffect(() => {
		if (id_ficha) {
			const fetchMenu = async () => {
				const res = await axios.post(`${UrlServer}/getMenu2`, {
					id_ficha,
					id_acceso: sessionStorage.getItem('idacceso'),
				});
				if (Array.isArray(res.data)) {
					setDataMenus(res.data);
				}
			};
			fetchMenu();
		}
	}, [id_ficha]);

	return { dataMenus };
};

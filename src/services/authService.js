import axios from 'axios';
import { UrlServer } from '../utils/ServerUrlConfig';

export const login = async (usuario, password) => {
	try {
		const res = await axios.post(`${UrlServer}/v1/accesos/login`, {
			usuario,
			password,
		});
		return res.data;
	} catch (error) {
		throw new Error(error.response.data.message);
	}
};

export const logout = async () => {
	try {
		const res = await axios.post(`${UrlServer}/v1/auth/logout`);
		return res.data;
	} catch (error) {
		throw new Error(error.response.data.message);
	}
};

export const register = async (username, password, email) => {
	try {
		const res = await axios.post(`${UrlServer}/v1/auth/register`, {
			username,
			password,
			email,
		});
		return res.data;
	} catch (error) {
		throw new Error(error.response.data.message);
	}
};

export const getUserInfo = async () => {
	try {
		const res = await axios.get(`${UrlServer}/v1/auth/userInfo`);
		return res.data;
	} catch (error) {
		throw new Error(error.response.data.message);
	}
};

import React, { useState, useEffect } from 'react';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { FaPowerOff } from 'react-icons/fa';
import axios from 'axios';

import { UrlServer } from '../Utils/ServerUrlConfig';

const UsuarioComponent = () => {
	const [Usuario, setUsuario] = useState({
		cargo_nombre: '======',
		usuario_nombre: '======',
	});

	const fetchUsuario = async () => {
		try {
			const response = await axios.post(`${UrlServer}/getDatosUsuario`, {
				id_acceso: sessionStorage.getItem('idacceso'),
				id_ficha: sessionStorage.getItem('idobra'),
			});
			setUsuario(response.data);
		} catch (error) {
			// Manejo de errores aquí
		}
	};

	const cierraSesion = () => {
		if (window.confirm('¿Estás seguro de salir del sistema?')) {
			sessionStorage.clear();
			window.location.href = '/';
		}
	};

	useEffect(() => {
		fetchUsuario();
	}, []);

	return (
		<div>
			<span id='userLogin' className='mr-1 nav-link text-white d-flex'>
				<div className='text-capitalize font-weight-bold'>
					{Usuario.cargo_nombre}
				</div>
				: {Usuario.usuario_nombre}
			</span>
			<UncontrolledPopover
				trigger='legacy'
				placement='bottom'
				target='userLogin'
			>
				<PopoverBody style={{ cursor: 'pointer' }}>
					<span className='nav-link' onClick={cierraSesion}>
						<FaPowerOff color='red' className='p-0' />
						Salir
					</span>
				</PopoverBody>
			</UncontrolledPopover>
		</div>
	);
};

export default UsuarioComponent;

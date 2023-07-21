import { useEffect, useState } from 'react';
import { socket } from '../../Utils/socket';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';

const ComponentesMensajes = ({ idComponente }) => {
	useEffect(() => {
		getComponentesComentarios();
		socketIni();
	}, []);
	function socketIni() {
		socket.on(
			'componentes_comentarios_notificacion_get-' +
				sessionStorage.getItem('idobra'),
			() => {
				getComponentesComentarios();
			},
		);
	}
	const [Mensajes, setMensajes] = useState(0);
	async function getComponentesComentarios() {
		const res = await axios.post(`${UrlServer}/getComponentesComentarios`, {
			id_acceso: sessionStorage.getItem('idacceso'),
			id_componente: idComponente,
		});
		setMensajes(res.data.mensajes);
	}

	return Mensajes ? (
		<div
			style={{
				background: 'red',
				borderRadius: '50%',
				textAlign: 'center',
				position: 'absolute',
				right: '0px',
				top: '-3px',
				padding: '1px 4px',
				zIndex: '20',
				fontSize: '9px',
				fontWeight: 'bold',
			}}
		>
			{Mensajes}
		</div>
	) : (
		<div />
	);
};
export default ComponentesMensajes;

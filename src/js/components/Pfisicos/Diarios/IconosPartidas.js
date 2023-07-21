import { useState, useEffect } from 'react';
import { FaSuperpowers } from 'react-icons/fa';
import {
	MdLibraryBooks,
	MdMonetizationOn,
	MdVisibility,
	MdWatch,
} from 'react-icons/md';
import { TiWarning } from 'react-icons/ti';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import axios from 'axios';

const IconosPartidas = ({
	idPartida,
	idIconoCategoria,
	idPrioridad,
	Categorias,
	CategoriasComponente,
	Prioridades,
}) => {
	useEffect(() => {
		fetchPrioridad(idPrioridad);
		fetchIcono(idIconoCategoria);
	}, []);
	const [Prioridad, setPrioridad] = useState('#f00');
	function fetchPrioridad(idPrioridad) {
		const Prioridad = Prioridades.find(item => {
			return item.id_prioridad === idPrioridad;
		});
		setPrioridad(Prioridad ? Prioridad.color : '#f00');
	}
	const [Icono, setIcono] = useState(<FaSuperpowers />);
	function fetchIcono(idIconoCategoria) {
		const icono = Categorias.find(icono => {
			return icono.id_iconoCategoria === idIconoCategoria;
		});
		let componenteIcono = <FaSuperpowers />;
		if (icono) {
			if (icono.nombre === '<FaSuperpowers/>') {
				componenteIcono = <FaSuperpowers />;
			} else if (icono.nombre === '<MdLibraryBooks/>') {
				componenteIcono = <MdLibraryBooks />;
			} else if (icono.nombre === '<TiWarning/>') {
				componenteIcono = <TiWarning />;
			} else if (icono.nombre === '<MdWatch/>') {
				componenteIcono = <MdWatch />;
			} else if (icono.nombre === '<MdVisibility/>') {
				componenteIcono = <MdVisibility />;
			} else if (icono.nombre === '<MdMonetizationOn/>') {
				componenteIcono = <MdMonetizationOn />;
			}
		}
		setIcono(componenteIcono);
	}
	// toogle categorias
	const [MenuCategorias, setMenuCategorias] = useState(false);
	const toogleCategorias = () => {
		setMenuCategorias(!MenuCategorias);
	};
	const [CategoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
	function onChangeCategoriaSeleccionada(idIconoCategoria) {
		setCategoriaSeleccionada(idIconoCategoria);
		toogleCategorias();
		setMenuPrioridades(true);
	}
	// toogle Prioridades
	const [MenuPrioridades, setMenuPrioridades] = useState(false);
	function onChangePrioridadSeleccionada(idPrioridad) {
		setMenuPrioridades(false);
		updateCategoriaPrioridad(idPrioridad, CategoriaSeleccionada);
	}
	async function updateCategoriaPrioridad(idPrioridad, idIconoCategoria) {
		await axios.post(`${UrlServer}/putCategoriaPrioridad`, {
			id_iconoCategoria: idIconoCategoria,
			id_prioridad: idPrioridad,
			id_partida: idPartida,
		});
		updatePartida(idPartida);
	}
	async function updatePartida(idPartida) {
		const request = await axios.post(`${UrlServer}/getPartidaById`, {
			id_partida: idPartida,
		});
		fetchPrioridad(request.data.prioridades_id_prioridad);
		fetchIcono(request.data.iconosCategorias_id_iconoCategoria);
	}
	return (
		<div>
			<div onClick={toogleCategorias} style={{ color: Prioridad }}>
				{Icono}
			</div>
			<div className={MenuCategorias ? 'menuCirculo' : 'd-none'}>
				{CategoriasComponente.map((item, i) => (
					<div
						className='circleIcono'
						onClick={() =>
							onChangeCategoriaSeleccionada(item.id_iconoCategoria)
						}
						key={i}
					>
						<span className='spanUbi'>{item.nombre} </span>
					</div>
				))}
			</div>
			<div className={MenuPrioridades ? 'menuCirculo' : 'd-none'}>
				{Prioridades.map((item, i) => (
					<div
						className='circleColor'
						style={{ background: item.color }}
						onClick={() => onChangePrioridadSeleccionada(item.id_prioridad)}
						key={i}
					/>
				))}
			</div>
		</div>
	);
};
export default IconosPartidas;

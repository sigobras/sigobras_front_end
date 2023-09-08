import axios from 'axios';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
	actualizarActividadMayorMetrado,
	eliminarActividadMayorMetrado,
	eliminarPartidaMayorMetrado,
	guardarActividadMayorMetrado,
	guardarPartidaMayorMetrado,
	obtenerComponenteAvance,
	obtenerComponentes,
	obtenerTiposComponentes,
} from '../services/metradoDiario';
import { MdCancel, MdLibraryBooks, MdMonetizationOn, MdVisibility, MdWatch } from 'react-icons/md';
import { useRef } from 'react';
import { UrlServer } from '../../../Utils/ServerUrlConfig';
import { FaSuperpowers } from 'react-icons/fa';
import { TiWarning } from 'react-icons/ti';
import { socket } from '../../../Utils/socket';
import { toast } from 'react-toastify';

export const useTipoComponente = id_expediente => {
	const [Componente, setComponente] = useState([]);
	const [ComponentesPorTipo, setComponentesPorTipo] = useState([]);
	const [ComponenteSelecccionado, setComponenteSelecccionado] = useState({
		numero: 0,
		nombre: 'Cargando...',
	});

	const [TipoComponenteSelecccionado, setTipoComponenteSelecccionado] = useState('origen');
	const [ComponenteAvance, setComponenteAvance] = useState(0);
	const [TextoBuscado, setTextoBuscado] = useState("");
	const onChangeComponentesSeleccion = componente => {
		setComponenteSelecccionado(componente);
		getAdvanceComponent(componente.id_componente);
	};
	const onChangeTipoComponenteSeleccion = async(tipoComponente) => {
		setTipoComponenteSelecccionado(tipoComponente);
		const component = await getComponents(tipoComponente);
		onChangeComponentesSeleccion(component[0]);
		getAdvanceComponent(component[0].id_componente)
	};

	const getComponentsByType = async () => {
		const res = await obtenerTiposComponentes(id_expediente);
		setComponentesPorTipo(res);
	};
	const getComponents = async tipo => {
		const res = await obtenerComponentes(id_expediente, tipo);
		setComponente(res);
		return res
		/* onChangeComponentesSeleccion(res[0]);
		getAdvanceComponent(res[0].id_componente) */
	};
	const getAdvanceComponent = async id => {
		const res = await obtenerComponenteAvance(id);
		setComponenteAvance(res.avance);
	}
	const toastConfig = {
		position: "bottom-right",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
	};


	//recarga de datos
	const [RefActividades, setRefActividades] = useState([]);
	const [RefPartidas, setRefPartidas] = useState([]);
	function onSaveMetrado(id_partida, id_actividad) {
		RefPartidas[id_partida].recarga();
		RefActividades[id_actividad].recarga();
	}
	//recarga de mensajes de componentes
	const [RefComponentes, setRefComponentes] = useState([]);
	function recargaComponenteMensajes(id_componente) {
		RefComponentes[id_componente].recarga();
	}
	//permisos
	const [Permisos, setPermisos] = useState(false);
	async function cargarPermiso(nombres_clave) {
		const res = await axios.get(`${UrlServer}/v1/interfazPermisos/activo`, {
			params: {
				id_acceso: sessionStorage.getItem("idacceso"),
				id_ficha: sessionStorage.getItem("idobra"),
				nombres_clave,
			},
		});
		var tempList = [];
		var tempArray = res.data;
		for (const key in tempArray) {
			tempList[key] = res.data[key];
		}
		setPermisos(tempList[0]);
	}

	//partidas
	const [TogglePartidasEstilo, setTogglePartidasEstilo] = useState(false);
	const [Partidas, setPartidas] = useState(
		new Array(15).fill({
			id_partida: -2,
			item: "--",
		})
	);
	async function fetchPartidas(source) {
		try {
			const response = await axios.post(
				`${UrlServer}/getPartidas2`,
				{
					id_componente: ComponenteSelecccionado.id_componente,
					inicio: (PaginaActual - 1) * CantidadPaginasPartidas,
					fin: Number(CantidadPaginasPartidas),
					id_iconoCategoria: MenuCategoriasSeleccionado.id_iconoCategoria,
					id_prioridad: MenuPrioridadesSeleccionado.id_prioridad,
					texto_buscar: TextoBuscado,
				},
				{ cancelToken: source.token }
			);

			const addLeadingZeros = (num, size) => {
				num = num.toString();
				while (num.length < size) num = "0" + num;
				return num;
			};

			const updatedData = response.data.map((item) => {
				item.item2 = item.item
					.split(".")
					.map((n) => addLeadingZeros(n, 10))
					.join("");
				return item;
			});

			const sortedData = updatedData.sort((a, b) =>
				a.item2.localeCompare(b.item2)
			);

			setPartidas(sortedData);

			if (!TogglePartidasEstilo) {
				//setTimeout(() => {
				setTogglePartidasEstilo(true);
				//}, 500);
			}

			if (FlagPaginaActual) {
				autoScroll();
				setFlagPaginaActual(false);
			}
		} catch (error) {

		}
	}
	const [PartidaSelecccionado, setPartidaSelecccionado] = useState({
		numero: 0,
		nombre: "",
		item: "-",
	});
	function onChangePartidasSeleccion(Partida) {
		if (Partida.id_partida != PartidaSelecccionado.id_partida) {
			setPartidaSelecccionado(Partida);
			fectchActividades(Partida.id_partida);
		} else {
			setPartidaSelecccionado({ numero: 0, nombre: "" });
		}
	}
	const handleDeletePartida = async (toggleModal) => {
		try {
			await eliminarPartidaMayorMetrado(PartidaSelecccionado.id_partida);
			toggleModal()
			setTimeout(async() => {
				let source = axios.CancelToken.source();
				fetchPartidas(source);
				const components = await getComponents("mayor metrado")
				if(components.length === 0){
					getComponentsByType()
					onChangeTipoComponenteSeleccion('origen')
				}
			}, 2000);
			toast.success('La partida se eliminó con exito! ', toastConfig);


		} catch (error) {
			toast.error('Error al eliminar la partida', toastConfig);
		}

	}

	//actividades
	const [Actividades, setActividades] = useState([]);
	async function fectchActividades(id_partida) {
		const request = await axios.post(`${UrlServer}/getActividades2`, {
			id_partida,
		});
		setActividades(request.data);
	}
	const handleDeleteActivity = async (Actividad) => {
		try {
			await eliminarActividadMayorMetrado(Actividad.id_actividad);
			fectchActividades(PartidaSelecccionado.id_partida);
			toast.success('La actividad se eliminó con exito! ', toastConfig);
		} catch (error) {
			toast.error('Error al eliminar la actividad', toastConfig);
		}
	}

	const savePartidaMayorMetrado = async (data) => {
		const res = await guardarPartidaMayorMetrado(data);
		fectchActividades(PartidaSelecccionado.id_partida);
		onChangePartidasSeleccion(PartidaSelecccionado)
		getComponentsByType()
	}
	const saveActividadMayorMetradoOnMM = async (data) => {
		const res = await guardarActividadMayorMetrado(data);
		fectchActividades(PartidaSelecccionado.id_partida);
	};

	const updateActividadMayorMetradoOnMM = async (Actividad, data) => {
		const res = await actualizarActividadMayorMetrado(Actividad.id_actividad, data);
		fectchActividades(PartidaSelecccionado.id_partida);
	};
	//Categorias
	const [Categorias, setCategorias] = useState([]);
	const [CategoriasComponente, setCategoriasComponente] = useState([]);
	async function fetchCategorias() {
		const res = await axios.get(`${UrlServer}/getIconoscategorias`);
		setCategorias(res.data);
		//preparando categorias componentente
		var categoriasComponente = [];
		res.data.forEach((icono) => {
			if (icono) {
				if (icono.nombre === "<FaSuperpowers/>") {
					categoriasComponente.push({
						id_iconoCategoria: icono.id_iconoCategoria,
						nombre: <FaSuperpowers />,
					});
				} else if (icono.nombre === "<MdLibraryBooks/>") {
					categoriasComponente.push({
						id_iconoCategoria: icono.id_iconoCategoria,
						nombre: <MdLibraryBooks />,
					});
				} else if (icono.nombre === "<TiWarning/>") {
					categoriasComponente.push({
						id_iconoCategoria: icono.id_iconoCategoria,
						nombre: <TiWarning />,
					});
				} else if (icono.nombre === "<MdWatch/>") {
					categoriasComponente.push({
						id_iconoCategoria: icono.id_iconoCategoria,
						nombre: <MdWatch />,
					});
				} else if (icono.nombre === "<MdVisibility/>") {
					categoriasComponente.push({
						id_iconoCategoria: icono.id_iconoCategoria,
						nombre: <MdVisibility />,
					});
				} else if (icono.nombre === "<MdMonetizationOn/>") {
					categoriasComponente.push({
						id_iconoCategoria: icono.id_iconoCategoria,
						nombre: <MdMonetizationOn />,
					});
				}
			}
		});
		setCategoriasComponente(categoriasComponente);
	}
	//menu categorias
	const [MenuCategorias, setMenuCategorias] = useState(false);
	const toggleMenuCategorias = () => setMenuCategorias(!MenuCategorias);
	const [MenuCategoriasSeleccionado, setMenuCategoriasSeleccionado] = useState({
		id_iconoCategoria: 0,
		nombre: <MdCancel size={17} />,
	});
	function onChangeMenuCategorias(categoria) {
		setMenuCategorias(false);
		setMenuCategoriasSeleccionado(categoria);
	}
	//prioridades
	const [Prioridades, setPrioridades] = useState([]);
	async function fectchPrioridades() {
		const request = await axios.get(`${UrlServer}/getPrioridades`);
		setPrioridades(request.data);
	}
	//menu prioridades
	const [MenuPrioridades, setMenuPrioridades] = useState(false);
	const toggleMenuPrioridades = () => setMenuPrioridades(!MenuPrioridades);
	const [MenuPrioridadesSeleccionado, setMenuPrioridadesSeleccionado] =
		useState({ id_prioridad: 0 });
	async function onChangeMenuPrioridades(prioridad) {
		setMenuPrioridades(false);
		setMenuPrioridadesSeleccionado(prioridad);
	}
	//paginacion
	const [CantidadPaginasPartidas, setCantidadPaginasPartidas] = useState(15);
	async function onChangeCantidadPaginasPartidas(value) {
		setCantidadPaginasPartidas(value);
	}
	const [PaginaActual, setPaginaActual] = useState(1);
	const [FlagPaginaActual, setFlagPaginaActual] = useState(false);
	function onChangePaginaActual(pagina) {
		setPaginaActual(pagina);
		setFlagPaginaActual(true);
	}
	const [ConteoPartidas, setConteoPartidas] = useState([]);
	async function fectchConteoPartidas() {
		const request = await axios.post(`${UrlServer}/getTotalConteoPartidas`, {
			id_componente: ComponenteSelecccionado.id_componente,
			id_iconoCategoria: MenuCategoriasSeleccionado.id_iconoCategoria,
			id_prioridad: MenuPrioridadesSeleccionado.id_prioridad,
			texto_buscar: TextoBuscado,
		});
		setConteoPartidas(request.data.total);
	}
	//datos de avance de componente
	//const [ComponenteAvance, setComponenteAvance] = useState(0);

	useEffect(() => {
		fectchConteoPartidas();
	}, [
		ComponenteSelecccionado,
		CantidadPaginasPartidas,
		MenuPrioridadesSeleccionado,
		MenuCategoriasSeleccionado,
		TextoBuscado,
	]);
	useEffect(() => {
		setPaginaActual(1);
	}, [
		ComponenteSelecccionado,
		CantidadPaginasPartidas,
		MenuPrioridadesSeleccionado,
		MenuCategoriasSeleccionado,
		TextoBuscado,
	]);
	useEffect(() => {
		let source = axios.CancelToken.source();
		if (ComponenteSelecccionado.id_componente) {
			setPartidas([]);
			fetchPartidas(source);
		}

		return () => {
			source.cancel();
		};
	}, [
		TipoComponenteSelecccionado,
		ComponenteSelecccionado,
		PaginaActual,
		CantidadPaginasPartidas,
		MenuPrioridadesSeleccionado,
		MenuCategoriasSeleccionado,
		TextoBuscado,
	]);
	const paginatorRef = useRef(null);
	const autoScroll = () => {
		paginatorRef.current.scrollIntoView({ behavior: "smooth" });
	};
	//estado de obra
	const [EstadoObra, setEstadoObra] = useState("");
	async function fetchEstadoObra() {
		var res = await axios.post(`${UrlServer}/getEstadoObra`, {
			id_ficha: sessionStorage.getItem("idobra"),
		});
		setEstadoObra(res.data.nombre);
	}


	useEffect(() => {
		const Components = async () => {
			getComponentsByType();
			const component = await getComponents('origen');
			onChangeComponentesSeleccion(component[0]);
			getAdvanceComponent(component[0].id_componente)
		}
		Components()
		fectchPrioridades();
		fetchCategorias();
		cargarPermiso(
			"ingresar_metrado,ingresar_fotospartidas,ver_chatpartidas,actualizar_iconopartidas"
		);
		fetchEstadoObra();
	}, []);
	return {
		Componente,
		setComponente,
		ComponentesPorTipo,
		setComponentesPorTipo,
		TipoComponenteSelecccionado,
		setTipoComponenteSelecccionado,
		onChangeTipoComponenteSeleccion,
		ComponenteSelecccionado,
		setComponenteSelecccionado,
		onChangeComponentesSeleccion,
		getComponents,
		ComponenteAvance,
		TextoBuscado,
		setTextoBuscado,
		Permisos,
		Partidas,
		PartidaSelecccionado,
		onChangePartidasSeleccion,
		TogglePartidasEstilo,
		handleDeletePartida,
		Actividades,
		fectchActividades,
		RefActividades,
		setRefActividades,
		handleDeleteActivity,
		saveActividadMayorMetradoOnMM,
		savePartidaMayorMetrado,
		updateActividadMayorMetradoOnMM,
		Categorias,
		CategoriasComponente,
		MenuCategorias,
		MenuCategoriasSeleccionado,
		Prioridades,
		MenuPrioridades,
		MenuPrioridadesSeleccionado,
		onChangeMenuPrioridades,
		onChangeMenuCategorias,
		toggleMenuCategorias,
		toggleMenuPrioridades,
		RefPartidas,
		setRefPartidas,
		onChangeCantidadPaginasPartidas,
		CantidadPaginasPartidas,
		PaginaActual,
		onChangePaginaActual,
		ConteoPartidas,
		RefComponentes,
		setRefComponentes,
		recargaComponenteMensajes,
		EstadoObra,
		onSaveMetrado,
		ComponentesMensajes,

	};
};
const ComponentesMensajes = forwardRef(({ id_componente }, ref) => {
	useEffect(() => {
		getComponentesComentarios();
		socketIni();
	}, []);
	//socket
	function socketIni() {
		socket.on(
			"componentes_comentarios_notificacion_get-" +
			sessionStorage.getItem("idobra"),
			() => {
				getComponentesComentarios();
			}
		);
	}
	//mensajes
	const [Mensajes, setMensajes] = useState(0);
	async function getComponentesComentarios() {
		var res = await axios.post(`${UrlServer}/getComponentesComentarios`, {
			id_acceso: sessionStorage.getItem("idacceso"),
			id_componente: id_componente,
		});
		setMensajes(res.data.mensajes);
	}
	useImperativeHandle(ref, () => ({
		recarga() {
			getComponentesComentarios();
		},
	}));

	return Mensajes ? (
		<div
			style={{
				background: "red",
				borderRadius: "50%",
				textAlign: "center",
				position: "absolute",
				right: "0px",
				top: "-3px",
				padding: "1px 4px",
				zIndex: "20",
				fontSize: "9px",
				fontWeight: "bold",
			}}
		>
			{Mensajes}
		</div>
	) : (
		<div></div>
	);
});

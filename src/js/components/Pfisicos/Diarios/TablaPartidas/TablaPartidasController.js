import React, { useState, useEffect } from 'react';
import MetradoDiarioView from './TablaPartidasView';
import axios from 'axios';
import { UrlServer } from '../../../../../utils/ServerUrlConfig';

const TablaPartidasController = ({ userId: idAcceso, tipo = 'origen' }) => {
	// Definir el estado y las funciones necesarias para las props
	const [ComponenteSeleccionado, setComponenteSeleccionado] = useState({});
	const [Componentes, setComponentes] = useState([]);
	const [ComponenteAvance, setComponenteAvance] = useState(0);
	const [TextoBuscado, setTextoBuscado] = useState('');
	const [Partidas, setPartidas] = useState([]);
	const [PartidaSeleccionada, setPartidaSeleccionada] = useState({});
	const [ConteoPartidas, setConteoPartidas] = useState(0);
	const [CantidadPaginasPartidas, setCantidadPaginasPartidas] = useState(15);
	const [PaginaActual, setPaginaActual] = useState(0);
	const [MenuCategoriasSeleccionado, setMenuCategoriasSeleccionado] = useState({
		id_iconoCategoria: 0,
	});
	const [MenuPrioridadesSeleccionado, setMenuPrioridadesSeleccionado] =
		useState({
			id_prioridad: 0,
		});

	// Funciones para manipular el estado de las props

	const onChangeComponentesSeleccion = (event, value) => {
		setComponenteSeleccionado(value);
	};

	useEffect(() => {
		// Simulación de la carga de datos o eventos que actualizan las props
		async function fetchComponentesAvance() {
			const res = await axios.get(`${UrlServer}/v1/avance/componente`, {
				params: {
					id_componente: ComponenteSeleccionado.id_componente,
				},
			});
			setComponenteAvance(res.data.avance);
		}
		if (ComponenteSeleccionado?.id_componente) {
			fetchComponentesAvance();
		}
	}, [ComponenteSeleccionado]);
	useEffect(() => {
		// Lógica para cargar los Componentes desde alguna fuente de datos
		const fetchComponentes = async () => {
			// Realizar la petición a la API u obtener los datos de otra manera
			const response = await axios.get(
				`${UrlServer}/v1/componentes?id_expediente=${localStorage.getItem(
					'id_expediente',
				)}&tipo=${tipo}`,
			);
			// Actualizar el estado de los Componentes
			setComponentes(response.data);
			if (response?.data?.length > 0) {
				setComponenteSeleccionado(response.data[0]);
			}
		};

		fetchComponentes();
	}, []);

	useEffect(() => {
		// Lógica para cargar las Partidas desde alguna fuente de datos
		async function fetchPartidas() {
			const res = await axios.post(`${UrlServer}/getPartidas2`, {
				id_componente: ComponenteSeleccionado.id_componente,
				inicio: PaginaActual * CantidadPaginasPartidas,
				fin: CantidadPaginasPartidas,
				id_iconoCategoria: MenuCategoriasSeleccionado.id_iconoCategoria,
				id_prioridad: MenuPrioridadesSeleccionado.id_prioridad,
				texto_buscar: TextoBuscado,
			});
			setPartidas(res.data);
		}
		if (ComponenteSeleccionado.id_componente) {
			fetchPartidas();
		}
		setPartidaSeleccionada({});
	}, [
		ComponenteSeleccionado,
		TextoBuscado,
		CantidadPaginasPartidas,
		PaginaActual,
	]);

	useEffect(() => {
		// Lógica para cargar las Partidas desde alguna fuente de datos
		async function fectchConteoPartidas() {
			const request = await axios.post(`${UrlServer}/getTotalConteoPartidas`, {
				id_componente: ComponenteSeleccionado.id_componente,
				id_iconoCategoria: MenuCategoriasSeleccionado.id_iconoCategoria,
				id_prioridad: MenuPrioridadesSeleccionado.id_prioridad,
				texto_buscar: TextoBuscado,
			});
			setConteoPartidas(request.data.total);
		}
		if (ComponenteSeleccionado.id_componente) {
			fectchConteoPartidas();
		}
	}, [ComponenteSeleccionado, TextoBuscado]);

	return (
		<div>
			<MetradoDiarioView
				ComponenteSeleccionado={ComponenteSeleccionado}
				onChangeComponentesSeleccion={onChangeComponentesSeleccion}
				Componentes={Componentes}
				ComponenteAvance={ComponenteAvance}
				TextoBuscado={TextoBuscado}
				setTextoBuscado={setTextoBuscado}
				Partidas={Partidas}
				PartidaSeleccionada={PartidaSeleccionada}
				setPartidaSeleccionada={setPartidaSeleccionada}
				ComponenteAvancePorcentaje={
					(ComponenteAvance / ComponenteSeleccionado.presupuesto) * 100
				}
				rowsPerPageOptions={[10, 15, 20]}
				count={ConteoPartidas}
				rowsPerPage={CantidadPaginasPartidas}
				page={PaginaActual}
				onPageChange={setPaginaActual}
				onRowsPerPageChange={setCantidadPaginasPartidas}
			/>
		</div>
	);
};

export default TablaPartidasController;

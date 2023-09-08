// libraris
import axios from 'axios';
import React, { lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LogoSigobras from '../../../public/images/sigobras-neon.jpg';
import Btns from './Otros/Btns';
import UserNav from './Otros/UserNav';
import { UrlServer } from './Utils/ServerUrlConfig';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { styled, useTheme } from '@mui/material/styles';

import {
	FaBuilding,
	FaClipboardList,
	FaHammer,
	FaTruck,
	FaWrench,
} from 'react-icons/fa';
import { GiBrickWall, GiCrane } from 'react-icons/gi';
import { IoBuild, IoConstructOutline, IoCube } from 'react-icons/io5';
import { RiRoadMapLine, RiPaintBrushLine, RiSurveyLine } from 'react-icons/ri';
import { Tooltip } from '@mui/material';
import InicioMDiarioController from './Pfisicos/Diarios/InicioMDiarioController';

const menuIcons = [
	<FaHammer />,
	<FaBuilding />,
	<FaTruck />,
	<FaClipboardList />,
	<FaWrench />,
	<IoConstructOutline />,
	<IoBuild />,
	<IoCube />,
	<GiBrickWall />,
	<GiCrane />,
	<RiRoadMapLine />,
	<RiSurveyLine />,
	<RiPaintBrushLine />,
];

const drawerWidth = 240;

const openedMixin = theme => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = theme => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

const Inicio = lazy(() => import('./Inicio/Inicio'));
const MDdiario = lazy(() => import('./Pfisicos/Diarios/InicioMDiarioController.js'));
const MDHistorial = lazy(() =>
	import('./Pfisicos/HistorialMetrados/Historial')
);
const RecursosObra = lazy(() => import('./Pfisicos/Recursos/RecursosObra'));
const HistorialImagenesObra = lazy(() =>
	import('./Pfisicos/HistorialImagenes/HistorialImagenesObra')
);
const General = lazy(() =>
	import('../components/Pfisicos/Valorizaciones/index')
);
// proceso gerenciales
const Comunicados = lazy(() =>
	import('../components/Pgerenciales/Comunicados/comunicados')
);
const RecursosMo = lazy(() =>
	import('../components/Pgerenciales/Recursos/RecursosPersonal')
);
const PlazosHistorial = lazy(() =>
	import('../components/Pgerenciales/PlazosHistorial/Plazos')
);
//planificacion
const Planner = lazy(() =>
	import('../components/Pgerenciales/Planner/planner')
);
// reportes
const ReportesGenerales = lazy(() => import('./Reportes/ReportesGenerales'));
const SeguimientoObras = lazy(() => import('./SeguimientoObras'));

// GESTION DE TAREAS
const GestionTareas = lazy(() => import('./GestionTareas/GestionTareas'));
//PROYECTOS
const Proyectos = lazy(() => import('./Proyectos/index'));
// PROCESOS DOCUMENTOS
const Index = lazy(() => import('./Pdocumentarios/Index'));
const GestionDocumentaria = lazy(() => import('./GestionDocumentaria/index'));
//COSTOS INDIRECTOS
const CostosIndirectos = lazy(() => import('./CostosIndirectos/index'));
const ModificacionExpediente = lazy(() => import('./ModificacionExpediente'));
const ReporteGeneral = lazy(() => import('./ReporteGeneral'));
const PresupuestoAnalitico = lazy(() => import('./PresupuestoAnalitico'));
const Test = lazy(() => import('./Test'));
const FuentesFinanciamiento = lazy(() => import('./FuentesFinanciamiento'));
const CuadroMetrados = lazy(() => import('./Pfisicos/CuadroMetrados'));
const HistorialImagenes = lazy(() => import('./HistorialImagenes'));

export default () => {
	useEffect(() => {
		if (sessionStorage.getItem('idobra') != null) {
			fetchDatosGenerales(sessionStorage.getItem('idobra'));
			fetchMenu(sessionStorage.getItem('idobra'));
			fetchPresupuestoCostoDirecto(sessionStorage.getItem('idobra'));
			fetchEstadoObra(sessionStorage.getItem('idobra'));
		}
	}, []);
	const [DataObra, setDataObra] = useState([]);
	async function fetchDatosGenerales(id_ficha) {
		var res = await axios.get(`${UrlServer}/v1/obras/${id_ficha}`, {
			params: {
				id_acceso: sessionStorage.getItem('idacceso'),
			},
		});
		setDataObra(res.data);
	}
	const [CostoDirecto, setCostoDirecto] = useState([]);
	async function fetchPresupuestoCostoDirecto(id_ficha) {
		var res = await axios.post(`${UrlServer}/getPresupuestoCostoDirecto`, {
			id_ficha,
		});
		setCostoDirecto(res.data.monto);
	}
	const [DataMenus, setDataMenus] = useState([]);
	async function fetchMenu(id_ficha) {
		var res = await axios.post(`${UrlServer}/getMenu2`, {
			id_ficha,
			id_acceso: sessionStorage.getItem('idacceso'),
		});
		if (Array.isArray(res.data)) {
			setDataMenus(res.data);
		}
	}
	const [DataDelta, setDataDelta] = useState({
		fisico_monto: 1,
		fisico_programado_monto: 1,
	});

	const [navbarExpland, setnavbarExpland] = useState(false);
	const [collapse, setcollapse] = useState(-1);
	const [EstadoObra, setEstadoObra] = useState('');
	async function fetchEstadoObra(id_ficha) {
		var request = await axios.post(`${UrlServer}/getEstadoObra`, {
			id_ficha: id_ficha,
		});
		setEstadoObra(request.data.nombre);
		sessionStorage.setItem('estadoObra', request.data.nombre);
	}
	async function recargar(ficha) {
		await sessionStorage.setItem('idobra', ficha.id_ficha);
		await sessionStorage.setItem('codigoObra', ficha.codigo);
		await sessionStorage.setItem('id_expediente', ficha.id_expediente);

		fetchDatosGenerales(sessionStorage.getItem('idobra'));
		fetchMenu(sessionStorage.getItem('idobra'));
		fetchPresupuestoCostoDirecto(sessionStorage.getItem('idobra'));
		fetchEstadoObra(sessionStorage.getItem('idobra'));
		setDataObra(ficha);
	}

	const theme = useTheme();
	const [open, setOpen] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<BrowserRouter>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position='fixed' open={open}>
					<Toolbar>
						<IconButton
							color='inherit'
							aria-label='open drawer'
							onClick={handleDrawerOpen}
							edge='start'
							sx={{
								marginRight: 5,
								...(open && { display: 'none' }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<div
							style={{
								display: 'flex',
								width: '100%',
								justifyContent: 'space-between',
							}}
						>
							<a className='navbar-brand'>
								<img src={LogoSigobras} alt='login sigobras ' width='50px' />
								<span className='textSigobras h5 ml-2'>SIGOBRAS</span>
							</a>
							<ul className='nav navbar-nav flex-row justify-content-between ml-auto'>
								<li style={{ paddingRight: '5px', cursor: 'pointer' }}>
									<UserNav key={DataObra.id_ficha} />
								</li>
								<li style={{ paddingRight: '5px' }}>
									{sessionStorage.getItem('estadoObra') != null && (
										<Btns EstadoObra={EstadoObra} />
									)}
								</li>
							</ul>
						</div>
					</Toolbar>
				</AppBar>
				<Drawer variant='permanent' open={open}>
					<DrawerHeader>
						<IconButton onClick={handleDrawerClose}>
							{theme.direction === 'rtl' ? (
								<ChevronRightIcon />
							) : (
								<ChevronLeftIcon />
							)}
						</IconButton>
					</DrawerHeader>
					<List>
						<ListItem disablePadding sx={{ display: 'block' }} title={'INICIO'}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5,
								}}
								href={'/'}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center',
									}}
								>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText
									primary={'INICIO'}
									sx={{ opacity: open ? 1 : 0 }}
								/>
							</ListItemButton>
						</ListItem>
					</List>
					<List>
						{DataMenus.map(({ nombreMenu: text, submenus }, index) => (
							<>
								<ListItem
									key={text}
									disablePadding
									sx={{ display: 'block' }}
									title={text}
								>
									<ListItemButton
										sx={{
											minHeight: 48,
											justifyContent: open ? 'initial' : 'center',
											px: 2.5,
										}}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: open ? 3 : 'auto',
												justifyContent: 'center',
											}}
										>
											{menuIcons[index]}
										</ListItemIcon>
										<ListItemText
											primary={text}
											sx={{ opacity: open ? 1 : 0 }}
										/>
									</ListItemButton>
								</ListItem>
								<List>
									{submenus.map((item, index2) => (
										<ListItem
											key={item.nombreMenu}
											disablePadding
											sx={{ display: 'block', ml: open ? 2 : 0 }}
											title={item.nombreMenu}
										>
											<ListItemButton
												sx={{
													minHeight: 48,
													justifyContent: open ? 'initial' : 'center',
													px: 2.5,
												}}
												// component={Link}
												href={item.ruta}
											>
												<ListItemIcon
													sx={{
														minWidth: 0,
														mr: open ? 3 : 'auto',
														justifyContent: 'center',
													}}
												>
													{menuIcons[index2]}
												</ListItemIcon>
												<ListItemText
													primary={item.nombreMenu}
													sx={{ opacity: open ? 1 : 0 }}
												/>
											</ListItemButton>
										</ListItem>
									))}
								</List>
								<Divider />
							</>
						))}
					</List>
				</Drawer>
				<Box component='main' sx={{ flexGrow: 1 }}>
					<DrawerHeader />
					<Routes>
						<Route path='/' element={<Inicio recargar={recargar} />} />
						<Route path='/MDdiario' element={<InicioMDiarioController />} />
						<Route path='/MDHistorial' element={<MDHistorial />} />
						<Route path='/RecursosObra' element={<RecursosObra />} />
						<Route
							path='/HistorialImagenesObra'
							element={<HistorialImagenesObra />}
						/>
						<Route path='/General' element={<General />} />
						<Route path='/Proyectos' element={<Proyectos />} />
						<Route path='/ReportesGenerales' element={<ReportesGenerales />} />
						<Route path='/planner' element={<Planner />} />
						<Route path='/comunicados' element={<Comunicados />} />
						<Route path='/recursosmanodeobra' element={<RecursosMo />} />
						<Route path='/plazosHistorial' element={<PlazosHistorial />} />
						<Route path='/GestionTareas' element={<GestionTareas />} />
						<Route path='/DOCUEMENTOS' element={<Index />} />
						<Route
							path='/GestionDocumentaria'
							element={<GestionDocumentaria />}
						/>
						<Route path='/CostosIndirectos' element={<CostosIndirectos />} />
						<Route
							path='/SeguimientoObras'
							element={<SeguimientoObras recargar={recargar} />}
						/>
						<Route
							path='/ReporteGeneral'
							element={<ReporteGeneral recargar={recargar} />}
						/>
						<Route
							path='/PresupuestoAnalitico'
							element={<PresupuestoAnalitico />}
						/>
						<Route
							path='/FuentesFinanciamiento'
							element={<FuentesFinanciamiento />}
						/>
						<Route path='/Test' element={Test} />
						<Route
							path='/ModificacionExpediente'
							element={<ModificacionExpediente />}
						/>
						<Route path='/CuadroMetrados' element={<CuadroMetrados />} />
						<Route path='/HistorialImagenes' element={<HistorialImagenes />} />
					</Routes>
				</Box>
			</Box>
		</BrowserRouter>
	);
};

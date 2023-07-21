import * as React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useSideNavInfo } from '../../../hooks/useSideNavInfo';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
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

export default function MiniDrawer({ handleDrawerClose, DrawerHeader, open }) {
	const theme = useTheme();

	const work = useSelector(state => state.work.selectedWork);
	const { dataMenus } = useSideNavInfo(work?.id_ficha);

	return (
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
			<Divider />
			<List>
				{dataMenus?.map((menus, index) => (
					<>
						<Divider />
						<List>
							{menus.submenus.map((item, i2) => (
								<ListItem
									key={item.nombreMenu}
									disablePadding
									sx={{ display: 'block' }}
								>
									<ListItemButton
										sx={{
											minHeight: 48,
											justifyContent: open ? 'initial' : 'center',
											px: 2.5,
										}}
										component={Link}
										href={item.ruta}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: open ? 3 : 'auto',
												justifyContent: 'center',
											}}
										>
											{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
										</ListItemIcon>
										<ListItemText
											primary={item.nombreMenu}
											sx={{ opacity: open ? 1 : 0 }}
										/>
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</>
				))}
			</List>
			<Divider />
			<List>
				{[
					{ text: 'SeguimientoObras', route: 'SeguimientoObras' },
					{ text: 'ReportesGenerales', route: 'ReportesGenerales' },
					{ text: 'reporteGeneral', route: 'reporteGeneral' },
					{ text: 'GestionDocumentaria', route: 'GestionDocumentaria' },
					{
						text: 'ReporteMonitoreoSeguimiento',
						route: 'ReporteMonitoreoSeguimiento',
					},
				].map(({ text, route }, index) => (
					<ListItem key={text} disablePadding sx={{ display: 'block' }}>
						<ListItemButton
							sx={{
								minHeight: 48,
								justifyContent: open ? 'initial' : 'center',
								px: 2.5,
							}}
							component={Link}
							href={route}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 3 : 'auto',
									justifyContent: 'center',
								}}
							>
								{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
							</ListItemIcon>
							<ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Drawer>
	);
}

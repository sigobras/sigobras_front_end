import React from 'react';
import Image from 'next/image';
import SideNav from '../molecules/SideNav/SideNav';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LoginButton from './LoginButton';
import ContactButton from './ContactButton';
import LogoutButton from './LogoutButton';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
const drawerWidth = 240;

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
const Layout = ({ children }) => {
	const { data: session } = useSession();
	const router = useRouter();

	const [open, setOpen] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleLogout = async () => {
		const data = await signOut({ redirect: false, callbackUrl: '/' });
		router.push(data.url);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />

			<AppBar position='fixed' open={open}>
				<Toolbar sx={{ justifyContent: 'space-between' }}>
					{session?.user ? (
						<Box display='flex' alignItems='center'>
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
							<Typography variant='h6' noWrap component='div'>
								Sigobras
							</Typography>
						</Box>
					) : (
						<Box>
							<Image
								src='/images/logo.jpg'
								alt='login sigobras'
								width={100}
								height={50}
							/>
						</Box>
					)}

					{session?.user ? (
						<LogoutButton handleLogout={handleLogout} />
					) : (
						<Box sx={{ display: 'flex', flexDirection: 'row' }}>
							<ContactButton />
							<LoginButton />
						</Box>
					)}
				</Toolbar>
			</AppBar>

			{session?.user && (
				<SideNav
					handleDrawerClose={handleDrawerClose}
					drawerWidth={drawerWidth}
					DrawerHeader={DrawerHeader}
					open={open}
				/>
			)}

			<Box component='main'>
				<DrawerHeader />
				{children}
			</Box>
		</Box>
	);
};

export default Layout;

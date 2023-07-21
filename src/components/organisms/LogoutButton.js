// LogoutButton.jsx
import React from 'react';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const LogoutButton = ({ handleLogout }) => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleConfirm = () => {
		handleLogout();
		setOpen(false);
	};

	return (
		<div>
			<Button
				color='inherit'
				startIcon={<ExitToAppIcon />}
				onClick={handleClickOpen}
			>
				Salir de sesion
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Confirmar deslogueo</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Estás seguro de que deseas salir de su sesion?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancelar</Button>
					<Button onClick={handleConfirm} autoFocus>
						Salir de sesion
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default LogoutButton;

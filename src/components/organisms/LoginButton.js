import React, { useState } from 'react';
import { Box, Button, Popover, Typography, TextField } from '@mui/material';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
const LoginComponent = () => {
	const router = useRouter();
	const [UsuarioDatos, setUsuarioDatos] = useState({
		usuario: '',
		password: '',
	});
	const [anchorEl, setAnchorEl] = useState(null);

	function handleChange(e) {
		setUsuarioDatos({
			...UsuarioDatos,
			[e.target.name]: e.target.value,
		});
	}

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'login-popover' : undefined;

	const handleSubmit = async e => {
		e.preventDefault();

		const username = e.target.username.value;
		const password = e.target.password.value;

		const { error, url, ...data } = await signIn('credentials', {
			username,
			password,
			redirect: false,
			callbackUrl: '/inicio',
		});
		console.log({ error, url, data });
		if (error) {
			alert(error);
			return;
		}
		router.push(url);
	};

	return (
		<div>
			<Button
				id='contact-us-button'
				variant='outlined'
				color='primary'
				aria-describedby={id}
				onClick={handleClick}
				endIcon={<TiArrowSortedDown />}
			>
				Ingresar
			</Button>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<Box p={2}>
					<Typography variant='subtitle1' align='center'>
						Acceda a SIGOBRAS{' '}
					</Typography>
					<form onSubmit={handleSubmit} autoComplete='off'>
						<TextField
							fullWidth
							margin='normal'
							label='Usuario'
							name='username'
							onChange={handleChange}
							required
							size='small'
						/>
						<TextField
							fullWidth
							margin='normal'
							label='Contraseña'
							type='password'
							name='password'
							required
							onChange={handleChange}
							size='small'
						/>
						<Button
							fullWidth
							type='submit'
							variant='contained'
							color='primary'
							size='small'
							sx={{ mt: 2 }}
						>
							INGRESAR
						</Button>
					</form>
				</Box>
			</Popover>
		</div>
	);
};

export default LoginComponent;

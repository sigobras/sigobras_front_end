// MainComponent.js
import React, { useState } from 'react';
import { usePermissions } from '../../hooks/usePersonal';
import { GroupAdd } from '@mui/icons-material';
import { Button } from '@mui/material';
import DialogPersonalComponent from './DialogPersonalComponent';

export default function PersonalComponent({ id_ficha, codigo_obra }) {
	const [ModalPersonal, setModalPersonal] = useState(false);
	function toggleModalPersonal() {
		setModalPersonal(!ModalPersonal);
	}

	return (
		<div>
			<Button
				variant='outlined'
				color='info'
				size='small'
				startIcon={<GroupAdd />}
				onClick={toggleModalPersonal}
			/>
			<DialogPersonalComponent
				ModalPersonal={ModalPersonal}
				toggleModalPersonal={toggleModalPersonal}
				id_ficha={id_ficha}
				codigo_obra={codigo_obra}
			/>
		</div>
	);
}

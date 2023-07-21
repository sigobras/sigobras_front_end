import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import TablePersonalComponent from './TablePersonalComponent';

export default function DialogPersonalComponent({
	ModalPersonal,
	toggleModalPersonal,
	id_ficha,
	codigo_obra,
}) {
	return (
		<Dialog
			open={ModalPersonal}
			onClose={toggleModalPersonal}
			maxWidth='lg'
			fullWidth
			PaperProps={{
				sx: {
					backgroundImage: 'none',
				},
			}}
		>
			<DialogTitle>{codigo_obra} - PERSONAL TECNICO DE OBRA</DialogTitle>
			<DialogContent>
				<TablePersonalComponent id_ficha={id_ficha} />
			</DialogContent>
		</Dialog>
	);
}

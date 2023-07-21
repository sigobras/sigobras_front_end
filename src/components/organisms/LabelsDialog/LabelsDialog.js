import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import LabelIcon from '@mui/icons-material/Label';

import LabelsDialogContent from './LabelsDialogContent';

const LabelsDialog = ({ id_ficha }) => {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<>
			<IconButton
				title='labels'
				onClick={() => setDialogOpen(true)}
				color='primary'
			>
				<LabelIcon />
			</IconButton>
			{dialogOpen && (
				<LabelsDialogContent
					dialogOpen={dialogOpen}
					id_ficha={id_ficha}
					setDialogOpen={setDialogOpen}
				/>
			)}
		</>
	);
};

export default LabelsDialog;

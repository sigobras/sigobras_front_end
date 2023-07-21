import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
} from '@mui/material';

const CustomDialog = ({ icon, title, content }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const toggleDialog = () => {
		setIsDialogOpen(!isDialogOpen);
	};

	return (
		<div>
			<IconButton
				color='info'
				size='small'
				onClick={toggleDialog}
				title={title}
			>
				{icon}
			</IconButton>

			{isDialogOpen && (
				<Dialog
					open={isDialogOpen}
					onClose={toggleDialog}
					maxWidth='lg'
					PaperProps={{
						sx: {
							backgroundImage: 'none',
						},
					}}
				>
					<DialogTitle>{title}</DialogTitle>
					<DialogContent>{content}</DialogContent>
					<DialogActions>
						<Button onClick={toggleDialog}>Cancelar</Button>
					</DialogActions>
				</Dialog>
			)}
		</div>
	);
};

CustomDialog.propTypes = {
	icon: PropTypes.element.isRequired,
	title: PropTypes.string.isRequired,
	content: PropTypes.element.isRequired,
};

export default CustomDialog;

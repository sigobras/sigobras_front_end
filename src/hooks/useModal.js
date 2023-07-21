import { useState } from 'react';

export const useModal = (initialValue = false) => {
	const [modalOpen, setModalOpen] = useState(initialValue);

	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	return [modalOpen, toggleModal];
};

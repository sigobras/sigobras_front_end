import React, { useEffect, useState } from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import { MdOutlineCheck, MdClose, MdDeleteForever, MdCheckCircleOutline } from 'react-icons/md';
import { Fragment } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useModalMayorMetrado } from './hooks/useModalMayorMetrado';
const ModalDeleteActividadPartida = ({ PartidaSelecccionado, Actividad, isActividad }) => {
	const { toggleModal, modalIsOpen, handleDeleteActivity, handleDeletePartida } = useModalMayorMetrado(PartidaSelecccionado, Actividad);


	return (
		<Fragment>
			{isActividad
				?
				<MdDeleteForever
					size={18}
					onClick={toggleModal}
					color={"#DC3545"}
					className='ms-1'
					style={{
						cursor: "pointer",
					}}
				/>
				: (<Button
					color='light'
					onClick={toggleModal}
					className='btn btn-sm btn-outline-danger ms-2 pt-0 pb-0 text-btn'
				>
					BORRAR <MdDeleteForever size={18} />
				</Button>)}

			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
			<Modal
				isOpen={modalIsOpen}
				toggle={toggleModal}
				className='modal-lg'
				tabIndex={5}
			>
				<ModalHeader toggle={toggleModal} className='bg-danger'>
					<span>ELIMINAR {isActividad ? 'ACTIVIDAD' : 'PARTIDA'}</span>
				</ModalHeader>

				<ModalBody>
					<div className='text-center'>
						<h4 className='text-danger'>¿Está seguro de eliminar esta {isActividad ? 'actividad' : 'partida'}?</h4>
						{
							isActividad ? (<p>{Actividad.nombre} de {PartidaSelecccionado.descripcion}</p>) : (<p>{PartidaSelecccionado.item} - {PartidaSelecccionado.descripcion}</p>)
						}
					</div>
				</ModalBody>
				<ModalFooter>
					{isActividad ? (
						<Button color="success" outline onClick={handleDeleteActivity}>
							<MdOutlineCheck size={20} />ACEPTAR
						</Button>
					) : (
						<Button color="success" outline onClick={handleDeletePartida}>
							<MdOutlineCheck size={20} />ACEPTAR
						</Button>
					)}
					<Button color='danger' outline onClick={toggleModal}>
						<MdClose size={20} /> Cancelar
					</Button>
				</ModalFooter>
			</Modal>
		</Fragment>
	);
};

export default ModalDeleteActividadPartida;

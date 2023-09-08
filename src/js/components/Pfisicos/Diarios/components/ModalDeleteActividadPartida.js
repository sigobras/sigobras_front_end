import React from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import { MdOutlineCheck, MdClose, MdDeleteForever } from 'react-icons/md';
import { useModalMayorMetrado } from '../hooks/useModalMayorMetrado';
const ModalDeleteActividadPartida = ({ PartidaSelecccionado, Actividad, isActividad, handleDeletePartida, handleDeleteActivity, }) => {
	const { toggleModal, modalIsOpen, } = useModalMayorMetrado(PartidaSelecccionado, Actividad,)
	return (
		<>
			{isActividad
				?
				<MdDeleteForever
					size={15}
					onClick={toggleModal}
					color={"#DC3545"}
					className='ms-1'
					style={{
						cursor: "pointer",
					}}
				/>
				: (<Button
					color='danger'
					outline
					onClick={toggleModal}
					className='btn btn-sm btn-outline-danger p-1 text-btn border-0'
				>
					<MdDeleteForever size={15} />
				</Button>)}
			<Modal
				isOpen={modalIsOpen}
				toggle={toggleModal}
				className='modal-lg modal-delete'
				tabIndex={5}
			>
				<ModalHeader toggle={toggleModal} className=''>
					<span className='text-danger'> ELIMINAR {isActividad == true ? 'ACTIVIDAD' : 'PARTIDA'}</span>
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
						<Button color="success" outline onClick={() => handleDeleteActivity(Actividad)}>
							<MdOutlineCheck size={20} />ACEPTAR
						</Button>
					) : (
						<Button color="success" outline onClick={() => handleDeletePartida(toggleModal)}>
							<MdOutlineCheck size={20} />ACEPTAR
						</Button>
					)}
					<Button color='danger' outline onClick={toggleModal}>
						<MdClose size={20} /> CANCELAR
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default ModalDeleteActividadPartida;

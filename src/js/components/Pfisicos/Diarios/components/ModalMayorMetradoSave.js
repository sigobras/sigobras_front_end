import React from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from 'reactstrap';
import { MdAdd, MdOutlineCheck, MdClose, MdDeleteForever, MdEditSquare, MdAssignmentAdd } from 'react-icons/md';
import { Fragment } from 'react';
import { useModalMayorMetrado } from '../hooks/useModalMayorMetrado';
const ModalMayorMetradoSave = ({
	PartidaSelecccionado,
	Actividad,
	PartidaMayorMetradoSeleccionado,
	isUpdate,
	saveActividadMayorMetradoOnMM,
	savePartidaMayorMetrado,
	updateActividadMayorMetradoOnMM
}) => {
	const renderError = (name, index) => (
		errors?.actividades?.[index]?.[name] && (
			<p className='alertMD' role='alert'>
				{errors?.actividades?.[index]?.[name]?.message}
			</p>
		)
	);
	const { toggleModal, modalIsOpen, handleSubmit, onAddSubmit, getValues, errors, register, validationErrors, onSaveActividad, onSaveActividadOnMM, handleInputChange, removeActivity } = useModalMayorMetrado(PartidaSelecccionado, Actividad, PartidaMayorMetradoSeleccionado, isUpdate, saveActividadMayorMetradoOnMM, savePartidaMayorMetrado, updateActividadMayorMetradoOnMM);
	return (
		<Fragment>
			{
				isUpdate
					?
					<MdEditSquare
						size={15}
						onClick={toggleModal}
						color={"#F2A93B"}
						className='ms-1'
						style={{
							cursor: "pointer",
						}} />
					: (<Button
						color='success'
						outline
						onClick={toggleModal}
						className='btn btn-sm btn-outline-success ms-2 p-1 text-btn border-0'
					>
						<MdAssignmentAdd size={15} />
					</Button>)
			}
			<Modal
				isOpen={modalIsOpen}
				toggle={toggleModal}
				className='modal-xl'
				tabIndex={5}
			>
				<ModalHeader toggle={toggleModal}>
					<span className='text-modal'> MAYOR METRADO {isUpdate && '- EDITAR ACTIVIDAD'}</span>
					<br />
					<span>{PartidaSelecccionado.item} - {PartidaSelecccionado.descripcion}</span>
				</ModalHeader>

				<ModalBody>
					<form onSubmit={handleSubmit(onAddSubmit)} className='p-2'>
						<table className='table table-dark table-bordered table-MM'>
							<thead className=''>
								<tr>
									<th></th>
									<th colSpan={3}>Datos</th>
									<th colSpan={3}>Dimensiones</th>
									<th colSpan={3}>Total</th>
								</tr>
								<tr>
									<th>ID</th>
									<th>Nombre</th>
									<th>Elementos</th>
									<th>Cant. x Elem.</th>
									<th>Largo</th>
									<th>Ancho</th>
									<th>Alto</th>
									<th>Parcial</th>
									<th>Referencia</th>
									{
										Actividad
											? null
											: <th></th>
									}
								</tr>
							</thead>
							<tbody className='p-4'>
								{getValues('actividades').map((actividad, index) => (
									<tr key={index}>
										<td className='text-center' style={{ verticalAlign: 'middle' }}>{index + 1}</td>
										<td>
											<input
												className={'form-control col-5 bg-dark text-white ' + (errors?.actividades?.[index]?.nombre ? 'border border-danger' : '')}
												{...register(`actividades[${index}].nombre`, {
													required: 'Este campo es requerido.'
												})}
												placeholder='Nombre de la actividad'
												autoComplete='off'
												size={60}
												disabled={Actividad || isUpdate && true}
											/>
											{renderError('nombre', index)}
										</td>
										<td style={{ whiteSpace: "nowrap" }}>
											<input
												className={'form-control bg-dark text-white ' + (errors?.actividades?.[index]?.elementos ? 'border border-danger' : '')}
												{...register(`actividades[${index}].elementos`, {
													required: 'Este campo es requerido.',
													pattern: {
														value: /^\d+(\.\d+)?$/,
														message: 'Ingrese un número decimal válido',
													},
												})}
												placeholder='Ingrese un número decimal.'
												autoComplete='off'
												onBlur={() => handleInputChange(index)}
												disabled
											/>
											{renderError('elementos', index)}
										</td>
										<td>
											<input
												className={'form-control bg-dark text-white ' + (errors?.actividades?.[index]?.veces ? 'border border-danger' : '')}
												{...register(`actividades[${index}].veces`, {
													required: 'Este campo es requerido.',
													pattern: {
														value: /^\d+(\.\d+)?$/,
														message: 'Ingrese un número decimal válido',
													},
												})}
												placeholder='Ingrese un número decimal.'
												autoComplete='off'
												onBlur={() => handleInputChange(index)}
											/>
											{renderError('veces', index)}
										</td>
										<td>
											<input
												className={'form-control bg-dark text-white ' + (errors?.actividades?.[index]?.largo ? 'border border-danger' : '')}
												{...register(`actividades[${index}].largo`, {

													pattern: {
														value: /^\d+(\.\d+)?$/,
														message: 'Ingrese un número decimal válido',
													},
												})}
												placeholder='Ingrese un número decimal.'
												autoComplete='off'
												onBlur={() => handleInputChange(index)}
											/>
											{renderError('largo', index)}
										</td>
										<td>
											<input
												className={'form-control bg-dark text-white ' + (errors?.actividades?.[index]?.ancho ? 'border border-danger' : '')}
												{...register(`actividades[${index}].ancho`, {
													pattern: {
														value: /^\d+(\.\d+)?$/,
														message: 'Ingrese un número decimal válido',
													},
												})}
												placeholder='Ingrese un número decimal.'
												autoComplete='off'
												onBlur={() => handleInputChange(index)}
											/>
											{renderError('ancho', index)}
										</td>
										<td>
											<input
												className={'form-control bg-dark text-white ' + (errors?.actividades?.[index]?.alto ? 'border border-danger' : '')}
												{...register(`actividades[${index}].alto`, {
													pattern: {
														value: /^\d+(\.\d+)?$/,
														message: 'Ingrese un número decimal válido',
													},
												})}
												placeholder='Ingrese un número decimal.'
												autoComplete='off'
												onBlur={() => handleInputChange(index)}
											/>
											{renderError('alto', index)}
										</td>
										<td>
											<input
												className={'form-control bg-dark text-white ' + (errors?.actividades?.[index]?.parcial ? 'border border-danger' : '')}
												{...register(`actividades[${index}].parcial`, {
													required: 'Este campo es requerido.',
													pattern: {
														value: /^(\d{1,3}([,.]\d{3})*(\.\d+)?|\d+(\.\d+)?)$/,
														message: 'Ingrese un número decimal válido',
													},
												})}
												placeholder='Ingrese un número decimal.'
												autoComplete='off'
												disabled
											/>
											{renderError('parcial', index)}
										</td>
										<td>
											<input
												className={'form-control bg-dark text-white ' + (errors?.actividades?.[index]?.tipo ? 'border border-danger' : '')}
												title={errors?.actividades?.[index]?.tipo && `${errors?.actividades?.[index]?.tipo?.message}`}
												{...register(`actividades[${index}].tipo`, {
													required: 'Este campo es requerido.',
													pattern: {
														value: /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚüÜñÑ]*$/,
														message: 'Ingrese un texto válido.',
													},
												})}
												placeholder='Ingrese texto.'
												autoComplete='off'
											/>
											{renderError('tipo', index)}
										</td>
										{
											Actividad ? null : (<td className='d-flex'>
												<button onClick={() => removeActivity(index)} className='btn btn-outline-danger ms-1' type='button' title='Borrar actividad'>
													<MdDeleteForever onClick={() => removeActivity(index)} />
												</button>
												{getValues('actividades').length === 0 ||
													getValues('actividades').length - 1 === index ? (
													<button type='submit' className='btn btn-outline-success ms-1'>
														<MdAdd />
													</button>
												) : null}
											</td>)
										}


									</tr>
								))}
							</tbody>
						</table>
					</form>
				</ModalBody>
				<ModalFooter>
					{validationErrors && (
						<div className='text-danger text-start'>
							Por favor, corrija los errores antes de guardar e inténtelo nuevamente.
						</div>
					)}
					{
						<Button
							color={PartidaMayorMetradoSeleccionado && isUpdate ? 'warning' : 'success'}
							outline
							className='me-2'
							onClick={
								PartidaMayorMetradoSeleccionado ? onSaveActividadOnMM : onSaveActividad
							}
						>
							<MdOutlineCheck size={25} />{' '}
						</Button>
					}
					<Button color='danger' outline onClick={toggleModal}>
						<MdClose size={25} />
					</Button>
				</ModalFooter>
			</Modal>
		</Fragment>
	);
};

export default ModalMayorMetradoSave;

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Redondea } from '../../../Utils/Funciones';
import { toast } from 'react-toastify';

export const useModalMayorMetrado = (
    PartidaSelecccionado,
    Actividad,
    PartidaMayorMetradoSeleccionado,
    isUpdate,
    saveActividadMayorMetradoOnMM,
    savePartidaMayorMetrado,
    updateActividadMayorMetradoOnMM
) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const toggleModal = () => {
        if (modalIsOpen) {
            reset(initialFormValues);
        }
        setModalIsOpen(!modalIsOpen);
    };

    const initialFormValues = {
        idPartida: PartidaSelecccionado.id_partida,
        tipo: 'mayor metrado',
        actividades: [
            {
                nombre: '',
                elementos: '1.00',
                veces: '',
                largo: '',
                ancho: '',
                alto: '',
                parcial: '',
                tipo: 'subtitulo',
            },
        ],
    };

    if (Actividad) {
        initialFormValues.idPartida = Actividad.Partidas_id_partida;
        initialFormValues.actividades[0] = {
            nombre: Actividad.nombre,
            elementos: Actividad.elementos || 1,
            veces: Actividad.veces,
            largo: Actividad.largo,
            ancho: Actividad.ancho,
            alto: Actividad.alto,
            parcial: Redondea(Actividad.parcial),
            tipo: Actividad.tipo,
        };
    } else if (PartidaMayorMetradoSeleccionado) {
        initialFormValues.idPartida = PartidaSelecccionado.id_partida;
        initialFormValues.tipo = 'mayor metrado';
        initialFormValues.actividades = [
            {
                nombre: '',
                elementos: '1.00',
                veces: '',
                largo: '',
                ancho: '',
                alto: '',
                parcial: '',
                tipo: 'subtitulo',
            },
        ];
    }
    const {
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        register,
        reset,
        trigger
    } = useForm({
        defaultValues: initialFormValues,
    });

    const onAddSubmit = data => {
        const actividades = getValues('actividades');
        const nuevaActividad = {
            nombre: '',
            elementos: '1.00',
            veces: '',
            largo: '',
            ancho: '',
            alto: '',
            parcial: '',
            tipo: 'subtitulo',
        };
        setValue('actividades', [...actividades, nuevaActividad]);
    };
    const toastConfig = {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    };

    const [validationErrors, setValidationErrors] = useState(false);
    const onSaveActividad = async () => {
        const validationResult = await trigger();

        if (validationResult) {
            const data = getValues();
            setValidationErrors(false);
            savePartidaMayorMetrado(data);
            toggleModal();
            if (Actividad) {
                toast.success('La actividad ha sido modificada ', toastConfig);
            }
            else {
                toast.success('Las actividades han sido añadidas ', toastConfig);
            }

        } else {
            setValidationErrors(true);
            toast.error('No se pueden guardar actividades con errores.', toastConfig);
        }
    };

    const onSaveActividadOnMM = async () => {
        const validationResult = await trigger();
        if (validationResult) {
            const formValues = getValues();
            const idPartida = getValues("idPartida");

            const actividadesArray = formValues.actividades.map(actividad => ({
                nombre: actividad.nombre,
                elementos: actividad.elementos,
                veces: actividad.veces,
                largo: actividad.largo,
                ancho: actividad.ancho,
                alto: actividad.alto,
                parcial: actividad.parcial,
                tipo: actividad.tipo,
                Partidas_id_partida: idPartida,
            }));

            const dataToSend = {
                actividades: actividadesArray,
            };

            setValidationErrors(false);
            if (isUpdate) {
                updateActividadMayorMetradoOnMM(Actividad, dataToSend.actividades[0])
                if (isUpdate) {
                    toast.warning('La actividad ha sido actualizada', toastConfig);
                }
            }
            else {
                saveActividadMayorMetradoOnMM(dataToSend);
                if (Actividad) {
                    toast.success('La actividad ha sido modificada', toastConfig);
                } else {
                    toast.success('Las actividades han sido añadidas', toastConfig);
                }
            }
            toggleModal();
        } else {
            setValidationErrors(true);
            toast.error('No se pueden guardar actividades con errores.', toastConfig);
        }
    }
    const handleInputChange = (index) => {
        const values = getValues();

        const elementos = values.actividades[index].elementos || 1;
        const veces = values.actividades[index].veces || 1;
        const largo = values.actividades[index].largo || 1;
        const ancho = values.actividades[index].ancho || 1;
        const alto = values.actividades[index].alto || 1;

        const multiplicacion = elementos * veces * largo * ancho * alto;
        const resultadoRedondeado = Redondea(multiplicacion);

        setValue(`actividades[${index}].parcial`, resultadoRedondeado);
    };
    const removeActivity = (indexToRemove) => {
        const actividades = getValues('actividades');
        if (actividades.length == 1) return 0;
        const updatedActividades = actividades.filter((_, index) => index !== indexToRemove);
        setValue('actividades', updatedActividades);
        reset({ actividades: updatedActividades });
    };

    useEffect(() => {
        if (Object.keys(errors).length === 0) {
            setValidationErrors(false);
        }
    }, [errors]);

    return {
        modalIsOpen,
        toggleModal,
        handleSubmit,
        onAddSubmit,
        getValues,
        errors,
        register,
        trigger,
        validationErrors,
        onSaveActividad,
        onSaveActividadOnMM,
        handleInputChange,
        removeActivity,
    }
}


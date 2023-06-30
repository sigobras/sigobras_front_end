import { useEffect, useState } from 'react';
import { CargoNoTecnico, Person, formulario, historialPersonalNoTecnico } from '../interfaces/CargoNoTecnico';
import { crearHistorialPersonalNoTecnico, deleteAsignacionPersonalNoTecnico, deleteHistorialPersonalNoTecnico, editarCargoPersonalNoTecnico, editarHistorialPersonalNoTecnico, editarPersonalNoTecnico, getCargosObreros, getPersonalNoTecnico, grabarPersonalNoTecnico, obtenerHistorial } from '../services/personalNoTecnico';

export const usePersonalNoTecnico = () => {
    const [cargos, setCargos] = useState<CargoNoTecnico[]>([]);

    useEffect(() => {
        const fetchCargos = async () => {
            const cargosData = await getCargosObreros();
            setCargos(cargosData);
        }

        fetchCargos();

    }, []);

    return cargos;
}

export function useGrabarPersonalNoTecnico() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (data: formulario, id_ficha: String) => {
        setLoading(true);
        setError(null);
        try {
            const resp = await grabarPersonalNoTecnico(data, id_ficha);
            return resp
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, submit };
}


export function usePersonal(id_ficha: String) {
    const [personal, setPersonal] = useState<Person[]>([]);

    useEffect(() => {
        async function fetchPersonal() {
            const data = await getPersonalNoTecnico(id_ficha);
            setPersonal(Object.values(data[0]));
        }
        fetchPersonal();
    }, [id_ficha]);

    async function deleteAsignacion(id_asignacion: number) {
        const result = await deleteAsignacionPersonalNoTecnico(id_asignacion);
        if (result) {
            const updatedPersonalArray = personal.filter(item => item.id_asignacion !== id_asignacion);
            setPersonal(updatedPersonalArray);
        }
    }
    return { personal, deleteAsignacion, setPersonal };
}

export const editPersonal = async (id: number, data: formulario, id_asignacion: number, nuevo_cargo: number) => {
    const result = Promise.all([editarCargoPersonalNoTecnico(id_asignacion, nuevo_cargo), editarPersonalNoTecnico(id, data)])
    return result
}


export function useUpdateHistorial(id: number, field: string, value: number) {

    const updateHistorial = async () => {

        try {
            const response = await editarHistorialPersonalNoTecnico(id, field, value);
            return response
        } catch (error: any) {
            return error
        } finally {
        }
    };

    return {
        updateHistorial,
    };
}

export function useHistorialPersonalNoTecnico(id_personal: number, id_ficha: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [historial, setHistorial] = useState<historialPersonalNoTecnico[]>([])

    async function useHistorial() {
        useEffect(() => {
            async function fetchHistorial() {
                const data = await obtenerHistorial(id_personal, id_ficha);
                setHistorial(data);
            }
            fetchHistorial();
        }, [id_personal, id_ficha]);

    }


    const submit = async (data: historialPersonalNoTecnico) => {
        setLoading(true);
        setError(null);

        try {
            const res = await crearHistorialPersonalNoTecnico(data);
            setLoading(false);

            return res;
        } catch (error: any) {
            console.error(error);
            setLoading(false);
            setError(error);
            return [];
        }
    };
    async function borrarHistorialPersonalNoTecnico(id_historial: number) {
        const result = await deleteHistorialPersonalNoTecnico(id_historial);
        if (result) {
            const updatedHistorialArray = historial.filter(item => item.id_historial !== id_historial);

            setHistorial(updatedHistorialArray);
        }
    }

    return { submit, loading, error, borrarHistorialPersonalNoTecnico, historial, setHistorial, useHistorial };
};


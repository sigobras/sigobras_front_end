export interface CargoNoTecnico {
    id: number;
    nombre: string;
}

export interface Ficha {
    id_ficha: string;
}

export type formulario = {
    id_cargo: number | null,
    nombres: string | null,
    apellido_paterno: string | null,
    apellido_materno: string | null,
    dni: number | null,
    telefono: number | null,
    fecha_nacimiento: string | null,
    direccion: string | null,
    celular: number | null,
    email: string | null,
}

export interface Person {
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    telefono: string;
    fecha_nacimiento: string;
    direccion: string;
    celular: string;
    email: string;
    id_asignacion: number;
    ['asignacion.id_cargos_obreros']: number;
}

export type historialPersonalNoTecnico = {
    id_historial?: number | null,
    dias_trabajados: number | null,
    mes_ano: string | null,
    id_asignacion: number | null,
    id_cargo?: number | null,
}
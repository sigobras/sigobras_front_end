import axios from 'axios';
import { UrlServer } from '../utils/ServerUrlConfig';
import { formulario, historialPersonalNoTecnico } from '../interfaces/CargoNoTecnico';



export const getCargosObreros = async () => {
  const res = await axios.get(`${UrlServer}/v1/cargosNoTecnicos`);
  return res.data;
}

export async function grabarPersonalNoTecnico(data: formulario, id_ficha: String) {
  const response = await axios.post(`${UrlServer}/v1/personalNoTecnico/`, {
    ...data,
    id_ficha,
  });
  return response.data;
}


export async function getPersonalNoTecnico(id_ficha: String) {
  try {
    const res = await axios.get(`${UrlServer}/v1/personalNoTecnico`, {
      params: {
        id_ficha
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function deleteAsignacionPersonalNoTecnico(id_asignacion: number) {
  if (window.confirm("¿Está seguro que desea eliminar a este personal?")) {
    try {
      const res = await axios.delete(`${UrlServer}/v1/asignacionPersonalNoTecnico/${id_asignacion}`);
      alert("Se eliminó el registro con éxito");
      return res.status;
    } catch (error) {
      console.error(error);
      return null;
    }
  } else {
    return null;
  }
}

export async function editarCargoPersonalNoTecnico(id: number, id_cargos_obreros: number) {
  const response = await axios.put(`${UrlServer}/v1/asignacionPersonalNoTecnico/${id}`, {
    id_cargos_obreros
  });
  return response.data;
}

export async function editarPersonalNoTecnico(id: number, data: formulario) {
  const response = await axios.put(`${UrlServer}/v1/personalNoTecnico/${id}`, data);
  return response.data;
}

export async function obtenerHistorial(id_personal: number, id_ficha: number) {
  try {
    const res = await axios.get(`${UrlServer}/v1/historialPersonalNoTecnico`, {
      params: {
        id_personal,
        id_ficha
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function editarHistorialPersonalNoTecnico(id: number, field: string, value: number) {
  const response = await axios.put(`${UrlServer}/v1/historialPersonalNoTecnico/${id}`, {
    [field]: value,
  });
  return response.data;
}

export async function crearHistorialPersonalNoTecnico(data: historialPersonalNoTecnico) {
  try {
    const res = await axios.post(`${UrlServer}/v1/historialPersonalNoTecnico`, data);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function deleteHistorialPersonalNoTecnico(id_historial: number) {
  if (window.confirm("¿Está seguro que desea eliminar a este historial?")) {
    try {
      const res = await axios.delete(`${UrlServer}/v1/historialPersonalNoTecnico/${id_historial}`);
      alert("Se eliminó el registro con éxito");
      return res.status;
    } catch (error) {
      console.error(error);
      return null;
    }
  } else {
    return null;
  }
}
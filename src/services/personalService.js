// service.js

import axios from "axios";
import { UrlServer } from "../utils/ServerUrlConfig";

export async function getActiveInterfacePermission(params) {
  const res = await axios.get(`${UrlServer}/v1/interfazPermisos/activo`, {
    params,
  });
  return res.data;
}

export async function getWorkPositions(params) {
  const res = await axios.get(`${UrlServer}/v1/cargos/obra`, { params });
  return res.data;
}

export async function getDesignations(params) {
  const res = await axios.get(`${UrlServer}/v1/designaciones`, { params });
  return res.data;
}

export async function updateDesignation(id, data) {
  await axios.put(`${UrlServer}/v1/designaciones/${id}`, data);
}

export async function getUserData(id_ficha) {
  const request = await axios.get(
    `${UrlServer}/v1/usuarios/obra/${id_ficha}/acceso/${sessionStorage.getItem(
      "idacceso"
    )}`
  );
  return request.data;
}

export async function uploadMemorandum(id, formData, config) {
  const res = await axios.put(
    `${UrlServer}/v1/designaciones/${id}/memorandum`,
    formData,
    config
  );
  return res.data;
}
//formulario
export const getUserByDNI = async (dni) => {
  const res = await axios.get(`${UrlServer}/v1/usuarios/dni/${dni}`);
  return res.data;
};

export const createUser = async (id_ficha, IdCargoSeleccionado, data) => {
  const res = await axios.post(
    `${UrlServer}/v1/usuarios/obra/${id_ficha}/cargo/${IdCargoSeleccionado}`,
    data
  );
  return res.data;
};

export const updateUser = async (id_acceso, data) => {
  const res = await axios.put(`${UrlServer}/v1/usuarios/${id_acceso}`, data);
  return res.data;
};
export const getCargosService = async (cargos_tipo_id) => {
  const res = await axios.get(`${UrlServer}/v1/cargos/`, {
    params: {
      cargos_tipo_id: cargos_tipo_id,
    },
  });
  return res.data;
};

export const postAccesosAsignarObraService = async (
  Fichas_id_ficha,
  Accesos_id_acceso,
  cargos_id_Cargo,
  fecha_inicio
) => {
  const res = await axios.post(`${UrlServer}/v1/accesos/asignarObra`, {
    Fichas_id_ficha: Fichas_id_ficha,
    Accesos_id_acceso: Accesos_id_acceso,
    cargos_id_Cargo: cargos_id_Cargo,
    fecha_inicio: fecha_inicio,
  });
  return res.data;
};

export const putUsuariosService = async (id_acceso, data) => {
  const res = await axios.put(`${UrlServer}/v1/usuarios/${id_acceso}`, data);
  return res.data;
};

export const postUsuariosService = async (
  id_ficha,
  IdCargoSeleccionado,
  data
) => {
  const res = await axios.post(
    `${UrlServer}/v1/usuarios/obra/${id_ficha}/cargo/${IdCargoSeleccionado}`,
    data
  );
  return res.data;
};
export async function fetchUsuariosPersonal(
  id_ficha,
  cargos_tipo_id,
  habilitado = true,
  sort_by
) {
  const res = await axios.get(`${UrlServer}/v1/usuarios`, {
    params: {
      id_ficha: id_ficha,
      habilitado: habilitado,
      cargos_tipo_id: cargos_tipo_id,
    },
  });
  return res.data;
}

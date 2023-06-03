import axios from "axios";
import React, { useState, useEffect } from "react";
import { UrlServer } from "../utils/ServerUrlConfig";
import { useDispatch } from "react-redux";
import { setSelectedWork } from "../redux/actions/work";

const useProvincias = () => {
  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(0);

  useEffect(() => {
    const fetchProvincias = async () => {
      const res = await axios.get(`${UrlServer}/v1/unidadEjecutora`, {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
        },
      });
      setProvincias(res.data);
      if (!sessionStorage.getItem("provinciaSeleccionada")) {
        sessionStorage.setItem("provinciaSeleccionada", 0);
      } else {
        setProvinciaSeleccionada(
          sessionStorage.getItem("provinciaSeleccionada")
        );
      }
    };

    fetchProvincias();
  }, []);

  return { provincias, provinciaSeleccionada, setProvinciaSeleccionada };
};

const useSectores = (provinciaSeleccionada) => {
  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    const fetchSectores = async () => {
      const res = await axios.get(`${UrlServer}/v1/sectores`, {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
          id_unidadEjecutora: provinciaSeleccionada,
        },
      });
      setSectores(res.data);
    };

    fetchSectores();
  }, [provinciaSeleccionada]);

  return sectores;
};

const useEstadosObra = () => {
  const [estadosObra, setEstadosObra] = useState([]);

  useEffect(() => {
    const fetchEstadosObra = async () => {
      const res = await axios.get(`${UrlServer}/v1/obrasEstados`, {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
        },
      });
      setEstadosObra(res.data);
    };

    fetchEstadosObra();
  }, []);

  return estadosObra;
};

const useObras = (
  provinciaSeleccionada,
  sectoreSeleccionado,
  estadosObraeleccionada
) => {
  const dispatch = useDispatch();
  const [obras, setObras] = useState([]);

  useEffect(() => {
    const fetchObras = async () => {
      const res = await axios.get(`${UrlServer}/v1/obras`, {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
          id_unidadEjecutora: provinciaSeleccionada,
          idsectores: sectoreSeleccionado,
          id_Estado: estadosObraeleccionada,
          sort_by: "poblacion-desc",
        },
      });
      setObras(res.data);
      if (!sessionStorage.getItem("idobra")) {
        setSelectedWorkHandler(res.data[0]);
      }
    };

    if (provinciaSeleccionada !== -1) {
      fetchObras();
    }
  }, [provinciaSeleccionada, sectoreSeleccionado, estadosObraeleccionada]);

  const setSelectedWorkHandler = (data) => {
    sessionStorage.setItem("selectedWork", data);
    dispatch(setSelectedWork(data));
  };

  return obras;
};
export { useProvincias, useSectores, useEstadosObra, useObras };

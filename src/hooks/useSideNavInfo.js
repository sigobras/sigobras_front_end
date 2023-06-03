// hooks/useFetch.js
import { useState, useEffect } from "react";
import axios from "axios";
import { UrlServer } from "../utils/ServerUrlConfig";

export const useSideNavInfo = (id_ficha) => {
  const [dataObra, setDataObra] = useState([]);
  const [costoDirecto, setCostoDirecto] = useState([]);
  const [dataMenus, setDataMenus] = useState([]);
  const [dataDelta, setDataDelta] = useState({
    fisico_monto: 1,
    fisico_programado_monto: 1,
  });
  const [estadoObra, setEstadoObra] = useState("");

  useEffect(() => {
    console.log({id_ficha})
    if (id_ficha) {
      const fetchDataGenerales = async () => {
        var res = await axios.get(`${UrlServer}/v1/obras/${id_ficha}`, {
          params: {
            id_acceso: sessionStorage.getItem("idacceso"),
          },
        });
        setDataObra(res.data);
      };

      const fetchPresupuestoCostoDirecto = async () => {
        var res = await axios.post(`${UrlServer}/getPresupuestoCostoDirecto`, {
          id_ficha,
        });
        setCostoDirecto(res.data.monto);
      };

      const fetchMenu = async () => {
        var res = await axios.post(`${UrlServer}/getMenu2`, {
          id_ficha,
          id_acceso: sessionStorage.getItem("idacceso"),
        });
        if (Array.isArray(res.data)) {
          setDataMenus(res.data);
        }
      };

      const fetchDataDelta = async () => {
        var res = await axios.post(`${UrlServer}/getUltimoEjecutadoCurvaS`, {
          id_ficha,
        });
        setDataDelta(res.data);
      };

      const fetchEstadoObra = async () => {
        var request = await axios.post(`${UrlServer}/getEstadoObra`, {
          id_ficha: id_ficha,
        });
        setEstadoObra(request.data.nombre);
        sessionStorage.setItem("estadoObra", request.data.nombre);
      };

      fetchDataGenerales();
      fetchPresupuestoCostoDirecto();
      fetchMenu();
      fetchDataDelta();
      fetchEstadoObra();
    }
  }, [id_ficha]);

  return { dataObra, costoDirecto, dataMenus, dataDelta, estadoObra };
};

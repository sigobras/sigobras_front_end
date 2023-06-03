import axios from "axios";
import React, { useEffect, useState } from "react";
import { UrlServer } from "../utils/ServerUrlConfig";

export const useLabel = (id_ficha) => {
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si id_ficha es undefined, no realizar la llamada a la API
    if (!id_ficha) {
      setError(new Error("id_ficha is undefined"));
      return;
    }

    const fetchLabels = async () => {
      try {
        const res = await axios.get(
          `${UrlServer}//v1/obrasLabels/obras?id_ficha=${id_ficha}`
        );
        if (Array.isArray(res.data)) {
          setLabels(res.data);
        } else {
          throw new Error("Error fetching labels");
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchLabels();
  }, [id_ficha]);

  return { labels, error };
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { RiEyeOffFill, RiShieldCheckFill } from "react-icons/ri";
export default ({ fecha, UsuarioData }) => {
  useEffect(() => {
    fetchFechaRevisado();
  }, []);
  const [FechaRevisado, setFechaRevisado] = useState(true);
  async function fetchFechaRevisado() {
    const request = await axios.post(`${UrlServer}/getEstadoRevisadoFecha`, {
      fecha: fecha,
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setFechaRevisado(request.data.revisado);
  }
  async function revisarFecha() {
    if (confirm("Esta conforme con el avance de esta fecha?")) {
      const request = await axios.post(`${UrlServer}/postEstadoRevisadoFecha`, {
        fecha: fecha,
        id_ficha: sessionStorage.getItem("idobra"),
      });
      fetchFechaRevisado();
    }
  }

  return (
    <div>
      {FechaRevisado ? (
        <div style={{ color: "#25d366" }}>
          <RiShieldCheckFill size={17} />
        </div>
      ) : UsuarioData.cargo_nombre == "SUPERVISOR" ? (
        <div onClick={() => revisarFecha()} style={{ color: "#676767" }}>
          <RiEyeOffFill size={17} className="icon" />
        </div>
      ) : (
        <div style={{ color: "#676767" }}>
          <RiEyeOffFill size={17} />
        </div>
      )}
    </div>
  );
};

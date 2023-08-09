import React, { Component, useEffect, useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavLink,
} from "reactstrap";
import { FaBell } from "react-icons/fa";
import LoadingXD from "../../../../public/images/loaderXS.gif";
import axios from "axios";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { socket } from "../Utils/socket";
export default () => {
  useEffect(() => {
    // fetchNotificacionesCantidad();
    fetchNotificaciones();
    socketIni();
  }, []);
  function socketIni() {
    socket.on(
      "gestion_documentaria_" + sessionStorage.getItem("idobra"),
      (data) => {
        // fetchNotificacionesCantidad();
        fetchNotificaciones();
      }
    );
  }
  const [Notificaciones, setNotificaciones] = useState([
    {
      emisor: "-----",
      descripcion: "-----",
    },
  ]);
  async function fetchNotificaciones() {
    if (
      sessionStorage.getItem("idobra") &&
      sessionStorage.getItem("idacceso")
    ) {
      var res = await axios.get(`${UrlServer}/FichasNotificaciones`, {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
          id_ficha: sessionStorage.getItem("idobra"),
        },
      });
      if (Array.isArray(res.data)) {
        setNotificaciones(res.data);
      }
    }
  }
  const [NotificacionesCantidad, setNotificacionesCantidad] = useState(0);
  async function fetchNotificacionesCantidad() {
    var res = await axios.get(`${UrlServer}/FichasNotificaciones_cantidad`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setNotificacionesCantidad(res.data.cantidad);
  }
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => {
    if (!dropdownOpen) {
      putFichasNotificaciones();
      // fetchNotificaciones()
    }
    setDropdownOpen(!dropdownOpen);
  };
  async function putFichasNotificaciones() {
    var res = await axios.put(`${UrlServer}/FichasNotificaciones`, {
      id_acceso: sessionStorage.getItem("idacceso"),
      id_ficha: sessionStorage.getItem("idobra"),
    });
    // fetchNotificacionesCantidad();
  }
  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle>
        <FaBell />
        {NotificacionesCantidad}
      </DropdownToggle>
      <DropdownMenu
        style={{
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        {Notificaciones.map(
          (item, i) =>
            item.fichas_notificaciones_tipo_id == 1 && (
              <DropdownItem key={i}>
                <NavLink href={`/${item.url}`}>
                  <div
                    style={{
                      color: "black",
                      fontWeight: 700,
                    }}
                  >
                    {item.emisor}
                  </div>
                  <div
                    style={{
                      color: "black",
                    }}
                  >
                    {item.descripcion}
                  </div>
                  {item.asunto && (
                    <div
                      style={{
                        color: "black",
                        fontWeight: 700,
                      }}
                    >
                      ASUNTO: {item.asunto}
                    </div>
                  )}
                </NavLink>
              </DropdownItem>
            )
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

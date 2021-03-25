import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Nav,
  NavItem,
  NavLink,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import "./valorizaciones.css";
import ValorizacionResumen from "./ValorizacionResumen";
import ValorizacionComponente from "./ValorizacionComponente";
export default () => {
  useEffect(() => {
    fetchAnyos();
    fetchComponentes();
  }, []);
  //anyos
  const [Anyos, setAnyos] = useState([]);
  async function fetchAnyos() {
    const res = await axios.post(`${UrlServer}/getValGeneralAnyos2`, {
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setAnyos(res.data);
    setAnyoSeleccionado(res.data[res.data.length - 1].anyo);
  }
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  //periodos
  const [Periodos, setPeriodos] = useState([]);
  async function fetchPeriodos() {
    const res = await axios.post(`${UrlServer}/getValGeneralPeriodos`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: AnyoSeleccionado,
    });
    if (Array.isArray(res.data)) {
      setPeriodos(res.data);
      setPeriodoSeleccionado(res.data[res.data.length - 1]);
    } else {
      setPeriodos([]);
    }
  }
  const [PeriodoSeleccionado, setPeriodoSeleccionado] = useState("--");
  //Componentes
  const [Componentes, setComponentes] = useState([]);
  async function fetchComponentes() {
    const res = await axios.post(`${UrlServer}/getValGeneralComponentes`, {
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setComponentes(res.data);
  }
  const [Componenteseleccionado, setComponenteseleccionado] = useState({
    numero: 0,
    nombre: "RESUMEN DE VALORIZACIÓN",
  });

  useEffect(() => {
    if (AnyoSeleccionado != 0) {
      fetchPeriodos();
    }
  }, [AnyoSeleccionado]);
  return (
    <div>
      <Nav tabs>
        <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle nav caret>
            {AnyoSeleccionado == 0 ? "--" : AnyoSeleccionado}
          </DropdownToggle>
          <DropdownMenu>
            {Anyos.map((item, i) => (
              <DropdownItem
                key={i}
                onClick={() => setAnyoSeleccionado(item.anyo)}
              >
                {item.anyo}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {Periodos.map((item, i) => (
          <NavItem key={i}>
            <NavLink
              active={PeriodoSeleccionado.codigo == item.codigo}
              onClick={() => setPeriodoSeleccionado(item)}
            >
              {item.codigo}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={Componenteseleccionado.numero == 0}
            onClick={() =>
              setComponenteseleccionado({
                numero: 0,
                nombre: "RESUMEN DE VALORIZACIÓN",
              })
            }
          >
            RESUMEN
          </NavLink>
        </NavItem>
        {Componentes.map((item, i) => (
          <NavItem key={i}>
            <NavLink
              active={Componenteseleccionado.numero == item.numero}
              onClick={() => setComponenteseleccionado(item)}
            >
              C-{item.numero}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <CardHeader>{Componenteseleccionado.nombre}</CardHeader>
      {Componenteseleccionado.numero == 0 ? (
        <ValorizacionResumen
          PeriodoSeleccionado={PeriodoSeleccionado}
          key={JSON.stringify(PeriodoSeleccionado)}
        />
      ) : (
        <ValorizacionComponente
          PeriodoSeleccionado={PeriodoSeleccionado}
          Componenteseleccionado={Componenteseleccionado}
          key={
            JSON.stringify(Componenteseleccionado) +
            JSON.stringify(PeriodoSeleccionado)
          }
        />
      )}
    </div>
  );
};

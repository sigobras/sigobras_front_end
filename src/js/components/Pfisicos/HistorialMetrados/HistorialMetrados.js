import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav, NavItem, NavLink, Button } from "reactstrap";
import classnames from "classnames";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { mesesShort } from "../../Utils/Funciones";

import HistorialMetradosResumenAnual from "./HistorialMetradosResumenAnual";
import HistorialMetradosResumenMensual from "./HistorialMetradosResumenMensual";
import HistorialMetradosComponente from "./HistorialMetradosComponente";
import HistorialMetradosSemana from "./HistorialMetradosSemana";

export default () => {
  useEffect(() => {
    fetchAnyos();
    fetchUsuarioData();
  }, []);
  //get data de anyos
  const [Anyos, setAnyos] = useState([]);
  async function fetchAnyos() {
    var request = await axios.post(`${UrlServer}/getHistorialAnyos2`, {
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setAnyos(request.data);
    var ultimoAnyo = request.data[request.data.length - 1].anyo;
    setAnyoSeleccionado(ultimoAnyo);
  }
  //anyo seleccionado
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0);

  //get data de meses
  const [Meses, setMeses] = useState([]);
  async function fetchMeses() {
    var request = await axios.post(`${UrlServer}/getHistorialMeses2`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: AnyoSeleccionado,
    });
    setMeses(request.data);
  }
  //mes seleccionado
  const [MesSeleccionado, setMesSeleccionado] = useState(-1);
  //get data de componentes
  const [Componentes, setComponentes] = useState([]);
  async function fetchComponentes() {
    var request = await axios.post(`${UrlServer}/getHistorialComponentes2`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: AnyoSeleccionado,
      mes: MesSeleccionado,
    });
    setComponentes(request.data);
  }
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState({});
  function onChangeComponenteSeleccionado(componente) {
    setComponenteSeleccionado(componente);
  }
  const [toggleHistorialSemanal, settoggleHistorialSemanal] = useState(false);
  const [Semanas, setSemanas] = useState([]);
  async function fetchSemanas() {
    var res = await axios.post(`${UrlServer}/getHistorialSemanas`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: AnyoSeleccionado,
      mes: MesSeleccionado,
    });
    if (Array.isArray(res.data)) {
      setSemanas(res.data);
      setSemanaSeleccionada(res.data[0]);
    }
  }
  const [SemanaSeleccionada, setSemanaSeleccionada] = useState(-1);
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const request = await axios.post(`${UrlServer}/getDatosUsuario`, {
      id_acceso: sessionStorage.getItem("idacceso"),
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setUsuarioData(request.data);
  }
  useEffect(() => {
    fetchMeses();
    setMesSeleccionado(0);
  }, [AnyoSeleccionado]);
  useEffect(() => {
    if (MesSeleccionado != 0) {
      if (toggleHistorialSemanal) {
        fetchSemanas();
      } else {
        fetchComponentes();
      }
    }
    setComponenteSeleccionado({ numero: 0 });
  }, [MesSeleccionado, toggleHistorialSemanal]);

  return (
    <div>
      <Nav tabs>
        <NavItem>
          <select
            value={AnyoSeleccionado}
            className="form-control form-control-sm"
            onChange={(e) => setAnyoSeleccionado(e.target.value)}
          >
            {Anyos.map((item, i) => (
              <option key={i} value={item.anyo}>
                {item.anyo}
              </option>
            ))}
          </select>
        </NavItem>
        {Meses.map((item, i) => (
          <NavItem key={i}>
            <NavLink
              className={classnames({ active: item.mes == MesSeleccionado })}
              onClick={() => {
                setMesSeleccionado(item.mes);
              }}
            >
              {mesesShort[item.mes - 1]}
            </NavLink>
          </NavItem>
        ))}
        <NavItem>
          <NavLink
            className={classnames({ active: 0 == MesSeleccionado })}
            onClick={() => {
              setMesSeleccionado(0);
            }}
          >
            RESUMEN ANUAL
          </NavLink>
        </NavItem>
        {MesSeleccionado > 0 && (
          <Button
            onClick={() => {
              settoggleHistorialSemanal(!toggleHistorialSemanal);
            }}
            color={toggleHistorialSemanal ? "warning" : "danger"}
          >
            {toggleHistorialSemanal ? "componentes" : "semanal"}
          </Button>
        )}
      </Nav>
      {MesSeleccionado > 0 &&
        (!toggleHistorialSemanal ? (
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: 0 == ComponenteSeleccionado.numero,
                })}
                onClick={() => onChangeComponenteSeleccionado({ numero: 0 })}
              >
                RESUMEN
              </NavLink>
            </NavItem>
            {Componentes.map((item, i) => (
              <NavItem key={i}>
                <NavLink
                  className={classnames({
                    active: item.numero == ComponenteSeleccionado.numero,
                  })}
                  onClick={() => onChangeComponenteSeleccionado(item)}
                >
                  C-{item.numero}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        ) : (
          <Nav tabs>
            {Semanas.map((item, i) => (
              <NavItem key={i}>
                <NavLink
                  onClick={() => setSemanaSeleccionada(item)}
                  className={classnames({
                    active: item.semana == SemanaSeleccionada.semana,
                  })}
                >
                  S-{item.semana}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        ))}
      {MesSeleccionado > 0 ? (
        !toggleHistorialSemanal ? (
          ComponenteSeleccionado.numero != 0 ? (
            <HistorialMetradosComponente
              ComponenteSeleccionado={ComponenteSeleccionado}
              Anyo={AnyoSeleccionado}
              Mes={MesSeleccionado}
              key={JSON.stringify(ComponenteSeleccionado)}
            />
          ) : (
            <HistorialMetradosResumenMensual
              key={AnyoSeleccionado + MesSeleccionado}
              Anyo={AnyoSeleccionado}
              Mes={MesSeleccionado}
            />
          )
        ) : (
          <HistorialMetradosSemana
            Semana={SemanaSeleccionada}
            key={JSON.stringify(SemanaSeleccionada)}
            UsuarioData={UsuarioData}
          />
        )
      ) : (
        AnyoSeleccionado != 0 && (
          <HistorialMetradosResumenAnual
            Anyo={AnyoSeleccionado}
            key={AnyoSeleccionado}
          />
        )
      )}
    </div>
  );
};

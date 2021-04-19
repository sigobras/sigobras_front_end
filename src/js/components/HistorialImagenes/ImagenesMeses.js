import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import axios from "axios";
import { FaSuperpowers, FaCircle } from "react-icons/fa";
import {
  MdFlashOn,
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdVisibility,
  MdMonetizationOn,
  MdWatch,
  MdLibraryBooks,
  MdCancel,
  MdArrowDropDownCircle,
} from "react-icons/md";
import { TiWarning } from "react-icons/ti";
import {
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  CardHeader,
  CardBody,
  Button,
  Input,
  UncontrolledPopover,
} from "reactstrap";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";

export default () => {
  useEffect(() => {
    cargarAnyos();
  }, []);
  //anyos
  const [Anyos, setAnyos] = useState([]);
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0);
  async function cargarAnyos() {
    var res = await axios.get(`${UrlServer}/v1/partidasImagenes/anyos`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setAnyos(res.data);
    if (res.data.length)
      setAnyoSeleccionado(res.data[res.data.length - 1].anyo);
  }
  //Meses
  const [Meses, setMeses] = useState([]);
  const [MesSeleccionado, setMesSeleccionado] = useState(0);
  async function cargarMeses() {
    var res = await axios.get(`${UrlServer}/v1/partidasImagenes/meses`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo: AnyoSeleccionado,
      },
    });
    setMeses(res.data);
    if (res.data.length) setMesSeleccionado(res.data[res.data.length - 1].mes);
  }
  //Componentes
  const [Componentes, setComponentes] = useState([]);
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState({
    id_componente: 0,
  });
  async function cargarComponentes() {
    var res = await axios.get(`${UrlServer}/v1/partidasImagenes/Componentes`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo: AnyoSeleccionado,
        mes: MesSeleccionado,
      },
    });
    setComponentes(res.data);
    if (res.data) setComponenteSeleccionado(res.data[res.data.length - 1]);
  }
  //resumen
  const [Resumen, setResumen] = useState(true);
  //Partidas
  const [Partidas, setPartidas] = useState([]);
  async function cargarPartidas() {
    var res = await axios.get(`${UrlServer}/v1/partidasImagenes`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo: AnyoSeleccionado,
        mes: MesSeleccionado,
        id_componente: ComponenteSeleccionado.id_componente,
        resumen: Resumen,
      },
    });
    setPartidas(res.data);
  }

  useEffect(() => {
    if (AnyoSeleccionado) {
      cargarMeses();
    }
  }, [AnyoSeleccionado]);
  useEffect(() => {
    if (MesSeleccionado) {
      cargarComponentes();
    }
  }, [MesSeleccionado]);
  useEffect(() => {
    if (ComponenteSeleccionado.id_componente) {
      cargarPartidas();
    }
  }, [ComponenteSeleccionado, Resumen]);
  function renderTitulos() {
    var render = [];
    if (Partidas.length) {
      var item = Partidas[0];
      var properties = Object.keys(item).filter((element) =>
        element.startsWith("dia_")
      );
      for (let i = 0; i < properties.length; i++) {
        var key = properties[i];
        render.push(<th key={key}>{key.split("_")[1]}</th>);
      }
    }

    return render;
  }
  function renderData(item) {
    var render = [];
    var properties = Object.keys(item).filter((element) =>
      element.startsWith("dia_")
    );
    for (let i = 0; i < properties.length; i++) {
      var key = properties[i];
      render.push(<td key={key}> {item[key] == 0 ? "" : item[key]}</td>);
    }

    return render;
  }
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
              active={item.mes == MesSeleccionado}
              onClick={() => {
                setMesSeleccionado(item.mes);
              }}
            >
              {mesesShort[item.mes - 1]}
            </NavLink>
          </NavItem>
        ))}
        <Button onClick={() => setResumen(!Resumen)} color="primary">
          {Resumen ? "Completo" : "Resumen"}
        </Button>
      </Nav>
      <Nav tabs>
        {Componentes.map((item, i) => (
          <NavItem key={i}>
            <NavLink
              active={
                item.id_componente == ComponenteSeleccionado.id_componente
              }
              onClick={() => {
                setComponenteSeleccionado(item);
              }}
            >
              C-{item.numero}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <table className="table-hover whiteThem-table">
        <thead>
          <tr>
            <th>ITEM</th>
            <th>DESCRIPCION</th>
            {renderTitulos()}
          </tr>
        </thead>
        <tbody>
          {Partidas.map((item, i) => (
            <tr key={item.id_partida}>
              <td>{item.item}</td>
              <td>{item.descripcion}</td>
              {renderData(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

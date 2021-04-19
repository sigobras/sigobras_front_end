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
import { mesesShort, Redondea } from "../Utils/Funciones";
import ModalImagenes from "./ModalImagenes";

export default () => {
  useEffect(() => {
    cargarComponentes();
  }, []);
  //Componentes
  const [Componentes, setComponentes] = useState([]);
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState({
    id_componente: 0,
  });
  async function cargarComponentes() {
    var res = await axios.get(`${UrlServer}/v1/partidasImagenes/Componentes`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setComponentes(res.data);
    if (res.data) setComponenteSeleccionado(res.data[res.data.length - 1]);
  }
  //resumen
  const [Resumen, setResumen] = useState(true);
  //partidas
  const [Partidas, setPartidas] = useState([]);
  async function cargarPartidas() {
    var res = await axios.get(`${UrlServer}/v1/partidasImagenes`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        id_componente: ComponenteSeleccionado.id_componente,
        resumen: Resumen,
      },
    });
    setPartidas(res.data);
  }

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
        element.startsWith("fecha_")
      );
      for (let i = 0; i < properties.length; i++) {
        var key = properties[i];
        render.push(
          <th key={key}>
            {mesesShort[key.split("_")[2] - 1] + " " + key.split("_")[1]}
          </th>
        );
      }
    }

    return render;
  }
  function renderData(item) {
    var render = [];
    var properties = Object.keys(item).filter((element) =>
      element.startsWith("fecha_")
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
        <Button onClick={() => setResumen(!Resumen)} color="primary">
          {Resumen ? "Completo" : "Resumen"}
        </Button>
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
              <td>
                <ModalImagenes partida={item} />
              </td>
              {renderData(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

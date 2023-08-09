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
import ModalImagenes from "./ModalImagenes";
import LabelsAsignadasInterfaz from "./LabelsAsignadasInterfaz";

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
        imagenes_labels_id: LabelSeleccionada,
      },
    });
    setPartidas(res.data);
  }
  const [LabelSeleccionada, setLabelSeleccionada] = useState();

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
  }, [ComponenteSeleccionado, Resumen, LabelSeleccionada]);
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
    var total = 0;
    for (let i = 0; i < properties.length; i++) {
      var key = properties[i];
      render.push(<td key={key}> {item[key] == 0 ? "" : item[key]}</td>);
      total += item[key];
    }
    render.push(<td>{total}</td>);
    return render;
  }
  function renderTotales() {
    var render = [
      <td colSpan="2" style={{ textAlign: "right", fontWeight: "700" }}>
        TOTAL
      </td>,
    ];
    if (Partidas.length) {
      var item = Partidas[0];
      var properties = Object.keys(item).filter((element) =>
        element.startsWith("dia_")
      );
      var total = 0;
      for (let i = 0; i < properties.length; i++) {
        var key = properties[i];
        var subtotal = 0;
        for (let j = 0; j < Partidas.length; j++) {
          const partida = Partidas[j];
          subtotal += partida[key];
        }
        render.push(
          <td key={key} style={{ fontWeight: "700" }}>
            {subtotal == 0 ? "" : subtotal}
          </td>
        );
        total += subtotal;
      }
      render.push(<td style={{ fontWeight: "700" }}>{total}</td>);
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
      <CardHeader>{ComponenteSeleccionado.nombre}</CardHeader>
      <div className="d-flex">
        <table className="table-hover whiteThem-table">
          <thead>
            <tr>
              <th>ITEM</th>
              <th>DESCRIPCION</th>
              {renderTitulos()}
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {Partidas.map((item, i) => (
              <tr key={item.id_partida}>
                <td>{item.item}</td>
                <td>
                  <ModalImagenes
                    partida={item}
                    anyo={AnyoSeleccionado}
                    mes={MesSeleccionado}
                    imagenes_labels_id={LabelSeleccionada}
                  />
                </td>
                {renderData(item)}
              </tr>
            ))}
            <tr>{renderTotales()}</tr>
          </tbody>
        </table>
        {AnyoSeleccionado != 0 &&
          MesSeleccionado != 0 &&
          ComponenteSeleccionado.id_componente != 0 && (
            <LabelsAsignadasInterfaz
              key={
                AnyoSeleccionado +
                "_" +
                MesSeleccionado +
                "_" +
                ComponenteSeleccionado.id_componente
              }
              anyo={AnyoSeleccionado}
              mes={MesSeleccionado}
              id_componente={ComponenteSeleccionado.id_componente}
              recargar={(value) => setLabelSeleccionada(value)}
            />
          )}
      </div>
    </div>
  );
};

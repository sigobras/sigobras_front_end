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
import { mesesShort, Redondea } from "../Utils/Funciones";
import ModalImagenes from "./ModalImagenes";
import LabelsAsignadasInterfaz from "./LabelsAsignadasInterfaz";

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
        imagenes_labels_id: LabelSeleccionada,
      },
    });
    setPartidas(res.data);
  }
  const [LabelSeleccionada, setLabelSeleccionada] = useState();
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
        element.startsWith("fecha_")
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
        {Componentes.map((item, i) => (
          <NavItem key={i}>
            <NavLink
              active={
                item.id_componente == ComponenteSeleccionado.id_componente
              }
              onClick={() => {
                setComponenteSeleccionado(item);
                setLabelSeleccionada();
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
                    imagenes_labels_id={LabelSeleccionada}
                  />
                </td>
                {renderData(item)}
              </tr>
            ))}
            <tr>{renderTotales()}</tr>
          </tbody>
        </table>
        {ComponenteSeleccionado.id_componente != 0 && (
          <LabelsAsignadasInterfaz
            key={ComponenteSeleccionado.id_componente}
            id_componente={ComponenteSeleccionado.id_componente}
            recargar={(value) => setLabelSeleccionada(value)}
          />
        )}
      </div>
    </div>
  );
};

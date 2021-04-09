import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import axios from "axios";
import { Nav, NavItem, NavLink, Button } from "reactstrap";
import classnames from "classnames";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import { mesesShort } from "../../Utils/Funciones";
export default () => {
  useEffect(() => {
    fetchAnyos();
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
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0);

  //get data de meses
  const [Meses, setMeses] = useState([]);
  async function fetchMeses() {
    var res = await axios.post(`${UrlServer}/getHistorialMeses2`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: AnyoSeleccionado,
    });
    setMeses(res.data);
    if (res.data.length) setMesSeleccionado(res.data[res.data.length - 1].mes);
  }
  const [MesSeleccionado, setMesSeleccionado] = useState(0);
  //get data de componentes
  const [Componentes, setComponentes] = useState([]);
  async function fetchComponentes() {
    var res = await axios.post(`${UrlServer}/getHistorialComponentes2`, {
      id_ficha: sessionStorage.getItem("idobra"),
      anyo: AnyoSeleccionado,
      mes: MesSeleccionado,
    });
    setComponentes(res.data);
    if (res.data.length) {
      console.log(
        "componente seleccionado",
        res.data[res.data.length - 1].id_componente
      );
      setComponenteSeleccionado(res.data[res.data.length - 1].id_componente);
    }
  }
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState(0);
  //avances
  const [Avances, setAvances] = useState([]);
  async function fetchAvances() {
    var res = await axios.get(`${UrlServer}/v1/avance/cuadroMetrados`, {
      params: {
        anyo: AnyoSeleccionado,
        mes: MesSeleccionado,
        id_componente: ComponenteSeleccionado,
      },
    });
    setAvances(res.data);
  }
  useEffect(() => {
    fetchMeses();
  }, [AnyoSeleccionado]);
  useEffect(() => {
    fetchComponentes();
  }, [MesSeleccionado]);
  useEffect(() => {
    console.log("AnyoSeleccionado", AnyoSeleccionado);
    console.log("MesSeleccionado", MesSeleccionado);
    console.log("ComponenteSeleccionado", ComponenteSeleccionado);
    if (AnyoSeleccionado && MesSeleccionado && ComponenteSeleccionado) {
      fetchAvances();
    }
  }, [MesSeleccionado, ComponenteSeleccionado]);
  function renderMesesCabezera() {
    var render = [];
    if (Avances && Avances[0]) {
      var properties = Object.keys(Avances[0]).filter((element) =>
        element.startsWith("dia_")
      );
      for (let index = 0; index < properties.length; index++) {
        const key = properties[index];
        render.push(<th>{key.split("_")[1]}</th>);
      }
    }
    return render;
  }
  function renderMesesBody(item) {
    var render = [];
    if (Avances && Avances[0]) {
      var properties = Object.keys(item).filter((element) =>
        element.startsWith("dia_")
      );
      for (let index = 0; index < properties.length; index++) {
        const key = properties[index];
        render.push(
          <td style={item[key] > 0 ? { color: "red" } : {}}>{item[key]}</td>
        );
      }
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
              className={classnames({ active: item.mes == MesSeleccionado })}
              onClick={() => {
                setMesSeleccionado(item.mes);
              }}
            >
              {mesesShort[item.mes - 1]}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <Nav tabs>
        {Componentes.map((item, i) => (
          <NavItem key={i}>
            <NavLink
              className={classnames({
                active: item.id_componente == ComponenteSeleccionado,
              })}
              onClick={() => setComponenteSeleccionado(item.id_componente)}
            >
              C-{item.numero}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>item</th>
              <th>descripcion</th>
              {renderMesesCabezera()}
            </tr>
          </thead>
          <tbody>
            {Avances.map((item, i) => (
              <tr key={i} style={{ whiteSpace: "nowrap" }}>
                <td>{item.item}</td>
                <td>{item.descripcion}</td>
                {renderMesesBody(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiEyeFill } from "react-icons/ri";
import {
  Button,
  Input,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Nav,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
import ProyectoData from "./ProyectoData";
import DatosEspecificos from "./DatosEspecificos";
import ResumenAvance from "./ResumenAvance";
import Plazos from "./Plazos";
import Responsables from "./Responsables";
import AvanceFisico from "./AvanceFisico";
import Presupuesto from "./Presupuesto";
import PresupuestoAnalitico from "./PresupuestoAnalitico";
import ProblemasObra from "./ProblemasObra";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";

export default ({ recargar }) => {
  useEffect(() => {
    cargarObras();
  }, []);
  const [ListInterfaces, setListInterfaces] = useState([
    {
      nombre: "DATOS ESPECÍFICOS",
      activado: true,
      interfaz: DatosEspecificos,
    },

    {
      nombre: "ACUMULADO " + new Date().getFullYear(),
      activado: true,
      interfaz: ResumenAvance,
    },
    { nombre: "PLAZOS", activado: true, interfaz: Plazos },

    { nombre: "RESPONSABLES", activado: true, interfaz: Responsables },
    {
      nombre: "RES. AVANCE FÍSICO",
      activado: true,
      interfaz: AvanceFisico,
    },
    { nombre: "PRESUPUESTO", activado: true, interfaz: Presupuesto },
    {
      nombre: "PROBLEMAS",
      activado: true,
      interfaz: ProblemasObra,
    },
    // {
    //   nombre: "ANALÍTICO",
    //   activado: true,
    //   interfaz: PresupuestoAnalitico,
    // },
  ]);
  const [Obras, setObras] = useState([]);
  async function cargarObras() {
    var res = await axios.get(`${UrlServer}/v1/obras/resumen`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
      },
    });
    setObras(res.data);
  }
  //seleccionar anyo
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(2021);
  const [dropdownOpen, setdropdownOpen] = useState(false);
  function toggle() {
    setdropdownOpen(!dropdownOpen);
  }
  //guardado
  const [MensajeGuardando, setMensajeGuardando] = useState(false);
  return (
    <div>
      {MensajeGuardando ? "Guardando..." : "Guardado"}
      <Nav tabs>
        <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle nav caret>
            {AnyoSeleccionado == 0 ? "--" : AnyoSeleccionado}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => setAnyoSeleccionado(2020)}>
              2020
            </DropdownItem>
            <DropdownItem onClick={() => setAnyoSeleccionado(2021)}>
              2021
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <OrderListInterfaces
          ListInterfaces={ListInterfaces}
          setListInterfaces={setListInterfaces}
        />
      </Nav>
      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          className="table-bordered reporteGeneral-table text-center"
          style={{ background: "#242526", borderColor: "#242526" }}
        >
          <tbody>
            <tr className=" text-center">
              <th className="reporteGeneral-cabezeraSticky">PROYECTO</th>
              {ListInterfaces.map(
                (item, i) =>
                  item.activado && (
                    <th key={i} className="reporteGeneral-cabezera">
                      {item.nombre}
                    </th>
                  )
              )}
            </tr>
            {Obras.map((item, i) => (
              <tr key={i}>
                <td className="reporteGeneral-bodySticky  ">
                  <ProyectoData
                    numero={i + 1}
                    data={item}
                    AnyoSeleccionado={AnyoSeleccionado}
                    key={AnyoSeleccionado}
                    setMensajeGuardando={setMensajeGuardando}
                  />
                </td>
                {ListInterfaces.map(
                  (item2, i2) =>
                    item2.activado && (
                      <td key={i2} className="reporteGeneral-body">
                        {
                          <item2.interfaz
                            data={item}
                            AnyoSeleccionado={AnyoSeleccionado}
                            key={AnyoSeleccionado}
                            recargar={recargar}
                            setMensajeGuardando={setMensajeGuardando}
                          />
                        }
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
function OrderListInterfaces({ ListInterfaces, setListInterfaces }) {
  const [ModoEdicion, setModoEdicion] = useState(false);
  const [HoverItem, setHoverItem] = useState(-1);
  const [, setDraggedItem] = useState(-1);
  function array_move(arr, old_index, new_index) {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }
  //mostrar todos
  function mostrarTodos() {
    var clone = [...ListInterfaces];
    for (let i = 0; i < ListInterfaces.length; i++) {
      const item = ListInterfaces[i];
      item.activado = true;
    }
    setListInterfaces(clone);
  }
  //ocultarTodos
  function ocultarTodos() {
    var clone = [...ListInterfaces];
    for (let i = 0; i < ListInterfaces.length; i++) {
      const item = ListInterfaces[i];
      item.activado = false;
    }
    setListInterfaces(clone);
  }
  return (
    <div>
      {!ModoEdicion ? (
        <Button color="info" onClick={() => setModoEdicion(true)}>
          Editar Modulos
        </Button>
      ) : (
        <Button color="info" onClick={() => setModoEdicion(false)}>
          Ocultar edicion
        </Button>
      )}
      {ModoEdicion && (
        <Button onClick={() => mostrarTodos()}>Mostrar todos</Button>
      )}
      {ModoEdicion && (
        <Button onClick={() => ocultarTodos()}>Ocultar todos</Button>
      )}
      {ModoEdicion && (
        <div>
          {ListInterfaces.map((item, i) => (
            <span
              key={i}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("index", i);
                setDraggedItem(i);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setHoverItem(i);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setHoverItem(-1);
              }}
              onDrop={(e) => {
                e.preventDefault();
                var indexOrigen = e.dataTransfer.getData("index");
                var tempArray = [...ListInterfaces];
                if (indexOrigen < i) {
                  i--;
                }
                array_move(tempArray, indexOrigen, i);
                setListInterfaces(tempArray);
                setHoverItem(-1);
              }}
              style={{
                marginLeft: HoverItem == i ? "10px" : "0px",
              }}
            >
              <Button color={item.activado ? "success" : "danger"}>
                {item.nombre}{" "}
                <span
                  onClick={() => {
                    var temp = [...ListInterfaces];
                    temp[i].activado = !temp[i].activado;
                    setListInterfaces(temp);
                  }}
                >
                  {item.activado ? (
                    <RiEyeFill size="15" />
                  ) : (
                    <RiEyeOffFill size="15" />
                  )}
                </span>
              </Button>
            </span>
          ))}
          <span
            onDragOver={(e) => {
              e.preventDefault();
              setHoverItem(ListInterfaces.length);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setHoverItem(-1);
            }}
            onDrop={(e) => {
              e.preventDefault();
              var indexOrigen = e.dataTransfer.getData("index");
              var tempArray = [...ListInterfaces];
              var i = ListInterfaces.length;
              if (indexOrigen < i) {
                i--;
              }
              array_move(tempArray, indexOrigen, i);
              setListInterfaces(tempArray);
              setHoverItem(-1);
            }}
          >
            ---
          </span>
        </div>
      )}
    </div>
  );
}

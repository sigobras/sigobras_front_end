import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiEyeFill } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
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

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";

export default () => {
  useEffect(() => {
    cargarObras();
  }, []);
  const [ListInterfaces, setListInterfaces] = useState([
    {
      nombre: "DatosEspecificos",
      activado: true,
      interfaz: DatosEspecificos,
    },
    { nombre: "ResumenAvance", activado: true, interfaz: ResumenAvance },
    { nombre: "Plazos", activado: true, interfaz: Plazos },

    { nombre: "Responsables", activado: true, interfaz: Responsables },
    {
      nombre: "Resumen Avance Fisico",
      activado: true,
      interfaz: AvanceFisico,
    },
    { nombre: "Presupuesto", activado: true, interfaz: Presupuesto },
    {
      nombre: "Presupuesto Analítico Aprobado y Ejecutado de Obra",
      activado: true,
      interfaz: PresupuestoAnalitico,
    },
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
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(2020);
  return (
    <div>
      <OrderListInterfaces
        ListInterfaces={ListInterfaces}
        setListInterfaces={setListInterfaces}
      />
      <Input
        type="select"
        onChange={(e) => setAnyoSeleccionado(e.target.value)}
        value={AnyoSeleccionado}
      >
        <option>2020</option>
        <option>2021</option>
      </Input>
      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table className="table table-bordered table-light reporteGeneral-table">
          <tbody>
            <tr className=" text-center">
              <th className="reporteGeneral-cabezeraSticky">Proyecto</th>
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
  const [HoverItem, setHoverItem] = useState(-1);
  const [, setDraggedItem] = useState(-1);
  function array_move(arr, old_index, new_index) {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }
  return (
    <div>
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
            <Button>
              {item.nombre}{" "}
              <span
                onClick={() => {
                  var temp = [...ListInterfaces];
                  temp[i].activado = !temp[i].activado;
                  setListInterfaces(temp);
                }}
              >
                {item.activado ? <RiEyeFill /> : <RiEyeOffFill />}
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
    </div>
  );
}

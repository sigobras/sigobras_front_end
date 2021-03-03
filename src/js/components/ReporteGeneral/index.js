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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
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
import InformesInfobras from "./InformesInfobras";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";

export default ({ recargar }) => {
  useEffect(() => {
    cargarListOrders();
    cargarObras();
  }, []);
  const interfaces = [
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
    {
      nombre: "INFORMES MENSUALES",
      activado: true,
      interfaz: InformesInfobras,
    },
    // {
    //   nombre: "ANALÍTICO",
    //   activado: true,
    //   interfaz: PresupuestoAnalitico,
    // },
  ];
  const [ListInterfaces, setListInterfaces] = useState(interfaces);
  const [ListInterfacesDefecto, setListInterfacesDefecto] = useState(
    interfaces
  );
  const [ListOrders, setListOrders] = useState([]);
  async function cargarListOrders() {
    try {
      var res = await axios.get(`${UrlServer}/v1/reporteGeneral/interfaces`, {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
        },
      });
      if (res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i];
          item.orden = JSON.parse(res.data[i].configuracion);
        }
        setListOrders(res.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  const [ListOrdersIndex, setListOrdersIndex] = useState("");
  async function cargarListOrdersIndex() {
    var res = await axios.get(
      `${UrlServer}/v1/reporteGeneral/interfaces/seleccion`,
      {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
        },
      }
    );
    if (res.data) {
      setListOrdersIndex(res.data.seleccion);
    }
  }
  //ordenar interfaces
  function ordernarInterfaces() {
    var newOrder = [];
    var listIndexUsados = [];
    var indexCalculado = ListOrders.findIndex(
      (item, i) => ListOrdersIndex == item.id
    );
    var Order = ListOrders[indexCalculado].orden;
    for (let index = 0; index < Order.length; index++) {
      const element = Order[index];
      var newItem = ListInterfacesDefecto[element.posicion];
      newItem.activado = element.activado;
      newOrder.push(newItem);
      listIndexUsados.push(element.posicion);
    }
    for (let index = 0; index < ListInterfacesDefecto.length; index++) {
      const element = ListInterfacesDefecto[index];
      if (!listIndexUsados.includes(index)) {
        newOrder.push(ListInterfacesDefecto[index]);
      }
    }
    setListInterfaces(newOrder);
  }

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
  const [AnyosList, setAnyosList] = useState(() => {
    var temp = [];
    for (let index = 2010; index <= 2021; index++) {
      temp.push(index);
    }
    return temp;
  });

  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(2021);
  const [dropdownOpen, setdropdownOpen] = useState(false);
  function toggle() {
    setdropdownOpen(!dropdownOpen);
  }
  //guardado
  const [MensajeGuardando, setMensajeGuardando] = useState(false);
  //menu
  function calcularNuevoOrden() {
    var temp = [];
    for (let index = 0; index < ListInterfaces.length; index++) {
      const element = ListInterfaces[index];
      var indexFound = ListInterfacesDefecto.findIndex(
        (item, i) => item.nombre == element.nombre
      );
      temp.push({
        posicion: indexFound,
        activado: element.activado,
      });
    }
    return temp;
  }
  async function actualizarOrdenInterfaces() {
    try {
      var indexCalculado = ListOrders.findIndex(
        (item, i) => ListOrdersIndex == item.id
      );
      var res = await axios.put(`${UrlServer}/v1/reporteGeneral/interfaces`, [
        {
          nombre: ListOrders[indexCalculado].nombre,
          configuracion: JSON.stringify(calcularNuevoOrden()),
          accesos_id_acceso: sessionStorage.getItem("idacceso"),
        },
      ]);
      cargarListOrders();
      alert("Registro exitoso");
    } catch (error) {
      alert("Ocurrio un error");
      console.log(error);
    }
  }
  async function guardarSeleccion() {
    try {
      var res = await axios.put(
        `${UrlServer}/v1/reporteGeneral/interfaces/seleccion`,
        [
          {
            seleccion: ListOrdersIndex,
            accesos_id_acceso: sessionStorage.getItem("idacceso"),
          },
        ]
      );
    } catch (error) {
      alert("Ocurrio un error");
    }
  }
  //activar edicion de menus
  const [ModoEdicion, setModoEdicion] = useState(false);
  //recarga de datos
  async function recarga(id) {
    await cargarListOrders();
    if (id) {
      setListOrdersIndex(id);
    }
  }
  useEffect(() => {
    if (ListOrders.length > 0) {
      cargarListOrdersIndex();
    }
  }, [ListOrders]);
  useEffect(() => {
    console.log("useefecct", ListOrders, ListOrdersIndex);
    if (ListOrders.length > 0) {
      if (ListOrdersIndex != -1) {
        ordernarInterfaces();
      }
    }
  }, [ListOrdersIndex]);
  return (
    <div>
      <span className="d-flex justify-content-between">
        <span className="d-flex">
          <Nav
            tabs
            style={{ paddingTop: "0px", margin: "0px", height: "29px" }}
          >
            <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle nav caret>
                {AnyoSeleccionado == 0 ? "--" : AnyoSeleccionado}
              </DropdownToggle>

              <DropdownMenu>
                {AnyosList.map((item, i) => (
                  <DropdownItem
                    onClick={() => setAnyoSeleccionado(item)}
                    key={i}
                  >
                    {item}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Nav>
          <span>
            {!ModoEdicion ? (
              <Button
                color="info"
                onClick={() => setModoEdicion(true)}
                style={{ height: "25px", width: "110px", fontSize: "10px" }}
              >
                Editar Modulos
              </Button>
            ) : (
              <Button
                color="info"
                onClick={() => setModoEdicion(false)}
                style={{ height: "25px", width: "110px", fontSize: "10px" }}
              >
                Ocultar edicion
              </Button>
            )}{" "}
          </span>{" "}
          <span style={{ paddingLeft: "10px" }}>
            {" "}
            {MensajeGuardando ? "  Guardando..." : "  Guardado"}
          </span>
        </span>
        <span className="d-flex">
          {ListOrders.length > 0 && (
            <Input
              type="select"
              onChange={(e) => {
                setListOrdersIndex(e.target.value);
              }}
              value={ListOrdersIndex}
              style={{
                background: "#171819",
                border: "#171819",
                color: "white",
                height: "25px",
                width: "150px",
                fontSize: "10px",
              }}
            >
              <option disabled hidden value="">
                SELECCIONE
              </option>
              {ListOrders.map((item, i) => (
                <option value={item.id} key={i}>
                  {item.nombre}
                </option>
              ))}
            </Input>
          )}
          {ListOrders.length > 0 && (
            <Button
              onClick={() => actualizarOrdenInterfaces()}
              style={{ height: "25px", width: "110px", fontSize: "10px" }}
              color="danger"
            >
              Guardando cambios
            </Button>
          )}
          <NuevoMenu
            calcularNuevoOrden={calcularNuevoOrden}
            recargar={recarga}
          />
        </span>
      </span>
      {ModoEdicion && (
        <div>
          <OrderListInterfaces
            ListInterfaces={ListInterfaces}
            setListInterfaces={setListInterfaces}
          />
        </div>
      )}

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
  const [HoverItem, setHoverItem] = useState(-1);
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
      <span>
        <Button onClick={() => mostrarTodos()} color="success">
          Mostrar
        </Button>
      </span>
      <span>
        <Button onClick={() => ocultarTodos()} color="danger">
          Ocultar
        </Button>
      </span>
      {ListInterfaces.map((item, i) => (
        <span
          key={i}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("index", i);
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
          <Button
            color={item.activado ? "info" : "warning"}
            style={{ height: "25px", fontSize: "10px" }}
          >
            {item.nombre}
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
  );
}
function NuevoMenu({ calcularNuevoOrden, recargar }) {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      setInputValue("");
    }
    setModal(!modal);
  };
  async function nuevoOrdenInterfaces() {
    try {
      var res = await axios.put(`${UrlServer}/v1/reporteGeneral/interfaces`, [
        {
          nombre: InputValue,
          configuracion: JSON.stringify(calcularNuevoOrden()),
          accesos_id_acceso: sessionStorage.getItem("idacceso"),
        },
      ]);
      var id = res.data.id;
      recargar(id);
      setModal(false);
      alert("Registro exitoso");
    } catch (error) {
      alert("Ocurrio un error");
    }
  }
  const [InputValue, setInputValue] = useState("");
  return (
    <span>
      <Button
        color="success"
        onClick={toggle}
        style={{ height: "25px", width: "110px", fontSize: "10px" }}
      >
        Nuevo menu
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Creacion de un nuevo menu personalizado
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Nombre del nuevo menu</Label>
            <Input
              value={InputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => nuevoOrdenInterfaces()}>
            Guardar
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
}

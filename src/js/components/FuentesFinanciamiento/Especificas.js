import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ref,
} from "react";
import {
  Button,
  Input,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Nav,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import axios from "axios";
import {
  FaUpload,
  FaFileAlt,
  FaPlusCircle,
  FaEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import { MdCancel, MdSave } from "react-icons/md";
import AsyncSelect from "react-select/async";

import CustomInput from "../../libs/CustomInput";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, formatMoney, mesesShort } from "../Utils/Funciones";
import AvanceMensualDetalle from "./AvanceMensualDetalle/index";
export default forwardRef(
  (
    {
      Id_fuente,
      Anyo,
      Permisos,
      ModoEdicion,
      CantidadEspecificas,
      setCantidadEspecificas,
      CantidadPim,
      setCantidadPim,
    },
    ref
  ) => {
    useEffect(() => {
      cargarEspecificas();
      cargarVariacionesPim();
      cargarCostos();
      cargarCostosList();
      cargarTipoComprobantes();
    }, []);

    useImperativeHandle(ref, () => ({
      agregarEspecifica() {
        agregarEspecifica();
      },
      agregarVariacionPim() {
        agregarVariacionPim();
      },
    }));
    //especificias
    const [Especificas, setEspecificas] = useState([]);
    async function cargarEspecificas() {
      var res = await axios.get(
        `${UrlServer}/v1/fuentesFinancieamiento/especificas`,
        {
          params: {
            id: Id_fuente,
            anyo: Anyo,
            id_ficha: sessionStorage.getItem("idobra"),
          },
        }
      );
      console.log("cargarEspecificas", res.data);
      if (Array.isArray(res.data)) {
        setEspecificas(res.data);
        var clone = [...CantidadEspecificas];
        clone[Id_fuente] = res.data.length;
        setCantidadEspecificas(clone);
      }
    }
    async function agregarEspecifica() {
      var maxId = 0;
      Especificas.forEach((item) => {
        if (item.id_clasificador > maxId) {
          maxId = item.id_clasificador;
        }
      });
      var res = await axios.get(
        `${UrlServer}/v1/clasificadorPresupuestario/analitico/predecir`,
        {
          params: {
            id: maxId,
            id_ficha: sessionStorage.getItem("idobra"),
          },
        }
      );

      var nextId = res.data ? res.data.id : maxId;
      var res = await axios.post(
        `${UrlServer}/v1/fuentesFinancieamiento/especificas`,
        {
          fuentesfinanciamiento_asignados_id: Id_fuente,
          clasificadores_presupuestarios_id: nextId,
          pia: "0",
        }
      );
      cargarEspecificas();
    }
    async function eliminarEspecifica(id) {
      if (
        confirm(
          "Esta seguro de eliminar,esto conllevara a la perdida de todo el avance mensual?"
        )
      ) {
        var res = await axios.delete(
          `${UrlServer}/v1/fuentesFinancieamiento/especificas/${id}`
        );
      }

      cargarEspecificas();
    }
    async function actualizarEspecifica(clasificadores_presupuestarios_id, id) {
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento/especificas/${id}`,
        {
          clasificadores_presupuestarios_id,
        }
      );
      cargarEspecificas();
      setEstadoEdicion("");
    }
    function renderEspecificasContenido(item) {
      var tempRender = [];
      var acumulado = 0;
      var acumuladoProgramado = 0;
      var ultimoPresupuesto = item.pia;
      //render variaciones
      for (let i = 0; i < VariacionesPim.length; i++) {
        const element = VariacionesPim[i];
        ultimoPresupuesto = item["variacionPim_" + element.id];
        tempRender.push(
          ModoEdicion &&
            Permisos["fuentefinanciamiento_editar_pimmonto"] == 1 ? (
            <td style={{ padding: "0px" }}>
              <CustomInput
                key={item["variacionPim_" + element.id]}
                value={Redondea(
                  item["variacionPim_" + element.id],
                  2,
                  false,
                  ""
                )}
                onBlur={(value) =>
                  guardarVariacionesPimMonto(value, item.id, element.id)
                }
              />
            </td>
          ) : (
            <td style={{ textAlign: "right" }}>
              {Redondea(item["variacionPim_" + element.id], 2, false, "")}
            </td>
          )
        );
      }
      //render meses
      var acumulado = 0;
      for (let i = 1; i <= 12; i++) {
        var totalMes = 0;
        var totalProgramadoMes = 0;
        for (let j = 0; j < Costos.length; j++) {
          const Costo = Costos[j];
          if (Costo.id_analitico == item.id) {
            totalMes += Costo["avanceMensual_" + i];
            totalProgramadoMes += Costo["programadoMensual_" + i];
          }
        }
        acumulado += totalMes;
        acumuladoProgramado += totalProgramadoMes;
        tempRender.push(<th>{Redondea(totalMes)}</th>);
        tempRender.push(<th>{Redondea(totalProgramadoMes)}</th>);
      }
      tempRender.splice(
        VariacionesPim.length,
        0,
        <th>{Redondea(acumulado)}</th>
      );
      tempRender.splice(
        VariacionesPim.length + 1,
        0,
        <th>{Redondea(ultimoPresupuesto - acumulado)}</th>
      );
      tempRender.splice(
        VariacionesPim.length + 2,
        0,
        <th>{Redondea(acumuladoProgramado)}</th>
      );
      tempRender.splice(
        VariacionesPim.length + 3,
        0,
        <th>{Redondea(ultimoPresupuesto - acumuladoProgramado)}</th>
      );
      return tempRender;
    }
    //costoslist
    const [CostosList, setCostosList] = useState([]);
    async function cargarCostosList() {
      var res = await axios.get(`${UrlServer}/v1/analiticoCostos/analitico`, {
        params: {
          id_ficha: sessionStorage.getItem("idobra"),
        },
      });
      setCostosList(res.data);
    }
    //costos
    const [Costos, setCostos] = useState([]);
    async function cargarCostos() {
      var res = await axios.get(
        `${UrlServer}/v1/fuentesFinancieamiento/costos`,
        {
          params: {
            id: Id_fuente,
            anyo: Anyo,
          },
        }
      );
      setCostos(res.data);
    }
    async function agregarCosto(fuentesfinanciamiento_analitico_id) {
      var maxId = 0;
      Costos.forEach((item) => {
        if (
          fuentesfinanciamiento_analitico_id == item.id_analitico &&
          item.id > maxId
        ) {
          maxId = item.id_costo;
        }
      });
      var res = await axios.get(`${UrlServer}/v1/analiticoCostos/predecir`, {
        params: {
          id: maxId,
          id_ficha: sessionStorage.getItem("idobra"),
        },
      });

      var nextId = res.data ? res.data.id : maxId;
      var res = await axios.post(
        `${UrlServer}/v1/fuentesFinancieamiento/costos`,
        {
          fuentesfinanciamiento_analitico_id,
          presupuestoanalitico_costos_id: nextId,
        }
      );
      cargarCostos();
    }
    async function eliminarCosto(id) {
      if (confirm("Esta seguro de eliminar el titulo?")) {
        var res = await axios.delete(
          `${UrlServer}/v1/fuentesFinancieamiento/costos/${id}`
        );
        cargarCostos();
      }
    }
    async function actualizarCosto(
      presupuestoanalitico_costos_id,
      fuentesfinanciamiento_analitico_id,
      id
    ) {
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento/costos/`,
        {
          id,
          fuentesfinanciamiento_analitico_id,
          presupuestoanalitico_costos_id,
        }
      );
      setEstadoEdicion("");
      cargarCostos();
    }
    async function guardarAvanceMensual(
      monto,
      fuentesfinanciamiento_costoasignado_id,
      mes
    ) {
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento/avanceMensual`,
        {
          fuentesfinanciamiento_costoasignado_id,
          anyo: Anyo,
          mes,
          monto: monto || 0,
        }
      );
      cargarCostos();
    }
    async function guardarProgramadoMensual(
      programado,
      fuentesfinanciamiento_costoasignado_id,
      mes
    ) {
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento/avanceMensual`,
        {
          fuentesfinanciamiento_costoasignado_id,
          anyo: Anyo,
          mes,
          programado: programado || 0,
        }
      );
      cargarCostos();
    }
    //variaciones
    const [VariacionesPim, setVariacionesPim] = useState([]);
    async function cargarVariacionesPim() {
      var res = await axios.get(
        `${UrlServer}/v1/fuentesFinancieamiento/variacionesPim`,
        {
          params: {
            anyo: Anyo,
            id: Id_fuente,
          },
        }
      );
      setVariacionesPim(res.data);
      var clone = [...CantidadPim];
      clone[Id_fuente] = res.data.length;
      setCantidadPim(clone);
    }
    async function agregarVariacionPim() {
      try {
        var nombreGenerado = "PIM " + (VariacionesPim.length + 1);
        var res = await axios.post(
          `${UrlServer}/v1/fuentesFinancieamiento/variacionesPim`,
          {
            nombre: nombreGenerado,
            fuentesfinanciamiento_asignados_id: Id_fuente,
            anyo: Anyo,
          }
        );
        if (VariacionesPim.length) {
          var ultimoPimId = VariacionesPim[VariacionesPim.length - 1].id;
        }
        //se ingresa especificas
        var variacionPimMontos = [];
        for (let index = 0; index < Especificas.length; index++) {
          const element = Especificas[index];
          variacionPimMontos.push({
            fuentesfinanciamiento_analitico_id: element.id,
            variacionespim_id: res.data.id,
            monto:
              VariacionesPim.length > 0
                ? element["variacionPim_" + ultimoPimId]
                : element["pia"],
          });
        }
        var res2 = await axios.put(
          `${UrlServer}/v1/fuentesFinancieamiento/variacionesPimMonto`,
          variacionPimMontos
        );
        cargarVariacionesPim();
        cargarEspecificas();
      } catch (error) {
        alert("Ocurrio un error");
        console.log("ERROR ", error);
      }
    }
    async function actualizarVariacionPim(nombre, id) {
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento/variacionesPim/${id}`,
        {
          nombre,
        }
      );
      cargarVariacionesPim();
      cargarEspecificas();
    }
    async function eliminarVariacionPim(id) {
      if (confirm("Esta seguro de eliminar esta dato?")) {
        var res = await axios.delete(
          `${UrlServer}/v1/fuentesFinancieamiento/variacionesPim/${id}`
        );
        cargarVariacionesPim();
        cargarEspecificas();
      }
    }
    async function guardarVariacionesPimMonto(
      monto,
      fuentesfinanciamiento_analitico_id,
      variacionespim_id
    ) {
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento/variacionesPimMonto`,
        {
          fuentesfinanciamiento_analitico_id,
          variacionespim_id,
          monto: monto || 0,
        }
      );
      cargarEspecificas();
    }
    const [EdicionVariacion, setEdicionVariacion] = useState("");
    const [EdicionVariacionNombre, setEdicionVariacionNombre] = useState("");
    async function guardarVariacionMonto(pia, id) {
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento/especificas/${id}`,
        {
          pia: pia || "0",
        }
      );
      cargarEspecificas();
    }
    function renderVariacionesTitulo() {
      var tempRender = [];
      for (let i = 0; i < VariacionesPim.length; i++) {
        const element = VariacionesPim[i];
        tempRender.push(
          <th
            style={{
              position: "relative",
              whiteSpace: "nowrap",
            }}
          >
            <span
              onClick={() => {
                if (EdicionVariacion == element.id) {
                  setEdicionVariacion("");
                } else {
                  setEdicionVariacion(element.id);
                }
              }}
              style={{ cursor: "pointer", padding: "0px", marginRight: "20px" }}
            >
              {ModoEdicion &&
              Permisos["fuentefinanciamiento_editar_pim"] == 1 &&
              EdicionVariacionNombre == element.id ? (
                <CustomInput
                  value={element.nombre}
                  onBlur={(value) => {
                    actualizarVariacionPim(value, element.id);
                    setEdicionVariacionNombre("");
                  }}
                  style={{ color: "white" }}
                  type="text"
                />
              ) : (
                element.nombre
              )}
            </span>

            {EdicionVariacion == element.id && (
              <div>
                {EdicionVariacionNombre != element.id && (
                  <>
                    {ModoEdicion &&
                      Permisos["fuentefinanciamiento_editar_pim"] == 1 && (
                        <FaEdit
                          onClick={() => {
                            if (confirm("Desea editar el nombre del PIM?")) {
                              setEdicionVariacionNombre(element.id);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    {ModoEdicion &&
                      Permisos["fuentefinanciamiento_eliminar_pim"] == 1 && (
                        <FaRegTrashAlt
                          onClick={() => eliminarVariacionPim(element.id)}
                          style={{
                            cursor: "pointer",
                            marginLeft: "4px",
                            marginRight: "4px",
                          }}
                        />
                      )}
                  </>
                )}
              </div>
            )}
            {ModoEdicion &&
              Permisos["fuentefinanciamiento_agregar_pim"] == 1 &&
              EdicionVariacionNombre != element.id &&
              i == VariacionesPim.length - 1 && (
                <span
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "0px",
                  }}
                >
                  <FaPlusCircle
                    onClick={() => agregarVariacionPim()}
                    style={{
                      cursor: "pointer",
                      marginLeft: "4px",
                      marginRight: "4px",
                    }}
                    color="#0080ff"
                    size="15"
                  />
                </span>
              )}
          </th>
        );
      }
      return tempRender;
    }
    function renderMesesTitulo() {
      var tempRender = [];
      for (let i = 1; i <= 12; i++) {
        tempRender.push(
          <th style={{ whiteSpace: "nowrap" }}>
            {mesesShort[i - 1] + " - " + Anyo}
          </th>
        );
        tempRender.push(
          <th style={{ whiteSpace: "nowrap", background: "#47484a" }}>
            {"P/" + mesesShort[i - 1] + " - " + Anyo}
          </th>
        );
      }
      return tempRender;
    }
    //render

    var refCostosArray = [];
    function onKeyDown(event, item, propertyIndex, tipo) {
      var properties = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      if (
        event.keyCode === 13 ||
        event.keyCode === 40 ||
        event.keyCode === 38 ||
        event.keyCode === 37 ||
        event.keyCode === 39
      ) {
        // izquierda
        if (event.keyCode === 37) {
          if (propertyIndex != 1 || tipo != "p") {
            var col = tipo == "n" ? propertyIndex : propertyIndex - 1;
            refCostosArray[item.id + "_" + col + tipo].focus();
          }
        }
        // arriba
        if (event.keyCode === 38) {
          var index = Costos.findIndex((item2) => item2.id == item.id);
          if (index) {
            refCostosArray[
              Costos[index - 1].id +
                "_" +
                propertyIndex +
                (tipo == "p" ? "n" : "p")
            ].focus();
          }
        }
        //derecha
        if (event.keyCode === 39) {
          if (propertyIndex != 12 || tipo != "n") {
            var col = tipo == "p" ? propertyIndex : propertyIndex + 1;
            refCostosArray[item.id + "_" + col + tipo].focus();
          }
        }
        // abajo
        if (event.keyCode === 13 || event.keyCode === 40) {
          var index = Costos.findIndex((item2) => item2.id == item.id);
          if (index < Costos.length - 1) {
            refCostosArray[
              Costos[index + 1].id +
                "_" +
                propertyIndex +
                (tipo == "p" ? "n" : "p")
            ].focus();
          }
        }
      }
    }
    function renderCostosData(item, especifica) {
      var tempRender = [];
      var acumulado = 0;
      var acumuladoProgramado = 0;
      //render meses
      for (let i = 1; i <= 12; i++) {
        acumulado += item["avanceMensual_" + i];
        acumuladoProgramado += item["programadoMensual_" + i];
        tempRender.push(
          ModoEdicion &&
            Permisos["fuentefinanciamiento_editar_avancemensual"] == 1 ? (
            <td style={{ padding: "0px" }}>
              <div className="d-flex">
                <CustomInput
                  value={Redondea(item["avanceMensual_" + i], 2, false, "")}
                  onBlur={(value) => guardarAvanceMensual(value, item.id, i)}
                  innerRef={(ref) => {
                    refCostosArray[item.id + "_" + i + "n"] = ref;
                  }}
                  onKeyDown={(e) => {
                    onKeyDown(e, item, i, "p");
                  }}
                  style={{ height: "23px", padding: "0px 2px" }}
                />
                <span style={{ background: "#8effa938" }}>
                  {item["idAvanceMensual_" + i] != 0 && (
                    <AvanceMensualDetalle
                      especifica={especifica}
                      id_avancemensual={item["idAvanceMensual_" + i]}
                      ModoEdicion={ModoEdicion}
                      TipoComprobantes={TipoComprobantes}
                      avance={item["avanceMensual_" + i]}
                      Permisos={Permisos}
                    />
                  )}
                </span>
              </div>
            </td>
          ) : (
            <td style={{ textAlign: "right" }}>
              {Redondea(item["avanceMensual_" + i], 2, false, "")}
              <span style={{ margin: "2px" }}>
                {item["idAvanceMensual_" + i] != 0 && (
                  <AvanceMensualDetalle
                    especifica={especifica}
                    id_avancemensual={item["idAvanceMensual_" + i]}
                    ModoEdicion={ModoEdicion}
                    TipoComprobantes={TipoComprobantes}
                    avance={item["avanceMensual_" + i]}
                    Permisos={Permisos}
                  />
                )}
              </span>
            </td>
          )
        );

        tempRender.push(
          ModoEdicion &&
            Permisos["fuentefinanciamiento_editar_programadomensual"] == 1 ? (
            <td style={{ padding: "0px" }}>
              <CustomInput
                value={Redondea(item["programadoMensual_" + i], 2, false, "")}
                onBlur={(value) => guardarProgramadoMensual(value, item.id, i)}
                innerRef={(ref) => {
                  refCostosArray[item.id + "_" + i + "p"] = ref;
                }}
                onKeyDown={(e) => {
                  onKeyDown(e, item, i, "n");
                }}
                style={{ height: "23px" }}
              />
            </td>
          ) : (
            <td style={{ textAlign: "right" }}>
              {Redondea(item["programadoMensual_" + i], 2, false, "")}
            </td>
          )
        );
      }
      tempRender.splice(
        0,
        0,
        <td style={{ textAlign: "right" }}>{Redondea(acumulado)}</td>
      );
      tempRender.splice(1, 0, <td></td>);
      tempRender.splice(2, 0, <td>{Redondea(acumuladoProgramado)}</td>);
      tempRender.splice(3, 0, <td></td>);

      return tempRender;
    }
    function renderTotales() {
      var tempRender = [];
      var acumulado = 0;
      var acumuladoProgramado = 0;
      var ultimoPresupuesto = 0;
      //pia
      var piaTotal = 0;
      for (let i = 0; i < Especificas.length; i++) {
        const item = Especificas[i];
        piaTotal += item.pia;
      }
      ultimoPresupuesto = piaTotal;
      tempRender.push(
        <th
          style={{
            textAlign: "right",
            background: "#3a3b3c",
            color: "#cecece",
          }}
        >
          {Redondea(piaTotal)}
        </th>
      );
      //variaciones
      for (let i = 0; i < VariacionesPim.length; i++) {
        const variacion = VariacionesPim[i];
        var pim = 0;
        for (let i = 0; i < Especificas.length; i++) {
          const item = Especificas[i];
          pim += item["variacionPim_" + variacion.id];
        }
        tempRender.push(
          <th
            style={{
              textAlign: "right",
              background: "#3a3b3c",
              color: "#cecece",
            }}
          >
            {Redondea(pim)}
          </th>
        );
        ultimoPresupuesto = pim;
      }
      //meses
      for (let i = 1; i <= 12; i++) {
        var totalMes = 0;
        var totalProgramadoMes = 0;
        for (let j = 0; j < Costos.length; j++) {
          const Costo = Costos[j];
          totalMes += Costo["avanceMensual_" + i];
          totalProgramadoMes += Costo["programadoMensual_" + i];
        }
        acumulado += totalMes;
        acumuladoProgramado += totalProgramadoMes;
        tempRender.push(
          <th
            style={{
              textAlign: "right",
              background: "#3a3b3c",
              color: "#cecece",
            }}
          >
            {Redondea(totalMes)}
          </th>
        );
        tempRender.push(
          <th
            style={{
              textAlign: "right",
              background: "#3a3b3c",
              color: "#cecece",
            }}
          >
            {Redondea(totalProgramadoMes)}
          </th>
        );
      }
      tempRender.unshift(
        <th
          style={{
            textAlign: "right",
            background: "#3a3b3c",
            color: "#cecece",
          }}
          colSpan="2"
        >
          TOTAL
        </th>
      );

      tempRender.splice(
        VariacionesPim.length + 2,
        0,
        <th
          style={{
            textAlign: "right",
            background: "#3a3b3c",
            color: "#cecece",
          }}
        >
          {Redondea(acumulado)}
        </th>
      );
      tempRender.splice(
        VariacionesPim.length + 3,
        0,
        <th
          style={{
            textAlign: "right",
            background: "#3a3b3c",
            color: "#cecece",
          }}
        >
          {Redondea(ultimoPresupuesto - acumulado)}
        </th>
      );
      tempRender.splice(
        VariacionesPim.length + 4,
        0,
        <th
          style={{
            textAlign: "right",
            background: "#3a3b3c",
            color: "#cecece",
          }}
        >
          {Redondea(acumuladoProgramado)}
        </th>
      );
      tempRender.splice(
        VariacionesPim.length + 5,
        0,
        <th
          style={{
            textAlign: "right",
            background: "#3a3b3c",
            color: "#cecece",
          }}
        >
          {Redondea(ultimoPresupuesto - acumuladoProgramado)}
        </th>
      );
      return tempRender;
    }
    const [EstadoEdicion, setEstadoEdicion] = useState("");
    //tipos comprobantes
    const [TipoComprobantes, setTipoComprobantes] = useState([]);
    async function cargarTipoComprobantes() {
      var res = await axios.get(`${UrlServer}/v1/tiposcomprobantes`);
      setTipoComprobantes(res.data);
    }

    return (
      <div>
        {Especificas.length != 0 && (
          <table className="whiteThem-table">
            <thead>
              <tr>
                <th>ESPECÍFICA</th>
                <th style={{ position: "relative" }}>
                  DESCRIPCIÓN
                  {ModoEdicion &&
                    Permisos["fuentefinanciamiento_agregar_especifica"] ==
                      1 && (
                      <span
                        style={{
                          position: "absolute",

                          right: "0px",
                        }}
                      >
                        <FaPlusCircle
                          onClick={() => agregarEspecifica()}
                          style={{
                            cursor: "pointer",
                            marginLeft: "4px",
                            marginRight: "4px",
                          }}
                          color="orange"
                          size="15"
                        />
                      </span>
                    )}
                </th>
                <th>
                  PIA
                  {VariacionesPim.length == 0 && "/PIM"}
                </th>
                {renderVariacionesTitulo()}
                <th style={{ background: "orange", color: "black" }}>
                  DEVENGADO {Anyo}
                </th>
                <th style={{ background: "orange", color: "black" }}>
                  SALDO {Anyo}
                </th>
                <th>PROGRAMADO {Anyo}</th>
                <th>SALDO PROGRAMDO {Anyo}</th>
                {renderMesesTitulo()}
              </tr>
            </thead>
            <tbody>
              {Especificas.map((item, i) => (
                <>
                  <tr>
                    <th
                      style={{
                        cursor: "pointer",
                        zIndex:
                          EstadoEdicion != "especifica_" + item.id ? 1 : 2,
                      }}
                      colSpan={EstadoEdicion != "especifica_" + item.id ? 1 : 2}
                      className="whiteThem-table-sticky"
                    >
                      {EstadoEdicion != "especifica_" + item.id ? (
                        <span
                          onClick={() => {
                            if (
                              ModoEdicion &&
                              Permisos[
                                "fuentefinanciamiento_editar_especifica"
                              ] == 1
                            ) {
                              setEstadoEdicion("especifica_" + item.id);
                            }
                          }}
                        >
                          {item.clasificador}
                        </span>
                      ) : (
                        <span style={{ display: "flex" }}>
                          <CustomAsyncSelect
                            value={item}
                            guardar={(valor) =>
                              actualizarEspecifica(valor, item.id)
                            }
                          />
                          <MdCancel
                            onClick={() => setEstadoEdicion("")}
                            style={{ cursor: "pointer" }}
                            size={"20"}
                          />
                        </span>
                      )}
                    </th>
                    {EstadoEdicion != "especifica_" + item.id && (
                      <th className="whiteThem-table-sticky2">
                        <span style={{ paddingRight: "45px" }}>
                          {item.descripcion}
                        </span>

                        <span
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            right: "0px",
                          }}
                        >
                          {ModoEdicion &&
                            Permisos["fuentefinanciamiento_agregar_titulo"] ==
                              1 && (
                              <FaPlusCircle
                                onClick={() => agregarCosto(item.id)}
                                size="12"
                                color="#242526"
                                style={{
                                  marginLeft: "4px",
                                }}
                              />
                            )}
                          {ModoEdicion &&
                            Permisos[
                              "fuentefinanciamiento_eliminar_especifica"
                            ] == 1 && (
                              <FaRegTrashAlt
                                onClick={() => eliminarEspecifica(item.id)}
                                size="12"
                                style={{
                                  marginLeft: "4px",
                                  marginRight: "4px",
                                }}
                              />
                            )}
                        </span>
                      </th>
                    )}
                    {ModoEdicion &&
                    Permisos["fuentefinanciamiento_editar_piamonto"] == 1 ? (
                      <td style={{ padding: "0px" }}>
                        <CustomInput
                          value={Redondea(item.pia, 2, false, "")}
                          onBlur={(value) =>
                            guardarVariacionMonto(value, item.id)
                          }
                        />
                      </td>
                    ) : (
                      <td style={{ textAlign: "right" }}>
                        {Redondea(item.pia, 2, false, "")}
                      </td>
                    )}

                    {renderEspecificasContenido(item)}
                  </tr>
                  {Costos.filter(
                    (item2, i) => item2.id_analitico == item.id
                  ).map((item2, i2) => (
                    <tr key={i2}>
                      <td className="whiteThem-table-sticky">{i2 + 1}</td>
                      <td className="whiteThem-table-sticky2">
                        {EstadoEdicion != "costo_" + item2.id ? (
                          <>
                            <span
                              onClick={() => {
                                if (
                                  ModoEdicion &&
                                  Permisos[
                                    "fuentefinanciamiento_editar_titulo"
                                  ] == 1
                                ) {
                                  setEstadoEdicion("costo_" + item2.id);
                                }
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {item2.nombre}
                            </span>
                            {ModoEdicion &&
                              Permisos[
                                "fuentefinanciamiento_eliminar_titulo"
                              ] == 1 && (
                                <span
                                  style={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    right: "0px",
                                  }}
                                >
                                  <FaRegTrashAlt
                                    onClick={() => eliminarCosto(item2.id)}
                                    size="12"
                                    style={{
                                      marginLeft: "4px",
                                      marginRight: "4px",
                                    }}
                                  />
                                </span>
                              )}
                          </>
                        ) : (
                          <CustomSelect
                            value={item2.id_costo}
                            Opciones={CostosList}
                            item={item2}
                            itemValue={"id"}
                            itemLabel={"nombre"}
                            guardar={(valor) => {
                              actualizarCosto(valor, item.id, item2.id);
                            }}
                            cancel={() => setEstadoEdicion("")}
                          />
                        )}
                      </td>
                      <td colSpan={1 + VariacionesPim.length}></td>
                      {renderCostosData(item2, item)}
                    </tr>
                  ))}
                </>
              ))}
              <tr>{renderTotales()}</tr>
            </tbody>
          </table>
        )}
      </div>
    );
  }
);

function CustomSelect({
  value,
  Opciones = [],
  itemValue,
  itemLabel,
  guardar,
  cancel,
}) {
  const [Value, setValue] = useState(value);
  const [FlagCambios, setFlagCambios] = useState(false);
  function handleInputChange(e) {
    setFlagCambios(true);
    setValue(e.target.value);
  }
  return (
    <>
      <Input
        type="select"
        value={Value}
        onChange={handleInputChange}
        onBlur={() => guardar(Value)}
      >
        {Opciones.map((item, i) => (
          <option value={item[itemValue]}>{item[itemLabel]}</option>
        ))}
      </Input>
    </>
  );
}
function CustomAsyncSelect({ value, guardar }) {
  const [FlagCambios, setFlagCambios] = useState(false);
  const [Value, setValue] = useState(value);
  function handleInputChange(input) {
    setFlagCambios(true);
    var inputData = input.label.split("-");
    setValue({
      id_clasificador: input.value,
      clasificador: inputData[0],
      descripcion: inputData[1],
    });
  }
  async function clasificadorOptions(inputValue) {
    var res = await axios.get(
      `${UrlServer}/v1/clasificadorPresupuestario/analitico`,
      {
        params: {
          textoBuscado: inputValue,
          id_ficha: sessionStorage.getItem("idobra"),
        },
      }
    );
    var temp = [];
    if (Array.isArray(res.data)) {
      res.data.forEach((item) => {
        temp.push({
          value: item.id,
          label: item.clasificador + " - " + item.descripcion,
        });
      });
    }
    return temp;
  }
  return (
    <>
      <span style={{ width: "500px" }}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={clasificadorOptions}
          // styles={customStyles}
          value={{
            value: Value.id_clasificador,
            label: Value.clasificador + " - " + Value.descripcion,
          }}
          onChange={handleInputChange}
        />
      </span>

      <MdSave
        style={{ cursor: "pointer" }}
        color={FlagCambios ? "orange" : ""}
        onClick={() => guardar(Value.id_clasificador)}
        size={"20"}
      />
    </>
  );
}

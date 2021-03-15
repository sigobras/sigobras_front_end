import React, { useState, useEffect } from "react";
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
  FaTrash,
} from "react-icons/fa";
import { MdCancel, MdSave } from "react-icons/md";
import AsyncSelect from "react-select/async";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, formatMoney, mesesShort } from "../Utils/Funciones";
export default ({ id, anyo }) => {
  useEffect(() => {
    cargarCostos();
    cargarEspecificas();
    cargarCostosList();
    cargarVariacionesPim();
    return () => {};
  }, []);
  //costos
  const [CostosList, setCostosList] = useState([]);
  async function cargarCostosList() {
    var res = await axios.get(`${UrlServer}/v1/analiticoCostos`);
    console.log("cargarCostosList,", res.data);
    setCostosList(res.data);
  }
  const [Costos, setCostos] = useState([]);
  async function cargarCostos() {
    var res = await axios.get(`${UrlServer}/v1/fuentesFinancieamiento/costos`, {
      params: {
        id,
      },
    });
    setCostos(res.data);
  }
  async function agregarCosto() {
    var maxId = 0;
    Costos.forEach((item) => {
      if (item.id > maxId) {
        maxId = item.id_costo;
      }
    });
    console.log("costos", Costos, "maxid", maxId);
    var res = await axios.get(`${UrlServer}/v1/analiticoCostos/predecir`, {
      params: {
        id: maxId,
      },
    });

    var nextId = res.data || maxId;
    console.log("next id", nextId);
    var res2 = await axios.post(
      `${UrlServer}/v1/fuentesFinancieamiento/costos`,
      {
        fuentesfinanciamiento_asignados_id: id,
        presupuestoanalitico_costos_id: nextId,
      }
    );
    cargarCostos();
  }
  async function eliminarCosto(id) {
    if (confirm("Esta seguro de eliminar?")) {
      var res = await axios.delete(
        `${UrlServer}/v1/fuentesFinancieamiento/costos/${id}`
      );
    }
    cargarCostos();
  }
  async function actualizarCosto(
    presupuestoanalitico_costos_id,
    id_costoasignado
  ) {
    var res = await axios.put(
      `${UrlServer}/v1/fuentesFinancieamiento/costos/`,
      {
        id: id_costoasignado,
        fuentesfinanciamiento_asignados_id: id,
        presupuestoanalitico_costos_id,
      }
    );
    setEstadoEdicion("");
    cargarCostos();
  }
  const [EstadoEdicion, setEstadoEdicion] = useState("");
  function renderCostoMeses(id_costo) {
    var tempRender = [];
    var acumulado = 0;
    var ultimoPresupuesto = 0;
    //variaciones
    for (let i = 0; i < VariacionesPim.length; i++) {
      const variacion = VariacionesPim[i];
      var total = 0;
      for (let i = 0; i < Especificas.length; i++) {
        const item = Especificas[i];
        if (item.id_costoasignado == id_costo) {
          total += item["variacionPim_" + variacion.id];
        }
      }
      ultimoPresupuesto = total;
      tempRender.push(<th>{Redondea(total)}</th>);
    }
    //meses
    for (let mes = 1; mes <= 12; mes++) {
      var total = 0;
      var totalProgramado = 0;
      for (let i = 0; i < Especificas.length; i++) {
        const item = Especificas[i];
        if (item.id_costoasignado == id_costo) {
          total += item["avanceMensual_" + mes];
          totalProgramado += item["programadoMensual_" + mes];
        }
      }
      acumulado += total;
      tempRender.push(<th>{Redondea(total)}</th>);
      tempRender.push(<th>{Redondea(totalProgramado)}</th>);
    }
    tempRender.splice(VariacionesPim.length, 0, <th>{Redondea(acumulado)}</th>);
    tempRender.splice(
      VariacionesPim.length + 1,
      0,
      <th>{Redondea(ultimoPresupuesto - acumulado)}</th>
    );
    return tempRender;
  }
  //especificias
  const [Especificas, setEspecificas] = useState([]);
  async function cargarEspecificas() {
    var res = await axios.get(
      `${UrlServer}/v1/fuentesFinancieamiento/especificas`,
      {
        params: {
          id,
          anyo,
          id_ficha: sessionStorage.getItem("idobra"),
        },
      }
    );
    if (Array.isArray(res.data)) setEspecificas(res.data);
  }
  async function agregarEspecifica(id) {
    var res = await axios.post(
      `${UrlServer}/v1/fuentesFinancieamiento/especificas`,
      {
        clasificadores_presupuestarios_id: "1505",
        fuentesfinanciamiento_costosasignados_id: id,
        monto: "0",
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
  async function guardarMonto(pia, id) {
    var res = await axios.put(
      `${UrlServer}/v1/fuentesFinancieamiento/especificas/${id}`,
      {
        pia,
      }
    );
    cargarEspecificas();
  }
  async function guardarAvanceMensual(
    monto,
    fuentesfinanciamiento_analitico_id,
    mes
  ) {
    var res = await axios.put(
      `${UrlServer}/v1/fuentesFinancieamiento/avanceMensual`,
      {
        fuentesfinanciamiento_analitico_id,
        anyo,
        mes,
        monto,
      }
    );
    cargarEspecificas();
  }
  async function guardarProgramadoMensual(
    programado,
    fuentesfinanciamiento_analitico_id,
    mes
  ) {
    var res = await axios.put(
      `${UrlServer}/v1/fuentesFinancieamiento/avanceMensual`,
      {
        fuentesfinanciamiento_analitico_id,
        anyo,
        mes,
        programado,
      }
    );
    cargarEspecificas();
  }
  function mesesEspecificaRender(item) {
    var tempRender = [];
    var acumulado = 0;
    var ultimoPresupuesto = 0;
    //render variaciones
    for (let i = 0; i < VariacionesPim.length; i++) {
      const element = VariacionesPim[i];
      ultimoPresupuesto = item["variacionPim_" + element.id];
      tempRender.push(
        <td>
          <CustomInput
            value={Redondea(item["variacionPim_" + element.id], 2, false, "")}
            onBlur={(value) =>
              guardarVariacionesPimMonto(value, item.id, element.id)
            }
            style={{ width: "100px" }}
          />
        </td>
      );
    }
    //render meses
    for (let i = 1; i <= 12; i++) {
      acumulado += item["avanceMensual_" + i];
      tempRender.push(
        <td>
          <CustomInput
            value={Redondea(item["avanceMensual_" + i], 2, false, "")}
            onBlur={(value) => guardarAvanceMensual(value, item.id, i)}
            style={{ width: "100px" }}
          />
        </td>
      );
      tempRender.push(
        <td>
          <CustomInput
            value={Redondea(item["programadoMensual_" + i], 2, false, "")}
            onBlur={(value) => guardarProgramadoMensual(value, item.id, i)}
            style={{ width: "100px" }}
          />
        </td>
      );
    }

    tempRender.splice(VariacionesPim.length, 0, <th>{Redondea(acumulado)}</th>);
    tempRender.splice(
      VariacionesPim.length + 1,
      0,
      <th>{Redondea(ultimoPresupuesto - acumulado)}</th>
    );
    return tempRender;
  }
  //variaciones
  const [VariacionesPim, setVariacionesPim] = useState([]);
  async function cargarVariacionesPim() {
    var res = await axios.get(
      `${UrlServer}/v1/fuentesFinancieamiento/variacionesPim`,
      {
        params: {
          anyo,
          id_ficha: sessionStorage.getItem("idobra"),
        },
      }
    );
    setVariacionesPim(res.data);
  }
  async function agregarVariacionPim() {
    var nombreGenerado = "Variacion " + (VariacionesPim.length + 1);
    var res = await axios.post(
      `${UrlServer}/v1/fuentesFinancieamiento/variacionesPim`,
      {
        nombre: nombreGenerado,
        fichas_id_ficha: sessionStorage.getItem("idobra"),
        anyo,
      }
    );
    cargarVariacionesPim();
    cargarEspecificas();
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
        monto,
      }
    );
    cargarEspecificas();
  }
  const [EdicionVariacion, setEdicionVariacion] = useState("");
  const [EdicionVariacionNombre, setEdicionVariacionNombre] = useState("");
  //render
  function variacionesRenderTitulo() {
    var tempRender = [];
    for (let i = 0; i < VariacionesPim.length; i++) {
      const element = VariacionesPim[i];
      tempRender.push(
        <th
          style={{
            position: "relative",
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
            style={{ cursor: "pointer" }}
          >
            {EdicionVariacionNombre == element.id ? (
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
            <>
              {EdicionVariacionNombre != element.id && (
                <>
                  <FaEdit
                    onClick={() => setEdicionVariacionNombre(element.id)}
                    style={{ cursor: "pointer" }}
                  />

                  <FaTrash
                    onClick={() => eliminarVariacionPim(element.id)}
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}
            </>
          )}
          {i == VariacionesPim.length - 1 && (
            <span
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
              }}
            >
              <FaPlusCircle
                onClick={() => agregarVariacionPim()}
                style={{
                  cursor: "pointer",
                }}
                color="orange"
                size="15"
              />
            </span>
          )}
        </th>
      );
    }
    return tempRender;
  }
  function mesesRenderTitulo() {
    var tempRender = [];
    for (let i = 1; i <= 12; i++) {
      tempRender.push(<th>{mesesShort[i - 1] + " - " + anyo}</th>);
      tempRender.push(
        <th>{"programado " + mesesShort[i - 1] + " - " + anyo}</th>
      );
    }
    return tempRender;
  }

  function renderTotales() {
    var tempRender = [];
    var acumulado = 0;
    var ultimoPresupuesto = 0;
    //variaciones
    for (let i = 0; i < VariacionesPim.length; i++) {
      const variacion = VariacionesPim[i];
      var total = 0;
      var piaTotal = 0;
      for (let i = 0; i < Especificas.length; i++) {
        const item = Especificas[i];
        total += item["variacionPim_" + variacion.id];
        piaTotal += item.pia;
      }
      if (i == 0) {
        tempRender.push(<th>{Redondea(piaTotal)}</th>);
      }
      tempRender.push(<th>{Redondea(total)}</th>);
      ultimoPresupuesto = total;
    }
    //meses
    for (let mes = 1; mes <= 12; mes++) {
      var total = 0;
      var programadoTotal = 0;

      for (let i = 0; i < Especificas.length; i++) {
        const item = Especificas[i];
        total += item["avanceMensual_" + mes];
        programadoTotal += item["programadoMensual_" + mes];
      }
      tempRender.push(<th>{Redondea(total)}</th>);
      tempRender.push(<th>{Redondea(programadoTotal)}</th>);
      acumulado += total;
    }

    tempRender.unshift(<th colSpan="2">Total</th>);

    tempRender.splice(VariacionesPim.length + 2, 0, <th>{acumulado}</th>);
    tempRender.splice(
      VariacionesPim.length + 3,
      0,
      <th>{ultimoPresupuesto - acumulado}</th>
    );
    return tempRender;
  }
  return (
    <div>
      {Costos.length == 0 ? (
        <>
          {"Agregar nuevo Costo=>"}
          <FaPlusCircle
            onClick={() => agregarCosto()}
            style={{
              cursor: "pointer",
            }}
            color="orange"
            size="15"
          />
        </>
      ) : (
        <table className="whiteThem-table">
          <thead>
            <tr>
              <th>ITEM</th>
              <th style={{ position: "relative" }}>
                DESCRIPCION
                <span
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    cursor: "pointer",
                  }}
                >
                  <FaPlusCircle
                    onClick={() => agregarCosto()}
                    color="orange"
                    size="15"
                  />
                </span>
              </th>
              <th>PIA</th>
              {variacionesRenderTitulo()}
              <th>ACUMULADO {anyo}</th>
              <th>SALDO</th>

              {mesesRenderTitulo()}
            </tr>
          </thead>
          <tbody>
            {Costos.map((item, i) => (
              <>
                <tr>
                  <th>{i + 1}</th>
                  <th style={{ position: "relative", width: "450px" }}>
                    {EstadoEdicion == "costo" + item.id ? (
                      <span style={{ display: "flex" }}>
                        <CustomSelect
                          value={item.id_costo}
                          Opciones={CostosList}
                          item={item}
                          itemValue={"id_costo"}
                          itemLabel={"nombre"}
                          guardar={(valor) => actualizarCosto(valor, item.id)}
                          cancel={() => setEstadoEdicion("")}
                        />
                      </span>
                    ) : (
                      <span>
                        <span
                          style={{
                            paddingRight: "60px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.nombre}
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            cursor: "pointer",
                          }}
                        >
                          <FaEdit
                            onClick={() => setEstadoEdicion("costo" + item.id)}
                            style={{
                              paddingLeft: "5px",
                            }}
                            size="15"
                          />
                          <FaPlusCircle
                            onClick={() => agregarEspecifica(item.id)}
                            style={{
                              paddingLeft: "5px",
                            }}
                            size="15"
                          />
                          <FaTrash
                            onClick={() => eliminarCosto(item.id)}
                            style={{
                              paddingLeft: "5px",
                            }}
                            size="15"
                          />
                        </span>
                      </span>
                    )}
                  </th>
                  <th>
                    {Redondea(
                      Especificas.reduce((acc, item2) => {
                        if (item2.id_costoasignado == item.id) {
                          acc += item2.pia;
                        }
                        return acc;
                      }, 0)
                    )}
                  </th>
                  {renderCostoMeses(item.id)}
                </tr>
                {Especificas.filter(
                  (item2, i) => item2.id_costoasignado == item.id
                ).map((item2, i2) => (
                  <tr key={i2}>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        paddingRight: "5px",
                        paddingLeft: "5px",
                      }}
                      colSpan={
                        EstadoEdicion == "especifica" + item2.id ? "2" : "1"
                      }
                    >
                      {EstadoEdicion == "especifica" + item2.id ? (
                        <span style={{ display: "flex" }}>
                          <CustomAsyncSelect
                            value={item2}
                            guardar={(valor) =>
                              actualizarEspecifica(valor, item2.id)
                            }
                          />
                          <MdCancel
                            onClick={() => setEstadoEdicion("")}
                            style={{ cursor: "pointer" }}
                          />
                        </span>
                      ) : (
                        item2.clasificador
                      )}
                    </td>
                    {EstadoEdicion != "especifica" + item2.id && (
                      <td
                        style={{ whiteSpace: "nowrap", position: "relative" }}
                      >
                        <span style={{ paddingRight: "60px" }}>
                          {item2.descripcion}
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            cursor: "pointer",
                          }}
                        >
                          <FaEdit
                            onClick={() =>
                              setEstadoEdicion("especifica" + item2.id)
                            }
                            style={{
                              paddingLeft: "5px",
                            }}
                            size="15"
                          />
                          <FaTrash
                            onClick={() => eliminarEspecifica(item2.id)}
                            style={{
                              paddingLeft: "5px",
                            }}
                            size="15"
                          />
                        </span>
                      </td>
                    )}
                    <td>
                      <CustomInput
                        value={Redondea(item2.pia, 2, false, "")}
                        onBlur={(value) => guardarMonto(value, item2.id)}
                        style={{ width: "150px" }}
                      />
                    </td>
                    {mesesEspecificaRender(item2)}
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
};
function CustomInput({ value, onBlur, style, type }) {
  const [Value, setValue] = useState(value);
  const [FlagCambios, setFlagCambios] = useState(false);
  function handleInputChange(e) {
    setFlagCambios(true);
    if (type == "text") {
      setValue(e.target.value);
    } else {
      setValue(formatMoney(e.target.value));
    }
  }
  return (
    <Input
      value={Value}
      onChange={handleInputChange}
      onBlur={() => {
        if (FlagCambios) {
          var valorModificado =
            type == "text" ? Value : Value.replace(/[^0-9\.-]+/g, "");
          onBlur(valorModificado);
          setFlagCambios(false);
        }
      }}
      style={{ ...style, background: FlagCambios ? "#17a2b840" : "#42ff0038" }}
    />
  );
}
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
    setValue(formatMoney(e.target.value));
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
      {/* <MdCancel onClick={() => cancel()} style={{ cursor: "pointer" }} /> */}
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
    var res = await axios.get(`${UrlServer}/v1/clasificadorPresupuestario/`, {
      params: {
        textoBuscado: inputValue,
        limit: 10,
        id_inicio: 1475,
        id_final: 1688,
      },
    });
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
      <span style={{ width: "100%" }}>
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
        color={FlagCambios ? "blue" : ""}
        onClick={() => guardar(Value.id_clasificador)}
      />
    </>
  );
}

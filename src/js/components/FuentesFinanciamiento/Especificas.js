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
export default ({ Id_fuente, Anyo }) => {
  useEffect(() => {
    cargarEspecificas();
    cargarVariacionesPim();
    cargarCostos();
    cargarCostosList();
  }, []);
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
    if (Array.isArray(res.data)) setEspecificas(res.data);
  }
  async function agregarEspecifica() {
    var res = await axios.post(
      `${UrlServer}/v1/fuentesFinancieamiento/especificas`,
      {
        fuentesfinanciamiento_asignados_id: Id_fuente,
        clasificadores_presupuestarios_id: "1505",
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
  //costoslist
  const [CostosList, setCostosList] = useState([]);
  async function cargarCostosList() {
    var res = await axios.get(`${UrlServer}/v1/analiticoCostos`);
    setCostosList(res.data);
  }
  //costos
  const [Costos, setCostos] = useState([]);
  async function cargarCostos() {
    var res = await axios.get(`${UrlServer}/v1/fuentesFinancieamiento/costos`, {
      params: {
        id: Id_fuente,
        anyo: Anyo,
      },
    });
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
    console.log(
      "costos",
      Costos,
      "maxid",
      maxId,
      fuentesfinanciamiento_analitico_id
    );
    var res = await axios.get(`${UrlServer}/v1/analiticoCostos/predecir`, {
      params: {
        id: maxId,
      },
    });

    var nextId = res.data ? res.data.id : maxId;
    console.log("next id", nextId);
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
    console.log("eliminando", id);
    var res = await axios.delete(
      `${UrlServer}/v1/fuentesFinancieamiento/costos/${id}`
    );
    cargarCostos();
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
        monto,
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
        programado,
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
    console.log("cargarVariacionesPim", res.data);
    setVariacionesPim(res.data);
  }
  async function agregarVariacionPim() {
    var nombreGenerado = "PIM " + (VariacionesPim.length + 1);
    var res = await axios.post(
      `${UrlServer}/v1/fuentesFinancieamiento/variacionesPim`,
      {
        nombre: nombreGenerado,
        fuentesfinanciamiento_asignados_id: Id_fuente,
        anyo: Anyo,
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
  async function guardarVariacionMonto(pia, id) {
    var res = await axios.put(
      `${UrlServer}/v1/fuentesFinancieamiento/especificas/${id}`,
      {
        pia,
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
          {EdicionVariacionNombre != element.id &&
            i == VariacionesPim.length - 1 && (
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
  function renderMesesTitulo() {
    var tempRender = [];
    for (let i = 1; i <= 12; i++) {
      tempRender.push(
        <th style={{ whiteSpace: "nowrap" }}>
          {mesesShort[i - 1] + " - " + Anyo}
        </th>
      );
      tempRender.push(
        <th style={{ whiteSpace: "nowrap" }}>
          {"P/" + mesesShort[i - 1] + " - " + Anyo}
        </th>
      );
    }
    return tempRender;
  }
  //render
  function renderEspecificasContenido(item) {
    var tempRender = [];
    var acumulado = 0;
    var ultimoPresupuesto = item.pia;
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
            style={{ width: "90px" }}
          />
        </td>
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
      tempRender.push(<th>{Redondea(totalMes)}</th>);
      tempRender.push(<th>{Redondea(totalProgramadoMes)}</th>);
    }
    tempRender.splice(VariacionesPim.length, 0, <th>{Redondea(acumulado)}</th>);
    tempRender.splice(
      VariacionesPim.length + 1,
      0,
      <th>{Redondea(ultimoPresupuesto - acumulado)}</th>
    );
    return tempRender;
  }
  function renderMesesCostos(item) {
    var tempRender = [];
    var acumulado = 0;
    //render meses
    for (let i = 1; i <= 12; i++) {
      acumulado += item["avanceMensual_" + i];
      tempRender.push(
        <td>
          <CustomInput
            value={Redondea(item["avanceMensual_" + i], 2, false, "")}
            onBlur={(value) => guardarAvanceMensual(value, item.id, i)}
            style={{ width: "90px" }}
          />
        </td>
      );

      tempRender.push(
        <td>
          <CustomInput
            value={Redondea(item["programadoMensual_" + i], 2, false, "")}
            onBlur={(value) => guardarProgramadoMensual(value, item.id, i)}
            style={{ width: "90px" }}
          />
        </td>
      );
    }
    tempRender.splice(0, 0, <td>{Redondea(acumulado)}</td>);
    tempRender.splice(1, 0, <td></td>);
    return tempRender;
  }
  function renderTotales() {
    var tempRender = [];
    var acumulado = 0;
    var ultimoPresupuesto = 0;
    //pia
    var piaTotal = 0;
    for (let i = 0; i < Especificas.length; i++) {
      const item = Especificas[i];
      piaTotal += item.pia;
    }
    ultimoPresupuesto = piaTotal;
    tempRender.push(<th>{Redondea(piaTotal)}</th>);
    //variaciones
    for (let i = 0; i < VariacionesPim.length; i++) {
      const variacion = VariacionesPim[i];
      var pim = 0;
      for (let i = 0; i < Especificas.length; i++) {
        const item = Especificas[i];
        pim += item["variacionPim_" + variacion.id];
      }
      tempRender.push(<th>{Redondea(pim)}</th>);
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
      tempRender.push(<th>{Redondea(totalMes)}</th>);
      tempRender.push(<th>{Redondea(totalProgramadoMes)}</th>);
    }
    tempRender.unshift(<th colSpan="2">Total</th>);

    tempRender.splice(
      VariacionesPim.length + 2,
      0,
      <th>{Redondea(acumulado)}</th>
    );
    tempRender.splice(
      VariacionesPim.length + 3,
      0,
      <th>{Redondea(ultimoPresupuesto - acumulado)}</th>
    );
    return tempRender;
  }
  const [EstadoEdicion, setEstadoEdicion] = useState("");
  return (
    <div>
      {Especificas.length == 0 && (
        <>
          {"agregar especifica=>"}
          <FaPlusCircle
            onClick={() => agregarEspecifica()}
            style={{
              cursor: "pointer",
            }}
            color="orange"
            size="15"
          />
        </>
      )}
      {Especificas.length != 0 && (
        <>
          {VariacionesPim.length == 0 && (
            <>
              {"Agregar nueva variacion de PIM =>"}
              <FaPlusCircle
                onClick={() => agregarVariacionPim()}
                style={{
                  cursor: "pointer",
                }}
                color="orange"
                size="15"
              />
            </>
          )}
          <table className="whiteThem-table">
            <thead>
              <tr>
                <th>Especifica</th>
                <th style={{ position: "relative" }}>
                  Descripcion
                  <span
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                    }}
                  >
                    <FaPlusCircle
                      onClick={() => agregarEspecifica()}
                      style={{
                        cursor: "pointer",
                      }}
                      color="orange"
                      size="15"
                    />
                  </span>
                </th>
                <th>
                  PIA
                  {VariacionesPim.length == 0 && "/PIM"}
                </th>
                {renderVariacionesTitulo()}
                <th>Devengado {Anyo}</th>
                <th>Saldo {Anyo}</th>
                {renderMesesTitulo()}
              </tr>
            </thead>
            <tbody>
              {Especificas.map((item, i) => (
                <>
                  <tr>
                    <th
                      style={{ cursor: "pointer" }}
                      colSpan={EstadoEdicion != "especifica_" + item.id ? 1 : 2}
                    >
                      {EstadoEdicion != "especifica_" + item.id ? (
                        <span
                          onClick={() =>
                            setEstadoEdicion("especifica_" + item.id)
                          }
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
                      <th>
                        {item.descripcion}
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <FaPlusCircle
                            onClick={() => agregarCosto(item.id)}
                            style={{
                              paddingLeft: "5px",
                            }}
                            size="15"
                          />
                          <FaTrash
                            onClick={() => eliminarEspecifica(item.id)}
                            style={{
                              paddingLeft: "5px",
                            }}
                            size="15"
                          />
                        </span>
                      </th>
                    )}
                    <td>
                      <CustomInput
                        value={Redondea(item.pia, 2, false, "")}
                        onBlur={(value) =>
                          guardarVariacionMonto(value, item.id)
                        }
                        style={{ width: "90px" }}
                      />
                    </td>
                    {renderEspecificasContenido(item)}
                  </tr>
                  {Costos.filter(
                    (item2, i) => item2.id_analitico == item.id
                  ).map((item2, i2) => (
                    <tr key={i2}>
                      <td>{i2 + 1}</td>
                      <td>
                        {EstadoEdicion != "costo_" + item2.id ? (
                          <>
                            {item2.nombre}
                            <span
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <FaEdit
                                onClick={() =>
                                  setEstadoEdicion("costo_" + item2.id)
                                }
                                style={{
                                  paddingLeft: "5px",
                                }}
                                size="15"
                              />
                              <FaTrash
                                onClick={() => eliminarCosto(item2.id)}
                                style={{
                                  paddingLeft: "5px",
                                }}
                                size="15"
                              />
                            </span>{" "}
                          </>
                        ) : (
                          <CustomSelect
                            value={item2.id_costo}
                            Opciones={CostosList}
                            item={item2}
                            itemValue={"id_costo"}
                            itemLabel={"nombre"}
                            guardar={(valor) =>
                              actualizarCosto(valor, item.id, item2.id)
                            }
                            cancel={() => setEstadoEdicion("")}
                          />
                        )}
                      </td>
                      <td colSpan={1 + VariacionesPim.length}></td>
                      {renderMesesCostos(item2)}
                    </tr>
                  ))}
                </>
              ))}
              <tr>{renderTotales()}</tr>
            </tbody>
          </table>
        </>
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

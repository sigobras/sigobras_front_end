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
    return () => {};
  }, []);
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
    console.log("next id", res.data);
    if (res.data) {
      var res = await axios.put(
        `${UrlServer}/v1/fuentesFinancieamiento/costos`,
        {
          fuentesfinanciamiento_asignados_id: id,
          presupuestoanalitico_costos_id: res.data.id,
        }
      );
    }
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
    cargarCostos();
    setEstadoEdicion("");
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
        },
      }
    );
    setEspecificas(res.data);
  }
  async function agregarEspecifica(id) {
    var res = await axios.post(
      `${UrlServer}/v1/fuentesFinancieamiento/especificas`,
      {
        clasificadores_presupuestarios_id: "1",
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
  function mesesRender(item) {
    var tempRender = [];
    for (let i = 1; i <= 12; i++) {
      tempRender.push(
        <td>
          <CustomInput
            value={Redondea(item["avanceMensual_" + i], 2, false, "")}
            onBlur={(value) => guardarAvanceMensual(value, item.id, i)}
            style={{ width: "100px" }}
          />
        </td>
      );
    }
    return tempRender;
  }
  function mesesRenderTitulo() {
    var tempRender = [];
    for (let i = 1; i <= 12; i++) {
      tempRender.push(<th>{mesesShort[i - 1] + " - " + anyo}</th>);
    }
    return tempRender;
  }
  async function guardarMonto(monto, id) {
    var res = await axios.put(
      `${UrlServer}/v1/fuentesFinancieamiento/especificas/${id}`,
      {
        monto,
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
  const [EstadoEdicion, setEstadoEdicion] = useState("");

  return (
    <div>
      {Costos.length == 0 ? (
        <>
          {"Agregar nuevo Costo=>"}
          <FaPlusCircle onClick={() => agregarCosto()} />
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
                  <FaPlusCircle onClick={() => agregarCosto()} />
                </span>
              </th>
              <th>PRESUPUESTO</th>
              {mesesRenderTitulo()}
            </tr>
          </thead>
          <tbody>
            {Costos.map((item, i) => (
              <>
                <tr>
                  <th>{i + 1}</th>
                  <th style={{ position: "relative" }}>
                    {EstadoEdicion == "costo" + item.id ? (
                      <span style={{ display: "flex" }}>
                        <CustomSelect
                          value={item.id_costo}
                          Opciones={CostosList}
                          item={item}
                          itemValue={"id_costo"}
                          itemLabel={"nombre"}
                          guardar={(valor) => actualizarCosto(valor, item.id)}
                        />

                        <MdCancel
                          onClick={() => setEstadoEdicion("")}
                          style={{ cursor: "pointer" }}
                        />
                      </span>
                    ) : (
                      <span>
                        <span style={{ paddingRight: "60px" }}>
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
                          />
                          <FaPlusCircle
                            onClick={() => agregarEspecifica(item.id)}
                          />
                          <FaTrash onClick={() => eliminarCosto(item.id)} />
                        </span>
                      </span>
                    )}
                  </th>
                </tr>
                {Especificas.filter(
                  (item2, i) => item2.id_costoasignado == item.id
                ).map((item2, i2) => (
                  <tr key={i2}>
                    <td
                      style={{ whiteSpace: "nowrap" }}
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
                          />
                          <FaTrash
                            onClick={() => eliminarEspecifica(item2.id)}
                          />
                        </span>
                      </td>
                    )}
                    <td>
                      <CustomInput
                        value={Redondea(item2.monto, 2, false, "")}
                        onBlur={(value) => guardarMonto(value, item2.id)}
                        style={{ width: "150px" }}
                      />
                    </td>
                    {mesesRender(item2)}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
function CustomInput({ value, onBlur, style }) {
  const [Value, setValue] = useState(value);
  const [FlagCambios, setFlagCambios] = useState(false);
  function handleInputChange(e) {
    setFlagCambios(true);
    setValue(formatMoney(e.target.value));
  }
  return (
    <Input
      value={Value}
      onChange={handleInputChange}
      onBlur={() => {
        onBlur(Value.replace(/[^0-9\.-]+/g, ""));
        setFlagCambios(false);
      }}
      style={{ ...style, background: FlagCambios ? "#17a2b840" : "#42ff0038" }}
    />
  );
}
function CustomSelect({ value, Opciones = [], itemValue, itemLabel, guardar }) {
  const [Value, setValue] = useState(value);
  const [FlagCambios, setFlagCambios] = useState(false);
  function handleInputChange(e) {
    setFlagCambios(true);
    setValue(formatMoney(e.target.value));
  }
  return (
    <>
      <Input type="select" value={Value} onChange={handleInputChange}>
        {Opciones.map((item, i) => (
          <option value={item[itemValue]}>{item[itemLabel]}</option>
        ))}
      </Input>
      <MdSave
        style={{ cursor: "pointer" }}
        color={FlagCambios ? "blue" : ""}
        onClick={() => guardar(Value)}
      />
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

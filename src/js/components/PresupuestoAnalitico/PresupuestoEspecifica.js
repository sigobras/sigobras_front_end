import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Input } from "reactstrap";
import axios from "axios";
import AsyncSelect from "react-select/async";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, formatMoney } from "../Utils/Funciones";
export default forwardRef(
  (
    {
      id_costo,
      PresupuestosAprobados,
      CostosAnalitico,
      setCostosAnalitico,
      index_costo,
      display,
      AnyoSeleccionado,
      setAnyosEjecutados,
    },
    ref
  ) => {
    useEffect(() => {
      cargarEspecificasCostos();
    }, []);
    useImperativeHandle(ref, () => ({
      nuevo() {
        agregarPresupuestoEspecifica();
      },
    }));

    const [EspecificasCostos, setEspecificasCostos] = useState([]);
    const [AvanceAnual, setAvanceAnual] = useState([]);
    async function cargarEspecificasCostos() {
      var idsPresupuestoAprobados = PresupuestosAprobados.reduce(
        (acc, item) => acc + item.id + ",",
        ""
      );
      idsPresupuestoAprobados = idsPresupuestoAprobados.slice(0, -1);
      var res = await axios.get(`${UrlServer}/v1/analitico/`, {
        params: {
          id_costo,
          presupuestosAprobados: idsPresupuestoAprobados,
          anyo: AnyoSeleccionado,
          id_ficha: sessionStorage.getItem("idobra"),
        },
      });
      if (res.data.length && res.data[0].id != null) {
        setEspecificasCostos(res.data);
        //anyos de avance anual
        if (res.data.length) {
          var anyos = Object.keys(res.data[0]).filter((item) =>
            item.startsWith("avanceAnual_")
          );
          setAvanceAnual(anyos);
          setAnyosEjecutados(anyos);
        }
        // actualizacion de costosanaliticos
        var clone = [...CostosAnalitico];
        var analiticoPresupuestos = res.data;
        var properties = Object.keys(analiticoPresupuestos[0]);
        //filter properties
        var propertiesPresupuesto = properties.filter(
          (item) =>
            item.startsWith("presupuesto_") ||
            item.startsWith("avanceAnual_") ||
            item.startsWith("avanceMensual")
        );
        for (let i = 0; i < analiticoPresupuestos.length; i++) {
          const item = analiticoPresupuestos[i];
          for (let j = 0; j < propertiesPresupuesto.length; j++) {
            const item2 = propertiesPresupuesto[j];
            if (i == 0) {
              clone[index_costo][item2] = 0;
            }
            if (clone[index_costo][item2]) {
              clone[index_costo][item2] += item[item2];
            } else {
              clone[index_costo][item2] = item[item2];
            }
          }
        }
        setCostosAnalitico(clone);
      }
    }
    function agregarPresupuestoEspecifica() {
      var clone = [...EspecificasCostos];
      clone.push({
        id: null,
        clasificador: "",
        descripcion: "",
      });
      setEspecificasCostos(clone);
      setIndexEdicion(clone.length - 1);
    }
    //edicion
    const [IndexEdicion, setIndexEdicion] = useState(-1);

    const customStyles = {
      option: (provided) => ({
        ...provided,
        color: "black",
        backgroundColor: "white",
      }),
    };
    async function promiseOptions(inputValue) {
      var res = await axios.get(`${UrlServer}/v1/clasificadorPresupuestario/`, {
        params: {
          textoBuscado: inputValue,
          limit: 10,
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
    //handleinputchange
    function handleInputChange(input) {
      var inputData = input.label.split("-");
      var clone = [...EspecificasCostos];
      clone[IndexEdicion].id_clasificador = input.value;
      clone[IndexEdicion].clasificador = inputData[0];
      clone[IndexEdicion].descripcion = inputData[1];
      setEspecificasCostos(clone);
    }
    //guandrando data
    async function guardandoEspecifica() {
      try {
        if (confirm("Desea registrar esta especifica")) {
          var dataProcesada = [];
          EspecificasCostos.forEach((item) => {
            dataProcesada.push({
              id: item.id,
              presupuestoanalitico_costosasignados_id: id_costo,
              clasificadores_presupuestarios_id: item.id_clasificador,
            });
          });
          await axios.put(`${UrlServer}/v1/analitico/`, dataProcesada);
        }
        setIndexEdicion(-1);
        cargarEspecificasCostos();
      } catch (error) {
        if (error.response.data.message == "ER_DUP_ENTRY") {
          alert(
            "La especifica seleccionada ya esta registrada en esta seccion"
          );
        } else {
          alert("Ocurrio un error");
        }
      }
    }
    //edicion presupuestos
    //refs
    const [RefEspecificasInput, setRefEspecificasInput] = useState([]);
    //redner
    function RenderPresupuestosData(item) {
      var tempRender = [];
      for (let index = 0; index < PresupuestosAprobados.length; index++) {
        var element = PresupuestosAprobados[index];
        tempRender.push(
          <td>
            <PresupuestoInput
              value={Redondea(item["presupuesto_" + element.id], 2, false, "")}
              presupuesto_analitico_id={item.id}
              presupuestos_aprobados_id={element.id}
              recargar={cargarEspecificasCostos}
              RefEspecificasInput={RefEspecificasInput}
              setRefEspecificasInput={setRefEspecificasInput}
              EspecificasCostos={EspecificasCostos}
              PresupuestosAprobados={PresupuestosAprobados}
            />
          </td>
        );
      }
      return tempRender;
    }
    function RenderAvanceAnualData(item) {
      var tempRender = [];
      for (let index = 0; index < AvanceAnual.length; index++) {
        const key = AvanceAnual[index];
        tempRender.push(
          <td>
            <AvanceAnualInput
              value={Redondea(item[key], 2, false, "")}
              anyo={key.substr(key.length - 4)}
              presupuesto_analitico_id={item.id}
              recargar={cargarEspecificasCostos}
            />
          </td>
        );
      }
      return tempRender;
    }
    function RenderAvanceMensualData(item) {
      var tempRender = [];
      for (let index = 1; index <= 12; index++) {
        tempRender.push(
          <td>
            <AvanceMensualInput
              value={Redondea(
                item[`avanceMensual_${AnyoSeleccionado}_${index}`],
                2,
                false,
                ""
              )}
              anyo={AnyoSeleccionado}
              mes={index}
              presupuesto_analitico_id={item.id}
              recargar={cargarEspecificasCostos}
            />
          </td>
        );
      }
      return tempRender;
    }
    return EspecificasCostos.map((item, i) => (
      <tr style={{ display: display }}>
        <td
          colSpan={IndexEdicion == i ? "2" : "1"}
          style={{ fontSize: "9px", width: "50px" }}
        >
          {IndexEdicion == i ? (
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={promiseOptions}
              styles={customStyles}
              value={{
                value: item.id_clasificador,
                label: item.clasificador + " - " + item.descripcion,
              }}
              onChange={handleInputChange}
              onBlur={guardandoEspecifica}
            />
          ) : (
            <div onClick={() => setIndexEdicion(i)}>{item.clasificador}</div>
          )}
        </td>
        {IndexEdicion != i && (
          <td onClick={() => setIndexEdicion(i)} style={{ width: "300px" }}>
            {item.descripcion}
          </td>
        )}
        {RenderPresupuestosData(item)}
        {RenderAvanceAnualData(item)}
        {RenderAvanceMensualData(item)}
      </tr>
    ));
  }
);

function PresupuestoInput({
  value,
  presupuesto_analitico_id,
  presupuestos_aprobados_id,
  recargar,
  RefEspecificasInput,
  setRefEspecificasInput,
  EspecificasCostos,
  PresupuestosAprobados,
}) {
  const [InputValue, setInputValue] = useState({
    presupuesto_analitico_id,
    presupuestos_aprobados_id,
    monto: value,
  });
  function handleInputChange(e) {
    setflagCambios(true);
    setInputValue({
      ...InputValue,
      monto: formatMoney(e.target.value),
    });
  }
  async function guardarData() {
    if (flagCambios) {
      var clone = { ...InputValue };
      clone.monto = clone.monto.replace(/[^0-9\.-]+/g, "");
      await axios.put(`${UrlServer}/v1/analitico/presupuesto`, [clone]);
      recargar();
    }
  }
  const [flagCambios, setflagCambios] = useState(false);
  //on enter
  function handleEnter(event) {
    //movimiento vertical
    if (event.keyCode === 13 || event.keyCode === 40) {
      var index = EspecificasCostos.findIndex(
        (item) => item.id == presupuesto_analitico_id
      );
      if (index < EspecificasCostos.length - 1) {
        RefEspecificasInput[
          EspecificasCostos[index + 1].id + "-" + presupuestos_aprobados_id
        ].focus();
      }
    }
    if (event.keyCode === 38) {
      var index = EspecificasCostos.findIndex(
        (item) => item.id == presupuesto_analitico_id
      );
      if (index > 0) {
        RefEspecificasInput[
          EspecificasCostos[index - 1].id + "-" + presupuestos_aprobados_id
        ].focus();
      }
    }
    //movimiento horizontal
    if (event.keyCode === 37) {
      var index = PresupuestosAprobados.findIndex(
        (item) => item.id == presupuestos_aprobados_id
      );
      if (index > 0) {
        RefEspecificasInput[
          presupuesto_analitico_id + "-" + PresupuestosAprobados[index - 1].id
        ].focus();
      }
    }
    if (event.keyCode === 39) {
      var index = PresupuestosAprobados.findIndex(
        (item) => item.id == presupuestos_aprobados_id
      );
      if (index < PresupuestosAprobados.length - 1) {
        RefEspecificasInput[
          presupuesto_analitico_id + "-" + PresupuestosAprobados[index + 1].id
        ].focus();
      }
    }
    guardarData();
  }
  return (
    <Input
      value={InputValue.monto}
      onChange={(e) => handleInputChange(e)}
      onBlur={() => guardarData()}
      className="whiteThem-table-input"
      onKeyDown={handleEnter}
      innerRef={(ref) => {
        var clone = RefEspecificasInput;
        clone[presupuesto_analitico_id + "-" + presupuestos_aprobados_id] = ref;
        setRefEspecificasInput(clone);
      }}
    />
  );
}
function AvanceAnualInput({ value, anyo, presupuesto_analitico_id, recargar }) {
  const [InputValue, setInputValue] = useState({
    presupuesto_analitico_id,
    anyo,
    monto: value,
  });
  const [flagCambios, setflagCambios] = useState(false);
  function handleInputChange(e) {
    setflagCambios(true);
    setInputValue({
      ...InputValue,
      monto: formatMoney(e.target.value),
    });
  }
  async function guardarData() {
    if (flagCambios) {
      var clone = { ...InputValue };
      clone.monto = clone.monto.replace(/[^0-9\.-]+/g, "");
      await axios.put(`${UrlServer}/v1/analitico/avanceAnual`, [clone]);
      recargar();
    }
  }
  return (
    <Input
      value={InputValue.monto}
      onChange={(e) => handleInputChange(e)}
      onBlur={() => guardarData()}
      className="whiteThem-table-input"
      // onKeyDown={handleEnter}
      // innerRef={(ref) => {
      //   var clone = RefEspecificasInput;
      //   clone[presupuesto_analitico_id + "-" + presupuestos_aprobados_id] = ref;
      //   setRefEspecificasInput(clone);
      // }}
    />
  );
}
function AvanceMensualInput({
  value,
  presupuesto_analitico_id,
  anyo,
  mes,
  recargar,
}) {
  const [InputValue, setInputValue] = useState({
    presupuesto_analitico_id,
    anyo,
    mes,
    monto: value,
  });
  const [flagCambios, setflagCambios] = useState(false);
  function handleInputChange(e) {
    setflagCambios(true);
    setInputValue({
      ...InputValue,
      monto: formatMoney(e.target.value),
    });
  }
  async function guardarData() {
    if (flagCambios) {
      var clone = { ...InputValue };
      clone.monto = clone.monto.replace(/[^0-9\.-]+/g, "");
      await axios.put(`${UrlServer}/v1/analitico/avanceMensual`, [clone]);
      recargar();
    }
  }
  return (
    <Input
      value={InputValue.monto}
      onChange={(e) => handleInputChange(e)}
      onBlur={() => guardarData()}
      className="whiteThem-table-input"
      // onKeyDown={handleEnter}
      // innerRef={(ref) => {
      //   var clone = RefEspecificasInput;
      //   clone[presupuesto_analitico_id + "-" + presupuestos_aprobados_id] = ref;
      //   setRefEspecificasInput(clone);
      // }}
    />
  );
}

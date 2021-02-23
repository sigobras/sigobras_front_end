import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
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
} from "reactstrap";
import axios from "axios";
import { FaUpload, FaDownload } from "react-icons/fa";
import AsyncSelect from "react-select/async";

import ModalCostosAnalitico from "./ModalCostosAnalitico";
import ModalNuevoPresupuesto from "./ModalNuevoPresupuesto";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, DescargarArchivo } from "../Utils/Funciones";
export default forwardRef(
  (
    {
      id_costo,
      PresupuestosAprobados,
      CostosAnalitico,
      setCostosAnalitico,
      index,
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
        },
      });
      if (res.data[0].id != null) {
        setEspecificasCostos(res.data);
        var clone = [...CostosAnalitico];
        var analiticoPresupuestos = res.data;
        var properties = Object.keys(analiticoPresupuestos[0]);
        //filter properties
        var properties = properties.filter((item) =>
          item.startsWith("presupuesto_")
        );

        for (let i = 0; i < analiticoPresupuestos.length; i++) {
          const item = analiticoPresupuestos[i];
          for (let j = 0; j < properties.length; j++) {
            const item2 = properties[j];
            if (clone[index][item2]) {
              clone[index][item2] += item[item2];
            } else {
              clone[index][item2] = item[item2];
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
      option: (provided, state) => ({
        ...provided,
        color: "black",
        backgroundColor: "white",
      }),
    };
    async function promiseOptions(inputValue) {
      console.log("cargando data");
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
      console.log("value", input);
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
          console.log("guardando", EspecificasCostos);
          var dataProcesada = [];
          EspecificasCostos.forEach((item) => {
            dataProcesada.push({
              id: item.id,
              presupuestoanalitico_costosasignados_id: id_costo,
              clasificadores_presupuestarios_id: item.id_clasificador,
            });
          });
          var res = await axios.put(
            `${UrlServer}/v1/analitico/`,
            dataProcesada
          );
          alert("Registro exitoso");
        }
        setIndexEdicion(-1);
        cargarEspecificasCostos();
      } catch (error) {
        console.log("error", error.response);
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
    const [IndexEdicionPresupuesto, setIndexEdicionPresupuesto] = useState(-1);
    //eliminar item
    function eliminarItem(index) {
      var clone = [...EspecificasCostos];
      clone.splice(index, 1);
      setEspecificasCostos(clone);
    }
    return EspecificasCostos.map((item, i) => (
      <tr key={i + "-1"}>
        <td colSpan={IndexEdicion == i ? "2" : "1"}>
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
        {IndexEdicion != i && <td>{item.descripcion}</td>}
        {(() => {
          var tempRender = [];
          for (let index = 0; index < PresupuestosAprobados.length; index++) {
            var element = PresupuestosAprobados[index];
            tempRender.push(
              <td
                onClick={() =>
                  setIndexEdicionPresupuesto(i + "_presupuesto_" + index)
                }
              >
                {IndexEdicionPresupuesto == i + "_presupuesto_" + index ? (
                  <PresupuestoInput
                    value={item["presupuesto_" + element.id]}
                    presupuesto_analitico_id={item.id}
                    presupuestos_aprobados_id={element.id}
                    recargar={cargarEspecificasCostos}
                    setIndexEdicionPresupuesto={setIndexEdicionPresupuesto}
                  />
                ) : (
                  Redondea(item["presupuesto_" + element.id])
                )}
              </td>
            );
          }
          return tempRender;
        })()}
      </tr>
    ));
  }
);

function PresupuestoInput({
  value,
  presupuesto_analitico_id,
  presupuestos_aprobados_id,
  recargar,
  setIndexEdicionPresupuesto,
}) {
  const [InputValue, setInputValue] = useState({
    presupuesto_analitico_id,
    presupuestos_aprobados_id,
    monto: value,
  });
  function handleInputChange(e) {
    setInputValue({
      ...InputValue,
      monto: e.target.value,
    });
  }
  async function guardarData() {
    console.log("guardando data", InputValue);
    await axios.put(`${UrlServer}/v1/analitico/presupuesto`, [InputValue]);
    setIndexEdicionPresupuesto(-1);
    recargar();
  }
  return (
    <Input
      value={InputValue.monto}
      onChange={(e) => handleInputChange(e)}
      onBlur={() => guardarData()}
    />
  );
}

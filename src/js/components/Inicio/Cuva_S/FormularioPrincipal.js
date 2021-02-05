import React, { useState } from "react";
import { MdSettings } from "react-icons/md";
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Alert,
} from "reactstrap";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

import { Redondea, mesesShort } from "../../Utils/Funciones";
import { UrlServer } from "../../Utils/ServerUrlConfig";

export default ({ id_ficha, recargarData }) => {
  // modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      fetchRegistrosNoUbicados();
      fetchYearsModalPIM();
      fetchPinData();
    }
    setModal(!modal);
  };
  //verificar historial incompleto de hitos

  const [RegistroNoUbicados, setRegistroNoUbicados] = useState({});
  async function fetchRegistrosNoUbicados() {
    const request = await axios.post(`${UrlServer}/getRegistroNoUbicados`, {
      id_ficha: id_ficha,
    });
    setRegistroNoUbicados(request.data[0]);
  }
  //cargar anyos data select
  const [AnyosEjecutados, setAnyosEjecutados] = useState([]);
  const [] = useState("SELECCIONE");
  async function fetchAnyosEjecutados() {
    const request = await axios.post(
      `${UrlServer}/getAnyosNoRegistradosCurvaS`,
      {
        id_ficha: id_ficha,
      }
    );
    setAnyosEjecutados(request.data);
  }

  //tipo de formulario
  const [FormularioOpcion, setFormularioOpcion] = useState("SELECCIONE");

  //OPCION PROGRMAR MES - NUEVO
  //modal data
  const [MesesModal, setMesesModal] = useState([
    {
      fecha_inicial: "",
      programado_monto: 0,
      financiero_monto: 0,
      ejecutado_monto: 0,
      observacion: "",
      estado_codigo: "E",
      fichas_id_ficha: id_ficha,
      anyo: new Date().getFullYear(),
      mes: 1,
    },
  ]);
  function addMesModal() {
    var dataClonado = [...MesesModal];
    dataClonado.push({
      fecha_inicial: "",
      programado_monto: 0,
      financiero_monto: 0,
      ejecutado_monto: 0,
      observacion: "",
      estado_codigo: "E",
      fichas_id_ficha: id_ficha,
      anyo: new Date().getFullYear(),
      mes: 1,
    });
    setMesesModal(dataClonado);
  }
  function onChangeModalData(value, name, i) {
    var Dataclonado = [...MesesModal];
    Dataclonado[i][name] = value;
    if (name == "anyoMes") {
      Dataclonado[i].fecha_inicial = value + "-01";
      Dataclonado[i].anyo = value.split("-")[0];
      Dataclonado[i].mes = value.split("-")[1];
    }
    setMesesModal(Dataclonado);
  }
  async function saveModalData() {
    if (FormularioOpcion == "nuevo") {
      const request2 = await axios.post(
        `${UrlServer}/postDataCurvaS`,
        MesesModal
      );
      alert("Periodos Nuevos :" + request2.data.message);
    }
    setModal(false);
    recargarData();
    fetchAnyosEjecutados();
    setMesesModal([]);
  }

  // ingreso de pin
  const [YearsModalPIM, setYearsModalPIM] = useState([]);
  function fetchYearsModalPIM() {
    var actualYear = new Date().getFullYear();
    actualYear -= 3;
    var years = [];
    for (let i = 0; i < 6; i++) {
      years.push(actualYear);
      actualYear++;
    }
    setYearsModalPIM(years);
  }
  const [PinData, setPinData] = useState([]);
  async function fetchPinData() {
    const res = await axios.post(`${UrlServer}/getPimData`, {
      id_ficha: id_ficha,
    });
    setPinData(res.data);
  }
  function addPinData() {
    var clon = [...PinData];
    clon.push({
      monto: 0,
      anyo: "SELECCIONE",
      id_ficha: id_ficha,
    });
    setPinData(clon);
  }
  function onChangePinData(i, name, value) {
    var clon = [...PinData];
    clon[i][name] = value;
    setPinData(clon);
  }
  async function savePinData() {
    if (confirm("Esta seguro de ingresar estos datos?")) {
      const request = await axios.post(`${UrlServer}/postCurvaSPin`, PinData);
      alert("registro exitoso");
      fetchPinData();
    }
  }
  return (
    <div>
      <div onClick={toggle} style={{ color: "#676767" }}>
        <MdSettings style={{ cursor: "pointer" }} size={26} />
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
          {RegistroNoUbicados.registros > 0 ? (
            <Alert color="danger">
              Se encontraron registros de avance no ubicados correctamente,
              contactar con el ADMINISTRADOR DEL SISTEMA
            </Alert>
          ) : (
            <div>
              {AnyosEjecutados.length > 0 ? (
                <Alert color="warning">
                  Completar el registro de todos los años para poder ingresar
                  nuevos financieros
                </Alert>
              ) : (
                <Input
                  type="select"
                  value={FormularioOpcion}
                  onChange={(e) => setFormularioOpcion(e.target.value)}
                  className="form-control"
                >
                  <option disabled hidden>
                    SELECCIONE
                  </option>
                  {AnyosEjecutados.length > 0 ? (
                    <option value="ejecutado">Crear curva S</option>
                  ) : (
                    [
                      <option key={1} value="nuevo">
                        Programar mes
                      </option>,
                      <option key={3} value="ingreso-pin">
                        Ingresar/Actualizar PIM
                      </option>,
                    ]
                  )}
                </Input>
              )}
            </div>
          )}

          <table>
            <thead>
              <tr>
                {(FormularioOpcion == "ejecutado" ||
                  FormularioOpcion == "nuevo") && [
                  <th key={1} className="text-center">
                    PERIODO
                  </th>,
                  <th key={2} className="text-center">
                    PROGRAMADO
                  </th>,
                  <th key={3} className="text-center">
                    EJECUTADO
                  </th>,
                  <th key={4} className="text-center">
                    FINANCIERO
                  </th>,
                  <th key={5} className="text-center">
                    OBSERVACION
                  </th>,
                ]}
                <th>
                  {FormularioOpcion == "ejecutado" && (
                    <Input
                      type="select"
                      onChange={(e) => onChangeAnyo(e.target.value)}
                      className="form-control"
                    >
                      <option disabled hidden>
                        SELECCIONE
                      </option>
                      {AnyosEjecutados.map((item, i) => (
                        <option key={i}>{item.anyo}</option>
                      ))}
                    </Input>
                  )}
                </th>
              </tr>
            </thead>
            {FormularioOpcion == "ejecutado" && (
              <tbody>
                {PeriodosEjecutados.map((item, i) => (
                  <tr key={i}>
                    <td>
                      {item.estado_codigo == "C" ? "CORTE-" : ""}
                      {mesesShort[item.mes - 1]}
                    </td>
                    <td>{Redondea(item.programado_monto)}</td>
                    <td>{Redondea(item.ejecutado_monto)}</td>
                    <td>
                      <DebounceInput
                        value={item.financiero_monto}
                        debounceTimeout={300}
                        onChange={(e) =>
                          onChangePeriodosData(
                            e.target.value,
                            "financiero_monto",
                            i
                          )
                        }
                        type="number"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <DebounceInput
                        value={item.observacion}
                        debounceTimeout={300}
                        onChange={(e) =>
                          onChangePeriodosData(e.target.value, "observacion", i)
                        }
                        type="text"
                        className="form-control"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
            {FormularioOpcion == "nuevo" && (
              <tbody>
                {MesesModal.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <DebounceInput
                        value={item.anyoMes}
                        debounceTimeout={300}
                        onChange={(e) =>
                          onChangeModalData(e.target.value, "anyoMes", i)
                        }
                        type="month"
                        className="form-control"
                      />
                    </td>

                    <td>
                      <DebounceInput
                        value={item.programado_monto}
                        debounceTimeout={300}
                        onChange={(e) =>
                          onChangeModalData(
                            e.target.value,
                            "programado_monto",
                            i
                          )
                        }
                        type="number"
                        className="form-control"
                      />
                    </td>
                    <td>{item.ejecutado}</td>
                    <td>
                      <DebounceInput
                        value={item.financiero_monto}
                        debounceTimeout={300}
                        onChange={(e) =>
                          onChangeModalData(
                            e.target.value,
                            "financiero_monto",
                            i
                          )
                        }
                        type="number"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <DebounceInput
                        value={item.observacion}
                        debounceTimeout={300}
                        onChange={(e) =>
                          onChangeModalData(e.target.value, "observacion", i)
                        }
                        type="text"
                        className="form-control"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5}></td>
                  <td>
                    <Button color="danger" onClick={addMesModal}>
                      +
                    </Button>
                  </td>
                </tr>
              </tbody>
            )}

            {FormularioOpcion == "ingreso-pin" && (
              <tbody>
                {PinData.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <Input
                        type="select"
                        value={item.anyo}
                        onChange={(e) =>
                          onChangePinData(i, "anyo", e.target.value)
                        }
                        className="form-control"
                      >
                        <option disabled hidden>
                          SELECCIONE
                        </option>
                        {YearsModalPIM.map((item, j) => (
                          <option key={j}>{item}</option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      <DebounceInput
                        value={item.pim}
                        debounceTimeout={300}
                        onChange={(e) =>
                          onChangePinData(i, "pim", e.target.value)
                        }
                        type="number"
                        className="form-control"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5}></td>
                  <td>
                    <Button color="danger" onClick={addPinData}>
                      +
                    </Button>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </ModalBody>
        <ModalFooter>
          {RegistroNoUbicados.registros == 0 && (
            <div>
              {(FormularioOpcion == "nuevo" ||
                FormularioOpcion == "ejecutado") && (
                <Button key={1} color="primary" onClick={saveModalData}>
                  Guardar
                </Button>
              )}
              {FormularioOpcion == "ingreso-pin" && (
                <Button key={2} color="primary" onClick={savePinData}>
                  Guardar
                </Button>
              )}
            </div>
          )}
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

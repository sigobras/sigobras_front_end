import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiEyeFill } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";

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
                (item) =>
                  item.activado && (
                    <th className="reporteGeneral-cabezera">{item.nombre}</th>
                  )
              )}
            </tr>
            {Obras.map((item, i) => (
              <tr>
                <td className="reporteGeneral-bodySticky  ">
                  <ProyectoData numero={i + 1} data={item} />
                </td>
                {ListInterfaces.map(
                  (item2) =>
                    item2.activado && (
                      <td className="reporteGeneral-body">
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
function ProyectoData({ numero, data }) {
  const [ObraData, setObraData] = useState(data);
  const [ObraDataModificada, setObraDataModificada] = useState({});
  const handleInputChange = (name, value) => {
    setObraData({
      ...ObraData,
      [name]: value,
    });
    setObraDataModificada({
      ...ObraDataModificada,
      [name]: value,
    });
  };
  //autosave input
  let timer,
    timeoutVal = 2000;
  //save data
  async function guardarData() {
    console.log("ObraData", ObraData);
    console.log("ObraData modificada", ObraDataModificada);
  }
  return (
    <div style={{ width: "300px" }}>
      <div>
        <span style={{ fontWeight: "900" }}>
          N° {numero} Meta {data.meta}
        </span>
        {data.nombre_obra}
      </div>
      <table
        className="reporteGeneral-table"
        style={{
          width: "100%",
        }}
      >
        <tbody>
          <tr>
            <th
              style={{
                width: "150px",
              }}
            >
              Presupuesto
            </th>
            <td>
              <Input
                value={ObraData.presupuesto}
                onChange={(e) =>
                  handleInputChange("presupuesto", e.target.value)
                }
                onKeyUp={() => {
                  window.clearTimeout(timer);
                  timer = window.setTimeout(() => {
                    guardarData();
                  }, timeoutVal);
                }}
                onKeyPress={() => {
                  window.clearTimeout(timer);
                }}
                disabled
              />
            </td>
          </tr>
          <tr>
            <th
              style={{
                width: "150px",
              }}
            >
              Estado Obra
            </th>
            <td>
              <Input
                value={ObraData.estado_obra}
                onChange={(e) =>
                  handleInputChange("estado_obra", e.target.value)
                }
                onKeyUp={() => {
                  window.clearTimeout(timer);
                  timer = window.setTimeout(() => {
                    guardarData();
                  }, timeoutVal);
                }}
                onKeyPress={() => {
                  window.clearTimeout(timer);
                }}
                disabled
              />
            </td>
          </tr>
          <tr>
            <th>Codigo UI</th>
            <td>
              <Input
                value={ObraData.codigo_ui}
                onChange={(e) => handleInputChange("codigo_ui", e.target.value)}
                onKeyUp={() => {
                  window.clearTimeout(timer);
                  timer = window.setTimeout(() => {
                    guardarData();
                  }, timeoutVal);
                }}
                onKeyPress={() => {
                  window.clearTimeout(timer);
                }}
                disabled
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function DatosEspecificos({ data }) {
  const [ObraData, setObraData] = useState(data);
  const [ObraDataModificada, setObraDataModificada] = useState({});
  const handleInputChange = (name, value) => {
    setObraData({
      ...ObraData,
      [name]: value,
    });
    setObraDataModificada({
      ...ObraDataModificada,
      [name]: value,
    });
  };
  //autosave input
  let timer,
    timeoutVal = 2000;
  //save data
  async function guardarData() {
    console.log("ObraData", ObraData);
    console.log("ObraData modificada", ObraDataModificada);
  }
  return (
    <div style={{ width: "500px" }}>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th>Codigo SNIP</th>
            <td>
              <Input
                value={ObraData.codigo_snip}
                // onChange={(e) =>
                //   handleInputChange("codigo_snip", e.target.value)
                // }
                // onKeyUp={() => {
                //   window.clearTimeout(timer);
                //   timer = window.setTimeout(() => {
                //     guardarData();
                //   }, timeoutVal);
                // }}
                // onKeyPress={() => {
                //   window.clearTimeout(timer);
                // }}
              />
            </td>
          </tr>
          <tr>
            <th>Función :</th>
            <td>
              <Input
                value={ObraData.funcion}
                onChange={(e) => handleInputChange("funcion", e.target.value)}
                onKeyUp={() => {
                  window.clearTimeout(timer);
                  timer = window.setTimeout(() => {
                    guardarData();
                  }, timeoutVal);
                }}
                onKeyPress={() => {
                  window.clearTimeout(timer);
                }}
              />
            </td>
          </tr>
          <tr>
            <th>Division Funcional:</th>
            <td>
              <Input
                value={ObraData.division_funcional}
                onChange={(e) =>
                  handleInputChange("division_funcional", e.target.value)
                }
                onKeyUp={() => {
                  window.clearTimeout(timer);
                  timer = window.setTimeout(() => {
                    guardarData();
                  }, timeoutVal);
                }}
                onKeyPress={() => {
                  window.clearTimeout(timer);
                }}
              />
            </td>
          </tr>
          <tr>
            <th>Sub-Programa :</th>
            <td>
              <Input
                value={ObraData.subprograma}
                onChange={(e) =>
                  handleInputChange("subprograma", e.target.value)
                }
                onKeyUp={() => {
                  window.clearTimeout(timer);
                  timer = window.setTimeout(() => {
                    guardarData();
                  }, timeoutVal);
                }}
                onKeyPress={() => {
                  window.clearTimeout(timer);
                }}
              />
            </td>
          </tr>
          <tr>
            <th>Fuentes de Financiamiento</th>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function ResumenAvance({ data }) {
  return (
    <div>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th>avance fisico</th>
          </tr>
          <tr>
            <td>S/.{Redondea(data.avancefisico_acumulado)}</td>
          </tr>
          <tr>
            <td>
              {Redondea(
                (data.avancefisico_acumulado / data.presupuesto_costodirecto) *
                  100
              )}
              %
            </td>
          </tr>
          <tr>
            <th>avance financiero</th>
          </tr>
          <tr>
            <td>S/.{Redondea(data.avancefinanciero_acumulado)}</td>
          </tr>
          <tr>
            <td>
              {Redondea((data.avancefisico_acumulado / data.presupuesto) * 100)}
              %
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function Plazos({ data }) {
  useEffect(() => {
    cargarData();
  }, []);
  const [Data, setData] = useState([]);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/obrasPlazos`, {
      params: {
        id_ficha: data.id_ficha,
      },
    });
    setData(res.data);
  }
  return (
    <div style={{ width: "500px" }}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <td>tipo</td>
            <td>fecha inicial</td>
            <td>fecha final</td>
            <td>dias</td>
            <td>resolucion</td>
          </tr>
        </thead>
        <tbody>
          {Data.map((item, i) => (
            <tr>
              <th>{item.tipo_nombre}</th>

              <th>{item.fecha_inicial}</th>
              <th>{item.fecha_final}</th>
              <td>{item.n_dias}</td>
              <td>{item.documento_resolucion_estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Responsables({ data }) {
  useEffect(() => {
    cargarPersonal();
  }, []);
  //Personal
  const [Personal, setPersonal] = useState([]);
  async function cargarPersonal() {
    var res = await axios.get(`${UrlServer}/v1/usuarios/id_cargos`, {
      params: {
        id_ficha: data.id_ficha,
        id_cargos: "30,31,6,7,9,10",
      },
    });
    setPersonal(res.data);
  }
  function buscarPersonal(id) {
    var temp = Personal.find((item) => item.id_cargo == id);
    return temp ? temp.nombre_completo : "";
  }
  return (
    <div style={{ width: "250px" }}>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th>Esp. Téc.</th>
            <td>{buscarPersonal(30)}</td>
          </tr>
          <tr>
            <th>Esp. Adm.</th>
            <td>{buscarPersonal(31)}</td>
          </tr>
          <tr>
            <th>Supervisor</th>
            <td>{buscarPersonal(6)}</td>
          </tr>
          <tr>
            <th>Residente</th>
            <td>{buscarPersonal(7)}</td>
          </tr>
          <tr>
            <th>Asis. Tec.</th>
            <td>{buscarPersonal(9)}</td>
          </tr>
          <tr>
            <th>Asis. Adm.</th>
            <td>{buscarPersonal(10)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function AvanceFisico({ data }) {
  useEffect(() => {
    cargarAcumuladoPrevio();
    cargarData();
    cargarAcumuladoActual();
  }, []);
  //acumlado previo
  const [AcumuladoPrevio, setAcumuladoPrevio] = useState({});
  async function cargarAcumuladoPrevio() {
    var res = await axios.get(`${UrlServer}/v1/avance/acumuladoAnual`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: 2019,
      },
    });
    setAcumuladoPrevio(res.data);
  }
  //acumlado actual
  const [AcumuladoActual, setAcumuladoActual] = useState({});
  async function cargarAcumuladoActual() {
    var res = await axios.get(`${UrlServer}/v1/avance/acumuladoAnual`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: 2020,
      },
    });
    setAcumuladoActual(res.data);
  }
  //data
  const [Data, setData] = useState([]);
  const [DataTotal, setDataTotal] = useState(0);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/avance/resumenAnual`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: 2020,
      },
    });
    setData(res.data);
    var total = res.data.reduce((acc, item) => acc + item.fisico_monto, 0);
    setDataTotal(total);
  }
  function buscarMes(mes) {
    var temp = Data.find((item) => item.mes == mes);
    return temp ? temp.fisico_monto : 0;
  }
  return (
    <div style={{ width: "300px" }}>
      <table style={{ width: "100%" }} className="text-center">
        <tbody>
          <tr>
            <td>A Dic. 2019</td>
            <td>
              {Redondea(
                (AcumuladoPrevio.fisico_monto / data.presupuesto_costodirecto) *
                  100
              )}
              %
            </td>
            <td colSpan="2">S/.{Redondea(AcumuladoPrevio.fisico_monto)}</td>
          </tr>
          {(() => {
            var dataTemp = [];
            for (let i = 1; i <= 6; i++) {
              dataTemp.push(
                <tr>
                  <th>{mesesShort[i - 1]}</th>
                  <td>
                    {Redondea(
                      (buscarMes(i) / data.presupuesto_costodirecto) * 100
                    )}
                  </td>
                  <th>{mesesShort[i + 5]}</th>
                  <td>
                    {Redondea(
                      (buscarMes(i + 6) / data.presupuesto_costodirecto) * 100
                    )}
                  </td>
                </tr>
              );
            }
            return dataTemp;
          })()}
          <tr>
            <td>A. Actual</td>
            <td>
              {Redondea(
                (AcumuladoActual.fisico_monto / data.presupuesto_costodirecto) *
                  100
              )}
              %
            </td>
            <td colSpan="2">S/.{Redondea(AcumuladoActual.fisico_monto)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function Presupuesto({ data, AnyoSeleccionado }) {
  useEffect(() => {
    cargarData();
    cargarAvanceFinancieroAcumulado();
  }, []);
  const [Loading, setLoading] = useState(false);
  //Data
  const [DataFormulario, setDataFormulario] = useState({});
  async function cargarData() {
    setLoading(true);
    var res = await axios.get(`${UrlServer}/v1/presupuesto`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado - 1,
      },
    });
    var res2 = await axios.get(`${UrlServer}/v1/presupuesto`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado,
      },
    });
    setDataFormulario({
      presupuesto_aprobado: res.data.presupuesto_aprobado,
      pia: res2.data.pia,
      pim: res2.data.pim,
    });
    setLoading(false);
  }
  //avance financiero
  const [AvanceFinancieroAcumulado, setAvanceFinancieroAcumulado] = useState(
    {}
  );
  async function cargarAvanceFinancieroAcumulado() {
    var res = await axios.get(`${UrlServer}/v1/avance/acumuladoAnual`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: AnyoSeleccionado - 1,
      },
    });
    setAvanceFinancieroAcumulado(res.data);
  }
  const [ModoEdicion, setModoEdicion] = useState("");
  //guardado automatico

  const [DataFormularioResumen, setDataFormularioResumen] = useState({});
  const handleInputChange = (name, value) => {
    setDataFormulario({
      ...DataFormulario,
      [name]: value,
    });
    setDataFormularioResumen({
      ...DataFormularioResumen,
      [name]: value,
    });
  };

  let timer,
    timeoutVal = 2000;
  async function guardarData() {
    console.log("guardando");
    console.log("data modificada", DataFormularioResumen);
    // window.setTimeout(() => {
    //   setModoEdicion(false);
    // }, 5000);
    if (DataFormularioResumen.presupuesto_aprobado) {
      var res = await axios.put(
        `${UrlServer}/v1/presupuesto/${data.id_ficha}`,
        {
          anyo: AnyoSeleccionado - 1,
          presupuesto_aprobado: DataFormularioResumen.presupuesto_aprobado,
        }
      );
    }
    if (DataFormularioResumen.pia || DataFormularioResumen.pim) {
      var res = await axios.put(
        `${UrlServer}/v1/presupuesto/${data.id_ficha}`,
        {
          anyo: AnyoSeleccionado,
          pia: DataFormularioResumen.pia,
          pim: DataFormularioResumen.pim,
        }
      );
    }
    toast.success("Guardado automatico exitoso", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    cargarData();
  }

  return (
    <div style={{ width: "500px" }}>
      {Loading ? (
        <Spinner type="grow" color="dark" />
      ) : (
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <th colSpan="2">
                Presupuesto Ejecutado al {AnyoSeleccionado - 1}
              </th>
              <th colSpan="2">Prespt. Programado para el {AnyoSeleccionado}</th>
            </tr>
            <tr>
              <td>Presp. Aprob.</td>
              <td onClick={() => setModoEdicion("presupuesto_aprobado")}>
                {ModoEdicion == "presupuesto_aprobado" ? (
                  <Input
                    type="text"
                    value={DataFormulario.presupuesto_aprobado}
                    onChange={(e) =>
                      handleInputChange("presupuesto_aprobado", e.target.value)
                    }
                    onKeyUp={() => {
                      window.clearTimeout(timer);
                      timer = window.setTimeout(() => {
                        guardarData();
                      }, timeoutVal);
                    }}
                    onKeyPress={() => {
                      window.clearTimeout(timer);
                    }}
                  ></Input>
                ) : (
                  Redondea(DataFormulario.presupuesto_aprobado)
                )}
              </td>
              <td>PIA</td>
              <td onClick={() => setModoEdicion("pia")}>
                {ModoEdicion == "pia" ? (
                  <Input
                    type="text"
                    value={DataFormulario.pia}
                    onChange={(e) => handleInputChange("pia", e.target.value)}
                    onKeyUp={() => {
                      window.clearTimeout(timer);
                      timer = window.setTimeout(() => {
                        guardarData();
                      }, timeoutVal);
                    }}
                    onKeyPress={() => {
                      window.clearTimeout(timer);
                    }}
                  ></Input>
                ) : (
                  Redondea(DataFormulario.pia)
                )}
              </td>
            </tr>
            <tr>
              <td rowSpan="2">Ejec. a Dic.19</td>
              <td>{Redondea(AvanceFinancieroAcumulado.financiero_monto)}</td>
              <td>PIM</td>
              <td onClick={() => setModoEdicion("pim")}>
                {ModoEdicion == "pim" ? (
                  <Input
                    type="text"
                    value={DataFormulario.pim}
                    onChange={(e) => handleInputChange("pim", e.target.value)}
                    onKeyUp={() => {
                      window.clearTimeout(timer);
                      timer = window.setTimeout(() => {
                        guardarData();
                      }, timeoutVal);
                    }}
                    onKeyPress={() => {
                      window.clearTimeout(timer);
                    }}
                  ></Input>
                ) : (
                  Redondea(DataFormulario.pim)
                )}
              </td>
            </tr>
            <tr>
              <td>
                {Redondea(
                  (AvanceFinancieroAcumulado.financiero_monto /
                    DataFormulario.presupuesto_aprobado) *
                    100
                )}
              </td>
              <td>T. Asig.</td>
              <td>
                {Redondea(
                  AvanceFinancieroAcumulado.financiero_monto +
                    DataFormulario.pim
                )}
              </td>
            </tr>
            <tr>
              <td rowSpan="2">Saldo</td>
              <td>
                {Redondea(
                  DataFormulario.presupuesto_aprobado -
                    AvanceFinancieroAcumulado.financiero_monto
                )}
              </td>
              <td rowSpan="2">Por Asignar</td>
              <td>
                {Redondea(
                  DataFormulario.presupuesto_aprobado -
                    (AvanceFinancieroAcumulado.financiero_monto +
                      DataFormulario.pim)
                )}
              </td>
            </tr>
            <tr>
              <td>
                {Redondea(
                  ((DataFormulario.presupuesto_aprobado -
                    AvanceFinancieroAcumulado.financiero_monto) /
                    DataFormulario.presupuesto_aprobado) *
                    100
                )}
              </td>
              <td>
                {Redondea(
                  ((DataFormulario.presupuesto_aprobado -
                    (AvanceFinancieroAcumulado.financiero_monto +
                      DataFormulario.pim)) /
                    DataFormulario.presupuesto_aprobado) *
                    100
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
function PresupuestoAnalitico({ data }) {
  useEffect(() => {
    cargarData();
  }, []);
  const [Data, setData] = useState([]);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/analitico/resumen`, {
      params: {
        id_ficha: data.id_ficha,
        anyo: 2020,
      },
    });

    for (let i = 0; i < res.data.length; i++) {
      var devengado_actual = 0;
      const item = res.data[i];
      for (let mes = 1; mes < 12; mes++) {
        devengado_actual += item["financiero_monto_mes" + mes];
      }
      item.devengado_actual = devengado_actual;
    }
    setData(res.data);
  }
  return (
    <div style={{ width: "2000px" }}>
      <table className="text-center">
        <tbody>
          <tr>
            <th className="reporteGeneral-bodySticky-analitico ">
              Descripción
            </th>
            <th>Aprobado (Final)</th>
            <th>Ejecutado al 2019</th>
            <th>Saldo al 2019</th>
            <th>pim al 2020</th>
            <th>devengado</th>
            <th>saldodevengado</th>
            <th>saldoasignar</th>
            {(() => {
              var tempRender = [];
              for (let mes = 1; mes <= 12; mes++) {
                tempRender.push(
                  <th>
                    <div>Prog. x la Obra</div>
                    <div>{mesesShort[mes - 1]}</div>
                  </th>
                );
                tempRender.push(
                  <th>
                    <div>Ejecutado</div>
                    <div>{mesesShort[mes - 1]}</div>
                  </th>
                );
              }
              return tempRender;
            })()}
          </tr>
          {Data.map((item, i) => (
            <tr>
              <th className="reporteGeneral-bodySticky-analitico ">
                {item.nombre}
              </th>
              <td>{Redondea(item.presupuesto_aprobado_anterior)}</td>
              <td>{Redondea(item.financiero_ejecutado_anterior)}</td>
              <td>
                {Redondea(
                  item.presupuesto_aprobado_anterior -
                    item.financiero_ejecutado_anterior
                )}
              </td>
              <td>{Redondea(item.pim_actual)}</td>
              <td>{Redondea(item.devengado_actual)}</td>
              <td>{Redondea(item.pim_actual - item.devengado_actual)}</td>
              <td>
                {" "}
                {Redondea(
                  item.presupuesto_aprobado_anterior -
                    item.financiero_ejecutado_anterior -
                    item.pim_actual
                )}
              </td>
              {(() => {
                var tempRender = [];
                for (let mes = 1; mes <= 12; mes++) {
                  tempRender.push(
                    <td>
                      {Redondea(item["financiero_programado_monto_mes" + mes])}
                    </td>
                  );
                  tempRender.push(
                    <td>{Redondea(item["financiero_monto_mes" + mes])}</td>
                  );
                }
                return tempRender;
              })()}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

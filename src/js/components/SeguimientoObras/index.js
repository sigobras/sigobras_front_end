import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Tooltip } from "reactstrap";
import { ImSad2, ImWink2 } from "react-icons/im";
import "./index.css";
import { UrlServer } from "../Utils/ServerUrlConfig";
import {
  Redondea,
  hexToRgb,
  fechaFormatoClasico,
  getDaysBetweenDates,
  fechaFormatoMesAnyo,
  stringToDateObject,
} from "../Utils/Funciones";
import FisicoBarraPorcentaje from "../Inicio/FisicoBarraPorcentaje";
import FinancieroBarraPorcentaje from "../Inicio/FinancieroBarraPorcentaje";

export default () => {
  useEffect(() => {
    fetchObras();
  }, []);
  const [Obras, setObras] = useState([]);
  async function fetchObras() {
    var res = await axios.post(`${UrlServer}/listaObrasSeguimientoByIdAcceso`, {
      id_acceso: sessionStorage.getItem("idacceso"),
    });
    setObras(res.data);
  }
  const [fechasAnteriorQuincenaData] = useState(fechasAnteriorQuincena());
  const [fechasActualQuincenaData] = useState(fechasActualQuincena());
  function fechasAnteriorQuincena() {
    var d = new Date();
    var dia = d.getDate();
    var dia_inicial = dia > 15 ? 1 : 16;
    var dia_final = dia > 15 ? 15 : 31;

    var mes = d.getMonth() + 1;
    mes = dia > 15 ? mes : mes == 1 ? 12 : mes - 1;
    var anyo = d.getFullYear();
    anyo = dia < 15 ? anyo - 1 : anyo;
    var fecha_inicial = anyo + "-" + mes + "-" + dia_inicial;
    var fecha_final = anyo + "-" + mes + "-" + dia_final;
    // console.log("fecha_inicial", fecha_inicial);
    // console.log("fecha_final", fecha_final);
    return {
      fecha_inicial,
      fecha_final,
    };
  }
  function fechasActualQuincena() {
    var d = new Date();
    var mes = d.getMonth() + 1;
    var anyo = d.getFullYear();
    var dia = d.getDate();
    var dia_inicial = dia > 15 ? 16 : 1;
    var dia_final = dia > 15 ? 31 : 15;
    var fecha_inicial = anyo + "-" + mes + "-" + dia_inicial;
    var fecha_final = anyo + "-" + mes + "-" + dia_final;
    // console.log("fecha_inicial",fecha_inicial);
    // console.log("fecha_final",fecha_final);
    return {
      fecha_inicial,
      fecha_final,
    };
  }
  function compareProgramadoMes(dateString) {
    if (typeof dateString != "string") {
      return false;
    }
    var dateStringArray = dateString.split("-");
    var dateProgramado = new Date(
      dateStringArray[0],
      dateStringArray[1] - 1,
      1
    );
    if (dateProgramado <= new Date()) {
      return false;
    }
    return true;
  }

  const [TooltipFotosHeader, setTooltipFotosHeader] = useState(false);

  const toggleTooltipFotosHeader = () =>
    setTooltipFotosHeader(!TooltipFotosHeader);
  return (
    <div>
      <table className=" text-center table table-bordered">
        <thead>
          <tr>
            <th colSpan="8">Datos de Obra</th>
            <th colSpan="4">Procesos Físicos</th>
            <th colSpan="1">Procesos Financieros</th>
          </tr>
          <tr>
            <th>N°</th>
            <th>Estado de Obra</th>
            <th>Código de Obra</th>
            <th
              style={{
                width: "70px",
              }}
            >
              Inicio de Obra
            </th>
            <th
              style={{
                width: "70px",
              }}
            >
              Plazo Aprobado
            </th>
            <th
              style={{
                width: "70px",
              }}
            >
              Plazo Sin Aprobar
            </th>
            <th>Avance Fisico Acumulado</th>
            <th>Avance Financiero Acumulado</th>
            <th>Fecha de Conclusión Hipotética</th>

            <th id={"fotosHeader"}>Fotos Quincena Anterior</th>
            <th id={"fotosHeader"}>Fotos Quincena Actual </th>
            <Tooltip
              placement={"top"}
              isOpen={TooltipFotosHeader}
              target={"fotosHeader"}
              toggle={toggleTooltipFotosHeader}
            >
              {(() => {
                var fechas1 = fechasAnteriorQuincena();
                var fechas2 = fechasActualQuincena();
                return (
                  <div>
                    Primera quincena
                    <div>{fechaFormatoClasico(fechas1.fecha_inicial)}</div>
                    <div>{fechaFormatoClasico(fechas1.fecha_final)}</div>
                    Segunda quincena
                    <div>{fechaFormatoClasico(fechas2.fecha_inicial)}</div>
                    <div>{fechaFormatoClasico(fechas2.fecha_final)}</div>
                  </div>
                );
              })()}
            </Tooltip>
            <th>Último Día de Metrado</th>

            <th>Último Financiero Editado</th>
          </tr>
        </thead>
        <tbody>
          {Obras.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <EstadoObra id_ficha={item.id_ficha} />
              </td>
              <td>
                <div
                  style={{
                    color: "#17a2b8",
                  }}
                >
                  {item.codigo}
                </div>
                <div>{"S/." + Redondea(item.g_total_presu)}</div>
              </td>
              <td>
                <PrimerPlazo id_ficha={item.id_ficha} />
              </td>
              <td>
                <UltimoPlazoAprobado id_ficha={item.id_ficha} />
              </td>
              <td>
                <UltimoPlazoSinAprobar id_ficha={item.id_ficha} />
              </td>

              <td>
                <FisicoBarraPorcentaje id_ficha={item.id_ficha} tipo="circle" />
              </td>
              <td>
                <FinancieroBarraPorcentaje
                  id_ficha={item.id_ficha}
                  tipo="circle"
                />
              </td>
              <td>
                <div>
                  {" "}
                  {compareProgramadoMes(item.programado_ultima_fecha) ? (
                    <ImWink2 size="20" color="#219e12" />
                  ) : (
                    <ImSad2 size="20" color="#9e1212" />
                  )}
                </div>
                <div>{fechaFormatoMesAnyo(item.programado_ultima_fecha)}</div>
              </td>

              <td>
                <FotosCantidad
                  id_ficha={item.id_ficha}
                  fechas={fechasAnteriorQuincenaData}
                />
              </td>
              <td>
                <FotosCantidad
                  id_ficha={item.id_ficha}
                  fechas={fechasActualQuincenaData}
                />
              </td>
              <td>
                <UltimoDiaMetrado id_ficha={item.id_ficha} />
              </td>

              <td id={"financieroUltimaFecha" + item.id_ficha}>
                <div>
                  {stringToDateObject(item.financiero_ultima_fecha, 7) >
                  new Date() ? (
                    <ImWink2 size="20" color="#219e12" />
                  ) : (
                    <ImSad2 size="20" color="#9e1212" />
                  )}
                </div>
                <div> {fechaFormatoClasico(item.financiero_ultima_fecha)}</div>
                <FinancieroUltimaFechaData id_ficha={item.id_ficha} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
function UltimoDiaMetrado({ id_ficha }) {
  useEffect(() => {
    fetchUltimoMetrado();
  }, []);
  const [UltimoMetrado, setUltimoMetrado] = useState({});
  async function fetchUltimoMetrado() {
    var res = await axios.post(`${UrlServer}/getUltimoDiaMetrado`, {
      id_ficha,
    });
    setUltimoMetrado(res.data.fecha);
  }
  return (
    <div>
      <div>
        {stringToDateObject(UltimoMetrado, 7) > new Date() ? (
          <ImWink2 size="20" color="#219e12" />
        ) : (
          <ImSad2 size="20" color="#9e1212" />
        )}
      </div>
      <div>{fechaFormatoClasico(UltimoMetrado) || ""}</div>
      {getDaysBetweenDates(UltimoMetrado, new Date()) - 1} días
    </div>
  );
}
function PrimerPlazo({ id_ficha }) {
  useEffect(() => {
    fetchPlazoData();
  }, []);
  const [PlazoData, setPlazoData] = useState({});
  async function fetchPlazoData() {
    var res = await axios.get(`${UrlServer}/primerPlazo`, {
      params: {
        id_ficha,
      },
    });
    setPlazoData(res.data);
  }

  return <div>{fechaFormatoClasico(PlazoData.fecha_inicio)}</div>;
}
function UltimoPlazoAprobado({ id_ficha }) {
  useEffect(() => {
    fetchPlazoData();
  }, []);
  const [PlazoData, setPlazoData] = useState({});
  async function fetchPlazoData() {
    var res = await axios.get(`${UrlServer}/ultimoPlazoAprobado`, {
      params: {
        id_ficha,
      },
    });
    setPlazoData(res.data);
  }
  return <div>{fechaFormatoClasico(PlazoData.fecha_final)}</div>;
}
function UltimoPlazoSinAprobar({ id_ficha }) {
  useEffect(() => {
    fetchPlazoData();
  }, []);
  const [PlazoData, setPlazoData] = useState({});
  async function fetchPlazoData() {
    var res = await axios.get(`${UrlServer}/ultimoPlazoSinAprobar`, {
      params: {
        id_ficha,
      },
    });
    setPlazoData(res.data);
  }
  return <div>{fechaFormatoClasico(PlazoData.fecha_final)}</div>;
}
function FotosCantidad({ id_ficha, fechas }) {
  useEffect(() => {
    fetchfotosCantidad1();
  }, []);
  const [fotosCantidad1, setfotosCantidad1] = useState(0);
  async function fetchfotosCantidad1() {
    try {
      var res = await axios.get(`${UrlServer}/fotosCantidad`, {
        params: {
          id_ficha,
          fecha_inicial: fechas.fecha_inicial,
          fecha_final: fechas.fecha_final,
        },
      });
      setfotosCantidad1(res.data.cantidad);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div>
        {" "}
        {fotosCantidad1 >= 5 ? (
          <ImWink2 size="20" color="#219e12" />
        ) : (
          <ImSad2 size="20" color="#9e1212" />
        )}
      </div>
      <div>{fotosCantidad1}</div>
    </div>
  );
}

function EstadoObra({ id_ficha }) {
  useEffect(() => {
    fetchData();
  }, []);
  const [EstadoObra, setEstadoObra] = useState({});
  async function fetchData() {
    var res = await axios.post(`${UrlServer}/getEstadoObra`, {
      id_ficha: id_ficha,
    });
    setEstadoObra(res.data);
  }

  return (
    <Button
      type="button"
      style={{
        borderRadius: "13px",
        "--perceived-lightness":
          "calc((var(--label-r)*0.2126 + var(--label-g)*0.7152 + var(--label-b)*0.0722)/255)",
        "--lightness-switch":
          " max(0,min(calc((var(--perceived-lightness) - var(--lightness-threshold))*-1000),1))",
        padding: " 0 10px",
        lineheight: " 22px!important",
        "--lightness-threshold": " 0.6",
        "--background-alpha": " 0.18",
        "--border-alpha": " 0.3",
        "--lighten-by":
          " calc((var(--lightness-threshold) - var(--perceived-lightness))*100*var(--lightness-switch))",
        background:
          " rgba(var(--label-r),var(--label-g),var(--label-b),var(--background-alpha))",
        color:
          " hsl(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%))",
        bordercolor:
          " hsla(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%),var(--border-alpha))",
        "--label-r": hexToRgb(EstadoObra.color).r,
        "--label-g": hexToRgb(EstadoObra.color).g,
        "--label-b": hexToRgb(EstadoObra.color).b,
        "--label-h": hexToRgb(EstadoObra.color).h,
        "--label-s": hexToRgb(EstadoObra.color).s,
        "--label-l": hexToRgb(EstadoObra.color).l,
        margin: "5px",
        cursor: "default",
      }}
    >
      {EstadoObra.nombre}
    </Button>
  );
}
function FinancieroUltimaFechaData({ id_ficha }) {
  useEffect(() => {
    fetchFinancieroData();
  }, []);
  const [FinancieroData, setFinancieroData] = useState({});
  async function fetchFinancieroData() {
    var res = await axios.get(`${UrlServer}/ultimoFinancieroData`, {
      params: {
        id_ficha,
      },
    });
    setFinancieroData(res.data);
  }
  return FinancieroData.usuario_nombre ? (
    <div style={{ fontSize: "9px" }}>
      <div>
        {/* <div
          style={{
            color: "#17a2b8",
          }}
        >
          {FinancieroData.cargo_nombre}
        </div> */}
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          {FinancieroData.usuario_nombre}
        </div>
      </div>
      <div>
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          Editó:
        </div>
        <div>{fechaFormatoMesAnyo(FinancieroData.fecha_inicial)}</div>
      </div>
    </div>
  ) : (
    <div></div>
  );
}

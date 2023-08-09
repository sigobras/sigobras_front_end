import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Tooltip } from "reactstrap";
import { ImSad2, ImWink2 } from "react-icons/im";
import { TiWarning } from "react-icons/ti";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import { UrlServer } from "../Utils/ServerUrlConfig";
import {
  Redondea,
  hexToRgb,
  fechaFormatoClasico,
  getDaysBetweenDates,
  fechaFormatoMesAnyo,
  stringToDateObject,
  mesesShort,
} from "../Utils/Funciones";
import FisicoBarraPorcentaje from "../Inicio/FisicoBarraPorcentaje";
import FinancieroBarraPorcentaje from "../Inicio/FinancieroBarraPorcentaje";

import "./index.css";

export default ({ recargar }) => {
  const [Obras, setObras] = useState([]);
  const [SortBy, setSortBy] = useState("");
  const [SortByModificador, setSortByModificador] = useState("");

  async function fetchObras() {
    var res = await axios.get(`${UrlServer}/v1/obras`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
        sort_by: SortBy ? SortBy + "-" + SortByModificador : "",
      },
    });
    console.log("res", res);
    setObras(res.data);
  }
  function toggleSortByModificador() {
    if (SortByModificador == "asc") {
      setSortByModificador("desc");
    } else {
      setSortByModificador("asc");
    }
  }
  function setOrderBy(newColum) {
    if (newColum == SortBy) {
      toggleSortByModificador();
    } else {
      setSortBy(newColum);
      setSortByModificador("asc");
    }
  }

  const [fechasAnteriorPeriodoData] = useState(fechasAnteriorPeriodo());
  const [fechasActualPeriodoData] = useState(fechasActualPeriodo());
  function fechasAnteriorPeriodo() {
    var d = new Date();
    d.setDate(1);
    d.setHours(-1);
    var anyo = d.getFullYear();
    var mes = d.getMonth() + 1;
    var dia_inicial = 1;
    var dia_final = new Date(anyo, mes, 0).getDate();
    var fecha_inicial = anyo + "-" + mes + "-" + dia_inicial;
    var fecha_final = anyo + "-" + mes + "-" + dia_final;
    return {
      fecha_inicial,
      fecha_final,
      diasEjecutados: dia_final,
    };
  }
  function fechasActualPeriodo() {
    var d = new Date();
    var anyo = d.getFullYear();
    var mes = d.getMonth() + 1;
    var dia_inicial = 1;
    var dia_final = new Date(anyo, mes + 1, 0).getDate();
    var fecha_inicial = anyo + "-" + mes + "-" + dia_inicial;
    var fecha_final = anyo + "-" + mes + "-" + dia_final;
    var diasEjecutados = new Date().getDate();
    return {
      fecha_inicial,
      fecha_final,
      diasEjecutados,
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
  const [TooltipFotosHeader2, setTooltipFotosHeader2] = useState(false);

  const toggleTooltipFotosHeader = () =>
    setTooltipFotosHeader(!TooltipFotosHeader);
  const toggleTooltipFotosHeader2 = () =>
    setTooltipFotosHeader2(!TooltipFotosHeader2);

  useEffect(() => {
    fetchObras();
  }, [SortBy, SortByModificador]);
  function cabezeraOrderBy(textShow, variable) {
    return (
      <div
        onClick={() => setOrderBy(variable)}
        style={
          SortBy == variable
            ? { cursor: "pointer", backgroundColor: "orange" }
            : {
                cursor: "pointer",
              }
        }
      >
        <span>{textShow}</span>
        {SortBy == variable && (
          <span>
            {SortByModificador == "asc" ? <FaAngleDown /> : <FaAngleUp />}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        className="table table-dark seguimiento-obras text-center"
        style={{ width: "max-content" }}
      >
        <thead>
          <tr>
            <th colSpan="8">Datos de Obra</th>
            <th colSpan="5">Procesos Físicos</th>
            <th colSpan="2">Procesos Financieros</th>
            <th colSpan="1">Infobras</th>
          </tr>
          <tr>
            <th>N°</th>
            <th>Estado de Obra</th>
            <th>
              {cabezeraOrderBy("Código de Obra", "codigo")}
              {cabezeraOrderBy("Presupuesto", "g_total_presu")}
            </th>
            <th>Inicio de Obra</th>
            <th>Plazo Aprobado</th>
            <th>Plazo Sin Aprobar</th>
            <th>
              {cabezeraOrderBy(
                "Avance Fisico Acumulado",
                "avancefisico_acumulado"
              )}
            </th>
            <th>
              {cabezeraOrderBy(
                "Avance Financiero Acumulado",
                "avancefinanciero_acumulado"
              )}
            </th>
            <th>Cronograma Valorizado</th>
            <th>Cronograma Financiero</th>
            <th>Fecha de Conclusión Hipotética</th>

            <th id={"fotosHeader1"}>Fotos Mes Anterior</th>
            <th id={"fotosHeader2"}>Fotos Mes Actual </th>
            <th>Fotos Total</th>
            <th>
              {cabezeraOrderBy(
                "Último Día de Metrado",
                "avancefisico_ultimafecha"
              )}
            </th>
            <th>{cabezeraOrderBy("PIM", "pim_anyoactual")}</th>
            <th>Último Financiero Editado</th>
          </tr>
        </thead>
        <tbody>
          {Obras.map((item, i) => (
            <tr
              key={item.id_ficha}
              style={
                sessionStorage.getItem("idobra") == item.id_ficha
                  ? {
                      backgroundColor: "#171819",
                    }
                  : {}
              }
            >
              <td
                style={{
                  fontSize: "8px",
                }}
              >
                {i + 1}
              </td>
              <td>
                <EstadoObra item={item} />
              </td>
              <td onClick={() => recargar(item)} style={{ cursor: "pointer" }}>
                <div
                  style={{
                    color: "#17a2b8",
                  }}
                >
                  {item.codigo}
                </div>
                <div>{"S/." + Redondea(item.g_total_presu)}</div>
                <div>
                  <span
                    style={{
                      color: "#17a2b8",
                    }}
                  >
                    CUI
                  </span>
                  <span>{" - " + item.codigo_unificado}</span>
                </div>
              </td>
              <td
                onClick={async () => {
                  await recargar(item);
                  // history.push("/plazosHistorial");
                  window.open("plazosHistorial", "_blank");
                }}
                style={{ cursor: "pointer" }}
              >
                <PrimerPlazo item={item} />
              </td>
              <td
                onClick={async () => {
                  await recargar(item);
                  // history.push("/plazosHistorial");
                  window.open("plazosHistorial", "_blank");
                }}
                style={{ cursor: "pointer" }}
              >
                <UltimoPlazoAprobado item={item} />
              </td>
              <td
                onClick={async () => {
                  await recargar(item);
                  // history.push("/plazosHistorial");
                  window.open("plazosHistorial", "_blank");
                }}
                style={{ cursor: "pointer" }}
              >
                <UltimoPlazoSinAprobar item={item} />
              </td>

              <td>
                <FisicoBarraPorcentaje
                  tipo="circle"
                  id_ficha={item.id_ficha}
                  avance={item.avancefisico_acumulado}
                  total={item.presupuesto_costodirecto}
                />
              </td>
              <td>
                <FinancieroBarraPorcentaje
                  tipo="circle"
                  id_ficha={item.id_ficha}
                  avance={item.avancefinanciero_acumulado}
                  total={item.g_total_presu}
                />
              </td>
              <td>
                <CronogramaValorizado id_ficha={item.id_ficha} />
              </td>
              <td>
                <CronogramaFinanciero id_ficha={item.id_ficha} />
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
                  fechas={fechasAnteriorPeriodoData}
                />
              </td>
              <td>
                <FotosCantidad
                  id_ficha={item.id_ficha}
                  fechas={fechasActualPeriodoData}
                />
              </td>
              <td>
                <FotosTotal id_ficha={item.id_ficha} />
              </td>
              <td>
                <UltimoDiaMetrado item={item} />
              </td>
              <td>{"S/." + Redondea(item.pim_anyoactual)}</td>

              <td id={"financieroUltimaFecha" + item.id_ficha}>
                <div>
                  {stringToDateObject(item.financiero_ultima_fecha, 14) >
                  new Date() ? (
                    <ImWink2 size="20" color="#219e12" />
                  ) : (
                    <ImSad2 size="20" color="#9e1212" />
                  )}
                </div>

                <FinancieroUltimaFechaData
                  id_ficha={item.id_ficha}
                  item={item}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
function UltimoDiaMetrado({ item }) {
  return (
    <div>
      <div>
        {stringToDateObject(item.avancefisico_ultimafecha, 7) > new Date() ? (
          <ImWink2 size="20" color="#219e12" />
        ) : (
          <ImSad2 size="20" color="#9e1212" />
        )}
      </div>
      <div>{fechaFormatoClasico(item.avancefisico_ultimafecha) || ""}</div>
      {getDaysBetweenDates(new Date(), item.avancefisico_ultimafecha) - 1} días
    </div>
  );
}
function PrimerPlazo({ item }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return item.plazoinicial_fecha ? (
    <div>
      <div
        style={{
          color: "#17a2b8",
        }}
      >
        {fechaFormatoClasico(item.plazoinicial_fecha)}
      </div>

      <div id={"PrimerPlazo" + item.id_ficha}>
        {getDaysBetweenDates(new Date(), item.plazoinicial_fecha) - 1} d/c
      </div>
      {!item.plazoaprobado_ultimo_fecha &&
        !item.plazosinaprobar_ultimo_fecha && (
          <div>
            <div
              style={{
                color: "#17a2b8",
              }}
            >
              {fechaFormatoClasico(item.plazoinicial_fechafinal)}
            </div>

            <div id={"PrimerPlazo" + item.id_ficha}>
              {getDaysBetweenDates(new Date(), item.plazoinicial_fechafinal) -
                1}{" "}
              d/c
            </div>
          </div>
        )}
      <Tooltip
        placement="bottom"
        isOpen={tooltipOpen}
        target={"PrimerPlazo" + item.id_ficha}
        toggle={toggle}
      >
        Desde el inicio hasta hoy
      </Tooltip>
    </div>
  ) : (
    <div>
      <TiWarning size="20" color="orange" />
    </div>
  );
}
function UltimoPlazoAprobado({ item }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return item.plazoaprobado_ultimo_fecha ? (
    <div>
      <div
        style={{
          color: "#17a2b8",
        }}
      >
        {fechaFormatoClasico(item.plazoaprobado_ultimo_fecha)}
      </div>

      <div id={"UltimoPlazoAprobado" + item.id_ficha}>
        {getDaysBetweenDates(item.plazoaprobado_ultimo_fecha, new Date()) - 1}{" "}
        d/c
      </div>
      <Tooltip
        placement="bottom"
        isOpen={tooltipOpen}
        target={"UltimoPlazoAprobado" + item.id_ficha}
        toggle={toggle}
      >
        Dias a la fecha actual
      </Tooltip>
    </div>
  ) : (
    <div>
      <TiWarning size="20" color="orange" />
    </div>
  );
}
function UltimoPlazoSinAprobar({ item }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return item.plazosinaprobar_ultimo_fecha ? (
    <div>
      <div
        style={{
          color: "#17a2b8",
        }}
      >
        {fechaFormatoClasico(item.plazosinaprobar_ultimo_fecha)}
      </div>

      <div id={"UltimoPlazoSinAprobar" + item.id_ficha}>
        {getDaysBetweenDates(item.plazosinaprobar_ultimo_fecha, new Date()) - 1}{" "}
        d/c
      </div>
      <Tooltip
        placement="bottom"
        isOpen={tooltipOpen}
        target={"UltimoPlazoSinAprobar" + item.id_ficha}
        toggle={toggle}
      >
        Dias a la fecha actual
      </Tooltip>
    </div>
  ) : (
    <div></div>
  );
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
        {fechas.diasEjecutados / fotosCantidad1 <= 3 ? (
          <ImWink2 size="20" color="#219e12" />
        ) : (
          <ImSad2 size="20" color="#9e1212" />
        )}
      </div>
      <div>{fotosCantidad1}</div>
    </div>
  );
}
function EstadoObra({ item }) {
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
        "--label-r": hexToRgb(item.estadoobra_color).r,
        "--label-g": hexToRgb(item.estadoobra_color).g,
        "--label-b": hexToRgb(item.estadoobra_color).b,
        "--label-h": hexToRgb(item.estadoobra_color).h,
        "--label-s": hexToRgb(item.estadoobra_color).s,
        "--label-l": hexToRgb(item.estadoobra_color).l,
        margin: "5px",
        cursor: "default",
        fontSize: "10px",
      }}
    >
      {item.estadoobra_nombre}
    </Button>
  );
}
function FinancieroUltimaFechaData({ id_ficha, item }) {
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
        {"El: "}
        {fechaFormatoClasico(item.financiero_ultima_fecha)}
      </div>
      <div>
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
function FotosTotal({ id_ficha }) {
  useEffect(() => {
    fetchFotosCantidad();
  }, []);
  const [FotosCantidad, setFotosCantidad] = useState(0);
  async function fetchFotosCantidad() {
    var res = await axios.get(`${UrlServer}/fotosCantidadTotal`, {
      params: {
        id_ficha,
      },
    });
    setFotosCantidad(res.data.cantidad);
  }
  return <div>{FotosCantidad}</div>;
}
function InformesInfobras({ id_ficha, item }) {
  useEffect(() => {
    cargarData();
  }, []);
  const [Data, setData] = useState([]);
  async function cargarData() {
    var res = await axios.get(`${UrlServer}/v1/infobras/informes`, {
      params: {
        id_ficha,
        estado_presentado: 1,
        fecha_inicio: item.plazoinicial_fecha,
      },
    });
    setData(res.data);
  }
  return (
    <div className="seguimiento-obras_informes-infobras">
      {Data.map((item, i) => (
        <div>
          <span>{mesesShort[item.mes - 1] + " -  "}</span>
          <span style={{ color: "#17a2b8" }}> {item.anyo}</span>
        </div>
      ))}
    </div>
  );
}
function CronogramaValorizado({ id_ficha }) {
  useEffect(() => {
    cargarCurvaS_Acumulados();
    cargarCostoDirecto();
  }, []);
  //acumulados
  const [CurvaS_Acumulados, setCurvaS_Acumulados] = useState({
    programado_acumulado: 0,
  });
  async function cargarCurvaS_Acumulados() {
    const res = await axios.post(`${UrlServer}/getDataCurvaSAcumulados`, {
      id_ficha,
      anyo: new Date().getFullYear(),
    });
    setCurvaS_Acumulados(res.data);
  }
  //costoDirecto
  const [CostoDirecto, setCostoDirecto] = useState({ monto: 0 });
  async function cargarCostoDirecto() {
    const res = await axios.get(`${UrlServer}/v1/componentes/costoDirecto`, {
      params: {
        id_ficha,
      },
    });
    setCostoDirecto(res.data);
  }
  return (
    <div>
      <div>
        {Math.abs(CostoDirecto.monto - CurvaS_Acumulados.programado_acumulado) <
        0.01 ? (
          <ImWink2 size="20" color="#219e12" />
        ) : (
          <ImSad2 size="20" color="#9e1212" />
        )}
      </div>
      S/.{Redondea(CostoDirecto.monto - CurvaS_Acumulados.programado_acumulado)}
    </div>
  );
}
function CronogramaFinanciero({ id_ficha }) {
  useEffect(() => {
    fetchPimMonto();
    fetchprogramadoAcumulado();
  }, []);
  //pim
  const [PimMonto, setPimMonto] = useState(0);
  async function fetchPimMonto() {
    const res = await axios.get(`${UrlServer}/v1/fuentesFinancieamiento/pim`, {
      params: {
        id_ficha,
        anyo: new Date().getFullYear(),
      },
    });
    setPimMonto(res.data.pim);
  }
  //acumulado anyo especifico
  const [programadoAcumulado, setprogramadoAcumulado] = useState(0);
  async function fetchprogramadoAcumulado() {
    const res = await axios.get(
      `${UrlServer}/v1/fuentesFinancieamiento/pim/programado`,
      {
        params: {
          id_ficha,
          anyo: new Date().getFullYear(),
        },
      }
    );
    setprogramadoAcumulado(res.data.programado);
  }
  return (
    <div>
      {PimMonto != 0 && (
        <div>
          {PimMonto - programadoAcumulado == 0 ? (
            <ImWink2 size="20" color="#219e12" />
          ) : (
            <ImSad2 size="20" color="#9e1212" />
          )}
        </div>
      )}
      S/.{Redondea(PimMonto - programadoAcumulado)}
    </div>
  );
}

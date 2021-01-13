import React, { useState, useEffect } from "react";
import { UrlServer } from "../Utils/ServerUrlConfig";
import {
  Redondea,
  hexToRgb,
  fechaFormatoClasico,
  getDaysBetweenDates,
  mesesShort,
  fechaFormatoMesAnyo,
} from "../Utils/Funciones";
import axios from "axios";
import "./index.css";
import { Button, Input, Tooltip } from "reactstrap";
import { FaRegSmile, FaRegSadCry, FaEyeSlash } from "react-icons/fa";
import { ImSad2, ImWink2 } from "react-icons/im";
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
  function stringToDateObject(dateString, dias = 0) {
    if (typeof dateString != "string") {
      return new Date();
    }
    var dateStringArray = dateString.split("-");
    var date = new Date(
      dateStringArray[0],
      dateStringArray[1] - 1,
      dateStringArray[2]
    );
    if (dias != 0) {
      date.setDate(date.getDate() + dias);
    }
    return date;
  }
  const [TooltipFotosHeader, setTooltipFotosHeader] = useState(false);

  const toggleTooltipFotosHeader = () =>
    setTooltipFotosHeader(!TooltipFotosHeader);

  return (
    <div>
      <table className=" text-center table table-bordered">
        <thead>
          <tr>
            <th colSpan="5">Datos de Obra</th>
            <th colSpan="4">Procesos Físicos</th>
            <th colSpan="1">Procesos Financieros</th>
          </tr>
          <tr>
            <th>N°</th>
            <th>Estado de Obra</th>
            <th>Código de Obra</th>
            <th>Avance Fisico Acumulado</th>
            <th>Avance Financiero Acumulado</th>
            <th>Último Día de Metrado</th>
            <th>Plazos</th>
            <th>Fecha de Conclusión Hipotética</th>
            <th id={"fotosHeader"}>Fotos</th>
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

            <th>Último Financiero Editado</th>

            {/* <th>Personal</th> */}
            {/* <th>Ficha Tenica</th> */}
            {/* <th>Personal</th> */}
            {/* <th>Tareo</th> */}
            {/* <th>Certitifacos</th> */}
            {/* <th>Devengados</th> */}
            {/* <th>PIM</th> */}
            {/* <th>Informe mensual</th> */}
          </tr>
        </thead>
        <tbody>
          {Obras.map((item, i) => (
            <tr key={i} className="fechas-width">
              <td>{i + 1}</td>
              <EstadoObra id_ficha={item.id_ficha} />
              <td>{item.codigo}</td>
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
                <UltimoDiaMetrado id_ficha={item.id_ficha} />
              </td>
              <td>
                <Plazos_info id_ficha={item.id_ficha} />
              </td>
              <td>
                {fechaFormatoMesAnyo(item.programado_ultima_fecha)}
                {compareProgramadoMes(item.programado_ultima_fecha) ? (
                  <ImWink2 size="20" color="#219e12" />
                ) : (
                  <ImSad2 size="20" color="#9e1212" />
                )}
              </td>
              <td>
                <FotosCantidad
                  id_ficha={item.id_ficha}
                  fechasAnteriorQuincena={fechasAnteriorQuincena}
                  fechasActualQuincena={fechasActualQuincena}
                />
              </td>

              <td id={"financieroUltimaFecha" + item.id_ficha}>
                {fechaFormatoClasico(item.financiero_ultima_fecha)}
                {stringToDateObject(item.financiero_ultima_fecha, 7) >
                new Date() ? (
                  <ImWink2 size="20" color="#219e12" />
                ) : (
                  <ImSad2 size="20" color="#9e1212" />
                )}
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
      <div>{fechaFormatoClasico(UltimoMetrado) || ""}</div>
      {getDaysBetweenDates(UltimoMetrado, new Date()) - 1} días
    </div>
  );
}
function Plazos_info({ id_ficha }) {
  useEffect(() => {
    fetchPrimerPlazo();
    fetchUltimoPlazoAprobado();
    fetchUltimoPlazoSinAprobar();
  }, []);
  const [PrimerPlazo, setPrimerPlazo] = useState({});
  async function fetchPrimerPlazo() {
    var res = await axios.get(`${UrlServer}/primerPlazo`, {
      params: {
        id_ficha,
      },
    });
    setPrimerPlazo(res.data);
  }
  const [UltimoPlazoAprobado, setUltimoPlazoAprobado] = useState({});
  async function fetchUltimoPlazoAprobado() {
    var res = await axios.get(`${UrlServer}/ultimoPlazoAprobado`, {
      params: {
        id_ficha,
      },
    });
    setUltimoPlazoAprobado(res.data);
  }
  const [UltimoPlazoSinAprobar, setUltimoPlazoSinAprobar] = useState({});
  async function fetchUltimoPlazoSinAprobar() {
    var res = await axios.get(`${UrlServer}/ultimoPlazoSinAprobar`, {
      params: {
        id_ficha,
      },
    });
    setUltimoPlazoSinAprobar(res.data);
  }
  return (
    <div>
      {PrimerPlazo.fecha_inicio && (
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          Inicio de obra
        </div>
      )}

      <div>{fechaFormatoClasico(PrimerPlazo.fecha_inicio)}</div>

      {UltimoPlazoAprobado.fecha_final && (
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          Ultimo plazo aprobado
        </div>
      )}

      <div>{fechaFormatoClasico(UltimoPlazoAprobado.fecha_final)}</div>
      {UltimoPlazoSinAprobar.fecha_final && (
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          Ultimo plazo sin aprobar
        </div>
      )}
      <div>{fechaFormatoClasico(UltimoPlazoSinAprobar.fecha_final)}</div>
    </div>
  );
}
function FotosCantidad({
  id_ficha,
  fechasAnteriorQuincena,
  fechasActualQuincena,
}) {
  useEffect(() => {
    fetchfotosCantidad1();
    fetchfotosCantidad2();
  }, []);
  const [fotosCantidad1, setfotosCantidad1] = useState(0);
  async function fetchfotosCantidad1() {
    try {
      var fechas = fechasAnteriorQuincena();

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
  const [fotosCantidad2, setfotosCantidad2] = useState(0);
  async function fetchfotosCantidad2() {
    try {
      var fechas = fechasActualQuincena();

      var res = await axios.get(`${UrlServer}/fotosCantidad`, {
        params: {
          id_ficha,
          fecha_inicial: fechas.fecha_inicial,
          fecha_final: fechas.fecha_final,
        },
      });
      setfotosCantidad2(res.data.cantidad);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div>
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          anterior quincena
        </div>
        {fotosCantidad1}
        {fotosCantidad1 >= 5 ? (
          <ImWink2 size="20" color="#219e12" />
        ) : (
          <ImSad2 size="20" color="#9e1212" />
        )}
      </div>
      <div>
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          actual quincena
        </div>
        {fotosCantidad2}
        {fotosCantidad2 >= 5 ? (
          <ImWink2 size="20" color="#219e12" />
        ) : (
          <ImSad2 size="20" color="#9e1212" />
        )}
      </div>
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
    <div>
      <div>
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          {FinancieroData.cargo_nombre}
        </div>
        <div>{FinancieroData.usuario_nombre}</div>
      </div>
      <div>
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          Edito:
        </div>
        <div>{fechaFormatoMesAnyo(FinancieroData.fecha_inicial)}</div>
      </div>
    </div>
  ) : (
    <div></div>
  );
}

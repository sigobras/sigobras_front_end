import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Input } from "reactstrap";

import { UrlServer } from "../Utils/ServerUrlConfig";
import FinancieroBarraPorcentaje from "./FinancieroBarraPorcentaje";
import FisicoBarraPorcentaje from "./FisicoBarraPorcentaje";
import { Redondea, hexToRgb, fechaFormatoClasico } from "../Utils/Funciones";
import CarouselNavs from "./Carousel/CarouselNavs";

import "../../../css/inicio.css";
export default () => {
  //funciones
  useEffect(() => {
    fetchProvincias();
  }, []);
  //comunicados
  function calcular_dias(fecha_inicio, fecha_final) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(fecha_inicio);
    const secondDate = new Date(fecha_final);
    var days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return days || 0;
  }
  //provincias
  const [Provincias, setProvincias] = useState([]);
  async function fetchProvincias() {
    var res = await axios.get(`${UrlServer}/v1/unidadEjecutora/public`);
    setProvincias(res.data);
  }
  const [ProvinciaSeleccionada, setProvinciaSeleccionada] = useState(0);

  //sectores
  const [Sectores, setSectores] = useState([]);
  const [SectoreSeleccionado, setSectoreSeleccionado] = useState(0);
  async function fetchSectores() {
    var res = await axios.get(`${UrlServer}/v1/sectores/public`, {
      params: {
        id_unidadEjecutora: ProvinciaSeleccionada,
      },
    });
    setSectores(res.data);
  }
  //obras
  const [Obras, setObras] = useState([]);
  async function fetchObras() {
    var res = await axios.get(`${UrlServer}/v1/obras/public`, {
      params: {
        id_unidadEjecutora: ProvinciaSeleccionada,
        idsectores: SectoreSeleccionado,
      },
    });
    setObras(res.data);
  }
  useEffect(() => {
    if (ProvinciaSeleccionada != -1) {
      fetchSectores();
      setSectoreSeleccionado(0);
    }
  }, [ProvinciaSeleccionada]);

  useEffect(() => {
    if (ProvinciaSeleccionada != -1) {
      fetchObras();
    }
  }, [ProvinciaSeleccionada, SectoreSeleccionado]);

  return (
    <div>
      <div className="fondo"></div>
      <div
        style={{
          display: "flex",
        }}
      >
        <Input
          type="select"
          onChange={(e) => {
            setProvinciaSeleccionada(e.target.value);
          }}
          value={ProvinciaSeleccionada}
          style={{
            backgroundColor: "#171819",
            borderColor: "#171819",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          <option value="0">TODAS LAS PROVINCIAS</option>
          {Provincias.map((item, i) => (
            <option key={i} value={item.id_unidadEjecutora}>
              {item.nombre}
            </option>
          ))}
        </Input>
        <Input
          type="select"
          onChange={(e) => setSectoreSeleccionado(e.target.value)}
          value={SectoreSeleccionado}
          style={{
            backgroundColor: "#171819",
            borderColor: "#171819",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          <option value="0">Todos los sectores</option>
          {Sectores.map((item, i) => (
            <option key={i} value={item.idsectores}>
              {item.nombre}
            </option>
          ))}
        </Input>
      </div>
      {
        <table className="table table-sm">
          <thead>
            <tr>
              <th className="text-center">N°</th>
              <th>OBRA</th>
              <th className="text-center">ESTADO</th>
              <th className="text-center">AVANCE </th>
              <th className="text-center">OPCIONES</th>
            </tr>
          </thead>
          <tbody>
            {Obras.map((item, i) => [
              (i == 0 ||
                (i > 0 &&
                  item.unidad_ejecutora_nombre !=
                    Obras[i - 1].unidad_ejecutora_nombre)) && (
                <tr key={i}>
                  <td
                    colSpan="8"
                    style={{
                      color: "#cecece",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                    }}
                  >
                    {item.unidad_ejecutora_nombre}
                  </td>
                </tr>
              ),

              (i == 0 ||
                item.unidad_ejecutora_nombre !=
                  Obras[i - 1].unidad_ejecutora_nombre ||
                (i > 0 &&
                  item.sector_nombre != Obras[i - 1].sector_nombre)) && (
                <tr key={i + "2"}>
                  <td
                    colSpan="8"
                    style={{
                      color: "#ffa500",
                      fontSize: "1rem",
                      fontWeight: "700",
                    }}
                  >
                    {item.sector_nombre}
                  </td>
                </tr>
              ),
              <tr key={item.id_ficha}>
                <td>{i + 1}</td>
                <td>
                  <Button
                    type="button"
                    style={{
                      borderRadius: "13px",
                      // padding: " 0 10px",
                      margin: "5px",
                      backgroundColor: "#171819",
                    }}
                  >
                    {item.codigo}
                  </Button>
                  {item.g_meta + "/CUI - " + item.codigo_unificado}
                  <div
                    style={{
                      color: "#17a2b8",
                    }}
                  >
                    PRESUPUESTO S./{Redondea(item.g_total_presu)}
                  </div>
                  <Plazos_info item={item} />
                </td>
                <td>
                  <EstadoObra item={item} />
                </td>
                <td
                  style={{
                    width: "15%",
                  }}
                >
                  <FisicoBarraPorcentaje
                    tipo="barra"
                    id_ficha={item.id_ficha}
                    avance={item.avancefisico_acumulado}
                    total={item.presupuesto_costodirecto}
                  />
                  <FinancieroBarraPorcentaje
                    tipo="barra"
                    id_ficha={item.id_ficha}
                    avance={item.avancefinanciero_acumulado}
                    total={item.g_total_presu}
                  />
                </td>
                <td>
                  <div className="d-flex">
                    <CarouselNavs
                      id_ficha={item.id_ficha}
                      codigo={item.codigo}
                    />
                  </div>
                </td>
              </tr>,
            ])}
          </tbody>
        </table>
      }
    </div>
  );
};
//componente de estado de obra
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
      }}
    >
      {item.estadoobra_nombre}
    </Button>
  );
}
//avancecomponente
function Plazos_info({ item }) {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {item.plazoinicial_fecha && (
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          Inicio de obra
        </div>
      )}
      &nbsp;
      <div>{fechaFormatoClasico(item.plazoinicial_fecha)}</div> &nbsp;
      {item.plazoaprobado_ultimo_fecha && (
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          Ultimo plazo aprobado
        </div>
      )}
      &nbsp;
      <div>{fechaFormatoClasico(item.plazoaprobado_ultimo_fecha)}</div> &nbsp;
      {item.plazosinaprobar_ultimo_fecha && (
        <div
          style={{
            color: "#17a2b8",
          }}
        >
          Ultimo plazo sin aprobar
        </div>
      )}
      &nbsp;
      <div>{fechaFormatoClasico(item.plazosinaprobar_ultimo_fecha)}</div>
    </div>
  );
}

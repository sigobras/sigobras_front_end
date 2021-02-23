import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiEyeFill, RiDownload2Fill } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort, fechaFormatoClasico } from "../Utils/Funciones";
import DatosEspecificos from "./DatosEspecificos";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data, recargar }) => {
  useEffect(() => {
    cargarData();
  }, []);
  const [Loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  async function cargarData() {
    setLoading(true);
    var res = await axios.get(`${UrlServer}/v1/obrasPlazos`, {
      params: {
        id_ficha: data.id_ficha,
      },
    });
    setData(res.data);
    setLoading(false);
  }
  //descargar archivo
  function DescargarArchivo(data) {
    if (confirm("Desea descargar el memorandum?")) {
      const url = data;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data, "target", "_blank");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
    }
  }
  return (
    <div style={{ width: "600px" }}>
      {Loading ? (
        <Spinner type="grow" color="dark" />
      ) : (
        <table className="reporteGeneral-table" style={{ width: "100%" }}>
          <tbody className="reporteGeneral-titulos">
            <tr>
              <th>decripción</th>
              <th style={{ width: "60px" }}>fecha inicial</th>
              <th style={{ width: "60px" }}>fecha final</th>
              <th>N° días</th>
              <th>resolución N°</th>
              <th>plazo aprobado </th>
              <th>documento</th>
            </tr>
            {Data.map((item, i) => (
              <tr key={i}>
                <td>{item.descripcion}</td>

                <td>{fechaFormatoClasico(item.fecha_inicial)}</td>
                <td>{fechaFormatoClasico(item.fecha_final)}</td>
                <td>{item.n_dias}</td>
                <td>{item.documento_resolucion_estado}</td>
                <td>{item.plazo_aprobado ? "Aprobado" : "Sin aprobar	"}</td>
                <td>
                  {item.archivo && (
                    <div
                      className="text-primary"
                      onClick={() =>
                        DescargarArchivo(`${UrlServer}${item.archivo}`)
                      }
                      style={{
                        cursor: "pointer",
                        width: "100%",
                      }}
                      id="TooltipExample2"
                    >
                      <RiDownload2Fill size={20} color={"#17a2b8"} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
            <tr
              style={{
                fontWeight: 700,
              }}
            >
              <td
                colSpan="3"
                style={{
                  textAlign: "right",
                }}
              >
                TOTAL DIAS APROBADOS
              </td>
              <td>
                {(() => {
                  return Data.reduce((acu, item) => {
                    if (item.plazo_aprobado) {
                      return acu + item.n_dias;
                    }
                    return acu;
                  }, 0);
                })()}
              </td>
              <td colSpan="3"></td>
            </tr>
            <tr
              style={{
                fontWeight: 700,
              }}
            >
              <td
                colSpan="3"
                style={{
                  textAlign: "right",
                }}
              >
                TOTAL DIAS SIN APROBAR
              </td>
              <td>
                {(() => {
                  return Data.reduce((acu, item) => {
                    if (!item.plazo_aprobado) {
                      return acu + item.n_dias;
                    }
                    return acu;
                  }, 0);
                })()}
              </td>
              <td colSpan="3"></td>
            </tr>
            <tr
              style={{
                fontWeight: 700,
              }}
            >
              <td
                colSpan="3"
                style={{
                  textAlign: "right",
                }}
              >
                PLAZO DE EJECUCION TOTAL
              </td>
              <td>
                {(() => {
                  return Data.reduce((acu, item) => acu + item.n_dias, 0);
                })()}
              </td>
              <td colSpan="3"></td>
            </tr>
          </tbody>
        </table>
      )}
      <Button
        onClick={async () => {
          await recargar(data);
          // history.push("/plazosHistorial");
          window.open("plazosHistorial", "_blank");
        }}
      >
        Ir A plazos
      </Button>
    </div>
  );
};

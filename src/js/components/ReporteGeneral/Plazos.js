import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiEyeFill, RiDownload2Fill } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
import DatosEspecificos from "./DatosEspecificos";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data, recargar }) => {
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
    <div style={{ width: "500px" }}>
      <table style={{ width: "100%" }}>
        <tbody className="reporteGeneral-titulos">
          <tr>
            <th>tipo</th>
            <th>fecha inicial</th>
            <th>fecha final</th>
            <th>dias</th>
            <th>resolucion</th>
            <th>archivo</th>
          </tr>
          {Data.map((item, i) => (
            <tr key={i}>
              <td>{item.tipo_nombre}</td>

              <td>{item.fecha_inicial}</td>
              <td>{item.fecha_final}</td>
              <td>{item.n_dias}</td>
              <td>{item.documento_resolucion_estado}</td>
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
        </tbody>
      </table>
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

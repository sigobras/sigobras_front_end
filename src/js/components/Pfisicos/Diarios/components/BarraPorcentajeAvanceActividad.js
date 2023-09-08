import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import axios from "axios";
import { UrlServer } from "../../../Utils/ServerUrlConfig";
import { Redondea, Redondea1 } from "../../../Utils/Funciones";
export default forwardRef(({ id_actividad }, ref) => {
  useEffect(() => {
    fectchAvanceActividad();
  }, []);
  const [AvanceActividad, setAvanceActividad] = useState({});
  const [AvanceActividadPorcentaje, setAvanceActividadPorcentaje] = useState(0);
  async function fectchAvanceActividad() {
    const request = await axios.post(`${UrlServer}/getAvanceActividad`, {
      id_actividad: id_actividad,
    });
    setAvanceActividad(request.data);
    setAvanceActividadPorcentaje(
      Redondea1((request.data.avance_metrado / request.data.metrado) * 100)
    );
  }
  useImperativeHandle(ref, () => ({
    recarga() {
      fectchAvanceActividad();
    },
  }));
  return (
    <div>
      <div className="clearfix">
        <span className="float-left text-warning">
          Avance: {Redondea(AvanceActividad.avance_metrado)}
        </span>
        <span className="float-right text-warning">
          S/. {Redondea(AvanceActividad.avance_soles)}
        </span>
      </div>
      {/* BARRA DE PROCENTAJE PARTIDAS   */}
      <div
        style={{
          height: "3px",
          width: "100%",
          background: "#c3bbbb",
        }}
      >
        <div
          style={{
            width: `${AvanceActividadPorcentaje}%`,
            height: "100%",
            background:
              AvanceActividadPorcentaje > 85
                ? "#a4fb01"
                : AvanceActividadPorcentaje > 30
                ? "#0080ff"
                : "#ff2e00",
            transition: "all .9s ease-in",
          }}
        />
      </div>
      <div className="clearfix">
        <span className="float-left text-info">
          Saldo:{" "}
          {Redondea(AvanceActividad.metrado - AvanceActividad.avance_metrado)}
        </span>
        <span className="float-right text-info">
          S/.
          {Redondea(AvanceActividad.presupuesto - AvanceActividad.avance_soles)}
        </span>
      </div>
    </div>
  );
});

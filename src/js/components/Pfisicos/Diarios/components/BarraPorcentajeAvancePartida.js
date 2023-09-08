import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { UrlServer } from "../../../Utils/ServerUrlConfig";
import { Redondea, Redondea1 } from "../../../Utils/Funciones";
export default forwardRef(({ id_partida }, ref) => {
  useEffect(() => {
    fectchAvancePartida();
  }, []);
  const [AvancePartida, setAvancePartida] = useState({});
  const [AvancePartidaPorcentaje, setAvancePartidaPorcentaje] = useState(0);
  async function fectchAvancePartida() {
    const request = await axios.post(`${UrlServer}/getAvancePartida`, {
      id_partida: id_partida,
    });
    setAvancePartida(request.data);
    setAvancePartidaPorcentaje(
      Redondea1((request.data.avance_metrado / request.data.metrado) * 100)
    );
  }
  useImperativeHandle(ref, () => ({
    recarga() {
      fectchAvancePartida();
    },
  }));

  return (
    <div>
      <div className="clearfix">
        <span className="float-left text-warning">
          Avance: {Redondea(AvancePartida.avance_metrado)}
        </span>
        <span className="float-right text-warning">
          S/. {Redondea(AvancePartida.avance_soles)}
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
            width: `${AvancePartidaPorcentaje}%`,
            height: "100%",
            background:
              AvancePartidaPorcentaje > 85
                ? "#a4fb01"
                : AvancePartidaPorcentaje > 30
                ? "#0080ff"
                : "#ff2e00",
            transition: "all .9s ease-in",
          }}
        />
      </div>
      <div className="clearfix">
        <span className="float-left text-info">
          Saldo:{" "}
          {Redondea(AvancePartida.metrado - AvancePartida.avance_metrado)}
        </span>
        <span className="float-right text-info">
          S/.{Redondea(AvancePartida.presupuesto - AvancePartida.avance_soles)}
        </span>
      </div>
    </div>
  );
});

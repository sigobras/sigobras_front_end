import React, { useState, useEffect } from "react";
import axios from "axios";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, Redondea1 } from "../Utils/Funciones";
import { Button, Input, Tooltip } from "reactstrap";
import Circle from "react-circle";
export default ({ id_ficha, tipo }) => {
  useEffect(() => {
    fetchFisicoAvance();
  }, []);

  const [FisicoAvance, setFisicoAvance] = useState({
    fisico_avance_porcentaje: 0,
  });
  async function fetchFisicoAvance() {
    const request = await axios.post(`${UrlServer}/getFisico`, {
      id_ficha: id_ficha,
    });
    setFisicoAvance(request.data);
  }
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <div>
      {tipo == "circle" && (
        <div style={{}}>
          <Circle
            progress={Redondea1(FisicoAvance.fisico_avance_porcentaje)}
            size="50"
            textStyle={{
              font: "bold 80px Helvetica, Arial, sans-serif", // CSSProperties: Custom styling for percentage.
            }}
          />
        </div>
      )}
      {tipo == "barra" && (
        <div
          style={{
            width: "100%",
            height: "20px",
            textAlign: "center",
            paddingBottom: "28px",
          }}
        >
          <div
            style={{
              height: "2px",
              backgroundColor: "#4a4b4c",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${FisicoAvance.fisico_avance_porcentaje}%`,
                height: "100%",
                backgroundColor: "#17a2b8",
                borderRadius: "5px",
                transition: "all .9s ease-in",
                position: "absolute",
              }}
            />
            <span
              style={{
                position: "inherit",
                top: "6px",
                color: "#8caeda",
                fontSize: "12px",
                color: "#ffffff",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
              id={"FisicoBarraPorcentaje-" + id_ficha}
            >
              Físico
              <div
                style={{
                  fontSize: "13px",
                }}
              >
                -({Redondea(FisicoAvance.fisico_avance_porcentaje)} %)
              </div>
            </span>
            <Tooltip
              placement={"top"}
              isOpen={tooltipOpen}
              target={"FisicoBarraPorcentaje-" + id_ficha}
              toggle={toggle}
            >
              S/.{Redondea(FisicoAvance.fisico_avance)}
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

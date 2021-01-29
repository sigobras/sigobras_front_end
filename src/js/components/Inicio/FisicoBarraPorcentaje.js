import React, { useState } from "react";
import { Tooltip } from "reactstrap";
import Circle from "react-circle";

import { Redondea, Redondea1 } from "../Utils/Funciones";
export default ({ tipo, id_ficha, avance, total }) => {
  const [RandNumber, setRandNumber] = useState(Math.floor(Math.random() * 10));
  const [FisicoAvance] = useState({
    fisico_avance_porcentaje: (avance / total) * 100,
  });
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <div>
      {tipo == "circle" && (
        <div style={{}}>
          <Circle
            progress={Redondea1(FisicoAvance.fisico_avance_porcentaje)}
            size="25"
            showPercentage={false}
            lineWidth={50}
            progressColor="#17a2b8"
          />
          <div
            style={{
              color: "#17a2b8",
            }}
          >
            {Redondea1(FisicoAvance.fisico_avance_porcentaje) + "%"}
          </div>
          <div>{"S/." + Redondea(avance)}</div>
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
                width: `${
                  FisicoAvance.fisico_avance_porcentaje > 100
                    ? 100
                    : FisicoAvance.fisico_avance_porcentaje
                }%`,
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
              id={"FisicoBarraPorcentaje-" + id_ficha + RandNumber}
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
              target={"FisicoBarraPorcentaje-" + id_ficha + RandNumber}
              toggle={toggle}
            >
              S/.{Redondea(avance)}
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

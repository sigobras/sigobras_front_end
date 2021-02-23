import React, { useState, useEffect } from "react";
import axios from "axios";
import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, Redondea1 } from "../Utils/Funciones";
import { Button, Input, Tooltip } from "reactstrap";
import Circle from "react-circle";
export default ({ tipo, id_ficha, avance, total }) => {
  const [FinancieroAvance, setFinancieroAvance] = useState({
    financiero_avance_porcentaje: (avance / total) * 100,
  });
  async function fetchFinancieroAvance() {
    const request = await axios.post(`${UrlServer}/getFinanciero`, {
      id_ficha: id_ficha,
    });
    setFinancieroAvance(request.data);
  }
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <div>
      {tipo == "circle" && (
        <div>
          <Circle
            progress={Redondea1(FinancieroAvance.financiero_avance_porcentaje)}
            size="25"
            showPercentage={false}
            lineWidth={50}
            progressColor="orange"
          />
          <div
            style={{
              color: "#ffa500",
            }}
          >
            {Redondea1(FinancieroAvance.financiero_avance_porcentaje) + "%"}
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
                  FinancieroAvance.financiero_avance_porcentaje > 100
                    ? 100
                    : FinancieroAvance.financiero_avance_porcentaje
                }%`,
                height: "100%",
                backgroundColor: "#ffa500",
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
                display: "flex",
                justifyContent: "center",
              }}
              id={"FinancieroBarraPorcentaje-" + id_ficha}
            >
              Financiero
              <div
                style={{
                  fontSize: "13px",
                }}
              >
                -({Redondea(FinancieroAvance.financiero_avance_porcentaje)} %)
              </div>
            </span>
            <Tooltip
              placement={"bottom"}
              isOpen={tooltipOpen}
              target={"FinancieroBarraPorcentaje-" + id_ficha}
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

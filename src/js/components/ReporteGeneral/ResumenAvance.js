import React, { useState, useEffect } from "react";
import { RiEyeOffFill, RiEyeFill } from "react-icons/ri";
import { Button, Input, Spinner } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";
import DatosEspecificos from "./DatosEspecificos";

import "./ReporteGeneral.css";
import "react-toastify/dist/ReactToastify.css";
export default ({ data }) => {
  return (
    <div>
      <table style={{ width: "100%" }} className="reporteGeneral-table">
        <tbody className="reporteGeneral-titulos">
          <tr>
            <th>avance fisico</th>
          </tr>
          <tr className="reporteGeneral-avanceFisico">
            <td>S/.{Redondea(data.avancefisico_acumulado)}</td>
          </tr>
          <tr className="reporteGeneral-avanceFisico">
            <td>
              {Redondea(
                (data.avancefisico_acumulado / data.presupuesto_costodirecto) *
                  100
              )}{" "}
              %
            </td>
          </tr>
          <tr>
            <th>avance financiero</th>
          </tr>
          <tr className="reporteGeneral-avanceFinanciero">
            <td>S/.{Redondea(data.avancefinanciero_acumulado)}</td>
          </tr>
          <tr className="reporteGeneral-avanceFinanciero">
            <td>
              {Redondea(
                (data.avancefinanciero_acumulado / data.presupuesto) * 100
              )}{" "}
              %
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

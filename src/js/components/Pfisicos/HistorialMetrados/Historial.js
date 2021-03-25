import React, { useState } from "react";
import HistorialMetrados from "./HistorialMetrados";
import { CardHeader } from "reactstrap";
import "./HistorialMetrados.css";
export default () => {
  if (sessionStorage.getItem("idacceso") !== null) {
    return (
      <div>
        <CardHeader>
          <b>METRADOS DIARIOS</b>
        </CardHeader>
        <HistorialMetrados />
      </div>
    );
  } else {
    return (window.location.href = "/");
  }
};

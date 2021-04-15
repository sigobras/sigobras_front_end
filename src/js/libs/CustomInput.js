import React, { useState } from "react";
import { Input } from "reactstrap";

import { formatMoney } from "../components/Utils/Funciones";

export default ({
  value,
  onBlur = () => {},
  style = {},
  type,
  innerRef = () => {},
  onKeyDown = () => {},
}) => {
  const [Value, setValue] = useState(value);
  const [FlagCambios, setFlagCambios] = useState(false);
  function handleInputChange(e) {
    setFlagCambios(true);
    if (type == "text" || type == "date" || type == "textarea") {
      setValue(e.target.value);
    } else {
      setValue(formatMoney(e.target.value));
    }
  }
  return type == "date" ? (
    <Input
      type="date"
      value={Value}
      onChange={handleInputChange}
      onBlur={() => {
        if (FlagCambios) {
          var valorModificado = Value;
          onBlur(valorModificado);
          setFlagCambios(false);
        }
      }}
      style={{
        background: FlagCambios ? "#17a2b840" : "#8effa938",
        padding: "0px 4px 0px 4px",
        color: "black",
        textAlign: "right",
        ...style,
      }}
      innerRef={(ref) => {
        innerRef(ref);
      }}
    />
  ) : (
    <Input
      type={type == "textarea" && type}
      value={Value}
      onChange={handleInputChange}
      onBlur={() => {
        if (FlagCambios) {
          var valorModificado =
            type == "text" ? Value : Value.replace(/[^0-9\.-]+/g, "");
          onBlur(valorModificado);
          setFlagCambios(false);
        }
      }}
      style={{
        ...style,
        background: FlagCambios ? "#17a2b840" : "#8effa938",
        padding: "0px 4px 0px 4px",
        color: "black",
        textAlign: "right",
      }}
      innerRef={(ref) => {
        innerRef(ref);
      }}
      onKeyDown={onKeyDown}
    />
  );
};

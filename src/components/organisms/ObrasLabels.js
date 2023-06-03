import React, { useEffect, useState } from "react";
import OutlinedLabel from "./OutlinedLabel";
import { useLabel } from "../../hooks/useLabel";
const ObrasLabels = ({ id_ficha }) => {
  const { labels, error } = useLabel(id_ficha);
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {labels.map((label) => (
        <OutlinedLabel color={label.color} name={label.nombre} />
      ))}
    </div>
  );
};
export default ObrasLabels;

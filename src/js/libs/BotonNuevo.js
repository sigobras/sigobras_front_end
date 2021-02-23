import React, { useState, useEffect, useRef } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
export default ({ size, onClick }) => {
  return (
    <button
      style={{
        borderRadius: "20px",
        height: size / 3 + "px",
        width: size + "px",
        position: "relative",
        border: "1px solid #242526",
      }}
      onClick={() => onClick()}
    >
      <span
        style={{
          fontWeight: " 700",
          color: " #242526",
          fontSize: size / 7 + "px",
        }}
      >
        NUEVO
      </span>{" "}
      <span>
        <BsPlusCircleFill color="#0080ff" size={size / 7} />
      </span>
    </button>
  );
};

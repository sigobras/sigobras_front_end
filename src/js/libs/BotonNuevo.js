import React, { useState, useEffect, useRef } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
export default () => {
  return (
    <button
      style={{
        borderRadius: "20px",
        height: "36px",
        width: "125px",
        position: "relative",
        border: "1px solid #242526",
      }}
    >
      <div
        style={{
          fontWeight: " 700",
          color: " #242526",
          position: "absolute",
          top: "6px",
          right: "49px",
          fontSize: "15px",
        }}
      >
        NUEVO
      </div>
      <div>
        <BsPlusCircleFill
          color="#0080ff"
          size={20}
          style={{
            position: "absolute",
            top: "7px",
            right: "9px",
          }}
        />
      </div>
    </button>
  );
};

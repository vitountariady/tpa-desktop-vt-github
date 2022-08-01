import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Shortcut({ children }) {
  const navigate = useNavigate();

  const handleKey = useCallback((event) => {
    console.log(event.altKey);
    if (event.altKey === true) {
      if (event.key === "w") {
        navigate("/home");
      }
      if (event.key === "p") {
        navigate("/setting");
      }
      if (event.key === "b") {
        navigate("/closedboards");
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return (
    <>
        {children}
    </>
  )
}
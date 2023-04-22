import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import reporte from './interfaces'
import './index.css';
import axios from 'axios'
import { UrlServer } from "../Utils/ServerUrlConfig";
import titulos from "./estructuraDatos";

export default () => {
  useEffect(() => {
    cargarDatos()
    return () => {
    }
  }, [])

  const [Datos, setDatos] = useState<reporte[]>([])
  async function cargarDatos() {
    try {
      const res = await axios.get(`${UrlServer}/v1/reporteMonitoreoSeguimiento`);
      setDatos(res.data)
    } catch (error) {
      console.log("error", error);
    }
  }

  async function agregarFila() {
    try {
      await axios.post(`${UrlServer}/v1/reporteMonitoreoSeguimiento`)
      cargarDatos()
    } catch (error) {
      console.log("error", error);
    }
  }

   const saveData = debounce(async (newData,fieldName,id, value) => {
    
    await axios.put(`${UrlServer}/v1/reporteMonitoreoSeguimiento/${id}`,
    {
      [fieldName]: value
    });
    setDatos(newData);
  }, 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, fieldName: string, id: number) => {
    const newData = [...Datos];
    const value = e.target.value
    newData[index][fieldName] = e.target.value;    
    saveData(newData,fieldName,id,value);
  };

  return (
    <div className='scroll-container'>
      <div className='scroll-content'>
        <table border={1}>
          <thead>
            <tr>
              {titulos.map((titulo) => (
                <th key={titulo.value}>{titulo.nombre}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Datos.map((row,index) => (
              <tr key={row.id}>
                {titulos.map((titulo) => (
                  <td key={titulo.value}>
                    <input
                      type="text"
                      defaultValue={row[titulo.value]}
                      onChange={(e) => handleChange(e, index, titulo.value,row.id)}
                      readOnly={titulo.readOnly}
                    />
                  </td>
                ))}
              </tr>
            ))}

          </tbody>
        </table>
        <button
          onClick={agregarFila}
        >
          +
        </button>
      </div>
    </div>

  );
}

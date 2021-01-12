import React, { useState, useEffect } from 'react'
import { UrlServer } from '../Utils/ServerUrlConfig'
import { Redondea, hexToRgb, fechaFormatoClasico, getDaysBetweenDates } from '../Utils/Funciones';
import axios from 'axios';
import "./index.css"
import { Button, Input, Tooltip } from 'reactstrap';
import { FaRegSmile, FaRegSadCry, FaEyeSlash } from "react-icons/fa";
import { ImSad2, ImWink2 } from "react-icons/im";

export default () => {

  useEffect(() => {
    fetchObras()
  }, [])
  const [Obras, setObras] = useState([])
  async function fetchObras() {
    var res = await axios.post(`${UrlServer}/listaObrasSeguimientoByIdAcceso`, {
      id_acceso: sessionStorage.getItem("idacceso"),
    })
    setObras(res.data)
  }
  function fechasAnteriorQuincena() {
    var d = new Date();
    var dia = d.getDate()
    var dia_inicial = dia > 15 ? 1 : 16
    var dia_final = dia > 15 ? 15 : 31

    var mes = d.getMonth() + 1;
    mes = dia > 15 ? mes : (mes == 1 ? 12 : (mes - 1))
    var anyo = d.getFullYear();
    anyo = (dia < 15) ? (anyo - 1) : anyo
    var fecha_inicial = anyo + "-" + mes + "-" + dia_inicial
    var fecha_final = anyo + "-" + mes + "-" + dia_final
    // console.log("fecha_inicial", fecha_inicial);
    // console.log("fecha_final", fecha_final);
    return (
      {
        fecha_inicial,
        fecha_final

      }
    )
  }
  function fechasActualQuincena() {
    var d = new Date();
    var mes = d.getMonth() + 1;
    var anyo = d.getFullYear();
    var dia = d.getDate()
    var dia_inicial = dia > 15 ? 16 : 1
    var dia_final = dia > 15 ? 31 : 15
    var fecha_inicial = anyo + "-" + mes + "-" + dia_inicial
    var fecha_final = anyo + "-" + mes + "-" + dia_final
    // console.log("fecha_inicial",fecha_inicial);
    // console.log("fecha_final",fecha_final);
    return (
      {
        fecha_inicial,
        fecha_final

      }
    )
  }
  const [TooltipFotosHeader, setTooltipFotosHeader] = useState(false);

  const toggleTooltipFotosHeader = () => setTooltipFotosHeader(!TooltipFotosHeader);

  return (
    <div>
      <table className="table text-center">
        <thead>
          <tr>
            <th rowSpan="2">Nro</th>
            <th rowSpan="2">Codigo Obra</th>
            <th colSpan="7" >FISICO</th>
            <th colSpan="6" >FINANCIERO</th>
          </tr>
          <tr >
            <th>Datos de ficha</th>
            <th>Fisico</th>
            <th>Plazos</th>
            <th
            >Programado</th>
            <th id={"fotosHeader"}>
              Fotos
                        </th>
            <Tooltip
              placement={"top"}
              isOpen={TooltipFotosHeader}
              target={"fotosHeader"}
              toggle={toggleTooltipFotosHeader}
            >
              {(() => {
                var fechas1 = fechasAnteriorQuincena()
                var fechas2 = fechasActualQuincena()
                return (
                  [
                    <div>{fechaFormatoClasico(fechas1.fecha_inicial)}</div>,
                    <div>{fechaFormatoClasico(fechas1.fecha_final)}</div>,
                    <div>{fechaFormatoClasico(fechas2.fecha_inicial)}</div>,
                    <div>{fechaFormatoClasico(fechas2.fecha_final)}</div>
                  ]
                )
              })()
              }
            </Tooltip>
            <th>Personal</th>
            <th>Ficha Tenica</th>
            <th>Financiero</th>
            <th>Personal</th>
            <th>Tareo</th>
            <th>Certitifacos</th>
            <th>Devengados</th>
            <th>PIM</th>
            {/* <th>Informe mensual</th> */}
          </tr>
        </thead>
        <tbody>
          {Obras.map((item, i) =>
            <tr key={i} className="fechas-width">
              <td>{i + 1}</td>
              <td>{item.codigo}</td>
              <td>test</td>
              <td>
                <UltimoDiaMetrado id_ficha={item.id_ficha} />
              </td>
              <td>
                <Plazos_info id_ficha={item.id_ficha} />
              </td>
              <td>{fechaFormatoClasico(item.programado_ultima_fecha)}</td>
              <td>
                <FotosCantidad
                  id_ficha={item.id_ficha}
                  fechasAnteriorQuincena={fechasAnteriorQuincena}
                  fechasActualQuincena={fechasActualQuincena}
                />
              </td>
              <td>test</td>
              <td>test</td>
              <td>{fechaFormatoClasico(item.financiero_ultima_fecha)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
function UltimoDiaMetrado({ id_ficha }) {
  useEffect(() => {
    fetchUltimoMetrado()
  }, [])
  const [UltimoMetrado, setUltimoMetrado] = useState({})
  async function fetchUltimoMetrado() {
    var res = await axios.post(`${UrlServer}/getUltimoDiaMetrado`, {
      id_ficha
    })
    setUltimoMetrado(res.data.fecha)
  }
  return (
    <div >
      {getDaysBetweenDates(UltimoMetrado, new Date()) - 1} días
      <div>{fechaFormatoClasico(UltimoMetrado) || ""}</div>
    </div>
  )
}
function Plazos_info({ id_ficha }) {
  useEffect(() => {
    fetchPrimerPlazo()
    fetchUltimoPlazoAprobado()
    fetchUltimoPlazoSinAprobar()
  }, [])
  const [PrimerPlazo, setPrimerPlazo] = useState({})
  async function fetchPrimerPlazo() {
    var res = await axios.get(`${UrlServer}/primerPlazo`, {
      params: {
        id_ficha
      }
    })
    setPrimerPlazo(res.data)
  }
  const [UltimoPlazoAprobado, setUltimoPlazoAprobado] = useState({})
  async function fetchUltimoPlazoAprobado() {
    var res = await axios.get(`${UrlServer}/ultimoPlazoAprobado`, {
      params: {
        id_ficha
      }
    })
    setUltimoPlazoAprobado(res.data)
  }
  const [UltimoPlazoSinAprobar, setUltimoPlazoSinAprobar] = useState({})
  async function fetchUltimoPlazoSinAprobar() {
    var res = await axios.get(`${UrlServer}/ultimoPlazoSinAprobar`, {
      params: {
        id_ficha
      }
    })
    setUltimoPlazoSinAprobar(res.data)
  }
  return (
    <div >
      {
        PrimerPlazo.fecha_inicio &&
        <div
          style={{
            color: "#17a2b8"
          }}
        >Inicio de obra</div>
      }

      <div>{fechaFormatoClasico(PrimerPlazo.fecha_inicio)}</div>

      {
        UltimoPlazoAprobado.fecha_final &&
        <div
          style={{
            color: "#17a2b8"
          }}
        >Ultimo plazo aprobado</div>
      }

      <div>{fechaFormatoClasico(UltimoPlazoAprobado.fecha_final)}</div>
      {
        UltimoPlazoSinAprobar.fecha_final &&
        <div
          style={{
            color: "#17a2b8"
          }}
        >Ultimo plazo sin aprobar</div>
      }
      <div>{fechaFormatoClasico(UltimoPlazoSinAprobar.fecha_final)}</div>
    </div>
  )
}
function FotosCantidad({ id_ficha, fechasAnteriorQuincena, fechasActualQuincena }) {
  useEffect(() => {
    fetchfotosCantidad1()
    fetchfotosCantidad2()
  }, [])
  const [fotosCantidad1, setfotosCantidad1] = useState(0)
  async function fetchfotosCantidad1() {
    try {
      var fechas = fechasAnteriorQuincena()

      var res = await axios.get(`${UrlServer}/fotosCantidad`, {
        params: {
          id_ficha,
          fecha_inicial: fechas.fecha_inicial,
          fecha_final: fechas.fecha_final,
        }
      })
      setfotosCantidad1(res.data.cantidad)
    } catch (error) {
      console.log(error);
    }
  }
  const [fotosCantidad2, setfotosCantidad2] = useState(0)
  async function fetchfotosCantidad2() {
    try {

      var fechas = fechasActualQuincena()

      var res = await axios.get(`${UrlServer}/fotosCantidad`, {
        params: {
          id_ficha,
          fecha_inicial: fechas.fecha_inicial,
          fecha_final: fechas.fecha_final,
        }
      })
      setfotosCantidad2(res.data.cantidad)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div >
      <div>
        <div
          style={{
            color: "#17a2b8"
          }}
        >
          anterior quincena
                </div>
        {fotosCantidad1}
        {fotosCantidad1 >= 7 ?
          <ImWink2 size="20" color="#219e12" /> :
          <ImSad2
            size="20"
            color="#9e1212" />}
      </div>
      <div>
        <div
          style={{
            color: "#17a2b8"
          }}
        >
          actual quincena
                </div>
        {fotosCantidad2}
        {fotosCantidad2 >= 7 ?
          <ImWink2
            size="20"
            color="#219e12" /> :
          <ImSad2
            size="20"
            color="#9e1212" />}
      </div>
    </div>
  )
}
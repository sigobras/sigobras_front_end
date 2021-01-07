import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Nav, NavItem, NavLink, CardHeader, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { UrlServer } from '../../Utils/ServerUrlConfig'
import { Redondea } from '../../Utils/Funciones';
import "./valorizaciones.css";
import { BsFillTrashFill } from "react-icons/bs";
import { FaEdit, FaSave } from "react-icons/fa";
import { AiOutlineFileAdd } from "react-icons/ai";
export default () => {
  useEffect(() => {
    fetchAnyos()
    fetchComponentes()
  }, [])
  //anyos
  const [Anyos, setAnyos] = useState([])
  async function fetchAnyos() {
    const res = await axios.post(`${UrlServer}/getValGeneralAnyos2`, {
      id_ficha: sessionStorage.getItem('idobra')
    })
    // console.log("anyos", res.data);
    setAnyos(res.data)
    setAnyoSeleccionado(res.data[res.data.length - 1].anyo)
  }
  const [AnyoSeleccionado, setAnyoSeleccionado] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  //periodos
  const [Periodos, setPeriodos] = useState([])
  async function fetchPeriodos() {
    const res = await axios.post(`${UrlServer}/getValGeneralPeriodos`, {
      id_ficha: sessionStorage.getItem('idobra'),
      anyo: AnyoSeleccionado
    })
    // console.log("Periodos", res.data);
    setPeriodos(res.data)
    setPeriodoSeleccionado(res.data[res.data.length - 1])
  }
  const [PeriodoSeleccionado, setPeriodoSeleccionado] = useState("--")
  //Componentes
  const [Componentes, setComponentes] = useState([])
  async function fetchComponentes() {
    const res = await axios.post(`${UrlServer}/getValGeneralComponentes`, {
      id_ficha: sessionStorage.getItem('idobra')
    })
    // console.log("Componentes", res.data);
    setComponentes(res.data)
  }
  const [Componenteseleccionado, setComponenteseleccionado] = useState({ numero: 0, nombre: "RESUMEN DE VALORIZACIÓN" })
  //ResumenComponentes
  const [ResumenComponentes, setResumenComponentes] = useState([])
  const [ResumenComponentesTotales, setResumenComponentesTotales] = useState({})
  async function fetchResumenComponentes() {
    const res = await axios.post(`${UrlServer}/getValGeneralResumenPeriodo2`, {
      id_ficha: sessionStorage.getItem('idobra'),
      fecha_inicial: PeriodoSeleccionado.fecha_inicial,
      fecha_final: PeriodoSeleccionado.fecha_final
    })
    console.log("ResumenComponentes", res.data);
    setResumenComponentes(res.data)
    var presupuesto = res.data.reduce((acc, item) => acc + item.presupuesto, 0)
    var valor_anterior = res.data.reduce((acc, item) => acc + item.valor_anterior, 0)
    var valor_actual = res.data.reduce((acc, item) => acc + item.valor_actual, 0)
    setResumenComponentesTotales({
      presupuesto,
      valor_anterior,
      porcentaje_anterior: valor_anterior / presupuesto * 100,
      valor_actual,
      porcentaje_actual: valor_actual / presupuesto * 100,
      valor_total: valor_anterior + valor_actual,
      porcentaje_total: (valor_anterior + valor_actual) / presupuesto * 100,
      valor_saldo: presupuesto - valor_anterior - valor_actual,
      porcentaje_saldo: (presupuesto - valor_anterior - valor_actual) / presupuesto * 100
    })
  }
  //Componentes
  const [Partidas, setPartidas] = useState([])
  const [PartidasTotales, setPartidasTotales] = useState({})
  async function fetchPartidas() {
    const res = await axios.post(`${UrlServer}/getValGeneralPartidas2`, {
      id_ficha: sessionStorage.getItem('idobra'),
      fecha_inicial: PeriodoSeleccionado.fecha_inicial,
      fecha_final: PeriodoSeleccionado.fecha_final,
      id_componente: Componenteseleccionado.id_componente
    })
    function addLeadingZeros(num, size) {
      num = num.toString();
      while (num.length < size) num = "0" + num;
      return num;
    }
    // setPartidas(res.data)

    var arr = res.data.map(
      item => {
        item.item2 = item.item.split('.')
          .map(n => addLeadingZeros(n, 10)).join("")
        return item
      }
    )
      .sort(
        (a, b) => {
          if (a.item2 < b.item2) {
            return -1;
          }
          if (a.item2 > b.item2) {
            return 1;
          }
          return 0;
        }
      )
    setPartidas(arr)

    var valor_anterior = 0
    var valor_actual = 0

    res.data.forEach(item => {
      valor_anterior += item.valor_anterior
      valor_actual += item.valor_actual
    });
    setPartidasTotales({
      valor_anterior,
      porcentaje_anterior: valor_anterior / Componenteseleccionado.presupuesto * 100,
      valor_actual,
      porcentaje_actual: valor_actual / Componenteseleccionado.presupuesto * 100,
      valor_total: valor_anterior + valor_actual,
      porcentaje_total: (valor_anterior + valor_actual) / Componenteseleccionado.presupuesto * 100,
      valor_saldo: Componenteseleccionado.presupuesto - valor_anterior - valor_actual,
      porcentaje_saldo: (Componenteseleccionado.presupuesto - valor_anterior - valor_actual) / Componenteseleccionado.presupuesto * 100
    })
  }

  useEffect(() => {
    if (AnyoSeleccionado != 0) {
      fetchPeriodos()
    }
  }, [AnyoSeleccionado])
  useEffect(() => {
    if (Componenteseleccionado.numero == 0) {
      fetchResumenComponentes()
      get_data_costos_indirectos()
    } else {
      fetchPartidas()
    }
  }, [PeriodoSeleccionado, Componenteseleccionado])
  //costos indirectos
  const [CostosIndirectos, setCostosIndirectos] = useState([])
  async function get_data_costos_indirectos() {
    var costos_indirectos = await axios.post(`${UrlServer}/getCostosIndirectos`,
      {
        "fecha_inicial": PeriodoSeleccionado.fecha_inicial,
        "fecha_final": PeriodoSeleccionado.fecha_final,
        "fichas_id_ficha": sessionStorage.getItem("idobra"),

      }
    );
    console.log('====================================');
    console.log("costos_indirectos ", costos_indirectos);
    console.log('====================================');
    setCostosIndirectos(costos_indirectos.data)
  }

  function agregar_costo_indirecto() {
    var costos_indirectos = [...CostosIndirectos]
    costos_indirectos.push(
      {
        "costo_indirecto": " Gastos generales",
        "monto": " 15151613",
      }
    )
    setCostosIndirectos(costos_indirectos)
  }

  function updateinput(index, nombre_campo, valor) {
    var costos_indirectos = [...CostosIndirectos]
    costos_indirectos[index][nombre_campo] = valor
    setCostosIndirectos(costos_indirectos)
  }

  async function eliminar_costo_indirecto(index) {
    if (confirm("Desea eliminar este registro ? " + index)) {
      var costos_indirectos = [...CostosIndirectos]
      costos_indirectos.splice(index, 1);
      setCostosIndirectos(costos_indirectos)
    }
  }
  const [ActivatorInput, setActivatorInput] = useState(-1)
  function activarEdicion(index) {
    setActivatorInput(index)

  }

  async function guardar_costo_indirecto(index) {
    get_data_costos_indirectos()
  }

  return (
    <div>
      <Nav tabs>
        <Dropdown nav
          isOpen={dropdownOpen}
          toggle={toggle}
        >
          <DropdownToggle nav caret>
            {AnyoSeleccionado == 0 ? "--" : AnyoSeleccionado}
          </DropdownToggle>
          <DropdownMenu>
            {
              Anyos.map((item, i) =>
                <DropdownItem key={i}
                  onClick={() => setAnyoSeleccionado(item.anyo)}
                >{item.anyo}</DropdownItem>
              )
            }

          </DropdownMenu>
        </Dropdown>
        {
          Periodos.map((item, i) =>
            <NavItem key={i}>
              <NavLink
                active={PeriodoSeleccionado.codigo == item.codigo}
                onClick={() => setPeriodoSeleccionado(item)}
              >
                {item.codigo}
              </NavLink>
            </NavItem>
          )
        }
      </Nav>
      <Nav tabs>
        <NavItem >
          <NavLink
            active={Componenteseleccionado.numero == 0}
            onClick={() => setComponenteseleccionado({ numero: 0, nombre: "RESUMEN DE VALORIZACIÓN" })}
          >
            RESUMEN
          </NavLink>
        </NavItem>
        {Componentes.map((item, i) =>
          <NavItem key={i}>
            <NavLink
              active={Componenteseleccionado.numero == item.numero}
              onClick={() => setComponenteseleccionado(item)}
            >
              C-{item.numero}
            </NavLink>
          </NavItem>
        )}

      </Nav>
      <CardHeader>{Componenteseleccionado.nombre}</CardHeader>
      {
        Componenteseleccionado.numero == 0
          ?
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="resplandPartida">
                <tr className="text-center">
                  <th className="align-middle" rowSpan="3">N°</th>
                  <th className="align-middle" rowSpan="3">NOMBRE DEL COMPONENTE</th>
                  <th>S/. {Redondea(ResumenComponentesTotales.presupuesto)}</th>

                  <th>S/. {Redondea(ResumenComponentesTotales.valor_anterior)}</th>
                  <th>{Redondea(ResumenComponentesTotales.porcentaje_anterior)} %</th>

                  <th>S/. {Redondea(ResumenComponentesTotales.valor_actual)}</th>
                  <th>{Redondea(ResumenComponentesTotales.porcentaje_actual)} %</th>

                  <th>S/. {Redondea(ResumenComponentesTotales.valor_total)}</th>
                  <th>{Redondea(ResumenComponentesTotales.porcentaje_total)} %</th>

                  <th>S/. {Redondea(ResumenComponentesTotales.valor_saldo)}</th>
                  <th>{Redondea(ResumenComponentesTotales.porcentaje_saldo)} %</th>
                </tr>
                <tr className="text-center">
                  <th>MONTO ACT.</th>
                  <th colSpan="2">AVANCE ANTERIOR</th>
                  <th colSpan="2" >AVANCE ACTUAL</th>
                  <th colSpan="2">AVANCE ACUMULADO</th>
                  <th colSpan="2">SALDO</th>
                </tr>
                <tr className="text-center">
                  <th>PPTO</th>
                  <th>MONTO</th>
                  <th>%</th>
                  <th >MONTO</th>
                  <th >%</th>
                  <th>MONTO</th>
                  <th>%</th>
                  <th>MONTO</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {
                  ResumenComponentes.map((item, i) =>
                    <tr key={i} >
                      <td>{item.numero}</td>
                      <td>{item.nombre} </td>
                      <td>{Redondea(item.presupuesto)}</td>
                      <td>{Redondea(item.valor_anterior)}</td>
                      <td>{Redondea(item.valor_anterior / item.presupuesto * 100)}</td>
                      <td className="bg-mm">{Redondea(item.valor_actual)}</td>
                      <td className="bg-mm">{Redondea(item.valor_actual / item.presupuesto * 100)}</td>
                      <td >{Redondea(item.valor_anterior + item.valor_actual)}</td>
                      <td>{Redondea((item.valor_anterior + item.valor_actual) / item.presupuesto * 100)}</td>
                      <td>{Redondea(item.presupuesto - item.valor_anterior - item.valor_actual)}</td>
                      <td>{Redondea((item.presupuesto - item.valor_anterior - item.valor_actual) / item.presupuesto * 100)}</td>
                    </tr>
                  )
                }
                <tr className="resplandPartida font-weight-bolder">
                  <td colSpan="2">TOTAL COSTO DIRECTO</td>
                  <td>S/. {Redondea(ResumenComponentesTotales.presupuesto)}</td>

                  <td>S/. {Redondea(ResumenComponentesTotales.valor_anterior)}</td>
                  <td>{Redondea(ResumenComponentesTotales.porcentaje_anterior)} %</td>

                  <td>S/. {Redondea(ResumenComponentesTotales.valor_actual)}</td>
                  <td>{Redondea(ResumenComponentesTotales.porcentaje_actual)} %</td>

                  <td>S/. {Redondea(ResumenComponentesTotales.valor_total)}</td>
                  <td>{Redondea(ResumenComponentesTotales.porcentaje_total)} %</td>

                  <td>S/. {Redondea(ResumenComponentesTotales.valor_saldo)}</td>
                  <td>{Redondea(ResumenComponentesTotales.porcentaje_saldo)} %</td>
                </tr>
                {/* Costos inderectos */}
                {CostosIndirectos.map((item, index) =>
                  <tr key={index}>
                    <td>

                    </td>
                    <td>
                      <input
                        className=" input_expandible "
                        type="text" placeholder={item.nombre}
                        onBlur={event => updateinput(index, "nombre", event.target.value)}
                        disabled={(ActivatorInput == index) ? "" : "disabled"}
                      />
                    </td>
                    <td>
                      <input
                        className="input_expandible "
                        type="text" placeholder={Redondea(item.monto)}
                        onBlur={event => updateinput(index, "monto", event.target.value)}
                        disabled={(ActivatorInput == index) ? "" : "disabled"}
                      />
                    </td>
                    <td>
                      {
                        Redondea(item.monto * parseFloat(ResumenComponentesTotales.porcentaje_anterior).toFixed(2) / 100)
                      }
                    </td>
                    <td>
                      {
                        Redondea(ResumenComponentesTotales.porcentaje_anterior)
                      }
                    </td>
                    <td>
                      {
                        Redondea(item.monto * parseFloat(ResumenComponentesTotales.porcentaje_actual).toFixed(2) / 100)
                      }
                    </td>
                    <td>
                      {
                        Redondea(ResumenComponentesTotales.porcentaje_actual)
                      }
                    </td>
                    <td>
                      {
                        Redondea(item.monto * parseFloat(ResumenComponentesTotales.porcentaje_total).toFixed(2) / 100)
                      }
                    </td>
                    <td>
                      {
                        Redondea(ResumenComponentesTotales.porcentaje_total)
                      }
                    </td>
                    <td>
                      {
                        Redondea(item.monto * parseFloat(ResumenComponentesTotales.porcentaje_saldo).toFixed(2) / 100)
                      }
                    </td>
                    <td>
                      {
                        Redondea(ResumenComponentesTotales.porcentaje_saldo)
                      }
                    </td>
                    <td>
                      <button
                        //className="boxy"
                        className="btn btn-danger"
                        onClick={() => eliminar_costo_indirecto(index)}>
                        <BsFillTrashFill size={10} />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => activarEdicion(index)}>
                        <FaEdit size={10} />
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-primary  " onClick={() => guardar_costo_indirecto(index)}>
                        <FaSave size={10} />
                      </button>
                    </td>
                  </tr>

                )}
                <tr className="resplandPartida font-weight-bolder">

                  <td colSpan="2">
                    TOTAL COSTO INDIRECTO
                  </td>

                  <td>
                    S/.
                      {
                      (() => {
                        var suma = 0
                        for (let index = 0; index < CostosIndirectos.length; index++) {
                          const element = CostosIndirectos[index];
                          suma = suma + parseFloat(element.monto)
                        }
                        return Redondea(suma)
                      })()
                    }
                  </td>

                  {/* AVANCE ANTERIOR */}
                  <td>
                    S/.
                                                            {
                      (() => {
                        var suma = 0
                        for (let index = 0; index < CostosIndirectos.length; index++) {
                          const element = CostosIndirectos[index];
                          suma = suma + parseFloat(element.monto * ResumenComponentesTotales.porcentaje_anterior / 100)

                        }
                        return Redondea(suma)
                      })()
                    }
                  </td>
                  {/* AVANCE ANTERIOR PORCENTAJE  */}
                  <td>
                    {
                      Redondea(ResumenComponentesTotales.porcentaje_anterior)
                    } %
                  </td>
                  {/* AVANCE ACTUAL  */}

                  <td>
                    S/.
                                                            {
                      (() => {
                        var suma = 0
                        for (let index = 0; index < CostosIndirectos.length; index++) {
                          const element = CostosIndirectos[index];
                          suma = suma + parseFloat(element.monto * ResumenComponentesTotales.porcentaje_actual / 100)
                        }
                        return Redondea(suma)
                      })()
                    }
                  </td>
                  {/* AVANCE ACTUAL PORCENTAJE  */}

                  <td>
                    {
                      Redondea(ResumenComponentesTotales.porcentaje_actual)
                    } %
                     </td>

                  {/* AVANCE ACUMULADO */}
                  <td>
                    S/.
                                                            {
                      (() => {
                        var suma = 0
                        for (let index = 0; index < CostosIndirectos.length; index++) {
                          const element = CostosIndirectos[index];
                          suma = suma + parseFloat(element.monto * ResumenComponentesTotales.porcentaje_total / 100)
                        }
                        return Redondea(suma)
                      })()
                    }
                  </td>

                  {/* AVANCE ACUMULADO PORCENTAJE  */}
                  <td>
                    {
                      Redondea(ResumenComponentesTotales.porcentaje_total)
                    } %
                    </td>

                  {/* AVANCE SALDO  */}
                  <td>
                    S/.
                                                            {
                      (() => {
                        var suma = 0
                        for (let index = 0; index < CostosIndirectos.length; index++) {
                          const element = CostosIndirectos[index];
                          suma = suma + parseFloat(element.monto * ResumenComponentesTotales.porcentaje_saldo / 100)
                        }
                        return Redondea(suma)
                      })()
                    }
                  </td>

                  {/* AVANCE SALDO PORCENTAJE  */}
                  <td>
                    {
                      Redondea(ResumenComponentesTotales.porcentaje_saldo)
                    }
                    %
                  </td>
                </tr>
                <tr>
                  <td>

                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={() => agregar_costo_indirecto()}>
                      <AiOutlineFileAdd size={20} />

                    </button>
                  </td>


                </tr>
              </tbody>
            </table>
          </div>
          :
          <div className="table-responsive">
            <table className="table table-bordered table-sm small mb-0" hover>
              <thead className="text-center resplandPartida">
                <tr>
                  <th colSpan="3" rowSpan="2" className="align-middle">DESCRIPCION</th>
                  <th colSpan="2">S/. {Redondea(Componenteseleccionado.presupuesto)}</th>

                  <th colSpan="2">S/. {Redondea(PartidasTotales.valor_anterior)}</th>
                  <th>{Redondea(PartidasTotales.porcentaje_anterior)} %</th>

                  <th colSpan="2" >S/. {Redondea(PartidasTotales.valor_actual)}</th>
                  <th>{Redondea(PartidasTotales.porcentaje_actual)} %</th>

                  <th colSpan="2">S/. {Redondea(PartidasTotales.valor_total)}</th>
                  <th>{Redondea(PartidasTotales.porcentaje_total)} %</th>

                  <th colSpan="2">S/. {Redondea(PartidasTotales.valor_saldo)}</th>
                  <th>{Redondea(PartidasTotales.porcentaje_saldo)} %</th>
                </tr>
                <tr>
                  <th colSpan="2">PRESUPUESTO</th>
                  <th colSpan="3">ANTERIOR</th>
                  <th colSpan="3">ACTUAL</th>
                  <th colSpan="3">ACUMULADO</th>
                  <th colSpan="3">SALDO</th>
                </tr>
                <tr>
                  <th>ITEM</th>
                  <th>DESCRIPCION</th>
                  <th>METRADO</th>
                  <th>P. U. S/.</th>
                  <th>P. P S/.</th>

                  <th>MET. </th>
                  <th>VAL</th>
                  <th>%</th>

                  <th>MET.</th>
                  <th>VAL</th>
                  <th>%</th>

                  <th>MET.</th>
                  <th>VAL</th>
                  <th>%</th>

                  <th>MET.</th>
                  <th>VAL</th>
                  <th>%</th>
                </tr>
              </thead>

              <tbody>
                {
                  Partidas.map((item) =>
                    <tr key={item.id_partida}
                      className={item.tipo === "titulo" ? "font-weight-bold text-warning" : "font-weight-light"}
                    >
                      <td>{item.item}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.metrado}</td>
                      <td>{item.costo_unitario}</td>
                      <td>{Redondea(item.metrado * item.costo_unitario)}</td>

                      <td>{Redondea(item.metrado_anterior)}</td>
                      <td>{Redondea(item.valor_anterior)}</td>
                      <td>{Redondea(item.metrado_anterior / item.metrado * 100)}</td>

                      <td className="bg-mm">{item.metrado_actual}</td>
                      <td className="bg-mm">{item.valor_actual}</td>
                      <td>{Redondea(item.metrado_actual / item.metrado * 100)}</td>

                      <td>{Redondea(item.metrado_anterior + item.metrado_actual)}</td>
                      <td>{Redondea(item.valor_anterior + item.valor_actual)}</td>
                      <td>{Redondea((item.metrado_anterior + item.metrado_actual) / item.metrado * 100)}</td>

                      <td>{Redondea(item.metrado - item.metrado_anterior - item.metrado_actual)}</td>
                      <td>{Redondea((item.metrado * item.costo_unitario) - item.valor_anterior - item.valor_actual)}</td>
                      <td>{Redondea((item.metrado - item.metrado_anterior - item.metrado_actual) / item.metrado * 100)}</td>

                    </tr>
                  )
                }

                <tr className="resplandPartida">
                  <td colSpan="3">TOTAL</td>
                  <td colSpan="2">S/. {Redondea(Componenteseleccionado.presupuesto)}</td>

                  <td colSpan="2">S/. {Redondea(PartidasTotales.valor_anterior)}</td>
                  <td>{Redondea(PartidasTotales.porcentaje_anterior)} %</td>

                  <td colSpan="2" >S/. {Redondea(PartidasTotales.valor_actual)}</td>
                  <td>{Redondea(PartidasTotales.porcentaje_actual)} %</td>

                  <td colSpan="2">S/. {Redondea(PartidasTotales.valor_total)}</td>
                  <td>{Redondea(PartidasTotales.porcentaje_total)} %</td>

                  <td colSpan="2">S/. {Redondea(PartidasTotales.valor_saldo)}</td>
                  <td>{Redondea(PartidasTotales.porcentaje_saldo)} %</td>

                </tr>
              </tbody>

            </table>

          </div>
      }



    </div>
  )
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSuperpowers, FaCircle } from 'react-icons/fa';
import { MdFlashOn, MdSearch, MdChevronLeft, MdChevronRight, MdVisibility, MdMonetizationOn, MdWatch, MdLibraryBooks, MdCancel, MdArrowDropDownCircle } from 'react-icons/md';
import { TiWarning } from 'react-icons/ti';
import { InputGroupAddon, InputGroupText, InputGroup, Nav, NavItem, NavLink, CardHeader, CardBody, Button, Input, UncontrolledPopover } from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig';
import { Redondea } from '../../../Utils/Funciones'
import BarraPorcentajeAvancePartida from './BarraPorcentajeAvancePartida';
import PartidasChat from '../../../libs/PartidasChat'
import BarraPorcentajeAvanceActividad from './BarraPorcentajeAvanceActividad';
import ModalIngresoMetrado from './ModalIngresoMetrado';
export default () => {
  useEffect(() => {
    fectchComponentes()
    fectchPrioridades()
    fetchCategorias()
  }, []);
  // componentes
  const [Componentes, setComponentes] = useState(
    [
      {
        "id_componente": 0,
        "numero": "...",
      }
    ]
  );
  async function fectchComponentes() {
    const request = await axios.post(`${UrlServer}/getComponentes`, {
      id_ficha: sessionStorage.getItem('idobra')
    })
    setComponentes(request.data)
    onChangeComponentesSeleccion(request.data[0])
  }
  const [ComponenteSelecccionado, setComponenteSelecccionado] = useState({ numero: 0, nombre: "Cargando..." });
  function onChangeComponentesSeleccion(componente) {
    setComponenteSelecccionado(componente)
  }
  //paginacion
  const [CantidadPaginasPartidas, setCantidadPaginasPartidas] = useState(15);
  async function onChangeCantidadPaginasPartidas(value) {
    setCantidadPaginasPartidas(value)
  }
  const [PaginaActual, setPaginaActual] = useState(1);
  function onChangePaginaActual(pagina) {
    setPaginaActual(pagina)
  }
  const [ConteoPartidas, setConteoPartidas] = useState([]);
  async function fectchConteoPartidas() {
    const request = await axios.post(`${UrlServer}/getTotalConteoPartidas`,
      {
        id_componente: ComponenteSelecccionado.id_componente,
        id_iconoCategoria: MenuCategoriasSeleccionado.id_iconoCategoria,
        id_prioridad: MenuPrioridadesSeleccionado.id_prioridad,
        texto_buscar: TextoBuscado
      }
    )
    setConteoPartidas(request.data.total)
  }
  //partidas
  const [TogglePartidasEstilo, setTogglePartidasEstilo] = useState(false)
  const [Partidas, setPartidas] = useState(
    new Array(15).fill(
      {
        "id_partida": -2,
        "item": "--"
      }
    )
  );
  async function fectchPartidas() {
    // setTogglePartidasEstilo(false)
    const request = await axios.post(`${UrlServer}/getPartidas2`,
      {
        id_componente: ComponenteSelecccionado.id_componente,
        inicio: (PaginaActual - 1) * CantidadPaginasPartidas,
        fin: Number(CantidadPaginasPartidas),
        id_iconoCategoria: MenuCategoriasSeleccionado.id_iconoCategoria,
        id_prioridad: MenuPrioridadesSeleccionado.id_prioridad,
        texto_buscar: TextoBuscado
      }
    )
    setPartidas(request.data)

    if (!TogglePartidasEstilo) {
      setTimeout(() => {
        setTogglePartidasEstilo(true)
      }, 500)
    }
  }
  const [PartidaSelecccionado, setPartidaSelecccionado] = useState({ numero: 0, nombre: "", item: "-" });
  function onChangePartidasSeleccion(Partida) {
    if (Partida.id_partida != PartidaSelecccionado.id_partida) {
      setPartidaSelecccionado(Partida)
      fectchActividades(Partida.id_partida)
    } else {
      setPartidaSelecccionado({ numero: 0, nombre: "" })
    }
  }
  //actividades
  const [Actividades, setActividades] = useState([]);
  async function fectchActividades(id_partida) {
    const request = await axios.post(`${UrlServer}/getActividades2`, {
      id_partida
    })
    setActividades(request.data)
  }
  //recarga de datos
  const [RefActividades, setRefActividades] = useState([]);
  const [RefPartidas, setRefPartidas] = useState([]);
  function onSaveMetrado(id_partida, id_actividad) {
    RefPartidas[id_partida].recarga()
    RefActividades[id_actividad].recarga()
  }
  //prioridades
  const [Prioridades, setPrioridades] = useState([]);
  async function fectchPrioridades() {
    const request = await axios.get(`${UrlServer}/getPrioridades`)
    setPrioridades(request.data)
  }
  //Categorias
  const [Categorias, setCategorias] = useState([]);
  const [CategoriasComponente, setCategoriasComponente] = useState([]);
  async function fetchCategorias() {
    const res = await axios.get(`${UrlServer}/getIconoscategorias`)
    setCategorias(res.data)
    //preparando categorias componentente
    var categoriasComponente = []
    res.data.forEach(icono => {
      if (icono) {
        if (icono.nombre === "<FaSuperpowers/>") {
          categoriasComponente.push(
            {
              id_iconoCategoria: icono.id_iconoCategoria,
              nombre: <FaSuperpowers />
            }
          )
        } else if (icono.nombre === "<MdLibraryBooks/>") {
          categoriasComponente.push(
            {
              id_iconoCategoria: icono.id_iconoCategoria,
              nombre: <MdLibraryBooks />
            }
          )
        } else if (icono.nombre === "<TiWarning/>") {
          categoriasComponente.push(
            {
              id_iconoCategoria: icono.id_iconoCategoria,
              nombre: <TiWarning />
            }
          )
        } else if (icono.nombre === "<MdWatch/>") {
          categoriasComponente.push(
            {
              id_iconoCategoria: icono.id_iconoCategoria,
              nombre: <MdWatch />
            }
          )
        } else if (icono.nombre === "<MdVisibility/>") {
          categoriasComponente.push(
            {
              id_iconoCategoria: icono.id_iconoCategoria,
              nombre: <MdVisibility />
            }
          )
        } else if (icono.nombre === "<MdMonetizationOn/>") {
          categoriasComponente.push(
            {
              id_iconoCategoria: icono.id_iconoCategoria,
              nombre: <MdMonetizationOn />
            }
          )
        }
      }
    });
    setCategoriasComponente(categoriasComponente)

  }
  //menu categorias
  const [MenuCategorias, setMenuCategorias] = useState(false);
  const toggleMenuCategorias = () => setMenuCategorias(!MenuCategorias);
  const [MenuCategoriasSeleccionado, setMenuCategoriasSeleccionado] = useState({ id_iconoCategoria: 0, nombre: <MdCancel size={17} /> });
  function onChangeMenuCategorias(categoria) {
    setMenuCategorias(false)
    setMenuCategoriasSeleccionado(categoria)
  }
  //menu prioridades
  const [MenuPrioridades, setMenuPrioridades] = useState(false);
  const toggleMenuPrioridades = () => setMenuPrioridades(!MenuPrioridades);
  const [MenuPrioridadesSeleccionado, setMenuPrioridadesSeleccionado] = useState({ id_prioridad: 0 });
  async function onChangeMenuPrioridades(prioridad) {
    setMenuPrioridades(false)
    setMenuPrioridadesSeleccionado(prioridad)
  }
  //CAJA DE TEXTO
  const [TextoBuscado, setTextoBuscado] = useState("");
  useEffect(() => {
    fectchConteoPartidas()
  }, [ComponenteSelecccionado, CantidadPaginasPartidas, MenuPrioridadesSeleccionado, MenuCategoriasSeleccionado, TextoBuscado])
  useEffect(() => {
    setPaginaActual(1)
  }, [ComponenteSelecccionado, CantidadPaginasPartidas, MenuPrioridadesSeleccionado, MenuCategoriasSeleccionado, TextoBuscado])
  useEffect(() => {
    fectchPartidas()
  }, [ComponenteSelecccionado, PaginaActual, CantidadPaginasPartidas, MenuPrioridadesSeleccionado, MenuCategoriasSeleccionado, TextoBuscado])
  return (
    <div>
      <Nav tabs>
        {Componentes.map((item) =>
          <NavItem key={item.id_componente}>
            <NavLink
              className={classnames({ active: item.numero === ComponenteSelecccionado.numero })}
              onClick={() => onChangeComponentesSeleccion(item)}
            >
              COMP {item.numero}
            </NavLink>
            {/* {componentesComentarios[i] && componentesComentarios[i].mensajes ?
                <div style={{
                  background: "red",
                  borderRadius: "50%",
                  textAlign: "center",
                  position: "absolute",
                  right: "0px",
                  top: "-3px",
                  padding: "1px 4px",
                  zIndex: "20",
                  fontSize: "9px",
                  fontWeight: "bold",

                }}>
                  {componentesComentarios[i].mensajes}
                </div>
                : ""} */}
          </NavItem>
        )}
      </Nav>
      <CardHeader>
        {ComponenteSelecccionado.nombre}
        <div className="float-right">
          <InputGroup size="sm">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <MdSearch size={19} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="descripción o item"
              onChange={e => setTextoBuscado(e.target.value)}
            />
          </InputGroup>
        </div>
      </CardHeader>
      <CardBody>
        <table
          className="table table-sm"
          style={!TogglePartidasEstilo ?
            {
              opacity: 0,
              pointerEvents: "none"
            }
            :
            {
              transition: "opacity 0.5s",
              opacity: 1
            }
          }
        >
          <thead className="resplandPartida">
            <tr>
              <th style={{ width: "39px" }}>
                <MdArrowDropDownCircle size={20} id="FiltrarPor" color={"#ffa90b"} />
                <UncontrolledPopover trigger="click" placement="bottom" target="FiltrarPor">
                  <div
                    title="Busqueda por prioridad - color"
                    className="prioridad"
                    onClick={() => toggleMenuPrioridades()}
                    style={{ color: MenuPrioridadesSeleccionado.color }}
                  >
                    <FaCircle size={17} />
                  </div>
                  <div
                    title="Busqueda por prioridad - ícono"
                    className="prioridad"
                    onClick={() => toggleMenuCategorias()}
                  >
                    {MenuCategoriasSeleccionado.nombre}

                  </div>
                  {
                    //selecciona circulo para filtrar por color
                    MenuPrioridades &&
                    <div
                      style={{
                        background: '#3a3b3c',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        top: '0px',
                        position: 'absolute',

                        left: '-20px'
                      }}>
                      <div className="menuCirculo" style={{ zIndex: "20" }}>
                        {
                          Prioridades.map((priori, IPriori) =>
                            <div
                              className="circleColorFilter"
                              style={{ background: priori.color }}
                              onClick={() => onChangeMenuPrioridades(priori)}
                              key={IPriori}
                            />
                          )
                        }
                        <div className="circleColorFilter"
                          onClick={() => onChangeMenuPrioridades({ id_prioridad: 0 })}
                        >
                          <FaCircle size={15} color={"#171619"} />
                        </div>
                      </div>
                    </div>
                  }

                  {// iconos circulares para hacer el filtro segun seleccion de un icono
                    MenuCategorias &&
                    <div
                      style={{
                        background: '#3a3b3c',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        top: '0px',
                        position: 'absolute',
                        left: '-20px'
                      }}>
                      {
                        CategoriasComponente.map((item, j) =>
                          <div
                            className="circleIconoFiltrar"
                            onClick={() => onChangeMenuCategorias(item)}
                            key={j}>
                            <span className="spanUbi"> {item.nombre} </span>
                          </div>
                        )}
                      <div className="circleIconoFiltrar"
                        onClick={() => onChangeMenuCategorias({ id_iconoCategoria: 0, nombre: <MdCancel size={17} /> })}
                      >
                        <span className="spanUbi">  <MdCancel size={17} /> </span>
                      </div>
                    </div>
                  }

                </UncontrolledPopover>
              </th>
              <th></th>
              <th>ITEM</th>
              <th>DESCRIPCIÓN</th>
              <th>METRADO</th>
              <th>P/U </th>
              <th>P/P </th>
              <th width="20%" >BARRA DE PROGRESO</th>
              <th>  %  </th>
              <th style={{ width: "32px" }}></th>
            </tr>
          </thead>
          <tbody

          >
            {Array.isArray(Partidas) &&
              Partidas.map((item) =>
                [
                  <tr
                    key={item.id_partida}
                    className={item.tipo === "titulo"
                      &&
                      "font-weight-bold text-info icoVer"
                    }

                  >
                    <td

                    >
                      {
                        item.tipo === "partida" &&
                        <div title="prioridad"
                          className="prioridad"
                          style={{ color: "#ffffff" }}
                        // onClick={() => this.Prioridad(i)}
                        >
                          <span
                            className="h6"
                          >
                            <IconosPartidas
                              Id_iconoCategoria={item.iconosCategorias_id_iconoCategoria}
                              Id_prioridad={item.prioridades_id_prioridad}
                              Id_partida={item.id_partida}
                              Categorias={Categorias}
                              CategoriasComponente={CategoriasComponente}
                              Prioridades={Prioridades}
                            />
                          </span>
                        </div>
                      }
                    </td>
                    <td>
                      {item.tipo == "partida" &&
                        <PartidasChat id_partida={item.id_partida} />
                      }
                    </td>
                    {
                      item.tipo == "partida" ?
                        <td
                          onClick={() => onChangePartidasSeleccion(item)}
                          className={item.tipo === "titulo" ?
                            ''
                            :
                            PartidaSelecccionado.item === item.item ?
                              "tdData1"
                              :
                              "tdData"}
                        >
                          {item.item}
                        </td>
                        :
                        <td >
                          {item.item}
                        </td>
                    }
                    <td>{item.descripcion}</td>
                    <td>
                      {item.tipo == "partida" &&
                        Redondea(item.metrado) + " " + (item.unidad_medida && item.unidad_medida.replace('/DIA', ''))
                      }
                    </td>
                    <td>
                      {item.tipo == "partida" &&
                        Redondea(item.costo_unitario)
                      }
                    </td>
                    <td>
                      {item.tipo == "partida" &&
                        Redondea(item.metrado * item.costo_unitario)
                      }
                    </td>
                    <td className="small border border-left border-right-0 border-bottom-0 border-top-0">
                      {item.tipo == "partida" &&
                        <BarraPorcentajeAvancePartida
                          id_partida={item.id_partida}
                          ref={(ref) => {
                            var clone = RefPartidas
                            clone[item.id_partida] = ref
                            setRefPartidas(clone)
                          }}
                        />
                      }
                    </td>
                  </tr>
                  ,
                  (
                    PartidaSelecccionado.item == item.item &&
                    <tr className="resplandPartidabottom">
                      <td colSpan="8">
                        <div className="p-1">
                          <div className="row">
                            <div className="col-sm-7 text-info">
                              {PartidaSelecccionado.descripcion} <MdFlashOn size={20} className="text-danger" />rendimiento: {PartidaSelecccionado.rendimiento} {PartidaSelecccionado.unidad_medida}
                            </div>
                          </div>

                          <table
                            className="table-bordered table-sm table-hover"
                            style={{
                              width: "100%"
                            }}
                          >
                            <thead>
                              <tr>
                                <th>ACTIVIDADES</th>
                                <th>N° VECES</th>
                                <th>LARGO</th>
                                <th>ANCHO</th>
                                <th>ALTO</th>
                                <th>METRADO</th>
                                <th>P / U </th>
                                <th>P / P</th>
                                <th>AVANCE Y SALDO</th>
                                <th>METRAR</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                Actividades.map((item) =>
                                  <tr key={item.id_actividad} className={item.actividad_estado === "Mayor Metrado" ? 'FondMM icoVer' : 'icoVer'}>
                                    <td>{item.nombre}</td>
                                    <td>{item.veces}</td>
                                    <td>{item.largo}</td>
                                    <td>{item.ancho}</td>
                                    <td>{item.alto}</td>
                                    <td>{Redondea(item.parcial)} {PartidaSelecccionado.unidad_medida}</td>
                                    <td>{Redondea(PartidaSelecccionado.costo_unitario)}</td>
                                    <td>{Redondea(item.parcial * PartidaSelecccionado.costo_unitario)}</td>
                                    <td>
                                      <BarraPorcentajeAvanceActividad
                                        id_actividad={item.id_actividad}
                                        ref={(ref) => {
                                          var clone = RefActividades
                                          clone[item.id_actividad] = ref
                                          setRefActividades(clone)
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <ModalIngresoMetrado
                                        Partida={PartidaSelecccionado}
                                        Actividad={item}
                                        recargaActividad={onSaveMetrado}
                                      />
                                    </td>
                                  </tr>
                                )
                              }
                            </tbody>
                          </table>

                        </div>
                      </td>
                    </tr>

                  )

                ]
              )}

          </tbody>

        </table>
        <div
          className="clearfix"
          style={!TogglePartidasEstilo ?
            {
              opacity: 0,
              pointerEvents: "none"
            }
            :
            {
              transition: "opacity 0.5s",
              opacity: 1
            }
          }
        >
          <div className="float-left">
            <select
              onChange={(e) => onChangeCantidadPaginasPartidas(e.target.value)}
              value={CantidadPaginasPartidas}
              className="form-control form-control-sm" >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="float-right mr-2 ">
            <div className="d-flex text-dark">

              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">

                  <Button className="btn btn-light pt-0"
                    onClick={() => onChangePaginaActual(PaginaActual - 1)}
                    disabled={PaginaActual <= 1}
                  >
                    <MdChevronLeft />
                  </Button>
                  <input type="text" style={{ width: "30px" }}
                    value={PaginaActual}
                    disabled
                  />
                  <InputGroupText>
                    {`de  ${Math.ceil(ConteoPartidas / CantidadPaginasPartidas)}`}
                  </InputGroupText>
                </InputGroupAddon>

                <InputGroupAddon addonType="append">
                  <Button className="btn btn-light pt-0"
                    onClick={() => onChangePaginaActual(PaginaActual + 1)}
                    disabled={PaginaActual >= Math.ceil(ConteoPartidas / CantidadPaginasPartidas)}
                  >
                    <MdChevronRight />
                  </Button>
                </InputGroupAddon>
              </InputGroup>

            </div>
          </div>

        </div>
      </CardBody>
    </div>
  );
}
function IconosPartidas({ Id_partida, Id_iconoCategoria, Id_prioridad, Categorias, CategoriasComponente, Prioridades }) {
  useEffect(() => {
    fetchPrioridad(Id_prioridad)
    fetchIcono(Id_iconoCategoria)
  }, []);
  const [Prioridad, setPrioridad] = useState("#f00");
  function fetchPrioridad(id_prioridad) {
    var Prioridad = Prioridades.find((item) => {
      return item.id_prioridad == id_prioridad
    })
    setPrioridad(Prioridad ? Prioridad.color : "#f00")
  }
  const [Icono, setIcono] = useState(<FaSuperpowers />);
  function fetchIcono(id_iconoCategoria) {
    var icono = Categorias.find((icono) => {
      return icono.id_iconoCategoria == id_iconoCategoria
    })
    var componenteIcono = <FaSuperpowers />
    if (icono) {
      if (icono.nombre === "<FaSuperpowers/>") {
        componenteIcono = <FaSuperpowers />
      } else if (icono.nombre === "<MdLibraryBooks/>") {
        componenteIcono = <MdLibraryBooks />
      } else if (icono.nombre === "<TiWarning/>") {
        componenteIcono = <TiWarning />
      } else if (icono.nombre === "<MdWatch/>") {
        componenteIcono = <MdWatch />
      } else if (icono.nombre === "<MdVisibility/>") {
        componenteIcono = <MdVisibility />
      } else if (icono.nombre === "<MdMonetizationOn/>") {
        componenteIcono = <MdMonetizationOn />
      }
    }
    setIcono(componenteIcono)
  }
  //toogle categorias
  const [MenuCategorias, setMenuCategorias] = useState(false);
  const toogleCategorias = () => {
    setMenuCategorias(!MenuCategorias);
  }
  const [CategoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  function onChangeCategoriaSeleccionada(id_iconoCategoria) {
    setCategoriaSeleccionada(id_iconoCategoria)
    toogleCategorias()
    setMenuPrioridades(true)
  }
  //toogle Prioridades
  const [MenuPrioridades, setMenuPrioridades] = useState(false);
  const [, setPrioridadSeleccionada] = useState(0);
  function onChangePrioridadSeleccionada(id_prioridad) {
    setPrioridadSeleccionada(id_prioridad)
    setMenuPrioridades(false)
    updateCategoriaPrioridad(id_prioridad, CategoriaSeleccionada)
  }
  async function updateCategoriaPrioridad(id_prioridad, id_iconoCategoria) {
    await axios.post(`${UrlServer}/putCategoriaPrioridad`,
      {
        "id_iconoCategoria": id_iconoCategoria,
        "id_prioridad": id_prioridad,
        "id_partida": Id_partida
      }
    )
    updatePartida(Id_partida)
  }
  async function updatePartida(id_partida) {
    const request = await axios.post(`${UrlServer}/getPartidaById`,
      {
        "id_partida": id_partida
      }
    )
    fetchPrioridad(request.data.prioridades_id_prioridad)
    fetchIcono(request.data.iconosCategorias_id_iconoCategoria)
  }
  return (
    [
      <div
        onClick={toogleCategorias}
        style={{ color: Prioridad }}
      >
        {Icono}
      </div>,
      <div
        className={MenuCategorias ? "menuCirculo" : "d-none"}
      >
        {
          CategoriasComponente.map((item, i) =>
            <div
              className="circleIcono"
              onClick={() => onChangeCategoriaSeleccionada(item.id_iconoCategoria)}
              key={i}
            >
              <span
                className="spanUbi"
              >{item.nombre} </span>
            </div>
          )
        }
      </div>

      ,
      <div className={MenuPrioridades ? "menuCirculo" : "d-none"}>
        {
          Prioridades.map((item, i) =>
            <div className="circleColor"
              style={{ background: item.color }}
              onClick={() => onChangePrioridadSeleccionada(item.id_prioridad)}
              key={i}>

            </div>
          )
        }
      </div>

    ]

  )
}
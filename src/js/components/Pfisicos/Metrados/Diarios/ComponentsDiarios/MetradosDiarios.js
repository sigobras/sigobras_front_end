import React, { Component, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';
import { FaPlus, FaCheck, FaSuperpowers, FaFilter, FaCircle } from 'react-icons/fa';
import { MdFlashOn, MdClose, MdPerson, MdSearch, MdComment, MdFirstPage, MdLastPage, MdChevronLeft, MdChevronRight, MdVisibility, MdMonetizationOn, MdWatch, MdLibraryBooks, MdAddAPhoto } from 'react-icons/md';
import { TiWarning } from "react-icons/ti";

import { InputGroupAddon, InputGroupText, CustomInput, InputGroup, Spinner, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, InputGroupButtonDropdown, Input, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledPopover, PopoverHeader, PopoverBody, Table } from 'reactstrap';
import classnames from 'classnames';

import { toast } from "react-toastify";
import * as Icos from './index';

import LogoSigobras from './../../../../../../images/logoSigobras.png'
import { UrlServer } from '../../../../Utils/ServerUrlConfig';
import { ConvertFormatStringNumber, PrimerDiaDelMesActual, FechaActual, Redondea } from '../../../../Utils/Funciones'
import Comentarios from './Comentarios';
import { socket } from "../../../../Utils/socket";
import BarraPorcentajeAvancePartida from './BarraPorcentajeAvancePartida';
import PartidasChat from '../../../../libs/PartidasChat'
import BarraPorcentajeAvanceActividad from './BarraPorcentajeAvanceActividad';
import ModalIngresoMetrado from './ModalIngresoMetrado';


export default () => {
  useEffect(() => {
    fectchComponentes()
  }, []);
  // componentes
  const [Componentes, setComponentes] = useState([]);
  async function fectchComponentes() {
    const request = await axios.post(`${UrlServer}/getComponentes`, {
      id_ficha: sessionStorage.getItem('idobra')
    })
    setComponentes(request.data)
    onChangeComponentesSeleccion(request.data[0])
  }
  const [ComponenteSelecccionado, setComponenteSelecccionado] = useState({ numero: 0, nombre: "" });
  function onChangeComponentesSeleccion(componente) {
    setPaginaActual(1)
    setComponenteSelecccionado(componente)
    fectchPartidas(componente.id_componente, 1)
    fectchConteoPartidas(componente.id_componente)

  }
  //paginacion
  const [CantidadPaginasPartidas, setCantidadPaginasPartidas] = useState(40);
  async function onChangeCantidadPaginasPartidas(value) {
    await setCantidadPaginasPartidas(value)
    setPaginaActual(1)
    fectchPartidas(ComponenteSelecccionado.id_componente, 1, value)

  }
  const [PaginaActual, setPaginaActual] = useState(1);
  function onChangePaginaActual(pagina) {
    setPaginaActual(pagina)
    fectchPartidas(ComponenteSelecccionado.id_componente, pagina)
  }
  const [ConteoPartidas, setConteoPartidas] = useState([]);
  async function fectchConteoPartidas(id_componente) {
    const request = await axios.post(`${UrlServer}/getTotalConteoPartidas`, {
      id_componente
    })
    setConteoPartidas(request.data.total)
  }
  //partidas
  const [Partidas, setPartidas] = useState([]);
  async function fectchPartidas(id_componente, pagina = PaginaActual, cantidad = CantidadPaginasPartidas) {
    const request = await axios.post(`${UrlServer}/getPartidas2`, {
      id_componente: id_componente,
      inicio: (pagina - 1) * cantidad,
      fin: (pagina) * cantidad
    })
    console.log("fectchPartidas", request.data);
    setPartidas(request.data)
  }
  const [PartidaSelecccionado, setPartidaSelecccionado] = useState({ numero: 0, nombre: "" });
  function onChangePartidasSeleccion(Partida) {
    setPartidaSelecccionado(Partida)
    fectchActividades(Partida.id_partida)
  }
  //actividades
  const [Actividades, setActividades] = useState([]);
  async function fectchActividades(id_partida) {
    const request = await axios.post(`${UrlServer}/getActividades2`, {
      id_partida
    })
    console.log("fectchActividades", request.data);
    setActividades(request.data)
  }
  //recarga de datos
  const [RefActividades, setRefActividades] = useState([]);
  const [RefPartidas, setRefPartidas] = useState([]);
  function onSaveMetrado(id_partida, id_actividad) {
    RefPartidas[id_partida].recarga()
    RefActividades[id_actividad].recarga()
  }
  return (
    <div>
      <Nav tabs>
        {Componentes.map((item, i) =>
          <NavItem key={i}>
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
            <InputGroupAddon addonType="prepend"><InputGroupText><MdSearch size={19} /> </InputGroupText> </InputGroupAddon>
            <Input
              placeholder="Buscar por descripción"
            // onKeyUp={e => this.Filtrador(e)} 
            />
            <InputGroupButtonDropdown
              addonType="append"
            // isOpen={this.state.dropdownOpen} 
            // toggle={this.toggleDropDown}
            >
              <DropdownToggle caret className="bg-primary">
                {/* {this.state.FilterSelected} */}
              </DropdownToggle>
              <DropdownMenu >
                <DropdownItem
                // onClick={() => this.Filtrador(101)}
                >Todo</DropdownItem>
                <DropdownItem
                // onClick={() => this.Filtrador(0)} 
                >0%</DropdownItem>
                <DropdownItem
                // onClick={() => this.Filtrador(100)} 
                >100%</DropdownItem>
                <DropdownItem
                // onClick={() => this.Filtrador(99)}
                >Progreso</DropdownItem>
                <DropdownItem
                // onClick={() => this.Filtrador(104)}
                >MM</DropdownItem>
              </DropdownMenu>
            </InputGroupButtonDropdown>
          </InputGroup>
        </div>
      </CardHeader>
      <CardBody>

        <table className="table table-sm">
          <thead className="resplandPartida">
            <tr>
              <th style={{ width: "39px" }}>
                <Button id="FiltrarPor" type="button" className="py-0 px-1">
                  <FaFilter />
                </Button>
                <UncontrolledPopover trigger="click" placement="bottom" target="FiltrarPor">
                  <div
                    title="Busqueda por prioridad - color"
                    className="prioridad"
                  // onClick={() => this.Prioridad("filtro")}
                  >
                    <FaCircle size={17} />
                  </div>
                  <div
                    title="Busqueda por prioridad - ícono"
                    className="prioridad"
                  // onClick={() => this.Prioridad("filtroIcono")}
                  >
                    <FaSuperpowers size={17} />
                  </div>
                  {
                    //selecciona circulo para filtrar por color
                    false &&
                    <div
                      style={{
                        background: 'radial-gradient(black, #000000a6)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        top: '0px',
                        position: 'absolute',
                        boxShadow: '1px 1px 6px 4px #545454',
                        left: '-20px'
                      }}>
                      <div className="menuCirculo" style={{ zIndex: "20" }}>
                        {/* {
                                DataPrioridadesApi.map((priori, IPriori) =>
                                  <div className="circleColorFilter" 
                                  style={{ background: priori.color }} 
                                  // onClick={() => this.Filtrador(priori.valor)} 
                                  key={IPriori} 
                                  />
                                )
                              } */}
                        <div className="circleColorFilter"
                        // onClick={() => this.Prioridad("filtro")}
                        >
                          <FaCircle size={15} />
                        </div>
                      </div>
                    </div>
                  }

                  {// iconos circulares para hacer el filtro segun seleccion de un icono
                    false ?
                      <div
                        style={{
                          background: 'radial-gradient(black, #000000a6)',
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          top: '0px',
                          position: 'absolute',
                          boxShadow: '1px 1px 6px 4px #545454',
                          left: '-20px'
                        }}>
                        {/* {
                              DataIconosCategoriaApi.map((Icono, IIcono) =>
                                <div className="circleIconoFiltrar" onClick={() => this.Filtrador(Icono.icono)} key={IIcono}>
                                  <span className="spanUbi"> {Icono.nombre} </span>
                                </div>
                              )} */}
                        <div className="circleIconoFiltrar"
                        // onClick={() => this.Prioridad("filtroIcono")}
                        >
                          <span className="spanUbi">  <FaSuperpowers size={17} /> </span>
                        </div>
                      </div>

                      : null
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
          <tbody>
            {Partidas.map((item, i) =>
              [
                <tr
                  key={item.id_partida}
                  className={item.tipo === "titulo" ? "font-weight-bold text-info icoVer" : false ? "font-weight-light resplandPartida icoVer" : "font-weight-light icoVer"}>
                  <td></td>
                  <td>
                    {item.tipo == "partida" &&
                      <PartidasChat id_partida={item.id_partida} />
                    }
                  </td>
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
                              Actividades.map((item, j) =>
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
        <div className="clearfix">
          <div className="float-left">
            <select
              onChange={(e) => onChangeCantidadPaginasPartidas(e.target.value)}
              value={CantidadPaginasPartidas}
              className="form-control form-control-sm" >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
          </div>
          <div className="float-right mr-2 ">
            <div className="d-flex text-dark">

              <InputGroup size="sm">
                <InputGroupAddon addonType="prepend">
                  <Button className="btn btn-light pt-0"
                  // onClick={() => this.PaginaActual(1)}
                  // disabled={PaginaActual === 1}
                  >
                    <MdFirstPage />
                  </Button>
                  <Button className="btn btn-light pt-0"
                  // onClick={() => this.PaginaActual(PaginaActual - 1)}
                  // disabled={PaginaActual === 1}
                  >
                    <MdChevronLeft />
                  </Button>
                  <input type="text" style={{ width: "30px" }}
                    value={PaginaActual}
                    onChange={e => onChangePaginaActual(e.target.value)}
                  />
                  <InputGroupText>
                    {`de  ${Math.ceil(ConteoPartidas / CantidadPaginasPartidas)}`}
                  </InputGroupText>
                </InputGroupAddon>

                <InputGroupAddon addonType="append">
                  <Button className="btn btn-light pt-0"
                  // onClick={() => this.PaginaActual(PaginaActual + 1)}
                  // disabled={PaginaActual === NumeroPaginas.length}
                  >
                    <MdChevronRight /></Button>
                  <Button className="btn btn-light pt-0"
                  // onClick={() => this.PaginaActual(NumeroPaginas.pop())}
                  // disabled={PaginaActual === NumeroPaginas.length}
                  >
                    <MdLastPage />
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
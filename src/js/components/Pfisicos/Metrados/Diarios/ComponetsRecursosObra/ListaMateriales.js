import React, { Component } from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';
import { FaPlus, FaCheck, FaSuperpowers } from 'react-icons/fa';
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { MdFlashOn, MdReportProblem, MdClose, MdPerson, MdSearch, MdSettings, MdFilterTiltShift, MdVisibility, MdMonetizationOn, MdWatch, MdLibraryBooks, MdInsertPhoto, MdAddAPhoto } from 'react-icons/md';
import { TiWarning } from "react-icons/ti";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { InputGroupAddon, InputGroupText, CustomInput, InputGroup, Spinner, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, UncontrolledDropdown, Input, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledPopover, PopoverHeader, PopoverBody, Col, Row } from 'reactstrap';
import classnames from 'classnames';

import { toast } from "react-toastify";

import LogoSigobras from '../../../../../../images/logoSigobras.png'
import { UrlServer, Id_Obra } from '../../../../Utils/ServerUrlConfig';
import { ConvertFormatStringNumber, PrimerDiaDelMesActual, FechaActual } from '../../../../Utils/Funciones'
// import { inflateRaw } from 'zlib';

class ListaMateriales extends Component {
  constructor() {
    super();

    this.state = {
      DataComponentes: [],
      DataPartidas: [],
      DataResumenComps: [],
      DataRecursosCdAPI: [],
      DataListaRecursoDetallado: [],
      DataPrioridadesApi: [],
      DataIconosCategoriaApi: [],
      DataTipoRecursoResumen: [{ tipo: "Equipos" }, { tipo: "Mano de Obra" }, { tipo: "Materiales" }],
      DataRecursosListaApi: [],
      DataResumenGeneralCompApi: [],

      activeTab: 'RESUMEN',
      activeTabRecusoCd: "0",
      activeTabResumen: "",
      // modal: false,
      // modalMm: false,
      nombreComponente: '',

      // funciones de nueva libreria
      // dropdownOpen: false,
      collapse: 2599,
      id_componente: '',
      indexPartida: 0,
      OpcionMostrarMM: '',
      mostrarIconos: null,
      mostrarColores: null,
      // filtrador
      BuscaPartida: null,
      FilterSelected: "% Avance",

      // demos  iconos-----------------
      iconos: [<MdMonetizationOn />, <MdVisibility />, <MdWatch />, <TiWarning />, <MdLibraryBooks />, <FaSuperpowers />],

      dataFiltrada: [],

      modalImgPartida: false,

      CollapseResumenTabla: "resumenRecursos",

    }

    this.Tabs = this.Tabs.bind(this)
    // this.EnviarMayorMetrado = this.EnviarMayorMetrado.bind(this)
    this.CollapseItem = this.CollapseItem.bind(this);

    this.Filtrador = this.Filtrador.bind(this)
    this.Prioridad = this.Prioridad.bind(this);
    this.UpdatePrioridadIcono = this.UpdatePrioridadIcono.bind(this);
    this.UpdatePrioridadColor = this.UpdatePrioridadColor.bind(this);

    this.CollapseResumenTabla = this.CollapseResumenTabla.bind(this);
    this.TabRecurso = this.TabRecurso.bind(this);
    this.tabResumenTipoRecurso = this.tabResumenTipoRecurso.bind(this);
    this.reqListaRecursos = this.reqListaRecursos.bind(this);
    this.reqResumen = this.reqResumen.bind(this);
    this.reqChartResumenGeneral = this.reqChartResumenGeneral.bind(this);
  }

  componentWillMount() {
    document.title = "Metrados Diarios"
    axios.post(`${UrlServer}/getmaterialescomponentes`, {
      id_ficha: Id_Obra
    })
      .then((res) => {
        // console.log(res.data);
        // console.time("tiempo");


        var partidas = res.data[0].partidas
        // seteando la data que se me envia del api- agrega un icono
        for (let i = 0; i < partidas.length; i++) {
          // console.log("partida",  partidas[i].iconocategoria_nombre)
          if (partidas[i].iconocategoria_nombre === "<FaSuperpowers/>") {
            partidas[i].iconocategoria_nombre = <FaSuperpowers />
          } else if (partidas[i].iconocategoria_nombre === "<MdLibraryBooks/>") {
            partidas[i].iconocategoria_nombre = <MdLibraryBooks />
          } else if (partidas[i].iconocategoria_nombre === "<TiWarning/>") {
            partidas[i].iconocategoria_nombre = <TiWarning />
          } else if (partidas[i].iconocategoria_nombre === "<MdWatch/>") {
            partidas[i].iconocategoria_nombre = <MdWatch />
          } else if (partidas[i].iconocategoria_nombre === "<MdVisibility/>") {
            partidas[i].iconocategoria_nombre = <MdVisibility />
          } else if (partidas[i].iconocategoria_nombre === "<MdMonetizationOn/>") {
            partidas[i].iconocategoria_nombre = <MdMonetizationOn />
          } else {
            partidas[i].iconocategoria_nombre = null
          }
        }

        // console.log(partidas)
        // console.timeEnd("tiempo");

        this.setState({
          DataComponentes: res.data,
          DataPartidas: res.data[0].partidas,
          nombreComponente: res.data[0].nombre,
        })
      })
      .catch((error) => {
        toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.', { position: "top-right", autoClose: 5000 });
        // console.error('algo salio mal verifique el',error);
      })

    // solicita el resumen general por apis
    this.reqChartResumenGeneral(Id_Obra)

    // axios consulta al api de  prioridades ====================================
    axios.get(`${UrlServer}/getPrioridades`)
      .then((res) => {
        // console.log("datos", res.data);
        this.setState({
          DataPrioridadesApi: res.data
        })
      })
      .catch((err) => {
        console.log("errores al realizar la peticion de prioridades", err);

      })
    // axios consulta al api de  prioridades ====================================

    axios.get(`${UrlServer}/getIconoscategorias`)
      .then((res) => {
        // console.log("datos", res.data);

        var CategoriasIconos = res.data

        CategoriasIconos.forEach(ico => {
          if (ico.nombre === "<FaSuperpowers/>") {
            ico.nombre = <FaSuperpowers />
          } else if (ico.nombre === "<MdLibraryBooks/>") {
            ico.nombre = <MdLibraryBooks />
          } else if (ico.nombre === "<TiWarning/>") {
            ico.nombre = <TiWarning />
          } else if (ico.nombre === "<MdWatch/>") {
            ico.nombre = <MdWatch />
          } else if (ico.nombre === "<MdVisibility/>") {
            ico.nombre = <MdVisibility />
          } else if (ico.nombre === "<MdMonetizationOn/>") {
            ico.nombre = <MdMonetizationOn />
          } else {
            ico.nombre = null
          }
        });

        // console.log("CategoriasIconos", CategoriasIconos);

        this.setState({
          DataIconosCategoriaApi: CategoriasIconos
        })
      })
      .catch((err) => {
        console.log("errores al realizar la peticion de iconos", err);

      })

  }

  Tabs(tab, id_componente, nombComp) {
    console.log("tab ", tab)
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        nombreComponente: nombComp,
        DataPartidas: [],
        id_componente,
        collapse: -1,
        BuscaPartida: null,

      });
    }
    // consulta al resumen
    if ("RESUMEN" === tab) {
      this.reqChartResumenGeneral(Id_Obra)
      return
    }
    // get partidas -----------------------------------------------------------------
    axios.post(`${UrlServer}/getmaterialespartidacomponente`, {
      id_componente: id_componente
    })
      .then((res) => {
        // console.log('getPartidas>>', res.data);

        var partidas = res.data
        // seteando la data que se me envia del api- agrega un icono
        for (let i = 0; i < partidas.length; i++) {
          // console.log("partida",  partidas[i].iconocategoria_nombre)
          if (partidas[i].iconocategoria_nombre === "<FaSuperpowers/>") {
            partidas[i].iconocategoria_nombre = <FaSuperpowers />
          } else if (partidas[i].iconocategoria_nombre === "<MdLibraryBooks/>") {
            partidas[i].iconocategoria_nombre = <MdLibraryBooks />
          } else if (partidas[i].iconocategoria_nombre === "<TiWarning/>") {
            partidas[i].iconocategoria_nombre = <TiWarning />
          } else if (partidas[i].iconocategoria_nombre === "<MdWatch/>") {
            partidas[i].iconocategoria_nombre = <MdWatch />
          } else if (partidas[i].iconocategoria_nombre === "<MdVisibility/>") {
            partidas[i].iconocategoria_nombre = <MdVisibility />
          } else if (partidas[i].iconocategoria_nombre === "<MdMonetizationOn/>") {
            partidas[i].iconocategoria_nombre = <MdMonetizationOn />
          } else {
            partidas[i].iconocategoria_nombre = null
          }
        }
        // console.log("dsds", partidas);

        this.setState({
          DataPartidas: partidas,
        })
      })
      .catch((error) => {
        toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.', { position: "top-right", autoClose: 5000 });
        // console.error('algo salio mal verifique el',error);
      })
  }
  // FUNCIONES DE ESTADOS DE OBRA  =====================================================

  CollapseItem(valor, id_partida) {
    if (valor !== -1 && id_partida !== -1) {
      let event = valor
      this.setState({
        collapse: this.state.collapse === Number(event) ? -1 : Number(event),
        indexPartida: valor,
        DataRecursosCdAPI: [],
        DataListaRecursoDetallado: []
      });


      // getActividades -----------------------------------------------------------------
      if (event !== this.state.collapse) {
        axios.post(`${UrlServer}/getmaterialespartidaTipos`, {
          id_partida: id_partida
        })
          .then((res) => {
            console.log('data tipos recursos >>', res.data);

            this.setState({
              DataRecursosCdAPI: res.data,
              // DataListaRecursoDetallado:res.data.mayor_metrado
            })
            console.log("res data prueba ", res.data[0]["tipo"])
            this.reqListaRecursos(id_partida, res.data[0]["tipo"])

          })
          .catch((error) => {
            toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.', { position: "top-right", autoClose: 5000 });
            // console.error('algo salio mal verifique el',error);
          })
      }

    }
  }

  Filtrador(e) {
    // console.log("datos ", e)
    var valorRecibido = e
    if (typeof valorRecibido === "number") {
      this.setState({
        BuscaPartida: valorRecibido,
        mostrarIconos: -1
      })

      switch (valorRecibido) {
        case 101:
          this.setState({
            FilterSelected: "% Avance"
          })
          break;

        case 0:
          this.setState({
            FilterSelected: "0%"
          })
          break;

        case 100:
          this.setState({
            FilterSelected: "100%"
          })
          break;

        case 104:
          this.setState({
            FilterSelected: "MM"
          })
          break;
        default:
          this.setState({
            FilterSelected: "Progreso"
          })
          break;
      }
      // console.log("valorRecibido ",valorRecibido)

    } else {
      this.setState({
        BuscaPartida: e.target.value,
      })
      // console.log("valorRecibido ",e.target.value)

    }
  }

  Prioridad(i) {
    console.log("cambia", i)
    this.setState({
      mostrarIconos: this.state.mostrarIconos === i ? -1 : i
    })
  }

  UpdatePrioridadIcono(idPartida, id_icono, index) {
    // console.log("index", index);


    axios.put(`${UrlServer}/putIconocategoria`,
      {
        "id_partida": idPartida,
        "id_iconoCategoria": id_icono
      }
    )
      .then((res) => {
        // partidas[index].iconocategoria_nombre = res.data.color
        // console.info("response", res.data)
        var partidas = this.state.DataPartidas
        var CategoriasIconos = res.data.nombre

        // CategoriasIconos.forEach(ico => {
        if (CategoriasIconos === "<FaSuperpowers/>") {
          CategoriasIconos = <FaSuperpowers />
        } else if (CategoriasIconos === "<MdLibraryBooks/>") {
          CategoriasIconos = <MdLibraryBooks />
        } else if (CategoriasIconos === "<TiWarning/>") {
          CategoriasIconos = <TiWarning />
        } else if (CategoriasIconos === "<MdWatch/>") {
          CategoriasIconos = <MdWatch />
        } else if (CategoriasIconos === "<MdVisibility/>") {
          CategoriasIconos = <MdVisibility />
        } else if (CategoriasIconos === "<MdMonetizationOn/>") {
          CategoriasIconos = <MdMonetizationOn />
        } else {
          CategoriasIconos = null
        }
        // });
        partidas[index].iconocategoria_nombre = CategoriasIconos

        // console.log("CategoriasIconos", CategoriasIconos)
        this.setState({
          DataPartidas: partidas,
          mostrarIconos: -1,
          mostrarColores: index
        })
      })
      .catch((err) => {
        console.error("error", err);
      })
  }

  UpdatePrioridadColor(idPartida, prioridad, index) {

    var partidas = this.state.DataPartidas
    // console.log("partidas", idPartida, prioridad, index);

    axios.put(`${UrlServer}/putPrioridad`,
      {
        "id_partida": idPartida,
        "id_prioridad": prioridad
      }
    )
      .then((res) => {
        partidas[index].prioridad_color = res.data.color
        // console.info("response", res)
        this.setState({
          DataPartidas: partidas,
          mostrarIconos: -1,
          mostrarColores: null
        })
      })
      .catch((err) => {
        console.error("error", err);
      })
  }

  CollapseResumenTabla(index) {
    console.log("index ", index)
    this.setState({
      CollapseResumenTabla: this.state.CollapseResumenTabla === index ? "" : index,
    });
  }

  TabRecurso(index, tipoRecurso, idPartida) {
    console.log("index ", index, "tipoRecurso", tipoRecurso, "idPartida ", idPartida)

    if (this.state.activeTabRecusoCd !== index) {
      this.setState({
        activeTabRecusoCd: index
      });
      this.reqListaRecursos(idPartida, tipoRecurso)
    }

  }

  tabResumenTipoRecurso(index, TipoRecurso) {
    if (this.state.activeTabResumen !== index) {
      this.setState({
        activeTabResumen: index
      });
      this.reqResumen(Id_Obra, TipoRecurso)
    }
  }

  // requests al api======================================================================

  reqListaRecursos(idPartida, tipo) {
    console.log("reqListaRecursos ", "idPartida", idPartida, "tipo ", tipo)
    axios.post(`${UrlServer}/getmaterialespartidaTiposLista`,
      {
        "id_partida": idPartida,
        "tipo": tipo
      }
    )
      .then((res) => {
        console.log("response partidas lista de recursos ", res)
        this.setState({
          DataListaRecursoDetallado: res.data
        })
      })
      .catch((err) => {
        console.error("falló el api", err)
      })
  }

  reqResumen(idFicha, tipoRecurso) {
    console.log("tipo recurso ", tipoRecurso)
    axios.post(`${UrlServer}/getmaterialesResumen`, {
      "id_ficha": idFicha,
      "tipo": tipoRecurso
    })
      .then((res) => {
        console.log("resumen de componentes ", res.data)
        this.setState({
          DataRecursosListaApi: res.data
        })
      })
      .catch((err) => {
        console.error("error al consultar al api ", err)
      })
  }

  // chartresumen de componentes

  reqChartResumenGeneral(IdObra) {
    axios.post(`${UrlServer}/getmaterialesResumenChart`, {
      "id_ficha": IdObra
    })
      .then((res) => {
        this.setState({ DataResumenGeneralCompApi: res.data })
      })
  }

  render() {
    var { DataPrioridadesApi, DataIconosCategoriaApi, DataComponentes, DataPartidas, DataRecursosCdAPI, DataListaRecursoDetallado, DataTipoRecursoResumen, DataRecursosListaApi, DataResumenGeneralCompApi, activeTabResumen, smsValidaMetrado, collapse, nombreComponente, OpcionMostrarMM, SMSinputTypeImg, mostrarColores, file, CollapseResumenTabla } = this.state

    const ResumenRecursos = {
      "colors": [
        "#d35400",
        "#2980b9",
        "#2ecc71",
        "#f1c40f",
        "#2c3e50",
        "#7f8c8d"
      ],
      "chart": {
        "backgroundColor": "#161C20",
        "style": {
          "fontFamily": "Roboto",
          "color": "#666666"
        }
      },
      title: {
        text: 'Expediente vs  Ejecutado',
        "align": "center",
        "style": {
          "fontFamily": "Roboto Condensed",
          "fontWeight": "bold",
          "color": "#666666"
        }
      },
      "legend": {
        "align": "center",
        "verticalAlign": "bottom",
        "itemStyle": {
          "color":
            "#424242",
          "color": "#ffffff"
        }
      },
      xAxis: {
        categories: DataResumenGeneralCompApi.categories,
      },

      yAxis: {
        title: {
          text: 'Soles'
        },
        labels: {
          formatter: function () {
            return this.value / 1;
          }
        },
        "gridLineColor": "#424242",
        "ridLineWidth": 1,
        "minorGridLineColor": "#424242",
        "inoGridLineWidth": 0.5,
        "tickColor": "#424242",
        "minorTickColor": "#424242",
        "lineColor": "#424242"
      },
      labels: {
        items: [{
          html: 'TOTAL COSTO DIRECTO',
          style: {
            left: '50px',
            top: '18px',
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'white'
          }
        }]
      },
      series: DataResumenGeneralCompApi.series,

    }

    const ResumenRecursosComponentes = {
      "colors": [
        "#d35400",
        "#2980b9",
        "#2ecc71",
        "#f1c40f",
        "#2c3e50",
        "#7f8c8d"
      ],
      "chart": {
        "backgroundColor": "#161C20",
        "style": {
          "fontFamily": "Roboto",
          "color": "#666666"
        }
      },
      title: {
        text: 'Expediente vs  Ejecutado',
        "align": "center",
        "style": {
          "fontFamily": "Roboto Condensed",
          "fontWeight": "bold",
          "color": "#666666"
        }
      },
      "legend": {
        "align": "center",
        "verticalAlign": "bottom",
        "itemStyle": {
          "color":
            "#424242",
          "color": "#ffffff"
        }
      },
      xAxis: {
        categories: ['Personal', 'Bienes', 'Servicios'],
      },

      yAxis: {
        title: {
          text: 'Soles'
        },
        labels: {
          formatter: function () {
            return this.value / 1;
          }
        },
        "gridLineColor": "#424242",
        "ridLineWidth": 1,
        "minorGridLineColor": "#424242",
        "inoGridLineWidth": 0.5,
        "tickColor": "#424242",
        "minorTickColor": "#424242",
        "lineColor": "#424242"
      },
      labels: {
        items: [{
          html: 'TOTAL COSTO DIRECTO',
          style: {
            left: '50px',
            top: '18px',
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'white'
          }
        }]
      },
      series: [{
        type: 'column',
        name: 'Expediente ',
        data: [1, 2, 54]
      }, {
        type: 'column',
        name: 'Acumulado',
        data: [2, 3, 45]
      }, {
        type: 'spline',
        name: 'Average',
        data: [3, 2.67, 5],
        marker: {
          lineWidth: 2,
          lineColor: Highcharts.getOptions().colors[3],
          fillColor: 'white'
        }
      }, {
        type: 'pie',
        name: 'Segun Expediente',
        data: [{
          name: 'Servicios',
          y: 13,
          color: Highcharts.getOptions().colors[0] // Jane's color
        }, {
          name: 'Bienes',
          y: 23,
          color: Highcharts.getOptions().colors[1] // John's color
        }, {
          name: 'Personal',
          y: 19,
          color: Highcharts.getOptions().colors[2] // Joe's color
        }],
        center: [100, 80],
        size: 100,
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }]
    }


    var DatosPartidasFiltrado = DataPartidas
    var BuscaPartida = this.state.BuscaPartida

    // console.log("BuscaPartida", BuscaPartida);


    if (BuscaPartida !== null) {

      if (typeof BuscaPartida === "number") {
        DatosPartidasFiltrado = DatosPartidasFiltrado.filter((filtrado) => {
          if (BuscaPartida === 101) {
            return (filtrado.porcentaje <= 100);
          } else if (BuscaPartida === 99 && filtrado.tipo !== "titulo" && filtrado.porcentaje !== 0) {
            return (filtrado.porcentaje <= 99);


          } else if (BuscaPartida === 104 && filtrado.tipo !== "titulo") {
            return (filtrado.mayorMetrado === 1);

            // filtramos las prioridades color
          } else if (BuscaPartida === 1) {
            return (filtrado.prioridad_color === "#f00");

          } else if (BuscaPartida === 2) {
            return (filtrado.prioridad_color === "#ffff00");

          } else if (BuscaPartida === 3) {
            return (filtrado.prioridad_color === "#00b050");

          } else if (BuscaPartida === 4) {
            return (filtrado.prioridad_color === "#0080ff");

          } else if (BuscaPartida === 5 && filtrado.tipo !== "titulo") {
            return (filtrado.prioridad_color === "#ffffff");

          } else {
            return filtrado.porcentaje === BuscaPartida
          }

        });
      } else {

        BuscaPartida = this.state.BuscaPartida.trim().toLowerCase();
        DatosPartidasFiltrado = DatosPartidasFiltrado.filter((filtrado) => {
          return filtrado.descripcion.toLowerCase().match(BuscaPartida);
        });
      }

    }


    return (
      <div>
        <Card>
          <Nav tabs>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTab === "RESUMEN" })} onClick={() => this.Tabs("RESUMEN", "RESUMEN", "RESUMEN")}>
                RESUMEN
                  </NavLink>
            </NavItem>
            {DataComponentes.length === 0 ? <Spinner color="primary" size="sm" /> : DataComponentes.map((comp, indexComp) =>
              <NavItem key={indexComp}>
                <NavLink className={classnames({ active: this.state.activeTab === indexComp.toString() })} onClick={() => this.Tabs(indexComp.toString(), comp.id_componente, comp.nombre)}>
                  C-{comp.numero}
                </NavLink>
              </NavItem>
            )}
          </Nav>
          {/* RESUMEN - MAS DETALLES DE BINES DE LA OBRA */}
          {
            this.state.activeTab === "RESUMEN" ?

              <Card className="m-1">
                <CardHeader> {nombreComponente} </CardHeader>
                <CardBody>

                  <div className="mb-1 mt-1">
                    <HighchartsReact
                      highcharts={Highcharts}
                      // constructorType={'stockChart'}
                      options={ResumenRecursos}
                    />
                  </div>
                  <Nav tabs>
                    {
                      DataTipoRecursoResumen.map((Resumen, index) =>
                        <NavItem key={index}>
                          <NavLink className={classnames({ active: this.state.activeTabResumen === index.toString() })} onClick={() => { this.tabResumenTipoRecurso(index.toString(), Resumen.tipo); }} >
                            {Resumen.tipo}
                          </NavLink>
                        </NavItem>
                      )

                    }
                  </Nav>
                  <Row className="mt-1">
                    <Col md="6">
                      <Card>
                        <CardHeader className="p-1">RESUMEN DE RECURSOS SEGÚN EXPEDIENTE TÉCNICO</CardHeader>
                        <CardBody>
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>RECURSO</th>
                                <th>UND</th>
                                <th>CANTIDAD</th>
                                <th>PRECIO S/.</th>
                                <th> PARCIAL S/.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                DataRecursosListaApi.map((ReqLista, IndexRL) =>
                                  <tr key={IndexRL}>
                                    <td>{ReqLista.descripcion} </td>
                                    <td>{ReqLista.unidad} </td>
                                    <td> {ReqLista.recurso_cantidad}</td>
                                    <td> {ReqLista.recurso_precio}</td>
                                    <td> {ReqLista.recurso_parcial}</td>
                                  </tr>
                                )
                              }

                            </tbody>
                          </table>
                        </CardBody>
                      </Card>

                    </Col>
                    <Col md="6">

                      <Card>
                        <CardHeader className="p-1">RECURSOS GASTADOS HASTA LA FECHA ( HOY 09/05/2019 )</CardHeader>
                        <CardBody>
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>CANTIDAD</th>
                                <th>PRECIO S/.</th>
                                <th>PARCIAL S/.</th>
                                <th>DIFERENCIA</th>
                                <th>%</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                DataRecursosListaApi.map((ReqLista, IndexRL) =>
                                  <tr key={IndexRL}>
                                    <td> {ReqLista.recurso_gasto_cantidad}</td>
                                    <td> {ReqLista.recurso_precio}</td>
                                    <td> {ReqLista.recurso_gasto_parcial}</td>
                                    <td> {ReqLista.diferencia}</td>
                                    <td> {ReqLista.porcentaje}</td>
                                  </tr>
                                )
                              }
                            </tbody>
                          </table>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              :

              <Card className="m-1">
                <CardHeader className="p-1">
                  {nombreComponente}
                  <div className="float-right">
                    <InputGroup size="sm">
                      <InputGroupAddon addonType="prepend"><InputGroupText><MdSearch size={20} /> </InputGroupText> </InputGroupAddon>

                      <Input placeholder="Buscar por descripción" onKeyUp={e => this.Filtrador(e)} />

                      <UncontrolledDropdown addonType="append">
                        <DropdownToggle caret className="bg-primary">
                          {this.state.FilterSelected}
                        </DropdownToggle>
                        <DropdownMenu >
                          <DropdownItem onClick={() => this.Filtrador(101)}>Todo</DropdownItem>
                          <DropdownItem onClick={() => this.Filtrador(0)} >0%</DropdownItem>
                          <DropdownItem onClick={() => this.Filtrador(100)} >100%</DropdownItem>
                          <DropdownItem onClick={() => this.Filtrador(99)}>Progreso</DropdownItem>
                          {/* <DropdownItem onClick={() => this.Filtrador(104)}>MM</DropdownItem> */}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </InputGroup>

                  </div>
                </CardHeader>
                <CardBody>

                  {/* DATA COMPONENTES LISTA DETALLADO */}
                  
                  <Nav tabs className="float-right">
                    <NavItem>
                      <NavLink className={classnames({ "bg-warning text-dark": this.state.CollapseResumenTabla === 'resumenRecursos' })} onClick={() => { this.CollapseResumenTabla("resumenRecursos") }} >
                        MOSTRAR RESUMEN  { this.state.CollapseResumenTabla === 'resumenRecursos' ?<IoMdArrowDropdownCircle /> :  <IoMdArrowDropupCircle />}
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink className={classnames({ "bg-warning text-dark": this.state.CollapseResumenTabla === 'tablaPartidas' })} onClick={() => { this.CollapseResumenTabla("tablaPartidas") }} >
                       MOSTRAR POR PARTIDA { this.state.CollapseResumenTabla === 'tablaPartidas' ?<IoMdArrowDropdownCircle /> :  <IoMdArrowDropupCircle />}
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <br />
                  <br />
                  <Collapse isOpen={CollapseResumenTabla === "resumenRecursos"}>
                    <div className="mb-1 mt-1">
                      <HighchartsReact
                        highcharts={Highcharts}
                        // constructorType={'stockChart'}
                        options={ResumenRecursosComponentes}
                      />
                    </div>
                    <Nav tabs>
                      
                      <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }} >
                          PERSONAL
                              </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }} >
                          BIENES
                              </NavLink>
                      </NavItem>

                      <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }} >
                          MATERIALES
                              </NavLink>
                      </NavItem>
                    </Nav>
                    <Row className="mt-1">

                      <Col md="6">
                        <Card>
                          <CardHeader className="p-1">RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN EXPEDIENTE TÉCNICO</CardHeader>
                          <CardBody>
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>RECURSO</th>
                                  <th>UND</th>
                                  <th>CANTIDAD</th>
                                  <th>PRECIO S/.</th>
                                  <th> PARCIAL S/.</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>ABONO </td>
                                  <td>M3</td>
                                  <td>4.300</td>
                                  <td>46.300</td>
                                  <td>569.00</td>
                                </tr>
                              </tbody>
                            </table>
                          </CardBody>
                        </Card>

                      </Col>
                      <Col md="6">

                        <Card>
                          <CardHeader className="p-1">RECURSOS GASTADOS HASTA LA FECHA ( HOY 09/05/2019 )</CardHeader>
                          <CardBody>
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>CANTIDAD</th>

                                  <th>CANTIDAD</th>
                                  <th>PRECIO S/.</th>
                                  <th>PARCIAL S/.</th>
                                  <th>DIFERENCIA</th>
                                  <th>%</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>ABONO </td>
                                  <td>M3</td>
                                  <td>4.300</td>
                                  <td>46.300</td>
                                  <td>569.00</td>
                                  <td>569 %</td>
                                </tr>
                              </tbody>
                            </table>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>

                  </Collapse>
                  <Collapse isOpen={CollapseResumenTabla === "tablaPartidas"}>

                    <table className="table table-sm mt-2">
                      <thead className="resplandPartida">
                        <tr>
                          <th style={{ width: "39px" }}>
                            <div title="Busqueda por prioridad" className="prioridad" onClick={() => this.Prioridad("filtro")}>
                              <FaSuperpowers size={15} />
                            </div>

                            {
                              //selecciona circulo para filtrar
                              this.state.mostrarIconos === "filtro" ?
                                <div className="menuCirculo">
                                  {
                                    DataPrioridadesApi.map((priori, IPriori) =>
                                      <div className="circleColor" style={{ background: priori.color }} onClick={() => this.Filtrador(priori.valor)} key={IPriori} />
                                    )
                                  }
                                </div>
                                : ""
                            }

                          </th>
                          <th>ITEM</th>
                          <th >DESCRIPCIÓN</th>
                          <th>METRADO</th>
                          <th>P/U </th>
                          <th>P/P </th>
                          <th width="20%">BARRA DE PROGRESO</th>
                        </tr>
                      </thead>
                      {
                        DatosPartidasFiltrado.length <= 0 ?
                          <tbody><tr><td colSpan="8" className="text-center text-warning">No hay datos</td></tr></tbody> :
                          DatosPartidasFiltrado.map((metrados, i) =>
                            <tbody key={i} >

                              <tr className={metrados.tipo === "titulo" ? "font-weight-bold text-warning icoVer" : collapse === i ? "font-weight-light resplandPartida icoVer" : "font-weight-light icoVer"}>
                                <td>
                                  {
                                    metrados.tipo === "titulo" ? "" :
                                      <div title="prioridad" className="prioridad" style={{ color: metrados.prioridad_color }} onClick={() => this.Prioridad(i)}>
                                        <span className="h6"> {metrados.iconocategoria_nombre}</span>
                                      </div>
                                  }
                                  {/* map de de colores prioridades */}

                                  <div className={this.state.mostrarIconos !== i ? "d-none" : "menuCirculo"}>

                                    {/* DIV DE CIRCULOS CON ICONO   */}
                                    {
                                      DataIconosCategoriaApi.map((Icono, IIcono) =>
                                        <div className="circleIcono" onClick={() => this.UpdatePrioridadIcono(metrados.id_partida, Icono.id_iconoCategoria, i)} key={IIcono}>
                                          <span className="spanUbi"> {Icono.nombre} </span>
                                        </div>
                                      )
                                    }
                                  </div>

                                  <div className={this.state.mostrarColores !== i ? "d-none" : "menuCirculo"}>

                                    {/* DIV DE CIRCULOS CON COLOR   */}
                                    {
                                      DataPrioridadesApi.map((priori, IPriori) =>
                                        <div className="circleColor" style={{ background: priori.color }} onClick={() => this.UpdatePrioridadColor(metrados.id_partida, priori.id_prioridad, i)} key={IPriori}></div>
                                      )
                                    }
                                  </div>


                                </td>
                                <td className={metrados.tipo === "titulo" ? '' : collapse === i ? "tdData1 " : "tdData"} onClick={metrados.tipo === "titulo" ? () => this.CollapseItem(-1, -1) : () => this.CollapseItem(i, metrados.id_partida)} data-event={i} >
                                  {metrados.item}
                                </td>
                                <td>
                                  {metrados.descripcion}

                                </td>
                                <td>{metrados.metrado} {metrados.unidad_medida} </td>
                                <td>{metrados.costo_unitario}</td>
                                <td>{metrados.parcial}</td>
                                <td className="small border border-left border-right-0 border-bottom-0 border-top-0" >

                                  <div className={(metrados.tipo === "titulo" ? 'd-none' : '')}>
                                    <div className="clearfix">
                                      <span className="float-left text-warning">A. met. {metrados.avance_metrado} {metrados.unidad_medida}</span>
                                      <span className="float-right text-warning">S/. {metrados.avance_costo}</span>
                                    </div>

                                    <div style={{
                                      height: '3px',
                                      width: '100%',
                                      background: '#c3bbbb',
                                    }}

                                    >
                                      <div
                                        style={{
                                          width: `${metrados.porcentaje}%`,
                                          height: '100%',
                                          background: metrados.porcentaje > 95 ? '#a4fb01'
                                            : metrados.porcentaje > 50 ? '#ffbf00'
                                              : '#ff2e00',
                                          transition: 'all .9s ease-in',
                                        }}
                                      />
                                    </div>
                                    <div className="clearfix">
                                      <span className="float-left text-info">Saldo: {metrados.metrados_saldo}</span>
                                      <span className="float-right text-info">S/. {metrados.metrados_costo_saldo}</span>
                                    </div>
                                  </div>

                                </td>

                              </tr>

                              <tr className={collapse === i ? "resplandPartidabottom" : "d-none"}>
                                <td colSpan="8">
                                  <Collapse isOpen={collapse === i}>
                                    <Nav tabs>
                                      {
                                        DataRecursosCdAPI.map((recursoCd, IndecCD) =>
                                          <NavItem key={IndecCD}>
                                            <NavLink className={classnames({ active: this.state.activeTabRecusoCd === IndecCD.toString() })} onClick={() => { this.TabRecurso(IndecCD.toString(), recursoCd.tipo, metrados.id_partida); }} >
                                              {recursoCd.tipo}
                                            </NavLink>
                                          </NavItem>
                                        )
                                      }

                                    </Nav>

                                    {/* tareas de algo */}
                                    <Row className="mt-1">
                                      <Col md="6">
                                        <Card>
                                          <CardHeader className="p-1">RECURSOS SEGÚN EXPEDIENTE TÉCNICO</CardHeader>
                                          <CardBody>
                                            <table className="table table-sm">
                                              <thead>
                                                <tr>
                                                  <th>RECURSO</th>
                                                  <th>UND</th>
                                                  <th>CANTIDAD</th>
                                                  <th>PRECIO S/.</th>
                                                  <th>PARCIAL S/.</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {
                                                  DataListaRecursoDetallado.map((listResurso, indexRe) =>
                                                    <tr key={indexRe}>
                                                      <td>{listResurso.descripcion} </td>
                                                      <td>{listResurso.unidad} </td>
                                                      <td> {listResurso.recurso_cantidad}</td>
                                                      <td> {listResurso.recurso_precio}</td>
                                                      <td> {listResurso.recurso_parcial}</td>
                                                    </tr>
                                                  )
                                                }

                                              </tbody>
                                            </table>
                                          </CardBody>
                                        </Card>

                                      </Col>
                                      <Col md="6">

                                        <Card>
                                          <CardHeader className="p-1">RECURSOS GASTADOS HASTA LA FECHA ( HOY 09/05/2019 )</CardHeader>
                                          <CardBody>
                                            <table className="table table-sm">
                                              <thead>
                                                <tr>
                                                  <th>CANTIDAD</th>
                                                  <th>PRECIO S/.</th>
                                                  <th>PARCIAL S/.</th>
                                                  <th>DIFERENCIA</th>
                                                  <th>%</th>
                                                </tr>
                                              </thead>
                                              <tbody>

                                                {
                                                  DataListaRecursoDetallado.map((listResurso, indexRe) =>
                                                    <tr key={indexRe}>
                                                      <td> {listResurso.recurso_gasto_cantidad}</td>
                                                      <td> {listResurso.recurso_precio}</td>
                                                      <td> {listResurso.recurso_gasto_parcial}</td>
                                                      <td> {listResurso.diferencia}</td>
                                                      <td> {listResurso.porcentaje}</td>
                                                    </tr>
                                                  )
                                                }

                                              </tbody>
                                            </table>
                                          </CardBody>
                                        </Card>
                                      </Col>
                                    </Row>
                                  </Collapse>
                                </td>
                              </tr>
                            </tbody>
                          )
                      }
                    </table>
                  </Collapse>
                </CardBody>

              </Card>
          }
        </Card>
      </div>
    );
  }
}

export default ListaMateriales;


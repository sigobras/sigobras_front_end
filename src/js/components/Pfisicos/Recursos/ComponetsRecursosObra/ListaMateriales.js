import React, { Component, Fragment } from "react";
import axios from "axios";
import { FaSuperpowers, FaPlus } from "react-icons/fa";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import {
  MdFirstPage,
  MdChevronLeft,
  MdChevronRight,
  MdLastPage,
  MdCompareArrows,
  MdClose,
  MdSearch,
  MdExtension,
  MdVisibility,
  MdMonetizationOn,
  MdWatch,
  MdLibraryBooks,
  MdSave,
  MdModeEdit,
} from "react-icons/md";
import { TiWarning } from "react-icons/ti";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  InputGroup,
  InputGroupText,
  InputGroup,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody,
  Button,
  Collapse,
  UncontrolledDropdown,
  Input,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import classnames from "classnames";

import { toast } from "react-toastify";

import { UrlServer, Id_Obra } from "../../../Utils/ServerUrlConfig";
import {
  ConvertFormatStringNumber,
  FechaActual,
  Redondea,
} from "../../../Utils/Funciones";
import TblResumenCompDrag from "./ResumenCostoDirecto/TblResumenCompDrag";
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
      DataTipoRecursoResumen: [],
      DataRecursosListaApi: [],
      DataResumenGeneralCompApi: [],
      DataTipoDocAdquisicionApi: [],

      activeTab: "RESUMEN",
      activeTabRecusoCd: "0",
      activeTabResumen: "",
      // modal: false,
      // modalMm: false,
      nombreComponente: "",

      // funciones de nueva libreria
      // dropdownOpen: false,
      collapse: 2599,
      id_componente: "",
      indexPartida: 0,
      OpcionMostrarMM: "",
      mostrarIconos: null,
      mostrarColores: null,
      // filtrador
      BuscaPartida: null,
      FilterSelected: "% Avance",

      // demos  iconos-----------------
      iconos: [
        <MdMonetizationOn />,
        <MdVisibility />,
        <MdWatch />,
        <TiWarning />,
        <MdLibraryBooks />,
        <FaSuperpowers />,
      ],

      dataFiltrada: [],

      modalImgPartida: false,

      CollapseResumenTabla: "resumenRecursos",
      TipoRecursoResumen: "",
      tipoEjecucion: false,
      CamviarTipoVistaDrag: false,
      DataGuardarInput: [],
      Editable: null,
      precioCantidad: "",
      AgregaNuevaOC: false,
      selectTipoDocumento: "",

      PaginaActual: 1,
      CantidadRows: 40,
      // para filtrar en componentes
      filterRecursoResumen: "",

      // captura inputs para agregar nuevo recurso---------------------------------------------------
      idTipoOrdenCompra: null,
      codigoOrdenCompra: "",
      nombRecurso: "",
      undMedida: "",
      cantidad: null,
      precio: null,

      // editar oficiales y nuevos
      idCodigoSelectRecursoNuevoOficial: "",
      nombreCodigoRecursoNuevoOficial: "",
      indexEdtarNuevaOC: null,
      descripcionRecursoNuevoOficial: "",
      unidadMedidaRecursoNuevoOficial: "",
      tipoRecurosoNuevo: "",
      cantidadRecursoNuevoOficial: "",
      precioRecursoNuevoOficial: "",

      // editar nuva oc
      editarNuevosOC: false,
    };

    this.Tabs = this.Tabs.bind(this);
    // this.EnviarMayorMetrado = this.EnviarMayorMetrado.bind(this)
    this.CollapseItem = this.CollapseItem.bind(this);

    this.Filtrador = this.Filtrador.bind(this);
    this.Prioridad = this.Prioridad.bind(this);
    this.UpdatePrioridadIcono = this.UpdatePrioridadIcono.bind(this);
    this.UpdatePrioridadColor = this.UpdatePrioridadColor.bind(this);

    this.CollapseResumenTabla = this.CollapseResumenTabla.bind(this);
    this.TabRecurso = this.TabRecurso.bind(this);
    this.tabResumenTipoRecurso = this.tabResumenTipoRecurso.bind(this);
    this.reqListaRecursos = this.reqListaRecursos.bind(this);
    this.Ver_No = this.Ver_No.bind(this);
    this.cambiarVistaDragDrop = this.cambiarVistaDragDrop.bind(this);
    this.activaEditable = this.activaEditable.bind(this);
    this.reqResumen = this.reqResumen.bind(this);
    this.reqChartResumenGeneral = this.reqChartResumenGeneral.bind(this);
    this.reqChartResumenComponente = this.reqChartResumenComponente.bind(this);
    this.reqResumenXComponente = this.reqResumenXComponente.bind(this);

    this.PaginaActual = this.PaginaActual.bind(this);
    this.SelectCantidadRows = this.SelectCantidadRows.bind(this);
  }

  componentDidMount() {
    document.title = "Metrados Diarios";
    axios
      .post(`${UrlServer}/getmaterialescomponentes`, {
        // id_ficha: Id_Obra
        id_ficha: sessionStorage.getItem("idobra"),
      })
      .then((res) => {
        // console.log(res.data);
        // console.time("tiempo");

        var partidas = res.data[0].partidas;
        // seteando la data que se me envia del api- agrega un icono
        for (let i = 0; i < partidas.length; i++) {
          // console.log("partida",  partidas[i].iconocategoria_nombre)
          if (partidas[i].iconocategoria_nombre === "<FaSuperpowers/>") {
            partidas[i].iconocategoria_nombre = <FaSuperpowers />;
          } else if (
            partidas[i].iconocategoria_nombre === "<MdLibraryBooks/>"
          ) {
            partidas[i].iconocategoria_nombre = <MdLibraryBooks />;
          } else if (partidas[i].iconocategoria_nombre === "<TiWarning/>") {
            partidas[i].iconocategoria_nombre = <TiWarning />;
          } else if (partidas[i].iconocategoria_nombre === "<MdWatch/>") {
            partidas[i].iconocategoria_nombre = <MdWatch />;
          } else if (partidas[i].iconocategoria_nombre === "<MdVisibility/>") {
            partidas[i].iconocategoria_nombre = <MdVisibility />;
          } else if (
            partidas[i].iconocategoria_nombre === "<MdMonetizationOn/>"
          ) {
            partidas[i].iconocategoria_nombre = <MdMonetizationOn />;
          } else {
            partidas[i].iconocategoria_nombre = null;
          }
        }

        // console.log(partidas)
        // console.timeEnd("tiempo");

        this.setState({
          DataComponentes: res.data,
          DataPartidas: res.data[0].partidas,
          nombreComponente: res.data[0].nombre,
        });
      })
      .catch(() => {
        toast.error(
          "No es posible conectar al sistema. Comprueba tu conexión a internet.",
          { position: "top-right", autoClose: 5000 }
        );
        // console.error('algo salio mal verifique el',error);
      });

    // solicita el resumen general por apis
    this.reqChartResumenGeneral(sessionStorage.getItem("idobra"));

    // axios consulta al api de  prioridades ====================================
    axios
      .get(`${UrlServer}/getPrioridades`)
      .then((res) => {
        // console.log("datos", res.data);
        this.setState({
          DataPrioridadesApi: res.data,
        });
      })
      .catch((err) => {
        console.log("errores al realizar la peticion de prioridades", err);
      });
    // axios consulta al api de  prioridades ====================================

    axios
      .get(`${UrlServer}/getIconoscategorias`)
      .then((res) => {
        // console.log("datos", res.data);

        var CategoriasIconos = res.data;

        CategoriasIconos.forEach((ico) => {
          if (ico.nombre === "<FaSuperpowers/>") {
            ico.nombre = <FaSuperpowers />;
          } else if (ico.nombre === "<MdLibraryBooks/>") {
            ico.nombre = <MdLibraryBooks />;
          } else if (ico.nombre === "<TiWarning/>") {
            ico.nombre = <TiWarning />;
          } else if (ico.nombre === "<MdWatch/>") {
            ico.nombre = <MdWatch />;
          } else if (ico.nombre === "<MdVisibility/>") {
            ico.nombre = <MdVisibility />;
          } else if (ico.nombre === "<MdMonetizationOn/>") {
            ico.nombre = <MdMonetizationOn />;
          } else {
            ico.nombre = null;
          }
        });

        // console.log("CategoriasIconos", CategoriasIconos);

        this.setState({
          DataIconosCategoriaApi: CategoriasIconos,
        });
      })
      .catch((err) => {
        console.log("errores al realizar la peticion de iconos", err);
      });

    // axios consulta al api de  RECURSOS =================================================================================
    axios
      .post(`${UrlServer}/getmaterialesResumenTipos`, {
        // "id_ficha": Id_Obra
        id_ficha: sessionStorage.getItem("idobra"),
      })
      .then((res) => {
        // console.log("datos", res.data);
        this.setState({
          DataTipoRecursoResumen: res.data,
        });
      })
      .catch((err) => {
        console.log("errores al realizar la peticion de prioridades", err);
      });

    // axios consulta al api de  TIPOS DOCUMENTOS DE ADQUISICIÓN =================================================================================

    axios
      .get(`${UrlServer}/gettipodocumentoadquisicion`)
      .then((res) => {
        // console.log("TIPOS DOCUMENTOS DE ADQUISICIÓN", res);
        this.setState({
          DataTipoDocAdquisicionApi: res.data,
        });
      })
      .catch((err) => {
        console.log(
          "errores al realizar la peticion de TIPOS DOCUMENTOS DE ADQUISICIÓN",
          err.response
        );
      });
  }

  Tabs(tab, id_componente, nombComp) {
    // console.log("tab ", tab)
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        nombreComponente: nombComp,
        DataPartidas: [],
        id_componente,
        collapse: -1,
        BuscaPartida: null,
        activeTabResumen: "",
        DataRecursosListaApi: [],
      });
    }
    // consulta al resumen
    if ("RESUMEN" === tab) {
      this.reqChartResumenGeneral(sessionStorage.getItem("idobra"));
      return;
    }
    this.reqChartResumenComponente(id_componente);
    // get partidas -----------------------------------------------------------------
    axios
      .post(`${UrlServer}/getmaterialespartidacomponente`, {
        id_componente: id_componente,
      })
      .then((res) => {
        // console.log('getPartidas>>', res.data);

        var partidas = res.data;
        // seteando la data que se me envia del api- agrega un icono
        for (let i = 0; i < partidas.length; i++) {
          // console.log("partida",  partidas[i].iconocategoria_nombre)
          if (partidas[i].iconocategoria_nombre === "<FaSuperpowers/>") {
            partidas[i].iconocategoria_nombre = <FaSuperpowers />;
          } else if (
            partidas[i].iconocategoria_nombre === "<MdLibraryBooks/>"
          ) {
            partidas[i].iconocategoria_nombre = <MdLibraryBooks />;
          } else if (partidas[i].iconocategoria_nombre === "<TiWarning/>") {
            partidas[i].iconocategoria_nombre = <TiWarning />;
          } else if (partidas[i].iconocategoria_nombre === "<MdWatch/>") {
            partidas[i].iconocategoria_nombre = <MdWatch />;
          } else if (partidas[i].iconocategoria_nombre === "<MdVisibility/>") {
            partidas[i].iconocategoria_nombre = <MdVisibility />;
          } else if (
            partidas[i].iconocategoria_nombre === "<MdMonetizationOn/>"
          ) {
            partidas[i].iconocategoria_nombre = <MdMonetizationOn />;
          } else {
            partidas[i].iconocategoria_nombre = null;
          }
        }
        // console.log("dsds", partidas);

        this.setState({
          DataPartidas: partidas,
        });
      })
      .catch(() => {
        toast.error(
          "No es posible conectar al sistema. Comprueba tu conexión a internet.",
          { position: "top-right", autoClose: 5000 }
        );
        // console.error('algo salio mal verifique el',error);
      });
  }
  // FUNCIONES DE ESTADOS DE OBRA  =====================================================

  CollapseItem(valor, id_partida) {
    if (valor !== -1 && id_partida !== -1) {
      let event = valor;
      this.setState({
        collapse: this.state.collapse === Number(event) ? -1 : Number(event),
        indexPartida: valor,
        DataRecursosCdAPI: [],
        DataListaRecursoDetallado: [],
      });

      // getActividades -----------------------------------------------------------------
      if (event !== this.state.collapse) {
        axios
          .post(`${UrlServer}/getmaterialespartidaTipos`, {
            id_partida: id_partida,
          })
          .then((res) => {
            // console.log('data tipos recursos >>', res.data);

            this.setState({
              DataRecursosCdAPI: res.data,
              // DataListaRecursoDetallado:res.data.mayor_metrado
            });
            // console.log("res data prueba ", res.data[0]["tipo"])
            this.reqListaRecursos(id_partida, res.data[0]["tipo"]);
          })
          .catch(() => {
            toast.error(
              "No es posible conectar al sistema. Comprueba tu conexión a internet.",
              { position: "top-right", autoClose: 5000 }
            );
            // console.error('algo salio mal verifique el',error);
          });
      }
    }
  }

  Filtrador(e) {
    // console.log("datos ", e)
    var valorRecibido = e;
    if (typeof valorRecibido === "number") {
      this.setState({
        BuscaPartida: valorRecibido,
        mostrarIconos: -1,
      });

      switch (valorRecibido) {
        case 101:
          this.setState({
            FilterSelected: "% Avance",
          });
          break;

        case 0:
          this.setState({
            FilterSelected: "0%",
          });
          break;

        case 100:
          this.setState({
            FilterSelected: "100%",
          });
          break;

        case 104:
          this.setState({
            FilterSelected: "MM",
          });
          break;
        default:
          this.setState({
            FilterSelected: "Progreso",
          });
          break;
      }
      // console.log("valorRecibido ",valorRecibido)
    } else {
      this.setState({
        BuscaPartida: e.target.value,
      });
      // console.log("valorRecibido ",e.target.value)
    }
  }

  Prioridad(i) {
    // console.log("cambia", i)
    this.setState({
      mostrarIconos: this.state.mostrarIconos === i ? -1 : i,
    });
  }

  UpdatePrioridadIcono(idPartida, id_icono, index) {
    // console.log("index", index);

    axios
      .put(`${UrlServer}/putIconocategoria`, {
        id_partida: idPartida,
        id_iconoCategoria: id_icono,
      })
      .then((res) => {
        // partidas[index].iconocategoria_nombre = res.data.color
        // console.info("response", res.data)
        var partidas = this.state.DataPartidas;
        var CategoriasIconos = res.data.nombre;

        // CategoriasIconos.forEach(ico => {
        if (CategoriasIconos === "<FaSuperpowers/>") {
          CategoriasIconos = <FaSuperpowers />;
        } else if (CategoriasIconos === "<MdLibraryBooks/>") {
          CategoriasIconos = <MdLibraryBooks />;
        } else if (CategoriasIconos === "<TiWarning/>") {
          CategoriasIconos = <TiWarning />;
        } else if (CategoriasIconos === "<MdWatch/>") {
          CategoriasIconos = <MdWatch />;
        } else if (CategoriasIconos === "<MdVisibility/>") {
          CategoriasIconos = <MdVisibility />;
        } else if (CategoriasIconos === "<MdMonetizationOn/>") {
          CategoriasIconos = <MdMonetizationOn />;
        } else {
          CategoriasIconos = null;
        }
        // });
        partidas[index].iconocategoria_nombre = CategoriasIconos;

        // console.log("CategoriasIconos", CategoriasIconos)
        this.setState({
          DataPartidas: partidas,
          mostrarIconos: -1,
          mostrarColores: index,
        });
      })
      .catch((err) => {
        console.error("error", err);
      });
  }

  UpdatePrioridadColor(idPartida, prioridad, index) {
    var partidas = this.state.DataPartidas;
    // console.log("partidas", idPartida, prioridad, index);

    axios
      .put(`${UrlServer}/putPrioridad`, {
        id_partida: idPartida,
        id_prioridad: prioridad,
      })
      .then((res) => {
        partidas[index].prioridad_color = res.data.color;
        // console.info("response", res)
        this.setState({
          DataPartidas: partidas,
          mostrarIconos: -1,
          mostrarColores: null,
        });
      })
      .catch((err) => {
        console.error("error", err);
      });
  }

  CollapseResumenTabla(index) {
    // console.log("index ", index)
    this.setState({
      CollapseResumenTabla:
        this.state.CollapseResumenTabla === index ? "" : index,
    });
  }

  TabRecurso(index, tipoRecurso, idPartida) {
    // console.log("index ", index, "tipoRecurso", tipoRecurso, "idPartida ", idPartida)

    if (this.state.activeTabRecusoCd !== index) {
      this.setState({
        activeTabRecusoCd: index,
      });
      this.reqListaRecursos(idPartida, tipoRecurso);
    }
  }

  tabResumenTipoRecurso(index, TipoRecurso) {
    console.log("index", index, " TipoRecurso ", TipoRecurso);
    if (this.state.activeTabResumen !== index) {
      this.setState({
        activeTabResumen: index,
        TipoRecursoResumen: TipoRecurso,
        tipoEjecucion: false,
        CamviarTipoVistaDrag: false,
      });
      this.reqResumen(
        sessionStorage.getItem("idobra"),
        TipoRecurso,
        "/getmaterialesResumen"
      );
    }
    console.log("Paso? 1", sessionStorage.getItem("idobra"), TipoRecurso);
  }

  Ver_No() {
    console.log("Paso? 2");
    this.setState(
      {
        tipoEjecucion: !this.state.tipoEjecucion,
        DataRecursosListaApi: [],
      },
      () => {
        if (this.state.tipoEjecucion === true) {
          // console.log("ejecuntando true")

          this.reqResumen(
            sessionStorage.getItem("idobra"),
            this.state.TipoRecursoResumen,
            "/getmaterialesResumenEjecucionReal"
          );
          return;
        }
        this.reqResumen(
          sessionStorage.getItem("idobra"),
          this.state.TipoRecursoResumen,
          "/getmaterialesResumen"
        );
      }
    );
  }

  cambiarVistaDragDrop() {
    this.setState(
      {
        CamviarTipoVistaDrag: !this.state.CamviarTipoVistaDrag,
        // DataRecursosListaApi: []
      }
      // , () => {
      //   if (this.state.CamviarTipoVistaDrag === true) {
      //     // console.log("ejecuntando true")
      //   this.reqResumen(Id_Obra, this.state.TipoRecursoResumen, "/getmaterialesResumen")

      //     this.reqResumen(Id_Obra, this.state.TipoRecursoResumen, "/getmaterialesResumenEjecucionRealSinCodigo")
      //     return
      //   }

      // }
    );
  }

  activaEditable(index, CantPrecio, selectTipoDocumento) {
    // console.log("activando", index, "CantPrecio ", CantPrecio , "selectTipoDocumento ", selectTipoDocumento)

    // console.log("DataTipoDocAdquisicionApi ", this.state.DataTipoDocAdquisicionApi)

    this.setState({
      Editable: index,
      precioCantidad: CantPrecio,
      selectTipoDocumento,
    });

    if (CantPrecio === null) {
      var Idselect = this.state.DataGuardarInput.data[0][4] || "";
      // console.log("id ",  Idselect )

      if (this.state.DataGuardarInput.data[0][3] !== "") {
        // console.log("this.state.DataGuardarInput ", Number(this.state.DataGuardarInput.data[0][4]))

        axios
          .post(
            `${UrlServer}/postrecursosEjecucionreal`,
            this.state.DataGuardarInput
          )
          .then((res) => {
            // console.log("response recurso real ✔", res.data)
            var DataRecursosListaApi = this.state.DataRecursosListaApi;

            var EncuentraTipoOrdenCompra =
              DataRecursosListaApi[index].tipodocumentoadquisicion_nombre;
            if (Idselect !== "") {
              // console.log("this.state.DataGuardarInput ", Number(this.state.DataGuardarInput.data[0][4]))

              var EncuentraTipoOrdenC =
                this.state.DataTipoDocAdquisicionApi.filter((data) => {
                  return data.id_tipoDocumentoAdquisicion === Number(Idselect);
                });
              EncuentraTipoOrdenCompra = EncuentraTipoOrdenC[0].nombre;
            }

            // console.log("EncuentraTipoOrdenC ", EncuentraTipoOrdenCompra)

            var parcialRG =
              res.data.recurso_gasto_cantidad * res.data.recurso_gasto_precio ||
              DataRecursosListaApi[index].recurso_gasto_precio;
            var diferenciaRG =
              DataRecursosListaApi[index].recurso_parcial - parcialRG;
            var porcentajeRG =
              (diferenciaRG / DataRecursosListaApi[index].recurso_parcial) *
              100;

            DataRecursosListaApi[index].descripcion =
              res.data.recurso_gasto_descripcion ||
              DataRecursosListaApi[index].descripcion;
            DataRecursosListaApi[index].unidad =
              res.data.recurso_gasto_unidad ||
              DataRecursosListaApi[index].unidad;

            DataRecursosListaApi[index].recurso_gasto_cantidad =
              res.data.recurso_gasto_cantidad ||
              DataRecursosListaApi[index].recurso_gasto_cantidad;
            DataRecursosListaApi[index].recurso_gasto_precio =
              res.data.recurso_gasto_precio ||
              DataRecursosListaApi[index].recurso_gasto_precio;

            DataRecursosListaApi[index].recurso_gasto_parcial =
              Redondea(parcialRG);
            DataRecursosListaApi[index].diferencia = Redondea(diferenciaRG);
            DataRecursosListaApi[index].porcentaje = Redondea(porcentajeRG);

            // reaq codigo de documento
            DataRecursosListaApi[index].recurso_codigo =
              res.data.recurso_codigo ||
              DataRecursosListaApi[index].recurso_codigo;
            DataRecursosListaApi[index].tipodocumentoadquisicion_nombre =
              EncuentraTipoOrdenCompra;

            // console.log("DataRecursosListaApi ", DataRecursosListaApi)

            this.setState({
              DataRecursosListaApi: DataRecursosListaApi,
            });
            toast.success("✔ Guardado");
          })
          .catch((err) => {
            console.error("algo salió mal al tratar de actualizar :>", err);

            toast.error("❌ingrese solo numeros");
          });
        return;
      }
      toast.error("Ingrese todos los campos");
    }
  }

  inputeable(index, tipo, descripcion, e) {
    // console.log("index ", index, "valor ", e.target.value, "tipo", tipo, "this.state.selectTipoDocumento ", this.state.selectTipoDocumento)

    if (tipo === "codigo") {
      var demoArray = {
        tipo: tipo,
        data: [
          [
            sessionStorage.getItem("idobra"),
            this.state.TipoRecursoResumen,
            descripcion,
            e.target.value,
            this.state.selectTipoDocumento,
          ],
        ],
      };
    } else {
      var demoArray = {
        tipo: tipo,
        data: [
          [
            sessionStorage.getItem("idobra"),
            this.state.TipoRecursoResumen,
            descripcion,
            e.target.value,
          ],
        ],
      };
    }

    this.setState({ DataGuardarInput: demoArray });

    // console.log("demoArray ", demoArray)
  }

  // ===================================== activa editable de nueva orden de compra

  GuardaNuevaOC(descripcion, index) {
    const {
      DataRecursosListaApi,
      DataTipoDocAdquisicionApi,
      idCodigoSelectRecursoNuevoOficial,
      nombreCodigoRecursoNuevoOficial,
      descripcionRecursoNuevoOficial,
      unidadMedidaRecursoNuevoOficial,
      cantidadRecursoNuevoOficial,
      precioRecursoNuevoOficial,
    } = this.state;
    // console.log(">>>>> data", DataRecursosListaApi)
    // console.log(">", descripcion, ">", descripcionRecursoNuevoOficial, "index ", index)
    // console.log("tipo ", tipo)

    var dataFiltro = DataRecursosListaApi.filter((DataRecurso) => {
      return DataRecurso.descripcion === descripcion;
    });

    var dataEncontrado = dataFiltro[0];

    // console.log("encontrado ", dataEncontrado);

    if (dataEncontrado) {
      var DataEnviar = {
        descripcion:
          descripcionRecursoNuevoOficial || dataEncontrado.descripcion,
        unidad: unidadMedidaRecursoNuevoOficial || dataEncontrado.unidad,
        cantidad:
          cantidadRecursoNuevoOficial || dataEncontrado.recurso_cantidad,
        precio: precioRecursoNuevoOficial || dataEncontrado.recurso_precio,
        id_recursoNuevo: dataEncontrado.id_recursoNuevo,

        id_tipoDocumentoAdquisicion:
          idCodigoSelectRecursoNuevoOficial ||
          dataEncontrado.id_tipoDocumentoAdquisicion,
        codigo:
          nombreCodigoRecursoNuevoOficial || dataEncontrado.recurso_codigo,
      };

      var dataFiltroTipoOrdenCompra = DataTipoDocAdquisicionApi.filter(
        (DataRecurso) => {
          return (
            DataRecurso.id_tipoDocumentoAdquisicion ===
            +DataEnviar.id_tipoDocumentoAdquisicion
          );
        }
      );
      // console.log("DataEnviar ", DataEnviar);
      // console.log("dataFiltroTipoOrdenCompra", dataFiltroTipoOrdenCompra)

      axios
        .put(`${UrlServer}/putRecursoNuevo`, DataEnviar)
        .then((res) => {
          // console.log("response nueva data ", res.data)
          if (res.data === "exito") {
            DataRecursosListaApi[index].tipodocumentoadquisicion_nombre =
              dataFiltroTipoOrdenCompra[0].nombre;
            DataRecursosListaApi[index].recurso_codigo = DataEnviar.codigo;
            DataRecursosListaApi[index].descripcion = DataEnviar.descripcion;
            DataRecursosListaApi[index].unidad = DataEnviar.unidad;
            DataRecursosListaApi[index].recurso_cantidad = DataEnviar.cantidad;
            DataRecursosListaApi[index].recurso_precio = DataEnviar.precio;
            DataRecursosListaApi[index].recurso_parcial =
              +DataEnviar.cantidad * +DataEnviar.precio;

            this.setState({
              editarNuevosOC: false,
              DataRecursosListaApi,
            });
            toast.success("descripcion actualizada con éxito");
          }
        })
        .catch((err) => {
          console.error("algo salió mal al hacer la petición al api > ", err);
        });
      return;
    }

    // console.log("enviar ", DataEnviar)
  }

  agregaRecursoNuevo(orden) {
    var DataListaRecursos = this.state.DataRecursosListaApi;

    if (orden === "cancelar") {
      DataListaRecursos.splice(0, 1);

      // console.log("DataListaRecursos ", DataListaRecursos)
      this.setState({
        AgregaNuevaOC: false,
        DataRecursosListaApi: DataListaRecursos,
      });
      return;
    }

    var NuevoArray = {
      bloqueado: 0,
      descripcion: "",
      diferencia: "",
      documentosAdquisicion_id_documentoAdquisicion: null,
      id_tipoDocumentoAdquisicion: "",
      porcentaje: null,
      recurso_cantidad: "",
      recurso_codigo: "",
      recurso_gasto_cantidad: "",
      recurso_gasto_parcial: "",
      recurso_gasto_precio: "",
      recurso_parcial: "",
      recurso_precio: "",
      tipo: "",
      tipodocumentoadquisicion_nombre: "",
      unidad: "",
      id_recursoNuevo: null,
    };

    DataListaRecursos.unshift(NuevoArray);

    // console.log("DataListaRecursos", DataListaRecursos)
    this.setState({
      DataRecursosListaApi: DataListaRecursos,
      AgregaNuevaOC: true,
    });
  }

  GuardaNuevoRecursoApi() {
    const {
      idTipoOrdenCompra,
      codigoOrdenCompra,
      nombRecurso,
      undMedida,
      cantidad,
      precio,
      TipoRecursoResumen,
      DataTipoDocAdquisicionApi,
      DataRecursosListaApi,
    } = this.state;
    var DataListaRecursos = DataRecursosListaApi[0];

    var idCompraTipo =
      idTipoOrdenCompra ||
      DataTipoDocAdquisicionApi[0].id_tipoDocumentoAdquisicion;

    // console.log("idTipoOrdenCompra ", idCompraTipo )
    // console.log("DataListaRecursos ", DataListaRecursos)
    // console.log("DataTipoDocAdquisicionApi ", DataTipoDocAdquisicionApi)
    var dataFiltroTipoOrdenCompra = DataTipoDocAdquisicionApi.filter(
      (DataRecurso) => {
        return DataRecurso.id_tipoDocumentoAdquisicion === +idCompraTipo;
      }
    );

    var dataEncontrado = dataFiltroTipoOrdenCompra[0];
    // console.log("data encontrado ", dataEncontrado )

    if (
      idTipoOrdenCompra === "" ||
      codigoOrdenCompra === "" ||
      nombRecurso === "" ||
      undMedida === "" ||
      cantidad === "" ||
      precio === "" ||
      TipoRecursoResumen === ""
    ) {
      toast.error("ingrese todos los campos");
      return;
    }

    axios
      .post(`${UrlServer}/postRecursosNuevos`, {
        tipo: TipoRecursoResumen,
        codigo: codigoOrdenCompra,
        descripcion: nombRecurso,
        unidad: undMedida,
        cantidad: cantidad,
        precio: precio,
        fichas_id_ficha: sessionStorage.getItem("idobra"),
        tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion: idCompraTipo,
      })
      .then((res) => {
        // console.log("guardando", res.data)
        if (res.data.id_recursoNuevo) {
          DataListaRecursos.bloqueado = 0;
          DataListaRecursos.descripcion = nombRecurso;
          DataListaRecursos.diferencia = "";
          DataListaRecursos.documentosAdquisicion_id_documentoAdquisicion =
            idCompraTipo;
          DataListaRecursos.id_tipoDocumentoAdquisicion = idCompraTipo;
          DataListaRecursos.porcentaje = "";
          DataListaRecursos.recurso_cantidad = "cantidad";
          DataListaRecursos.recurso_codigo = codigoOrdenCompra;
          DataListaRecursos.recurso_gasto_cantidad = "";
          DataListaRecursos.recurso_gasto_parcial = "";
          DataListaRecursos.recurso_gasto_precio = "";
          DataListaRecursos.recurso_parcial = cantidad * precio;
          DataListaRecursos.recurso_precio = precio;
          DataListaRecursos.tipo = "";
          DataListaRecursos.tipodocumentoadquisicion_nombre =
            dataEncontrado.nombre;
          DataListaRecursos.unidad = undMedida;
          DataListaRecursos.recurso_estado_origen = "nuevo";
          DataListaRecursos.id_recursoNuevo = res.data.id_recursoNuevo;
          // console.log("DataRecursosListaApi ", DataListaRecursos)

          this.setState({
            AgregaNuevaOC: false,
            // DataRecursosListaApi: DataListaRecursos
          });
          toast.success("Guardado en el sistema");
        }
      })
      .catch((err) => {
        console.error("errores al guardar el nuevo recurso", err);
      })
      .finally(() => {
        // console.log("guardando ..... por favor espere")
      });
  }

  onChangeInputsRecursoNuevo(e) {
    // console.log(" EJECUTANDO ", e.target.name, ">", e.target.value)
    this.setState({ [e.target.name]: e.target.value });
  }
  // requests al api======================================================================

  reqListaRecursos(idPartida, tipo) {
    // console.log("reqListaRecursos ", "idPartida", idPartida, "tipo ", tipo)
    axios
      .post(`${UrlServer}/getmaterialespartidaTiposLista`, {
        id_partida: idPartida,
        tipo: tipo,
      })
      .then((res) => {
        // console.log("response partidas lista de recursos ", res)
        this.setState({
          DataListaRecursoDetallado: res.data,
        });
      })
      .catch((err) => {
        console.error("falló el api", err);
      });
  }

  reqResumen(idFicha, tipoRecurso, ruta) {
    // console.log("tipo recurso ", tipoRecurso, "tipoEjecucion ", this.state.tipoEjecucion, "ruta ", ruta)

    axios
      .post(`${UrlServer}${ruta}`, {
        id_ficha: idFicha,
        tipo: tipoRecurso,
      })
      .then((res) => {
        // console.log("resumen de componentes 😍", res.data)
        this.setState({
          DataRecursosListaApi: res.data,
        });
      })
      .catch((err) => {
        console.error("error al consultar al api ", err);
      });
  }

  // chartresumen de componentes

  reqChartResumenGeneral(IdObra) {
    axios
      .post(`${UrlServer}/getmaterialesResumenChart`, {
        id_ficha: sessionStorage.getItem("idobra"),
      })
      .then((res) => {
        // console.log("res data reqChartResumenGeneral", res)
        this.setState({ DataResumenGeneralCompApi: res.data });
      })
      .catch((err) => {
        console.error("datos incorrectos ", err.response);
        if (err.response.data === "vacio") {
          this.setState({ DataResumenGeneralCompApi: [] });
        }
      });
  }

  reqChartResumenComponente(idComponente) {
    axios
      .post(`${UrlServer}/getmaterialescomponentesChart`, {
        id_componente: idComponente,
      })
      .then((res) => {
        // console.log("res data chart ", res.data)
        this.setState({ DataResumenGeneralCompApi: res.data });
      })
      .catch((err) => {
        console.error("algo salió mal ", err.response);
        if (err.response.data === "vacio") {
          this.setState({ DataResumenGeneralCompApi: [] });
        }
      });
  }

  reqResumenXComponente(index, idComponente, tipoRecurso) {
    console.log("tipo recurso ", tipoRecurso);
    console.log("idComponente", idComponente);
    if (this.state.activeTabResumen !== index) {
      this.setState({
        activeTabResumen: index,
      });
    }
    axios
      .post(`${UrlServer}/getmaterialescomponentesResumen`, {
        id_componente: idComponente,
        tipo: tipoRecurso,
      })
      .then((res) => {
        console.log("resumen de componentes dddd>>> ", res.data);
        res.data != "vacio"
          ? this.setState({
              DataRecursosListaApi: res.data,
            })
          : toast.error("No hay datos para mostrar", {
              position: "top-right",
              autoClose: 5000,
            });
      })
      .catch((err) => {
        console.error("error al consultar al api ", err);
      });
  }

  // ====================================================== PARA PGINACION ===================

  PaginaActual(event) {
    // console.log("PaginaActual ", Number(event))
    this.setState({
      PaginaActual: Number(event),
    });
  }

  SelectCantidadRows(e) {
    console.log("SelectCantidadRows ", e.target.value);
    this.setState({ CantidadRows: Number(e.target.value) });
  }

  handleChangeFilterDataResumen(event) {
    this.setState({ filterRecursoResumen: event.target.value });
  }

  render() {
    const {
      DataPrioridadesApi,
      DataIconosCategoriaApi,
      DataComponentes,
      DataPartidas,
      DataRecursosCdAPI,
      DataListaRecursoDetallado,
      DataTipoRecursoResumen,
      DataRecursosListaApi,
      DataResumenGeneralCompApi,
      DataTipoDocAdquisicionApi,
      collapse,
      nombreComponente,
      Editable,
      precioCantidad,
      CollapseResumenTabla,
      PaginaActual,
      CantidadRows,
      filterRecursoResumen,
      AgregaNuevaOC,
      editarNuevosOC,
      indexEdtarNuevaOC,
      tipoRecurosoNuevo,
    } = this.state;

    const ChartResumenRecursos = {
      colors: [
        "#d35400",
        "#2980b9",
        "#2ecc71",
        "#f1c40f",
        "#2c3e50",
        "#7f8c8d",
      ],
      chart: {
        backgroundColor: "#161C20",
        style: {
          fontFamily: "Roboto",
          color: "#666666",
        },
      },
      title: {
        text: "Expediente vs  Ejecutado",
        align: "center",
        style: {
          fontFamily: "Roboto Condensed",
          fontWeight: "bold",
          color: "#666666",
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        itemStyle: {
          color: "#424242",
          color: "#ffffff",
        },
      },
      xAxis: {
        categories: DataResumenGeneralCompApi.categories,
      },

      yAxis: {
        title: {
          text: "Soles",
        },
        labels: {
          formatter: function () {
            return this.value / 1;
          },
        },
        gridLineColor: "#424242",
        ridLineWidth: 1,
        minorGridLineColor: "#424242",
        inoGridLineWidth: 0.5,
        tickColor: "#424242",
        minorTickColor: "#424242",
        lineColor: "#424242",
      },
      labels: {
        items: [
          {
            html: "TOTAL COSTO DIRECTO",
            style: {
              left: "50px",
              top: "18px",
              color:
                (Highcharts.theme && Highcharts.theme.textColor) || "white",
            },
          },
        ],
      },
      series: DataResumenGeneralCompApi.series,
    };

    var DatosPartidasFiltrado = DataPartidas;
    var BuscaPartida = this.state.BuscaPartida;

    // console.log("BuscaPartida", BuscaPartida);

    if (BuscaPartida !== null) {
      if (typeof BuscaPartida === "number") {
        DatosPartidasFiltrado = DatosPartidasFiltrado.filter((filtrado) => {
          if (BuscaPartida === 101) {
            return filtrado.porcentaje <= 100;
          } else if (
            BuscaPartida === 99 &&
            filtrado.tipo !== "titulo" &&
            filtrado.porcentaje !== 0
          ) {
            return filtrado.porcentaje <= 99;
          } else if (BuscaPartida === 104 && filtrado.tipo !== "titulo") {
            return filtrado.mayorMetrado === 1;

            // filtramos las prioridades color
          } else if (BuscaPartida === 1) {
            return filtrado.prioridad_color === "#f00";
          } else if (BuscaPartida === 2) {
            return filtrado.prioridad_color === "#ffff00";
          } else if (BuscaPartida === 3) {
            return filtrado.prioridad_color === "#00b050";
          } else if (BuscaPartida === 4) {
            return filtrado.prioridad_color === "#0080ff";
          } else if (BuscaPartida === 5 && filtrado.tipo !== "titulo") {
            return filtrado.prioridad_color === "#ffffff";
          } else {
            return filtrado.porcentaje === BuscaPartida;
          }
        });
      } else {
        BuscaPartida = this.state.BuscaPartida.trim().toLowerCase();
        DatosPartidasFiltrado = DatosPartidasFiltrado.filter((filtrado) => {
          return filtrado.descripcion.toLowerCase().match(BuscaPartida);
        });
      }
    }

    // =========================================   data para BUSCAR TIPO DE RECURSO EN RESUMEN  ====================================

    const DataFiltradaResumenRecurso = filterRecursoResumen.toLowerCase();
    const filteredData = DataRecursosListaApi.filter((recurso) => {
      return Object.keys(recurso).some(
        (key) =>
          // recurso[key].toLowerCase().includes(DataFiltradaResumenRecurso)
          typeof recurso[key] === "string" &&
          recurso[key].toLowerCase().includes(DataFiltradaResumenRecurso)
      );
    });

    // =========================================   data para paginar DATOS DE RECURSOS EN RESUMEN  ====================================
    // obtener indices para paginar
    const indexOfUltimo = PaginaActual * CantidadRows;
    // console.log("INDEX OF ULTIMO ", indexOfUltimo)

    const indexOfPrimero = indexOfUltimo - CantidadRows;
    // console.log("INDEX OF PRIMERO ", indexOfPrimero)

    const DataRecursosListaApiPaginado = filteredData.slice(
      indexOfPrimero,
      indexOfUltimo
    );

    // numero de paginas hasta ahora
    const NumeroPaginas = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / CantidadRows); i++) {
      NumeroPaginas.push(i);
    }

    return (
      <div>
        <Card>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "RESUMEN",
                })}
                onClick={() => this.Tabs("RESUMEN", "RESUMEN", "RESUMEN")}
              >
                RESUMEN
              </NavLink>
            </NavItem>
            {DataComponentes.length === 0 ? (
              <Spinner color="primary" size="sm" />
            ) : (
              DataComponentes.map((comp, indexComp) => (
                <NavItem key={indexComp}>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === indexComp.toString(),
                    })}
                    onClick={() =>
                      this.Tabs(
                        indexComp.toString(),
                        comp.id_componente,
                        comp.nombre
                      )
                    }
                  >
                    C-{comp.numero}
                  </NavLink>
                </NavItem>
              ))
            )}
          </Nav>

          {/* RESUMEN - MAS DETALLES DE BINES DE LA OBRA */}
          {this.state.activeTab === "RESUMEN" ? (
            <Card className="m-1">
              <CardHeader> {nombreComponente} </CardHeader>
              <CardBody>
                <div className="mb-1 mt-1">
                  <HighchartsReact
                    highcharts={Highcharts}
                    // constructorType={'stockChart'}
                    options={ChartResumenRecursos}
                  />
                </div>
                <Nav tabs>
                  {DataTipoRecursoResumen.map((Resumen, index) => (
                    <NavItem key={index}>
                      <NavLink
                        className={classnames({
                          active:
                            this.state.activeTabResumen === index.toString(),
                        })}
                        onClick={() => {
                          this.tabResumenTipoRecurso(
                            index.toString(),
                            Resumen.tipo
                          );
                        }}
                      >
                        {Resumen.tipo}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
                {DataRecursosListaApi.length > 0 ? (
                  <Card>
                    <CardBody>
                      <div className="clearfix mb-2">
                        <div className="float-left">
                          <select
                            onChange={this.SelectCantidadRows}
                            value={CantidadRows}
                            className="form-control form-control-sm"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={40}>40</option>
                          </select>
                        </div>
                        <div className="float-right">
                          <InputGroup size="sm">
                            <InputGroup>
                              {this.state.tipoEjecucion === true ? (
                                <Fragment>
                                  {AgregaNuevaOC === false ? (
                                    <Button
                                      outline
                                      color="info"
                                      onClick={this.agregaRecursoNuevo.bind(
                                        this,
                                        "agregar"
                                      )}
                                    >
                                      <FaPlus />{" "}
                                    </Button>
                                  ) : (
                                    <Button
                                      outline
                                      color="success"
                                      onClick={this.GuardaNuevoRecursoApi.bind(
                                        this
                                      )}
                                    >
                                      {" "}
                                      <MdSave />
                                    </Button>
                                  )}
                                </Fragment>
                              ) : (
                                ""
                              )}

                              <Button
                                outline
                                color="primary"
                                active={this.state.tipoEjecucion === true}
                                disabled={
                                  this.state.CamviarTipoVistaDrag === true
                                }
                                onClick={this.Ver_No}
                                title="asignar codigos y editar "
                              >
                                <MdCompareArrows /> <MdModeEdit />
                              </Button>
                              <Button
                                outline
                                color="info"
                                active={
                                  this.state.CamviarTipoVistaDrag === true
                                }
                                onClick={this.cambiarVistaDragDrop}
                                title="organizar"
                              >
                                <MdExtension />
                              </Button>
                            </InputGroup>
                            <Input
                              value={filterRecursoResumen}
                              onChange={this.handleChangeFilterDataResumen.bind(
                                this
                              )}
                            />
                          </InputGroup>
                        </div>
                      </div>
                      {this.state.CamviarTipoVistaDrag === true ? (
                        <TblResumenCompDrag
                          ConfigData={{
                            UrlServer: UrlServer,
                            IdObra: sessionStorage.getItem("idobra"),
                            tipoRecurso: this.state.TipoRecursoResumen,
                          }}
                        />
                      ) : (
                        <div>
                          <table className="table table-sm table-hover">
                            <thead>
                              <tr>
                                <th colSpan="6" className="bordeDerecho">
                                  RESUMEN DE RECURSOS SEGÚN EXPEDIENTE TÉCNICO
                                </th>
                                <th
                                  colSpan="5"
                                  style={{ width: "36%", minWidth: "40%" }}
                                >
                                  {" "}
                                  RECURSOS GASTADOS HASTA LA FECHA ( HOY{" "}
                                  {FechaActual()})
                                </th>
                              </tr>
                              <tr>
                                <th>N° O/C - O/S</th>
                                <th>RECURSO</th>
                                <th>UND</th>
                                <th>CANTIDAD</th>
                                <th>PRECIO S/.</th>
                                <th className="bordeDerecho"> PARCIAL S/.</th>

                                <th>CANTIDAD</th>
                                <th>PRECIO S/.</th>
                                <th>PARCIAL S/.</th>
                                <th>DIFERENCIA</th>
                                <th>%</th>
                              </tr>
                            </thead>
                            <tbody>
                              {DataRecursosListaApiPaginado.map(
                                (ReqLista, IndexRL) =>
                                  ReqLista.descripcion.length > 0 ? (
                                    <tr
                                      key={IndexRL}
                                      className={
                                        ReqLista.recurso_estado_origen ===
                                        "nuevo"
                                          ? "NuevaOrdenCompra"
                                          : ""
                                      }
                                    >
                                      <td
                                        className={
                                          this.state.tipoEjecucion === true
                                            ? "colorInputeableRecurso"
                                            : ""
                                        }
                                      >
                                        {ReqLista.recurso_estado_origen ===
                                          "nuevo" ||
                                        ReqLista.recurso_estado_origen ===
                                          undefined ? (
                                          this.state.tipoEjecucion === false ? (
                                            `${ReqLista.tipodocumentoadquisicion_nombre} - ${ReqLista.recurso_codigo}`
                                          ) : (
                                            <div className="d-flex justify-content-between contentDataTd">
                                              {editarNuevosOC === true &&
                                              indexEdtarNuevaOC === IndexRL &&
                                              tipoRecurosoNuevo === "codigo" ? (
                                                <span>
                                                  <select
                                                    style={{ padding: "1.5px" }}
                                                    name="idCodigoSelectRecursoNuevoOficial"
                                                    onChange={this.onChangeInputsRecursoNuevo.bind(
                                                      this
                                                    )}
                                                    defaultValue={
                                                      ReqLista.id_tipoDocumentoAdquisicion
                                                    }
                                                  >
                                                    {DataTipoDocAdquisicionApi.map(
                                                      (Docu, indexD) => (
                                                        <option
                                                          value={
                                                            Docu.id_tipoDocumentoAdquisicion
                                                          }
                                                          key={indexD}
                                                        >
                                                          {Docu.nombre}
                                                        </option>
                                                      )
                                                    )}
                                                  </select>
                                                  <input
                                                    type="text"
                                                    name="nombreCodigoRecursoNuevoOficial"
                                                    defaultValue={
                                                      ReqLista.recurso_codigo
                                                    }
                                                    autoFocus
                                                    onChange={this.onChangeInputsRecursoNuevo.bind(
                                                      this
                                                    )}
                                                    style={{ width: "70px" }}
                                                  />
                                                </span>
                                              ) : (
                                                <span>{`${
                                                  ReqLista.tipodocumentoadquisicion_nombre ===
                                                  ""
                                                    ? "-"
                                                    : ReqLista.tipodocumentoadquisicion_nombre
                                                } ${
                                                  ReqLista.recurso_codigo
                                                }`}</span>
                                              )}

                                              <div className="ContIcon">
                                                {editarNuevosOC === true &&
                                                indexEdtarNuevaOC === IndexRL &&
                                                tipoRecurosoNuevo ===
                                                  "codigo" ? (
                                                  <div className="d-flex">
                                                    <div
                                                      onClick={this.GuardaNuevaOC.bind(
                                                        this,
                                                        ReqLista.descripcion,
                                                        IndexRL
                                                      )}
                                                    >
                                                      <MdSave />
                                                    </div>
                                                    <div
                                                      onClick={() =>
                                                        this.setState({
                                                          editarNuevosOC: false,
                                                          indexEdtarNuevaOC:
                                                            null,
                                                          tipoRecurosoNuevo: "",
                                                        })
                                                      }
                                                    >
                                                      <MdClose />
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div
                                                    onClick={() =>
                                                      this.setState({
                                                        editarNuevosOC: true,
                                                        indexEdtarNuevaOC:
                                                          IndexRL,
                                                        tipoRecurosoNuevo:
                                                          "codigo",
                                                      })
                                                    }
                                                  >
                                                    <MdModeEdit />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        ) : (
                                          <div className="d-flex justify-content-between contentDataTd">
                                            {Editable === IndexRL &&
                                            precioCantidad === "codigo" ? (
                                              <span>
                                                <select
                                                  style={{ padding: "1.5px" }}
                                                  name="selectTipoDocumento"
                                                  onChange={(e) =>
                                                    this.setState({
                                                      selectTipoDocumento:
                                                        e.target.value,
                                                    })
                                                  }
                                                  value={
                                                    this.state
                                                      .selectTipoDocumento
                                                  }
                                                >
                                                  {DataTipoDocAdquisicionApi.map(
                                                    (Docu, indexD) => (
                                                      <option
                                                        value={
                                                          Docu.id_tipoDocumentoAdquisicion
                                                        }
                                                        key={indexD}
                                                      >
                                                        {Docu.nombre}
                                                      </option>
                                                    )
                                                  )}
                                                </select>
                                                <input
                                                  type="text"
                                                  defaultValue={
                                                    ReqLista.recurso_codigo
                                                  }
                                                  autoFocus
                                                  onBlur={this.inputeable.bind(
                                                    this,
                                                    { IndexRL },
                                                    "codigo",
                                                    ReqLista.descripcion
                                                  )}
                                                  style={{ width: "70px" }}
                                                />
                                              </span>
                                            ) : (
                                              <span>{`${
                                                ReqLista.tipodocumentoadquisicion_nombre ===
                                                ""
                                                  ? "-"
                                                  : ReqLista.tipodocumentoadquisicion_nombre
                                              } ${
                                                ReqLista.recurso_codigo
                                              }`}</span>
                                            )}

                                            <div className="ContIcon">
                                              {Editable === IndexRL &&
                                              precioCantidad === "codigo" ? (
                                                <div className="d-flex">
                                                  <div
                                                    onClick={() =>
                                                      this.activaEditable(
                                                        IndexRL,
                                                        null,
                                                        ReqLista.id_tipoDocumentoAdquisicion ||
                                                          DataTipoDocAdquisicionApi[0]
                                                            .id_tipoDocumentoAdquisicion
                                                      )
                                                    }
                                                  >
                                                    <MdSave />{" "}
                                                  </div>{" "}
                                                  <div
                                                    onClick={() =>
                                                      this.setState({
                                                        Editable: null,
                                                        precioCantidad: "",
                                                        selectTipoDocumento: "",
                                                      })
                                                    }
                                                  >
                                                    {" "}
                                                    <MdClose />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    this.activaEditable(
                                                      IndexRL,
                                                      "codigo",
                                                      ReqLista.id_tipoDocumentoAdquisicion ||
                                                        DataTipoDocAdquisicionApi[0]
                                                          .id_tipoDocumentoAdquisicion
                                                    )
                                                  }
                                                >
                                                  <MdModeEdit />{" "}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        {ReqLista.recurso_estado_origen ===
                                          "oficial" ||
                                        ReqLista.recurso_estado_origen ===
                                          undefined ||
                                        ReqLista.id_recursoNuevo.length < 0 ? (
                                          this.state.tipoEjecucion === false ? (
                                            `${ReqLista.descripcion}`
                                          ) : (
                                            <div className="d-flex justify-content-between contentDataTd">
                                              {Editable === IndexRL &&
                                              precioCantidad ===
                                                "descripcion" ? (
                                                <textarea
                                                  name="nombRecurso"
                                                  rows="1"
                                                  cols="50"
                                                  defaultValue={
                                                    ReqLista.descripcion
                                                  }
                                                  autoFocus
                                                  onBlur={this.inputeable.bind(
                                                    this,
                                                    { IndexRL },
                                                    "descripcion",
                                                    ReqLista.descripcion
                                                  )}
                                                ></textarea>
                                              ) : (
                                                <span>
                                                  {ReqLista.descripcion}
                                                </span>
                                              )}
                                              <div className="ContIcon">
                                                {Editable === IndexRL &&
                                                precioCantidad ===
                                                  "descripcion" ? (
                                                  <div className="d-flex">
                                                    <div
                                                      onClick={() =>
                                                        this.activaEditable(
                                                          IndexRL,
                                                          null,
                                                          ""
                                                        )
                                                      }
                                                    >
                                                      <MdSave />{" "}
                                                    </div>{" "}
                                                    <div
                                                      onClick={() =>
                                                        this.setState({
                                                          Editable: null,
                                                          precioCantidad: "",
                                                          selectTipoDocumento:
                                                            "",
                                                        })
                                                      }
                                                    >
                                                      {" "}
                                                      <MdClose />
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div
                                                    onClick={() =>
                                                      this.activaEditable(
                                                        IndexRL,
                                                        "descripcion",
                                                        ""
                                                      )
                                                    }
                                                  >
                                                    <MdModeEdit />{" "}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        ) : (
                                          <div className="d-flex justify-content-between contentDataTd">
                                            {editarNuevosOC === true &&
                                            indexEdtarNuevaOC === IndexRL &&
                                            tipoRecurosoNuevo === "descrip" ? (
                                              <textarea
                                                name="nombRecurso"
                                                rows="1"
                                                cols="50"
                                                defaultValue={
                                                  ReqLista.descripcion
                                                }
                                                name="descripcionRecursoNuevoOficial"
                                                onChange={this.onChangeInputsRecursoNuevo.bind(
                                                  this
                                                )}
                                              ></textarea>
                                            ) : (
                                              <span>
                                                {ReqLista.descripcion}
                                              </span>
                                            )}
                                            <div className="ContIcon">
                                              {editarNuevosOC === true &&
                                              indexEdtarNuevaOC === IndexRL &&
                                              tipoRecurosoNuevo ===
                                                "descrip" ? (
                                                <div className="d-flex">
                                                  <div
                                                    onClick={this.GuardaNuevaOC.bind(
                                                      this,
                                                      ReqLista.descripcion,
                                                      IndexRL
                                                    )}
                                                  >
                                                    <MdSave />
                                                  </div>
                                                  <div
                                                    onClick={() =>
                                                      this.setState({
                                                        editarNuevosOC: false,
                                                        indexEdtarNuevaOC: null,
                                                        tipoRecurosoNuevo: "",
                                                      })
                                                    }
                                                  >
                                                    <MdClose />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    this.setState({
                                                      editarNuevosOC: true,
                                                      indexEdtarNuevaOC:
                                                        IndexRL,
                                                      tipoRecurosoNuevo:
                                                        "descrip",
                                                    })
                                                  }
                                                >
                                                  <MdModeEdit />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        {ReqLista.recurso_estado_origen ===
                                          "oficial" ||
                                        ReqLista.recurso_estado_origen ===
                                          undefined ||
                                        ReqLista.id_recursoNuevo.length < 0 ? (
                                          this.state.tipoEjecucion === false ? (
                                            `${ReqLista.unidad}`
                                          ) : (
                                            <div className="d-flex justify-content-between contentDataTd">
                                              {/* unidad de medida >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                                              {Editable === IndexRL &&
                                              precioCantidad === "unidad" ? (
                                                <input
                                                  style={{ width: "41px" }}
                                                  defaultValue={ReqLista.unidad}
                                                  autoFocus
                                                  onBlur={this.inputeable.bind(
                                                    this,
                                                    { IndexRL },
                                                    "unidad",
                                                    ReqLista.unidad
                                                  )}
                                                />
                                              ) : (
                                                <span>{ReqLista.unidad}</span>
                                              )}
                                              <div className="ContIcon">
                                                {Editable === IndexRL &&
                                                precioCantidad === "unidad" ? (
                                                  <div className="d-flex">
                                                    <div
                                                      onClick={() =>
                                                        this.activaEditable(
                                                          IndexRL,
                                                          null,
                                                          ""
                                                        )
                                                      }
                                                    >
                                                      <MdSave />{" "}
                                                    </div>{" "}
                                                    <div
                                                      onClick={() =>
                                                        this.setState({
                                                          Editable: null,
                                                          precioCantidad: "",
                                                          selectTipoDocumento:
                                                            "",
                                                        })
                                                      }
                                                    >
                                                      {" "}
                                                      <MdClose />
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div
                                                    onClick={() =>
                                                      this.activaEditable(
                                                        IndexRL,
                                                        "unidad",
                                                        ""
                                                      )
                                                    }
                                                  >
                                                    <MdModeEdit />{" "}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        ) : (
                                          <div className="d-flex justify-content-between contentDataTd">
                                            {editarNuevosOC === true &&
                                            indexEdtarNuevaOC === IndexRL &&
                                            tipoRecurosoNuevo === "und" ? (
                                              <input
                                                type="text"
                                                name="unidadMedidaRecursoNuevoOficial"
                                                style={{ width: "41px" }}
                                                defaultValue={ReqLista.unidad}
                                                onChange={this.onChangeInputsRecursoNuevo.bind(
                                                  this
                                                )}
                                              />
                                            ) : (
                                              <span>{ReqLista.unidad}</span>
                                            )}

                                            <div className="ContIcon">
                                              {editarNuevosOC === true &&
                                              indexEdtarNuevaOC === IndexRL &&
                                              tipoRecurosoNuevo === "und" ? (
                                                <div className="d-flex">
                                                  <div
                                                    onClick={this.GuardaNuevaOC.bind(
                                                      this,
                                                      ReqLista.descripcion,
                                                      IndexRL
                                                    )}
                                                  >
                                                    <MdSave />
                                                  </div>
                                                  <div
                                                    onClick={() =>
                                                      this.setState({
                                                        editarNuevosOC: false,
                                                        indexEdtarNuevaOC: null,
                                                        tipoRecurosoNuevo: "",
                                                      })
                                                    }
                                                  >
                                                    <MdClose />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    this.setState({
                                                      editarNuevosOC: true,
                                                      indexEdtarNuevaOC:
                                                        IndexRL,
                                                      tipoRecurosoNuevo: "und",
                                                    })
                                                  }
                                                >
                                                  <MdModeEdit />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        {/* {ReqLista.recurso_cantidad} */}
                                        {ReqLista.recurso_estado_origen ===
                                          "oficial" ||
                                        ReqLista.recurso_estado_origen ===
                                          undefined ? (
                                          `${ReqLista.recurso_cantidad}`
                                        ) : (
                                          <div className="d-flex justify-content-between contentDataTd">
                                            {/* nuevosssssssssssss---------------------------------------------------------------- */}
                                            {editarNuevosOC === true &&
                                            indexEdtarNuevaOC === IndexRL &&
                                            tipoRecurosoNuevo === "cantidad" ? (
                                              <input
                                                type="text"
                                                name="cantidadRecursoNuevoOficial"
                                                style={{ width: "41px" }}
                                                defaultValue={
                                                  ReqLista.recurso_cantidad
                                                }
                                                onChange={this.onChangeInputsRecursoNuevo.bind(
                                                  this
                                                )}
                                              />
                                            ) : (
                                              <span>
                                                {ReqLista.recurso_cantidad}
                                              </span>
                                            )}

                                            <div className="ContIcon">
                                              {editarNuevosOC === true &&
                                              indexEdtarNuevaOC === IndexRL &&
                                              tipoRecurosoNuevo ===
                                                "cantidad" ? (
                                                <div className="d-flex">
                                                  <div
                                                    onClick={this.GuardaNuevaOC.bind(
                                                      this,
                                                      ReqLista.descripcion,
                                                      IndexRL
                                                    )}
                                                  >
                                                    <MdSave />
                                                  </div>
                                                  <div
                                                    onClick={() =>
                                                      this.setState({
                                                        editarNuevosOC: false,
                                                        indexEdtarNuevaOC: null,
                                                        tipoRecurosoNuevo: "",
                                                      })
                                                    }
                                                  >
                                                    <MdClose />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    this.setState({
                                                      editarNuevosOC: true,
                                                      indexEdtarNuevaOC:
                                                        IndexRL,
                                                      tipoRecurosoNuevo:
                                                        "cantidad",
                                                    })
                                                  }
                                                >
                                                  <MdModeEdit />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        {/* {ReqLista.recurso_precio} */}
                                        {ReqLista.recurso_estado_origen ===
                                          "oficial" ||
                                        ReqLista.recurso_estado_origen ===
                                          undefined ||
                                        ReqLista.id_recursoNuevo.length < 0 ? (
                                          `${ReqLista.recurso_precio}`
                                        ) : (
                                          <div className="d-flex justify-content-between contentDataTd">
                                            {editarNuevosOC === true &&
                                            indexEdtarNuevaOC === IndexRL &&
                                            tipoRecurosoNuevo === "precio" ? (
                                              <input
                                                type="text"
                                                name="precioRecursoNuevoOficial"
                                                style={{ width: "41px" }}
                                                defaultValue={
                                                  ReqLista.recurso_precio
                                                }
                                                onChange={this.onChangeInputsRecursoNuevo.bind(
                                                  this
                                                )}
                                              />
                                            ) : (
                                              <span>
                                                {ReqLista.recurso_precio}
                                              </span>
                                            )}

                                            <div className="ContIcon">
                                              {editarNuevosOC === true &&
                                              indexEdtarNuevaOC === IndexRL &&
                                              tipoRecurosoNuevo === "precio" ? (
                                                <div className="d-flex">
                                                  <div
                                                    onClick={this.GuardaNuevaOC.bind(
                                                      this,
                                                      ReqLista.descripcion,
                                                      IndexRL
                                                    )}
                                                  >
                                                    <MdSave />
                                                  </div>
                                                  <div
                                                    onClick={() =>
                                                      this.setState({
                                                        editarNuevosOC: false,
                                                        indexEdtarNuevaOC: null,
                                                        tipoRecurosoNuevo: "",
                                                      })
                                                    }
                                                  >
                                                    <MdClose />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    this.setState({
                                                      editarNuevosOC: true,
                                                      indexEdtarNuevaOC:
                                                        IndexRL,
                                                      tipoRecurosoNuevo:
                                                        "precio",
                                                    })
                                                  }
                                                >
                                                  <MdModeEdit />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </td>

                                      <td className="bordeDerecho">
                                        {" "}
                                        {ReqLista.recurso_parcial}
                                      </td>

                                      <td
                                        className={
                                          this.state.tipoEjecucion === true
                                            ? "colorInputeableRecurso"
                                            : ""
                                        }
                                      >
                                        {this.state.tipoEjecucion === false ? (
                                          `${ReqLista.recurso_gasto_cantidad}`
                                        ) : (
                                          <div className="d-flex justify-content-between contentDataTd">
                                            {Editable === IndexRL &&
                                            precioCantidad === "cantidad" ? (
                                              <input
                                                type="text"
                                                defaultValue={ConvertFormatStringNumber(
                                                  ReqLista.recurso_gasto_cantidad
                                                )}
                                                autoFocus
                                                onBlur={this.inputeable.bind(
                                                  this,
                                                  { IndexRL },
                                                  "cantidad",
                                                  ReqLista.descripcion
                                                )}
                                                style={{ width: "60px" }}
                                              />
                                            ) : (
                                              <span>
                                                {
                                                  ReqLista.recurso_gasto_cantidad
                                                }
                                              </span>
                                            )}
                                            <div className="ContIcon">
                                              {Editable === IndexRL &&
                                              precioCantidad === "cantidad" ? (
                                                <div className="d-flex">
                                                  <div
                                                    onClick={() =>
                                                      this.activaEditable(
                                                        IndexRL,
                                                        null,
                                                        ""
                                                      )
                                                    }
                                                  >
                                                    <MdSave />{" "}
                                                  </div>{" "}
                                                  <div
                                                    onClick={() =>
                                                      this.setState({
                                                        Editable: null,
                                                        precioCantidad: "",
                                                        selectTipoDocumento: "",
                                                      })
                                                    }
                                                  >
                                                    {" "}
                                                    <MdClose />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    this.activaEditable(
                                                      IndexRL,
                                                      "cantidad",
                                                      ""
                                                    )
                                                  }
                                                >
                                                  <MdModeEdit />{" "}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </td>

                                      <td
                                        className={
                                          this.state.tipoEjecucion === true
                                            ? "colorInputeableRecurso"
                                            : ""
                                        }
                                      >
                                        {this.state.tipoEjecucion === false ? (
                                          `${ReqLista.recurso_gasto_precio}`
                                        ) : (
                                          <div className="d-flex justify-content-between contentDataTd">
                                            {Editable === IndexRL &&
                                            precioCantidad === "precio" ? (
                                              <input
                                                type="text"
                                                defaultValue={ConvertFormatStringNumber(
                                                  ReqLista.recurso_gasto_precio
                                                )}
                                                autoFocus
                                                onBlur={this.inputeable.bind(
                                                  this,
                                                  { IndexRL },
                                                  "precio",
                                                  ReqLista.descripcion
                                                )}
                                                style={{ width: "60px" }}
                                              />
                                            ) : (
                                              <span>
                                                {ReqLista.recurso_gasto_precio}
                                              </span>
                                            )}

                                            <div className="ContIcon">
                                              {Editable === IndexRL &&
                                              precioCantidad === "precio" ? (
                                                <div className="d-flex">
                                                  <div
                                                    onClick={() =>
                                                      this.activaEditable(
                                                        IndexRL,
                                                        null
                                                      )
                                                    }
                                                  >
                                                    <MdSave />{" "}
                                                  </div>{" "}
                                                  <div
                                                    onClick={() =>
                                                      this.setState({
                                                        Editable: null,
                                                        precioCantidad: "",
                                                      })
                                                    }
                                                  >
                                                    {" "}
                                                    <MdClose />
                                                  </div>
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    this.activaEditable(
                                                      IndexRL,
                                                      "precio"
                                                    )
                                                  }
                                                >
                                                  <MdModeEdit />{" "}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                      <td> {ReqLista.recurso_gasto_parcial}</td>
                                      <td> {ReqLista.diferencia}</td>
                                      <td> {ReqLista.porcentaje}</td>
                                    </tr>
                                  ) : (
                                    <tr key={IndexRL}>
                                      <td>
                                        <span>
                                          <select
                                            style={{ padding: "1.5px" }}
                                            name="idTipoOrdenCompra"
                                            onChange={this.onChangeInputsRecursoNuevo.bind(
                                              this
                                            )}
                                          >
                                            {DataTipoDocAdquisicionApi.map(
                                              (Docu, indexD) => (
                                                <option
                                                  value={
                                                    Docu.id_tipoDocumentoAdquisicion
                                                  }
                                                  key={indexD}
                                                >
                                                  {Docu.nombre}
                                                </option>
                                              )
                                            )}
                                          </select>
                                          <input
                                            type="text"
                                            name="codigoOrdenCompra"
                                            style={{ width: "70px" }}
                                            onChange={this.onChangeInputsRecursoNuevo.bind(
                                              this
                                            )}
                                          />
                                        </span>
                                      </td>
                                      <td>
                                        <textarea
                                          rows="1"
                                          name="nombRecurso"
                                          cols="50"
                                          onChange={this.onChangeInputsRecursoNuevo.bind(
                                            this
                                          )}
                                        ></textarea>
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          name="undMedida"
                                          style={{ width: "41px" }}
                                          onChange={this.onChangeInputsRecursoNuevo.bind(
                                            this
                                          )}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="cantidad"
                                          style={{ width: "50px" }}
                                          onChange={this.onChangeInputsRecursoNuevo.bind(
                                            this
                                          )}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="precio"
                                          style={{ width: "55px" }}
                                          onChange={this.onChangeInputsRecursoNuevo.bind(
                                            this
                                          )}
                                        />
                                      </td>
                                      <td>
                                        {this.state.cantidad *
                                          this.state.precio || 0}
                                        <div
                                          className="float-right btnCancelar"
                                          title="Cancelar"
                                          onClick={this.agregaRecursoNuevo.bind(
                                            this,
                                            "cancelar"
                                          )}
                                        >
                                          <MdClose size={15} />
                                        </div>
                                      </td>

                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                    </tr>
                                  )
                              )}
                            </tbody>
                          </table>

                          <div className="float-right mr-2 ">
                            <div className="d-flex text-dark">
                              <InputGroup size="sm">
                                <InputGroup>
                                  <Button
                                    className="btn btn-light pt-0"
                                    onClick={() => this.PaginaActual(1)}
                                    disabled={PaginaActual === 1}
                                  >
                                    <MdFirstPage />
                                  </Button>
                                  <Button
                                    className="btn btn-light pt-0"
                                    onClick={() =>
                                      this.PaginaActual(PaginaActual - 1)
                                    }
                                    disabled={PaginaActual === 1}
                                  >
                                    <MdChevronLeft />
                                  </Button>
                                  <input
                                    type="text"
                                    style={{ width: "30px" }}
                                    value={PaginaActual}
                                    onChange={(e) =>
                                      this.setState({
                                        PaginaActual: e.target.value,
                                      })
                                    }
                                  />
                                  <InputGroupText>
                                    {`de  ${NumeroPaginas.length}`}{" "}
                                  </InputGroupText>
                                </InputGroup>
                                <InputGroup>
                                  <Button
                                    className="btn btn-light pt-0"
                                    onClick={() =>
                                      this.PaginaActual(PaginaActual + 1)
                                    }
                                    disabled={
                                      PaginaActual === NumeroPaginas.length
                                    }
                                  >
                                    <MdChevronRight />
                                  </Button>
                                  <Button
                                    className="btn btn-light pt-0"
                                    onClick={() =>
                                      this.PaginaActual(NumeroPaginas.pop())
                                    }
                                    disabled={
                                      PaginaActual === NumeroPaginas.length
                                    }
                                  >
                                    <MdLastPage />
                                  </Button>
                                </InputGroup>
                              </InputGroup>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ) : (
                  ""
                )}
              </CardBody>
            </Card>
          ) : (
            <Card className="m-1">
              <CardHeader className="p-1">
                {nombreComponente}
                <div className="float-right">
                  <InputGroup size="sm">
                    <InputGroup>
                      <InputGroupText>
                        <MdSearch size={20} />{" "}
                      </InputGroupText>{" "}
                    </InputGroup>

                    <Input
                      placeholder="Buscar por descripción"
                      onKeyUp={(e) => this.Filtrador(e)}
                    />

                    <UncontrolledDropdown>
                      <DropdownToggle caret className="bg-primary">
                        {this.state.FilterSelected}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => this.Filtrador(101)}>
                          Todo
                        </DropdownItem>
                        <DropdownItem onClick={() => this.Filtrador(0)}>
                          0%
                        </DropdownItem>
                        <DropdownItem onClick={() => this.Filtrador(100)}>
                          100%
                        </DropdownItem>
                        <DropdownItem onClick={() => this.Filtrador(99)}>
                          Progreso
                        </DropdownItem>
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
                    <NavLink
                      className={classnames({
                        "bg-warning text-dark":
                          this.state.CollapseResumenTabla === "resumenRecursos",
                      })}
                      onClick={() => {
                        this.CollapseResumenTabla("resumenRecursos");
                      }}
                    >
                      MOSTRAR RESUMEN{" "}
                      {this.state.CollapseResumenTabla === "resumenRecursos" ? (
                        <IoMdArrowDropdownCircle />
                      ) : (
                        <IoMdArrowDropupCircle />
                      )}
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      className={classnames({
                        "bg-warning text-dark":
                          this.state.CollapseResumenTabla === "tablaPartidas",
                      })}
                      onClick={() => {
                        this.CollapseResumenTabla("tablaPartidas");
                      }}
                    >
                      MOSTRAR POR PARTIDA{" "}
                      {this.state.CollapseResumenTabla === "tablaPartidas" ? (
                        <IoMdArrowDropdownCircle />
                      ) : (
                        <IoMdArrowDropupCircle />
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
                <br />
                <br />
                <Collapse isOpen={CollapseResumenTabla === "resumenRecursos"}>
                  <div className="mb-1 mt-1">
                    {DataResumenGeneralCompApi.length !== 0 ? (
                      <HighchartsReact
                        highcharts={Highcharts}
                        // constructorType={'stockChart'}
                        options={ChartResumenRecursos}
                      />
                    ) : (
                      <div className="text-center h6 text-danger">
                        No hay datos
                      </div>
                    )}
                  </div>
                  <Nav tabs>
                    {DataTipoRecursoResumen.map((Resumen, index) => (
                      <NavItem key={index}>
                        <NavLink
                          className={classnames({
                            active:
                              this.state.activeTabResumen === index.toString(),
                          })}
                          onClick={() => {
                            this.reqResumenXComponente(
                              index.toString(),
                              this.state.id_componente,
                              Resumen.tipo
                            );
                          }}
                        >
                          {Resumen.tipo}
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>

                  <Card>
                    {/* <CardHeader className="p-1">RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN EXPEDIENTE TÉCNICO</CardHeader> */}
                    <CardBody>
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th colSpan="5" className="bordeDerecho">
                              RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN
                              EXPEDIENTE TÉCNICO
                            </th>
                            <th colSpan="5">
                              {" "}
                              RECURSOS GASTADOS HASTA LA FECHA ( HOY{" "}
                              {FechaActual()} )
                            </th>
                          </tr>
                          <tr>
                            <th>RECURSO</th>
                            <th>UND</th>
                            <th>CANTIDAD</th>
                            <th>PRECIO S/.</th>
                            <th className="bordeDerecho"> PARCIAL S/.</th>

                            <th>CANTIDAD</th>
                            <th>PRECIO S/.</th>
                            <th>PARCIAL S/.</th>
                            <th>DIFERENCIA</th>
                            <th>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DataRecursosListaApi.map((ReqLista, IndexRL) => (
                            <tr key={IndexRL}>
                              <td> {ReqLista.descripcion} </td>
                              <td> {ReqLista.unidad} </td>
                              <td> {ReqLista.recurso_cantidad}</td>
                              <td> {ReqLista.recurso_precio}</td>
                              <td className="bordeDerecho">
                                {" "}
                                {ReqLista.recurso_parcial}
                              </td>

                              <td> {ReqLista.recurso_gasto_cantidad}</td>
                              <td> {ReqLista.recurso_precio}</td>
                              <td> {ReqLista.recurso_gasto_parcial}</td>
                              <td> {ReqLista.diferencia}</td>
                              <td> {ReqLista.porcentaje}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardBody>
                  </Card>
                </Collapse>
                <Collapse isOpen={CollapseResumenTabla === "tablaPartidas"}>
                  <table className="table table-sm mt-2">
                    <thead className="resplandPartida">
                      <tr>
                        <th style={{ width: "39px" }}>
                          <div
                            title="Busqueda por prioridad"
                            className="prioridad"
                            onClick={() => this.Prioridad("filtro")}
                          >
                            <FaSuperpowers size={15} />
                          </div>

                          {
                            //selecciona circulo para filtrar
                            this.state.mostrarIconos === "filtro" ? (
                              <div className="menuCirculo">
                                {DataPrioridadesApi.map((priori, IPriori) => (
                                  <div
                                    className="circleColor"
                                    style={{ background: priori.color }}
                                    onClick={() => this.Filtrador(priori.valor)}
                                    key={IPriori}
                                  />
                                ))}
                              </div>
                            ) : (
                              ""
                            )
                          }
                        </th>
                        <th>ITEM</th>
                        <th>DESCRIPCIÓN</th>
                        <th>METRADO</th>
                        <th>P/U </th>
                        <th>P/P </th>
                        <th width="20%">BARRA DE PROGRESO</th>
                      </tr>
                    </thead>
                    {DatosPartidasFiltrado.length <= 0 ? (
                      <tbody>
                        <tr>
                          <td colSpan="8" className="text-center text-warning">
                            No hay datos
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      DatosPartidasFiltrado.map((metrados, i) => (
                        <tbody key={i}>
                          <tr
                            className={
                              metrados.tipo === "titulo"
                                ? "font-weight-bold text-warning icoVer"
                                : collapse === i
                                ? "font-weight-light resplandPartida icoVer"
                                : "font-weight-light icoVer"
                            }
                          >
                            <td>
                              {metrados.tipo === "titulo" ? (
                                ""
                              ) : (
                                <div
                                  title="prioridad"
                                  className="prioridad"
                                  style={{ color: metrados.prioridad_color }}
                                  onClick={() => this.Prioridad(i)}
                                >
                                  <span className="h6">
                                    {" "}
                                    {metrados.iconocategoria_nombre}
                                  </span>
                                </div>
                              )}
                              {/* map de de colores prioridades */}

                              <div
                                className={
                                  this.state.mostrarIconos !== i
                                    ? "d-none"
                                    : "menuCirculo"
                                }
                              >
                                {/* DIV DE CIRCULOS CON ICONO   */}
                                {DataIconosCategoriaApi.map((Icono, IIcono) => (
                                  <div
                                    className="circleIcono"
                                    onClick={() =>
                                      this.UpdatePrioridadIcono(
                                        metrados.id_partida,
                                        Icono.id_iconoCategoria,
                                        i
                                      )
                                    }
                                    key={IIcono}
                                  >
                                    <span className="spanUbi">
                                      {" "}
                                      {Icono.nombre}{" "}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div
                                className={
                                  this.state.mostrarColores !== i
                                    ? "d-none"
                                    : "menuCirculo"
                                }
                              >
                                {/* DIV DE CIRCULOS CON COLOR   */}
                                {DataPrioridadesApi.map((priori, IPriori) => (
                                  <div
                                    className="circleColor"
                                    style={{ background: priori.color }}
                                    onClick={() =>
                                      this.UpdatePrioridadColor(
                                        metrados.id_partida,
                                        priori.id_prioridad,
                                        i
                                      )
                                    }
                                    key={IPriori}
                                  ></div>
                                ))}
                              </div>
                            </td>
                            <td
                              className={
                                metrados.tipo === "titulo"
                                  ? ""
                                  : collapse === i
                                  ? "tdData1 "
                                  : "tdData"
                              }
                              onClick={
                                metrados.tipo === "titulo"
                                  ? () => this.CollapseItem(-1, -1)
                                  : () =>
                                      this.CollapseItem(i, metrados.id_partida)
                              }
                              data-event={i}
                            >
                              {metrados.item}
                            </td>
                            <td>{metrados.descripcion}</td>
                            <td>
                              {metrados.metrado} {metrados.unidad_medida}{" "}
                            </td>
                            <td>{metrados.costo_unitario}</td>
                            <td>{metrados.parcial}</td>
                            <td className="small border border-left border-right-0 border-bottom-0 border-top-0">
                              <div
                                className={
                                  metrados.tipo === "titulo" ? "d-none" : ""
                                }
                              >
                                <div className="clearfix">
                                  <span className="float-left text-warning">
                                    A. met. {metrados.avance_metrado}{" "}
                                    {metrados.unidad_medida}
                                  </span>
                                  <span className="float-right text-warning">
                                    S/. {metrados.avance_costo}
                                  </span>
                                </div>

                                <div
                                  style={{
                                    height: "3px",
                                    width: "100%",
                                    background: "#c3bbbb",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${metrados.porcentaje}%`,
                                      height: "100%",
                                      background:
                                        metrados.porcentaje > 95
                                          ? "#a4fb01"
                                          : metrados.porcentaje > 50
                                          ? "#ffbf00"
                                          : "#ff2e00",
                                      transition: "all .9s ease-in",
                                    }}
                                  />
                                </div>
                                <div className="clearfix">
                                  <span className="float-left text-info">
                                    Saldo: {metrados.metrados_saldo}
                                  </span>
                                  <span className="float-right text-info">
                                    S/. {metrados.metrados_costo_saldo}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr
                            className={
                              collapse === i
                                ? "resplandPartidabottom"
                                : "d-none"
                            }
                          >
                            <td colSpan="8">
                              <Collapse isOpen={collapse === i}>
                                <Nav tabs>
                                  {DataRecursosCdAPI.map(
                                    (recursoCd, IndecCD) => (
                                      <NavItem key={IndecCD}>
                                        <NavLink
                                          className={classnames({
                                            active:
                                              this.state.activeTabRecusoCd ===
                                              IndecCD.toString(),
                                          })}
                                          onClick={() => {
                                            this.TabRecurso(
                                              IndecCD.toString(),
                                              recursoCd.tipo,
                                              metrados.id_partida
                                            );
                                          }}
                                        >
                                          {recursoCd.tipo}
                                        </NavLink>
                                      </NavItem>
                                    )
                                  )}
                                </Nav>

                                {/* tareas de algo */}

                                <Card>
                                  {/* <CardHeader className="p-1">RECURSOS SEGÚN EXPEDIENTE TÉCNICO</CardHeader> */}
                                  <CardBody>
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th
                                            colSpan="5"
                                            className="bordeDerecho"
                                          >
                                            RECURSOS SEGÚN EXPEDIENTE TÉCNICO
                                          </th>
                                          <th colSpan="5">
                                            {" "}
                                            RECURSOS GASTADOS HASTA LA FECHA (
                                            HOY {FechaActual()} ){" "}
                                          </th>
                                        </tr>
                                        <tr>
                                          <th>RECURSO</th>
                                          <th>UND</th>
                                          <th>CANTIDAD</th>
                                          <th>PRECIO S/.</th>
                                          <th className="bordeDerecho">
                                            PARCIAL S/.
                                          </th>

                                          <th>CANTIDAD</th>
                                          <th>PRECIO S/.</th>
                                          <th>PARCIAL S/.</th>
                                          <th>DIFERENCIA</th>
                                          <th>%</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {DataListaRecursoDetallado.map(
                                          (listResurso, indexRe) => (
                                            <tr key={indexRe}>
                                              <td>
                                                {listResurso.descripcion}{" "}
                                              </td>
                                              <td>{listResurso.unidad} </td>
                                              <td>
                                                {" "}
                                                {listResurso.recurso_cantidad}
                                              </td>
                                              <td>
                                                {" "}
                                                {listResurso.recurso_precio}
                                              </td>
                                              <td className="bordeDerecho">
                                                {" "}
                                                {listResurso.recurso_parcial}
                                              </td>

                                              <td>
                                                {" "}
                                                {
                                                  listResurso.recurso_gasto_cantidad
                                                }
                                              </td>
                                              <td>
                                                {" "}
                                                {listResurso.recurso_precio}
                                              </td>
                                              <td>
                                                {" "}
                                                {
                                                  listResurso.recurso_gasto_parcial
                                                }
                                              </td>
                                              <td> {listResurso.diferencia}</td>
                                              <td> {listResurso.porcentaje}</td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </CardBody>
                                </Card>
                              </Collapse>
                            </td>
                          </tr>
                        </tbody>
                      ))
                    )}
                  </table>
                </Collapse>
              </CardBody>
            </Card>
          )}
        </Card>
      </div>
    );
  }
}

export default ListaMateriales;

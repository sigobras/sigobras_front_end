import React, { Component } from 'react';
import { Container, TabPane, Nav, NavItem, NavLink, Button, Row, Col, Form, FormGroup, Label, Input, Progress, Collapse, InputGroup, InputGroupAddon, InputGroupText, Modal, InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import io from 'socket.io-client';

import classnames from 'classnames';
import { MdSend, MdSystemUpdateAlt, MdKeyboardArrowDown, MdKeyboardArrowUp, MdAddCircle, MdGroupAdd, MdAlarmAdd, MdSave, MdClose, MdStar, MdStarBorder } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";
import { GoSignIn, GoSignOut, GoOrganization } from "react-icons/go";
import { DebounceInput } from 'react-debounce-input';
import { toast } from "react-toastify";

import Picky from "react-picky";
import "react-picky/dist/picky.css";
import "../../../css/GTareas.css"

import { FechaActual, Extension } from "../Utils/Funciones"
import { UrlServer, Id_Acceso, ImgAccesoSS, Id_Obra, NombUsuarioSS } from "../Utils/ServerUrlConfig"

import DragDrop from "./DragDrop"


class GestionTareas extends Component {
  constructor(props) {
    super(props);

    this.server = process.env.REACT_APP_API_URL || UrlServer;
    // this.server = process.env.REACT_APP_API_URL || "192.168.0.5:9000";
    this.socket = io.connect(this.server);

    this.toggleTabDetalleTarea = this.toggleTabDetalleTarea.bind(this);
    this.AgregaTarea = this.AgregaTarea.bind(this);
    this.porcentCollapse = this.porcentCollapse.bind(this);
    this.MostrasMasTarea = this.MostrasMasTarea.bind(this);
    this.EditPorcentaje = this.EditPorcentaje.bind(this);
    this.textPorcentEdit = this.textPorcentEdit.bind(this);
    this.GuardaComentario = this.GuardaComentario.bind(this);
    this.ModalVerMasTareas = this.ModalVerMasTareas.bind(this);
    this.subtareaAdd = this.subtareaAdd.bind(this);
    this.onChangeProyecto = this.onChangeProyecto.bind(this);
    this.onChangePara = this.onChangePara.bind(this);
    this.onChangePersonal = this.onChangePersonal.bind(this);
    this.onChangeImgMetrado = this.onChangeImgMetrado.bind(this);
    this.clearImg = this.clearImg.bind(this);
    this.DescargarArchivo = this.DescargarArchivo.bind(this);
    // this.CollapseFormContainerAddTarea = this.CollapseFormContainerAddTarea.bind(this);
    // this.dropdownRecibidos = this.dropdownRecibidos.bind(this);
    this.CreaProyecto = this.CreaProyecto.bind(this);
    this.CollapseProyecto = this.CollapseProyecto.bind(this);



    this.reqProyectos = this.reqProyectos.bind(this);
    this.reqTareasRecibidas = this.reqTareasRecibidas.bind(this);
    this.reqTareasEmitidos = this.reqTareasEmitidos.bind(this);

    this.reqSubordinados = this.reqSubordinados.bind(this);
    // DRAG DROP
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.demoFuncion = this.demoFuncion.bind(this);

    this.state = {
      online: 0,

      DataTareasApi: [],
      PositsFiltrado: [],
      DataTareasEmitidosApi: [],

      DataProyectoApi: [],
      DataProyectoMostrarApi: [],
      DataCargosApi: [],
      DataPersonalApi: [],
      DatSubordinadospi: [],

      // captura inputs de envio de datos del formulario
      Para: [],
      proyecto: [],
      asunto: "",
      InputPersonal: [],
      descripcion: "",
      fechaInicio: "",
      duracion: null,

      barraPorcentaje: null,
      collapseInputPorcentaje: null,

      activeTabModalTarea: "1",

      // modalVerTareas: false,

      // sub tareas
      inputSubtarea: "",

      CollapseInputAddTarea: false,
      // capturar imagen

      file: null,
      UrlImagen: "",
      SMSinputTypeImg: false,

      CollapseFormContainerAddTarea: false,

      // recibidos
      ActiveTab: "0",
      inputNombreProyecto: "",

      nombreProyectoValidacion: "",
      condicionInputCollapse: false,
      collapseProyecto: "0",
      // datos desde hasta para pendientes progreso .....
      Inicio: "",
      Fin: "",
      // index para eliminar la data 
      indexSubTarea: null,
      // editar valor porcentaje

      InputEditablePorcent: null,
      IdProyecto: "",
      modalVerMasTareasUser: false,
      idTareaActivo:null
    };
  }

  componentDidMount() {

    this.socket.on('visitors', data => this.setState({ online: data }));
    // this.socket.on('visitor exits', data => this.setState({ online: data }));
    // this.socket.on('add', data => this.handleUserAdded(data));
    // this.socket.on('update', data => this.handleUserUpdated(data));
    // this.socket.on('delete', data => this.handleUserDeleted(data));









    document.title = "GESTIÓN DE TAREAS 🎁"
    // llama api de tareas pendientes

    this.reqProyectos(Id_Acceso, "0", "0", "", "0")
    this.reqTareasEmitidos(Id_Acceso, "0", "0")
    // this.reqTareasEmitidos(id_acceso, inicio, fin)

    // API DE SUBORDINADOS
    this.reqSubordinados(Id_Acceso)
    // API PROYECTOS---------------------------------------------
    axios.get(`${UrlServer}/getTareaProyectos`)
      .then((res) => {
        // console.log("proyectos", res.data)

        var data = res.data

        this.setState({
          DataProyectoApi: data,
        })
      })
      .catch((err) => {
        console.log("errores al consumir api", err)
      });


    // CARGOS API---------------------------------------------
    axios.post(`${UrlServer}/getTareaCargos`, {
      id_acceso: Id_Acceso
    })
      .then((res) => {
        // console.log("datos de cargos ", res.data)
        this.setState({
          DataCargosApi: res.data
        })
      })
      .catch((err) => {
        console.log("error al conectar al api", err)
      })
  }

  demoFuncion(user) {
    console.log("dataaaaaaa>>>>>>>>", user)
    console.log("dataaaa------------------->", this.state.PositsFiltrado.comentarios)

    // let users = this.state.PositsFiltrado.comentarios.slice();
    let users = this.state.PositsFiltrado
    users.comentarios.push(user);
    console.log("************************** ", users)

    this.setState({ PositsFiltrado: users });
  }

  toggleTabDetalleTarea(tab) {
    if (this.state.activeTabModalTarea !== tab) {
      this.setState({
        activeTabModalTarea: tab
      });
    }
  }

  AgregaTarea(e) {
    e.preventDefault()
    var { PositsFiltrado, IdProyecto, proyecto, file, asunto, descripcion, fechaInicio, duracion, InputPersonal } = this.state
    console.log("ejecutando", PositsFiltrado.id_tarea, "IdProyecto ", IdProyecto)


    // if( Para.length <=0 && InputPersonal.length <=0  ){
    //     console.log(" no es proyecto")
    //     return
    // }
    var funcionMap = (data) => ([data.id_acceso])
    var Personal = InputPersonal.map(funcionMap);
    var idTarea = PositsFiltrado.id_tarea

    if (typeof idTarea === "undefined") {
      idTarea = ""
    }

    var ProyectoId = IdProyecto

    if (IdProyecto === "") {
      console.log("id proyecto vacio ")
      ProyectoId = proyecto.id_proyecto
    }
    // console.log("Personal ->", Personal)
    //dias a sumar
    var TuFecha = new Date(fechaInicio);
    var dias = Number(duracion) + 1;

    //nueva fecha sumada
    TuFecha.setDate(TuFecha.getDate() + dias);
    //formato de salida para la fecha
    var resultado = TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate();
    // console.log("resultado ",  resultado, "fechaInicio", fechaInicio , "nombre archivo ", file.name)
    var tamanioImagenUrl = file
    if (tamanioImagenUrl !== null) {
      tamanioImagenUrl = Extension(file.name)
    }

    const formData = new FormData();
    formData.append('asunto', asunto);
    formData.append('descripcion', descripcion);
    formData.append('fecha_inicial', fechaInicio);
    formData.append('fecha_final', resultado);
    formData.append('proyectos_id_proyecto', ProyectoId);
    formData.append('emisor', Id_Acceso);
    formData.append('receptor', Personal);
    formData.append('archivo', file);
    formData.append('extension', tamanioImagenUrl);
    formData.append('codigo_obra', Id_Obra);
    formData.append('tareas_id_tarea', idTarea);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    axios.post(`${UrlServer}/postTarea`,
      formData,
      config
    )
      .then((res) => {
        console.log("Post tareas", res)
        if (res.data !== "") {
          this.setState({
            // ActiveTab: "4",
            Para: [],
            proyecto: [],
            asunto: "",
            InputPersonal: [],
            descripcion: "",
            // fechaInicio: "",
          })
          // document.getElementById("descripcion").value = "";
          document.getElementById("formAgregarTarea").reset();

          this.reqProyectos(Id_Acceso, "0", "0", "", "0")
          this.reqTareasEmitidos(Id_Acceso, "0", "0")
          this.reqSubordinados(Id_Acceso)

          toast.success("✔ Tarea Agregada al sistema ")
          return
        }
        toast.error("❌ complete todos los campos requeridos ")

      })
      .catch((err) => {
        console.error("datos de tarea", err);
      })

  }

  porcentCollapse(index) {
    this.setState(
      {
        collapseInputPorcentaje: this.state.collapseInputPorcentaje === index ? null : index,
      }
    );
  }

  subtareaAdd(idTarea) {
    console.log("id tarea", idTarea)

    axios.post(`${UrlServer}/postSubTarea`, {
      "asunto": this.state.inputSubtarea,
      "tareas_id_tarea": idTarea
    })
      .then((res) => {
        console.log("data de subtarea ", res)
        var dataRes = this.state.DatSubordinadospi
        dataRes.unshift(
          res.data
        )
        this.setState({
          DatSubordinadospi: dataRes,
          inputSubtarea: ""
        })
      })
      .catch((err) => {
        console.error("error al consultar el api de subtareas", err)
      })

  }

  // captura inputs 
  onChangeProyecto(value) {
    console.log("value", value);

    this.setState({ proyecto: value })
  }

  onChangePara(value) {

    console.log("valor id cargo ", value)

    this.setState({ Para: value })

    axios.post(`${UrlServer}/getTareaUsuariosPorCargo`,
      {
        "id_acceso": Id_Acceso,
        "id_Cargo": value.id_Cargo
      }
    )
      .then((res) => {
        console.log("data Usuarios", res.data)

        this.setState({ DataPersonalApi: res.data })

      })
      .catch((err) => {
        console.error("ocurrió un error en el reques de Usuarios", err);
      })
  }

  onChangePersonal(valor) {

    console.log("data valor ", valor)
    this.setState({ InputPersonal: valor })
  }

  onChangeImgMetrado(e) {

    var inputValueImg = e.target.files[0]
    // console.log('archivo', inputValueImg);

    // Extension(inputValueImg.name)

    if (Extension(inputValueImg.name) === ".jpeg" || Extension(inputValueImg.name) === ".png" || Extension(inputValueImg.name) === ".jpg" || Extension(inputValueImg.name) === ".dwg" || Extension(inputValueImg.name) === ".xls" || Extension(inputValueImg.name) === ".xlsx") {
      var url = URL.createObjectURL(inputValueImg)
      // console.log("url", url);

      this.setState({
        file: inputValueImg,
        UrlImagen: url,
        SMSinputTypeImg: false
      });
      return
    }

    this.setState({
      SMSinputTypeImg: true,
      UrlImagen: "",
      file: null
    })
  }

  clearImg() {
    // limpia valores por si los tiene

    this.setState({
      UrlImagen: "",
      file: null,
    })
    document.getElementById("myImage").value = "";
  }

  DescargarArchivo(data) {
    var tipoArchivo = Extension(data)
    console.log("ulr ", data, "tipo archivo ", tipoArchivo)


    // const url = window.URL.createObjectURL(data);
    const url = data

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', data, "target", "_blank");

    // if( tipoArchivo == ".jpg" ||  tipoArchivo == ".jpeg",  tipoArchivo == ".png"){
    console.log("es una imagen")
    link.setAttribute("target", "_blank");

    // }
    document.body.appendChild(link);
    link.click();

    console.log("link.click() ", link)
  }

  CreaProyecto() {

    if (this.state.inputNombreProyecto.length <= 0) {
      this.setState({
        nombreProyectoValidacion: "Ingrese un nombre de proyecto"
      })
      return
    }
    if (confirm("¿ Esta seguro de añadir un nuevo proyecto al sistema ?")) {
      axios.post(`${UrlServer}/postProyecto`,
        {
          "nombre": this.state.inputNombreProyecto
        }
      )
        .then((res) => {
          console.log("respopnse guarda proyecto", res.data)
          this.setState({
            condicionInputCollapse: false
          })
        })

        .catch((err) => {
          console.log("algo salio mal al guardar el proyecto ", err)
        })
    }
  }

  CollapseProyecto(index, IdProyecto) {
    console.log("index ", index, "IdProyecto ", IdProyecto)
    this.setState({
      collapseProyecto: this.state.collapseProyecto === index ? null : index,
      IdProyecto
    });
    if (this.state.collapseProyecto !== index) {
      this.reqTareasRecibidas(Id_Acceso, this.state.Inicio, this.state.Fin, IdProyecto)
      return
    }
    this.setState({ PositsFiltrado: [] })
  }

  MostrasMasTarea(idTarea) {

    console.log(this.state.idTareaActivo, " === ", idTarea)
    if (this.state.idTareaActivo !== idTarea) {
      this.setState({ idTareaActivo: idTarea })

      console.log("id", idTarea)
      
      this.socket.on(idTarea, data => this.demoFuncion(data));
      // this.socket.close()
      axios.post(`${UrlServer}/getTareaIdTarea`,
        {
          "id_tarea": idTarea
        }
      )
      .then((res) => {
        console.log("data mas ver mas tarea ", res.data)
        // var dataArmar = Object.assign(Tareas[0], res.data);

        // console.log("dataArmar  ", dataArmar)

        this.setState({
          PositsFiltrado: res.data
        })

      })
      .catch((err) => {
        console.error("algo salió mal al enviar los datos ", err)
      })
      return
    }
      // this.socket.close()

  }

  EditPorcentaje(index) {
    console.log("ejecutando EditPorcentaje")
    this.setState({ InputEditablePorcent: this.state.InputEditablePorcent === index ? null : index })
  }

  textPorcentEdit(e, indexT, id_tarea) {
    var valorInput = e.target.value

    valorInput = Number(valorInput)
    console.log("valor del inoutt", valorInput)

    axios.post(`${UrlServer}/postTareaAvance`, {
      "avance": valorInput,
      "id_tarea": id_tarea,
    })
      .then((res) => {
        console.log("retorno de porcent ", res.data)
        var tareasRecibidas = this.state.DataTareasApi
        tareasRecibidas[indexT].porcentaje_avance = res.data.avance
        this.setState({
          InputEditablePorcent: false,
          DataTareasApi: tareasRecibidas
        })

      })
      .catch((err) => {
        console.error("erro al enviar el porcentaje del api ", err)
      })
  }

  GuardaComentario(e) {
    e.preventDefault();

    console.log("ejecuntando data ", e.target[0].value)

    axios.post(`${UrlServer}/postTareaComentario`, {
      "mensaje": e.target[0].value,
      "tareas_id_tarea": this.state.PositsFiltrado.id_tarea,
      "accesos_id_acceso": Id_Acceso
    })
      .then((res) => {
        console.log("data enviado ", res)

        // this.socket.emit('tareas_comentarios', res.data);
        document.getElementById("inputComentario").value = "";
        this.socket.emit("tareas_comentarios",
          {
            id_tarea: this.state.PositsFiltrado.id_tarea,
            data: res.data
          }
        )

      })
      .catch((err) => {
        console.error("error al guardar los datos ", err)
      })
  }

  ModalVerMasTareas() {
    this.setState(prevState => ({
      modalVerMasTareasUser: !prevState.modalVerMasTareasUser
    }));
  }
  // REQUESTS AL API ---------------------------------------------

  reqProyectos(id_acceso, inicio, fin, tipo, index) {

    this.setState({
      ActiveTab: index,
      Inicio: inicio,
      Fin: fin
    })

    axios.post(`${UrlServer}/getTareasReceptorProyectos`,
      {
        "id_acceso": id_acceso,
        "inicio": inicio,
        "fin": fin,
        "tipo": tipo
      }
    )
      .then((res) => {
        console.log("response proyectos ", res)
        this.setState({
          DataProyectoMostrarApi: res.data
        })
        // this.reqTareasRecibidas( id_acceso, inicio, fin , res.data[0].id_proyecto )
      })

      .catch((err) => {
        console.log("error al consultar api ", err.response)
        if (err.response.data === "vacio") {
          this.setState({
            DataProyectoMostrarApi: []
          })
        }
      })
  }

  reqTareasRecibidas(id_acceso, inicio, fin, IdProyecto) {
    axios.post(`${UrlServer}/getTareasReceptor`,
      {
        "id_acceso": id_acceso,
        "inicio": inicio,
        "fin": fin,
        "id_proyecto": IdProyecto
      }
    )
      .then((res) => {
        console.log("response tareas api ", res.data)
        this.setState({
          DataTareasApi: res.data
        })
      })

      .catch((err) => {
        console.log("error al consultar api ", err)
      })
  }

  reqTareasEmitidos(Id_Acceso, inicio, fin) {
    axios.post(`${UrlServer}/getTareasEmisor`,
      {
        "id_acceso": Id_Acceso,
        "inicio": inicio,
        "fin": fin
      }
    )
      .then((res) => {
        console.log("response emisor api ", res.data)
        this.setState({
          DataTareasEmitidosApi: res.data
        })
      })

      .catch((err) => {
        console.log("error al consultar api ", err)
      })
  }

  reqSubordinados(IdAcceso) {

    axios.post(`${UrlServer}/getTareaSubordinados`,
      {
        "id_acceso": IdAcceso
      }
    )
      .then((res) => {
        console.log("response de subordinados", res.data)
        var dataRes = res.data
        if (dataRes !== "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {
          // Object.defineProperty( NewData[j].subordinadosTareas[k], "id_proyecto", { value:" dataRes[j].subordinadosTareas[k].id_proyecto" })

          this.setState({
            DatSubordinadospi: dataRes,
          })
        }
      })
      .catch((err) => {
        console.error("errorr al obterner datos", err)
      })
  }
  // drag funciones==============================================================================

  onDragStart(ev, id, index) {
    console.log('moviendo :', id, "index ", index);
    ev.dataTransfer.setData("id", id);
    this.setState({ indexSubTarea: Number(index) })
  }

  onDragOver(ev) {
    ev.preventDefault();
    // console.log("mover over ", ev)
  }

  onDrop(ev, cat, idAccesso) {
    console.log("onDrop ", cat, "idAccesso ", idAccesso)

    var { indexSubTarea, DatSubordinadospi, DataTareasEmitidosApi } = this.state
    let id = ev.dataTransfer.getData("id");
    var DataSubordinados = DatSubordinadospi
    var DataEmitidos = DataTareasEmitidosApi


    var fiterIdacceso = DataSubordinados.map(((e) => { return e.id_acceso; })).indexOf(idAccesso);
    console.log("DataEmitidos ", DataEmitidos)

    if (cat === "completado") {
      axios.post(`${UrlServer}/postTareaReceptores`,
        [
          [id, idAccesso]
        ]
      )
        .then((res) => {
          console.log("response asigna tarea", res.data)
          if (res.data !== "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {

            DataEmitidos.splice(indexSubTarea, 1)

            DataSubordinados[fiterIdacceso].subordinadosTareas = res.data

            this.setState({
              DatSubordinadospi: DataSubordinados,
              // DataTareasEmitidosApi:""
            })
          }

        })
        .catch((err) => {
          console.log("error al enviar datos ", err)
        })
    }


  }

  render() {
    const { DataProyectoApi, DataProyectoMostrarApi, DataCargosApi, DataPersonalApi, DataTareasApi, DataTareasEmitidosApi, PositsFiltrado, DatSubordinadospi, proyecto, Para, InputPersonal, SMSinputTypeImg, CollapseFormContainerAddTarea, ActiveTab, condicionInputCollapse, InputEditablePorcent, idTareaActivo } = this.state
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;

    return (
      <div>
        <Row>
          <div className={CollapseFormContainerAddTarea === true ? "formPositContainer" : "widthFormPositContentCierra"}>
            <div className="h6 text-center">ASIGNAR NUEVA TAREA </div>

            <Form onSubmit={this.AgregaTarea} id="formAgregarTarea">
              <FormGroup>
                <Label >PROYECTO: </Label>

                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="p-2 prioridad" onClick={() => this.setState({ condicionInputCollapse: !condicionInputCollapse, nombreProyectoValidacion: "" })}>
                      <MdAddCircle />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Picky
                    value={proyecto}
                    options={DataProyectoApi}
                    onChange={this.onChangeProyecto}
                    open={false}
                    valueKey="id_proyecto"
                    labelKey="nombre"
                    multiple={false}
                    includeSelectAll={false}
                    includeFilter={true}
                    dropdownHeight={200}
                    placeholder={"No hay datos seleccionados"}
                    allSelectedPlaceholder={"seleccionaste todo"}
                    manySelectedPlaceholder={"tienes %s seleccionados"}
                    className="text-dark form-group-sm"
                  />
                </InputGroup>

                {/* crea proyecto input */}
                {
                  condicionInputCollapse === true ?
                    <InputGroup className="mt-2">
                      <DebounceInput debounceTimeout={300} onChange={e => this.setState({ inputNombreProyecto: e.target.value })} className="form-control" />

                      <InputGroupAddon addonType="prepend">
                        <InputGroupText className="prioridad" onClick={this.CreaProyecto}>
                          <MdSend />
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    : ""
                }


                <label className="texto-rojo"><b>{this.state.nombreProyectoValidacion}</b></label><br />

                {
                  proyecto.nombre === "RECORDATORIO" || proyecto.nombre === "SUB-TAREA" ? "" :
                    <div>
                      <Label for="A">PARA: </Label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText className="p-2">
                            <MdGroupAdd />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Picky
                          value={Para}
                          options={DataCargosApi}
                          onChange={this.onChangePara}
                          open={false}
                          valueKey="id_Cargo"
                          labelKey="nombre"
                          multiple={false}
                          includeSelectAll={false}
                          includeFilter={true}
                          dropdownHeight={200}
                          placeholder={"No hay datos seleccionados"}
                          allSelectedPlaceholder={"seleccionaste todo"}
                          manySelectedPlaceholder={"tienes %s seleccionados"}
                          className="text-dark"

                        />
                      </InputGroup>


                      <Label for="A">PERSONAL:</Label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText className="p-2">
                            <GoOrganization />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Picky
                          value={InputPersonal}
                          options={DataPersonalApi}
                          onChange={this.onChangePersonal}
                          open={false}
                          valueKey="id_acceso"
                          labelKey="nombre"
                          multiple={true}
                          includeSelectAll={true}
                          includeFilter={true}
                          dropdownHeight={200}
                          placeholder={"No hay datos seleccionados"}
                          allSelectedPlaceholder={"seleccionaste todo"}
                          manySelectedPlaceholder={"tienes %s seleccionados"}
                          className="text-dark"
                          selectAllText="Todos"
                        />
                      </InputGroup>
                    </div>
                }
                <Label for="asunto">TAREA / ASUNTO :</Label>
                <DebounceInput cols="40" rows="1" required element="textarea" value={this.state.asunto} minLength={0} debounceTimeout={300} onChange={e => this.setState({ asunto: e.target.value })} className="form-control" />
                <div className="text-right"> {this.state.asunto.length} / 50</div>

                <Label for="tarea">DESCRIPCIÓN : </Label>
                <DebounceInput cols="40" rows="1" required element="textarea" value={this.state.descripcion} minLength={0} debounceTimeout={300} onChange={e => this.setState({ descripcion: e.target.value })} className="form-control" />
                <div className="text-right">  {this.state.descripcion.length} /  500</div>

                <Label for="fechaInicio">INICIO : </Label>
                <Input type="date" min={FechaActual()} required onChange={e => this.setState({ fechaInicio: e.target.value })} />

                <Label for="duracion">DURACIÓN: </Label>
                <Input type="number" onChange={e => this.setState({ duracion: e.target.value })} required />

                {
                  this.state.UrlImagen.length > 0
                    ?
                    <div className="imgDelete">
                      <button className="imgBtn" onClick={() => this.clearImg()}>X</button>
                      <img src={this.state.UrlImagen} alt="imagen " className="img-fluid mb-2" />
                    </div>
                    : ""
                }

                <div className="texto-rojo mb-0"> <b> {SMSinputTypeImg === true ? "Formatos soportados PNG, JPEG, JPG" : ""}</b></div>

                <div className="custom-file mt-2">
                  <input type="file" className="custom-file-input" onChange={this.onChangeImgMetrado} id="myImage" />
                  <label className="custom-file-label" htmlFor="customFile"> {this.state.file !== null ? this.state.file.name : "SELECCIONE"}</label>

                </div>
              </FormGroup>

              <Button type="submit" color="primary"> <MdSave /> GUARDAR </Button>
            </Form>
          </div>

          <Col className="pr-0">
            <Nav tabs>

              <NavItem>
                <NavLink className={classnames("bg-warning")} onClick={() => this.setState({ CollapseFormContainerAddTarea: !CollapseFormContainerAddTarea })}>
                  {CollapseFormContainerAddTarea === true ? <GoSignIn /> : <GoSignOut />}
                </NavLink>
              </NavItem>

              <NavItem>
                {/* <NavLink className={ classnames({ active: ActiveTab === "0" })} onClick={() => this.reqProyectos(Id_Acceso, "/getTareaEmisorPendientes", "0")}> */}
                <NavLink className={classnames({ active: ActiveTab === "0" })} onClick={() => this.reqProyectos(Id_Acceso, "0", "0", "", "0")}>
                  PENDIENTES
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "1" })} onClick={() => this.reqProyectos(Id_Acceso, "1", "99", "", "1")}>
                  PROGRESO
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "2" })} onClick={() => this.reqProyectos(Id_Acceso, "100", "100", "", "2")}>
                  CONCLUIDOS
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "3" })} onClick={() => this.reqProyectos(Id_Acceso, "0", "100", "vencido", "3")}>
                  VENCIDOS
                </NavLink>
              </NavItem>


              {/* <NavItem>
                <NavLink className={classnames({ "bg-info": ActiveTab === "4" })} onClick={() => this.reqProyectos(Id_Acceso, "/getTareaReceptorTerminadas","4")} style={{ marginTop: "-3px"}}>
                  <MdAlarmAdd size={ 15 } />
                </NavLink>
              </NavItem> */}

            </Nav>

            <div className="p-2">
              <Container fluid className="pr-4">
                <Row>
                  <Col md="3">
                    <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "ejecucion", "nada") }} className="contTRecodatorios">
                      {/* <Container fluid> */}

                      <Row>
                        {
                          DataTareasEmitidosApi.map((TareasEmit, iS) =>
                            <Col md="6 mb-2" key={iS} style={{ marginRight: "-5px" }}>
                              <div className="containerTarea" onDragStart={(e) => this.onDragStart(e, TareasEmit.id_tarea, iS)} draggable>
                                <div className="d-flex justify-content-between headerTarea p-1">
                                  <img src={ImgAccesoSS} alt="sigobras" className="imgCircular" width="20%" height="20%" />

                                  <div className="m-0 h5" onClick={() => this.MostrasMasTarea(TareasEmit.id_tarea)}>{`${TareasEmit.tipo_tarea}-${iS + 1}`}</div>

                                  <div style={{ background: TareasEmit.prioridad_color, width: "5px", height: "50%", borderRadius: "50%", padding: "5px", float: "right" }} />
                                </div>
                                <div className="bodyTarea text-capitalize" style={{ background: TareasEmit.proyecto_color }}>
                                  {TareasEmit.asunto}
                                  {/* <br />
                                  { TareasEmit.proyecto_nombre} */}
                                </div>
                              </div>

                            </Col>
                          )
                        }


                      </Row>
                      {/* </Container> */}

                    </div>

                  </Col>
                  <Col md="3">

                    {
                      PositsFiltrado.length === 0 ? "" :
                        <div className="fondoMostrarMas">
                          <div className="containerTarea">
                            <div className="d-flex justify-content-between headerTarea p-1">
                              <img src={ImgAccesoSS} alt="sigobras" className="imgCircular" width="18%" height="18%" />

                              <label className="m-0 h6 text-center"> {PositsFiltrado.asunto}</label>

                              <div style={{ background: PositsFiltrado.prioridad_color, width: "5px", height: "50%", borderRadius: "50%", padding: "10px" }} />

                            </div>

                            <div className="bodyTareaProyecto" style={{ background: PositsFiltrado.proyecto_color }}>
                              <img src={`${UrlServer}${PositsFiltrado.usuario_imagen}`} alt="sigobras" className="mx-auto d-block imgCircular" width="70%" height="70%" />
                              <div className="text-center flex-column ">
                                <div>{`${PositsFiltrado.porcentaje_avance} %`}</div>
                                <div>{PositsFiltrado.emisor_nombre}</div>
                              </div>

                            </div>
                            <div className="headerTarea text-uppercase px-2 clearfix">
                              <div className="float-left">
                                Por: {PositsFiltrado.emisor_cargo}
                              </div>
                              <div className="float-right prioridad" style={{ marginTop: "-2px" }}>
                                {
                                  PositsFiltrado.tipo_archivo !== null ?
                                    <div className="text-primary" title="descargar archivo" onClick={() => this.DescargarArchivo(`${UrlServer}${PositsFiltrado.tipo_archivo}`)} ><FaFileDownload /></div>
                                    : ""
                                }
                                {/* {
                                  PositsFiltrado.tipo_archivo !== null ?
                                    <a href={ `${UrlServer}${PositsFiltrado.tipo_archivo}`  } download target="_blank" className="text-primary" title="descargar archivo"> <FaFileDownload /></a>
                                  :""
                                }
                                 */}
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <b>Descripción: </b>
                            {PositsFiltrado.descripcion}
                          </div>

                          <div className="text-center text-warning">
                            {
                              PositsFiltrado.diasTranscurridos < 0 ?
                                <b>Faltan {PositsFiltrado.diasTranscurridos.toString().replace("-", "")} dias para empezar la tarea asignada.</b>
                                :
                                <b> Tiene {`${PositsFiltrado.diasTotal}`} dias para cumplir con la meta y te <i> quedan {`${PositsFiltrado.diasTranscurridos}`}</i>  </b>

                            }

                          </div>
                        </div>
                    }
                    <div className="fondoSubord">
                      <div className="text-center text-primary">
                        <b> JEFES DE AREA  </b>
                      </div>
                      {
                        DatSubordinadospi !== undefined ?
                          DatSubordinadospi.map((subtarea, iS) =>
                            <div className="media mb-2" key={iS}>
                              <div className="" style={{ width: "12%" }} onClick={this.ModalVerMasTareas}>
                                <img className="imgCircular prioridad" src={`${UrlServer}${subtarea.subordinado_imagen}`} alt={subtarea.subordinado_imagenAlt} width="30px" height="30px" /><br />
                                <div className="d-flex flex-column text-center" style={{ fontSize: "0.5rem" }}>
                                  {subtarea.usuario_nombre}

                                </div>
                              </div>

                              <div className="media-body">


                                <div className="text-warning  ml-2 text-capitalize">{subtarea.cargo_nombre}</div>
                                <Container fluid>
                                  <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "completado", subtarea.id_acceso) }}>

                                    <Row>
                                      {
                                        subtarea.subordinadosTareas.map((subTares, IndexS) =>
                                          <Col md="1" className="m-1 p-0" style={{ background: subTares.prioridad_color }} key={IndexS} >
                                            <div className="text-center flex-column " style={{ fontSize: "0.6rem" }}>
                                              {subTares.id_proyecto === null ?
                                                <div style={{ border: "1px dashed #ffffff", padding: "6px" }} /> :
                                                <div onClick={() => this.MostrasMasTarea(subTares.tareas_id_tarea)} className="prioridad" >T-{IndexS + 1}</div>}
                                            </div>
                                          </Col>
                                        )
                                      }

                                    </Row>
                                  </div>
                                </Container>
                              </div>

                            </div>

                          ) : ""
                      }
                    </div>

                  </Col>
                  <Col md="6">
                    <div className="contanierProyectoAsignados">
                      {
                        DataProyectoMostrarApi.map((proyectoMostrar, IndexPM) =>

                          <div key={IndexPM}>

                            <div className="proyectoBorder prioridad mb-2" style={{ borderBottom: `2px solid ${proyectoMostrar.color}` }} onClick={() => this.CollapseProyecto(IndexPM.toString(), proyectoMostrar.id_proyecto)}>
                              <div className="numeroProyecto">P-{proyectoMostrar.id_proyecto}</div>
                              <div className="nombreProyecto" style={{ background: proyectoMostrar.color }}>{proyectoMostrar.nombre}</div>
                            </div>

                            <Collapse isOpen={this.state.collapseProyecto === IndexPM.toString()}>
                              <Row>
                                {
                                  DataTareasApi.map((tarea, indexT) =>
                                    <Col md="4" key={indexT}>
                                      <div className={ idTareaActivo === tarea.id_tarea ? "containerTareaActivo": "containerTarea" }>
                                        <div className="d-flex justify-content-between headerTarea p-1 prioridad" onClick={() => this.MostrasMasTarea(tarea.id_tarea)}>
                                          <img src={ImgAccesoSS} alt="sigobras" className="imgCircular" width="18%" height="18%" />
                                          <div className="m-0 text-center">{tarea.asunto}</div>
                                          <div style={{ background: tarea.prioridad_color, width: "5px", height: "50%", borderRadius: "50%", padding: "5px", boxShadow: "0 0 2px 2px #a7a7a7" }} />
                                        </div>
                                        <div className="bodyTareaProyecto" style={{ background: proyectoMostrar.color }}>
                                          <img src={`${UrlServer}${tarea.imagen_subordinado[0].imagen}`} alt="sigobras" className="mx-auto d-block imgCircular" width="70%" height="70%" />
                                          <div className="text-center flex-column ">
                                            {
                                              InputEditablePorcent === indexT ?
                                                <input type="number" onBlur={e => this.textPorcentEdit(e, indexT, tarea.id_tarea)} className="inputEditPorcent" autoFocus /> :
                                                <label className="inputCursorText" onClick={() => this.EditPorcentaje(indexT)} >
                                                  {tarea.porcentaje_avance}%</label>
                                            }

                                            <div className="text-uppercase">{tarea.emisor_nombre}</div>
                                          </div>

                                        </div>
                                      </div>
                                    </Col>
                                  )
                                }
                              </Row>
                            </Collapse>
                          </div>

                        )
                      }
                    </div>
                    {
                      PositsFiltrado.comentarios === undefined ? "" :
                        <div className="ContainerComentarios">
                          <div className="SmsComentarios">
                            {
                              PositsFiltrado.comentarios !== undefined ?
                                PositsFiltrado.comentarios.map((comentario, indexC) =>
                                  <div className="media mb-2" key={indexC}>
                                    <img className="align-self-end mr-2 imgCircular" src={`${UrlServer}${comentario.imagen}`} alt={comentario.usuario} width="5%" height="5%" />
                                    <div className="media-body bodyComentarios">
                                      <label> <b className="text-capitalize">{comentario.usuario} </b>{` ${comentario.mensaje}`}</label>
                                      <div className="float-right small">
                                        {`${comentario.hora} ${comentario.fecha}`}
                                      </div>
                                    </div>
                                  </div>
                                ) : "no hay data"
                            }

                          </div>
                          <div className="inputComnentario">
                            <form onSubmit={this.GuardaComentario} autoComplete="off">
                              <input type="text" className="form-control form-control-sm" id="inputComentario" />
                            </form>
                          </div>
                        </div>
                    }

                  </Col>
                </Row>
              </Container>
            </div>

          </Col>
        </Row>

        {/* modal para abrir mas informacion */}

        <Modal isOpen={this.state.modalVerMasTareasUser} toggle={this.ModalVerMasTareas} external={externalCloseBtn} fade={false} size="xl">
          <Row>
            <Col sm="4">
              <div className="ModalContaninerMas">
                hola sadgadksadafdsafdjafd
              </div>
            </Col>
            <Col sm="8">
              <div className="ModalContaninerMas">
                <div className="d-flex">
                  <InputGroup>
                    <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.splitButtonOpen} toggle={this.toggleSplit}>
                      <Button outline>AÑO</Button>
                      <DropdownToggle split outline />
                      <DropdownMenu>
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </InputGroupButtonDropdown>

                    <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.splitButtonOpen} toggle={this.toggleSplit}>
                      <Button outline>MES</Button>
                      <DropdownToggle split outline />
                      <DropdownMenu>
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </InputGroupButtonDropdown>

                    <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.splitButtonOpen} toggle={this.toggleSplit}>
                      <Button outline>ESTADO</Button>
                      <DropdownToggle split outline />
                      <DropdownMenu>
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </InputGroupButtonDropdown>

                    <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.splitButtonOpen} toggle={this.toggleSplit}>
                      <Button outline>PROYECTO</Button>
                      <DropdownToggle split outline />
                      <DropdownMenu>
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </InputGroupButtonDropdown>
                  </InputGroup>
                  <div>
                    <img src="https://www.inmosenna.com/wp-content/uploads/2018/07/avatar-user-teacher-312a499a08079a12-512x512-300x300.png" alt="sigobras" width="30px" height="30px"/>
                  </div>
                  <div className="text-warning d-flex">
                    <MdStar />
                    <MdStar />
                    <MdStar />
                    <MdStar />
                    <MdStarBorder />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Modal>


      </div>
    );
  }
}

export default GestionTareas;

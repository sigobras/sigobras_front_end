import React, { Component } from 'react';
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col, Form, FormGroup, Label, Input, Progress, Collapse, InputGroup, InputGroupAddon, InputGroupText, Modal, CustomInput, UncontrolledButtonDropdown, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
import { MdSend, MdSystemUpdateAlt, MdKeyboardArrowDown, MdKeyboardArrowUp, MdAddCircle, MdGroupAdd, MdAlarmAdd, MdSave, MdClose } from "react-icons/md";
import { GoSignIn, GoSignOut, GoOrganization } from "react-icons/go";
import { DebounceInput } from 'react-debounce-input';

import Picky from "react-picky";
import "react-picky/dist/picky.css";
import "../../../css/GTareas.css"

import { GeraColoresRandom, Extension } from "../Utils/Funciones"
import { UrlServer, Id_Acceso } from "../Utils/ServerUrlConfig"

import DragDrop from "./DragDrop"

// import App from "./demo";
class GestionTareas extends Component {
  constructor(props) {
    super(props);

    this.toggleTabDetalleTarea = this.toggleTabDetalleTarea.bind(this);
    this.AgregaTarea = this.AgregaTarea.bind(this);
    this.porcentCollapse = this.porcentCollapse.bind(this);
    this.incremetaBarraPorcent = this.incremetaBarraPorcent.bind(this);
    this.CierraModalVerTareas = this.CierraModalVerTareas.bind(this);
    this.ModalVerTareas = this.ModalVerTareas.bind(this);
    this.subtareaAdd = this.subtareaAdd.bind(this);
    this.onChangeProyecto = this.onChangeProyecto.bind(this);
    this.onChangePara = this.onChangePara.bind(this);
    this.onChangePersonal = this.onChangePersonal.bind(this);
    this.onChangeImgMetrado = this.onChangeImgMetrado.bind(this);
    this.clearImg = this.clearImg.bind(this);
    // this.SeteaTareasRecibidas = this.SeteaTareasRecibidas.bind(this);
    // this.CollapseFormContainerAddTarea = this.CollapseFormContainerAddTarea.bind(this);
    // this.dropdownRecibidos = this.dropdownRecibidos.bind(this);
    this.CreaProyecto = this.CreaProyecto.bind(this);
    
    
    this.reqTareas = this.reqTareas.bind(this);
    // DRAG DROP
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      DataTareasApi: [],
      PositsFiltrado: [],

      DataProyectoApi: [],
      DataCargosApi: [],
      DataPersonalApi: [],
      DatSubtareaApi: [],

      // captura inputs de envio de datos del formulario
      Para: [],
      proyecto: [],
      asunto: "",
      InputPersonal: [],
      descripcion: "",
      fechaInicio: "",
      duracion: null,
      porcentajeAvance: 0,

      barraPorcentaje: null,
      collapseInputPorcentaje: null,

      activeTabModalTarea: "1",

      modalVerTareas: false,

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
      
    };
  }

  componentDidMount() {

    // llama api de tareas pendientes

    this.reqTareas(Id_Acceso, "/getTareaReceptorPendientes","0")

    // API PROYECTOS---------------------------------------------
    axios.get(`${UrlServer}/getTareaProyectos`)
      .then((res) => {
        // console.log("proyectos", res.data)

        var data = res.data

        this.setState({
          DataProyectoApi: data
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

  toggleTabDetalleTarea(tab) {
    if (this.state.activeTabModalTarea !== tab) {
      this.setState({
        activeTabModalTarea: tab
      });
    }
  }

  AgregaTarea(e) {
    e.preventDefault()

   
    var { Posits, Para, proyecto, file, asunto, descripcion, fechaInicio, duracion, porcentajeAvance, InputPersonal } = this.state

    
    if( Para.length <=0 && InputPersonal.length <=0  ){
        console.log(" no es proyecto")
        return
    }
    var funcionMap = (data) => ([data.id_acceso])
    var Personal = InputPersonal.map(funcionMap);

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
    formData.append('proyectos_id_proyecto', proyecto.id_proyecto);
    formData.append('emisor', Id_Acceso);
    formData.append('receptor', Personal);
    formData.append('archivo', file);
    formData.append('extension', tamanioImagenUrl);
    formData.append('codigo_obra', sessionStorage.getItem("codigoObra"));

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
        console.log("Post tareas", res.data)
        this.setState({
          // ActiveTab: "4",
          Para: [],
          proyecto: [],
          asunto: "",
          InputPersonal: [],
          descripcion: "",
          fechaInicio: "",
        })
        // document.getElementById("descripcion").value = "";
        document.getElementById("formAgregarTarea").reset();

        this.reqTareas(Id_Acceso, "/getTareaEmisorPendientes")
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

  incremetaBarraPorcent(key) {
    console.log("object", key)

    var { Posits, barraPorcentaje } = this.state
    var PositTareas = Posits

    PositTareas[key].porcentajeAvance = Number(barraPorcentaje)

    console.log(PositTareas)

    this.setState({
      Posits: PositTareas,
      collapseInputPorcentaje: null,
    })

  }

  CierraModalVerTareas() {
    this.setState(prevState => ({
      modalVerTareas: !prevState.modalVerTareas
    }));


  }

  ModalVerTareas(id) {
    console.log("id ", id)

    var Tareas = this.state.DataTareasApi

    Tareas = Tareas.filter((tarea) => {
      return tarea.id_tarea === id
    })

    // console.log("Tareas ", Tareas[0])


    this.setState({
      modalVerTareas: !this.state.modalVerTareas
    })
    // consoluto a api de tareas 

    axios.post(`${UrlServer}/getTareaIdTarea`,
      {
        "id_tarea": id
      }
    )
      .then((res) => {
        // console.log("response de tareas full", res.data)
        var dataArmar = Object.assign(Tareas[0], res.data);
        console.log("dataArmar  ", dataArmar)
        this.setState({
          PositsFiltrado: dataArmar,
        })

      })
      .catch((err) => {
        console.error("errorr al obterner datos", err)
      })
    // getTareaIdTarea



    axios.post(`${UrlServer}/getSubTareasPendientes`, {
      "id_tarea": id
    })
      .then((res) => {
        console.log("response de SUBtareas full", res.data)
        this.setState({
          DatSubtareaApi: res.data,
        })
      })
      .catch((err) => {
        console.error("errorr al obterner datos", err)
      })
  }

  subtareaAdd(idTarea) {
    console.log("id tarea", idTarea)

    axios.post(`${UrlServer}/postSubTarea`, {
      "asunto": this.state.inputSubtarea,
      "tareas_id_tarea": idTarea
    })
    .then((res) => {
      console.log("data de subtarea ", res)
      var dataRes = this.state.DatSubtareaApi
      dataRes.unshift(
        res.data
      )
      this.setState({
        DatSubtareaApi: dataRes,
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
    console.log('archivo', inputValueImg);

    Extension(inputValueImg.name)

    if (Extension(inputValueImg.name) === ".jpeg" || Extension(inputValueImg.name) === ".png" || Extension(inputValueImg.name) === ".jpg" || Extension(inputValueImg.name) === ".dwg" || Extension(inputValueImg.name) === ".xls" || Extension(inputValueImg.name) === ".xlsx") {
      var url = URL.createObjectURL(inputValueImg)
      console.log("url", url);

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

  // REQUESTS AL API ---------------------------------------------

  reqTareas(id_acceso, ruta, index) {
    this.setState({ActiveTab: index})
    axios.post(`${UrlServer}${ruta}`,
      {
        "id_acceso": id_acceso
      }
    )
      .then((res) => {
        console.log("response tareas pendientes ", res.data)
        this.setState({
          DataTareasApi: res.data
        })
      })

      .catch((err) => {
        console.log("error al consultar api ", err)
      })
  }

  // drag funciones==============================================================================

  onDragStart(ev, id) {
    console.log('moviendo :', id);
    ev.dataTransfer.setData("id", id);
  }
  onDragOver(ev) {
    ev.preventDefault();

    // console.log("mover over ", ev)
  }

  onDrop(ev, cat) {
    console.log("onDrop ", cat)
    let id = ev.dataTransfer.getData("id");

    console.log("id ondrop ", id)
    // let tasks = this.state.tasks.filter((task)=> {
    //     if (task.name == id) {
    //       task.category = cat;
    //     }
    //     return task;
    //   });

    // this.setState({
    //   ...this.state,
    //   tasks
    // });
  }

  render() {
    const { DataProyectoApi, DataCargosApi, DataPersonalApi, DataTareasApi, PositsFiltrado, DatSubtareaApi, proyecto, Para, InputPersonal, SMSinputTypeImg, CollapseFormContainerAddTarea, ActiveTab, condicionInputCollapse } = this.state

    return (
      <div>

      {/* <DragDrop /> */}
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
                  proyecto.nombre === "RECORDATORIO" || proyecto.nombre ==="SUB-TAREA"?"":
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
                <Input type="date" id="fechaInicio" required onChange={e => this.setState({ fechaInicio: e.target.value })} />

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
                <NavLink className={classnames({ active: ActiveTab === "0" })} onClick={() => this.reqTareas(Id_Acceso, "/getTareaEmisorPendientes", "0")}>
                {/* <NavLink className={classnames({ active: ActiveTab === "0" })} onClick={() => this.reqTareas(Id_Acceso, "/getTareaReceptorPendientes", "0")}> */}
                  PENDIENTES
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "1" })} onClick={() => this.reqTareas(Id_Acceso, "/getTareaReceptorProgreso","1")}>
                  PROGRESO
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "2" })} onClick={() => this.reqTareas(Id_Acceso, "/getTareaReceptorTerminadas","2")}>
                  CONCLUIDOS
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "3" })} onClick={() => this.reqTareas(Id_Acceso, "/getTareaReceptorTerminadas","3")}>
                  VENCIDOS
                </NavLink>
              </NavItem>


              <NavItem>
                <NavLink className={classnames({ "bg-info": ActiveTab === "4" })} onClick={() => this.reqTareas(Id_Acceso, "/getTareaReceptorTerminadas","4")} style={{ marginTop: "-3px"}}>
                  <MdAlarmAdd size={ 15 } />
                </NavLink>
              </NavItem>

            </Nav>

            <div className="p-2">
              <Container className="pr-4">
                <Row>
                  <Col md="3">
                    <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "ejecucion") }}>
                      <Row>
                     
                        {
                          DatSubtareaApi !== undefined ?
                          DatSubtareaApi.map((subtarea, iS) =>
                          <Col md="6 mb-2" key={ iS }>
                            <div className="containerTarea" onDragStart={(e) => this.onDragStart(e, subtarea.id_subTarea )} draggable>
                              <div className="d-flex justify-content-between headerTarea p-1">
                                <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className="imgHeader" />

                                <label className="m-0 h5">{`T-${iS+1}` }</label>

                                <div style={{ background: "#ff9509", width: "5px", height: "50%", borderRadius: "50%", padding: "5px", float: "right" }} />
                              </div>
                              <div className="bodyTarea text-capitalize">
                                { subtarea.asunto }
                              </div>
                            </div>

                          </Col>
                          ): ""
                        }


                      </Row>
                    </div>

                  </Col>
                  <Col md="3" className="brLeft brRight" >
                    <div className="containerTarea">
                      <div className="d-flex justify-content-between headerTarea p-1">
                        <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className="imgHeader" />

                        <label className="m-0 h6 text-center"> { PositsFiltrado.asunto }</label>

                        <div style={{ background: "#ff9509", width: "5px", height: "50%", borderRadius: "50%", padding: "10px" }} />


                      </div>
                      {/* <label className="nombreProyectoP"></label> */}
                      <div className="bodyTareaProyecto">
                        <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className=" mx-auto d-block" width="65%" />
                        <div className="text-center flex-column ">
                          <div>90%</div>
                          <div>ANGERMAN</div>
                        </div>

                      </div>
                      <div className="headerTarea">
                        Por: GERENTE
                      </div>
                    </div>
                    <div className="text-center">
                      <b>Descripción: </b>
                      { PositsFiltrado.descripcion }
                      </div>

                    <div className="text-center text-warning">
                      <b> Se tiene { `${ PositsFiltrado.diasTotal }` } dias para cumplir con la meta y te <i> quedan {`${ PositsFiltrado.diasTotal - PositsFiltrado.diasTranscurridos  }`}</i>  </b>
                    </div>

                    <div className="text-center text-primary">
                      <b> JEFES DE AREA  </b>
                    </div>

                    <div className="media">
                      <div className="text-primary">
                        <img className="mr-3 img-fluid " src="https://www.scripturaengage.com/wp-content/uploads/2017/05/Profile-Picture-Pauline-Suy-circle-ScripturaEngage.png" alt="perfil" width="45" /><br />
                        <label className="text-center" style={{ fontSize: "0.5rem" }}><b>Sub Gerente</b></label>
                      </div>
                      <div className="media-body">
                        <Container>
                          <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "ejecucion") }}>

                            <Row>
                              {
                                DatSubtareaApi !== undefined ?
                                DatSubtareaApi.map((subtarea, iS) =>
                                  <Col md="2" className="m-1 p-0 bg-info" key={  iS }>
                                    <div className="text-center flex-column ">
                                      <div>T-{ iS+1 }</div>
                                    </div>
                                  </Col>
                                ):""
                              }
                            
                            </Row>
                          </div>
                        </Container>
                      </div>
                    </div>

                    <div className="media">
                      <div className="text-primary">
                        <img className="mr-3 img-fluid " src="https://i2.wp.com/www.coachcarson.com/wp-content/uploads/2018/09/Chad-Profile-pic-circle.png" alt="perfil" width="45" /><br />
                        <label className="text-center" style={{ fontSize: "0.5rem" }}><b>Jefe Supervisión</b></label>
                      </div>
                      <div className="media-body">
                        <div>
                          <div className="text-center font-weight-bold">
                            Llegó al limite de tareas asignadas
                            </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">

                    <div className="proyectoBorder">
                      <div className="numeroProyecto"> P-1</div>
                      <div className="nombreProyecto">CONTROL DOCUMENTARIO</div>
                    </div>
                    <Row>
                      {
                        DataTareasApi.map((tarea, indexT)=>
                          <Col md="4" key={ indexT }>
                            <div className="containerTarea m-2">
                              <div className="d-flex justify-content-between headerTarea p-1 prioridad" onClick={()=>this.ModalVerTareas(tarea.id_tarea) }>
                                <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className="imgHeader" />
                                <label className="m-0 text-center">{ tarea.asunto }</label>
                                <div style={{ background: "#ff9509", width: "5px", height: "50%", borderRadius: "50%", padding: "5px" }} />
                              </div>
                              <div className="bodyTareaProyecto">
                                <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className=" mx-auto d-block" width="65%" />
                                <div className="text-center flex-column ">
                                  <div>{ tarea.porcentaje_avance }%</div>
                                  <div>ANGERMAN</div>
                                </div>

                              </div>
                            </div>
                          </Col>
                        )
                      }
                      

                    </Row>

                  </Col>
                </Row>
              </Container>
            </div>

          </Col>
        </Row>

        <Modal isOpen={this.state.modalVerTareas} fade={false} toggle={this.CierraModalVerTareas} size="sm" >

          <div className="p-2">
            <div className="text-center">
              <label className="proyecto">{PositsFiltrado.proyecto_nombre}</label>
              <br />
              <label className="asunto"> {PositsFiltrado.asunto}</label>

            </div>
            <div className="tarea pb-1">
              <label>{PositsFiltrado.descripcion}</label>
            </div>
              <h4>{ `${PositsFiltrado.diasTranscurridos * 100 / PositsFiltrado.diasTotal }` }</h4>
            {/* <label className="fecha">{ PositsFiltrado.fechaInicio }</label> */}
            <Progress value={  `${(PositsFiltrado.diasTranscurridos * 100 / PositsFiltrado.diasTotal).toFixed(2) }` }  className="mt-2"> {`${PositsFiltrado.diasTranscurridos} de ${PositsFiltrado.diasTotal}`} </Progress>
          </div>


          <Nav tabs>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTabModalTarea === '1' })} onClick={() => { this.toggleTabDetalleTarea('1'); }} >
                Pendiente
                </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTabModalTarea === '2' })} onClick={() => { this.toggleTabDetalleTarea('2'); }} >
                Conluido
                </NavLink>
            </NavItem>
            <div className="prioridad verInput" onClick={() => this.setState({ CollapseInputAddTarea: !this.state.CollapseInputAddTarea })}>{this.state.CollapseInputAddTarea === true ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}</div>
          </Nav>

          <TabContent activeTab={this.state.activeTabModalTarea}>
            <TabPane tabId="1">
              <div className="subtareas">

                <Collapse isOpen={this.state.CollapseInputAddTarea === true}>
                  <InputGroup size="sm" className="mb-2">
                    {/* <Input type="text" value={ this.state.inputSubtarea } onBlur={e => this.setState({inputSubtarea: e.target.value})}/>                 */}
                    <DebounceInput value={this.state.inputSubtarea} debounceTimeout={50} onChange={e => this.setState({ inputSubtarea: e.target.value })} className="form-control" />

                    <InputGroupAddon addonType="prepend" color="success">
                      <InputGroupText className="prioridad" onClick={() => this.subtareaAdd(PositsFiltrado.id_tarea)}>
                        <MdSend />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Collapse>


                {
                  DatSubtareaApi !== undefined ?
                    DatSubtareaApi.map((subtarea, iS) =>
                      <div key={iS} className="actividadSubtarea" style={{ background: subtarea.color }}>{subtarea.asunto}

                        <div className="checkTarea">
                          <CustomInput type="checkbox" id={`confirmTarea${iS}`} />
                        </div>
                      </div>
                    )
                    : "no hay tareas que mostrar"
                }
              </div>
            </TabPane>

            <TabPane tabId="2">

            </TabPane>
          </TabContent>
        </Modal>

      </div>
    );
  }
}

export default GestionTareas;

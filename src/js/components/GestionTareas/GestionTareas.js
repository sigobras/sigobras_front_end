import React, { Component } from 'react';
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col, Form, FormGroup, Label, Input, Progress, Collapse, InputGroup, InputGroupAddon, InputGroupText, Modal, CustomInput } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
import { MdSend, MdSystemUpdateAlt, MdKeyboardArrowDown, MdKeyboardArrowUp, MdAddCircle, MdGroupAdd, MdAlarmAdd, MdSave, MdClose } from "react-icons/md";
import { GoSignIn, GoSignOut, GoOrganization } from "react-icons/go";
import { DebounceInput } from 'react-debounce-input';

import Picky from "react-picky";
import "react-picky/dist/picky.css";
import "../../../css/GTareas.css"

import { GeraColoresRandom, Extension } from "../Utils/Funciones"
import { UrlServer, Id_Acceso, Id_Obra } from "../Utils/ServerUrlConfig"

import DragDrop from "./DragDrop"

// import App from "./demo";
class GestionTareas extends Component {
  constructor(props) {
    super(props);

    this.toggleTabDetalleTarea = this.toggleTabDetalleTarea.bind(this);
    this.AgregaTarea = this.AgregaTarea.bind(this);
    this.porcentCollapse = this.porcentCollapse.bind(this);
    this.incremetaBarraPorcent = this.incremetaBarraPorcent.bind(this);
    this.MostrasMasTarea = this.MostrasMasTarea.bind(this);
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
    this.CollapseProyecto = this.CollapseProyecto.bind(this);
    
    
    
    this.reqProyectos = this.reqProyectos.bind(this);
    this.reqTareasRecibidas = this.reqTareasRecibidas.bind(this);
    this.reqTareasEmitidos = this.reqTareasEmitidos.bind(this);

    this.reqSubordinados = this.reqSubordinados.bind(this);
    // DRAG DROP
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      DataTareasApi: [],
      PositsFiltrado: [],
      DataTareasEmitidosApi: [],

      DataProyectoApi: [],
      DataProyectoMostrarApi:[],
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
      collapseProyecto:"0",
      // datos desde hasta para pendientes progreso .....
      Inicio:"",
      Fin:""
    };
  }

  componentDidMount() {

    document.title="GESTIÓN DE TAREAS 🎁"
    // llama api de tareas pendientes

    this.reqProyectos(Id_Acceso, "0", "0", "0")
    this.reqTareasEmitidos(Id_Acceso, "0", "0")

    // API DE SUBORDINADOS
    this.reqSubordinados( Id_Acceso )
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

    // if( Para.length <=0 && InputPersonal.length <=0  ){
    //     console.log(" no es proyecto")
    //     return
    // }
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
    formData.append('codigo_obra', Id_Obra );
    formData.append('tareas_id_tarea', "");

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

        this.reqProyectos(Id_Acceso,"0","0","0","0")
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

  CollapseProyecto( index, IdProyecto ){
    console.log("index ", index)
    this.setState(({ collapseProyecto: this.state.collapseProyecto === index ? null: index }));
    if (this.state.collapseProyecto !== index) {
      this.reqTareasRecibidas(Id_Acceso, this.state.Inicio, this.state.Fin, IdProyecto)
      return
    }
    this.setState({PositsFiltrado:[] })
  }

  MostrasMasTarea( idTarea ){
    
    console.log("id", idTarea)


    // var Tareas = this.state.DataTareasApi
    // console.log("DataTareasApi_______ ", Tareas)

    // Tareas = Tareas.filter((tarea) => {
    //   return tarea.id_tarea === idTarea
    // })
    
    // console.log("Tareas>>>>>>>_______ ", Tareas)

    axios.post(`${UrlServer}/getTareaIdTarea`,
      {
        "id_tarea":idTarea
      }
    )
    .then((res)=>{
      console.log("data mas ver mas tarea ", res.data)
      // var dataArmar = Object.assign(Tareas[0], res.data);

      // console.log("dataArmar  ", dataArmar)

      this.setState({
        PositsFiltrado: res.data
      })

    })
    .catch((err)=>{
      console.error("algo salió mal al enviar los datos ", err)
    })
  }
  // REQUESTS AL API ---------------------------------------------

  reqProyectos(id_acceso, inicio, fin, index) {

    this.setState({ 
      ActiveTab: index,
      Inicio:inicio,
      Fin:fin
    })
    this.reqTareasEmitidos(id_acceso, inicio, fin)

    axios.post(`${UrlServer}/getTareasReceptorProyectos`,
      {
        "id_acceso": id_acceso,
        "inicio":inicio,
        "fin":fin
      }
    )
      .then((res) => {
        console.log("response proyectos ", res.data )
        this.setState({
          DataProyectoMostrarApi: res.data
        })
        this.reqTareasRecibidas( id_acceso, inicio, fin , res.data[0].id_proyecto )
      })

      .catch((err) => {
        console.log("error al consultar api ", err)
      })
  }

  reqTareasRecibidas(id_acceso, inicio, fin, IdProyecto){
    axios.post(`${UrlServer}/getTareasReceptor`,
      {
        "id_acceso":id_acceso,
        "inicio":inicio,
        "fin":fin,
        "id_proyecto":IdProyecto
      }
    )
      .then((res) => {
        console.log("response tareas api ", res.data )
        this.setState({
          DataTareasApi: res.data
        })
      })

      .catch((err) => {
        console.log("error al consultar api ", err)
      })
  }

  reqTareasEmitidos(Id_Acceso, inicio, fin){
    axios.post(`${UrlServer}/getTareasEmisor`,
      {
        "id_acceso":Id_Acceso,
        "inicio":inicio,
        "fin":fin
      }
    )
      .then((res) => {
        console.log("response emisor api ", res.data )
        this.setState({
          DataTareasEmitidosApi: res.data
        })
      })

      .catch((err) => {
        console.log("error al consultar api ", err)
      })
  }

  reqSubordinados( IdAcceso ){

    axios.post(`${UrlServer}/getTareaSubordinados`,
      {
        "id_acceso": IdAcceso
      }
    )
    .then((res) => {
      // console.log("response de subordinados", res.data)
      var dataRes = res.data
      for (let j = 0; j < dataRes.length; j++) {
        var tamanioSubor = dataRes[j].subordinadosTareas.length
        var AnadirElementos = 8 - tamanioSubor
        
        for (let k = 0; k < AnadirElementos; k++) {

          dataRes[j].subordinadosTareas.push(
            {
              id_proyecto: null,
              prioridad_color: "",
              tareas_id_tarea: ""
            }
          )
        }
          // Object.defineProperty( NewData[j].subordinadosTareas[k], "id_proyecto", { value:" dataRes[j].subordinadosTareas[k].id_proyecto" })
      }      
      this.setState({
        DatSubordinadospi: dataRes,
      })

    })
    .catch((err) => {
      console.error("errorr al obterner datos", err)
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

  onDrop(ev, cat, idAccesso ) {
    console.log("onDrop ", cat, "idAccesso ", idAccesso)
    let id = ev.dataTransfer.getData("id");

    console.log("id ondrop ", id)

    if (cat === "completado") {
       axios.post(`${UrlServer}/postTareaReceptores`,
        [
          [id, idAccesso]
        ]
      )
      .then((res)=>{
        console.log("response asigna tarea", res.data )
      })
      .catch((err)=>{
        console.log("error al enviar datos ", err)
      })
    }
     

    let tasks = this.state.tasks.filter((task)=> {
        if (task.name == id) {
          task.category = cat;
        }
        return task;
      });

  }

  render() {
    const { DataProyectoApi, DataProyectoMostrarApi, DataCargosApi, DataPersonalApi, DataTareasApi, DataTareasEmitidosApi, PositsFiltrado, DatSubordinadospi, proyecto, Para, InputPersonal, SMSinputTypeImg, CollapseFormContainerAddTarea, ActiveTab, condicionInputCollapse } = this.state

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
                {/* <NavLink className={classnames({ active: ActiveTab === "0" })} onClick={() => this.reqProyectos(Id_Acceso, "/getTareaEmisorPendientes", "0")}> */}
                <NavLink className={classnames({ active: ActiveTab === "0" })} onClick={() => this.reqProyectos(Id_Acceso, "0", "0", "0")}>
                  PENDIENTES
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "1" })} onClick={() => this.reqProyectos(Id_Acceso, "1", "99","1")}>
                  PROGRESO
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "2" })} onClick={() => this.reqProyectos(Id_Acceso, "100", "100", "2")}>
                  CONCLUIDOS
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink className={classnames({ active: ActiveTab === "3" })} onClick={() => this.reqProyectos(Id_Acceso, "/getTareaReceptorTerminadas","3")}>
                  VENCIDOS
                </NavLink>
              </NavItem>


              <NavItem>
                <NavLink className={classnames({ "bg-info": ActiveTab === "4" })} onClick={() => this.reqProyectos(Id_Acceso, "/getTareaReceptorTerminadas","4")} style={{ marginTop: "-3px"}}>
                  <MdAlarmAdd size={ 15 } />
                </NavLink>
              </NavItem>

            </Nav>

            <div className="p-2">
              <Container fluid className="pr-4">
                <Row>
                  <Col md="3">
                    <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "ejecucion", "nada") }}>
                      <Row>
                     
                        {
                          DataTareasEmitidosApi.map((TareasEmit, iS) =>
                          <Col md="6 mb-2" key={ iS }>
                            <div className="containerTarea" onDragStart={(e) => this.onDragStart(e, TareasEmit.id_tarea )} draggable>
                              <div className="d-flex justify-content-between headerTarea p-1">
                                <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className="imgCircular" width="20%" height="20%" />

                                <label className="m-0 h5">{`T-${iS+1}` }</label>

                                <div style={{ background: TareasEmit.prioridad_color, width: "5px", height: "50%", borderRadius: "50%", padding: "5px", float: "right" }} />
                              </div>
                              <div className="bodyTarea text-capitalize">
                                { TareasEmit.asunto }
                                <br />
                                { TareasEmit.proyecto_nombre}
                              </div>
                            </div>

                          </Col>
                          )
                        }


                      </Row>
                    </div>

                  </Col>
                  <Col md="3" className="brLeft brRight">

                    {
                      PositsFiltrado.length === 0 ? "":
                        <div>
                          <div className="containerTarea">
                            <div className="d-flex justify-content-between headerTarea p-1">
                              <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className="imgCircular" width="18%" height="18%" />

                              <label className="m-0 h6 text-center"> { PositsFiltrado.asunto }</label>

                              <div style={{ background: PositsFiltrado.prioridad_color, width: "5px", height: "50%", borderRadius: "50%", padding: "10px" }} />

                            </div>
                            
                            <div className="bodyTareaProyecto">
                              <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className=" mx-auto d-block" width="65%" />
                              <div className="text-center flex-column ">
                                <div>{ `${ PositsFiltrado.porcentaje_avance} %` }</div>
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
                        </div>
                    }
                      <div className="fondoSubord">
                        <div className="text-center text-primary">
                          <b> JEFES DE AREA  </b>
                        </div>
                        {
                          DatSubordinadospi !== undefined ?
                          DatSubordinadospi.map((subtarea, iS) =>
                            <div className="media mb-2" key={  iS }>
                              <div className="" style={{width: "12%"}}>
                                <img className="imgCircular" src={`${UrlServer}${subtarea.subordinado_imagen }`} alt={ subtarea.subordinado_imagenAlt } width="30px" height="30px"/><br />
                                <div className="d-flex flex-column text-center" style={{ fontSize: "0.5rem" }}>
                                  <div>{ subtarea.usuario_nombre }</div>
                                  
                                </div>
                              </div>

                              <div className="media-body">


                              <div className="text-warning  ml-2 text-capitalize">{ subtarea.cargo_nombre }</div>
                                <Container fluid>
                                  <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "completado", subtarea.id_acceso ) }}>

                                    <Row>
                                      {
                                        subtarea.subordinadosTareas.map((subTares, IndexS)=>
                                          <Col md="1" className="m-1 p-0" style={{ background: subTares.prioridad_color}} key={ IndexS } >
                                            <div className="text-center flex-column " style={{ fontSize: "0.6rem" }}>
                                              { subTares.id_proyecto === null ? 
                                                <div style={{ border:"1px dashed #ffffff", padding: "6px" }}/>: 
                                                <div  onClick={()=>this.MostrasMasTarea( subTares.tareas_id_tarea ) } className="prioridad" >T-{ IndexS+1 }</div>}
                                            </div>
                                          </Col>
                                        )
                                      }
                                    
                                    </Row>
                                  </div>
                                </Container>
                              </div>
                              
                            </div>
                            
                            ):"" 
                        }
                      </div>
                      
                  </Col>
                  <Col md="6">
                    {
                      DataProyectoMostrarApi.map((proyectoMostrar , IndexPM)=>
                    
                        <div key={ IndexPM }>
                          <div className="proyectoBorder prioridad" onClick={ ()=> this.CollapseProyecto( IndexPM.toString(),  proyectoMostrar.id_proyecto ) }>
                            <div className="numeroProyecto" style={{background: proyectoMostrar.color }}>P-{ proyectoMostrar.id_proyecto }</div>
                            <div className="nombreProyecto">{ proyectoMostrar.nombre }</div>
                          </div>

                          <Collapse isOpen={this.state.collapseProyecto === IndexPM.toString()}>
                            <Row>
                              {
                                DataTareasApi.map((tarea, indexT)=>
                                  <Col md="4" key={ indexT }>
                                    <div className="containerTarea m-2">
                                      <div className="d-flex justify-content-between headerTarea p-1 prioridad" onClick={()=>this.MostrasMasTarea(tarea.id_tarea) }>
                                        <img src="https://www.skylightsearch.co.uk/wp-content/uploads/2017/01/Hadie-profile-pic-circle-1.png" alt="sigobras" className="imgCircular"  width="18%" height="18%"  />
                                        <div className="m-0 text-center">{ tarea.asunto }</div>
                                        <div style={{ background: tarea.prioridad_color , width: "5px", height: "50%", borderRadius: "50%", padding: "5px", boxShadow: "0 0 2px 2px #a7a7a7" }} />
                                      </div>
                                      <div className="bodyTareaProyecto">
                                        <img src={ `${UrlServer}${tarea.imagen_subordinado[0].imagen}`  } alt="sigobras" className=" mx-auto d-block imgCircular" width="70%" height="70%" />
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
                          </Collapse>
                        </div>
                      )
                    }
                  </Col>
                </Row>
              </Container>
            </div>

          </Col>
        </Row>

      </div>
    );
  }
}

export default GestionTareas;

import React, { Component } from 'react';
import {  TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col,  Form, FormGroup, Label, Input, Progress, Collapse, InputGroup, InputGroupAddon, InputGroupText, Modal, CustomInput, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import axios from 'axios';
import classnames from 'classnames';
import { MdSend, MdSystemUpdateAlt, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import Pin from "../../../images/pin.png"
import { DebounceInput } from 'react-debounce-input';
import "../../../css/GTareas.css"

import { GeraColoresRandom } from "../Utils/Funciones"
import { UrlServer } from "../Utils/ServerUrlConfig"

class GestionTareas extends Component {
  constructor(props) {
    super(props);
    
    this.toggleTabPosit = this.toggleTabPosit.bind(this);
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
    this.SeteaTareasRecibidas = this.SeteaTareasRecibidas.bind(this);
    this.CollapseFormContainerAddTarea = this.CollapseFormContainerAddTarea.bind(this);

    this.state = {
      Posits:[],
      PositsFiltrado:[],

      DataProyectoApi: [],
      DataCargosApi:[],
      DataPersonalApi:[],

      // captura inputs de envio de datos del formulario
      Para:"",
      proyecto:null,
      asunto:"",
      InputPersonal:null,
      descripcion:"",
      fechaInicio:"",
      duracion:null,
      porcentajeAvance:0,

      barraPorcentaje:null,
      collapseInputPorcentaje:null,



      activeTab: '1',
      activeTabModalTarea:"1",
      
      modalVerTareas: false,

      // sub tareas
      inputSubtarea:"",

      CollapseInputAddTarea:false,
      // capturar imagen

      file: null,
      UrlImagen:"",
      SMSinputTypeImg:false,

      CollapseFormContainerAddTarea:false
    };
  }

  componentDidMount(){
    var Posit = []
    for (let i = 1; i < 20; i++) {
     Posit.push(
       {
         "id":i,
         "proyecto":"INFORME OCTUBRE " + i,
         "asunto":"Valorizaciones entregar urgente,",
         "tarea":"coregir valorizaciones desde el informe 1 ",
         "fechaInicio":"12/01/2019",
         "prioridad":"urgente",
         "duracion":5,
         "porcentajeAvance":(i+ 3) * 4 ,
         "SubTareas":[

         ]
       }
     ) 
    }

    this.setState({
      Posits:Posit,
    })
    // console.log(Posit)

    // API PROYECTOS---------------------------------------------
    axios.get(`${UrlServer}/getTareaProyectos`)
    .then((res) => {
      // console.log("proyectos", res.data)

      var data = res.data 
      var DataProyectos = []
      data.map((proyecto)=>{
        DataProyectos.push(
          {  
            valor : proyecto.id_proyecto,
            label : proyecto.nombre 
          } 
        )
      })
      this.setState({
        DataProyectoApi:DataProyectos
      })
    })
    .catch((err) => {
      console.log("errores al consumir api", err)
    });

    
    // CARGOS API---------------------------------------------
    axios.post(`${UrlServer}/getTareaCargos`, {
        id_acceso:sessionStorage.getItem("idacceso")
    })
    .then((res)=>{
      // console.log("datos de cargos ", res)

      var DataCargos = res.data
      var Cargo = []
      DataCargos.map((cargo)=>{
        Cargo.push(
          {  
            valor : cargo.id_Cargo,
            label : cargo.nombre 
          } 
        )
      })

      this.setState({
        DataCargosApi:Cargo
      })
    })
    .catch((err)=>{
      console.log("error al conectar al api", err)
    })
  }

  toggleTabPosit(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleTabDetalleTarea(tab) {
    if (this.state.activeTabModalTarea !== tab) {
      this.setState({
        activeTabModalTarea: tab
      });
    }
  }

  AgregaTarea(e){
    e.preventDefault()
    var { Posits, Para, proyecto, file, asunto, descripcion, fechaInicio, duracion, porcentajeAvance, InputPersonal } = this.state

    var TuFecha = new Date(fechaInicio);
  
    //dias a sumar
    var dias = Number(duracion) +1 ;
    
    //nueva fecha sumada
    TuFecha.setDate(TuFecha.getDate() + dias);
    //formato de salida para la fecha
    var resultado = TuFecha.getFullYear()+ '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate() ;
    console.log("resultado ",  resultado, "fechaInicio", fechaInicio)

      const formData = new FormData();
      formData.append('asunto', asunto);
      formData.append('descripcion', descripcion);
      formData.append('fecha_inicial', fechaInicio);
      formData.append('fecha_final', resultado);
      formData.append('proyectos_id_proyecto', proyecto);
      formData.append('emisor', sessionStorage.getItem("idacceso"));
      formData.append('receptor', InputPersonal );
      formData.append('archivo', file);
      formData.append('extension', "");
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
    .then((res)=>{
      console.log("Post tareas", res)
    })
    .catch((err)=>{
      console.error("datos de tarea", err);
    })
    
  }

  porcentCollapse(index){
    this.setState(
        { 
          collapseInputPorcentaje: this.state.collapseInputPorcentaje === index ? null : index,
        }
    );
  }

  incremetaBarraPorcent(key){
    console.log("object", key)

    var { Posits, barraPorcentaje } = this.state
    var PositTareas = Posits

    PositTareas[key].porcentajeAvance = Number(barraPorcentaje)

    console.log( PositTareas )

    this.setState({
      Posits: PositTareas,
      collapseInputPorcentaje:null,
    })

  }

  CierraModalVerTareas() {
    this.setState(prevState => ({
      modalVerTareas: !prevState.modalVerTareas
    }));


  }

  ModalVerTareas(id){
  var Tareas = this.state.Posits
    Tareas = Tareas.filter((tarea)=>{
      return tarea.id === id
    })

    // console.log("tareaaa0", Tareas[0])
    

    console.log("collapseInputPorcentaje" , this.state.collapseInputPorcentaje, "dvfgssdfsdkfgsdkfgdsk", this.state.modalVerTareas)

    

    this.setState({
      PositsFiltrado:Tareas[0],
      modalVerTareas: !this.state.modalVerTareas
    })
    
    // if( this.state.collapseInputPorcentaje !== null ){
    //   this.setState({
    //     // PositsFiltrado:Tareas[0],
    //     modalVerTareas: !this.state.modalVerTareas
    //   })
    
    // }
  }

  subtareaAdd(){

    var tareaPrincipal = this.state.Posits 

    tareaPrincipal[0].SubTareas.push(
      {
        subtarea: this.state.inputSubtarea,
        color: GeraColoresRandom(),

      }
    )
    
    console.log("tarea ", tareaPrincipal);

    this.setState({
      Posits:tareaPrincipal,
    })
    
  }

  // captura inputs 
  onChangeProyecto(value){
    console.log("value", value);

    this.setState({ proyecto: value.valor})
  }

  onChangePara(value){
    this.setState({
      Para:value.valor
    })

    axios.post(`${UrlServer}/getTareaUsuariosPorCargo`,
    {
      "id_acceso":sessionStorage.getItem("idacceso"),
      "id_Cargo":value.valor
    })
    .then((res)=>{
      console.log("data Usuarios", res)

      var data = res.data 
      var Personal = []
      data.map((personal)=>{
        Personal.push(
          {  
            valor : personal.id_acceso,
            label : `${personal.nombre } - DNI ${ personal.dni }` 
          } 
        )
      })

      this.setState({ DataPersonalApi:Personal})

    })
    .catch((err)=>{
      console.error("ocurrió un error en el reques de Usuarios", err);
    })
  }

  onChangePersonal(valor){
    this.setState({ InputPersonal: valor.valor})
  }

  onChangeImgMetrado(e) {

    var inputValueImg = e.target.files[0]
    console.log('archivo', inputValueImg);

   if( inputValueImg.type === "image/jpeg" || inputValueImg.type === "image/png" || inputValueImg.type === "image/jpg" || inputValueImg.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  ){
       var url = URL.createObjectURL(inputValueImg)
       console.log("url", url);
       
       this.setState({ 
         file: inputValueImg,
         UrlImagen:url,
         SMSinputTypeImg:false
       });
       return
     }

     this.setState({
       SMSinputTypeImg:true,
       UrlImagen:"",
       file:null
     })
  }

  clearImg(){
    // limpia valores por si los tiene

    this.setState({
      UrlImagen:"",
      file:null,
    }) 
    document.getElementById("myImage").value = "";
  }

  SeteaTareasRecibidas(){

  }

  CollapseFormContainerAddTarea(){
    // this.setState({})
  }

  render() {
    const { DataProyectoApi, DataCargosApi, DataPersonalApi, Posits, PositsFiltrado, proyecto, Para, InputPersonal, SMSinputTypeImg, CollapseFormContainerAddTarea } = this.state
    
    return (
      <div>
      { console.log("dghjkl", CollapseFormContainerAddTarea )}
        <Row>
            <div className="formPositContainer">
              <div className="collapseIconFromPosit prioridad" onClick={()=> this.setState({CollapseFormContainerAddTarea: !this.state.CollapseFormContainerAddTarea})}>
                <span >d</span>
              </div>
              <div className={ CollapseFormContainerAddTarea === true ? "widthFormPositContent": "widthFormPositContentCierra" }>
                <div className="h6 text-center">ASIGNAR NUEVA TAREA </div>
                <Form onSubmit={ this.AgregaTarea }>
                  <FormGroup>
                    <Label >PROYECTO: { proyecto } </Label>
                    <Select
                      // value={ proyecto }
                      onChange={ this.onChangeProyecto }
                      options={ DataProyectoApi }
                      placeholder="Seleccione"
                    />
                
                    <Label for="A">PARA: { Para }</Label>
                    <Select
                      onChange={ this.onChangePara }
                      options={ DataCargosApi }
                      placeholder="Seleccione"
                    />


                    <Label for="A">PERSONAL: { InputPersonal }</Label>
                    <Select
                      onChange={ this.onChangePersonal }
                      options={ DataPersonalApi }
                      placeholder="Seleccione"
                    />
                  
                    <Label for="asunto">TAREA / ASUNTO :</Label>
                    <DebounceInput cols="40" rows="1" required element="textarea" minLength={0} debounceTimeout={300} onChange={e => this.setState({asunto: e.target.value})} className="form-control" />                

                    <Label for="tarea">DESCRIPCIÓN : </Label>
                    <DebounceInput cols="40" rows="1" required element="textarea" minLength={0} debounceTimeout={300} onChange={e => this.setState({descripcion: e.target.value})} className="form-control" />                

                    <Label for="fechaInicio">INICIO : </Label>
                    <Input type="date" id="fechaInicio" required onChange={ e => this.setState({fechaInicio: e.target.value})}/>

                    <Label for="duracion">DURACIÓN: </Label>
                    <Input type="number" onChange={ e => this.setState({duracion: e.target.value})} required />

                    {
                        this.state.UrlImagen.length <= 0 
                        ?"":
                        <div className="imgDelete">
                          <button className="imgBtn" onClick={()=>this.clearImg()}>X</button>
                          <img src={ this.state.UrlImagen } alt="imagen " className="img-fluid mb-2" />
                        </div>
                      }
                      <div className="texto-rojo mb-0"> <b> { SMSinputTypeImg === true ? "Formatos soportados PNG, JPEG, JPG":"" }</b></div> 

                      <div className="custom-file">
                        <input type="file" className="custom-file-input" onChange={ this.onChangeImgMetrado } id="myImage"/>
                        <label className="custom-file-label" htmlFor="customFile"> { this.state.file !== null? this.state.file.name: "SELECCIONE"}</label>
                      
                      </div>
                  </FormGroup>

                  <Button type="submit"> GUARDAR </Button>
                </Form>
              </div>
            </div>

          <Col>
            <Nav tabs>
              <NavItem>
                <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTabPosit('1'); }} >
                  <MdSystemUpdateAlt /> Recibidos <span className="badge badge-light">{ Posits.length } </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTabPosit('2'); }}>
                  <MdSend /> Enviados
                </NavLink>
              </NavItem>
            </Nav>

              <div className="post_it">
                <ul>
                  {
                    Posits.map((posit, ipos)=>

                      <li key={ ipos }>
                        <a  >
                          <div className="pin">
                            <img src={ Pin } alt="pin" className="img-responsive" width="37px" />
                          </div>
                          <h2 onClick={()=>this.ModalVerTareas(posit.id) } className="prioridad">{ posit.proyecto }</h2>
                            <hr />
                          <p>{ posit.asunto }</p>
                          
                          <div onClick={ ()=> this.porcentCollapse(ipos) } className="prioridad">
                          
                            <div className="contentBarraProgreso">
                                <div className="widthBarraProgreso" style={{ width: `${posit.porcentajeAvance}%`,  transition: 'all .9s ease-in',  }} />
                                <div className="cantidadPorcentaje"  >{ posit.porcentajeAvance} %</div>
                            </div>

                          </div>

                          <Collapse isOpen={this.state.collapseInputPorcentaje === ipos}>
                            <InputGroup size="sm">
                              
                              {/* <Input type="number" /> */}
                              <DebounceInput type="number" debounceTimeout={100} onChange={e => this.setState({barraPorcentaje: e.target.value})} className="form-control" />                

                              <InputGroupAddon addonType="prepend" color="success">
                                <InputGroupText className="prioridad" onClick={ ()=> this.incremetaBarraPorcent(ipos)}>
                                  <MdSend />
                                </InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                          </Collapse>

                        </a>
                      </li>
  
                    )
                  }
                </ul>

              </div>

          </Col>
        </Row>
          
        <Modal isOpen={this.state.modalVerTareas} fade={false} toggle={this.CierraModalVerTareas} size="sm" >

              <div className="p-2">
                <div className="text-center">
                  <label className="proyecto">{ PositsFiltrado.proyecto }</label>
                  <br />
                  <label className="asunto"> { PositsFiltrado.asunto }</label>

                </div>
                <div className="tarea pb-1">
                  <label>{ PositsFiltrado.tarea }</label>
                </div>
                
                {/* <label className="fecha">{ PositsFiltrado.fechaInicio }</label> */}
                <Progress value={50} className="mt-2"> 10 de  20  </Progress>
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
              <div className="prioridad verInput" onClick={()=> this.setState({CollapseInputAddTarea:!this.state.CollapseInputAddTarea})}>{ this.state.CollapseInputAddTarea === true?<MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}</div>
            </Nav>
              
            <TabContent activeTab={this.state.activeTabModalTarea}>
              <TabPane tabId="1">
                <div className="subtareas">
                <Collapse isOpen={this.state.CollapseInputAddTarea === true}>
                  <InputGroup size="sm" className="mb-2">
                    <Input type="text" onBlur={e => this.setState({inputSubtarea: e.target.value})}/>                

                    <InputGroupAddon addonType="prepend" color="success">
                      <InputGroupText className="prioridad" onClick={ ()=> this.subtareaAdd(1)}>
                        <MdSend />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Collapse>

                
                  {
                    PositsFiltrado.SubTareas !== undefined ?
                      PositsFiltrado.SubTareas.map((subtarea, iS)=>
                      <div key={ iS } className="actividadSubtarea" style={{background:subtarea.color}}>{ subtarea.subtarea}
                        
                        <div className="checkTarea">
                          <CustomInput type="checkbox" id={`confirmTarea${iS}` }  />
                        </div>
                       </div>
                      )
                    :"no hay tares que mostrar"
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
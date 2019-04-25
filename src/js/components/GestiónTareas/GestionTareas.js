import React, { Component } from 'react';
import { CustomInput , TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col,  Form, FormGroup, Label, Input, Progress, Collapse, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';
import { MdSend, MdSystemUpdateAlt, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { DebounceInput } from 'react-debounce-input';
import "../../../css/GTareas.css"

import { GeraColoresRandom } from "../Utils/Funciones"

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

    this.state = {
      Posits:[],
      PositsFiltrado:[],
      // captura inputs de envio de datos del formulario
      Para:"",
      proyecto:"",
      asunto:"",
      tarea:"",
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

      CollapseInputAddTarea:false
    };
  }

  componentDidMount(){
    var Posit = []
    for (let i = 1; i < 20; i++) {
     Posit.push(
       {
         "id":i,
         "proyecto":"INFORME OCTUBRE " + i,
         "asunto":"VALORIZACIONES,",
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

    console.log(Posit)

    this.setState({
      Posits:Posit
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
    var { Posits, Para, proyecto, asunto, tarea, fechaInicio, duracion, porcentajeAvance } = this.state
    var PositTareas = Posits

    PositTareas.push(
      {
        Para,
        proyecto,
        asunto,
        tarea,
        fechaInicio,
        duracion,
        porcentajeAvance,
      }
    )

    console.log("PositTareas ", PositTareas)
    this.setState({
      Posits:PositTareas
    })
  }

  porcentCollapse(index){
    this.setState(
        { 
          collapseInputPorcentaje: this.state.collapseInputPorcentaje === index ? null : index
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
      Posits: PositTareas
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

    console.log("tareaaa0", Tareas[0  ])

    this.setState({
      PositsFiltrado:Tareas[0],
      modalVerTareas: !this.state.modalVerTareas
    })
  }

  subtareaAdd(){

    var tareaPrincipal = this.state.Posits 

    tareaPrincipal[0].SubTareas.push(
      {
        subtarea: this.state.inputSubtarea,
        color: GeraColoresRandom()
      }
    )
    
    console.log("tarea ", tareaPrincipal);

    this.setState({
      Posits:tareaPrincipal
    })
    
  }

  render() {
    const { Posits, PositsFiltrado } = this.state
    
    return (
      <div>
        <Row>
          <Col sm="2">
            <Form onSubmit={ this.AgregaTarea }>
              <FormGroup>
                <Label for="proyecto">PROYECTO: </Label>
                <Input type="select" name="selectMulti" id="proyecto" onChange={ e=> this.setState({ proyecto: e.target.value}) }>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="A">PARA:</Label>
                <DebounceInput type="text" debounceTimeout={300} onChange={e => this.setState({Para: e.target.value})} className="form-control" />
              </FormGroup>
              <FormGroup>
                <Label for="asunto">TAREA :</Label>
                <DebounceInput cols="40" rows="1" element="textarea" minLength={0} debounceTimeout={300} onChange={e => this.setState({asunto: e.target.value})} className="form-control" />                
              </FormGroup>

              <FormGroup>
                <Label for="tarea">DESCRIPCIÓN : </Label>
                <DebounceInput cols="40" rows="1" element="textarea" minLength={0} debounceTimeout={300} onChange={e => this.setState({tarea: e.target.value})} className="form-control" />                
              </FormGroup>

              <FormGroup>
                <Label for="fechaInicio">INICIO : </Label>
                <Input type="date" id="fechaInicio" onChange={ e => this.setState({fechaInicio: e.target.value})}/>
              </FormGroup>

              <FormGroup>
                <Label for="duracion">DURACIÓN: </Label>
                <Input type="number" onChange={ e => this.setState({duracion: e.target.value})} />
              </FormGroup>

              <Button type="submit"> GUARDAR </Button>
            </Form>
          </Col>
          <Col sm="10">
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

            <Row>
              {
                Posits.map((posit, ipos)=>
                  <Col sm="3" className="m-2" key={ ipos }>
                    <div className="card p-1">
                      <div className="text-center border-bottom">
                        { posit.proyecto }
                      </div>
                      <div>
                        { posit.asunto }
                        
                        <Button onClick={()=>this.ModalVerTareas(posit.id) }>Mas</Button>

                      </div>
                      <div onClick={ ()=> this.porcentCollapse(ipos) } className="prioridad">
                        <Progress value={ posit.porcentajeAvance}>{ posit.porcentajeAvance} %</Progress>
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
                    </div>
                  </Col>
                )
              }
            </Row>

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
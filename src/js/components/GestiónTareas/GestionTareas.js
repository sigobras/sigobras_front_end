import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col,  Form, FormGroup, Label, Input, FormText, Progress, Collapse, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import classnames from 'classnames';
import { MdSend, MdSystemUpdateAlt } from "react-icons/md";
import { DebounceInput } from 'react-debounce-input';


class GestionTareas extends Component {
  constructor(props) {
    super(props);
    
    this.toggle = this.toggle.bind(this);
    this.AgregaTarea = this.AgregaTarea.bind(this);
    this.porcentCollapse = this.porcentCollapse.bind(this);
    this.incremetaBarraPorcent = this.incremetaBarraPorcent.bind(this);

    this.state = {
      Posits:[],
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

    };
  }

  componentDidMount(){
    var Posit =[]
    for (let i = 1; i < 20; i++) {
     Posit.push(
       {
         "proyecto":"jbdnkm " + i,
         "asunto":"hjksdasfdsbj,",
         "tarea":"hfsgfdfsk",
         "fechaInicio":"12/01/2019",
         "duracion":5,
         "porcentajeAvance":(i+ 3) * 4  
       }
     ) 
    }
    this.setState({
      Posits:Posit
    })
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
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

    // var valor1 = PositTareas[key].porcentajeAvance
    // var valor2  = Number(barraPorcentaje)

    // var Resultado = valor1 + valor2

    PositTareas[key].porcentajeAvance = Number(barraPorcentaje)

    console.log( PositTareas )

    this.setState({
      Posits: PositTareas
    })

  }

  render() {
    const { Posits } = this.state
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
                <Label for="asunto">ASUNTO :</Label>
                <DebounceInput cols="40" rows="1" element="textarea" minLength={0} debounceTimeout={300} onChange={e => this.setState({asunto: e.target.value})} className="form-control" />                
              </FormGroup>

              <FormGroup>
                <Label for="tarea">TAREA: </Label>
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
                <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }} >
                  <MdSystemUpdateAlt /> Recibidos <span className="badge badge-light">{ Posits.length } </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
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
          
      </div>
    );
  }
}

export default GestionTareas;
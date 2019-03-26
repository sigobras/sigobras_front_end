import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Collapse} from 'reactstrap';
import { MdAdd,MdRemove } from "react-icons/md";
import ActualizacionObra from './ComponentsActualizacion/ActualizacionObra'
import ActualizacionPartidasNuevas from './ComponentsActualizacion/ActualizacionPartidasNuevas'


class Actualizacion extends Component {
  constructor(){
    super();
    this.state = {
      collapse: 1,
    }

    this.CollapseCard = this.CollapseCard.bind(this)
  }

  CollapseCard(valor){
    let event = valor
    
    this.setState({ collapse: this.state.collapse === Number(event) ? 14 : Number(event) });
  }

  render() {
    var { collapse } = this.state
    if(sessionStorage.getItem("idacceso") !== null){ 
      return (
        <div className="pb-3">

        <Card>
            <a href="#" className="text-white">
              <CardHeader onClick={e=> this.CollapseCard(1)} data-event={1} > ACTUALIZACION 
                <div className="float-right"> 
                  {collapse === 1 ?<MdRemove size={20} />:<MdAdd size={20} />}
                </div>
              </CardHeader>
            </a>
            <Collapse isOpen={collapse === 1}>
              <CardBody> 
                  <ActualizacionObra />
              </CardBody>              
            </Collapse>
        </Card>

        <Card className="mt-2">
          <a href="#" className="text-white">
            <CardHeader onClick={e=>this.CollapseCard(2)} data-event={2} >PARTIDAS NUEVAS 
              <div className="float-right"> 
                {collapse === 2 ?<MdRemove size={20} />:<MdAdd size={20} />}
              </div>
            </CardHeader>
          </a>
            <Collapse isOpen={collapse === 2}>
                <CardBody>
                  {collapse === 2 ? <ActualizacionPartidasNuevas /> : '' }
                </CardBody>                   
            </Collapse>
        </Card>
        </div>
      );
    }else{
      return window.location.href = '/'
    }
  }
}

export default Actualizacion;
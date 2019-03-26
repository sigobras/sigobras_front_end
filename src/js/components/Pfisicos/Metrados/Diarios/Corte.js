import React, { Component } from 'react';
import { MdAdd,MdRemove } from "react-icons/md";
import { Card, CardHeader, CardBody, Collapse} from 'reactstrap';
import CorteObra from './ComponentsCorte/CorteObra'
import CortePartidasNuevas from './ComponentsCorte/CortePartidasNuevas'


class Corte extends Component {
  constructor(){
    super();

    this.state = {
      collapse: 1,
    }

    this.CollapseCard = this.CollapseCard.bind(this)
  }


  CollapseCard(valor){
    let event = Number(valor)
    this.setState({ collapse: this.state.collapse === event ? 0 : event });
  }

  render() {
    var { collapse,  } = this.state
    if(sessionStorage.getItem("idacceso") !== null){ 
      return (
        <div className="pb-3">

        <Card>
            <a href="#" className="text-white">
              <CardHeader onClick={e=> this.CollapseCard(1)} data-event={1} > METRADOS CORTE  
                <div className="float-right">
                  {collapse === 1 ?<MdRemove size={20} />:<MdAdd size={20} />}  
                </div> 
              </CardHeader>
            </a>
            <Collapse isOpen={collapse === 1}>
              <CardBody> 
                  <CorteObra />
              </CardBody>              
            </Collapse>
        </Card>

        <Card className="mt-2">
          <a href="#" className="text-white">
            <CardHeader onClick={e=>this.CollapseCard(2)} data-event={2} > PARTIDAS NUEVAS  
              <div className="float-right">
                {collapse === 1 ?<MdRemove size={20} />:<MdAdd size={20} />}  
              </div> 
            </CardHeader>
          </a>
            <Collapse isOpen={collapse === 2}>
                <CardBody>
                  { collapse === 2?  <CortePartidasNuevas />: '' }
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



export default Corte;

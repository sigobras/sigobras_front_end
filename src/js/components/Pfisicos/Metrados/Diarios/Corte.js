import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Collapse} from 'reactstrap';
import CorteObra from './ComponentsCorte/CorteObra'
import PartidasNuevas from './ComponentsDiarios/PartidasNuevas'


class Corte extends Component {
  constructor(){
    super();

    this.state = {
      collapse: 0,
    }

    this.CollapseCard = this.CollapseCard.bind(this)
  }


  CollapseCard(valor){
    let event = valor
    this.setState({ collapse: this.state.collapse === Number(event) ? 0 : Number(event) });
  }

  render() {
    var { collapse,  } = this.state
    if(sessionStorage.getItem("idacceso") !== null){ 
      return (
        <div className="pb-3">

        <Card>
            <a href="#" className="text-white"><CardHeader onClick={e=> this.CollapseCard(1)} data-event={1} > 1. METRADOS CORTE  {collapse === 1?'➖':'➕'}  </CardHeader></a>
            <Collapse isOpen={collapse === 1}>
              <CardBody> 
                  <CorteObra />
              </CardBody>              
            </Collapse>
        </Card>

        <Card className="mt-2">
          <a href="#" className="text-white"><CardHeader onClick={e=>this.CollapseCard(2)} data-event={2} >2. PARTIDAS NUEVAS  {collapse === 2?'➖':'➕'}</CardHeader></a>
            <Collapse isOpen={collapse === 2}>
                <CardBody>
                  { collapse === 1?  <PartidasNuevas />: '' }
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

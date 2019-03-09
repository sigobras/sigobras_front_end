import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Collapse} from 'reactstrap';
import MetradosDiarios from './ComponentsDiarios/MetradosDiarios'
import PartidasNuevas from './ComponentsDiarios/PartidasNuevas'


class MDdiario extends Component {
  constructor(){
    super();

    this.state = {
      collapse: 0,
      llamarComponentePartidaNueva: true

    }

    this.CollapseCard = this.CollapseCard.bind(this)
  }


  CollapseCard(valor){
    let event = valor
    if( valor === 2){
      this.setState({
        llamarComponentePartidaNueva: true
      })
    }else{
      this.setState({
        llamarComponentePartidaNueva: false
      })
    }
    this.setState({ collapse: this.state.collapse === Number(event) ? 0 : Number(event) });
  }

  render() {
    var { collapse, llamarComponentePartidaNueva } = this.state
    if(sessionStorage.getItem("idacceso") !== null){ 
      return (
        <div className="pb-3">

        <Card>
            <a href="#" className="text-white"><CardHeader onClick={e=> this.CollapseCard(1)} data-event={1} > 1. METRADOS DIARIOS {collapse === 1?'➖':'➕'}  </CardHeader></a>
            <Collapse isOpen={collapse === 1}>
              <CardBody> 
                  <MetradosDiarios />
              </CardBody>              
            </Collapse>
        </Card>

        <Card className="mt-2">
          <a href="#" className="text-white"><CardHeader onClick={e=>this.CollapseCard(2)} data-event={2} >2. PARTIDAS NUEVAS {collapse === 2?'➖':'➕'}</CardHeader></a>
            <Collapse isOpen={collapse === 2}>
                <CardBody>
                  { llamarComponentePartidaNueva !== true ? 'CARGANDO' : 
                    <PartidasNuevas />
                  }
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



export default MDdiario;

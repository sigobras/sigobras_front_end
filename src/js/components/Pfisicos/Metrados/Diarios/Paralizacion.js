import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Collapse} from 'reactstrap';
import { MdAdd,MdRemove } from "react-icons/md";
import ParalizacionObra from './ComponentsParalizacion/ParalizacionObra'

class Paralizacion extends Component {
  constructor(){
    super();

    this.state = {
      collapse: 1,
      Md:{
        Componentes:"/getComponentes",
        Partidas:"/getPartidas",
        Actividades:"/getActividades"
      },

      Pn:{
        Componentes:"/getComponentesPNuevas",
        Partidas:"/getPartidasPNuevas",
        Actividades:"/getActividadesPNuevas"
      },
    }

    this.CollapseCard = this.CollapseCard.bind(this)
  }


  CollapseCard(valor){
    let event = valor
    
    this.setState({ collapse: this.state.collapse === Number(event) ? 0 : Number(event) });
  }

  render() {
    var { collapse, Md , Pn } = this.state
    if(sessionStorage.getItem("idacceso") !== null){ 
      return (
        <div className="pb-3">


          <Card>
              <a href="#" className="text-white">
                <CardHeader onClick={e=> this.CollapseCard(1)} data-event={1} > METRADOS DIARIOS
                  <div className="float-right">
                      {collapse === 1 ?<MdRemove size={20} />:<MdAdd size={20} />}  
                  </div> 
                </CardHeader>
              </a>
              <Collapse isOpen={ collapse === 1 }>
                <CardBody> 
                  <ParalizacionObra rutas={Md}  />
                </CardBody>              
              </Collapse>
          </Card>

          <Card className="mt-2">
            <a href="#" className="text-white">
            <CardHeader onClick={e=>this.CollapseCard(2)} data-event={2} > PARTIDAS NUEVAS
              <div className="float-right"> 
                {collapse === 2 ?<MdRemove size={20} />:<MdAdd size={20} />}
              </div>
            </CardHeader></a>
              <Collapse isOpen={ collapse === 2 }>
                  <CardBody>
                    {collapse === 2 ? <ParalizacionObra rutas={ Pn } /> : '' }
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



export default Paralizacion;

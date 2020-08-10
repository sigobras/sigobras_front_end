import React, { Component } from 'react';
import { MdAdd,MdRemove } from "react-icons/md";
import { Card, CardHeader, CardBody, Collapse} from 'reactstrap';
import MetradosDiarios from './ComponentsDiarios/MetradosDiarios'

class MDdiario extends Component {
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
  }


  CollapseCard=(valor)=>{
    let event = valor
    this.setState({ collapse: this.state.collapse === Number(event) ? 121 : Number(event) });
  }

  render() {
    var { collapse, Md , Pn } = this.state
    if(sessionStorage.getItem("idacceso") !== null){ 
      return (
        <div className="pb-3">
          <Card>
              <a href="#" className="text-white text-decoration-none">
                <CardHeader onClick={()=> this.CollapseCard(1)} > 
                  <b>METRADOS DIARIOS</b>
                  <div className="float-right">
                      {collapse === 1 ?<MdRemove size={20} />:<MdAdd size={20} />}  
                  </div> 
                </CardHeader>
              </a>
              <Collapse isOpen={ collapse === 1 }>
                <CardBody> 
                    <MetradosDiarios rutas={Md} />
                </CardBody>              
              </Collapse>
          </Card>

          <Card className="mt-2">
            <a href="#" className="text-white text-decoration-none">
              <CardHeader onClick={()=>this.CollapseCard(2)} > 
                <b>PARTIDAS NUEVAS</b>
                <div className="float-right"> 
                  {collapse === 2 ?<MdRemove size={20} />:<MdAdd size={20} />}
                </div>
              </CardHeader>
            </a>
              <Collapse isOpen={ collapse === 2 }>
                  <CardBody>
                    {collapse === 2 ? <MetradosDiarios  rutas={ Pn } /> : '' }
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

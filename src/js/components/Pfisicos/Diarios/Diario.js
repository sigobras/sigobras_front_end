import React, { Component } from 'react';
import { MdAdd, MdRemove } from "react-icons/md";
import { Card, CardHeader, CardBody, Collapse } from 'reactstrap';
import MetradosDiarios from './ComponentsDiarios/MetradosDiarios'

class MDdiario extends Component {
  constructor() {
    super();
    this.state = {
      collapse: 1,
    }
  }


  CollapseCard = (valor) => {
    let event = valor
    this.setState({ collapse: this.state.collapse === Number(event) ? 121 : Number(event) });
  }

  render() {
    var { collapse } = this.state
    if (sessionStorage.getItem("idacceso") !== null) {
      return (
        <div>
          <a href="#" className="text-white text-decoration-none">
            <CardHeader 
            // onClick={() => this.CollapseCard(1)}
             >
              <b>METRADOS DIARIOS</b>
              <div className="float-right">
                {collapse === 1 ? <MdRemove size={20} /> : <MdAdd size={20} />}
              </div>
            </CardHeader>
          </a>
          <Collapse isOpen={collapse === 1}>
            <MetradosDiarios />
          </Collapse>
        </div>
      );
    } else {
      return window.location.href = '/'
    }
  }
}



export default MDdiario;

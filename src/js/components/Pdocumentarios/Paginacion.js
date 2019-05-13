import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class Paginacion extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      PaginaActual: 1,
      CantidadRows: 10
    };
    this.PaginaActual = this.PaginaActual.bind(this);
    this.SelectCantidadRows = this.SelectCantidadRows.bind(this);
  }

  componentWillMount(){
    var arrayData = []
    for (let i = 0; i < 100; i++) {
      arrayData.push(`ANG ${i}`)
    }

    this.setState({ todos: arrayData})
  }

  PaginaActual(event) {
    console.log("PaginaActual ", Number(event))
    this.setState({
      PaginaActual: Number(event)
    });
  }

  SelectCantidadRows(e){
    console.log("SelectCantidadRows ", e.target.value)
    this.setState({CantidadRows: Number(e.target.value) })
  }
  render() {
    const { todos, PaginaActual, CantidadRows } = this.state;

    // obtener indices para paginar 
    const indexOfUltimo = PaginaActual * CantidadRows;
    console.log("INDEX OF ULTIMO ", indexOfUltimo)
    const indexOfPrimero = indexOfUltimo - CantidadRows;
    console.log("INDEX OF PRIMERO ", indexOfPrimero)
    const DataDelAl = todos.slice(indexOfPrimero, indexOfUltimo);

    // numero de paginas hasta ahora
    const NumeroPaginas = [];
    for (let i = 1; i <= Math.ceil(todos.length / CantidadRows); i++) {
      NumeroPaginas.push(i);
    }

    console.log("NumeroPaginas ", NumeroPaginas)
    return (
      <div>
        <div className="clearfix">
          <div className="float-left">
            <select onChange={ this.SelectCantidadRows } value={CantidadRows} className="form-control form-control-sm" >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
          </div>
          <div className="float-right">
            <input placeholder="Buscar" className="form-control form-control-sm" />
          </div>
        </div>
        
        <table className="table table-sm">
          <thead>
            <tr>
              <th >NOMBRE </th>
            </tr>
          </thead>
          <tbody>
            {
              DataDelAl.map((todo, index) =>           
              <tr key={index}>
                <td>{todo}</td>
              </tr>
              )
            }  
          </tbody>
        </table>

        <Pagination size="sm">
          <PaginationItem>
            <PaginationLink first href="#" className="bg-dark"  onClick={()=>this.PaginaActual(1)}> PRIMERO </PaginationLink>
          </PaginationItem>

          {
            NumeroPaginas.map((number) =>
              <PaginationItem key={number} active={number === PaginaActual }>
                <PaginationLink href="#" onClick={()=> this.PaginaActual(number)} className="bg-dark"  >
                  {number}
                </PaginationLink>
              </PaginationItem>
            )
          }

          <PaginationItem>
            <PaginationLink last href="#" className="bg-dark" onClick={()=>this.PaginaActual(NumeroPaginas.pop())}> ÚLTIMO</PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    );
  }
}

export default Paginacion;

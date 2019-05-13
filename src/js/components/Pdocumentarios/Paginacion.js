import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import axios from "axios"
import { UrlServer, Id_Obra } from "../Utils/ServerUrlConfig"

class Paginacion extends Component {
  constructor() {
    super();
    this.state = {
      DataMaterialesApi: [],
      PaginaActual: 1,
      CantidadRows: 10
    };
    this.PaginaActual = this.PaginaActual.bind(this);
    this.SelectCantidadRows = this.SelectCantidadRows.bind(this);
  }

  componentWillMount(){
    axios.post(`${UrlServer}/getmaterialesResumen`, {
      "id_ficha": Id_Obra,
      "tipo": "Materiales"
    })
    .then((res) => {
      // console.log("resumen de componentes ", res.data)
      this.setState({
        DataMaterialesApi: res.data
      })
    })
    .catch((err) => {
      console.error("error al consultar al api ", err)
    })

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
    const { DataMaterialesApi, PaginaActual, CantidadRows } = this.state;

    // obtener indices para paginar 
    const indexOfUltimo = PaginaActual * CantidadRows;
    console.log("INDEX OF ULTIMO ", indexOfUltimo)

    const indexOfPrimero = indexOfUltimo - CantidadRows;
    // console.log("INDEX OF PRIMERO ", indexOfPrimero)

    const DataDelAl = DataMaterialesApi.slice(indexOfPrimero, indexOfUltimo);

    // numero de paginas hasta ahora
    const NumeroPaginas = [];
    for (let i = 1; i <= Math.ceil(DataMaterialesApi.length / CantidadRows); i++) {
      NumeroPaginas.push(i);
    }

    var tamanioDataPaginas = NumeroPaginas.length
    
    var ultimo =  PaginaActual + 5

    console.log(" resultado totalMostrar >> ", ultimo , ">>>>> ")

    const demo = NumeroPaginas.slice(PaginaActual-1, ultimo )
    console.log("demo>>>>>>>>>>>>>> ", demo)
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
            {/* <input placeholder="Buscar" className="form-control form-control-sm" /> */}
            <Pagination size="sm">
              <PaginationItem>
                <PaginationLink first href="#" className="bg-dark"  onClick={()=>this.PaginaActual(1)}/>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink previous href="#" className="bg-dark" />
              </PaginationItem>
              {
                demo.map((number) =>
                  <PaginationItem key={number} active={number === PaginaActual }>
                    <PaginationLink href="#" onClick={()=> this.PaginaActual(number)} className="bg-dark">
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                )
              }

              <PaginationItem>
                <PaginationLink className="bg-dark"  next href="#" />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink last href="#" className="bg-dark" onClick={()=>this.PaginaActual(NumeroPaginas.pop())} />
              </PaginationItem>
            </Pagination>
          </div>
        </div>
        
        <table className="table table-sm">
          <thead>
            <tr>
              <th>NOMBRE </th>
              <th>UND. </th>
            </tr>
          </thead>
          <tbody>
            {
              DataDelAl.map((material, index) =>           
              <tr key={index}>
                <td>{ material.descripcion }</td>
                <td>{ material.unidad }</td>
              </tr>
              )
            }  
          </tbody>
        </table>
        <div className="clearfix">
          <div className="float-left">
             { `Mostrando ${ PaginaActual } de  ${NumeroPaginas.length} Páginas`}
          </div>
          <div className="float-right">
            <Pagination size="sm">
              <PaginationItem>
                <PaginationLink first href="#" className="bg-dark"  onClick={()=>this.PaginaActual(1)}/>
              </PaginationItem>

              <PaginationItem>
                <PaginationLink previous href="#" className="bg-dark" />
              </PaginationItem>
              {
                NumeroPaginas.map((number) =>
                  <PaginationItem key={number} active={number === PaginaActual }>
                    <PaginationLink href="#" onClick={()=> this.PaginaActual(number)} className="bg-dark">
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                )
              }

              <PaginationItem>
                <PaginationLink className="bg-dark"  next href="#" />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink last href="#" className="bg-dark" onClick={()=>this.PaginaActual(NumeroPaginas.pop())} />
              </PaginationItem>
            </Pagination>
          </div>
          
        </div>
      </div>
    );
  }
}

export default Paginacion;

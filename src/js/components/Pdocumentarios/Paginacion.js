import React, { Component } from "react";
import { InputGroup, InputGroupText, Button } from "reactstrap";
import axios from "axios";
import { UrlServer, Id_Obra } from "../Utils/ServerUrlConfig";
import {
  MdFirstPage,
  MdLastPage,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
class Paginacion extends Component {
  constructor() {
    super();
    this.state = {
      DataMaterialesApi: [],
      PaginaActual: 1,
      CantidadRows: 10,
    };
    this.PaginaActual = this.PaginaActual.bind(this);
    this.SelectCantidadRows = this.SelectCantidadRows.bind(this);
  }

  componentWillMount() {
    axios
      .post(`${UrlServer}/getmaterialesResumen`, {
        id_ficha: Id_Obra,
        tipo: "Materiales",
      })
      .then((res) => {
        // console.log("resumen de componentes ", res.data)
        this.setState({
          DataMaterialesApi: res.data,
        });
      })
      .catch((err) => {
        console.error("error al consultar al api ", err);
      });
  }

  PaginaActual(event) {
    console.log("PaginaActual ", Number(event));
    this.setState({
      PaginaActual: Number(event),
    });
  }

  SelectCantidadRows(e) {
    console.log("SelectCantidadRows ", e.target.value);
    this.setState({ CantidadRows: Number(e.target.value) });
  }
  render() {
    const { DataMaterialesApi, PaginaActual, CantidadRows } = this.state;

    // obtener indices para paginar
    const indexOfUltimo = PaginaActual * CantidadRows;
    console.log("INDEX OF ULTIMO ", indexOfUltimo);

    const indexOfPrimero = indexOfUltimo - CantidadRows;
    // console.log("INDEX OF PRIMERO ", indexOfPrimero)

    const DataDelAl = DataMaterialesApi.slice(indexOfPrimero, indexOfUltimo);

    // numero de paginas hasta ahora
    const NumeroPaginas = [];
    for (
      let i = 1;
      i <= Math.ceil(DataMaterialesApi.length / CantidadRows);
      i++
    ) {
      NumeroPaginas.push(i);
    }

    return (
      <div>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>NOMBRE </th>
              <th>UND. </th>
            </tr>
          </thead>
          <tbody>
            {DataDelAl.map((material, index) => (
              <tr key={index}>
                <td>{material.descripcion}</td>
                <td>{material.unidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="clearfix">
          <div className="float-left">
            <select
              onChange={this.SelectCantidadRows}
              value={CantidadRows}
              className="form-control form-control-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
          </div>
          <div className="float-right mr-2 ">
            <div className="d-flex text-dark">
              <InputGroup size="sm">
                <InputGroup>
                  <Button
                    className="btn btn-light pt-0"
                    onClick={() => this.PaginaActual(1)}
                    disabled={PaginaActual === 1}
                  >
                    <MdFirstPage />
                  </Button>
                  <Button
                    className="btn btn-light pt-0"
                    onClick={() => this.PaginaActual(PaginaActual - 1)}
                    disabled={PaginaActual === 1}
                  >
                    <MdChevronLeft />
                  </Button>
                  <input
                    type="text"
                    style={{ width: "30px" }}
                    value={PaginaActual}
                    onChange={(e) =>
                      this.setState({ PaginaActual: e.target.value })
                    }
                  />
                  <InputGroupText>
                    {`de  ${NumeroPaginas.length}`}{" "}
                  </InputGroupText>
                </InputGroup>
                <InputGroup>
                  <Button
                    className="btn btn-light pt-0"
                    onClick={() => this.PaginaActual(PaginaActual + 1)}
                    disabled={PaginaActual === NumeroPaginas.length}
                  >
                    <MdChevronRight />
                  </Button>
                  <Button
                    className="btn btn-light pt-0"
                    onClick={() => this.PaginaActual(NumeroPaginas.pop())}
                    disabled={PaginaActual === NumeroPaginas.length}
                  >
                    <MdLastPage />
                  </Button>
                </InputGroup>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Paginacion;

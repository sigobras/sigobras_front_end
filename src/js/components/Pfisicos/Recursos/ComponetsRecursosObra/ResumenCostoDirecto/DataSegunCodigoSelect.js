import React, { Component } from "react";
import {
  InputGroup,
  InputGroup,
  InputGroupText,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";

import {
  ConvertFormatStringNumber,
  Redondea,
} from "../../../../Utils/Funciones";

class DataSegunCodigoSelect extends Component {
  constructor() {
    super();
    this.state = {
      DataMostarMasCodigo: [],
      DataEspecificaApi: [],
      TotalParcial: null,
    };
  }

  componentDidMount() {
    const { IdObra, UrlServer, tipoRecurso, codigo, idDocumento } =
      this.props.DataConsumir;
    // console.log("propss ", this.props.DataConsumir)

    axios
      .post(`${UrlServer}/getmaterialesResumenEjecucionRealCodigosData`, {
        id_ficha: IdObra,
        tipo: tipoRecurso,
        codigo: codigo,
        id_tipoDocumentoAdquisicion: idDocumento,
      })
      .then((res) => {
        // console.log("data ", res.data.recursos)

        var totalParcial = Object.values(res.data.recursos).reduce(
          (anterior, actual) => {
            return (
              ConvertFormatStringNumber(anterior) +
              ConvertFormatStringNumber(actual.recurso_gasto_parcial)
            );
          },
          0
        );

        this.setState({
          DataMostarMasCodigo: res.data,
          TotalParcial: Number(Redondea(totalParcial)).toLocaleString("en-IN"),
        });
      })
      .catch((err) => {
        console.error("mal ", err.response);
      });
  }

  BuscaEspecifica(e) {
    const { UrlServer } = this.props.DataConsumir;

    console.log("BuscaEspecifica 1.1.4 2", e.target.value);
    axios
      .post(`${UrlServer}/getclasificadoresPesupuestarios`, {
        todos: false,
        clasificador: e.target.value,
      })
      .then((res) => {
        console.log("data especifica ", res.data[0]);
        this.setState({ DataEspecificaApi: res.data[0] });
      })
      .catch((err) => {
        console.error("mal ", err.response);
      });
  }

  GuardaOrdenDeCompra(e) {
    e.preventDefault();
    console.log("GuardaOrdenDeCompra ");
    const { IdObra, UrlServer, tipoRecurso, codigo, idDocumento } =
      this.props.DataConsumir;

    const { recursos } = this.state.DataMostarMasCodigo;
    const { id_clasificador_presupuestario } = this.state.DataEspecificaApi;

    // console.log("recursos ", recursos)
    var funcion = (data) => [IdObra, data.descripcion];

    var dataRecorre = recursos.map(funcion);

    var razonSocial = e.target[2].value;
    var RUC = e.target[3].value;
    var fecha = e.target[5].value;
    var SIAF = e.target[6].value;
    var NCP = e.target[7].value;
    var DataNuevo = {
      razonSocial: razonSocial,
      RUC: RUC,
      fecha: fecha,
      SIAF: SIAF,
      NCP: NCP,
      clasificadores_presupuestarios_id_clasificador_presupuestario:
        id_clasificador_presupuestario,
      recursos_ejecucionreal: dataRecorre,
    };
    // console.log("dataRecorre ", dataRecorre)
    console.log("DataNuevo ", DataNuevo);

    axios
      .post(`${UrlServer}/postdocumentoAdquisicion`, DataNuevo)
      .then((res) => {
        console.log("envio de orden de compra ", res);
      })
      .catch((err) => {
        console.error("no se guardar la orden de compra ", err);
      });
  }
  render() {
    const { DataMostarMasCodigo, TotalParcial } = this.state;
    const { nombreCod, nombreDocumento, codigo } = this.props.DataConsumir;

    return (
      <div className="table-responsive">
        <form onSubmit={this.GuardaOrdenDeCompra.bind(this)}>
          <div className="clearfix mb-2">
            <div className="h5 float-left">
              {`${nombreDocumento} ( ${nombreCod} )`}{" "}
            </div>
            {DataMostarMasCodigo.razonSocial === "" ? (
              <button
                type="submit"
                className="float-right mr-2 btn btn-outline-success"
              >
                Guardar
              </button>
            ) : (
              ""
            )}
          </div>

          <InputGroup size="sm" className="mb-2 px-1">
            <InputGroup>
              <InputGroupText>ESPECÍFICA</InputGroupText>
            </InputGroup>
            {DataMostarMasCodigo.clasificador === "" ? (
              <Input
                placeholder="INGRESE LA ESPECÍFICA ( 1.1.4 2 )"
                onBlur={this.BuscaEspecifica.bind(this)}
              />
            ) : (
              <Input
                defaultValue={DataMostarMasCodigo.clasificador}
                disabled={DataMostarMasCodigo.clasificador !== ""}
              />
            )}
            {DataMostarMasCodigo.clasificador === "" ? (
              <InputGroup>
                <Button
                  outline
                  color="primary"
                  disabled={DataMostarMasCodigo.clasificador !== ""}
                >
                  BUSCAR
                </Button>
              </InputGroup>
            ) : (
              ""
            )}
          </InputGroup>

          <div className="d-flex">
            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroup>
                <InputGroupText>RAZÓN SOCIAL</InputGroupText>
              </InputGroup>
              <Input
                placeholder="INGRESE "
                defaultValue={DataMostarMasCodigo.razonSocial}
                disabled={DataMostarMasCodigo.razonSocial !== ""}
              />
            </InputGroup>

            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroup>
                <InputGroupText>RUC</InputGroupText>
              </InputGroup>
              <Input
                placeholder="INGRESE"
                defaultValue={DataMostarMasCodigo.RUC}
                disabled={DataMostarMasCodigo.RUC !== ""}
              />
            </InputGroup>
          </div>

          <div className="d-flex">
            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroup>
                <InputGroupText>{nombreCod}</InputGroupText>
              </InputGroup>
              <Input value={codigo} disabled />
            </InputGroup>

            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroup>
                <InputGroupText>FECHA</InputGroupText>
              </InputGroup>
              <Input
                type="date"
                placeholder="INGRESE"
                defaultValue={DataMostarMasCodigo.fecha}
                disabled={DataMostarMasCodigo.fecha !== ""}
              />
            </InputGroup>

            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroup>
                <InputGroupText>SIAF</InputGroupText>
              </InputGroup>
              <Input
                placeholder="INGRESE"
                defaultValue={DataMostarMasCodigo.SIAF}
                disabled={DataMostarMasCodigo.SIAF !== ""}
              />
            </InputGroup>

            <InputGroup size="sm" className="mb-2 px-1">
              <InputGroup>
                <InputGroupText>N° C / P</InputGroupText>
              </InputGroup>
              <Input
                placeholder="INGRESE"
                defaultValue={DataMostarMasCodigo.NCP}
                disabled={DataMostarMasCodigo.NCP !== ""}
              />
            </InputGroup>
          </div>
        </form>
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>N°</th>
              <th>RECURSO</th>
              <th>UND</th>
              <th>CANTIDAD</th>
              <th>PRECIO S/.</th>
              <th>PARCIAL S/.</th>
            </tr>
          </thead>
          <tbody>
            {DataMostarMasCodigo.recursos !== undefined ? (
              DataMostarMasCodigo.recursos.map((ReqLista, IndexRL) => (
                <tr key={IndexRL}>
                  <td>{IndexRL + 1}</td>
                  <td> {ReqLista.descripcion} </td>
                  <td> {ReqLista.unidad} </td>
                  <td
                    className={
                      this.state.tipoEjecucion === true
                        ? "colorInputeableRecurso "
                        : ""
                    }
                  >
                    {ReqLista.recurso_gasto_cantidad}
                  </td>

                  <td
                    className={
                      this.state.tipoEjecucion === true
                        ? "colorInputeableRecurso"
                        : ""
                    }
                  >
                    {ReqLista.recurso_gasto_precio}
                  </td>
                  <td> {ReqLista.recurso_gasto_parcial}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">...</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5">TOTAL</td>
              <td>S/. {TotalParcial}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default DataSegunCodigoSelect;

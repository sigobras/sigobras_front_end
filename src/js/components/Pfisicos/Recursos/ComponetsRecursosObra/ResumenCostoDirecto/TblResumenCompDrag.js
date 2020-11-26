import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Col, Row, Modal } from 'reactstrap';
import axios from 'axios';

import DataSegunCodigoSelect from "./DataSegunCodigoSelect"

class TblResumenCompDrag extends Component {
  constructor(props) {
    super(props);
    // console.log("props ", props)
    this.state = {
      DataCodigosAgrupado: [],
      DataRecursoAgrupadoApi: [],
      modalMostrarMasCodigo: false,
      CodigoSeleccionado: {},
      idDocumento: {},
      nombreCodigoDocumento: {},
      nombreDocumento: {}
    }
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  componentDidMount() {

    const { IdObra, UrlServer, tipoRecurso } = this.props.ConfigData
    axios.post(`${UrlServer}/getmaterialesResumenEjecucionRealCodigos`, {
      "id_ficha": IdObra,
      "tipo": tipoRecurso
    })
      .then((res) => {
        console.log("response de codigos agrupado 👀", res.data)
        this.setState({
          DataCodigosAgrupado: res.data
        })
      })
      .catch((err) => {
        console.error("erres al consultar api ,", err)
      })

    // LAMAA A COMPONENTES DE DATA SIN CODIGO

    axios.post(`${UrlServer}/getmaterialesResumenEjecucionRealSinCodigo`, {
      "id_ficha": IdObra,
      "tipo": tipoRecurso
    })
      .then((res) => {
        console.log("resumen de DE RECURSOS SIN CODIGO", res.data)
        this.setState({
          DataRecursoAgrupadoApi: res.data
        })
      })
      .catch((err) => {
        console.error("error al consultar al api ", err)
      })
  }

  onDragStart(ev, id) {
    console.log('moviendo :', id);
    ev.dataTransfer.setData("id", id);
  }

  onDragOver(ev) {
    ev.preventDefault();
  }

  onDrop(ev, cat, codigo, indexC, icodi, idDocumento) {
    console.log("onDrop ", cat, "codigo>>>>> ", codigo)

    // this.setState({idDocumento:{idDocumento}})

    const { IdObra, UrlServer, tipoRecurso } = this.props.ConfigData
    let id = ev.dataTransfer.getData("id");

    if (cat === "completado") {
      const { DataRecursoAgrupadoApi, DataCodigosAgrupado } = this.state

      // console.info("data id en on drop ", id)
      var NuevaDataEliminada = []

      var FitraDrecrip = DataRecursoAgrupadoApi.filter((descrip) => {

        if (descrip.descripcion !== id) {
          NuevaDataEliminada.push(descrip)
        }
        return descrip.descripcion === id
      })

      var CantidadSuma = DataCodigosAgrupado[indexC].codigos[icodi].cantidad + 1
      DataCodigosAgrupado[indexC].codigos[icodi].cantidad = CantidadSuma
      console.log("CantidadSuma ", CantidadSuma)
      console.log("FitraDrecrip", FitraDrecrip)
      console.log("NuevaDataEliminada", NuevaDataEliminada)

      this.setState({
        DataRecursoAgrupadoApi: NuevaDataEliminada,
        DataCodigosAgrupado: DataCodigosAgrupado
      })
      axios.post(`${UrlServer}/postrecursosEjecucionreal`,
        {
          "tipo": "codigo",
          "data": [
            [IdObra, tipoRecurso, id, codigo, idDocumento]
          ]
        }
      )
        .then((res) => {
          console.log("res de grad codigo ", res)
        })
        .catch((err) => {
          console.error("no esta bien en envio de data ", err)
        })
    }

  }

  ModalVermasRecursoAgrupado(codigo, idDocumento, nombreDocumento, nombreCod) {
    // console.log("codigo ", codigo)
    this.setState(prevState => ({
      modalMostrarMasCodigo: !prevState.modalMostrarMasCodigo,
      CodigoSeleccionado: { codigo },
      idDocumento: { idDocumento },
      nombreDocumento: { nombreDocumento },
      nombreCodigoDocumento: { nombreCod }
    }));
  }

  render() {
    const { DataRecursoAgrupadoApi, DataCodigosAgrupado, CodigoSeleccionado, idDocumento, nombreCodigoDocumento, nombreDocumento } = this.state
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '8px', right: '19.5%', color: "red" }} onClick={this.ModalVermasRecursoAgrupado.bind(this, "", "", "", "")}>&times;</button>;
    return (
      <div>
        <Row>
          <Col sm="7">
            <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "ejecucion", "", "in", "in2", "idDocumento") }}>
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th colSpan="8" > RECURSOS GASTADOS HASTA LA FECHA  HOY {FechaActual()} )</th>
                  </tr>
                  <tr>
                    <th>N° O/C - O/S</th>
                    <th>RECURSO</th>
                    <th>UND</th>
                    <th>CANTIDAD</th>
                    <th>PRECIO S/.</th>
                    <th>PARCIAL S/.</th>
                    <th>DIFERENCIA</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    DataRecursoAgrupadoApi !== undefined ?
                      DataRecursoAgrupadoApi.map((ReqLista, IndexRL) =>
                        <tr key={IndexRL} onDragStart={(e) => this.onDragStart(e, ReqLista.descripcion)} draggable className="grabbable">
                          <td>
                            {`${ReqLista.tipodocumentoadquisicion_nombre} - ${ReqLista.recurso_codigo}`}
                          </td>
                          <td> {ReqLista.descripcion} </td>
                          <td> {ReqLista.unidad} </td>
                          <td> {`${ReqLista.recurso_gasto_cantidad}`}</td>
                          <td> {`${ReqLista.recurso_gasto_precio}`}</td>
                          <td> {ReqLista.recurso_gasto_parcial}</td>
                          <td> {ReqLista.diferencia}</td>
                          <td> {ReqLista.porcentaje}</td>
                        </tr>
                      ) : <tr><td colSpan="11">AUN NO HAY DATOS</td></tr>
                  }

                </tbody>
              </table>
            </div>
          </Col>
          <Col sm="5">
            {
              DataCodigosAgrupado.map((tipoDoc, indexC) =>

                <Card key={indexC} className="mb-2">
                  <CardHeader className="p-1">{`${tipoDoc.tipoDocumento} `}<span className="badge badge-primary"> {tipoDoc.cantidad}</span> </CardHeader>
                  <CardBody>
                    <div className="p-1 d-flex flex-wrap">
                      {
                        tipoDoc.codigos.map((codigo, icodi) =>
                          <div

                            className="divCodigoRecur" key={icodi}
                            onDragOver={codigo.bloqueado !== 1 ? (e) => this.onDragOver(e) : ""}
                            onDrop={(e) => { this.onDrop(e, "completado", codigo.codigo, indexC, icodi, tipoDoc.idDocumento) }}

                            onClick={this.ModalVermasRecursoAgrupado.bind(this, codigo.codigo, tipoDoc.idDocumento, tipoDoc.tipoDocumento, tipoDoc.nombre)}
                          >
                            {`${tipoDoc.nombre} ${codigo.codigo} `}<span className="badge badge-primary">{codigo.cantidad}</span>
                          </div>
                        )
                      }
                    </div>
                  </CardBody>
                </Card>
              )
            }

          </Col>
        </Row>

        {/* { console.log("DataTipoRecursoResumen  ", DataTipoRecursoResumen)} */}
        <Modal isOpen={this.state.modalMostrarMasCodigo} toggle={this.ModalVermasRecursoAgrupado.bind(this, "", "", "", "")} external={externalCloseBtn} size="lg">
          <DataSegunCodigoSelect DataConsumir={Object.assign(this.props.ConfigData, CodigoSeleccionado, idDocumento, nombreCodigoDocumento, nombreDocumento)} />
        </Modal>
      </div>
    );
  }
}

export default TblResumenCompDrag;
import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';

import axios from "axios"

class DataSegunCodigoSelect extends Component {
  constructor() {
    super()
    this.state = {
      DataMostarMasCodigo: []
    }
  }

  componentWillMount() {
    const { IdObra, UrlServer, tipoRecurso, codigo, idDocumento } = this.props.DataConsumir
    // console.log("propss ", this.props.DataConsumir)

    axios.post(`${UrlServer}/getmaterialesResumenEjecucionRealCodigosData`, {
      "id_ficha": IdObra,
      "tipo": tipoRecurso,
      "codigo": codigo,
      "id_tipoDocumentoAdquisicion": idDocumento
    })
      .then((res) => {
        console.log("data ", res)
        this.setState({ DataMostarMasCodigo: res.data })
      })
      .catch((err) => {
        console.error("mal ", err.response)
      })
  }

  render() {
    const { DataMostarMasCodigo } = this.state
    const { nombreCod, nombreDocumento } = this.props.DataConsumir

    return (
      <div className="table-responsive">
        <div className="d-flex justify-content-center">
          <div className="h5">{`${nombreDocumento} ( ${nombreCod} )`} </div>
          {/* <button>Guardar</button> */}
        </div>
{/* 

        <InputGroup size="sm" className="mb-2 px-1">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              ESPECÍFICA
            </InputGroupText>
          </InputGroupAddon>
          <Input placeholder="INGRESE LA ESPECÍFICA" />
        </InputGroup>

        <div className="d-flex">

          <InputGroup size="sm" className="mb-2 px-1">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                RAZÓN SOCIAL
              </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="INGRESE " />
          </InputGroup>

          <InputGroup size="sm" className="mb-2 px-1">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                RUC
                </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="INGRESE" />
          </InputGroup>
        </div>

        <div className="d-flex">

          <InputGroup size="sm" className="mb-2 px-1">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                ORDEN DE COMPRA
                </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="INGRESE" />
          </InputGroup>


          <InputGroup size="sm" className="mb-2 px-1">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                FECHA
                </InputGroupText>
            </InputGroupAddon>
            <Input type="date" placeholder="INGRESE" />
          </InputGroup>


          <InputGroup size="sm" className="mb-2 px-1">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                SIAF
                </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="INGRESE" />
          </InputGroup>


          <InputGroup size="sm" className="mb-2 px-1">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                N° C / P
                </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="INGRESE" />
          </InputGroup>

        </div> */}
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>N°</th>
              <th>N° O/C - O/S</th>
              <th>RECURSO</th>
              <th>UND</th>
              <th>CANTIDAD</th>
              {/* <th>PRECIO S/.</th>
              <th className="bordeDerecho"> PARCIAL S/.</th>

              <th>CANTIDAD</th> */}
              <th>PRECIO S/.</th>
              <th>PARCIAL S/.</th>
              {/* <th>DIFERENCIA</th>
              <th>%</th> */}
            </tr>
          </thead>
          <tbody>
            {
              DataMostarMasCodigo.map((ReqLista, IndexRL) =>
                <tr key={IndexRL}>
                  <td>{IndexRL + 1}</td>
                  <td className={this.state.tipoEjecucion === true ? "colorInputeableRecurso" : ""}>

                    {`${ReqLista.tipodocumentoadquisicion_nombre} - ${ReqLista.recurso_codigo}`}
                    {/* {
                      this.state.tipoEjecucion === false ? `${ReqLista.tipodocumentoadquisicion_nombre} - ${ReqLista.recurso_codigo}`
                        :
                        <div className="d-flex justify-content-between contentDataTd">
                          {
                            Editable === IndexRL && precioCantidad === "codigo" ?
                              <span>
                                <select style={{ padding: "1.5px" }} onChange={e => this.setState({ selectTipoDocumento: e.target.value })} value={this.state.selectTipoDocumento}>
                                  {
                                    DataTipoDocAdquisicionApi.map((Docu, indexD) =>
                                      <option value={Docu.id_tipoDocumentoAdquisicion} key={indexD}>{Docu.nombre}</option>
                                    )

                                  }

                                </select>
                                <input type="text" defaultValue={ReqLista.recurso_codigo} autoFocus onBlur={this.inputeable.bind(this, { IndexRL }, "codigo", ReqLista.descripcion)} style={{ width: "70px" }} />
                              </span>
                              :

                              <span>{`${ReqLista.id_tipoDocumentoAdquisicion === "" ? "-" : ReqLista.tipodocumentoadquisicion_nombre} ${ReqLista.recurso_codigo}`}</span>
                          }

                          <div className="ContIcon" >
                            {
                              Editable === IndexRL && precioCantidad === "codigo"
                                ?
                                <div className="d-flex">
                                  <div onClick={() => this.activaEditable(IndexRL, null, ReqLista.id_tipoDocumentoAdquisicion || DataTipoDocAdquisicionApi[0].id_tipoDocumentoAdquisicion)} ><MdSave /> </div> {" "}
                                  <div onClick={() => this.setState({ Editable: null, precioCantidad: "", selectTipoDocumento: "" })} > <MdClose /></div>
                                </div>
                                :
                                <div onClick={() => this.activaEditable(IndexRL, "codigo", ReqLista.id_tipoDocumentoAdquisicion || DataTipoDocAdquisicionApi[0].id_tipoDocumentoAdquisicion)}><MdModeEdit /> </div>
                            }
                          </div>
                        </div>
                    } */}

                  </td>
                  <td> {ReqLista.descripcion} </td>
                  <td> {ReqLista.unidad} </td>
                  {/* <td> {ReqLista.recurso_cantidad}</td>
                  <td> {ReqLista.recurso_precio}</td>
                  <td className="bordeDerecho"> {ReqLista.recurso_parcial}</td> */}

                  <td className={this.state.tipoEjecucion === true ? "colorInputeableRecurso " : ""}>
                    {/* {
                      this.state.tipoEjecucion === false ? `${ReqLista.recurso_gasto_cantidad}`
                        :
                        <div className="d-flex justify-content-between contentDataTd">
                          {
                            Editable === IndexRL && precioCantidad === "cantidad" ?
                              <input type="text" defaultValue={ConvertFormatStringNumber(ReqLista.recurso_gasto_cantidad)} autoFocus onBlur={this.inputeable.bind(this, { IndexRL }, "cantidad", ReqLista.descripcion)} style={{ width: "60px" }} />
                              :
                              <span>{ReqLista.recurso_gasto_cantidad}</span>
                          }
                          <div className="ContIcon" >
                            {
                              Editable === IndexRL && precioCantidad === "cantidad"
                                ?
                                <div className="d-flex">
                                  <div onClick={() => this.activaEditable(IndexRL, null, "")} ><MdSave /> </div> {" "}
                                  <div onClick={() => this.setState({ Editable: null, precioCantidad: "", selectTipoDocumento: "" })} > <MdClose /></div>
                                </div>
                                :
                                <div onClick={() => this.activaEditable(IndexRL, "cantidad", "")}><MdModeEdit /> </div>
                            }
                          </div>

                        </div>
                    } */}
                    {ReqLista.recurso_gasto_cantidad}
                  </td>

                  <td className={this.state.tipoEjecucion === true ? "colorInputeableRecurso" : ""}>
                    {/* {
                      this.state.tipoEjecucion === false ? `${ReqLista.recurso_gasto_precio}`
                        :
                        <div className="d-flex justify-content-between contentDataTd" >
                          {
                            Editable === IndexRL && precioCantidad === "precio" ?
                              <input type="text" defaultValue={ConvertFormatStringNumber(ReqLista.recurso_gasto_precio)} autoFocus onBlur={this.inputeable.bind(this, { IndexRL }, "precio", ReqLista.descripcion)} style={{ width: "60px" }} />
                              :
                              <span>{ReqLista.recurso_gasto_precio}</span>
                          }

                          <div className="ContIcon">
                            {
                              Editable === IndexRL && precioCantidad === "precio"
                                ?
                                <div className="d-flex">
                                  <div onClick={() => this.activaEditable(IndexRL, null)} ><MdSave /> </div> {" "}
                                  <div onClick={() => this.setState({ Editable: null, precioCantidad: "" })} > <MdClose /></div>
                                </div>
                                :
                                <div onClick={() => this.activaEditable(IndexRL, "precio")}><MdModeEdit /> </div>
                            }
                          </div>
                        </div>
                    } */}

                    {ReqLista.recurso_gasto_precio}
                  </td>
                  <td> {ReqLista.recurso_gasto_parcial}</td>
                  {/* <td> {ReqLista.diferencia}</td>
                  <td> {ReqLista.porcentaje}</td> */}
                </tr>
              )
            }

          </tbody>
        </table>
      </div>
    );
  }
}

export default DataSegunCodigoSelect;


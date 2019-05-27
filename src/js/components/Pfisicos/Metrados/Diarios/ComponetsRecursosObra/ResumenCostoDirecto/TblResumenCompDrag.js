import React, { Component } from 'react';
import { FaPlus, FaCheck, FaSuperpowers } from 'react-icons/fa';
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { InputGroupAddon, InputGroupText, CustomInput, InputGroup, Spinner, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, UncontrolledDropdown, Input, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledPopover, PopoverHeader, PopoverBody, Col, Row } from 'reactstrap';
import { MdFlashOn, MdCompareArrows, MdClose, MdPerson, MdSearch, MdSettings, MdFilterTiltShift, MdVisibility, MdMonetizationOn, MdWatch, MdLibraryBooks, MdSave, MdModeEdit } from 'react-icons/md';
import { TiWarning } from "react-icons/ti";

class TblResumenCompDrag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // DataTipoRecursoResumen: this.props.DataTipoRecursoResumen
      DataRecursoAgrupado:[]
    }
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  onDragStart(ev, id) {
    console.log('moviendo :', id);
    ev.dataTransfer.setData("id", id);
  }

  onDragOver(ev) {
    ev.preventDefault();
  }

  onDrop(ev, cat) {
    console.log("onDrop ", cat)
    if (cat === "completado") {
      const { DragRecursos } = this.props
      const { DataRecursoAgrupado } = this.state

      let id = ev.dataTransfer.getData("id");
      // console.info("data id en on drop ", id)

      var DataNuevo = []

      let recursos = DragRecursos.filter((recurso, i ) => {
        if (recurso.recurso_codigo !== id) {
          // console.log(">>>", recurso, "index ", i)
          // recurso.splice(i, 1)
          DataNuevo.push(recurso)
        }
        // return recurso;
        return recurso.recurso_codigo === id;
      })

      console.log("DataNuevo>> ", DataNuevo)
      // console.log("id >>>>>>> ", recursos.recurso_codigo.indexOf(id) ) ;

      DataRecursoAgrupado.push(
        {
          Codigo: id,
          Recursos: recursos
        }
      )
      console.log("DataRecursoAgrupado ", DataRecursoAgrupado);
      this.setState({ DataRecursoAgrupado,  DataNuevo })
    }
    
  }

  render() {
    const { DragRecursos } = this.props
    const { DataRecursoAgrupado } = this.state
    return (
      <div>
        <Row>
          <Col sm="7">
            <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "ejecucion") }}>
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th colSpan="8" > RECURSOS GASTADOS HASTA LA FECHA ( HOY FechaActual()} )</th>
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
                    DragRecursos !== undefined ?
                      DragRecursos.map((ReqLista, IndexRL) =>
                        <tr key={IndexRL} onDragStart={(e) => this.onDragStart(e, ReqLista.recurso_codigo)} draggable={ReqLista.recurso_codigo !== "" } className={ ReqLista.recurso_codigo !== ""?"grabbable":"" }>
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
            <Card>
              <CardHeader className="p-1">titulo de orden de compra</CardHeader>
              <CardBody onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e, "completado") }}>
                <div className="p-1">
                  {
                    DataRecursoAgrupado.map((codigo, indexC)=>
                      <div className="divCodigoRecur" key={ indexC }> 
                        { `${codigo.Codigo} ( ${codigo.Recursos.length } )` }
                      </div>
                    )
                  }
                </div>
              </CardBody>
            </Card>
            <br />
            <Card>
              <CardHeader className="p-1">otro titulo de orden de compra</CardHeader>
              <CardBody>
                <div className="bg-info p-2">

                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* { console.log("DataTipoRecursoResumen  ", DataTipoRecursoResumen)} */}

      </div>
    );
  }
}

export default TblResumenCompDrag;
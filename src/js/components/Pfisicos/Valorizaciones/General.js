import React, { Component } from "react";
import { Card, CardHeader, CardBody, Collapse } from "reactstrap";
import { MdAdd, MdRemove } from "react-icons/md";
import ValorizacionGeneral from "./ComponentsValorizaciones/ValorizacionGeneral";

class General extends Component {
  constructor() {
    super();

    this.state = {
      // COLLAPSE DE BOTONES
      collapse: 1,
      ValRutaGeneral: {
        Anios: "/getValGeneralAnyos",
        Mes: "/getValGeneralPeriodos",
        ResumenComp: "/getValGeneralResumenPeriodo",
        Componentes: "/getValGeneralComponentes",
        Partidas: "/getValGeneralPartidas",
      },

      ValRutaPartidaNeva: {
        Anios: "/getValGeneraPartidaNuevaAnyos",
        Mes: "/getValGeneralPartidaNuevaPeriodos",
        ResumenComp: "/getValGeneralPartidaNuevaResumenPeriodo",
        Componentes: "/getValGeneralPartidaNuevaComponentes",
        Partidas: "/getValGeneralPartidaNuevaPartidas",
      },

      ValRutaMayorMetrado: {
        Anios: "/getValGeneraMayoresMetradoslAnyos",
        Mes: "/getValGeneralMayoresMetradosPeriodos",
        ResumenComp: "/getValGeneralMayoresMetradosResumenPeriodo",
        Componentes: "/getValGeneralMayoresMetradosComponentes",
        Partidas: "/getValGeneralMayoresMetradosPartidas",
      },
    };

    this.CollapseCard = this.CollapseCard.bind(this);
  }

  CollapseCard(valor) {
    let event = valor;

    // this.setState({ collapse: this.state.collapse === Number(event) ? 1 : Number(event) });
    this.setState({
      collapse: this.state.collapse === Number(event) ? 1995 : Number(event),
    });
  }

  render() {
    const { collapse } = this.state;
    return (
      <div>
        {/* LLAMA AL COMPONETE DEVALORIZACION GENERAL */}
        <Card>
          <CardHeader
            onClick={(e) => this.CollapseCard(1)}
            data-event={1}
            className="font-weight-bold prioridad"
          >
            VALORIZACION GENERAL
            <div className="float-right">
              {collapse === 1 ? <MdRemove size={20} /> : <MdAdd size={20} />}
            </div>
          </CardHeader>
          <Collapse isOpen={collapse === 1}>
            {collapse === 1 ? (
              <ValorizacionGeneral Ruta={this.state.ValRutaGeneral} />
            ) : (
              ""
            )}
          </Collapse>
        </Card>

        {/* LLAMA A OTRO COMPONETE DE PARTIDAS NUEVAS */}
        <Card className="mt-2">
          <CardHeader
            onClick={(e) => this.CollapseCard(2)}
            data-event={2}
            className="font-weight-bold prioridad"
          >
            VALORIZACION DE PARTIDAS NUEVAS
            <div className="float-right">
              {collapse === 2 ? <MdRemove size={20} /> : <MdAdd size={20} />}
            </div>
          </CardHeader>
          <Collapse isOpen={collapse === 2}>
            <CardBody>
              {collapse === 2 ? (
                <ValorizacionGeneral Ruta={this.state.ValRutaPartidaNeva} />
              ) : (
                ""
              )}
            </CardBody>
          </Collapse>
        </Card>

        {/* LLAMA AL COMPONENTE DE MAYORES METRADOS EN VALORIZACIONES */}
        <Card className="mt-2">
          <CardHeader
            onClick={(e) => this.CollapseCard(3)}
            data-event={3}
            className="font-weight-bold prioridad"
          >
            VALORIZACION DE MAYORES METRADOS
            <div className="float-right">
              {collapse === 3 ? <MdRemove size={20} /> : <MdAdd size={20} />}
            </div>
          </CardHeader>
          <Collapse isOpen={collapse === 3}>
            <CardBody>
              {collapse === 3 ? (
                <ValorizacionGeneral Ruta={this.state.ValRutaMayorMetrado} />
              ) : (
                ""
              )}
            </CardBody>
          </Collapse>
        </Card>
      </div>
    );
  }
}

export default General;

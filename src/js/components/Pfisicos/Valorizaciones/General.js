import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Collapse} from 'reactstrap';
import ValorizacionGeneral from './ComponentsValorizaciones/ValorizacionGeneral'
import ValPartidasNuevas from './ComponentsValorizaciones/ValPartidasNuevas'
import ValMayoresMetrados from './ComponentsValorizaciones/ValMayoresMetrados'

class General extends Component {
    constructor(){
        super();
        
        this.state = {
            // COLLAPSE DE BOTONES
            collapse: 1,
            ValRutaGeneral:[
                {
                    Anios:"/",
                    Mes:"/",
                    Resumen:"",
                    Componentes:"/"
                }
            ],

            ValRutaPartidaNeva:[
                {
                    Anios:"/",
                    Mes:"/",
                    Resumen:"",
                    Componentes:"/"
                }
            ],
            ValRutaPartidaNeva:[
                {
                    Anios:"/",
                    Mes:"/",
                    Resumen:"",
                    Componentes:"/"
                }
            ],
        }; 

        this.CollapseCard = this.CollapseCard.bind(this)
    }

    CollapseCard(valor){
        let event = valor
        
        // this.setState({ collapse: this.state.collapse === Number(event) ? 1 : Number(event) });
        this.setState({ collapse: this.state.collapse === Number(event) ? 1995 : Number(event) });
    }

    render() {
        const { collapse } = this.state
        return ( 
            
            <div>
                {/* LLAMA AL COMPONETE DEVALORIZACION GENERAL */}
                <Card>
                    <CardHeader onClick={e=>this.CollapseCard(1)} data-event={1} className="font-weight-bold">
                        VALORIZACION GENERAL {collapse === 1?'➖':'➕'}
                    </CardHeader>
                    <Collapse isOpen={collapse === 1}>
                        { collapse === 1 ? <ValorizacionGeneral /> : '' }
                    </Collapse>
                </Card>

                {/* LLAMA A OTRO COMPONETE DE PARTIDAS NUEVAS */}
                <Card className="mt-2">
                    <CardHeader onClick={e=>this.CollapseCard(2)} data-event={2}  className="font-weight-bold">
                        VALORIZACION DE PARTIDAS NUEVAS {collapse === 2?'➖':'➕'}
                    </CardHeader>
                    <Collapse isOpen={collapse === 2}>
                        <CardBody>
                            { collapse === 2 ? <ValPartidasNuevas />: '' }
                        </CardBody>                   
                    </Collapse>
                </Card>

                {/* LLAMA AL COMPONENTE DE MAYORES METRADOS EN VALORIZACIONES */}
                <Card className="mt-2">
                    <CardHeader onClick={e=>this.CollapseCard(3)} data-event={3} className="font-weight-bold">
                         VALORIZACION DE MAYORES METRADOS {collapse === 3?'➖':'➕'}
                    </CardHeader>
                    <Collapse isOpen={collapse === 3}>
                        <CardBody>
                            { collapse === 3 ? <ValMayoresMetrados /> : '' }
                        </CardBody>                   
                    </Collapse>
                </Card>
            </div>
        );
  }
}

export default General;
import React, { useState } from 'react'
import HistorialMetrados from './HistorialMetrados';
import { MdRemove, MdAdd } from 'react-icons/md';
import { CardHeader, Card, Collapse, CardBody } from 'reactstrap';

function MDHistorial() {
    const [MetDiarios, setMetDiarios] = useState();
    const [PartidasNuevas, setPartidasNuevas] = useState();
    const [MayoresMet, setMayoresMet] = useState();
    const [Collaps, setCollaps] = useState(1);

    const CollapsCard = (valor) => {
        var abrir = Collaps === valor?null:valor
        setCollaps(abrir)
    }
    
    if (sessionStorage.getItem("idacceso") !== null) {
        return (
            <div className="pb-3">
                <Card>
                    <a href="#" className="text-white text-decoration-none">
                        <CardHeader onClick={() => CollapsCard(1)} >
                            <b>METRADOS DIARIOS</b>
                            <div className="float-right">
                                {Collaps === 1 ? <MdRemove size={20} /> : <MdAdd size={20} />}
                            </div>
                        </CardHeader>
                    </a>
                    <Collapse isOpen={Collaps === 1}>
                        <CardBody>
                            {/* <HistorialMetrados rutas={MetDiarios} /> */}
                            {Collaps ===  1? <HistorialMetrados rutas={PartidasNuevas} /> : null}
                        </CardBody>
                    </Collapse>
                </Card>
            </div>
        );
    } else {
        return window.location.href = '/'
    }
}

export default MDHistorial

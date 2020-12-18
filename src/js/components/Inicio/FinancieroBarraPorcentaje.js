import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea } from '../Utils/Funciones';
import { Button, Input, Tooltip } from 'reactstrap';
export default ({ id_ficha }) => {
    useEffect(() => {
        fetchFinancieroAvance()

    }, []);

    const [FinancieroAvance, setFinancieroAvance] = useState({ financiero_avance_porcentaje: 0 });
    async function fetchFinancieroAvance() {
        const request = await axios.post(`${UrlServer}/getFinanciero`, {
            "id_ficha": id_ficha
        })
        setFinancieroAvance(request.data)
    }
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <div style={{
            width: '100%',
            height: '20px',
            textAlign: 'center'
        }}
        >
            <div style={{
                height: '2px',
                backgroundColor: '#4a4b4c',
                borderRadius: '5px',
                position: 'relative'
            }}
            >
                <div
                    style={{
                        width: `${FinancieroAvance.financiero_avance_porcentaje}%`,
                        height: '100%',
                        backgroundColor: "#ffa500",
                        borderRadius: '5px',
                        transition: 'all .9s ease-in',
                        position: 'absolute',

                    }}
                />
                <span
                    style={{
                        position: 'inherit',
                        top: '6px',
                        color: '#8caeda',
                        "font-size": "12px",
                        color: "#ffffff",
                        display: "flex",
                        justifyContent: "center"
                    }}
                    id={"FinancieroBarraPorcentaje-" + id_ficha}
                >
                    Financiero
                    <div
                        style={{
                            "font-size": "13px"
                        }}
                    >
                        -({Redondea(FinancieroAvance.financiero_avance_porcentaje)} %)
                    </div>

                </span>
                <Tooltip
                    placement={"bottom"}
                    isOpen={tooltipOpen}
                    target={"FinancieroBarraPorcentaje-" + id_ficha}
                    toggle={toggle}
                >
                    S/.{Redondea(FinancieroAvance.financiero_avance)}
                </Tooltip>
            </div>

        </div>
    );
}

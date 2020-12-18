import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { Redondea } from '../Utils/Funciones';
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
    return (
        <div style={{
            width: '100%',
            height: '20px',
            textAlign: 'center'
        }}
        >
            {/* {id_ficha} */}
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
                        // boxShadow: '0 0 8px #ff7400',
                        // boxShadow: '0 0 12px #3578bb',
                        // backgroundColor: FinancieroAvance.financiero_avance_porcentaje > 85
                        //     ?
                        //     '#ff7400'
                        //     :
                        //     FinancieroAvance.financiero_avance_porcentaje > 30
                        //         ? '#fb8420'
                        //         : '#f3984b',
                        // backgroundColor: FinancieroAvance.fisico_avance_porcentaje > 85 ? '#3578bb'
                        //     : FinancieroAvance.fisico_avance_porcentaje > 30 ? '#8caeda'
                        //         : '#cecece',
                        backgroundColor:"#ffa500",
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
                        // "font-weight": "700",
                        color: "#ffffff",
                        display: "flex",
                    }}
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
            </div>

        </div>
    );
}

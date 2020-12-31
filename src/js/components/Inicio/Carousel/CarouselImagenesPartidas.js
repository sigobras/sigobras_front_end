import React, {useEffect,useState}from 'react'
import { Spinner } from 'reactstrap';
import { UrlServer } from '../../Utils/ServerUrlConfig'
import axios from 'axios';
export default ({id_ficha}) =>{
    useEffect(() => {
        setLoading(true)
        fetchImagenes()
        setImagenActiva(0)
        return () => {            
        }
    }, [])
    const [Loading, setLoading] = useState(false);
    const [ImagenesObra, setImagenesObra] = useState([])
    const [FlagImagenes, setFlagImagenes] = useState(true)
    async function fetchImagenes() {
        const res = await axios.post(`${UrlServer}/getImagenesCurvaS`, {
            id_ficha,
            cantidad: 10,
        })
        if (res.data.length == 0) {
            setFlagImagenes(false)
        }else{
            setImagenesObra(res.data)
        }        
        setLoading(false)
        console.log(res.data);
    }
    const [ImagenActiva, setImagenActiva] = useState(0)
    return (
        <div>
            {
                FlagImagenes == false ? 
                <div 
                style={{
                    width: "700px",
                    display:"flex",
                    textAlign:"center",
                    justifyContent:"center",
                    alignItems:"center",
                    height: "500px",
                    maxHeight: "500px",
                }}
                >
                    <h1>No hay imagenes</h1>                        
                </div>
                :
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                    
                    <ol class="carousel-indicators">
                        {ImagenesObra.map((item, i) =>
                            <li data-target="#carouselExampleIndicators"
                                data-slide-to={i}
                                class={ImagenActiva == i && "active"}
                                onClick={() => setImagenActiva(i)}
                            ></li>
                        )}
                    </ol>
                    <div class="carousel-inner"
                        style={{
                            width: "700px",
                            height: "500px",
                            maxHeight: "500px",
                        }}

                    >
                        {
                            Loading &&
                            <div
                                style={{
                                    display:"flex",
                                    justifyContent:"center",
                                    alignItems:"center",
                                    height: "500px",
                                }}
                            >
                                <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />
                            </div>
                                    
                        }
                        {ImagenesObra.map((item, i) =>
                            <div class={ImagenActiva == i ? "carousel-item active" : "carousel-item"}>
                                
                                <img
                                    class="d-block img-fluid"
                                    src={UrlServer + item.imagen}
                                    alt="First slide"
                                    style={{
                                        height: "500px",
                                        "max-height": " 500px",
                                        "margin-left": "auto",
                                        "margin-right": "auto",
                                        // width: "100%",
                                    }}
                                />
                                <div
                                    class="carousel-caption d-none d-md-block"
                                    style={{
                                        "background-color": "#0000006b",
                                        "border-radius": "12px",
                                        bottom: "77px"
                                    }}
                                >
                                    <h5 >
                                        {item.item + " - " + item.partida_descripcion}</h5>
                                    <p>{item.descripcion}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <a
                        class="carousel-control-prev"
                        href="#"
                        role="button"
                        data-slide="prev"
                        onClick={() => {
                            console.log("ImagenActiva", ImagenActiva);
                            setImagenActiva(ImagenActiva > 0 ? ImagenActiva - 1 : ImagenesObra.length - 1)
                        }}
                    >
                        <span class="carousel-control-prev-icon" aria-hidden="true">
                        </span>
                        <span class="sr-only">
                            Previous
                            
                            </span>
                    </a>
                    
                    <a
                        class="carousel-control-next"
                        href="#"
                        role="button"
                        data-slide="next"
                        onClick={() => {
                            console.log("ImagenActiva", ImagenActiva);
                            setImagenActiva(ImagenActiva < ImagenesObra.length - 1 ? ImagenActiva + 1 : 0)
                        }}
                    >
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            }
        </div>
    )
}

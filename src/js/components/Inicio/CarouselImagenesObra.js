import React, { useState } from "react"
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
import { fechaFormatoClasico } from '../Utils/Funciones';
import { MdPhotoLibrary } from "react-icons/md";
export default ({ id_ficha, codigo }) => {
    const [modal, setModal] = useState(false);

    const toggle = () => {
        if (!modal) {
            fetchImagenesObra()
            setImagenActiva(0)
        }
        setModal(!modal)
    };
    const [ImagenesObra, setImagenesObra] = useState([])
    async function fetchImagenesObra() {
        const res = await axios.post(`${UrlServer}/getImagenesCurvaS`, {
            id_ficha,
            cantidad: 10,
        })
        setImagenesObra(res.data)
        console.log(res.data);
    }
    const [ImagenActiva, setImagenActiva] = useState(0)
    return (
        <div>
            <button
                className="btn btn-outline-info btn-sm mr-1"
                title="CURVA S"
                onClick={toggle}
            ><MdPhotoLibrary />
            </button>
            <Modal isOpen={modal} toggle={toggle} size="lg" >
                <ModalHeader toggle={toggle}>
                    <div style={{ display: "flex" }}>
                        Imagenes de {codigo}
                        <div
                            style={{
                                right: "48px",
                                position: "absolute"
                            }}
                        >
                            {ImagenesObra[ImagenActiva] && fechaFormatoClasico(ImagenesObra[ImagenActiva].fecha)}
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
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
                            {ImagenesObra.map((item, i) =>
                                <div class={ImagenActiva == i ? "carousel-item active" : "carousel-item"}>
                                    <img
                                        class="d-block img-fluid"
                                        src={UrlServer + item.imagen}
                                        alt="First slide"
                                        style={{
                                            height: "550px",
                                            " max-height": " 550px",
                                            "margin-left": "auto",
                                            "margin-right": "auto",
                                            width: "100%",
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
                            href="#carouselExampleIndicators"
                            role="button"
                            data-slide="prev"
                            onClick={() => {
                                console.log("ImagenActiva", ImagenActiva);
                                setImagenActiva(ImagenActiva > 0 ? ImagenActiva - 1 : ImagenesObra.length - 1)
                            }}
                        >
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a
                            class="carousel-control-next"
                            href="#carouselExampleIndicators"
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

                </ModalBody>
            </Modal>
        </div>
    )
}
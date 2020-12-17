import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react"
import {
    Modal, ModalBody, ModalHeader, ModalFooter, Button, Badge, UncontrolledPopover, PopoverHeader, PopoverBody, Input, Collapse, Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
} from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';
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
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === ImagenesObra.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? ImagenesObra.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = ImagenesObra.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.id_partida}
            >
                <img src={UrlServer + item.imagen} alt={"item.altText"} class="d-block img-fluid"
                    style={{
                        width: "auto",
                        height: "550px",
                        "max-height": "550px",
                    }}
                />

                <div class="carousel-caption d-none d-md-block" style={{
                    "background-color": "#0000006b",
                    "border-radius": "12px"
                }}>
                    <h3 >
                        {item.item + "-" + item.partida_descripcion}</h3>
                    <p>{item.descripcion}</p>
                </div>
            </CarouselItem>
        );
    });
    const [ImagenActiva, setImagenActiva] = useState(0)
    return (
        <div>
            <Button color="danger" onClick={toggle}>test</Button>
            <Modal isOpen={modal} toggle={toggle} size="lg" >
                <ModalHeader toggle={toggle}>Imagenes de {codigo}</ModalHeader>
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
                                setImagenActiva(ImagenActiva > 0 ? ImagenActiva - 1 : ImagenActiva)
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
                                setImagenActiva(ImagenActiva < ImagenesObra.length - 1 ? ImagenActiva + 1 : ImagenActiva)
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
import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { UrlServer } from "../../Utils/ServerUrlConfig";
import axios from "axios";
export default ({ id_ficha, setFechaPartida }) => {
  useEffect(() => {
    setLoading(true);
    fetchImagenes();
    setImagenActiva(0);
    return () => {};
  }, []);
  const [Loading, setLoading] = useState(false);
  const [ImagenesObra, setImagenesObra] = useState([]);
  const [FlagImagenes, setFlagImagenes] = useState(true);
  async function fetchImagenes() {
    const res = await axios.post(`${UrlServer}/getImagenesCurvaS`, {
      id_ficha,
      cantidad: 10,
    });
    if (res.data.length == 0) {
      setFlagImagenes(false);
    } else {
      setImagenesObra(res.data);
    }
    setLoading(false);
    if (res.data.length > 0) {
      setFechaPartida(res.data[0].fecha);
    }
  }
  const [ImagenActiva, setImagenActiva] = useState(0);
  return (
    <div>
      {FlagImagenes == false ? (
        <div
          style={{
            width: "700px",
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            height: "500px",
            maxHeight: "500px",
          }}
        >
          <h1>No hay imagenes</h1>
        </div>
      ) : (
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-ride="carousel"
        >
          <ol className="carousel-indicators">
            {ImagenesObra.map((item, i) => (
              <li
                key={i}
                data-target="#carouselExampleIndicators"
                data-slide-to={i}
                className={ImagenActiva == i ? "active" : ""}
                onClick={() => {
                  setImagenActiva(i);
                  setFechaPartida(ImagenesObra[i].fecha);
                }}
              ></li>
            ))}
          </ol>
          <div
            className="carousel-inner"
            style={{
              width: "700px",
              height: "500px",
              maxHeight: "500px",
            }}
          >
            {Loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "500px",
                }}
              >
                <Spinner
                  style={{ width: "3rem", height: "3rem" }}
                  type="grow"
                />
              </div>
            )}
            {ImagenesObra.map((item, i) => (
              <div
                key={i}
                className={
                  ImagenActiva == i ? "carousel-item active" : "carousel-item"
                }
              >
                <img
                  className="d-block img-fluid"
                  src={item.imagen}
                  alt="First slide"
                  style={{
                    height: "500px",
                    maxHeight: " 500px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    // width: "100%",
                  }}
                />
                <div
                  className="carousel-caption d-none d-md-block"
                  style={{
                    backgroundColor: "#0000006b",
                    borderRadius: "12px",
                    bottom: "77px",
                  }}
                >
                  <h5>{item.item + " - " + item.partida_descripcion}</h5>
                  <p>{item.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            className="carousel-control-prev"
            href="#"
            role="button"
            data-slide="prev"
            onClick={() => {
              var imagenActiva =
                ImagenActiva > 0 ? ImagenActiva - 1 : ImagenesObra.length - 1;
              setImagenActiva(imagenActiva);
              setFechaPartida(ImagenesObra[imagenActiva].fecha);
            }}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Previous</span>
          </a>

          <a
            className="carousel-control-next"
            href="#"
            role="button"
            data-slide="next"
            onClick={() => {
              var imagenActiva =
                ImagenActiva < ImagenesObra.length - 1 ? ImagenActiva + 1 : 0;
              setImagenActiva(imagenActiva);
              setFechaPartida(ImagenesObra[imagenActiva].fecha);
            }}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      )}
    </div>
  );
};

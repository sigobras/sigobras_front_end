import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import axios from "axios";
import { FaSuperpowers, FaCircle } from "react-icons/fa";
import {
  MdFlashOn,
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdVisibility,
  MdMonetizationOn,
  MdWatch,
  MdLibraryBooks,
  MdCancel,
  MdArrowDropDownCircle,
} from "react-icons/md";
import { TiWarning } from "react-icons/ti";
import {
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  CardHeader,
  CardBody,
  Button,
  Input,
  UncontrolledPopover,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Tooltip,
} from "reactstrap";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort, fechaFormatoClasico } from "../Utils/Funciones";
import ImagenesLabels from "./ImagenesLabels";

export default ({ partida }) => {
  //modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      cargarImagenes();
    }
    setModal(!modal);
  };
  //imagenes
  const [Imagenes, setImagenes] = useState([]);
  const [ImagenSeleccionada, setImagenSeleccionada] = useState(0);
  async function cargarImagenes() {
    setLoading(true);
    setFlagImagenes(true);
    var res = await axios.get(
      `${UrlServer}/v1/partidasImagenes/${partida.id_partida}`
    );
    setImagenes(res.data);
    console.log("imagenes", res.data);
    if (res.data.length == 0) {
      setFlagImagenes(false);
    }
    setLoading(false);
  }
  //otros
  const [Loading, setLoading] = useState(false);
  const [FlagImagenes, setFlagImagenes] = useState(true);
  const refLabels = useRef();
  function recargarLabels() {
    console.log("recargando", refLabels);
    refLabels.current.recargar();
  }
  return (
    <div>
      <span onClick={toggle} style={{ cursor: "pointer" }}>
        {partida.descripcion}
      </span>

      <Modal
        isOpen={modal}
        toggle={toggle}
        className="custom-modal-dialog"
        contentClassName="custom-modal-content"
      >
        <ModalBody>
          <div
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "3px",
              right: "13px",
              fontSize: "23px",
            }}
            onClick={toggle}
          >
            X
          </div>
          <div className="modal-imagenes">
            <div className="fotos">
              <div
                className="carousel slide carousel-fade carousel-thumbnails"
                style={{ position: "relative", height: "100%" }}
              >
                <div
                  className="carousel-inner"
                  style={{ position: "relative", height: "100%" }}
                >
                  {Imagenes.map((item, i) => (
                    <div
                      key={i}
                      className={
                        ImagenSeleccionada == i
                          ? "carousel-item active"
                          : "carousel-item"
                      }
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <img
                        className="d-block img-fluid"
                        src={UrlServer + item.imagen}
                        alt="First slide"
                        style={{
                          // height: "500px",
                          maxHeight: "650px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <a
                  className="carousel-control-prev"
                  href="#"
                  role="button"
                  data-slide="prev"
                  onClick={() => {
                    var ImagenSeleccionadaTemp =
                      ImagenSeleccionada > 0
                        ? ImagenSeleccionada - 1
                        : Imagenes.length - 1;
                    setImagenSeleccionada(ImagenSeleccionadaTemp);
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
                    var ImagenSeleccionadaTemp =
                      ImagenSeleccionada < Imagenes.length - 1
                        ? ImagenSeleccionada + 1
                        : 0;
                    setImagenSeleccionada(ImagenSeleccionadaTemp);
                  }}
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
            <div className="datos">
              <div style={{ fontWeight: "700", textAlign: "left" }}>
                <span>{partida.item}</span> <span>{partida.descripcion}</span>
              </div>
              {Imagenes.length > 0 && (
                <>
                  <div>{Imagenes[ImagenSeleccionada].observacion}</div>
                  <div style={{ textAlign: "right" }}>
                    Imagen tomada:{" "}
                    {fechaFormatoClasico(Imagenes[ImagenSeleccionada].fecha)}
                  </div>
                  <hr style={{ background: "white" }} />
                  <ImagenesLabels
                    ImagenData={Imagenes[ImagenSeleccionada]}
                    recargar={recargarLabels}
                  />
                  <ImagenesLabelsListado
                    key={JSON.stringify(Imagenes[ImagenSeleccionada])}
                    ImagenData={Imagenes[ImagenSeleccionada]}
                    ref={refLabels}
                  />
                </>
              )}
            </div>
            <div className="indicadores">
              <ol
                className="carousel-indicators"
                style={{
                  justifyContent: "flex-start",
                  width: "36px",
                  margin: "auto",
                  transform: `translate3d(${
                    ImagenSeleccionada * -46
                  }px, 0px, 0px)`,
                  marginBottom: "20px",
                }}
              >
                {Imagenes.map((item, i) => (
                  <img
                    key={i}
                    onClick={() => {
                      setImagenSeleccionada(i);
                    }}
                    className="d-block"
                    src={
                      UrlServer +
                      item.imagen +
                      "?width=100&height=100&crop=cover"
                    }
                    style={{
                      height: "36px",
                      marginRight: "5px",
                      marginLeft: "5px",
                      cursor: "pointer",
                      filter:
                        ImagenSeleccionada == i
                          ? "brightness(1)"
                          : "brightness(0.5)",
                    }}
                  />
                ))}
              </ol>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
const ImagenesLabelsListado = forwardRef(({ ImagenData }, ref) => {
  useImperativeHandle(ref, () => ({
    recargar() {
      console.log("recarga interna");
      cargarLabels();
    },
  }));
  useEffect(() => {
    console.log("ImagenData", ImagenData);
    if (ImagenData) {
      cargarLabels();
    }
  }, []);
  const [Labels, setLabels] = useState([]);
  async function cargarLabels() {
    var res = await axios.get(`${UrlServer}/v1/imagenesLabelsAsignadas`, {
      params: {
        id_partidaImagen:
          ImagenData.tipo == "partidaImagen" ? ImagenData.id : null,
        id_AvanceActividades:
          ImagenData.tipo == "avanceActividades" ? ImagenData.id : null,
      },
    });
    if (Array.isArray(res.data)) setLabels(res.data);
  }
  const [tooltipOpen, setTooltipOpen] = useState(0);
  const toggle = (id) => {
    if (id == tooltipOpen) {
      setTooltipOpen(0);
    } else {
      setTooltipOpen(id);
    }
  };
  function hexToRgb(hex) {
    if (hex == undefined || hex == "") {
      hex = "#000000";
    }
    hex = hex.replace("#", "");
    hex = hex.padStart(6, "0");
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return {
        r: 0,
        g: 0,
        b: 0,
        h: 0,
        s: 0,
        l: 0,
      };
    }

    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    (r /= 255), (g /= 255), (b /= 255);
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    h = Math.round(360 * h);
    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    var respuesta = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      h,
      s,
      l,
    };
    return respuesta;
  }
  return (
    <div>
      {Labels.map((item, i) => [
        <Button
          key={i + "1"}
          type="button"
          style={{
            borderRadius: "13px",
            "--perceived-lightness":
              "calc((var(--label-r)*0.2126 + var(--label-g)*0.7152 + var(--label-b)*0.0722)/255)",
            "--lightness-switch":
              " max(0,min(calc((var(--perceived-lightness) - var(--lightness-threshold))*-1000),1))",
            padding: " 0 10px",
            lineheight: " 22px!important",
            "--lightness-threshold": " 0.6",
            "--background-alpha": " 0.18",
            "--border-alpha": " 0.3",
            "--lighten-by":
              " calc((var(--lightness-threshold) - var(--perceived-lightness))*100*var(--lightness-switch))",
            background:
              " rgba(var(--label-r),var(--label-g),var(--label-b),var(--background-alpha))",
            color:
              " hsl(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%))",
            bordercolor:
              " hsla(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%),var(--border-alpha))",
            "--label-r": hexToRgb(item.color).r,
            "--label-g": hexToRgb(item.color).g,
            "--label-b": hexToRgb(item.color).b,
            "--label-h": hexToRgb(item.color).h,
            "--label-s": hexToRgb(item.color).s,
            "--label-l": hexToRgb(item.color).l,
            margin: "5px",
          }}
          id={"Tooltip-" + item.id}
        >
          {item.nombre}
        </Button>,
        <Tooltip
          key={i + "2"}
          placement={"bottom"}
          isOpen={tooltipOpen == item.id}
          target={"Tooltip-" + item.id}
          toggle={() => toggle(item.id)}
        >
          {item.descripcion}
        </Tooltip>,
      ])}
    </div>
  );
});

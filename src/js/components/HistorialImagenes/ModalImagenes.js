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
import parse from "html-react-parser";
import { MdScreenRotation } from "react-icons/md";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort, fechaFormatoClasico } from "../Utils/Funciones";
import ImagenesLabels from "./ImagenesLabels";

export default ({ partida, anyo, mes, imagenes_labels_id }) => {
  //permisos
  const [Permisos, setPermisos] = useState(false);
  async function cargarPermiso(nombres_clave) {
    const res = await axios.get(`${UrlServer}/v1/interfazPermisos/activo`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_ficha: sessionStorage.getItem("idobra"),
        nombres_clave,
      },
    });
    var tempList = [];
    var tempArray = res.data;
    for (const key in tempArray) {
      tempList[key] = res.data[key];
    }
    setPermisos(tempList);
  }
  //modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      cargarImagenes();
      cargarPermiso("historialimagenes_eliminar_imagen");
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
      `${UrlServer}/v1/partidasImagenes/${partida.id_partida}`,
      {
        params: {
          anyo,
          mes,
          imagenes_labels_id,
        },
      }
    );
    setImagenes(res.data);
    if (res.data.length == 0) {
      setFlagImagenes(false);
    }
    setLoading(false);
  }
  async function eliminarImagen(tipo, id) {
    if (
      confirm(
        "Esta accion es irreversible y se perderan datos , estas seguro de eliminar esta imagen?"
      )
    ) {
      try {
        var res = await axios.delete(`${UrlServer}/v1/partidasImagenes/`, {
          params: {
            tipo,
            id,
          },
        });
        alert("Eliminado exitosamente");
        cargarImagenes();
      } catch (error) {
        alert("Ocurrio un error");
      }
    }
  }
  //otros
  const [Loading, setLoading] = useState(false);
  const [FlagImagenes, setFlagImagenes] = useState(true);
  const refLabels = useRef();
  function recargarLabels() {
    refLabels.current.recargar();
  }
  const [ImagenPosition, setImagenPosition] = useState(0);
  function girarImagen() {
    setImagenPosition(ImagenPosition + 90);
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
                        src={item.imagen}
                        alt="First slide"
                        style={{
                          // height: "500px",
                          maxHeight: "650px",
                          marginLeft: "auto",
                          marginRight: "auto",
                          transform: `rotate( ${ImagenPosition}deg )`,
                        }}
                      />
                    </div>
                  ))}
                  <MdScreenRotation
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      bottom: "0px",
                      right: "50%",
                    }}
                    onClick={() => girarImagen()}
                  />
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
              <div
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: "1px",
                  right: "1px",
                  fontSize: "23px",
                }}
                onClick={toggle}
              >
                X
              </div>
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
                  <div className="d-flex" style={{ textAlign: "right" }}>
                    <span>Crear nueva etiqueta</span>
                    <span style={{ paddingLeft: "20px" }}>
                      <ImagenesLabels
                        ImagenData={Imagenes[ImagenSeleccionada]}
                        recargar={recargarLabels}
                      />
                    </span>
                  </div>

                  <hr style={{ background: "white" }} />
                  <ImagenesLabelsListado
                    key={JSON.stringify(Imagenes[ImagenSeleccionada])}
                    ImagenData={Imagenes[ImagenSeleccionada]}
                    ref={refLabels}
                  />
                  <hr style={{ background: "white" }} />
                  <ComentariosInterfaz
                    key={ImagenSeleccionada}
                    ImagenData={Imagenes[ImagenSeleccionada]}
                  />
                </>
              )}
              {Permisos["historialimagenes_eliminar_imagen"] == 1 && (
                <div
                  style={{ position: "absolute", bottom: "0px", right: "0px" }}
                >
                  <Button
                    color="danger"
                    onClick={() =>
                      eliminarImagen(
                        Imagenes[ImagenSeleccionada].tipo,
                        Imagenes[ImagenSeleccionada].id
                      )
                    }
                  >
                    Eliminar Imagen
                  </Button>
                </div>
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
                    src={item.imagen}
                    style={{
                      height: "36px",
                      marginRight: "5px",
                      marginLeft: "5px",
                      cursor: "pointer",
                      filter:
                        ImagenSeleccionada == i
                          ? "brightness(1)"
                          : "brightness(0.3)",
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
      cargarLabels();
    },
  }));
  useEffect(() => {
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
      {Labels.map((item, i) => (
        <>
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
          </Button>
          <Tooltip
            key={i + "2"}
            placement={"bottom"}
            isOpen={tooltipOpen == item.id}
            target={"Tooltip-" + item.id}
            toggle={() => toggle(item.id)}
          >
            <div>{item.descripcion}</div>
            <div>
              {`Asignado por: ${item.cargo_nombre} ${item.usuario_nombre} ${item.usuario_apellido_paterno}`}
            </div>
          </Tooltip>
        </>
      ))}
    </div>
  );
});
function ComentariosInterfaz({ ImagenData }) {
  useEffect(() => {
    cargarComentarios();
  }, []);
  const [Comentarios, setComentarios] = useState([]);
  async function cargarComentarios() {
    var res = await axios.get(`${UrlServer}/v1/imagenesComentarios`, {
      params: {
        id_partidaImagen:
          ImagenData.tipo == "partidaImagen" ? ImagenData.id : null,
        id_AvanceActividades:
          ImagenData.tipo == "avanceActividades" ? ImagenData.id : null,
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    setComentarios(res.data);
  }
  const [ComentarioText, setComentarioText] = useState("");
  function handleInputChange(e) {
    var value = document.getElementById("comentario-input").innerHTML;
    var onlyText = value.replace(/<br>/g, "");
    if (onlyText) {
      setComentarioText(value);
    } else {
      document.getElementById("comentario-input").innerHTML = "";
    }
  }
  async function guardarComentario() {
    try {
      if (ComentarioText) {
        var res = await axios.post(`${UrlServer}/v1/imagenesComentarios`, {
          partidasimagenes_id_partidaImagen:
            ImagenData.tipo == "partidaImagen" ? ImagenData.id : null,
          avanceactividades_id_AvanceActividades:
            ImagenData.tipo == "avanceActividades" ? ImagenData.id : null,
          accesos_id: sessionStorage.getItem("idacceso"),
          comentario: ComentarioText,
        });
        document.getElementById("comentario-input").innerHTML = "";
        cargarComentarios();
      }
    } catch (error) {
      alert("Ocurrio un error");
    }
  }
  return (
    <div
      style={{
        overflowY: "auto",
        maxHeight: "500px",
      }}
    >
      <div
        style={{
          background: "#3a3b3c",
          borderRadius: "19px",
          padding: "8px 12px",
          color: "white",
          marginTop: "10px",
          marginBottom: "10px",
          overflowWrap: "anywhere",
        }}
        className="comentario-input"
        id="comentario-input"
        contentEditable={true}
        data-placeholder="Escribe un comentario"
        onInput={(event) => {
          if (event.keyCode != 13) {
            handleInputChange(event);
          }
        }}
        onKeyDown={(event) => {
          if (event.keyCode == 13) {
            if (!event.shiftKey) {
              guardarComentario();
            }
          }
        }}
      ></div>
      {Comentarios.map((item, i) => (
        <div
          style={{
            background: "#3a3b3c",
            borderRadius: "19px",
            padding: "8px 12px",
            color: "white",
            marginTop: "10px",
            marginBottom: "10px",
            overflowWrap: "anywhere",
          }}
        >
          <div
            style={{ fontWeight: "500", fontSize: "10px", color: "#939596" }}
          >{`${item.cargo_nombre} ${item.usuario_nombre} ${item.usuario_apellido_paterno}`}</div>
          <div>{parse(item.comentario || " ")}</div>
        </div>
      ))}
    </div>
  );
}

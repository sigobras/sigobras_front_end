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
} from "reactstrap";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea, mesesShort } from "../Utils/Funciones";

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
    if (res.data.length == 0) {
      setFlagImagenes(false);
    }
    setLoading(false);
  }
  //otros
  const [Loading, setLoading] = useState(false);
  const [FlagImagenes, setFlagImagenes] = useState(true);
  return (
    <div>
      <span onClick={toggle} style={{ cursor: "pointer" }}>
        {partida.descripcion}
      </span>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
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
              <div className="carousel slide carousel-fade carousel-thumbnails">
                <div
                  className="carousel-inner"
                  style={{
                    width: "700px",
                    height: "500px",
                    maxHeight: "500px",
                  }}
                >
                  {Imagenes.map((item, i) => (
                    <div
                      key={i}
                      className={
                        ImagenSeleccionada == i
                          ? "carousel-item active"
                          : "carousel-item"
                      }
                    >
                      <img
                        className="d-block img-fluid"
                        src={UrlServer + item.imagen}
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
                        <h5>{partida.item + " - " + partida.descripcion}</h5>
                        <p>{item.observacion}</p>
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
                <ol className="carousel-indicators">
                  {Imagenes.map((item, i) => (
                    <li
                      key={i}
                      className={ImagenSeleccionada == i ? "active" : ""}
                      onClick={() => {
                        setImagenSeleccionada(i);
                      }}
                    >
                      <img
                        className="d-block w-100"
                        src={
                          UrlServer +
                          item.imagen +
                          "?width=100&height=100&crop=cover"
                        }
                      />
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

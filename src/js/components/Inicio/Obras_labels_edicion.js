import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FaTag, FaCheckCircle, FaMinus, FaSearch } from "react-icons/fa";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  UncontrolledPopover,
  PopoverBody,
  Input,
} from "reactstrap";
import axios from "axios";

import { UrlServer } from "../Utils/ServerUrlConfig";

import "./Obras_labels.css";

export default ({ id_ficha, recargarObraLabels, codigo }) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    if (!modal) {
      fetchFichasLabels();
    }
    setModal(!modal);
  };
  const [Formulario, setFormulario] = useState(false);
  const toggleFormulario = () => setFormulario(!Formulario);

  const [FichasLabels, setFichasLabels] = useState([]);
  const [TextoBuscar, setTextoBuscar] = useState("");
  async function fetchFichasLabels() {
    const res = await axios.get(`${UrlServer}/v1/obrasLabels`, {
      params: {
        id_ficha,
        texto_buscar: TextoBuscar,
      },
    });
    setFichasLabels(res.data);
  }

  const FormularioPaletaColores = [
    "#b60205",
    "#d93f0b",
    "#fbca04",
    "#0e8a16",
    "#006b75",
    "#1d76db",
    "#0052cc",
    "#5319e7",
  ];
  const [FormularioDatos, setFormularioDatos] = useState({
    nombre: "",
    descripcion: "",
    color: FormularioPaletaColores[0],
  });
  const handleInputChange = (event) => {
    setFormularioDatos({
      ...FormularioDatos,
      [event.target.name]: event.target.value,
    });
  };
  async function enviarDatos(event) {
    event.preventDefault();
    const res = await axios.post(
      `${UrlServer}/v1/obrasLabels`,
      FormularioDatos
    );
    if (res.status == 200) {
      alert("creacion exitosa");
    }

    fetchFichasLabels();
  }
  function setRandomColor() {
    setFormularioDatos({
      ...FormularioDatos,
      color:
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
    });
  }
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
  //asignacion de labels
  async function asignarLabel(id_label) {
    const res = await axios.post(`${UrlServer}/FichasAsignarLabels`, {
      id_ficha,
      id_label,
    });
    RefLabels[id_label].recarga();
    recargarObraLabels(id_ficha);
  }
  const [RefLabels, setRefLabels] = useState([]);
  useEffect(() => {
    fetchFichasLabels();
  }, [TextoBuscar]);
  return (
    <div>
      <button
        className="btn btn-outline-info btn-sm mr-1"
        title="labels"
        onClick={toggleModal}
      >
        <FaTag />
      </button>
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader>
          <div
            style={{
              display: "flex",
            }}
          >
            <div>Etiquetas de la obra {codigo}</div>
            {Formulario ? (
              <Button
                style={{
                  position: "absolute",
                  right: "14px",
                }}
                outline
                color="danger"
                onClick={toggleFormulario}
              >
                Cancelar
              </Button>
            ) : (
              <Button
                style={{
                  position: "absolute",
                  right: "14px",
                }}
                onClick={toggleFormulario}
                outline
                color="success"
              >
                Nueva etiqueta
              </Button>
            )}
          </div>
        </ModalHeader>
        <ModalBody>
          {Formulario && (
            <div>
              <form onSubmit={enviarDatos}>
                <Button
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
                    "--label-r": hexToRgb(FormularioDatos.color)
                      ? hexToRgb(FormularioDatos.color).r
                      : 1,
                    "--label-g": hexToRgb(FormularioDatos.color)
                      ? hexToRgb(FormularioDatos.color).g
                      : 1,
                    "--label-b": hexToRgb(FormularioDatos.color)
                      ? hexToRgb(FormularioDatos.color).b
                      : 1,
                    "--label-h": hexToRgb(FormularioDatos.color)
                      ? hexToRgb(FormularioDatos.color).h
                      : 1,
                    "--label-s": hexToRgb(FormularioDatos.color)
                      ? hexToRgb(FormularioDatos.color).s
                      : 1,
                    "--label-l": hexToRgb(FormularioDatos.color)
                      ? hexToRgb(FormularioDatos.color).l
                      : 1,
                  }}
                >
                  {FormularioDatos.nombre || "Label Preview"}
                </Button>
                <div className="formulario-labels">
                  <dl>
                    <dt>
                      <label>Nombre de etiqueta</label>
                    </dt>
                    <dd>
                      <Input
                        type="text"
                        maxlength="45"
                        autocomplete="off"
                        required
                        placeholder="Nombre de etiqueta"
                        onChange={handleInputChange}
                        name="nombre"
                        style={{
                          "background-color": "#171819",
                          color: " #ffffff",
                        }}
                      />
                    </dd>
                  </dl>

                  <dl>
                    <dt>
                      <label>Descripción</label>
                    </dt>
                    <dd>
                      <Input
                        type="textarea"
                        id="label-description-"
                        name="label[description]"
                        placeholder="Description (optional)"
                        aria-describedby="label--description-error"
                        maxlength="250"
                        onChange={handleInputChange}
                        name="descripcion"
                        style={{
                          "background-color": "#171819",
                          color: " #ffffff",
                        }}
                      />
                    </dd>
                  </dl>

                  <dl>
                    <dt>
                      <label for="label-color-" class="f5">
                        Color
                      </label>
                    </dt>
                    <dd class="d-flex">
                      <Button
                        type="button"
                        aria-label="Get a new color"
                        style={{
                          backgroundColor: FormularioDatos.color,
                          marginRight: "5px",
                        }}
                        onClick={() => setRandomColor()}
                      >
                        <GiPerspectiveDiceSixFacesRandom size="25" />
                      </Button>
                      <div>
                        <Input
                          maxlength="7"
                          id="PopoverLegacy"
                          type="text"
                          style={{
                            "background-color": "#171819",
                            color: "#ffffff",
                            width: "80px",
                          }}
                          name="color"
                          value={FormularioDatos.color}
                          onChange={handleInputChange}
                        >
                          {FormularioDatos.color || " "}
                        </Input>

                        <UncontrolledPopover
                          trigger="legacy"
                          placement="bottom"
                          target="PopoverLegacy"
                        >
                          <PopoverBody>
                            <div class="d-flex paleta-color">
                              {FormularioPaletaColores.map((item) => (
                                <button
                                  type="button"
                                  style={{
                                    backgroundColor: item,
                                  }}
                                  onClick={handleInputChange}
                                  name="color"
                                  value={item}
                                ></button>
                              ))}
                            </div>
                          </PopoverBody>
                        </UncontrolledPopover>
                      </div>
                    </dd>
                  </dl>
                  <dl>
                    <dt>
                      <label>Opciones</label>
                    </dt>
                    <dd>
                      <Button outline color="success" type="submit">
                        Crear etiqueta
                      </Button>
                    </dd>
                  </dl>
                </div>
              </form>
            </div>
          )}
          <div
            style={{
              display: "flex",
            }}
          >
            <Button>
              <FaSearch size="20" />
            </Button>
            <Input
              type="text"
              onChange={(e) => setTextoBuscar(e.target.value)}
            />
          </div>
          <table
            className="table"
            style={{
              width: "700px",
            }}
          >
            <thead>
              <tr>
                <th>ETIQUETAS</th>
                <th>DESCRIPCION</th>
              </tr>
            </thead>
            <tbody>
              {FichasLabels.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => asignarLabel(item.id)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <td
                    style={{
                      display: "flex",
                    }}
                  >
                    <LabelAsignada
                      id_ficha={id_ficha}
                      id_label={item.id}
                      ref={(ref) => {
                        var clone = RefLabels;
                        clone[item.id] = ref;
                        setRefLabels(clone);
                      }}
                    />

                    <Button
                      // outline
                      style={{
                        borderRadius: "13px",
                        padding: " 0 10px",
                        "--perceived-lightness":
                          "calc((var(--label-r)*0.2126 + var(--label-g)*0.7152 + var(--label-b)*0.0722)/255)",
                        "--lightness-switch":
                          " max(0,min(calc((var(--perceived-lightness) - var(--lightness-threshold))*-1000),1))",
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
                      }}
                    >
                      {item.nombre}
                    </Button>
                  </td>
                  <td>{item.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
      </Modal>
    </div>
  );
};
const LabelAsignada = forwardRef(({ id_ficha, id_label }, ref) => {
  useImperativeHandle(ref, () => ({
    recarga() {
      fetchEstadoAsignado();
    },
  }));
  useEffect(() => {
    fetchEstadoAsignado();
  }, []);
  const [EstadoAsignado, setEstadoAsignado] = useState(false);
  async function fetchEstadoAsignado() {
    const res = await axios.get(`${UrlServer}/v1/obrasLabels/obras/cantidad`, {
      params: {
        id_ficha,
        id_label,
      },
    });
    setEstadoAsignado(res.data.cantidad);
  }
  return EstadoAsignado ? (
    <FaCheckCircle
      color="#ffffff"
      size="15"
      style={{
        margin: "10px",
      }}
    />
  ) : (
    <FaMinus
      color="#ffffff"
      size="15"
      style={{
        margin: "10px",
      }}
    />
  );
});

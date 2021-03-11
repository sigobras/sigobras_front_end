import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Modal,
  Card,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  UncontrolledPopover,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import ModalNuevoDocumento from "./ModalNuevoDocumento";
import axios from "axios";
import { UrlServer } from "../Utils/ServerUrlConfig";
import {
  FaCloudDownloadAlt,
  FaCheckCircle,
  FaRegWindowClose,
  FaCloudUploadAlt,
  FaPaperclip,
} from "react-icons/fa";
import ModalRespuesta from "./ModalRespuesta";
import "./index.css";
import { socket } from "../Utils/socket";

export default () => {
  useEffect(() => {
    toggleNavSeleccionado("RECIBIDOS");
    fetchUsuarioData();
    socketIni();
  }, []);
  function socketIni() {
    socket.on(
      "gestion_documentaria_" + sessionStorage.getItem("idobra"),
      (data) => {
        // console.log("llegada de gestion_documentaria");
        fetchDocumentosRecibidos();
      }
    );
  }
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const request = await axios.post(`${UrlServer}/getDatosUsuario`, {
      id_acceso: sessionStorage.getItem("idacceso"),
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setUsuarioData(request.data);
  }
  const [NavSeleccionado, setNavSeleccionado] = useState("");
  function toggleNavSeleccionado(nav) {
    if (nav == "RECIBIDOS") {
      fetchDocumentosRecibidos();
      // fetchDocumentosRecibidosRespuestas()
    }
    if (nav == "ENVIADOS") {
      fetchDocumentosEnviados();
    }
    setNavSeleccionado(nav);
  }
  const [DocumentosRecibidos, setDocumentosRecibidos] = useState([]);
  async function fetchDocumentosRecibidos() {
    var res = await axios.get(`${UrlServer}/gestiondocumentaria_recibidos`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_ficha: sessionStorage.getItem("idobra"),
      },
    });
    if (Array.isArray(res.data)) {
      setDocumentosRecibidos(res.data);
    }
  }

  const [DocumentosEnviados, setDocumentosEnviados] = useState([]);
  async function fetchDocumentosEnviados() {
    var res = await axios.get(`${UrlServer}/gestiondocumentaria_enviados`, {
      params: {
        id_acceso: sessionStorage.getItem("idacceso"),
      },
    });
    setDocumentosEnviados(res.data);
  }
  function onChangeDocumentosEnviados(documento) {
    if (documento.id == DocumentoEnviadoSeleccionado.id) {
      setDocumentoEnviadoSeleccionado({});
    } else {
      setDocumentoEnviadoSeleccionado(documento);
      fetchDocumentosEnviadosUsuarios(documento.id);
      socketMensaje(documento.id);
    }
  }
  function socketMensaje(id_mensaje) {
    socket.on("gestion_documentaria_mensaje" + id_mensaje, (data) => {
      console.log("llegada de gestion_documentaria_mensaje");
      fetchDocumentosEnviadosUsuarios(id_mensaje);
    });
  }
  const [
    DocumentoEnviadoSeleccionado,
    setDocumentoEnviadoSeleccionado,
  ] = useState(0);

  const [DocumentosEnviadosUsuarios, setDocumentosEnviadosUsuarios] = useState(
    []
  );
  async function fetchDocumentosEnviadosUsuarios(id) {
    var res = await axios.get(
      `${UrlServer}/gestiondocumentaria_enviados_usuarios`,
      {
        params: {
          id,
        },
      }
    );
    setDocumentosEnviadosUsuarios(res.data);
  }
  function DescargarArchivoEnviado(data) {
    const url = data;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", data, "target", "_blank");
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
  }
  function socketDescargarArchivoRecibido(id_mensaje) {
    socket.emit("gestion_documentaria_mensaje_principal", {
      id_mensaje,
    });
  }
  function DescargarArchivoRecibido(
    data,
    gestiondocumentaria_mensajes_id,
    receptor_cargo
  ) {
    if (confirm("Desea descargar el archivo?")) {
      if (UsuarioData.cargo_nombre == receptor_cargo) {
        actualizarVisto(gestiondocumentaria_mensajes_id);
      }
      const url = data;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data, "target", "_blank");
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      socketDescargarArchivoRecibido(gestiondocumentaria_mensajes_id);
    }
  }
  async function actualizarVisto(gestiondocumentaria_mensajes_id) {
    try {
      var res = await axios.put(`${UrlServer}/gestiondocumentaria_receptores`, {
        id_ficha: sessionStorage.getItem("idobra"),
        id_acceso: sessionStorage.getItem("idacceso"),
        gestiondocumentaria_mensajes_id: gestiondocumentaria_mensajes_id,
      });
    } catch (error) {
      alert("ocurrio un problema");
    }
  }
  const [modal, setModal] = useState(false);
  const [ModalIdEmisor, setModalIdEmisor] = useState(0);
  const [ModalIdMensaje, setModalIdMensaje] = useState(0);
  const [ModalIdUsuario, setModalIdUsuario] = useState("");
  const toggleModal = (id_mensaje, id_emisor, usuario_nombre) => {
    if (!modal) {
      setModalIdEmisor(id_emisor);
      setModalIdMensaje(id_mensaje);
      setModalIdUsuario(usuario_nombre);
    }
    setModal(!modal);
  };
  function fechaFormatoClasico(fecha) {
    var fechaTemp = "";
    if (fecha) {
      fechaTemp = fecha.split("-");
    } else {
      return fecha;
    }
    if (fechaTemp.length == 3) {
      return fechaTemp[2] + "-" + fechaTemp[1] + "-" + fechaTemp[0];
    } else {
      return fecha;
    }
  }
  const [RefCheckBox, setRefCheckBox] = useState([]);
  return (
    <div
      style={{
        position: "relative",
        paddingTop: "12px",
      }}
    >
      <Nav tabs>
        <NavItem>
          <NavLink
            active={NavSeleccionado == "RECIBIDOS"}
            onClick={() => toggleNavSeleccionado("RECIBIDOS")}
          >
            RECIBIDOS
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={NavSeleccionado == "ENVIADOS"}
            onClick={() => toggleNavSeleccionado("ENVIADOS")}
          >
            ENVIADOS
          </NavLink>
        </NavItem>
      </Nav>

      <div
        style={{
          position: "absolute",
          right: "7px",
          zIndex: "1",
          top: "5px",
        }}
      >
        <ModalNuevoDocumento recargar={fetchDocumentosEnviados} />
      </div>

      {NavSeleccionado == "RECIBIDOS" && (
        <div className="container">
          <table
            className="table table-sm table-hover"
            style={{
              textAlign: "center",
            }}
          >
            <thead>
              <tr className="row">
                <th className="col-md-1">REVISADO</th>
                <th className="col-md-2">REMITE</th>
                <th className="col-md-2">ASUNTO</th>
                <th className="col-md-6">DESCRIPCION</th>
                <th className="col-md-1">FECHA</th>
              </tr>
            </thead>
            <tbody>
              {DocumentosRecibidos.map((item, i) => (
                <tr key={i} className={"showhim row"}>
                  <td className="col-md-1">
                    <MensajeRevisado
                      id_mensaje={item.id}
                      ref={(ref) => {
                        var clone = RefCheckBox;
                        clone[item.id] = ref;
                        setRefCheckBox(clone);
                      }}
                    />
                  </td>
                  <td
                    className="col-md-2"
                    onClick={() => {
                      RefCheckBox[item.id].recarga();
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {item.emisor_nombre}
                  </td>
                  <td
                    className="col-md-2"
                    onClick={() => {
                      RefCheckBox[item.id].recarga();
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {item.asunto}
                  </td>
                  <td
                    className="col-md-6"
                    style={{ position: "relative" }}
                    onClick={() => {
                      RefCheckBox[item.id].recarga();
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      {item.descripcion}
                      {item.documento_link && (
                        <FaPaperclip
                          size={20}
                          color={"#efefef"}
                          onClick={() =>
                            DescargarArchivoRecibido(
                              `${UrlServer}${item.documento_link}`,
                              item.id,
                              item.receptor_cargo
                            )
                          }
                          style={{
                            cursor: "pointer",
                            float: "right",
                          }}
                          title={"Descargar archivo"}
                        />
                      )}
                    </div>
                    <div
                      className={"showme "}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "38px",
                        background: "#242526",
                      }}
                    >
                      <ModalRespuesta
                        receptor_id={item.emisor_id}
                        mensaje_id={item.id}
                        archivoAdjunto_id={item.archivoAdjunto_id}
                        archivoAdjunto_tipo={item.archivoAdjunto_tipo}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </td>
                  <td
                    className="col-md-1"
                    onClick={() => {
                      RefCheckBox[item.id].recarga();
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {fechaFormatoClasico(item.fecha)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {NavSeleccionado == "ENVIADOS" && (
        <div className="container">
          <table className="table table-sm  ">
            <thead>
              <tr class="row">
                <th className="col-md-2">DESTINATARIO</th>
                <th className="col-md-2">ASUNTO</th>
                <th className="col-md-6">DESCRIPCION</th>
                <th className="col-md-2">FECHA</th>
              </tr>
            </thead>
            <tbody>
              {DocumentosEnviados.map((item, i) => [
                <tr
                  key={i}
                  className={"showhim row"}
                  onClick={() => {
                    onChangeDocumentosEnviados(item);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td className="col-md-2">
                    <Destinatarios id={item.id} />
                  </td>
                  <td className="col-md-2">{item.asunto}</td>
                  <td className="col-md-6" style={{ position: "relative" }}>
                    <div>
                      {item.descripcion}
                      {item.documento_link && (
                        <FaPaperclip
                          size={20}
                          color={"#efefef"}
                          onClick={() =>
                            DescargarArchivoEnviado(
                              `${UrlServer}${item.documento_link}`
                            )
                          }
                          style={{
                            cursor: "pointer",
                            float: "right",
                          }}
                          title={"Descargar archivo"}
                        />
                      )}
                    </div>
                  </td>
                  <td className="col-md-2">
                    {fechaFormatoClasico(item.fecha)}
                  </td>
                </tr>,
                ,
                DocumentoEnviadoSeleccionado.id == item.id && (
                  <tr className={"row"}>
                    <td colSpan="8" className="col-md-12">
                      <div>
                        <table
                          className="table table-dark table-hover"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <thead>
                            <tr>
                              <th>N°</th>
                              <th>OBRA</th>
                              <th>CARGO</th>
                              <th>REVISADO</th>
                              <th>RESPUESTAS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {DocumentosEnviadosUsuarios.map((item2, i2) => [
                              <tr key={i2}>
                                <td>{i2 + 1}</td>
                                <td>{item2.codigo}</td>
                                <td>{item2.cargo_nombre}</td>
                                <td>
                                  {item2.mensaje_visto ? (
                                    <FaCheckCircle
                                      color={"#0080ff"}
                                      size={20}
                                    />
                                  ) : (
                                    <FaRegWindowClose color={"red"} size={20} />
                                  )}
                                </td>
                                <td
                                  onClick={() =>
                                    toggleModal(
                                      item.id,
                                      item2.id_ficha,
                                      item2.codigo
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <RespuestasUsuariosEnviadosCantidad
                                    emisor_id={item2.id_ficha}
                                    mensaje_id={item.id}
                                  />
                                </td>
                              </tr>,
                            ])}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                ),
              ])}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader>
          {"REMITENTE: " + ModalIdUsuario.toUpperCase()}
        </ModalHeader>
        <ModalBody>
          <RespuestasUsuariosEnviados
            emisor_id={ModalIdEmisor}
            mensaje_id={ModalIdMensaje}
            DescargarArchivoEnviado={DescargarArchivoEnviado}
            fechaFormatoClasico={fechaFormatoClasico}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};
function RespuestasUsuariosEnviados({
  emisor_id,
  mensaje_id,
  DescargarArchivoEnviado,
  fechaFormatoClasico,
}) {
  useEffect(() => {
    fetchDocumentosRecibidosRespuestas();
  }, []);
  const [
    DocumentosRecibidosRespuestas,
    setDocumentosRecibidosRespuestas,
  ] = useState([]);
  async function fetchDocumentosRecibidosRespuestas() {
    var res = await axios.get(
      `${UrlServer}/gestiondocumentaria_recibidos_respuestas`,
      {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
          mensaje_id,
          emisor_id,
        },
      }
    );
    if (Array.isArray(res.data)) {
      setDocumentosRecibidosRespuestas(res.data);
      // console.log(res.data);
    }
  }

  return (
    <div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>ASUNTO</th>
            <th>DESCRIPCION</th>
            <th>FECHA</th>
            <th>DESCARGA</th>
          </tr>
        </thead>
        <tbody>
          {DocumentosRecibidosRespuestas.map((item, i) => (
            <tr key={i}>
              <td>{item.asunto}</td>
              <td>{item.descripcion}</td>
              <td>{fechaFormatoClasico(item.fecha)}</td>
              <td>
                {item.documento_link && (
                  <FaPaperclip
                    size={15}
                    color={"#efefef"}
                    onClick={() =>
                      DescargarArchivoEnviado(
                        `${UrlServer}${item.documento_link}`
                      )
                    }
                    style={{
                      cursor: "pointer",
                      float: "right",
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function RespuestasUsuariosEnviadosCantidad({ emisor_id, mensaje_id }) {
  useEffect(() => {
    fetchDocumentosRecibidosRespuestas();
  }, []);
  const [
    DocumentosRecibidosRespuestas,
    setDocumentosRecibidosRespuestas,
  ] = useState({});
  async function fetchDocumentosRecibidosRespuestas() {
    var res = await axios.get(
      `${UrlServer}/gestiondocumentaria_recibidos_respuestas_cantidad`,
      {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
          mensaje_id,
          emisor_id,
        },
      }
    );
    setDocumentosRecibidosRespuestas(res.data);
  }

  return <div>{DocumentosRecibidosRespuestas.cantidad}</div>;
}
function Destinatarios({ id }) {
  useEffect(() => {
    fetchDocumentosEnviadosUsuarios();
  }, []);
  const [Destinatarios, setDestinatarios] = useState([]);
  async function fetchDocumentosEnviadosUsuarios() {
    var res = await axios.get(
      `${UrlServer}/gestiondocumentaria_enviados_usuarios`,
      {
        params: {
          id,
        },
      }
    );
    setDestinatarios(res.data);
  }
  return (
    <div>
      {Destinatarios.length > 3 ? (
        <div>{Destinatarios.length + " personas"}</div>
      ) : (
        <div>
          {Destinatarios.map((item, i) => (
            <div>{item.codigo}</div>
          ))}
        </div>
      )}
    </div>
  );
}
const MensajeRevisado = forwardRef(({ id_mensaje }, ref) => {
  useEffect(() => {
    fetchMensajeRevisado();
  }, []);
  const [MensajeRevisado, setMensajeRevisado] = useState(0);
  async function fetchMensajeRevisado() {
    var res = await axios.get(
      `${UrlServer}/gestiondocumentaria_mensajes_revisado`,
      {
        params: {
          id_acceso: sessionStorage.getItem("idacceso"),
          id_mensaje,
        },
      }
    );
    // console.log(res.data);
    if (Object.keys(res.data).length == 0) {
      setMensajeRevisado(false);
    } else {
      setMensajeRevisado(res.data.revisado);
    }
  }
  async function putMensajeRevisado(revisado) {
    var res = await axios.put(
      `${UrlServer}/gestiondocumentaria_mensajes_revisado`,
      {
        id_acceso: sessionStorage.getItem("idacceso"),
        id_mensaje,
        revisado,
      }
    );
    fetchMensajeRevisado();
  }
  useImperativeHandle(ref, () => ({
    recarga() {
      if (!MensajeRevisado) {
        putMensajeRevisado(true);
      }
    },
  }));
  return (
    <div>
      <Input
        type="checkbox"
        checked={MensajeRevisado}
        onClick={() => {
          putMensajeRevisado(!MensajeRevisado);
        }}
      />
    </div>
  );
});

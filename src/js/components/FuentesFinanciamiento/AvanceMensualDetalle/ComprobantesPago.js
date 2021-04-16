import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ref,
  useRef,
} from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownToggle,
  DropdownMenu,
  Nav,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  CardHeader,
} from "reactstrap";
import axios from "axios";
import {
  FaUpload,
  FaFileAlt,
  FaPlusCircle,
  FaEdit,
  FaReply,
  FaRegTrashAlt,
} from "react-icons/fa";
import { MdCancel, MdSave, MdDelete } from "react-icons/md";
import AsyncSelect from "react-select/async";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import {
  Redondea,
  formatMoney,
  mesesShort,
  DescargarArchivo,
} from "../../Utils/Funciones";
import CustomInput from "../../../libs/CustomInput";
export default forwardRef(
  ({ tipocomprobante_asignado, ModoEdicion, recargar, Permisos }, ref) => {
    useEffect(() => {
      cargarComprobantesPago();
    }, []);

    useImperativeHandle(ref, () => ({
      agregarCommprobantesPago() {
        agregarCommprobantesPago();
      },
    }));

    //comprobantes
    const [ComprobantesPago, setComprobantesPago] = useState([]);
    async function cargarComprobantesPago() {
      var res = await axios.get(`${UrlServer}/v1/comprobantesAsignados`, {
        params: {
          id_tipocomprobante_asignado: tipocomprobante_asignado.id,
        },
      });
      setComprobantesPago(res.data);
    }
    async function agregarCommprobantesPago() {
      var res = await axios.post(`${UrlServer}/v1/comprobantesAsignados`, {
        tiposcomprobantes_asignados_id: tipocomprobante_asignado.id,
      });
      cargarComprobantesPago();
    }
    async function eliminarComprobantePago(id) {
      if (confirm("Esta seguro de eliminar este Comprobante?")) {
        var res = await axios.delete(
          `${UrlServer}/v1/comprobantesAsignados/${id}`
        );
        cargarComprobantesPago();
        recargar();
      }
    }
    async function actualizarComprobantePago(id, name, value) {
      var res = await axios.put(`${UrlServer}/v1/comprobantesAsignados/${id}`, {
        [name]: value,
      });
      cargarComprobantesPago();
      recargar();
    }
    //subir archivo
    const [IdComprobante, setIdComprobante] = useState(0);
    const hiddenFileInput = useRef(null);
    async function subirArchivo(id) {
      await setIdComprobante(id);
      hiddenFileInput.current.click();
    }
    async function onChangeInputFile(e) {
      if (confirm("desea subir el archivo seleccionado?")) {
        const formData = new FormData();
        formData.append("codigo", sessionStorage.getItem(`codigoObra`));
        formData.append("id", IdComprobante);
        formData.append("tipo_comprobante", tipocomprobante_asignado.nombre);
        formData.append("archivo", e.target.files[0]);
        e.target.value = null;
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const res = await axios.post(
          `${UrlServer}/v1/comprobantesAsignados/archivo`,
          formData,
          config
        );
        cargarComprobantesPago();
      } else {
        e.target.value = null;
      }
    }
    async function eliminarArchivo(id) {
      if (confirm("Está seguro de borrar el archivo ?")) {
        var res = await axios.delete(
          `${UrlServer}/v1/comprobantesAsignados/archivo/${id}`
        );
        cargarComprobantesPago();
      }
    }
    return (
      <div style={{ width: "1500px" }}>
        <table className="whiteThem-table">
          <thead>
            <tr>
              <th className="comprobante-numero">N</th>
              <th className="comprobante-tipo-comprobante">O/C</th>
              <th className="comprobante-fecha">FECHA</th>
              <th className="comprobante-siaf">SIAF</th>
              <th className="comprobante-numero-comprobante">N° C/P</th>
              <th className="comprobante-numero-pecosa">Nº PECOSA </th>
              <th className="comprobante-monto-total">MONTO TOTAL</th>
              <th className="comprobante-razon-social">RAZON SOCIAL</th>
              <th className="comprobante-observacion">OBSERVACION</th>
              <th className="comprobante-opciones">OPCIONES</th>
            </tr>
          </thead>
          <tbody>
            {ComprobantesPago.map((item, i) =>
              !ModoEdicion ||
              Permisos["fuentefinanciamiento_actualizar_comprobante"] != 1 ? (
                <>
                  <tr>
                    <td>{i + 1}</td>
                    <td>{item.numero_tipo_comprobante}</td>
                    <td>{item.fecha}</td>
                    <td>{item.siaf}</td>
                    <td>{item.numero_comprobante}</td>
                    <td>{item.numero_pecosa}</td>
                    <td>{item.monto_total}</td>
                    <td>{item.razon_social}</td>
                    <td>{item.observacion}</td>
                    <td>
                      {item.archivo && item.archivo != " " && (
                        <FaFileAlt
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            DescargarArchivo(`${UrlServer}${item.archivo}`)
                          }
                        />
                      )}
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>{i + 1}</td>
                    <td style={{ padding: "0px" }}>
                      <CustomInput
                        value={item.numero_tipo_comprobante}
                        onBlur={(value) =>
                          actualizarComprobantePago(
                            item.id,
                            "numero_tipo_comprobante",
                            value
                          )
                        }
                        style={{
                          fontWeight: "700",
                        }}
                      />
                    </td>
                    <td style={{ padding: "0px" }}>
                      <CustomInput
                        value={item.fecha}
                        onBlur={(value) =>
                          actualizarComprobantePago(item.id, "fecha", value)
                        }
                        type="date"
                      />
                    </td>
                    <td style={{ padding: "0px" }}>
                      <CustomInput
                        value={item.siaf}
                        onBlur={(value) =>
                          actualizarComprobantePago(item.id, "siaf", value)
                        }
                      />
                    </td>
                    <td style={{ padding: "0px" }}>
                      <CustomInput
                        value={item.numero_comprobante}
                        onBlur={(value) =>
                          actualizarComprobantePago(
                            item.id,
                            "numero_comprobante",
                            value
                          )
                        }
                      />
                    </td>
                    <td style={{ padding: "0px" }}>
                      <CustomInput
                        value={item.numero_pecosa}
                        onBlur={(value) =>
                          actualizarComprobantePago(
                            item.id,
                            "numero_pecosa",
                            value
                          )
                        }
                      />
                    </td>
                    <td style={{ padding: "0px" }}>
                      <CustomInput
                        value={Redondea(item.monto_total)}
                        onBlur={(value) =>
                          actualizarComprobantePago(
                            item.id,
                            "monto_total",
                            value
                          )
                        }
                        style={{
                          fontWeight: "700",
                        }}
                      />
                    </td>
                    <td style={{ padding: "0px" }}>
                      <CustomInput
                        value={item.razon_social}
                        onBlur={(value) =>
                          actualizarComprobantePago(
                            item.id,
                            "razon_social",
                            value
                          )
                        }
                        type="text"
                      />
                    </td>
                    <td style={{ padding: "0px" }}>
                      <CustomInput
                        value={item.observacion}
                        onBlur={(value) =>
                          actualizarComprobantePago(
                            item.id,
                            "observacion",
                            value
                          )
                        }
                        type="text"
                      />
                    </td>
                    <td>
                      {Permisos[
                        "fuentefinanciamiento_actualizar_comprobanteArchivo"
                      ] == 1 &&
                        (!item.archivo || item.archivo == " ") && (
                          <FaUpload
                            style={{ cursor: "pointer" }}
                            onClick={() => subirArchivo(item.id)}
                          />
                        )}
                      {item.archivo && item.archivo != " " && (
                        <FaFileAlt
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            DescargarArchivo(`${UrlServer}${item.archivo}`)
                          }
                        />
                      )}
                      {Permisos[
                        "fuentefinanciamiento_eliminar_comprobanteArchivo"
                      ] == 1 && (
                        <FaReply
                          onClick={() => eliminarArchivo(item.id)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                      {Permisos["fuentefinanciamiento_eliminar_comprobante"] ==
                        1 && (
                        <FaRegTrashAlt
                          onClick={() => eliminarComprobantePago(item.id)}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </td>
                  </tr>
                </>
              )
            )}
          </tbody>
        </table>
        <input
          type="file"
          ref={hiddenFileInput}
          style={{
            display: "none",
          }}
          onChange={(e) => onChangeInputFile(e)}
        />
      </div>
    );
  }
);

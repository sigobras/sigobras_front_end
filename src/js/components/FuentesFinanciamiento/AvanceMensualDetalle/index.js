import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ref,
} from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  DropdownMenu,
  Nav,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  CardHeader,
  CustomInput,
} from "reactstrap";
import axios from "axios";
import {
  FaUpload,
  FaFileAlt,
  FaPlusCircle,
  FaEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import { MdCancel, MdSave } from "react-icons/md";
import AsyncSelect from "react-select/async";
import { BsCircleFill } from "react-icons/bs";
import { BiRadioCircleMarked } from "react-icons/bi";

import { UrlServer } from "../../Utils/ServerUrlConfig";
import { Redondea, formatMoney, mesesShort } from "../../Utils/Funciones";
import ComprobantesPago from "./ComprobantesPago";

export default ({
  especifica,
  id_avancemensual,
  ModoEdicion,
  TipoComprobantes,
  avance,
  Permisos,
}) => {
  //modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      cargaTiposComprobantesPago();
      cargarMontoDetallado();
    }
    setModal(!modal);
  };
  //comprobantes
  const [TiposComprobantesPago, setTiposComprobantesPago] = useState([]);
  async function cargaTiposComprobantesPago() {
    var res = await axios.get(`${UrlServer}/v1/tiposComprobantesAsignados`, {
      params: {
        id_avancemensual,
      },
    });
    setTiposComprobantesPago(res.data);
  }

  async function actualizarTipoComprobante(id, tiposcomprobante_id) {
    var res = await axios.put(
      `${UrlServer}/v1/tiposComprobantesAsignados/${id}`,
      {
        tiposcomprobante_id,
      }
    );
    cargaTiposComprobantesPago();
  }
  async function asignarTipoComprobante() {
    var res = await axios.get(
      `${UrlServer}/v1/tiposComprobantesAsignados/predecir`,
      {
        params: {
          id_avancemensual,
        },
      }
    );
    var tiposcomprobante_id = res.data.id;
    if (tiposcomprobante_id) {
      var res2 = await axios.post(
        `${UrlServer}/v1/tiposComprobantesAsignados`,
        {
          fuentesfinanciamiento_avancemensual_id: id_avancemensual,
          tiposcomprobante_id,
        }
      );
    }
    cargaTiposComprobantesPago();
  }
  async function eliminarTipoComprobante(id) {
    if (confirm("Esta seguro de eliminar este comprobante?")) {
      var res = await axios.delete(
        `${UrlServer}/v1/tiposComprobantesAsignados/${id}`
      );
    }

    cargaTiposComprobantesPago();
  }
  //suma total del monto
  const [MontoDetallado, setMontoDetallado] = useState(0);
  async function cargarMontoDetallado(id) {
    var res = await axios.get(
      `${UrlServer}/v1/comprobantesAsignados/avanceMensual`,
      {
        params: {
          id_avanceMensual: id_avancemensual,
        },
      }
    );
    console.log("res", res.data);
    console.log({ avance });
    setMontoDetallado(avance - res.data.monto_total);
  }
  const [RefComprobantes, setRefComprobantes] = useState([]);

  return (
    <>
      <BiRadioCircleMarked
        color="#a2a2a2"
        onClick={toggle}
        size="18px"
        style={{ cursor: "pointer" }}
      />
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          {especifica.clasificador + " " + especifica.descripcion}
          {ModoEdicion &&
            Permisos["fuentefinanciamiento_agregar_tipocomprobante"] == 1 && (
              <FaPlusCircle
                onClick={() => asignarTipoComprobante()}
                style={{
                  cursor: "pointer",
                  marginLeft: "4px",
                  marginRight: "4px",
                }}
                color="#0080ff"
                size="15"
              />
            )}
        </ModalHeader>
        <ModalBody>
          <span>
            {MontoDetallado > 0 && "POR COMPLETAR: "}
            {MontoDetallado == 0 && "COMPLETADO: "}
            {MontoDetallado < 0 && "EXCEDIDO: "}

            {"S/." + Redondea(MontoDetallado)}
          </span>
          <div style={{ overflowX: "auto" }}>
            {TiposComprobantesPago.map((item, i) => (
              <div key={i}>
                {!ModoEdicion ? (
                  <>
                    <div>{item.nombre}</div>
                    <ComprobantesPago
                      tipocomprobante_asignado={item}
                      ModoEdicion={ModoEdicion}
                      Permisos={Permisos}
                    />
                  </>
                ) : (
                  <>
                    <span className="d-flex">
                      <Input
                        type="select"
                        value={item.id_tipoComprobante}
                        onChange={(e) => {
                          if (
                            Permisos[
                              "fuentefinanciamiento_actualizar_tipocomprobante"
                            ]
                          ) {
                            actualizarTipoComprobante(item.id, e.target.value);
                          }
                        }}
                        style={{
                          background: "#242526",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          width: "300px",
                        }}
                      >
                        <option value="">Seleccione</option>
                        {TipoComprobantes.map((item2, i2) => (
                          <option key={item2.id} value={item2.id}>
                            {item2.nombre}
                          </option>
                        ))}
                      </Input>
                      {ModoEdicion &&
                        Permisos["fuentefinanciamiento_agregar_comprobante"] ==
                          1 && (
                          <FaPlusCircle
                            onClick={() => {
                              RefComprobantes[
                                item.id
                              ].agregarCommprobantesPago();
                            }}
                            style={{
                              cursor: "pointer",
                              marginLeft: "4px",
                              marginRight: "4px",
                              marginTop: "9px",
                            }}
                            color="#28d645"
                            size="12"
                          />
                        )}
                      {Permisos[
                        "fuentefinanciamiento_eliminar_tipocomprobante"
                      ] == 1 && (
                        <FaRegTrashAlt
                          style={{
                            cursor: "pointer",
                            marginTop: "9px",
                          }}
                          size="12"
                          onClick={() => eliminarTipoComprobante(item.id)}
                        />
                      )}
                    </span>
                    <ComprobantesPago
                      tipocomprobante_asignado={item}
                      ModoEdicion={ModoEdicion}
                      recargar={cargarMontoDetallado}
                      ref={(ref) => {
                        var clone = RefComprobantes;
                        clone[item.id] = ref;
                        setRefComprobantes(clone);
                      }}
                      Permisos={Permisos}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

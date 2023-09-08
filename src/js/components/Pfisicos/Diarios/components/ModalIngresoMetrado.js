import React, { useState, useEffect } from "react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import { FaPlus, FaCheck } from "react-icons/fa";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalMayorMetradoSave from "./ModalMayorMetradoSave";
import { FechaActual, FechaActual2Meses, Redondea } from "../../../Utils/Funciones";
import { logoSigobras } from "../../../Reportes/Complementos/ImgB64";
import { UrlServer } from "../../../Utils/ServerUrlConfig";
export default ({ Partida, Actividad, recargaActividad, EstadoObra,TipoComponenteSelecccionado,savePartidaMayorMetrado }) => {
  useEffect(() => {
    fectchAvanceActividad();
  }, []);
  //actividad saldo
  const [SaldoActividad, setSaldoActividad] = useState(0);
  async function fectchAvanceActividad() {
    const res = await axios.post(`${UrlServer}/getAvanceActividad`, {
      id_actividad: Actividad.id_actividad,
    });
    setSaldoActividad(res.data.metrado - res.data.avance_metrado);
  }
  //modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    if (!modal) {
      setButtonSave(true);
      setModalData({
        id_ficha: sessionStorage.getItem("idobra"),
        fecha: "",
        valor: 0,
        descripcion: "",
        id_actividad: Actividad.id_actividad,
        id_acceso: sessionStorage.getItem("idacceso"),
      });
    }
    setModal(!modal);
  };
  //data de modal
  const [ModalData, setModalData] = useState({});
  function onChangeModalData(name, value) {
    var clone = { ...ModalData };
    clone[name] = value;
    setModalData(clone);
  }
  const [ButtonSave, setButtonSave] = useState(true);
  async function saveModalDATA() {
    setButtonSave(false);
    try {
      if (confirm("esta seguro de realizar esta accion?")) {
        const res = await axios.post(`${UrlServer}/postActividad2`, ModalData);
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        fectchAvanceActividad();

        toggle();
        recargaActividad(Partida.id_partida, Actividad.id_actividad);
      }
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de error (por ejemplo, 404, 500)
        console.error('Error de servidor:', error.response.data);
      } else if (error.request) {
        // La solicitud no pudo llegar al servidor (puede ser un problema de red)
        console.error('Error de red:', error.request);
      } else {
        // Ocurrió un error en la configuración de la solicitud
        console.error('Error de solicitud:', error.message);
      }
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }
  return (
    <>
      {SaldoActividad > 0 || EstadoObra == "Corte" ? (
        <FaPlus
          size={15}
          onClick={toggle}
          color={"#007bff"}
          style={{
            cursor: "pointer",
          }}
        />
      ) : (
        <>
          <FaCheck size={15} color={"#08ff1d"} />
          {TipoComponenteSelecccionado === 'origen' && <ModalMayorMetradoSave PartidaSelecccionado={Partida} Actividad={Actividad} savePartidaMayorMetrado={savePartidaMayorMetrado}/>}
         
       </>
      )}
      <Modal isOpen={modal} toggle={toggle} className='modal-so'>
        <ToastContainer />
        <ModalHeader>
          <img src={logoSigobras} width="60px" alt="logo sigobras" />
        </ModalHeader>
        <ModalBody>
          <label className="text-center mt-0">{Partida.descripcion}</label>
          <br />
          <div className="d-flex justify-content-between ">
            <div className="">
              <b>{Actividad.nombre}</b>
            </div>
            <div className="small">
              Costo Unit. S/. {Redondea(Partida.costo_unitario)}{" "}
              {Partida.unidad_medida.replace("/DIA", "")}
            </div>
          </div>
          <div className="d-flex justify-content-between ">
            <div>
              {/* INGRESE EL METRADO: {this.state.Porcentaje_Metrado} */}
            </div>
            <div title="redimiento" className="text-right bold text-warning">
              redimiento {Partida.rendimiento}
            </div>
          </div>
          <div className="input-group input-group-sm mb-0">
            <DebounceInput
              debounceTimeout={300}
              onChange={(e) => onChangeModalData("valor", e.target.value)}
              type="number"
              className="form-control"
              autoFocus
            />
            <div className="input-group-append">
              <span className="input-group-text">
                {Partida.unidad_medida.replace("/DIA", "")}
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-center text-center mt-1">
            <div className="bg-primary p-1 mr-1 text-white">
              Metrado total <br />
              {Partida.metrado} {Partida.unidad_medida.replace("/DIA", "")}
            </div>
            <div className="bg-info text-white p-1 mr-1">
              Costo total / {Partida.unidad_medida.replace("/DIA", "")} <br />=
              S/. {Redondea(Partida.metrado * Partida.costo_unitario)} <br />
            </div>
            <div
              className={
                Number(SaldoActividad) <= 0
                  ? "bg-danger p-1 mr-1 text-white"
                  : "bg-success p-1 mr-1 text-white"
              }
            >
              Saldo Espécifico
              <br />
              {Redondea(SaldoActividad)}{" "}
              {Partida.unidad_medida.replace("/DIA", "")}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="fehca">FECHA :</label>
            <input
              type="date"
              min={FechaActual2Meses()}
              max={FechaActual()}
              onChange={(e) => onChangeModalData("fecha", e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment">DESCRIPCION:</label>
            <DebounceInput
              cols="40"
              rows="1"
              element="textarea"
              minLength={0}
              debounceTimeout={300}
              onChange={(e) => onChangeModalData("descripcion", e.target.value)}
              className="form-control"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => saveModalDATA()}
            disabled={!ButtonSave}
          >
            Guardar
          </Button>{" "}
          <Button color="danger" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  Alert,
  Collapse,
} from "reactstrap";
import {
  MdSettings,
  MdSystemUpdateAlt,
  MdDeleteForever,
  MdModeEdit,
  MdSave,
  MdClose,
} from "react-icons/md";
import axios from "axios";

import { Redondea, mesesShort } from "../../Utils/Funciones";
import { UrlServer } from "../../Utils/ServerUrlConfig";
export default forwardRef(({ item, anyo }, ref) => {
  useEffect(() => {
    fetchUsuarioData();
    fetchCurvaS_Acumulados();
    fetchCurvaS_AcumuladosAnyoEspecifico();
    fetchPimMonto();
  }, []);
  //UsuarioData
  const [UsuarioData, setUsuarioData] = useState({});
  async function fetchUsuarioData() {
    const res = await axios.post(`${UrlServer}/getDatosUsuario`, {
      id_acceso: sessionStorage.getItem("idacceso"),
      id_ficha: sessionStorage.getItem("idobra"),
    });
    setUsuarioData(res.data);
  }
  //acumulados
  const [CurvaS_Acumulados, setCurvaS_Acumulados] = useState({});
  async function fetchCurvaS_Acumulados() {
    const res = await axios.post(`${UrlServer}/getDataCurvaSAcumulados`, {
      id_ficha: item.id_ficha,
      anyo,
    });
    setCurvaS_Acumulados(res.data);
  }
  //acumulado anyo especifico
  const [
    CurvaS_AcumuladosAnyoEspecifico,
    setCurvaS_AcumuladosAnyoEspecifico,
  ] = useState({});
  async function fetchCurvaS_AcumuladosAnyoEspecifico() {
    const res = await axios.post(
      `${UrlServer}/getDataCurvaSAcumuladosByAnyo2`,
      {
        id_ficha: item.id_ficha,
        anyo,
      }
    );
    setCurvaS_AcumuladosAnyoEspecifico(res.data);
  }
  //pim
  const [PimMonto, setPimMonto] = useState(0);
  async function fetchPimMonto() {
    const res = await axios.post(`${UrlServer}/getCurvaSPin`, {
      id_ficha: item.id_ficha,
      anyo,
    });
    setPimMonto(res.data.pim);
  }
  //recargar
  useImperativeHandle(ref, () => ({
    recargar() {
      fetchCurvaS_Acumulados();
      fetchCurvaS_AcumuladosAnyoEspecifico();
      fetchPimMonto();
    },
  }));
  return (
    <div className="d-flex">
      <div>
        <Alert
          color="info"
          style={{
            marginBottom: "2px",
            padding: "0px 7px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            S/.{Redondea(CurvaS_Acumulados.programado_acumulado)}
          </div>
          <div style={{ fontSize: "9px" }}>PROGRAMADO ACUMULADO</div>
        </Alert>
        <Alert
          color="info"
          style={{
            marginBottom: "2px",
            padding: "0px 7px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            S/.
            {Redondea(
              item.presupuesto_costodirecto -
                CurvaS_Acumulados.programado_acumulado
            )}
          </div>
          <div style={{ fontSize: "9px" }}>PROGRAMADO SALDO</div>
        </Alert>
      </div>
      &nbsp;&nbsp;
      <div>
        <Alert
          color="info"
          style={{
            marginBottom: "2px",
            padding: "0px 7px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            S/.{Redondea(CurvaS_Acumulados.ejecutado_acumulado)}
          </div>
          <div style={{ fontSize: "9px" }}>EJECUTADO ACUMULADO</div>
        </Alert>
        <Alert
          color="info"
          style={{
            marginBottom: "2px",
            padding: "0px 7px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            S/.
            {Redondea(
              item.presupuesto_costodirecto -
                CurvaS_Acumulados.ejecutado_acumulado
            )}
          </div>
          <div style={{ fontSize: "9px" }}>EJECUTADO SALDO</div>
        </Alert>
      </div>
      &nbsp;&nbsp;
      <div>
        <Alert
          color="warning"
          style={{
            marginBottom: "2px",
            padding: "0px 7px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            S/.{Redondea(CurvaS_Acumulados.financiero_acumulado)}
          </div>
          <div style={{ fontSize: "9px" }}>FINANCIERO ACUMULADO</div>
        </Alert>
        <Alert
          color="warning"
          style={{
            marginBottom: "2px",
            padding: "0px 7px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            S/.
            {Redondea(
              item.g_total_presu - CurvaS_Acumulados.financiero_acumulado
            )}
          </div>
          <div style={{ fontSize: "9px" }}>FINANCIERO SALDO</div>
        </Alert>
      </div>
      &nbsp;&nbsp;
      <div>
        <Alert
          color="success"
          style={{
            marginBottom: "2px",
            padding: "1px 7px",
            textAlign: "center",
          }}
        >
          <div className="d-flex">
            <div style={{ fontSize: "13px" }}>PIM {anyo}</div>
            &nbsp;
            <div style={{ fontWeight: 700 }}>S/.{Redondea(PimMonto)}</div>
          </div>
        </Alert>
        <Alert
          color="success"
          style={{
            marginBottom: "2px",
            padding: "1px 7px",
            textAlign: "center",
          }}
        >
          <div className="d-flex">
            <div style={{ fontSize: "13px" }}>ACUMULADO {anyo}</div>
            &nbsp;
            <div style={{ fontWeight: 700 }}>
              S/.
              {Redondea(CurvaS_AcumuladosAnyoEspecifico.financiero_monto)}
            </div>
          </div>
        </Alert>
        <Alert
          color="success"
          style={{
            marginBottom: "2px",
            padding: "1px 7px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "13px" }}>SALDO PIM</span>
          &nbsp;
          <span style={{ fontWeight: 700 }}>
            S/.
            {Redondea(
              PimMonto - CurvaS_AcumuladosAnyoEspecifico.financiero_monto
            )}
          </span>
        </Alert>
      </div>
    </div>
  );
});

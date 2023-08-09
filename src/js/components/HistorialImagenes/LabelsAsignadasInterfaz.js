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
} from "reactstrap";

import { UrlServer } from "../Utils/ServerUrlConfig";
import { Redondea } from "../Utils/Funciones";
import ImagenesGeneral from "./ImagenesGeneral";
import ImagenesMeses from "./ImagenesMeses";
export default ({
  anyo,
  mes,
  id_componente,
  id_partidaImagen,
  id_AvanceActividades,
  recargar,
}) => {
  useEffect(() => {
    cargarLabelsAsignadas();
  }, []);
  const [LabelsAsignadas, setLabelsAsignadas] = useState([]);
  const [LabelSeleccionada, setLabelSeleccionada] = useState("");
  async function cargarLabelsAsignadas() {
    var res = await axios.get(`${UrlServer}/v1/imagenesLabelsAsignadas`, {
      params: {
        id_ficha: sessionStorage.getItem("idobra"),
        anyo,
        mes,
        id_componente,
        id_partidaImagen,
        id_AvanceActividades,
      },
    });
    setLabelsAsignadas(res.data);
  }
  return (
    <div>
      {LabelsAsignadas.length > 0 && (
        <Input
          type="select"
          onChange={(e) => {
            setLabelSeleccionada(e.target.value);
            recargar(e.target.value);
          }}
          value={LabelSeleccionada}
        >
          <option value="">Todas las etiquetas</option>
          {LabelsAsignadas.map((item, i) => (
            <option value={item.id}>{item.nombre}</option>
          ))}
        </Input>
      )}
    </div>
  );
};

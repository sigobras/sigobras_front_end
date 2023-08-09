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
import "./HistorialImagenes.css";

export default () => {
  const [ImagenesGeneralInterfaz, setImagenesGeneralInterfaz] = useState(true);
  return (
    <div>
      <Button
        onClick={() => setImagenesGeneralInterfaz(!ImagenesGeneralInterfaz)}
      >
        {!ImagenesGeneralInterfaz ? "resumen mensual" : "resumen general"}
      </Button>
      {!ImagenesGeneralInterfaz ? <ImagenesGeneral /> : <ImagenesMeses />}
    </div>
  );
};

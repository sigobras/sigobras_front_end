import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaList, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button, Input, Tooltip } from "reactstrap";
import { useDispatch } from "react-redux";

import { UrlServer } from "../Utils/ServerUrlConfig";
import FinancieroBarraPorcentaje from "./FinancieroBarraPorcentaje";
import FisicoBarraPorcentaje from "./FisicoBarraPorcentaje";
import ModalListaPersonal from "./ListaPersonal";
import Curva_S from "./Cuva_S";
import { Redondea, hexToRgb, fechaFormatoClasico } from "../Utils/Funciones";
import Obras_labels_edicion from "./Obras_labels_edicion";
import CarouselNavs from "./Carousel/CarouselNavs";
import PersonalCostoDirecto from "./PersonalCostoDirecto";

import styles from "./inicio.module.css";

import FiltrosComponent from "../../../components/organisms/FiltrosObras";
import ObrasTable from "../../../components/templates/ObrasTable";
import {
  useEstadosObra,
  useObras,
  useProvincias,
  useSectores,
} from "../../../hooks/useInicioInfo";
import Image from "next/image";

const ObrasComponent = () => {
  const dispatch = useDispatch();

  const {
    provincias,
    provinciaSeleccionada,
    setProvinciaSeleccionada,
  } = useProvincias();
  const sectores = useSectores(provinciaSeleccionada);
  const estadosObra = useEstadosObra();

  const [sectoreSeleccionado, setSectoreSeleccionado] = useState(0);
  const [estadosObraeleccionada, setEstadosObraeleccionada] = useState(0);
  const [labelsHabilitado, setLabelsHabilitado] = useState(false);

  const obras = useObras(
    provinciaSeleccionada,
    sectoreSeleccionado,
    estadosObraeleccionada
  );

  useEffect(() => {
    setSectoreSeleccionado(0);
    setEstadosObraeleccionada(0);
  }, [provinciaSeleccionada]);

  return (
    <div>
      <div className={styles["banner-container"]}>
        <img src="./images/banner.jpg" alt="Banner" />
      </div>
      <FiltrosComponent
        provincias={provincias}
        provinciaSeleccionada={provinciaSeleccionada}
        setProvinciaSeleccionada={setProvinciaSeleccionada}
        sectores={sectores}
        sectoreSeleccionado={sectoreSeleccionado}
        setSectoreSeleccionado={setSectoreSeleccionado}
        estadosObra={estadosObra}
        estadosObraeleccionada={estadosObraeleccionada}
        setEstadosObraeleccionada={setEstadosObraeleccionada}
        labelsHabilitado={labelsHabilitado}
        setLabelsHabilitado={setLabelsHabilitado}
      />
      <ObrasTable obras={obras} />
    </div>
  );
};
export default ObrasComponent;

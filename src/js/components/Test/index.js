import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { UrlServer } from "../Utils/ServerUrlConfig";
export default () => {
  // useEffect(() => {
  //   console.log("work");
  //   return () => {
  //     console.log("clenup");
  //   };
  // }, []);
  const [InpuValue, setInpuValue] = useState("");
  useEffect(() => {
    let source = axios.CancelToken.source();
    const loadData = async () => {
      console.log("buscando", InpuValue);
      var res = await axios.post(
        `${UrlServer}/listaObras`,
        {
          id_tipoObra: 0,
          textoBuscado: InpuValue,
        },
        { cancelToken: source.token }
      );
      console.log("cargando", res.data);
    };
    loadData();
    return () => {
      console.log("cancelling");
      source.cancel();
    };
  }, [InpuValue]);
  return (
    <div>
      <input
        type="text"
        value={InpuValue}
        onChange={(e) => setInpuValue(e.target.value)}
      />
    </div>
  );
};

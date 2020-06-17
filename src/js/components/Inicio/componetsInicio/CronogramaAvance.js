import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios'
import { toast } from "react-toastify";
import { MdSave } from "react-icons/md";

import { Button, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Col, FormGroup, Label, CustomInput } from 'reactstrap';

import { UrlServer } from '../../Utils/ServerUrlConfig'
import { ConvertFormatStringNumber, convertirFechaLetra, FechaActual, Redondea2 } from '../../Utils/Funciones'


class CronogramaAvance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DataCronoGeneralApi: [],
      Column: [],
      DataCronoArmadoEnviar: [],
      DataCronoProgramadoApi: [],
      EnviarDatos: [],
      fechaActualApi: "",
      fecha_desde: '',
      fecha_hasta: '',
      ResultResta: 0,
      fechaLimiteAnioMes: "",
      avanceAcumulado: "",
      EstadoBtnEliminar: true,
      EstadoInputprogramado: false,
      EstadoInputFinanciero: false,
      inputCorteFinanciero: "",
      idInputApi: ""
    };

    this.GeneraFechasSegunOrden = this.GeneraFechasSegunOrden.bind(this);
    this.capturaInputsProgramado = this.capturaInputsProgramado.bind(this);
    this.enviarDatosApi = this.enviarDatosApi.bind(this);
    this.capturaInputsFinanciero = this.capturaInputsFinanciero.bind(this);
    this.eliminarMes = this.eliminarMes.bind(this);
    this.eliminarMesNoData = this.eliminarMesNoData.bind(this);
    this.EstadoInputprogramado = this.EstadoInputprogramado.bind(this);
    this.GuardarApiFinanciero = this.GuardarApiFinanciero.bind(this);
    this.capturaInputCorteFinanciero = this.capturaInputCorteFinanciero.bind(this);
  }

  componentDidMount() {
    axios.post(`${UrlServer}/getcronogramaInicio`,
      {
        "id_ficha": this.props.fichaId
      }
    )
      .then((res) => {
        console.log("res programado", res.data);
        var Inputs = []
        var SumaInputs = []
        var totalSumaInpust = 0
        if (res.data.data.length > 0) {

          res.data.data.forEach((alfo, i) => {

            // console.log("data", alfo)
            // if(alfo.codigo !== "C"){
            Inputs.push(
              [
                this.props.fichaId,
                alfo.fecha,
                ConvertFormatStringNumber(alfo.programado_monto),
                ConvertFormatStringNumber(alfo.financiero_monto),
                alfo.codigo
              ]
            )
            // }
          })


          Inputs.forEach((data) => {
            // console.log("data", data[4])
            if (data[4] !== "C") {
              SumaInputs.push(data[2])
            }
          }

          )

          totalSumaInpust = SumaInputs.reduce((a, b) => { return a + b; }, 0);
          // console.log("totalSumaInpust", totalSumaInpust)

        }

        var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
        var avanceAcumulado = res.data.avance_Acumulado
        var saldoTotalCostoDirecto = costoDirecto - avanceAcumulado
        saldoTotalCostoDirecto = saldoTotalCostoDirecto - totalSumaInpust

        saldoTotalCostoDirecto = Redondea2(saldoTotalCostoDirecto)

        // console.log("saldoTotalCostoDirecto", saldoTotalCostoDirecto)

        // if(saldoTotalCostoDirecto !== NaN){
        //   saldoTotalCostoDirecto = costoDirecto              
        // }
        // console.log("inputs", Inputs);

        this.setState({
          DataCronoGeneralApi: res.data,
          fechaActualApi: res.data.fechaActual,
          fecha_desde: res.data.fecha_final,
          DataCronoProgramadoApi: res.data.data,
          EnviarDatos: Inputs,
          fechaLimiteAnioMes: res.data.fecha_final.slice(0, 7),
          avanceAcumulado: ConvertFormatStringNumber(res.data.avance_Acumulado),
          ResultResta: saldoTotalCostoDirecto.toLocaleString("es-PE")

        })

      })
      .catch((err) => {
        console.error("error al obtener datos del api", err);

      })
  }

  GeneraFechasSegunOrden() {
    // console.log('desde',this.state.fecha_desde)
    // console.log('hasta',this.state.fecha_hasta)

    var fechaInicio = new Date(this.state.fecha_desde);
    var fechaFin = new Date(this.state.fecha_hasta);


    // var Fechas = this.state.DataCronoProgramadoApi

    var Fechas = []

    while (fechaFin.getTime() >= fechaInicio.getTime()) {
      fechaInicio.setDate(fechaInicio.getDate() + 1);

      var ultimoDiaMes = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0);
      ultimoDiaMes = ultimoDiaMes.getDate()
      // console.log(fechaInicio.getFullYear() + '-' + (fechaInicio.getMonth() + 1) + '-' + fechaInicio.getDate());

      var anio = fechaInicio.getFullYear()
      var mes = (fechaInicio.getMonth() + 1)
      if (mes <= 9) {
        mes = "0" + mes
      }
      if (ultimoDiaMes <= 9) {
        ultimoDiaMes = "0" + ultimoDiaMes
      }

      var formatearFecha = anio + '-' + mes + '-' + ultimoDiaMes
      // console.log('fecha formateada', formatearFecha)

      var FechaEnviar = fechaInicio.getFullYear() + '-' + (fechaInicio.getMonth() + 1) + '-' + ultimoDiaMes
      var FechaMostrar = convertirFechaLetra(formatearFecha)

      // console.log("imprimimos fecha", FechaMostrar)
      Fechas.push({
        periodo: FechaMostrar,
        fecha: FechaEnviar,
        fichas_id_ficha: this.props.fichaId,
        financiero_monto: "Nuevo",
        fisico_dinero: 0,
        programado_monto: 0
      })
    }
    // console.log('Fechas', Fechas)


    // agrupo los datos por dia
    const DataAgrupado = this.state.DataCronoProgramadoApi

    var EnviarDatosActualizar = this.state.EnviarDatos

    // console.log("enviar datos ", EnviarDatosActualizar)

    Fechas.forEach(anioMes => {

      if (!DataAgrupado.find(ger => ger.periodo == anioMes.periodo)) {
        const { periodo, fecha, fichas_id_ficha, financiero_monto, fisico_dinero, programado_monto } = anioMes;

        DataAgrupado.push({ periodo, fecha, fichas_id_ficha, financiero_monto, fisico_dinero, programado_monto });
        // push a enviar datos para armar los inputs para armar el envio al api
        EnviarDatosActualizar.push(
          [
            this.props.fichaId,
            fecha,
            0,
            0
          ]
        )
      }


    });

    // console.log('DataAgrupado', DataAgrupado)
    // console.log('EnviarDatosActualizar', EnviarDatosActualizar)

    this.setState({
      EnviarDatos: EnviarDatosActualizar,
      EstadoBtnEliminar: false,
      EstadoInputprogramado: true,
      EstadoInputFinanciero: true
    })
  }

  capturaInputsProgramado(e, i) {
    // console.log('value', e.target.value, "index", i)

    var convertString = e.target.value || 0
    var numero = ConvertFormatStringNumber(convertString);
    var avanceAcumulado = this.state.avanceAcumulado

    // console.log("avanceAcumulado>>>", avanceAcumulado)
    this.state.EnviarDatos[i].splice(2, 1, numero);

    // console.log("EnviarDatos", this.state.EnviarDatos)

    var SumaInputs = []
    this.state.EnviarDatos.forEach((data) => {
      if (data[4] !== "C") {
        SumaInputs.push(data[2])
      }
    })


    var total = SumaInputs.reduce(((a, b) => { return a + b; }));
    var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
    // console.log("total", costoDirecto)

    costoDirecto = costoDirecto - avanceAcumulado

    var saldoTotalCostoDirecto = costoDirecto - total
    saldoTotalCostoDirecto = Redondea2(saldoTotalCostoDirecto)

    // console.log('ResultResta',this.state.ResultResta)

    this.setState({
      ResultResta: saldoTotalCostoDirecto.toLocaleString("es-PE")
    })

    // console.log('resultado', this.state.EnviarDatos)
  }

  capturaInputsFinanciero(e, i) {
    // console.log('value', e.target.value, "index", i)

    var convertString = e.target.value || 0
    var numero = ConvertFormatStringNumber(convertString);
    var avanceAcumulado = this.state.avanceAcumulado

    // console.log("avanceAcumulado>>>", avanceAcumulado)
    this.state.EnviarDatos[i].splice(3, 1, numero);

    // var SumaInputs = []
    // this.state.EnviarDatos.forEach((data)=>
    //   SumaInputs.push( data[2] )
    // )


    // var total = SumaInputs.reduce(((a, b)=>{ return a + b; }));
    // var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
    // console.log("total", costoDirecto)

    // costoDirecto = costoDirecto - avanceAcumulado

    // var saldoTotalCostoDirecto = costoDirecto - total


    // console.log('ResultResta',this.state.ResultResta)

    // this.setState({
    //   ResultResta:saldoTotalCostoDirecto.toLocaleString("es-PE")
    // })

    // console.log('financiero', this.state.EnviarDatos)
  }

  enviarDatosApi() {
    // console.log(this.state.DataCronoArmadoEnviar)
    var DataModificar = this.state.EnviarDatos
    // console.log("DataModificar ", DataModificar)

    DataModificar.forEach((valor, i) => {
      if (valor[4] === "C") {
        DataModificar.splice(i, 1)
        valor.splice(4, 1)
      }

      DataModificar.forEach((sub, isub) => {
        sub.splice(4, 1)
      })


    });

    // console.log("DataMODIFICADO", DataModificar);

    if (confirm('¿Estas seguro de envias los datos del cronograma programado al sistema?')) {
      axios.post(`${UrlServer}/postcronogramamensual`,
        DataModificar
      )
        .then((res) => {
          console.log('res', res)
          // console.log('response', res.data.mes.length)
          if (res.status === 200) {
            toast.success('El cronograma - programado se ha ingresado.', { position: "top-right", autoClose: 1000 });
            this.setState(prevState => ({
              modal: !prevState.modal
            }));

            // .-------------------------------------------------------------------------------------------------------
            var Inputs = []
            var SumaInputs = []
            var totalSumaInpust = 0
            if (res.data.data.length > 0) {

              res.data.data.forEach((alfo, i) => {

                // console.log("data", alfo)
                // if(alfo.codigo !== "C"){
                Inputs.push(
                  [
                    this.props.fichaId,
                    alfo.fecha,
                    ConvertFormatStringNumber(alfo.programado_monto),
                    ConvertFormatStringNumber(alfo.financiero_monto),
                    alfo.codigo
                  ]
                )
                // }

              })


              Inputs.forEach((data) => {
                // console.log("data", data[4])
                if (data[4] !== "C") {
                  SumaInputs.push(data[2])
                }
              })

              totalSumaInpust = SumaInputs.reduce(((a, b) => { return a + b; }));
              // console.log("totalSumaInpust", totalSumaInpust)

            }

            var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
            var avanceAcumulado = res.data.avance_Acumulado
            var saldoTotalCostoDirecto = costoDirecto - avanceAcumulado
            saldoTotalCostoDirecto = saldoTotalCostoDirecto - totalSumaInpust

            saldoTotalCostoDirecto = Redondea2(saldoTotalCostoDirecto)

            // console.log("saldoTotalCostoDirecto", saldoTotalCostoDirecto)

            // if(saldoTotalCostoDirecto !== NaN){
            //   saldoTotalCostoDirecto = costoDirecto              
            // }
            // console.log("inputs", Inputs);

            this.setState({
              DataCronoGeneralApi: res.data,
              fechaActualApi: res.data.fechaActual,
              fecha_desde: res.data.fecha_final,
              DataCronoProgramadoApi: res.data.data,
              EnviarDatos: Inputs,
              fechaLimiteAnioMes: res.data.fecha_final.slice(0, 7),
              avanceAcumulado: ConvertFormatStringNumber(res.data.avance_Acumulado),
              ResultResta: saldoTotalCostoDirecto.toLocaleString("es-PE")

            })

            // alert('enviado al sistema')
          }
        })
        .catch((err) => {
          // console.log('err', err)
          toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.', { position: "top-right", autoClose: 5000 });

        })
    }

  }

  eliminarMes() {
    var tamanioUltimoIndex = this.state.EnviarDatos.length - 1

    var ultimaFecha = this.state.EnviarDatos[tamanioUltimoIndex][1]

    var MesAnioActual = ultimaFecha.slice(0, 7)

    var fechaActualMes = FechaActual().slice(0, 7)

    if (MesAnioActual === fechaActualMes) {
      // console.log("nooooooooo SE ELIMINA SON DISTINTOS")
      // console.log("MesAnioActual", MesAnioActual, "fechaActualMes", fechaActualMes)
      toast.error("no es posible eliminar el mes ya que es actual")

      this.setState({
        EstadoBtnEliminar: false
      })

    } else {
      if (this.state.EstadoBtnEliminar === false) {
        // console.log("SI SE ELIMINA SON DISTINTOS")
        var DataEnviarDataCrono = this.state.EnviarDatos
        DataEnviarDataCrono.pop()

        this.setState({
          EnviarDatos: DataEnviarDataCrono,
        })
      }


      if (confirm("¿Esta seguro en eliminar el mes?")) {
        axios.delete(`${UrlServer}/delCronogramaitem`, {
          data: {
            id_ficha: this.props.fichaId,
            fecha: ultimaFecha,
          }
        })
          .then((res) => {
            // console.log("response de eliminar", res);

            if (res.data === "eliminado") {
              var DataEnviarDataCrono = this.state.EnviarDatos
              DataEnviarDataCrono.pop()

              var DataMostrarCrono = this.state.DataCronoProgramadoApi
              DataMostrarCrono.pop()


              // console.log( 
              //   "DataCronoProgramadoApi",DataEnviarDataCrono,
              //   "EnviarDatos",DataMostrarCrono
              // )

              this.setState({
                EnviarDatos: DataEnviarDataCrono,
                DataCronoProgramadoApi: DataMostrarCrono
              })
              toast.success("MES ELIMINADO")

            } else if (res.data === "notFound") {
              toast.error("no existe el mes que desea eliminar.")
            }

          })
          .catch((err) => {
            console.log("errores en enviar los datos", err);

          })
      }
    }
  }

  eliminarMesNoData() {
    var DetalleFinanciero = ""
    this.state.DataCronoProgramadoApi.forEach(dataFinanciero => {
      // console.log("dataaa", dataFinanciero.financiero_monto)

      DetalleFinanciero = dataFinanciero.financiero_monto
    });

    // console.log("DetalleFinanciero", DetalleFinanciero)

    if (DetalleFinanciero === "Nuevo") {
      var DataEnviarDataCrono = this.state.EnviarDatos
      DataEnviarDataCrono.pop()

      var DataMostrarCrono = this.state.DataCronoProgramadoApi
      DataMostrarCrono.pop()

      this.setState({
        EnviarDatos: DataEnviarDataCrono,
        DataCronoProgramadoApi: DataMostrarCrono,
        EstadoBtnEliminar: false
      })
    } else {
      this.setState({
        EstadoBtnEliminar: true
      })
    }
  }

  EstadoInputprogramado(e) {
    var valorInput = e.target.value
    // console.log("value", valorInput);
    if (valorInput === "Programado") {
      this.setState({
        EstadoInputprogramado: !this.state.EstadoInputprogramado
      })
    } else {
      this.setState({
        EstadoInputFinanciero: !this.state.EstadoInputFinanciero
      })
    }
    // console.log("estado 0", this.state.EstadoInputprogramado)

  }

  capturaInputCorteFinanciero(e, id_historialEstado) {

    this.setState({
      inputCorteFinanciero: e.target.value,
      idInputApi: id_historialEstado
    })
    // console.log("e", e.target.value, " id_historialEstado ", id_historialEstado)
  }

  GuardarApiFinanciero() {

    axios.put(`${UrlServer}/postFinancieroCorte`,
      {
        "monto": this.state.inputCorteFinanciero,
        "id_historialEstado": this.state.idInputApi,
        "id_ficha": this.props.fichaId
      }
    )
      .then((res) => {
        // console.log("res envio de financiero", res); 

        var Inputs = []
        var SumaInputs = []
        var totalSumaInpust = 0
        if (res.data.data.length > 0) {

          res.data.data.forEach((alfo, i) => {

            // console.log("data", alfo)
            // if(alfo.codigo !== "C"){
            Inputs.push(
              [
                this.props.fichaId,
                alfo.fecha,
                ConvertFormatStringNumber(alfo.programado_monto),
                ConvertFormatStringNumber(alfo.financiero_monto),
                alfo.codigo
              ]
            )
            // }
          })


          Inputs.forEach((data) => {
            // console.log("data", data[4])
            if (data[4] !== "C") {
              SumaInputs.push(data[2])
            }

          }

          )

          totalSumaInpust = SumaInputs.reduce(((a, b) => { return a + b; }));
          // console.log("totalSumaInpust", totalSumaInpust)

        }

        var costoDirecto = ConvertFormatStringNumber(this.props.costoDirecto)
        var avanceAcumulado = res.data.avance_Acumulado
        var saldoTotalCostoDirecto = costoDirecto - avanceAcumulado
        saldoTotalCostoDirecto = saldoTotalCostoDirecto - totalSumaInpust

        saldoTotalCostoDirecto = Redondea2(saldoTotalCostoDirecto)

        // console.log("saldoTotalCostoDirecto", saldoTotalCostoDirecto)

        // if(saldoTotalCostoDirecto !== NaN){
        //   saldoTotalCostoDirecto = costoDirecto              
        // }
        // console.log("inputs", Inputs);

        this.setState({
          DataCronoGeneralApi: res.data,
          fechaActualApi: res.data.fechaActual,
          fecha_desde: res.data.fecha_final,
          DataCronoProgramadoApi: res.data.data,
          EnviarDatos: Inputs,
          fechaLimiteAnioMes: res.data.fecha_final.slice(0, 7),
          avanceAcumulado: ConvertFormatStringNumber(res.data.avance_Acumulado),
          ResultResta: saldoTotalCostoDirecto.toLocaleString("es-PE")

        })

        toast.success("✔ éxito!!! ")
      })
      .catch((err) => {
        console.error("error", err);
        toast.error("error ❌")
      })
  }

  render() {
    var TotalCostoDirecto = ConvertFormatStringNumber(this.props.costoDirecto) - ConvertFormatStringNumber(this.state.avanceAcumulado)
    var TotalCostoDirectoSumado = TotalCostoDirecto
    const { DataCronoGeneralApi, DataCronoProgramadoApi, EstadoBtnEliminar } = this.state


    const options = {
      chart: {
        type: 'line',
        backgroundColor: '#0a1123ad',
      },

      legend: {
        itemStyle: {
          color: '#E0E0E3'
        },
        itemHoverStyle: {
          color: '#ffffff'
        },
        itemHiddenStyle: {
          color: '#606063'
        }
      },

      title: {
        text: 'CURVA "S"',
        color: '#ffffff'
      },
      subtitle: {
        text: 'GRAFICO DEL PORCENTAJE DE AVANCE PROGRAMADO VS EJECUTADO ACUMULADO'
      },
      xAxis: {
        categories: DataCronoGeneralApi.grafico_periodos
      },
      yAxis: {
        title: {
          text: 'Porcentaje % '
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: true
        }
      },
      series: [{
        name: 'Avance programado',
        data: DataCronoGeneralApi.grafico_programado
      }, {
        name: 'Avance Fisico',
        data: DataCronoGeneralApi.grafico_fisico
      },
      {
        name: 'Avance Financiero',
        data: DataCronoGeneralApi.grafico_financiero
      }]
    }

    return (
      <div className="card">
        <div className="card-header text-center">
          HISTOGRAMA DEL AVANCE DE OBRA - CONTROL DE CUVA "S"
        </div>
        <div className="card-body">
          <div className="table-responsive">

            <HighchartsReact
              highcharts={Highcharts}
              // constructorType={'stockChart'}
              options={options}
            />

            <Row className="mr-1">

              <Col sm="6">
                <InputGroup size="sm">
                  <InputGroupAddon addonType="prepend">De:</InputGroupAddon>
                  <label className="form-control form-control-sm text-capitalize">{convertirFechaLetra(this.state.fecha_desde)}</label>

                  <InputGroupAddon addonType="prepend">al:</InputGroupAddon>
                  <Input type="month" min={this.state.fechaLimiteAnioMes} onChange={e => this.setState({ fecha_hasta: e.target.value })} />
                  <Button color="info" onClick={this.GeneraFechasSegunOrden} >CREAR </Button>
                </InputGroup>
              </Col>

              <Col sm="1">
                <label>{this.state.DataCronoProgramadoApi.length} MESES  </label>
              </Col>

              <Col sm="2">
                <label>COSTO DIRECTO S/. {TotalCostoDirectoSumado.toLocaleString("es-PE")}</label>
              </Col>

              <Col sm="3">
                <FormGroup>
                  <CustomInput type="switch" id="histograma" name="histograma" label="Programado" onChange={this.EstadoInputprogramado} inline value="Programado" />
                  <CustomInput type="switch" id="histograma1" name="histograma" label="Financiero" onChange={this.EstadoInputprogramado} inline value="Financiero" />
                </FormGroup>
              </Col>
            </Row>



            <table className="table table-sm mt-2">
              <thead>
                <tr className="text-center" >
                  <th colSpan="5">MONTOS VALORIZADOS PROGRAMADOS</th>
                  <th colSpan="6">MONTOS VALORIZADOS EJECUTADOS</th>
                </tr>

                <tr className="text-center" >
                  <th colSpan="2">Periodo</th>
                  <th colSpan="3">Programado</th>
                  <th colSpan="3">Fisico Ejecutado</th>
                  <th colSpan="3">Financiero Ejecutado</th>
                </tr>

                <tr className="text-center" >
                  <th>Nº</th>
                  <th>Mes del informe</th>
                  <th>Monto S/.</th>
                  <th>% Ejecucion programada</th>
                  <th>% Acumulado</th>
                  <th>Monto S/.</th>
                  <th>% Ejecucion programada</th>
                  <th>% Acumulado</th>
                  <th>Monto S/.</th>
                  <th>% Ejecucion programada</th>
                  <th>% Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {
                  DataCronoProgramadoApi === undefined ?
                    <tr>
                      <td colSpan="11">CARGANDO</td>
                    </tr> :
                    DataCronoProgramadoApi.map((crono, IC) =>
                      <tr key={IC} className={crono.codigo === "C" ? "bg-danger" : ""}>
                        <td>{IC === 0 ? "" : IC}</td>
                        <td className="text-capitalize"> {crono.periodo} </td>
                        <td>
                          {
                            crono.codigo === "C" ?
                              crono.programado_monto :
                              <div>
                                <InputGroup size="sm">
                                  <Input disabled={this.state.EstadoInputprogramado !== true} placeholder={crono.programado_monto} onBlur={e => this.capturaInputsProgramado(e, IC)} type="text" />
                                </InputGroup>

                                <label className={ConvertFormatStringNumber(this.state.ResultResta) === 0 ? "text-success small mb-0" : "text-warning small mb-0"}>
                                  S/. {Number(this.state.ResultResta).toLocaleString("es-PE")}
                                </label>
                              </div>
                          }
                        </td>
                        <td className="text-right">{crono.programado_porcentaje}</td>
                        <td className="text-right">{crono.programado_acumulado}</td>

                        <td className="text-right">{crono.fisico_monto}</td>
                        <td className="text-right">{crono.fisico_porcentaje}</td>
                        <td className="text-right">{crono.fisico_acumulado}</td>
                        <td>
                          {
                            crono.codigo === "C"
                              ?

                              <InputGroup size="sm">
                                <Input placeholder={crono.financiero_monto} disabled={this.state.EstadoInputFinanciero !== true} onChange={e => this.capturaInputCorteFinanciero(e, crono.id_historialEstado)} />
                                <InputGroupAddon addonType="append">
                                  <Button color="primary" disabled={this.state.EstadoInputFinanciero !== true} onClick={this.GuardarApiFinanciero}>
                                    <MdSave />
                                  </Button>
                                </InputGroupAddon>
                              </InputGroup>
                              :
                              <InputGroup size="sm">
                                <Input disabled={this.state.EstadoInputFinanciero !== true} placeholder={crono.financiero_monto} onBlur={e => this.capturaInputsFinanciero(e, IC)} type="text" />
                              </InputGroup>
                          }
                        </td>
                        <td className="text-right">{crono.financiero_porcentaje}</td>
                        <td className="text-right">{crono.financiero_acumulado}</td>
                      </tr>
                    )
                }


                <tr>
                  <td colSpan="2">Total a la Fecha</td>
                  <td className="text-right">S/. {DataCronoGeneralApi.programado_monto_total}</td>
                  <td className="text-right">{DataCronoGeneralApi.programado_porcentaje_total} %</td>
                  <td className="border-bottom-0"></td>

                  <td className="text-right">S/. {DataCronoGeneralApi.fisico_monto_total}</td>
                  <td className="text-right">{DataCronoGeneralApi.fisico_porcentaje_total} %</td>
                  <td className="border-bottom-0"></td>

                  <td className="text-right">S/. {DataCronoGeneralApi.financiero_monto_total}</td>
                  <td className="text-right">{DataCronoGeneralApi.financiero_porcentaje_total}%</td>
                  <td className="border-bottom-0 border-right-0"></td>

                </tr>
              </tbody>
            </table>
            {
              EstadoBtnEliminar === false ?
                <Button color="danger" onClick={this.eliminarMesNoData}>Eliminar Ultimo Mes</Button>
                :
                <Button color="danger" onClick={this.eliminarMes}>Eliminar Ultimo Mes</Button>
            }


            {
              ConvertFormatStringNumber(this.state.ResultResta) === 0 ?
                <Button color="success" onClick={this.enviarDatosApi} >Guardar datos</Button> : "😒"
            }
          </div>

        </div>

      </div>
    )
  }
};

export default CronogramaAvance;
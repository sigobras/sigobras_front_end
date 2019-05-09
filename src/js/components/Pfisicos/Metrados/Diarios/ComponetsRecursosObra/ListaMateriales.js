import React, { Component } from 'react';
import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';
import { FaPlus, FaCheck, FaSuperpowers } from 'react-icons/fa';
import { MdFlashOn, MdReportProblem, MdClose, MdPerson, MdSearch, MdSettings, MdFilterTiltShift, MdVisibility, MdMonetizationOn, MdWatch, MdLibraryBooks, MdInsertPhoto, MdAddAPhoto } from 'react-icons/md';
import { TiWarning } from "react-icons/ti";

import { InputGroupAddon, InputGroupText, CustomInput,  InputGroup, Spinner, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, InputGroupButtonDropdown, Input, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledPopover, PopoverHeader, PopoverBody, Col, Row  } from 'reactstrap';
import classnames from 'classnames';

import { toast } from "react-toastify";

import LogoSigobras from '../../../../../../images/logoSigobras.png'
import { UrlServer } from '../../../../Utils/ServerUrlConfig';
import { ConvertFormatStringNumber, PrimerDiaDelMesActual, FechaActual } from '../../../../Utils/Funciones'
// import { inflateRaw } from 'zlib';

class ListaMateriales extends Component {
    constructor(){
      super();
  
      this.state = {
        DataComponentes:[],
        DataPartidas:[],
        DataActividades:[],
        DataMayorMetrado:[],
        DataPrioridadesApi:[],
        DataIconosCategoriaApi:[],
        activeTab:'0',
        modal: false,
        modalMm: false,
        nombreComponente:'',
        
        // creo que son data de imputs
        ValorMetrado:'',
        DescripcionMetrado:'',
        ObservacionMetrado:'',
        IdMetradoActividad:'',
        debounceTimeout: 500,
  
        // datos para capturar en el modal
        id_actividad:'',
        nombre_actividad:'',
        unidad_medida:'',
        costo_unitario:'',
        actividad_metrados_saldo:'',
        indexComp:'',
        actividad_porcentaje:'',
        actividad_avance_metrado:'',
        metrado_actividad:'',
        viewIndex:'',
        parcial_actividad:'',
        descripcion:'',
        metrado:'',
        porcentaje_negatividad:0,
  
        // registrar inputs de mayores metrados
        nombre:'',
        veces:'',
        largo:'',
        ancho:'',
        alto:'',
        parcialMM:0,
        tipo:'',
        partidas_id_partida:'',

        // validacion de al momento de metrar
        smsValidaMetrado:'',
        parcial:'',
        // cargar imagenes
        file: null,
        UrlImagen:"",
        SMSinputTypeImg: false,
        
        // funciones de nueva libreria
        dropdownOpen: false,
        collapse: 2599,
        id_componente:'',
        indexPartida:0,
        OpcionMostrarMM:'',
        mostrarIconos:null,
        mostrarColores: null,
        // filtrador
        BuscaPartida:null,
        FilterSelected:"% Avance",

        // captura de la fecha
        fecha_actualizacion:'',
        // demos  iconos-----------------
        iconos: [<MdMonetizationOn />, <MdVisibility />, <MdWatch />, <TiWarning />, <MdLibraryBooks />, <FaSuperpowers />],

        dataFiltrada:[],

        modalImgPartida: false,
        // ENVIO DE FORMULARIO DE IMAGEN DINAMICO
        Id_Partida_O_Actividad:null,
        EnvioImgObsApiRuta:null, 
        
        
        CollapseResumenTabla:"",

      }

      this.Tabs = this.Tabs.bind(this)
      this.CapturarID = this.CapturarID.bind(this)
      this.modalMetrar = this.modalMetrar.bind(this)
      this.modalMayorMetrado = this.modalMayorMetrado.bind(this)
      this.onChangeImgMetrado = this.onChangeImgMetrado.bind(this)
      
      this.EnviarMetrado_EJECUCION = this.EnviarMetrado_EJECUCION.bind(this)
      this.EnviarMetrado_CORTE = this.EnviarMetrado_CORTE.bind(this)
      this.EnviarMetrado_ACTUALIZACION = this.EnviarMetrado_ACTUALIZACION.bind(this)
      
      this.capturaidMM = this.capturaidMM.bind(this)
      this.EnviarMayorMetrado = this.EnviarMayorMetrado.bind(this)

      this.Filtrador = this.Filtrador.bind(this)
      this.toggleDropDown = this.toggleDropDown.bind(this);
      this.CollapseItem = this.CollapseItem.bind(this);
      this.Prioridad = this.Prioridad.bind(this);
      this.UpdatePrioridadIcono = this.UpdatePrioridadIcono.bind(this);
      this.UpdatePrioridadColor = this.UpdatePrioridadColor.bind(this);
      this.clearImg = this.clearImg.bind(this);
      this.modalImgPartida = this.modalImgPartida.bind(this);
      this.capturaDatosCrearImgPartida = this.capturaDatosCrearImgPartida.bind(this);
      this.EnviaImgPartida = this.EnviaImgPartida.bind(this);
      this.CollapseResumenTabla = this.CollapseResumenTabla.bind(this);
    }

    componentWillMount(){
      document.title ="Metrados Diarios"
      axios.post(`${UrlServer}/getComponentes`,{
        id_ficha: sessionStorage.getItem('idobra')
      })
      .then((res)=>{
          // console.log(res.data);
          // console.time("tiempo");


          var partidas = res.data[0].partidas
          // seteando la data que se me envia del api- agrega un icono
          for (let i = 0; i < partidas.length; i++) {
            // console.log("partida",  partidas[i].iconocategoria_nombre)
            if (partidas[i].iconocategoria_nombre === "<FaSuperpowers/>") {
              partidas[i].iconocategoria_nombre = <FaSuperpowers />
            }else if (partidas[i].iconocategoria_nombre === "<MdLibraryBooks/>") {
              partidas[i].iconocategoria_nombre = <MdLibraryBooks />              
            }else if (partidas[i].iconocategoria_nombre === "<TiWarning/>") {
              partidas[i].iconocategoria_nombre = <TiWarning />              
            }else if (partidas[i].iconocategoria_nombre === "<MdWatch/>") {
              partidas[i].iconocategoria_nombre = <MdWatch />              
            }else if (partidas[i].iconocategoria_nombre === "<MdVisibility/>") {
              partidas[i].iconocategoria_nombre = <MdVisibility />              
            }else if (partidas[i].iconocategoria_nombre === "<MdMonetizationOn/>") {
              partidas[i].iconocategoria_nombre = <MdMonetizationOn />                         
            }else{
              partidas[i].iconocategoria_nombre = null
            }
          }

          // console.log(partidas)
          // console.timeEnd("tiempo");
          
          this.setState({
            DataComponentes:res.data,
            DataPartidas:res.data[0].partidas,
            nombreComponente:res.data[0].nombre,
          })
      })
      .catch((error)=>{
        toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.',{ position: "top-right",autoClose: 5000 });
        // console.error('algo salio mal verifique el',error);
      })

      // axios consulta al api de  prioridades ====================================
      axios.get(`${UrlServer}/getPrioridades`)
      .then((res)=>{
        // console.log("datos", res.data);
        this.setState({
          DataPrioridadesApi:res.data
        })
      })
      .catch((err)=>{
        console.log("errores al realizar la peticion de prioridades", err);
        
      })
      // axios consulta al api de  prioridades ====================================

      axios.get(`${UrlServer}/getIconoscategorias`)
      .then((res)=>{
        // console.log("datos", res.data);

        var CategoriasIconos = res.data

        CategoriasIconos.forEach(ico => {
          if (ico.nombre === "<FaSuperpowers/>") {
            ico.nombre = <FaSuperpowers />
          }else if (ico.nombre === "<MdLibraryBooks/>") {
            ico.nombre = <MdLibraryBooks />              
          }else if (ico.nombre === "<TiWarning/>") {
            ico.nombre = <TiWarning />              
          }else if (ico.nombre === "<MdWatch/>") {
            ico.nombre = <MdWatch />              
          }else if (ico.nombre === "<MdVisibility/>") {
            ico.nombre = <MdVisibility />              
          }else if (ico.nombre === "<MdMonetizationOn/>") {
            ico.nombre = <MdMonetizationOn />                         
          }else{
            ico.nombre = null
          }
        });

        // console.log("CategoriasIconos", CategoriasIconos);

        this.setState({
          DataIconosCategoriaApi:CategoriasIconos
        })
      })
      .catch((err)=>{
        console.log("errores al realizar la peticion de iconos", err);
        
      })
      
    }

    Tabs(tab, id_componente,  nombComp) {

      if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab,
            nombreComponente: nombComp,
            DataPartidas:[],
            id_componente,
            collapse:-1,
            BuscaPartida:null,

          });
      }

      // get partidas -----------------------------------------------------------------
      axios.post(`${ UrlServer}/getPartidas`,{
        id_componente: id_componente
      })
      .then((res)=>{
          // console.log('getPartidas>>', res.data);
          
          var partidas = res.data
          // seteando la data que se me envia del api- agrega un icono
          for (let i = 0; i < partidas.length; i++) {
            // console.log("partida",  partidas[i].iconocategoria_nombre)
            if (partidas[i].iconocategoria_nombre === "<FaSuperpowers/>") {
              partidas[i].iconocategoria_nombre = <FaSuperpowers />
            }else if (partidas[i].iconocategoria_nombre === "<MdLibraryBooks/>") {
              partidas[i].iconocategoria_nombre = <MdLibraryBooks />              
            }else if (partidas[i].iconocategoria_nombre === "<TiWarning/>") {
              partidas[i].iconocategoria_nombre = <TiWarning />              
            }else if (partidas[i].iconocategoria_nombre === "<MdWatch/>") {
              partidas[i].iconocategoria_nombre = <MdWatch />              
            }else if (partidas[i].iconocategoria_nombre === "<MdVisibility/>") {
              partidas[i].iconocategoria_nombre = <MdVisibility />              
            }else if (partidas[i].iconocategoria_nombre === "<MdMonetizationOn/>") {
              partidas[i].iconocategoria_nombre = <MdMonetizationOn />                         
            }else{
              partidas[i].iconocategoria_nombre = null
            }
          }
          // console.log("dsds", partidas);
          
          this.setState({
            DataPartidas:partidas,
          })
      })
      .catch((error)=>{
        toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.',{ position: "top-right",autoClose: 5000 });
          // console.error('algo salio mal verifique el',error);
      })
    }
 
    CapturarID(id_actividad, nombre_actividad, unidad_medida, costo_unitario, actividad_metrados_saldo, indexComp, actividad_porcentaje, actividad_avance_metrado, metrado_actividad, viewIndex, parcial_actividad, descripcion, metrado, parcial, porcentaje_negativo) {
              
      // console.log('porcentaje_negatividad', porcentaje_negativo)

      // this.modalMetrar();
        this.setState({
            modal: !this.state.modal,
            id_actividad: id_actividad,
            nombre_actividad: nombre_actividad,
            unidad_medida: unidad_medida,
            costo_unitario: costo_unitario,
            actividad_metrados_saldo: actividad_metrados_saldo,
            indexComp: indexComp,
            actividad_porcentaje: actividad_porcentaje,
            actividad_avance_metrado: actividad_avance_metrado,
            metrado_actividad: metrado_actividad,
            viewIndex: viewIndex,
            parcial_actividad: parcial_actividad,
            descripcion:descripcion,
            smsValidaMetrado:'', 
            metrado:metrado,
            parcial:parcial,
            porcentaje_negatividad:porcentaje_negativo,

            // limpia valores por si los tiene
            UrlImagen:"",
            file:null,
        })
        
    }

    modalMetrar() {
        this.setState({
            modal: !this.state.modal
        });
    }

    modalMayorMetrado() {
      this.setState({
          modalMm: !this.state.modalMm
      });
    }

    onChangeImgMetrado(e) {

       var inputValueImg = e.target.files[0]

      if( inputValueImg.type === "image/jpeg" || inputValueImg.type === "image/png" || inputValueImg.type === "image/jpg"  ){
          console.log('subir imagen', inputValueImg);
          var url = URL.createObjectURL(inputValueImg)
          console.log("url", url);
          
          this.setState({ 
            file: inputValueImg,
            UrlImagen:url,
            SMSinputTypeImg:false
          });
          return
        }

        this.setState({
          SMSinputTypeImg:true,
          UrlImagen:"",
          file:null
        })
    }

    // FUNCIONES DE ESTADOS DE OBRA  =====================================================
    EnviarMetrado_EJECUCION(e){

        e.preventDefault()
        
        var { id_actividad, DescripcionMetrado, ObservacionMetrado, ValorMetrado, DataPartidas, DataActividades, actividad_metrados_saldo, file, indexPartida } = this.state
        var DataModificadoPartidas = DataPartidas
        var DataModificadoActividades = DataActividades
        actividad_metrados_saldo =  ConvertFormatStringNumber(actividad_metrados_saldo)
        
        // funciones  para cargar las imagenes
        const formData = new FormData();
        formData.append('foto', this.state.file);
        formData.append('accesos_id_acceso',sessionStorage.getItem('idacceso'));
        formData.append('codigo_obra', sessionStorage.getItem("codigoObra"));
        formData.append('Actividades_id_actividad',id_actividad);
        formData.append('valor',this.state.ValorMetrado);
        formData.append('descripcion',DescripcionMetrado);
        formData.append('observacion',ObservacionMetrado);

        // formData.append('id_ficha', sessionStorage.getItem('idobra'))

        // console.log("formData", formData);
        
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        if(ValorMetrado === '' || ValorMetrado === '0' || ValorMetrado === NaN ){
            this.setState({smsValidaMetrado:'Ingrese un valor de metrado válido'})
        }else if( Number(ValorMetrado) < 0){
            this.setState({smsValidaMetrado:'El valor del metrado es inferior a cero'})
        }else if(Number(ValorMetrado) >actividad_metrados_saldo){
            this.setState({smsValidaMetrado:'El valor del metrado ingresado es mayor al saldo disponible'})
        }else{
            if(confirm('¿Estas seguro de metrar?')){
              this.setState({
                  modal: !this.state.modal
              })

              // ENVIO DE DATOS NORMAL SIN IMAGEN
              axios.post(`${UrlServer}/avanceActividad`,
                formData,
                config
              )
              .then((res)=>{
                  console.log('return datos', res)

                  var partidaSetIcon = res.data.partida
                  

                  var CategoriasIconos = res.data.partida.iconocategoria_nombre 

                // CategoriasIconos.forEach(ico => {
                  if (CategoriasIconos === "<FaSuperpowers/>") {
                    CategoriasIconos = <FaSuperpowers />
                  }else if (CategoriasIconos === "<MdLibraryBooks/>") {
                    CategoriasIconos = <MdLibraryBooks />              
                  }else if (CategoriasIconos === "<TiWarning/>") {
                    CategoriasIconos = <TiWarning />              
                  }else if (CategoriasIconos === "<MdWatch/>") {
                    CategoriasIconos = <MdWatch />              
                  }else if (CategoriasIconos === "<MdVisibility/>") {
                    CategoriasIconos = <MdVisibility />              
                  }else if (CategoriasIconos === "<MdMonetizationOn/>") {
                    CategoriasIconos = <MdMonetizationOn />                         
                  }else{
                    CategoriasIconos = null
                  }

                  partidaSetIcon.iconocategoria_nombre = CategoriasIconos

                  // console.log("CategoriasIconos" , CategoriasIconos);
                  

                  DataModificadoPartidas[indexPartida] = partidaSetIcon
                  DataModificadoActividades = res.data.actividades
          
                  this.setState({
                    DataPartidas: DataModificadoPartidas,
                    DataActividades:DataModificadoActividades,
                    
                    ValorMetrado:"",
                    DescripcionMetrado:"",
                    ObservacionMetrado:"",
                    file:null

                  })
                  toast.success('Exito! Metrado ingresado');
              })
              .catch((errors)=>{
                  toast.error('hubo errores al ingresar el metrado');
                  // console.error('algo salio mal al consultar al servidor ', error)
              })
            }
        }
    }

    EnviarMetrado_CORTE(e){

      e.preventDefault()
      
      var { id_actividad, DescripcionMetrado, ObservacionMetrado, ValorMetrado, DataPartidas, DataActividades, actividad_metrados_saldo, file, indexPartida } = this.state
      var DataModificadoPartidas = DataPartidas
      var DataModificadoActividades = DataActividades
      // actividad_metrados_saldo =  ConvertFormatStringNumber(actividad_metrados_saldo)
      

      // funciones  para cargar las imagenes
      const formData = new FormData();
      formData.append('foto', this.state.file);
      formData.append('accesos_id_acceso',sessionStorage.getItem('idacceso'));
      formData.append('codigo_obra', sessionStorage.getItem("codigoObra"));
      formData.append('Actividades_id_actividad',id_actividad);
      formData.append('valor',this.state.ValorMetrado - this.state.actividad_avance_metrado);
      formData.append('descripcion',DescripcionMetrado);
      formData.append('observacion',ObservacionMetrado);

      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };

      // if(ValorMetrado === '' || ValorMetrado === '0' || ValorMetrado === NaN ){
      //     this.setState({smsValidaMetrado:'Ingrese un valor de metrado válido'})
      // }else if( Number(ValorMetrado) < 0){
      //     this.setState({smsValidaMetrado:'El valor del metrado es inferior a cero'})
      // }else if(Number(ValorMetrado) > actividad_metrados_saldo){
      //     this.setState({smsValidaMetrado:'El valor del metrado ingresado es mayor al saldo disponible'})
      // }else{
          if(confirm('¿Estas seguro de metrar?')){
            this.setState({
                modal: !this.state.modal
            })

            // ENVIO DE DATOS NORMAL SIN IMAGEN
            axios.post(`${UrlServer}/avanceActividadCorte`,
              formData,
              config
            )
            .then((res)=>{
                // console.log('return dattos', res)
                var partidaSetIcon = res.data.partida
                  

                var CategoriasIconos = res.data.partida.iconocategoria_nombre 

              // CategoriasIconos.forEach(ico => {
                if (CategoriasIconos === "<FaSuperpowers/>") {
                  CategoriasIconos = <FaSuperpowers />
                }else if (CategoriasIconos === "<MdLibraryBooks/>") {
                  CategoriasIconos = <MdLibraryBooks />              
                }else if (CategoriasIconos === "<TiWarning/>") {
                  CategoriasIconos = <TiWarning />              
                }else if (CategoriasIconos === "<MdWatch/>") {
                  CategoriasIconos = <MdWatch />              
                }else if (CategoriasIconos === "<MdVisibility/>") {
                  CategoriasIconos = <MdVisibility />              
                }else if (CategoriasIconos === "<MdMonetizationOn/>") {
                  CategoriasIconos = <MdMonetizationOn />                         
                }else{
                  CategoriasIconos = null
                }

                partidaSetIcon.iconocategoria_nombre = CategoriasIconos

                console.log("CategoriasIconos" , CategoriasIconos);
                

                DataModificadoPartidas[indexPartida] = partidaSetIcon
                DataModificadoActividades = res.data.actividades
        
                this.setState({
                  DataPartidas: DataModificadoPartidas,
                  DataActividades:DataModificadoActividades,
                  
                  ValorMetrado:"",
                  DescripcionMetrado:"",
                  ObservacionMetrado:"",
                  file:null,
                  UrlImagen:""
                })
                toast.success('Exito! Metrado ingresado');
            })
            .catch((errors)=>{
                toast.error('hubo errores al ingresar el metrado');
                // console.error('algo salio mal al consultar al servidor ', error)
            })

      }
    }

    EnviarMetrado_ACTUALIZACION(e){

      e.preventDefault()
      
      var { id_actividad, DescripcionMetrado, ObservacionMetrado, ValorMetrado, DataPartidas, DataActividades, actividad_metrados_saldo, file, indexPartida, fecha_actualizacion } = this.state
      var DataModificadoPartidas = DataPartidas
      var DataModificadoActividades = DataActividades
      actividad_metrados_saldo =  ConvertFormatStringNumber(actividad_metrados_saldo)
      

      // funciones  para cargar las imagenes
        const formData = new FormData();
        formData.append('foto', this.state.file);
        formData.append('accesos_id_acceso',sessionStorage.getItem('idacceso'));
        formData.append('codigo_obra', sessionStorage.getItem("codigoObra"));
        formData.append('Actividades_id_actividad',id_actividad);
        formData.append('valor',this.state.ValorMetrado);
        formData.append('descripcion',DescripcionMetrado);
        formData.append('observacion',ObservacionMetrado);
        formData.append('fecha',fecha_actualizacion);

      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };

      if(ValorMetrado === '' || ValorMetrado === '0' || ValorMetrado === NaN ){
          this.setState({smsValidaMetrado:'Ingrese un valor de metrado válido'})
      }else if( Number(ValorMetrado) < 0){
          this.setState({smsValidaMetrado:'El valor del metrado es inferior a cero'})
      }else if(Number(ValorMetrado) > actividad_metrados_saldo){
          this.setState({smsValidaMetrado:'El valor del metrado ingresado es mayor al saldo disponible'})
      }else if(fecha_actualizacion ===""){
          this.setState({smsValidaFecha:"Ingrese una fecha" })
      }else{
          if(confirm('¿Estas seguro de metrar?')){

            // ENVIO DE DATOS NORMAL SIN IMAGEN
            axios.post(`${UrlServer}/avanceActividadActualizacion`,
              formData,
              config
            )
            .then((res)=>{
                console.log('return dattos', res.data.partida)

                if(res.data === "fecha invalida"){
                  this.setState({smsValidaFecha:"La fecha de su dispositivo se encuentra desactualizado" })

                }else{
                  
                
                  var partidaSetIcon = res.data.partida
                  

                  var CategoriasIconos = res.data.partida.iconocategoria_nombre 

                // CategoriasIconos.forEach(ico => {
                  if (CategoriasIconos === "<FaSuperpowers/>") {
                    CategoriasIconos = <FaSuperpowers />
                  }else if (CategoriasIconos === "<MdLibraryBooks/>") {
                    CategoriasIconos = <MdLibraryBooks />              
                  }else if (CategoriasIconos === "<TiWarning/>") {
                    CategoriasIconos = <TiWarning />              
                  }else if (CategoriasIconos === "<MdWatch/>") {
                    CategoriasIconos = <MdWatch />              
                  }else if (CategoriasIconos === "<MdVisibility/>") {
                    CategoriasIconos = <MdVisibility />              
                  }else if (CategoriasIconos === "<MdMonetizationOn/>") {
                    CategoriasIconos = <MdMonetizationOn />                         
                  }else{
                    CategoriasIconos = null
                  }

                  partidaSetIcon.iconocategoria_nombre = CategoriasIconos

                  // console.log("CategoriasIconos" , CategoriasIconos);
                  

                  DataModificadoPartidas[indexPartida] = partidaSetIcon
                  DataModificadoActividades = res.data.actividades
          
                  this.setState({
                    DataPartidas: DataModificadoPartidas,
                    DataActividades:DataModificadoActividades,
                    modal: !this.state.modal,

                    ValorMetrado:"",
                    DescripcionMetrado:"",
                    ObservacionMetrado:"",
                    smsValidaFecha:"",
                    file:null

                  })
                  toast.success('Exito! Metrado ingresado');
                }
                
            })
            .catch((errors)=>{
                toast.error('hubo errores al ingresar el metrado');
                // console.error('algo salio mal al consultar al servidor ', error)
            })
          }
      }
    }

    capturaidMM(partidas_id_partida, indexComp, indexPartida ,descripcion){
      this.setState({
        modalMm: !this.state.modalMm,
        partidas_id_partida: partidas_id_partida,
        descripcion:descripcion,
        indexComp:indexComp,
        viewIndex:indexPartida,
        OpcionMostrarMM:''
      })
    }

    EnviarMayorMetrado(e){
      e.preventDefault()

      var { DataPartidas, DataActividades, nombre, veces, largo, ancho, alto, parcialMM, partidas_id_partida, indexPartida, OpcionMostrarMM } = this.state

      var DataModificadoPartidas = DataPartidas
      var DataModificadoActividades = DataActividades

      if(confirm('¿Estas seguro de registar el mayor metrado?')){
        this.setState({
          modalMm: !this.state.modalMm
        })

        axios.post(`${UrlServer}/postNuevaActividadMayorMetrado`,{
          "nombre":nombre,
          "veces":veces,
          "largo":largo,
          "ancho":ancho,
          "alto":alto,
          "parcial":parcialMM,
          "tipo":OpcionMostrarMM,
          "partidas_id_partida":partidas_id_partida
        })
        .then((res)=>{
            // console.log(res)

            var partidaSetIcon = res.data.partida
                  

            var CategoriasIconos = res.data.partida.iconocategoria_nombre 

          // CategoriasIconos.forEach(ico => {
            if (CategoriasIconos === "<FaSuperpowers/>") {
              CategoriasIconos = <FaSuperpowers />
            }else if (CategoriasIconos === "<MdLibraryBooks/>") {
              CategoriasIconos = <MdLibraryBooks />              
            }else if (CategoriasIconos === "<TiWarning/>") {
              CategoriasIconos = <TiWarning />              
            }else if (CategoriasIconos === "<MdWatch/>") {
              CategoriasIconos = <MdWatch />              
            }else if (CategoriasIconos === "<MdVisibility/>") {
              CategoriasIconos = <MdVisibility />              
            }else if (CategoriasIconos === "<MdMonetizationOn/>") {
              CategoriasIconos = <MdMonetizationOn />                         
            }else{
              CategoriasIconos = null
            }

            partidaSetIcon.iconocategoria_nombre = CategoriasIconos

            // console.log("CategoriasIconos" , CategoriasIconos);
            

            DataModificadoPartidas[indexPartida] = partidaSetIcon
            DataModificadoActividades = res.data.actividades

            this.setState({
              DataPartidas: DataModificadoPartidas,
              DataActividades:DataModificadoActividades,
              nombre:'',
              veces:'',
              largo:'',
              ancho:'',
              alto:'',
              parcial:'',
              tipo:'',
              partidas_id_partida:'',
            })

            toast.success('Exito! Metrado mayor metrado registrado al sistema');
        })
        .catch((err)=>{
            toast.error('hubo errores al ingresar el metrado');
            console.error('algo salio mal al consultar al servidor❌❌ ', err)
        })
      }
    }

    // mas funciones para metrados
    CollapseItem(valor, id_partida){
      if(valor !== -1 && id_partida !== -1){
        let event = valor  
        this.setState({ 
          collapse: this.state.collapse === Number(event) ? -1 : Number(event),
          indexPartida:valor,
          DataActividades:[],
          DataMayorMetrado:[]
        });
        

        // getActividades -----------------------------------------------------------------
        if(event !== this.state.collapse){
          axios.post(`${ UrlServer}/getActividades`,{
            id_partida: id_partida
          })
          .then((res)=>{
              // console.log('DataActividades>>', res.data.mayor_metrado);
              
              this.setState({
                DataActividades:res.data.actividades,
                DataMayorMetrado:res.data.mayor_metrado
              })
          })
          .catch((error)=>{
            toast.error('No es posible conectar al sistema. Comprueba tu conexión a internet.',{ position: "top-right",autoClose: 5000 });
              // console.error('algo salio mal verifique el',error);
          })
        }
          
      }
    }
  
    Filtrador(e) {
      // console.log("datos ", e)
       var valorRecibido = e
      if( typeof valorRecibido === "number"){
        this.setState({ 
          BuscaPartida: valorRecibido,
          mostrarIconos:-1
        })

        switch (valorRecibido) {
          case 101:
            this.setState({
              FilterSelected:"% Avance"
            })
            break;

          case 0:
            this.setState({
              FilterSelected:"0%"
            })
            break;
        
          case 100:
            this.setState({
              FilterSelected:"100%"
            })
            break;

          case 104:
            this.setState({
              FilterSelected:"MM"
            })
            break;
          default:
            this.setState({
              FilterSelected:"Progreso"
            })
            break;
        }
      // console.log("valorRecibido ",valorRecibido)

      }else{
        this.setState({ 
          BuscaPartida: e.target.value,
        })
      // console.log("valorRecibido ",e.target.value)

      }
    }
  
    toggleDropDown() {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
    }
  
    Prioridad(i){
      console.log("cambia",i)
      this.setState({
        mostrarIconos:this.state.mostrarIconos === i ? -1 :i
      })  
    }

    UpdatePrioridadIcono(idPartida, id_icono, index){
      // console.log("index", index);
      
      
      axios.put(`${UrlServer}/putIconocategoria`,
        {
          "id_partida":idPartida,
          "id_iconoCategoria":id_icono
        }
      )
      .then((res)=>{
        // partidas[index].iconocategoria_nombre = res.data.color
        // console.info("response", res.data)
        var partidas = this.state.DataPartidas
        var CategoriasIconos = res.data.nombre 

        // CategoriasIconos.forEach(ico => {
          if (CategoriasIconos === "<FaSuperpowers/>") {
            CategoriasIconos = <FaSuperpowers />
          }else if (CategoriasIconos === "<MdLibraryBooks/>") {
            CategoriasIconos = <MdLibraryBooks />              
          }else if (CategoriasIconos === "<TiWarning/>") {
            CategoriasIconos = <TiWarning />              
          }else if (CategoriasIconos === "<MdWatch/>") {
            CategoriasIconos = <MdWatch />              
          }else if (CategoriasIconos === "<MdVisibility/>") {
            CategoriasIconos = <MdVisibility />              
          }else if (CategoriasIconos === "<MdMonetizationOn/>") {
            CategoriasIconos = <MdMonetizationOn />                         
          }else{
            CategoriasIconos = null
          }
        // });
        partidas[index].iconocategoria_nombre = CategoriasIconos

        // console.log("CategoriasIconos", CategoriasIconos)
        this.setState({
          DataPartidas:partidas,
          mostrarIconos:-1,
          mostrarColores: index
        })
      })
      .catch((err)=>{
        console.error("error", err);
      })
    }

    UpdatePrioridadColor(idPartida, prioridad, index){

      var partidas = this.state.DataPartidas
      // console.log("partidas", idPartida, prioridad, index);

      axios.put(`${UrlServer}/putPrioridad`,
        {
          "id_partida":idPartida,
          "id_prioridad":prioridad
        }
      )
      .then((res)=>{
        partidas[index].prioridad_color = res.data.color
        // console.info("response", res)
        this.setState({
          DataPartidas:partidas,
          mostrarIconos:-1,
          mostrarColores:null
        })
      })
      .catch((err)=>{
        console.error("error", err);
      })
    }
    
    clearImg(){
      this.setState({
        UrlImagen:"",
        // limpia valores por si los tiene
        file:null,
      }) 
      document.getElementById("myImage").value = "";
    }

    modalImgPartida(){
      this.setState(prevState => ({
        modalImgPartida: !prevState.modalImgPartida,
      }));
    }

    capturaDatosCrearImgPartida(id_partida, Ruta, variable){
      console.log("id_partida", id_partida, "Ruta", Ruta, "variable", variable);
      
      this.setState({
         // limpia valores por si los tiene
         modalImgPartida: !this.state.modalImgPartida,
         partidas_id_partida:id_partida,
         UrlImagen:"",
         file:null,
         Id_Partida_O_Actividad:variable,
         EnvioImgObsApiRuta:Ruta
      })
    }

    EnviaImgPartida(e){ 
      e.preventDefault();
      var { partidas_id_partida, file, ObservacionMetrado, Id_Partida_O_Actividad, EnvioImgObsApiRuta } = this.state

      const formData = new FormData();
      formData.append('accesos_id_acceso',sessionStorage.getItem('idacceso'));
      formData.append('codigo_obra', sessionStorage.getItem("codigoObra"));
      formData.append(Id_Partida_O_Actividad, partidas_id_partida);
      formData.append('descripcionObservacion',ObservacionMetrado);
      formData.append('foto', file);


      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };

      if (confirm("¿Esta seguro de guardar la imagen al sistema?")) {
        axios.post(`${UrlServer}${EnvioImgObsApiRuta}`,
          formData,
          config
        )
        .then((res)=>{
          console.log("envio de imagen ",res);
          if (res.data === "exito") {
              this.setState({
                modalImgPartida:false
              })
              toast.success("Éxito imagen guardada")
              return
          }
        
          
        })
        .catch((err)=>{
          console.error("no es bien ", err);
          toast.error("Error al tratar de guardar la imagen")

        })
        return
      }
    }

    CollapseResumenTabla(index){
        console.log("index ", index)
        this.setState({ 
            CollapseResumenTabla: this.state.CollapseResumenTabla === index ? "" : index,
        });
    }

    render() {
        var { DataPrioridadesApi, DataIconosCategoriaApi, DataComponentes, DataPartidas, DataActividades, DataMayorMetrado, debounceTimeout, descripcion, smsValidaMetrado, collapse,  nombreComponente, OpcionMostrarMM, SMSinputTypeImg, mostrarColores, file, CollapseResumenTabla } = this.state
        var restaResultado = this.state.ValorMetrado - this.state.actividad_avance_metrado 
        
        var DatosPartidasFiltrado = DataPartidas
        var BuscaPartida = this.state.BuscaPartida

        // console.log("BuscaPartida", BuscaPartida);


        if (BuscaPartida !== null) {

          if(typeof BuscaPartida === "number"){
            DatosPartidasFiltrado = DatosPartidasFiltrado.filter((filtrado) => {
              if(BuscaPartida === 101){
                return(filtrado.porcentaje <= 100);
              }else if(BuscaPartida === 99 && filtrado.tipo !== "titulo" && filtrado.porcentaje !== 0 ) {
                return( filtrado.porcentaje <= 99 );


              }else if(BuscaPartida === 104 && filtrado.tipo !== "titulo" ) {
              return( filtrado.mayorMetrado === 1 );

                // filtramos las prioridades color
              }else if( BuscaPartida === 1 ) {
                return( filtrado.prioridad_color === "#f00" );

              }else if( BuscaPartida === 2 ) {
                return( filtrado.prioridad_color === "#ffff00" );

              }else if( BuscaPartida === 3 ) {
                return( filtrado.prioridad_color === "#00b050" );

              }else if( BuscaPartida === 4 ) {
                return( filtrado.prioridad_color === "#0080ff" );
                
              }else if( BuscaPartida === 5 && filtrado.tipo !== "titulo") {
                return( filtrado.prioridad_color === "#ffffff" );

              }else{
                return filtrado.porcentaje === BuscaPartida
              }
             
            });
          }else{
          
            BuscaPartida = this.state.BuscaPartida.trim().toLowerCase();
            DatosPartidasFiltrado = DatosPartidasFiltrado.filter((filtrado) => {
              return filtrado.descripcion.toLowerCase().match(BuscaPartida);
            });
          }
          
        }

        
        
        return (
          <div>
            {/* { this.state.iconos} */}
            <Card>
              <Nav tabs>
                {DataComponentes.length === 0 ? <Spinner color="primary" size="sm"/>: DataComponentes.map((comp,indexComp)=>
                  <NavItem key={ indexComp }>
                    <NavLink className={classnames({ active: this.state.activeTab === indexComp.toString() })} onClick={() =>  this.Tabs(indexComp.toString(), comp.id_componente, comp.nombre) }>
                      COMP {comp.numero}
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
        
              <Card className="m-1">
                <CardHeader className="p-1">
                  { nombreComponente }
                  <div className="float-right">
                    <InputGroup size="sm">
                      <InputGroupAddon addonType="prepend"><InputGroupText><MdSearch size={20} /> </InputGroupText> </InputGroupAddon>

                      <Input placeholder="Buscar por descripción" onKeyUp={ e => this.Filtrador(e) }/>

                      <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                        <DropdownToggle caret  className="bg-primary">
                          { this.state.FilterSelected }
                        </DropdownToggle>
                        <DropdownMenu >
                          <DropdownItem onClick={()=>this.Filtrador(101) }>Todo</DropdownItem>
                          <DropdownItem onClick={()=>this.Filtrador(0)} >0%</DropdownItem>
                          <DropdownItem onClick={()=>this.Filtrador(100)} >100%</DropdownItem>
                          <DropdownItem onClick={()=>this.Filtrador(99) }>Progreso</DropdownItem>
                          <DropdownItem onClick={()=>this.Filtrador(104) }>MM</DropdownItem>
                        </DropdownMenu>
                      </InputGroupButtonDropdown>
                    </InputGroup>

                  </div>
                </CardHeader>
                <CardBody>    
                {/* RESUMEN - MAS DETALLES DE BINES DE LA OBRA */}
                <Nav tabs>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.CollapseResumenTabla === 'resumenRecursos' })} onClick={() => { this.CollapseResumenTabla("resumenRecursos") }} >
                            R > 
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink className={classnames({ active: this.state.CollapseResumenTabla === 'tablaPartidas' })} onClick={() => { this.CollapseResumenTabla("tablaPartidas") }} >
                            T > 
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }} >
                            PERSONAL 
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }} >
                            BIENES
                        </NavLink>
                    </NavItem>
                    
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }} >
                            MATERIALES
                        </NavLink>
                    </NavItem>
                </Nav>
                
                <Collapse isOpen={ CollapseResumenTabla === "resumenRecursos" }>                
                    <Row className="mt-1">
                        <Col md="6">
                            <Card>
                                <CardHeader className="p-1">RESUMEN DE RECURSOS DEL COMPONENTE SEGÚN EXPEDIENTE TÉCNICO</CardHeader>
                                <CardBody>
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>RECURSO</th>
                                                <th>UND</th>
                                                <th>CANTIDAD</th>
                                                <th>PRECIO S/.</th>
                                                <th> PARCIAL S/.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>ABONO </td>
                                                <td>M3</td>
                                                <td>4.300</td>
                                                <td>46.300</td>
                                                <td>569.00</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                            
                        </Col>
                        <Col md="6">

                            <Card>
                                <CardHeader className="p-1">RECURSOS GASTADOS HASTA LA FECHA ( HOY 09/05/2019 )</CardHeader>
                                <CardBody>
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>CANTIDAD</th>
                                            
                                                <th>CANTIDAD</th>
                                                <th>PRECIO S/.</th>
                                                <th>PARCIAL S/.</th>
                                                <th>DIFERENCIA</th>
                                                <th>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>ABONO </td>
                                                <td>M3</td>
                                                <td>4.300</td>
                                                <td>46.300</td>
                                                <td>569.00</td>
                                                <td>569 %</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Collapse>
                <Collapse isOpen={ CollapseResumenTabla === "tablaPartidas" }> 

                  <table className="table table-sm mt-2">
                    <thead className="resplandPartida">
                      <tr>
                        <th style={{width: "39px"}}>
                          <div title="Busqueda por prioridad" className="prioridad" onClick={()=>this.Prioridad("filtro") }>
                            <FaSuperpowers size={ 15}/>
                          </div>

                          { 
                            //selecciona circulo para filtrar
                            this.state.mostrarIconos === "filtro"?
                              <div className="menuCirculo">
                                {
                                  DataPrioridadesApi.map((priori, IPriori)=>
                                    <div className="circleColor" style={{background: priori.color }} onClick={()=>this.Filtrador( priori.valor) } key= { IPriori } />
                                  )
                                }
                              </div>
                              :""
                          }

                        </th>
                        <th>ITEM</th>
                        <th >DESCRIPCIÓN</th>
                        <th>METRADO</th>
                        <th>P/U </th>
                        <th>P/P </th>
                        <th width="20%">BARRA DE PROGRESO</th>
                      </tr>
                    </thead>
                    { 
                        DatosPartidasFiltrado.length <= 0 ?  
                        <tbody><tr><td colSpan="8" className="text-center text-warning">No hay datos</td></tr></tbody> :
                        DatosPartidasFiltrado.map((metrados, i) =>
                            <tbody key={ i } >
                        
                            <tr className={ metrados.tipo === "titulo" ? "font-weight-bold text-warning icoVer":  collapse === i? "font-weight-light resplandPartida icoVer": "font-weight-light icoVer"}>
                                <td>
                                { 
                                    metrados.tipo === "titulo" ?"":
                                    <div title="prioridad" className="prioridad" style={{color:metrados.prioridad_color }} onClick={()=>this.Prioridad(i)}>
                                    <span className="h6"> { metrados.iconocategoria_nombre }</span>
                                    </div>  
                                }
                                {/* map de de colores prioridades */}
                                
                                <div className={ this.state.mostrarIconos !== i ?"d-none":"menuCirculo" }>
                                    
                                    {/* DIV DE CIRCULOS CON ICONO   */}
                                    {
                                    DataIconosCategoriaApi.map((Icono, IIcono)=>
                                        <div className="circleIcono" onClick={()=> this.UpdatePrioridadIcono(metrados.id_partida, Icono.id_iconoCategoria, i) } key= { IIcono }>
                                        <span className="spanUbi"> { Icono.nombre } </span>
                                        </div>                                   
                                    )
                                    }
                                </div>

                                <div className={ this.state.mostrarColores !== i ?"d-none":"menuCirculo" }>

                                    {/* DIV DE CIRCULOS CON COLOR   */}
                                    {
                                    DataPrioridadesApi.map((priori, IPriori)=>
                                        <div className="circleColor" style={{background: priori.color }} onClick={()=> this.UpdatePrioridadColor(metrados.id_partida, priori.id_prioridad, i) } key= { IPriori }></div>                                   
                                    )
                                    }
                                </div>
                                

                                </td>
                                <td className={ metrados.tipo === "titulo" ? '': collapse === i? "tdData1":  metrados.mayorMetrado === 0 ? "tdData" : "FondMM tdData"} onClick={metrados.tipo === "titulo" ? ()=> this.CollapseItem(-1, -1 ): ()=> this.CollapseItem(i, metrados.id_partida )} data-event={i} >
                                { metrados.item }
                                </td>
                                <td>
                                { metrados.descripcion }
                                                                
                                </td>
                                <td>{ metrados.metrado } { metrados.unidad_medida} </td>
                                <td>{ metrados.costo_unitario }</td>
                                <td>{ metrados.parcial }</td>
                                <td className="small border border-left border-right-0 border-bottom-0 border-top-0" >

                                <div className={(metrados.tipo === "titulo" ? 'd-none' :'')}>
                                    <div className="clearfix">
                                    <span className="float-left text-warning">A. met. {metrados.avance_metrado} { metrados.unidad_medida }</span>
                                    <span className="float-right text-warning">S/. {metrados.avance_costo}</span>
                                    </div>

                                    <div style={{
                                    height: '3px',
                                    width: '100%',
                                    background: '#c3bbbb',
                                    }}

                                    >
                                    <div
                                    style={{
                                        width: `${metrados.porcentaje}%`,
                                        height: '100%',
                                        background: metrados.porcentaje > 95 ? '#a4fb01'
                                        : metrados.porcentaje > 50 ? '#ffbf00'
                                        :  '#ff2e00',
                                        transition: 'all .9s ease-in',
                                    }}
                                    />
                                    </div>
                                    <div className="clearfix">
                                    <span className="float-left text-info">Saldo: {metrados.metrados_saldo}</span>
                                    <span className="float-right text-info">S/. {metrados.metrados_costo_saldo}</span>
                                    </div>
                                </div>       
                                
                                </td>

                            </tr>
                        
                            <tr className={ collapse === i? "resplandPartidabottom": "d-none"  }>
                                <td colSpan="8">
                                <Collapse isOpen={collapse === i}>
                                    <div className="p-1">
                                        <div className="row">
                                        
                                        <div className="col-sm-7">
                                            <MdReportProblem size={ 20 } className="text-warning" />
                                            <b className="small">  
                                            {metrados.descripcion }
                                            </b>
                                            <MdFlashOn size={ 20 } className="text-warning" />

                                        </div>
                                        <div className="col-sm-2">
                                            { 
                                            Number(DataMayorMetrado.mm_avance_costo) > 0?'MAYOR METRADO': ''
                                            }
                                        </div>
                                        
                                        <div className="col-sm-2">
                                            {/* datos de mayor metrado ------------------ */}
                                            
                                            { 
                                            Number(DataMayorMetrado.mm_avance_costo) > 0?
                                                <div className="small">
                                            
                                                <div className="clearfix">
                                                    <span className="float-left text-warning">A. met. { DataMayorMetrado.mm_avance_costo } { metrados.unidad_medida }</span>
                                                    <span className="float-right text-warning">S/. { DataMayorMetrado.mm_avance_metrado}</span>
                                                </div>

                                                <div>
                                                {DataMayorMetrado.mm_porcentaje} %
                                                <div/>
                                                </div>
                                                <div className="clearfix">
                                                    <span className="float-left text-info">Saldo:  { DataMayorMetrado.mm_metrados_saldo } { metrados.unidad_medida }</span>
                                                    <span className="float-right text-info">S/. { DataMayorMetrado.mm_metrados_costo_saldo}</span>
                                                </div>
                                                </div> : '' 
                                            }
                                            

                                        </div>

                                        <div className="col-sm-1">
                                            <button className="btn btn-outline-warning btn-xs p-1 mb-1 fsize" title="Ingreso de mayores metrados" onClick={ ()=>this.capturaidMM(metrados.id_partida, this.state.id_componente, i, metrados.descripcion) }> <FaPlus size={10} /> MM</button>
                                        </div>
                                        </div>
                                    
                                        <table className="table table-bordered table-sm">
                                        <thead className="thead-dark">
                                            <tr>
                                            <th>NOMBRE DE ACTIVIDAD</th>
                                            <th>N° VECES</th>
                                            <th>LARGO</th>
                                            <th>ANCHO</th>
                                            <th>ALTO</th>
                                            <th>METRADO</th>
                                            <th>S/. P / U </th>
                                            <th>S/. P / P</th>
                                            <th>ACTIVIDADES SALDOS</th>
                                            <th><MdSettings /></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                            DataActividades.length <= 0 ? <tr><td colSpan="11" className="text-center"><Spinner color="primary" size="sm"/></td></tr>:
                                                DataActividades.map((actividades, indexA)=>
                                                <tr key={ indexA } className={ actividades.actividad_estado === "Mayor Metrado" ?'FondMM icoVer':'icoVer'}>
                                                <td>{ actividades.nombre_actividad }</td>
                                                <td>{ actividades.veces_actividad }</td>
                                                <td>{ actividades.largo_actividad }</td>
                                                <td>{ actividades.ancho_actividad }</td>
                                                <td>{ actividades.alto_actividad }</td>
                                                <td>{ actividades.metrado_actividad } { actividades.unidad_medida }</td>
                                                <td>{ actividades.costo_unitario }</td>
                                                <td>{ actividades.parcial_actividad }</td>
                                                <td className="small">
                                                    {
                                                    Number(actividades.parcial_actividad) <= 0 ?'':
                                                    actividades.actividad_tipo === "titulo"?"":
                                                    <div>
                                                        <div className="clearfix">
                                                            <span className="float-left text-warning">A met. {actividades.actividad_avance_metrado}{actividades.unidad_medida}</span>
                                                            <span className="float-right text-warning">S/. {actividades.actividad_avance_costo}</span>
                                                        </div>

                                                        <div style={{
                                                            height: '2px',
                                                            backgroundColor: '#c3bbbb',
                                                            position: 'relative'
                                                            }}

                                                        >
                                                        <div
                                                            style={{
                                                            width: `${actividades.actividad_porcentaje}%`,
                                                            height: '100%',
                                                            backgroundColor: actividades.actividad_porcentaje > 95 ? '#A4FB01'
                                                                : actividades.actividad_porcentaje > 50 ? '#ffbf00'
                                                                :  '#ff2e00',
                                                            transition: 'all .9s ease-in',
                                                            position: 'absolute'
                                                            }}
                                                        />
                                                        </div>
                                                        <div className="clearfix">
                                                        <span className="float-left text-info">Saldo: {actividades.actividad_metrados_saldo}</span>
                                                        <span className="float-right text-info">S/. {actividades.actividad_metrados_costo_saldo}</span>
                                                        </div>
                                                    </div>
                                                    }

                                                </td>
                                                <td className="text-center">
                                                    {
                                                    actividades.actividad_tipo === "titulo"? "":
                                                    
                                                    <div>
                                                        { 
                                                        actividades.actividad_metrados_saldo <= 0 
                                                        ?
                                                        sessionStorage.getItem("estadoObra") === "Corte"
                                                        ?
                                                            <div>
                                                            <span className="text-primary prioridad aprecerIcon" onClick={(e)=>this.CapturarID(actividades.id_actividad, actividades.nombre_actividad, actividades.unidad_medida, actividades.costo_unitario, actividades.actividad_metrados_saldo, this.state.id_componente, actividades.actividad_porcentaje, actividades.actividad_avance_metrado, actividades.metrado_actividad, indexA, actividades.parcial_actividad, metrados.descripcion, metrados.metrado, metrados.parcial, metrados.porcentaje_negatividad)} >
                                                                <FaPlus size={ 15 } /> 
                                                            </span>
                                                            { " " }
                                                            <span className="prioridad" onClick={(e)=>this.capturaDatosCrearImgPartida(actividades.id_actividad, "/avanceActividadImagen", "Actividades_id_actividad")} >
                                                                <MdAddAPhoto size={ 15 } /> 
                                                            </span>
                                                            </div>
                                                        :
                                                            <div>
                                                            <FaCheck className="text-success" size={ 15 } />
                                                            { " " }
                                                            <span className="prioridad" onClick={(e)=>this.capturaDatosCrearImgPartida(actividades.id_actividad, "/avanceActividadImagen", "Actividades_id_actividad")} >
                                                                <MdAddAPhoto size={ 15 } /> 
                                                            </span>
                                                            </div>
                                                        : 
                                                            <div>
                                                            <span className="text-primary prioridad" onClick={(e)=>this.CapturarID(actividades.id_actividad, actividades.nombre_actividad, actividades.unidad_medida, actividades.costo_unitario, actividades.actividad_metrados_saldo, this.state.id_componente, actividades.actividad_porcentaje, actividades.actividad_avance_metrado, actividades.metrado_actividad, indexA, actividades.parcial_actividad, metrados.descripcion, metrados.metrado, metrados.parcial, metrados.porcentaje_negatividad)} >
                                                                <FaPlus size={ 15 } /> 
                                                            </span>
                                                            { " " }
                                                            <span className="prioridad" onClick={(e)=>this.capturaDatosCrearImgPartida(actividades.id_actividad, "/avanceActividadImagen", "Actividades_id_actividad")} >
                                                                <MdAddAPhoto size={ 15 } /> 
                                                            </span>
                                                            </div>
                                                        }
                                                    </div>
                                                    }
                                                </td>
                                                
                                                </tr>
                                            )
                                            }
                                        </tbody>
                                        </table>
                                    
                                    </div>
                                </Collapse>
                                </td>
                            </tr>
                            </tbody>
                        ) 
                    } 
                  </table>  
                </Collapse>
                </CardBody>
              </Card>
          
              {/* chat de partidas y mas */}
              <div className="chatContainer">
                <div className="chatHeader">
                  <div className="p-2">
                    NOMBRE DE LA PARTIDA
                    <div className="float-right">
                      <a href="#" id="enviarA" className="text-decoration-none text-white"> 
                      <MdPerson size={ 20 } />
                      <UncontrolledPopover trigger="focus" placement="bottom" target="enviarA">
                        <PopoverHeader>Enviar a:</PopoverHeader>
                        <PopoverBody>
                          <span>Gerente</span><br />
                          <span>Supervisor</span><br />
                          <span>Secretaria</span>
                        </PopoverBody>
                      </UncontrolledPopover>
                      </a>
                      <MdClose size={ 20 }  />
                    </div> 
                  </div>
                </div>

                <div className="chatBody">
                  <div className="media mt-1">
                    <img src="http://localhost:180/images/src/images/logoSigobras.png" className="align-self-end rounded-circle mr-2 img-fluid" style={{width:"50px"}} />
                    <div className="media-body">
                      <div className="chatBodyMensaje">
                        <span>Lorem ispansum dolor sit met, consectetur .</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chatFooter">
                  <input type="text" className="form-control form-control-sm" />
                  <button className="btn btn-sm btn-outline-primary"> Enviar </button>
                </div>
              </div>
              
            </Card>


            {/* <!-- MODAL PARA METRAR EN ESTADO EJECUCION --> */}
            <Modal isOpen={this.state.modal} toggle={this.modalMetrar} size="sm" fade={false} backdrop="static">
              <ModalHeader toggle={this.modalMetrar} className="border-button">
                <img src= { LogoSigobras } width="30px" alt="logo sigobras" /> SIGOBRAS S.A.C.
              </ModalHeader>
              {
                sessionStorage.getItem("estadoObra") === "Ejecucion"
                ?
                  <div>
                    {/* codigo de EJECUCION =============================================================================================================== */}
                    
                    <form onSubmit={this.EnviarMetrado_EJECUCION }>
                      <ModalBody>
                        <label className="text-center mt-0">{ descripcion } </label><br/>

                        <div className="d-flex justify-content-between ">
                          <div className=""><b> {this.state.nombre_actividad} </b></div>
                          <div className="small">Costo Unit. S/.  {this.state.costo_unitario} {this.state.unidad_medida }</div>
                        </div>

                        <label htmlFor="comment">INGRESE EL METRADO:</label> {this.state.Porcentaje_Metrado}

                        <div className="input-group input-group-sm mb-0">
                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ValorMetrado: e.target.value})}  type="number" className="form-control" autoFocus/>  
                            
                            <div className="input-group-append">
                            <span className="input-group-text">{this.state.unidad_medida }</span>
                            </div>
                        </div>
                        <div className="texto-rojo mb-0"> <b> { smsValidaMetrado }</b></div> 

                        <div className="d-flex justify-content-center text-center mt-1"> 
                          <div className="bg-primary p-1 mr-1 text-white">Metrado total  <br/>
                              { this.state.metrado } {this.state.unidad_medida }
                            </div>

                            <div className="bg-info text-white p-1 mr-1">Costo total / {this.state.unidad_medida }  <br/>
                              = S/.  {this.state.parcial} <br/>
                            </div>
                            <div className={ Number(this.state.actividad_metrados_saldo) <= 0 ? "bg-danger p-1 mr-1 text-white": "bg-success p-1 mr-1 text-white"}>Saldo <br/>
                                {this.state.actividad_metrados_saldo} {this.state.unidad_medida }
                            </div>
                          
                        </div>

                        <div className="form-group mb-1">
                          <label htmlFor="comment">DESCRIPCION:</label>
                          <DebounceInput
                            cols="40"
                            rows="1"
                            element="textarea"
                            minLength={0}
                            debounceTimeout={debounceTimeout}
                            onChange={e => this.setState({DescripcionMetrado: e.target.value})}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group mb-0">
                          <label htmlFor="comment">OBSERVACIÓN:</label>
                          <DebounceInput
                            cols="40"
                            rows="1"
                            element="textarea"
                            minLength={0}
                            debounceTimeout={debounceTimeout}
                            onChange={e => this.setState({ObservacionMetrado: e.target.value})}
                            className="form-control"
                          />
                        </div>
                        <span className="small">% {this.state.porcentaje_negatividad}</span>

                        {
                          this.state.UrlImagen.length <= 0 
                          ?"":
                          <div className="imgDelete">
                            <button className="imgBtn" onClick={()=>this.clearImg()}>X</button>
                            <img src={ this.state.UrlImagen } alt="imagen " className="img-fluid mb-2" />
                          </div>
                        }
                        <div className="texto-rojo mb-0"> <b> { SMSinputTypeImg === true ? "Formatos soportados PNG, JPEG, JPG":"" }</b></div> 

                        <div className="custom-file">
                          <input type="file" className="custom-file-input" onChange={ this.onChangeImgMetrado } id="myImage"/>
                          <label className="custom-file-label" htmlFor="customFile"> { this.state.file !== null? this.state.file.name: "SELECCIONE"}</label>
                        
                        </div>

                      </ModalBody>
                      <ModalFooter className="border border-dark border-top border-right-0 border-bottom-0 border-button-0">
                        <div className="float-left"><Button color="primary" type="submit">Guardar</Button>{' '}</div>
                        <div className="float-right"><Button color="danger" onClick={this.modalMetrar}>Cancelar</Button></div>
                      </ModalFooter>
                    </form>
                  </div>
                  
                :
                sessionStorage.getItem("estadoObra") === "Corte" 
                ?
                  <div>
                    {/* codigo de CORTE =============================================================================================================== */}
                    
                    <form onSubmit={this.EnviarMetrado_CORTE }>
                      <ModalBody>
                          <label className="text-center mt-0">{ descripcion } </label><br/>


                          <div className="d-flex justify-content-between ">
                            <div className=""><b> {this.state.nombre_actividad} </b></div>
                            <div className="small">Costo Unit. S/.  {this.state.costo_unitario} {this.state.unidad_medida }</div>
                          </div>

                          <label htmlFor="comment">INGRESE EL METRADO:</label> {this.state.Porcentaje_Metrado}

                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText className="p-1">{ this.state.actividad_avance_metrado }</InputGroupText>
                                <InputGroupText className="p-1">-</InputGroupText>
                            </InputGroupAddon>

                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ValorMetrado: e.target.value})}  type="number" className="form-control" autoFocus/>  
                            <InputGroupAddon addonType="append">
                                <InputGroupText className="p-1">=</InputGroupText>
                                <InputGroupText className="p-1">  { restaResultado.toLocaleString("es-PE")}</InputGroupText>
                                <InputGroupText className="p-1">{this.state.unidad_medida}</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                          <div className="texto-rojo mb-0"> <b> { smsValidaMetrado }</b></div> 

                          <div className="d-flex justify-content-center text-center mt-1"> 
                            <div className="bg-primary p-1 mr-1 text-white">Metrado total  <br/>
                                { this.state.metrado } {this.state.unidad_medida }
                              </div>

                              <div className="bg-info text-white p-1 mr-1">Costo total / {this.state.unidad_medida }  <br/>
                                = S/.  {this.state.parcial} <br/>
                              </div>
                              <div className={ Number(this.state.actividad_metrados_saldo) <= 0 ? "bg-danger p-1 mr-1 text-white": "bg-success p-1 mr-1 text-white"}>Saldo <br/>
                                  {this.state.actividad_metrados_saldo} {this.state.unidad_medida }
                              </div>
                            
                          </div>

                          <div className="form-group">
                              <label htmlFor="comment">DESCRIPCION:</label>
                              <DebounceInput
                                cols="40"
                                rows="1"
                                element="textarea"
                                minLength={0}
                                debounceTimeout={debounceTimeout}
                                onChange={e => this.setState({DescripcionMetrado: e.target.value})}
                                className="form-control"
                              />
                          </div>

                          <div className="form-group">
                              <label htmlFor="comment">OBSERVACIÓN:</label>
                              <DebounceInput
                                cols="40"
                                rows="1"
                                element="textarea"
                                minLength={0}
                                debounceTimeout={debounceTimeout}
                                onChange={e => this.setState({ObservacionMetrado: e.target.value})}
                                className="form-control"
                              />
                          </div>
                          
                          <span className="small">% {this.state.porcentaje_negatividad}</span>

                          {
                            this.state.UrlImagen.length <= 0 
                            ?"":
                            <div className="imgDelete">
                              <button className="imgBtn" onClick={()=>this.clearImg()}>X</button>
                              <img src={ this.state.UrlImagen } alt="imagen " className="img-fluid mb-2" />
                            </div>
                          }
                          <div className="texto-rojo mb-0"> <b> { SMSinputTypeImg === true ? "Formatos soportados PNG, JPEG, JPG":"" }</b></div> 

                          <div className="custom-file">
                            <input type="file" className="custom-file-input" onChange={ this.onChangeImgMetrado } id="myImage"/>
                          <label className="custom-file-label" htmlFor="customFile"> { this.state.file !== null? this.state.file.name: "SELECCIONE"}</label>
                          
                          </div>

                      </ModalBody>
                      <ModalFooter className="border border-dark border-top border-right-0 border-bottom-0 border-button-0">
                        <div className="float-left"><Button color="primary" type="submit">Guardar</Button>{' '}</div>
                        <div className="float-right"><Button color="danger" onClick={this.modalMetrar}>Cancelar</Button></div>
                      </ModalFooter>
                    </form>
                  </div>
                :
                <div>
                  {/* codigo de ACTUALIZACION =============================================================================================================== */}
                  
                  <form onSubmit={this.EnviarMetrado_ACTUALIZACION }>

                    <ModalBody>
                        <label className="text-center mt-0">{ descripcion } </label><br/>


                        <div className="d-flex justify-content-between ">
                          <div className=""><b> {this.state.nombre_actividad} </b></div>
                          <div className="small">Costo Unit. S/.  {this.state.costo_unitario} {this.state.unidad_medida.replace("/DIA", "")}</div>
                        </div>

                        <label htmlFor="comment">INGRESE EL METRADO:</label> {this.state.Porcentaje_Metrado}

                        <div className="input-group input-group-sm mb-0">
                            <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ValorMetrado: e.target.value})}  type="number" className="form-control" autoFocus/>  
                            
                            <div className="input-group-append">
                            <span className="input-group-text">{this.state.unidad_medida.replace("/DIA", "")}</span>
                            </div>
                        </div>
                        <div className="texto-rojo mb-0"> <b> { smsValidaMetrado }</b></div> 

                        <div className="d-flex justify-content-center text-center mt-1"> 
                          <div className="bg-primary p-1 mr-1 text-white">Metrado total  <br/>
                              { this.state.metrado } {this.state.unidad_medida.replace("/DIA", "")}
                            </div>

                            <div className="bg-info text-white p-1 mr-1">Costo total / {this.state.unidad_medida.replace("/DIA", "")}  <br/>
                              = S/.  {this.state.parcial} <br/>
                            </div>
                            <div className={ Number(this.state.actividad_metrados_saldo) <= 0 ? "bg-danger p-1 mr-1 text-white": "bg-success p-1 mr-1 text-white"}>Saldo <br/>
                                {this.state.actividad_metrados_saldo} {this.state.unidad_medida.replace("/DIA", "")}
                            </div>
                        </div>

                        
                        <div className="form-group"> 
                          <label htmlFor="fehca">FECHA :</label>
                          <input type="date" min={ PrimerDiaDelMesActual() } max={ FechaActual() } onChange={e=> this.setState({fecha_actualizacion:e.target.value})} className="form-control form-control-sm"/>
                          <div className="texto-rojo mb-0"> <b> { this.state.smsValidaFecha }</b></div>
                        </div>


                        <div className="form-group">
                            <label htmlFor="comment">DESCRIPCION:</label>
                            <DebounceInput
                              cols="40"
                              rows="1"
                              element="textarea"
                              minLength={0}
                              debounceTimeout={debounceTimeout}
                              onChange={e => this.setState({DescripcionMetrado: e.target.value})}
                              className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment">OBSERVACIÓN:</label>
                            <DebounceInput
                              cols="40"
                              rows="1"
                              element="textarea"
                              minLength={0}
                              debounceTimeout={debounceTimeout}
                              onChange={e => this.setState({ObservacionMetrado: e.target.value})}
                              className="form-control"
                            />
                        </div>
                        
                        <span className="small">% {this.state.porcentaje_negatividad}</span>

                        {
                          this.state.UrlImagen.length <= 0 
                          ?"":
                          <div className="imgDelete">
                            <button className="imgBtn" onClick={()=>this.clearImg()}>X</button>
                            <img src={ this.state.UrlImagen } alt="imagen " className="img-fluid mb-2" />
                          </div>
                        }
                        <div className="texto-rojo mb-0"> <b> { SMSinputTypeImg === true ? "Formatos soportados PNG, JPEG, JPG":"" }</b></div> 

                        <div className="custom-file">
                          <input type="file" className="custom-file-input" onChange={ this.onChangeImgMetrado } id="myImage"/>
                          <label className="custom-file-label" htmlFor="customFile"> { this.state.file !== null? this.state.file.name: "SELECCIONE"}</label>
                        </div>

                    </ModalBody>
                    <ModalFooter className="border border-dark border-top border-right-0 border-bottom-0 border-button-0">
                      <div className="float-left"><Button color="primary" type="submit">Guardar</Button>{' '}</div>
                      <div className="float-right"><Button color="danger" onClick={this.modalMetrar}>Cancelar</Button></div>
                    </ModalFooter>
                  </form>
                </div>
              }
            </Modal>
            {/* ///<!-- MODAL PARA METRAR EN ESTADO EJECUCION --> */} 


            {/* <!-- MODAL PARA  mayores metrados ( modalMayorMetrado ) --> */}
            <Modal isOpen={this.state.modalMm} toggle={this.modalMayorMetrado} size="sm" fade={false} backdrop="static">
              <ModalHeader toggle={this.modalMayorMetrado} className="border-button">
                <img src= { LogoSigobras } width="30px" alt="logo sigobras" /> SIGOBRAS S.A.C.
              </ModalHeader>
              <form onSubmit={this.EnviarMayorMetrado }>
               
                <ModalBody>

                  <label className="text-center mt-0">{ descripcion } </label><br/>

                  <div className="clearfix">
                    <CustomInput type="radio" id="radio1" name="customRadio" label="Actividad" className="float-right" value="subtitulo" onChange={e=> this.setState({OpcionMostrarMM:e.target.value})}/>
                    <CustomInput type="radio" id="radio2" name="customRadio" label="Titulo" className="float-left" value="titulo" onChange={e=> this.setState({OpcionMostrarMM:e.target.value})}/>
                  </div>
                      
                    {
                      OpcionMostrarMM.length <= 0? "":
                      <div>
                        {
                          OpcionMostrarMM === "titulo"?
                          <div>
                            <label htmlFor="comment">NOMBRE DE LA ACTIVIDAD:</label>
                            <div className="input-group input-group-sm mb-0">
                                <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({nombre: e.target.value})}  type="text" className="form-control"/>  
                            </div>
                          </div>
                          :<div>
                            <label htmlFor="comment">NOMBRE DE LA ACTIVIDAD:</label>
                            <div className="input-group input-group-sm mb-0">
                                <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({nombre: e.target.value})}  type="text" className="form-control"/>  
                            </div>
                          </div>
                        }
                          
                        <div className={OpcionMostrarMM === "titulo"? "d-none":''}>
                          <label htmlFor="comment">N° VECES:</label>
                          <div className="input-group input-group-sm mb-0">
                              <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({veces: e.target.value})} type="text" className="form-control"/>  
                          </div>

                          <label htmlFor="comment">LARGO:</label>
                          <div className="input-group input-group-sm mb-0">
                              <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({largo: e.target.value})} type="text" className="form-control"/>  
                          </div>

                          <label htmlFor="comment">ANCHO:</label>
                          <div className="input-group input-group-sm mb-0">
                              <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({ancho: e.target.value})} type="text" className="form-control"/>  
                          </div>

                          <label htmlFor="comment">ALTO:</label>
                          <div className="input-group input-group-sm mb-0">
                              <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({alto: e.target.value})} type="text" className="form-control"/>  
                          </div>
                          
                          <label htmlFor="comment">METRADO:</label>
                          {/* ESTE ES EL METRADO = parcial */}
                          <div className="input-group input-group-sm mb-0">
                              <DebounceInput debounceTimeout={debounceTimeout} onChange={e => this.setState({parcialMM: e.target.value})} placeholder={Number(this.state.veces) * Number(this.state.largo) * Number(this.state.ancho) * Number(this.state.alto)}  type="text" className="form-control"/>  
                          </div>
                        </div>
                      </div>
                    }
                      
                </ModalBody>
                <ModalFooter className="border border-dark border-top border-right-0 border-bottom-0 border-button-0">
                  <div className="float-left"><Button color="primary" type="submit">Guardar mayor metrado</Button>{' '}</div>
                  <div className="float-right"><Button color="danger" onClick={this.modalMayorMetrado}>Cancelar</Button></div>
                </ModalFooter>
              </form>
            </Modal>
            {/* ///<!-- MODAL PARA modalMM --> */}  


            {/* MODAL INSERTA IMAGEN DE PARTIDA Y ACTIVIDAD */}
            <Modal isOpen={this.state.modalImgPartida} fade={false} toggle={this.modalImgPartida} size="sm" >
              <ModalHeader toggle={this.modalImgPartida}>
                <img src= { LogoSigobras } width="30px" alt="logo sigobras" /> SIGOBRAS S.A.C.
              </ModalHeader>
              <form onSubmit={this.EnviaImgPartida}>
                <ModalBody>

                  {
                    this.state.UrlImagen.length <= 0 
                    ?"":
                    <div className="imgDelete">
                      <button className="imgBtn" onClick={()=>this.clearImg()}>X</button>
                      <img src={ this.state.UrlImagen } alt="imagen " className="img-fluid mb-2" />
                    </div>
                  }
                  <div className="texto-rojo mb-0"> <b> { SMSinputTypeImg === true ? "Formatos soportados PNG, JPEG, JPG":"" }</b></div> 

                  <div className="custom-file">
                    <input type="file" className="custom-file-input" onChange={ this.onChangeImgMetrado } id="myImage"/>
                      <label className="custom-file-label" htmlFor="customFile"> { this.state.file !== null? this.state.file.name: "SELECCIONE"}</label>
                  </div>

                  <div className="form-group mt-2">
                    <label htmlFor="comment">DESCRIPCIÓN / OBSERVACIÓN:</label>
                    <DebounceInput
                      cols="40"
                      rows="2"
                      element="textarea"
                      minLength={0}
                      debounceTimeout={debounceTimeout}
                      onChange={e => this.setState({ObservacionMetrado: e.target.value})}
                      className="form-control"
                    />

                  </div>
                </ModalBody>
                <ModalFooter>
                  {
                    file !== null ?
                    <Button color="primary" type="submit" onClick={this.EnviaImgPartida}>Guardar</Button>
                    :""
                  }
                  {' '}
                  <Button color="danger" onClick={this.modalImgPartida}>Cancelar</Button>
                </ModalFooter>
              </form>
            </Modal>
            {/* //MODAL INSERTA IMAGEN DE PARTIDA Y ACTIVIDAD */}
          </div>
        );
    }
}

export default ListaMateriales;


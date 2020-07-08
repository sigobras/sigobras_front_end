import React, { Component } from "react";
import { Table, UncontrolledCollapse, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../../Utils/ServerUrlConfig';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
// import { options} from "../Planner/Charts"

// import '../../../../css/proyeccion.css'
import "../../../../css/proyeccion.css";



class Proyeccion extends Component {
    constructor() {
        super();
        this.state = {
            resumen: "",   //lista vacia: es un dato por defecto para guardar la lista de componentes por ejemplo.  
            anyosproyectados: [],      //se inicializa con el tipo de variable si la variable guarda numero se inicializa con numero si la variable fuera texto se inicia con un texto vacio entre comillas, y corchetes cuando es una lista, si es booleano se inicializa con true o false
            valMesesData: [],
            listaobrasData: [],
            cajaidficha: 0,
            componentes: [],
            cajaproyeccionexp: 0,
            cajaanyo: 0,
            cajaproyeccionvar: 0,
            debounceTimeout: 600,
            chart_data: 0,
            cajalistacomponente: [],
            activatorinput: -1,
            mesesfor: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],


        };
        //se bindean las funciones las variables no

        this.selectObra = this.selectObra.bind(this);
        this.getComponentes = this.getComponentes.bind(this);
        this.capturaInputProyeccionExp = this.capturaInputProyeccionExp.bind(this);
        this.guardarProyeccionExp = this.guardarProyeccionExp.bind(this);

        ///////proyeccion variable
        this.capturaInputProyeccionVar = this.capturaInputProyeccionVar.bind(this);
        this.guardarProyeccionVar = this.guardarProyeccionVar.bind(this);

        this.formatmoney = this.formatmoney.bind(this);
        this.get_chart_data = this.get_chart_data.bind(this);
        this.activarEdicion = this.activarEdicion.bind(this);
        this.guardarproyeccioncomp = this.guardarproyeccioncomp.bind(this);



    }
    componentWillMount() {

        this.setState({
            cajaidficha: sessionStorage.getItem('idobra')  //es una variable global que se puede acceder desde cualquier interfaz (debe de estar definida en el constructor)

        })

        this.selectObra(sessionStorage.getItem('idobra'))

    }

    /////////FUNCIONES---------------------------------------/8///////////////////////////

    formatmoney(numero) {
        return (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }


    selectObra(idObra) {    //(EN SELECT OBRA FUNCION SE PUEDE TRABAJAR CON CUALQUIER NOMBRE)  

        this.setState({
            cajaidficha: idObra  //es una variable (debe de estar definida en el constructor)

        })

        axios.post(`${UrlServer}/AnyoInicial`, //RUTA DEL API
            {
                "id_ficha": idObra,

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial
                var listaanyos = [respuesta.data.anyo_inicial]
                for (let i = 1; i < 11; i++) {
                    listaanyos.push(i + respuesta.data.anyo_inicial);  //push para insertar un valor a la lista que creamos en la fila 116   
                    //el for tiene tres partes I-inicializar variable II- condicion III-lo que se va ejecutar en cada giro del bucle

                }


                this.setState({    //sirve para modificar el valor de una variable
                    anyosproyectados: listaanyos     // se declara en el constructor "es cualquier nombre"    (sabemmos que se esta guardando numero anyo inicial)
                })
            })
            .catch((error) => { //para ver un error
            })

    }

    getComponentes(anyo) {    //(EN SELECT OBRA FUNCION SE PUEDE TRABAJAR CON CUALQUIER NOMBRE)  

        this.setState({
            cajaanyo: anyo
        })

        axios.post(`${UrlServer}/ComponentesProyeccion`, //RUTA DEL API
            {
                "id_ficha": this.state.cajaidficha,
                "anyo": anyo

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial
                this.setState({    //sirve para modificar el valor de una variable
                    componentes: respuesta.data     // se declara en el constructor "es cualquier nombre"    (sabemmos que se esta guardando numero anyo inicial)
                })
            })
            .catch((error) => { //para ver un error
            })

    }
    //setState es una funcion asincrona
    async capturaInputProyeccionExp(evento, mes, index_comp) {
        evento.persist();
        var value_temp = parseFloat(evento.target.value) || 0
        var componentes_temp = this.state.componentes

        // componentes_temp[0].MEXPT1 = evento.target.value

        componentes_temp[index_comp]["MEXPT" + mes] = value_temp

        await this.setState({
            cajaproyeccionexp: evento.target.value,
            componentes: componentes_temp

            // SE ESTA GUARDANDO EN ESTA VARIABLE cajaproyeccionexp
        })
        //ACTUALIZANDO componente de edicion
        var componentecopia = this.state.cajalistacomponente
        //modificación a la copia el primer cero accede a la fila el segundo al primer elemento
        componentecopia[mes - 1][0] = evento.target.value

        await this.setState({
            //se esta guardando la copia ya modificada lo esta reemplazando al original
            cajalistacomponente: componentecopia,

        })

    }

    async guardarProyeccionExp(id_componente, mes) {

        //async para decir que termine la ejecucion en un determinado punto....revisar


        await axios.post(`${UrlServer}/postproyeccion`,

            //await: para decir que este axios espere mientras termina las consultas .... revisar
            {

                "proyeccion_exptec": this.state.cajaproyeccionexp,    //aqui cambiar la variable del imput
                "mes_anyo": this.state.cajaanyo + "-" + mes + "-" + "01",
                "id_componente": id_componente

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial   //"data" es propio detransferencia de la datos 
            })
            .catch((error) => {
            })

        this.getComponentes(this.state.cajaanyo)
        this.get_chart_data(id_componente)  // PARA CAMBIAR LAS BARRAS DEL CHART EN TIEMPO REAL


    }


    async capturaInputProyeccionVar(evento, mes, index_comp) {
        evento.persist();
        var value_temp = parseFloat(evento.target.value) || 0   //parseFloat se convierte el texto a numero
        var componentes_temp = this.state.componentes

        // componentes_temp[0].MEXPT1 = evento.target.value

        componentes_temp[index_comp]["MPROVAR" + mes] = value_temp

        await this.setState({
            componentes: componentes_temp

            // SE ESTA GUARDANDO EN ESTA VARIABLE cajaproyeccionexp
        })

        //ACTUALIZANDO componente de edicion
        var componentecopia = this.state.cajalistacomponente
        //modificación a la copia el primer cero accede a la fila el segundo al primer elemento
        componentecopia[mes - 1][1] = evento.target.value

        await this.setState({
            //se esta guardando la copia ya modificada lo esta reemplazando al original
            cajalistacomponente: componentecopia,

        })
    }

    async guardarProyeccionVar(id_componente, mes) {

        //async para decir que termine la ejecucion en un determinado punto....revisar


        await axios.post(`${UrlServer}/postProyeccionVar`,   //ruta del api

            //await: para decir que este axios espere mientras termina las consultas .... revisar
            {

                "proyeccion_variable": this.state.cajaproyeccionvar,    //aqui cambiar la variable del imput
                "mes_anyo": this.state.cajaanyo + "-" + mes + "-" + "01",
                "id_componente": id_componente

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial   //"data" es propio detransferencia de la datos 
            })
            .catch((error) => { //para ver un error
            })

        this.getComponentes(this.state.cajaanyo)
        this.get_chart_data(id_componente)   // PARA QUE CAMBIE EN TIEMPO REAL LAS BARRAS

    }
    //creando funcion de chart
    get_chart_data(id_componente) {
        axios.post(`${UrlServer}/chartproyeccion`, //RUTA DEL API
            {
                "id_ficha": this.state.cajaidficha,
                "anyo": this.state.cajaanyo,
                "id_componente": id_componente

            }
        )
            .then((respuesta) => {  //respuesta del api año inicial
                this.setState({    //sirve para modificar el valor de una variable
                    chart_data: respuesta.data     // se declara en el constructor "es cualquier nombre"    (sabemmos que se esta guardando numero anyo inicial)
                })
            })
            .catch((error) => {
            })
    }

    activarEdicion(index) { //index de componentes - solo se puede mandar los datos que esten en la interfaz dentro de la tabla, son datos que se pueden pasar de la tabla hacia esta funcion activarrEdicion


        var componenteTemp = this.state.componentes[index]
        //preparación del componente para formato lista
        var componenteslista = [
            // [
            //     respuesta.data[0].MEXPT1,
            //     respuesta.data[0].MPROVAR1,
            //     anyo + '-' + '01' + '-' + '01',
            //     respuesta.data[0].id_componente
            // ],
            // [
            //     respuesta.data[0].MEXPT2,
            //     respuesta.data[0].MPROVAR2,
            //     anyo + '-' + '02' + '-' + '01',
            //     respuesta.data[0].id_componente
            // ]

        ]
        // componenteslista.push(
        // [
        //     respuesta.data[0].MEXPT3,
        //     respuesta.data[0].MPROVAR3,
        //     anyo + '-' + '03' + '-' + '01',
        //     respuesta.data[0].id_componente
        // ]

        // )
        for (let i = 1; i <= 12; i++) {
            componenteslista.push(
                [
                    componenteTemp['MEXPT' + i],
                    componenteTemp['MPROVAR' + i],
                    this.state.cajaanyo + '-' + i + '-' + '01',
                    componenteTemp.id_componente
                ]

            )

        }
        this.setState(
            {
                cajalistacomponente: componenteslista,
                activatorinput: index
            }
        )

    }

    guardarproyeccioncomp() {

        axios.post(`${UrlServer}/putproyecciones`,

            this.state.cajalistacomponente
        )
            .then((respuesta) => {
                alert("data guardada")

            })
            .catch((error) => {
                alert("no se ha guardado la data")
            })

        this.setState(
            {
                activatorinput: -1
            }
        )
        document.getElementById("create-course-form").reset();
    }



    render() {//es todo lo que se imprime en la pantalla render es una funcion del propio react

        var { cajaanyo } = this.state //SE USO PARA PONER EL AÑO EN EL CHART TITULO

        const options = {
            chart: {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#242526'],
                        [1, '#242526']
                    ]
                },

                type: 'column'
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },

            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                },
                text: 'PROGRAMADO' + ' ' + cajaanyo
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                },
                text: 'Obra:' + '' + sessionStorage.getItem('codigoObra')  //codigo nombre de la obra
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }

                },

                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true,
                title: {
                    text: 'Proyecciones'
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Soles (S/.)'
                },
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                },
                headerFormat: '<span style="font-size:20px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} soles</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true

            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0
                }
            },
            series: [

                {
                    name: 'Avance Mensual',
                    data: this.state.chart_data.avance

                }, {
                    name: 'Proyección Aprobada',
                    data: this.state.chart_data.exptec

                }, {
                    name: 'Proyección Variable',
                    data: this.state.chart_data.proyvar

                }

            ]

        };


        // arriba del return es netamente javascritp
        return (
            // dentro del render solo puede haber un elemento (div)
            // dentro del return solo va JSX 

            <div className="container-fluid">
                <select className="selectproye" onChange={event => this.getComponentes(event.target.value)}>
                    <option>Seleccione el año</option>
                    {this.state.anyosproyectados.map((anyo, index) =>     //HACE INTERACCION CON UN SOLO ELEMENTO
                        <option key={index} value={anyo}>{anyo}</option>
                    )}
                </select>
                <form>
                    {/* id="create-course-form" */}
                    <table className="table table-sm table-responsive" >

                        <thead >
                            <tr>
                                <th>N°</th>
                                <th>COMPONENTE</th>
                                <th>DESCRIPCION</th>
                                <th>ENERO</th>
                                <th>FEBRERO</th>
                                <th>MARZO</th>
                                <th>ABRIL</th>
                                <th>MAYO</th>
                                <th>JUNIO</th>
                                <th>JULIO</th>
                                <th>AGOSTO</th>
                                <th>SETIEMBRE</th>
                                <th>OCTUBRE</th>
                                <th>NOVIEMBRE</th>
                                <th>DICIEMBRE</th>
                            </tr>
                        </thead>

                        {this.state.componentes.map((componente, index) =>

                            <tbody key={index}>
                                <tr>
                                    <td rowSpan="3" >

                                        <Button className="botoncomp" id={"toggler" + componente.numero} onClick={() => this.get_chart_data(componente.id_componente)} >
                                            {componente.numero}
                                        </Button>
                                        <Button className="botoncomp" onClick={() => this.activarEdicion(index)} >
                                            Editar
                                    </Button>
                                        <Button className="botoncomp" onClick={() => this.guardarproyeccioncomp(index)} >
                                            guardar
                                    </Button>

                                    </td>
                                    <td className="componentetitulo" rowSpan="3">{componente.nombre}</td>
                                    <td>Avance Mensual</td>
                                    {this.state.mesesfor.map((mes) =>

                                        <td className="avance">{this.formatmoney(componente['M' + mes])}</td>
                                    )}
                                </tr>


                                <tr>

                                    <td >Proyección Aprobada</td>
                                    {this.state.mesesfor.map((mes, index_1) =>
                                        <td key={index_1}>

                                            <input
                                                className="inputproy"
                                                onBlur={evento => this.capturaInputProyeccionExp(evento, mes, index)}
                                                placeholder={this.formatmoney(componente['MEXPT' + mes])}
                                                disabled={(this.state.activatorinput == index) ? "" : "disabled"}

                                            />
                                        </td>
                                    )}
                                </tr>

                                <tr>
                                    <td>Proyección variable</td>
                                    {this.state.mesesfor.map((mes, index_2) =>

                                        <td key={index_2}>

                                            <input
                                                className="inputproy"
                                                onBlur={evento => this.capturaInputProyeccionVar(evento, mes, index)}
                                                placeholder={this.formatmoney(componente['MPROVAR' + mes])}
                                                disabled={(this.state.activatorinput == index) ? "" : "disabled"}

                                            />
                                        </td>
                                    )}

                                </tr>

                                <tr>
                                    <td colSpan="15" className="">
                                        {/* se puede hacer propio el collaps con una variable de cambio como el componente.numero que es  una variable */}
                                        <UncontrolledCollapse toggler={"#toggler" + componente.numero}>

                                            <HighchartsReact

                                                highcharts={Highcharts}
                                                options={options}
                                            />
                                        </UncontrolledCollapse>


                                        {/* <Modal toggler={"#toggler" + componente.numero}>
                                            <ModalHeader>CHART</ModalHeader>
                                            <ModalBody>
                                            <HighchartsReact

                                                highcharts={Highcharts}
                                                options={options}
                                            />
                                                
                                            </ModalBody>
                                        </Modal> */}
                                    </td>
                                </tr>

                            </tbody>
                        )}

                        <tbody>
                            <tr>
                                <td rowSpan="3"></td>
                                <td rowSpan="3" className="componentetitulo" >
                                    TOTAL
                                </td>
                                <td>Avance Mensual</td>
                                {this.state.mesesfor.map((mes, index) =>

                                    <td className="avance">

                                        {
                                            (() => {
                                                console.log(this.state.componentes);
                                                var avance_mensual = 0
                                                for (let i = 0; i < this.state.componentes.length; i++) {
                                                    const componente = this.state.componentes[i];
                                                    avance_mensual += componente['M' + mes]
                                                }
                                                return this.formatmoney(avance_mensual)
                                            })()
                                        }
                                    </td>
                                )}
                            </tr>


                            <tr>

                                <td >Proyección Aprobada</td>
                                {this.state.mesesfor.map((mes, index) =>

                                    <td className="avance">

                                        {
                                            (() => {
                                                console.log(this.state.componentes);
                                                var avance_mensual = 0
                                                for (let i = 0; i < this.state.componentes.length; i++) {
                                                    const componente = this.state.componentes[i];
                                                    avance_mensual += componente['MEXPT' + mes]
                                                }
                                                return this.formatmoney(avance_mensual)
                                            })()
                                        }
                                    </td>
                                )}
                            </tr>

                            <tr>
                                <td>Proyección variable</td>
                                {this.state.mesesfor.map((mes, index) =>

                                    <td className="avance">

                                        {
                                            (() => {
                                                console.log(this.state.componentes);
                                                var avance_mensual = 0
                                                for (let i = 0; i < this.state.componentes.length; i++) {
                                                    const componente = this.state.componentes[i];
                                                    avance_mensual += componente['MPROVAR' + mes]
                                                }
                                                return this.formatmoney(avance_mensual)
                                            })()
                                        }
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>




        );
    }

}
export default Proyeccion;

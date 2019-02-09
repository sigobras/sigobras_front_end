import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner, Row, Col} from 'reactstrap';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import ReactJson from 'react-json-view'

class PartidasNuevas extends Component {
    constructor(){
        super()
        this.state={
            DataComponentes:[],
            Data1:[],
            Data2:[],
            Errores1:[],
            Errores2:[],
            erroresEncontrado:'',
            DataFinal:[],
            DataInputSelect:'S',
            DataPlanilla:[]
            
        }
        this.CostosUnitarios = this.CostosUnitarios.bind(this)
        this.PlanillaMetrados = this.PlanillaMetrados.bind(this)
        this.verificarDatos = this.verificarDatos.bind(this)
        this.EnviarDatos = this.EnviarDatos.bind(this)
        this.inputSelecValue = this.inputSelecValue.bind(this)

    }

    componentWillMount(){
        axios.post(`${UrlServer}/listaComponentesPorId`,{
            "id_ficha": sessionStorage.getItem("idObra")
        })
        .then((res)=>{
            console.log(res);
            
            this.setState({
                DataComponentes:res.data
            })
        })
        .catch((error)=>{
            console.log('los componentes no estan bien ')
        })
    }

    CostosUnitarios(){
        
        const input = document.getElementById('input1')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0]).then((rows) => {

                // console.log('> ', rows)
                var procesoBucarElemento = 1
                var dataSubmit = []
                var partida = {}
                var ObRecurso = []
                var zonaRecursos = false
                var tipoRecurso = null
                for (let index = 0; index < rows.length; index++) {
                    
                    // busca el valor de partida
                    if(rows[index][0] === "Partida"){
                        dataSubmit.push(partida)
                        partida = {}
                        partida.recursos = []
                        partida.item = rows[index][1]
                        partida.descripcion = rows[index][3]
                        procesoBucarElemento++

                    }else if (rows[index][0] === "Rendimiento") {
                        // busca unidad de medida, eq y costo unitario
                        partida.unidad_medida = rows[index][1]
                        partida.costo_unitario = rows[index][7]

                        for (let i = 0; i < rows[index].length; i++) {
                            if(rows[index][i] === "EQ."){
                                if(rows[index][i+1] === null){
                                    partida.equipo = 1
                                }else{
                                    partida.equipo = rows[index][i+1]
                                }
                            }
                        }

                        // console.log('sss>>',rows[index])

                        if(rows[index][1] === "GLB/DIA" && rows[index][2] === null){
                            partida.rendimiento = 1;

                        }else if(rows[index][2] === "MO."){
                            partida.rendimiento = rows[index][3]
                        }else{
                            partida.rendimiento = rows[index][2] 
                        }

                    }else if (rows[index][0] === "Código" ) {
                        //buscamos el nombre del recurso
                        index++
                        for (let i = 0; i < rows[index].length; i++) {
                            if(rows[index][i] !== null ){
                                tipoRecurso = rows[index][i]
                            }
                        }
                        zonaRecursos = true

                    // zona de recursos
                    }else if ( zonaRecursos === true){
                        
                        // busca el tipo de material
                        var valorExiste = 0 
                        var temp = ''
                        for (let k = 0; k < rows[index].length; k++) {
                            const element = rows[index][k];
                            if(element !== null && typeof element !== 'number' ){
                                temp = element
                                valorExiste++
                            }
                            
                        }
                        if(valorExiste === 1){
                            // console.log('dddsasasas',temp,'>>> ',rows[index]);
                            
                            tipoRecurso = temp
                        }
                        
                        
                       
                        
                        if (rows[index][0] !== null ) {
                            ObRecurso.push(tipoRecurso)
                             ObRecurso.push(rows[index][0])
                            var columnaRecurso = 2
                            // revisa toda la fila
                            for (let i = 1; i < rows[index].length; i++) {
                                if (rows[index][i] !== null ) {
                                    if(columnaRecurso === 2){
                                        ObRecurso.push(rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 3){
                                        ObRecurso.push(rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 4){
                                        ObRecurso.push( rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 5){
                                        ObRecurso.push(rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 6){
                                        ObRecurso.push(rows[index][i])
                                        columnaRecurso++
                                    }else if(columnaRecurso === 7){
                                        ObRecurso.push( rows[index][i])
                                        columnaRecurso++
                                    }
                                }
                            }
                            // 
                            if(ObRecurso.length < 8){
                                ObRecurso.splice(4,0, null)
                            }
                            
                            partida.recursos.push(ObRecurso)
                            ObRecurso = []

                        }else if(rows[index][0] === null &&  rows[index][2] !== null){
                            tipoRecurso = rows[index][2]
                        }
                    }
                }
                dataSubmit.push(partida)
                // console.log('dataSubmit > ', dataSubmit)
                dataSubmit = dataSubmit.slice(1,dataSubmit.length)

                this.setState({
                    Data1:dataSubmit
                })

            })
            .catch((error)=>{
                alert('algo salió mal')
                console.log(error);
            })
        })
    }

    PlanillaMetrados(){
        const { Data1 } = this.state
        const input = document.getElementById('input2')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0]).then((rows ) => {
                // console.log('rows>> ', rows)
                var fila = 0
                var columna = 0
                // UBICANDO LA POSICION DE LA PALABRA ITEM
                for (let index = 0; index < rows.length; index++) {

                    for (let i = 0; i < rows[index].length; i++) {
                        // console.log(rows[index][i])

                        var item = rows[index][i]
                        if (typeof item === 'string') {
                      
                          item = item.toLowerCase()  
                        }

                        // console.log('item', item)
                        
                        if(item === 'item' || item === 'Partida'){
                            fila = index 
                            columna = i
                            console.log('item >', index , '>' , i)

                            break
                        }
                    }
                    
                }

                var data2 = []
                var obPlanilla = {}
                var activo = false

                // CREAMOS EL DATA DE PLANILLA DE METRADOS
                
                for (let index = fila+2; index < rows.length; index++) {

                    var cantcols = 0
                    // console.log('index ', index);
                    
                    for (let l = 0; l < rows[index].length; l++) {
                        const celda = rows[index][l];
                        if(celda !== null ){
                            cantcols++
                        }
                    }

                    // TITULOS
                    if(cantcols === 2){
                        data2.push(obPlanilla)
                        obPlanilla = {}
                        obPlanilla.tipo = "titulo"
                        obPlanilla.item =  rows[index][columna]
                        obPlanilla.descripcion =  rows[index][columna+1]
                        obPlanilla.veces = null
                        obPlanilla.largo = null
                        obPlanilla.ancho = null
                        obPlanilla.alto = null
                        obPlanilla.parcial = null
                        obPlanilla.metrado = null
                        obPlanilla.unidad_medida = null
                        obPlanilla.costo_unitario = null
                        obPlanilla.equipo = null
                        obPlanilla.rendimiento = null
                        // obPlanilla.actividades = []
                    }
                    else if(rows[index][columna+7] !== null && rows[index][columna] !== null ){
                        // si la columna total tiene un valor
                        data2.push(obPlanilla)
                        obPlanilla = {}
                        obPlanilla.tipo = "partida"
                        obPlanilla.item =  rows[index][columna]
                        obPlanilla.descripcion =  rows[index][columna+1]
                        obPlanilla.actividades = []
                        obPlanilla.veces = rows[index][columna+2]
                        obPlanilla.largo = rows[index][columna+3]
                        obPlanilla.ancho = rows[index][columna+4]
                        obPlanilla.alto = rows[index][columna+5]
                        obPlanilla.parcial = rows[index][columna+6]
                        obPlanilla.metrado = rows[index][columna+7]
                    }else if(rows[index][columna] === null && rows[index][columna+2] !== null){
                        var obActividades = []
                        // nombre
                        obActividades.push(rows[index][columna+1])
                        // veces
                        obActividades.push(rows[index][columna+2])
                        // largo
                        obActividades.push(rows[index][columna+3])
                        // ancho
                        obActividades.push(rows[index][columna+4])
                        // alto
                        obActividades.push(rows[index][columna+5])
                        // parcial
                        obActividades.push(rows[index][columna+6])
 
                        obPlanilla.actividades.push(obActividades)
                    }
                    
                }
                data2.push(obPlanilla)
                data2 = data2.slice(1,data2.length)


                    // insertando actividades unicas
                for (let j = 0; j < data2.length; j++) {
                    if(typeof data2[j].actividades !== 'undefined' && data2[j].actividades.length === 0 ){
                        var obActividades = []
                        // convertimos variable si no es null
                        var veces = data2[j].veces
                        var largo = data2[j].largo
                        var alto = data2[j].alto
                        var ancho = data2[j].ancho
                        var metrado = data2[j].metrado

                        veces = (veces === null) ? veces  : parseFloat( veces).toFixed(3)
                        largo = (largo === null )? largo : parseFloat( largo).toFixed(3)
                        alto = (alto === null )? alto : parseFloat( alto).toFixed(3)
                        ancho = (ancho === null )? ancho : parseFloat( ancho).toFixed(3)
                        metrado = (metrado === null )? metrado : parseFloat( metrado).toFixed(3)

                        // console.log('verifica >', typeof veces ,'>' , veces)

                        

                        obActividades.push("Actividad unica")
                        obActividades.push(veces)
                        obActividades.push(largo)
                        obActividades.push(alto)
                        obActividades.push(ancho)
                        obActividades.push(metrado)

                        data2[j].actividades.push(obActividades)
                    }
                }
                // console.log('data2>>', data2)
                this.setState({
                    Data2:data2,
                    DataPlanilla:[...data2]
                })
            //    console.log('coin2>',arrayItems2)

            })
            .catch((error)=>{
                alert('algo salió mal')
                console.log(error);
            })
        })
    }
    
    verificarDatos(){
        const { Data1, Data2, DataInputSelect, DataPlanilla } = this.state
        
        var Errores = 0
        var ErroresArray1 = []
        var ErroresArray2 = []


        // eliminamos los titulo del  array 
        for (let i = 0; i < Data2.length; i++) {
            const tipo = Data2[i].tipo;
            if (tipo === 'titulo') {
                Data2.splice(i,1)
                i--
            }
        }
        
        // verifica que sean del mismo tamaño los datas de Costos unitarios y Planilla de metrados

        if(Data1.length !== Data2.length){

            for (let i = 0; i < Data1.length; i++) {
                var data = Data1[i]
                 var encontrado = false
                for (let j = 0; j < Data2.length; j++) {
                    if(data.item === Data2[j].item){
                        // console.log('<>>', data[0] === Data2[j][0])
                        encontrado = true
                        break
                    }                   
                }
                if (!encontrado){
                    ErroresArray1.push(data)
                }
            }
            Errores = 'tamaños diferentes'
        }else{

            for (let index = 0; index < Data1.length; index++) {
                
                if(Data1[index].item === Data2[index].item){
                    // console.log('coincide')
                }else{
                    // console.log('algo no coincide')
                    Errores++
                    // console.log(Data1[index] ,  Data2[index])

                    ErroresArray1.push(Data1[index])
                    ErroresArray2.push(Data2[index])

                    
                }
                
            }
        }
        // console.log('errores encontrados', Errores)
        // uniendo planilla de datos y acu

        if(Errores === 0){
            var indexData1 = 0
            for (let i = 0; i < DataPlanilla.length; i++) {
                if(DataPlanilla[i].tipo === 'partida'){
                    delete DataPlanilla[i]['nombre']
                    DataPlanilla[i].item = Data1[indexData1].item
                    DataPlanilla[i].descripcion = Data1[indexData1].descripcion
                    DataPlanilla[i].unidad_medida = Data1[indexData1].unidad_medida
                    DataPlanilla[i].costo_unitario = Data1[indexData1].costo_unitario
                    DataPlanilla[i].equipo = Data1[indexData1].equipo
                    DataPlanilla[i].rendimiento = Data1[indexData1].rendimiento
                    DataPlanilla[i].recursos = Data1[indexData1].recursos
                    
                    indexData1++
                }
                DataPlanilla[i].componentes_id_componente = DataInputSelect
                

            }
        }
        // console.log('data modificada DataPlanilla', DataPlanilla)
        
        this.setState(
            {
                Errores1: ErroresArray1,
                Errores2: ErroresArray2,
                erroresEncontrado:'Errores encontrados : '+Errores,
                DataFinal: DataPlanilla

            }
        )
    }
    EnviarDatos(){  
       
        if(confirm('Estas seguro de enviar las partidas !este proceso es irreversible')){
            axios.post(`${UrlServer}/nuevasPartidas`,
            this.state.DataFinal
            )
            .then((res)=>{
                console.log('partidas ', res);
                alert('todo okey se ingresaron las partidas')
            })
            .catch((error)=>{
                console.log('algo salio mal ERROR',error);
                alert('Algo salio mal')

                
            })
        }
    }

    inputSelecValue(event){
        
        this.setState({ [event.target.name]: event.target.value });
    }
    render() {
        const { Data1, Data2, Errores1, Errores2, DataFinal, DataComponentes, DataInputSelect } = this.state
        return (
            <div>
                <Card>
                    <CardHeader className="p-1">
                        <div className="clearfix p-0">
                            <label className="float-left mb-0">Ingreso de Partidas a la obra con id:  <strong>{ sessionStorage.getItem('idObra') }</strong></label>
                            <label className="float-right  mb-0">
                                <select className="form-control form-control-sm" onChange={this.inputSelecValue} name="DataInputSelect" value={ DataInputSelect }>
                                    <option value={DataInputSelect} disabled>Componentes</option>
                                    {DataComponentes.length === undefined ? '': DataComponentes.map((componete,i)=>
                                        <option value={ componete.id_componente} key={i}>( {componete.numero} ) {componete.nombre}</option>
                                    )}
                                </select>
                            </label>
                        </div>
                    </CardHeader>
                    {DataInputSelect === 'S' ? <h1 className="text-center ">Seleccione Un compomente</h1>:
                        <CardBody>
                            <label> Numero de componete selecionado: { DataInputSelect }</label>
                            <Row>
                                <Col sm="4">
                                    <fieldset>
                                        <legend><b>cargar datos de Costos unitarios</b></legend>
                                        <input type="file" id="input1" onClick={this.CostosUnitarios} />
                                            <code>
                                                <ReactJson src={Data1}  name="Data1" theme="monokai" collapsed={2} displayDataTypes={false}/>
                                            </code>
                                        
                                    </fieldset>
                                </Col>
                                <Col sm="4">
                                    <fieldset>
                                        <legend><b>cargar datos de Planilla de metrados</b></legend>
                                        <input type="file" id="input2" onClick={this.PlanillaMetrados} />

                                        <code className="small">
                                            <ReactJson src={Data2} name="Data2"  theme="monokai" collapsed={2} displayDataTypes={false}/>
                                        </code>
                                    </fieldset>
                                </Col>
                                <Col sm="4">
                                    <fieldset>
                                        <legend><b>Opciones de manejo de los datos cargados</b></legend>
                                        <button className="btn btn-outline-warning" onClick={this.verificarDatos}> verificar datos</button>
                                        <i>{this.state.erroresEncontrado}</i>
                                        {/* <table className="table table-bordered table small">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="2"><b>Costos unitarios</b></td>
                                                    <td colSpan="2"><b>Planilla de metrados</b></td>
                                                </tr>
                                                <tr> 
                                                    <td>
                                                    {Errores1.map((err1, i)=>
                                                        <tr key={i}>
                                                            <td>{err1.item}</td>
                                                            <td>{err1.nombre}</td>
                                                        </tr>
                                                    )} 
                                                    </td>

                                                    <td>
                                                    {Errores2.map((err1, i)=>
                                                        <tr key={i}>
                                                            <td>{err1.item}</td>
                                                            <td>{err1.nombre}</td>
                                                        </tr>
                                                    )} 
                                                    </td>
                                                </tr>                                
                                            </tbody>
                                        </table> */}
                                        
                                        <code>
                                            <ReactJson src={DataFinal}  name="DataFinal"  theme="monokai" collapsed={2} displayDataTypes={false}/>
                                        </code>
                                        <br/>
                                        <button className="btn btn-outline-success" onClick={this.EnviarDatos}> Guardar datos </button>

                                    </fieldset>
                                </Col>
                            </Row>
                                        
                        </CardBody>
                    }
                    <CardFooter>___</CardFooter>
                </Card>
            </div>
        )
    }
}
export default PartidasNuevas;

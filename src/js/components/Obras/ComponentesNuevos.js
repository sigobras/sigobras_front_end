import React, { Component } from 'react'
import readXlsxFile from 'read-excel-file'
import axios from 'axios'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'

class ComponentesNuevos extends Component {
    constructor(props){
        super(props)
        this.state={
            Data:[],
            mensajeConfirmacion: '',
            AvisoError:''
            
        }
        this.ExcelFunction = this.ExcelFunction.bind(this)
        this.GuardarComponentes = this.GuardarComponentes.bind(this)
    }

    ExcelFunction(){
        
        const input = document.getElementById('input')
        input.addEventListener('change', () => {
            readXlsxFile(input.files[0]).then((rows ) => {
                var dataArray = []
                for (let index = 0; index < rows.length; index++) {
                    var datos = Object.assign({idObra:Number(sessionStorage.getItem('idObra'))},rows[index])
                    dataArray.push(datos)
                }
                this.setState({
                    Data:dataArray
                })

                // sessionStorage.setItem('componentes',JSON.stringify(dataArray), null, '\t')
                // console.log('array> ',dataArray);

            })
            .catch((error)=>{
                alert('algo salió mal')
                
                console.log(error);
                
            })
        })
    }

    GuardarComponentes(e){
        e.preventDefault()
        console.log(this.state.Data);
        
        if (confirm('estas seguro de guardar los componetes de la obra?')) {
            axios.post(`${UrlServer}/nuevosComponentes`,
               this.state.Data
            )
            .then((res)=>{
                console.log(res)
                this.setState({
                    mensajeConfirmacion: res.data.message,
                    AvisoError: res.data
                })
            })
            .catch((error)=>{
                console.log(error);
                
            })
        }
    }

    render() {
        const { Data } = this.state
        return (
            <div>
                <Card>
                    <CardHeader>Ingreso de componentes a la obra con id: <strong>{ sessionStorage.getItem('idObra') }</strong> </CardHeader>
                    <CardBody>
                        <fieldset>
                            <legend><b>Cargar archivo excel componentes de la obra</b></legend>
                            <input type="file" id="input" onClick={this.ExcelFunction} />
                            <div className="row">                
                                <div className="col-md-10">
                                    <table className="table table-bordered table-sm small" border="1">
                                        <tbody>
                                            { Data.map((Fila1, FilaIndex)=>
                                                <tr key={FilaIndex}>
                                                    <td><b>{ Fila1[0] }</b></td>
                                                    <td>{Fila1[1] }</td>
                                                    <td>{Fila1[2] }</td>
                                                    <td>{Fila1.idObra }</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-2">
                                    
                                        {Data.length <1 ? '':
                                        <button onClick={(e)=>this.GuardarComponentes(e)} className="btn btn-outline-success"> Guardar Componentes</button>}
                                    <div className="table table-responsive">    
                                        <label className="small center">{this.state.mensajeConfirmacion}</label>
                                        <label className="center text-danger"> componentes insertados{this.state.AvisoError }</label>
                                    </div>
                                </div>                   
                            </div>
                        </fieldset>
                    </CardBody>
                    <CardFooter>___</CardFooter>
                </Card>
            </div>
        )
    }
}
export default ComponentesNuevos;

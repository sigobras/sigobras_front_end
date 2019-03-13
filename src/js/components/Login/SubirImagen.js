import React, { Component } from 'react'
import axios from "axios";

class SubirImagen extends Component {

    constructor(props) {
        super(props);
        this.state ={
            file: null,
            inputtext:''
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChange1 = this.onChange1.bind(this);
    }

    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('foto',this.state.file);
        formData.append('id_acceso',11);
        formData.append('id_actividad',12);
        formData.append('codigo_obra', 'E002');
        
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        
        axios.post("http://190.117.94.80:9000/imagenesActividad",
        
        formData,
        config
        )
        .then((res) => {
            console.log('res  img', res)
            alert("archivo enviado con exito ");
        })
        .catch((err) => {
            console.error('ufff envia al api ❌', err);
            
        });
    }

    onChange(e) {
        console.log('subir imagen', e.target.files);
        
        this.setState({file:e.target.files[0]});
    }

    onChange1(e) {
        console.log('INPUT de texto', e.target.value);
        
        this.setState({inputtext:e.target.value});
    }

    render() {
        return (
            <div className="card">
               <form onSubmit={this.onFormSubmit}>
                    <h1>cargando imagn</h1>
                    <input type="file" name="myImage" onChange= {this.onChange} />
                    <input type="input" name="inputANG" onChange= {this.onChange1} />
                    <button type="submit">subir</button>
                </form> 
                {  this.state.file !== null ? console.log('datos', this.state.file):''}
                <div className="">
                    <img src={this.state.file} />
                </div>
            </div>
            
        )
    }
}

export default SubirImagen
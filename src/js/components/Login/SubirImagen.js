import React, { Component } from 'react'
import axios from "axios";

class SubirImagen extends Component {

    constructor(props) {
        super(props);
        this.state ={
            file: null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        console.log('subir imagen', formData)
        formData.append('myImage',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("http://190.117.94.80:9000/listaestados",formData,config)
            .then((response) => {
                alert("The file is successfully uploaded");
            })
            .catch((error) => {
            });
    }

    onChange(e) {
        console.log('subir imagen', e.target.files);
        
        this.setState({file:e.target.files[0]});
    }

    render() {
        return (
            <div className="card">
               <form onSubmit={this.onFormSubmit}>
                    <h1>cargando imagn</h1>
                    <input type="file" name="myImage" onChange= {this.onChange} />
                    <button type="submit">subir</button>
                </form> 
            </div>
            
        )
    }
}

export default SubirImagen
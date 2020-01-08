import React, { Component } from 'react';
import axios from 'axios';

class Ingreso extends Component {
    constructor() {
        super();
        this.state = {
            dataUsuarios: []
        }

    }

    componentDidMount() {
        axios.get('http://localhost:3000/usuarios')
            .then((res) => {
                console.log('rest',res.data);
                this.setState({
                    dataUsuarios: res.data
                })
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log(this.state.dataUsuarios)
    }
    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-header">
                       <b> LISTA DE USUARIOS REGISTRADOS EN EL SISTEMA</b>
                    </div>
                    <div className="card-body">
                        <fieldset>
                            <legend><b>Usuarios: {this.state.dataUsuarios.length}</b> </legend>
                            
                            {this.state.dataUsuarios.map((user, i) =>
                                <div key={i}>
                                    <h1>{user.nombre}</h1>
                                </div>
                            )}
                        </fieldset>
                    </div>
                </div>
            </div>
        )
    }
}
export default Ingreso;
import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, CustomInput } from 'reactstrap';
import axios from 'axios'
import { UrlServer } from '../../Utils/ServerUrlConfig'
class CreaAcceso extends Component {
    render() {
        return (
            <div>   
                <FormGroup>
                    <Label for="exampleEmail">Usuario</Label>
                    <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                </FormGroup>
                 
                <FormGroup>
                    <Label for="exampleSelect">cargos</Label>
                    <Input type="select" name="select" id="exampleSelect">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleCheckbox">Estado de usuario desactivado / Activo</Label>
                    <div>
                        <CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Estado" />
                    </div>
                </FormGroup>
                <Button>Guardar</Button>
            </div>
        );
    }
}

export default CreaAcceso;
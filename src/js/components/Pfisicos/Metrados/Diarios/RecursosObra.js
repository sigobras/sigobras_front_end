import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import ListaActividadesTiempo from './ComponetsRecursosObra/ListaActividadesTiempo'
import ListaMateriales from './ComponetsRecursosObra/ListaMateriales'

class RecursosObra extends Component {
    constructor(){
        super()
        this.TabRecursos = this.TabRecursos.bind(this);
        this.state = {
            activeTab: '2'
        };
    }

    TabRecursos(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }

    render() {
        return (
            <Card>
                <Nav tabs>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.TabRecursos('1'); }} >
                        ACTIVIDADES POR TIEMPO
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.TabRecursos('2'); }} >
                            MATERIALES
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <ListaActividadesTiempo />
                    </TabPane>

                    <TabPane tabId="2">
                        <ListaMateriales />
                    </TabPane>
                </TabContent>
            </Card>
        );
    }
}

export default RecursosObra;
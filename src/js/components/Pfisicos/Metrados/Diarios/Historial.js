import React, { Component } from 'react';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardHeader, CardBody, Spinner, Collapse , Button, CardTitle, CardText, Row, Col} from 'reactstrap';
import classnames from 'classnames';
import { UrlServer } from '../../../Utils/ServerUrlConfig'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class MDHistorial extends Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          activeTab: '1'
        };
    }
      
    toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }

    render() {
        const options = {
            chart: {
                type: 'area'
            },
            title: {
                text: 'RESUMEN ESTADISTICO DE VALORIZACIÓN DIARIA'
            },
            subtitle: {
                text: 'General'
            },
            xAxis: {
                categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Soles'
                },
                labels: {
                    formatter: function () {
                        return this.value / 1000;
                    }
                }
            },
            tooltip: {
                split: true,
                valueSuffix: 'Soles'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: [
                {
                    name: 'C-1',
                    data: [502, 635, 809, 947, 1402, 3634, 5268]
                }, {
                    name: 'C-2',
                    data: [106, 107, 111, 133, 221, 767, 1766]
                }, {
                    name: 'C-3',
                    data: [163, 203, 276, 408, 547, 729, 628]
                }, {
                    name: 'C-4',
                    data: [18, 31, 54, 156, 339, 818, 1201]
                }, {
                    name: 'C-5',
                    data: [2, 2, 2, 6, 13, 30, 46]
                }
            ]
        }
        
    
        return(
            <Card>
                <Nav tabs>
                    <NavItem>
                        <select className="form-control form-control-sm">
                            <option>2019</option>
                            <option>2018</option>
                            <option>2017</option>
                        </select>
                    </NavItem> 

                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>
                            MES 
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
                            MES 2
                        </NavLink>
                    </NavItem>

                </Nav>


                <Nav tabs>
                    
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>
                            RESUMEN
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
                            C - 01
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
                            C - 02
                        </NavLink>
                    </NavItem>

                </Nav>

                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <HighchartsReact
                            highcharts={Highcharts}
                            // constructorType={'stockChart'}
                            options={options}
                        />

                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                        <Col sm="6">
                            <Card body>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                            </Card>
                        </Col>
                        <Col sm="6">
                            <Card body>
                            <CardTitle>Special Title Treatment</CardTitle>
                            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                            <Button>Go somewhere</Button>
                            </Card>
                        </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </Card>
        )
  }
}

export default MDHistorial;
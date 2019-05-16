import React, { Component } from 'react';
import Layout from "./scroll"
import Paginacion from "./Paginacion"

import DinamicTable from "./DinamicTable"
class Index extends Component {
  render() {
    return (
      <div>
        {/* <h1>proces documentarios</h1> */}
        {/* <Layout /> */}
        <DinamicTable />
      </div>
    );
  }
}

export default Index;
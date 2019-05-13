import React, { Component } from 'react';
import Layout from "./scroll"
import Paginacion from "./Paginacion"

class Index extends Component {
  render() {
    return (
      <div>
        {/* <h1>proces documentarios</h1> */}
        {/* <Layout /> */}
        <Paginacion />
      </div>
    );
  }
}

export default Index;
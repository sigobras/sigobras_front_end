import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class CustomLinkExample extends Component {
  constructor(){
    super();
    this.state = {

    }
  }
  render(){
    return (
      <Router>
        <div>
          <OldSchoolMenuLink activeOnlyWhenExact={true} to="/" label="Home" />
          <OldSchoolMenuLink to="/about" label="About" />
          <br />
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    ); 
  }
}

const OldSchoolMenuLink = ({ label, to, activeOnlyWhenExact })=> {
  return (
    <Route
      path={to}
      exact={activeOnlyWhenExact}
      children={({ match }) => (
        <div className={match ? "btn btn-primary text-light" : "btn btn-default"}>
          {match ? ">> " : " "}
          <Link to={to}>{label}</Link>
        </div>
      )}
    />
  );
}

class Home extends Component{
  render(){
    return (
      <div>
        <h2>Home</h2>
      </div>
    );
  }
}

class About extends Component{
  render(){
    return (
      <div>
        <h2>About</h2>
      </div>
    );
  }
}



export default CustomLinkExample;
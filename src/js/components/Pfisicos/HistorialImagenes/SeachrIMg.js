import React, { Component } from 'react';


class SeachrIMg extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchString: '' ,

      DataDemo: [

          { name: 'Backbone.js', url: 'https://documentcloud.github.io/backbone/'},
          { name: 'AngularJS', url: 'https://angularjs.org/'},
          { name: 'jQuery', url: 'https://jquery.com/'},
          { name: 'Prototype', url: 'http://www.prototypejs.org/'},
          { name: 'React', url: 'https://facebook.github.io/react/'},
          { name: 'Ember', url: 'http://emberjs.com/'},
          { name: 'Knockout.js', url: 'https://knockoutjs.com/'},
          { name: 'Dojo', url: 'http://dojotoolkit.org/'},
          { name: 'Mootools', url: 'http://mootools.net/'},
          { name: 'Underscore', url: 'https://documentcloud.github.io/underscore/'},
          { name: 'Lodash', url: 'http://lodash.com/'},
          { name: 'Moment', url: 'https://momentjs.com/'},
          { name: 'Express', url: 'http://expressjs.com/'},
          { name: 'Koa', url: 'http://koajs.com/'},
      
      ]
    }
    this.handleChange = this.handleChange.bind(this)
  }
  
  
  
  handleChange(e){
    this.setState({ searchString: e.target.value });
  }

  render() {
    var DatosLibreiras = this.state.DataDemo,
    searchString = this.state.searchString.trim().toLowerCase();


      console.log("DatosLibreiras",DatosLibreiras)
        
      if (searchString.length > 0) {
        DatosLibreiras = DatosLibreiras.filter((i) =>{
          return i.name.toLowerCase().match(searchString);
        });
      }
    
    return (
      <div>
        <input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder="clic" />
        <ul>
          {DatosLibreiras.map((i, index) =>{
            return <li key={ index }>{i.name} <a href={i.url}>{i.url}</a></li>;
          })}
        </ul>
      </div>
    );
  }
}

export default SeachrIMg;
import React, { Component } from 'react';


class MultiFilter extends Component {
  constructor(){
    super()
  
  this.state = {
    filter: "",
    data: [
      {
        fname: "Jayne",
        lname: "Washington",
        email: "jaynewashington@exposa.com",
        gender: "female",
        dni: "75871182"
      },
      {
        fname: "Peterson",
        lname: "Dalton",
        email: "petersondalton@exposa.com",
        gender: "male",
        dni: "123"
      },
      {
        fname: "Velazquez",
        lname: "Calderon",
        email: "velazquezcalderon@exposa.com",
        gender: "male",
        dni: "456"
      },
      {
        fname: "Norman",
        lname: "Reed",
        email: "normanreed@exposa.com",
        gender: "male",
        dni: "1235"
      }
    ]
  };

  this.handleChange = this.handleChange.bind(this)
}
  handleChange(event) {
    this.setState({ filter: event.target.value });
  };

  render() {
    const { filter, data } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = data.filter(item => {
      return Object.keys(item).some(key =>
        item[key].toLowerCase().includes(lowercasedFilter)
      );
    });

    return (
      <div>
        <input value={filter} onChange={this.handleChange} />
        {filteredData.map(item => (
          <div key={item.email}>
            <div>
              {item.fname} {item.lname} - {item.gender} - {item.email} - { item.dni }
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default MultiFilter
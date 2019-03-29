import React, { Component } from 'react';

class PracticaImg extends Component {

  render() {

    // Datos que debe renderizar la imagen

    const item = [
      {
        id: 1,
        img: 'http://190.117.94.80:9000/static/C001/20_00000026199_29-3-2019_12-13-33.jpg',
        class: 'img-fluid',
        alt: 'cargado de datos de algo',
        title: 'cargado de datos de algo',
        target: '_blank',
        link: 'http://sigobras.com/'
      },
      {
        id: 2,
        img: 'https://source.unsplash.com/random',
        class: 'img-fluid',
        alt: 'cargado de datos de algo',
        title: 'cargado de datos de algo',
        target: '_blank',
        link: 'http://sigobras.com/'
      }
    ];

    return (

      item.map(item => { 
        return <a key={ item.id } href={ item.link } target={ item.target }>
                <img className={ item.class } src={ item.img } alt={ item.alt } title={ item.title } width="250px" />
               </a>

      })

    )
    

  }

};

export default PracticaImg;
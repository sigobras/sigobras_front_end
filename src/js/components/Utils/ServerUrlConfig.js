const axios = require('axios')

// const UrlServer = "https://sigobrasbeta.herokuapp.com";
const UrlServer = "http://localhost:9000";
// const UrlServer = "http://190.117.94.80:9000";

//anton -------- en la red  ( oficina )
// const UrlServer = "http://192.168.0.4:9000"; 
//anton --------

// const Token = axios.defaults.headers.common['Authorization'] = `bearer ${sessionStorage.getItem('TuToken')}`;


module.exports = {
    UrlServer,
    // Token
} 


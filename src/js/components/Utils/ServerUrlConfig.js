const axios = require('axios')

const UrlServer = "https://sigobrasbeta.herokuapp.com";
// const UrlServer = "http://localhost:14000";
const Token = axios.defaults.headers.common['Authorization'] = `bearer ${sessionStorage.getItem('TuToken')}`;


module.exports = {
    UrlServer,
    Token
} 


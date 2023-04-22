// para desarrollo con el backend local
// const UrlServer = "http://localhost:9000";
// //para git pull cambiar a este modo
// const UrlServer = "http://api.sigobras.com";
const UrlServer = process.env.REACT_APP_API_URL;
const Id_Acceso = sessionStorage.getItem("idacceso");
module.exports = {
  UrlServer,
};

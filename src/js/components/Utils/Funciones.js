// redondea a dos decimales
Number.prototype.CustomToFixed = function (decimals) {
  return (
    Math.round(this * Math.pow(10, decimals)) / Math.pow(10, decimals)
  ).toFixed(decimals);
};
function Redondea(
  x,
  decimales = 2,
  soloPositivos = false,
  respuestaVacio = "-"
) {
  var decimales_pequenyos = decimales;
  if (Array.isArray(decimales)) {
    decimales_pequenyos = decimales[1];
    decimales = decimales[0];
  }
  if (x == null) {
    return respuestaVacio;
  } else if (x == 0 || isNaN(x)) {
    return respuestaVacio;
  }
  if (!isFinite(x)) {
    return respuestaVacio;
  }
  if (x < 0 && soloPositivos) {
    return respuestaVacio;
  }
  // if (decimales == 2 && Math.abs(x) < 0.01) {
  //   return respuestaVacio;
  // }
  if (Math.abs(x) < 0.01) {
    return Number.parseFloat(x)
      .CustomToFixed(decimales_pequenyos)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  } else {
    return Number.parseFloat(x)
      .CustomToFixed(decimales)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
}
function Redondea1(x) {
  if (x == null) {
    return "0";
  }
  return Number(Number.parseFloat(x).toFixed(2));
}
function RedondeaDecimales(x, decimales) {
  if (x == null) {
    return "0";
  }
  return Number(Number.parseFloat(x).toFixed(decimales));
}

function Redondea2(x) {
  // console.log("x =>>", x)
  return Number.parseFloat(x).toFixed(2);
}
// CALCULA LA FECHA ACTUAL
function FechaActual() {
  var fecha = new Date();

  var anio = fecha.getFullYear();
  var mes = fecha.getMonth() + 1;
  var dia = fecha.getDate();

  if (dia < 10) {
    dia = "0" + dia;
  }
  if (mes < 10) {
    mes = "0" + mes;
  }

  return anio + "-" + mes + "-" + dia;
}
function FechaActual2Meses() {
  var fecha = new Date();

  var anio = fecha.getFullYear();
  var mes = fecha.getMonth() - 1;
  var dia = fecha.getDate();

  if (dia < 10) {
    dia = "0" + dia;
  }
  if (mes < 10) {
    mes = "0" + mes;
  }

  return anio + "-" + mes + "-" + dia;
}

// CALCULA EL PRIMER DIA DEL MES ACTUAL
function PrimerDiaDelMesActual() {
  var date = new Date();
  var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);

  primerDia = primerDia.getDate();

  var ano = date.getFullYear();
  var mesAct = date.getMonth() + 1;

  if (primerDia < 10) {
    primerDia = "0" + primerDia;
  }

  if (mesAct < 10) {
    mesAct = `0${mesAct}`;
  }

  return ano + "-" + mesAct + "-" + primerDia;
}

// convierte formato dinero a numero
function ConvertFormatStringNumber(datoString) {
  // console.log('datoString', datoString)

  if (
    datoString !== "" &&
    datoString !== NaN &&
    datoString !== undefined &&
    typeof datoString !== "number"
  ) {
    return Number(datoString.replace(/[^0-9\.-]+/g, ""));
  } else {
    return datoString;
  }
}

// CAMBIAR FORMATO FECHA QUE VBIENE 2019-02-21 A feb. 2019
function convertirFechaLetra(fecha) {
  if (fecha !== "") {
    var fechaLlega = new Date(fecha);

    var anio = fechaLlega.getFullYear();
    var mes = fechaLlega.getMonth() + 1;
    var dia = fechaLlega.getDate();
    if (mes <= 9) {
      mes = "0" + mes;
    }

    if (dia <= 9) {
      dia = "0" + dia;
    }

    var formatearFecha = anio + "-" + mes + "-" + dia;

    // console.log("formatearFecha segun quiero", formatearFecha)

    const config = { year: "numeric", month: "short" };

    var fechaLetra = new Date(formatearFecha).toLocaleDateString("ES", config);

    // console.log('fecha que llega', fecha )
    // console.log("fecha mess letra>>>", fechaLetra)
    return fechaLetra;
  }
}

// genera colores aleatorios

function GeraColoresRandom() {
  function populate(a) {
    var hexValues = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
    ];
    for (var i = 0; i < 6; i++) {
      var x = Math.round(Math.random() * 14);
      var y = hexValues[x];
      a += y;
    }
    return a;
  }

  var newColor1 = populate("#");
  var newColor2 = populate("#");
  var angle = Math.round(Math.random() * 360);

  return (
    "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")"
  );
}

// encuentrar la extension de un archivo

function Extension(nombreArchivo) {
  // console.log("archivo", nombreArchivo)
  if (nombreArchivo) {
    var resultado = nombreArchivo.slice(
      ((nombreArchivo.lastIndexOf(".") - 1) >>> 0) + 2
    );
    // console.log("result>>>>>>>>>> ", `.${resultado}`)
    return `.${resultado.toLowerCase()}`;
  }
  return "";
}

var diasdelasemana = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];
var meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
var mesesShort = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function Money_to_float(money) {
  money = "" + money;
  money = money.replace(/,/g, "");
  money = parseFloat(money) || 0;
  return money;
}

function fechaFormatoClasico(fecha) {
  if (typeof fecha != "string") return "";
  var fechaTemp = "";
  if (fecha) {
    fechaTemp = fecha.split("-");
  } else {
    return fecha;
  }
  if (fechaTemp.length == 3) {
    return fechaTemp[2] + "-" + fechaTemp[1] + "-" + fechaTemp[0];
  } else {
    return fecha;
  }
}
function hexToRgb(hex) {
  if (hex == undefined || hex == "") {
    hex = "#000000";
  }
  hex = hex.replace("#", "");
  hex = hex.padStart(6, "0");
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return {
      r: 0,
      g: 0,
      b: 0,
      h: 0,
      s: 0,
      l: 0,
    };
  }

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = Math.round(360 * h);
  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  var respuesta = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    h,
    s,
    l,
  };
  return respuesta;
}

//Primer regex para convertir a numero y el segundo formatea a tipo money
const formatMoney = (valor) => {
  var parteDecimal = valor.split(".")[1];
  const segundaParte = () => {
    if (parteDecimal == undefined) {
      return "";
    } else if (parteDecimal == "") {
      return ".";
    } else {
      return "." + parteDecimal;
    }
  };
  valor = valor.split(".")[0];
  return (
    valor
      .replace(/[^0-9\.-]+/g, "")
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + segundaParte()
  );
};
function getDaysBetweenDates(fecha_inicio, fecha_final) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(fecha_inicio);
  const secondDate = new Date(fecha_final);
  var days = Math.round((firstDate - secondDate) / oneDay);
  return days || 0;
}
function fechaFormatoMesAnyo(dateString) {
  if (typeof dateString != "string") {
    return "";
  }
  var dateStringArray = dateString.split("-");
  return mesesShort[dateStringArray[1] - 1] + " - " + dateStringArray[0];
}
function stringToDateObject(dateString, dias = 0) {
  if (typeof dateString != "string") {
    return new Date();
  }
  var dateStringArray = dateString.split("-");
  var date = new Date(
    dateStringArray[0],
    dateStringArray[1] - 1,
    dateStringArray[2]
  );
  if (dias != 0) {
    date.setDate(date.getDate() + dias);
  }
  return date;
}
function DescargarArchivo(data) {
  if (confirm("Desea descargar el archivo?")) {
    const url = data;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", data, "target", "_blank");
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
  }
}
module.exports = {
  Redondea,
  PrimerDiaDelMesActual,
  FechaActual,
  ConvertFormatStringNumber,
  convertirFechaLetra,
  GeraColoresRandom,
  Extension,
  Redondea1,
  diasdelasemana,
  Redondea2,
  Money_to_float,
  meses,
  mesesShort,
  FechaActual2Meses,
  fechaFormatoClasico,
  hexToRgb,
  formatMoney,
  getDaysBetweenDates,
  fechaFormatoMesAnyo,
  stringToDateObject,
  RedondeaDecimales,
  DescargarArchivo,
};

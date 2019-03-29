// redondea a dos decimales
function Redondea(x) {
    return Number.parseFloat(x).toFixed(2);
}

// CALCULA LA FECHA ACTUAL
function FechaActual(){
    var fecha = new Date();
    
    var ano = fecha.getFullYear();
    var mes = fecha.getMonth()+1;
    var dia = fecha.getDate();
    
    if(dia < 10){
        dia = "0" + dia
    }
    if(mes < 10){
        mes = "0" + mes
    }

    return ano+ '-'+ mes +'-'+  dia
}

// CALCULA EL PRIMER DIA DEL MES ACTUAL
function PrimerDiaDelMesActual(){
    var date = new Date();
    var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
    primerDia = primerDia.getDate()
        
    var ano = date.getFullYear();
    var mesAct = date.getMonth()+1;
    
    if(primerDia < 10){
        primerDia = "0" + primerDia;
    }
    
    if(mesAct < 10){
        mesAct = `0${mesAct}` 
    }

    return  ano + '-'+mesAct +'-'+ primerDia
}

// convierte formato dinero a numero
function ConvertFormatStringNumber(datoString){
    // console.log('datoString', datoString)

    if(datoString !== "" && datoString !== -1  && datoString !==  NaN){
        return Number(datoString.replace(/[^0-9\.-]+/g,""));
    }else{
        return datoString
    }
    
}

module.exports = {
    Redondea,
    PrimerDiaDelMesActual,
    FechaActual,
    ConvertFormatStringNumber
} 
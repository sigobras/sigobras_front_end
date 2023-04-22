const titulos = [
    { 'nombre': "ID", 'value': 'id', 'readOnly': true },
    { 'nombre': "PROVINCIAS", 'value': 'provincias', 'readOnly': false },
    { 'nombre': "COORDINADORES 1ra", 'value': 'coordinadores_1ra', 'readOnly': false },
    { 'nombre': "COORDINADORES 2da", 'value': 'coordinadores_2da', 'readOnly': false },
    { 'nombre': "COORDINADORES 3ra", 'value': 'coordinadores_3ra', 'readOnly': false },
    { 'nombre': "N° GENERA", 'value': 'num_genera', 'readOnly': true },
    { 'nombre': "N°", 'value': 'num', 'readOnly': true },
    { 'nombre': "CUI", 'value': 'cui', 'readOnly': true },
    { 'nombre': "NOMBRE DEL PROYECTO", 'value': 'nombre_proyecto', 'readOnly': true },
    { 'nombre': "PROVINCIA", 'value': 'provincia', 'readOnly': true },
    { 'nombre': "SECTOR", 'value': 'sector', 'readOnly': true },
    { 'nombre': "NOMBRE", 'value': 'nombre', 'readOnly': true },
    { 'nombre': "PROFESION", 'value': 'profesion', 'readOnly': true },
    { 'nombre': "FECHA DE ASIGNACION", 'value': 'fecha_asignacion', 'readOnly': true },
    { 'nombre': "DNI", 'value': 'dni', 'readOnly': true },
    { 'nombre': "CELULAR", 'value': 'celular', 'readOnly': true },
    { 'nombre': "CORREO", 'value': 'correo', 'readOnly': true },
    { 'nombre': "CONDICION", 'value': 'condicion', 'readOnly': true },
    { 'nombre': "NOMBRE_1", 'value': 'nombre_1', 'readOnly': true },
    { 'nombre': "DNI_1", 'value': 'dni_1', 'readOnly': true },
    { 'nombre': "CELULAR_1", 'value': 'celular_1', 'readOnly': true },
    { 'nombre': "CORREO_1", 'value': 'correo_1', 'readOnly': true },
    { 'nombre': "CONDICION_1", 'value': 'condicion_1', 'readOnly': true },
    { 'nombre': "NOMBRE_2", 'value': 'nombre_2', 'readOnly': true },
    { 'nombre': "CELULAR_2", 'value': 'celular_2', 'readOnly': true },
    { 'nombre': "NOMBRE_3", 'value': 'nombre_3', 'readOnly': true },
    { 'nombre': "CELULAR_3", 'value': 'celular_3', 'readOnly': true },
    { 'nombre': "EXPEDIENTE", 'value': 'expediente', 'readOnly': true },
    { 'nombre': "PRESUPUESTO TOTAL", 'value': 'presupuesto_total', 'readOnly': true },
    { 'nombre': "ACUMUADO EJECUTADO (DEVENGADO ACUMULADO)", 'value': 'acumulado_ejecutado', 'readOnly': true },
    { 'nombre': "PIA 2023", 'value': 'pia_2023', 'readOnly': true },
    { 'nombre': "PIA", 'value': 'pia', 'readOnly': true },
    { 'nombre': "MODIF", 'value': 'modif', 'readOnly': true },
    { 'nombre': "PIM", 'value': 'pim', 'readOnly': true },
    { 'nombre': "TOTAL CERTIFICADO", 'value': 'total_certificado', 'readOnly': true },
    { 'nombre': "SALDO", 'value': 'saldo', 'readOnly': true },
    { 'nombre': "EXPEDIENTE_1", 'value': 'expediente_1', 'readOnly': true },
    { 'nombre': "AVANCE FISICO 1", 'value': 'avance_fisico_1', 'readOnly': true },
    { 'nombre': "AVANCE FINANCIERO 1", 'value': 'avance_financiero_1', 'readOnly': true },
    { 'nombre': "AVANCE FISICO 2", 'value': 'avance_fisico_2', 'readOnly': true },
    { 'nombre': "AVANCE FINANCIERO 2", 'value': 'avance_financiero_2', 'readOnly': true },
    { 'nombre': "PLAZO DE EJECUCION", 'value': 'plazo_ejecucion', 'readOnly': true },
    { 'nombre': "FECHA DE REINICIO DE OBRA", 'value': 'fecha_reinicio_obra', 'readOnly': true },
    { 'nombre': "AMPLIACIONES DE PLAZO TRAMITADAS", 'value': 'ampliaciones_plazo_tramitadas', 'readOnly': true },
    { 'nombre': "FECHA CULMINACION NUEVO", 'value': 'fecha_culminacion_nuevo', 'readOnly': true },
    { 'nombre': "DOUCMENTACION DE REINICIO DE OBRA", 'value': 'documentacion_reinicio_obra', 'readOnly': true },
    { 'nombre': "INFORME DE CORTE RESIDENTE SALIENTE", 'value': 'informe_corte_residente_saliente', 'readOnly': true },
    { 'nombre': "INFORME DE CORTE RESIDENTE ENTRANTE", 'value': 'informe_corte_residente_entrante', 'readOnly': true },
    { 'nombre': "ASIGNACION PRESUPUESTAL (CUADRO NECESIDADES)", 'value': 'asignacion_presupuestal', 'readOnly': true },
    { 'nombre': "MODIFICACION ANALITICO", 'value': 'modificacion_analitico', 'readOnly': true },
    { 'nombre': "MODIFICACION EXPEDIENTE TECNICO", 'value': 'modificacion_expediente_tecnico', 'readOnly': true },
    { 'nombre': "AMPLIACION PRESUPUESTAL", 'value': 'ampliacion_presupuestal', 'readOnly': true },
    { 'nombre': "PRESENTACION TAREOS", 'value': 'presentacion_tareos', 'readOnly': true },
    { 'nombre': "INFORME MENSUAL", 'value': 'informe_mensual', 'readOnly': true },
    { 'nombre': "MONTO PROCESO SELECCION SOLES", 'value': 'monto_proceso_seleccion_soles', 'readOnly': true },
    { 'nombre': "PROCESO DE SELECCIÓN CONVOCADOS ULTIMAHOR", 'value': 'proceso_seleccion_convocados_ultimahor', 'readOnly': true },
    { 'nombre': "MONTO ADQUISICION DIRECTA SOLES", 'value': 'monto_adquisicion_directa_soles', 'readOnly': true },
    { 'nombre': "MONTO TOTAL SOLES", 'value': 'monto_total_soles', 'readOnly': true },
    { 'nombre': "CONFORMIDAD BIENES", 'value': 'conformidad_bienes', 'readOnly': true },
    { 'nombre': "CONFORMIDAD SERVICIO", 'value': 'conformidad_servicio', 'readOnly': true },
    { 'nombre': "SEGUIMIENTO DE LAS OBRAS 27/02/2023", 'value': 'seguimiento_obras_2023_02_27', 'readOnly': true },
    { 'nombre': "SEGUIMIENTO DE LAS OBRAS 06/03/2023", 'value': 'seguimiento_obras_2023_03_06', 'readOnly': true },
    { 'nombre': "SEGUIMIENTO DE LAS OBRAS 13/03/2023", 'value': 'seguimiento_obras_2023_03_13', 'readOnly': true },
    { 'nombre': "EXPLICAR PROBLEMÁTICA PORQUE NO REINICIA LA OBRA Y PORQUE NO HIZO REQUERIMIENTOS", 'value': 'problematica_reinicio_obra', 'readOnly': true },
    { 'nombre': "CEMENTO", 'value': 'cemento', 'readOnly': true },
    { 'nombre': "CANTIDAD CEMENTO", 'value': 'cantidad_cemento', 'readOnly': true },
    { 'nombre': "FECHA VENCIMIENTO", 'value': 'fecha_vencimiento_cemento', 'readOnly': true },
    { 'nombre': "CANTIDAD VENCIDOS", 'value': 'cantidad_vencidos_cemento', 'readOnly': true },
    { 'nombre': "FECHA VENCIMIENTO_1", 'value': 'fecha_vencimiento_cemento_1', 'readOnly': true },
    { 'nombre': "TOTAL CEMENTO", 'value': 'total_cemento', 'readOnly': true },
    { 'nombre': "OBSERVACIONES", 'value': 'observaciones', 'readOnly': true },
    { 'nombre': "ESTADO", 'value': 'estado', 'readOnly': true },
    { 'nombre': "LINEA DE BASE – EJECUCIÓN FISICA – ACTUAL (ENERO 2)", 'value': 'linea_base_ejecucion_fisica_actual_enero_2', 'readOnly': true },
    { 'nombre': "AVANCE FISICO %", 'value': 'avance_fisico_porcentaje', 'readOnly': true },
    { 'nombre': "RESTRICCIONES PARA NO LLEGAR AL 100%", 'value': 'restricciones_para_no_llegar_al_100', 'readOnly': true },
  ];

  export  default titulos
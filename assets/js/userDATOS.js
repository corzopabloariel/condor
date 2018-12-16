/**
 * Variable para la traducción de DATATABLE
 */
const translate_spanish = {
  buttons: {
    pageLength: {
        _: "%d filas",
        '-1': "Todo"
      }
    },
    "sLengthMenu":     "_MENU_",
    "lengthMenu":     "_MENU_",

    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "_START_ de _END_ - _TOTAL_ registros",
    "info":            "_START_ de _END_ - _TOTAL_ registros",
    "sInfoEmpty":      "Sin registros",
    "infoEmpty":       "Sin registros disponibles","infoFiltered":   "(filtrado de _MAX_ registros)",
    "sInfoFiltered":   "(total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscador: ",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "<<",
        "sLast":     ">>",
        "sNext":     ">",
        "sPrevious": "<"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    },

    "loadingRecords":   "Cargando...",
    "processing":     "Procesando...",
    "search": "",
    "zeroRecords":    "No se encontraron registros",
    "paginate": {
      "next":     "Siguiente",
      "previous":   "Anterior"
    },
    "select": {
    //"rows": { _: "%d filas seleccionadas", 0: "", 1: "1 fila seleccionada" }
    "rows": { _: "%d filas seleccionadas", 0: "", 1: "" }
  },
};

let userDATOS = {};
// <BASICO> //
/**
 * Función que usa la api Lobibox
 *@param mensaje STRING: texto que aparece en la notificación
 *@param tipo STRING: permite cambiar el color a la notificación
 *@param dlay BOOL: flag para mostrar el indicador de demora
 */
userDATOS.notificacion = function (mensaje,tipo = 'info',dlay = true){
  // Available types 'warning', 'info', 'success', 'error'
  Lobibox.notify(tipo, {
    size: 'mini',
    icon: false,
    delayIndicator: dlay,
    msg: mensaje,
    sound: false
  });
};
/**
 * Función que usa la api Messagebox
 * @param msg STRING: texto que aparece en el cuadro
 * @param done FUNCTION: función que ejecuta si respuesta es afirmativa
 * @param fail FUNCTION: función que ejecuta si respuesta es negativa
 */
userDATOS.messagebox = function(msg, done, fail) {
  $.MessageBox({
		buttonDone  : "Si",
		buttonFail  : "No",
		message   : msg
	}).done(done).fail(fail);
}
/**
 * Valida el formulario con elemento required y visible
 * @param t STRING: elemento donde se busca la info
 */
userDATOS.validar = function(t) {
  let flag = 1;
  $(t).find('*[required="true"]').each(function(){
    if($(this).is(":visible")) {
      if($(this).is(":invalid") || $(this).val() == "") {
        flag = 0;
        $(this).addClass("has-error");
      }
    }
  });
  console.log(flag);
  return flag;
};
// </BASICO> //
/**
 * Función que dibuja una tabla. Usa la api datatable
 * @param target STRING: lugar del dom donde se agrega la tabla
 * @param pyrus PYRUS: elemento de clase PYRUS
 * @param nombre STRING: nombre / ID que va a tomar la tabla
 */
userDATOS.datatable = function(target,pyrus,nombre = "tabla_1") {
  let columnDefs = pyrus.order;
  let columns = pyrus.columnaDT;
  let data = { "entidad": pyrus.entidad, "especificacion": pyrus.especificacion, "entidades": ENTIDAD };
  columns.push({"title":"ACCIÓN"})
  columnDefs.push({
            "targets": -1,
            "className": "text-center",
            "width": "20%",
            "data": null,
            "defaultContent": "<i title='Ver registro' onclick='userDATOS.see(this)' class='text-muted cursor-pointer far fa-eye mr-2'></i>" +
                              "<i title='Eliminar registro' onclick='userDATOS.delete(this,1)' class='text-muted cursor-pointer fas fa-times'></i>"
        });
  window[nombre] = $(target).DataTable({
    "processing": true,
    "pageLength": 10,
    "serverSide": true,
    "paging": true,
    "ajax": {
      "method": "POST",
      "url":"lib/datatable.php",
      "data": data,
    },
    "columns": columns,
    "columnDefs": columnDefs,
		"select": false,
		"destroy": true,
		// "order": [[ 1, "desc" ]],
		"searching": false,
    "ordering": false,
    "responsive": true,
		"sDom": "<'row '"+
					"<'col col-12 col-sm-6 d-flex justify-content-start __lenght_buttons'lB>"+
					"<'col col-12 col-sm-6'f>r>"+
					"<'table-scrollable table-noticia't>"+
				"<'row'"+
					"<'col col-12 col-sm-6 d-flex justify-content-start align-items-center'i>"+
					"<'col col-12 col-sm-6 d-flex justify-content-end align-items-center __paginate'p>>",
		"scrollX":true,
    //"scrollY":false,
		"lengthMenu": [[10, 25, 50], [10, 25, 50]],
    "buttons": [],
		"language": translate_spanish
	});
  window[nombre].buttons().container().appendTo( $('.col-sm-6:eq(0)', window[nombre].table().container() ) );

  return window[nombre];
};

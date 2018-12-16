let app = angular.module('condor-app',[,'ngRoute','ngSanitize']);
/**
 * ROUTE del APP de angular
 */
app.config( function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'assets/views/index.html',
    controller : 'index'
  })
  .when('/proveedores', {
    templateUrl: 'assets/views/proveedor.html',
    controller : 'proveedor'
  })
});
/**
 * Controller que se dispara cuando se inicia la APP
 */
app.controller('jsonController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
}]);
/**
 *
 */
app.controller("index", function ($scope) {
  $(".menu a").removeClass("active");
  $(".menu a[href='#!']").addClass("active");
  let neumatico = new Pyrus("neumatico");
  let neumatico_km = new Pyrus("neumatico_km");
  let neumatico_costo = new Pyrus("neumatico_costo");
  let neumatico_dibujo = new Pyrus("neumatico_dibujo");
  let datatable = userDATOS.datatable("#tabla",neumatico);
  /**
   * Función para mostrar un elemento. Antes de desplegar el modal, busca los datos necesarios
   * @param t elemento que dispara la función
   */
  userDATOS.see = function(t) {
    window.neumatico = {};
    let data = datatable.row( $(t).closest('tr') ).data();
    aux = neumatico.search(data.id);
    km = neumatico_km.search(data.id,"id_neumatico");
    costo = neumatico_costo.search(data.id,"id_neumatico");
    dibujo = neumatico_dibujo.search(data.id,"id_neumatico");
    window.neumatico["km"] = km;
    window.neumatico["costo"] = costo;
    window.neumatico["dibujo"] = dibujo;
    userDATOS.modal(neumatico,aux);
  };
  /**
   * Función para cerrar el modal. Activa el BTN que lo disparo
   */
  userDATOS.close = function() {
    $("#add").removeAttr("disabled");
    $("#elemento,#pantalla").addClass("d-none");
    $("#elemento").find("> div").html("");
  };
  /**
   * Función para la baja de un elemento específico.
   * @param pyrus elemento CLASS PYRUS de una entidad
   * @param id entero a buscar
   * @param column donde buscar el ID
   */
  userDATOS.baja = function(pyrus,id,column) {
    aux = pyrus.search(id,column);
    pyrus.query("baja_generica",{"entidad": pyrus.entidad, "id": aux.id}, function(m) {});
  };
  /**
   * Función para guardar un elemento. Verifica ciertos aspectos y genera el OBJ para enviar a la BD
   * @param t elemento que dispara la función
   */
  userDATOS.save = function(t) {
    if(userDATOS.validar($(t).closest("form"))) {
      let ARR_form = $( $(t).closest("form") ).serializeArray();
      let OBJ_form = {};
      let OBJ_new = neumatico.elemento;

      for(var i in ARR_form)
        OBJ_form[ARR_form[i]["name"]] = ARR_form[i]["value"];
      for(var i in OBJ_new) {
        if(OBJ_form["frm_" + i] === undefined) continue;
        if(i == "id" && OBJ_form["frm_" + i] != "") {
          OBJ_new[i] = OBJ_form["frm_" + i];
          delete OBJ_new["estado"];
          delete OBJ_new["did"];
        }
        if(i != "id") OBJ_new[i] = OBJ_form["frm_" + i];
      }
      console.log(OBJ_new);
      data = neumatico.guardar_1(OBJ_new);
      if(data > 0) {
        if(window.neumatico === undefined) {
          n = neumatico.search(data);
          OBJ_new = neumatico_km.elemento;
          OBJ_new["did"] = n.did;
          OBJ_new["id_neumatico"] = data;
          OBJ_new["km"] = OBJ_form["frm_km"];
          neumatico_km.guardar_1(OBJ_new);
          OBJ_new = neumatico_costo.elemento;
          OBJ_new["did"] = n.did;
          OBJ_new["id_neumatico"] = data;
          OBJ_new["costo"] = OBJ_form["frm_costo"];
          neumatico_costo.guardar_1(OBJ_new);
          OBJ_new = neumatico_dibujo.elemento;
          OBJ_new["did"] = n.did;
          OBJ_new["id_neumatico"] = data;
          OBJ_new["profundidad"] = OBJ_form["frm_dibujo"];
          neumatico_dibujo.guardar_1(OBJ_new);
          userDATOS.notificacion("Dato agregado","success");
        } else {
          OBJ_new = {}
          OBJ_new["id"] = window.neumatico.km.id;
          OBJ_new["km"] = OBJ_form["frm_km"];
          neumatico_km.guardar_1(OBJ_new);
          OBJ_new = {}
          OBJ_new["id"] = window.neumatico.costo.id;
          OBJ_new["costo"] = OBJ_form["frm_costo"];
          neumatico_costo.guardar_1(OBJ_new);
          OBJ_new = {}
          OBJ_new["id"] = window.neumatico.dibujo.id;
          OBJ_new["profundidad"] = OBJ_form["frm_dibujo"];
          neumatico_dibujo.guardar_1(OBJ_new);
          userDATOS.notificacion("Dato editado","success");

          window.neumatico = undefined;
        }
        userDATOS.close();
        datatable.draw();
      } else userDATOS.notificacion("Datos repetidos");
    } else
      userDATOS.notificacion("Faltan datos","error");
  };
  /**
   * Función para la baja desde la vista
   * @param t elemento que dispara la función
   * @param is_datatable flag para verificar si el elemento viene de DATATABLE - tiene reación distinta
   */
  userDATOS.delete = function(t, is_datatable = 0) {
    if(is_datatable) {
      let data = datatable.row( $(t).closest('tr') ).data();
      userDATOS.messagebox("¿Está seguro de eliminar el registro?",function() {
        neumatico.query("baja_generica",{"entidad": neumatico.entidad, "id": data.id}, function(m) {
          userDATOS.baja(neumatico_km,data.id,"id_neumatico");
          userDATOS.baja(neumatico_costo,data.id,"id_neumatico");
          userDATOS.baja(neumatico_dibujo,data.id,"id_neumatico");

          datatable.row( $(t).closest('tr') ).remove().draw();
        });
      }, function() {});
    } else {
      let id = $(t).closest("form").find("input[name='frm_id']").val();
      if(id == "") userDATOS.close();
      else {
        userDATOS.messagebox("¿Está seguro de eliminar el registro?",function() {
          neumatico.query("baja_generica",{"entidad": neumatico.entidad, "id": id}, function(m) {
            userDATOS.baja(neumatico_km,id,"id_neumatico");
            userDATOS.baja(neumatico_costo,id,"id_neumatico");
            userDATOS.baja(neumatico_dibujo,id,"id_neumatico");

            datatable.row( $(t).closest('tr') ).remove().draw();
          });
        }, function() {});
      }
    }
  };
  /**
   * Función para mostrar el modal. Genera el formulario automáticamente y lo agrega al DOM
   * @param pyrus elemento CLASS PYRUS de una entidad
   * @param data OBJECT objeto con información de un elemento a mostrar
   */
  userDATOS.modal = function(pyrus, data = null) {
    formulario = pyrus.formulario_OK();
    html = "<p class='m-0' style='padding-bottom:10px;'>Neumático</p>";
    html += "<form name='frm'>";
      html += "<table class='table table-striped w-100'>";
        html += "<thead>";
          for(var i in formulario) {
            if(i == "id") continue;
            if(pyrus.especificacion[i]["VISIBILIDAD"] === "TP_INVISIBLE") continue;
            txt = i;
            if(pyrus.especificacion[i]["NOMBRE"] !== undefined) txt = pyrus.especificacion[i]["NOMBRE"];
            html += "<th>" + txt.toUpperCase() + "</th>";
          }
        html += "</thead>";
        html += "<tbody>";
          html += "<tr>";
          for(var i in formulario) {
            if(i == "id" || pyrus.especificacion[i]["VISIBILIDAD"] === "TP_INVISIBLE") html += formulario[i];
            else html += "<td>" + formulario[i] + "</td>";
          }
          html += "</tr>";
        html += "</tbody>";
      html += "</table>";

      html += "<table class='table table-striped w-100 mt-3'>";
        html += "<thead>";
          html += "<th>KILOMETRAJE</th>";
          html += "<th>COSTO</th>";
          html += "<th>PROF. DIBUJO</th>";
        html += "</thead>";
        html += "<tbody>";
          html += "<tr>";
            html += "<td>";
              html += "<input required='true' ng-name='frm_km' name='frm_km' id='frm_km' class='form-control texto-numero text-right' type='text' placeholder='KILOMETRAJE'>";
            html += "</td>";
            html += "<td>";
              html += "<input required='true' ng-name='frm_costo' name='frm_costo' id='frm_costo' class='form-control texto-numero text-right' type='text' placeholder='COSTO'>";
            html += "</td>";
            html += "<td>";
              html += "<input required='true' ng-name='frm_dibujo' name='frm_dibujo' id='frm_dibujo' class='form-control texto-numero text-right' type='text' placeholder='PROF. DIBUJO'>";
            html += "</td>";
          html += "</tr>";
        html += "</tbody>";
      html += "</table>";

      html += "<div class='row font_size-1_50'>";
        html += "<div class='col-6'><button type='button' onclick='userDATOS.save(this)' class='btn btn-block'><i class='fas fa-save mr-2'></i><span class='text-uppercase'>guardar</span></button></div>";
        html += "<div class='col-6'><button type='button' onclick='userDATOS.delete(this)' class='btn btn-block btn-danger'><i class='fas fa-times mr-2'></i><span class='text-uppercase'>" + (data === null ? "cancelar" : "eliminar") + "</span></button><div>";
      html += "</div>";
    html += "</form>";
    $("#elemento").find("> div").html("<div class='card-body'></div>");
    $("#elemento").find("> div").find("> div").html(html);
    if(data === null) $("#elemento,#pantalla").removeClass("d-none");
    else {
      for(var i in data) {
        if(!$("#elemento").find("*[name='frm_" + i + "']").length) continue;
        $("#elemento").find("*[name='frm_" + i + "']").val(data[i]).trigger("change");
      }
      $("#elemento").find("*[name='frm_km']").val(window.neumatico.km.km);
      $("#elemento").find("*[name='frm_costo']").val(window.neumatico.costo.costo);
      $("#elemento").find("*[name='frm_dibujo']").val(window.neumatico.dibujo.profundidad);
      $("#elemento,#pantalla").removeClass("d-none");
    }
    $("#elemento").find(".select__2").select2();
  };
  /**
   * Función para mostrar el modal de BOOTSTRAP
   */
  userDATOS.modalBootstrap = function(target) {
    $(target).modal()
  };
  /**
   * Evento CLICK de un BTN dispara la función modal y desactiva el mismo
   */
  $("#add").click(function() {
    $(this).attr("disabled",true);
    userDATOS.modal(neumatico);
  });
});
/**
 *
 */
app.controller("proveedor", function ($scope) {
  $(".menu a").removeClass("active");
  $(".menu a[href='#!proveedores']").addClass("active");
  let proveedor = new Pyrus("proveedor");
  let datatable = userDATOS.datatable("#tabla",proveedor);
  /**
   * Función para mostrar un elemento. Antes de desplegar el modal, busca los datos necesarios
   * @param t elemento que dispara la función
   */
  userDATOS.see = function(t) {
    let data = datatable.row( $(t).closest('tr') ).data();
    userDATOS.modal(proveedor,data);
  };
  /**
   * Función para cerrar el modal. Activa el BTN que lo disparo
   */
  userDATOS.close = function() {
    $("#add").removeAttr("disabled");
    $("#elemento,#pantalla").addClass("d-none");
    $("#elemento").find("> div").html("");
  };
  /**
   * Función para guardar un elemento. Verifica ciertos aspectos y genera el OBJ para enviar a la BD
   * @param t elemento que dispara la función
   */
  userDATOS.save = function(t) {
   if(userDATOS.validar($(t).closest("tr"))) {
     let ARR_form = $( $(t).closest("form") ).serializeArray();
     let OBJ_form = {};
     let OBJ_new = proveedor.elemento;

     for(var i in ARR_form)
       OBJ_form[ARR_form[i]["name"]] = ARR_form[i]["value"];
     for(var i in OBJ_new) {
       if(OBJ_form["frm_" + i] === undefined) continue;
       if(i == "id" && OBJ_form["frm_" + i] != "") {
         OBJ_new[i] = OBJ_form["frm_" + i];
       }
       if(i != "id") OBJ_new[i] = OBJ_form["frm_" + i];
     }
     if(proveedor.guardar_1(OBJ_new) > 0) {
       userDATOS.notificacion("Dato agregado","success");
       userDATOS.close();
       datatable.draw();
     } else userDATOS.notificacion("Datos repetidos");
   } else
     userDATOS.notificacion("Faltan datos","error");
  };
  /**
   * Función para la baja desde la vista
   * @param t elemento que dispara la función
   * @param is_datatable flag para verificar si el elemento viene de DATATABLE - tiene reación distinta
   */
  userDATOS.delete = function(t, is_datatable = 0) {
   if(is_datatable) {
     let data = datatable.row( $(t).closest('tr') ).data();
     userDATOS.messagebox("¿Está seguro de eliminar el registro?",function() {
       proveedor.query("baja_generica",{"entidad": proveedor.entidad, "id": data.id}, function(m) {
         datatable.row( $(t).closest('tr') ).remove().draw();
       });
     }, function() {});
   } else {
     let id = $(t).closest("form").find("input[name='frm_id']").val();
     if(id == "") userDATOS.close();
     else {
       userDATOS.messagebox("¿Está seguro de eliminar el registro?",function() {
         proveedor.query("baja_generica",{"entidad": proveedor.entidad, "id": id}, function(m) {
           datatable.row( $(t).closest('tr') ).remove().draw();
           userDATOS.close();
         });
       }, function() {});
     }
   }
  };
  /**
   * Función para mostrar el modal. Genera el formulario automáticamente y lo agrega al DOM
   * @param pyrus elemento CLASS PYRUS de una entidad
   * @param data OBJECT objeto con información de un elemento a mostrar
   */
  userDATOS.modal = function(pyrus, data = null) {
    formulario = pyrus.formulario_OK();
    html = "<p class='m-0' style='padding-bottom:10px;'>Proveedor</p>";
    html += "<form name='frm'>";
      html += "<table class='table table-striped w-100'>";
        html += "<thead>";
        for(var i in formulario) {
          if(i == "id") continue;
          if(pyrus.especificacion[i]["VISIBILIDAD"] === "TP_INVISIBLE") continue;
          txt = i;
          if(pyrus.especificacion[i]["NOMBRE"] !== undefined) txt = pyrus.especificacion[i]["NOMBRE"];
          html += "<th>" + txt.toUpperCase() + "</th>";
        }
        html += "</thead>";
        html += "<tbody>";
          html += "<tr>";
          for(var i in formulario) {
            if(i == "id") html += formulario[i];
            else html += "<td>" + formulario[i] + "</td>";
          }
          html += "</tr>";
        html += "</tbody>";
      html += "</table>";


      html += "<div class='row font_size-1_50'>";
        html += "<div class='col-6'><button type='button' onclick='userDATOS.save(this)' class='btn btn-block'><i class='fas fa-save mr-2'></i><span class='text-uppercase'>guardar</span></button></div>";
        html += "<div class='col-6'><button type='button' onclick='userDATOS.delete(this)' class='btn btn-block btn-danger'><i class='fas fa-times mr-2'></i><span class='text-uppercase'>" + (data === null ? "cancelar" : "eliminar") + "</span></button><div>";
      html += "</div>";
    html += "</form>";
    $("#elemento").find("> div").html("<div class='card-body'></div>");
    $("#elemento").find("> div").find("> div").html(html);
    if(data === null) $("#elemento,#pantalla").removeClass("d-none");
    else {
      $("#elemento").find("*[name='frm_id']").val(data["id"]);
      for(var x in pyrus.columna) {
        if(data[pyrus.columna[x]] === undefined) continue;
        if(!$("#elemento").find("*[name='frm_" + pyrus.columna[x] + "']").length) continue;
        $("#elemento").find("*[name='frm_" + pyrus.columna[x] + "']").val(data[pyrus.columna[x]]);
      }
      $("#elemento,#pantalla").removeClass("d-none");
    }
  };
  /**
   * Evento CLICK de un BTN dispara la función modal y desactiva el mismo
   */
  $("#add").on("click",function() {
    $(this).attr("disabled",true);
    userDATOS.modal(proveedor);
  });
});

$(document).ready(function() {
  $("body").on("focus",".has-error",function() {
    $(this).removeClass("has-error");
  });
})

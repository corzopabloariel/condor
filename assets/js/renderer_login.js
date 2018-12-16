userDATOS.submit = function(t) {
  if(!userDATOS.validar(t)) {
    userDATOS.notificacion("Faltan datos","error");
    return false;
  }
  // ---------- //
  let usuario = new Pyrus("usuario");
  let OBJ_data = {};
  let aux = $( t ).serializeArray();
  for(var i in aux)
    OBJ_data[aux[i]["name"]] = aux[i]["value"];
  let data = usuario.search(OBJ_data.frm_user,"user");
  // ---------- //
  if(data === null) {
    userDATOS.notificacion("Datos incorrectos","error");
    return false;
  }
  // ---------- //
  if(data.user === OBJ_data.frm_user && data.pass === md5(OBJ_data.frm_pass)) {
    usuario.query( 'NS_login',
      {'dato':data,'access':true },
      function(m){ $("#div").removeClass("d-none"); window.location = 'principal.html'; },
      function(m){ console.log(m) });
  } else {
    userDATOS.notificacion("Datos incorrectos","error");
    return false;
  }
};

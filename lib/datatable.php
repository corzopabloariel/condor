<?php
/**
 * Este documente es para el uso de la api datatable
 */
session_start();
require_once 'config.php';
require_once 'ext/rb.php';

// Se incializa REDBEANS y MYSQLI por si las dudas
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
$mysqli->set_charset('utf8');
$params = $_REQUEST;//Variables que recibe el archivo del SCRIPT DATATABLE
$recordsTotal = $recordsFiltered = 0;//Cantidades de registros
$entidades = $params["entidades"];//ENTIDADES DEL SISTEMA
$especificacion = $params["especificacion"];//ENTIDAD
$entidad = $params["entidad"];//ENTIDAD A MOSTRAR EN TABLA
$data = [];//ARRAY de registros a mostrar
$ARR_relacion = get_especificacion($especificacion);//GUARDO LOS DATOS QUE SE RELACIONAN CON LA ENTIDAD

$flag = 1;//Cambia si la entidad a mostrar tiene elementos relacionados
if(count($ARR_relacion) > 0) $flag = 0;

$ARR_relacion = get_resultado($ARR_relacion);

$d = R::findAll($entidad,"elim = 0");
$recordsTotal = $recordsFiltered = R::count($entidad,"elim = 0");
if($flag) {
  foreach($d AS $n)
    $data[] = $n;
} else {
  foreach($d AS $n) {
    foreach ($ARR_relacion as $k => $v)
      $n[$k] = $v["RESULTADO"][$n[$k]];
    $data[] = $n;
  }
}

$json_data = array(
	"draw"            => intval( $params['draw'] ),
	"recordsTotal"    => intval( $recordsTotal ),//// en Vista
	"recordsFiltered" => intval( $recordsFiltered ),// en Total
	"data"            => $data
);

echo json_encode($json_data);

/**
 * Función que devuelve un string de una relación
 * Puede ser una función recursiva (por si las dudas)
 */
function relacion($data, $column, $value) {
  global $entidades;
  $data = get_resultado($data);
  return $data[$column]["RESULTADO"][$value];
}
/**
 * Función que devuelve las especificaciones con los valores de una entidad
 * @param Array $especificacion
 * @return Array
 */
function get_especificacion($especificacion) {
  global $entidades;
  $ARR_relacion = [];
  foreach ($especificacion AS $k => $v) {
    if($v["TIPO"] == "TP_RELACION") {
      $ARR_relacion[$k] = [];
      $ARR_relacion[$k]["ENTIDAD"] = $v["RELACION"]["TABLA"];
      $ARR_relacion[$k]["RED"] = R::findAll($v["RELACION"]["TABLA"],"elim = 0");//TOMO LOS DATOS DE LA TABLA RELACIONADA
      $ARR_relacion[$k]["ATTR"] = $v["RELACION"]["ATTR"];
      $ARR_relacion[$k]["FORMATO"] = $entidades[$v["RELACION"]["TABLA"]]["VISIBLE"]["TEXTO"];
      $ARR_relacion[$k]["FORMATO_ATTR"] = $entidades[$v["RELACION"]["TABLA"]]["VISIBLE"]["ATTR"];
    }
  }
  return $ARR_relacion;
}
/**
 * Función que devuelve los registros de una entidad con el formato deseado
 * @param Array $ARR_relacion
 * @return Array
 */
function get_resultado($ARR_relacion) {
  global $entidades;
  foreach ($ARR_relacion as $k => $v) {
    $ARR_relacion[$k]["RESULTADO"] = [];

    foreach ($v["RED"] as $R) {
      $str = $v["FORMATO"];
      for($i = 0; $i < count($v["FORMATO_ATTR"]); $i++) {
        $aux = get_especificacion($entidades[$v["ENTIDAD"]]["ATRIBUTOS"]);
        $value = $R[$v["FORMATO_ATTR"][$i]];
        if(count($aux) == 0) $str = str_replace("/{$v["FORMATO_ATTR"][$i]}/",$value,$str);
        else {
          if(isset($aux[$v["FORMATO_ATTR"][$i]]))
            $str = str_replace("/{$v["FORMATO_ATTR"][$i]}/",relacion($aux,$v["FORMATO_ATTR"][$i],$value),$str);
          else
            $str = str_replace("/{$v["FORMATO_ATTR"][$i]}/",$value,$str);
        }
      }
      $ARR_relacion[$k]["RESULTADO"][$R["id"]] = $str;
    }
  }
  return $ARR_relacion;
}
?>

/**********************************************
 * VISTA O VISIBILIDAD
 **********************************************/
/**
 * TP_VISIBLE_NUNCA
 * Declara que todos los elementos se agregan a las tablas,
 * pero se ocultan en las formularios
 **
 * TP_VISIBLE
 * Declara que todos los elementos son visibles,
 * tanto en la vista como en formularios con el formato adecuado
 **
 * TP_OCULTO
 * Declara que todos los elementos son ocultos en tablas,
 * en los formularios son visibles
 **
 * TP_INVISIBLE
 * Declara que todos los elemetos no son agregados en la vista,
 * en formularios aparecen como "hidden".
 **
 * TP_BANDERA
 * Declara que todos los elementos son ocultos en formulario,
 * y tablas. Son para elementos que cambian de estado
 */
/**********************************************
 * TIPOS
 **********************************************/
/**
 * TP_PK
 * Declara valores enteros, correspondiente a PK
 **
 * TP_ENTERO
 * Declara valores numéricos
 **
 * TP_STRING
 * Declara valores alfanuméricos, se representa con INPUT
 **
 * TP_DOUBLE
 **
 * TP_FLOAT
 **
 * TP_TEXT
 * Declara valores alfanuméricos, se representa con TEXTAREA
 **
 * TP_FECHA_LARGA
 * Declara valores de fecha larga
 **
 * TP_RELACION
 * Declara valores enteros, corresponde a FK
 * Relaciones con otras tablas
 **
 * TP_PASSWORD
 * Declara valores alfanuméricos para elementos tipo PASSWORD
 **
 * TP_BOLEANO
 * Declara valor entero - 1 o 0
 */
const url_query_local = "lib/query.php";

const ENTIDAD = {
  'neumatico': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'did': {
        'TIPO': 'TP_ENTERO',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 0
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'numero': {
        'TIPO': 'TP_ENTERO',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 0,
        'NOMBRE': 'número',
        'ALIGN': 'text-right'
      },
      'modelo': {
        'TIPO': 'TP_STRING',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'ALIGN': 'text-center'
      },
      'id_medida': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'medida',
        'RELACION': {'TABLA':'medida','ATTR':'id'}
      },
      'id_proveedor': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'proveedor',
        'RELACION': {'TABLA':'proveedor','ATTR':'id'}
      },
      'estado': {
        'TIPO': 'TP_OPCIONES',
        'VISIBILIDAD': 'TP_VISIBLE_NUNCA',
        'NECESARIO': 0,
        'ALIGN': 'text-center',
        'DEFAULT': 'NUEVO'
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    },
    'UNIQUE':	['numero','modelo','id_medida'],
 	  'GUARDADO_ATTR': {'id':{'TIPO':'normal'},'did':{'TIPO':'normal'},'numero':{'TIPO':'normal'},'modelo':{'TIPO':'normal'},'id_medida':{'TIPO':'normal'},'id_proveedor':{'TIPO':'normal'}},
    'FORM': [
			 {'id':'/id/'},
       {'numero': '<div class="col col-12">/numero/</div>'},
       {'modelo': '<div class="col col-12">/modelo/</div>'},
       {'id_medida': '<div class="col col-12">/id_medida/</div>'},
       {'id_proveedor': '<div class="col col-12">/id_proveedor/</div>'}
	  ]
  },
  'neumatico_km': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'did': {
        'TIPO': 'TP_ENTERO',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 0
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'id_neumatico': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'neumático',
        'RELACION': {'TABLA':'marca','ATTR':'id'}
      },
      'km': {
        'TIPO': 'TP_DOUBLE',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    }
  },
  'neumatico_costo': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'did': {
        'TIPO': 'TP_ENTERO',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 0
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'id_neumatico': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'neumático',
        'RELACION': {'TABLA':'marca','ATTR':'id'}
      },
      'costo': {
        'TIPO': 'TP_FLOAT',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    }
  },
  'neumatico_dibujo': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'did': {
        'TIPO': 'TP_ENTERO',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 0
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'id_neumatico': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'neumático',
        'RELACION': {'TABLA':'marca','ATTR':'id'}
      },
      'profundidad': {
        'TIPO': 'TP_FLOAT',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    }
  },
  //---- ----//
  'medida': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'id_marca': {
        'TIPO': 'TP_RELACION',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1,
        'NOMBRE': 'marca',
        'RELACION': {'TABLA':'marca','ATTR':'id'}
      },
      'valor': {
        'TIPO': 'TP_STRING',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    },
    'VISIBLE': {"TEXTO": "/id_marca/, /valor/","ATTR":["id_marca","valor"]},
  },
  'marca': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'nombre': {
        'TIPO': 'TP_STRING',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    },
    'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
  },
  'proveedor': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'nombre': {
        'TIPO': 'TP_STRING',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NECESARIO': 1
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    },
    'VISIBLE': {"TEXTO": "/nombre/","ATTR":["nombre"]},
    'UNIQUE':	['nombre'],
 	  'GUARDADO_ATTR': {'id':{'TIPO':'normal'},'nombre':{'TIPO':'normal'}},
    'FORM': [
			 {'id':'/id/'},
       {'nombre': '<div class="col col-12">/nombre/</div>'}
	  ]
  },
  'usuario': {
    'ATRIBUTOS': {
      'id': {
        'TIPO': 'TP_PK',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0,
        'DEFAULT': 'nulo'
      },
      'autofecha': {
        'TIPO': 'TP_FECHA_LARGA',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0
      },
      'user': {
        'TIPO': 'TP_STRING',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NOMBRE': 'usuario',
        'NECESARIO': 1
      },
      'pass': {
        'TIPO': 'TP_PASSWORD',
        'VISIBILIDAD': 'TP_VISIBLE',
        'NOMBRE': 'clave',
        'NECESARIO': 1
      },
      'nivel': {
        'TIPO': 'TP_ENTERO',
        'VISIBILIDAD': 'TP_INVISIBLE',
        'NECESARIO': 0
      },
      'elim': {
        'TIPO': 'TP_BOLEANO',
        'VISIBILIDAD': 'TP_BANDERA',
        'NECESARIO': 0,
        'DEFAULT': 0
      }
    }
  }
};

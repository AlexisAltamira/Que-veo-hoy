var con = require('../lib/conexionbd');

var anio = "anio";
var titulo = "titulo";
var genero = "genero_id";

//En caso de un error se devuelve esta función en cada consulta
function errores (data, res) {
    if (data) {
        console.log("Hubo un error en la consulta", data.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
}

//Devuelve el resultado de la busqueda dependiendo los paramotrs que recibe como req.
function listaPeliculas(req, res) {
var sql = "select * from pelicula where id=id";
var sql1 = "select count(*) as total from pelicula where id=id";
var response = {
    'peliculas': "",
    'total': cantidad
}
var orden = req.query.columna_orden;
var tipo = req.query.tipo_orden;
var cantidad = req.query.cantidad;
var pagina = (req.query.pagina -1)*cantidad;

   

    if (req.query.anio) {
        anio = req.query.anio;
        sql = sql + " and anio =" +anio;
        sql1 = sql1 + " and anio =" +anio;
    }

    if (req.query.titulo) {
        titulo = req.query.titulo;
        sql = sql + ' and titulo like "%'+titulo +'%"';
        sql1 = sql1 + ' and titulo like "%'+titulo +'%"';
    }

    if (req.query.genero) {
        genero = req.query.genero;
        sql = sql +  " and genero_id =" +genero;
        sql1 = sql1 +  " and genero_id =" +genero;
    }

sql = sql + " order by " +orden +" "+tipo + " limit "+ pagina + ","+ cantidad;
    
//Se realiza consulta de todas las peliculas y sus filtros
con.query(sql, function(error, resultado, fields) {
        errores(error, res);
        response.peliculas = resultado;

//Se realiza una nueva consulta para la paginacion
        con.query(sql1, function(error, resultado1,fields){
            errores(error, res);
            response.total = resultado1[0].total;
            res.send(JSON.stringify(response));
        });
       
    });
};

//lista todos los generos disponibles
function listaGeneros(req, res) {
    var sqlGen = "select * from genero"
    con.query(sqlGen, function(error, resultado, fields) {
        errores(error, res);
        var response = {
            'generos': resultado
        };

        res.send(JSON.stringify(response));
    });
};

//Devuelve el listado de peliculas recomendadas dependiendo de los parametros recibidos
function listaRecomendadas(req, res) {

    var sqlRecomienda = "select pelicula.id,titulo,duracion,director,anio,fecha_lanzamiento,puntuacion,poster,trama,nombre from pelicula join genero on pelicula.genero_id = genero.id where pelicula.id = pelicula.id";
    
    if (req.query.genero) {
        genero = req.query.genero;
        sqlRecomienda = sqlRecomienda +  " and genero.nombre =" +"'"+genero+"'";
    }

    if (req.query.anio_inicio) {
        var anioInicio = req.query.anio_inicio;
        sqlRecomienda = sqlRecomienda +  " and pelicula.anio between " +anioInicio;
    }

    if (req.query.anio_fin) {
        var anioFin = req.query.anio_fin;
        sqlRecomienda = sqlRecomienda +  " and " +anioFin;
    }

    if (req.query.puntuacion) {
        var puntuacion = req.query.puntuacion;
        sqlRecomienda = sqlRecomienda +  " and puntuacion >=" +puntuacion;
    }

    var response = {
        'peliculas': "",
    }

    
    con.query(sqlRecomienda, function(error, resultado, fields) {
            errores(error, res);
            response.peliculas = resultado;
            res.send(JSON.stringify(response));
            });
};

//Función que devuelve la información de la pelicula seleccionada
function listaInfoPelis(req, res) {

    var id = req.params.id;
    var sqlInfoPeli = "select * from pelicula join genero on pelicula.genero_id = genero.id where pelicula.id = " + id;
    var sqlInfoGenero = "select nombre from genero join pelicula on pelicula.genero_id = genero.id where pelicula.id = " + id;
    var sqlInfoActores = "select * from actor_pelicula join actor on actor_id = actor.id  where pelicula_id = " + id;


    var retorno = {
        'pelicula': "",
        'genero': "",
        'actores': "",
    }
    con.query(sqlInfoPeli, function(error, resultado, fields) {
        errores(error, res);
        retorno.pelicula = resultado;

        con.query(sqlInfoGenero, function(error, resultado, fields) {
            errores(error, res);
            retorno.genero = resultado;

        con.query(sqlInfoActores, function(error, resultado,fields){
            errores(error, res);
            retorno.actores = resultado;
            res.send(JSON.stringify(retorno));
        });
    });
});
};


module.exports = {
    listaPeliculas: listaPeliculas,
    listaGeneros: listaGeneros,
    listaRecomendadas: listaRecomendadas,
    listaInfoPelis: listaInfoPelis,
};

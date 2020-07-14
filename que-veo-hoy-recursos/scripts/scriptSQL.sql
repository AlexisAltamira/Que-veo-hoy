DROP DATABASE IF EXISTS queveohoy;
CREATE DATABASE queveohoy;
USE queveohoy;
CREATE TABLE pelicula(
	id int not null primary key auto_increment,
    titulo varchar(100),
    duracion int,
    director varchar(400),
    anio int,
    fecha_lanzamiento datetime,
    puntuacion int,
    poster varchar(300),
    trama varchar(700)
);

CREATE TABLE genero(
	id int not null primary key auto_increment,
    nombre varchar(30)
);

CREATE TABLE actor(
id int not null primary key auto_increment,
nombre varchar(70)
);

create table actor_pelicula(
id int not null primary key auto_increment,
actor_id int,
pelicula_id int
);

alter table pelicula add column genero_id int;
alter table pelicula add FOREIGN KEY (genero_id) references genero(id);

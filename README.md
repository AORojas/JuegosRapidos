# JuegosRapidos

Sitio web arcade hecho con HTML, CSS y JavaScript para reunir juegos rapidos, proyectos propios y clasicos retro embebidos en una misma interfaz.

## Estado actual

El proyecto ya incluye:

- Landing principal con estetica arcade/neon.
- Seccion de juegos locales cargados desde `games.json`.
- Seccion `Family Gratis Games` cargada desde `retro-games.json`.
- Modal para abrir juegos retro embebidos cuando la fuente externa lo permite.
- Boton para mezclar la seleccion retro.
- Contador de visitas usando `localStorage`.
- Logo principal con animacion flotante y efecto neon interactivo.
- Footer con contacto directo por correo.

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla
- JSON para contenido dinamico

## Estructura del proyecto

```text
JuegosRapidos/
|-- index.html
|-- style.css
|-- script.js
|-- games.json
|-- retro-games.json
|-- Imagenes/
|-- README.md
```

## Funcionalidades destacadas

### 1. Juegos propios

Los juegos o proyectos locales se cargan desde `games.json` y se muestran como tarjetas con:

- titulo
- descripcion
- tecnologias
- enlace para jugar
- enlace al codigo

### 2. Family Gratis Games

La seccion retro muestra una seleccion aleatoria de clasicos y cada tarjeta incluye:

- descripcion breve
- fecha de lanzamiento
- creador
- tecnologias en texto
- acceso para jugar dentro de la pagina o abrir el juego original

Tambien hay un aviso general con controles sugeridos:

- `Z` y `X` para jugar
- `Enter` para `Play`
- `Shift` izquierdo para `Select`

## Importante sobre juegos embebidos

Algunos juegos retro dependen de paginas externas. Eso significa que:

- pueden mostrar publicidad propia
- pueden bloquear el uso dentro de `iframe`
- pueden dejar de funcionar si el sitio externo cambia sus reglas

Cuando eso pasa, se recomienda usar el boton `Abrir Original`.

## Personalizacion visual

La interfaz tiene una direccion visual arcade con:

- fondos oscuros con gradientes
- tipografia estilo futurista
- tarjetas con relieve
- brillo neon
- logo con efecto de encendido/apagado interactivo

## Como ejecutar el proyecto

Como es un sitio estatico, alcanza con abrirlo en un servidor local. Por ejemplo, con VS Code y Live Server.

Tambien se puede publicar facilmente en servicios como:

- Netlify
- GitHub Pages
- Vercel

## Contacto

Consultas o colaboraciones:

`adrianorregorojas1998@gmail.com`


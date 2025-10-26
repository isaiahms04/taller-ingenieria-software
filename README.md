# proyecto-ingenieria-software1

Este proyecto permite crear, visualizar y gestionar eventos estudiantiles. Está diseñado para facilitar la organización de actividades, tanto presenciales como online, y brindar un acceso rápido a la información de cada evento.

El sistema incluye:

- Galería de eventos con imágenes y descripción.
- Formulario para crear nuevos eventos.
- Base de datos para almacenar la información de los eventos.
- Diseño responsive y accesible.


Tecnologías utilizadas
- Frontend: HTML5, CSS3, JavaScript
- Backend: PHP 7+
- Base de datos: MySQL
- Otros: Prepared Statements para seguridad en consultas SQL

📂 Estructura del proyecto
/proyecto-eventos
│
├─ index.php              # Página principal / galería de eventos
├─ crear_evento.php       # Script PHP para procesar formularios
├─ conexion.php           # Conexión a la base de datos
├─ formulario_evento.html # Formulario para crear eventos
├─ css/
│   ├─ style.css          # Estilos de la galería
│   └─ crear_eventos_style.css # Estilos del formulario
├─ images/                # Carpeta con imágenes de los eventos
└─ README.md              # Este archivo

⚙️ Instalación y configuración

1. Clonar el repositorio:
   git clone https://github.com/usuario/proyecto-eventos.git
2. Configurar la base de datos:
  a. Crear una base de datos MySQL llamada eventos_estudiantiles.
  b. Crear la tabla eventos con los campos (código sql para la creación en la carpeta en el archivo "BDD"):
      - id (INT, PK, AUTO_INCREMENT)
      - titulo (VARCHAR)
      - descripcion (TEXT)
      - modalidad (VARCHAR)
      - ubicacion (VARCHAR, NULLABLE)
      - enlace_online (VARCHAR, NULLABLE)
      - fecha_inicio (DATETIME)
      - fecha_fin (DATETIME, NULLABLE)
3. Configurar conexión a la base de datos:
  - Editar conexion.php con tus credenciales locales:
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "eventos_estudiantiles";
4. Subir archivos al servidor:
- Colocar todo en tu servidor local (htdocs en XAMPP o equivalente).

Abrir en el navegador:
- Página principal: http://localhost/proyecto/index.php
- Formulario de creación: http://localhost/proyecto/crear_eventos.html

🚀 Uso
1. Crear un evento:
  - Abrir el formulario (formulario_evento.html).
  - Completar los campos requeridos: título, modalidad, fechas, etc.
  - Enviar el formulario.
2. Visualizar eventos:
  - Los eventos se muestran en la galería de la página principal (index.html) con su imagen y descripción.
  - Las consultas se realizan pidiendo todos los datos que se necesiten y solicitando datos de id referidas en otras tablas.

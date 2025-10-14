<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Consultas SQL</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f4f4f4; }
    </style>
</head>
<body>

// --------------------------------------------

<?php
include("conexion.php"); // debe definir $conn (mysqli)

// Consulta SQL
$sql = "SELECT * FROM usuarios LIMIT 4";
$resultado = mysqli_query($conn, $sql);

if (!$resultado) {
    // Manejo básico de error: registra y muestra mensaje profesional
    error_log("MySQL error: " . mysqli_error($conn));
    echo "<p>Error al consultar usuarios. Consulte al administrador.</p>";
} else {
?>
    <a>Usuarios (todos)</a><br><br>

    <table>
        <thead>
            <tr>
                <th>id_usuario</th>
                <th>nombre</th>
                <th>apellido</th>
                <th>email</th>
                <th>contraseña</th>
                <th>id_rol</th>
                <th>acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php
            while ($fila = mysqli_fetch_assoc($resultado)) {
                // Usa htmlspecialchars para evitar problemas de XSS
                $id = htmlspecialchars($fila['id_usuario']);
                $nombre = htmlspecialchars($fila['nombre']);
                $apellido = htmlspecialchars($fila['apellido']);
                $email = htmlspecialchars($fila['email']);
                // Recomendación: si el campo tiene ñ en la DB, considera renombrarlo.
                $contrasena = isset($fila['password']) ? htmlspecialchars($fila['password']) : '';
                $id_rol = htmlspecialchars($fila['id_rol']);
            ?>
            <tr>
                <td><?= $id ?></td>
                <td><?= $nombre ?></td>
                <td><?= $apellido ?></td>
                <td><?= $email ?></td>
                <td><?= $contrasena ?></td>
                <td><?= $id_rol ?></td>
                <td>
                    <a href="#">Editar</a> |
                    <a href="#">Eliminar</a>
                </td>
            </tr>
            <?php
            } // fin while
            ?>
        </tbody>
    </table>

<?php
} // fin else resultado
// Cerrar conexión
mysqli_free_result($resultado);
mysqli_close($conn);
?> <br><br>

// --------------------------------------------

<?php
include("conexion.php"); // debe definir $conexion (mysqli)

// Consulta SQL
$sql = "SELECT 
    e.id_evento,
    e.titulo,
    e.descripcion,
    e.modalidad,
    e.ubicacion,
    e.enlace_online,
    e.fecha_inicio,
    e.fecha_fin,
    c.nombre_categoria AS categoria,
    e.estado
FROM eventos e
JOIN categorias c ON e.id_categoria = c.id_categoria;";
$resultado = mysqli_query($conn, $sql);

if (!$resultado) {
    error_log("MySQL error: " . mysqli_error($conn));
    echo "<p>Error al consultar eventos. Consulte al administrador.</p>";
} else {
?>
    <p>Eventos existentes</p>

    <table>
        <thead>
            <tr>
                <th>id_evento</th>
                <th>titulo</th>
                <th>descripcion</th>
                <th>modalidad</th>
                <th>ubicacion</th>
                <th>enlace_online</th>
                <th>fecha_inicio</th>
                <th>fecha_fin</th>
                <th>categoria</th>
                <th>estado</th>
                <th>acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $id_evento = htmlspecialchars($fila['id_evento']);
                $titulo = htmlspecialchars($fila['titulo']);
                $descripcion = htmlspecialchars($fila['descripcion']);
                $modalidad = htmlspecialchars($fila['modalidad']);
                $ubicacion = htmlspecialchars($fila['ubicacion']);
                $enlace_online = htmlspecialchars($fila['enlace_online']);
                $fecha_inicio = htmlspecialchars($fila['fecha_inicio']);
                $fecha_fin = htmlspecialchars($fila['fecha_fin']);
                $categoria = htmlspecialchars($fila['categoria']);
                $estado = htmlspecialchars($fila['estado']);
                ?>
            <tr>
                <td><?= $id_evento ?></td>
                <td><?= $titulo ?></td>
                <td><?= $descripcion ?></td>
                <td><?= $modalidad ?></td>
                <td><?= $ubicacion ?></td>
                <td><?= $enlace_online ?></td>
                <td><?= $fecha_inicio ?></td>
                <td><?= $fecha_fin ?></td>
                <td><?= $categoria ?></td>
                <td><?= $estado ?></td>
                <td>
                    <a href="#">Editar</a> |
                    <a href="#">Eliminar</a>
                </td>
            </tr>
            <?php
            } // fin while
            ?>
        </tbody>
    </table>

<?php
} // fin else resultado
// Cerrar conexión
mysqli_free_result($resultado);
mysqli_close($conn);
?>

// --------------------------------------------

<?php
include("conexion.php"); // debe definir $conexion (mysqli)

// Consulta SQL
$sql = "SELECT id_categoria, nombre_categoria FROM categorias";
$resultado = mysqli_query($conn, $sql);

if (!$resultado) {
    error_log("MySQL error: " . mysqli_error($conn));
    echo "<p>Error al consultar eventos. Consulte al administrador.</p>";
} else {
?>
    <p>Categorias existentes</p>

    <table>
        <thead>
            <tr>
                <th>id_categoria</th>
                <th>nombre_categoria</th>
                <th>acciones</th>

            </tr>
        </thead>
        <tbody>
            <?php
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $id_categoria = htmlspecialchars($fila['id_categoria']);
                $nombre_categoria = htmlspecialchars($fila['nombre_categoria']);

                ?>
            <tr>
                <td><?= $id_categoria ?></td>
                <td><?= $nombre_categoria ?></td>
                <td>
                    <a href="#">Editar</a> |
                    <a href="#">Eliminar</a>
                </td>
            </tr>
            <?php
            } // fin while
            ?>
        </tbody>
    </table>

<?php
} // fin else resultado
// Cerrar conexión
mysqli_free_result($resultado);
mysqli_close($conn);
?>

// --------------------------------------------

<?php
include("conexion.php"); // Debe definir $conexion (mysqli)

// Consulta SQL con JOIN para mostrar nombres legibles
$sql = "SELECT 
            i.id_inscripcion,
            e.titulo AS evento,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario,
            i.fecha_inscripcion,
            i.estado
        FROM inscripciones i
        JOIN eventos e ON i.id_evento = e.id_evento
        JOIN usuarios u ON i.id_usuario = u.id_usuario
        ORDER BY i.fecha_inscripcion DESC";

$resultado = mysqli_query($conn, $sql);

if (!$resultado) {
    error_log('MySQL error: ' . mysqli_error($conn));
    echo '<p>Error al consultar inscripciones. Consulte al administrador.</p>';
} else {
?>
    <p>inscripciones</p>

    <table border="1" cellpadding="6" cellspacing="0">
        <thead>
            <tr>
                <th>id_inscriocion</th>
                <th>evento</th>
                <th>usuario</th>
                <th>fecha de inscripción</th>
                <th>estado</th>
            </tr>
        </thead>
        <tbody>
            <?php
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $id_inscripcion = htmlspecialchars($fila['id_inscripcion']);
                $evento = htmlspecialchars($fila['evento']);
                $usuario = htmlspecialchars($fila['usuario']);
                $fecha_inscripcion = htmlspecialchars($fila['fecha_inscripcion']);
                $estado = htmlspecialchars($fila['estado']);
            ?>
                <tr>
                    <td><?= $id_inscripcion ?></td>
                    <td><?= $evento ?></td>
                    <td><?= $usuario ?></td>
                    <td><?= $fecha_inscripcion ?></td>
                    <td><?= $estado ?></td>
                    <td>
                        <a href="#">Editar</a> |
                        <a href="#">Eliminar</a>
                    </td>
                </tr>
            <?php
            } // fin while
            ?>
        </tbody>
    </table>

<?php
} // fin else resultado

mysqli_free_result($resultado);
mysqli_close($conn);
?>

// --------------------------------------------

<?php
include("conexion.php"); // debe definir $conexion (mysqli)

// Consulta SQL corregida
$sql = "SELECT 
            i.id_evento,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario
        FROM inscripciones i
        JOIN usuarios u ON i.id_usuario = u.id_usuario
        ORDER BY i.id_evento DESC";

$resultado = mysqli_query($conn, $sql);

if (!$resultado) {
    error_log("MySQL error: " . mysqli_error($conn));
    echo "<p>Error al consultar inscripciones. Consulte al administrador.</p>";
} else {
?>
    <p>ponentes</p>

    <table border="1" cellpadding="6" cellspacing="0">
        <thead>
            <tr>
                <th>id_evento</th>
                <th>nombre usuario</th>
                <th>acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $id_evento = htmlspecialchars($fila['id_evento']);
                $nombre_usuario = htmlspecialchars($fila['usuario']);
            ?>
            <tr>
                <td><?= $id_evento ?></td>
                <td><?= $nombre_usuario ?></td>
                <td>
                    <a href="#">Editar</a> |
                    <a href="#">Eliminar</a>
                </td>
            </tr>
            <?php
            } // fin while
            ?>
        </tbody>
    </table>

<?php
} // fin else resultado

// Cerrar conexión
if ($resultado instanceof mysqli_result) {
    mysqli_free_result($resultado);
}
mysqli_close($conn);
?>


// --------------------------------------------

<?php
include("conexion.php"); // debe definir $conexion (mysqli)

// Consulta SQL
$sql = "SELECT id_rol, nombre_rol FROM roles";
$resultado = mysqli_query($conn, $sql);

if (!$resultado) {
    error_log("MySQL error: " . mysqli_error($conn));
    echo "<p>Error al consultar roles. Consulte al administrador.</p>";
} else {
?>
    <p>roles</p>

    <table border="1" cellpadding="6" cellspacing="0">
        <thead>
            <tr>
                <th>ID Rol</th>
                <th>Nombre Rol</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $id_rol = htmlspecialchars($fila['id_rol']);
                $nombre_rol = htmlspecialchars($fila['nombre_rol']);
            ?>
            <tr>
                <td><?= $id_rol ?></td>
                <td><?= $nombre_rol ?></td>
                <td>
                    <a href="#">Editar</a> |
                    <a href="#">Eliminar</a>
                </td>
            </tr>
            <?php
            } // fin while
            ?>
        </tbody>
    </table>

<?php
} // fin else resultado

// Cerrar conexión
if ($resultado instanceof mysqli_result) {
    mysqli_free_result($resultado);
}
mysqli_close($conn);
?>

// --------------------------------------------

<?php
include("conexion.php"); // debe definir $conexion (mysqli)

// Consulta SQL
$sql = "SELECT * FROM sesiones";
$resultado = mysqli_query($conn, $sql);

if (!$resultado) {
    error_log("MySQL error: " . mysqli_error($conn));
    echo "<p>Error al consultar sesiones. Consulte al administrador.</p>";
} else {
?>
    <p>sesiones registradas</p>

    <table border="1" cellpadding="6" cellspacing="0">
        <thead>
            <tr>
                <th>ID Sesión</th>
                <th>ID Evento</th>
                <th>Título de Sesión</th>
                <th>Fecha Sesión</th>
                <th>Duración (min)</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $id_sesion = htmlspecialchars($fila['id_sesion']);
                $id_evento = htmlspecialchars($fila['id_evento']);
                $titulo_sesion = htmlspecialchars($fila['titulo_sesion']);
                $fecha_sesion = htmlspecialchars($fila['fecha_sesion']);
                $duracion_min = htmlspecialchars($fila['duracion_min']);
            ?>
            <tr>
                <td><?= $id_sesion ?></td>
                <td><?= $id_evento ?></td>
                <td><?= $titulo_sesion ?></td>
                <td><?= $fecha_sesion ?></td>
                <td><?= $duracion_min ?></td>
                <td>
                    <a href="#">Editar</a> |
                    <a href="#">Eliminar</a>
                </td>
            </tr>
            <?php
            } // fin while
            ?>
        </tbody>
    </table>

<?php
} // fin else resultado

// Cerrar conexión
if ($resultado instanceof mysqli_result) {
    mysqli_free_result($resultado);
}
mysqli_close($conn);
?>



</body>
</html>

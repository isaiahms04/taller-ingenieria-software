<?php
include(__DIR__ . '/conexion.php');



if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // 1. Recibir datos del formulario
    $titulo = $_POST['titulo'];
    $descripcion = $_POST['descripcion'];
    $modalidad = $_POST['modalidad'];
    $ubicacion = $_POST['ubicacion'] ?: NULL;
    $enlace_online = $_POST['enlace_online'] ?: NULL;
    $fecha_inicio = $_POST['fecha_inicio'];
    $fecha_fin = $_POST['fecha_fin'] ?: NULL;

    // 2. Preparar la consulta SQL
    $stmt = $conn->prepare("INSERT INTO eventos 
        (titulo, descripcion, modalidad, ubicacion, enlace_online, fecha_inicio, fecha_fin) 
        VALUES (?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("sssssss", 
        $titulo, 
        $descripcion, 
        $modalidad, 
        $ubicacion, 
        $enlace_online, 
        $fecha_inicio, 
        $fecha_fin
    );

    // 3. Ejecutar y verificar
    if ($stmt->execute()) {
        echo "<h2>✅ Evento creado con éxito.</h2>";
        echo "<a href='formulario_evento.html'>Crear otro evento</a>";
    } else {
        echo "<h2>❌ Error al crear evento:</h2> " . $stmt->error;
    }

    // 4. Cerrar
    $stmt->close();
    $conn->close();
} else {
    echo "Acceso no permitido.";
}
?>

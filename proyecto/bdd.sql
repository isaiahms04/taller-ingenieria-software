create DATABASE eventos_estudiantiles;
USE eventos_estudiantiles;

-- ===============================
-- 1. TABLA: roles
-- ===============================
CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL
);

-- ===============================
-- 2. TABLA: usuarios
-- ===============================
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- ===============================
-- 3. TABLA: categorias
-- ===============================
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL
);

-- ===============================
-- 4. TABLA: eventos
-- ===============================
CREATE TABLE eventos (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    modalidad ENUM('Presencial', 'Online') NOT NULL,
    ubicacion VARCHAR(255),
    enlace_online VARCHAR(255),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    id_categoria INT,
    estado ENUM('Borrador', 'Publicado', 'Cancelado', 'Finalizado') DEFAULT 'Borrador',
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- ===============================
-- 5. TABLA: sesiones
-- ===============================
CREATE TABLE sesiones (
    id_sesion INT PRIMARY KEY AUTO_INCREMENT,
    id_evento INT NOT NULL,
    titulo_sesion VARCHAR(150),
    fecha_sesion DATETIME NOT NULL,
    duracion_min INT,
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento)
);

-- ===============================
-- 6. TABLA: ponentes (docentes asignados a eventos)
-- ===============================
CREATE TABLE ponentes (
    id_evento INT NOT NULL,
    id_usuario INT NOT NULL,
    PRIMARY KEY (id_evento, id_usuario),
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ===============================
-- 7. TABLA: inscripciones
-- ===============================
CREATE TABLE inscripciones (
    id_inscripcion INT PRIMARY KEY AUTO_INCREMENT,
    id_evento INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Inscrito', 'Asistió', 'No Asistió', 'Cancelado') DEFAULT 'Inscrito',
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

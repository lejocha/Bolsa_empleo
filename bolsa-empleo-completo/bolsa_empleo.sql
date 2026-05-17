-- ============================================================
--  BOLSA DE EMPLEO — EIF209 Programación 4 — 2026-01
--  Script de base de datos MySQL
-- ============================================================

DROP DATABASE IF EXISTS bolsa_empleo;
CREATE DATABASE bolsa_empleo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bolsa_empleo;

-- ------------------------------------------------------------
-- 1. USUARIO  (tabla central de autenticación)
-- ------------------------------------------------------------
CREATE TABLE usuario (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  correo      VARCHAR(120)    NOT NULL,
  clave_hash  VARCHAR(255)    NOT NULL,          -- BCrypt
  rol         ENUM('ADMIN','EMPRESA','OFERENTE') NOT NULL,
  activo      TINYINT(1)      NOT NULL DEFAULT 0,-- 0 = pendiente aprobación
  creado_en   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuario_correo (correo)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. ADMINISTRADOR
-- ------------------------------------------------------------
CREATE TABLE administrador (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id  INT UNSIGNED NOT NULL,
  nombre      VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_usuario (usuario_id),
  CONSTRAINT fk_admin_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. EMPRESA
-- ------------------------------------------------------------
CREATE TABLE empresa (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id    INT UNSIGNED NOT NULL,
  nombre        VARCHAR(150) NOT NULL,
  localizacion  VARCHAR(200) NOT NULL,
  telefono      VARCHAR(20)  NOT NULL,
  descripcion   TEXT,
  estado        ENUM('PENDIENTE','APROBADA','RECHAZADA') NOT NULL DEFAULT 'PENDIENTE',
  PRIMARY KEY (id),
  UNIQUE KEY uq_empresa_usuario (usuario_id),
  CONSTRAINT fk_empresa_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. OFERENTE
-- ------------------------------------------------------------
CREATE TABLE oferente (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id      INT UNSIGNED NOT NULL,
  identificacion  VARCHAR(30)  NOT NULL,
  nombre          VARCHAR(100) NOT NULL,
  primer_apellido VARCHAR(100) NOT NULL,
  nacionalidad    VARCHAR(80)  NOT NULL,
  telefono        VARCHAR(20)  NOT NULL,
  residencia      VARCHAR(200) NOT NULL,
  curriculum_pdf  VARCHAR(300),                  -- ruta relativa al archivo
  estado          ENUM('PENDIENTE','APROBADO','RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
  PRIMARY KEY (id),
  UNIQUE KEY uq_oferente_usuario (usuario_id),
  UNIQUE KEY uq_oferente_identificacion (identificacion),
  CONSTRAINT fk_oferente_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. CARACTERISTICA  (jerárquica, auto-referenciada)
-- ------------------------------------------------------------
CREATE TABLE caracteristica (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  padre_id  INT UNSIGNED,                        -- NULL = raíz
  nombre    VARCHAR(100) NOT NULL,
  activo    TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT fk_caracteristica_padre
    FOREIGN KEY (padre_id) REFERENCES caracteristica(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. PUESTO
-- ------------------------------------------------------------
CREATE TABLE puesto (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  empresa_id  INT UNSIGNED  NOT NULL,
  descripcion TEXT          NOT NULL,
  salario     DECIMAL(12,2) NOT NULL,
  tipo        ENUM('PUBLICO','PRIVADO') NOT NULL DEFAULT 'PUBLICO',
  activo      TINYINT(1)    NOT NULL DEFAULT 1,
  creado_en   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_puesto_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 7. PUESTO_CARACTERISTICA  (características requeridas por un puesto)
-- ------------------------------------------------------------
CREATE TABLE puesto_caracteristica (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  puesto_id         INT UNSIGNED NOT NULL,
  caracteristica_id INT UNSIGNED NOT NULL,
  nivel_deseado     TINYINT      NOT NULL DEFAULT 1 CHECK (nivel_deseado BETWEEN 1 AND 5),
  PRIMARY KEY (id),
  UNIQUE KEY uq_puesto_caract (puesto_id, caracteristica_id),
  CONSTRAINT fk_pc_puesto
    FOREIGN KEY (puesto_id) REFERENCES puesto(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_pc_caracteristica
    FOREIGN KEY (caracteristica_id) REFERENCES caracteristica(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 8. OFERENTE_CARACTERISTICA  (habilidades del oferente)
-- ------------------------------------------------------------
CREATE TABLE oferente_caracteristica (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  oferente_id       INT UNSIGNED NOT NULL,
  caracteristica_id INT UNSIGNED NOT NULL,
  nivel             TINYINT      NOT NULL DEFAULT 1 CHECK (nivel BETWEEN 1 AND 5),
  PRIMARY KEY (id),
  UNIQUE KEY uq_oferente_caract (oferente_id, caracteristica_id),
  CONSTRAINT fk_oc_oferente
    FOREIGN KEY (oferente_id) REFERENCES oferente(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_oc_caracteristica
    FOREIGN KEY (caracteristica_id) REFERENCES caracteristica(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
--  DATOS INICIALES
-- ============================================================

-- Administrador por defecto  (clave: admin123 — BCrypt generado externamente)
INSERT INTO usuario (correo, clave_hash, rol, activo)
VALUES ('admin@bolsaempleo.local',
        '$2a$10$A0SeNWdvQoWJUwFE1PiCMeMwRi0jSAWTaW9wmO5wO952J.G1bRX02',
        'ADMIN', 1);

INSERT INTO administrador (usuario_id, nombre)
VALUES (LAST_INSERT_ID(), 'Administrador del Sistema');

-- Características de ejemplo (jerárquicas)
INSERT INTO caracteristica (padre_id, nombre) VALUES
  (NULL, 'Lenguajes de programación'),   -- 1
  (NULL, 'Tecnologías Web'),             -- 2
  (NULL, 'Bases de Datos'),              -- 3
  (NULL, 'Ciberseguridad'),              -- 4
  (NULL, 'Testing');                     -- 5

INSERT INTO caracteristica (padre_id, nombre) VALUES
  (1, 'Java'),       -- 6
  (1, 'C#'),         -- 7
  (1, 'Python'),     -- 8
  (1, 'JavaScript'), -- 9
  (1, 'Kotlin'),     -- 10
  (2, 'HTML'),       -- 11
  (2, 'CSS'),        -- 12
  (2, 'React'),      -- 13
  (2, 'Angular'),    -- 14
  (2, 'Spring Boot'),-- 15
  (3, 'MySQL'),      -- 16
  (3, 'PostgreSQL'), -- 17
  (3, 'MongoDB'),    -- 18
  (4, 'OWASP'),      -- 19
  (4, 'JWT'),        -- 20
  (5, 'JUnit'),      -- 21
  (5, 'Selenium'),   -- 22
  (5, 'Postman');    -- 23

-- Empresa de ejemplo (estado APROBADA para pruebas)
INSERT INTO usuario (correo, clave_hash, rol, activo)
VALUES ('softlab@example.com',
        '$2a$10$A0SeNWdvQoWJUwFE1PiCMeMwRi0jSAWTaW9wmO5wO952J.G1bRX02',
        'EMPRESA', 1);

INSERT INTO empresa (usuario_id, nombre, localizacion, telefono, descripcion, estado)
VALUES (LAST_INSERT_ID(),
        'SoftLab',
        'San José, Costa Rica',
        '22001100',
        'Empresa líder en desarrollo de software a medida.',
        'APROBADA');

-- Puesto público de ejemplo
INSERT INTO puesto (empresa_id, descripcion, salario, tipo)
VALUES (1,
        'Desarrollador Full Stack con experiencia en React y Spring Boot.',
        1500000.00,
        'PUBLICO');

INSERT INTO puesto_caracteristica (puesto_id, caracteristica_id, nivel_deseado)
VALUES (1, 13, 3),  -- React nivel 3
       (1, 15, 3),  -- Spring Boot nivel 3
       (1,  6, 2),  -- Java nivel 2
       (1, 16, 2);  -- MySQL nivel 2

-- Oferente de ejemplo (estado APROBADO para pruebas)
INSERT INTO usuario (correo, clave_hash, rol, activo)
VALUES ('jperez@example.com',
        '$2a$10$A0SeNWdvQoWJUwFE1PiCMeMwRi0jSAWTaW9wmO5wO952J.G1bRX02',
        'OFERENTE', 1);

INSERT INTO oferente
  (usuario_id, identificacion, nombre, primer_apellido,
   nacionalidad, telefono, residencia, estado)
VALUES
  (LAST_INSERT_ID(), '118240001',
   'Juan', 'Pérez',
   'Costarricense', '88001100',
   'Heredia, Costa Rica', 'APROBADO');

INSERT INTO oferente_caracteristica (oferente_id, caracteristica_id, nivel)
VALUES (1, 13, 4),  -- React nivel 4
       (1, 15, 3),  -- Spring Boot nivel 3
       (1,  6, 4),  -- Java nivel 4
       (1, 16, 3);  -- MySQL nivel 3

-- ============================================================
--  VISTA útil: coincidencia puesto-oferente
-- ============================================================
CREATE OR REPLACE VIEW v_coincidencia AS
SELECT
  p.id                          AS puesto_id,
  p.descripcion                 AS puesto_desc,
  e.nombre                      AS empresa,
  o.id                          AS oferente_id,
  CONCAT(o.nombre,' ',o.primer_apellido) AS oferente_nombre,
  COUNT(pc.caracteristica_id)   AS total_requeridas,
  SUM(
    CASE WHEN oc.nivel >= pc.nivel_deseado THEN 1 ELSE 0 END
  )                             AS coincidencias,
  ROUND(
    100.0 * SUM(CASE WHEN oc.nivel >= pc.nivel_deseado THEN 1 ELSE 0 END)
          / COUNT(pc.caracteristica_id), 1
  )                             AS porcentaje_match
FROM puesto p
JOIN empresa e ON e.id = p.empresa_id
JOIN puesto_caracteristica pc ON pc.puesto_id = p.id
JOIN oferente o ON 1=1
LEFT JOIN oferente_caracteristica oc
       ON oc.oferente_id = o.id
      AND oc.caracteristica_id = pc.caracteristica_id
WHERE p.activo = 1
GROUP BY p.id, o.id;

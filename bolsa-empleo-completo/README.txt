# Bolsa de Empleo — EIF209 Programación 4 — 2026-01

## Estructura del proyecto
```
bolsa-empleo-completo/
├── bolsa_empleo.sql     ← Script de la base de datos
├── backend/             ← Spring Boot (Java)
└── frontend/            ← React + Vite (JavaScript)
```

## Instalación paso a paso

### 1. Base de datos
- Abrir MySQL Workbench
- Ejecutar el archivo bolsa_empleo.sql
- Editar backend/src/main/resources/application.properties
  y cambiar: spring.datasource.password=TU_PASSWORD

### 2. Backend
- Abrir la carpeta backend/ en IntelliJ IDEA
- Esperar a que Maven descargue dependencias
- Ejecutar BolsaEmpleoApplication.java
- Corre en http://localhost:8080

### 3. Frontend
- Abrir terminal en la carpeta frontend/
- npm install
- npm run dev
- Corre en http://localhost:5173

## Usuarios de prueba (clave: admin123)
- Admin:   admin@bolsaempleo.local
- Empresa: softlab@example.com
- Oferente: jperez@example.com

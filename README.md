# Mi Control UPEA — Sistema de Control de Asistencia Docente con Reconocimiento Facial

Plataforma web administrativa para el monitoreo, gestión y validación en tiempo real de la asistencia docente mediante **reconocimiento facial con inteligencia artificial** y **geocercas poligonales satelitales**. Diseñado para la **Universidad Pública de El Alto (UPEA)** — **Carrera de Medicina**.

---

## 📌 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura y Stack Tecnológico](#-arquitectura-y-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos del Sistema](#-módulos-del-sistema)
  - [1. Autenticación y Control de Acceso](#1-autenticación-y-control-de-acceso)
  - [2. Panel de Control (Dashboard en Tiempo Real)](#2-panel-de-control-dashboard-en-tiempo-real)
  - [3. Gestión de Docentes e Importación UPEA](#3-gestión-de-docentes-e-importación-upea)
  - [4. Gestión Académica (Materias, Paralelos y Asignaciones)](#4-gestión-académica-materias-paralelos-y-asignaciones)
  - [5. Geocercas y Ubicaciones Físicas](#5-geocercas-y-ubicaciones-físicas)
  - [6. Planificación de Horarios](#6-planificación-de-horarios)
  - [7. Validación de Marcados y Reconocimiento Facial](#7-validación-de-marcados-y-reconocimiento-facial)
  - [8. Monitoreo Semanal de Asistencia](#8-monitoreo-semanal-de-asistencia)
  - [9. Reporte Mensual y Exportación](#9-reporte-mensual-y-exportación)
  - [10. Gestión de Usuarios y Roles](#10-gestión-de-usuarios-y-roles)
  - [11. Auditoría y Bitácora del Sistema](#11-auditoría-y-bitácora-del-sistema)
  - [12. Reset de Dispositivo y Estado Biométrico](#12-reset-de-dispositivo-y-estado-biométrico)
  - [13. Simulador de Marcado Manual (DEV)](#13-simulador-de-marcado-manual-dev)
- [Matriz de Permisos por Rol](#-matriz-de-permisos-por-rol)
- [Capa de Red y Endpoints API](#-capa-de-red-y-endpoints-api)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)

---

## 📖 Descripción General

El sistema **Mi Control UPEA** proporciona una interfaz centralizada y moderna para la administración del personal docente, horarios académicos y auditoría de asistencias. Trabaja en sincronía con una **aplicación móvil (APK)** utilizada por los docentes, la cual captura la biometría facial y las coordenadas GPS al momento del ingreso y salida de sus actividades académicas.

### Objetivos Clave
- **Monitoreo en Vivo**: Supervisión instantánea de clases programadas, marcaciones de entrada/salida y docentes faltantes en la jornada.
- **Auditoría Biométrica**: Doble verificación visual comparando la imagen capturada por la IA de reconocimiento facial con fotografías de constancia tomadas en el aula o laboratorio.
- **Geocercas Dinámicas**: Delimitación poligonal de recintos universitarios (aulas, clínicas, laboratorios, auditorios) con tolerancia en metros y detección de piso.
- **Interoperabilidad UPEA**: Importación directa de la carga horaria y docentes desde las bases de datos de la UPEA y sincronización con el servicio externo de asistencia *"Puntuales"*.

---

## 🛠️ Arquitectura y Stack Tecnológico

El frontend está desarrollado bajo el paradigma de componentes con **Vue 3** y arquitectura modular basada en **Composition API** (`<script setup>`):

| Categoría | Tecnología / Librería | Versión | Propósito |
|---|---|---|---|
| **Framework Base** | [Vue.js](https://vuejs.org/) | `3.5.x` | Framework progresivo con reactividad avanzada y Composition API |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | `5.7.x` | Tipado estático y robustez en contratos de datos |
| **Empaquetador** | [Vite](https://vitejs.dev/) | `6.0.x` | Compilación ultrarrápida y Hot Module Replacement (HMR) |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) | `4.0.x` | Framework CSS utilitario de última generación con soporte para Modo Oscuro |
| **Enrutamiento** | [Vue Router](https://router.vuejs.org/) | `4.5.x` | Gestión de rutas, navegación por historial y guardias de seguridad |
| **Mapas & Geocercas** | [Leaflet](https://leafletjs.com/) | `1.9.4` | Trazado de polígonos geográficos satelitales interactivos |
| **Gráficos** | [ApexCharts](https://apexcharts.com/) / `vue3-apexcharts` | `4.4.x` | Gráficos analíticos interactivos de capacidad y métricas |
| **Iconografía** | [Lucide Vue Next](https://lucide.dev/) | `0.474.x` | Iconos limpios, consistentes y vectoriales |
| **Alertas & Notificaciones** | [SweetAlert2](https://sweetalert2.github.io/) | `11.26.x` | Cuadros de diálogo y confirmaciones interactivas |
| **Peticiones HTTP** | [Axios](https://axios-http.com/) | `1.19.x` | Cliente HTTP con interceptores de autenticación y manejo de errores 401 |
| **Selector de Fechas** | [Flatpickr](https://flatpickr.js.org/) | `4.6.x` | Selección de rangos y fechas en componentes del panel |

---

## 📂 Estructura del Proyecto

```text
front-nuevo/
├── public/
│   ├── favicon.ico
│   └── images/               # Recursos gráficos, logotipos UPEA y Medicina
├── src/
│   ├── api/
│   │   ├── config.ts         # Instancia de Axios, URL base e interceptores (JWT / 401)
│   │   └── endpoints.js      # Definición de todas las llamadas a la API REST
│   ├── assets/
│   │   └── main.css          # Directivas globales de Tailwind CSS y tema del sistema
│   ├── components/
│   │   ├── common/           # Componentes genéricos reutilizables
│   │   │   ├── ComponentCard.vue    # Tarjeta contenedora con estilos estándar
│   │   │   ├── MapaPoligono.vue     # Editor de geocercas con Leaflet (dibujo de polígonos)
│   │   │   ├── ModalUbicacion.vue   # Modal de creación/edición de ubicaciones físicas
│   │   │   ├── PageBreadcrumb.vue   # Migas de pan de navegación
│   │   │   └── ThemeToggler.vue     # Selector de modo claro/oscuro
│   │   ├── dashboard/        # Widgets específicos del panel de control
│   │   │   ├── GraficaParalelos.vue # Gráfico de capacidad de paralelos (ApexCharts)
│   │   │   ├── MarcacionesHoy.vue   # Monitoreo en vivo de marcados de la jornada
│   │   │   └── MetricasResumen.vue  # Contadores rápidos (Docentes, Materias)
│   │   └── layout/           # Estructura del cascarón de la aplicación
│   │       ├── AdminLayout.vue      # Layout estándar administrativo (Sidebar + Header)
│   │       ├── AppHeader.vue        # Barra superior con selector de tema y menú de usuario
│   │       ├── AppSidebar.vue       # Barra lateral con navegación filtrada por rol
│   │       ├── FullScreenLayout.vue # Layout limpio para vistas públicas (Login)
│   │       └── header/              # Componentes internos del encabezado
│   ├── composables/
│   │   └── useSidebar.ts     # Manejador reactivo del estado del sidebar (colapsado/móvil)
│   ├── icons/                # Conjunto de componentes SVG personalizados
│   ├── router/
│   │   └── index.ts          # Definición de rutas y guardianes de autenticación/roles
│   ├── views/                # Vistas principales de la aplicación
│   │   ├── Asignaciones.vue     # Asignación de Materia - Paralelo - Docente
│   │   ├── Auditoria.vue        # Bitácora histórica de eventos administrativos
│   │   ├── Auth/
│   │   │   └── Signin.vue       # Formulario de inicio de sesión con JWT
│   │   ├── Carreras.vue         # Catálogo de carreras universitarias
│   │   ├── Dashboard.vue        # Tablero central de operaciones
│   │   ├── Docentes.vue         # CRUD de docentes e importación desde UPEA
│   │   ├── Horarios.vue         # Planificador semanal de horarios (grilla y móvil)
│   │   ├── MarcadoManual.vue    # Herramienta de contingencia / simulador DEV
│   │   ├── MarcadosAdmin.vue    # Bandeja de revisión y validación de marcados
│   │   ├── Materias.vue         # Catálogo de asignaturas
│   │   ├── MonitoreoSemanal.vue # Monitoreo de cumplimiento semanal
│   │   ├── Paralelos.vue        # Catálogo de paralelos y capacidades
│   │   ├── Reportes.vue         # Generación de reportes mensuales y exportación Excel
│   │   ├── ResetDispositivo.vue # Desvinculación de dispositivo y estado de embeddings
│   │   ├── Ubicaciones.vue      # Gestión de aulas, laboratorios y geocercas
│   │   └── Usuarios.vue         # Administración de usuarios (Admins y Supervisores)
│   ├── App.vue               # Componente raíz con proveedores de tema y navegación
│   └── main.ts               # Punto de entrada de la aplicación Vue
├── index.html                # Plantilla HTML con inclusión de fuentes y meta etiquetas
├── package.json              # Dependencias y scripts de ejecución
├── tsconfig.json             # Configuración de compilación TypeScript
└── vite.config.ts            # Configuración de empaquetado y plugins de Vite
```

---

## 🚀 Módulos del Sistema

### 1. Autenticación y Control de Acceso
- **Ubicación**: [`src/views/Auth/Signin.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Auth/Signin.vue), [`src/router/index.ts`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/router/index.ts)
- **Características**:
  - Autenticación mediante correo institucional y contraseña en el endpoint `/admin/auth/login`.
  - Persistencia segura del token de autorización Bearer y del objeto de usuario en `localStorage`.
  - Protección de rutas con middleware `router.beforeEach`: verifica existencia del token y evalúa pertenencia de rol (`meta.roles`).
  - Interceptor en Axios ([`src/api/config.ts`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/api/config.ts)): expira automáticamente la sesión y redirige a `/signin` ante respuestas con estado HTTP `401 Unauthorized`.
  - Cambio de credenciales personales disponible desde el menú de usuario en el encabezado.

---

### 2. Panel de Control (Dashboard en Tiempo Real)
- **Ubicación**: [`src/views/Dashboard.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Dashboard.vue)
- **Componentes**:
  - `MetricasResumen.vue`: Contadores globales de docentes y materias activas.
  - `MarcacionesHoy.vue`:
    - Monitoreo en vivo de las clases de la fecha actual.
    - Actualización automática mediante sondeo inteligente (polling ligero cada 30 segundos) diseñado para no sobrecargar el backend.
    - Desglose entre **clases marcadas** (con horario de entrada y salida, foto y badge de estado) y **clases pendientes/faltantes** del día.
    - Resolución automática de tolerancias horarias (20 minutos antes y 20 minutos después del bloque de clase).
  - `GraficaParalelos.vue`: Gráfico de barras ApexCharts que ilustra la capacidad de alumnos asignada por paralelo.

---

### 3. Gestión de Docentes e Importación UPEA
- **Ubicación**: [`src/views/Docentes.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Docentes.vue)
- **Características**:
  - Listado con búsqueda en tiempo real por nombre, CI o correo, con filtro por estado (Activo / Inactivo).
  - Alta, edición, activación/desactivación y blanqueo de contraseñas (`reset-password`).
  - **Asistente de Importación desde Sistemas UPEA**:
    1. **Búsqueda Externa**: Consulta de la carga académica por número de CI, Carrera y Gestión.
    2. **Previsualización Inteligente**: Compara los registros externos con la base de datos local y los clasifica en:
       - *Horarios ya importados* (solo lectura).
       - *Horarios nuevos por importar* (con casillas de selección individual o masiva).
    3. **Enlace Geográfico Inmediato**: Permite vincular cada materia/horario a una ubicación existente o desplegar el modal de creación rápida de ubicación precompletando los datos del aula/ambiente.

---

### 4. Gestión Académica (Materias, Paralelos y Asignaciones)
- **Materias** ([`src/views/Materias.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Materias.vue)):
  - Control de nombre, sigla/código de asignatura, cantidad de créditos, nivel académico (año/semestre) y modalidad de impartición.
- **Paralelos** ([`src/views/Paralelos.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Paralelos.vue)):
  - Registro de paralelos clasificados por grado (ej. 1°, 2°, 3° año) y capacidad de cupos estudiantiles.
- **Asignaciones** ([`src/views/Asignaciones.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Asignaciones.vue)):
  - Vinculación tripartita: **Materia + Paralelo + Docente Titular**.
  - Filtros combinados por paralelo, materia o docente.
  - Funcionalidad para asignar, reasignar o desvincular docentes con un solo click.

---

### 5. Geocercas y Ubicaciones Físicas
- **Ubicación**: [`src/views/Ubicaciones.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Ubicaciones.vue), [`src/components/common/ModalUbicacion.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/components/common/ModalUbicacion.vue), [`src/components/common/MapaPoligono.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/components/common/MapaPoligono.vue)
- **Características**:
  - Clasificación de recintos: *Aula, Laboratorio, Auditorio, Exterior, Clínica*.
  - Configuración de datos de infraestructura: Edificio/Campus, Piso y Tolerancia en metros (radio perimetral de validación).
  - **Trazado Poligonal con Leaflet**:
    - Marcación interactiva de vértices directamente sobre el mapa satelital (mínimo 3 puntos para generar un polígono válido).
    - Buscador geográfico integrado mediante geocodificación de lugares.
    - Botón de geolocalización inmediata (*"Mi ubicación"*) con pin pulsante animado.
    - Herramientas de edición en vivo: deshacer punto y limpiar polígono.

---

### 6. Planificación de Horarios
- **Ubicación**: [`src/views/Horarios.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Horarios.vue)
- **Características**:
  - Visualización por ubicación física (aulas y laboratorios).
  - **Modo Escritorio**: Grilla horaria semanal completa (de lunes a domingo) con división horaria por bloques de 60 minutos. Creación rápida de clases al pulsar sobre cualquier celda vacía.
  - **Modo Móvil**: Navegador adaptativo mediante pestañas horizontales por día de la semana y tarjetas compactas táctiles.
  - Barra de filtrado superior por docentes asignados al recinto seleccionado.
  - Control de solapamientos horarios y estado del ambiente.

---

### 7. Validación de Marcados y Reconocimiento Facial
- **Ubicación**: [`src/views/MarcadosAdmin.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/MarcadosAdmin.vue)
- **Características**:
  - Bandeja de supervisión con filtrado por fecha y CI del docente.
  - Pestañas de clasificación: **Marcados Pendientes** y **Marcados Inválidos**.
  - **Auditoría Biométrica Visual**:
    - Pestaña 1: **Imagen Facial** (rostro detectado y analizado por el algoritmo de reconocimiento facial en el móvil).
    - Pestaña 2: **Foto Constancia** (fotografía del entorno o pizarra tomada por el docente al registrar asistencia).
  - Acciones de decisión administrativa: **Validar** (aprueba el marcado) o **Invalidar** (rechaza la asistencia), permitiendo adjuntar observaciones justificativas que quedan registradas en la auditoría.

---

### 8. Monitoreo Semanal de Asistencia
- **Ubicación**: [`src/views/MonitoreoSemanal.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/MonitoreoSemanal.vue)
- **Características**:
  - Botones de acceso rápido a periodos: *Hoy*, *Ayer*, *Anteayer*, *Esta Semana*.
  - Métricas ejecutivas consolidadas:
    - Total de clases programadas vs evaluadas.
    - Clases marcadas exitosamente por la aplicación móvil.
    - Clases con retraso (minutos de demora detectados).
    - Clases sin marcar (inasistencias/faltas automáticas).
    - Cantidad neta de docentes con asistencia.
    - Tasa porcentual de cumplimiento.
  - Desglose cronológico detallado día por día.

---

### 9. Reporte Mensual y Exportación
- **Ubicación**: [`src/views/Reportes.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Reportes.vue)
- **Características**:
  - Consulta parametrizada por mes (1 al 12) y año, con buscador por texto (CI o nombre del docente).
  - Indicadores clave: Docentes activos, clases programadas, clases asistidas, faltas totales, sumatoria de minutos de retraso y porcentaje global de cumplimiento.
  - Tabla de detalle individual por docente con estados codificados por colores.
  - **Exportación a Planilla**: Descarga directa de archivos en formato CSV compatible con Microsoft Excel y hojas de cálculo para liquidación de haberes y control de personal.

---

### 10. Gestión de Usuarios y Roles
- **Ubicación**: [`src/views/Usuarios.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Usuarios.vue)
- **Características**:
  - Mantenimiento de cuentas con acceso administrativo al panel.
  - Filtros por rol (`admin`, `supervisor`) y estado (`activo`, `inactivo`).
  - Asignación de carrera de supervisión para usuarios con rol `supervisor`.
  - Acciones administrativas: Creación de usuarios, modificación de datos, restablecimiento forzado de contraseña y activación/inactivación.

---

### 11. Auditoría y Bitácora del Sistema
- **Ubicación**: [`src/views/Auditoria.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/Auditoria.vue)
- **Características**:
  - Registro cronológico inmutable de todas las acciones operativas realizadas por el personal.
  - Búsqueda por rango de fechas y tipo de acción (`validar_marcado`, `marcado_manual`, `reset_dispositivo`, etc.).
  - Información registrada: Fecha y hora exacta, usuario responsable, rol, entidad afectada, identificador y carga útil (payload JSON) de la transacción.
  - Paginación del lado del servidor.

---

### 12. Reset de Dispositivo y Estado Biométrico
- **Ubicación**: [`src/views/ResetDispositivo.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/ResetDispositivo.vue)
- **Características**:
  - Búsqueda de docentes por número de cédula de identidad.
  - **Desvinculación de Hardware (Device ID)**: Por seguridad, cada docente solo puede marcar desde un único teléfono móvil registrado. Esta opción borra el identificador único de hardware para permitir el cambio o reposición de equipo celular.
  - **Diagnóstico del Perfil Facial**: Consulta el estado de los vectores biométricos generados por la IA:
    - *Completo*: 50 o más embeddings faciales registrados.
    - *Incompleto*: Menos de 50 embeddings (requiere completar enrolamiento biométrico).

---

### 13. Simulador de Marcado Manual (DEV)
- **Ubicación**: [`src/views/MarcadoManual.vue`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/views/MarcadoManual.vue)
- **Características**:
  - Herramienta de pruebas y contingencia ante fallas imprevistas de conectividad o emergencias.
  - Búsqueda de docente por CI o correo institucional.
  - Selección de fecha y hora simulada (con botón de sincronización a la hora real del sistema).
  - Interruptor de sincronización externa con el sistema biométrico de **Puntuales**:
    - *Activado*: Envía y valida la asistencia en los servicios universitarios centrales.
    - *Desactivado*: Guarda el registro únicamente en la base de datos local para fines de prueba.
  - Listado de clases programadas del docente con botones inmediatos de *"Marcar Entrada"* y *"Marcar Salida"*, además de opciones para editar o eliminar marcaciones manuales previas.

---

## 🔒 Matriz de Permisos por Rol

El sistema implementa dos roles principales con visibilidad y privilegios diferenciados:

| Módulo / Funcionalidad | Rol `admin` (Administrador) | Rol `supervisor` (Supervisor) |
|---|:---:|:---:|
| **Dashboard y Métricas en Vivo** | Total | Total |
| **Monitoreo Semanal** | Total | Total |
| **Docentes (Consulta y Filtro)** | Total | Total |
| **Docentes (Crear, Editar, Desactivar, Reset Pass)** | ✅ Sí | ❌ Solo lectura |
| **Docentes (Importar desde UPEA)** | Todas las carreras | Solo su carrera asignada |
| **Materias, Paralelos y Asignaciones** | Total | Total |
| **Ubicaciones y Geocercas (Crear/Editar)** | Total | Total |
| **Horarios Semanales** | Total | Total |
| **Validar Marcados Biométricos** | ✅ Sí | ✅ Sí |
| **Reporte Mensual y Exportación Excel** | ✅ Sí | ✅ Sí |
| **Catálogo de Carreras** | ✅ Sí | ❌ Sin acceso |
| **Resetear Dispositivo Móvil** | ✅ Sí | ❌ Sin acceso |
| **Gestión de Usuarios Administrativos** | ✅ Sí | ❌ Sin acceso |
| **Auditoría y Bitácora del Sistema** | ✅ Sí | ❌ Sin acceso |
| **Simulador de Marcado Manual (DEV)** | ✅ Sí | ✅ Sí |

---

## 🌐 Capa de Red y Endpoints API

La comunicación con el backend está centralizada en [`src/api/config.ts`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/api/config.ts) y [`src/api/endpoints.js`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/src/api/endpoints.js).

### Resumen de Endpoints Principales

| Categoría | Método | Endpoint | Descripción |
|---|---|---|---|
| **Autenticación** | `POST` | `/admin/auth/login` | Inicio de sesión administrativo |
| | `POST` | `/admin/auth/logout` | Cierre de sesión y revocación |
| | `GET` | `/auth/perfil` | Consulta del perfil autenticado |
| | `POST` | `/auth/cambiar-password` | Cambio de contraseña propia |
| **Docentes** | `GET` | `/docentes` | Listado paginado de docentes |
| | `POST` | `/docentes` | Registro manual de docente |
| | `PUT` | `/docentes/{id}` | Actualización de datos |
| | `DELETE` | `/docentes/{id}` | Inactivación de docente |
| | `PATCH` | `/docentes/{id}/reactivar` | Reactivación de docente |
| | `PATCH` | `/docentes/{id}/reset-password` | Restablecimiento de credenciales |
| | `GET` | `/docentes/buscar-por-ci/{ci}` | Búsqueda por número de CI |
| **Importación** | `GET` | `/importar/preview` | Consulta previa de horarios externos |
| | `POST` | `/importar/confirmar` | Confirmación e inserción de horarios |
| **Materias** | `GET` / `POST` | `/materias` | Consulta y creación de asignaturas |
| | `PUT` / `DELETE`| `/materias/{id}` | Edición y baja de materias |
| **Paralelos** | `GET` / `POST` | `/paralelos` | Consulta y creación de paralelos |
| | `PUT` / `DELETE`| `/paralelos/{id}` | Edición y baja de paralelos |
| **Asignaciones** | `GET` / `POST` | `/asignaciones` | Carga horaria docente |
| | `PUT` | `/asignaciones/{id}/asignar-docente` | Vinculación de docente a paralelo |
| | `DELETE` | `/asignaciones/{id}/quitar-docente` | Desvinculación de docente |
| **Ubicaciones** | `GET` | `/ubicaciones` | Listado de recintos y geocercas |
| | `POST` | `/ubicaciones/crear` | Creación con coordenadas poligonales |
| | `PUT` | `/ubicaciones/{id}/actualizar` | Edición de ubicación |
| | `DELETE` | `/ubicaciones/{id}/eliminar` | Eliminación de recinto |
| **Horarios** | `GET` | `/horarios` | Consulta de programación académica |
| | `POST` | `/horarios/crear` | Asignación de bloque horario |
| | `PUT` | `/horarios/{id}/actualizar` | Modificación de horario |
| | `DELETE` | `/horarios/{id}/eliminar` | Eliminación de horario |
| **Marcados** | `GET` | `/admin/marcados/pendientes` | Marcados pendientes y del día |
| | `POST` | `/admin/marcados/{id}/validar` | Validación o invalidación |
| **Reportes** | `GET` | `/admin/reportes/mensual` | Resumen mensual de asistencias |
| | `GET` | `/admin/reportes/monitoreo-semanal` | Cumplimiento semanal consolidado |
| **Auditoría** | `GET` | `/admin/auditoria` | Bitácora de operaciones |
| **Dispositivo** | `PATCH` | `/auth/reset-dispositivo/{userId}` | Desvinculación de ID de hardware |
| | `GET` | `/reconocimiento/estado/{docenteId}` | Estado de embeddings faciales |
| **Marcado DEV** | `GET` | `/admin/dev/docente-horarios/{ci}` | Horarios del docente por CI |
| | `POST` | `/admin/dev/marcar-manual` | Registro de marcado manual simulado |
| | `PUT` / `DELETE`| `/admin/dev/marcado/{id}` | Edición / borrado de marcado manual |

---

## 💻 Instalación y Puesta en Marcha

### Requisitos Previos
- **Node.js**: Versión `20.x` o superior recomendada (mínimo `18.x`).
- **npm**: Versión `9.x` o superior (o gestor compatible: `pnpm`, `yarn`).
- **Navegador Web**: Google Chrome, Mozilla Firefox, Microsoft Edge o cualquier navegador moderno compatible con ECMAScript 2022+.

### Pasos de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/jhonny4jnoHuchani/Front_Reconocimiento_facial.git
   cd Front_Reconocimiento_facial
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar el archivo de entorno**:
   Crear un archivo `.env` en la raíz del proyecto (o configurar variables según el entorno):
   ```env
   VITE_API_BASE_URL=http://186.121.212.87:1011/api
   ```

4. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación se levantará en el puerto predeterminado (habitualmente `http://localhost:5173/`).

5. **Compilar para producción**:
   ```bash
   npm run build
   ```
   Los artefactos optimizados se generarán en la carpeta `dist/`.

---

## ⚙️ Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|---|---|---|
| `VITE_API_BASE_URL` | URL base de la API REST del backend | `http://186.121.212.87:1011/api` |

---

## 📜 Scripts Disponibles

En el archivo [`package.json`](file:///d:/Utic_2026/MEDICINA/Sistemas_DEV/front-nuevo/package.json) se encuentran configurados los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo con recarga en caliente de Vite.
- `npm run build`: Ejecuta la verificación estricta de tipos de TypeScript (`vue-tsc --build`) y genera la compilación para producción (`vite build`).
- `npm run preview`: Previsualiza localmente el paquete de producción generado en `dist/`.
- `npm run type-check`: Ejecuta el analizador de tipos de Vue y TypeScript sin generar bundle.
- `npm run lint`: Ejecuta ESLint en todo el proyecto aplicando autocorrecciones (`--fix`).
- `npm run format`: Formatea el código fuente dentro del directorio `src/` mediante Prettier.

---

## 👥 Créditos e Institución

- **Institución**: Universidad Pública de El Alto (UPEA)
- **Unidad Académica**: Área de Ciencias de la Salud — Carrera de Medicina
- **Repositorio**: `jhonny4jnoHuchani/Front_Reconocimiento_facial`

# Capa de Acceso a Datos

## Herramientas de conexión
- **MySQL2**: Librería utilizada para establecer el pool de conexiones.
- **Transacciones SQL**: Se emplean para asegurar que los lotes de ubicaciones (sincronización offline) se guarden de forma atómica.

## Entidades principales

Listado inferido de entidades y sus operaciones recurrentes en la Base de Datos (`schema.sql`):

1. **`Users`**: Usuarios registrados con roles (ADMIN, SUPERVISOR, CLIENT, USER).
2. **`Clients`**: Empresas u organizaciones que contratan el servicio de rastreo.
3. **`User_Client`**: Relación entre un usuario rastreado (USER) y un cliente (CLIENT).
4. **`Supervisor_User`**: Asignación de usuarios a supervisores para su monitoreo.
5. **`Locations`**: Historial de coordenadas (latitud, longitud, velocidad, batería, etc.).
6. **`Geofences`**: Zonas virtuales configuradas (círculos o polígonos).
7. **`Geofence_Events`**: Registro histórico de entradas y salidas de geocercas.
8. **`Alerts`**: Alertas críticas generadas por el sistema (batería baja, geocercas, desconexión).
9. **`Consents`**: Registro de aceptación de términos y condiciones de rastreo.
10. **`Sessions`**: Control de sesiones activas por dispositivo para evitar duplicidad de transmisión.

## Diagrama entidad-relación

A continuación se presenta la estructura de la base de datos y sus relaciones:

```mermaid
erDiagram
    USERS ||--o{ LOCATIONS : transmits
    USERS ||--o{ GEOFENCES : creates
    USERS ||--o{ GEOFENCE_EVENTS : triggers
    USERS ||--o{ ALERTS : has
    USERS ||--o{ CONSENTS : gives
    USERS ||--o{ SESSIONS : starts
    
    USERS ||--o{ SUPERVISOR_USER : supervises_as_supervisor
    USERS ||--o{ SUPERVISOR_USER : is_supervised_as_user
    
    USERS ||--o{ USER_CLIENT : belongs_to_as_user
    CLIENTS ||--o{ USER_CLIENT : has_as_client
    
    CLIENTS }o--|| USERS : managed_by_client_admin
    
    GEOFENCES ||--o{ GEOFENCE_EVENTS : defines

    CLIENTS {
        INT id_client
        VARCHAR nombre_empresa
        VARCHAR contacto
        INT id_user_admin
        DATETIME created_at
    }

    USER_CLIENT {
        INT id
        INT id_user
        INT id_client
    }

    SUPERVISOR_USER {
        INT id
        INT id_supervisor
        INT id_user
    }

    GEOFENCES {
        INT id_geofence
        VARCHAR nombre
        ENUM tipo
        JSON coordenadas
        FLOAT radio
        INT created_by
        DATETIME created_at
    }

    GEOFENCE_EVENTS {
        BIGINT id_event
        INT id_user
        INT id_geofence
        ENUM tipo_evento
        DATETIME timestamp_evento
    }

    ALERTS {
        BIGINT id_alert
        INT id_user
        ENUM tipo_alerta
        TEXT descripcion
        DATETIME timestamp_alerta
        BOOLEAN is_read
    }

    CONSENTS {
        INT id_consent
        INT id_user
        DATETIME accepted_at
        VARCHAR ip_address
        TEXT user_agent
    }

    SESSIONS {
        INT id_session
        INT id_user
        VARCHAR token_jti
        VARCHAR device_id
        DATETIME login_time
        BOOLEAN is_active
    }
    
    LOCATIONS {
        BIGINT id_location
        INT id_user
        DECIMAL latitud
        DECIMAL longitud
        FLOAT velocidad
        INT bateria
        DATETIME timestamp_captura
        ENUM estado_sincronizacion
    }
    
    USERS {
        INT id_user
        VARCHAR nombre
        VARCHAR correo
        ENUM rol
        BOOLEAN is_active
    }
```

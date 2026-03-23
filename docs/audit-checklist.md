# Checklist de Auditoría Técnica — MagicInfo CLC

**Proyecto:** Belgrano Digital — Takeover de señalética digital en Clínica Los Condes
**Pantallas:** 70 Samsung con MagicInfo Server
**Fecha de creación:** 2026-03-23
**Estado:** Pendiente de ejecución en terreno

---

## Resumen

Este checklist es para la visita técnica inicial a CLC. El objetivo es levantar toda la información necesaria antes de firmar cualquier acuerdo comercial o asumir control operacional. Cada sección tiene un criterio de aceptación — si algún ítem crítico no se cumple, se detiene el proceso hasta resolverlo.

**Tiempo estimado en terreno:** 4-6 horas (con acceso a sala de servidores y acompañamiento de IT CLC)
**Personas requeridas:** 1 técnico Belgrano + 1 contacto IT CLC

---

## 1. Versión del Servidor MagicInfo

**Prioridad:** CRÍTICA — bloqueante para todo lo demás

| # | Verificación | Resultado | Notas |
|---|-------------|-----------|-------|
| 1.1 | Acceder al panel web de MagicInfo (típicamente `http://[IP-servidor]:7001/MagicInfo`) | ☐ OK / ☐ No accesible | IP: __________ Puerto: __________ |
| 1.2 | Ir a Settings > Server Management > License Info | ☐ Accedido | |
| 1.3 | Registrar versión exacta del servidor | ☐ Registrada | Versión: __________ |
| 1.4 | Verificar si es MagicInfo V7, V8 o V9 | ☐ V7 / ☐ V8 / ☐ V9 | |
| 1.5 | Si es V9: verificar que sea >= 21.1050 (parche CVE-2024-7399) | ☐ Parcheado / ☐ Vulnerable | Ver `security-patch-guide.md` |
| 1.6 | Registrar sistema operativo del servidor | ☐ Registrado | OS: __________ |
| 1.7 | Verificar versión de PostgreSQL del servidor | ☐ Registrada | PG Version: __________ |

**Criterio de aceptación:** Versión del servidor documentada. Si < 21.1050, se activa el plan de parchado antes de continuar.

---

## 2. Auditoría de Licencias

**Prioridad:** CRÍTICA — determina si Belgrano puede operar las pantallas

| # | Verificación | Resultado | Notas |
|---|-------------|-----------|-------|
| 2.1 | Identificar quién compró las licencias (CLC vs. proveedor actual) | ☐ CLC / ☐ Proveedor / ☐ Desconocido | Contacto: __________ |
| 2.2 | Obtener los license keys o números de serie | ☐ Obtenidos / ☐ No disponibles | Cantidad: __________ |
| 2.3 | Verificar tipo de licencia por pantalla: Lite vs. Premium | ☐ Todas Lite / ☐ Todas Premium / ☐ Mix | Lite: ____ Premium: ____ |
| 2.4 | Verificar si las licencias son transferibles | ☐ Sí / ☐ No / ☐ Por confirmar | |
| 2.5 | Verificar fecha de expiración de licencias (si aplica) | ☐ Perpetuas / ☐ Expiran | Fecha: __________ |
| 2.6 | Verificar cuenta Samsung asociada a las licencias | ☐ Identificada | Email: __________ |
| 2.7 | Evaluar costo de reemplazo si licencias no son transferibles | ☐ Calculado | Lite: ~EUR165/pantalla, Premium: ~EUR446/pantalla |

**Criterio de aceptación:** Propiedad de licencias clara. Si son del proveedor, plan de transferencia o compra documentado con costos.

**Implicaciones por tipo de licencia:**
- **Lite:** Solo upload-and-play. Sin scheduling avanzado, sin reglas condicionales, API limitada. Insuficiente para vender campañas con horarios.
- **Premium:** Scheduling por hora, reglas de contenido, API completa, control remoto de hardware. Necesario para operación DOOH.

---

## 3. Inventario de Credenciales de Administración

**Prioridad:** ALTA

| # | Verificación | Resultado | Notas |
|---|-------------|-----------|-------|
| 3.1 | Credenciales de admin del panel web MagicInfo | ☐ Obtenidas / ☐ No disponibles | Usuario: __________ |
| 3.2 | ¿Existen otros usuarios con acceso al panel? | ☐ Sí / ☐ No | Cantidad: __________ |
| 3.3 | Acceso al servidor (RDP/SSH) | ☐ Disponible / ☐ No disponible | |
| 3.4 | Credenciales de la base de datos PostgreSQL del servidor | ☐ Obtenidas / ☐ No aplica | |
| 3.5 | ¿El proveedor actual tiene acceso remoto al servidor? | ☐ Sí / ☐ No / ☐ Desconocido | Método: __________ |
| 3.6 | ¿Existen credenciales por defecto sin cambiar? | ☐ Sí (RIESGO) / ☐ No | Admin default: admin/admin |
| 3.7 | Documentar TODAS las credenciales obtenidas en gestor seguro | ☐ Hecho | |

**Criterio de aceptación:** Belgrano tiene credenciales de admin verificadas. Credenciales por defecto cambiadas. Plan para revocar acceso del proveedor anterior documentado.

---

## 4. Topología de Red

**Prioridad:** ALTA — determina si la integración API es viable

| # | Verificación | Resultado | Notas |
|---|-------------|-----------|-------|
| 4.1 | Ubicación física del servidor MagicInfo | ☐ Documentada | Edificio: __________ Sala: __________ |
| 4.2 | IP del servidor en la red CLC | ☐ Registrada | IP: __________ |
| 4.3 | Puerto del panel web (default: 7001 HTTP, 7002 HTTPS) | ☐ Verificado | Puerto: __________ |
| 4.4 | ¿El panel web está expuesto a internet? | ☐ Sí (RIESGO) / ☐ No | URL pública: __________ |
| 4.5 | ¿Existe VPN para acceso remoto al servidor? | ☐ Sí / ☐ No / ☐ Por solicitar | Tipo: __________ |
| 4.6 | ¿Las pantallas están en la misma VLAN que el servidor? | ☐ Sí / ☐ Separadas | VLAN: __________ |
| 4.7 | ¿Las pantallas se conectan por cable o WiFi? | ☐ Cable / ☐ WiFi / ☐ Mix | |
| 4.8 | ¿Existe firewall entre las pantallas y el servidor? | ☐ Sí / ☐ No | Reglas: __________ |
| 4.9 | ¿El servidor tiene acceso a internet para actualizaciones? | ☐ Sí / ☐ No | |
| 4.10 | Diagrama de red simplificado dibujado | ☐ Hecho | Adjuntar foto/esquema |
| 4.11 | Contacto del equipo de IT/redes de CLC | ☐ Registrado | Nombre: __________ Tel: __________ |

**Criterio de aceptación:** Se puede acceder al servidor desde la red CLC. Se conoce la ruta de red pantallas -> servidor. Se sabe si hay camino desde internet (VPN) para acceso remoto por Belgrano.

---

## 5. Plan de Prueba de Accesibilidad API

**Prioridad:** MEDIA — se puede hacer después de la visita inicial si hay acceso remoto

| # | Verificación | Resultado | Notas |
|---|-------------|-----------|-------|
| 5.1 | Verificar que la API está habilitada en el servidor | ☐ Habilitada / ☐ Deshabilitada | Settings > Open API |
| 5.2 | Obtener API base URL | ☐ Registrada | URL: __________ |
| 5.3 | Test de autenticación: `POST /auth` con credenciales admin | ☐ OK / ☐ Falla | Token obtenido: ☐ Sí / ☐ No |
| 5.4 | Test de listado de dispositivos: `GET /restapi/v1.0/rms/devices` | ☐ OK / ☐ Falla | Dispositivos encontrados: __________ |
| 5.5 | Test de estado de dispositivo: `GET /restapi/v1.0/rms/devices/{id}` | ☐ OK / ☐ Falla | |
| 5.6 | Test de listado de contenido: `GET /restapi/v1.0/cms/contents` | ☐ OK / ☐ Falla | |
| 5.7 | Test de estadísticas/play logs: `GET /restapi/v1.0/sts/statistics` | ☐ OK / ☐ Falla | **CRÍTICO para proof-of-play** |
| 5.8 | Verificar rate limiting de la API | ☐ Documentado | Límite: __________ req/min |
| 5.9 | Test de acceso desde fuera de la red CLC (si hay VPN) | ☐ OK / ☐ Falla / ☐ No aplica | |

**Criterio de aceptación:** Al menos los endpoints de autenticación, dispositivos y contenido responden. El endpoint de estadísticas es crítico para el modelo de negocio — si no funciona, se necesita plan alternativo.

**Script de prueba rápida (ejecutar desde red CLC):**
```bash
# Reemplazar SERVER_IP y credenciales
SERVER="http://[SERVER_IP]:7001"

# 1. Autenticación
TOKEN=$(curl -s -X POST "$SERVER/auth" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"[PASSWORD]"}' | jq -r '.token')

echo "Token: $TOKEN"

# 2. Listar dispositivos
curl -s "$SERVER/restapi/v1.0/rms/devices" \
  -H "Authorization: Bearer $TOKEN" | jq '.items | length'

# 3. Test de estadísticas (proof-of-play)
curl -s "$SERVER/restapi/v1.0/sts/statistics" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 6. Evaluación de Vulnerabilidad CVE-2024-7399

**Prioridad:** CRÍTICA — bloqueante para asumir control

| # | Verificación | Resultado | Notas |
|---|-------------|-----------|-------|
| 6.1 | Versión del servidor es >= 21.1050 | ☐ Sí (seguro) / ☐ No (vulnerable) | Versión: __________ |
| 6.2 | ¿El panel web es accesible desde internet sin VPN? | ☐ Sí (ALTO RIESGO) / ☐ No | |
| 6.3 | ¿Existe historial de parches/actualizaciones del servidor? | ☐ Sí / ☐ No | Última actualización: __________ |
| 6.4 | ¿El proveedor actual ha mencionado esta vulnerabilidad? | ☐ Sí / ☐ No | |
| 6.5 | Revisar logs del servidor por actividad sospechosa | ☐ Revisado / ☐ No se pudo acceder | Hallazgos: __________ |
| 6.6 | Verificar si hay archivos sospechosos en el servidor (webshells, scripts) | ☐ Revisado / ☐ No se pudo acceder | |
| 6.7 | Verificar CVE-2025-4632 (path traversal, parche posterior) | ☐ Parcheado / ☐ Vulnerable / ☐ N/A | |

**Si el servidor es vulnerable:**
1. **NO conectar** ningún sistema de Belgrano al servidor hasta que esté parcheado
2. Solicitar a IT CLC que restrinja acceso al panel web por IP inmediatamente
3. Activar plan de parchado (ver `security-patch-guide.md`)
4. Considerar que el servidor **puede estar ya comprometido** — revisar logs y archivos

**Criterio de aceptación:** Servidor en versión >= 21.1050 O plan de parchado acordado con IT CLC con fecha definida.

---

## 7. Especificaciones de Hardware del Servidor

**Prioridad:** MEDIA

| # | Verificación | Resultado | Notas |
|---|-------------|-----------|-------|
| 7.1 | CPU del servidor | ☐ Registrado | Modelo: __________ Cores: __________ |
| 7.2 | RAM del servidor | ☐ Registrada | Total: __________ GB Disponible: __________ GB |
| 7.3 | Almacenamiento disponible | ☐ Registrado | Total: __________ GB Libre: __________ GB |
| 7.4 | ¿El servidor es dedicado o compartido? | ☐ Dedicado / ☐ Compartido | Otros servicios: __________ |
| 7.5 | ¿Existe servidor de respaldo/redundancia? | ☐ Sí / ☐ No | |
| 7.6 | ¿Existe procedimiento de backup? | ☐ Sí / ☐ No | Frecuencia: __________ |
| 7.7 | Requisitos mínimos MagicInfo V9: Windows 11 Pro/Server 2019, 8GB RAM, 4+ cores | ☐ Cumple / ☐ No cumple | |

**Criterio de aceptación:** El servidor cumple requisitos mínimos de MagicInfo V9. Si no cumple, presupuestar upgrade de hardware.

**Requisitos mínimos MagicInfo V9:**
- OS: Windows 11 Pro o Windows Server 2019+
- CPU: 4 cores mínimo (8 recomendado para 70 pantallas)
- RAM: 8 GB mínimo (16 GB recomendado)
- Disco: 100 GB libres mínimo (contenido de video consume mucho espacio)
- PostgreSQL 15.x
- Java 17+

---

## Resumen de Hallazgos (completar después de la visita)

### Estado General

| Área | Estado | Acción Requerida |
|------|--------|-----------------|
| Versión servidor | ☐ OK / ☐ Requiere parche / ☐ Requiere upgrade | |
| Licencias | ☐ CLC las tiene / ☐ Proveedor las tiene / ☐ Indefinido | |
| Credenciales | ☐ Belgrano tiene admin / ☐ Pendiente | |
| Red | ☐ Acceso confirmado / ☐ VPN necesaria / ☐ Bloqueado | |
| API | ☐ Funcional / ☐ Parcial / ☐ No disponible | |
| Seguridad | ☐ Parcheado / ☐ Vulnerable / ☐ Posible compromiso | |
| Hardware servidor | ☐ Cumple requisitos / ☐ Requiere upgrade | |

### Bloqueantes Identificados

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### Siguiente Paso

- [ ] Si todo OK: Proceder con catálogo de pantallas (`screen-catalog-template.md`)
- [ ] Si hay bloqueantes: Documentar y resolver antes de continuar
- [ ] Si servidor vulnerable: Ejecutar `security-patch-guide.md` como prioridad

---

**Responsable de auditoría:** _______________
**Fecha de ejecución:** _______________
**Aprobado por:** _______________

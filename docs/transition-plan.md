# Plan de Transición Zero-Downtime — Clínica Los Condes

**Proyecto:** Belgrano Digital — Takeover de señalética digital CLC
**Pantallas:** 70 Samsung con MagicInfo Server
**Fecha de creación:** 2026-03-23
**Principio rector:** Ninguna pantalla puede quedar en negro durante la transición. Un TV apagado en una sala de espera de la clínica es una disrupción visible que daña la relación con CLC.

---

## Timeline General

```
Semana -2 a -1    PRE-TRANSICIÓN       Preparación técnica y administrativa
Semana 1 a 4      OPERACIÓN PARALELA   Belgrano opera junto al proveedor actual
Domingo S5         CUTOVER             Corte definitivo al control de Belgrano
Semana 5 a 8      POST-CUTOVER        Estabilización y monitoreo intensivo
```

**Duración total:** ~8 semanas desde inicio hasta estabilización completa

---

## Fase 1: Pre-Transición (Semana -2 a -1)

**Objetivo:** Todo preparado antes de tocar un solo equipo en producción.

### Tareas Administrativas

| # | Tarea | Responsable | Estado |
|---|-------|-------------|--------|
| 1.1 | Notificar formalmente al proveedor actual sobre el término del servicio | CLC (con asesoría Belgrano) | ☐ |
| 1.2 | Solicitar al proveedor documentación técnica completa (configs, credenciales, licencias) | CLC | ☐ |
| 1.3 | Definir fecha de término del contrato con proveedor actual | CLC | ☐ |
| 1.4 | Firmar acuerdo de servicio Belgrano-CLC (si no está firmado) | Belgrano + CLC | ☐ |
| 1.5 | Obtener contactos de IT CLC para escalamiento durante transición | Belgrano | ☐ |
| 1.6 | Coordinar ventana de mantenimiento con CLC para el día de cutover | Belgrano + CLC IT | ☐ |

### Tareas Técnicas

| # | Tarea | Responsable | Estado |
|---|-------|-------------|--------|
| 1.7 | Completar auditoría técnica (`audit-checklist.md`) | Belgrano | ☐ |
| 1.8 | Completar catálogo de pantallas (`screen-catalog-template.md`) | Belgrano | ☐ |
| 1.9 | Parchear servidor MagicInfo si es vulnerable (`security-patch-guide.md`) | Belgrano + CLC IT | ☐ |
| 1.10 | Crear cuenta admin de Belgrano en MagicInfo (separada del proveedor) | Belgrano | ☐ |
| 1.11 | Preparar contenido de fallback (ver sección abajo) | Belgrano | ☐ |
| 1.12 | Probar acceso API desde la red de Belgrano (VPN si aplica) | Belgrano | ☐ |
| 1.13 | Documentar configuración actual de todas las pantallas (schedules, playlists) | Belgrano | ☐ |
| 1.14 | Crear backup completo del servidor MagicInfo | Belgrano + CLC IT | ☐ |

### Criterios de Avance

- [ ] Belgrano tiene credenciales admin propias en MagicInfo
- [ ] Catálogo de 70 pantallas completo con estado verificado
- [ ] Contenido de fallback preparado y probado
- [ ] Backup del servidor realizado
- [ ] Proveedor actual notificado con fecha de término
- [ ] Ventana de cutover acordada con CLC

**Si algún criterio no se cumple:** NO avanzar a Fase 2. Resolver primero.

---

## Fase 2: Operación Paralela (Semana 1 a 4)

**Objetivo:** Belgrano demuestra capacidad operativa sin interrumpir el servicio actual.

### Semana 1-2: Observación y Aprendizaje

| # | Tarea | Detalle |
|---|-------|---------|
| 2.1 | Monitorear el servidor MagicInfo diariamente | Verificar uptime, pantallas conectadas, errores |
| 2.2 | Documentar la rutina operativa actual | Qué contenido se publica, con qué frecuencia, quién lo gestiona |
| 2.3 | Identificar pantallas problemáticas | Las que se desconectan frecuentemente, muestran errores, etc. |
| 2.4 | Crear grupos de pantallas en MagicInfo por zona | Según clasificación de `screen-catalog-template.md` |
| 2.5 | Subir contenido de prueba a 2-3 pantallas no críticas | Verificar que Belgrano puede publicar contenido exitosamente |

### Semana 3-4: Operación Gradual

| # | Tarea | Detalle |
|---|-------|---------|
| 2.6 | Asumir gestión de contenido en 10-15 pantallas (zonas de bajo riesgo) | Pasillos y áreas administrativas primero |
| 2.7 | Publicar contenido institucional CLC preparado por Belgrano | Demostrar calidad superior al proveedor actual |
| 2.8 | Monitorear estabilidad durante 7 días continuos | Sin caídas, sin pantallas en negro, sin errores |
| 2.9 | Documentar cualquier incidencia y resolución | Crear log de incidentes para referencia |
| 2.10 | Reunión de avance con CLC (fin de semana 4) | Presentar resultados, confirmar fecha de cutover |

### Métricas de Éxito (Fase 2)

| Métrica | Objetivo | Cómo medir |
|---------|----------|------------|
| Uptime de pantallas gestionadas por Belgrano | >= 99% | MagicInfo device status logs |
| Tiempo de respuesta a incidentes | < 2 horas en horario laboral | Log de incidentes |
| Pantallas en negro | 0 | Monitoreo diario + reportes de CLC |
| Contenido publicado exitosamente | 100% de las publicaciones | MagicInfo content deployment logs |

**Si las métricas no se cumplen:** Extender Fase 2 una semana adicional. Máximo 2 extensiones (6 semanas total). Si después de 6 semanas no se logra estabilidad, escalar a decisión gerencial.

---

## Fase 3: Cutover (Día C — Domingo 6:00 AM recomendado)

**Objetivo:** Belgrano asume control total de las 70 pantallas.

### Por qué domingo 6 AM

- Menor cantidad de personas en la clínica (solo urgencias y turnos nocturnos)
- Si algo falla, hay todo el domingo para resolver antes del lunes
- Las salas de espera de consultas externas están vacías
- IT CLC puede estar en standby sin afectar operación normal

### Protocolo de Cutover

**T = Hora de inicio (recomendado: 06:00)**

| Hora | Acción | Responsable | Rollback si falla |
|------|--------|-------------|-------------------|
| T-24h | Backup completo del servidor MagicInfo | Belgrano + CLC IT | N/A |
| T-12h | Verificar que contenido de fallback está cargado en todas las pantallas | Belgrano | N/A |
| T-2h | Equipo Belgrano en sitio (mínimo 2 personas) | Belgrano | N/A |
| T-1h | Contactar CLC IT — confirmar que están en standby | Belgrano | Posponer si IT no disponible |
| T | Cambiar credenciales del admin principal | Belgrano | Restaurar credenciales anteriores |
| T+10m | Revocar acceso del proveedor anterior | Belgrano + CLC IT | Re-habilitar acceso temporal |
| T+15m | Verificar que todas las pantallas siguen conectadas | Belgrano | Activar fallback local |
| T+20m | Publicar contenido de prueba en 5 pantallas distribuidas | Belgrano | Revertir a contenido anterior |
| T+30m | Si prueba OK: publicar nuevo contenido institucional CLC en las 70 pantallas | Belgrano | Rollback a contenido previo |
| T+45m | Verificar físicamente 10 pantallas clave (recepción, salas de espera principales) | Belgrano | Intervención manual por pantalla |
| T+1h | Recorrido completo por zonas: verificar las 70 pantallas | Belgrano (2 personas, rutas separadas) | Log de pantallas problemáticas |
| T+2h | Checkpoint: declarar "Cutover exitoso" o "Activar rollback" | Belgrano | Ver sección Rollback |
| T+4h | Si exitoso: notificar a CLC que Belgrano está operando | Belgrano | N/A |

### Checklist de Verificación Post-Cutover

- [ ] Las 70 pantallas muestran contenido (no en negro)
- [ ] El panel MagicInfo muestra 70/70 dispositivos conectados
- [ ] Las credenciales del proveedor anterior están revocadas
- [ ] Belgrano puede publicar contenido nuevo exitosamente
- [ ] El contenido de fallback sigue cargado como respaldo
- [ ] CLC IT confirma que no hay alertas en la red
- [ ] Log de cutover documentado con timestamps

---

## Estrategia de Contenido de Fallback

**Propósito:** Si el servidor MagicInfo cae o pierde conexión con las pantallas, cada TV debe mostrar contenido aceptable automáticamente en vez de una pantalla negra.

### Preparación

1. **Crear contenido de fallback genérico CLC:**
   - Loop de 10 minutos con contenido institucional CLC (logo, horarios, info general)
   - Formato: MP4, resolución nativa de las pantallas (1920x1080 o 3840x2160)
   - Sin fechas ni información temporal que pueda quedar obsoleta

2. **Cargar en almacenamiento local de cada pantalla:**
   - Las pantallas Samsung soportan contenido desde USB o almacenamiento interno
   - Configurar MagicInfo para reproducir contenido local si pierde conexión con el servidor
   - Verificar que esta configuración funciona desconectando una pantalla de prueba de la red

3. **Contenido de fallback por zona (opcional, si hay tiempo):**
   - RECEPCION: Bienvenida CLC + info general
   - SALA-ESP: Tips de salud genéricos + info CLC
   - PASILLO: Logo CLC en loop
   - URGENCIA: Información de urgencias CLC

### Verificación

| Test | Resultado |
|------|-----------|
| Desconectar pantalla de prueba de la red | ☐ Muestra fallback / ☐ Pantalla negra |
| Apagar servidor MagicInfo 5 minutos | ☐ Pantallas siguen mostrando contenido / ☐ Se apagan |
| Reiniciar servidor MagicInfo | ☐ Pantallas reconectan automáticamente / ☐ Intervención manual |

---

## Procedimiento de Rollback

**Activar si:** Más de 10 pantallas en negro, servidor MagicInfo inestable, o CLC solicita revertir.

### Rollback Nivel 1: Contenido (< 15 min)

1. Revertir contenido publicado al contenido anterior (backup en MagicInfo)
2. Verificar que las pantallas retoman el contenido previo
3. **Resultado:** Pantallas muestran contenido del proveedor anterior, Belgrano mantiene acceso admin

### Rollback Nivel 2: Acceso (< 30 min)

1. Re-habilitar credenciales del proveedor anterior
2. Notificar al proveedor que se requiere intervención temporal
3. Belgrano mantiene cuenta de observador
4. **Resultado:** Proveedor anterior retoma control operativo temporal

### Rollback Nivel 3: Servidor (< 2 horas)

1. Restaurar servidor MagicInfo desde backup de T-24h
2. Verificar que todos los dispositivos reconectan
3. Proveedor anterior retoma control completo
4. **Resultado:** Estado previo restaurado completamente

### Criterios de Activación de Rollback

| Situación | Nivel de Rollback | Decisión |
|-----------|-------------------|----------|
| 1-5 pantallas con problemas | No rollback — resolver individualmente | Belgrano |
| 6-10 pantallas con problemas | Evaluar Nivel 1 | Belgrano + CLC IT |
| 11+ pantallas con problemas | Activar Nivel 1 inmediato | Belgrano |
| Servidor MagicInfo caído | Activar Nivel 2 o 3 según causa | Belgrano + CLC IT |
| CLC solicita revertir | Activar nivel solicitado | CLC decide |

---

## Fase 4: Post-Cutover (Semana 5 a 8)

**Objetivo:** Estabilización, monitoreo intensivo, y cierre formal de la transición.

### Semana 5-6: Monitoreo Intensivo

| # | Tarea | Frecuencia |
|---|-------|------------|
| 4.1 | Verificar estado de las 70 pantallas en MagicInfo | 3 veces al día (9am, 1pm, 5pm) |
| 4.2 | Recorrido físico de pantallas clave | 1 vez al día (lunes a viernes) |
| 4.3 | Revisar logs del servidor por errores | Diario |
| 4.4 | Responder incidentes reportados por CLC | Dentro de 2 horas en horario laboral |
| 4.5 | Documentar todas las incidencias y resoluciones | Continuo |

### Semana 7-8: Operación Normal

| # | Tarea | Frecuencia |
|---|-------|------------|
| 4.6 | Verificar estado de pantallas | 1 vez al día |
| 4.7 | Publicar contenido nuevo según requerimientos CLC | Según demanda |
| 4.8 | Reunión de cierre de transición con CLC | 1 vez (fin de semana 8) |
| 4.9 | Documentar lecciones aprendidas | 1 vez al finalizar |
| 4.10 | Entregar reporte de transición a CLC | 1 vez al finalizar |

### Criterios de Éxito Post-Cutover

| Métrica | Objetivo | Período |
|---------|----------|---------|
| Uptime de pantallas | >= 99.5% | Semanas 5-8 |
| Pantallas en negro (total acumulado) | 0 | Semanas 5-8 |
| Incidentes críticos | 0 | Semanas 5-8 |
| Tiempo de resolución de incidentes | < 4 horas | Semanas 5-8 |
| Satisfacción CLC (reunión de cierre) | Aprobación para continuar | Semana 8 |

---

## Plan de Comunicación

### Stakeholders y Canales

| Stakeholder | Contacto | Canal | Frecuencia durante transición |
|-------------|----------|-------|-------------------------------|
| CLC IT | [nombre] — [tel/email] | WhatsApp + email | Diario durante operación paralela, cada hora durante cutover |
| CLC Administración | [nombre] — [tel/email] | Email + reuniones | Semanal |
| Proveedor actual | [nombre] — [tel/email] | Email formal (con copia a CLC) | Al inicio, durante cutover si rollback |
| Equipo Belgrano | [nombres] | WhatsApp grupo | Continuo |

### Comunicaciones Clave

| Momento | Mensaje | Destinatario | Responsable |
|---------|---------|--------------|-------------|
| Inicio Fase 1 | "Iniciamos proceso de transición. Fase de preparación en curso." | CLC Administración | Belgrano |
| Inicio Fase 2 | "Belgrano comenzará a operar en paralelo. El servicio actual no se interrumpe." | CLC IT + Administración | Belgrano |
| 48h antes de cutover | "Cutover programado para [domingo] a las 06:00. Equipo Belgrano estará en sitio." | CLC IT | Belgrano |
| Cutover exitoso | "Transición completada exitosamente. Belgrano opera las 70 pantallas." | CLC Administración + IT | Belgrano |
| Cutover con rollback | "Se detectaron problemas. Activamos plan de contingencia. Servicio no interrumpido." | CLC IT + Administración | Belgrano |
| Cierre de transición | "Período de estabilización completado. Reporte de transición adjunto." | CLC Administración | Belgrano |

### Escalamiento

| Nivel | Situación | Quién decide | Tiempo máximo |
|-------|-----------|-------------|---------------|
| L1 | 1-5 pantallas con problemas menores | Técnico Belgrano en sitio | 2 horas |
| L2 | 6+ pantallas o problema de servidor | Lead Belgrano + CLC IT | 1 hora |
| L3 | Servicio degradado significativamente | Gerencia Belgrano + CLC Administración | 30 minutos |

---

## Mitigación de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación | Plan B |
|--------|-------------|---------|------------|--------|
| Proveedor actual no coopera con la transición | MEDIA | ALTO | Involucrar a CLC como intermediario contractual; el contrato CLC-proveedor obliga entrega de accesos | Comprar nuevas licencias + configurar desde cero (más lento pero independiente) |
| Pantallas se desconectan durante cutover | MEDIA | ALTO | Contenido de fallback pre-cargado; cutover en domingo | Rollback Nivel 1 |
| Servidor MagicInfo falla durante cutover | BAJA | CRÍTICO | Backup 24h antes; equipo CLC IT en standby | Rollback Nivel 3 — restaurar backup |
| Red CLC bloquea el acceso de Belgrano | BAJA | ALTO | Pre-validar acceso VPN/firewall en Fase 1 | Operar desde dentro de la red CLC temporalmente |
| CLC pierde confianza durante la transición | BAJA | CRÍTICO | Comunicación proactiva; nunca pantallas en negro | Ofrecer extensión de operación paralela sin costo |
| Licencias resultan ser del proveedor | MEDIA | ALTO | Detectar en auditoría (Fase 1); negociar transferencia | Presupuestar compra de nuevas licencias (~EUR 165-446/pantalla) |
| Firmware de pantallas incompatible con V9 | BAJA | MEDIO | Catalogar modelos y Tizen en auditoría | Excluir pantallas incompatibles de la gestión avanzada |

---

## Checklist General de Transición

### Pre-Transición (todas deben estar en OK antes de avanzar)
- [ ] Auditoría técnica completada (`audit-checklist.md`)
- [ ] Catálogo de 70 pantallas completado (`screen-catalog-template.md`)
- [ ] Servidor MagicInfo parcheado (si aplicaba)
- [ ] Credenciales admin de Belgrano creadas y verificadas
- [ ] Contenido de fallback preparado y probado
- [ ] Backup del servidor realizado
- [ ] Proveedor actual notificado
- [ ] Ventana de cutover acordada con CLC

### Operación Paralela
- [ ] Semana 1-2: Monitoreo y documentación completada
- [ ] Semana 3-4: 10-15 pantallas gestionadas por Belgrano sin incidentes
- [ ] Métricas de éxito cumplidas
- [ ] Reunión de avance con CLC realizada
- [ ] Fecha de cutover confirmada

### Cutover
- [ ] Backup T-24h realizado
- [ ] Contenido de fallback verificado
- [ ] Equipo en sitio
- [ ] Cambio de credenciales ejecutado
- [ ] 70 pantallas verificadas post-cutover
- [ ] Cutover declarado exitoso (o rollback ejecutado)

### Post-Cutover
- [ ] 4 semanas de monitoreo intensivo completadas
- [ ] Cero pantallas en negro acumuladas
- [ ] Reunión de cierre con CLC realizada
- [ ] Reporte de transición entregado
- [ ] Transición declarada oficialmente completa

---

**Plan elaborado por:** Belgrano Digital
**Fecha:** 2026-03-23
**Versión:** 1.0
**Próxima revisión:** Después de completar auditoría técnica

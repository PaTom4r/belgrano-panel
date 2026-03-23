# Guía de Remediación CVE-2024-7399 — MagicInfo Server

**Proyecto:** Belgrano Digital — Seguridad MagicInfo CLC
**Fecha de creación:** 2026-03-23
**Criticidad:** MÁXIMA (CVSS 9.8) — ejecutar antes de cualquier integración

---

## Descripción de la Vulnerabilidad

### CVE-2024-7399: Ejecución Remota de Código sin Autenticación

| Campo | Detalle |
|-------|---------|
| **CVE** | CVE-2024-7399 |
| **CVSS** | 9.8 / 10.0 (Crítico) |
| **Tipo** | Pre-authentication Remote Code Execution (RCE) |
| **Componente afectado** | Samsung MagicINFO 9 Server — endpoint de upload de archivos |
| **Vector de ataque** | Red (no requiere acceso físico ni credenciales) |
| **Explotación activa** | SI — botnets Mirai están explotando activamente esta vulnerabilidad |
| **Complejidad** | BAJA — exploit público disponible, automatizado por botnets |

### Qué permite al atacante

Un atacante **sin credenciales** puede:
1. Subir un archivo JSP malicioso al servidor a través del endpoint de upload
2. El archivo se ejecuta con los privilegios del servidor MagicInfo
3. Obtener control total del servidor (shell remoto)
4. Desde ahí: acceder a la red interna de CLC, robar datos, instalar malware persistente

### Por qué es particularmente grave en CLC

- El servidor MagicInfo está dentro de la **red de un hospital** — un compromiso puede afectar sistemas clínicos
- El servidor contiene configuraciones de **70 pantallas** que podrían ser usadas para mostrar contenido malicioso
- Las redes hospitalarias son **objetivo prioritario** de ransomware y botnets
- Si el panel web está expuesto a internet, el servidor **probablemente ya está comprometido**

### CVE Adicional: CVE-2025-4632

Samsung emitió un parche posterior para una vulnerabilidad de path traversal relacionada. Asegurarse de que el servidor también esté protegido contra esta.

---

## Versiones Afectadas

| Versión MagicInfo | Estado | Acción |
|-------------------|--------|--------|
| V9 < 21.1050 | VULNERABLE | Actualizar a 21.1050+ inmediatamente |
| V9 >= 21.1050 | PARCHEADO (CVE-2024-7399) | Verificar también CVE-2025-4632 |
| V9 >= 21.1060 | PARCHEADO (ambos CVE) | Seguro |
| V8 (cualquier versión) | END OF LIFE | Migrar a V9 21.1060+ |
| V7 (cualquier versión) | END OF LIFE | Migrar secuencialmente: V7 -> V8 -> V9 |

**Version segura mínima recomendada:** 21.1060 (cubre ambos CVE)

---

## Procedimiento de Parchado

### Paso 0: Evaluación Inicial (30 minutos)

Antes de tocar nada, determinar el punto de partida.

1. **Verificar la versión actual:**
   - Acceder al panel web: `http://[IP-servidor]:7001/MagicInfo`
   - Ir a: Settings > Server Management > License Info
   - Anotar la versión exacta (ej: 21.1020, 20.1040, etc.)

2. **Determinar la ruta de actualización:**

   | Si la versión actual es... | Ruta de actualización |
   |---------------------------|----------------------|
   | V9 21.10XX (pero < 21.1050) | Directo a 21.1060 |
   | V8 20.10XX | Primero a V8 20.1040, luego a V9 21.1060 |
   | V7 | V7 -> V8 20.1040 -> V9 21.1060 |
   | No sé la versión | Ver la pantalla de login — el branding indica V7/V8/V9 |

3. **Verificar requisitos del servidor:**
   - OS: Windows 11 Pro o Windows Server 2019+
   - RAM: 8 GB mínimo
   - Disco: 10 GB libres para la actualización
   - PostgreSQL: se actualiza junto con MagicInfo

### Paso 1: Backup Completo (1-2 horas)

**CRÍTICO: No saltarse este paso.** Si la actualización falla, el backup es la única forma de recuperar.

1. **Backup de la base de datos PostgreSQL:**
   ```
   # En el servidor, abrir cmd como administrador
   # Ubicar pg_dump (típicamente en C:\Program Files\MagicInfo Premium\postgres\bin\)

   cd "C:\Program Files\MagicInfo Premium\postgres\bin"
   pg_dump -U magicinfo -F c -b -v -f "C:\backup\magicinfo_db_backup.dump" magicinfo
   ```

2. **Backup de archivos del servidor:**
   - Copiar la carpeta completa de MagicInfo: `C:\Program Files\MagicInfo Premium\`
   - Copiar la carpeta de contenido: verificar ubicación en Settings > Storage
   - Copiar la carpeta de configuración: `C:\MagicInfoPremium\` (si existe)

3. **Backup de configuración de red:**
   - Exportar reglas de firewall de Windows
   - Documentar IP estática del servidor, gateway, DNS

4. **Verificar que el backup es restaurable:**
   - Verificar tamaño del archivo dump (debe ser > 0 bytes)
   - Verificar que los archivos copiados están completos

5. **Guardar el backup fuera del servidor** (USB externo o red compartida)

### Paso 2: Preparar la Actualización (30 minutos)

1. **Descargar el instalador correcto:**
   - Ir a: [Samsung MagicInfo Downloads](https://www.samsung.com/displaysolutions/magicinfo/) o portal de socios Samsung
   - Descargar MagicInfo 9 Server versión 21.1060 o superior
   - Verificar el hash del instalador (si Samsung lo proporciona)

2. **Notificar a CLC IT:**
   - "Vamos a actualizar el servidor MagicInfo. Durante la actualización (~30-60 min), las pantallas seguirán mostrando su contenido actual pero no podremos hacer cambios."
   - Coordinar ventana de mantenimiento (idealmente fuera de horario laboral)

3. **Verificar que no hay tareas programadas en MagicInfo:**
   - No ejecutar durante un push de contenido programado
   - Verificar que no hay uploads en curso

### Paso 3: Ejecutar la Actualización (30-60 minutos)

**Ventana recomendada:** Sábado o domingo temprano (antes de las 8 AM)

1. **Detener el servicio MagicInfo:**
   ```
   # En cmd como administrador
   net stop "MagicInfo Premium Server"
   ```

2. **Ejecutar el instalador:**
   - Ejecutar el .exe descargado como administrador
   - Seleccionar "Upgrade" (no "New Installation")
   - Seguir las instrucciones del instalador
   - El instalador actualizará PostgreSQL si es necesario
   - **NO cambiar** la ruta de instalación durante el upgrade

3. **Esperar a que complete:**
   - El proceso puede tomar 15-45 minutos dependiendo del tamaño de la base de datos
   - No interrumpir ni apagar el servidor durante este proceso

4. **Iniciar el servicio:**
   ```
   net start "MagicInfo Premium Server"
   ```

5. **Esperar 5 minutos** para que el servidor inicialice completamente

### Paso 4: Verificación Post-Parche (30 minutos)

| # | Verificación | Resultado | Notas |
|---|-------------|-----------|-------|
| 4.1 | Acceder al panel web | ☐ OK / ☐ Falla | |
| 4.2 | Verificar nueva versión en License Info | ☐ >= 21.1050 | Versión: __________ |
| 4.3 | Verificar que los 70 dispositivos aparecen | ☐ OK / ☐ Faltan | Conectados: __________ |
| 4.4 | Verificar que las pantallas muestran contenido | ☐ OK / ☐ Problemas | |
| 4.5 | Verificar que los schedules/playlists están intactos | ☐ OK / ☐ Falta contenido | |
| 4.6 | Probar publicar contenido nuevo en 1 pantalla de prueba | ☐ OK / ☐ Falla | |
| 4.7 | Verificar acceso a la API (si estaba habilitada) | ☐ OK / ☐ Falla | |
| 4.8 | Revisar logs del servidor por errores | ☐ Sin errores / ☐ Con errores | |

**Si la verificación falla:** Ver sección "Rollback de Emergencia" abajo.

### Paso 5: Hardening Post-Parche (1 hora)

Después de parchear, aplicar estas medidas de seguridad adicionales:

1. **Restringir acceso al panel web por IP:**
   ```
   # Firewall de Windows — solo permitir acceso desde IPs autorizadas al puerto 7001/7002
   netsh advfirewall firewall add rule name="MagicInfo-Admin-Belgrano" ^
     dir=in action=allow protocol=tcp localport=7001,7002 ^
     remoteip=[IP-BELGRANO],[IP-CLC-IT]

   netsh advfirewall firewall add rule name="MagicInfo-Admin-Block-All" ^
     dir=in action=block protocol=tcp localport=7001,7002
   ```
   (La regla allow tiene prioridad sobre block si se agrega primero)

2. **Cambiar credenciales por defecto:**
   - Cambiar password de admin en MagicInfo
   - Cambiar password de PostgreSQL si es el default
   - Documentar nuevas credenciales en gestor seguro (1Password, Bitwarden)

3. **Deshabilitar acceso desde internet:**
   - Si el panel web era accesible desde internet: cerrar el puerto en el router/firewall perimetral de CLC
   - Acceso remoto solo via VPN

4. **Habilitar logs de auditoría:**
   - Settings > Log Management > habilitar todos los logs
   - Configurar retención de logs a 12 meses mínimo

5. **Deshabilitar cuentas innecesarias:**
   - Eliminar o deshabilitar cuentas de usuarios que ya no necesitan acceso
   - Especialmente cuentas del proveedor anterior

---

## Ruta de Migración V8 a V9

Si el servidor está en MagicInfo V8, la actualización es más compleja pero sigue siendo obligatoria (V8 es End of Life).

### Pre-requisitos para V8 -> V9

- V8 debe estar en la última versión (20.1040) antes de migrar a V9
- Si V8 está en una versión anterior a 20.1040: primero actualizar dentro de V8

### Ruta Secuencial

```
Estado actual           Paso 1                    Paso 2                    Estado final
V8 < 20.1040     -->   V8 20.1040          -->   V9 21.1060          -->   Seguro
V8 20.1040        -->   (skip)              -->   V9 21.1060          -->   Seguro
V7 cualquiera     -->   V8 20.1040          -->   V9 21.1060          -->   Seguro
```

### Proceso V8 -> V9

1. **Actualizar firmware de TODAS las pantallas primero:**
   - V9 requiere firmware actualizado en los dispositivos
   - En MagicInfo V8: Device > Firmware Update > seleccionar todas > actualizar
   - Hacer esto en grupos de 10-15 pantallas para no saturar la red
   - Verificar que cada grupo actualiza exitosamente antes del siguiente

2. **Actualizar V8 a 20.1040** (si no está ya):
   - Descargar patch V8 20.1040
   - Seguir el mismo proceso de backup + upgrade de Paso 1-4

3. **Migrar V8 20.1040 a V9 21.1060:**
   - Descargar instalador V9 21.1060
   - Ejecutar el instalador — detectará la instalación V8 y ofrecerá migración
   - La migración incluye actualización de PostgreSQL (puede tomar más tiempo)
   - Seguir pasos 1-5 del procedimiento principal

4. **Re-verificar dispositivos:**
   - Después de V9, verificar que los 70 dispositivos reconectan
   - Algunos pueden necesitar reconexión manual desde el menú del TV

**Tiempo estimado V8 -> V9:** 4-8 horas (incluyendo firmware de pantallas)
**Ventana recomendada:** Fin de semana completo (sábado AM para firmware, domingo AM para servidor)

---

## Rollback de Emergencia

Si la actualización falla y el servidor no funciona:

### Rollback Rápido (< 30 min)

1. Detener el servicio MagicInfo:
   ```
   net stop "MagicInfo Premium Server"
   ```

2. Restaurar archivos del backup:
   ```
   # Renombrar la instalación actual
   ren "C:\Program Files\MagicInfo Premium" "MagicInfo Premium_failed"

   # Copiar el backup
   xcopy "D:\backup\MagicInfo Premium" "C:\Program Files\MagicInfo Premium" /E /H
   ```

3. Restaurar la base de datos:
   ```
   cd "C:\Program Files\MagicInfo Premium\postgres\bin"
   pg_restore -U magicinfo -d magicinfo -c "C:\backup\magicinfo_db_backup.dump"
   ```

4. Iniciar el servicio:
   ```
   net start "MagicInfo Premium Server"
   ```

5. Verificar que los dispositivos reconectan

### Si el Rollback Falla

1. Contactar soporte Samsung MagicInfo (requiere contrato de soporte o licencia activa)
2. Mientras tanto: las pantallas deberían seguir mostrando el último contenido cargado o el fallback local
3. **No entrar en pánico** — las pantallas no dependen del servidor para mostrar contenido ya cargado

---

## Verificación de Compromiso Previo

Si el servidor estaba en una versión vulnerable Y el panel web era accesible desde internet, asumir que puede estar comprometido.

### Indicadores de Compromiso (IoC)

| Qué buscar | Dónde | Comando/Ubicación |
|-------------|-------|-------------------|
| Archivos JSP sospechosos | Carpeta de uploads MagicInfo | `dir /s *.jsp` en la carpeta MagicInfo |
| Procesos desconocidos | Task Manager / cmd | `tasklist` — buscar procesos no reconocidos |
| Conexiones de red sospechosas | cmd | `netstat -an` — buscar conexiones a IPs desconocidas |
| Tareas programadas no autorizadas | Task Scheduler | Revisar tareas creadas recientemente |
| Usuarios nuevos en el sistema | cmd | `net user` — verificar que no hay usuarios desconocidos |
| Archivos modificados recientemente | Carpeta MagicInfo | `forfiles /P "C:\Program Files\MagicInfo Premium" /D -7 /S /C "cmd /c echo @path @fdate"` |

### Si se Encuentran Indicadores de Compromiso

1. **Aislar el servidor de la red inmediatamente** (desconectar cable de red)
2. **Notificar a CLC IT** — esto es un incidente de seguridad en la red del hospital
3. **No borrar evidencia** — los logs y archivos sospechosos pueden ser necesarios para análisis forense
4. **Considerar reinstalación limpia** del servidor MagicInfo en vez de intentar limpiar
5. **Cambiar TODAS las credenciales** que el servidor tenía acceso (DB, red, admin)
6. **Verificar otros sistemas en la red** — el atacante puede haberse movido lateralmente

---

## Contactos de Soporte

| Recurso | Contacto |
|---------|----------|
| Samsung MagicInfo Support | [Portal de soporte Samsung Business](https://www.samsung.com/business/support/) |
| Samsung Security Advisory | [Samsung Security](https://security.samsungmobile.com/) |
| MagicInfo Services (reseller) | [magicinfoservices.com/support](https://www.magicinfoservices.com/support) |
| CLC IT (emergencias) | [completar con contacto real] |

---

## Checklist Resumen

- [ ] Versión actual del servidor verificada
- [ ] Ruta de actualización determinada (directa o V8->V9)
- [ ] Backup completo realizado y verificado
- [ ] Ventana de mantenimiento coordinada con CLC IT
- [ ] Actualización ejecutada exitosamente
- [ ] Versión post-parche >= 21.1050 (idealmente 21.1060)
- [ ] 70 dispositivos reconectados y mostrando contenido
- [ ] Hardening post-parche aplicado (firewall, credenciales, logs)
- [ ] Verificación de compromiso previo realizada
- [ ] Documentación actualizada con nueva versión

---

**Elaborado por:** Belgrano Digital
**Fecha:** 2026-03-23
**Versión:** 1.0
**Fuentes:** Samsung CVE-2024-7399 advisory, MagicInfo V9 release notes, Huntress rapid response analysis

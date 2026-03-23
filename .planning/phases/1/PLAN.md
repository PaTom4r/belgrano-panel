---
phase: "1"
plan: "1"
type: documentation
autonomous: true
wave: 1
depends_on: []
requirements: [AUDIT-01, AUDIT-02, AUDIT-03, AUDIT-04]
---

# Phase 1 Plan 1: Technical Audit & Handover Documentation

## Objective

Crear la documentación operativa completa que el equipo de Belgrano necesita para ejecutar la auditoría técnica, catalogar las 70 pantallas, parchear el servidor MagicInfo, y ejecutar la transición zero-downtime en CLC.

## Context

- @.planning/research/SUMMARY.md — Resumen de investigación del proyecto
- @.planning/research/PITFALLS.md — Pitfalls identificados (CVE-2024-7399, licencias, transición)
- @.planning/REQUIREMENTS.md — AUDIT-01 a AUDIT-04
- @.planning/ROADMAP.md — Phase 1 success criteria

## Tasks

### Task 1: Audit Checklist
type="auto"

Crear `docs/audit-checklist.md` con checklist completo para la visita técnica a CLC:
- Verificación de versión del servidor MagicInfo
- Auditoría de licencias (Lite vs Premium, propiedad)
- Inventario de credenciales de administración
- Topología de red (servidor, puertos, firewall, VPN)
- Plan de prueba de accesibilidad API
- Evaluación de vulnerabilidad CVE-2024-7399
- Verificación de hardware del servidor

### Task 2: Screen Catalog Template
type="auto"

Crear `docs/screen-catalog-template.md` con template para catalogar 70 pantallas:
- Tabla con campos: ID, Modelo, Tizen, Ubicación, Zona, Orientación, Resolución, Conexión, Licencia, Estado, Notas
- Clasificación de zonas propuesta (salas de espera, recepción, pasillos, urgencias, pediatría, etc.)
- Instrucciones detalladas para el recorrido en terreno
- Secciones de resumen post-catalogación

### Task 3: Transition Plan
type="auto"

Crear `docs/transition-plan.md` con plan de transición zero-downtime:
- Timeline en 4 fases (pre-transición, operación paralela 2-4 semanas, cutover, post-cutover)
- Estrategia de contenido de fallback
- Protocolo de cutover (domingo 6 AM)
- Procedimiento de rollback (3 niveles)
- Plan de comunicación (CLC IT, proveedor actual, equipo Belgrano)
- Mitigación de riesgos
- Criterios de éxito por fase

### Task 4: Security Patch Guide
type="auto"

Crear `docs/security-patch-guide.md` con guía de remediación CVE-2024-7399:
- Descripción de la vulnerabilidad (pre-auth RCE, CVSS 9.8)
- Versiones afectadas y versión segura mínima
- Procedimiento de parchado paso a paso (backup, actualización, verificación, hardening)
- Ruta de migración V8 -> V9 (si aplica)
- Procedimiento de rollback de emergencia
- Verificación de compromiso previo (IoC)

## Verification

- [ ] `docs/audit-checklist.md` existe y tiene las 7 secciones de auditoría
- [ ] `docs/screen-catalog-template.md` existe con tabla para 70 pantallas y clasificación de zonas
- [ ] `docs/transition-plan.md` existe con las 4 fases y protocolo de rollback
- [ ] `docs/security-patch-guide.md` existe con procedimiento de parchado y ruta V8->V9

## Success Criteria

Belgrano tiene documentación operativa lista para ejecutar en terreno: un checklist para la auditoría inicial, un template para catalogar las 70 pantallas, un plan de transición con rollback, y una guía de parchado de seguridad.

## Output

- `docs/audit-checklist.md`
- `docs/screen-catalog-template.md`
- `docs/transition-plan.md`
- `docs/security-patch-guide.md`

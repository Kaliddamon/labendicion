#!/usr/bin/env pwsh
# Script de Verificación Post-Deploy
# Ejecutar en PowerShell después de desplegar cambios en Render + Supabase

param(
    [string]$BackendUrl = "https://labendicion-be.onrender.com"
)

Write-Host "🔍 Verificando Optimizaciones de Performance..." -ForegroundColor Cyan
Write-Host "Backend: $BackendUrl`n"

# Test 1: Bootstrap Response Time
Write-Host "Test 1️⃣: Tiempo de Bootstrap" -ForegroundColor Yellow
$sw = Measure-Command {
    $response = Invoke-WebRequest -Uri "$BackendUrl/api/frontend/bootstrap" -TimeoutSec 30
    $json = $response.Content | ConvertFrom-Json
}

Write-Host "  ✓ Status: $($response.StatusCode)" -ForegroundColor Green
Write-Host "  ✓ Tiempo: $([Math]::Round($sw.TotalMilliseconds, 0))ms"

# Validar que tiene datos
$productosCount = $json.productos.Count
$registrosCount = $json.registros.Count
$empresasCount = $json.empresas.Count
$empleadosCount = $json.empleados.Count
$tareasCount = $json.tareasAseo.Count

Write-Host "  ✓ Productos: $productosCount"
Write-Host "  ✓ Registros (limitado a 100): $registrosCount"
Write-Host "  ✓ Empresas: $empresasCount"
Write-Host "  ✓ Empleados: $empleadosCount"
Write-Host "  ✓ Tareas: $tareasCount`n"

# Test 2: Validar estructura de pasos
Write-Host "Test 2️⃣: Estructura de Pasos" -ForegroundColor Yellow
if ($productosCount -gt 0) {
    $primerProducto = $json.productos[0]
    $tienePatsos = $null -ne $primerProducto.pasos
    $pasosCount = $primerProducto.pasos.Count

    if ($tienePatsos) {
        Write-Host "  ✓ Primer producto ($($primerProducto.nombre)) tiene $pasosCount pasos" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Primer producto NO tiene pasos (OK si es reciente)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ Sin productos para validar" -ForegroundColor Yellow
}

# Test 3: Tamaño del response
Write-Host "`nTest 3️⃣: Tamaño de Response" -ForegroundColor Yellow
$jsonLength = $response.Content.Length
$jsonSizeMB = [Math]::Round($jsonLength / 1MB, 2)
Write-Host "  ✓ Tamaño: $($jsonLength) bytes (~${jsonSizeMB}MB)" -ForegroundColor Green

if ($jsonLength -gt 10MB) {
    Write-Host "  ⚠ Response muy grande (>10MB). Considera limitar registros" -ForegroundColor Yellow
} elseif ($jsonLength -lt 1MB) {
    Write-Host "  ✓ Tamaño optimizado (<1MB)" -ForegroundColor Green
}

# Test 4: Tiempos en rango esperado
Write-Host "`nTest 4️⃣: Evaluación de Performance" -ForegroundColor Yellow
$tiempoMs = $sw.TotalMilliseconds

if ($tiempoMs -lt 1000) {
    Write-Host "  🚀 EXCELENTE: < 1s" -ForegroundColor Green
} elseif ($tiempoMs -lt 2000) {
    Write-Host "  ✓ BUENO: 1-2s" -ForegroundColor Green
} elseif ($tiempoMs -lt 5000) {
    Write-Host "  ⚠ ACEPTABLE: 2-5s (revisa índices en BD)" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ LENTO: > 5s (problema detectado)" -ForegroundColor Red
}

Write-Host "`n"
Write-Host "✅ Verificación completada" -ForegroundColor Green
Write-Host "Usa DevTools (F12) → Network para medir tiempos en navegador" -ForegroundColor Cyan


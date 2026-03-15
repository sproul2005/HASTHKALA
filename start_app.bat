@echo off
echo ==========================================
echo   Starting HASTHKALA E-Commerce Platform
echo ==========================================

echo Starting Backend Server...
start "Hasthkala Backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend Server...
start "Hasthkala Frontend" cmd /k "cd frontend && npm run dev"

echo ==========================================
echo   Servers are launching in new windows!
echo   Frontend will be at: http://localhost:5173
echo ==========================================
pause

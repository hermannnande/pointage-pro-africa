@echo off
echo ========================================
echo   DEPLOIEMENT - POINTAGE PRO AFRICA
echo ========================================
echo.

echo [1/4] Preparation du Dashboard...
cd web-dashboard
call npm run build
cd ..

echo.
echo [2/4] Verification du backend...
cd backend
call composer install --no-dev --optimize-autoloader
cd ..

echo.
echo [3/4] Fichiers prets pour le deploiement!
echo.
echo ========================================
echo   PROCHAINES ETAPES
echo ========================================
echo.
echo 1. Dashboard (Vercel):
echo    - Aller sur https://vercel.com
echo    - Importer le projet
echo    - Deployer automatiquement
echo.
echo 2. Backend (Railway):
echo    - Aller sur https://railway.app
echo    - Creer un nouveau projet
echo    - Ajouter MySQL
echo    - Deployer le backend
echo.
echo 3. Configurer les variables d'environnement
echo    (voir GUIDE_DEPLOIEMENT.md)
echo.
echo ========================================
echo   Appuyez sur une touche pour continuer...
pause > nul


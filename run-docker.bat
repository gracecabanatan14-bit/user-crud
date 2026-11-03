@echo off
setlocal
cd /d "%~dp0"

docker info >nul 2>&1
if errorlevel 1 (
  echo Docker is not running. Open Docker Desktop and wait for Engine running.
  pause
  exit /b 1
)

docker stop ionic-firestore-crud-container >nul 2>&1
docker rm ionic-firestore-crud-container >nul 2>&1

echo Building the app image...
docker build -t ionic-firestore-crud .
if errorlevel 1 (
  echo Docker image build failed.
  pause
  exit /b 1
)

echo Starting the app container...
docker run -d --name ionic-firestore-crud-container -p 8100:8100 ionic-firestore-crud
if errorlevel 1 (
  echo Container failed to start. Check whether port 8100 is already in use.
  pause
  exit /b 1
)

echo Waiting for the Ionic app to finish starting...
ping -n 31 127.0.0.1 >nul
echo App is running at http://localhost:8100
start "" "http://localhost:8100"
endlocal

# Prueba Técnica - Gometrixs

## Requisitos

- Docker y Docker Compose instalados
- PNPM instalado globalmente (`npm i -g pnpm`)

## Cómo iniciar el proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/JoseLCT/prueba-tecnica-gometrixs.git
   cd prueba-tecnica-gometrixs
   ```
2. Crea un archivo `.env` basado en el archivo `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Levanta los servicios:
   ```bash
   docker compose up --build
   ```
4. Accede a la app en: [http://localhost:3000](http://localhost:3000)

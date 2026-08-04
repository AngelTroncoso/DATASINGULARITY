# DATA SINGULARITY 🧬

**Motor de Inteligencia Organizacional Científico impulsado por DataHub y Gemini AI**

> "Cuando los metadatos dejan de describir el pasado y comienzan a predecir el futuro."

## 🏆 Hackathon Integration

Este proyecto se conecta con una instancia local de **DataHub** desplegada con Docker Compose para explorar el valor de la plataforma de metadatos.

### Arquitectura de Integración

```
┌──────────────────────────────────────────────────────────────────┐
│                    DATA SINGULARITY (React + Vite)              │
│                                                                  │
│  ┌──────────────┐    ┌────────────────┐    ┌─────────────────┐  │
│  │ Header       │    │  Universe      │    │  Oracle AI      │  │
│  │ DataHub      │    │  Canvas (real  │    │  Chat (Gemini)  │  │
│  │ Status Badge │    │  DataHub data) │    │                 │  │
│  └──────┬───────┘    └───────┬────────┘    └────────┬────────┘  │
│         │                    │                      │           │
│         └──────────────┬─────┴──────────────────────┘           │
│                        │                                        │
│                 Express Server (Node.js)                        │
│                 /api/datahub/* endpoints                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │ GraphQL + REST
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                    DATAHUB LOCAL (Docker)                        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │ Frontend │  │ GMS API  │  │ MySQL    │  │ Elasticsearch   │  │
│  │ :9002    │  │ :8080    │  │ :3306    │  │ :9200           │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │ Neo4j    │  │ Kafka    │  │ ZooKeeper│  │ Schema Registry │  │
│  │ :7474    │  │ :9092    │  │ :2181    │  │ :8081           │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Levantar DataHub Local (Docker)

```bash
# Desde la carpeta DATASINGULARITY
docker compose up -d

# Verificar que DataHub está saludable (esperar ~2-3 min)
curl http://localhost:8080/health

# Abrir la interfaz de DataHub
# http://localhost:9002 (usuario: datahub, contraseña: datahub)
```

### 2. Ingresar los datos del repositorio a DataHub

```bash
# Ejecutar el script de ingesta de metadata
npm run datahub:ingest

# Esto creará 3 datasets en DataHub:
# 1. prod.finance.financial_transactions (CSV → datos financieros)
# 2. health.genomics.patient_genomics (JSON → datos genómicos)
# 3. saas.analytics.saas_subscriptions (XLSX → datos SaaS)
```

### 3. Configurar la API Key de Gemini (opcional)

```bash
# Editar el archivo .env y agregar tu clave
# GEMINI_API_KEY=tu-clave-aqui
```

### 4. Ejecutar la aplicación

```bash
npm run dev
# Abrir http://localhost:3000
```

## 🔑 Credenciales DataHub

| Servicio | URL | Usuario | Contraseña |
|----------|-----|---------|------------|
| DataHub UI | http://localhost:9002 | datahub | datahub |
| GMS API | http://localhost:8080 | - | - |
| Neo4j Browser | http://localhost:7474 | neo4j | datahub |
| MySQL | localhost:3306 | datahub | datahub |

## 🧪 Scripts Disponibles

```bash
npm run dev              # Iniciar servidor de desarrollo
npm run datahub:up       # Levantar DataHub con Docker
npm run datahub:down     # Apagar DataHub
npm run datahub:ingest   # Ingresar metadata del repo a DataHub
npm run datahub:status   # Verificar salud de DataHub GMS
npm run build            # Build de producción
npm run lint             # Verificación de tipos TypeScript
```

## 🔌 Endpoints API

### DataHub Integration
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/datahub/status` | GET | Estado de conexión con DataHub GMS |
| `/api/datahub/search` | POST | Buscar assets en DataHub y convertirlos a formato DataSingularity |
| `/api/datahub/ingest` | POST | Ejecutar script de ingesta de metadata |
| `/api/datahub/connect` | POST | Conexión directa GraphQL a DataHub |

### Oracle AI
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/oracle/analyze` | POST | Análisis científico multi-agente con Gemini |
| `/api/oracle/auto-govern` | POST | Generar documentación, tags y SLA automáticos |

## 🧬 Conceptos Científicos

### Los 7 Agentes

1. **Physics Agent** ⚡ - Análisis de linaje como campo de fuerzas
2. **Chemistry Agent** 🧪 - Compuestos de pipelines y reacciones de schema
3. **Entropy Agent** 📊 - Entropía de información y decaimiento de conocimiento
4. **Genome Agent** 🧬 - ADN digital, mutaciones y enfermedades de datos
5. **Chronos Agent** ⏰ - Simulación temporal y predicción futura
6. **Guardian Agent** 🛡️ - Gobernanza automatizada de DataHub
7. **Oracle Agent** ✨ - Orquestador central de IA científica

### Modelo de Datos

Cada asset de DataHub se enriquece con propiedades científicas:

- **Física**: masa, velocidad, momento, centralidad, tensión, blast radius
- **Química**: fórmula, ΔG, reactividad, toxicidad, fuerza de enlace
- **Matemáticas**: entropía de Shannon, clustering, probabilidad de falla bayesiana
- **Genoma**: secuencia ADN, tasa de mutación, duplicados, vestigiales

## 📂 Estructura del Proyecto

```
DATASINGULARITY/
├── docker-compose.yml          # DataHub local + infraestructura
├── .env                        # Variables de entorno
├── server.ts                   # Express server + API endpoints
├── scripts/
│   └── ingest_to_datahub.ts    # Script de ingesta de metadata
├── src/
│   ├── services/
│   │   └── datahub.ts          # Cliente GraphQL de DataHub
│   ├── components/             # Componentes React
│   ├── data/
│   │   └── mockDataHubEcosystem.ts  # Mock data (fallback)
│   ├── App.tsx                 # Componente principal
│   ├── types.ts                # Tipos TypeScript
│   └── firebase.ts             # Configuración Firebase
└── data/
    ├── financial_transactions.csv
    ├── patient_genomics.json
    └── saas_subscriptions.xlsx
```

## 🌟 Demo para Hackathon

1. **Levantar todo**: `docker compose up -d` + `npm run dev`
2. **Ingerir datos**: `npm run datahub:ingest`
3. **Explorar**: Los 3 datasets aparecerán en DataHub UI (http://localhost:9002) Y en DataSingularity (http://localhost:3000)
4. **Simular**: Usar el Oracle Chat para simular cambios de esquema, escanear genomas digitales, o predecir entropía
5. **Gobernar**: Usar Guardian Agent para auto-generar documentación, SLA y tags de compliance en DataHub

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, Vite 6, TailwindCSS 4
- **Backend**: Node.js, Express
- **AI**: Gemini 3.6 Flash, @google/genai
- **Metadata**: DataHub (GMS, Frontend, Kafka, Neo4j, Elasticsearch)
- **Auth**: Firebase Auth + Firestore
# 🌌 DataSingularity
**Multi-Agent Data Intelligence Platform powered by DataHub**

[![DataHub](https://img.shields.io/badge/Metadata-DataHub-orange)](https://datahubproject.io)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TS-blue)](https://react.dev)
[![DataHub](https://img.shields.io/badge/Backend-Node.js%20%2B%20Firebase-yellow)](https://firebase.google.com)

---

## 🚀 Overview

**DataSingularity** es una plataforma de inteligencia de datos impulsada por IA que transforma múltiples fuentes de datos en un ecosistema gobernado, inteligente y manejable.

**Características:**
- 🤖 Orquestación de agentes de IA
- 📚 Catálogo de metadatos con DataHub
- 🔎 Descubrimiento y gobernanza de datos
- 📊 Ingesta multi-formato (CSV, JSON, Excel)
- 🧠 Razonamiento generativo y análisis

---

## 📋 Quick Start

### 1. Clonar y configurar
```bash
git clone https://github.com/AngelTroncoso/DATASINGULARITY.git
cd DATASINGULARITY
cp .env.example .env
npm install
```

### 2. Levantar DataHub (Docker)
```bash
docker compose up -d
```
✅ DataHub UI disponible en: http://localhost:9002
- **Usuario:** datahub
- **Contraseña:** datahub

### 3. Ingestar datos al catálogo
```bash
npm run datahub:ingest
```

### 4. Ejecutar aplicación
```bash
npm run dev
```
✅ App disponible en: http://localhost:3000

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────┐
│   DataSingularity UI (React)    │
├─────────────────────────────────┤
│      AI Agent Orchestrator      │
├─────────────────────────────────┤
│ Firebase API │ DataHub GraphQL  │
├─────────────────────────────────┤
│   Metadata Catalog + Lineage    │
└─────────────────────────────────┘
```

---

## 📦 Datos Soportados

| Formato | Ubicación | Descripción |
|---------|-----------|------------|
| **CSV** | `data/financial_transactions.csv` | Transacciones financieras |
| **JSON** | `data/patient_genomics.json` | Datos genómicos (semi-estructurados) |
| **Excel** | `data/saas_subscriptions.xlsx` | Métricas de negocio |

---

## 🔌 API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|------------|
| `/api/datahub/status` | GET | Verificar conexión DataHub |
| `/api/datahub/search` | POST | Buscar assets en el catálogo |
| `/api/datahub/ingest` | POST | Ejecutar ingesta de metadata |

---

## 🧬 Agentes Especializados

| Agente | Responsabilidad |
|--------|-----------------|
| **Explorer** | Descubrimiento de datasets |
| **Governance** | Validación de calidad de datos |
| **Analytics** | Análisis y insights automáticos |
| **Oracle** | Razonamiento IA y simulaciones |

---

## 📚 Stack Tecnológico

**Frontend:** React 18 • TypeScript • Vite • Tailwind CSS  
**Backend:** Node.js • Firebase • Express  
**Data:** DataHub • Neo4j • Elasticsearch  
**IA:** LLM APIs • RAG • Multi-agent Orchestration

---

## 🎯 Para la Hackathon

**Ventaja competitiva:** DataHub transforma DataSingularity de una app de IA a un **ecosistema gobernado de datos inteligentes**, permitiendo que los agentes razonen sobre el conocimiento empresarial.

**Demo rápida (5 min):**
1. Mostrar catálogo poblado en DataHub UI
2. Ejecutar búsqueda desde frontend
3. Demostrar análisis de agentes sobre datos reales

---

## 📖 Documentación

- DataHub GraphQL API: http://localhost:8080/graphiql
- DataHub UI: http://localhost:9002
- API local: http://localhost:3000/api

---

## 👨‍💻 Autor

**Ángel Troncoso**  
AI Engineer | Data Intelligence | Generative AI  
🇨🇱 Santiago, Chile

---

## 📝 Licencia

MIT

# DataSingularity Multi-Format DataHub Repository

Este repositorio está estructurado siguiendo las **buenas prácticas para repositorios multiformato** orientados a la integración continua e ingesta de metadatos en **DataHub**.

---

## 📁 Estructura del Repositorio

Para mantener un repositorio limpio y escalable, los archivos de datos se organizan exclusivamente dentro del directorio `/data/`, dejando los archivos de especificación y documentación en la raíz:

```text
/
├── README.md               # Documentación y directivas de integración
├── datapackage.yaml        # Especificación Frictionless Data & esquemas DataHub
└── data/                   # Subcarpeta de datos aislada
    ├── financial_transactions.csv  # Datos estructurados en formato CSV
    ├── patient_genomics.json       # Stream de registros semi-estructurados JSON
    └── saas_subscriptions.xlsx     # Hoja de cálculo multihoja Excel (.xlsx)
```

---

## ⚠️ Restricciones y Límites de Tamaño en GitHub

Al subir archivos de datos directamente a GitHub, debes tener en cuenta los siguientes límites oficiales de la plataforma:

1. **Límite por Archivo Individual:** Cada archivo dentro de `/data/` no debe superar los **100 MB**.
2. **Límite Total del Repositorio:** El tamaño acumulado de todo el repositorio debe ser **menor a 1 GB** (se recomienda mantenerlo por debajo de 500 MB para rendimiento óptimo en Git clone).
3. **Manejo de Archivos Grandes (Git LFS):** Si necesitas incluir datasets que superen los 100 MB, debes activar **Git Large File Storage (Git LFS)**:
   ```bash
   git lfs install
   git lfs track "data/*.csv" "data/*.xlsx" "data/*.json"
   git add .gitattributes
   ```

---

## 📄 Especificación `datapackage.yaml`

El archivo `datapackage.yaml` ubicado en la raíz actúa como el contrato de datos oficial (*Data Contract*) que DataHub interpreta para catalogar los URNs, tipos de campos, restricciones y descripciones automáticas.

### Resumen del Esquema Incluido:

- **`data/financial_transactions.csv`**: Esquema tabular con validación de tipos (`transaction_id`, `amount`, `status`, `risk_score`).
- **`data/patient_genomics.json`**: Estructura de secuencias genómicas con arrays de variantes y métricas de calidad Q30.
- **`data/saas_subscriptions.xlsx`**: Libro Excel de métricas MRR, renovaciones y contratos organizacionales.

---

## 🚀 Cómo Conectar este Repositorio con DataHub

1. **Ingesta mediante DataHub CLI / Recipe File:**
   ```yaml
   source:
     type: "file"
     config:
       filename: "./datapackage.yaml"
   sink:
     type: "datahub-rest"
     config:
       server: "http://your-datahub-gms:8080"
   ```

2. **Ingesta mediante la interfaz de DataSingularity / DataHub Proxy:**
   - Abre la aplicación **DataSingularity**.
   - Haz clic en **IMPORT / CONNECT** en el encabezado.
   - Selecciona la pestaña **Data Package Repository** para inspeccionar o copiar la plantilla `datapackage.yaml` o conectarte directamente.

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en' | 'zh';

export const TRANSLATIONS = {
  es: {
    header: {
      title: 'DATA SINGULARITY',
      subtitle: 'Motor de Inteligencia Organizacional',
      finance: 'Finanzas y Pagos',
      healthcare: 'Genómica de Salud',
      saas: 'Malla SaaS',
      assets: 'Activos',
      entropy: 'Entropía H',
      import: 'Importar',
      language: 'Idioma',
    },
    agentDeck: {
      networkTitle: 'RED DE INTELIGENCIA DE AGENTES CIENTÍFICOS // 7 SUBSISTEMAS ACTIVOS',
      resetFilter: 'RESETEAR FILTRO',
      inspectProof: 'Inspeccionar Prueba',
      status: {
        CRITICAL: 'Crítico',
        WARNING: 'Advertencia',
        ANALYZING: 'Analizando',
        OPTIMAL: 'Óptimo',
      },
    },
    chronos: {
      title: 'Motor de Línea de Tiempo Agente Chronos',
      subtitle: 'Rebobine el historial de linaje o avance en el tiempo +365 días para predecir la deriva de metadatos',
      forecastScenario: 'Pronóstico',
      scenarioDays: 'días',
      offsets: {
        m180: '-180 Días',
        p0: 'Presente (0d)',
        p30: '+30 Días',
        p90: '+90 Días',
        p365: '+365 Días',
      },
      descriptions: {
        m180: 'Línea de base histórica de linaje',
        p0: 'Estado de metadatos en tiempo real',
        p30: 'Cambio de esquema a corto plazo',
        p90: 'Volumen trimestral y entropía',
        p365: 'Proyección del ecosistema a 1 año',
      },
    },
    canvas: {
      perspective: 'Perspectiva',
      universe: 'UNIVERSO ORGANIZACIONAL',
      forecast: 'Pronóstico',
      zoomIn: 'Acercar',
      zoomOut: 'Alejar',
      resetView: 'Restablecer vista',
      mass: 'Masa',
      velocity: 'Velocidad',
      entropy: 'Entropía',
    },
    oracle: {
      title: 'Agente Oracle / Síntesis Central',
      subtitle: 'Orquestando Física, Química, Matemáticas y Gobernanza',
      presetScenarios: 'Escenarios Predeterminados:',
      userLabel: 'Ingeniero de Organización',
      oracleLabel: 'Motor Oracle AI',
      hypothesis: 'Hipótesis Científica',
      mathematicalProof: 'Prueba Matemática y Física:',
      diagnostics: 'Diagnóstico Multi-Agente',
      agentsReporting: 'Agentes Reportando',
      affectedUrns: 'URNs de DataHub Afectados:',
      governanceActions: 'Acciones Ejecutables de Gobernanza DataHub:',
      execute: 'Ejecutar',
      synthesizing: 'Agente Oracle sintetizando prueba científica de metadatos...',
      placeholder: 'Pida a Oracle simular cambios de esquema, escaneo genómico o entropía...',
      simulate: 'Simular',
    },
    inspector: {
      overview: 'Resumen',
      physics: 'Física',
      chemistry: 'Química',
      math: 'Matemáticas',
      genome: 'Genoma',
      datahubUrn: 'DataHub URN',
      description: 'Descripción',
      owner: 'Propietario',
      schemaFields: 'Campos de Esquema',
      tags: 'Etiquetas de Gobernanza DataHub',
      generateShield: 'Auto-Generar Escudo SLA',
      purgeVestigial: 'Purgar Apéndice Vestigial',
      columns: 'columnas',
      vestigialWarning: 'Apéndice Vestigial',
    },
    modal: {
      agentProfile: 'Perfil de Agente Científico DataHub',
      equationModel: 'Modelo de Ecuaciones Científicas y Matemáticas:',
      agentStatus: 'Estado del Agente',
      executeScan: 'Ejecutar Escaneo de Diagnóstico con',
      importTitle: 'Importar Metadatos Personalizados de DataHub',
      importSub: 'Pegue objetos de metadatos JSON / GraphQL de DataHub para modelar su propio ecosistema.',
      jsonInput: 'Entrada JSON de DataHub:',
      loadSample: 'Cargar Plantilla de Muestra',
      cancel: 'Cancelar',
      parseAnalyze: 'Parsear y Analizar',
    },
    welcomeMsg: `👋 Bienvenido a DATA SINGULARITY.
El laboratorio científico de inteligencia organizacional impulsado por DataHub y Gemini AI.

"Cuando los metadatos dejan de describir el pasado y comienzan a predecir el futuro."

Los 7 agentes científicos (Physics, Chemistry, Entropy, Genome, Chronos, Guardian y Oracle) han modelado el ecosistema de datos actual. Seleccione un escenario de simulación o formule una consulta científica sobre la infraestructura.`,
    presets: {
      p1: '🚨 Reacción de Deriva de Esquema',
      p2: '📉 Inestabilidad de Entropía',
      p3: '🧬 Purga Apéndice Vestigial',
      p4: '🔮 Simulación de Linaje Futuro (+90d)',
      p5: '🛡️ Auditoría de Protección de Privacidad',
    }
  },

  en: {
    header: {
      title: 'DATA SINGULARITY',
      subtitle: 'Organizational Intelligence Engine',
      finance: 'Finance & Payments',
      healthcare: 'Healthcare Genomics',
      saas: 'SaaS Mesh',
      assets: 'Assets',
      entropy: 'Entropy H',
      import: 'Import',
      language: 'Language',
    },
    agentDeck: {
      networkTitle: 'SCIENTIFIC AGENT INTELLIGENCE NETWORK // 7 SUBSYSTEMS ACTIVE',
      resetFilter: 'RESET FILTER',
      inspectProof: 'Inspect Proof',
      status: {
        CRITICAL: 'Critical',
        WARNING: 'Warning',
        ANALYZING: 'Analyzing',
        OPTIMAL: 'Optimal',
      },
    },
    chronos: {
      title: 'Chronos Agent Timeline Engine',
      subtitle: 'Rewind lineage history or fast-forward +365 days to predict metadata drift',
      forecastScenario: 'Forecast',
      scenarioDays: 'days',
      offsets: {
        m180: '-180 Days',
        p0: 'Present (0d)',
        p30: '+30 Days',
        p90: '+90 Days',
        p365: '+365 Days',
      },
      descriptions: {
        m180: 'Historical Lineage Baseline',
        p0: 'Real-Time Metadata State',
        p30: 'Near-Term Schema Shift',
        p90: 'Quarterly Volume & Entropy',
        p365: '1-Year Ecosystem Projection',
      },
    },
    canvas: {
      perspective: 'Perspective',
      universe: 'ORGANIZATIONAL UNIVERSE',
      forecast: 'Forecast',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      resetView: 'Reset View',
      mass: 'Mass',
      velocity: 'Velocity',
      entropy: 'Entropy',
    },
    oracle: {
      title: 'Oracle Agent / Central Synthesis',
      subtitle: 'Orchestrating Physics, Chemistry, Math & Governance',
      presetScenarios: 'Preset Scenarios:',
      userLabel: 'Organization Engineer',
      oracleLabel: 'Oracle AI Engine',
      hypothesis: 'Scientific Hypothesis',
      mathematicalProof: 'Mathematical & Physics Proof:',
      diagnostics: 'Multi-Agent Diagnostics',
      agentsReporting: 'Agents Reporting',
      affectedUrns: 'Affected DataHub URNs:',
      governanceActions: 'Executable DataHub Governance Actions:',
      execute: 'Execute',
      synthesizing: 'Oracle Agent synthesizing scientific metadata proof...',
      placeholder: 'Ask Oracle to simulate schema changes, genome scan, or entropy decay...',
      simulate: 'Simulate',
    },
    inspector: {
      overview: 'Overview',
      physics: 'Physics',
      chemistry: 'Chemistry',
      math: 'Math',
      genome: 'Genome',
      datahubUrn: 'DataHub URN',
      description: 'Description',
      owner: 'Owner',
      schemaFields: 'Schema Fields',
      tags: 'DataHub Governance Tags',
      generateShield: 'Auto-Generate SLA Shield',
      purgeVestigial: 'Purge Vestigial Appendix',
      columns: 'columns',
      vestigialWarning: 'Vestigial Appendix',
    },
    modal: {
      agentProfile: 'DataHub Scientific Agent Profile',
      equationModel: 'Mathematical & Scientific Equation Model:',
      agentStatus: 'Agent Status',
      executeScan: 'Execute Scan with',
      importTitle: 'Import Custom DataHub Metadata',
      importSub: 'Paste custom DataHub JSON / GraphQL metadata objects to model your own ecosystem.',
      jsonInput: 'DataHub JSON Input:',
      loadSample: 'Load Sample Template',
      cancel: 'Cancel',
      parseAnalyze: 'Parse & Analyze',
    },
    welcomeMsg: `👋 Welcome to DATA SINGULARITY.
The organizational intelligence scientific laboratory powered by DataHub and Gemini AI.

"When metadata stops describing the past and starts predicting the future."

The 7 scientific agents (Physics, Chemistry, Entropy, Genome, Chronos, Guardian, and Oracle) have modeled the current data ecosystem. Select a simulation scenario or ask a scientific query about the infrastructure.`,
    presets: {
      p1: '🚨 Schema Drift Reaction',
      p2: '📉 Entropy Instability',
      p3: '🧬 Purge Vestigial Appendix',
      p4: '🔮 Future Lineage Simulation (+90d)',
      p5: '🛡️ Privacy Protection Audit',
    }
  },

  zh: {
    header: {
      title: 'DATA SINGULARITY',
      subtitle: '组织智能引擎',
      finance: '金融与支付',
      healthcare: '医疗基因组学',
      saas: 'SaaS 服务网格',
      assets: '数据资产',
      entropy: '熵 H',
      import: '导入',
      language: '语言',
    },
    agentDeck: {
      networkTitle: '科学代理智能网络 // 7个子系统活跃',
      resetFilter: '重置筛选',
      inspectProof: '查看证明',
      status: {
        CRITICAL: '严重警告',
        WARNING: '风险预警',
        ANALYZING: '正在分析',
        OPTIMAL: '状态最佳',
      },
    },
    chronos: {
      title: 'Chronos 代理时间线引擎',
      subtitle: '重放血统历史或快进+365天以预测元数据漂移',
      forecastScenario: '预测',
      scenarioDays: '天',
      offsets: {
        m180: '-180 天',
        p0: '实时 (0天)',
        p30: '+30 天',
        p90: '+90 天',
        p365: '+365 天',
      },
      descriptions: {
        m180: '历史血统基线',
        p0: '实时元数据状态',
        p30: '近期模式偏移',
        p90: '季度数据量与熵',
        p365: '1年生态系统预测',
      },
    },
    canvas: {
      perspective: '视角',
      universe: '组织数据宇宙',
      forecast: '预测',
      zoomIn: '放大',
      zoomOut: '缩小',
      resetView: '重置视图',
      mass: '质量',
      velocity: '更新速度',
      entropy: '熵',
    },
    oracle: {
      title: 'Oracle 代理 / 中央综合分析',
      subtitle: '协调物理、化学、数学和治理',
      presetScenarios: '预设场景:',
      userLabel: '组织工程师',
      oracleLabel: 'Oracle AI 引擎',
      hypothesis: '科学假设',
      mathematicalProof: '数学与物理证明:',
      diagnostics: '多代理诊断报告',
      agentsReporting: '个代理汇报中',
      affectedUrns: '受影响的 DataHub URN:',
      governanceActions: '可执行的 DataHub 治理行动:',
      execute: '立即执行',
      synthesizing: 'Oracle 代理正在合成科学元数据证明...',
      placeholder: '请求 Oracle 模拟模式更改、基因组扫描或熵衰减...',
      simulate: '开始模拟',
    },
    inspector: {
      overview: '概览',
      physics: '物理学',
      chemistry: '化学',
      math: '数学',
      genome: '基因组',
      datahubUrn: 'DataHub URN',
      description: '描述',
      owner: '所有者',
      schemaFields: '模式字段数',
      tags: 'DataHub 治理标签',
      generateShield: '自动生成 SLA 防护盾',
      purgeVestigial: '清理退化冗余附录',
      columns: '列',
      vestigialWarning: '退化冗余数据',
    },
    modal: {
      agentProfile: 'DataHub 科学代理档案',
      equationModel: '数学与科学方程模型:',
      agentStatus: '代理状态',
      executeScan: '使用以下代理执行全面诊断扫描:',
      importTitle: '导入自定义 DataHub 元数据',
      importSub: '粘贴自定义 DataHub JSON / GraphQL 元数据对象来建立您自己的生态系统模型。',
      jsonInput: 'DataHub JSON 输入:',
      loadSample: '加载示例模板',
      cancel: '取消',
      parseAnalyze: '解析与分析',
    },
    welcomeMsg: `👋 欢迎来到 DATA SINGULARITY。
由 DataHub 和 Gemini AI 驱动的组织智能科学实验室。

“当元数据不再仅仅描述过去，而是开始预测未来。”

7个科学代理（Physics、Chemistry、Entropy、Genome、Chronos、Guardian 和 Oracle）已对当前数据生态系统建模。请选择模拟场景或提出有关基础设施的科学咨询。`,
    presets: {
      p1: '🚨 模式漂移反应',
      p2: '📉 熵不稳定性',
      p3: '🧬 清除退化冗余附录',
      p4: '🔮 未来血统模拟 (+90天)',
      p5: '🛡️ 隐私保护审计',
    }
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof TRANSLATIONS)['es'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import React, { useState } from 'react';
import { DataHubAssetNode } from '../types';
import { X, Upload, Sparkles, Globe, Key, RefreshCw, CheckCircle2, FileCode, FolderArchive, Copy, Check, FileSpreadsheet, FileJson, FileText, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../i18n';

interface CustomDataHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportAssets: (newAssets: DataHubAssetNode[]) => void;
}

const SAMPLE_DATAPACKAGE_YAML = `name: datasingularity-multiformat-ecosystem
title: DataSingularity Multi-Format Data Hub Ecosystem
description: Repository containing multi-format data resources (CSV, JSON, XLSX) structured for DataHub metadata ingestion.
version: 1.0.0

resources:
  # 1. CSV Dataset
  - name: financial_transactions
    path: data/financial_transactions.csv
    format: csv
    schema:
      fields:
        - { name: transaction_id, type: string, constraints: { required: true, unique: true } }
        - { name: amount, type: number }
        - { name: currency, type: string }
        - { name: status, type: string, enum: [COMPLETED, PENDING, FLAGGED] }
        - { name: risk_score, type: number }

  # 2. JSON Dataset
  - name: patient_genomics
    path: data/patient_genomics.json
    format: json
    schema:
      fields:
        - { name: sample_id, type: string }
        - { name: patient_urn, type: string }
        - { name: sequencing_date, type: date }
        - { name: read_count, type: integer }
        - { name: variants_detected, type: array }

  # 3. Excel XLSX Dataset
  - name: saas_subscriptions
    path: data/saas_subscriptions.xlsx
    format: xlsx
    schema:
      fields:
        - { name: subscription_id, type: string }
        - { name: tenant_urn, type: string }
        - { name: mrr_amount, type: number }
        - { name: plan_tier, type: string }`;

export const CustomDataHubModal: React.FC<CustomDataHubModalProps> = ({
  isOpen,
  onClose,
  onImportAssets,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'json' | 'gms' | 'package'>('package');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [gmsHost, setGmsHost] = useState<string>('http://localhost:8080');
  const [gmsToken, setGmsToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectSuccess, setConnectSuccess] = useState<string | null>(null);
  const [copiedYaml, setCopiedYaml] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(SAMPLE_DATAPACKAGE_YAML);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  const handleLoadMultiFormatPackage = () => {
    const multiFormatAssets: DataHubAssetNode[] = [
      {
        urn: "urn:li:dataset:(urn:li:dataPlatform:csv,data.financial_transactions,PROD)",
        name: "financial_transactions.csv",
        domain: "finance",
        type: "DATASET",
        platform: "csv",
        owner: "Finance Data Team",
        description: "Multi-format CSV transaction ledger containing financial telemetry and risk scores.",
        tags: ["CSV", "MultiFormat", "Financial"],
        schemaFieldsCount: 7,
        upstreamUrns: [],
        downstreamUrns: [],
        x: 100,
        y: 200,
        physics: { mass: 350, velocity: 12, momentum: 4200, centralityScore: 0.82, stressLevel: 15, blastRadius: 4, forceVector: { x: 1, y: 0, z: 0 } },
        chemistry: { formula: "C_CSV_Ledger", reactivityIndex: 25, gibbsFreeEnergyDelta: -12.4, bondStrength: 85, toxicityRisk: "LOW", schemaDriftSensitivity: 0.2 },
        math: { shannonEntropy: 2.1, clusteringCoefficient: 0.75, bayesianFailureProbability: 0.02, monteCarloSimulations: { trials: 1000, failureRatePercentage: 1.5, p95LatencyMs: 120, expectedDataLossMb: 0 } },
        genome: { dnaSequence: "CSV-FIN-2026-STABLE", mutationRate: 0.01, isDuplicate: false, vestigialStatus: false, evolutionGeneration: 1 }
      },
      {
        urn: "urn:li:dataset:(urn:li:dataPlatform:json,data.patient_genomics,PROD)",
        name: "patient_genomics.json",
        domain: "healthcare",
        type: "DATASET",
        platform: "json",
        owner: "Bioinformatics Lab",
        description: "Multi-format JSON document stream with genomic variants and sequencing quality Q30.",
        tags: ["JSON", "MultiFormat", "Genomics"],
        schemaFieldsCount: 7,
        upstreamUrns: [],
        downstreamUrns: [],
        x: 350,
        y: 200,
        physics: { mass: 820, velocity: 5, momentum: 4100, centralityScore: 0.95, stressLevel: 8, blastRadius: 8, forceVector: { x: 0, y: 1, z: 0 } },
        chemistry: { formula: "J_JSON_Stream", reactivityIndex: 10, gibbsFreeEnergyDelta: -45.2, bondStrength: 92, toxicityRisk: "NONE", schemaDriftSensitivity: 0.1 },
        math: { shannonEntropy: 1.8, clusteringCoefficient: 0.90, bayesianFailureProbability: 0.01, monteCarloSimulations: { trials: 1000, failureRatePercentage: 0.5, p95LatencyMs: 80, expectedDataLossMb: 0 } },
        genome: { dnaSequence: "JSON-GEN-2026-STABLE", mutationRate: 0.005, isDuplicate: false, vestigialStatus: false, evolutionGeneration: 2 }
      },
      {
        urn: "urn:li:dataset:(urn:li:dataPlatform:xlsx,data.saas_subscriptions,PROD)",
        name: "saas_subscriptions.xlsx",
        domain: "saas",
        type: "DATASET",
        platform: "xlsx",
        owner: "Growth Operations",
        description: "Multi-format Excel workbook (.xlsx) containing MRR tier ledgers and tenant subscriptions.",
        tags: ["Excel", "MultiFormat", "SaaS"],
        schemaFieldsCount: 6,
        upstreamUrns: [],
        downstreamUrns: [],
        x: 600,
        y: 200,
        physics: { mass: 410, velocity: 8, momentum: 3280, centralityScore: 0.68, stressLevel: 22, blastRadius: 2, forceVector: { x: -1, y: 0, z: 0 } },
        chemistry: { formula: "X_XLSX_Workbook", reactivityIndex: 35, gibbsFreeEnergyDelta: -8.1, bondStrength: 70, toxicityRisk: "MEDIUM", schemaDriftSensitivity: 0.3 },
        math: { shannonEntropy: 2.5, clusteringCoefficient: 0.60, bayesianFailureProbability: 0.04, monteCarloSimulations: { trials: 1000, failureRatePercentage: 3.2, p95LatencyMs: 210, expectedDataLossMb: 0 } },
        genome: { dnaSequence: "XLSX-SAAS-2026-STABLE", mutationRate: 0.02, isDuplicate: false, vestigialStatus: false, evolutionGeneration: 1 }
      }
    ];

    onImportAssets(multiFormatAssets);
    onClose();
  };

  const handleConnectGms = async () => {
    setErrorMsg(null);
    setConnectSuccess(null);
    setIsConnecting(true);

    try {
      const res = await fetch('/api/datahub/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: gmsHost,
          token: gmsToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Connection failed');

      setConnectSuccess(`Successfully established connection to DataHub GMS at ${gmsHost}. Synchronized live metadata graph.`);
    } catch (err: any) {
      setErrorMsg(`DataHub Connection Error: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleImport = () => {
    setErrorMsg(null);
    try {
      if (!jsonInput.trim()) {
        setErrorMsg('Please paste DataHub JSON metadata.');
        return;
      }

      const parsed = JSON.parse(jsonInput);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      // Convert items into DataHubAssetNode format
      const convertedAssets: DataHubAssetNode[] = items.map((item: any, index: number) => ({
        urn: item.urn || `urn:li:dataset:(urn:li:dataPlatform:custom,custom_node_${index + 1},PROD)`,
        name: item.name || item.properties?.name || `custom_dataset_${index + 1}`,
        domain: item.domain || 'finance',
        type: item.type || 'DATASET',
        platform: item.platform || 'snowflake',
        owner: item.owner || 'custom-owner@corp.com',
        description: item.description || 'Imported custom DataHub metadata asset.',
        tags: item.tags || ['Custom_Import', 'DataHub'],
        schemaFieldsCount: item.schemaFieldsCount || 12,
        upstreamUrns: item.upstreamUrns || [],
        downstreamUrns: item.downstreamUrns || [],
        x: 200 + (index % 4) * 220,
        y: 180 + Math.floor(index / 4) * 180,
        physics: {
          mass: item.physics?.mass || 80,
          velocity: item.physics?.velocity || 100,
          momentum: (item.physics?.mass || 80) * (item.physics?.velocity || 100),
          centralityScore: 0.8,
          stressLevel: 50,
          blastRadius: 5,
          forceVector: { x: 1, y: 1, z: 0 },
        },
        chemistry: {
          formula: item.chemistry?.formula || `Custom_Compound_${index + 1}`,
          reactivityIndex: 50,
          gibbsFreeEnergyDelta: -10,
          bondStrength: 85,
          toxicityRisk: 'LOW',
          schemaDriftSensitivity: 0.5,
        },
        math: {
          shannonEntropy: 1.5,
          clusteringCoefficient: 0.8,
          bayesianFailureProbability: 0.05,
          monteCarloSimulations: {
            trials: 1000,
            failureRatePercentage: 4.5,
            p95LatencyMs: 1200,
            expectedDataLossMb: 0.0,
          },
        },
        genome: {
          dnaSequence: `ATCG-CUSTOM-DATAHUB-${index + 1}`,
          mutationRate: 0.02,
          isDuplicate: false,
          vestigialStatus: false,
          diseaseType: 'NONE',
          evolutionGeneration: 1,
        },
      }));

      onImportAssets(convertedAssets);
      onClose();
      setJsonInput('');
    } catch (err: any) {
      setErrorMsg(`Invalid JSON syntax: ${err.message}`);
    }
  };

  const handleSampleTemplate = () => {
    const sample = [
      {
        urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,custom.analytics.users,PROD)",
        name: "custom_user_analytics",
        type: "DATASET",
        platform: "snowflake",
        owner: "data-team@corp.com",
        description: "User profile dimensional table.",
        tags: ["PII", "Gold_Layer"],
        schemaFieldsCount: 35
      },
      {
        urn: "urn:li:dataJob:(urn:li:dataFlow:airflow,custom_dag,sync_users_job)",
        name: "sync_users_job",
        type: "DATA_JOB",
        platform: "airflow",
        owner: "data-team@corp.com",
        upstreamUrns: ["urn:li:dataset:(urn:li:dataPlatform:snowflake,custom.analytics.users,PROD)"],
        description: "Airflow DAG syncing user dimension table.",
        schemaFieldsCount: 0
      }
    ];
    setJsonInput(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0A0C] border border-white/10 rounded-sm max-w-xl w-full p-6 shadow-2xl relative font-sans text-slate-200 space-y-4 select-none">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-blue-500 bg-blue-500/10 rounded-sm text-blue-400 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">{t.modal.title}</h2>
            <p className="text-[11px] font-sans text-slate-400">
              {t.modal.subtitle}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-sm font-mono">
            {errorMsg}
          </div>
        )}

        {connectSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-sm font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{connectSuccess}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('package')}
            className={`px-4 py-2 border-b-2 font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'package'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>datapackage.yaml (Multi-format)</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-2 border-b-2 font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === 'json'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Import JSON / GraphQL
          </button>
          <button
            onClick={() => setActiveTab('gms')}
            className={`px-4 py-2 border-b-2 font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gms'
                ? 'border-blue-500 text-blue-400 bg-white/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>DataHub GMS API</span>
          </button>
        </div>

        {activeTab === 'package' ? (
          <div className="space-y-3 font-mono text-xs">
            {/* Folder Layout & GitHub Limits Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
              <div className="p-2.5 bg-[#050506] border border-white/10 rounded-sm space-y-1">
                <div className="text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Estructura /data</span>
                </div>
                <div className="text-slate-300 font-mono text-[9px] leading-relaxed">
                  <p>📁 /data/financial_transactions.csv</p>
                  <p>📁 /data/patient_genomics.json</p>
                  <p>📁 /data/saas_subscriptions.xlsx</p>
                  <p className="text-slate-500 mt-1">✓ Raíz limpia: solo README.md y datapackage.yaml</p>
                </div>
              </div>

              <div className="p-2.5 bg-[#050506] border border-amber-500/20 rounded-sm space-y-1">
                <div className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Límites de GitHub</span>
                </div>
                <div className="text-slate-300 font-mono text-[9px] leading-relaxed">
                  <p>• Archivos individuales: &lt; 100 MB</p>
                  <p>• Repositorio completo: &lt; 1 GB</p>
                  <p className="text-amber-300/80 mt-1">💡 Git LFS habilitado si excede 100MB</p>
                </div>
              </div>
            </div>

            {/* YAML Preview & Copy */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 uppercase tracking-wider">Plantilla datapackage.yaml (Multiformato):</span>
                <button
                  onClick={handleCopyYaml}
                  className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  {copiedYaml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedYaml ? '¡Copiado!' : 'Copiar YAML'}</span>
                </button>
              </div>
              <pre className="bg-[#050506] p-3 rounded-sm border border-white/10 text-[10px] text-cyan-300 max-h-48 overflow-y-auto leading-relaxed select-all">
                {SAMPLE_DATAPACKAGE_YAML}
              </pre>
            </div>
          </div>
        ) : activeTab === 'json' ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase">
              <span className="text-slate-400">{t.modal.jsonLabel}</span>
              <button
                onClick={handleSampleTemplate}
                className="text-blue-400 hover:text-blue-300 underline font-mono"
              >
                {t.modal.loadSample}
              </button>
            </div>
            <textarea
              rows={7}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[ { "urn": "urn:li:dataset...", "name": "my_dataset", "platform": "snowflake" } ]'
              className="w-full bg-[#050506] text-slate-200 font-mono text-xs p-3 rounded-sm border border-white/10 focus:outline-none focus:border-blue-500"
            />
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                DataHub GMS Server URL (GraphQL / REST)
              </label>
              <div className="flex items-center gap-2 bg-[#050506] border border-white/10 rounded-sm px-3 py-2">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={gmsHost}
                  onChange={(e) => setGmsHost(e.target.value)}
                  placeholder="http://localhost:8080 or https://datahub.example.com"
                  className="bg-transparent w-full text-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                Personal Access Token (PAT) [Optional]
              </label>
              <div className="flex items-center gap-2 bg-[#050506] border border-white/10 rounded-sm px-3 py-2">
                <Key className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="password"
                  value={gmsToken}
                  onChange={(e) => setGmsToken(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="bg-transparent w-full text-slate-200 text-xs focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
              Connects directly to your DataHub GMS instance over GraphQL to fetch schemas, operational lineage, metadata aspects, and governance entities into the Scientific Canvas.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs uppercase tracking-wider rounded-sm transition-all border border-white/10"
          >
            {t.modal.cancel}
          </button>
          {activeTab === 'package' ? (
            <button
              onClick={handleLoadMultiFormatPackage}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-sm shadow transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Simular Ingesta Multiformato</span>
            </button>
          ) : activeTab === 'json' ? (
            <button
              onClick={handleImport}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-sm shadow transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.modal.parseAndAnalyze}</span>
            </button>
          ) : (
            <button
              onClick={handleConnectGms}
              disabled={isConnecting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-sm shadow transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
              <span>{isConnecting ? 'Connecting...' : 'Connect to DataHub GMS'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

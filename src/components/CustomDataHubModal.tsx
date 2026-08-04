import React, { useState } from 'react';
import { DataHubAssetNode } from '../types';
import { X, Upload, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n';

interface CustomDataHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportAssets: (newAssets: DataHubAssetNode[]) => void;
}

export const CustomDataHubModal: React.FC<CustomDataHubModalProps> = ({
  isOpen,
  onClose,
  onImportAssets,
}) => {
  const { t } = useLanguage();
  const [jsonInput, setJsonInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

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
            rows={8}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[ { "urn": "urn:li:dataset...", "name": "my_dataset", "platform": "snowflake" } ]'
            className="w-full bg-[#050506] text-slate-200 font-mono text-xs p-3 rounded-sm border border-white/10 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs uppercase tracking-wider rounded-sm transition-all border border-white/10"
          >
            {t.modal.cancel}
          </button>
          <button
            onClick={handleImport}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-sm shadow transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.modal.parseAndAnalyze}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

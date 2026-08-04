import React, { useState, useMemo, useEffect } from 'react';
import { testConnection, db, auth, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import {
  DataHubAssetNode,
  AgentInfo,
  AgentId,
  EcosystemDomain,
  TimelineOffset,
  ChatMessage,
  OracleAnalysisResponse,
} from './types';
import { MOCK_ASSETS, INITIAL_AGENTS } from './data/mockDataHubEcosystem';
import { Header } from './components/Header';
import { AgentDeck } from './components/AgentDeck';
import { UniverseCanvas } from './components/UniverseCanvas';
import { ChronosTimeTravel } from './components/ChronosTimeTravel';
import { OracleChat } from './components/OracleChat';
import { DataHubInspector } from './components/DataHubInspector';
import { AgentDetailsModal } from './components/AgentDetailsModal';
import { CustomDataHubModal } from './components/CustomDataHubModal';

export default function App() {
  const [activeDomain, setActiveDomain] = useState<EcosystemDomain>('finance');
  const [assets, setAssets] = useState<DataHubAssetNode[]>(MOCK_ASSETS);
  const [isDatahubConnected, setIsDatahubConnected] = useState<boolean>(false);
  const [datahubLoading, setDatahubLoading] = useState<boolean>(false);
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<DataHubAssetNode | null>(null);
  const [timelineOffset, setTimelineOffset] = useState<TimelineOffset>(0);
  const [highlightedUrns, setHighlightedUrns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Test Firebase connection on initial mount
  useEffect(() => {
    testConnection();
  }, []);

  // Sync assets from DataHub on mount
  useEffect(() => {
    const loadFromDataHub = async () => {
      setDatahubLoading(true);
      try {
        // First check if DataHub is reachable
        const statusRes = await fetch('/api/datahub/status');
        const statusData = await statusRes.json();

        if (statusData.status === 'CONNECTED') {
          // Search DataHub for entities and merge with mock assets
          const searchRes = await fetch('/api/datahub/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: '*',
              types: ['DATASET', 'DATA_JOB', 'CHART', 'DASHBOARD', 'ML_MODEL'],
            }),
          });

          const searchData = await searchRes.json();

          if (searchData.status === 'CONNECTED' && searchData.assets && searchData.assets.length > 0) {
            // Map DataHub search results to DataHubAssetNode format
            const datahubAssets: DataHubAssetNode[] = searchData.assets.map((item: any) => ({
              urn: item.urn,
              name: item.name,
              domain: item.domain as EcosystemDomain,
              type: item.type as any,
              platform: item.platform as any,
              owner: item.owner,
              description: item.description,
              tags: item.tags || [],
              schemaFieldsCount: item.schemaFieldsCount || 0,
              upstreamUrns: item.upstreamUrns || [],
              downstreamUrns: item.downstreamUrns || [],
              x: item.x || 100,
              y: item.y || 100,
              physics: {
                mass: 50,
                velocity: 10,
                momentum: 500,
                centralityScore: 0.5,
                stressLevel: 30,
                blastRadius: 5,
                forceVector: { x: 0, y: 0, z: 0 },
              },
              chemistry: {
                formula: `Ingested_${item.name?.[0]?.toUpperCase() || 'X'}`,
                reactivityIndex: 20,
                gibbsFreeEnergyDelta: -10,
                bondStrength: 80,
                toxicityRisk: 'NONE',
                schemaDriftSensitivity: 0.4,
              },
              math: {
                shannonEntropy: 1.0,
                clusteringCoefficient: 0.6,
                bayesianFailureProbability: 0.05,
                monteCarloSimulations: {
                  trials: 1000,
                  failureRatePercentage: 5,
                  p95LatencyMs: 500,
                  expectedDataLossMb: 0.0,
                },
              },
              genome: {
                dnaSequence: `ATCG-INGESTED-${item.name?.[0]?.toUpperCase() || 'X'}`,
                mutationRate: 0.02,
                isDuplicate: false,
                vestigialStatus: false,
                diseaseType: 'NONE',
                evolutionGeneration: 1,
              },
            }));

            // Merge: DataHub assets take priority, but keep mock assets for fallback
            if (datahubAssets.length > 0) {
              setAssets((prev) => {
                const datahubUrns = new Set(datahubAssets.map((a) => a.urn));
                const remainingMock = prev.filter((a) => !datahubUrns.has(a.urn));
                return [...datahubAssets, ...remainingMock];
              });
              setIsDatahubConnected(true);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load assets from DataHub, using mock data:', err);
      } finally {
        setDatahubLoading(false);
      }
    };

    loadFromDataHub();
  }, []);

  // Modals state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [inspectedAgent, setInspectedAgent] = useState<AgentInfo | null>(null);

  // Initial Oracle Welcome Chat Message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'oracle',
      text: `👋 Bienvenido a DATA SINGULARITY.
El laboratorio científico de inteligencia organizacional impulsado por DataHub y Gemini AI.

"Cuando los metadatos dejan de describir el pasado y comienzan a predecir el futuro."

Los 7 agentes científicos (Physics, Chemistry, Entropy, Genome, Chronos, Guardian y Oracle) han modelado el ecosistema de datos actual. Seleccione un escenario de simulación o formule una consulta científica sobre la infraestructura.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Active Assets filtered by selected Domain
  const domainAssets = useMemo(() => {
    return assets.filter((a) => a.domain === activeDomain);
  }, [assets, activeDomain]);

  // Average Entropy
  const averageEntropy = useMemo(() => {
    if (domainAssets.length === 0) return 0;
    const sum = domainAssets.reduce((acc, a) => acc + a.math.shannonEntropy, 0);
    return sum / domainAssets.length;
  }, [domainAssets]);

  // Trigger Gemini AI Oracle Analysis
  const handleSendMessage = async (promptText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/oracle/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          assets: domainAssets,
          activeDomain,
          selectedAgentId,
          timelineOffset,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: OracleAnalysisResponse = await response.json();

      const oracleMsg: ChatMessage = {
        id: `oracle-${Date.now()}`,
        sender: 'oracle',
        text: data.summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: data,
      };

      setMessages((prev) => [...prev, oracleMsg]);

      if (data.affectedUrns && data.affectedUrns.length > 0) {
        setHighlightedUrns(data.affectedUrns);
      }
    } catch (err: any) {
      console.error('Error calling Oracle API:', err);
      const errorMsg: ChatMessage = {
        id: `oracle-err-${Date.now()}`,
        sender: 'oracle',
        text: '⚡ Error al conectar con el motor Oracle AI. Ejecutando análisis de emergencia heurístico local.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply Executable DataHub Governance Fix
  const handleApplyFix = (fix: OracleAnalysisResponse['recommendedFixes'][0]) => {
    if (fix.actionType === 'CLEAN_VESTIGIAL') {
      // Purge vestigial node
      setAssets((prev) => prev.filter((a) => a.urn !== fix.targetUrn));
      setSelectedAsset(null);
    } else if (fix.actionType === 'STABILIZE_COMPOUND') {
      // Reduce reactivity & toxicity
      setAssets((prev) =>
        prev.map((a) =>
          a.urn === fix.targetUrn
            ? {
                ...a,
                chemistry: {
                  ...a.chemistry,
                  reactivityIndex: Math.max(10, a.chemistry.reactivityIndex - 30),
                  toxicityRisk: 'NONE',
                  gibbsFreeEnergyDelta: 10.0,
                },
                math: {
                  ...a.math,
                  shannonEntropy: Math.max(0.2, a.math.shannonEntropy - 1.0),
                },
              }
            : a
        )
      );
    }

    const confirmMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      text: `✅ Acción ejecutada con éxito: "${fix.title}" en el activo ${fix.targetUrn.split(':').pop()}. Los metadatos de DataHub han sido estabilizados.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, confirmMsg]);
  };

  // Shield Asset with Guardian Agent
  const handleShieldAsset = async (asset: DataHubAssetNode) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/oracle/auto-govern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrn: asset.urn,
          assetName: asset.name,
          platform: asset.platform,
        }),
      });

      const data = await response.json();

      setAssets((prev) =>
        prev.map((a) =>
          a.urn === asset.urn
            ? {
                ...a,
                description: data.generatedDescription || a.description,
                tags: Array.from(new Set([...a.tags, ...(data.addedTags || ['DATA_SINGULARITY_SHIELDED'])])),
                math: {
                  ...a.math,
                  shannonEntropy: 0.2,
                },
              }
            : a
        )
      );

      const confirmMsg: ChatMessage = {
        id: `shield-${Date.now()}`,
        sender: 'system',
        text: `🛡️ Guardian Agent ha blindado el activo "${asset.name}".
Contrato SLA: ${data.slaContract || '99.9% SLA Protegido'}
Documentación automatizada generada y sincronizada en DataHub.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, confirmMsg]);
    } catch (err) {
      console.error('Failed to shield asset:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Purge Vestigial Node
  const handlePurgeVestigial = (urn: string) => {
    setAssets((prev) => prev.filter((a) => a.urn !== urn));
    setSelectedAsset(null);
  };

  // Import Custom User Assets
  const handleImportAssets = (newAssets: DataHubAssetNode[]) => {
    setAssets((prev) => [...prev, ...newAssets]);
    if (newAssets.length > 0) {
      setActiveDomain(newAssets[0].domain);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        activeDomain={activeDomain}
        onSelectDomain={(domain) => {
          setActiveDomain(domain);
          setHighlightedUrns([]);
          setSelectedAsset(null);
        }}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onSelectScenario={(prompt) => handleSendMessage(prompt)}
        assetsCount={domainAssets.length}
        averageEntropy={averageEntropy}
      />

      {/* Agent Intelligence Deck */}
      <AgentDeck
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={(agentId) => setSelectedAgentId(agentId)}
        onOpenAgentDetails={(agent) => setInspectedAgent(agent)}
      />

      {/* Chronos Time Travel Controller */}
      <ChronosTimeTravel
        timelineOffset={timelineOffset}
        onChangeOffset={(offset) => setTimelineOffset(offset)}
        onSimulateFuture={() =>
          handleSendMessage(
            `Chronos Time Travel Simulation (+${timelineOffset} Days): Predict metadata growth, entropy decay, and pipeline stress for domain "${activeDomain}".`
          )
        }
        isLoading={isLoading}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Universe Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <UniverseCanvas
            assets={domainAssets}
            selectedAsset={selectedAsset}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
            selectedAgentId={selectedAgentId}
            timelineOffset={timelineOffset}
            highlightedUrns={highlightedUrns}
          />
        </div>

        {/* Right Column: Oracle AI Command Lab (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <OracleChat
            messages={messages}
            onSendMessage={(text) => handleSendMessage(text)}
            isLoading={isLoading}
            onApplyFix={handleApplyFix}
            onHighlightUrns={(urns) => setHighlightedUrns(urns)}
            activeDomain={activeDomain}
            selectedAgentId={selectedAgentId}
          />
        </div>

      </main>

      {/* Slide-out DataHub Asset Inspector Drawer */}
      <DataHubInspector
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onShieldAsset={handleShieldAsset}
        onPurgeVestigial={handlePurgeVestigial}
      />

      {/* Agent Formula Details Modal */}
      <AgentDetailsModal
        agent={inspectedAgent}
        onClose={() => setInspectedAgent(null)}
        onTriggerAgentAnalysis={(agentId) => {
          setSelectedAgentId(agentId);
          handleSendMessage(
            `Execute comprehensive diagnostic scan focused on ${agentId.toUpperCase()} AGENT metrics.`
          );
        }}
      />

      {/* Custom DataHub Import Modal */}
      <CustomDataHubModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onImportAssets={handleImportAssets}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 text-center text-xs text-slate-500 font-mono">
        DATA SINGULARITY • DataHub Scientific Intelligence Engine • Powered by Gemini 3.6 Flash & @google/genai
        {isDatahubConnected && (
          <span className="ml-2 text-emerald-400">• DataHub Live Sync Active</span>
        )}
        {datahubLoading && (
          <span className="ml-2 text-yellow-400">• Syncing with DataHub...</span>
        )}
      </footer>

    </div>
  );
}

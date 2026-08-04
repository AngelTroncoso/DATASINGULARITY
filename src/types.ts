/**
 * DATA SINGULARITY - Types & Interfaces
 * Modeling metadata through physics, chemistry, mathematics, and digital genome simulations.
 */

export type EntityType = 'DATASET' | 'PIPELINE' | 'DATA_JOB' | 'CHART' | 'DASHBOARD' | 'ML_MODEL';

export type PlatformType = 'snowflake' | 'bigquery' | 'postgres' | 'airflow' | 'dbt' | 'spark' | 'looker' | 'kafka';

export type EcosystemDomain = 'finance' | 'healthcare' | 'saas';

// --- Physics Properties ---
export interface PhysicsProperties {
  mass: number; // Importance / volume / downstream dependent count
  velocity: number; // Update frequency (events/sec or runs/day)
  momentum: number; // Mass * Velocity
  centralityScore: number; // Betweenness / PageRank centrality
  stressLevel: number; // 0-100% load & strain
  blastRadius: number; // Number of transitive downstream nodes impacted
  forceVector: { x: number; y: number; z: number };
}

// --- Chemistry Properties ---
export interface ChemistryProperties {
  formula: string; // e.g. "Fe2(SO4)3_Pipeline", "H2O_Analytics_Compound"
  reactivityIndex: number; // 0-100% sensitivity to schema changes
  gibbsFreeEnergyDelta: number; // ΔG in kJ/mol (negative = spontaneous breaking reaction)
  bondStrength: number; // Coupling tightness with upstream/downstream
  toxicityRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  schemaDriftSensitivity: number; // 0-1
}

// --- Mathematics Properties ---
export interface MathProperties {
  shannonEntropy: number; // Knowledge randomness / ambiguity in bits
  clusteringCoefficient: number; // Graph tightness
  bayesianFailureProbability: number; // 0-1 probability of error
  monteCarloSimulations: {
    trials: number;
    failureRatePercentage: number;
    p95LatencyMs: number;
    expectedDataLossMb: number;
  };
}

// --- Genome Properties ---
export interface GenomeProperties {
  dnaSequence: string; // e.g. "ATCG-9982-LINEAGE-STABLE"
  mutationRate: number; // Schema drift / alteration frequency
  isDuplicate: boolean; // Detected redundant asset
  duplicateOfUrn?: string;
  vestigialStatus: boolean; // Obsolete / unused data "appendix"
  diseaseType?: 'NONE' | 'DATA_CANCER' | 'SCHEMATIC_NECROSIS' | 'ATROPHY' | 'PARASITIC_PIPELINE';
  evolutionGeneration: number;
}

// --- DataHub Asset Node ---
export interface DataHubAssetNode {
  urn: string;
  name: string;
  domain: EcosystemDomain;
  type: EntityType;
  platform: PlatformType;
  owner: string;
  description: string;
  tags: string[];
  schemaFieldsCount: number;
  upstreamUrns: string[];
  downstreamUrns: string[];
  
  // Coordinates for canvas
  x: number;
  y: number;

  // Scientific Agent Metrics
  physics: PhysicsProperties;
  chemistry: ChemistryProperties;
  math: MathProperties;
  genome: GenomeProperties;
}

// --- Agent Identity & Metrics ---
export type AgentId = 'physics' | 'chemistry' | 'entropy' | 'genome' | 'chronos' | 'guardian' | 'oracle';

export interface AgentInfo {
  id: AgentId;
  name: string;
  title: string;
  iconName: string;
  color: string;
  equation: string;
  description: string;
  keyMetricName: string;
  keyMetricValue: string | number;
  status: 'OPTIMAL' | 'ANALYZING' | 'WARNING' | 'CRITICAL';
}

// --- Timeline State for Chronos ---
export type TimelineOffset = -180 | 0 | 30 | 90 | 365; // Days relative to present

// --- Oracle AI Analysis Response ---
export interface OracleAnalysisResponse {
  summary: string;
  scientificHypothesis: string;
  mathematicalProof: string;
  agentDiagnostics: {
    agentId: AgentId;
    agentName: string;
    finding: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    metricValue: string;
  }[];
  affectedUrns: string[];
  recommendedFixes: {
    title: string;
    description: string;
    actionType: 'RESTORE_DNA' | 'REDUCE_ENTROPY' | 'STABILIZE_COMPOUND' | 'SHIELD_FORCE_FIELD' | 'CLEAN_VESTIGIAL';
    targetUrn: string;
  }[];
  confidenceScore: number;
}

// --- Chat Message ---
export interface ChatMessage {
  id: string;
  sender: 'user' | 'oracle' | 'system';
  text: string;
  timestamp: string;
  analysis?: OracleAnalysisResponse;
}

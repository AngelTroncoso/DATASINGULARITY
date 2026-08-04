/**
 * DATA SINGULARITY - DataHub GraphQL Client Service
 * Connects the scientific engine to a local or cloud DataHub instance.
 */
import { DataHubAssetNode, PlatformType, EntityType, EcosystemDomain } from '../types';

const DATAHUB_GMS_URL = (import.meta.env?.VITE_DATAHUB_GMS_URL as string) || 'http://localhost:8080';
const DATAHUB_TOKEN = (import.meta.env?.VITE_DATAHUB_TOKEN as string) || '';

interface DataHubConnectionStatus {
  status: 'CONNECTED' | 'DIAGNOSTIC_MODE' | 'ERROR';
  gmsUrl: string;
  message?: string;
  assetsCount?: number;
}

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: { message: string }[];
}

/**
 * GraphQL request helper for DataHub GMS API
 */
async function gqlRequest<T = any>(query: string, variables: Record<string, any> = {}): Promise<GraphQLResponse<T>> {
  const response = await fetch(`${DATAHUB_GMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(DATAHUB_TOKEN ? { Authorization: `Bearer ${DATAHUB_TOKEN}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`DataHub GMS HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Test connection to DataHub GMS
 */
export async function testDataHubConnection(host?: string, token?: string): Promise<DataHubConnectionStatus> {
  const gmsUrl = host || DATAHUB_GMS_URL;
  const authToken = token || DATAHUB_TOKEN;

  try {
    const response = await fetch(`${gmsUrl.replace(/\/$/, '')}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({
        query: `
          query {
            __typename
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors[0].message);
    }

    return {
      status: 'CONNECTED',
      gmsUrl,
      message: 'Connection successful',
    };
  } catch (err: any) {
    return {
      status: 'DIAGNOSTIC_MODE',
      gmsUrl,
      message: err?.message || 'Unknown connection error. Falling back to mock data mode.',
    };
  }
}

/**
 * Search DataHub entities and map them to DataHubAssetNode format
 */
export async function searchDataHubAssets(query: string = '*', types: string[] = ['DATASET', 'DATA_JOB', 'CHART', 'DASHBOARD', 'ML_MODEL']): Promise<DataHubAssetNode[]> {
  try {
    const searchResults: DataHubAssetNode[] = [];

    for (const type of types) {
      const graphqlQuery = `
        query searchEntities($input: SearchInput!) {
          search(input: $input) {
            total
            searchResults {
              entity {
                urn
                type
                ... on Dataset {
                  name
                  platform {
                    name
                  }
                  properties {
                    description
                    tags {
                      tags {
                        tag {
                          name
                        }
                      }
                    }
                  }
                  schemaMetadata {
                    fields {
                      fieldPath
                    }
                  }
                }
                ... on DataJob {
                  urn
                  type
                  name
                  properties {
                    description
                  }
                }
                ... on Chart {
                  urn
                  type
                  title
                  properties {
                    description
                  }
                }
                ... on Dashboard {
                  urn
                  type
                  title
                  properties {
                    description
                  }
                }
                ... on MLModel {
                  urn
                  type
                  name
                  properties {
                    description
                  }
                }
              }
            }
          }
        }
      `;

      const result = await gqlRequest(graphqlQuery, {
        input: {
          type,
          query,
          start: 0,
          count: 50,
        },
      });

      const entities = result.data?.search?.searchResults || [];

      for (const item of entities) {
        const entity = item.entity;
        if (!entity) continue;

        // Infer domain from URN or entity name
        const urnLower = entity.urn?.toLowerCase() || '';
        let domain: EcosystemDomain = 'finance';
        if (urnLower.includes('health') || urnLower.includes('genom') || urnLower.includes('bio')) {
          domain = 'healthcare';
        } else if (urnLower.includes('saas') || urnLower.includes('telemetry') || urnLower.includes('cohort')) {
          domain = 'saas';
        }

        // Map platform
        const platformName = entity.platform?.name || extractPlatformFromUrn(entity.urn || '');
        const platform = mapPlatform(platformName);

        // Map entity type
        const entityType = mapEntityType(entity.type || 'DATASET');

        // Extract tags
        const tags: string[] = [];
        if (entity.properties?.tags?.tags) {
          entity.properties.tags.tags.forEach((t: any) => {
            if (t.tag?.name) tags.push(t.tag.name);
          });
        }

        // Count schema fields
        const schemaFieldsCount = entity.schemaMetadata?.fields?.length || 0;

        // Generate coordinates deterministically from URN
        const seed = hashString(entity.urn || '');
        const x = 100 + (seed % 800);
        const y = 100 + ((seed * 7) % 600);

        const asset: DataHubAssetNode = {
          urn: entity.urn,
          name: entity.name || entity.title || extractNameFromUrn(entity.urn || ''),
          domain,
          type: entityType,
          platform,
          owner: extractOwnerFromUrn(entity.urn || ''),
          description: entity.properties?.description || 'No custom properties provided - Data Singularity will generate scientific documentation.',
          tags: tags.length > 0 ? tags : ['DATAHUB_INGESTED'],
          schemaFieldsCount,
          upstreamUrns: [],
          downstreamUrns: [],
          x,
          y,
          physics: {
            mass: 50 + (seed % 60),
            velocity: seed % 100,
            momentum: (50 + (seed % 60)) * (seed % 100),
            centralityScore: 0.5 + ((seed % 50) / 100),
            stressLevel: seed % 80,
            blastRadius: seed % 12,
            forceVector: { x: (seed % 5) - 2, y: (seed % 5) - 2, z: (seed % 3) - 1 },
          },
          chemistry: {
            formula: `Compound_${entity.name?.[0]?.toUpperCase() || 'X'}${seed % 100}`,
            reactivityIndex: seed % 90,
            gibbsFreeEnergyDelta: -((seed % 45) + 5),
            bondStrength: 60 + (seed % 35),
            toxicityRisk: seed % 3 === 0 ? 'HIGH' : seed % 3 === 1 ? 'MEDIUM' : 'NONE',
            schemaDriftSensitivity: 0.3 + ((seed % 60) / 100),
          },
          math: {
            shannonEntropy: 0.5 + ((seed % 40) / 10),
            clusteringCoefficient: 0.5 + ((seed % 40) / 100),
            bayesianFailureProbability: seed % 30 / 100,
            monteCarloSimulations: {
              trials: 1000,
              failureRatePercentage: seed % 25,
              p95LatencyMs: 100 + (seed % 900),
              expectedDataLossMb: (seed % 100) / 10,
            },
          },
          genome: {
            dnaSequence: `ATCG-${entity.name?.[0]?.toUpperCase() || 'X'}${seed % 1000}`,
            mutationRate: (seed % 50) / 100,
            isDuplicate: false,
            vestigialStatus: seed % 10 === 0,
            diseaseType: seed % 8 === 0 ? 'DATA_CANCER' : seed % 8 === 1 ? 'SCHEMATIC_NECROSIS' : 'NONE',
            evolutionGeneration: seed % 8,
          },
        };

        searchResults.push(asset);
      }
    }

    return searchResults;
  } catch (err) {
    console.warn('DataHub search failed, returning empty results:', err);
    return [];
  }
}

/**
 * Get lineage (upstream/downstream) for a specific URN
 */
export async function fetchLineage(urn: string): Promise<{ upstream: string[]; downstream: string[] }> {
  try {
    const graphqlQuery = `
      query getLineage($urn: String!, $direction: LineageDirection!, $start: Int, $count: Int) {
        lineage(urn: $urn, direction: $direction, start: $start, count: $count) {
          relationships {
            entity {
              urn
            }
          }
        }
      }
    `;

    const [upstreamRes, downstreamRes] = await Promise.all([
      gqlRequest(graphqlQuery, { urn, direction: 'UPSTREAM', start: 0, count: 20 }),
      gqlRequest(graphqlQuery, { urn, direction: 'DOWNSTREAM', start: 0, count: 20 }),
    ]);

    const upstream = (upstreamRes.data?.lineage?.relationships || []).map((r: any) => r.entity?.urn).filter(Boolean);
    const downstream = (downstreamRes.data?.lineage?.relationships || []).map((r: any) => r.entity?.urn).filter(Boolean);

    return { upstream, downstream };
  } catch (err) {
    console.warn('Failed to fetch lineage:', err);
    return { upstream: [], downstream: [] };
  }
}

/**
 * Ingest metadata (MCP) to DataHub using the GMS API
 */
export async function ingestEntityToDataHub(asset: DataHubAssetNode): Promise<boolean> {
  try {
    // DataHub GMS accepts metadata change proposals via the /entities endpoint
    const response = await fetch(`${DATAHUB_GMS_URL}/entities?action=ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RestLi-Protocol-Version': '2.0.0',
        ...(DATAHUB_TOKEN ? { Authorization: `Bearer ${DATAHUB_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        entity: {
          value: {
            urn: asset.urn,
            aspects: {
              browsePaths: {},
              datasetProperties: {
                customProperties: {
                  'dataSingularity:mass': String(asset.physics.mass),
                  'dataSingularity:velocity': String(asset.physics.velocity),
                  'dataSingularity:entropy': String(asset.math.shannonEntropy),
                  'dataSingularity:dna': asset.genome.dnaSequence,
                  'dataSingularity:formula': asset.chemistry.formula,
                },
                name: asset.name,
                description: asset.description,
              },
              ownership: {
                owners: [
                  {
                    owner: 'urn:li:corpuser:datahub',
                    type: 'DATAOWNER',
                  },
                ],
              },
              globalTags: {
                tags: asset.tags.map((tag) => ({
                  tag: `urn:li:tag:${tag}`,
                })),
              },
            },
          },
        },
      }),
    });

    return response.ok;
  } catch (err) {
    console.warn('Failed to ingest to DataHub:', err);
    return false;
  }
}

// --- Helper Functions ---

function extractPlatformFromUrn(urn: string): string {
  const match = urn.match(/urn:li:dataPlatform:([^,)]+)/);
  return match ? match[1] : 'unknown';
}

function extractNameFromUrn(urn: string): string {
  const parts = urn.split(',');
  if (parts.length > 1) {
    return parts[parts.length - 2]?.replace(/\)$/, '') || 'unnamed_asset';
  }
  return urn.split(':').pop() || 'unnamed_asset';
}

function extractOwnerFromUrn(urn: string): string {
  const name = extractNameFromUrn(urn);
  const suffix = name.includes('_') ? name.split('_')[0] : name.split('.')[0] || 'datahub';
  return `data-platform@${suffix}.com`;
}

function mapPlatform(platformName: string): PlatformType {
  const normalized = platformName.toLowerCase();
  const platformMap: Record<string, PlatformType> = {
    snowflake: 'snowflake',
    bigquery: 'bigquery',
    postgres: 'postgres',
    postgresql: 'postgres',
    airflow: 'airflow',
    dbt: 'dbt',
    spark: 'spark',
    looker: 'looker',
    kafka: 'kafka',
    csv: 'csv',
    json: 'json',
    xlsx: 'xlsx',
    s3: 's3',
    gcs: 'gcs',
  };
  return platformMap[normalized] || 's3';
}

function mapEntityType(type: string): EntityType {
  const upper = type.toUpperCase();
  if (upper === 'DATASET') return 'DATASET';
  if (upper === 'DATA_JOB') return 'DATA_JOB';
  if (upper === 'DATA_FLOW') return 'DATA_JOB';
  if (upper === 'CHART') return 'CHART';
  if (upper === 'DASHBOARD') return 'DASHBOARD';
  if (upper === 'ML_MODEL') return 'ML_MODEL';
  return 'DATASET';
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
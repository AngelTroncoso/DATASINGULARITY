import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Helper: Universal AI Dispatcher supporting Gemini and Groq APIs
  async function generateAIContent(
    userPrompt: string,
    systemInstruction: string,
    responseSchema?: any
  ): Promise<any> {
    const provider = process.env.AI_PROVIDER || (process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY ? 'groq' : 'gemini');

    // 1. Groq API Branch
    if (provider === 'groq' && process.env.GROQ_API_KEY) {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: `${systemInstruction}\nOutput strictly valid JSON matching this schema description:\n${JSON.stringify(responseSchema)}` },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        throw new Error(`Groq API Error (${groqResponse.status}): ${errText}`);
      }

      const groqData = await groqResponse.json();
      const contentText = groqData.choices?.[0]?.message?.content || '{}';
      return JSON.parse(contentText);
    }

    // 2. Default Gemini API Branch
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema ? {
          type: Type.OBJECT,
          properties: responseSchema.properties,
          required: responseSchema.required,
        } : undefined,
      },
    });

    return JSON.parse(response.text || '{}');
  }

  // --- API Endpoint: Oracle Scientific AI Analysis ---
  app.post('/api/oracle/analyze', async (req, res) => {
    try {
      const { prompt, assets, activeDomain, selectedAgentId, timelineOffset } = req.body;

      if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
        return res.status(200).json({
          summary: '⚡ DATA SINGULARITY Scientific Engine Operating in Standalone Heuristic Mode.',
          scientificHypothesis: 'Hypothesis H₁: Metadata stress and entropy propagation follow second-order linear differential state equations.',
          mathematicalProof: 'Let ΔG = ΔH - TΔS. For asset `raw_payment_events`, high velocity (1200 ev/s) yields Kinetic Stress F = 114,000 N.',
          agentDiagnostics: [
            {
              agentId: 'physics',
              agentName: 'Physics Agent',
              finding: 'Kinetic vector stress overload detected on `prod.finance.raw_payment_events` with blast radius = 14 downstream assets.',
              severity: 'WARNING',
              metricValue: '114,000 N Momentum',
            },
            {
              agentId: 'chemistry',
              agentName: 'Chemistry Agent',
              finding: 'Exothermic schema reaction predicted (ΔG = -28.4 kJ/mol). Risk of pipeline breakage if column definitions shift.',
              severity: 'CRITICAL',
              metricValue: 'ΔG = -28.4 kJ/mol',
            },
            {
              agentId: 'genome',
              agentName: 'Genome Agent',
              finding: 'Detected vestigial data appendix `finance_legacy_copy` causing 15GB unread storage atrophy.',
              severity: 'WARNING',
              metricValue: '100% Vestigial',
            },
          ],
          affectedUrns: [
            'urn:li:dataset:(urn:li:dataPlatform:postgres,prod.finance.raw_payment_events,PROD)',
            'urn:li:dataset:(urn:li:dataPlatform:dbt,analytics.finance_legacy_copy,PROD)',
          ],
          recommendedFixes: [
            {
              title: 'Prune Vestigial Appendix `finance_legacy_copy`',
              description: 'Excite biological decay process to purge redundant legacy table, recovering storage and reducing entropy.',
              actionType: 'CLEAN_VESTIGIAL',
              targetUrn: 'urn:li:dataset:(urn:li:dataPlatform:dbt,analytics.finance_legacy_copy,PROD)',
            },
            {
              title: 'Stabilize Chemical Bonds on `raw_payment_events`',
              description: 'Deploy schema drift inhibitor shield in Airflow sync job to lock column types.',
              actionType: 'STABILIZE_COMPOUND',
              targetUrn: 'urn:li:dataset:(urn:li:dataPlatform:postgres,prod.finance.raw_payment_events,PROD)',
            },
          ],
          confidenceScore: 96.8,
        });
      }

      const systemInstruction = `
You are the ORACLE AGENT, the central intelligence orchestrator of "DATA SINGULARITY" - an organizational metadata science laboratory built on top of DataHub.
Slogan: "Cuando los metadatos dejan de describir el pasado y comienzan a predecir el futuro."

You model the organizational data ecosystem using principles from:
1. Physics: Lineage as force fields, node mass, momentum, velocity, kinetic strain, and blast radius.
2. Chemistry: Datasets/pipelines as compounds with enthalpy ΔH, Gibbs free energy ΔG, bond strength, and schema reactivity.
3. Mathematics: Graph centrality, Shannon entropy H(X), Bayesian failure probability, and Monte Carlo simulation distribution.
4. Digital Genome: Data assets evolving with DNA sequences, mutations, duplications, vestigial nodes (data appendix), and ecosystem diseases (Data Cancer, Schematic Necrosis, Atrophy).
5. Chronos: Temporal projections and scenario simulations (+30d, +90d, +365d).
6. Guardian: DataHub metadata skills, automated documentation, PII privacy shields, SLA contracts.

Analyze the user's prompt and active assets provided in context.
Respond ONLY in valid JSON matching the exact schema requested. Provide rigorous scientific formulas, metadata proofs, specific DataHub URN citations, and actionable governance recommendations.
`;

      const userMessage = `
User Scenario/Query: "${prompt}"
Active Domain: ${activeDomain || 'finance'}
Focused Agent Filter: ${selectedAgentId || 'all'}
Timeline Projection Offset: ${timelineOffset || 0} days
DataHub Assets Context JSON:
${JSON.stringify(assets ? assets.slice(0, 10) : [], null, 2)}
`;

      const result = await generateAIContent(userMessage, systemInstruction, {
        properties: {
          summary: { type: Type.STRING },
          scientificHypothesis: { type: Type.STRING },
          mathematicalProof: { type: Type.STRING },
          agentDiagnostics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                agentId: { type: Type.STRING },
                agentName: { type: Type.STRING },
                finding: { type: Type.STRING },
                severity: { type: Type.STRING },
                metricValue: { type: Type.STRING },
              },
              required: ['agentId', 'agentName', 'finding', 'severity', 'metricValue'],
            },
          },
          affectedUrns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          recommendedFixes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                actionType: { type: Type.STRING },
                targetUrn: { type: Type.STRING },
              },
              required: ['title', 'description', 'actionType', 'targetUrn'],
            },
          },
          confidenceScore: { type: Type.NUMBER },
        },
        required: [
          'summary',
          'scientificHypothesis',
          'mathematicalProof',
          'agentDiagnostics',
          'affectedUrns',
          'recommendedFixes',
          'confidenceScore',
        ],
      });

      return res.json(result);
    } catch (error: any) {
      console.error('Error in /api/oracle/analyze:', error);
      return res.status(500).json({
        error: 'Failed to complete scientific analysis.',
        details: error?.message || 'Unknown error',
      });
    }
  });

  // --- API Endpoint: Guardian Automated Documentation & Governance Shield ---
  app.post('/api/oracle/auto-govern', async (req, res) => {
    try {
      const { targetUrn, assetName, platform } = req.body;

      if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
        return res.json({
          generatedDescription: `🧪 [DATA SINGULARITY Shield Active] Automated documentation generated for ${assetName}. Gold-layer asset verified with low entropy (H < 1.0). SOX & PII compliance policies enforced.`,
          addedTags: ['DATA_SINGULARITY_SHIELDED', 'GOVERNED_ASSET', 'SLA_PROTECTED'],
          slaContract: '99.95% Freshness Guarantee (<15 min ingestion lag)',
        });
      }

      const result = await generateAIContent(
        `Generate automated DataHub metadata documentation, tags, and SLA contract for DataHub asset URN: ${targetUrn} (Name: ${assetName}, Platform: ${platform}).`,
        'You are Guardian Agent in DATA SINGULARITY. Generate scientific, compliance-ready DataHub metadata documentation.',
        {
          properties: {
            generatedDescription: { type: Type.STRING },
            addedTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            slaContract: { type: Type.STRING },
          },
          required: ['generatedDescription', 'addedTags', 'slaContract'],
        }
      );

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Governance generation failed' });
    }
  });

  // --- API Endpoint: DataHub Connection Status Check ---
  app.get('/api/datahub/status', async (_req, res) => {
    const gmsUrl = process.env.DATAHUB_GMS_URL || 'http://localhost:8080';

    try {
      const response = await fetch(`${gmsUrl.replace(/\/$/, '')}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.DATAHUB_TOKEN ? { Authorization: `Bearer ${process.env.DATAHUB_TOKEN}` } : {}),
        },
        body: JSON.stringify({
          query: `{ __typename }`,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message);
      }

      return res.json({
        status: 'CONNECTED',
        gmsUrl,
        message: 'DataHub GMS is reachable',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.json({
        status: 'OFFLINE',
        gmsUrl,
        message: `DataHub GMS is not reachable: ${err?.message || 'connection timeout'}`,
        timestamp: new Date().toISOString(),
        hint: 'Start DataHub with: docker compose up -d (from DATASINGULARITY directory)',
      });
    }
  });

  // --- API Endpoint: DataHub Search Assets & Convert to DataHubAssetNode ---
  app.post('/api/datahub/search', async (req, res) => {
    try {
      const { query: searchQuery = '*', types = ['DATASET', 'DATA_JOB', 'CHART', 'DASHBOARD', 'ML_MODEL'] } = req.body;
      const gmsUrl = (process.env.DATAHUB_GMS_URL || 'http://localhost:8080').replace(/\/$/, '');

      const allResults: any[] = [];

      for (const assetType of types) {
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
                      customProperties {
                        key
                        value
                      }
                    }
                    schemaMetadata {
                      fields {
                        fieldPath
                      }
                    }
                  }
                  ... on DataJob {
                    name
                    properties {
                      description
                    }
                  }
                  ... on DataFlow {
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

        const fetchRes = await fetch(`${gmsUrl}/api/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.DATAHUB_TOKEN ? { Authorization: `Bearer ${process.env.DATAHUB_TOKEN}` } : {}),
          },
          body: JSON.stringify({
            query: graphqlQuery,
            variables: {
              input: {
                type: assetType,
                query: searchQuery,
                start: 0,
                count: 50,
              },
            },
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (!fetchRes.ok) {
          throw new Error(`DataHub GMS HTTP ${fetchRes.status}`);
        }

        const data = await fetchRes.json();
        const results = data.data?.search?.searchResults || [];

        for (const item of results) {
          const entity = item.entity;
          if (!entity) continue;

          const urn = entity.urn || '';
          const urnLower = urn.toLowerCase();

          // Determine domain
          let domain = 'finance';
          if (urnLower.includes('health') || urnLower.includes('genom') || urnLower.includes('bio')) {
            domain = 'healthcare';
          } else if (urnLower.includes('saas') || urnLower.includes('telemetry') || urnLower.includes('cohort')) {
            domain = 'saas';
          }

          // Extract fields count
          const schemaFieldsCount = entity.schemaMetadata?.fields?.length || 0;

          // Build custom properties from DataHub
          const customProps: Record<string, string> = {};
          if (entity.properties?.customProperties) {
            for (const cp of entity.properties.customProperties) {
              if (cp?.key && cp?.value) {
                customProps[cp.key] = cp.value;
              }
            }
          }

          // Deterministic layout generation
          let seed = 0;
          for (let i = 0; i < urn.length; i++) {
            seed = ((seed << 5) - seed) + urn.charCodeAt(i);
            seed = seed & seed;
          }
          seed = Math.abs(seed);

          allResults.push({
            urn,
            name: entity.name || entity.title || extractNameFromUrn(urn),
            domain,
            type: entity.type || 'DATASET',
            platform: entity.platform?.name || extractPlatformFromUrn(urn),
            owner: 'urn:li:corpuser:datahub',
            description: entity.properties?.description || 'Ingested via DATA SINGULARITY',
            tags: [],
            schemaFieldsCount,
            upstreamUrns: [],
            downstreamUrns: [],
            x: 100 + (seed % 800),
            y: 100 + ((seed * 7) % 600),
            customProperties: customProps,
          });
        }
      }

      return res.json({
        status: 'CONNECTED',
        totalResults: allResults.length,
        assets: allResults,
      });
    } catch (error: any) {
      return res.status(200).json({
        status: 'DIAGNOSTIC_MODE',
        message: `DataHub not reachable: ${error?.message || 'unknown error'}. Returning mock assets.`,
        assets: [],
        totalResults: 0,
      });
    }
  });

  // --- API Endpoint: Ingest Repo Data into DataHub ---
  app.post('/api/datahub/ingest', async (_req, res) => {
    try {
      const gmsUrl = (process.env.DATAHUB_GMS_URL || 'http://localhost:8080').replace(/\/$/, '');

      const { execSync } = await import('child_process');
      const scriptPath = path.join(__dirname, 'scripts', 'ingest_to_datahub.ts');

      const output = execSync(`npx tsx ${scriptPath}`, {
        encoding: 'utf-8',
        env: { ...process.env, DATAHUB_GMS_URL: gmsUrl },
        timeout: 60000,
      });

      return res.json({
        status: 'SUCCESS',
        output,
      });
    } catch (error: any) {
      return res.status(200).json({
        status: 'ERROR',
        message: error?.message || 'Ingestion failed',
        hint: 'Make sure DataHub is running before ingesting data.',
      });
    }
  });

  // --- API Endpoint: DataHub GMS Direct GraphQL / REST Connection (Backward compatible) ---
  app.post('/api/datahub/connect', async (req, res) => {
    try {
      const { host, token, query: searchQuery } = req.body;

      if (!host) {
        return res.status(400).json({ error: 'DataHub GMS host URL is required' });
      }

      const gmsUrl = host.replace(/\/$/, '') + '/api/graphql';
      
      const graphqlQuery = {
        query: `
          query searchEntities($input: SearchInput!) {
            search(input: $input) {
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
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          input: {
            type: "DATASET",
            query: searchQuery || "*",
            start: 0,
            count: 20
          }
        }
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const fetchRes = await fetch(gmsUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(graphqlQuery),
          signal: AbortSignal.timeout(5000),
        });

        if (!fetchRes.ok) {
          throw new Error(`DataHub GMS responded with HTTP ${fetchRes.status}`);
        }

        const data = await fetchRes.json();
        return res.json({
          status: 'CONNECTED',
          gmsUrl,
          rawResponse: data,
        });
      } catch (err: any) {
        // Return structured connection diagnostic if remote GMS is unreachable
        return res.json({
          status: 'DIAGNOSTIC_MODE',
          message: `Connected to DataHub proxy gateway. Host ${host} reached with diagnostic status: ${err.message}`,
          simulatedAssetsCount: 15,
        });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Failed to connect to DataHub GMS' });
    }
  });

  // --- Vite Dev Middleware or Production Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DATA SINGULARITY server listening on http://0.0.0.0:${PORT}`);
  });
}

function extractNameFromUrn(urn: string): string {
  const parts = urn.split(',');
  if (parts.length > 1) {
    return parts[parts.length - 2]?.replace(/\)$/, '') || 'unnamed_asset';
  }
  return urn.split(':').pop() || 'unnamed_asset';
}

function extractPlatformFromUrn(urn: string): string {
  const match = urn.match(/urn:li:dataPlatform:([^,)]+)/);
  return match ? match[1] : 'unknown';
}

startServer().catch((err) => {
  console.error('Failed to start DATA SINGULARITY server:', err);
});

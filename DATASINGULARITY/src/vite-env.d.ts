/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATAHUB_GMS_URL?: string;
  readonly VITE_DATAHUB_TOKEN?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
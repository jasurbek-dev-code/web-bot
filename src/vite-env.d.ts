/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_BASE_URL?: string;
  readonly NEXT_PUBLIC_SITE_URL?: string;
  readonly NEXT_PUBLIC_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


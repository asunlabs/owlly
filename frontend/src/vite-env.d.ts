/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_GOERLI_API_KEY: string;
  readonly VITE_GOERLI_PRIVATE_KEY: string;
  readonly VITE_GOERLI_SIGNER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

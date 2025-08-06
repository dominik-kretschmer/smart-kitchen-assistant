interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_ENDPOINT_LOGIN: string;
  readonly VITE_API_ENDPOINT_ME: string;
  readonly VITE_API_ENDPOINT_REGISTER: string;
  readonly VITE_API_ENDPOINT_STOCK: string;
  readonly VITE_API_ENDPOINT_STOCK_USER: string;
  readonly VITE_API_ENDPOINT_SHOPPING_LIST: string;
  readonly VITE_API_ENDPOINT_SHOPPING_LIST_USER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

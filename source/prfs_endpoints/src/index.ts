export function getPrfsDevEndpoints() {
  const env: Endpoint = {
    prfs_code_repository: "https://github.com/taigalabs/prfs-monorepo",
    taigalabs_website: "http://localhost:3060",
    prfs_console_webapp: "http://localhost:3020",
    prfs_proof_webapp: "http://localhost:3000",
    prfs_id_webapp: "http://localhost:3011",
    prfs_poll_webapp: "http://localhost:3021",
    prfs_api_server: "http://localhost:4000",
    prfs_asset_server: "http://localhost:4010",
    prfs_sdk_web: "http://localhost:3010",
    prfs_docs_website: "http://localhost:3061",
  };

  return env;
}

export function getPrfsProdEndpoints() {
  const env: Endpoint = {
    taigalabs_website: "https://www.taigalabs.xyz",
    prfs_code_repository: "https://github.com/taigalabs/prfs-monorepo",
    prfs_console_webapp: "https://console.prfs.xyz",
    prfs_proof_webapp: "https://www.prfs.xyz",
    prfs_id_webapp: "http://id.prfs.xyz",
    prfs_poll_webapp: "https://poll.prfs.xyz",
    prfs_api_server: "https://api.prfs.xyz",
    prfs_asset_server: "https://asset.prfs.xyz",
    prfs_sdk_web: "https://sdk.prfs.xyz",
    prfs_docs_website: "http://docs.prfs.xyz",
  };

  return env;
}

export interface Endpoint {
  taigalabs_website: string;
  prfs_code_repository: string;
  prfs_id_webapp: string;
  prfs_console_webapp: string;
  prfs_proof_webapp: string;
  prfs_poll_webapp: string;
  prfs_sdk_web: string;
  prfs_docs_website: string;
  prfs_api_server: string;
  prfs_asset_server: string;
}

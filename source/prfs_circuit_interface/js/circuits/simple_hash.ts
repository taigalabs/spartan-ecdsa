import { HashData } from "../../bindings/HashData";

export const SIMPLE_HASH_V1_CIRCUIT_TYPE_ID = "simple_hash_v1";

export const SIMPLE_HASH_V1_CIRCUIT_URL = `prfs://${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}/\
${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}.spartan.circuit`;

export const SIMPLE_HASH_V1_WTNS_GEN_URL = `prfs://${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}/\
${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}_js/${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}.wasm`;

export interface SimpleHashV1Inputs {
  hashData: HashData;
}

export interface SimpleHashV1Data {
  label: String;
  value: String;
}

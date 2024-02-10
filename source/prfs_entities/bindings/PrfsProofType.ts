// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CircuitTypeId } from "./CircuitTypeId";

export interface PrfsProofType {
  proof_type_id: string;
  label: string;
  author: string;
  desc: string;
  expression: string;
  img_url: string | null;
  img_caption: string | null;
  circuit_id: string;
  circuit_type_id: CircuitTypeId;
  circuit_type_data: Record<string, any>;
  circuit_driver_id: string;
  created_at: string;
}

// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.

export interface PrfsProofType {
  proof_type_id: string;
  label: string;
  author: string;
  desc: string;
  expression: string;
  img_url: string | null;
  img_caption: string | null;
  circuit_id: string;
  driver_id: string;
  circuit_inputs: Record<number, any>;
  driver_properties: Record<string, any>;
  created_at: number;
}

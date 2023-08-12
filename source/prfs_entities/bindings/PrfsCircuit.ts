// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.

export interface PrfsCircuit {
  circuit_id: string;
  label: string;
  desc: string;
  author: string;
  circuit_dsl: string;
  arithmetization: string;
  proof_algorithm: string;
  elliptic_curve: string;
  finite_field: string;
  driver_id: string;
  driver_version: string;
  circuit_inputs_meta: Record<string, any>[];
  raw_circuit_inputs_meta: Record<string, any>[];
  driver_properties: Record<string, any>;
  created_at: string;
}

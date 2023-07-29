import { PublicInput } from "./helpers/public_input";
import { Tree } from "./helpers/tree";

export declare type PrfsWasmType = typeof import("./wasm_wrapper/build");

// The same structure as MerkleProof in @zk-kit/incremental-merkle-tree.
// Not directly using MerkleProof defined in @zk-kit/incremental-merkle-tree so
// library users can choose whatever merkle tree management method they want.
export interface MerkleProof {
  root: bigint;
  siblings: bigint[];
  pathIndices: number[];
}

export interface EffECDSAPubInput {
  Tx: bigint;
  Ty: bigint;
  Ux: bigint;
  Uy: bigint;
}

export interface EffECDSAPubInput2 {
  Tx: bigint;
  Ty: bigint;
  Ux: bigint;
  Uy: bigint;

  // sInv: bigint;
}

export interface NIZK {
  proof: Uint8Array;
  publicInput: PublicInput;
}

export interface ProverConfig {
  witnessGenWasm: string;
  circuit: string;
  enableProfiler?: boolean;
}

export interface VerifyConfig {
  circuit: string; // Path to circuit file compiled by Nova-Scotia
  enableProfiler?: boolean;
}

export interface IProver {
  circuit: string; // Path to circuit file compiled by Nova-Scotia
  witnessGenWasm: string; // Path to witness generator wasm file generated by Circom

  prove(...args: any): Promise<NIZK>;
}

export interface IVerifier {
  circuit: string; // Path to circuit file compiled by Nova-Scotia

  verify(proof: Uint8Array, publicInput: Uint8Array): Promise<boolean>;
}

export interface PrfsHandlers {
  supportsThreads: boolean;
  poseidonHash(input: Uint8Array): Promise<Uint8Array>;
  prove(circuit: Uint8Array, vars: Uint8Array, public_inputs: Uint8Array): Promise<Uint8Array>;
  verify(circuit: Uint8Array, proof: Uint8Array, public_inputs: Uint8Array): Promise<boolean>;
  verify(circuit: Uint8Array, proof: Uint8Array, public_inputs: Uint8Array): Promise<boolean>;
  makeMerkleProof(leaves: string[], leaf_idx: BigInt, depth: number): Promise<MerkleProof>;
  getBuildStatus(): Promise<string>;
}

export interface WrappedPrfs {
  poseidonHash(inputs: bigint[]): bigint;
  newTree(depth: number): Tree;
  membershshipProve: Promise<NIZK>;
}

export type HashFn = (inputs: bigint[]) => bigint;

export type AsyncHashFn = (inputs: bigint[]) => Promise<bigint>;

export interface PrfsMerkleProof {
  root: bigint;
  siblings: string[];
  pathIndices: number[];
}

declare module "wasm-feature-detect";
import { SpartanMerkleProof } from "@taigalabs/prfs-proof-interface";
import { Tree } from "./utils/tree";
export declare type PrfsWasmType = typeof import("./wasm_wrapper/build");
export interface EffECDSAPubInput {
    Tx: bigint;
    Ty: bigint;
    Ux: bigint;
    Uy: bigint;
}
export interface NIZK {
    proof: Uint8Array;
    publicInput: any;
}
export interface ProverConfig {
    witnessGenWasm: string;
    circuit: string;
    enableProfiler?: boolean;
}
export interface VerifyConfig {
    circuit: string;
    enableProfiler?: boolean;
}
export interface IProver {
    circuit: string;
    witnessGenWasm: string;
    prove(...args: any): Promise<NIZK>;
}
export interface IVerifier {
    circuit: string;
    verify(proof: Uint8Array, publicInput: Uint8Array): Promise<boolean>;
}
export interface PrfsHandlers {
    supportsThreads: boolean;
    poseidonHash(input: Uint8Array): Promise<Uint8Array>;
    prove(circuit: Uint8Array, vars: Uint8Array, public_inputs: Uint8Array): Promise<Uint8Array>;
    verify(circuit: Uint8Array, proof: Uint8Array | number[], public_inputs: Uint8Array): Promise<boolean>;
    makeMerkleProof(leaves: string[], leaf_idx: BigInt, depth: number): Promise<SpartanMerkleProof>;
    getBuildStatus(): Promise<BuildStatus>;
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
export interface BuildStatus {
    wasmThreadSupport: string;
    wasmModulePath: string;
}
export interface SpartanDriverCtorArgs {
    handlers: PrfsHandlers;
    circuit: Uint8Array;
    wtnsGen: Uint8Array;
}
export interface SpartanCircomDriverProperties {
    version: string;
    wtns_gen_url: string;
    circuit_url: string;
}

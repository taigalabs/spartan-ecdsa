// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { SpartanMerkleProof } from "./SpartanMerkleProof";

export interface MerkleSigPosRangeV1Inputs {
  sigLower: bigint;
  sigUpper: bigint;
  leaf: bigint;
  assetSize: bigint;
  assetSizeGreaterEqThan: bigint;
  assetSizeLessThan: bigint;
  merkleProof: SpartanMerkleProof;
  nonce: bigint;
  serialNo: bigint;
}

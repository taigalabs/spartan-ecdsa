// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { MerkleSigPosRangeV1 } from "./MerkleSigPosRangeV1";
import type { SimpleHashV1 } from "./SimpleHashV1";

export type CircuitTypeData =
  | ({ type: "simple_hash_v1" } & SimpleHashV1)
  | ({ type: "merkle_sig_pos_range_v1" } & MerkleSigPosRangeV1);

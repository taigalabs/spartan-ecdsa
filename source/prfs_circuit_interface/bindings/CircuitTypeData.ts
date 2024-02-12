// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AddrMembershipV1Data } from "./AddrMembershipV1Data";
import type { MerkleSigPosRangeV1Data } from "./MerkleSigPosRangeV1Data";
import type { SimpleHashV1Data } from "./SimpleHashV1Data";

export type CircuitTypeData =
  | ({ type: "simple_hash_v1" } & SimpleHashV1Data)
  | ({ type: "addr_membership_v1" } & AddrMembershipV1Data)
  | ({ type: "merkle_sig_pos_range_v1" } & MerkleSigPosRangeV1Data);

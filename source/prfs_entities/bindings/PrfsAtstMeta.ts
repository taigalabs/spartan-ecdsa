// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CryptoAssetMeta } from "./CryptoAssetMeta";
import type { PlainDataAtstMeta } from "./PlainDataAtstMeta";

export type PrfsAtstMeta =
  | ({ type: "crypto_asset" } & CryptoAssetMeta)
  | ({ type: "plain_data" } & PlainDataAtstMeta);

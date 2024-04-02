// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AttestTwitterAccResponse } from "./AttestTwitterAccResponse";
import type { ComputeCryptoAssetSizeTotalValuesResponse } from "./ComputeCryptoAssetSizeTotalValuesResponse";
import type { CreateCryptoAssetSizeAtstResponse } from "./CreateCryptoAssetSizeAtstResponse";
import type { FetchCryptoAssetResponse } from "./FetchCryptoAssetResponse";
import type { GetCryptoAssetSizeAtstResponse } from "./GetCryptoAssetSizeAtstResponse";
import type { GetCryptoAssetSizeAtstsResponse } from "./GetCryptoAssetSizeAtstsResponse";
import type { GetPrfsAttestationsResponse } from "./GetPrfsAttestationsResponse";
import type { GetTwitterAccAtstResponse } from "./GetTwitterAccAtstResponse";
import type { GetTwitterAccAtstsResponse } from "./GetTwitterAccAtstsResponse";
import type { ValidateTwitterAccResponse } from "./ValidateTwitterAccResponse";

export type PrfsAtstApiResponse =
  | ({ type: "fetch_crypto_asset" } & FetchCryptoAssetResponse)
  | ({ type: "create_crypto_asset_size_atst" } & CreateCryptoAssetSizeAtstResponse)
  | ({ type: "get_crypto_asset_size_atst" } & GetCryptoAssetSizeAtstResponse)
  | ({ type: "get_crypto_asset_size_atsts" } & GetCryptoAssetSizeAtstsResponse)
  | ({ type: "get_prfs_attestations" } & GetPrfsAttestationsResponse)
  | ({ type: "compute_crypto_asset_size_total_values" } & ComputeCryptoAssetSizeTotalValuesResponse)
  | ({ type: "validate_twitter_acc" } & ValidateTwitterAccResponse)
  | ({ type: "attest_twitter_acc" } & AttestTwitterAccResponse)
  | ({ type: "get_twitter_acc_atsts" } & GetTwitterAccAtstsResponse)
  | ({ type: "get_twitter_acc_atst" } & GetTwitterAccAtstResponse);

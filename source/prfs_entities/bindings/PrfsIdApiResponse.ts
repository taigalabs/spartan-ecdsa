// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { GetPrfsIdAppResponse } from "./GetPrfsIdAppResponse";
import type { SignInPrfsIdentityResponse } from "./SignInPrfsIdentityResponse";
import type { SignUpPrfsIdentityResponse } from "./SignUpPrfsIdentityResponse";

export type PrfsIdApiResponse =
  | ({ type: "get_prfs_id_app" } & GetPrfsIdAppResponse)
  | ({ type: "sign_up_prfs_identity" } & SignUpPrfsIdentityResponse)
  | ({ type: "sign_in_prfs_identity" } & SignInPrfsIdentityResponse);

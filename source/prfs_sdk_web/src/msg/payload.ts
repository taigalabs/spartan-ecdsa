import {
  LogEventPayload,
  LoadDriverEventPayload,
  ProveReceipt,
  VerifyReceipt,
} from "@taigalabs/prfs-driver-interface";

export type MsgType =
  | "HANDSHAKE"
  | "HANDSHAKE_RESPONSE"
  | "LOAD_DRIVER"
  | "LOAD_DRIVER_EVENT"
  | "LOAD_DRIVER_RESPONSE"
  | "GET_ADDRESS"
  | "GET_ADDRESS_RESPONSE"
  | "GET_SIGNATURE"
  | "GET_SIGNATURE_RESPONSE"
  | "CREATE_PROOF"
  | "CREATE_PROOF_RESPONSE"
  | "CREATE_PROOF_EVENT"
  | "CREATE_PROOF_EVENT_RESPONSE"
  | "VERIFY_PROOF"
  | "VERIFY_PROOF_RESPONSE"
  | "VERIFY_PROOF_EVENT"
  | "VERIFY_PROOF_EVENT_RESPONSE"
  | "HASH"
  | "HASH_RESPONSE";

export interface HandshakePayload {}

export interface HandshakeResponsePayload {}

export interface LoadDriverPayload {
  circuit_driver_id: string;
  driver_properties: Record<string, any>;
}

export interface CreateProofPayload {
  inputs: any;
  circuitTypeId: string;
}

export interface VerifyProofPayload {
  proveResult: any;
  circuitTypeId: string;
}

export interface GetSignaturePayload {
  msgRaw: string;
}

export interface GetSignatureResponsePayload {
  msgHash: Buffer;
  sig: string;
}

export interface LoadDriverResponsePayload {
  circuitDriverId: string;
  artifactCount: number;
}

export interface HashPayload {
  msg: bigint[];
}

export interface HashResponsePayload {
  msgHash: bigint;
}

export type ReqPayload<T extends MsgType> = //
  T extends "HANDSHAKE"
    ? HandshakePayload
    : T extends "HANDSHAKE_RESPONSE"
    ? HandshakeResponsePayload
    : T extends "GET_ADDRESS"
    ? string
    : T extends "GET_ADDRESS_RESPONSE"
    ? string
    : T extends "LOAD_DRIVER"
    ? LoadDriverPayload
    : T extends "LOAD_DRIVER_RESPONSE"
    ? LoadDriverResponsePayload
    : T extends "LOAD_DRIVER_EVENT"
    ? LoadDriverEventPayload
    : T extends "GET_SIGNATURE"
    ? GetSignaturePayload
    : T extends "GET_SIGNATURE_RESPONSE"
    ? GetSignatureResponsePayload
    : T extends "CREATE_PROOF"
    ? CreateProofPayload
    : T extends "CREATE_PROOF_RESPONSE"
    ? ProveReceipt
    : T extends "CREATE_PROOF_EVENT"
    ? LogEventPayload
    : T extends "HASH"
    ? HashPayload
    : T extends "HASH_RESPONSE"
    ? HashResponsePayload
    : T extends "VERIFY_PROOF"
    ? VerifyProofPayload
    : T extends "VERIFY_PROOF_RESPONSE"
    ? VerifyReceipt
    : T extends "VERIFY_PROOF_EVENT"
    ? LogEventPayload
    : never;

export type RespPayload<T extends MsgType> = //
  T extends "HANDSHAKE"
    ? void
    : T extends "HANDSHAKE_RESPONSE"
    ? never
    : T extends "GET_ADDRESS"
    ? string
    : T extends "GET_ADDRESS_RESPONSE"
    ? never
    : T extends "GET_SIGNATURE"
    ? GetSignatureResponsePayload
    : T extends "GET_SIGNATURE_RESPONSE"
    ? never
    : T extends "LOAD_DRIVER"
    ? LoadDriverResponsePayload
    : T extends "LOAD_DRIVER_EVENT"
    ? never
    : T extends "LOAD_DRIVER_RESPONSE"
    ? never
    : T extends "CREATE_PROOF"
    ? ProveReceipt
    : T extends "CREATE_PROOF_RESPONSE"
    ? void
    : T extends "CREATE_PROOF_EVENT"
    ? never
    : T extends "CREATE_PROOF_EVENT_RESPONSE"
    ? never
    : T extends "HASH"
    ? HashResponsePayload
    : T extends "VERIFY_PROOF"
    ? VerifyReceipt
    : T extends "VERIFY_PROOF_RESPONSE"
    ? void
    : never;

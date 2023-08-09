export enum MsgType {
  HANDSHAKE = "HANDSHAKE",
  HANDSHAKE_RESPONSE = "HANDSHAKE_RESPONSE",
  GET_SIGNER = "GET_SIGNER",
  GET_SIGNER_RESPONSE = "GET_SIGNER_RESPONSE",
}

export interface Msg {
  error?: any;
  type: MsgType;
  payload: any;
}

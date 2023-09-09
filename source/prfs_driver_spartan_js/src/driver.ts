import {
  CircuitDriver,
  ProveArgs,
  ProveResult,
  ProveReceipt,
  VerifyArgs,
} from "@taigalabs/prfs-driver-interface";
import { BN } from "bn.js";

import { Tree } from "./helpers/tree";
import { makePoseidon } from "./helpers/poseidon";
import { PrfsHandlers, AsyncHashFn, BuildStatus, SpartanMerkleProof } from "./types";
import { fromSig, snarkJsWitnessGen } from "./helpers/utils";
import {
  CircuitPubInput,
  PublicInput,
  SECP256K1_P,
  computeEffEcdsaPubInput2,
  verifyEffEcdsaPubInput,
} from "./helpers/public_input";
import { deserializePublicInput, serializePublicInput } from "./serialize";

export default class SpartanDriver implements CircuitDriver {
  handlers: PrfsHandlers;
  wtnsGenUrl: string;
  circuit: Uint8Array;

  constructor(args: SpartanDriverCtorArgs) {
    this.handlers = args.handlers;

    if (args.circuit === undefined) {
      throw new Error("Spartan cannot be instantiated without circuitUrl");
    }

    if (args.wtnsGenUrl === undefined) {
      throw new Error("Spartan cannot be instantiated without wtnsGenUrl");
    }

    this.circuit = args.circuit;
    this.wtnsGenUrl = args.wtnsGenUrl;
  }

  async getBuildStatus(): Promise<BuildStatus> {
    return this.handlers.getBuildStatus();
  }

  async makeMerkleProof(leaves: string[], leafIdx: BigInt, depth: number) {
    return this.handlers.makeMerkleProof(leaves, leafIdx, depth);
  }

  newPoseidon() {
    return makePoseidon(this.handlers);
  }

  async newTree(depth: number, hash: AsyncHashFn): Promise<Tree> {
    return await Tree.newInstance(depth, hash);
  }

  async prove(args: ProveArgs<MembershipProveInputs>): Promise<ProveReceipt> {
    const { inputs, eventListener } = args;
    const { sigData, merkleProof } = inputs;
    const { msgRaw, msgHash, sig } = sigData;

    // console.log("inputs: %o", inputs);

    const { r, s, v } = fromSig(sig);
    const effEcdsaPubInput = computeEffEcdsaPubInput2(r, v, msgHash);

    eventListener("debug", "Computed ECDSA pub input");

    const circuitPubInput = new CircuitPubInput(
      merkleProof.root,
      effEcdsaPubInput.Tx,
      effEcdsaPubInput.Ty,
      effEcdsaPubInput.Ux,
      effEcdsaPubInput.Uy
    );

    const publicInput = new PublicInput(r, v, msgRaw, msgHash, circuitPubInput);
    const m = new BN(msgHash).mod(SECP256K1_P);

    const witnessGenInput = {
      r,
      s,
      m: BigInt(m.toString()),

      // merkle root
      root: merkleProof.root,
      siblings: merkleProof.siblings,
      pathIndices: merkleProof.pathIndices,

      // Eff ECDSA PubInput
      Tx: effEcdsaPubInput.Tx,
      Ty: effEcdsaPubInput.Ty,
      Ux: effEcdsaPubInput.Ux,
      Uy: effEcdsaPubInput.Uy,
    };

    // console.log("witnessGenInput: %o", witnessGenInput);
    const witness = await snarkJsWitnessGen(witnessGenInput, this.wtnsGenUrl);

    eventListener("info", "Computed witness gen input");

    const circuitPublicInput: Uint8Array = publicInput.circuitPubInput.serialize();

    const prev = performance.now();
    const proof = await this.handlers.prove(this.circuit, witness.data, circuitPublicInput);
    const now = performance.now();

    return {
      duration: now - prev,
      proveResult: {
        proof,
        publicInputSer: serializePublicInput(publicInput),
      },
    };
  }

  async verify(args: VerifyArgs): Promise<boolean> {
    const { inputs } = args;
    const { proof, publicInputSer } = inputs;

    const publicInput = deserializePublicInput(publicInputSer);
    const isPubInputValid = verifyEffEcdsaPubInput(publicInput as PublicInput);

    let isProofValid;
    try {
      isProofValid = await this.handlers.verify(
        this.circuit,
        proof,
        publicInput.circuitPubInput.serialize()
      );
    } catch (_e) {
      isProofValid = false;
    }

    return isProofValid && isPubInputValid;
  }
}

export interface SpartanDriverCtorArgs {
  handlers: PrfsHandlers;
  wtnsGenUrl: string;
  circuit: Uint8Array;
}

export interface MembershipProveInputs {
  sigData: {
    msgRaw: string;
    msgHash: Buffer;
    sig: string;
  };
  merkleProof: SpartanMerkleProof;
}

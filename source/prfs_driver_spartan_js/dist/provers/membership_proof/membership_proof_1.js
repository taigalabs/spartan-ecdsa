import { BN } from "bn.js";
import { toBuffer } from "@ethereumjs/util";
import { fromSig, snarkJsWitnessGen } from "@/utils/utils";
import { makePoseidon } from "@/utils/poseidon";
import { MembershipProofCircuitPubInput, MembershipProofPublicInput, computeEffEcdsaPubInput, verifyEffEcdsaPubInput, } from "./public_input";
import { SECP256K1_P } from "@/math/secp256k1";
export async function proveMembership(args, handlers, wtnsGen, circuit) {
    const { inputs, eventListener } = args;
    const { sigData, merkleProof } = inputs;
    const { msgRaw, msgHash, sig } = sigData;
    const { r, s, v } = fromSig(sig);
    const poseidon = makePoseidon(handlers);
    let serialNo;
    try {
        serialNo = await poseidon([s, BigInt(0)]);
    }
    catch (err) {
        throw new Error(`Error Poseidon hashing, err: ${err}`);
    }
    const effEcdsaPubInput = computeEffEcdsaPubInput(r, v, toBuffer(msgHash));
    eventListener({
        type: "CREATE_PROOF_EVENT",
        payload: { type: "info", payload: "Computed ECDSA pub input" },
    });
    const circuitPubInput = new MembershipProofCircuitPubInput(merkleProof.root, effEcdsaPubInput.Tx, effEcdsaPubInput.Ty, effEcdsaPubInput.Ux, effEcdsaPubInput.Uy, serialNo);
    const publicInput = new MembershipProofPublicInput(r, v, msgRaw, msgHash, circuitPubInput);
    const m = new BN(toBuffer(msgHash)).mod(SECP256K1_P);
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
        serialNo,
    };
    // console.log("witnessGenInput: %o", witnessGenInput);
    const witness = await snarkJsWitnessGen(witnessGenInput, wtnsGen);
    eventListener({
        type: "CREATE_PROOF_EVENT",
        payload: {
            type: "info",
            payload: "Computed witness gen input",
        },
    });
    const circuitPublicInput = publicInput.circuitPubInput.serialize();
    const prev = performance.now();
    let proofBytes;
    try {
        proofBytes = await handlers.prove(circuit, witness.data, circuitPublicInput);
    }
    catch (err) {
        throw new Error(`Error calling prove(), err: ${err}`);
    }
    const now = performance.now();
    return {
        duration: now - prev,
        proof: {
            proofBytes,
            publicInputSer: publicInput.serialize(),
        },
    };
}
export async function verifyMembership(args, handlers, circuit) {
    const { proof } = args;
    const { proofBytes, publicInputSer } = proof;
    const publicInput = MembershipProofPublicInput.deserialize(publicInputSer);
    const isPubInputValid = verifyEffEcdsaPubInput(publicInput);
    let isProofValid;
    try {
        isProofValid = await handlers.verify(circuit, proofBytes, publicInput.circuitPubInput.serialize());
    }
    catch (err) {
        throw new Error(`Error calling verify(), err: ${err}`);
    }
    return isProofValid && isPubInputValid;
}

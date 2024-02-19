export declare class MerkleSigPosRangePublicInput {
    circuitPubInput: MerkleSigPosRangeCircuitPubInput;
    nonce: string;
    constructor(circuitPubInput: MerkleSigPosRangeCircuitPubInput, nonce: string);
    serialize(): string;
    static deserialize(publicInputSer: string): MerkleSigPosRangePublicInput;
}
export declare class MerkleSigPosRangeCircuitPubInput {
    merkleRoot: bigint;
    nonceInt: bigint;
    serialNo: bigint;
    assetSizeGreaterEqThan: bigint;
    assetSizeLessThan: bigint;
    constructor(merkleRoot: bigint, nonceInt: bigint, serialNo: bigint, assetSizeGreaterEqThan: bigint, assetSizeLessThan: bigint);
    serialize(): Uint8Array;
    static deserialize(serialized: Uint8Array): MerkleSigPosRangeCircuitPubInput;
}

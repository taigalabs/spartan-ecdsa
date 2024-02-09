import { SPARTAN_DRIVER_V1_ID } from "@taigalabs/prfs-driver-interface";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import {
  ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID,
  SIMPLE_HASH_V1_CIRCUIT_TYPE_ID,
  MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID,
  MERKLE_POS_RANGE_INPUT_TYPE_V1,
  MERKLE_POS_RANGE_V1_CIRCUIT_ID,
  ADDR_MEMBERSHIP2_V1_CIRCUIT_URL,
  ADDR_MEMBERSHIP2_V1_WTNS_GEN_URL,
  SIMPLE_HASH_V1_CIRCUIT_URL,
  SIMPLE_HASH_V1_WTNS_GEN_URL,
  MERKLE_POS_RANGE_V1_CIRCUIT_URL,
  MERKLE_POS_RANGE_V1_WTNS_GEN_URL,
} from "@taigalabs/prfs-circuit-interface";
import path from "path";
import fs from "fs";

const proofTypeIds = {
  ETH_0_0001_1: "ETH_0_0001_1",
  SIMPLE_HASH_1: "SIMPLE_HASH_1",
  CRYPTO_ASSET_SIZE_V1: "CRYPTO_ASSET_SIZE_V1",
};

const proofTypes = (() => {
  const currDir = path.dirname(__filename);

  const proofTypes = { ...proofTypeIds };

  let key: keyof typeof proofTypeIds;
  for (key in proofTypes) {
    const val = proofTypeIds[key];
    const filePath = path.resolve(currDir, `../proof_types/${val}.md`);
    const md = fs.readFileSync(filePath).toString();

    proofTypes[key] = md;
  }

  return proofTypes;
})();

const sig_data_circuit_input = {
  desc: "Message over which a signature is made",
  name: "sigData",
  type: "SIG_DATA_1",
  label: "Signature",
  value: "",
};

const simple_hash_1 = {
  desc: "Hash data",
  name: "hashData",
  type: "HASH_DATA_1",
  label: "Hash data",
  value: "",
};

const proof_types: PrfsProofType[] = [
  {
    proof_type_id: proofTypeIds.ETH_0_0001_1,
    label: "0.0001ETH ownership",
    author: "Prfs",
    desc: proofTypes.ETH_0_0001_1,
    // "Prove you are one of the wallet owners of a list of all wallets that have 0.0001-0.0002 ETH",
    expression: "Owns 0.0001 ETH",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/Ethereum_logo_translucent.svg",
    img_caption: "0.0001",
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID,
    circuit_driver_id: SPARTAN_DRIVER_V1_ID,
    driver_properties: {
      circuit_url: ADDR_MEMBERSHIP2_V1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_V1_WTNS_GEN_URL,
    },
    created_at: "2023-05-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.SIMPLE_HASH_1,
    label: "Simple hash",
    author: "Prfs",
    desc: proofTypes.SIMPLE_HASH_1,
    // "Proves he knows the preimage of a cryptographic hash function",
    expression: "Knows hash argument",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/hash.png",
    img_caption: "",
    circuit_id: "00000000-0000-0000-0000-000000000001",
    circuit_type_id: SIMPLE_HASH_V1_CIRCUIT_TYPE_ID,
    circuit_driver_id: SPARTAN_DRIVER_V1_ID,
    circuit_inputs: [simple_hash_1],
    driver_properties: {
      circuit_url: SIMPLE_HASH_V1_CIRCUIT_URL,
      wtns_gen_url: SIMPLE_HASH_V1_WTNS_GEN_URL,
    },
    created_at: "2023-09-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.CRYPTO_ASSET_SIZE_V1,
    label: "Cryto asset size claim",
    author: "Prfs",
    desc: proofTypes.CRYPTO_ASSET_SIZE_V1,
    expression: "Has assets in crypto worth X USD",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/money-cash-icon-png.webp",
    img_caption: null,
    circuit_id: MERKLE_POS_RANGE_V1_CIRCUIT_ID,
    circuit_type_id: MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID,
    circuit_driver_id: SPARTAN_DRIVER_V1_ID,
    circuit_inputs: [
      {
        ref_type: "PRFS_SET",
        ref_value: "crypto_holders",
        desc: "Who you are among those",
        name: "merkleProof",
        type: MERKLE_POS_RANGE_INPUT_TYPE_V1,
        element_type: "ADDRESS",
        label: "Member",
        value: "",
      },
    ],
    driver_properties: {
      circuit_url: MERKLE_POS_RANGE_V1_CIRCUIT_URL,
      wtns_gen_url: MERKLE_POS_RANGE_V1_WTNS_GEN_URL,
    },
    created_at: "2024-01-29T16:39:57-08:00",
  },
];

export default proof_types;

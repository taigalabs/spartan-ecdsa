import React from "react";
import { sigPoseidon } from "@taigalabs/prfs-crypto-js";
import { useSearchParams } from "next/navigation";
import { PrfsIdCredential, RandKeyPairQuery, RandKeyPairType } from "@taigalabs/prfs-id-sdk-web";
import { hexlify } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";

import styles from "./RandKeyPairView.module.scss";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";
import RandKeyPairItem from "./RandKeyPairItem";

const RandKeyPairView: React.FC<RandKeyPairViewProps> = ({ query, credential, setReceipt }) => {
  const searchParams = useSearchParams();
  const [elem, setElem] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        const { name, preImage, type } = query;
        if (type === RandKeyPairType.EC_SECP256K1) {
          const { hashed } = await sigPoseidon(credential.secret_key, preImage);
          const cm = hexlify(hashed);

          setReceipt(oldVal => ({
            ...oldVal,
            [name]: cm,
          }));

          setElem(
            <RandKeyPairItem key={name} name={name} val={preImage} type={type} hashedHex={cm} />,
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setElem, query]);

  return <>{elem}</>;
};

export default RandKeyPairView;

export interface RandKeyPairViewProps {
  credential: PrfsIdCredential;
  query: RandKeyPairQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}

"use client";

import React from "react";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

import styles from "./CreateProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";
import PostCreateMenu from "./PostCreateMenu";
import { paths } from "@/paths";
import ProofTypeMasthead from "@/components/masthead/ProofTypeMasthead";
import TutorialPlaceholder from "@/components/tutorial/TutorialPlaceholder";
import { useSelectProofType } from "@/hooks/proofType";

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const proofTypeIdRef = React.useRef<string | null>(null);
  const [proveReceipt, setProveReceipt] = React.useState<ProveReceipt>();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isTutorial = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return true;
    }
    return false;
  }, [searchParams]);

  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi2("get_prfs_proof_type_by_proof_type_id", req);
    },
  });

  React.useEffect(() => {
    async function fn() {
      const proofTypeId = searchParams.get("proof_type_id");

      if (proofTypeId) {
        if (proofTypeIdRef.current && proofTypeIdRef.current !== proofTypeId) {
          setProveReceipt(undefined);
        }

        proofTypeIdRef.current = proofTypeId;

        const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
          proof_type_id: proofTypeId,
        });

        setProofType(payload.prfs_proof_type);
      } else {
      }
    }

    fn().then();
  }, [searchParams, proofTypeIdRef, setProveReceipt]);

  const handleSelectProofType = useSelectProofType();

  const handleCreateProofResult = React.useCallback(
    async (err: any, proveReceipt: ProveReceipt | null) => {
      if (err) {
        console.error(err);
      } else if (proveReceipt !== null) {
        setProveReceipt(proveReceipt);
      }
    },
    [setProveReceipt],
  );

  return (
    <>
      <ProofTypeMasthead proofType={proofType} handleSelectProofType={handleSelectProofType} />
      <div className={styles.wrapper}>
        <div className={cn({ [styles.formArea]: true, [styles.proofTypeChosen]: !!proofType })}>
          {proveReceipt ? (
            <Fade>
              <PostCreateMenu
                proveReceipt={proveReceipt}
                proofType={proofType!}
                proofGenElement={proofGenElement!}
              />
            </Fade>
          ) : (
            <div
              className={cn({
                [styles.formWrapper]: true,
                [styles.proofTypeChosen]: !!proofType,
              })}
            >
              <div className={styles.moduleWrapper}>
                {proofType ? (
                  <Fade>
                    <CreateProofModule
                      proofType={proofType}
                      handleCreateProofResult={handleCreateProofResult}
                      proofGenElement={proofGenElement}
                      setProofGenElement={setProofGenElement}
                    />
                  </Fade>
                ) : (
                  <div className={styles.loading}>Loading module...</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {isTutorial && <TutorialPlaceholder />}
    </>
  );
};

export default CreateProofForm;

export interface ProofTypeItem {
  proofTypeId: string;
  label: string;
  imgUrl: string | null;
}

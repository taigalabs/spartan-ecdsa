"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./ProofType.module.scss";
import { stateContext } from "@/contexts/state";
import { WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import { useRouter } from "next/navigation";
import CircuitInputTable from "@/components/circuit_input_table/CircuitInputTable";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";
import ProofTypeDetailTable from "@/components/proof_type_detail_table/ProofTypeDetailTable";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);
  const router = useRouter();

  const [proofType, setProofType] = React.useState<PrfsProofType>();
  React.useEffect(() => {
    async function fn() {
      const { payload } = await prfsApi.getPrfsProofTypeByProofTypeId({
        proof_type_id: params.proof_type_id,
      });

      setProofType(payload.prfs_proof_type);
    }

    fn().then();
  }, [setProofType]);

  const proofTypeSummaryLabel = `${i18n.proof_type_summary_label} ${params.proof_type_id}`;

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <Link href={paths.proof__proof_types}>
          <ArrowButton variant="left" />
        </Link>
        <WidgetLabel>{proofTypeSummaryLabel}</WidgetLabel>
      </ContentAreaHeader>

      <div className={styles.contentBody}>
        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <ProofTypeDetailTable proofType={proofType} />
          </div>
        </ContentAreaRow>

        <ContentAreaRow>
          <div className={styles.singleColRow}>
            <div className={styles.tableTitle}>{i18n.circuit_inputs}</div>
            {proofType && (
              <CircuitInputTable circuit_inputs={proofType.circuit_inputs as CircuitInput[]} />
            )}
          </div>
        </ContentAreaRow>
      </div>
    </DefaultLayout>
  );
};

export default Program;

interface ProgramProps {
  params: {
    proof_type_id: string;
  };
}

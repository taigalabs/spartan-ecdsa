"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import { HiMiniDocumentPlus } from "react-icons/hi2";

import styles from "./Proofs.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import ProofInstanceTable from "@/components/proof_instance_table/ProofInstanceTable";
import CreateProofInstanceForm from "@/components/create_proof_instance_form/CreateProofInstanceForm";
import { paths } from "@/routes/path";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  useLocalWallet(dispatch);

  const [createPage, setCreatePage] = React.useState(false);

  React.useEffect(() => {
    let createPage = searchParams.get("create") !== null;

    setCreatePage(createPage);
  }, [searchParams]);

  const handleClickCreateProofType = React.useCallback(() => {
    router.push(`${paths.proof__proof_instances}?create`);
  }, [router]);

  return (
    <DefaultLayout>
      {createPage ? (
        <CreateProofInstanceForm />
      ) : (
        <CardRow>
          <Card>
            <Widget>
              <TopWidgetTitle>
                <div className={styles.proofInstanceWidgetHeader}>
                  <WidgetLabel>{i18n.proof_instances}</WidgetLabel>
                  <div className={styles.btnArea}>
                    <Button variant="transparent_c" handleClick={handleClickCreateProofType}>
                      <HiMiniDocumentPlus />
                      {i18n.create_proof_instance.toUpperCase()}
                    </Button>
                  </div>
                </div>
              </TopWidgetTitle>
              <PaddedTableWrapper>
                <ProofInstanceTable />
              </PaddedTableWrapper>
            </Widget>
          </Card>
        </CardRow>
      )}
    </DefaultLayout>
  );
};

export default Proofs;

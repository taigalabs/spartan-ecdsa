"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiFillFolderAdd } from "react-icons/ai";
import Link from "next/link";

import styles from "./ProofTypes.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import CardRow from "@/components/card_row/CardRow";
import ProofTypeTable from "@/components/proof_type_table/ProofTypeTable";
import CreateProofTypeForm from "@/components/create_proof_type_form/CreateProofTypeForm";
import { paths } from "@/paths";
import ContentAreaHeader from "@/components/content_area/ContentArea";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  const searchParams = useSearchParams();
  const [createPage, setCreatePage] = React.useState(false);

  React.useEffect(() => {
    let createPage = searchParams.get("create") !== null;

    setCreatePage(createPage);
  }, [searchParams]);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      {createPage ? (
        <CreateProofTypeForm />
      ) : (
        <>
          <ContentAreaHeader>
            <WidgetLabel>{i18n.proof_types}</WidgetLabel>
            <Button className={styles.iconBtn} variant="transparent_aqua_blue_1">
              <Link href={`${paths.proof__proof_types}?create`}>
                <AiFillFolderAdd />
                <span>{i18n.create_proof_type.toUpperCase()}</span>
              </Link>
            </Button>
          </ContentAreaHeader>
          <CardRow>
            <Widget>
              {/* <TopWidgetTitle> */}
              {/*   <div className={styles.header}> */}
              {/*     <WidgetLabel>{i18n.proof_types}</WidgetLabel> */}
              {/*     <Button className={styles.iconBtn} variant="transparent_aqua_blue_1"> */}
              {/*       <Link href={`${paths.proof__proof_types}?create`}> */}
              {/*         <AiFillFolderAdd /> */}
              {/*         <span>{i18n.create_proof_type.toUpperCase()}</span> */}
              {/*       </Link> */}
              {/*     </Button> */}
              {/*   </div> */}
              {/* </TopWidgetTitle> */}
              <PaddedTableWrapper>
                <div className={styles.tableContainer}>
                  <ProofTypeTable />
                </div>
              </PaddedTableWrapper>
            </Widget>
          </CardRow>
        </>
      )}
    </DefaultLayout>
  );
};

export default Proofs;

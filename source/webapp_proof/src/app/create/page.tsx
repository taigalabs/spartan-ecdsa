import React from "react";

import styles from "./page.module.scss";
import DefaultLayout, { DefaultBody, DefaultFooter } from "@/layouts/default_layout/DefaultLayout";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import Masthead from "@/components/masthead/Masthead";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Tutorial from "@/components/tutorial/Tutorial";
import { useSearchParams } from "next/navigation";

const CreatePage = () => {
  const searchParams = useSearchParams();

  const proofType = searchParams.get("proof_type");
  console.log(22, proofType);

  return (
    <DefaultLayout>
      <Masthead />
      <DefaultBody>
        <div className={styles.container}>
          <Tutorial />
          <CreateProofForm />
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default CreatePage;

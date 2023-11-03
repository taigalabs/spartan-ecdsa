import React from "react";

import styles from "./page.module.scss";
import DefaultLayout, {
  DefaultBody,
  DefaultFooter,
} from "@/components/layouts/default_layout/DefaultLayout";
import Masthead from "@/components/masthead/Masthead";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import Tutorial from "@/components/tutorial/Tutorial";
import SearchProofTypeForm from "@/components/search_proof_type_form/SearchProofTypeForm";

const HomePage = () => {
  return (
    <DefaultLayout>
      <Masthead />
      <DefaultBody>
        <div className={styles.container}>
          <Tutorial />
          <SearchProofTypeForm />
        </div>
      </DefaultBody>
      <DefaultFooter>
        <GlobalFooter />
      </DefaultFooter>
    </DefaultLayout>
  );
};

export default HomePage;

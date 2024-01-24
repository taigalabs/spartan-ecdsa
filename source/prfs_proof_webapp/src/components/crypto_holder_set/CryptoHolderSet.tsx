"use client";

import React from "react";
import cn from "classnames";

import styles from "./CryptoHolderSet.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoHolderSetTable from "./CryptoHolderSetTable";
import { AttestationsHeader, AttestationsTitle } from "../attestations/AttestationComponents";

const CryptoHolderSet: React.FC<CryptoHolderSetProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsHeader>
        <AttestationsTitle className={styles.title}>
          123
          {/* {i18n.twitter_acc_attestations} */}
        </AttestationsTitle>
      </AttestationsHeader>
      <div>
        <CryptoHolderSetTable />
      </div>
    </>
  );
};

export default CryptoHolderSet;

export interface CryptoHolderSetProps {}

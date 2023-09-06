"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./HomePage.module.scss";
import { paths } from "@/paths";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Masthead from "@/components/masthead/Masthead";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <DefaultLayout>
      <Masthead />
      <div className={styles.container}>
        <h1>generator simple ui</h1>
      </div>
    </DefaultLayout>
  );
};

export default HomePage;

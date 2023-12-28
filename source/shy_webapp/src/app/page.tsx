import React, { Suspense } from "react";

import styles from "./HomePage.module.scss";
import DefaultLayout from "@/components/layouts/default_layout/DefaultLayout";
import Home from "@/components/home/Home";

const HomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <Suspense>
        <Home />
      </Suspense>
    </DefaultLayout>
  );
};

export default HomePage;

"use client";

import React from "react";
import cn from "classnames";

import styles from "./HomeMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInBtn from "@/components/prfs_id_sign_in_btn/PrfsIdSignInBtn";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import {
  MastheadRightGroup,
  MastheadRightGroupMenu,
  MastheadWrapper,
} from "@/components/masthead/MastheadComponents";
import { PRFS_PROOF_APP_ID } from "@/app_id";

const HomeMasthead: React.FC<HomeMastheadProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <MastheadWrapper className={cn(styles.wrapper)}>
      <MastheadRightGroup className={styles.rightGroup}>
        <MastheadRightGroupMenu className={styles.menu}>
          <PrfsAppsPopoverDefault disableMarkIsOpen />
        </MastheadRightGroupMenu>
        <MastheadRightGroupMenu className={cn(styles.signInBtn, styles.menu)}>
          <PrfsIdSignInBtn appId={PRFS_PROOF_APP_ID} />
        </MastheadRightGroupMenu>
      </MastheadRightGroup>
    </MastheadWrapper>
  );
};

export default HomeMasthead;

export interface HomeMastheadProps {}

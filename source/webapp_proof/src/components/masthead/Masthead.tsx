"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { useSearchParams } from "next/navigation";

const Masthead: React.FC<MastheadProps> = () => {
  const i18n = React.useContext(i18nContext);

  const searchParams = useSearchParams();

  const isTutorial = React.useMemo(() => {
    if (searchParams.get("tutorial") !== null) {
      return true;
    }
    return false;
  }, [searchParams]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <ul className={styles.rightGroup}>
          <li>
            <Link href={`${paths.__}?tutorial`}>
              <p className={cn({ [styles.isTutorial]: isTutorial })}>{i18n.tutorial}</p>
            </Link>
          </li>
          <li>
            <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>{i18n.docs}</Link>
          </li>
          <li>
            <PrfsAppsPopover
              webappPollEndpoint={process.env.NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT}
              webappProofEndpoint={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
              webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
            />
          </li>
          {/* <li>{i18n.account}</li> */}
        </ul>
      </div>
    </div>
  );
};

export default Masthead;

export interface MastheadProps {}

"use client";

import React from "react";
import { PrfsIdCredential } from "@taigalabs/prfs-crypto-js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";

import styles from "./PrfsIdAppSignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleFooter,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";
import { envs } from "@/envs";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import PrfsIdErrorDialog from "@/components/prfs_id/prfs_id_error_dialog/PrfsIdErrorDialog";
import PrfsIdSignIn from "@/components/prfs_id/prfs_id_sign_in/PrfsIdSignIn";
import AppCredential from "./AppCredential";

enum SignInStep {
  PrfsIdCredential,
  AppCredential,
}

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const PrfsIdAppSignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [signInStatus, setSignInStatus] = React.useState(SignInStatus.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(SignInStep.PrfsIdCredential);
  const [publicKey, setPublicKey] = React.useState<string | null>(null);
  const [appId, setAppId] = React.useState<string | null>(null);
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);

  React.useEffect(() => {
    const publicKey = searchParams.get("public_key");
    const appId = searchParams.get("app_id");

    if (!publicKey) {
      setSignInStatus(SignInStatus.Error);
      setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
    } else if (!appId) {
      setSignInStatus(SignInStatus.Error);
      setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
    } else {
      setPublicKey(publicKey);
      setAppId(appId);
      setSignInStatus(SignInStatus.Standby);
    }
  }, [searchParams, setSignInStatus, setErrorMsg, setPublicKey, setAppId, setStep]);

  const handleCloseErrorDialog = React.useCallback(() => {
    window.close();
  }, []);

  const handleChangeValue = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      const val = ev.target.value;

      if (name) {
        setFormData(oldVal => {
          return {
            ...oldVal,
            [name]: val,
          };
        });
      }
    },
    [formData, setFormData],
  );

  const handleClickPrev = React.useCallback(() => {
    setStep(SignInStep.PrfsIdCredential);
  }, [setStep]);

  const handleSucceedSignIn = React.useCallback(
    (credential: PrfsIdCredential) => {
      if (credential) {
        setCredential(credential);
        setStep(SignInStep.AppCredential);
      }
    },
    [setCredential, setStep],
  );

  const content = React.useMemo(() => {
    if (!appId || !publicKey) {
      return null;
    }

    switch (step) {
      case SignInStep.PrfsIdCredential: {
        return <PrfsIdSignIn appId={appId} handleSucceedSignIn={handleSucceedSignIn} />;
      }
      case SignInStep.AppCredential: {
        return (
          credential && (
            <AppCredential
              credential={credential}
              appId={appId}
              publicKey={publicKey}
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              handleClickPrev={handleClickPrev}
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleChangeValue, formErrors, publicKey, appId]);

  return (
    <PrfsIdSignInModule>
      <PrfsIdSignInForm>
        {signInStatus === SignInStatus.Loading && (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        )}
        {signInStatus === SignInStatus.Error && (
          <PrfsIdErrorDialog errorMsg={errorMsg} handleClose={handleCloseErrorDialog} />
        )}
        {content}
      </PrfsIdSignInForm>
      <PrfsIdSignInModuleFooter>
        <Link href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
          <span>{i18n.code}</span>
        </Link>
        <Link href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <span>{i18n.prfs}</span>
        </Link>
      </PrfsIdSignInModuleFooter>
    </PrfsIdSignInModule>
  );
};

export default PrfsIdAppSignIn;

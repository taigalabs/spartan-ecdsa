"use client";

import React from "react";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

import { stateContext } from "@/contexts/state";
import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import styles from "./SignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";
import Button from "@/components/button/Button";
import { signIn } from "@/functions/prfsAccount";
import localStore from "@/storage/localStore";
import useLocalWallet from "@/hooks/useLocalWallet";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import SignInForm from "@/components/sign_in_form/SignInForm";

const metamaskConfig = metamaskWallet();

const SignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const connect = useConnect();
  const router = useRouter();

  const { dispatch } = React.useContext(stateContext);
  useLocalWallet(dispatch);

  const [walletAddr, setWalletAddr] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const [passhash, setPasshash] = React.useState("");
  const [signInAlert, setSignInAlert] = React.useState("");

  const handleChangePasscode = React.useCallback(
    (ev: any) => {
      setPasscode(ev.target.value);
    },
    [setPasscode]
  );

  const handleConnect = React.useCallback(
    (addr: string) => {
      setWalletAddr(addr);
    },
    [setWalletAddr]
  );

  const handleClickHash = React.useCallback(() => {
    async function fn() {
      if (passcode.length > 0) {
        let prfs_pw_msg = `PRFS_PW_${passcode}`;
        let pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

        setPasshash(pw_hash);
      } else {
      }
    }

    fn().then();
  }, [passcode, setPasshash]);

  const handleClickSignIn = React.useCallback(() => {
    async function fn() {
      const wallet = await connect(metamaskConfig);
      const signer = await wallet.getSigner();
      const walletAddr = await wallet.getAddress();

      try {
        let resp = await signIn(walletAddr, passhash, signer);

        dispatch({
          type: "sign_in",
          payload: {
            ...resp.payload,
            walletAddr,
          },
        });

        localStore.putPrfsAccount(resp.payload.sig, walletAddr);

        router.push("/");
      } catch (err) {
        console.log(err);
        setSignInAlert(err.toString());
      }
    }

    fn().then();
  }, [walletAddr, passhash, setSignInAlert]);

  return (
    <SignInLayout title={i18n.sign_in} desc={i18n.sign_in_desc}>
      <SignInForm />
    </SignInLayout>
  );
};

export default SignIn;

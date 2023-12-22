"use client";

import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-components/src/input/Input";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { MdSecurity } from "@react-icons/all-files/md/MdSecurity";

import styles from "./CreateTwitterAccAtst.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsMain, AttestationsTitle } from "@/components/attestations/Attestations";
import { useRandomKeyPair } from "@/hooks/key";
import { CommitmentType, PrfsIdMsg, getCommitment, newPrfsIdMsg } from "@taigalabs/prfs-id-sdk-web";
import { envs } from "@/envs";
import { paths } from "@/paths";

const TWITTER_HANDLE = "twitter_handle";
const TWEET_URL = "tweet_url";
const CLAIM = "claim";

const attestionStep = {
  INPUT_TWITTER_HANDLE: false,
  GENERATE_CLAIM: false,
  POST_TWEET: false,
  VALIDATE_TWEET: false,
};

const TwitterAccAttestation: React.FC<TwitterAccAttestationProps> = () => {
  const i18n = React.useContext(i18nContext);
  const [formData, setFormData] = React.useState({ [TWITTER_HANDLE]: "", [TWEET_URL]: "" });
  const claimSecret = React.useMemo(() => {
    const handle = formData[TWITTER_HANDLE];
    return `PRFS_ATTESTATION_${handle}`;
  }, [formData[TWITTER_HANDLE]]);
  const [step, setStep] = React.useState({ ...attestionStep });
  const { sk, pkHex } = useRandomKeyPair();

  React.useEffect(() => {
    const handle = formData[TWITTER_HANDLE];
    if (handle.length > 0) {
      setStep(oldVal => ({
        ...oldVal,
        INPUT_TWITTER_HANDLE: true,
      }));
    } else {
      setStep(oldVal => ({
        ...oldVal,
        INPUT_TWITTER_HANDLE: false,
      }));
    }

    const listener = (ev: MessageEvent<any>) => {
      const { origin } = ev;

      if (envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT.startsWith(origin)) {
        const data = ev.data as PrfsIdMsg<Buffer>;
        if (data.type === "COMMITMENT_SUCCESS") {
          const msg = newPrfsIdMsg("COMMITMENT_SUCCESS_RESPOND", null);
          ev.ports[0].postMessage(msg);

          console.log(11, data.payload);
          // handleSucceedSignIn(data.payload);
        }
      }
    };
    addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [setStep, formData[TWITTER_HANDLE]]);

  const handleChangeTwitterHandle = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      if (name === TWITTER_HANDLE) {
        if (value.length < 30) {
          setFormData(oldVal => ({
            ...oldVal,
            [name]: value,
          }));
        }
      } else {
        setFormData(oldVal => ({
          ...oldVal,
          [name]: value,
        }));
      }
    },
    [setFormData],
  );

  const handleClickGenerate = React.useCallback(() => {
    const appId = "prfs_proof";
    getCommitment({
      prfsIdEndpoint: `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.id}`,
      appId,
      sk,
      pkHex,
      preImage: claimSecret,
      cms: {
        [CLAIM]: {
          val: claimSecret,
          type: CommitmentType.SIG_POSEIDON_1,
        },
      },
    });

    // const queryString = `?public_key=${pkHex}&redirect_uri=${redirectUri}&sign_in_data=${signInData}&app_id=${appId}&nonce=${nonce}`;
    // const prfsIdEndpoint = `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.id__signin}${queryString}`;
    // setPrfsIdSignInEndpoint(prfsIdEndpoint);
  }, [formData, step, claimSecret, sk, pkHex]);

  const handleClickStartOver = React.useCallback(() => {}, [formData, step]);

  const handleClickCreate = React.useCallback(() => {}, [formData, step]);

  return (
    <>
      <AttestationsTitle className={styles.title}>
        {i18n.create_twitter_acc_attestation}
      </AttestationsTitle>
      <div>
        <form>
          <ol className={styles.instructions}>
            <li className={styles.item}>
              <div className={styles.no}>1</div>
              <div className={styles.right}>
                <div className={styles.desc}>
                  <p>{i18n.what_is_your_twitter_handle}</p>
                  <p>{i18n.twitter_handle_example_given}</p>
                </div>
                <div className={styles.content}>
                  <Input
                    className={styles.input}
                    name={TWITTER_HANDLE}
                    error={""}
                    label={i18n.twitter_handle}
                    value={formData.twitter_handle}
                    handleChangeValue={handleChangeTwitterHandle}
                  />
                </div>
              </div>
            </li>
            <li className={cn(styles.item, { [styles.isDisabled]: !step.INPUT_TWITTER_HANDLE })}>
              <div className={styles.overlay} />
              <div className={styles.no}>2</div>
              <div>
                <div className={styles.desc}>
                  <p>{i18n.generate_a_cryptographic_claim}</p>
                  <p className={styles.claimSecret}>
                    {i18n.claim_secret}: {claimSecret}
                  </p>
                </div>
                <div className={styles.content}>
                  <button className={styles.btn} type="button" onClick={handleClickGenerate}>
                    <MdSecurity />
                    <span>{i18n.generate}</span>
                  </button>
                </div>
              </div>
            </li>
            <li className={cn(styles.item, { [styles.isDisabled]: !step.POST_TWEET })}>
              <div className={styles.overlay} />
              <div className={styles.no}>3</div>
              <div>
                <div className={styles.desc}>Make a tweet</div>
                <div className={styles.content}>
                  <button className={styles.btn} type="button">
                    Post a tweet
                  </button>
                </div>
              </div>
            </li>
            <li className={cn(styles.item, { [styles.isDisabled]: !step.VALIDATE_TWEET })}>
              <div className={styles.overlay} />
              <div className={styles.no}>4</div>
              <div>
                <div className={styles.desc}>
                  <p>{i18n.what_is_the_tweet_url}</p>
                  <p>{i18n.tweet_url_example_given}</p>
                </div>
                <div className={styles.content}>
                  <div className={styles.row}>
                    <Input
                      className={styles.input}
                      name={TWEET_URL}
                      error={""}
                      label={i18n.tweet_url}
                      value={formData.tweet_url}
                      handleChangeValue={handleChangeTwitterHandle}
                    />
                  </div>
                  <div>
                    <button className={styles.btn} type="button">
                      <span>validate</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ol>
          <div className={styles.btnRow}>
            <Button
              variant="transparent_blue_2"
              noTransition
              handleClick={handleClickStartOver}
              type="button"
            >
              {i18n.start_over}
            </Button>
            <Button
              variant="blue_2"
              className={styles.signInBtn}
              noTransition
              handleClick={handleClickCreate}
              noShadow
              type="button"
            >
              {i18n.create}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TwitterAccAttestation;

export interface TwitterAccAttestationProps {}

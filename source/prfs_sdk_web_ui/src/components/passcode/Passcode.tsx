import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import { FaSignature } from "@react-icons/all-files/fa/FaSignature";

import styles from "./Passcode.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Signed: React.FC<SignedProps> = ({ sig }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div
      className={cn({
        [styles.signed]: true,
        [styles.signComplete]: sig && sig.length > 0,
      })}
    >
      <FaSignature />
    </div>
  );
};

const Passcode: React.FC<PasscodeProps> = ({ circuitInput, value, setFormValues }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    if (value === undefined) {
      const defaultSigData: SigData = {
        msgRaw: "default message",
        msgHash: Buffer.from(""),
        sig: "",
      };

      setFormValues(oldVals => {
        return {
          ...oldVals,
          [circuitInput.name]: defaultSigData,
        };
      });
    }
  }, [value, setFormValues]);

  const handleClickSign = React.useCallback(async () => {
    if (value) {
      const msgRaw = value.msgRaw;
      const { msgHash, sig } = await sendMsgToParent(
        new Msg("GET_SIGNATURE", {
          msgRaw,
        })
      );

      setFormValues(oldVals => ({
        ...oldVals,
        [circuitInput.name]: {
          msgRaw,
          msgHash,
          sig,
        },
      }));
    }
  }, [value, setFormValues]);

  return (
    <div className={styles.sigDataInputWrapper}>
      <input placeholder={circuitInput.desc} value={value?.msgRaw || ""} readOnly />
      <div className={styles.btnGroup}>
        <Signed sig={value?.sig} />
        <button className={styles.connectBtn} onClick={handleClickSign}>
          {i18n.sign}
        </button>
      </div>
    </div>
  );
};

export default Passcode;

export interface SigData {
  msgRaw: string;
  msgHash: Buffer;
  sig: string;
}

export interface PasscodeProps {
  circuitInput: CircuitInput;
  value: SigData | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

interface SignedProps {
  sig: string | undefined;
}

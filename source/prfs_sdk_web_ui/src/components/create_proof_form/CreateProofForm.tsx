import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver, LogEventType } from "@taigalabs/prfs-driver-interface";
import { Msg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./CreateProofForm.module.scss";
import { initDriver, interpolateSystemAssetEndpoint } from "@/functions/circuitDriver";
import { i18nContext } from "@/contexts/i18n";
import { delay } from "@/functions/interval";
import MerkleProofInput from "@/components/merkle_proof_input/MerkleProofInput";
import SigDataInput from "@/components/sig_data_input/SigDataInput";
import { createProof } from "@/functions/proof";
import CreateProofProgress from "@/components/create_proof_progress/CreateProofProgress";
import { envs } from "@/envs";
import Passcode from "../passcode/Passcode";
import Input from "./Input";
import { validateForm } from "./validateForm";

const ASSET_SERVER_ENDPOINT = envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT;

enum CreateProofStatus {
  Loaded,
  InProgress,
}

const CreateProofForm: React.FC<CreateProofFormProps> = ({ proofType, docHeight }) => {
  const i18n = React.useContext(i18nContext);

  const [systemMsg, setSystemMsg] = React.useState("Loading driver...");
  const [createProofStatus, setCreateProofStatus] = React.useState(CreateProofStatus.Loaded);
  const [terminalLog, setTerminalLog] = React.useState<React.ReactNode[]>([]);
  const [driver, setDriver] = React.useState<CircuitDriver>();
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});

  const proofGenEventListener = React.useCallback(
    (type: LogEventType, msg: string) => {
      setTerminalLog(oldVals => {
        const elem = (
          <p className={type} key={oldVals.length}>
            {msg}
          </p>
        );
        return [...oldVals, elem];
      });
    },
    [setTerminalLog]
  );

  const handleChangeValue = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = ev.target;
      setFormValues(oldVals => {
        return {
          ...oldVals,
          [name]: ev.target.value,
        };
      });
    },
    [setFormValues]
  );

  React.useEffect(() => {
    proofGenEventListener(
      "info",
      `Start proving... hardware concurrency: ${window.navigator.hardwareConcurrency}`
    );

    async function eventListener(ev: MessageEvent) {
      if (ev.ports.length > 0) {
        const type: MsgType = ev.data.type;

        if (type === "CREATE_PROOF") {
          if (!driver) {
            return;
          }

          validateForm(formValues, proofType.circuit_inputs as CircuitInput[]);
          // return;
          setCreateProofStatus(CreateProofStatus.InProgress);
          proofGenEventListener("debug", `Process starts in 3 seconds`);

          await delay(3000);

          proofGenEventListener(
            "info",
            `Start proving... hardware concurrency: ${window.navigator.hardwareConcurrency}`
          );

          try {
            const proveReceipt = await createProof(driver, formValues, proofGenEventListener);

            proofGenEventListener("info", `Proof created in ${proveReceipt.duration}ms`);

            ev.ports[0].postMessage(new Msg("CREATE_PROOF_RESPONSE", proveReceipt));
          } catch (err) {}
        }
      }
    }

    window.addEventListener("message", eventListener);

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [proofType, formValues, driver]);

  React.useEffect(() => {
    async function fn() {
      const { circuit_driver_id, driver_properties } = proofType;
      const driverProperties = interpolateSystemAssetEndpoint(
        driver_properties,
        ASSET_SERVER_ENDPOINT
      );

      try {
        const driver = await initDriver(circuit_driver_id, driverProperties);
        setSystemMsg(`${circuit_driver_id}`);
        setDriver(driver);
      } catch (err) {
        setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      }
    }

    window.setTimeout(() => {
      fn().then();
    }, 1000);
  }, [proofType, setSystemMsg, setDriver, setCreateProofStatus]);

  const circuitInputsElem = React.useMemo(() => {
    const circuit_inputs = proofType.circuit_inputs as CircuitInput[];

    const entriesElem = [];
    for (const [idx, input] of circuit_inputs.entries()) {
      switch (input.type) {
        case "MERKLE_PROOF_1": {
          entriesElem.push(
            <Input circuitInput={input} key={idx}>
              <MerkleProofInput
                circuitInput={input}
                value={formValues[input.name] as any}
                setFormValues={setFormValues}
              />
            </Input>
          );
          break;
        }
        case "SIG_DATA_1": {
          entriesElem.push(
            <Input circuitInput={input} key={idx}>
              <SigDataInput
                circuitInput={input}
                value={formValues[input.name] as any}
                setFormValues={setFormValues}
              />
            </Input>
          );
          break;
        }
        case "PASSCODE_1": {
          entriesElem.push(
            <Input circuitInput={input} key={idx}>
              <Passcode
                circuitInput={input}
                value={formValues[input.name] as any}
                handleChangeValue={handleChangeValue}
              />
            </Input>
          );
          break;
        }
        case "PASSCODE_CONFIRM_1": {
          entriesElem.push(
            <Input circuitInput={input} key={idx}>
              <Passcode
                circuitInput={input}
                value={formValues[input.name] as any}
                handleChangeValue={handleChangeValue}
              />
            </Input>
          );

          entriesElem.push(
            <Input circuitInput={input} key={`${idx}-confirm`}>
              <Passcode
                circuitInput={input}
                value={formValues[input.name] as any}
                handleChangeValue={handleChangeValue}
              />
            </Input>
          );
          break;
        }
        default: {
          console.error(`Cannot handle circuit input of this type`);

          entriesElem.push(
            <Input circuitInput={input} key={idx}>
              <input placeholder="Cannot handle circuit input of this type" />
            </Input>
          );
        }
      }
    }

    // const entriesElem = Object.entries(obj).map(([key, val]) => {
    //   let inputElem: React.ReactElement;

    //   switch (val.type) {
    //     case "MERKLE_PROOF_1": {
    //       inputElem = (
    //         <MerkleProofInput
    //           circuitInput={val}
    //           value={formValues[val.name] as any}
    //           setFormValues={setFormValues}
    //         />
    //       );
    //       break;
    //     }
    //     case "SIG_DATA_1": {
    //       inputElem = (
    //         <SigDataInput
    //           circuitInput={val}
    //           value={formValues[val.name] as any}
    //           setFormValues={setFormValues}
    //         />
    //       );
    //       break;
    //     }
    //     case "PASSCODE_1": {
    //       inputElem = (
    //         <Passcode
    //           circuitInput={val}
    //           value={formValues[val.name] as any}
    //           handleChangeValue={handleChangeValue}
    //         />
    //       );
    //       break;
    //     }
    //     case "PASSCODE_CONFIRM_1": {
    //       inputElem = (
    //         <>
    //           <Passcode
    //             circuitInput={val}
    //             value={formValues[val.name] as any}
    //             handleChangeValue={handleChangeValue}
    //           />
    //           <Passcode
    //             circuitInput={val}
    //             value={formValues[val.name] as any}
    //             handleChangeValue={handleChangeValue}
    //           />
    //         </>
    //       );
    //       break;
    //     }
    //     default: {
    //       console.error(`Cannot handle circuit input of this type`);

    //       inputElem = <input placeholder="Cannot handle circuit input of this type" />;
    //     }
    //   }

    //   return (
    //     <div className={styles.circuitInputEntry} key={key}>
    //       <div className={styles.entryMeta}>
    //         <div className={styles.entryLabel}>{val.label}</div>
    //       </div>
    //       <div className={styles.inputContainer}>{inputElem}</div>
    //     </div>
    //   );
    // });

    return entriesElem;
  }, [proofType, formValues, setFormValues]);

  if (!proofType) {
    return null;
  }

  return (
    <div className={styles.wrapper} style={{ height: docHeight }}>
      <div className={styles.inputPage}>
        <div className={styles.form}>{circuitInputsElem}</div>
      </div>

      {createProofStatus === CreateProofStatus.InProgress && (
        <div className={styles.terminalContainer}>
          <Fade>
            <CreateProofProgress terminalLogElem={terminalLog} />
          </Fade>
        </div>
      )}

      <div className={styles.footer}>
        <div>
          <div className={styles.systemMsg}>
            <span>
              {systemMsg} ({i18n.prfs} {envs.NEXT_PUBLIC_VERSION})
            </span>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CreateProofForm;

export interface CreateProofFormProps {
  proofType: PrfsProofType;
  docHeight: number;
}

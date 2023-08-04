import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateProofInstanceForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import Breadcrumb, { BreadcrumbEntry } from "@/components/breadcrumb/Breadcrumb";
import { FormTitleRow, FormTitle, FormSubtitle } from "@/components/form/Form";
import Button from "@/components/button/Button";
import {
  PrfsCircuit,
  PublicInputType,
  PrfsSet,
  PublicInputInstance,
  PrfsProofType,
} from "@/models";
import { stateContext } from "@/contexts/state";
import * as prfsBackend from "@/fetch/prfsBackend";
import ProofTypeDropdown from "../proof_type_dropdown/ProofTypeDropdown";
import PublicInputConfigSection from "../public_input_config_section/PublicInputConfigSection";
import { useSigner } from "@thirdweb-dev/react";
import { proveMembership } from "@/functions/prfsCrypto";
import { castToSpartanProgramProps } from "@taigalabs/prfs-driver-spartan-js";

const ProgramSection: React.FC<ProgramSectionProps> = ({ proofType }) => {
  const i18n = React.useContext(i18nContext);

  const programPropsElem = React.useMemo(() => {
    const rows = [];

    if (!proofType) {
      return rows;
    }

    for (let [propName, val] of Object.entries(proofType.driver_properties)) {
      if (val.startsWith("prfs://")) {
        val = val.replace("prfs:/", process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT);
        val = <Link href={val}>{val}</Link>;
      }

      rows.push(
        <div className={styles.item} key={propName}>
          <div className={styles.label}>{propName}</div>
          <div className={styles.value}>{val}</div>
        </div>
      );
    }

    return rows;
  }, [proofType]);

  return (
    <div className={styles.programSectionWrapper}>
      <div className={styles.item}>
        <div className={styles.label}>{i18n.program_id}</div>
        <div className={styles.value}>{proofType.driver_id}</div>
      </div>
      {programPropsElem}
    </div>
  );
};

const CreateProofInstanceForm: React.FC<CreateProofInstanceFormProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { state } = React.useContext(stateContext);
  const { prfsAccount } = state;
  const router = useRouter();
  // const prover = useProver();
  const signer = useSigner();

  // prfsCrypto

  const [publicInputInstance, setPublicInputInstance] = React.useState<PublicInputInstance>({});
  const [formAlert, setFormAlert] = React.useState("");
  const [selectedProofType, setSelectedProofType] = React.useState<PrfsProofType>(undefined);
  const [programProps, setProgramProps] = React.useState();

  const handleSelectProofType = React.useCallback(
    (val: PrfsProofType) => {
      setSelectedProofType(val);
    },
    [setSelectedProofType]
  );

  React.useEffect(() => {
    if (selectedProofType) {
      // console.log(55, selectedProofType.program_properties);
    }
  }, [selectedProofType]);

  const handleClickCreateProofInstance = React.useCallback(() => {
    setFormAlert("");

    if (!prfsAccount) {
      setFormAlert("User is not signed in");
      return;
    }

    if (selectedProofType === undefined) {
      setFormAlert("Proof type should be selected");
      return;
    }

    const { driver_id, driver_properties } = selectedProofType;

    const spartanProgramProps = castToSpartanProgramProps(driver_properties);
    spartanProgramProps.wtns_gen_url = spartanProgramProps.wtns_gen_url.replace(
      "prfs:/",
      process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT
    );
    spartanProgramProps.circuit_url = spartanProgramProps.circuit_url.replace(
      "prfs:/",
      process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT
    );

    console.log(12, selectedProofType.driver_properties);

    console.log(13, spartanProgramProps);

    // proveMembership(signer);

    // let { y, m, d } = getYMD();
    // let now = Date.now();
    // let hash = keccakHash(
    //   `${selectedCircuit.circuit_id}_${selectedCircuit.program.program_id}_${now}`
    // ).substring(2, 8);

    // let proof_type_id = `${prfsAccount.id}_${y}${m}${d}_${hash}`;

    // let createPrfsProofTypeRequest = {
    //   proof_type_id,
    //   label: name,
    //   desc,
    //   author: prfsAccount.sig,
    //   circuit_id: selectedCircuit.circuit_id,
    //   program_id: selectedCircuit.program.program_id,
    //   public_input_instance: newPublicInputInstance,
    //   program_properties: selectedCircuit.program.properties,
    // };

    // prfsBackend
    //   .createPrfsProofType(createPrfsProofTypeRequest)
    //   .then(_res => {
    //     router.push("/proof_types");
    //   })
    //   .catch(err => {
    //     setFormAlert(err);
    //   });
  }, [publicInputInstance, selectedProofType, setFormAlert, state.prfsAccount]);

  console.log(11, selectedProofType);

  return (
    <div className={styles.wrapper}>
      <Breadcrumb>
        <BreadcrumbEntry>
          <Link href="/proofs">{i18n.proofs}</Link>
        </BreadcrumbEntry>
        <BreadcrumbEntry>{i18n.create_proof_type}</BreadcrumbEntry>
      </Breadcrumb>
      <FormTitleRow>
        <FormTitle>{i18n.create_proof_instance}</FormTitle>
        <FormSubtitle>{i18n.create_proof_instance_subtitle}</FormSubtitle>
      </FormTitleRow>

      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.choose_proof_type}</WidgetLabel>
            </WidgetHeader>
            <WidgetPaddedBody>
              <div className={styles.dropdownContainer}>
                <div>{i18n.proof_type}</div>
                <ProofTypeDropdown
                  selectedVal={selectedProofType}
                  handleSelectVal={handleSelectProofType}
                />
              </div>
            </WidgetPaddedBody>
          </Widget>
        </Card>
      </CardRow>

      {selectedProofType && (
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.program}</WidgetLabel>
              </WidgetHeader>
              <WidgetPaddedBody>
                <ProgramSection proofType={selectedProofType} />
              </WidgetPaddedBody>
            </Widget>
          </Card>
        </CardRow>
      )}

      {selectedProofType && (
        <CardRow>
          <Card>
            <Widget>
              <WidgetHeader>
                <WidgetLabel>{i18n.program}</WidgetLabel>
              </WidgetHeader>
              <WidgetPaddedBody>
                {/* <PublicInputConfigSection publicInputs={selectedProofType.public_input_instance} /> */}
              </WidgetPaddedBody>
            </Widget>
          </Card>
        </CardRow>
      )}

      {formAlert.length > 0 && <div className={styles.alert}>{formAlert}</div>}

      <div className={styles.btnRow}>
        <Button variant="b" handleClick={handleClickCreateProofInstance}>
          {i18n.create_proof_type}
        </Button>
      </div>
    </div>
  );
};

export default CreateProofInstanceForm;

export interface CreateProofInstanceFormProps {}

interface ProgramSectionProps {
  proofType: PrfsProofType;
}

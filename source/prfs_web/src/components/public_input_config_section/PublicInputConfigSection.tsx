import React from "react";
import Link from "next/link";
import { PublicInputInstanceEntry } from "@taigalabs/prfs-entities/bindings/PublicInputInstanceEntry";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";

import styles from "./PublicInputConfigSection.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel, WidgetPaddedBody } from "@/components/widget/Widget";
import CardRow from "@/components/card_row/CardRow";
import Card from "@/components/card/Card";
import SetDropdown from "@/components/set_dropdown/SetDropdown";
import { DropdownSingleSelectedValue } from "@/components/dropdown/Dropdown";

const PublicInputConfigSection: React.FC<PublicInputConfigSectionProps> = ({
  publicInputsMeta,
  setPublicInputInstance,
}) => {
  const i18n = React.useContext(i18nContext);

  let vals: Record<string, any> = {};
  let setVals: Record<string, any> = {};
  publicInputsMeta.forEach((pi, idx) => {
    if (pi.ref === "PRFS_SET") {
      const [selectedSet, setSelectedSet] = React.useState<
        DropdownSingleSelectedValue<PrfsSet> | undefined
      >();

      const handleSelectSet = React.useCallback(
        (val: PrfsSet) => {
          // console.log(13, val);
          setSelectedSet(val);
          setPublicInputInstance((oldVal: Record<number, PublicInputInstanceEntry>) => {
            const newVal = { ...oldVal };
            newVal[idx] = {
              label: pi.label,
              type: pi.type,
              desc: pi.desc,
              value: val.merkle_root,
              ref: val.set_id,
            };
            return newVal;
          });
        },
        [setSelectedSet, setPublicInputInstance]
      );

      vals[idx] = selectedSet;
      setVals[idx] = handleSelectSet;
    }
  });

  const publicInputEntries = React.useMemo(() => {
    let elems = [];

    for (const [idx, [_, pi]] of Object.entries(publicInputsMeta).entries()) {
      let inputValue: React.ReactElement;
      switch (pi.ref) {
        case "PRFS_SET":
          inputValue = (
            <div>
              <div className={styles.publicInputType}>PRFS_SET</div>
              <SetDropdown selectedVal={vals[idx]} handleSelectVal={setVals[idx]} />
            </div>
          );
          break;
        default:
          inputValue = <div className={styles.computedInput}>{pi.type}</div>;
      }

      elems.push(
        <div className={styles.publicInputEntry} key={idx}>
          <div className={styles.inputIdx}>{idx}</div>
          <div className={styles.inputGroup}>
            <div className={styles.inputLabel}>{pi.label}</div>
            <div className={styles.inputDesc}>{pi.desc}</div>
            <div className={styles.inputContainer}>{inputValue}</div>
          </div>
        </div>
      );
    }

    return elems;
  }, [publicInputsMeta, setVals]);

  return (
    <CardRow>
      <Card>
        <Widget>
          <WidgetHeader>
            <WidgetLabel>{i18n.configure_public_inputs}</WidgetLabel>
          </WidgetHeader>
          <WidgetPaddedBody>
            <div>{publicInputEntries}</div>
          </WidgetPaddedBody>
        </Widget>
      </Card>
    </CardRow>
  );
};

export default PublicInputConfigSection;

interface PublicInputConfigSectionProps {
  publicInputsMeta: CircuitInputMeta[];
  setPublicInputInstance: React.Dispatch<
    React.SetStateAction<Record<number, PublicInputInstanceEntry>>
  >;
}

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { CircuitInputMeta } from "@taigalabs/prfs-entities/bindings/CircuitInputMeta";
import { PrfsCircuitType } from "@taigalabs/prfs-entities/bindings/PrfsCircuitType";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./CircuitType.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import CircuitTypeSummary from "@/components/circuit_type_summary/CircuitTypeSummary";
import CircuitInputsMetaTable from "@/components/circuit_inputs_meta_table/CircuitInputsMetaTable";
import { PaddedSummaryWrapper } from "@/components/columnal_summary/ColumnarSummary";
import { paths } from "@/paths";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";

const CircuitType: React.FC<CircuitTypeProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();
  const [circuitType, setCircuitType] = React.useState<PrfsCircuitType>();

  const topWidgetLabel = `${i18n.circuit_type} - ${params.circuit_type_id}`;

  useLocalWallet(dispatch);

  React.useEffect(() => {
    prfsApi
      .getPrfsNativeCircuitTypes({
        page: 0,
        circuit_type_id: params.circuit_type_id,
      })
      .then(resp => {
        const { prfs_circuit_types } = resp.payload;

        if (prfs_circuit_types.length > 0) {
          setCircuitType(prfs_circuit_types[0]);
        } else {
          router.push("/circuits");
        }
      });
  }, [setCircuitType]);

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <div className={styles.navigation}>
          <Link href={paths.proof__circuit_types}>
            <ArrowButton variant="left" />
          </Link>
        </div>
        <WidgetLabel>{topWidgetLabel}</WidgetLabel>
      </ContentAreaHeader>
      <ContentAreaRow>
        <Widget>
          <PaddedSummaryWrapper>
            <CircuitTypeSummary circuitType={circuitType} />
          </PaddedSummaryWrapper>
        </Widget>
      </ContentAreaRow>

      {circuitType && (
        <ContentAreaRow>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>
                {i18n.driver_inputs_meta} ({circuitType.circuit_type})
              </WidgetLabel>
            </WidgetHeader>
            <PaddedTableWrapper>
              <CircuitInputsMetaTable
                circuit_inputs_meta={circuitType.circuit_inputs_meta as CircuitInputMeta[]}
              />
            </PaddedTableWrapper>
          </Widget>
        </ContentAreaRow>
      )}
    </DefaultLayout>
  );
};

export default CircuitType;

interface CircuitTypeProps {
  params: {
    circuit_type_id: string;
  };
}

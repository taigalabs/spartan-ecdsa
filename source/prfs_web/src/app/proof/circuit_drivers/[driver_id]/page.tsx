"use client";

import React from "react";
import Link from "next/link";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { CircuitDriver } from "@taigalabs/prfs-entities/bindings/CircuitDriver";
import { useRouter } from "next/navigation";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { DriverPropertyMeta } from "@taigalabs/prfs-entities/bindings/DriverPropertyMeta";

import styles from "./Program.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import DriverSummary from "@/components/driver_summary/DriverSummary";
import DriverPropsMetaTable from "@/components/driver_props_meta_table/DriverPropsMetaTable";
import CircuitTypeList from "@/components/circuit_type_list/CircuitTypeList";
import { PaddedSummaryWrapper } from "@/components/columnal_summary/ColumnarSummary";
import { paths } from "@/paths";
import { ContentAreaHeader, ContentAreaRow } from "@/components/content_area/ContentArea";

const Program: React.FC<ProgramProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);
  const router = useRouter();
  const [driver, setDriver] = React.useState<CircuitDriver>();

  useLocalWallet(dispatch);

  React.useEffect(() => {
    prfsApi
      .getPrfsNativeCircuitDrivers({
        page: 0,
        driver_id: params.driver_id,
      })
      .then(resp => {
        const { prfs_circuit_drivers } = resp.payload;

        if (prfs_circuit_drivers.length > 0) {
          setDriver(prfs_circuit_drivers[0]);
        } else {
          router.push(paths.proof__circuit_drivers);
        }
      });
  }, [setDriver]);

  let programSummaryLabel = `${i18n.driver_summary_label} ${params.driver_id}`;

  return (
    <DefaultLayout>
      <ContentAreaHeader>
        <Link href={paths.proof__circuit_drivers}>
          <ArrowButton variant="left" />
        </Link>
        <WidgetLabel>{programSummaryLabel}</WidgetLabel>
      </ContentAreaHeader>

      <ContentAreaRow>
        <Widget>
          <PaddedSummaryWrapper>
            <DriverSummary driver={driver} />
          </PaddedSummaryWrapper>
        </Widget>
      </ContentAreaRow>

      <ContentAreaRow>
        <Widget>
          <WidgetHeader>
            <WidgetLabel>{i18n.driver_properties_meta}</WidgetLabel>
          </WidgetHeader>
          <PaddedTableWrapper>
            <DriverPropsMetaTable
              driverPropsMeta={driver?.driver_properties_meta as DriverPropertyMeta[]}
            />
          </PaddedTableWrapper>
        </Widget>
      </ContentAreaRow>

      <ContentAreaRow>
        <Widget>
          <WidgetHeader>
            <WidgetLabel>{i18n.circuit_types}</WidgetLabel>
          </WidgetHeader>
          <PaddedTableWrapper>
            <CircuitTypeList circuit_types={driver?.circuit_types} />
          </PaddedTableWrapper>
        </Widget>
      </ContentAreaRow>
    </DefaultLayout>
  );
};

export default Program;

interface ProgramProps {
  params: {
    driver_id: string;
  };
}

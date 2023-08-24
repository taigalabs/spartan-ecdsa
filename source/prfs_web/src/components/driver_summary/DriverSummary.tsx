import React from "react";
import Link from "next/link";
import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";

import styles from "./DriverSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const NUM_COLUMNS = 3;

const DriverSummary: React.FC<DriverSummaryProps> = ({ driver }) => {
  const i18n = React.useContext(i18nContext);

  return (
    driver && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.driver_id}</ColumnarSummaryCellHeader>
            <div>{driver.circuit_driver_id}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.author}</ColumnarSummaryCellHeader>
            <div>{driver.author}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.driver_repository_url}</ColumnarSummaryCellHeader>
            <div>
              <Link href={driver.driver_repository_url}>{driver.driver_repository_url}</Link>
            </div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.description}</ColumnarSummaryCellHeader>
            <div>{driver.desc}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
        <ColumnarSummaryColumn>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.version}</ColumnarSummaryCellHeader>
            <div>{driver.version}</div>
          </ColumnarSummaryCell>
          <ColumnarSummaryCell>
            <ColumnarSummaryCellHeader>{i18n.created_at}</ColumnarSummaryCellHeader>
            <div>{driver.created_at}</div>
          </ColumnarSummaryCell>
        </ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default DriverSummary;

interface DriverSummaryProps {
  driver: PrfsCircuitDriver | undefined;
}

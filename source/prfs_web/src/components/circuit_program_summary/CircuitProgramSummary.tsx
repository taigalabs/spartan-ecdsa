import React from "react";

import styles from "./CircuitSummary.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsCircuit } from "@/models/index";
import ColumnarSummary, {
  ColumnarSummaryCell,
  ColumnarSummaryCellHeader,
  ColumnarSummaryColumn,
} from "@/components/columnal_summary/ColumnarSummary";

const NUM_COLUMNS = 3;

const CircuitProgramSummary: React.FC<CircuitProgramSummaryProps> = ({ circuit }) => {
  const i18n = React.useContext(i18nContext);

  const columnElems = React.useMemo(() => {
    if (circuit === undefined) {
      return null;
    }

    let { program } = circuit;
    let programKeys = Object.keys(program);
    const q = Math.floor(programKeys.length / NUM_COLUMNS);
    const r = programKeys.length % NUM_COLUMNS;

    const columns = [[], [], []];
    for (let i = 0; i < q; i += 1) {
      const cell = (
        <ColumnarSummaryCell key={program[programKeys[i]]}>
          <ColumnarSummaryCellHeader>{programKeys[i]}</ColumnarSummaryCellHeader>
          <div>{program[programKeys[i]]}</div>
        </ColumnarSummaryCell>
      );
      columns[i % NUM_COLUMNS].push(cell);
    }

    let startIdx = 3 * q - 1;
    for (let i = startIdx; i < startIdx + r; i += 1) {
      const cell = (
        <ColumnarSummaryCell key={program[programKeys[i]]}>
          <ColumnarSummaryCellHeader>{programKeys[i]}</ColumnarSummaryCellHeader>
          <div>{program[programKeys[i]]}</div>
        </ColumnarSummaryCell>
      );
      columns[i % NUM_COLUMNS].push(cell);
    }

    return columns;
  }, [circuit]);

  return (
    circuit && (
      <ColumnarSummary>
        <ColumnarSummaryColumn>{columnElems[0]}</ColumnarSummaryColumn>
        <ColumnarSummaryColumn>{columnElems[1]}</ColumnarSummaryColumn>
        <ColumnarSummaryColumn>{columnElems[2]}</ColumnarSummaryColumn>
      </ColumnarSummary>
    )
  );
};

export default CircuitProgramSummary;

interface CircuitProgramSummaryProps {
  circuit: PrfsCircuit;
}

import React from "react";
import Link from "next/link";
import classNames from "classnames";

import styles from "./Table.module.scss";
import { i18nContext } from "@/contexts/i18n";

function Table<T extends string>({ keys, createHeader, createRows, onChangePage }: TableProps<T>) {
  const i18n = React.useContext(i18nContext);

  const [data, setValues] = React.useState({ page: 0, values: [] });

  React.useEffect(() => {
    onChangePage(0).then(res => {
      setValues(res);
    });
  }, [onChangePage, setValues]);

  const tableKeys = React.useMemo(() => {
    const tableKeys: TableKeys<T> = keys.reduce((r, key) => {
      return {
        ...r,
        [key]: key,
      };
    }, {} as TableKeys<T>);
    return tableKeys;
  }, [keys]);

  let headerElems = React.useMemo(() => {
    return createHeader(tableKeys);
  }, [tableKeys]);

  let rowElems = React.useMemo(() => {
    return createRows(tableKeys, data);
  }, [data, tableKeys]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableHeaderWrapper}>{headerElems}</div>
      <div className={styles.tableBodyWrapper}>{rowElems}</div>
    </div>
  );
}

export default Table;

export interface TableProps<T extends string> {
  keys: ReadonlyArray<T>;
  createHeader: (keys: TableKeys<T>) => React.ReactNode;
  createRows: (keys: TableKeys<T>, data: TableData<T>) => React.ReactNode;
  onChangePage: (page: number) => Promise<TableData<T>>;
}

export type TableKeys<T extends string> = ObjectFromList<ReadonlyArray<T>, string>;

export type TableData<T extends string> = {
  page: number;
  values: {
    [key in T]: any;
  }[];
};

type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

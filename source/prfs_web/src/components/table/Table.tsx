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

  let headerElems = React.useMemo(() => {
    return createHeader(keys);
  }, [keys]);

  let rowElems = React.useMemo(() => {
    return createRows(data);
  }, [data]);

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
  createHeader: (keys: ReadonlyArray<T>) => React.ReactNode;
  createRows: (data: TableData<T>) => React.ReactNode;
  onChangePage: (page: number) => Promise<TableData<T>>;
}

export type TableHeaderCol<T> = {
  key: T;
  elem: React.JSX.Element;
}[];

export type A<T extends string> = {
  [key in T]: T;
};

export type TableData<T extends string> = {
  page: number;
  values: {
    [key in T]: any;
  }[];
};

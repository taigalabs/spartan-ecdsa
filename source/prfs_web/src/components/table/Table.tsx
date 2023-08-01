import React, { MouseEventHandler } from "react";
import classNames from "classnames";

import styles from "./Table.module.scss";
// import { KeysAsObject, RecordOfKeys } from "@/models/types";

export const TableCurrentPageLimitWarning: React.FC = () => {
  return <div className={styles.pageLimitWarning}>Currently showing up to 20 elements</div>;
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead className={styles.tableHeaderWrapper}>{children}</thead>;
};

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody className={styles.tableBodyWrapper}>{children}</tbody>;
};

export const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return <td className={styles.tableCell}>{children}</td>;
};

export function TableRow({ isSelected, children, onClickRow }: TableRowProps) {
  return (
    <tr
      className={classNames({
        [styles.tableRowWrapper]: true,
        [styles.selectedRow]: !!isSelected,
      })}
      {...(onClickRow && { onClick: onClickRow })}
    >
      {children}
    </tr>
  );
}

function Table<T>({
  // keys,
  createHeader,
  createBody,
  onChangePage,
  handleSelectVal,
  minWidth,
  selectedVal,
  initialValues,
  tableLayout,
}: TableProps<T>) {
  const [data, setValues] = React.useState({ page: 0, values: initialValues ? initialValues : [] });

  React.useEffect(() => {
    if (onChangePage) {
      Promise.resolve(onChangePage(0)).then(res => {
        setValues(res);
      });
    }
  }, [onChangePage, setValues]);

  // const tableKeys = React.useMemo(() => {
  //   const tableKeys: KeysAsObject<T> = keys.reduce((r, key) => {
  //     return {
  //       ...r,
  //       [key]: key,
  //     };
  //   }, {} as RecordOfKeys<T>);
  //   return tableKeys;
  // }, [keys]);

  let headerElems = React.useMemo(() => {
    return createHeader();
  }, []);

  let bodyElems = React.useMemo(() => {
    return createBody({
      // keys: tableKeys,
      data,
      handleSelectVal,
      selectedVal,
    });
  }, [data, selectedVal, handleSelectVal]);

  return (
    <div className={styles.tableWrapper}>
      <table
        className={styles.table}
        style={{
          minWidth,
          tableLayout: tableLayout,
        }}
      >
        {headerElems}
        {bodyElems}
      </table>
    </div>
  );
}

export default Table;

export interface TableProps<T> {
  // keys: ReadonlyArray<T>;
  createHeader: () => React.ReactNode;
  createBody: (args: CreateBodyArgs<T>) => React.ReactNode;
  onChangePage?: (page: number) => Promise<TableData<T>> | TableData<T>;
  initialValues?: T[];
  selectedVal?: T;
  handleSelectVal?: (row: T) => void;
  minWidth: number;
  tableLayout?: any;
}

export type CreateBodyArgs<T> = {
  // keys: KeysAsObject<T>;
  data: TableData<T>;
  selectedVal: T;
  handleSelectVal?: (row: T) => void;
};

export type TableData<T> = {
  page: number;
  values: T[];
};

// export interface TableSelectedValue<T extends string> {
//   [id: string]: RecordOfKeys<T>;
// }

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface TableCellProps {
  children: React.ReactNode;
}

export interface TableRowProps {
  isSelected?: boolean;
  children: React.ReactNode;
  onClickRow?: MouseEventHandler;
}

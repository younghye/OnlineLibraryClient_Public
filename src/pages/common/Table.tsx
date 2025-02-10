import "../../assets/styles/table.css";
import { useEffect } from "react";
import {
  Column,
  useTable,
  useSortBy,
  useBlockLayout,
  useResizeColumns,
} from "react-table";

interface Props<T extends object> {
  data: T[];
  columns: Column<T>[];
  cssName: string;
  hiddenColumns: string[];
  isFooter?: boolean;
  onRowClicked?: (row: T) => void;
}
function Table({
  data,
  columns,
  cssName,
  hiddenColumns,
  onRowClicked = () => {},
  isFooter = false,
}: Props<any>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: hiddenColumns,
      },
    },
    useSortBy,
    useBlockLayout,
    useResizeColumns
  );

  useEffect(() => {
    setHiddenColumns(hiddenColumns);
    // eslint-disable-next-line
  }, [hiddenColumns]);

  return (
    <div className={cssName}>
      <table
        className="table table-fixed table-hover table-bordered"
        {...getTableProps()}
      >
        <thead className="sticky-top top-0 table-dark">
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getHeaderProps(
                    column.getSortByToggleProps()
                  );
                  return (
                    <th key={key} {...restColumn}>
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <span>▼</span>
                        ) : (
                          <span>▲</span>
                        )
                      ) : (
                        ""
                      )}
                      <div
                        {...column.getResizerProps()}
                        className={`resizer ${
                          column.isResizing ? "isResizing" : ""
                        }`}
                      />
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps}>
          {rows.map((row) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr
                key={key}
                {...restRowProps}
                onClick={() => onRowClicked(row.original)}
              >
                {row.cells.map((cell) => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...restCellProps}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {isFooter && (
          <tfoot>
            {footerGroups.map((footerGroup) => {
              const { key, ...restFooterGroupProps } =
                footerGroup.getFooterGroupProps();
              return (
                <tr key={key} {...restFooterGroupProps}>
                  {footerGroup.headers.map((column) => {
                    const { key, ...restColumn } = column.getFooterProps();
                    return (
                      <th key={key} {...restColumn}>
                        {column.render("Footer")}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default Table;

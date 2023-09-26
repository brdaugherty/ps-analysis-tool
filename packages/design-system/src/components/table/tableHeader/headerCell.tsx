/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies.
 */
import React, { useRef } from 'react';

/**
 * Internal dependencies.
 */
import type { TableColumn, TableOutput } from '../useTable';
import HeaderResizer from './headerResizer';
import { ArrowDown } from '@cookie-analysis-tool/design-system';

interface HeaderCellProps {
  table: TableOutput;
  index: number;
  cell: TableColumn;
  setIsRowFocused: (state: boolean) => void;
}

const HeaderCell = ({
  table,
  index,
  cell,
  setIsRowFocused,
}: HeaderCellProps) => {
  const columnRef = useRef<HTMLTableHeaderCellElement>(null);

  return (
    <th
      ref={columnRef}
      style={{ width: cell.width }}
      onClick={() => table.setSortKey(cell.accessorKey)}
      className="relative hover:bg-gainsboro dark:hover:bg-outer-space select-none touch-none font-normal"
      data-testid="header-cell"
    >
      <div
        className="w-full h-full flex items-center justify-between text-cool-grey dark:text-bright-gray"
        onClick={() => setIsRowFocused(false)}
      >
        <p className="px-1 py-px truncate text-xs">{cell.header}</p>
        <p className="mr-2 scale-125">
          {table.sortKey === cell.accessorKey &&
            {
              asc: <ArrowDown className="transform rotate-180" />,
              desc: <ArrowDown />,
            }[table.sortOrder]}
        </p>
      </div>
      <HeaderResizer
        onMouseDown={() => {
          table.onMouseDown(columnRef, index);
        }}
      />
    </th>
  );
};

export default HeaderCell;

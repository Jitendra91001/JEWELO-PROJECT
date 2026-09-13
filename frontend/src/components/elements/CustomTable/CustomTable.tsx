import React, { useState, useMemo } from "react";
import { Table, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Search, Sparkles, Filter, RefreshCcw, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomTableFilterOption {
  label: string;
  value: any;
}

export interface CustomTableFilter {
  key: string;
  label?: string;
  value: any;
  options: CustomTableFilterOption[];
  onChange: (val: any) => void;
}

export interface CustomTablePaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
}

export interface CustomTableProps<T = any> {
  // Header details
  title?: React.ReactNode;
  subtitle?: string;
  kicker?: string;

  // Table Data
  columns: ColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);

  // Pagination (controlled or managed)
  pagination?: false | CustomTablePaginationConfig;

  // Search
  searchable?: boolean;
  searchValue?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;

  // Dynamic Filters
  filters?: CustomTableFilter[];

  // Action Buttons (Add, Export, Refresh, etc.)
  actions?: React.ReactNode;
  onRefresh?: () => void;

  // Bulk Row Selection
  rowSelection?: TableProps<T>['rowSelection'];

  // Empty State Customization
  emptyTitle?: string;
  emptyDescription?: string;

  // Table Styling & Props
  bordered?: boolean;
  size?: "small" | "middle" | "large";
  scroll?: { x?: number | string; y?: number | string };
  className?: string;
  cardWrapper?: boolean;
  onRow?: (record: T) => React.HTMLAttributes<any>;
}

export function CustomTable<T extends object = any>({
  title,
  subtitle,
  kicker,
  columns,
  dataSource,
  loading = false,
  rowKey = "id",
  pagination,
  searchable = true,
  searchValue,
  onSearch,
  searchPlaceholder = "Search records...",
  filters = [],
  actions,
  onRefresh,
  rowSelection,
  emptyTitle = "No Jewellery Records Found",
  emptyDescription = "There are currently no items matching your criteria in the boutique repository.",
  bordered = false,
  size = "middle",
  scroll = { x: "max-content" },
  className,
  cardWrapper = true,
  onRow,
}: CustomTableProps<T>) {
  // Internal search state if uncontrolled
  const [internalSearch, setInternalSearch] = useState("");
  const activeSearch = searchValue !== undefined ? searchValue : internalSearch;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (searchValue === undefined) {
      setInternalSearch(val);
    }
    if (onSearch) {
      onSearch(val);
    }
  };

  // Internal pagination fallback if not passed or partially passed
  const [internalPage, setInternalPage] = useState(1);
  const [internalLimit, setInternalLimit] = useState(10);

  const paginationConfig = useMemo(() => {
    if (pagination === false) return false;

    const current = pagination?.current ?? internalPage;
    const pageSize = pagination?.pageSize ?? internalLimit;
    const total = pagination?.total ?? dataSource.length;

    return {
      current,
      pageSize,
      total,
      showSizeChanger: pagination?.showSizeChanger ?? true,
      pageSizeOptions: (pagination?.pageSizeOptions ?? [5, 10, 20, 50]).map(String),
      showTotal: (tot: number, range: [number, number]) => (
        <span className="text-xs text-muted-foreground font-body">
          Showing <span className="font-semibold text-foreground">{range[0]}–{range[1]}</span> of{" "}
          <span className="font-semibold text-[#997D4D]">{tot}</span> records
        </span>
      ),
      onChange: (nextPage: number, nextLimit: number) => {
        if (pagination?.onChange) {
          pagination.onChange(nextPage, nextLimit);
        } else {
          setInternalPage(nextPage);
          setInternalLimit(nextLimit);
        }
      },
    };
  }, [pagination, internalPage, internalLimit, dataSource.length]);

  // Luxury empty state component
  const luxuryEmptyState = (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center font-body">
      <div className="w-14 h-14 rounded-full bg-[#FAF5ED] dark:bg-[#1E1A14] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] mb-3 shadow-xs">
        <PackageOpen size={24} />
      </div>
      <h4 className="font-display text-base font-semibold text-foreground mb-1">
        {emptyTitle}
      </h4>
      <p className="text-xs text-muted-foreground max-w-sm font-light">
        {emptyDescription}
      </p>
    </div>
  );

  const tableContent = (
    <div className="space-y-4">
      {/* 1. Header (Title, Kicker, Subtitle & Main Actions) */}
      {(title || kicker || subtitle || actions || onRefresh) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {kicker && (
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880] block mb-0.5 font-body">
                {kicker}
              </span>
            )}
            {title && (
              <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>{title}</span>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground font-body mt-0.5 font-light">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#EAE4DC] dark:border-[#2B2B2B] rounded-lg text-xs font-semibold text-foreground hover:bg-secondary transition-all"
                title="Refresh Table"
              >
                <RefreshCcw size={13} className="text-muted-foreground" />
                <span>Refresh</span>
              </button>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* 2. Toolbar (Search & Filter Bar) */}
      {(searchable || filters.length > 0) && (
        <div className="bg-[#FAF7F2]/70 dark:bg-[#181818] border border-[#EAE4DC] dark:border-[#2B2B2B] rounded-xl p-3 flex flex-col md:flex-row gap-3 items-center justify-between">
          {searchable && (
            <div className="relative flex-1 w-full md:max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={activeSearch}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 border border-[#EAE4DC] dark:border-[#2B2B2B] rounded-lg text-xs bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 font-body transition-all"
              />
            </div>
          )}

          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Filter size={13} className="text-[#C5A880]" />
                <span>Filter:</span>
              </div>
              {filters.map((filter) => (
                <div key={filter.key} className="flex items-center gap-1.5">
                  {filter.label && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {filter.label}:
                    </span>
                  )}
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="px-2.5 py-1.5 border border-[#EAE4DC] dark:border-[#2B2B2B] rounded-lg text-xs bg-background text-foreground focus:outline-none focus:border-[#C5A880] font-medium transition cursor-pointer"
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Ant Design Table with Luxury Styling */}
      <div className="bg-card rounded-xl border border-[#EAE4DC] dark:border-[#2B2B2B] overflow-hidden shadow-xs">
        <Table<T>
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey}
          loading={loading}
          pagination={paginationConfig}
          rowSelection={rowSelection}
          locale={{ emptyText: luxuryEmptyState }}
          bordered={bordered}
          size={size}
          scroll={scroll}
          onRow={onRow}
          className={cn("luxury-custom-table font-body", className)}
        />
      </div>
    </div>
  );

  if (!cardWrapper) {
    return tableContent;
  }

  return (
    <div className="bg-background rounded-2xl p-4 sm:p-6 border border-[#EAE4DC]/80 dark:border-[#2B2B2B] space-y-4 shadow-xs">
      {tableContent}
    </div>
  );
}

export default CustomTable;

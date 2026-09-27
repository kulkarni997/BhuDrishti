"use client";

import { useMemo, useState } from "react";
import { auditLogs } from "@/data/auditLogs";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AuditTrailPage() {
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("All Actions");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesAction =
        action === "All Actions" || log.action === action;

      const matchesQuery =
        !query ||
        log.user.toLowerCase().includes(query.toLowerCase()) ||
        log.action.toLowerCase().includes(query.toLowerCase()) ||
        log.details.toLowerCase().includes(query.toLowerCase());

      return matchesAction && matchesQuery;
    });
  }, [query, action]);

  const actions = [
    "All Actions",
    ...Array.from(new Set(auditLogs.map((log) => log.action))),
  ];

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#16324f]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-20">
        <div className="p-7 animate-fade-up">

          {/* Header */}
          <div className="mb-7">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1677e8]">
              Investigation Traceability
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
              Audit Trail
            </h1>

            <p className="mt-2 text-sm text-[#71869b]">
              Review analyst activity and investigation events.
            </p>
          </div>

          {/* Filters */}
          <section className="rounded-2xl border border-[#dce6f0] bg-white p-5">
            <div className="grid grid-cols-[1fr_220px] gap-3">

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71869b]">
                  ⌕
                </span>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search audit logs..."
                  className="w-full rounded-lg border border-[#dce6f0] bg-[#f9fbfd] py-3 pl-11 pr-4 text-sm text-[#16324f] outline-none placeholder:text-[#9aabba] focus:border-[#1677e8]"
                />
              </div>

              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="rounded-lg border border-[#dce6f0] bg-[#f9fbfd] px-4 text-xs font-medium text-[#496784] outline-none focus:border-[#1677e8]"
              >
                {actions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4">

            <SummaryCard
              label="Total Events"
              value={auditLogs.length.toString()}
            />

            <SummaryCard
              label="Current User"
              value="Analyst"
            />

            <SummaryCard
              label="Investigation"
              value="Change #001"
            />

          </div>

          {/* Table */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-[#dce6f0] bg-white">

            <div className="flex items-center justify-between border-b border-[#e3eaf1] px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-[#16324f]">
                  Activity Log
                </div>

                <div className="mt-1 text-[10px] text-[#71869b]">
                  {filteredLogs.length} events shown
                </div>
              </div>

              <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-[#12a879]">
                <span className="h-2 w-2 rounded-full bg-[#12a879]" />
                Local Audit Store
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[100px_140px_190px_1fr] border-b border-[#e3eaf1] bg-[#f8fbff] px-5 py-3">
              <TableHeader>Time</TableHeader>
              <TableHeader>User</TableHeader>
              <TableHeader>Action</TableHeader>
              <TableHeader>Details</TableHeader>
            </div>

            {/* Rows */}
            {filteredLogs.length > 0 ? (
              <div>
                {filteredLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className={`grid grid-cols-[100px_140px_190px_1fr] items-center px-5 py-4 transition-colors hover:bg-[#f8fbff] ${
                      index !== filteredLogs.length - 1
                        ? "border-b border-[#edf1f5]"
                        : ""
                    }`}
                  >
                    {/* Time */}
                    <div className="text-xs font-medium text-[#496784]">
                      {log.time}
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf3ff] text-[9px] font-semibold text-[#1677e8]">
                        A
                      </div>

                      <span className="text-xs text-[#496784]">
                        {log.user}
                      </span>
                    </div>

                    {/* Action */}
                    <div>
                      <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-[9px] font-semibold ${
                          log.action === "Confirmed"
                            ? "border-[#bde5d6] bg-[#effaf6] text-[#12845f]"
                            : "border-[#d3e1ef] bg-[#f7fbff] text-[#1677e8]"
                        }`}
                      >
                        {log.action}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="text-xs text-[#496784]">
                      {log.details}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-14 text-center">
                <div className="text-sm font-medium text-[#496784]">
                  No audit events found
                </div>

                <div className="mt-1 text-[10px] text-[#8a9bac]">
                  Try changing the search or action filter.
                </div>
              </div>
            )}
          </section>

          {/* Investigation Context */}
          <section className="mt-6 rounded-2xl border border-[#dce6f0] bg-white p-5">
            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1677e8]">
              Investigation Context
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[#16324f]">
                  Narmada Basin — Sector A
                </div>

                <div className="mt-1 text-[10px] text-[#71869b]">
                  Construction detection · 91% confidence · 2021 → 2025
                </div>
              </div>

              <div className="rounded-lg border border-[#bde5d6] bg-[#effaf6] px-4 py-2 text-[10px] font-semibold text-[#12845f]">
                Investigation Confirmed
              </div>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8a9bac]">
      {children}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#dce6f0] bg-white px-5 py-4">
      <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8a9bac]">
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold text-[#16324f]">
        {value}
      </div>
    </div>
  );
}
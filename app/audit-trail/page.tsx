"use client";

import { useEffect, useMemo, useState } from "react";
import { auditLogs } from "@/data/auditLogs";
import {
  getInvestigation,
  type InvestigationState,
} from "@/lib/investigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AuditTrailPage() {
  const [investigation, setInvestigation] =
    useState<InvestigationState | null>(null);

  const [actionFilter, setActionFilter] = useState("All Actions");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setInvestigation(getInvestigation());
  }, []);

  const investigationLogs = useMemo(() => {
    const contextLogs = [
      {
        id: "context-search",
        time: "10:30",
        user: "Analyst",
        action: "Search",
        details: "New construction near river",
      },
      {
        id: "context-change",
        time: "10:32",
        user: "Analyst",
        action: "Change Detection",
        details: `${investigation?.location || "Narmada Basin — Sector A"} · 2021 → 2025`,
      },
      {
        id: "context-view",
        time: "10:35",
        user: "Analyst",
        action: "Viewed Result",
        details: `${investigation?.changeType || "Construction"} · ${investigation?.confidence || 91}% confidence`,
      },
      {
        id: "context-confirm",
        time: "10:37",
        user: "Analyst",
        action: "Confirmed",
        details: `${investigation?.changeType || "Construction"} · ${investigation?.confidence || 91}%`,
      },
    ];

    return contextLogs;
  }, [investigation]);

  const filteredLogs = investigationLogs.filter((log) => {
    const matchesAction =
      actionFilter === "All Actions" ||
      log.action === actionFilter;

    const matchesSearch =
      search.trim() === "" ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());

    return matchesAction && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#16324f]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-20">
        <div className="p-7 animate-fade-up">

          {/* Header */}
          <div className="mb-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1677e8]">
              Investigation Records
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
              Audit Trail
            </h1>

            <p className="mt-2 text-sm text-[#71869b]">
              Review analyst actions and investigation activity.
            </p>
          </div>

          {/* Active Investigation */}
          <div className="mb-5 rounded-xl border border-[#cfe0f0] bg-white px-5 py-4">
            <div className="flex items-center justify-between">

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1677e8]">
                  Active Investigation
                </div>

                <div className="mt-1 text-sm font-semibold text-[#16324f]">
                  {investigation?.location ||
                    "Narmada Basin — Sector A"}
                </div>
              </div>

              <div className="flex items-center gap-7">

                <Meta
                  label="Change Type"
                  value={
                    investigation?.changeType ||
                    "Construction"
                  }
                />

                <Meta
                  label="Confidence"
                  value={`${investigation?.confidence || 91}%`}
                />

                <Meta
                  label="Period"
                  value="2021 → 2025"
                />

              </div>
            </div>
          </div>

          {/* Filters */}
          <section className="mb-5 rounded-2xl border border-[#dce6f0] bg-white p-5">

            <div className="flex items-end gap-4">

              <div className="flex-1">
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
                  Search Audit Logs
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8ba0b4]">
                    ⌕
                  </span>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search actions or details..."
                    className="h-11 w-full rounded-lg border border-[#d8e4ef] bg-[#f9fbfd] pl-9 pr-4 text-xs text-[#496784] outline-none placeholder:text-[#9aabba] focus:border-[#8bb9e8]"
                  />
                </div>
              </div>

              <div className="w-48">
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
                  Action
                </label>

                <select
                  value={actionFilter}
                  onChange={(e) =>
                    setActionFilter(e.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-[#d8e4ef] bg-[#f9fbfd] px-3 text-xs text-[#496784] outline-none"
                >
                  <option>All Actions</option>
                  <option>Search</option>
                  <option>Change Detection</option>
                  <option>Viewed Result</option>
                  <option>Confirmed</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setActionFilter("All Actions");
                }}
                className="h-11 rounded-lg border border-[#cbdbea] bg-white px-5 text-[10px] font-semibold text-[#496784] hover:bg-[#f5f9fd]"
              >
                Clear
              </button>

            </div>
          </section>

          {/* Summary */}
          <div className="mb-5 grid grid-cols-3 gap-4">

            <SummaryCard
              label="Total Events"
              value={String(investigationLogs.length)}
              detail="Current investigation"
            />

            <SummaryCard
              label="Analyst Actions"
              value={String(
                investigationLogs.filter(
                  (log) => log.user === "Analyst"
                ).length
              )}
              detail="Recorded activity"
            />

            <SummaryCard
              label="Investigation Status"
              value="Active"
              detail="Traceable session"
              status
            />

          </div>

          {/* Activity Table */}
          <section className="overflow-hidden rounded-2xl border border-[#dce6f0] bg-white">

            <div className="flex items-center justify-between border-b border-[#dce6f0] px-5 py-4">

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
                  Activity Log
                </div>

                <div className="mt-1 text-sm font-semibold text-[#16324f]">
                  Investigation History
                </div>
              </div>

              <div className="rounded-md bg-[#f2f7fc] px-3 py-1.5 text-[9px] font-semibold text-[#71869b]">
                {filteredLogs.length} events
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">

                <thead>
                  <tr className="border-b border-[#e3eaf1] bg-[#f9fbfd]">

                    <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                      Time
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                      User
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                      Action
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                      Details
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-[#edf1f5] last:border-0 hover:bg-[#fbfdff]"
                    >

                      <td className="px-5 py-4 text-xs font-medium text-[#496784]">
                        {log.time}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf3ff] text-[9px] font-semibold text-[#1677e8]">
                            A
                          </div>

                          <span className="text-xs text-[#496784]">
                            {log.user}
                          </span>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <ActionBadge action={log.action} />
                      </td>

                      <td className="max-w-[500px] px-5 py-4 text-xs text-[#496784]">
                        {log.details}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="rounded-full bg-[#e7f7f1] px-2.5 py-1 text-[8px] font-semibold text-[#15936d]">
                          Recorded
                        </span>
                      </td>

                    </tr>
                  ))}

                  {filteredLogs.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-xs text-[#8a9bac]"
                      >
                        No audit events match the selected filters.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </section>

          {/* Provenance */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#dce6f0] bg-white px-5 py-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf3ff] text-[#1677e8]">
              ✓
            </div>

            <div>
              <div className="text-[10px] font-semibold text-[#16324f]">
                Investigation provenance maintained
              </div>

              <div className="mt-0.5 text-[9px] text-[#71869b]">
                Search, temporal comparison, review and analyst
                confirmation are recorded in sequence.
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-right">
      <div className="text-[8px] font-semibold uppercase tracking-wider text-[#8a9bac]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-semibold text-[#496784]">
        {value}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  status = false,
}: {
  label: string;
  value: string;
  detail: string;
  status?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#dce6f0] bg-white p-5">

      <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
        {label}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {status && (
          <span className="h-2 w-2 rounded-full bg-[#18a67a]" />
        )}

        <span className="text-xl font-semibold text-[#16324f]">
          {value}
        </span>
      </div>

      <div className="mt-1 text-[9px] text-[#8a9bac]">
        {detail}
      </div>

    </div>
  );
}

function ActionBadge({
  action,
}: {
  action: string;
}) {
  const styles: Record<string, string> = {
    Search: "bg-[#eaf3ff] text-[#1677e8]",
    "Change Detection":
      "bg-[#f0ebff] text-[#7454c6]",
    "Viewed Result":
      "bg-[#eef7f5] text-[#17866c]",
    Confirmed:
      "bg-[#e7f7f1] text-[#15936d]",
  };

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[9px] font-semibold ${
        styles[action] || "bg-[#f1f4f7] text-[#64788c]"
      }`}
    >
      {action}
    </span>
  );
}
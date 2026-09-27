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
    <main className="min-h-screen bg-[#061522] text-[#e7f1f8]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-[72px]">
        <div className="p-7 animate-fade-up">

          {/* Header */}
          <div className="mb-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ed5ff]">
              Investigation Records
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#e7f1f8]">
              Audit Trail
            </h1>

            <p className="mt-2 text-sm text-[#6f8da3]">
              Review analyst actions and investigation activity.
            </p>
          </div>

          {/* Active Investigation */}
          <div className="mb-5 rounded-xl border border-[rgba(125,171,204,0.22)] bg-[#0b2032] px-5 py-4">
            <div className="flex items-center justify-between">

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8ed5ff]">
                  Active Investigation
                </div>

                <div className="mt-1 text-sm font-semibold text-[#e7f1f8]">
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
          <section className="mb-5 rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">

            <div className="flex items-end gap-4">

              <div className="flex-1">
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
                  Search Audit Logs
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#58788d]">
                    ⌕
                  </span>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search actions or details..."
                    className="h-11 w-full rounded-lg border border-[rgba(125,171,204,0.22)] bg-[#071a29] pl-9 pr-4 text-xs text-[#bcd3e1] outline-none placeholder:text-[#527187] focus:border-[#55b8f4]/60 focus:ring-1 focus:ring-[#55b8f4]/15"
                  />
                </div>
              </div>

              <div className="w-48">
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
                  Action
                </label>

                <select
                  value={actionFilter}
                  onChange={(e) =>
                    setActionFilter(e.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-[rgba(125,171,204,0.22)] bg-[#071a29] px-3 text-xs text-[#bcd3e1] outline-none"
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
                className="h-11 rounded-lg border border-[rgba(125,171,204,0.22)] bg-[#0b2032] px-5 text-[10px] font-semibold text-[#bcd3e1] hover:bg-[#102b3c]"
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
          <section className="overflow-hidden rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032]">

            <div className="flex items-center justify-between border-b border-[rgba(125,171,204,0.16)] px-5 py-4">

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
                  Activity Log
                </div>

                <div className="mt-1 text-sm font-semibold text-[#e7f1f8]">
                  Investigation History
                </div>
              </div>

              <div className="rounded-md bg-[#102b3c] px-3 py-1.5 text-[9px] font-semibold text-[#6f8da3]">
                {filteredLogs.length} events
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">

                <thead>
                  <tr className="border-b border-[rgba(125,171,204,0.12)] bg-[#071a29]">

                    <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-[#58788d]">
                      Time
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-[#58788d]">
                      User
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-[#58788d]">
                      Action
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-[#58788d]">
                      Details
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-[#58788d]">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-[rgba(125,171,204,0.10)] last:border-0 hover:bg-[#102b3c]"
                    >

                      <td className="px-5 py-4 text-xs font-medium text-[#bcd3e1]">
                        {log.time}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#55b8f4]/10 text-[9px] font-semibold text-[#8ed5ff]">
                            A
                          </div>

                          <span className="text-xs text-[#bcd3e1]">
                            {log.user}
                          </span>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <ActionBadge action={log.action} />
                      </td>

                      <td className="max-w-[500px] px-5 py-4 text-xs text-[#bcd3e1]">
                        {log.details}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="rounded-full bg-[#39c99a]/10 px-2.5 py-1 text-[8px] font-semibold text-[#39c99a]">
                          Recorded
                        </span>
                      </td>

                    </tr>
                  ))}

                  {filteredLogs.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-xs text-[#58788d]"
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
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[rgba(57,201,154,0.18)] bg-[#0b2032] px-5 py-4">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#55b8f4]/10 text-[#8ed5ff]">
              ✓
            </div>

            <div>
              <div className="text-[10px] font-semibold text-[#e7f1f8]">
                Investigation provenance maintained
              </div>

              <div className="mt-0.5 text-[9px] text-[#6f8da3]">
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
      <div className="text-[8px] font-semibold uppercase tracking-wider text-[#58788d]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-semibold text-[#bcd3e1]">
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
    <div className="rounded-xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">

      <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
        {label}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {status && (
          <span className="h-2 w-2 rounded-full bg-[#39c99a]" />
        )}

        <span className="text-xl font-semibold text-[#e7f1f8]">
          {value}
        </span>
      </div>

      <div className="mt-1 text-[9px] text-[#58788d]">
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
    Search: "bg-[#55b8f4]/10 text-[#8ed5ff]",
    "Change Detection":
      "bg-[#8d6fe8]/10 text-[#b7a1ff]",
    "Viewed Result":
      "bg-[#39c99a]/10 text-[#49c9aa]",
    Confirmed:
      "bg-[#39c99a]/10 text-[#39c99a]",
  };

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[9px] font-semibold ${
        styles[action] || "bg-[#294456] text-[#7893a5]"
      }`}
    >
      {action}
    </span>
  );
}
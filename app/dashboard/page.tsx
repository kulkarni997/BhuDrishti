"use client";

import { changeDetections } from "@/data/changeDetections";

export default function DashboardPage() {
  const detection = changeDetections[0];

  return (
    <div className="animate-fade-up">
      {/* Page heading */}
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#66d9c4]">
          Analyst Dashboard
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Operational Overview
        </h1>

        <p className="mt-2 text-sm text-[#7f909d]">
          Monitor semantic searches, detected changes, and pending analysis.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard
          label="Semantic Searches"
          value="24"
          detail="Last 30 days"
        />

        <SummaryCard
          label="Changes Detected"
          value="08"
          detail="Across monitored areas"
        />

        <SummaryCard
          label="Pending Review"
          value="03"
          detail="Require analyst attention"
          accent
        />
      </div>

      {/* Main workspace */}
      <div className="mt-6 grid grid-cols-[1fr_360px] gap-6">
        {/* Map */}
        <section className="overflow-hidden rounded-xl border border-[#1d2a34] bg-[#0d141b]">
          <div className="flex items-center justify-between border-b border-[#1d2a34] px-5 py-4">
            <div>
              <div className="text-sm font-medium">
                Monitoring Area
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-[#52616c]">
                Narmada Basin · Sector A
              </div>
            </div>

            <span className="rounded-md border border-[#263640] px-2.5 py-1 text-[10px] text-[#7f909d]">
              Sentinel-2
            </span>
          </div>

          <div className="relative h-[430px] overflow-hidden bg-[#101a20]">
            {/* Map texture */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute left-[12%] top-[-10%] h-[130%] w-[28%] rotate-[24deg] rounded-[50%] bg-[#152d2b]" />
              <div className="absolute right-[8%] top-[10%] h-[110%] w-[18%] -rotate-[18deg] rounded-[50%] bg-[#142721]" />

              <div className="absolute left-0 top-[42%] h-px w-full rotate-[8deg] bg-[#2b4542]" />
              <div className="absolute left-[-10%] top-[62%] h-px w-[120%] -rotate-[5deg] bg-[#263c3b]" />

              <div className="absolute left-[20%] top-[15%] h-[1px] w-[60%] rotate-[38deg] bg-[#263b39]" />
              <div className="absolute left-[38%] top-[5%] h-[1px] w-[60%] rotate-[70deg] bg-[#263b39]" />
            </div>

            {/* AOI */}
            <div className="absolute left-[27%] top-[25%] h-[48%] w-[43%] border border-dashed border-[#66d9c4]/60 bg-[#66d9c4]/5">
              <div className="absolute -top-6 left-0 text-[9px] uppercase tracking-wider text-[#66d9c4]">
                AOI · Sector A
              </div>
            </div>

            {/* Detection marker */}
            <div className="detection-pulse absolute left-[52%] top-[47%] flex h-4 w-4 items-center justify-center rounded-full border border-[#66d9c4] bg-[#66d9c4]/20">
              <span className="h-1.5 w-1.5 rounded-full bg-[#66d9c4]" />
            </div>

            {/* River */}
            <div className="absolute bottom-[-10%] left-[42%] h-[130%] w-16 -rotate-[22deg] rounded-[50%] border-x border-[#315552] bg-[#132525]/70" />

            {/* Map labels */}
            <div className="absolute left-[18%] top-[18%] text-[9px] uppercase tracking-wider text-[#667982]">
              Sector B
            </div>

            <div className="absolute right-[15%] top-[68%] text-[9px] uppercase tracking-wider text-[#667982]">
              River Corridor
            </div>

            {/* Coordinates */}
            <div className="absolute bottom-4 left-4 rounded-md border border-[#263640] bg-[#080d12]/80 px-3 py-2 font-mono text-[9px] text-[#7f909d]">
              22.7200° N&nbsp;&nbsp;73.1200° E
            </div>

            <div className="absolute bottom-4 right-4 rounded-md border border-[#263640] bg-[#080d12]/80 px-3 py-2 text-[9px] text-[#52616c]">
              Satellite Layer
            </div>
          </div>
        </section>

        {/* Recent detections */}
        <section className="rounded-xl border border-[#1d2a34] bg-[#0d141b]">
          <div className="border-b border-[#1d2a34] px-5 py-4">
            <div className="text-sm font-medium">
              Recent Detections
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-[#52616c]">
              Analyst review queue
            </div>
          </div>

          <div className="divide-y divide-[#1d2a34]">
            {detection.changes.map((change, index) => (
              <div
                key={change.type}
                className="p-5 transition-colors hover:bg-[#111b24]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-[#d7e1e5]">
                      {change.type}
                    </div>

                    <div className="mt-1 text-[10px] text-[#52616c]">
                      Narmada Basin · Sector A
                    </div>
                  </div>

                  <span className="rounded border border-[#263640] px-2 py-1 text-[10px] text-[#66d9c4]">
                    {change.confidence}%
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px]">
                  <span className="text-[#52616c]">
                    {detection.beforeDate} → {detection.afterDate}
                  </span>

                  <span
                    className={
                      index === 0
                        ? "text-[#e6b866]"
                        : "text-[#7f909d]"
                    }
                  >
                    {index === 0 ? "Pending Review" : "Detected"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1d2a34] p-4">
            <button className="w-full rounded-lg border border-[#263640] px-4 py-2.5 text-xs text-[#7f909d] hover:border-[#66d9c4]/50 hover:text-[#66d9c4]">
              View Change Detection
            </button>
          </div>
        </section>
      </div>

      {/* Active analysis */}
      <section className="mt-6 rounded-xl border border-[#1d2a34] bg-[#0d141b] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">
              Active Analysis
            </div>
            <div className="mt-1 text-[10px] text-[#52616c]">
              Most recent semantic retrieval
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider text-[#66d9c4]">
            Analysis Complete
          </span>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-4">
          <InfoItem label="Query" value="New construction near river" />
          <InfoItem label="Top Result" value="Narmada Basin — Sector A" />
          <InfoItem label="Relevance" value="94%" />
          <InfoItem label="Imagery" value="Sentinel-2 · 10 m" />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#1d2a34] bg-[#0d141b] p-5">
      <div className="text-[10px] uppercase tracking-wider text-[#52616c]">
        {label}
      </div>

      <div
        className={`mt-3 text-3xl font-semibold ${
          accent ? "text-[#e6b866]" : "text-[#d7e1e5]"
        }`}
      >
        {value}
      </div>

      <div className="mt-2 text-[10px] text-[#52616c]">
        {detail}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#1d2a34] bg-[#080d12] p-4">
      <div className="text-[9px] uppercase tracking-wider text-[#52616c]">
        {label}
      </div>

      <div className="mt-2 text-xs text-[#d7e1e5]">
        {value}
      </div>
    </div>
  );
}
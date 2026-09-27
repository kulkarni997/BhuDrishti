"use client";

import { useState } from "react";
import { changeDetections } from "@/data/changeDetections";

export default function ChangeDetectionPage() {
  const detection = changeDetections[0];

  const [beforeDate, setBeforeDate] = useState("Jan 2024");
  const [afterDate, setAfterDate] = useState("Jan 2026");
  const [compared, setCompared] = useState(false);
  const [selectedChange, setSelectedChange] = useState("Construction");

  const handleCompare = () => {
    setCompared(false);

    setTimeout(() => {
      setCompared(true);
    }, 500);
  };

  const activeChange = detection.changes.find(
    (change) => change.type === selectedChange
  );

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-7">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#66d9c4]">
          Multi-Temporal Analysis
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Change Detection
        </h1>

        <p className="mt-2 text-sm text-[#7f909d]">
          Compare satellite imagery across time to identify meaningful
          changes.
        </p>
      </div>

      {/* Analysis controls */}
      <section className="rounded-xl border border-[#1d2a34] bg-[#0d141b] p-5">
        <div className="grid grid-cols-[1fr_auto_1fr_auto] items-end gap-4">
          <DateField
            label="Before"
            value={beforeDate}
            onChange={setBeforeDate}
          />

          <div className="pb-3 text-[#52616c]">→</div>

          <DateField
            label="After"
            value={afterDate}
            onChange={setAfterDate}
          />

          <button
            onClick={handleCompare}
            className="rounded-lg bg-[#66d9c4] px-7 py-3 text-xs font-semibold text-[#07100f] hover:opacity-90"
          >
            Compare Images
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4 border-t border-[#1d2a34] pt-4">
          <div className="text-[9px] uppercase tracking-wider text-[#52616c]">
            Area of Interest
          </div>

          <div className="rounded-md border border-[#263640] bg-[#080d12] px-3 py-1.5 text-[10px] text-[#d7e1e5]">
            Narmada Basin — Sector A
          </div>

          <div className="text-[10px] text-[#52616c]">
            22.7200° N · 73.1200° E
          </div>
        </div>
      </section>

      {/* Before / After */}
      <div className="mt-6 grid grid-cols-2 gap-5">
        <ImagePanel
          label="Before"
          date={beforeDate}
          variant="before"
        />

        <ImagePanel
          label="After"
          date={afterDate}
          variant="after"
          compared={compared}
        />
      </div>

      {/* Results */}
      <section
        className={`mt-6 rounded-xl border border-[#1d2a34] bg-[#0d141b] transition-opacity duration-500 ${
          compared ? "opacity-100" : "opacity-60"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#1d2a34] px-5 py-4">
          <div>
            <div className="text-sm font-medium">
              Detected Changes
            </div>

            <div className="mt-1 text-[10px] text-[#52616c]">
              {compared
                ? `${detection.changeCount} significant changes identified`
                : "Run comparison to analyze imagery"}
            </div>
          </div>

          {compared && (
            <span className="rounded-md border border-[#66d9c4]/30 bg-[#66d9c4]/5 px-3 py-1.5 text-[10px] text-[#66d9c4]">
              Analysis Complete
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 divide-x divide-[#1d2a34]">
          {detection.changes.map((change) => {
            const selected = selectedChange === change.type;

            return (
              <button
                key={change.type}
                onClick={() => setSelectedChange(change.type)}
                className={`p-5 text-left transition-colors ${
                  selected
                    ? "bg-[#66d9c4]/5"
                    : "hover:bg-[#111b24]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#d7e1e5]">
                    {change.type}
                  </span>

                  <span className="text-sm font-semibold text-[#66d9c4]">
                    {change.confidence}%
                  </span>
                </div>

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#1d2a34]">
                  <div
                    className="h-full bg-[#66d9c4] transition-all duration-700"
                    style={{ width: `${change.confidence}%` }}
                  />
                </div>

                <div className="mt-3 text-[10px] text-[#52616c]">
                  Affected area · {change.area}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected change analysis */}
      {compared && activeChange && (
        <section className="mt-5 grid grid-cols-[1fr_300px] gap-5 animate-fade-up">
          <div className="rounded-xl border border-[#1d2a34] bg-[#0d141b] p-5">
            <div className="text-[9px] uppercase tracking-[0.18em] text-[#66d9c4]">
              Selected Detection
            </div>

            <h2 className="mt-2 text-lg font-medium">
              {activeChange.type}
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#7f909d]">
              Change detected between {beforeDate} and {afterDate}
              within the selected area of interest.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Metric
                label="Confidence"
                value={`${activeChange.confidence}%`}
              />

              <Metric
                label="Affected Area"
                value={activeChange.area}
              />

              <Metric
                label="Risk"
                value={
                  detection.falseAlarmRisk.charAt(0).toUpperCase() +
                  detection.falseAlarmRisk.slice(1)
                }
              />
            </div>
          </div>

          {/* False alarm */}
          <div className="rounded-xl border border-[#e6b866]/30 bg-[#0d141b] p-5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#e6b866]">
                Review Required
              </span>

              <span className="rounded border border-[#e6b866]/30 px-2 py-1 text-[9px] text-[#e6b866]">
                {detection.falseAlarmRisk.toUpperCase()}
              </span>
            </div>

            <h3 className="mt-4 text-sm font-medium">
              Potential False Alarm
            </h3>

            <p className="mt-2 text-[10px] leading-5 text-[#7f909d]">
              {detection.falseAlarmReason}
            </p>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-md border border-[#263640] px-3 py-2 text-[10px] text-[#7f909d] hover:text-[#d7e1e5]">
                Review
              </button>

              <button className="flex-1 rounded-md bg-[#66d9c4] px-3 py-2 text-[10px] font-semibold text-[#07100f] hover:opacity-90">
                Continue
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] uppercase tracking-wider text-[#52616c]">
        {label} Date
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#26343e] bg-[#080d12] px-4 py-3 text-xs text-[#d7e1e5] outline-none focus:border-[#66d9c4]"
      >
        <option>Jan 2024</option>
        <option>Jun 2024</option>
        <option>Jan 2025</option>
        <option>Jan 2026</option>
        <option>Mar 2026</option>
      </select>
    </div>
  );
}

function ImagePanel({
  label,
  date,
  variant,
  compared = false,
}: {
  label: string;
  date: string;
  variant: "before" | "after";
  compared?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#1d2a34] bg-[#0d141b]">
      <div className="flex items-center justify-between border-b border-[#1d2a34] px-4 py-3">
        <div>
          <span className="text-xs font-medium">{label}</span>
          <span className="ml-2 text-[10px] text-[#52616c]">
            {date}
          </span>
        </div>

        <span className="text-[9px] uppercase tracking-wider text-[#52616c]">
          Sentinel-2
        </span>
      </div>

      <div className="relative h-72 overflow-hidden bg-[#17251f]">
        <SatelliteScene variant={variant} />

        {variant === "after" && compared && (
          <div className="absolute left-[47%] top-[39%] h-20 w-24 border border-[#e87979] bg-[#e87979]/10">
            <span className="absolute -top-5 left-0 text-[8px] uppercase tracking-wider text-[#e87979]">
              Detected Change
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 rounded bg-[#080d12]/80 px-2 py-1 text-[9px] text-[#7f909d]">
          10 m resolution
        </div>
      </div>
    </div>
  );
}

function SatelliteScene({
  variant,
}: {
  variant: "before" | "after";
}) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[#17251f]" />

      <div className="absolute -left-20 top-12 h-60 w-[80%] rotate-12 rounded-[50%] bg-[#24362b]" />
      <div className="absolute right-[-30px] top-[-30px] h-[120%] w-28 rotate-[22deg] rounded-[50%] bg-[#183034]" />

      {/* Roads */}
      <div className="absolute left-[-10%] top-[58%] h-[2px] w-[120%] rotate-[10deg] bg-[#73766b]/50" />
      <div className="absolute left-[30%] top-[-10%] h-[120%] w-[2px] rotate-[35deg] bg-[#73766b]/40" />

      {/* Existing structures */}
      <div className="absolute left-[48%] top-[43%] grid grid-cols-3 gap-1">
        {Array.from({ length: variant === "before" ? 6 : 12 }).map(
          (_, index) => (
            <span
              key={index}
              className="h-3 w-3 bg-[#999b83]"
            />
          )
        )}
      </div>

      {/* New road / development */}
      {variant === "after" && (
        <div className="absolute left-[38%] top-[56%] h-1 w-32 rotate-[8deg] bg-[#9b9b83]/70" />
      )}

      {/* Scan grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#1d2a34] bg-[#080d12] p-3">
      <div className="text-[8px] uppercase tracking-wider text-[#52616c]">
        {label}
      </div>

      <div className="mt-2 text-xs text-[#d7e1e5]">
        {value}
      </div>
    </div>
  );
}
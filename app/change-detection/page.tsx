"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { changeDetections } from "@/data/changeDetections";

export default function ChangeDetectionPage() {
  const detection = changeDetections[0];

  const [compared, setCompared] = useState(false);
  const [viewMode, setViewMode] = useState<"side-by-side" | "overlay">(
    "side-by-side"
  );
  const [opacity, setOpacity] = useState(50);
  const [confirmed, setConfirmed] = useState(false);
  const [aligning, setAligning] = useState(false);
const [aligned, setAligned] = useState(false);
const [alignmentError, setAlignmentError] = useState(
  detection.alignmentError
);

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#16324f]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-20">
        <div className="p-7">
          {/* Header */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#71869b]">
                Analyst Workspace
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
                Change Detection
              </h1>

              <p className="mt-1 text-sm text-[#71869b]">
                Compare multi-temporal imagery and review detected changes.
              </p>
            </div>

            <div className="rounded-lg border border-[#dce6f0] bg-white px-4 py-2">
              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#71869b]">
                Selected Area
              </div>

              <div className="mt-1 text-xs font-semibold text-[#163b67]">
                Narmada Basin — Sector A
              </div>
            </div>
          </div>

          {/* Area + dates */}
          <section className="mb-5 rounded-2xl border border-[#dce6f0] bg-white p-5">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_auto] items-end gap-4">
              <div>
                <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#71869b]">
                  Area of Interest
                </label>

                <div className="flex h-11 items-center rounded-lg border border-[#dce6f0] bg-[#f9fbfd] px-3 text-xs font-medium text-[#496784]">
                  Narmada Basin — Sector A
                </div>
              </div>

              <DateField label="Before Date" value="Jan 2024" />
              <DateField label="After Date" value="Jan 2026" />

              <button
                onClick={() => setCompared(true)}
                className="h-11 rounded-lg bg-[#1677e8] px-7 text-xs font-semibold text-white hover:bg-[#1268cf]"
              >
                {compared ? "Compared" : "Compare"}
              </button>
            </div>
          </section>

          {/* Imagery comparison */}
          <section className="mb-5 overflow-hidden rounded-2xl border border-[#dce6f0] bg-white">
            <div className="flex h-14 items-center justify-between border-b border-[#dce6f0] px-5">
              <div>
                <div className="text-xs font-semibold text-[#16324f]">
                  Temporal Comparison
                </div>

                <div className="mt-0.5 text-[10px] text-[#71869b]">
                  Satellite imagery comparison for the selected AOI
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("side-by-side")}
                  className={`rounded-md px-3 py-1.5 text-[10px] font-semibold ${
                    viewMode === "side-by-side"
                      ? "bg-[#eaf3ff] text-[#1677e8]"
                      : "text-[#71869b]"
                  }`}
                >
                  Before / After
                </button>

                <button
                  onClick={() => setViewMode("overlay")}
                  className={`rounded-md px-3 py-1.5 text-[10px] font-semibold ${
                    viewMode === "overlay"
                      ? "bg-[#eaf3ff] text-[#1677e8]"
                      : "text-[#71869b]"
                  }`}
                >
                  Overlay
                </button>
              </div>
            </div>

            {viewMode === "side-by-side" ? (
              <div className="grid grid-cols-2 gap-px bg-[#dce6f0]">
                <ImagePanel
  label="BEFORE"
  date="2021"
  image="/satellite/before/2021.png"
/>

                <ImagePanel
  label="AFTER"
  date="2025"
  image="/satellite/after/2025.png"
/>
              </div>
            ) : (
              <div className="relative h-[480px] overflow-hidden bg-[#dfe8ef]">
                <img
                  src="/satellite/base-map.png"
                  alt="Before satellite imagery"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${opacity}%` }}
                >
                  <img
                    src="/satellite/base-map.png"
                    alt="After satellite imagery"
                    className="h-full w-full max-w-none object-cover"
                    style={{
                      width: `${100 / (opacity / 100)}%`,
                    }}
                  />
                </div>

                <div className="absolute left-1/2 top-0 h-full w-px bg-white shadow-md" />

                <div className="absolute left-5 top-5 rounded-md bg-[#163b67]/90 px-3 py-1.5 text-[9px] font-semibold text-white">
                  BEFORE / AFTER OVERLAY
                </div>

                <div className="absolute bottom-5 left-1/2 w-[300px] -translate-x-1/2 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur">
                  <div className="flex justify-between text-[9px] font-semibold uppercase tracking-wider text-[#71869b]">
                    <span>Before</span>
                    <span>After</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="mt-3 w-full"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#dce6f0] px-5 py-3">
              <div className="flex items-center gap-5 text-[9px] text-[#71869b]">
                <span>
                  Sensor:{" "}
                  <strong className="text-[#496784]">Sentinel-2</strong>
                </span>

                <span>
                  Resolution:{" "}
                  <strong className="text-[#496784]">10 m</strong>
                </span>
              </div>

              <div className="text-[9px] text-[#71869b]">
                Alignment error:{" "}
                <strong className="text-[#e3a52f]">
                  {detection.alignmentError} px
                </strong>
              </div>
            </div>
          </section>

          {/* Bottom analysis */}
          <div className="grid grid-cols-[1fr_370px] gap-5">
            {/* Detected changes */}
            <section className="rounded-2xl border border-[#dce6f0] bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#16324f]">
                    Detected Changes
                  </div>

                  <div className="mt-1 text-[10px] text-[#71869b]">
                    Candidate changes identified between the two dates.
                  </div>
                </div>

                <div
                  className={`rounded-full px-3 py-1.5 text-[9px] font-semibold ${
                    compared
                      ? "bg-[#edf8f4] text-[#15906b]"
                      : "bg-[#f3f6f9] text-[#71869b]"
                  }`}
                >
                  {compared ? "Analysis Complete" : "Awaiting Comparison"}
                </div>
              </div>

              <div className="space-y-3">
                {detection.changes.map((change) => (
                  <div
                    key={change.type}
                    className="rounded-xl border border-[#e2eaf1] bg-[#fbfdff] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#16324f]">
                          {change.type}
                        </div>

                        <div className="mt-1 text-[10px] text-[#71869b]">
                          Estimated affected area: {change.area}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-[#1677e8]">
                          {change.confidence}%
                        </div>

                        <div className="text-[8px] uppercase tracking-wider text-[#8a9bac]">
                          confidence
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eaf0f5]">
                      <div
                        className="h-full rounded-full bg-[#1677e8]"
                        style={{ width: `${change.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Review panel */}
            <section className="space-y-5">
              {/* Registration */}
<div className="rounded-2xl border border-[#dce6f0] bg-white p-5">
  <div className="flex items-start justify-between">
    <div>
      <div className="text-xs font-semibold text-[#16324f]">
        Image Registration
      </div>

      <div className="mt-1 text-[10px] text-[#71869b]">
        Spatial alignment between temporal images.
      </div>
    </div>

    <div
      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
        aligned
          ? "bg-[#edf8f4] text-[#15906b]"
          : "bg-[#fff7e7] text-[#b47a18]"
      }`}
    >
      {aligned ? "Aligned" : "Review"}
    </div>
  </div>

  <div className="mt-4 rounded-xl bg-[#f8fafc] p-3">
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-[#71869b]">
        Alignment error
      </span>

      <span
        className={`text-xs font-bold ${
          aligned ? "text-[#15906b]" : "text-[#b47a18]"
        }`}
      >
        {alignmentError} px
      </span>
    </div>

    <button
      disabled={aligning || aligned}
      onClick={() => {
        setAligning(true);

        setTimeout(() => {
          setAlignmentError(0.8);
          setAligned(true);
          setAligning(false);
        }, 1500);
      }}
      className={`mt-3 w-full rounded-lg border py-2 text-[10px] font-semibold ${
        aligned
          ? "border-[#bfe3d5] bg-[#edf8f4] text-[#15906b]"
          : "border-[#cdddea] bg-white text-[#1677e8] hover:bg-[#f7fbff]"
      }`}
    >
      {aligning
        ? "Aligning Images..."
        : aligned
          ? "Images Aligned"
          : "Auto Align Images"}
    </button>
  </div>
</div>

              {/* False alarm */}
              <div className="rounded-2xl border border-[#eadfca] bg-[#fffdf8] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1cf] text-sm text-[#b47a18]">
                    !
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[#684f20]">
                      Potential False Alarm
                    </div>

                    <div className="mt-1 text-[10px] leading-4 text-[#806d4a]">
                      {detection.falseAlarmReason}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-[#eadfca] bg-white p-3">
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8d7955]">
                    Risk Level
                  </div>

                  <div className="mt-1 text-xs font-bold uppercase text-[#b47a18]">
                    {detection.falseAlarmRisk}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="rounded-lg border border-[#d7cdbb] bg-white py-2 text-[10px] font-semibold text-[#684f20]">
                    Review Images
                  </button>

                  <button className="rounded-lg border border-[#d7cdbb] bg-white py-2 text-[10px] font-semibold text-[#684f20]">
                    View Mask
                  </button>
                </div>
              </div>

              {/* Decision */}
              <div className="rounded-2xl border border-[#dce6f0] bg-white p-5">
                <div className="text-xs font-semibold text-[#16324f]">
                  Analyst Decision
                </div>

                <div className="mt-1 text-[10px] text-[#71869b]">
                  Record the review outcome for this detection.
                </div>

                {confirmed ? (
                  <div className="mt-4 rounded-xl bg-[#edf8f4] p-4 text-center">
                    <div className="text-xs font-semibold text-[#15906b]">
                      Change Confirmed
                    </div>

                    <div className="mt-1 text-[9px] text-[#4e806f]">
                      Construction detection recorded for review.
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setConfirmed(true)}
                      className="rounded-lg bg-[#15906b] py-2.5 text-[10px] font-semibold text-white hover:bg-[#11845f]"
                    >
                      Confirm Change
                    </button>

                    <button className="rounded-lg border border-[#dce6f0] bg-white py-2.5 text-[10px] font-semibold text-[#71869b] hover:bg-[#f8fafc]">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ----------------------------- */
/* Date field                     */
/* ----------------------------- */

function DateField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#71869b]">
        {label}
      </label>

      <div className="flex h-11 items-center rounded-lg border border-[#dce6f0] bg-[#f9fbfd] px-3 text-xs font-medium text-[#496784]">
        {value}
      </div>
    </div>
  );
}

/* ----------------------------- */
/* Image panel                    */
/* ----------------------------- */

function ImagePanel({
  label,
  date,
  image,
}: {
  label: string;
  date: string;
  image: string;
}) {
  return (
    <div className="relative h-[480px] overflow-hidden bg-[#dfe8ef]">
      <img
        src={image}
        alt={`${label} satellite imagery`}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute left-4 top-4 rounded-md bg-[#163b67]/90 px-3 py-1.5 text-[9px] font-semibold text-white">
        {label}
      </div>

      <div className="absolute bottom-4 left-4 rounded-md bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
        <div className="text-[8px] uppercase tracking-wider text-[#71869b]">
          Acquisition
        </div>

        <div className="mt-0.5 text-[10px] font-semibold text-[#16324f]">
          {date}
        </div>
      </div>

      <div className="absolute right-4 top-4 rounded-md bg-white/90 px-2 py-1 text-[8px] font-semibold text-[#496784]">
        Sentinel-2 · 10 m
      </div>
    </div>
  );
}
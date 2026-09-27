"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeDetections } from "@/data/changeDetections";
import {
  getInvestigation,
  type InvestigationState,
} from "@/lib/investigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function ChangeDetectionPage() {
  const router = useRouter();

  const [investigation] = useState<InvestigationState>(
    getInvestigation()
  );

  const detection =
    changeDetections.find(
      (item) => item.siteId === investigation.siteId
    ) || changeDetections[0];

  const [viewMode, setViewMode] = useState<"side" | "overlay">("side");
  const [opacity, setOpacity] = useState(50);
  const [aligning, setAligning] = useState(false);
  const [alignmentError, setAlignmentError] = useState(
    detection.alignmentError
  );
  const [showMask, setShowMask] = useState(false);
  const [decision, setDecision] = useState<
    "confirmed" | "rejected" | null
  >(null);

  const runAlignment = () => {
    if (aligning) return;

    setAligning(true);

    setTimeout(() => {
      setAlignmentError(0.8);
      setAligning(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#16324f]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-20">
        <div className="p-7">

          {/* Header */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1677e8]">
                Temporal Analysis
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
                Change Detection
              </h1>

              <p className="mt-2 text-sm text-[#71869b]">
                Compare multi-temporal satellite imagery and validate
                detected changes.
              </p>
            </div>

            <div className="rounded-lg border border-[#cfe0f0] bg-white px-4 py-2.5">
              <div className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
                Active Investigation
              </div>

              <div className="mt-1 text-xs font-semibold text-[#16324f]">
                {investigation.location}
              </div>
            </div>
          </div>

          {/* Temporal Selection */}
          <div className="mb-5 rounded-2xl border border-[#dce6f0] bg-white p-5">

            <div className="grid grid-cols-[1.3fr_1fr_1fr_auto] items-end gap-5">

              <Field
                label="Area of Interest"
                value={investigation.location}
              />

              <Field
                label="Before Date"
                value="2021"
              />

              <Field
                label="After Date"
                value="2025"
              />

              <button
                onClick={() =>
                  document
                    .getElementById("comparison")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="h-[55px] rounded-lg bg-[#1677e8] px-6 text-xs font-semibold text-white hover:bg-[#1268cf]"
              >
                Compare
              </button>

            </div>
          </div>

          {/* Comparison */}
          <section
            id="comparison"
            className="mb-5 rounded-2xl border border-[#dce6f0] bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between">

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
                  Temporal Comparison
                </div>

                <div className="mt-1 text-sm font-semibold text-[#16324f]">
                  {investigation.location}
                </div>
              </div>

              <div className="flex rounded-lg border border-[#dce6f0] bg-[#f7faff] p-1">
                <button
                  onClick={() => setViewMode("side")}
                  className={`rounded-md px-4 py-2 text-[10px] font-semibold ${
                    viewMode === "side"
                      ? "bg-white text-[#1677e8] shadow-sm"
                      : "text-[#71869b]"
                  }`}
                >
                  Side by Side
                </button>

                <button
                  onClick={() => setViewMode("overlay")}
                  className={`rounded-md px-4 py-2 text-[10px] font-semibold ${
                    viewMode === "overlay"
                      ? "bg-white text-[#1677e8] shadow-sm"
                      : "text-[#71869b]"
                  }`}
                >
                  Overlay
                </button>
              </div>
            </div>

            {viewMode === "side" ? (
              <div className="grid grid-cols-2 gap-4">

                <ImagePanel
                  title="Before"
                  date="2021"
                  src="/satellite/before/2021.png"
                />

                <ImagePanel
                  title="After"
                  date="2025"
                  src="/satellite/after/2025.png"
                />

              </div>
            ) : (
              <div className="relative h-[440px] overflow-hidden rounded-xl border border-[#dce6f0]">

                <img
                  src="/satellite/before/2021.png"
                  alt="Before satellite imagery"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <img
                  src="/satellite/after/2025.png"
                  alt="After satellite imagery"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    opacity: opacity / 100,
                  }}
                />

                <div className="absolute left-4 top-4 rounded-md bg-white/95 px-3 py-2 text-[10px] font-semibold text-[#16324f] shadow">
                  2021 → 2025
                </div>

                <div className="absolute bottom-4 left-1/2 w-64 -translate-x-1/2 rounded-xl border border-white/60 bg-white/95 px-4 py-3 shadow-lg">
                  <div className="mb-2 flex justify-between text-[9px] font-semibold text-[#71869b]">
                    <span>Before</span>
                    <span>After opacity</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    onChange={(e) =>
                      setOpacity(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

              </div>
            )}
          </section>

          {/* Detection Results */}
          <div className="grid grid-cols-[1.5fr_1fr] gap-5">

            {/* Changes */}
            <section className="rounded-2xl border border-[#dce6f0] bg-white p-5">

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
                    Detected Changes
                  </div>

                  <div className="mt-1 text-sm font-semibold text-[#16324f]">
                    {detection.changeCount} significant changes detected
                  </div>
                </div>

                <span className="rounded-full bg-[#eaf3ff] px-3 py-1 text-[9px] font-semibold text-[#1677e8]">
                  AI Analysis
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {detection.changes.map((change) => (
                  <div
                    key={change.type}
                    className="rounded-xl border border-[#e1e9f1] bg-[#fbfdff] p-4"
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <div className="text-xs font-semibold text-[#16324f]">
                          {change.type}
                        </div>

                        <div className="mt-1 text-[10px] text-[#71869b]">
                          Estimated affected area · {change.area}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-[#1677e8]">
                          {change.confidence}%
                        </div>

                        <div className="text-[8px] uppercase tracking-wider text-[#8a9bac]">
                          Confidence
                        </div>
                      </div>

                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e6edf4]">
                      <div
                        className="h-full rounded-full bg-[#1677e8]"
                        style={{
                          width: `${change.confidence}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Registration */}
            <section className="rounded-2xl border border-[#dce6f0] bg-white p-5">

              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
                Image Registration
              </div>

              <h2 className="mt-1 text-sm font-semibold text-[#16324f]">
                Spatial Alignment
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-[#71869b]">
                Align the before and after imagery before validating
                detected changes.
              </p>

              <div className="mt-5 rounded-xl border border-[#dce6f0] bg-[#f8fbff] p-4">

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#71869b]">
                    Registration Error
                  </span>

                  <span
                    className={`text-sm font-bold ${
                      alignmentError <= 1
                        ? "text-[#18a67a]"
                        : "text-[#e3a52f]"
                    }`}
                  >
                    {alignmentError.toFixed(1)} px
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5edf4]">
                  <div
                    className="h-full rounded-full bg-[#18a67a]"
                    style={{
                      width: `${Math.max(
                        15,
                        100 - alignmentError * 15
                      )}%`,
                    }}
                  />
                </div>

                <button
                  onClick={runAlignment}
                  disabled={aligning}
                  className="mt-4 w-full rounded-lg border border-[#bcd3eb] bg-white py-2.5 text-[10px] font-semibold text-[#1677e8] hover:bg-[#f3f8fe] disabled:opacity-60"
                >
                  {aligning ? "Aligning Imagery…" : "Auto Align"}
                </button>

              </div>
            </section>
          </div>

          {/* False Alarm */}
          <section className="mt-5 rounded-2xl border border-[#ead9b3] bg-[#fffaf0] p-5">

            <div className="flex items-start justify-between">

              <div className="flex gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f9e8bb] text-[#b77c12]">
                  !
                </div>

                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b77c12]">
                    Potential False Alarm
                  </div>

                  <h2 className="mt-1 text-sm font-semibold text-[#6e531b]">
                    Review required before confirmation
                  </h2>

                  <p className="mt-2 max-w-2xl text-[10px] leading-5 text-[#806a3b]">
                    {detection.falseAlarmReason}
                  </p>

                  <div className="mt-3 flex gap-2">
                    {[
                      "Cloud",
                      "Shadow",
                      "Seasonal Variation",
                    ].map((reason) => (
                      <span
                        key={reason}
                        className="rounded-md border border-[#ead9b3] bg-white/70 px-2.5 py-1 text-[9px] text-[#806a3b]"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={() => setShowMask(!showMask)}
                className="rounded-lg border border-[#ddc98e] bg-white px-4 py-2 text-[10px] font-semibold text-[#8a681f]"
              >
                {showMask ? "Hide Mask" : "View Mask"}
              </button>

            </div>

            {showMask && (
              <div className="mt-4 rounded-xl border border-[#ead9b3] bg-[#f6e7b7] p-4 text-center text-[10px] font-semibold text-[#8a681f]">
                Simulated false-alarm mask · cloud-affected region
              </div>
            )}
          </section>

          {/* Analyst Decision */}
          <section className="mt-5 rounded-2xl border border-[#dce6f0] bg-white p-5">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
                  Analyst Decision
                </div>

                <div className="mt-1 text-sm font-semibold text-[#16324f]">
                  Validate detected construction
                </div>
              </div>

              {decision && (
                <span
                  className={`rounded-full px-3 py-1 text-[9px] font-semibold ${
                    decision === "confirmed"
                      ? "bg-[#e5f7f0] text-[#15936d]"
                      : "bg-[#fdeaea] text-[#c84845]"
                  }`}
                >
                  {decision === "confirmed"
                    ? "Confirmed"
                    : "Rejected"}
                </span>
              )}

            </div>

            <div className="mt-4 flex gap-3">

              <button
                onClick={() => setDecision("confirmed")}
                className="rounded-lg bg-[#18a67a] px-6 py-2.5 text-[10px] font-semibold text-white hover:bg-[#13946d]"
              >
                Confirm Change
              </button>

              <button
                onClick={() => setDecision("rejected")}
                className="rounded-lg border border-[#e1bcbc] bg-white px-6 py-2.5 text-[10px] font-semibold text-[#c84845] hover:bg-[#fff6f6]"
              >
                Reject
              </button>

              <button
                onClick={() => router.push("/similar-locations")}
                className="ml-auto rounded-lg border border-[#c9d9e8] bg-white px-5 py-2.5 text-[10px] font-semibold text-[#1677e8] hover:bg-[#f5f9fd]"
              >
                Find Similar Locations →
              </button>

            </div>

            {decision === "confirmed" && (
              <div className="mt-4 rounded-lg border border-[#bfe5d6] bg-[#f1fbf7] px-4 py-3 text-[10px] text-[#198363]">
                Construction change confirmed by analyst. Investigation
                can now continue to similar-location discovery.
              </div>
            )}

            {decision === "rejected" && (
              <div className="mt-4 rounded-lg border border-[#edcccc] bg-[#fff6f6] px-4 py-3 text-[10px] text-[#b94a47]">
                Detection rejected and marked for review.
              </div>
            )}

          </section>

        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#71869b]">
        {label}
      </div>

      <div className="flex h-[55px] items-center rounded-lg border border-[#d8e4ef] bg-[#f9fbfd] px-4 text-sm text-[#496784]">
        {value}
      </div>
    </div>
  );
}

function ImagePanel({
  title,
  date,
  src,
}: {
  title: string;
  date: string;
  src: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#dce6f0] bg-[#f8fbff]">

      <div className="flex items-center justify-between border-b border-[#dce6f0] px-4 py-3">

        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#71869b]">
          {title}
        </div>

        <span className="rounded-md bg-white px-2 py-1 text-[9px] font-semibold text-[#496784]">
          {date}
        </span>

      </div>

      <div className="h-[440px] bg-[#e9eff4]">
        <img
          src={src}
          alt={`${title} satellite imagery from ${date}`}
          className="h-full w-full object-cover"
        />
      </div>

    </div>
  );
}
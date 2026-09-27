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
    <main className="min-h-screen bg-[#061522] text-[#e7f1f8]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-[72px]">
        <div className="p-7">

          {/* Header */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ed5ff]">
                Temporal Analysis
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#e7f1f8]">
                Change Detection
              </h1>

              <p className="mt-2 text-sm text-[#6f8da3]">
                Compare multi-temporal satellite imagery and validate
                detected changes.
              </p>
            </div>

            <div className="rounded-lg border border-[rgba(125,171,204,0.22)] bg-[#0b2032] px-4 py-2.5">
              <div className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
                Active Investigation
              </div>

              <div className="mt-1 text-xs font-semibold text-[#e7f1f8]">
                {investigation.location}
              </div>
            </div>
          </div>

          {/* Temporal Selection */}
          <div className="mb-5 rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">

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
                className="h-[55px] rounded-lg bg-[#1677aa] px-6 text-xs font-semibold text-white hover:bg-[#1d8fc8]"
              >
                Compare
              </button>

            </div>
          </div>

          {/* Comparison */}
          <section
            id="comparison"
            className="mb-5 rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          >
            <div className="mb-4 flex items-center justify-between">

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
                  Temporal Comparison
                </div>

                <div className="mt-1 text-sm font-semibold text-[#e7f1f8]">
                  {investigation.location}
                </div>
              </div>

              <div className="flex rounded-lg border border-[rgba(125,171,204,0.16)] bg-[#081a29] p-1">
                <button
                  onClick={() => setViewMode("side")}
                  className={`rounded-md px-4 py-2 text-[10px] font-semibold ${
                    viewMode === "side"
                      ? "bg-[#0b2032] text-[#8ed5ff] shadow-sm"
                      : "text-[#6f8da3]"
                  }`}
                >
                  Side by Side
                </button>

                <button
                  onClick={() => setViewMode("overlay")}
                  className={`rounded-md px-4 py-2 text-[10px] font-semibold ${
                    viewMode === "overlay"
                      ? "bg-[#0b2032] text-[#8ed5ff] shadow-sm"
                      : "text-[#6f8da3]"
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
              <div className="relative h-[440px] overflow-hidden rounded-xl border border-[rgba(125,171,204,0.16)]">

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

                <div className="absolute left-4 top-4 rounded-md bg-[#0b2032]/95 px-3 py-2 text-[10px] font-semibold text-[#e7f1f8] shadow">
                  2021 → 2025
                </div>

                <div className="absolute bottom-4 left-1/2 w-64 -translate-x-1/2 rounded-xl border border-white/60 bg-[#0b2032]/95 px-4 py-3 shadow-lg">
                  <div className="mb-2 flex justify-between text-[9px] font-semibold text-[#6f8da3]">
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
            <section className="rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5">

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
                    Detected Changes
                  </div>

                  <div className="mt-1 text-sm font-semibold text-[#e7f1f8]">
                    {detection.changeCount} significant changes detected
                  </div>
                </div>

                <span className="rounded-full bg-[#55b8f4]/10 px-3 py-1 text-[9px] font-semibold text-[#8ed5ff]">
                  AI Analysis
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {detection.changes.map((change) => (
                  <div
                    key={change.type}
                    className="rounded-xl border border-[rgba(125,171,204,0.13)] bg-[#0c2234] p-4 transition hover:border-[#55b8f4]/25"
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <div className="text-xs font-semibold text-[#e7f1f8]">
                          {change.type}
                        </div>

                        <div className="mt-1 text-[10px] text-[#6f8da3]">
                          Estimated affected area · {change.area}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-[#8ed5ff]">
                          {change.confidence}%
                        </div>

                        <div className="text-[8px] uppercase tracking-wider text-[#58788d]">
                          Confidence
                        </div>
                      </div>

                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#183345]">
                      <div
                        className="h-full rounded-full bg-[#1677aa]"
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
            <section className="rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5">

              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
                Image Registration
              </div>

              <h2 className="mt-1 text-sm font-semibold text-[#e7f1f8]">
                Spatial Alignment
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-[#6f8da3]">
                Align the before and after imagery before validating
                detected changes.
              </p>

              <div className="mt-5 rounded-xl border border-[rgba(125,171,204,0.16)] bg-[#081a29] p-4">

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#6f8da3]">
                    Registration Error
                  </span>

                  <span
                    className={`text-sm font-bold ${
                      alignmentError <= 1
                        ? "text-[#63ddb2]"
                        : "text-[#d4aa55]"
                    }`}
                  >
                    {alignmentError.toFixed(1)} px
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#183345]">
                  <div
                    className="h-full rounded-full bg-[#39c99a]"
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
                  className="mt-4 w-full rounded-lg border border-[rgba(125,171,204,0.22)] bg-[#0b2032] py-2.5 text-[10px] font-semibold text-[#8ed5ff] hover:hover:bg-[#102b3c] disabled:opacity-60"
                >
                  {aligning ? "Aligning Imagery…" : "Auto Align"}
                </button>

              </div>
            </section>
          </div>

          {/* False Alarm */}
          <section className="mt-5 rounded-2xl border border-[#9b782f]/35 bg-[#211b0d] p-5">

            <div className="flex items-start justify-between">

              <div className="flex gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#8d6a20]/20 text-[#d4aa55]">
                  !
                </div>

                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4aa55]">
                    Potential False Alarm
                  </div>

                  <h2 className="mt-1 text-sm font-semibold text-[#e0c783]">
                    Review required before confirmation
                  </h2>

                  <p className="mt-2 max-w-2xl text-[10px] leading-5 text-[#bfae7c]">
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
                        className="rounded-md border border-[#9b782f]/35 bg-[#0b2032]/70 px-2.5 py-1 text-[9px] text-[#bfae7c]"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={() => setShowMask(!showMask)}
                className="rounded-lg border border-[#b78a2a]/40 bg-[#0b2032] px-4 py-2 text-[10px] font-semibold text-[#d4aa55]"
              >
                {showMask ? "Hide Mask" : "View Mask"}
              </button>

            </div>

            {showMask && (
              <div className="mt-4 rounded-xl border border-[#9b782f]/35 bg-[#6e5720]/25 p-4 text-center text-[10px] font-semibold text-[#d4aa55]">
                Simulated false-alarm mask · cloud-affected region
              </div>
            )}
          </section>

          {/* Analyst Decision */}
          <section className="mt-5 rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
                  Analyst Decision
                </div>

                <div className="mt-1 text-sm font-semibold text-[#e7f1f8]">
                  Validate detected construction
                </div>
              </div>

              {decision && (
                <span
                  className={`rounded-full px-3 py-1 text-[9px] font-semibold ${
                    decision === "confirmed"
                      ? "bg-[#39c99a]/10 text-[#63ddb2]"
                      : "bg-[#fdeaea] text-[#f07b77]"
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
                className="rounded-lg bg-[#39c99a] px-6 py-2.5 text-[10px] font-semibold text-white hover:bg-[#2fb889]"
              >
                Confirm Change
              </button>

              <button
                onClick={() => setDecision("rejected")}
                className="rounded-lg border border-[#c84845]/30 bg-[#0b2032] px-6 py-2.5 text-[10px] font-semibold text-[#f07b77] hover:bg-[#c84845]/[0.06]"
              >
                Reject
              </button>

              <button
                onClick={() => router.push("/similar-locations")}
                className="ml-auto rounded-lg border border-[rgba(125,171,204,0.2)] bg-[#0b2032] px-5 py-2.5 text-[10px] font-semibold text-[#8ed5ff] hover:bg-[#102b3c]"
              >
                Find Similar Locations →
              </button>

            </div>

            {decision === "confirmed" && (
              <div className="mt-4 rounded-lg border border-[#39c99a]/25 bg-[#39c99a]/[0.06] px-4 py-3 text-[10px] text-[#63ddb2]">
                Construction change confirmed by analyst. Investigation
                can now continue to similar-location discovery.
              </div>
            )}

            {decision === "rejected" && (
              <div className="mt-4 rounded-lg border border-[#c84845]/25 bg-[#c84845]/[0.06] px-4 py-3 text-[10px] text-[#f07b77]">
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
      <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6f8da3]">
        {label}
      </div>

      <div className="flex h-[55px] items-center rounded-lg border border-[rgba(125,171,204,0.18)] bg-[#081a29] px-4 text-sm text-[#bcd3e1]">
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
    <div className="overflow-hidden rounded-xl border border-[rgba(125,171,204,0.16)] bg-[#081a29]">

      <div className="flex items-center justify-between border-b border-[rgba(125,171,204,0.16)] bg-[#0b2032] px-4 py-3">

        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6f8da3]">
          {title}
        </div>

        <span className="rounded-md bg-[#0b2032] px-2 py-1 text-[9px] font-semibold text-[#bcd3e1]">
          {date}
        </span>

      </div>

      <div className="h-[440px] bg-[#102b3c]">
        <img
          src={src}
          alt={`${title} satellite imagery from ${date}`}
          className="h-full w-full object-cover"
        />
      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { changeDetections } from "@/data/changeDetections";
import {
  getInvestigation,
  type InvestigationState,
} from "@/lib/investigation";

export default function ChangeDetectionPage() {
  const router = useRouter();

  const detection = changeDetections[0];

  const [investigation, setInvestigation] =
    useState<InvestigationState | null>(null);

  const [comparisonMode, setComparisonMode] = useState<"side" | "overlay">(
    "side"
  );

  const [opacity, setOpacity] = useState(50);

  const [aligning, setAligning] = useState(false);
  const [aligned, setAligned] = useState(false);
  const [alignmentError, setAlignmentError] = useState(
    detection.alignmentError
  );

  const [showMask, setShowMask] = useState(false);

  const [confirmed, setConfirmed] = useState(false);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  useEffect(() => {
    setInvestigation(getInvestigation());
  }, []);

  const handleAutoAlign = () => {
    if (aligning || aligned) return;

    setAligning(true);

    setTimeout(() => {
      setAligning(false);
      setAligned(true);
      setAlignmentError(0.8);
    }, 1500);
  };

  const handleConfirm = () => {
    setConfirmed(true);

    setConfirmedAt(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const location =
    investigation?.location || "Narmada Basin — Sector A";

  const changeType =
    investigation?.changeType || "Construction";

  const confidence =
    investigation?.confidence || 91;

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#16324f]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-20">
        <div className="p-7 animate-fade-up">

          {/* Header */}
          <div className="mb-7 flex items-start justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1677e8]">
                Multi-Temporal Analysis
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
                Change Detection
              </h1>

              <p className="mt-2 text-sm text-[#71869b]">
                Compare satellite imagery across time and review detected
                changes.
              </p>
            </div>

            <div className="rounded-xl border border-[#dce6f0] bg-white px-4 py-3 text-right">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                Active Investigation
              </div>

              <div className="mt-1 text-xs font-semibold text-[#16324f]">
                {location}
              </div>
            </div>
          </div>

          {/* Investigation Summary */}
          <section className="rounded-2xl border border-[#dce6f0] bg-white p-5">
            <div className="grid grid-cols-4 gap-5">

              <Summary
                label="Location"
                value={location}
              />

              <Summary
                label="Detected Type"
                value={changeType}
              />

              <Summary
                label="Confidence"
                value={`${confidence}%`}
              />

              <Summary
                label="Temporal Range"
                value={`${detection.beforeDate} → ${detection.afterDate}`}
              />

            </div>
          </section>

          {/* Temporal Comparison */}
          <section className="mt-6 rounded-2xl border border-[#dce6f0] bg-white p-5">

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[#16324f]">
                  Temporal Comparison
                </div>

                <div className="mt-1 text-[10px] text-[#71869b]">
                  Satellite imagery comparison for the selected investigation.
                </div>
              </div>

              <div className="flex rounded-lg border border-[#dce6f0] bg-[#f8fbff] p-1">
                <button
                  onClick={() => setComparisonMode("side")}
                  className={`rounded-md px-4 py-2 text-[9px] font-semibold ${
                    comparisonMode === "side"
                      ? "bg-white text-[#1677e8] shadow-sm"
                      : "text-[#71869b]"
                  }`}
                >
                  Side by Side
                </button>

                <button
                  onClick={() => setComparisonMode("overlay")}
                  className={`rounded-md px-4 py-2 text-[9px] font-semibold ${
                    comparisonMode === "overlay"
                      ? "bg-white text-[#1677e8] shadow-sm"
                      : "text-[#71869b]"
                  }`}
                >
                  Overlay
                </button>
              </div>
            </div>

            {comparisonMode === "side" ? (
              <div className="mt-5 grid grid-cols-2 gap-4">

                <ImagePanel
                  label="BEFORE"
                  date={detection.beforeDate}
                  src="/satellite/before/2021.png"
                />

                <ImagePanel
                  label="AFTER"
                  date={detection.afterDate}
                  src="/satellite/after/2025.png"
                />

              </div>
            ) : (
              <div className="mt-5">
                <div className="relative h-[430px] overflow-hidden rounded-xl border border-[#dce6f0] bg-[#e8eef4]">

                  <img
                    src="/satellite/before/2021.png"
                    alt="Before satellite imagery"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      width: `${opacity}%`,
                    }}
                  >
                    <img
                      src="/satellite/after/2025.png"
                      alt="After satellite imagery"
                      className="h-full w-full object-cover"
                      style={{
                        width: `${100 / (opacity / 100)}%`,
                        maxWidth: "none",
                      }}
                    />
                  </div>

                  <div className="absolute left-3 top-3 rounded-md bg-[#16324f]/90 px-2.5 py-1.5 text-[9px] font-semibold text-white">
                    BEFORE / AFTER
                  </div>

                  <div className="absolute bottom-4 left-1/2 w-64 -translate-x-1/2 rounded-xl border border-white/60 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
                    <div className="flex justify-between text-[9px] font-semibold text-[#71869b]">
                      <span>2021</span>
                      <span>2025</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={opacity}
                      onChange={(e) =>
                        setOpacity(Number(e.target.value))
                      }
                      className="mt-2 w-full accent-[#1677e8]"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Detected Changes */}
          <section className="mt-6 rounded-2xl border border-[#dce6f0] bg-white p-5">

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[#16324f]">
                  Detected Changes
                </div>

                <div className="mt-1 text-[10px] text-[#71869b]">
                  Potential changes identified between the selected dates.
                </div>
              </div>

              <div className="rounded-md bg-[#eaf3ff] px-3 py-1.5 text-[9px] font-semibold text-[#1677e8]">
                {detection.changeCount} changes detected
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4">
              {detection.changes.map((change) => (
                <div
                  key={change.type}
                  className="rounded-xl border border-[#dce6f0] bg-[#f9fbfd] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#16324f]">
                      {change.type}
                    </span>

                    <span className="text-sm font-semibold text-[#1677e8]">
                      {change.confidence}%
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e4ebf2]">
                      <div
                        className="h-full rounded-full bg-[#1677e8]"
                        style={{
                          width: `${change.confidence}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-[10px] text-[#71869b]">
                    Estimated area: {change.area}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Image Registration */}
          <section className="mt-6 rounded-2xl border border-[#dce6f0] bg-white p-5">

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[#16324f]">
                  Image Registration
                </div>

                <div className="mt-1 text-[10px] text-[#71869b]">
                  Align before and after imagery to reduce false detections
                  caused by spatial misalignment.
                </div>
              </div>

              <div
                className={`rounded-md px-3 py-1.5 text-[9px] font-semibold ${
                  aligned
                    ? "bg-[#effaf6] text-[#12845f]"
                    : "bg-[#fff7e8] text-[#b47a16]"
                }`}
              >
                {aligned ? "ALIGNED" : "REGISTRATION REQUIRED"}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_220px] gap-5">

              <div className="grid grid-cols-2 gap-3">

                <ImagePanel
                  label="BEFORE"
                  date={detection.beforeDate}
                  src="/satellite/before/2021.png"
                  compact
                />

                <ImagePanel
                  label="AFTER"
                  date={detection.afterDate}
                  src="/satellite/after/2025.png"
                  compact
                />

              </div>

              <div className="rounded-xl border border-[#dce6f0] bg-[#f9fbfd] p-4">

                <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                  Alignment Error
                </div>

                <div className="mt-2 text-2xl font-semibold text-[#16324f]">
                  {alignmentError} px
                </div>

                <div className="mt-1 text-[9px] text-[#71869b]">
                  {aligned
                    ? "Registration completed successfully."
                    : "Estimated spatial registration error."}
                </div>

                <button
                  onClick={handleAutoAlign}
                  disabled={aligning || aligned}
                  className={`mt-5 w-full rounded-lg py-2.5 text-[10px] font-semibold ${
                    aligned
                      ? "cursor-default bg-[#effaf6] text-[#12845f]"
                      : "bg-[#1677e8] text-white hover:bg-[#1268cf]"
                  }`}
                >
                  {aligning
                    ? "Aligning imagery..."
                    : aligned
                      ? "Alignment Complete"
                      : "Auto Align"}
                </button>

              </div>
            </div>
          </section>

          {/* False Alarm */}
          <section className="mt-6 rounded-2xl border border-[#ecd8a8] bg-white p-5">

            <div className="flex items-start justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff4d9] text-[#b47a16]">
                    !
                  </span>

                  <div>
                    <div className="text-sm font-semibold text-[#16324f]">
                      Potential False Alarm
                    </div>

                    <div className="mt-1 text-[10px] text-[#71869b]">
                      Automated review identified a possible imaging artifact.
                    </div>
                  </div>
                </div>
              </div>

              <span className="rounded-md bg-[#fff4d9] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#b47a16]">
                {detection.falseAlarmRisk} risk
              </span>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_180px] gap-5">

              <div className="rounded-xl border border-[#eadfca] bg-[#fffaf0] p-4">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                  Possible Reason
                </div>

                <div className="mt-2 text-xs font-medium text-[#496784]">
                  {detection.falseAlarmReason}
                </div>

                <div className="mt-3 text-[10px] leading-5 text-[#71869b]">
                  Review the original imagery and change mask before confirming
                  the detected change.
                </div>
              </div>

              <button
                onClick={() => setShowMask(!showMask)}
                className="rounded-lg border border-[#dce6f0] bg-white px-4 py-3 text-[10px] font-semibold text-[#1677e8] hover:bg-[#f7fbff]"
              >
                {showMask ? "Hide Mask" : "View Mask"}
              </button>
            </div>

            {showMask && (
              <div className="mt-5 overflow-hidden rounded-xl border border-[#dce6f0] bg-[#101820]">
                <div className="relative h-[300px]">

                  <img
                    src="/satellite/after/2025.png"
                    alt="Change detection mask"
                    className="h-full w-full object-cover opacity-75"
                  />

                  <div className="absolute left-[30%] top-[32%] h-20 w-28 rounded border-2 border-[#d9534f] bg-[#d9534f]/30" />

                  <div className="absolute left-[58%] top-[48%] h-16 w-24 rounded border-2 border-[#d9534f] bg-[#d9534f]/30" />

                  <div className="absolute left-4 top-4 rounded-md bg-[#16324f]/90 px-3 py-2 text-[9px] font-semibold text-white">
                    CHANGE MASK · REVIEW REQUIRED
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Analyst Decision */}
          <section className="mt-6 rounded-2xl border border-[#dce6f0] bg-white p-5">

            {!confirmed ? (
              <div className="flex items-center justify-between">

                <div>
                  <div className="text-sm font-semibold text-[#16324f]">
                    Analyst Decision
                  </div>

                  <div className="mt-1 text-[10px] text-[#71869b]">
                    Review the evidence before confirming the detected change.
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="rounded-lg border border-[#e3b8b6] bg-white px-5 py-2.5 text-[10px] font-semibold text-[#c44c48] hover:bg-[#fff8f8]">
                    Reject Change
                  </button>

                  <button
                    onClick={handleConfirm}
                    className="rounded-lg bg-[#18a67a] px-5 py-2.5 text-[10px] font-semibold text-white hover:bg-[#128b67]"
                  >
                    Confirm Change
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#effaf6] text-[#18a67a]">
                    ✓
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-[#16324f]">
                      Change Confirmed
                    </div>

                    <div className="mt-1 text-[10px] text-[#71869b]">
                      {changeType} — {confidence}% confidence
                    </div>

                    <div className="mt-1 text-[9px] text-[#9aabba]">
                      Confirmed at {confirmedAt}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/similar-locations")}
                  className="rounded-lg border border-[#cfe0f0] bg-white px-5 py-2.5 text-[10px] font-semibold text-[#1677e8] hover:border-[#9fc4ed] hover:bg-[#f7fbff]"
                >
                  Find Similar Locations →
                </button>

              </div>
            )}
          </section>

        </div>
      </section>
    </main>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
        {label}
      </div>

      <div className="mt-2 text-xs font-semibold text-[#16324f]">
        {value}
      </div>
    </div>
  );
}

function ImagePanel({
  label,
  date,
  src,
  compact = false,
}: {
  label: string;
  date: string;
  src: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-[#dce6f0] bg-[#e9eff4] ${
        compact ? "h-[220px]" : "h-[430px]"
      }`}
    >
      <div className="relative h-full">
        <img
          src={src}
          alt={`${label} satellite imagery`}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-3 top-3 rounded-md bg-[#16324f]/90 px-2.5 py-1.5 text-[9px] font-semibold text-white">
          {label}
        </div>

        <div className="absolute bottom-3 left-3 rounded-md border border-white/30 bg-[#16324f]/90 px-2.5 py-1 text-[9px] font-medium text-white">
          {date}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Text to Image");
  const [query, setQuery] = useState("new buildings near a river");
  const [aoiMode, setAoiMode] = useState("Rectangle");
  const [sensor, setSensor] = useState("All Sensors");
  const [resolution, setResolution] = useState("Any");
  const [changeType, setChangeType] = useState("All Changes");
  const [layer, setLayer] = useState("Satellite");

  return (
    <div className="min-h-screen bg-[#080d12] text-[#e8eef2]">
      <Sidebar />
      <Topbar />

      <main className="ml-64 pt-20">
        <div className="p-5">
          {/* Global search */}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#1d2a34] bg-[#0d141b] px-4 py-3">
            <span className="text-lg text-[#52616c]">⌕</span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#d7e1e5] outline-none placeholder:text-[#52616c]"
              placeholder="Search areas, changes or upload an image..."
            />

            <span className="text-[9px] uppercase tracking-wider text-[#52616c]">
              Semantic Search
            </span>
          </div>

          {/* Workspace tabs */}
          <div className="mb-4 flex items-center gap-1 border-b border-[#1d2a34]">
            {["Text to Image", "Image to Image", "Change Detection"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-5 py-3 text-xs transition-colors ${
                    activeTab === tab
                      ? "border-[#66d9c4] text-[#66d9c4]"
                      : "border-transparent text-[#7f909d] hover:text-[#d7e1e5]"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Main workspace */}
          <div className="grid min-h-[calc(100vh-170px)] grid-cols-[300px_1fr] overflow-hidden rounded-xl border border-[#1d2a34] bg-[#0d141b]">
            {/* Search / filter panel */}
            <aside className="border-r border-[#1d2a34] bg-[#0b1117]">
              <div className="border-b border-[#1d2a34] px-4 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">
                    Search & Filter
                  </h2>

                  <button
                    onClick={() => {
                      setQuery("");
                      setSensor("All Sensors");
                      setResolution("Any");
                      setChangeType("All Changes");
                    }}
                    className="text-[10px] text-[#66d9c4] hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-4">
                {/* Query */}
                <div>
                  <label className="mb-2 block text-[9px] font-medium uppercase tracking-wider text-[#52616c]">
                    Query
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="min-w-0 flex-1 rounded-md border border-[#26343e] bg-[#080d12] px-3 py-2.5 text-xs outline-none focus:border-[#66d9c4]"
                    />

                    <button className="rounded-md bg-[#66d9c4] px-4 text-[10px] font-semibold text-[#07100f]">
                      Search
                    </button>
                  </div>
                </div>

                {/* AOI */}
                <div>
                  <label className="mb-2 block text-[9px] font-medium uppercase tracking-wider text-[#52616c]">
                    Area of Interest (AOI)
                  </label>

                  <div className="grid grid-cols-4 gap-1">
                    {["Draw", "Polygon", "Rectangle", "Upload"].map(
                      (mode) => (
                        <button
                          key={mode}
                          onClick={() => setAoiMode(mode)}
                          className={`rounded-md border px-1 py-2 text-[8px] ${
                            aoiMode === mode
                              ? "border-[#66d9c4] bg-[#66d9c4]/10 text-[#66d9c4]"
                              : "border-[#26343e] text-[#7f909d] hover:border-[#52616c]"
                          }`}
                        >
                          {mode}
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-2 rounded-md border border-dashed border-[#26343e] bg-[#080d12] px-3 py-4 text-center text-[9px] text-[#52616c]">
                    Use map to draw area of interest
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-[9px] font-medium uppercase tracking-wider text-[#52616c]">
                    Date Range
                  </label>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <DateBox value="Jan 2024" />
                    <span className="text-[9px] text-[#52616c]">to</span>
                    <DateBox value="Jan 2026" />
                  </div>
                </div>

                <Filter
                  label="Satellite / Sensor"
                  value={sensor}
                  options={[
                    "All Sensors",
                    "Sentinel-2",
                    "Sentinel-1",
                    "Landsat 9",
                  ]}
                  onChange={setSensor}
                />

                <Filter
                  label="Resolution"
                  value={resolution}
                  options={["Any", "10 m", "20 m", "30 m"]}
                  onChange={setResolution}
                />

                <Filter
                  label="Change Type"
                  value={changeType}
                  options={[
                    "All Changes",
                    "Construction",
                    "Road Development",
                    "Water Variation",
                    "Expansion",
                    "Disappearance",
                  ]}
                  onChange={setChangeType}
                />
              </div>
            </aside>

            {/* Map */}
            <section className="relative min-w-0 bg-[#101a20]">
              <SatelliteMap
                layer={layer}
                onLayerChange={setLayer}
              />

              {/* AOI label */}
              <div className="absolute left-[32%] top-[25%] h-[45%] w-[43%] border-2 border-[#66d9c4] bg-[#66d9c4]/8">
                <div className="absolute -top-6 left-0 rounded bg-[#080d12]/80 px-2 py-1 text-[9px] uppercase tracking-wider text-[#66d9c4]">
                  AOI · 120 km²
                </div>

                <div className="absolute bottom-2 left-2 text-[9px] text-[#9ab0b4]">
                  Narmada Basin · Sector A
                </div>
              </div>

              {/* Detection marker */}
              <button className="detection-pulse absolute left-[54%] top-[47%] flex h-7 w-7 items-center justify-center rounded-full border border-[#66d9c4] bg-[#66d9c4]/15">
                <span className="h-2.5 w-2.5 rounded-full bg-[#66d9c4]" />
              </button>

              {/* Layer selector */}
              <div className="absolute right-4 top-4 w-40 rounded-lg border border-[#26343e] bg-[#080d12]/90 p-3 backdrop-blur">
                {[
                  "Satellite",
                  "Change Layer",
                  "Boundaries",
                  "None",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setLayer(item)}
                    className="flex w-full items-center gap-2 py-1.5 text-left text-[10px] text-[#9aa9b0]"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${
                        layer === item
                          ? "border-[#66d9c4] bg-[#66d9c4]"
                          : "border-[#52616c]"
                      }`}
                    />
                    {item}
                  </button>
                ))}
              </div>

              {/* Map controls */}
              <div className="absolute left-4 top-4 overflow-hidden rounded-lg border border-[#26343e] bg-[#080d12]/90">
                <button className="block h-9 w-9 border-b border-[#26343e] text-lg text-[#d7e1e5] hover:bg-[#111b24]">
                  +
                </button>
                <button className="block h-9 w-9 text-lg text-[#d7e1e5] hover:bg-[#111b24]">
                  −
                </button>
              </div>

              {/* Coordinates */}
              <div className="absolute bottom-4 left-4 rounded-md border border-[#26343e] bg-[#080d12]/85 px-3 py-2 font-mono text-[9px] text-[#7f909d]">
                22.7200° N · 73.1200° E
              </div>

              {/* Scale */}
              <div className="absolute bottom-4 right-4 flex items-end gap-2">
                <div className="h-1 w-24 border-x border-t border-[#d7e1e5]" />
                <span className="text-[8px] text-[#d7e1e5]">
                  5 km
                </span>
              </div>

              {/* Search result */}
              <div className="absolute bottom-16 right-4 w-64 rounded-lg border border-[#26343e] bg-[#080d12]/90 p-4 backdrop-blur">
                <div className="text-[9px] uppercase tracking-wider text-[#66d9c4]">
                  Selected Location
                </div>

                <div className="mt-2 text-xs font-medium">
                  New construction near river
                </div>

                <div className="mt-1 text-[10px] text-[#52616c]">
                  Narmada Basin — Sector A
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] text-[#52616c]">
                    Sentinel-2 · 10 m
                  </span>

                  <span className="text-xs font-semibold text-[#66d9c4]">
                    94%
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function DateBox({ value }: { value: string }) {
  return (
    <div className="rounded-md border border-[#26343e] bg-[#080d12] px-2 py-2.5 text-[9px] text-[#d7e1e5]">
      {value}
    </div>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-medium uppercase tracking-wider text-[#52616c]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#26343e] bg-[#080d12] px-3 py-2.5 text-[10px] text-[#d7e1e5] outline-none focus:border-[#66d9c4]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function SatelliteMap({
  layer,
  onLayerChange,
}: {
  layer: string;
  onLayerChange: (value: string) => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Terrain */}
      <div className="absolute inset-0 bg-[#183027]" />

      <div className="absolute -left-[8%] top-[8%] h-[75%] w-[42%] rotate-[18deg] rounded-[45%] bg-[#264235]" />

      <div className="absolute left-[18%] top-[-15%] h-[120%] w-[24%] rotate-[31deg] rounded-[50%] bg-[#213a30]" />

      <div className="absolute right-[-5%] top-[10%] h-[80%] w-[38%] rotate-[-16deg] rounded-[48%] bg-[#20392e]" />

      {/* River */}
      <div className="absolute -right-[5%] top-[-20%] h-[140%] w-[15%] rotate-[25deg] rounded-[50%] bg-[#18373a] opacity-90" />

      <div className="absolute right-[20%] top-[-20%] h-[140%] w-[4%] rotate-[25deg] rounded-[50%] bg-[#1d4143]" />

      {/* Roads */}
      <div className="absolute left-[-10%] top-[55%] h-[3px] w-[120%] rotate-[9deg] bg-[#8c907c]/50" />

      <div className="absolute left-[48%] top-[-20%] h-[140%] w-[3px] rotate-[32deg] bg-[#858a79]/45" />

      <div className="absolute left-[10%] top-[28%] h-[2px] w-[90%] rotate-[-18deg] bg-[#777d6e]/35" />

      {/* Settlement / structures */}
      <div className="absolute left-[45%] top-[38%] grid grid-cols-8 gap-1 opacity-70">
        {Array.from({ length: 40 }).map((_, index) => (
          <span
            key={index}
            className="h-2 w-2 bg-[#8e927e]"
          />
        ))}
      </div>

      {/* Roads around settlement */}
      <div className="absolute left-[41%] top-[52%] h-[2px] w-40 rotate-[4deg] bg-[#a0a08b]/60" />

      {/* Map texture */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Layer status */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md border border-[#26343e] bg-[#080d12]/75 px-3 py-1.5 text-[9px] text-[#7f909d]">
        {layer === "Satellite"
          ? "Satellite · Latest"
          : `${layer} enabled`}
      </div>
    </div>
  );
}
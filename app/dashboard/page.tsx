"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { searchResults } from "@/data/searchResults";

type SearchResult = (typeof searchResults)[number];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");
  const [query, setQuery] = useState("");
  const [selectedResult, setSelectedResult] =
    useState<SearchResult | null>(searchResults[0]);

const [sensor, setSensor] = useState("All Sensors");
const [resolution, setResolution] = useState("All Resolutions");
const [changeType, setChangeType] = useState("All Changes");

const [submittedQuery, setSubmittedQuery] = useState("");

const getSearchIntent = (text: string) => {
  const q = text.toLowerCase();

  if (
    q.includes("building") ||
    q.includes("construction") ||
    q.includes("structure") ||
    q.includes("structures")
  ) {
    return "construction";
  }

  if (
    q.includes("road") ||
    q.includes("highway") ||
    q.includes("development")
  ) {
    return "development";
  }

  if (
    q.includes("vehicle") ||
    q.includes("vehicles") ||
    q.includes("convoy")
  ) {
    return "vehicle";
  }

  return "general";
};

const filteredResults = useMemo(() => {
  const intent = getSearchIntent(submittedQuery);

  return searchResults.filter((result) => {
    const text = `
      ${result.title}
      ${result.location}
      ${result.changeType}
    `.toLowerCase();

    let matchesQuery = true;

    if (submittedQuery.trim()) {
      if (intent === "construction") {
        matchesQuery =
          text.includes("construction") ||
          text.includes("building") ||
          text.includes("structure");
      } else if (intent === "development") {
        matchesQuery =
          text.includes("development") ||
          text.includes("expansion") ||
          text.includes("construction");
      } else if (intent === "vehicle") {
        // Current mock dataset has no vehicle-specific results.
        matchesQuery = false;
      } else {
        const words = submittedQuery
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 3);

        matchesQuery = words.some((word) => text.includes(word));
      }
    }

    const matchesSensor =
      sensor === "All Sensors" || result.sensor === sensor;

    const matchesResolution =
      resolution === "All Resolutions" ||
      result.resolution === resolution;

    const matchesChange =
      changeType === "All Changes" ||
      result.changeType === changeType;

    return (
      matchesQuery &&
      matchesSensor &&
      matchesResolution &&
      matchesChange
    );
  });
}, [submittedQuery, sensor, resolution, changeType]);
  return (
    <main className="min-h-screen bg-[#061522] text-[#e7f1f8]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-[72px]">
        <div className="p-7">
          {/* Page heading */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6f8da3]">
                Analyst Workspace
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#e7f1f8]">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-[#6f8da3]">
                Discover satellite imagery using natural language or visual
                similarity.
              </p>
            </div>

            <div className="rounded-lg border border-[rgba(125,171,204,0.16)] bg-[#0b2032] px-4 py-2">
              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6f8da3]">
                Active Area
              </div>

              <div className="mt-1 text-xs font-semibold text-[#dcecf5]">
                Narmada Basin
              </div>
            </div>
          </div>

          {/* Dashboard summary */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <DashboardStat label="Searches" value="128" detail="Semantic and visual retrieval" tone="blue" />
            <DashboardStat label="Changes" value="34" detail="Detected across monitored areas" tone="green" />
            <DashboardStat label="Pending" value="8" detail="Require analyst review" tone="amber" />
          </div>

          {/* Recent detections */}
          <section className="mb-6 rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#e7f1f8]">Recent Detections</div>
                <div className="mt-1 text-[10px] text-[#6f8da3]">
                  Latest changes requiring analyst attention
                </div>
              </div>
              <span className="rounded-full bg-[#d8a63b]/10 px-2.5 py-1 text-[9px] font-semibold text-[#e8bd65]">
                8 pending
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["Construction", "Narmada Basin — Sector A", "91%", "Review"],
                ["Road Development", "Narmada Basin — Sector B", "87%", "Confirmed"],
                ["Water Variation", "River Corridor — Sector D", "82%", "Review"],
              ].map(([type, location, confidence, status]) => (
                <div key={location} className="rounded-xl border border-[rgba(125,171,204,0.12)] bg-[#081a29] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-semibold text-[#e7f1f8]">{type}</div>
                      <div className="mt-1 text-[9px] leading-4 text-[#6f8da3]">{location}</div>
                    </div>
                    <span className="text-xs font-bold text-[#8ed5ff]">{confidence}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[8px] uppercase tracking-wider text-[#58788d]">Status</span>
                    <span className={`text-[9px] font-semibold ${
                      status === "Confirmed" ? "text-[#63ddb2]" : "text-[#e8bd65]"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Search workspace */}
          <div className="grid grid-cols-[minmax(0,1fr)_330px] gap-6">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Search panel */}
              <section className="rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_4px_18px_rgba(30,70,110,0.04)]">
                {/* Tabs */}
                <div className="mb-5 flex items-center gap-1 border-b border-[rgba(125,171,204,0.12)]">
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`relative px-4 pb-3 text-xs font-semibold ${
                      activeTab === "text"
                        ? "text-[#8ed5ff]"
                        : "text-[#6f8da3]"
                    }`}
                  >
                    Text to Image

                    {activeTab === "text" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1677aa]" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("image")}
                    className={`relative px-4 pb-3 text-xs font-semibold ${
                      activeTab === "image"
                        ? "text-[#8ed5ff]"
                        : "text-[#6f8da3]"
                    }`}
                  >
                    Image to Image

                    {activeTab === "image" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1677aa]" />
                    )}
                  </button>
                </div>

                {activeTab === "text" ? (
                  <>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#58788d]">
                          ⌕
                        </span>

                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search satellite imagery..."
                          className="h-12 w-full rounded-xl border border-[rgba(125,171,204,0.16)] bg-[#081a29] pl-11 pr-4 text-sm text-[#e7f1f8] outline-none placeholder:text-[#58788d] focus:border-[#55b8f4]/50 focus:bg-[#0b2032]"
                        />
                      </div>

                      <button
                        onClick={() => {
  setSubmittedQuery(query);

  const intent = getSearchIntent(query);

  const results = searchResults.filter((result) => {
    const text = `
      ${result.title}
      ${result.location}
      ${result.changeType}
    `.toLowerCase();

    if (intent === "construction") {
      return (
        text.includes("construction") ||
        text.includes("building") ||
        text.includes("structure")
      );
    }

    if (intent === "development") {
      return (
        text.includes("development") ||
        text.includes("expansion") ||
        text.includes("construction")
      );
    }

    if (intent === "vehicle") {
      return false;
    }

    return true;
  });

  if (results.length > 0) {
    setSelectedResult(results[0]);
  } else {
    setSelectedResult(null);
  }
}}
                        className="h-12 rounded-xl bg-[#1677aa] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(22,119,170,0.22)] transition hover:bg-[#1d8fc8]"
                      >
                        Search
                      </button>
                    </div>

                    {/* Suggested queries */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f8da3]">
                        Try
                      </span>

                      {[
                        "New buildings near river",
                        "Large vehicle concentrations",
                        "Road development",
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
  setQuery(suggestion);
  setSubmittedQuery(suggestion);

  const intent = getSearchIntent(suggestion);

  const results = searchResults.filter((result) => {
    const text = `
      ${result.title}
      ${result.location}
      ${result.changeType}
    `.toLowerCase();

    if (intent === "construction") {
      return (
        text.includes("construction") ||
        text.includes("building") ||
        text.includes("structure")
      );
    }

    if (intent === "development") {
      return (
        text.includes("development") ||
        text.includes("expansion") ||
        text.includes("construction")
      );
    }

    return false;
  });

  if (results.length > 0) {
    setSelectedResult(results[0]);
  }
}}
                          className="rounded-full border border-[rgba(125,171,204,0.16)] bg-[#081a29] px-3 py-1.5 text-[10px] text-[#86a0b4] hover:border-[#55b8f4]/30 hover:text-[#8ed5ff]"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-[rgba(125,171,204,0.24)] bg-[#081a29] p-8 text-center">
                    <div className="text-2xl text-[#6e91b1]">⊞</div>

                    <div className="mt-3 text-sm font-semibold text-[#dcecf5]">
                      Find Similar Images
                    </div>

                    <div className="mt-1 text-xs text-[#6f8da3]">
                      Upload or drag an image to search for visually similar
                      locations.
                    </div>

                    <button className="mt-4 rounded-lg border border-[rgba(125,171,204,0.2)] bg-[#0b2032] px-4 py-2 text-xs font-semibold text-[#8ed5ff]">
                      Browse Image
                    </button>
                  </div>
                )}
              </section>

              {/* Filters */}
              <section className="rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#e7f1f8]">
                      Monitoring Filters
                    </div>

                    <div className="mt-1 text-[10px] text-[#6f8da3]">
                      Refine the imagery returned for the selected area.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSensor("All Sensors");
                      setResolution("All Resolutions");
                      setChangeType("All Changes");
                    }}
                    className="text-[10px] font-semibold text-[#8ed5ff]"
                  >
                    Reset filters
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <Filter
                    label="AOI"
                    value="Narmada Basin"
                    options={["Narmada Basin"]}
                  />

                  <Filter
                    label="Sensor"
                    value={sensor}
                    options={[
                      "All Sensors",
                      "Sentinel-2",
                      "Landsat 9",
                    ]}
                    onChange={setSensor}
                  />

                  <Filter
                    label="Resolution"
                    value={resolution}
                    options={[
                      "All Resolutions",
                      "10 m",
                      "30 m",
                    ]}
                    onChange={setResolution}
                  />

                  <Filter
                    label="Change Type"
                    value={changeType}
                    options={[
                      "All Changes",
                      "Construction",
                      "Expansion",
                    ]}
                    onChange={setChangeType}
                  />
                </div>
              </section>

              {/* Map */}
              <section className="overflow-hidden rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032]">
                <div className="flex h-14 items-center justify-between border-b border-[rgba(125,171,204,0.16)] px-5">
                  <div>
                    <div className="text-xs font-semibold text-[#e7f1f8]">
                      Spatial Results
                    </div>

                    <div className="mt-0.5 text-[10px] text-[#6f8da3]">
                      Search results and detected areas
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[9px] text-[#6f8da3]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#1677aa]" />
                      Search Result
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm border border-[#1677e8] bg-[#1677aa]/20" />
                      AOI
                    </span>
                  </div>
                </div>

                <div className="relative h-[560px] overflow-hidden bg-[#102b3c]">
                  {/* Real satellite imagery */}
                  <img
                    src="/satellite/base-map.png"
                    alt="Satellite imagery of the analysis area"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Subtle map overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-[#061522]/[0.08]" />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#061522]/10 via-transparent to-[#061522]/25" />

                  {/* AOI boundary */}
                  <div className="absolute left-[27%] top-[20%] h-[48%] w-[42%] rounded-sm border-2 border-[#1677e8] bg-[#1677aa]/10">
                    <div className="absolute -top-6 left-0 rounded bg-[#1677aa] px-2 py-1 text-[9px] font-semibold text-white shadow-sm">
                      AOI · Narmada Basin
                    </div>
                  </div>

                  {/* Search markers */}
                  {filteredResults.map((result, index) => (
                    <MapMarker
                      key={result.id}
                      result={result}
                      index={index}
                      selected={selectedResult?.id === result.id}
                      onClick={() => setSelectedResult(result)}
                    />
                  ))}

                  {/* Selected result */}
                  {selectedResult && (
                    <div className="absolute bottom-5 left-5 w-[290px] rounded-xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032]/95 p-4 shadow-xl backdrop-blur-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6f8da3]">
                            Selected Detection
                          </div>

                          <div className="mt-1.5 text-sm font-semibold text-[#e7f1f8]">
                            {selectedResult.location}
                          </div>
                        </div>

                        <div className="rounded-md bg-[#55b8f4]/10 px-2 py-1 text-[10px] font-bold text-[#8ed5ff]">
                          {selectedResult.confidence}%
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Info
                          label="Change"
                          value={selectedResult.changeType}
                        />

                        <Info
                          label="Sensor"
                          value={selectedResult.sensor}
                        />

                        <Info
                          label="Date"
                          value={selectedResult.date}
                        />

                        <Info
                          label="Resolution"
                          value={selectedResult.resolution}
                        />
                      </div>

                      <button className="mt-3 w-full rounded-lg bg-[#1677aa] py-2 text-[10px] font-semibold text-white hover:bg-[#1d8fc8]">
                        View Images
                      </button>
                    </div>
                  )}

                  {/* Map controls */}
                  <div className="absolute right-4 top-4 overflow-hidden rounded-lg border border-[rgba(125,171,204,0.16)] bg-[#0b2032] shadow-md">
                    <button className="flex h-9 w-9 items-center justify-center border-b border-[rgba(125,171,204,0.12)] text-sm text-[#86a0b4] hover:bg-[#102b3c]">
                      +
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center text-sm text-[#86a0b4] hover:bg-[#102b3c]">
                      −
                    </button>
                  </div>

                  {/* North indicator */}
                  <div className="absolute right-5 top-[105px] flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(125,171,204,0.16)] bg-[#0b2032] text-xs font-bold text-[#dcecf5] shadow-md">
                    N
                  </div>

                  {/* Attribution */}
                  <div className="absolute bottom-1 right-2 max-w-[520px] rounded bg-[#0b2032]/80 px-2 py-1 text-[7px] leading-3 text-[#4f6274]">
                    Sources: Esri, DigitalGlobe, GeoEye, i-cubed, USDA FSA,
                    USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and
                    the GIS User Community
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT — Results */}
            <aside className="rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032]">
              <div className="border-b border-[rgba(125,171,204,0.16)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#e7f1f8]">
                      Active Detections
                    </div>

                    <div className="mt-1 text-[10px] text-[#6f8da3]">
                      {filteredResults.length} matching locations
                    </div>
                  </div>

                  <div className="rounded-md bg-[#55b8f4]/10 px-2 py-1 text-[10px] font-bold text-[#8ed5ff]">
                    Semantic
                  </div>
                </div>
              </div>

              <div className="max-h-[820px] overflow-y-auto p-3">
                {filteredResults.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-sm font-semibold text-[#bcd3e1]">
                      No results found
                    </div>

                    <div className="mt-1 text-[10px] text-[#58788d]">
                      Try changing your search or filters.
                    </div>
                  </div>
                ) : (
                  filteredResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => setSelectedResult(result)}
                      className={`mb-3 w-full rounded-xl border p-4 text-left transition duration-200 ${
                        selectedResult?.id === result.id
                          ? "border-[#55b8f4]/45 bg-[#0c2639] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                          : "border-[rgba(125,171,204,0.13)] bg-[#081a29] hover:border-[#55b8f4]/30 hover:bg-[#0c2234]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-[#e7f1f8]">
                            {result.title}
                          </div>

                          <div className="mt-1 text-[10px] text-[#6f8da3]">
                            {result.location}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-sm font-bold text-[#8ed5ff]">
                            {result.relevance}%
                          </div>

                          <div className="text-[8px] uppercase tracking-wider text-[#58788d]">
                            relevance
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-y-3 border-t border-[rgba(125,171,204,0.12)] pt-3">
                        <ResultInfo
                          label="Date"
                          value={result.date}
                        />

                        <ResultInfo
                          label="Sensor"
                          value={result.sensor}
                        />

                        <ResultInfo
                          label="Resolution"
                          value={result.resolution}
                        />

                        <ResultInfo
                          label="Change"
                          value={result.changeType}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="rounded-full bg-[#39c99a]/10 px-2 py-1 text-[9px] font-semibold text-[#63ddb2]">
                          {result.confidence}% confidence
                        </span>

                        <span className="text-[10px] font-semibold text-[#8ed5ff]">
                          Inspect →
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ----------------------------- */
/* Filter component               */
/* ----------------------------- */

function DashboardStat({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "green" | "amber";
}) {
  const toneClass = {
    blue: "bg-[#55b8f4]/10 text-[#8ed5ff]",
    green: "bg-[#39c99a]/10 text-[#63ddb2]",
    amber: "bg-[#d8a63b]/10 text-[#e8bd65]",
  }[tone];

  return (
    <section className="rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6f8da3]">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-[#e7f1f8]">{value}</div>
        </div>
        <span className={`rounded-lg px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-wider ${toneClass}`}>
          Active
        </span>
      </div>
      <div className="mt-3 text-[10px] text-[#6f8da3]">{detail}</div>
    </section>
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
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#6f8da3]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full rounded-lg border border-[rgba(125,171,204,0.16)] bg-[#081a29] px-3 text-xs text-[#bcd3e1] outline-none focus:border-[#55b8f4]/50"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

/* ----------------------------- */
/* Map marker                     */
/* ----------------------------- */

function MapMarker({
  result,
  index,
  selected,
  onClick,
}: {
  result: SearchResult;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const positions = [
    { left: "47%", top: "45%" },
    { left: "61%", top: "34%" },
    { left: "72%", top: "58%" },
    { left: "36%", top: "63%" },
  ];

  const position = positions[index % positions.length];

  return (
    <button
      onClick={onClick}
      className="absolute z-10"
      style={{
        left: position.left,
        top: position.top,
      }}
      title={result.location}
    >
      <span
        className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg ${
          selected
            ? "marker-pulse bg-[#1677aa] shadow-[0_0_18px_rgba(85,184,244,0.45)]"
            : "bg-[#1677aa]"
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#0b2032]" />
      </span>

      {selected && (
        <span className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#071a29] px-2 py-1 text-[8px] font-semibold text-white shadow-md">
          {result.changeType}
        </span>
      )}
    </button>
  );
}

/* ----------------------------- */
/* Small information blocks       */
/* ----------------------------- */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-[#0c2234] p-2.5">
      <div className="text-[8px] uppercase tracking-wider text-[#58788d]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-semibold text-[#bcd3e1]">
        {value}
      </div>
    </div>
  );
}

function ResultInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[8px] uppercase tracking-wider text-[#58788d]">
        {label}
      </div>

      <div className="mt-0.5 text-[10px] font-medium text-[#bcd3e1]">
        {value}
      </div>
    </div>
  );
}
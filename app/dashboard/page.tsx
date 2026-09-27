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
    <main className="min-h-screen bg-[#f4f8fc] text-[#16324f]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-20">
        <div className="p-7">
          {/* Page heading */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#71869b]">
                Analyst Workspace
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
                Semantic Search
              </h1>

              <p className="mt-1 text-sm text-[#71869b]">
                Discover satellite imagery using natural language or visual
                similarity.
              </p>
            </div>

            <div className="rounded-lg border border-[#dce6f0] bg-white px-4 py-2">
              <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#71869b]">
                Active Area
              </div>

              <div className="mt-1 text-xs font-semibold text-[#163b67]">
                Narmada Basin
              </div>
            </div>
          </div>

          {/* Search workspace */}
          <div className="grid grid-cols-[minmax(0,1fr)_330px] gap-6">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Search panel */}
              <section className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-[0_4px_18px_rgba(30,70,110,0.04)]">
                {/* Tabs */}
                <div className="mb-5 flex items-center gap-1 border-b border-[#edf2f7]">
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`relative px-4 pb-3 text-xs font-semibold ${
                      activeTab === "text"
                        ? "text-[#1677e8]"
                        : "text-[#71869b]"
                    }`}
                  >
                    Text to Image

                    {activeTab === "text" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1677e8]" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("image")}
                    className={`relative px-4 pb-3 text-xs font-semibold ${
                      activeTab === "image"
                        ? "text-[#1677e8]"
                        : "text-[#71869b]"
                    }`}
                  >
                    Image to Image

                    {activeTab === "image" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1677e8]" />
                    )}
                  </button>
                </div>

                {activeTab === "text" ? (
                  <>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#8ba0b5]">
                          ⌕
                        </span>

                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search satellite imagery..."
                          className="h-12 w-full rounded-xl border border-[#dce6f0] bg-[#f9fbfd] pl-11 pr-4 text-sm text-[#16324f] outline-none placeholder:text-[#9aabba] focus:border-[#8ab9e8] focus:bg-white"
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
                        className="h-12 rounded-xl bg-[#1677e8] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#1268cf]"
                      >
                        Search
                      </button>
                    </div>

                    {/* Suggested queries */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#91a2b2]">
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
                          className="rounded-full border border-[#dce6f0] bg-[#f8fbff] px-3 py-1.5 text-[10px] text-[#55738f] hover:border-[#a9c8e7] hover:text-[#1677e8]"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#b9cddd] bg-[#f8fbff] p-8 text-center">
                    <div className="text-2xl text-[#6e91b1]">⊞</div>

                    <div className="mt-3 text-sm font-semibold text-[#163b67]">
                      Find Similar Images
                    </div>

                    <div className="mt-1 text-xs text-[#71869b]">
                      Upload or drag an image to search for visually similar
                      locations.
                    </div>

                    <button className="mt-4 rounded-lg border border-[#c9d9e8] bg-white px-4 py-2 text-xs font-semibold text-[#1677e8]">
                      Browse Image
                    </button>
                  </div>
                )}
              </section>

              {/* Filters */}
              <section className="rounded-2xl border border-[#dce6f0] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#16324f]">
                      Search Filters
                    </div>

                    <div className="mt-1 text-[10px] text-[#71869b]">
                      Refine the imagery returned for the selected area.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSensor("All Sensors");
                      setResolution("All Resolutions");
                      setChangeType("All Changes");
                    }}
                    className="text-[10px] font-semibold text-[#1677e8]"
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
              <section className="overflow-hidden rounded-2xl border border-[#dce6f0] bg-white">
                <div className="flex h-14 items-center justify-between border-b border-[#dce6f0] px-5">
                  <div>
                    <div className="text-xs font-semibold text-[#16324f]">
                      Spatial Results
                    </div>

                    <div className="mt-0.5 text-[10px] text-[#71869b]">
                      Search results and detected areas
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[9px] text-[#71869b]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#1677e8]" />
                      Search Result
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm border border-[#1677e8] bg-[#1677e8]/20" />
                      AOI
                    </span>
                  </div>
                </div>

                <div className="relative h-[560px] overflow-hidden bg-[#dfe8ef]">
                  {/* Real satellite imagery */}
                  <img
                    src="/satellite/base-map.png"
                    alt="Satellite imagery of the analysis area"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Subtle map overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-[#0b2d52]/[0.04]" />

                  {/* AOI boundary */}
                  <div className="absolute left-[27%] top-[20%] h-[48%] w-[42%] rounded-sm border-2 border-[#1677e8] bg-[#1677e8]/10">
                    <div className="absolute -top-6 left-0 rounded bg-[#1677e8] px-2 py-1 text-[9px] font-semibold text-white shadow-sm">
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
                    <div className="absolute bottom-5 left-5 w-[290px] rounded-xl border border-[#dce6f0] bg-white/95 p-4 shadow-xl backdrop-blur-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#71869b]">
                            Selected Detection
                          </div>

                          <div className="mt-1.5 text-sm font-semibold text-[#16324f]">
                            {selectedResult.location}
                          </div>
                        </div>

                        <div className="rounded-md bg-[#eaf3ff] px-2 py-1 text-[10px] font-bold text-[#1677e8]">
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

                      <button className="mt-3 w-full rounded-lg bg-[#1677e8] py-2 text-[10px] font-semibold text-white hover:bg-[#1268cf]">
                        View Images
                      </button>
                    </div>
                  )}

                  {/* Map controls */}
                  <div className="absolute right-4 top-4 overflow-hidden rounded-lg border border-[#dce6f0] bg-white shadow-md">
                    <button className="flex h-9 w-9 items-center justify-center border-b border-[#edf2f7] text-sm text-[#55738f] hover:bg-[#f5f9fd]">
                      +
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center text-sm text-[#55738f] hover:bg-[#f5f9fd]">
                      −
                    </button>
                  </div>

                  {/* North indicator */}
                  <div className="absolute right-5 top-[105px] flex h-9 w-9 items-center justify-center rounded-full border border-[#dce6f0] bg-white text-xs font-bold text-[#163b67] shadow-md">
                    N
                  </div>

                  {/* Attribution */}
                  <div className="absolute bottom-1 right-2 max-w-[520px] rounded bg-white/80 px-2 py-1 text-[7px] leading-3 text-[#4f6274]">
                    Sources: Esri, DigitalGlobe, GeoEye, i-cubed, USDA FSA,
                    USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and
                    the GIS User Community
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT — Results */}
            <aside className="rounded-2xl border border-[#dce6f0] bg-white">
              <div className="border-b border-[#dce6f0] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#16324f]">
                      Search Results
                    </div>

                    <div className="mt-1 text-[10px] text-[#71869b]">
                      {filteredResults.length} matching locations
                    </div>
                  </div>

                  <div className="rounded-md bg-[#eaf3ff] px-2 py-1 text-[10px] font-bold text-[#1677e8]">
                    Semantic
                  </div>
                </div>
              </div>

              <div className="max-h-[820px] overflow-y-auto p-3">
                {filteredResults.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-sm font-semibold text-[#496784]">
                      No results found
                    </div>

                    <div className="mt-1 text-[10px] text-[#8a9bac]">
                      Try changing your search or filters.
                    </div>
                  </div>
                ) : (
                  filteredResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => setSelectedResult(result)}
                      className={`mb-3 w-full rounded-xl border p-4 text-left ${
                        selectedResult?.id === result.id
                          ? "border-[#8ab9e8] bg-[#f4f9ff]"
                          : "border-[#e5edf4] bg-white hover:border-[#bfd5e8] hover:bg-[#fbfdff]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-[#16324f]">
                            {result.title}
                          </div>

                          <div className="mt-1 text-[10px] text-[#71869b]">
                            {result.location}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-sm font-bold text-[#1677e8]">
                            {result.relevance}%
                          </div>

                          <div className="text-[8px] uppercase tracking-wider text-[#8a9bac]">
                            relevance
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-y-3 border-t border-[#edf2f7] pt-3">
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
                        <span className="rounded-full bg-[#edf8f4] px-2 py-1 text-[9px] font-semibold text-[#15906b]">
                          {result.confidence}% confidence
                        </span>

                        <span className="text-[10px] font-semibold text-[#1677e8]">
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
      <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#71869b]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full rounded-lg border border-[#dce6f0] bg-[#f9fbfd] px-3 text-xs text-[#496784] outline-none focus:border-[#8ab9e8]"
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
            ? "marker-pulse bg-[#1677e8]"
            : "bg-[#1976d2]"
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </span>

      {selected && (
        <span className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#163b67] px-2 py-1 text-[8px] font-semibold text-white shadow-md">
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
    <div className="rounded-lg bg-[#f7fafd] p-2.5">
      <div className="text-[8px] uppercase tracking-wider text-[#8a9bac]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-semibold text-[#496784]">
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
      <div className="text-[8px] uppercase tracking-wider text-[#9aabba]">
        {label}
      </div>

      <div className="mt-0.5 text-[10px] font-medium text-[#496784]">
        {value}
      </div>
    </div>
  );
}
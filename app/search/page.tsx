"use client";

import { useState } from "react";
import { searchResults } from "@/data/searchResults";

export default function SearchPage() {
  const [query, setQuery] = useState("New construction near river");
  const [searched, setSearched] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSearch = () => {
    setSearched(false);

    setTimeout(() => {
      setSearched(true);
    }, 350);
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-7">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#66d9c4]">
          Semantic Retrieval
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Search Satellite Imagery
        </h1>

        <p className="mt-2 text-sm text-[#7f909d]">
          Describe what you are looking for using natural language.
        </p>
      </div>

      {/* Search */}
      <section className="rounded-xl border border-[#1d2a34] bg-[#0d141b] p-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52616c]">
              ⌕
            </span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search satellite imagery..."
              className="w-full rounded-lg border border-[#26343e] bg-[#080d12] py-3 pl-11 pr-4 text-sm text-[#d7e1e5] outline-none placeholder:text-[#52616c] focus:border-[#66d9c4]"
            />
          </div>

          <button
            onClick={handleSearch}
            className="rounded-lg bg-[#66d9c4] px-6 text-xs font-semibold text-[#07100f] hover:opacity-90"
          >
            Search
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-[#52616c]">
            Try:
          </span>

          {[
            "New buildings near river",
            "Large vehicle concentrations",
            "Road development",
          ].map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="rounded-md border border-[#26343e] px-3 py-1.5 text-[10px] text-[#7f909d] hover:border-[#66d9c4]/50 hover:text-[#66d9c4]"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <div className="mt-7 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">
            Search Results
          </div>

          <div className="mt-1 text-[10px] text-[#52616c]">
            {searchResults.length} matching locations
          </div>
        </div>

        <div className="text-[10px] uppercase tracking-wider text-[#52616c]">
          Ranked by semantic relevance
        </div>
      </div>

      <div
        className={`mt-4 grid grid-cols-2 gap-4 transition-opacity duration-300 ${
          searched ? "opacity-100" : "opacity-40"
        }`}
      >
        {searchResults.map((result) => {
          const selected = selectedId === result.id;

          return (
            <button
              key={result.id}
              onClick={() => setSelectedId(result.id)}
              className={`group text-left rounded-xl border bg-[#0d141b] p-4 ${
                selected
                  ? "border-[#66d9c4]/70"
                  : "border-[#1d2a34] hover:border-[#344650]"
              }`}
            >
              {/* Image area */}
              <div className="relative mb-4 h-44 overflow-hidden rounded-lg border border-[#1d2a34] bg-[#111b20]">
                <SatellitePreview />

                <div className="absolute right-3 top-3 rounded-md border border-[#263640] bg-[#080d12]/85 px-2 py-1 text-[10px] text-[#66d9c4]">
                  {result.relevance}% match
                </div>

                <div className="absolute bottom-3 left-3 rounded-md border border-[#263640] bg-[#080d12]/85 px-2 py-1 text-[9px] text-[#7f909d]">
                  {result.sensor}
                </div>
              </div>

              {/* Details */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#d7e1e5]">
                    {result.title}
                  </h3>

                  <p className="mt-1 text-[10px] text-[#7f909d]">
                    {result.location}
                  </p>
                </div>

                <span className="shrink-0 rounded border border-[#263640] px-2 py-1 text-[9px] text-[#66d9c4]">
                  {result.changeType}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#1d2a34] pt-3">
                <Meta label="Date" value={result.date} />
                <Meta label="Resolution" value={result.resolution} />
                <Meta label="Confidence" value={`${result.confidence}%`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected result */}
      {selectedId && (
        <SelectedResult
          result={searchResults.find((item) => item.id === selectedId)!}
        />
      )}
    </div>
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
    <div>
      <div className="text-[8px] uppercase tracking-wider text-[#52616c]">
        {label}
      </div>
      <div className="mt-1 text-[10px] text-[#d7e1e5]">
        {value}
      </div>
    </div>
  );
}

function SelectedResult({
  result,
}: {
  result: (typeof searchResults)[number];
}) {
  return (
    <section className="mt-6 rounded-xl border border-[#66d9c4]/30 bg-[#0d141b] p-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-[#66d9c4]">
            Active Investigation
          </div>

          <h2 className="mt-1 text-sm font-medium">
            {result.location}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold text-[#66d9c4]">
            {result.relevance}%
          </div>
          <div className="text-[9px] uppercase tracking-wider text-[#52616c]">
            Relevance
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        <Meta label="Coordinates" value={`${result.coordinates[0]}° N`} />
        <Meta label="Longitude" value={`${result.coordinates[1]}° E`} />
        <Meta label="Sensor" value={result.sensor} />
        <Meta label="Detected Type" value={result.changeType} />
      </div>
    </section>
  );
}

function SatellitePreview() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[#17251f]" />

      {/* Terrain */}
      <div className="absolute -left-10 top-10 h-40 w-72 rotate-12 rounded-[50%] bg-[#24362b]" />
      <div className="absolute right-[-30px] top-[-20px] h-52 w-44 -rotate-12 rounded-[45%] bg-[#1d3028]" />

      {/* River */}
      <div className="absolute -right-8 top-[-30px] h-[130%] w-14 rotate-[25deg] rounded-[50%] bg-[#182f32]" />

      {/* Roads */}
      <div className="absolute left-[-10%] top-[58%] h-[2px] w-[120%] rotate-[12deg] bg-[#667064]/50" />
      <div className="absolute left-[25%] top-[-10%] h-[120%] w-[2px] rotate-[35deg] bg-[#6b7468]/40" />

      {/* Construction cluster */}
      <div className="absolute left-[43%] top-[40%] grid grid-cols-4 gap-1 opacity-80">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 bg-[#9a9b82]"
          />
        ))}
      </div>

      {/* Detection marker */}
      <div className="detection-pulse absolute left-[52%] top-[48%] h-3 w-3 rounded-full border border-[#66d9c4] bg-[#66d9c4]/30" />

      {/* Scan line */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-[#66d9c4]/20" />
    </div>
  );
}
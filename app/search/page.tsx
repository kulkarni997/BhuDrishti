"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchResults } from "@/data/searchResults";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { saveInvestigation } from "@/lib/investigation";

export default function SearchPage() {
  const router = useRouter();

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
    <main className="min-h-screen bg-[#f4f8fc] text-[#16324f]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-20">
        <div className="p-7 animate-fade-up">
          {/* Header */}
          <div className="mb-7">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1677e8]">
              Semantic Retrieval
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
              Search Satellite Imagery
            </h1>

            <p className="mt-2 text-sm text-[#71869b]">
              Describe what you are looking for using natural language.
            </p>
          </div>

          {/* Search */}
          <section className="rounded-2xl border border-[#dce6f0] bg-white p-5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71869b]">
                  ⌕
                </span>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Search satellite imagery..."
                  className="w-full rounded-lg border border-[#dce6f0] bg-[#f9fbfd] py-3 pl-11 pr-4 text-sm text-[#16324f] outline-none placeholder:text-[#9aabba] focus:border-[#1677e8]"
                />
              </div>

              <button
                onClick={handleSearch}
                className="rounded-lg bg-[#1677e8] px-7 text-xs font-semibold text-white hover:bg-[#1268cf]"
              >
                Search
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#9aabba]">
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
                  className="rounded-md border border-[#dce6f0] bg-white px-3 py-1.5 text-[10px] text-[#71869b] hover:border-[#9fc4ed] hover:bg-[#f7fbff] hover:text-[#1677e8]"
                >
                  {example}
                </button>
              ))}
            </div>
          </section>

          {/* Results Header */}
          <div className="mt-7 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#16324f]">
                Search Results
              </div>

              <div className="mt-1 text-[10px] text-[#71869b]">
                {searchResults.length} matching locations
              </div>
            </div>

            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#71869b]">
              Ranked by semantic relevance
            </div>
          </div>

          {/* Results */}
          <div
            className={`mt-4 grid grid-cols-2 gap-5 transition-opacity duration-300 ${
              searched ? "opacity-100" : "opacity-40"
            }`}
          >
            {searchResults.map((result) => {
              const selected = selectedId === result.id;

              return (
                <button
                  key={result.id}
                  onClick={() => {
  setSelectedId(result.id);

  saveInvestigation({
    siteId: result.id,
    location: result.location,
    changeType: result.changeType,
    confidence: result.confidence,
  });
}}
                  className={`group rounded-2xl border bg-white p-4 text-left shadow-sm transition-all ${
                    selected
                      ? "border-[#1677e8] shadow-md"
                      : "border-[#dce6f0] hover:-translate-y-0.5 hover:border-[#b8cee3] hover:shadow-md"
                  }`}
                >
                  {/* Image */}
                  <div className="relative mb-4 h-52 overflow-hidden rounded-xl border border-[#dce6f0] bg-[#e9eff4]">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Relevance */}
                    <div className="absolute right-3 top-3 rounded-md border border-white/40 bg-[#16324f]/90 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                      {result.relevance}% match
                    </div>

                    {/* Sensor */}
                    <div className="absolute bottom-3 left-3 rounded-md border border-white/30 bg-[#16324f]/90 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur">
                      {result.sensor}
                    </div>
                  </div>

                  {/* Title + Type */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#16324f]">
                        {result.title}
                      </h3>

                      <p className="mt-1 text-[10px] text-[#71869b]">
                        {result.location}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-md border border-[#cfe0f0] bg-[#f7fbff] px-2 py-1 text-[9px] font-semibold text-[#1677e8]">
                      {result.changeType}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#e3eaf1] pt-3">
                    <Meta label="Date" value={result.date} />
                    <Meta label="Resolution" value={result.resolution} />
                    <Meta
                      label="Confidence"
                      value={`${result.confidence}%`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Result */}
          {selectedId && (
            <SelectedResult
              result={searchResults.find(
                (item) => item.id === selectedId
              )!}
            />
          )}
        </div>
      </section>
    </main>
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
      <div className="text-[8px] font-semibold uppercase tracking-wider text-[#8a9bac]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-medium text-[#496784]">
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
  const router = useRouter();

  return (
    <section className="mt-6 rounded-2xl border border-[#cfe0f0] bg-white p-5 shadow-sm animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1677e8]">
            Active Investigation
          </div>

          <h2 className="mt-1 text-sm font-semibold text-[#16324f]">
            {result.location}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold text-[#1677e8]">
            {result.relevance}%
          </div>

          <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
            Relevance
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        <Meta
          label="Latitude"
          value={`${result.coordinates[0]}° N`}
        />

        <Meta
          label="Longitude"
          value={`${result.coordinates[1]}° E`}
        />

        <Meta
          label="Sensor"
          value={result.sensor}
        />

        <Meta
          label="Detected Type"
          value={result.changeType}
        />
      </div>

      <div className="mt-5 flex justify-end border-t border-[#e3eaf1] pt-4">
        <button
          onClick={() => router.push("/change-detection")}
          className="rounded-lg bg-[#1677e8] px-5 py-2.5 text-[10px] font-semibold text-white hover:bg-[#1268cf]"
        >
          Open Investigation →
        </button>
      </div>
    </section>
  );
}
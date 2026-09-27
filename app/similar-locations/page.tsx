"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { similarLocations } from "@/data/similarLocations";
import {
  getInvestigation,
  type InvestigationState,
} from "@/lib/investigation";

export default function SimilarLocationsPage() {
  const router = useRouter();

  const [investigation, setInvestigation] =
    useState<InvestigationState | null>(null);

  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setInvestigation(getInvestigation());
  }, []);

  const handleFindSimilar = () => {
    setSearching(true);
    setSearched(false);

    setTimeout(() => {
      setSearching(false);
      setSearched(true);
    }, 700);
  };

  const location =
    investigation?.location || "Narmada Basin — Sector A";

  const changeType =
    investigation?.changeType || "Construction";

  const confidence =
    investigation?.confidence || 91;

  const selectedLocation = similarLocations.find(
    (item) => item.id === selectedId
  );

  return (
    <main className="min-h-screen bg-[#061522] text-[#e7f1f8]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-[72px]">
        <div className="p-7 animate-fade-up">

          {/* Header */}
          <div className="mb-7">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ed5ff]">
              Pattern Discovery
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#e7f1f8]">
              Similar Location Discovery
            </h1>

            <p className="mt-2 text-sm text-[#6f8da3]">
              Find locations with similar visual and contextual characteristics.
            </p>
          </div>

          {/* Active Investigation */}
          <section className="rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">

            <div className="flex items-start justify-between">

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8ed5ff]">
                  Active Investigation
                </div>

                <h2 className="mt-1 text-sm font-semibold text-[#e7f1f8]">
                  {location}
                </h2>

                <div className="mt-1 text-[10px] text-[#6f8da3]">
                  {changeType} detection · {confidence}% confidence
                </div>
              </div>

              <button
                onClick={handleFindSimilar}
                disabled={searching}
                className="rounded-lg bg-[#1677aa] px-5 py-2.5 text-[10px] font-semibold text-white hover:bg-[#1d8fc8]"
              >
                {searching
                  ? "Finding Similar Locations..."
                  : "Find Similar Locations"}
              </button>

            </div>

            <div className="mt-5 grid grid-cols-4 gap-3 border-t border-[rgba(125,171,204,0.12)] pt-4">

              <Meta
                label="Location"
                value={location}
              />

              <Meta
                label="Type"
                value={changeType}
              />

              <Meta
                label="Confidence"
                value={`${confidence}%`}
              />

              <Meta
                label="Results"
                value={`${similarLocations.length} locations`}
              />

            </div>
          </section>

          {/* Results */}
          <div className="mt-7 flex items-center justify-between">

            <div>
              <div className="text-sm font-semibold text-[#e7f1f8]">
                Similar Locations
              </div>

              <div className="mt-1 text-[10px] text-[#6f8da3]">
                Ranked by similarity to the active investigation.
              </div>
            </div>

            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6f8da3]">
              {searched ? "Analysis complete" : "Searching"}
            </div>

          </div>

          <div
            className={`mt-4 grid grid-cols-2 gap-5 transition-opacity duration-300 ${
              searched ? "opacity-100" : "opacity-40"
            }`}
          >
            {similarLocations.map((result) => {
              const selected = selectedId === result.id;

              return (
                <button
                  key={result.id}
                  onClick={() => setSelectedId(result.id)}
                  className={`group rounded-2xl border bg-[#0b2032] p-4 text-left shadow-sm transition-all ${
                    selected
                      ? "border-[#1677e8] shadow-md"
                      : "border-[rgba(125,171,204,0.16)] hover:-translate-y-0.5 hover:border-[#55b8f4]/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
                  }`}
                >

                  {/* Image */}
                  <div className="relative mb-4 h-52 overflow-hidden rounded-xl border border-[rgba(125,171,204,0.16)] bg-[#071a29] shadow-inner">

                    <img
                      src="/satellite/results/site-001.png"
                      alt={result.location}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    <div className="absolute right-3 top-3 rounded-md border border-white/20 bg-[#061522]/90 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                      {result.similarity}% similar
                    </div>

                    <div className="absolute bottom-3 left-3 rounded-md border border-white/15 bg-[#061522]/90 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur">
                      {result.sensor}
                    </div>

                  </div>

                  {/* Details */}
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3 className="text-sm font-semibold text-[#e7f1f8]">
                        {result.location}
                      </h3>

                      <p className="mt-1 text-[10px] text-[#6f8da3]">
                        Coordinates: {result.coordinates[0]}° N,{" "}
                        {result.coordinates[1]}° E
                      </p>
                    </div>

                    <span className="shrink-0 rounded-md border border-[rgba(57,201,154,0.25)] bg-[#39c99a]/10 px-2 py-1 text-[9px] font-semibold text-[#39c99a]">
                      Similar
                    </span>

                  </div>

                  {/* Metadata */}
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[rgba(125,171,204,0.12)] pt-3">

                    <Meta
                      label="Observation Date"
                      value={result.date}
                    />

                    <Meta
                      label="Similarity"
                      value={`${result.similarity}%`}
                    />

                  </div>

                </button>
              );
            })}
          </div>

          {/* Selected Location */}
          {selectedLocation && (
            <section className="mt-6 rounded-2xl border border-[rgba(125,171,204,0.22)] bg-[#0b2032] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.16)] animate-fade-up">

              <div className="flex items-center justify-between">

                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8ed5ff]">
                    Selected Similar Location
                  </div>

                  <h2 className="mt-1 text-sm font-semibold text-[#e7f1f8]">
                    {selectedLocation.location}
                  </h2>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-[#39c99a]">
                    {selectedLocation.similarity}%
                  </div>

                  <div className="text-[9px] font-semibold uppercase tracking-wider text-[#58788d]">
                    Similarity
                  </div>
                </div>

              </div>

              <div className="mt-5 grid grid-cols-4 gap-3">

                <Meta
                  label="Latitude"
                  value={`${selectedLocation.coordinates[0]}° N`}
                />

                <Meta
                  label="Longitude"
                  value={`${selectedLocation.coordinates[1]}° E`}
                />

                <Meta
                  label="Sensor"
                  value={selectedLocation.sensor}
                />

                <Meta
                  label="Date"
                  value={selectedLocation.date}
                />

              </div>

              <div className="mt-5 flex justify-end border-t border-[rgba(125,171,204,0.12)] pt-4">

                <button
                  onClick={() => router.push("/map")}
                  className="rounded-lg bg-[#1677aa] px-5 py-2.5 text-[10px] font-semibold text-white hover:bg-[#1d8fc8]"
                >
                  View on Map →
                </button>

              </div>

            </section>
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
      <div className="text-[8px] font-semibold uppercase tracking-wider text-[#58788d]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-medium text-[#bcd3e1]">
        {value}
      </div>
    </div>
  );
}
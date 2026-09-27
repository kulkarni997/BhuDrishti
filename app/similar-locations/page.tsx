"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { similarLocations } from "@/data/similarLocations";

export default function SimilarLocationsPage() {
  const router = useRouter();
  const [searched, setSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleFindSimilar = () => {
    setSearched(false);

    setTimeout(() => {
      setSearched(true);
    }, 500);
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
              Location Discovery
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
              Similar Location Discovery
            </h1>

            <p className="mt-2 text-sm text-[#71869b]">
              Discover locations with visual and contextual characteristics
              similar to the selected investigation.
            </p>
          </div>

          {/* Selected Investigation */}
          <section className="rounded-2xl border border-[#dce6f0] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1677e8]">
                  Active Investigation
                </div>

                <h2 className="mt-2 text-sm font-semibold text-[#16324f]">
                  Narmada Basin — Sector A
                </h2>

                <p className="mt-1 text-[10px] text-[#71869b]">
                  New construction near river · Construction detected
                </p>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold text-[#1677e8]">
                  91%
                </div>

                <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
                  Detection Confidence
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3 border-t border-[#e3eaf1] pt-4">
              <Meta label="Latitude" value="22.72° N" />
              <Meta label="Longitude" value="73.12° E" />
              <Meta label="Sensor" value="Sentinel-2" />
              <Meta label="Change Type" value="Construction" />
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={handleFindSimilar}
                className="rounded-lg bg-[#1677e8] px-5 py-2.5 text-[10px] font-semibold text-white hover:bg-[#1268cf]"
              >
                Find Similar Locations
              </button>
            </div>
          </section>

          {/* Results */}
          {searched && (
            <section className="mt-7 animate-fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#16324f]">
                    Similar Locations
                  </div>

                  <div className="mt-1 text-[10px] text-[#71869b]">
                    Locations ranked by visual similarity
                  </div>
                </div>

                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#71869b]">
                  {similarLocations.length} locations found
                </div>
              </div>

              <div
                className={`mt-4 grid grid-cols-2 gap-5 transition-opacity duration-300 ${
                  searched ? "opacity-100" : "opacity-40"
                }`}
              >
                {similarLocations.map((location) => {
                  const selected = selectedId === location.id;

                  return (
                    <button
                      key={location.id}
                      onClick={() => setSelectedId(location.id)}
                      className={`group rounded-2xl border bg-white p-4 text-left shadow-sm transition-all ${
                        selected
                          ? "border-[#1677e8] shadow-md"
                          : "border-[#dce6f0] hover:-translate-y-0.5 hover:border-[#b8cee3] hover:shadow-md"
                      }`}
                    >
                      {/* Location Preview */}
                      <div className="relative mb-4 h-44 overflow-hidden rounded-xl border border-[#dce6f0] bg-[#e9eff4]">
                        <div className="absolute inset-0 bg-[url('/satellite/results/site-001.png')] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]" />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#16324f]/45 to-transparent" />

                        <div className="absolute right-3 top-3 rounded-md border border-white/40 bg-[#16324f]/90 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                          {location.similarity}% similar
                        </div>

                        <div className="absolute bottom-3 left-3 rounded-md border border-white/30 bg-[#16324f]/90 px-2 py-1 text-[9px] font-medium text-white backdrop-blur">
                          {location.sensor}
                        </div>
                      </div>

                      {/* Location Details */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-[#16324f]">
                            {location.location}
                          </h3>

                          <p className="mt-1 text-[10px] text-[#71869b]">
                            Similar spatial characteristics detected
                          </p>
                        </div>

                        <span className="shrink-0 rounded-md border border-[#cfe0f0] bg-[#f7fbff] px-2 py-1 text-[9px] font-semibold text-[#1677e8]">
                          Match
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#e3eaf1] pt-3">
                        <Meta
                          label="Similarity"
                          value={`${location.similarity}%`}
                        />

                        <Meta
                          label="Date"
                          value={location.date}
                        />

                        <Meta
                          label="Coordinates"
                          value={`${location.coordinates[0]}, ${location.coordinates[1]}`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Location */}
              {selectedId && (
                <SelectedLocation
                  location={similarLocations.find(
                    (item) => item.id === selectedId
                  )!}
                  onOpenMap={() => router.push("/map")}
                />
              )}
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
      <div className="text-[8px] font-semibold uppercase tracking-wider text-[#8a9bac]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-medium text-[#496784]">
        {value}
      </div>
    </div>
  );
}

function SelectedLocation({
  location,
  onOpenMap,
}: {
  location: (typeof similarLocations)[number];
  onOpenMap: () => void;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-[#cfe0f0] bg-white p-5 shadow-sm animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1677e8]">
            Selected Similar Location
          </div>

          <h2 className="mt-1 text-sm font-semibold text-[#16324f]">
            {location.location}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold text-[#1677e8]">
            {location.similarity}%
          </div>

          <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8a9bac]">
            Similarity
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        <Meta
          label="Latitude"
          value={`${location.coordinates[0]}° N`}
        />

        <Meta
          label="Longitude"
          value={`${location.coordinates[1]}° E`}
        />

        <Meta
          label="Sensor"
          value={location.sensor}
        />

        <Meta
          label="Observation"
          value={location.date}
        />
      </div>

      <div className="mt-5 flex justify-end border-t border-[#e3eaf1] pt-4">
        <button
          onClick={onOpenMap}
          className="rounded-lg bg-[#1677e8] px-5 py-2.5 text-[10px] font-semibold text-white hover:bg-[#1268cf]"
        >
          View on Map →
        </button>
      </div>
    </section>
  );
}
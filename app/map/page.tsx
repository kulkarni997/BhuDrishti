"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchResults } from "@/data/searchResults";
import { similarLocations } from "@/data/similarLocations";
import {
  getInvestigation,
  type InvestigationState,
} from "@/lib/investigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

type MarkerType = "search" | "change" | "similar";

const searchMarkerPositions: Record<
  string,
  { left: number; top: number }
> = {
  "site-001": { left: 38, top: 38 },
  "site-002": { left: 53, top: 48 },
  "site-003": { left: 66, top: 32 },
  "site-004": { left: 30, top: 61 },
};

const similarMarkerPositions: Record<
  string,
  { left: number; top: number }
> = {
  "similar-001": { left: 58, top: 58 },
  "similar-002": { left: 70, top: 39 },
  "similar-003": { left: 42, top: 68 },
  "similar-004": { left: 63, top: 23 },
};

export default function MapPage() {
  const router = useRouter();

  const [investigation, setInvestigation] =
    useState<InvestigationState | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    search: true,
    changes: true,
    similar: true,
    aoi: true,
  });

  const [selectedMarker, setSelectedMarker] = useState<{
    type: MarkerType;
    id: string;
  } | null>(null);

  useEffect(() => {
    const active = getInvestigation();

    setInvestigation(active);

    setSelectedMarker({
      type: "change",
      id: active.siteId,
    });
  }, []);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((current) => ({
      ...current,
      [layer]: !current[layer],
    }));
  };

  const activeSearch = searchResults.find(
    (result) => result.id === investigation?.siteId
  );

  const selectedSearch =
    selectedMarker?.type === "search"
      ? searchResults.find(
          (item) => item.id === selectedMarker.id
        )
      : null;

  const selectedSimilar =
    selectedMarker?.type === "similar"
      ? similarLocations.find(
          (item) => item.id === selectedMarker.id
        )
      : null;

  const location =
    investigation?.location || "Narmada Basin — Sector A";

  const changeType =
    investigation?.changeType || "Construction";

  const confidence =
    investigation?.confidence || 91;

  const activePosition =
    searchMarkerPositions[investigation?.siteId || "site-001"] ||
    searchMarkerPositions["site-001"];

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#16324f]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-20">
        <div className="p-7 animate-fade-up">

          {/* Header */}
          <div className="mb-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1677e8]">
              Geospatial Workspace
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f]">
              Investigation Map
            </h1>

            <p className="mt-2 text-sm text-[#71869b]">
              Explore search results, detected changes, areas of
              interest and similar locations.
            </p>
          </div>

          {/* Active Investigation */}
          <div className="mb-5 rounded-xl border border-[#cfe0f0] bg-white px-5 py-4">
            <div className="flex items-center justify-between">

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1677e8]">
                  Active Investigation
                </div>

                <div className="mt-1 text-sm font-semibold text-[#16324f]">
                  {location}
                </div>
              </div>

              <div className="flex items-center gap-6">

                <MapHeaderMeta
                  label="Type"
                  value={changeType}
                />

                <MapHeaderMeta
                  label="Confidence"
                  value={`${confidence}%`}
                />

                <MapHeaderMeta
                  label="Period"
                  value="2021 → 2025"
                />

              </div>
            </div>
          </div>

          {/* Map */}
          <section className="relative h-[650px] overflow-hidden rounded-2xl border border-[#dce6f0] bg-white shadow-sm">

            {/* Satellite imagery */}
            <div className="absolute inset-0">
              <img
                src="/satellite/base-map.png"
                alt="Satellite map"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-white/5" />
            </div>

            {/* AOI */}
            {activeLayers.aoi && (
              <div className="pointer-events-none absolute left-[24%] top-[25%] h-[48%] w-[46%] rounded-[4px] border-2 border-dashed border-[#1677e8] bg-[#1677e8]/5">

                <div className="absolute -top-7 left-0 rounded-md border border-[#b8d2ed] bg-white/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#1677e8] shadow-sm">
                  Active AOI
                </div>

              </div>
            )}

            {/* Search result markers */}
            {activeLayers.search &&
              searchResults.map((result) => {
                const position =
                  searchMarkerPositions[result.id];

                if (!position) return null;

                return (
                  <MapMarker
                    key={result.id}
                    left={position.left}
                    top={position.top}
                    type="search"
                    selected={
                      selectedMarker?.type === "search" &&
                      selectedMarker.id === result.id
                    }
                    onClick={() =>
                      setSelectedMarker({
                        type: "search",
                        id: result.id,
                      })
                    }
                  />
                );
              })}

            {/* Active detected change */}
            {activeLayers.changes && activeSearch && (
              <MapMarker
                left={activePosition.left}
                top={activePosition.top}
                type="change"
                selected={
                  selectedMarker?.type === "change" &&
                  selectedMarker.id === investigation?.siteId
                }
                onClick={() =>
                  setSelectedMarker({
                    type: "change",
                    id: investigation?.siteId || "site-001",
                  })
                }
              />
            )}

            {/* Similar location markers */}
            {activeLayers.similar &&
              similarLocations.map((location) => {
                const position =
                  similarMarkerPositions[location.id];

                if (!position) return null;

                return (
                  <MapMarker
                    key={location.id}
                    left={position.left}
                    top={position.top}
                    type="similar"
                    selected={
                      selectedMarker?.type === "similar" &&
                      selectedMarker.id === location.id
                    }
                    onClick={() =>
                      setSelectedMarker({
                        type: "similar",
                        id: location.id,
                      })
                    }
                  />
                );
              })}

            {/* Layer Controls */}
            <div className="absolute right-5 top-5 w-52 rounded-xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur">

              <div className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#71869b]">
                Map Layers
              </div>

              <LayerToggle
                label="Search Results"
                active={activeLayers.search}
                marker="search"
                onClick={() => toggleLayer("search")}
              />

              <LayerToggle
                label="Detected Changes"
                active={activeLayers.changes}
                marker="change"
                onClick={() => toggleLayer("changes")}
              />

              <LayerToggle
                label="Similar Locations"
                active={activeLayers.similar}
                marker="similar"
                onClick={() => toggleLayer("similar")}
              />

              <LayerToggle
                label="AOI Boundary"
                active={activeLayers.aoi}
                marker="aoi"
                onClick={() => toggleLayer("aoi")}
              />

            </div>

            {/* Selected Location */}
            <div className="absolute bottom-5 left-5 w-[340px] rounded-2xl border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur">

              <div className="flex items-start justify-between">

                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1677e8]">
                    Selected Location
                  </div>

                  <h2 className="mt-1 text-sm font-semibold text-[#16324f]">
                    {selectedMarker?.type === "similar"
                      ? selectedSimilar?.location
                      : selectedMarker?.type === "search"
                        ? selectedSearch?.location
                        : location}
                  </h2>
                </div>

                <span className="rounded-md bg-[#eaf3ff] px-2 py-1 text-[9px] font-semibold text-[#1677e8]">
                  {selectedMarker?.type === "similar"
                    ? `${selectedSimilar?.similarity}% Similar`
                    : selectedMarker?.type === "search"
                      ? `${selectedSearch?.relevance}% Match`
                      : `${confidence}% Confidence`}
                </span>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e3eaf1] pt-4">

                <MapMeta
                  label="Type"
                  value={
                    selectedMarker?.type === "similar"
                      ? "Similar Location"
                      : selectedMarker?.type === "search"
                        ? selectedSearch?.changeType ||
                          "Search Result"
                        : changeType
                  }
                />

                <MapMeta
                  label="Date"
                  value={
                    selectedMarker?.type === "similar"
                      ? selectedSimilar?.date || "—"
                      : selectedSearch?.date ||
                        activeSearch?.date ||
                        "15 Jan 2026"
                  }
                />

                <MapMeta
                  label="Sensor"
                  value={
                    selectedMarker?.type === "similar"
                      ? selectedSimilar?.sensor || "—"
                      : selectedSearch?.sensor ||
                        activeSearch?.sensor ||
                        "Sentinel-2"
                  }
                />

                <MapMeta
                  label="Resolution"
                  value={
                    selectedSearch?.resolution ||
                    activeSearch?.resolution ||
                    "10 m"
                  }
                />

              </div>

              <button
                onClick={() => {
                  if (selectedMarker?.type === "similar") {
                    router.push("/similar-locations");
                  } else {
                    router.push("/change-detection");
                  }
                }}
                className="mt-4 w-full rounded-lg bg-[#1677e8] py-2.5 text-[10px] font-semibold text-white hover:bg-[#1268cf]"
              >
                View Investigation →
              </button>

            </div>

            {/* North indicator */}
            <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[10px] font-bold text-[#16324f] shadow-md">
              N
            </div>

            {/* Attribution */}
            <div className="absolute bottom-2 right-3 rounded bg-white/85 px-2 py-1 text-[8px] text-[#71869b]">
              Satellite imagery · Prototype visualization
            </div>

          </section>
        </div>
      </section>
    </main>
  );
}

function MapMarker({
  left,
  top,
  type,
  selected,
  onClick,
}: {
  left: number;
  top: number;
  type: MarkerType;
  selected: boolean;
  onClick: () => void;
}) {
  const markerClass =
    type === "change"
      ? "bg-[#d9534f] border-[#fff]"
      : type === "similar"
        ? "bg-[#18a67a] border-[#fff]"
        : "bg-[#1677e8] border-[#fff]";

  return (
    <button
      onClick={onClick}
      className={`marker-pulse absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-lg transition-all ${
        selected ? "scale-125" : "hover:scale-110"
      } ${markerClass}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
      }}
      aria-label={`${type} marker`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
    </button>
  );
}

function LayerToggle({
  label,
  active,
  marker,
  onClick,
}: {
  label: string;
  active: boolean;
  marker: MarkerType | "aoi";
  onClick: () => void;
}) {
  const markerColor =
    marker === "change"
      ? "bg-[#d9534f]"
      : marker === "similar"
        ? "bg-[#18a67a]"
        : marker === "aoi"
          ? "border border-[#1677e8] bg-transparent"
          : "bg-[#1677e8]";

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-[#f4f8fd]"
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${markerColor} ${
          active ? "opacity-100" : "opacity-25"
        }`}
      />

      <span
        className={`text-[10px] ${
          active
            ? "font-medium text-[#496784]"
            : "text-[#a2afbb]"
        }`}
      >
        {label}
      </span>

      <span
        className={`ml-auto h-3.5 w-6 rounded-full p-0.5 ${
          active ? "bg-[#1677e8]" : "bg-[#d5dee7]"
        }`}
      >
        <span
          className={`block h-2.5 w-2.5 rounded-full bg-white transition-transform ${
            active ? "translate-x-2.5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

function MapHeaderMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-right">
      <div className="text-[8px] font-semibold uppercase tracking-wider text-[#8a9bac]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-semibold text-[#496784]">
        {value}
      </div>
    </div>
  );
}

function MapMeta({
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
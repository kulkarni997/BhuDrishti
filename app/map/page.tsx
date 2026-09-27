"use client";

import { useState } from "react";
import { searchResults } from "@/data/searchResults";
import { similarLocations } from "@/data/similarLocations";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

type MarkerType = "search" | "change" | "similar";

export default function MapPage() {
  const [activeLayers, setActiveLayers] = useState({
    search: true,
    changes: true,
    similar: true,
    aoi: true,
  });

  const [selectedMarker, setSelectedMarker] = useState<{
    type: MarkerType;
    id: string;
  } | null>({
    type: "change",
    id: "site-001",
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((current) => ({
      ...current,
      [layer]: !current[layer],
    }));
  };

  const selectedSearch =
    selectedMarker?.type === "search"
      ? searchResults.find((item) => item.id === selectedMarker.id)
      : null;

  const selectedSimilar =
    selectedMarker?.type === "similar"
      ? similarLocations.find((item) => item.id === selectedMarker.id)
      : null;

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
              Explore search results, detected changes, areas of interest and
              similar locations.
            </p>
          </div>

          {/* Map Workspace */}
          <section className="relative h-[650px] overflow-hidden rounded-2xl border border-[#dce6f0] bg-white shadow-sm">

            {/* Satellite Map */}
            <div className="absolute inset-0">
              <img
                src="/satellite/base-map.png"
                alt="Satellite map"
                className="h-full w-full object-cover"
              />

              {/* Subtle map overlay */}
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

            {/* Search Markers */}
            {activeLayers.search &&
              searchResults.map((result, index) => (
                <MapMarker
                  key={result.id}
                  left={[38, 53, 66, 30][index]}
                  top={[38, 48, 32, 61][index]}
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
              ))}

            {/* Change Marker */}
            {activeLayers.changes && (
              <MapMarker
                left={47}
                top={46}
                type="change"
                selected={
                  selectedMarker?.type === "change" &&
                  selectedMarker.id === "site-001"
                }
                onClick={() =>
                  setSelectedMarker({
                    type: "change",
                    id: "site-001",
                  })
                }
              />
            )}

            {/* Similar Location Markers */}
            {activeLayers.similar &&
              similarLocations.map((location, index) => (
                <MapMarker
                  key={location.id}
                  left={[58, 70, 42, 63][index]}
                  top={[58, 39, 68, 23][index]}
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
              ))}

            {/* Map Controls */}
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

            {/* Selected Investigation Panel */}
            <div className="absolute bottom-5 left-5 w-[340px] rounded-2xl border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur">

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1677e8]">
                    Selected Location
                  </div>

                  <h2 className="mt-1 text-sm font-semibold text-[#16324f]">
                    {selectedMarker?.type === "similar"
                      ? selectedSimilar?.location
                      : selectedSearch?.location ||
                        "Narmada Basin — Sector A"}
                  </h2>
                </div>

                <span className="rounded-md bg-[#eaf3ff] px-2 py-1 text-[9px] font-semibold text-[#1677e8]">
                  {selectedMarker?.type === "similar"
                    ? `${selectedSimilar?.similarity}% Similar`
                    : selectedMarker?.type === "search"
                      ? `${selectedSearch?.relevance}% Match`
                      : "91% Confidence"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e3eaf1] pt-4">

                <MapMeta
                  label="Type"
                  value={
                    selectedMarker?.type === "similar"
                      ? "Similar Location"
                      : selectedMarker?.type === "search"
                        ? selectedSearch?.changeType || "Search Result"
                        : "Construction"
                  }
                />

                <MapMeta
                  label="Date"
                  value={
                    selectedMarker?.type === "similar"
                      ? selectedSimilar?.date || "—"
                      : selectedSearch?.date || "15 Jan 2026"
                  }
                />

                <MapMeta
                  label="Sensor"
                  value={
                    selectedMarker?.type === "similar"
                      ? selectedSimilar?.sensor || "—"
                      : selectedSearch?.sensor || "Sentinel-2"
                  }
                />

                <MapMeta
                  label="Resolution"
                  value={
                    selectedSearch?.resolution || "10 m"
                  }
                />
              </div>

              <button
                onClick={() => {
                  window.location.href =
                    selectedMarker?.type === "similar"
                      ? "/similar-locations"
                      : "/change-detection";
                }}
                className="mt-4 w-full rounded-lg bg-[#1677e8] py-2.5 text-[10px] font-semibold text-white hover:bg-[#1268cf]"
              >
                View Investigation →
              </button>
            </div>

            {/* North Indicator */}
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
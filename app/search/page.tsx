"use client";

import { useRef, useState } from "react";
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

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [imageSearching, setImageSearching] = useState(false);
  const [imageSearched, setImageSearched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);
    setUploadedFileName(file.name);
    setImageSearched(false);
  };

  const handleFindSimilarImages = () => {
    if (!uploadedImage || imageSearching) return;

    setImageSearching(true);
    setImageSearched(false);

    setTimeout(() => {
      setImageSearching(false);
      setImageSearched(true);
    }, 700);
  };

  const handleSearch = () => {
    setSearched(false);

    setTimeout(() => {
      setSearched(true);
    }, 350);
  };

  return (
    <main className="min-h-screen bg-[#061522] text-[#e7f1f8]">
      <Sidebar />
      <Topbar />

      <section className="ml-64 pt-[72px]">
        <div className="p-7 animate-fade-up">
          {/* Header */}
          <div className="mb-7">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55b8f4]">
              Semantic Retrieval
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#e7f1f8]">
              Search Satellite Imagery
            </h1>

            <p className="mt-2 text-sm text-[#6f8da3]">
              Describe what you are looking for using natural language.
            </p>
          </div>

          {/* Retrieval modes */}
          <section className="rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            <div className="mb-5 flex items-center gap-1 border-b border-[rgba(125,171,204,0.12)]">
              <div className="border-b-2 border-[#55b8f4] px-4 pb-3 text-xs font-semibold text-[#8ed5ff]">
                Text to Image
              </div>
              <button
                onClick={() => {
                  document.getElementById("image-retrieval")?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className="px-4 pb-3 text-xs font-semibold text-[#6f8da3] transition hover:text-[#8ed5ff]"
              >
                Image to Image
              </button>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#58788d]">
                  ⌕
                </span>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Search satellite imagery..."
                  className="w-full rounded-lg border border-[rgba(125,171,204,0.16)] bg-[#081a29] py-3 pl-11 pr-4 text-sm text-[#e7f1f8] outline-none placeholder:text-[#58788d] focus:border-[#55b8f4]/50 focus:ring-1 focus:ring-[#55b8f4]/10"
                />
              </div>

              <button
                onClick={handleSearch}
                className="rounded-lg bg-[#1677aa] px-7 text-xs font-semibold text-white shadow-[0_8px_22px_rgba(22,119,170,0.22)] transition hover:bg-[#1d8fc8]"
              >
                Search
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#58788d]">
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
                  className="rounded-md border border-[rgba(125,171,204,0.16)] bg-[#081a29] px-3 py-1.5 text-[10px] text-[#86a0b4] transition hover:border-[#55b8f4]/30 hover:bg-[#0c2234] hover:text-[#8ed5ff]"
                >
                  {example}
                </button>
              ))}
            </div>
          </section>

          {/* Image-to-Image Retrieval */}
          <section
            id="image-retrieval"
            className="mt-5 rounded-2xl border border-[rgba(125,171,204,0.16)] bg-[#0b2032] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#e7f1f8]">
                  Image to Image
                </div>
                <div className="mt-1 text-[10px] text-[#6f8da3]">
                  Upload a satellite image to retrieve visually similar locations.
                </div>
              </div>

              <div className="rounded-md bg-[#39c99a]/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#63ddb2]">
                Visual Retrieval
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
            />

            {!uploadedImage ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleImageUpload(e.dataTransfer.files?.[0]);
                }}
                className={`mt-5 flex w-full flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition ${
                  isDragging
                    ? "border-[#55b8f4] bg-[#55b8f4]/10"
                    : "border-[rgba(125,171,204,0.24)] bg-[#081a29] hover:border-[#55b8f4]/45 hover:bg-[#0c2234]"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(125,171,204,0.18)] bg-[#0b2032] text-xl text-[#6e91b1]">
                  ⊞
                </div>

                <div className="mt-3 text-sm font-semibold text-[#dcecf5]">
                  Drop satellite image here
                </div>

                <div className="mt-1 text-[10px] text-[#6f8da3]">
                  or click to browse from the analyst workspace
                </div>

                <span className="mt-4 rounded-lg border border-[rgba(125,171,204,0.2)] bg-[#0b2032] px-4 py-2 text-[10px] font-semibold text-[#8ed5ff]">
                  Browse Image
                </span>
              </button>
            ) : (
              <div className="mt-5 grid grid-cols-[220px_1fr] gap-5">
                <div className="relative h-40 overflow-hidden rounded-xl border border-[rgba(125,171,204,0.18)] bg-[#071a29]">
                  <img
                    src={uploadedImage}
                    alt="Uploaded satellite image preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 truncate rounded bg-[#061522]/90 px-2 py-1 text-[8px] text-white backdrop-blur">
                    {uploadedFileName}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#58788d]">
                    Query Image
                  </div>

                  <div className="mt-1 text-sm font-semibold text-[#dcecf5]">
                    Image ready for visual retrieval
                  </div>

                  <div className="mt-1 text-[10px] text-[#6f8da3]">
                    Compare visual characteristics against the staged satellite
                    imagery collection.
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleFindSimilarImages}
                      disabled={imageSearching}
                      className="rounded-lg bg-[#1677aa] px-5 py-2.5 text-[10px] font-semibold text-white shadow-[0_8px_18px_rgba(22,119,170,0.18)] transition hover:bg-[#1d8fc8] disabled:cursor-wait disabled:opacity-60"
                    >
                      {imageSearching
                        ? "Finding Similar Images..."
                        : "Find Similar Images"}
                    </button>

                    <button
                      onClick={() => {
                        if (uploadedImage) URL.revokeObjectURL(uploadedImage);
                        setUploadedImage(null);
                        setUploadedFileName("");
                        setImageSearched(false);
                      }}
                      className="rounded-lg border border-[rgba(125,171,204,0.2)] bg-[#081a29] px-4 py-2.5 text-[10px] font-semibold text-[#86a0b4] transition hover:bg-[#102b3c] hover:text-[#bcd3e1]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {uploadedImage && imageSearched && (
              <div className="mt-5 border-t border-[rgba(125,171,204,0.12)] pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#e7f1f8]">
                      Similar Satellite Locations
                    </div>
                    <div className="mt-1 text-[10px] text-[#6f8da3]">
                      Ranked by visual similarity to the uploaded image.
                    </div>
                  </div>

                  <div className="text-[9px] font-semibold uppercase tracking-wider text-[#63ddb2]">
                    Analysis complete
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {searchResults.slice(0, 3).map((result, index) => {
                    const similarity = [94, 89, 85][index];

                    return (
                      <button
                        key={`image-${result.id}`}
                        onClick={() => {
                          setSelectedId(result.id);
                          saveInvestigation({
                            siteId: result.id,
                            location: result.location,
                            changeType: result.changeType,
                            confidence: result.confidence,
                          });
                        }}
                        className={`group rounded-xl border p-3 text-left transition ${
                          selectedId === result.id
                            ? "border-[#55b8f4]/55 bg-[#0c2639]"
                            : "border-[rgba(125,171,204,0.14)] bg-[#081a29] hover:border-[#55b8f4]/30 hover:bg-[#0c2234]"
                        }`}
                      >
                        <div className="relative h-28 overflow-hidden rounded-lg">
                          <img
                            src={result.image}
                            alt={result.location}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <span className="absolute right-2 top-2 rounded-md bg-[#061522]/90 px-2 py-1 text-[9px] font-bold text-[#8ed5ff] backdrop-blur">
                            {similarity}% similar
                          </span>
                        </div>

                        <div className="mt-3 text-xs font-semibold text-[#e7f1f8]">
                          {result.location}
                        </div>

                        <div className="mt-1 text-[9px] text-[#6f8da3]">
                          {result.date} · {result.sensor}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Results Header */}
          <div className="mt-7 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#e7f1f8]">
                Search Results
              </div>

              <div className="mt-1 text-[10px] text-[#6f8da3]">
                {searchResults.length} matching locations
              </div>
            </div>

            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6f8da3]">
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
                  className={`group rounded-2xl border bg-[#0b2032] p-4 text-left shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-200 ${
                    selected
                      ? "border-[#55b8f4]/55 shadow-[0_0_24px_rgba(85,184,244,0.08)]"
                      : "border-[rgba(125,171,204,0.16)] hover:-translate-y-0.5 hover:border-[#55b8f4]/30 hover:bg-[#0d2538] hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
                  }`}
                >
                  {/* Image */}
                  <div className="relative mb-4 h-52 overflow-hidden rounded-xl border border-[rgba(125,171,204,0.16)] bg-[#102b3c]">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Relevance */}
                    <div className="absolute right-3 top-3 rounded-md border border-white/20 bg-[#071a29]/90 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                      {result.relevance}% match
                    </div>

                    {/* Sensor */}
                    <div className="absolute bottom-3 left-3 rounded-md border border-white/20 bg-[#071a29]/90 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur">
                      {result.sensor}
                    </div>
                  </div>

                  {/* Title + Type */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#e7f1f8]">
                        {result.title}
                      </h3>

                      <p className="mt-1 text-[10px] text-[#6f8da3]">
                        {result.location}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-md border border-[rgba(125,171,204,0.2)] bg-[#081a29] px-2 py-1 text-[9px] font-semibold text-[#8ed5ff]">
                      {result.changeType}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[rgba(125,171,204,0.12)] pt-3">
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
      <div className="text-[8px] font-semibold uppercase tracking-wider text-[#58788d]">
        {label}
      </div>

      <div className="mt-1 text-[10px] font-medium text-[#bcd3e1]">
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
    <section className="mt-6 rounded-2xl border border-[#55b8f4]/25 bg-[#0b2032] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.16)] animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#55b8f4]">
            Active Investigation
          </div>

          <h2 className="mt-1 text-sm font-semibold text-[#e7f1f8]">
            {result.location}
          </h2>
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold text-[#8ed5ff]">
            {result.relevance}%
          </div>

          <div className="text-[9px] font-semibold uppercase tracking-wider text-[#58788d]">
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

      <div className="mt-5 flex justify-end border-t border-[rgba(125,171,204,0.12)] pt-4">
        <button
          onClick={() => router.push("/change-detection")}
          className="rounded-lg bg-[#1677aa] px-5 py-2.5 text-[10px] font-semibold text-white shadow-[0_8px_18px_rgba(22,119,170,0.18)] transition hover:bg-[#1d8fc8]"
        >
          Open Investigation →
        </button>
      </div>
    </section>
  );
}

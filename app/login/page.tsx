"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [analystId, setAnalystId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!analystId || !password) return;

    setLoading(true);

    setTimeout(() => {
      router.push("/initializing");
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#080d12] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-up">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-[#263640] bg-[#0d141b]">
            <div className="h-6 w-6 rounded-full border border-[#66d9c4] relative">
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#66d9c4]" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            BhuDrishti
          </h1>

          <p className="mt-2 text-sm text-[#7f909d]">
            Geospatial Intelligence Platform
          </p>
        </div>

        {/* Login panel */}
        <div className="rounded-2xl border border-[#1d2a34] bg-[#0d141b] p-7 shadow-2xl">
          <div className="mb-7">
            <h2 className="text-lg font-medium">
              Analyst Access
            </h2>

            <p className="mt-1 text-sm text-[#7f909d]">
              Enter your credentials to access the workspace.
            </p>
          </div>

          <div className="space-y-5">

            {/* Analyst ID */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#7f909d]">
                Analyst ID
              </label>

              <input
                value={analystId}
                onChange={(e) => setAnalystId(e.target.value)}
                placeholder="Enter analyst ID"
                className="w-full rounded-lg border border-[#26343e] bg-[#080d12] px-4 py-3 text-sm outline-none placeholder:text-[#52616c] focus:border-[#66d9c4]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#7f909d]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-[#26343e] bg-[#080d12] px-4 py-3 text-sm outline-none placeholder:text-[#52616c] focus:border-[#66d9c4]"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !analystId || !password}
              className="mt-2 w-full rounded-lg bg-[#66d9c4] px-4 py-3 text-sm font-semibold text-[#07100f] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Authenticating..."
                : "Enter Analyst Workspace"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#52616c]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#66d9c4]" />
          Secure Analyst Access
          <span>•</span>
          Local Demonstration Environment
        </div>

      </div>
    </main>
  );
}
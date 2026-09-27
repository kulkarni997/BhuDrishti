"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "Loading imagery index",
  "Loading geospatial layers",
  "Preparing analysis environment",
];

export default function InitializingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 900);

    const redirectTimer = setTimeout(() => {
      router.push("/dashboard");
    }, 3500);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#080d12] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg animate-fade-up">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#263640] bg-[#0d141b]">
            <div className="relative h-8 w-8 rounded-full border border-[#66d9c4]">
              <span className="absolute inset-1 rounded-full border border-[#66d9c4]/30" />
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#66d9c4] detection-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            BhuDrishti
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#7f909d]">
            Initializing Analyst Workspace
          </p>
        </div>

        <div className="rounded-2xl border border-[#1d2a34] bg-[#0d141b] p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#7f909d]">
              System Initialization
            </span>

            <span className="text-xs text-[#66d9c4]">
              {Math.min((activeStep + 1) * 33, 100)}%
            </span>
          </div>

          <div className="mb-7 h-px overflow-hidden bg-[#1d2a34]">
            <div
              className="h-full bg-[#66d9c4] transition-all duration-700"
              style={{
                width: `${Math.min((activeStep + 1) * 33, 100)}%`,
              }}
            />
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const completed = index < activeStep;
              const current = index === activeStep;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 text-sm transition-opacity duration-500 ${
                    index > activeStep ? "opacity-30" : "opacity-100"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] ${
                      completed || current
                        ? "border-[#66d9c4] text-[#66d9c4]"
                        : "border-[#263640] text-[#52616c]"
                    }`}
                  >
                    {completed ? "✓" : current ? "•" : ""}
                  </span>

                  <span
                    className={
                      current || completed
                        ? "text-[#d7e1e5]"
                        : "text-[#52616c]"
                    }
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-[#1d2a34] pt-5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#66d9c4]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#66d9c4]" />
              System Ready
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] uppercase tracking-widest text-[#52616c]">
          Local Demonstration Environment
        </p>
      </div>
    </main>
  );
}
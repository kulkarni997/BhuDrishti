"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InitializingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 2400);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="initializing-page">
      <div className="initializing-grid" />

      <div className="initializing-content">
        <div className="initializing-logo">
          <div className="initializing-ring">
            <span />
          </div>
        </div>

        <div className="initializing-brand">
          <h1>ORBITA</h1>

          <p>
            ANALYST WORKSPACE
          </p>
        </div>

        <div className="initializing-progress">
          <div className="initializing-progress-bar" />
        </div>

        <div className="initializing-status">
          <span className="initializing-dot" />
          INITIALIZING SATELLITE ANALYSIS ENVIRONMENT
        </div>

        <div className="initializing-items">
          <div>
            <span className="check">✓</span>
            Imagery Index
          </div>

          <div>
            <span className="check">✓</span>
            Semantic Retrieval
          </div>

          <div>
            <span className="loading-dot" />
            Change Analysis
          </div>
        </div>
      </div>

      <div className="initializing-footer">
        <span>SYSTEM ONLINE</span>
        <span>LOCAL ANALYST SESSION</span>
        <span>BH-01</span>
      </div>
    </main>
  );
}
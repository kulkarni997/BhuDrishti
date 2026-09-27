"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="bhudrishti-intro">
      <div className="intro-grid" />

      <div className="intro-content">
        <div className="intro-logo">
          <div className="intro-ring">
            <span />
          </div>
        </div>

        <div className="intro-brand">
          <h1>ORBITA</h1>
          <p>GEOSPATIAL INTELLIGENCE</p>
        </div>

        <div className="intro-divider" />

        <div className="intro-status">
          <span className="intro-status-dot" />
          <span>INITIALIZING ANALYST WORKSPACE</span>
        </div>
      </div>

      <div className="intro-footer">
        <span>BH-01</span>
        <span>OFFLINE ANALYSIS ENVIRONMENT</span>
        <span>SECURE SESSION</span>
      </div>
    </main>
  );
}
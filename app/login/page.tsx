"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (!username || !password) {
      setError("Enter analyst credentials to continue.");
      return;
    }

    setError("");
    router.push("/initializing");
  }

  return (
    <main className="login-page">
      <div className="login-grid" />

      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <section className="login-shell">
        <div className="login-brand">
          <div className="login-logo">
            <div className="login-ring">
              <span />
            </div>
          </div>

          <div>
            <h1>ORBITA</h1>
            <p>GEOSPATIAL INTELLIGENCE</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <div>
              <div className="login-eyebrow">
                ANALYST ACCESS
              </div>

              <h2>Secure Workspace</h2>

              <p>
                Access satellite imagery search and
                multi-temporal analysis tools.
              </p>
            </div>

            <div className="login-status">
              <span />
              LOCAL
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              <span>Analyst ID</span>

              <input
                type="text"
                placeholder="Enter analyst ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>

            <label>
              <span>Access Key</span>

              <input
                type="password"
                placeholder="Enter access key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button type="submit" className="login-button">
              <span>Enter Analyst Workspace</span>
              <span className="login-arrow">→</span>
            </button>
          </form>

          <div className="login-card-footer">
            <span>
              <span className="secure-dot" />
              SECURE LOCAL SESSION
            </span>

            <span>BH-01</span>
          </div>
        </div>

        <div className="login-footer">
          <span>BHUVISDRISHTI ANALYTICS SYSTEM</span>
          <span>OFFLINE ANALYSIS ENVIRONMENT</span>
          <span>v1.0</span>
        </div>
      </section>
    </main>
  );
}
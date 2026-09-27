"use client";

export default function Topbar() {
  return (
    <header className="bd-topbar">
      <div>
        <div className="bd-topbar-title">Satellite Imagery Analyst</div>
        <div className="bd-topbar-subtitle">
          MULTI-TEMPORAL GEOSPATIAL ANALYSIS
        </div>
      </div>

      <div className="bd-topbar-right">
        <div className="bd-system-status">
          <span className="bd-online-dot" />
          SYSTEM ONLINE
        </div>

        <div className="bd-profile">
          <div className="bd-profile-copy">
            <div className="bd-profile-name">Analyst</div>
            <div className="bd-profile-session">Local Session</div>
          </div>

          <div className="bd-avatar">A</div>
        </div>
      </div>
    </header>
  );
}

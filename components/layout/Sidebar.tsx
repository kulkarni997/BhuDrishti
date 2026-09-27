"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "⌂" },
  { name: "Semantic Search", href: "/search", icon: "⌕" },
  { name: "Change Detection", href: "/change-detection", icon: "◇" },
  { name: "Map", href: "/map", icon: "▱" },
  { name: "Audit Trail", href: "/audit-trail", icon: "▤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bd-sidebar">
      <div className="bd-brand">
        <div className="bd-brand-mark">
          <span className="bd-brand-dot" />
        </div>

        <div className="bd-brand-copy">
          <div className="bd-brand-name">BhuDrishti</div>
          <div className="bd-brand-subtitle">GEOSPATIAL INTELLIGENCE</div>
        </div>
      </div>

      <div className="bd-nav-label">ANALYST WORKSPACE</div>

      <nav className="bd-nav">
        {navigation.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bd-nav-link ${active ? "active" : ""}`}
            >
              <span className="bd-nav-icon">{item.icon}</span>
              <span className="bd-nav-text">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="bd-sidebar-status">
        <div className="bd-sidebar-status-row">
          <span className="bd-online-dot" />
          SYSTEM ONLINE
        </div>
        <p>Local demonstration environment</p>
      </div>
    </aside>
  );
}

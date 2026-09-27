"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: "⌂" },
  { label: "Semantic Search", href: "/search", icon: "⌕" },
  { label: "Change Detection", href: "/change-detection", icon: "◈" },
  { label: "Map", href: "/map", icon: "◇" },
  { label: "Audit Trail", href: "/audit-trail", icon: "≡" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#1d2a34] bg-[#0a1016]">
      {/* Brand */}
      <div className="flex h-20 items-center border-b border-[#1d2a34] px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263640] bg-[#0d141b]">
            <div className="h-4 w-4 rounded-full border border-[#66d9c4]">
              <div className="mx-auto mt-[5px] h-1 w-1 rounded-full bg-[#66d9c4]" />
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold tracking-wide text-[#e8eef2]">
              BhuDrishti
            </div>
            <div className="text-[9px] uppercase tracking-[0.16em] text-[#52616c]">
              Geospatial Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <div className="mb-3 px-3 text-[9px] font-medium uppercase tracking-[0.18em] text-[#52616c]">
          Analyst Workspace
        </div>

        <div className="space-y-1">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-xs ${
                  active
                    ? "border border-[#24534d] bg-[#66d9c4]/10 text-[#66d9c4]"
                    : "border border-transparent text-[#7f909d] hover:bg-[#111b24] hover:text-[#d7e1e5]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center text-sm ${
                    active
                      ? "text-[#66d9c4]"
                      : "text-[#52616c] group-hover:text-[#9aa9b0]"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#66d9c4]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* System status */}
      <div className="border-t border-[#1d2a34] p-4">
        <div className="rounded-lg border border-[#1d2a34] bg-[#0d141b] p-3">
          <div className="flex items-center gap-2">
            <span className="detection-pulse h-2 w-2 rounded-full bg-[#66d9c4]" />
            <span className="text-[10px] font-medium text-[#d7e1e5]">
              System Online
            </span>
          </div>

          <div className="mt-2 text-[9px] leading-relaxed text-[#52616c]">
            Local demonstration environment
          </div>
        </div>
      </div>
    </aside>
  );
}
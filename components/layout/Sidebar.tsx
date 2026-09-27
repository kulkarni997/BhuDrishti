"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    name: "Semantic Search",
    href: "/search",
    icon: "⌕",
  },
  {
    name: "Change Detection",
    href: "/change-detection",
    icon: "◇",
  },
  {
    name: "Map",
    href: "/map",
    icon: "▱",
  },
  {
    name: "Audit Trail",
    href: "/audit-trail",
    icon: "▤",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#dbe5f0] bg-white">
      {/* Logo */}
      <div className="flex h-24 items-center border-b border-[#dbe5f0] px-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#cfe0f5] bg-[#f7fbff]">
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#1677e8]">
              <span className="h-2 w-2 rounded-full bg-[#1677e8]" />
            </div>
          </div>

          <div>
            <div className="text-[20px] font-bold tracking-tight text-[#163b67]">
              BhuDrishti
            </div>

            <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#71839a]">
              Geospatial Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pt-7">
        <div className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71839a]">
          Analyst Workspace
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex h-12 items-center gap-4 rounded-lg px-4 text-sm font-medium ${
                  active
                    ? "bg-[#eaf3ff] text-[#1677e8]"
                    : "text-[#496784] hover:bg-[#f4f8fd] hover:text-[#163b67]"
                }`}
              >
                <span
                  className={`flex w-5 justify-center text-lg ${
                    active ? "text-[#1677e8]" : "text-[#55738f]"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.name}</span>

                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#1677e8]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom status */}
      <div className="mt-auto border-t border-[#dbe5f0] p-5">
        <div className="rounded-xl border border-[#dbe5f0] bg-[#f8fbff] p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#12a879]" />

            <span className="text-xs font-semibold text-[#163b67]">
              System Online
            </span>
          </div>

          <div className="mt-2 text-[10px] text-[#71839a]">
            Local demonstration environment
          </div>
        </div>
      </div>
    </aside>
  );
}
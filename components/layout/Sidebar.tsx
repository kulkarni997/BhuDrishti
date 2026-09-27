export default function Topbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-[#1d2a34] bg-[#080d12]/95 px-8 backdrop-blur">
      <div>
        <div className="text-sm font-medium text-[#d7e1e5]">
          Satellite Imagery Analyst
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#52616c]">
          Multi-temporal geospatial analysis
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#66d9c4]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#66d9c4]" />
          System Online
        </div>

        <div className="h-6 w-px bg-[#1d2a34]" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[#d7e1e5]">Analyst</div>
            <div className="text-[10px] text-[#52616c]">Local Session</div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#263640] bg-[#0d141b] text-xs text-[#66d9c4]">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
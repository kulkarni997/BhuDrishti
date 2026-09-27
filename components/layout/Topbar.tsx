export default function Topbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-[#dce6f0] bg-white px-8">
      <div>
        <div className="text-sm font-semibold text-[#16324f]">
          Satellite Imagery Analyst
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#71869b]">
          Multi-temporal geospatial analysis
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#18a67a]">
          <span className="h-2 w-2 rounded-full bg-[#18a67a]" />
          System Online
        </div>

        <div className="h-7 w-px bg-[#dce6f0]" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-medium text-[#16324f]">
              Analyst
            </div>

            <div className="text-[10px] text-[#71869b]">
              Local Session
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf3ff] text-sm font-semibold text-[#1976d2]">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
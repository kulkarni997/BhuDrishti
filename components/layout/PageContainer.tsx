import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <main className="ml-64 min-h-screen pt-20">
      <div className="mx-auto w-full max-w-[1600px] px-8 py-8">
        {children}
      </div>
    </main>
  );
}